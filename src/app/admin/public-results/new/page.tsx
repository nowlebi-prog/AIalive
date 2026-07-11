import { createClient } from "@/lib/supabase/server";
import { PublicResultForm } from "../PublicResultForm";
import type { Recipe } from "@/types/database";

export default async function NewPublicResultPage() {
  const supabase = await createClient();
  const { data: recipes } = await supabase.from("recipes").select("*").order("title");

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto">
      <h1 className="text-[20px] font-bold text-text-dark mb-6">새 공개 결과 카드</h1>
      <PublicResultForm mode="create" recipes={(recipes as Recipe[]) ?? []} />
    </div>
  );
}
