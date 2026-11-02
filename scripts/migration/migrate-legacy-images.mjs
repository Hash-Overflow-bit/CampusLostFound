import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

// Run this script from the firebase-to-supabase/firestore directory after copying it there,
// or adjust these paths to point at your local migration exports.
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
  for (const value of [item.image, item.imageUrl]) {
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

let uploaded = 0;
let invalid = 0;
let failed = 0;

for (const migrated of ready) {
  const old = legacy.find((x) => x.id === migrated.legacy_id);
  if (!old) continue;

  const dataUrl = getDataUrl(old);
  if (!dataUrl) continue;

  const match = dataUrl.match(/^data:(image\/[^;]+);base64,(.+)$/s);
  if (!match) {
    console.log('Skipping invalid image:', migrated.legacy_id);
    invalid++;
    continue;
  }

  const mime = match[1];
  const buffer = Buffer.from(match[2], 'base64');
  const item = migrated.item;
  const path = `${item.owner_id}/${item.id}/legacy-0.${extensionFor(mime)}`;

  // Idempotent behavior: if the DB row already exists, do not upload again.
  const { data: existing, error: existingError } = await supabase
    .from('item_images')
    .select('id, storage_path')
    .eq('item_id', item.id)
    .eq('position', 0)
    .maybeSingle();

  if (existingError) {
    console.error('Existing-row check failed:', migrated.legacy_id, existingError.message);
    failed++;
    continue;
  }

  if (existing) {
    console.log('Already migrated:', migrated.legacy_id);
    continue;
  }

  const { error: uploadError } = await supabase.storage
    .from('item-images')
    .upload(path, buffer, { contentType: mime, upsert: false });

  if (uploadError) {
    console.error('Upload failed:', migrated.legacy_id, uploadError.message);
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
    console.error('DB row failed:', migrated.legacy_id, dbError.message);
    await supabase.storage.from('item-images').remove([path]);
    failed++;
    continue;
  }

  uploaded++;
  console.log('Migrated image:', migrated.legacy_id);
}

console.log('\nImages migrated:', uploaded);
console.log('Invalid images skipped:', invalid);
console.log('Failed:', failed);
