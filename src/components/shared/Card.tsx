import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] bg-white border border-border-soft shadow-[var(--shadow-card)]",
        className
      )}
      {...props}
    />
  );
}
