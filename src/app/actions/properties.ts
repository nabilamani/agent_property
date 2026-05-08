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
  featuredOnly?: boolean;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("properties")
    .select("*, property_images(*)")
    .order("created_at", { ascending: false });

  if (options?.featuredOnly) {
    query = query.eq("is_featured", true).limit(3);
  }

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

  // Validation
  const errors: Record<string, string> = {};
  const title = formData.get("title") as string;
  const priceStr = formData.get("price") as string;
  const address = formData.get("address") as string;
  const price = parseInt(priceStr) || 0;

  if (!title || title.length < 5) errors.title = "Judul terlalu pendek (min 5 karakter)";
  if (!price || price <= 0) errors.price = "Harga harus lebih besar dari 0";
  if (!address || address.length < 10) errors.address = "Alamat harus lengkap (min 10 karakter)";

  if (Object.keys(errors).length > 0) {
    return { fieldErrors: errors };
  }

  const propertyData = {
    title,
    price,
    address,
    map_url: extractMapUrl(formData.get("map_url") as string),
    type: formData.get("type") as PropertyType,
    land_area: parseInt(formData.get("land_area") as string) || 0,
    building_area: parseInt(formData.get("building_area") as string) || 0,
    condition: (formData.get("condition") as PropertyCondition) || "Baru",
    description: formData.get("description") as string,
    agent_whatsapp: formData.get("agent_whatsapp") as string,
    owner_whatsapp: (formData.get("owner_whatsapp") as string) || null,
    is_active: formData.get("is_active") === "true",
    is_sold: formData.get("is_sold") === "true",
    views_count: 0,
    whatsapp_clicks_count: 0,
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

  // Validation
  const errors: Record<string, string> = {};
  const title = formData.get("title") as string;
  const priceStr = formData.get("price") as string;
  const address = formData.get("address") as string;
  const price = parseInt(priceStr) || 0;

  if (!title || title.length < 5) errors.title = "Judul terlalu pendek (min 5 karakter)";
  if (!price || price <= 0) errors.price = "Harga harus lebih besar dari 0";
  if (!address || address.length < 10) errors.address = "Alamat harus lengkap (min 10 karakter)";

  if (Object.keys(errors).length > 0) {
    return { fieldErrors: errors };
  }

  const propertyData = {
    title,
    price,
    address,
    map_url: extractMapUrl(formData.get("map_url") as string),
    type: formData.get("type") as PropertyType,
    land_area: parseInt(formData.get("land_area") as string) || 0,
    building_area: parseInt(formData.get("building_area") as string) || 0,
    condition: (formData.get("condition") as PropertyCondition) || "Baru",
    description: formData.get("description") as string,
    agent_whatsapp: formData.get("agent_whatsapp") as string,
    owner_whatsapp: (formData.get("owner_whatsapp") as string) || null,
    is_active: formData.get("is_active") === "true",
    is_sold: formData.get("is_sold") === "true",
  };

  console.log("Updating property with data:", { id, ...propertyData, description: "..." });

  const { error } = await supabase
    .from("properties")
    .update(propertyData)
    .eq("id", id);

  if (!error) {
    // Handle image ordering if provided
    const imageOrder = formData.get("image_order") as string;
    if (imageOrder) {
      const orderedIds = JSON.parse(imageOrder);
      // Update each image position sequentially
      // Note: In production, consider a bulk update or a more efficient way
      for (let i = 0; i < orderedIds.length; i++) {
        await supabase
          .from("property_images")
          .update({ position: i })
          .eq("id", orderedIds[i]);
      }
    }
  }

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

  let startPosition = existingImages && existingImages.length > 0
    ? existingImages[0].position + 1
    : 0;

  // Prepare upload promises
  const uploadPromises = files.map(async (file, index) => {
    if (file.size === 0) return null;

    const fileExt = file.name.split(".").pop();
    const currentPosition = startPosition + index;
    const fileName = `${propertyId}/${Date.now()}-${currentPosition}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("property-images")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("property-images")
      .getPublicUrl(fileName);

    return {
      property_id: propertyId,
      image_url: urlData.publicUrl,
      position: currentPosition,
    };
  });

  // Execute all uploads in parallel
  const results = await Promise.all(uploadPromises);
  const validResults = results.filter(res => res !== null);

  // Bulk insert into database
  if (validResults.length > 0) {
    const { error: insertError } = await supabase
      .from("property_images")
      .insert(validResults);
    
    if (insertError) {
      console.error("Error bulk inserting property images:", insertError);
    }
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

// ============================================
// TRACKING: Increment views or clicks
// ============================================
export async function incrementView(id: string) {
  const supabase = await createClient();
  
  // Call the database function (RPC) to handle atomic increment
  await supabase.rpc('increment_property_views', { property_id: id });
}

export async function incrementWhatsAppClick(id: string) {
  const supabase = await createClient();
  
  await supabase.rpc('increment_property_whatsapp_clicks', { property_id: id });
}

// ============================================
// FEATURED: Toggle featured status
// ============================================
export async function toggleFeaturedProperty(id: string, isFeatured: boolean) {
  const supabase = await createClient();

  // If we are featuring, check if already 3 featured
  if (isFeatured) {
    const { count } = await supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("is_featured", true);
    
    if (count && count >= 3) {
      return { error: "Maksimal 3 properti pilihan yang dapat ditampilkan di beranda." };
    }
  }

  const { error } = await supabase
    .from("properties")
    .update({ is_featured: isFeatured })
    .eq("id", id);

  if (error) {
    console.error("Error toggling featured status:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/properties");
  revalidatePath("/");
  return { success: true };
}
