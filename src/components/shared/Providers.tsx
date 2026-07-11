"use client";

import { LoginModalProvider } from "@/lib/login-modal-context";
import { LoginModal } from "@/components/shared/LoginModal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LoginModalProvider>
      {children}
      <LoginModal />
    </LoginModalProvider>
  );
}
