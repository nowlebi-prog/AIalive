import { AuthGate } from "@/components/shared/AuthGate";
import { createClient } from "@/lib/supabase/server";
import { MailboxForm } from "./MailboxForm";
import { Card } from "@/components/shared/Card";
import { HeartButton } from "@/components/shared/HeartButton";
import { CloverMascot } from "@/components/icons/CloverMascot";
import { MAILBOX_STATUS_LABELS, MAILBOX_STATUS_COLORS } from "@/lib/mailbox-data";
import type { CloverMailbox, PublicResult } from "@/types/database";
import Link from "next/link";

export default function MailboxPage() {
  return (
    <AuthGate next="/mailbox" context="mailbox">
      {(profile) => <MailboxPageContent userId={profile.id} />}
    </AuthGate>
  );
}

async function MailboxPageContent({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data: myEntries } = await supabase
    .from("clover_mailbox")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const { data: publicResults } = await supabase
    .from("public_results")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(6);

  const { data: hearts } = await supabase
    .from("hearts")
    .select("target_id")
    .eq("user_id", userId)
    .eq("target_type", "public_result");
  const heartedIds = new Set((hearts ?? []).map((h: { target_id: string }) => h.target_id));

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <p className="text-[12px] text-text-gray mb-1">{new Date().toISOString().slice(0, 10)}</p>
      <h1 className="text-[22px] font-bold text-text-dark mb-6">클로버 우체통 📮</h1>

      <MailboxForm userId={userId} />

      {/* My submissions */}
      <section className="mt-10">
        <h2 className="text-[15px] font-bold text-text-dark mb-4">내가 남긴 고민</h2>
        {!myEntries || myEntries.length === 0 ? (
          <Card className="p-6 text-center text-[13px] text-text-gray">
            아직 남긴 고민이 없어요. 위 양식으로 첫 고민을 남겨보세요.
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {(myEntries as CloverMailbox[]).map((entry) => (
              <Card key={entry.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[13.5px] text-text-dark">{entry.pain_title}</p>
                    <p className="text-[12px] text-text-gray mt-1">
                      {entry.industry} · {new Date(entry.created_at).toISOString().slice(0, 10)}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${MAILBOX_STATUS_COLORS[entry.status]}`}
                  >
                    {MAILBOX_STATUS_LABELS[entry.status]}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Public results */}
      <section className="mt-10">
        <h2 className="text-[15px] font-bold text-text-dark mb-1">우체통에서 시작된 이야기</h2>
        <p className="text-[12.5px] text-text-gray mb-4">
          누군가의 고민이 실제 레시피로 이어진 결과예요. 댓글은 없고, 하트로 응원할 수 있어요.
        </p>
        {!publicResults || publicResults.length === 0 ? (
          <Card className="p-8 text-center">
            <CloverMascot className="w-14 h-14 mx-auto mb-3" />
            <p className="text-[13px] text-text-gray">아직 공개된 결과 사례가 없어요.</p>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {(publicResults as PublicResult[]).map((r) => (
              <Card key={r.id} className="p-5">
                <div className="aspect-[16/9] rounded-xl bg-pale-green mb-3 flex items-center justify-center">
                  <CloverMascot className="w-10 h-10" />
                </div>
                <p className="font-semibold text-[13.5px] text-text-dark">{r.title}</p>
                <p className="text-[12px] text-text-gray mt-1.5 line-clamp-2">{r.summary}</p>
                <div className="flex items-center justify-between mt-3">
                  {r.related_recipe_id ? (
                    <Link href="/clover-map" className="text-[12px] font-semibold text-primary-deep">
                      레시피 보기 →
                    </Link>
                  ) : (
                    <span />
                  )}
                  <HeartButton
                    targetType="public_result"
                    targetId={r.id}
                    initialActive={heartedIds.has(r.id)}
                    initialCount={r.heart_count}
                    userId={userId}
                    size="sm"
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
