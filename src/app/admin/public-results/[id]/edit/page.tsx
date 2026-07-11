import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PublicResultForm } from "../../PublicResultForm";
import type { PublicResult, Recipe } from "@/types/database";

export default async function EditPublicResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: result } = await supabase.from("public_results").select("*").eq("id", id).single();
  if (!result) notFound();

  const { data: recipes } = await supabase.from("recipes").select("*").order("title");

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto">
      <h1 className="text-[20px] font-bold text-text-dark mb-6">공개 결과 카드 수정</h1>
      <PublicResultForm mode="edit" result={result as PublicResult} recipes={(recipes as Recipe[]) ?? []} />
    </div>
  );
}
