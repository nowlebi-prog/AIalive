import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/shared/Card";
import Link from "next/link";
import { Users, ClipboardList, Mailbox, BookOpen, Bookmark, Heart } from "lucide-react";

async function getCount(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: string
) {
  const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [members, diagnoses, mailboxCount, recipes, bookmarks, hearts] = await Promise.all([
    getCount(supabase, "profiles"),
    getCount(supabase, "clover_diagnoses"),
    getCount(supabase, "clover_mailbox"),
    getCount(supabase, "recipes"),
    getCount(supabase, "bookmarks"),
    getCount(supabase, "hearts"),
  ]);

  const { count: pendingMailbox } = await supabase
    .from("clover_mailbox")
    .select("*", { count: "exact", head: true })
    .eq("status", "received");

  const stats = [
    { label: "회원 수", value: members, icon: Users, href: "/admin/users" },
    { label: "클로버 찾기 진단 수", value: diagnoses, icon: ClipboardList, href: null },
    { label: "우체통 고민 수", value: mailboxCount, icon: Mailbox, href: "/admin/mailbox" },
    { label: "레시피 수", value: recipes, icon: BookOpen, href: "/admin/recipes" },
    { label: "저장 수", value: bookmarks, icon: Bookmark, href: null },
    { label: "하트 수", value: hearts, icon: Heart, href: null },
  ];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <h1 className="text-[20px] font-bold text-text-dark mb-1">관리자 대시보드</h1>
      <p className="text-[13px] text-text-gray mb-6">Clover Desk 운영 현황을 한눈에 확인해요.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          const content = (
            <Card className="p-5 flex items-center gap-4 h-full">
              <div className="w-11 h-11 rounded-xl bg-soft-green flex items-center justify-center shrink-0">
                <Icon size={18} className="text-primary-deep" />
              </div>
              <div>
                <p className="text-[12px] text-text-gray">{s.label}</p>
                <p className="text-[22px] font-bold text-text-dark">{s.value.toLocaleString()}</p>
              </div>
            </Card>
          );
          return s.href ? (
            <Link key={s.label} href={s.href}>
              {content}
            </Link>
          ) : (
            <div key={s.label}>{content}</div>
          );
        })}
      </div>

      {pendingMailbox !== null && pendingMailbox > 0 && (
        <Card className="p-5 mt-6 bg-gradient-to-r from-soft-green to-pale-green border-none flex items-center justify-between">
          <p className="text-[13.5px] text-text-dark font-semibold">
            📮 아직 확인하지 않은 우체통 고민이 {pendingMailbox}건 있어요.
          </p>
          <Link href="/admin/mailbox" className="text-[12.5px] font-semibold text-primary-deep">
            확인하러 가기 →
          </Link>
        </Card>
      )}
    </div>
  );
}
