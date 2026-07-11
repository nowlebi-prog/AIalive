import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";
import { RecipeDetailClient } from "./RecipeDetailClient";
import type { Recipe, RecipeStep } from "@/types/database";

// Public, cacheable content: no cookies/session are read here, so this page
// can be statically generated and revalidated on an interval instead of
// hitting the database on every request (principle: light, cache-friendly
// public pages). Personalized save/heart state is fetched client-side instead.
export const revalidate = 300; // 5 minutes

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createPublicClient();

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

  // View counts are intentionally not tracked in the MVP (see project principles:
  // avoid a write on every read). Can be added later as a batched/async job.

  return (
    <RecipeDetailClient recipe={recipe as Recipe} steps={(steps as RecipeStep[]) ?? []} />
  );
}
