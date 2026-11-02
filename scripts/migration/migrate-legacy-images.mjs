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

function normalized(value) {
  return String(value ?? '').trim().toLowerCase();
}

const legacyWithImages = legacy.filter(getDataUrl);
console.log('Legacy records:', legacy.length);
console.log('Legacy records with data images:', legacyWithImages.length);
console.log('Ready records:', ready.length);

let uploaded = 0;
let alreadyMigrated = 0;
let invalid = 0;
let failed = 0;
let unmatched = 0;
let ambiguous = 0;

for (const old of legacyWithImages) {
  let candidates = ready.filter((r) => normalized(r?.item?.title) === normalized(old.title));

  if (old.category && candidates.length > 1) {
    candidates = candidates.filter((r) => normalized(r?.item?.category) === normalized(old.category));
  }
  if (old.location && candidates.length > 1) {
    candidates = candidates.filter((r) => normalized(r?.item?.public_location) === normalized(old.location));
  }
  if (old.description && candidates.length > 1) {
    candidates = candidates.filter((r) => normalized(r?.item?.description) === normalized(old.description));
  }

  if (candidates.length !== 1) {
    console.log(candidates.length > 1 ? 'Ambiguous image record:' : 'Unmatched image record:', old.title ?? '(unknown)');
    if (candidates.length > 1) ambiguous++;
    else unmatched++;
    continue;
  }

  const migrated = candidates[0];
  if (!migrated?.item?.id || !migrated?.item?.owner_id) {
    console.log('Unmatched image record:', old.title ?? '(unknown)');
    unmatched++;
    continue;
  }

  const dataUrl = getDataUrl(old);
  const match = dataUrl.match(/^data:(image\/[^;]+);base64,(.+)$/s);
  if (!match) {
    console.log('Skipping invalid image:', old.title ?? '(unknown)');
    invalid++;
    continue;
  }

  const mime = match[1];
  const buffer = Buffer.from(match[2], 'base64');
  const item = migrated.item;
  const path = `${item.owner_id}/${item.id}/legacy-0.${extensionFor(mime)}`;

  // Do not use maybeSingle here. Some PostgREST deployments return PGRST116
  // when zero rows match. A limited array query works for both 0 and 1+ rows.
  const { data: existingRows, error: existingError } = await supabase
    .from('item_images')
    .select('id, storage_path')
    .eq('item_id', item.id)
    .eq('position', 0)
    .limit(1);

  if (existingError) {
    console.error('Existing-row check failed:', old.title, existingError.message);
    failed++;
    continue;
  }

  if (existingRows?.length) {
    console.log('Already migrated:', old.title);
    alreadyMigrated++;
    continue;
  }

  const { error: uploadError } = await supabase.storage
    .from('item-images')
    .upload(path, buffer, { contentType: mime, upsert: false });

  if (uploadError) {
    console.error('Upload failed:', old.title, uploadError.message);
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
    console.error('DB row failed:', old.title, dbError.message);
    await supabase.storage.from('item-images').remove([path]);
    failed++;
    continue;
  }

  uploaded++;
  console.log('Migrated image:', old.title);
}

console.log('\nImages migrated:', uploaded);
console.log('Already migrated:', alreadyMigrated);
console.log('Unmatched image records:', unmatched);
console.log('Ambiguous image records:', ambiguous);
console.log('Invalid images skipped:', invalid);
console.log('Failed:', failed);

if (legacyWithImages.length > 0 && uploaded === 0 && alreadyMigrated === 0) {
  console.error('\nNo images were migrated. Do not delete Firebase data.');
  process.exitCode = 2;
}
