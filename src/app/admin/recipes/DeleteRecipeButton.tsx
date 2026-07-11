"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteRecipe } from "./actions";

export function DeleteRecipeButton({ recipeId, title }: { recipeId: string; title: string }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`"${title}" 레시피를 삭제할까요? 되돌릴 수 없어요.`)) return;
    startTransition(() => {
      deleteRecipe(recipeId);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="text-text-gray hover:text-heart disabled:opacity-50"
      aria-label="삭제"
    >
      <Trash2 size={15} />
    </button>
  );
}
