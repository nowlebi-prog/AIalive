"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { createPublicResult, updatePublicResult, type PublicResultInput } from "./actions";
import type { PublicResult, Recipe } from "@/types/database";

export function PublicResultForm({
  mode,
  result,
  recipes,
}: {
  mode: "create" | "edit";
  result?: PublicResult;
  recipes: Recipe[];
}) {
  const [title, setTitle] = useState(result?.title ?? "");
  const [summary, setSummary] = useState(result?.summary ?? "");
  const [imageUrl, setImageUrl] = useState(result?.image_url ?? "");
  const [relatedRecipeId, setRelatedRecipeId] = useState(result?.related_recipe_id ?? "");
  const [isPublic, setIsPublic] = useState(result?.is_public ?? false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const input: PublicResultInput = {
      title,
      summary,
      image_url: imageUrl,
      related_recipe_id: relatedRecipeId,
      is_public: isPublic,
    };
    startTransition(async () => {
      try {
        if (mode === "create") {
          await createPublicResult(input);
        } else if (result) {
          await updatePublicResult(result.id, input);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "저장에 실패했어요.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && <div className="bg-heart/10 text-heart text-[13px] px-4 py-3 rounded-xl">{error}</div>}

      <Card className="p-6 flex flex-col gap-5">
        <Field label="제목" required>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-border-soft text-[13.5px] outline-none focus:border-primary"
          />
        </Field>
        <Field label="요약">
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-border-soft text-[13.5px] outline-none focus:border-primary resize-none"
          />
        </Field>
        <Field label="이미지 URL">
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2.5 rounded-xl border border-border-soft text-[13.5px] outline-none focus:border-primary"
          />
        </Field>
        <Field label="연결된 레시피" hint="선택하면 결과 카드에서 해당 레시피로 연결돼요">
          <select
            value={relatedRecipeId}
            onChange={(e) => setRelatedRecipeId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border-soft text-[13.5px] outline-none focus:border-primary bg-white"
          >
            <option value="">선택 안 함</option>
            {recipes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
        </Field>
        <label className="flex items-center gap-2 text-[13px] text-text-dark cursor-pointer">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="accent-[#2F9B67]" />
          공개하기
        </label>
      </Card>

      <div className="flex justify-end gap-3">
        <Button href="/admin/public-results" variant="secondary">
          취소
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "저장 중..." : mode === "create" ? "만들기" : "변경사항 저장"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[12.5px] font-semibold text-text-dark">
          {label} {required && <span className="text-heart">*</span>}
        </label>
        {hint && <span className="text-[11px] text-text-gray">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
