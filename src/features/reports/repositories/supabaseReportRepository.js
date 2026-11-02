import { getSupabaseClient } from "../../../lib/supabase/client";
import { uploadItemImage, removeItemImage } from "../services/supabaseImageService";

function requireClient() {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase is not configured.");
  return client;
}

export async function createReport({ item, privateDetails, image }) {
  const supabase = requireClient();
  const { data: created, error } = await supabase
    .from("items")
    .insert(item)
    .select()
    .single();
  if (error) throw error;

  if (privateDetails && Object.values(privateDetails).some(Boolean)) {
    const { error: privateError } = await supabase.from("item_private_details").insert({
      item_id: created.id,
      owner_id: created.owner_id,
      ...privateDetails,
    });
    if (privateError) throw privateError;
  }

  if (image) {
    let storagePath = null;
    try {
      storagePath = await uploadItemImage({
        userId: created.owner_id,
        itemId: created.id,
        file: image,
      });
      const { error: imageError } = await supabase.from("item_images").insert({
        item_id: created.id,
        owner_id: created.owner_id,
        storage_path: storagePath,
        position: 0,
      });
      if (imageError) throw imageError;
    } catch (imageError) {
      if (storagePath) await removeItemImage(storagePath).catch(() => {});
      throw imageError;
    }
  }

  return created;
}

export async function updateReport(itemId, patch) {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("items")
    .update(patch)
    .eq("id", itemId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
