"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slugify";

export interface StepInput {
  title: string;
  description: string;
  checklist: string[];
  prompt_text: string;
  tip: string;
  screenshot_urls: string[];
}

export interface RecipeFormInput {
  title: string;
  slug: string;
  summary: string;
  target_users: string[];
  categories: string[];
  tools: string[];
  difficulty: string;
  estimated_time: string;
  estimated_cost: string;
  thumbnail_url: string;
  is_public: boolean;
  is_premium: boolean;
  steps: StepInput[];
}

export async function createRecipe(input: RecipeFormInput) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const slug = input.slug.trim() ? slugify(input.slug.trim()) : slugify(input.title);

  const { data: recipe, error } = await supabase
    .from("recipes")
    .insert({
      title: input.title,
      slug,
      summary: input.summary,
      target_users: input.target_users,
      categories: input.categories,
      tools: input.tools,
      difficulty: input.difficulty,
      estimated_time: input.estimated_time,
      estimated_cost: input.estimated_cost,
      thumbnail_url: input.thumbnail_url || null,
      is_public: input.is_public,
      is_premium: input.is_premium,
      created_by: admin.id,
    })
    .select()
    .single();

  if (error || !recipe) {
    if (error?.code === "23505") {
      throw new Error("이미 사용 중인 slug예요. 다른 값을 입력해주세요.");
    }
    throw new Error(error?.message ?? "레시피 생성에 실패했어요.");
  }

  if (input.steps.length > 0) {
    await supabase.from("recipe_steps").insert(
      input.steps.map((s, i) => ({
        recipe_id: recipe.id,
        step_order: i + 1,
        title: s.title,
        description: s.description || null,
        checklist: s.checklist.map((label) => ({ label })),
        prompt_text: s.prompt_text || null,
        tip: s.tip || null,
        screenshot_urls: s.screenshot_urls.length > 0 ? s.screenshot_urls : null,
      }))
    );
  }

  revalidatePath("/admin/recipes");
  revalidatePath("/clover-map");
  redirect(`/admin/recipes/${recipe.id}/edit`);
}

export async function updateRecipe(recipeId: string, input: RecipeFormInput) {
  await requireAdmin();
  const supabase = await createClient();

  const slug = input.slug.trim() ? slugify(input.slug.trim()) : undefined;

  const { error } = await supabase
    .from("recipes")
    .update({
      title: input.title,
      ...(slug ? { slug } : {}),
      summary: input.summary,
      target_users: input.target_users,
      categories: input.categories,
      tools: input.tools,
      difficulty: input.difficulty,
      estimated_time: input.estimated_time,
      estimated_cost: input.estimated_cost,
      thumbnail_url: input.thumbnail_url || null,
      is_public: input.is_public,
      is_premium: input.is_premium,
      updated_at: new Date().toISOString(),
    })
    .eq("id", recipeId);

  if (error) {
    if (error.code === "23505") {
      throw new Error("이미 사용 중인 slug예요. 다른 값을 입력해주세요.");
    }
    throw new Error(error.message);
  }

  // Replace all steps (simplest consistent approach for an MVP editor)
  await supabase.from("recipe_steps").delete().eq("recipe_id", recipeId);
  if (input.steps.length > 0) {
    await supabase.from("recipe_steps").insert(
      input.steps.map((s, i) => ({
        recipe_id: recipeId,
        step_order: i + 1,
        title: s.title,
        description: s.description || null,
        checklist: s.checklist.map((label) => ({ label })),
        prompt_text: s.prompt_text || null,
        tip: s.tip || null,
        screenshot_urls: s.screenshot_urls.length > 0 ? s.screenshot_urls : null,
      }))
    );
  }

  revalidatePath("/admin/recipes");
  revalidatePath(`/admin/recipes/${recipeId}/edit`);
  revalidatePath("/clover-map");
}

export async function deleteRecipe(recipeId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("recipes").delete().eq("id", recipeId);
  revalidatePath("/admin/recipes");
  revalidatePath("/clover-map");
}

export async function toggleRecipePublic(recipeId: string, isPublic: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("recipes").update({ is_public: isPublic }).eq("id", recipeId);
  revalidatePath("/admin/recipes");
  revalidatePath("/clover-map");
}
