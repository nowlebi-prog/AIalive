import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { Card } from "@/components/shared/Card";
import { RoleToggle } from "./RoleToggle";
import type { Profile } from "@/types/database";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const me = await getCurrentProfile();
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("clover_number", { ascending: true });

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <h1 className="text-[20px] font-bold text-text-dark mb-1">사용자 관리</h1>
      <p className="text-[13px] text-text-gray mb-6">총 {users?.length ?? 0}명의 클로버가 함께하고 있어요.</p>

      <Card className="overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border-soft text-text-gray text-left">
              <th className="px-5 py-3 font-medium">클로버 번호</th>
              <th className="px-5 py-3 font-medium">닉네임</th>
              <th className="px-5 py-3 font-medium">이메일</th>
              <th className="px-5 py-3 font-medium">전화번호</th>
              <th className="px-5 py-3 font-medium">성장도</th>
              <th className="px-5 py-3 font-medium">가입일</th>
              <th className="px-5 py-3 font-medium">권한</th>
            </tr>
          </thead>
          <tbody>
            {(users as Profile[] | null)?.map((u) => (
              <tr key={u.id} className="border-b border-border-soft last:border-0">
                <td className="px-5 py-3 text-text-gray">
                  첫 클로버 {String(u.clover_number ?? 0).padStart(3, "0")}
                </td>
                <td className="px-5 py-3 text-text-dark font-medium">{u.nickname ?? "-"}</td>
                <td className="px-5 py-3 text-text-gray">{u.email ?? "-"}</td>
                <td className="px-5 py-3 text-text-gray">{u.phone ?? "-"}</td>
                <td className="px-5 py-3 text-text-gray">{u.growth_points.toLocaleString()}P</td>
                <td className="px-5 py-3 text-text-gray">
                  {new Date(u.created_at).toISOString().slice(0, 10)}
                </td>
                <td className="px-5 py-3">
                  <RoleToggle userId={u.id} role={u.role} disabled={u.id === me?.id} />
                </td>
              </tr>
            ))}
            {(!users || users.length === 0) && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-text-gray">
                  아직 가입한 사용자가 없어요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
