import { getSupabaseClient } from "../../../lib/supabase/client";
import {
  createItemImageUrl,
  uploadItemImage,
  removeItemImage,
} from "../services/supabaseImageService";

function requireClient() {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase is not configured.");
  return client;
}

const normalizeEditDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

export async function createReport({ item, privateDetails, image }) {
  const supabase = requireClient();
  let created = null;
  let uploadedPath = null;

  try {
    const { data, error } = await supabase
      .from("items")
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    created = data;

    if (privateDetails && Object.values(privateDetails).some(Boolean)) {
      const { error: privateError } = await supabase
        .from("item_private_details")
        .insert({
          item_id: created.id,
          owner_id: created.owner_id,
          ...privateDetails,
        });

      if (privateError) throw privateError;
    }

    if (image) {
      uploadedPath = await uploadItemImage({
        userId: created.owner_id,
        itemId: created.id,
        file: image,
      });

      const { error: imageError } = await supabase
        .from("item_images")
        .insert({
          item_id: created.id,
          owner_id: created.owner_id,
          storage_path: uploadedPath,
          position: 0,
        });

      if (imageError) throw imageError;
    }

    return created;
  } catch (error) {
    if (uploadedPath) {
      await removeItemImage(uploadedPath).catch(() => {});
    }

    if (created?.id) {
      try {
        await supabase
          .from("items")
          .delete()
          .eq("id", created.id)
          .eq("owner_id", created.owner_id);
      } catch {
        // Best-effort cleanup. Original error is more useful to the caller.
      }
    }

    throw error;
  }
}

export async function getOwnedReportForEdit(itemId, ownerId) {
  const supabase = requireClient();

  const { data: item, error: itemError } = await supabase
    .from("items")
    .select("id, owner_id, campus_id, kind, status, title, category, brand, color, description, public_location, occurred_at, created_at")
    .eq("id", itemId)
    .eq("owner_id", ownerId)
    .single();

  if (itemError) throw itemError;

  const [{ data: privateDetails, error: privateError }, { data: images, error: imagesError }] = await Promise.all([
    supabase
      .from("item_private_details")
      .select("exact_location, identifying_details, contact_email, contact_phone")
      .eq("item_id", itemId)
      .eq("owner_id", ownerId)
      .maybeSingle(),
    supabase
      .from("item_images")
      .select("id, storage_path, position")
      .eq("item_id", itemId)
      .eq("owner_id", ownerId)
      .order("position", { ascending: true }),
  ]);

  if (privateError) throw privateError;
  if (imagesError) throw imagesError;

  const firstImage = images?.[0] || null;
  const existingImageUrl = firstImage?.storage_path
    ? await createItemImageUrl(firstImage.storage_path).catch(() => null)
    : null;

  return {
    id: item.id,
    owner_id: item.owner_id,
    campus_id: item.campus_id,
    status: item.status,
    role: item.kind,
    title: item.title || "",
    category: item.category || "",
    brand: item.brand || "",
    color: item.color || "",
    description: item.description || "",
    location: item.public_location || "",
    date: normalizeEditDate(item.occurred_at),
    email: privateDetails?.contact_email || "",
    phone: privateDetails?.contact_phone || "",
    privateExactLocation: privateDetails?.exact_location || null,
    privateIdentifyingDetails: privateDetails?.identifying_details || null,
    image: null,
    existingImageUrl,
    existingImagePath: firstImage?.storage_path || null,
  };
}

export async function updateReport({
  itemId,
  ownerId,
  itemPatch,
  privateDetails,
  image,
}) {
  const supabase = requireClient();
  const original = await getOwnedReportForEdit(itemId, ownerId);

  const originalItemPatch = {
    kind: original.role,
    title: original.title,
    category: original.category,
    brand: original.brand || null,
    color: original.color || null,
    description: original.description || null,
    public_location: original.location || null,
    occurred_at: original.date ? new Date(original.date).toISOString() : null,
  };

  const originalPrivate = {
    item_id: itemId,
    owner_id: ownerId,
    exact_location: original.privateExactLocation,
    identifying_details: original.privateIdentifyingDetails,
    contact_email: original.email || null,
    contact_phone: original.phone || null,
  };

  let newPath = null;

  try {
    const { error: itemError } = await supabase
      .from("items")
      .update(itemPatch)
      .eq("id", itemId)
      .eq("owner_id", ownerId);

    if (itemError) throw itemError;

    if (privateDetails) {
      const { error: privateError } = await supabase
        .from("item_private_details")
        .upsert({
          item_id: itemId,
          owner_id: ownerId,
          ...privateDetails,
        }, {
          onConflict: "item_id",
        });

      if (privateError) throw privateError;
    }

    if (image) {
      const { data: oldImages, error: oldImagesError } = await supabase
        .from("item_images")
        .select("id, storage_path")
        .eq("item_id", itemId)
        .eq("owner_id", ownerId);

      if (oldImagesError) throw oldImagesError;

      newPath = await uploadItemImage({
        userId: ownerId,
        itemId,
        file: image,
      });

      const { error: insertImageError } = await supabase
        .from("item_images")
        .insert({
          item_id: itemId,
          owner_id: ownerId,
          storage_path: newPath,
          position: 0,
        });

      if (insertImageError) throw insertImageError;

      const oldIds = (oldImages || []).map((entry) => entry.id);
      if (oldIds.length) {
        const { error: deleteOldRowsError } = await supabase
          .from("item_images")
          .delete()
          .in("id", oldIds)
          .eq("owner_id", ownerId);

        if (deleteOldRowsError) throw deleteOldRowsError;
      }

      await Promise.allSettled(
        (oldImages || [])
          .map((entry) => entry.storage_path)
          .filter(Boolean)
          .map((storagePath) => removeItemImage(storagePath))
      );
    }

    return getOwnedReportForEdit(itemId, ownerId);
  } catch (error) {
    if (newPath) {
      try {
        await supabase
          .from("item_images")
          .delete()
          .eq("storage_path", newPath)
          .eq("owner_id", ownerId);
      } catch {
        // Best-effort metadata cleanup.
      }
      await removeItemImage(newPath).catch(() => {});
    }

    try {
      await supabase
        .from("items")
        .update(originalItemPatch)
        .eq("id", itemId)
        .eq("owner_id", ownerId);

      await supabase
        .from("item_private_details")
        .upsert(originalPrivate, { onConflict: "item_id" });
    } catch {
      // Preserve the original failure; rollback cleanup is best effort.
    }

    throw error;
  }
}

export async function deleteOwnedReport(itemId, ownerId) {
  const supabase = requireClient();

  const { data: images, error: imagesError } = await supabase
    .from("item_images")
    .select("storage_path")
    .eq("item_id", itemId)
    .eq("owner_id", ownerId);

  if (imagesError) throw imagesError;

  const { error: deleteError } = await supabase
    .from("items")
    .delete()
    .eq("id", itemId)
    .eq("owner_id", ownerId);

  if (deleteError) throw deleteError;

  const cleanup = await Promise.allSettled(
    (images || [])
      .map((entry) => entry.storage_path)
      .filter(Boolean)
      .map((storagePath) => removeItemImage(storagePath))
  );

  return {
    deleted: true,
    storageCleanupFailed: cleanup.some((result) => result.status === "rejected"),
  };
}
