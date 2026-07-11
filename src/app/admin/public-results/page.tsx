import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { DeleteResultButton } from "./DeleteResultButton";
import { Plus } from "lucide-react";
import type { PublicResult } from "@/types/database";

export default async function AdminPublicResultsPage() {
  const supabase = await createClient();
  const { data: results } = await supabase
    .from("public_results")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-bold text-text-dark">공개 결과 관리</h1>
          <p className="text-[13px] text-text-gray mt-1">
            우체통에서 시작된 이야기를 공개 카드로 보여줘요.
          </p>
        </div>
        <Button href="/admin/public-results/new" icon={<Plus size={16} />}>
          새 결과 카드
        </Button>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border-soft text-text-gray text-left">
              <th className="px-5 py-3 font-medium">제목</th>
              <th className="px-5 py-3 font-medium">하트</th>
              <th className="px-5 py-3 font-medium">공개 여부</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {(results as PublicResult[] | null)?.map((r) => (
              <tr key={r.id} className="border-b border-border-soft last:border-0">
                <td className="px-5 py-3">
                  <Link href={`/admin/public-results/${r.id}/edit`} className="font-medium text-text-dark hover:text-primary-deep">
                    {r.title}
                  </Link>
                </td>
                <td className="px-5 py-3 text-text-gray">{r.heart_count}</td>
                <td className="px-5 py-3">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${r.is_public ? "bg-soft-green text-primary-deep" : "bg-pale-green text-text-gray"}`}>
                    {r.is_public ? "공개" : "비공개"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/public-results/${r.id}/edit`} className="text-primary-deep font-medium">
                      수정
                    </Link>
                    <DeleteResultButton id={r.id} title={r.title} />
                  </div>
                </td>
              </tr>
            ))}
            {(!results || results.length === 0) && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-text-gray">
                  아직 공개 결과 카드가 없어요. 우체통 관리에서 전환할 수 있어요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
