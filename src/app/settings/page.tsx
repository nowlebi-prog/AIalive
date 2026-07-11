import { AppShell } from "@/components/shared/AppShell";
import { ComingSoon } from "@/components/shared/ComingSoon";
import { getCurrentProfile } from "@/lib/auth";

export default async function SettingsPage() {
  const profile = await getCurrentProfile();
  return (
    <AppShell profile={profile}>
      <ComingSoon
        sprintLabel="다음 스프린트에서 열려요"
        title="설정"
        description="닉네임, 알림 등을 관리하는 공간이 곧 추가돼요."
      />
    </AppShell>
  );
}
