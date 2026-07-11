"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { LoginModalActionContext, LoginModalStep } from "@/lib/login-modal-data";

interface OpenOptions {
  /** Which internal screen to start on. Defaults to the invite screen. */
  step?: LoginModalStep;
  /** Only used when step === "action" — picks the contextual copy. */
  actionContext?: LoginModalActionContext;
  /** Path to return to after a successful login. Defaults to the current path. */
  next?: string;
}

interface LoginModalState {
  isOpen: boolean;
  step: LoginModalStep;
  actionContext: LoginModalActionContext;
  next: string;
}

interface LoginModalContextValue extends LoginModalState {
  open: (options?: OpenOptions) => void;
  openForAction: (actionContext: LoginModalActionContext, next?: string) => void;
  close: () => void;
  setStep: (step: LoginModalStep) => void;
}

const LoginModalContext = createContext<LoginModalContextValue | null>(null);

export function LoginModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LoginModalState>({
    isOpen: false,
    step: "invite",
    actionContext: "generic",
    next: "/clover-finder",
  });

  const open = useCallback((options?: OpenOptions) => {
    setState({
      isOpen: true,
      step: options?.step ?? "invite",
      actionContext: options?.actionContext ?? "generic",
      next: options?.next ?? (typeof window !== "undefined" ? window.location.pathname : "/clover-finder"),
    });
  }, []);

  const openForAction = useCallback(
    (actionContext: LoginModalActionContext, next?: string) => {
      open({ step: "action", actionContext, next });
    },
    [open]
  );

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const setStep = useCallback((step: LoginModalStep) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const value = useMemo(
    () => ({ ...state, open, openForAction, close, setStep }),
    [state, open, openForAction, close, setStep]
  );

  return <LoginModalContext.Provider value={value}>{children}</LoginModalContext.Provider>;
}

export function useLoginModal() {
  const ctx = useContext(LoginModalContext);
  if (!ctx) throw new Error("useLoginModal must be used within LoginModalProvider");
  return ctx;
}
