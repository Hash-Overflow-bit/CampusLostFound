import { getSupabaseClient } from "../../../lib/supabase/client";

const BUCKET = "item-images";

function requireClient() {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase is not configured.");
  return client;
}

export async function uploadItemImage({ userId, itemId, file, index = 0 }) {
  const supabase = requireClient();
  const extension = file.name?.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/${itemId}/${crypto.randomUUID()}-${index}.${extension}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "image/jpeg",
  });
  if (error) throw error;
  return path;
}

export async function createItemImageUrl(storagePath, expiresIn = 900) {
  const supabase = requireClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}

export async function removeItemImage(storagePath) {
  const supabase = requireClient();
  const { error } = await supabase.storage.from(BUCKET).remove([storagePath]);
  if (error) throw error;
}
