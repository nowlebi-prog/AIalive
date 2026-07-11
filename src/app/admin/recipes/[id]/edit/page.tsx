import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RecipeForm } from "../../RecipeForm";
import type { Recipe, RecipeStep } from "@/types/database";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: recipe } = await supabase.from("recipes").select("*").eq("id", id).single();
  if (!recipe) notFound();

  const { data: steps } = await supabase
    .from("recipe_steps")
    .select("*")
    .eq("recipe_id", id)
    .order("step_order", { ascending: true });

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <h1 className="text-[20px] font-bold text-text-dark mb-6">레시피 수정</h1>
      <RecipeForm mode="edit" recipe={recipe as Recipe} steps={(steps as RecipeStep[]) ?? []} />
    </div>
  );
}
