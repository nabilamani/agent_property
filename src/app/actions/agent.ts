"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ============================================
// GET: Agent profile
// ============================================
export async function getAgent() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching agent:", error);
    return null;
  }

  return data;
}

// ============================================
// UPDATE: Agent profile
// ============================================
export async function updateAgent(formData: FormData) {
  const supabase = await createClient();

  // Get current agent
  const { data: currentAgent } = await supabase
    .from("agents")
    .select("id")
    .limit(1)
    .single();

  if (!currentAgent) {
    return { error: "Agent not found" };
  }

  const agentData: Record<string, string | null> = {
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    bio: (formData.get("bio") as string) || null,
    caption: (formData.get("caption") as string) || null,
  };

  // Handle photo upload
  const photo = formData.get("photo") as File;
  if (photo && photo.size > 0) {
    const fileExt = photo.name.split(".").pop();
    const fileName = `agent-photo-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("agent-assets")
      .upload(fileName, photo, { upsert: true });

    if (uploadError) {
      console.error("Error uploading photo:", uploadError);
    } else {
      const { data: urlData } = supabase.storage
        .from("agent-assets")
        .getPublicUrl(fileName);
      agentData.photo = urlData.publicUrl;
    }
  }

  // Handle logo upload
  const logo = formData.get("logo") as File;
  if (logo && logo.size > 0) {
    const fileExt = logo.name.split(".").pop();
    const fileName = `agent-logo-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("agent-assets")
      .upload(fileName, logo, { upsert: true });

    if (uploadError) {
      console.error("Error uploading logo:", uploadError);
    } else {
      const { data: urlData } = supabase.storage
        .from("agent-assets")
        .getPublicUrl(fileName);
      agentData.logo = urlData.publicUrl;
    }
  }

  const { error } = await supabase
    .from("agents")
    .update(agentData)
    .eq("id", currentAgent.id);

  if (error) {
    console.error("Error updating agent in DB:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/profile");
  revalidatePath("/");

  return { success: true };
}
