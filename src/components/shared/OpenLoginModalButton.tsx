"use client";

import { useLoginModal } from "@/lib/login-modal-context";
import { cn } from "@/lib/utils";

export function OpenLoginModalButton({
  className,
  step = "invite",
  children,
}: {
  className?: string;
  step?: "invite" | "benefits" | "guest";
  children: React.ReactNode;
}) {
  const { open } = useLoginModal();

  return (
    <button
      onClick={() => open({ step })}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-150 rounded-full px-5 py-3 text-[15px] bg-primary text-white hover:bg-primary-deep shadow-[0_4px_14px_rgba(47,155,103,0.25)]",
        className
      )}
    >
      {children}
    </button>
  );
}
