import { AppShell } from "@/components/shared/AppShell";
import { getCurrentProfile } from "@/lib/auth";

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  return <AppShell profile={profile}>{children}</AppShell>;
}
