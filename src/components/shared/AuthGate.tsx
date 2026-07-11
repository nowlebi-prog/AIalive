import { getCurrentProfile } from "@/lib/auth";
import { AuthRequiredScreen } from "@/components/shared/AuthRequiredScreen";
import type { LoginModalActionContext } from "@/lib/login-modal-data";
import type { Profile } from "@/types/database";

/**
 * Wrap page content that requires login. Renders children with the resolved
 * profile when signed in; otherwise shows a screen that opens the LoginModal
 * (rather than a hard redirect to a separate /login page).
 */
export async function AuthGate({
  next,
  context = "generic",
  children,
}: {
  next: string;
  context?: LoginModalActionContext;
  children: (profile: Profile) => React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return <AuthRequiredScreen context={context} next={next} />;
  }
  return <>{children(profile)}</>;
}
