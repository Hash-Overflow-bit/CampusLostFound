import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const legacy = JSON.parse(fs.readFileSync('./items.json', 'utf8'));
const ready = JSON.parse(fs.readFileSync('./items-ready.json', 'utf8'));
const storageConfig = JSON.parse(fs.readFileSync('./supabase-storage.json', 'utf8'));

if (!storageConfig.url || !storageConfig.serviceRoleKey) {
  throw new Error('supabase-storage.json must contain url and serviceRoleKey');
}

const supabase = createClient(storageConfig.url, storageConfig.serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function firestoreId(row) {
  return row?.id ?? row?._id ?? row?.docId ?? row?.documentId ?? row?.__name__ ?? null;
}

function getDataUrl(item) {
  for (const value of [item?.image, item?.imageUrl]) {
    if (typeof value === 'string' && value.startsWith('data:image/')) return value;
  }
  return null;
}

function extensionFor(mime) {
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  if (mime === 'image/gif') return 'gif';
  return 'jpg';
}

const legacyWithImages = legacy.filter(getDataUrl);
const readyByLegacyId = new Map(
  ready.filter((r) => r?.legacy_id).map((r) => [String(r.legacy_id), r]),
);

console.log('Legacy records:', legacy.length);
console.log('Legacy records with data images:', legacyWithImages.length);
console.log('Ready records:', ready.length);
console.log('Ready records with legacy_id:', readyByLegacyId.size);

let uploaded = 0;
let invalid = 0;
let failed = 0;
let unmatched = 0;

for (const old of legacyWithImages) {
  const oldId = firestoreId(old);
  let migrated = oldId ? readyByLegacyId.get(String(oldId)) : null;

  // Some Firestore JSON exporters do not retain the document ID. In that case,
  // safely fall back to the unique legacy owner/title/date tuple used by this dataset.
  if (!migrated) {
    const candidates = ready.filter((r) => {
      const source = r?.legacy ?? r?.source ?? {};
      const item = r?.item ?? {};
      const ownerMatches = !old.userId || source.userId === old.userId || r.firebase_uid === old.userId;
      const titleMatches = item.title === old.title;
      return ownerMatches && titleMatches;
    });
    if (candidates.length === 1) migrated = candidates[0];
  }

  if (!migrated?.item?.id || !migrated?.item?.owner_id) {
    console.log('Unmatched image record:', oldId ?? old.title ?? '(unknown)');
    unmatched++;
    continue;
  }

  const dataUrl = getDataUrl(old);
  const match = dataUrl.match(/^data:(image\/[^;]+);base64,(.+)$/s);
  if (!match) {
    console.log('Skipping invalid image:', oldId ?? old.title ?? '(unknown)');
    invalid++;
    continue;
  }

  const mime = match[1];
  const buffer = Buffer.from(match[2], 'base64');
  const item = migrated.item;
  const path = `${item.owner_id}/${item.id}/legacy-0.${extensionFor(mime)}`;

  const { data: existing, error: existingError } = await supabase
    .from('item_images')
    .select('id, storage_path')
    .eq('item_id', item.id)
    .eq('position', 0)
    .maybeSingle();

  if (existingError) {
    console.error('Existing-row check failed:', oldId ?? old.title, existingError.message);
    failed++;
    continue;
  }

  if (existing) {
    console.log('Already migrated:', oldId ?? old.title);
    continue;
  }

  const { error: uploadError } = await supabase.storage
    .from('item-images')
    .upload(path, buffer, { contentType: mime, upsert: false });

  if (uploadError) {
    console.error('Upload failed:', oldId ?? old.title, uploadError.message);
    failed++;
    continue;
  }

  const { error: dbError } = await supabase.from('item_images').insert({
    item_id: item.id,
    owner_id: item.owner_id,
    storage_path: path,
    position: 0,
  });

  if (dbError) {
    console.error('DB row failed:', oldId ?? old.title, dbError.message);
    await supabase.storage.from('item-images').remove([path]);
    failed++;
    continue;
  }

  uploaded++;
  console.log('Migrated image:', oldId ?? old.title);
}

console.log('\nImages migrated:', uploaded);
console.log('Unmatched image records:', unmatched);
console.log('Invalid images skipped:', invalid);
console.log('Failed:', failed);

if (legacyWithImages.length > 0 && uploaded === 0 && unmatched === legacyWithImages.length) {
  console.error('\nNo images were matched. Do not delete Firebase data.');
  process.exitCode = 2;
}
