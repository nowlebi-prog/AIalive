import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { CloverLogomark } from "@/components/icons/CloverLogomark";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login?next=/admin");
  }
  if (profile.role !== "admin") {
    redirect("/home");
  }

  return (
    <div className="min-h-screen flex bg-mint-bg">
      <aside className="hidden md:flex md:flex-col w-60 shrink-0 border-r border-border-soft bg-white px-5 py-6">
        <Link href="/admin" className="flex items-center gap-2.5 mb-8">
          <CloverLogomark size={30} />
          <div className="leading-tight">
            <p className="font-bold text-[14px] text-text-dark">Clover Desk</p>
            <p className="text-[10.5px] text-text-gray">관리자</p>
          </div>
        </Link>
        <nav className="flex flex-col gap-1 text-[13.5px] font-medium text-text-gray">
          <Link href="/admin" className="px-3 py-2.5 rounded-xl hover:bg-pale-green hover:text-text-dark">대시보드</Link>
          <Link href="/admin/recipes" className="px-3 py-2.5 rounded-xl hover:bg-pale-green hover:text-text-dark">레시피 관리</Link>
          <Link href="/admin/mailbox" className="px-3 py-2.5 rounded-xl hover:bg-pale-green hover:text-text-dark">우체통 관리</Link>
          <Link href="/admin/public-results" className="px-3 py-2.5 rounded-xl hover:bg-pale-green hover:text-text-dark">공개 결과 관리</Link>
          <Link href="/admin/users" className="px-3 py-2.5 rounded-xl hover:bg-pale-green hover:text-text-dark">사용자 관리</Link>
        </nav>
        <Link href="/home" className="mt-auto text-[12.5px] text-text-gray hover:text-primary-deep">
          ← 일반 화면으로 돌아가기
        </Link>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
