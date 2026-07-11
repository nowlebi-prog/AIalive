"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { toggleRecipePublic } from "./actions";

export function PublicToggle({ recipeId, isPublic }: { recipeId: string; isPublic: boolean }) {
  const [checked, setChecked] = useState(isPublic);
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    const next = !checked;
    setChecked(next);
    startTransition(() => {
      toggleRecipePublic(recipeId, next);
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={pending}
      aria-pressed={checked}
      className={cn(
        "text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors",
        checked ? "bg-soft-green text-primary-deep" : "bg-pale-green text-text-gray"
      )}
    >
      {checked ? "공개" : "비공개"}
    </button>
  );
}
