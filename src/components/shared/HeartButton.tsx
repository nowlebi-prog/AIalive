"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { awardGrowth } from "@/lib/supabase-actions";
import { useLoginModal } from "@/lib/login-modal-context";

export function HeartButton({
  targetType,
  targetId,
  initialActive,
  initialCount,
  userId,
  size = "md",
}: {
  targetType: "recipe" | "public_result";
  targetId: string;
  initialActive: boolean;
  initialCount: number;
  userId: string | null;
  size?: "sm" | "md";
}) {
  const { openForAction } = useLoginModal();
  const [active, setActive] = useState(initialActive);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (!userId) {
      openForAction("heart");
      return;
    }
    if (busy) return;
    setBusy(true);

    const supabase = createClient();
    const nextActive = !active;
    setActive(nextActive);
    setCount((c) => c + (nextActive ? 1 : -1));

    if (nextActive) {
      const { error } = await supabase
        .from("hearts")
        .insert({ user_id: userId, target_type: targetType, target_id: targetId });
      if (!error) {
        await awardGrowth("heart_received");
      } else {
        // Insert failed (e.g. already hearted elsewhere) — revert optimistic UI.
        setActive(false);
        setCount((c) => c - 1);
      }
    } else {
      const { error } = await supabase
        .from("hearts")
        .delete()
        .match({ user_id: userId, target_type: targetType, target_id: targetId });
      if (error) {
        setActive(true);
        setCount((c) => c + 1);
      }
    }
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold transition-colors",
        size === "sm" ? "text-[12px] px-2.5 py-1" : "text-[13px] px-3 py-1.5",
        active
          ? "bg-heart/10 text-heart"
          : "bg-pale-green text-text-gray hover:text-heart"
      )}
    >
      <Heart size={size === "sm" ? 13 : 15} fill={active ? "#F4728A" : "none"} />
      {count}
    </button>
  );
}
