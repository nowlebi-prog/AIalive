"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { awardGrowth } from "@/lib/supabase-actions";

export function SaveButton({
  recipeId,
  initialSaved,
  userId,
  variant = "icon",
}: {
  recipeId: string;
  initialSaved: boolean;
  userId: string | null;
  variant?: "icon" | "full";
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (!userId) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (busy) return;
    setBusy(true);

    const supabase = createClient();
    const nextSaved = !saved;
    setSaved(nextSaved);

    if (nextSaved) {
      const { error } = await supabase
        .from("bookmarks")
        .insert({ user_id: userId, recipe_id: recipeId });
      if (!error) await awardGrowth("recipe_save");
    } else {
      await supabase.from("bookmarks").delete().match({ user_id: userId, recipe_id: recipeId });
    }
    setBusy(false);
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        aria-pressed={saved}
        aria-label={saved ? "저장 취소" : "저장하기"}
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0",
          saved ? "bg-soft-green text-primary-deep" : "bg-white/90 text-text-gray hover:text-primary-deep"
        )}
      >
        {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={saved}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 text-[13px] font-semibold rounded-full py-2.5 px-4 border transition-colors",
        saved
          ? "bg-soft-green border-primary text-primary-deep"
          : "border-primary text-primary-deep hover:bg-pale-green"
      )}
    >
      {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
      {saved ? "저장됨" : "저장하기"}
    </button>
  );
}
