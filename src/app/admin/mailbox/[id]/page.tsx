import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/shared/Card";
import { MailboxDetailForm } from "./MailboxDetailForm";
import type { CloverMailbox } from "@/types/database";
import { ChevronLeft } from "lucide-react";

export default async function AdminMailboxDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: entry } = await supabase
    .from("clover_mailbox")
    .select("*, profiles(nickname, email, clover_number)")
    .eq("id", id)
    .single();

  if (!entry) notFound();

  const author = (entry as unknown as { profiles?: { nickname: string; email: string; clover_number: number } }).profiles;

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <Link href="/admin/mailbox" className="inline-flex items-center gap-1 text-[12.5px] text-text-gray hover:text-primary-deep mb-4">
        <ChevronLeft size={14} /> 목록으로
      </Link>

      <h1 className="text-[20px] font-bold text-text-dark mb-1">{entry.pain_title}</h1>
      <p className="text-[12.5px] text-text-gray mb-6">
        {author?.nickname ?? "알 수 없음"}
        {author?.clover_number ? ` · 첫 클로버 ${String(author.clover_number).padStart(3, "0")}` : ""}
        {" · "}
        {new Date(entry.created_at).toISOString().slice(0, 10)}
      </p>

      <Card className="p-6 flex flex-col gap-4 mb-6">
        <DetailRow label="업종" value={entry.industry} />
        <DetailRow label="가장 막막한 일" value={entry.pain_title} />
        <DetailRow label="원하는 결과" value={entry.desired_outcome} />
        <DetailRow label="현재 상황" value={entry.current_situation} />
        {entry.free_text && <DetailRow label="자유 입력" value={entry.free_text} />}
        {entry.requested_industry && <DetailRow label="요청 업종" value={entry.requested_industry} />}
        <DetailRow
          label="공개 활용 동의"
          value={entry.allow_anonymous_use ? "동의함" : "동의하지 않음"}
        />
      </Card>

      <MailboxDetailForm entry={entry as CloverMailbox} />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-[11.5px] font-semibold text-text-gray mb-1">{label}</p>
      <p className="text-[13.5px] text-text-dark whitespace-pre-wrap">{value || "-"}</p>
    </div>
  );
}
