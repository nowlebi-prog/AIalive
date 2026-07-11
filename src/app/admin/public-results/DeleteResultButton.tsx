"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deletePublicResult } from "./actions";

export function DeleteResultButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`"${title}" 결과 카드를 삭제할까요?`)) return;
    startTransition(() => {
      deletePublicResult(id);
    });
  }

  return (
    <button onClick={handleDelete} disabled={pending} className="text-text-gray hover:text-heart disabled:opacity-50" aria-label="삭제">
      <Trash2 size={15} />
    </button>
  );
}
