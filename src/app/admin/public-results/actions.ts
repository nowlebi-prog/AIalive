"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export interface PublicResultInput {
  title: string;
  summary: string;
  image_url: string;
  related_recipe_id: string;
  is_public: boolean;
}

export async function createPublicResult(input: PublicResultInput) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("public_results").insert({
    title: input.title,
    summary: input.summary,
    image_url: input.image_url || null,
    related_recipe_id: input.related_recipe_id || null,
    is_public: input.is_public,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/public-results");
  redirect("/admin/public-results");
}

export async function updatePublicResult(id: string, input: PublicResultInput) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("public_results")
    .update({
      title: input.title,
      summary: input.summary,
      image_url: input.image_url || null,
      related_recipe_id: input.related_recipe_id || null,
      is_public: input.is_public,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/public-results");
  revalidatePath(`/admin/public-results/${id}/edit`);
}

export async function deletePublicResult(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("public_results").delete().eq("id", id);
  revalidatePath("/admin/public-results");
}
