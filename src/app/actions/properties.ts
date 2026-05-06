"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { PropertyType, PropertyCondition } from "@/lib/supabase/types";

// ============================================
// GET: List all properties (with images)
// ============================================
export async function getProperties(options?: {
  type?: string;
  activeOnly?: boolean;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("properties")
    .select("*, property_images(*)")
    .order("created_at", { ascending: false });

  if (options?.activeOnly !== false) {
    query = query.eq("is_active", true);
  }

  if (options?.type) {
    query = query.eq("type", options.type);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching properties:", error);
    return [];
  }

  return data ?? [];
}

// ============================================
// GET: Single property by ID (with images)
// ============================================
export async function getPropertyById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*, property_images(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching property:", error);
    return null;
  }

  return data;
}

// Helper to extract src from iframe if necessary
function extractMapUrl(input: string | null): string | null {
  if (!input) return null;
  // If it's an iframe tag, extract the src
  if (input.includes("<iframe")) {
    const match = input.match(/src="([^"]+)"/);
    return match ? match[1] : input;
  }
  return input;
}

// ============================================
// CREATE: Add a new property
// ============================================
export async function createProperty(formData: FormData) {
  const supabase = await createClient();

  const propertyData = {
    title: formData.get("title") as string,
    price: parseInt(formData.get("price") as string) || 0,
    address: formData.get("address") as string,
    map_url: extractMapUrl(formData.get("map_url") as string),
    type: formData.get("type") as PropertyType,
    land_area: parseInt(formData.get("land_area") as string) || 0,
    building_area: parseInt(formData.get("building_area") as string) || 0,
    condition: (formData.get("condition") as PropertyCondition) || "Baru",
    description: formData.get("description") as string,
    agent_whatsapp: formData.get("agent_whatsapp") as string,
    owner_whatsapp: (formData.get("owner_whatsapp") as string) || null,
    is_active: formData.get("is_active") === "true",
  };

  console.log("Creating property with data:", { ...propertyData, description: "..." });

  const { data, error } = await supabase
    .from("properties")
    .insert(propertyData)
    .select()
    .single();

  if (error) {
    console.error("Error creating property in DB:", error);
    return { error: error.message };
  }

  // Handle image uploads
  const images = formData.getAll("images") as File[];
  if (images.length > 0 && data) {
    await uploadPropertyImages(data.id, images);
  }

  revalidatePath("/admin/properties");
  revalidatePath("/properties");
  revalidatePath("/");

  return { data };
}

// ============================================
// UPDATE: Edit existing property
// ============================================
export async function updateProperty(id: string, formData: FormData) {
  const supabase = await createClient();

  const propertyData = {
    title: formData.get("title") as string,
    price: parseInt(formData.get("price") as string) || 0,
    address: formData.get("address") as string,
    map_url: extractMapUrl(formData.get("map_url") as string),
    type: formData.get("type") as PropertyType,
    land_area: parseInt(formData.get("land_area") as string) || 0,
    building_area: parseInt(formData.get("building_area") as string) || 0,
    condition: (formData.get("condition") as PropertyCondition) || "Baru",
    description: formData.get("description") as string,
    agent_whatsapp: formData.get("agent_whatsapp") as string,
    owner_whatsapp: (formData.get("owner_whatsapp") as string) || null,
    is_active: formData.get("is_active") === "true",
  };

  console.log("Updating property with data:", { id, ...propertyData, description: "..." });

  const { error } = await supabase
    .from("properties")
    .update(propertyData)
    .eq("id", id);

  if (error) {
    console.error("Error updating property in DB:", error);
    return { error: error.message };
  }

  // Handle new image uploads
  const images = formData.getAll("images") as File[];
  if (images.length > 0 && images[0].size > 0) {
    await uploadPropertyImages(id, images);
  }

  revalidatePath("/admin/properties");
  revalidatePath(`/properties/${id}`);
  revalidatePath("/properties");
  revalidatePath("/");

  return { success: true };
}

// ============================================
// DELETE: Remove property
// ============================================
export async function deleteProperty(id: string) {
  const supabase = await createClient();

  // Delete images from storage first
  const { data: images } = await supabase
    .from("property_images")
    .select("image_url")
    .eq("property_id", id);

  if (images && images.length > 0) {
    const filePaths = images
      .map((img) => {
        const url = new URL(img.image_url);
        const pathParts = url.pathname.split("/storage/v1/object/public/property-images/");
        return pathParts[1] || null;
      })
      .filter(Boolean) as string[];

    if (filePaths.length > 0) {
      await supabase.storage.from("property-images").remove(filePaths);
    }
  }

  // Delete property (cascade will delete property_images rows)
  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting property:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/properties");
  revalidatePath("/properties");
  revalidatePath("/");

  return { success: true };
}

// ============================================
// UPLOAD: Property images to Supabase Storage
// ============================================
async function uploadPropertyImages(propertyId: string, files: File[]) {
  const supabase = await createClient();

  // Get current max position
  const { data: existingImages } = await supabase
    .from("property_images")
    .select("position")
    .eq("property_id", propertyId)
    .order("position", { ascending: false })
    .limit(1);

  let position = existingImages && existingImages.length > 0
    ? existingImages[0].position + 1
    : 0;

  for (const file of files) {
    if (file.size === 0) continue;

    const fileExt = file.name.split(".").pop();
    const fileName = `${propertyId}/${Date.now()}-${position}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("property-images")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      continue;
    }

    const { data: urlData } = supabase.storage
      .from("property-images")
      .getPublicUrl(fileName);

    await supabase.from("property_images").insert({
      property_id: propertyId,
      image_url: urlData.publicUrl,
      position,
    });

    position++;
  }
}

// ============================================
// DELETE: Single image
// ============================================
export async function deletePropertyImage(imageId: string, imageUrl: string) {
  const supabase = await createClient();

  // Remove from storage
  try {
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split("/storage/v1/object/public/property-images/");
    const filePath = pathParts[1];
    if (filePath) {
      await supabase.storage.from("property-images").remove([filePath]);
    }
  } catch (e) {
    console.error("Error parsing image URL for deletion:", e);
  }

  // Remove from database
  const { error } = await supabase
    .from("property_images")
    .delete()
    .eq("id", imageId);

  if (error) {
    console.error("Error deleting property image:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/properties");
  return { success: true };
}
