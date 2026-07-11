import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import type { Profile } from "@/types/database";

/** Wrap page content that requires login. Renders children with the resolved profile. */
export async function AuthGate({
  next,
  children,
}: {
  next: string;
  children: (profile: Profile) => React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }
  return <>{children(profile)}</>;
}
