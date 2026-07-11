import { AuthGate } from "@/components/shared/AuthGate";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/shared/Card";
import { CloverMascot } from "@/components/icons/CloverMascot";
import { getStageProgress } from "@/lib/growth";
import type { Profile, Bookmark, CloverMailbox, Recipe } from "@/types/database";
import Link from "next/link";

export default function MyCloverCardPage() {
  return (
    <AuthGate next="/my-clover-card">
      {(profile) => <MyCloverCardContent profile={profile} />}
    </AuthGate>
  );
}

async function MyCloverCardContent({ profile }: { profile: Profile }) {
  const supabase = await createClient();

  const [{ data: bookmarks }, { data: mailboxEntries }, { count: heartsGiven }] = await Promise.all([
    supabase
      .from("bookmarks")
      .select("*, recipes(title, slug, thumbnail_url)")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("clover_mailbox")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("hearts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profile.id), // "발견" = 발견해서 하트를 남긴 활동 수
  ]);

  const { current, next, percentToNext } = getStageProgress(profile.growth_points);
  const savedCount = bookmarks?.length ?? 0;
  const mailboxCount = mailboxEntries?.length ?? 0;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <h1 className="text-[22px] font-bold text-text-dark mb-6">나의 클로버 카드 🍀</h1>

      <Card className="p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 rounded-full bg-soft-green flex items-center justify-center shrink-0">
          <CloverMascot className="w-16 h-16" />
        </div>
        <div className="flex-1 w-full">
          <h2 className="text-[20px] font-bold text-text-dark">
            {profile.nickname ?? "클로버 씨"} 🌱
          </h2>
          <p className="text-[13px] text-text-gray mt-1">
            첫 클로버 {String(profile.clover_number ?? 0).padStart(3, "0")}
          </p>
          <p className="text-[13px] text-text-gray mt-3">
            조금씩 자라는 하루들이 모여, 당신만의 클로버가 피어나고 있어요.
          </p>

          <div className="flex items-center gap-3 mt-5">
            <span className="text-[13px] font-semibold text-primary-deep bg-soft-green px-3 py-1.5 rounded-full">
              현재 단계 {current}
            </span>
            {next && (
              <div className="flex-1 max-w-xs">
                <div className="flex justify-between text-[11px] text-text-gray mb-1">
                  <span>다음 단계까지</span>
                  <span>{percentToNext}%</span>
                </div>
                <div className="h-2 rounded-full bg-pale-green overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${Math.min(percentToNext, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatCard label="누적 성장도" value={profile.growth_points} suffix="P" />
        <StatCard label="저장한 레시피" value={savedCount} />
        <StatCard label="작성한 고민" value={mailboxCount} />
        <StatCard label="발견한 배지" value={heartsGiven ?? 0} />
      </div>

      <div className="grid md:grid-cols-2 gap-5 mt-6">
        <Card className="p-5">
          <h3 className="text-[14px] font-bold text-text-dark mb-3">저장한 클로버 레시피</h3>
          {!bookmarks || bookmarks.length === 0 ? (
            <p className="text-[13px] text-text-gray">아직 저장한 레시피가 없어요.</p>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {(bookmarks as unknown as (Bookmark & { recipes: Pick<Recipe, "title" | "slug"> | null })[]).map((b) => (
                <li key={b.id}>
                  <Link
                    href={`/recipes/${b.recipes?.slug ?? ""}`}
                    className="text-[13px] text-text-dark hover:text-primary-deep"
                  >
                    🍀 {b.recipes?.title ?? "삭제된 레시피"}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="text-[14px] font-bold text-text-dark mb-3">내가 남긴 고민</h3>
          {!mailboxEntries || mailboxEntries.length === 0 ? (
            <p className="text-[13px] text-text-gray">아직 남긴 고민이 없어요.</p>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {(mailboxEntries as CloverMailbox[]).map((m) => (
                <li key={m.id} className="text-[13px] text-text-dark">
                  💌 {m.pain_title}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <Card className="p-5">
      <p className="text-[12px] text-text-gray">{label}</p>
      <p className="text-[22px] font-bold text-text-dark mt-1">
        {value}
        {suffix}
      </p>
    </Card>
  );
}
