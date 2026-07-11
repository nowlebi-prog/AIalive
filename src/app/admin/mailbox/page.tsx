import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/shared/Card";
import { MAILBOX_STATUS_LABELS, MAILBOX_STATUS_COLORS } from "@/lib/mailbox-data";
import type { CloverMailbox } from "@/types/database";

export default async function AdminMailboxPage() {
  const supabase = await createClient();
  const { data: entries } = await supabase
    .from("clover_mailbox")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <h1 className="text-[20px] font-bold text-text-dark mb-1">우체통 관리</h1>
      <p className="text-[13px] text-text-gray mb-6">
        총 {entries?.length ?? 0}건의 고민이 접수됐어요.
      </p>

      <Card className="overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border-soft text-text-gray text-left">
              <th className="px-5 py-3 font-medium">막막한 일</th>
              <th className="px-5 py-3 font-medium">업종</th>
              <th className="px-5 py-3 font-medium">작성일</th>
              <th className="px-5 py-3 font-medium">상태</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {(entries as CloverMailbox[] | null)?.map((e) => (
              <tr key={e.id} className="border-b border-border-soft last:border-0">
                <td className="px-5 py-3 text-text-dark font-medium max-w-xs truncate">
                  {e.pain_title}
                </td>
                <td className="px-5 py-3 text-text-gray">{e.industry}</td>
                <td className="px-5 py-3 text-text-gray">
                  {new Date(e.created_at).toISOString().slice(0, 10)}
                </td>
                <td className="px-5 py-3">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${MAILBOX_STATUS_COLORS[e.status]}`}>
                    {MAILBOX_STATUS_LABELS[e.status]}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <Link href={`/admin/mailbox/${e.id}`} className="text-primary-deep font-medium">
                    자세히 보기
                  </Link>
                </td>
              </tr>
            ))}
            {(!entries || entries.length === 0) && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-text-gray">
                  아직 접수된 고민이 없어요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
