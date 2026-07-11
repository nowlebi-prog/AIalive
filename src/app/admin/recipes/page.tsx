import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Plus } from "lucide-react";
import { DeleteRecipeButton } from "./DeleteRecipeButton";
import { PublicToggle } from "./PublicToggle";
import type { Recipe } from "@/types/database";

export default async function AdminRecipesPage() {
  const supabase = await createClient();
  const { data: recipes } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-bold text-text-dark">레시피 관리</h1>
          <p className="text-[13px] text-text-gray mt-1">
            총 {recipes?.length ?? 0}개의 레시피가 있어요.
          </p>
        </div>
        <Button href="/admin/recipes/new" icon={<Plus size={16} />}>
          새 레시피 작성
        </Button>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border-soft text-text-gray text-left">
              <th className="px-5 py-3 font-medium">제목</th>
              <th className="px-5 py-3 font-medium">대상</th>
              <th className="px-5 py-3 font-medium">난이도</th>
              <th className="px-5 py-3 font-medium">저장/하트</th>
              <th className="px-5 py-3 font-medium">공개</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {(recipes as Recipe[] | null)?.map((r) => (
              <tr key={r.id} className="border-b border-border-soft last:border-0">
                <td className="px-5 py-3">
                  <Link href={`/admin/recipes/${r.id}/edit`} className="font-medium text-text-dark hover:text-primary-deep">
                    {r.title}
                  </Link>
                </td>
                <td className="px-5 py-3 text-text-gray">{(r.target_users ?? []).join(", ") || "-"}</td>
                <td className="px-5 py-3 text-text-gray">{r.difficulty ?? "-"}</td>
                <td className="px-5 py-3 text-text-gray">
                  {r.save_count} / {r.heart_count}
                </td>
                <td className="px-5 py-3">
                  <PublicToggle recipeId={r.id} isPublic={r.is_public} />
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/recipes/${r.id}/edit`} className="text-primary-deep font-medium">
                      수정
                    </Link>
                    <DeleteRecipeButton recipeId={r.id} title={r.title} />
                  </div>
                </td>
              </tr>
            ))}
            {(!recipes || recipes.length === 0) && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-text-gray">
                  아직 작성된 레시피가 없어요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
