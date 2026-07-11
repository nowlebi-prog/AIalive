import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RecipeDetailClient } from "./RecipeDetailClient";
import type { Recipe, RecipeStep } from "@/types/database";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: recipe } = await supabase
    .from("recipes")
    .select("*")
    .eq("slug", slug)
    .eq("is_public", true)
    .single();

  if (!recipe) notFound();

  const { data: steps } = await supabase
    .from("recipe_steps")
    .select("*")
    .eq("recipe_id", recipe.id)
    .order("step_order", { ascending: true });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let saved = false;
  let hearted = false;

  if (user) {
    const { data: bookmark } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", user.id)
      .eq("recipe_id", recipe.id)
      .maybeSingle();
    saved = !!bookmark;

    const { data: heart } = await supabase
      .from("hearts")
      .select("id")
      .eq("user_id", user.id)
      .eq("target_type", "recipe")
      .eq("target_id", recipe.id)
      .maybeSingle();
    hearted = !!heart;
  }

  // Fire-and-forget view count increment (best-effort, not critical if it races).
  supabase
    .from("recipes")
    .update({ view_count: (recipe.view_count ?? 0) + 1 })
    .eq("id", recipe.id)
    .then(() => {});

  return (
    <RecipeDetailClient
      recipe={recipe as Recipe}
      steps={(steps as RecipeStep[]) ?? []}
      userId={user?.id ?? null}
      initialSaved={saved}
      initialHearted={hearted}
    />
  );
}
