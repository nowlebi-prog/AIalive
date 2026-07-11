"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { createRecipe, updateRecipe, type RecipeFormInput, type StepInput } from "./actions";
import { TARGET_OPTIONS, PURPOSE_OPTIONS, DIFFICULTY_OPTIONS, TOOL_OPTIONS } from "@/lib/clover-map-data";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { Recipe, RecipeStep } from "@/types/database";

function toStepInput(s?: RecipeStep): StepInput {
  return {
    title: s?.title ?? "",
    description: s?.description ?? "",
    checklist: (s?.checklist ?? []).map((c) => c.label),
    prompt_text: s?.prompt_text ?? "",
    tip: s?.tip ?? "",
  };
}

export function RecipeForm({
  mode,
  recipe,
  steps,
}: {
  mode: "create" | "edit";
  recipe?: Recipe;
  steps?: RecipeStep[];
}) {
  const [title, setTitle] = useState(recipe?.title ?? "");
  const [summary, setSummary] = useState(recipe?.summary ?? "");
  const [targetUsers, setTargetUsers] = useState<string[]>(recipe?.target_users ?? []);
  const [categories, setCategories] = useState<string[]>(recipe?.categories ?? []);
  const [tools, setTools] = useState<string[]>(recipe?.tools ?? []);
  const [difficulty, setDifficulty] = useState<string>(recipe?.difficulty ?? DIFFICULTY_OPTIONS[0]);
  const [estimatedTime, setEstimatedTime] = useState(recipe?.estimated_time ?? "");
  const [estimatedCost, setEstimatedCost] = useState(recipe?.estimated_cost ?? "무료");
  const [thumbnailUrl, setThumbnailUrl] = useState(recipe?.thumbnail_url ?? "");
  const [isPublic, setIsPublic] = useState(recipe?.is_public ?? true);
  const [isPremium, setIsPremium] = useState(recipe?.is_premium ?? false);
  const [stepList, setStepList] = useState<StepInput[]>(
    steps && steps.length > 0 ? steps.map(toStepInput) : [toStepInput()]
  );
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggleFrom(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function updateStep(index: number, patch: Partial<StepInput>) {
    setStepList((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function addStep() {
    setStepList((prev) => [...prev, toStepInput()]);
  }

  function removeStep(index: number) {
    setStepList((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const input: RecipeFormInput = {
      title,
      summary,
      target_users: targetUsers,
      categories,
      tools,
      difficulty,
      estimated_time: estimatedTime,
      estimated_cost: estimatedCost,
      thumbnail_url: thumbnailUrl,
      is_public: isPublic,
      is_premium: isPremium,
      steps: stepList.filter((s) => s.title.trim().length > 0),
    };

    startTransition(async () => {
      try {
        if (mode === "create") {
          await createRecipe(input);
        } else if (recipe) {
          await updateRecipe(recipe.id, input);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "저장에 실패했어요.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-heart/10 text-heart text-[13px] px-4 py-3 rounded-xl">{error}</div>
      )}

      <Card className="p-6 flex flex-col gap-5">
        <h2 className="text-[15px] font-bold text-text-dark">기본 정보</h2>

        <LabeledField label="제목" required>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-border-soft text-[13.5px] outline-none focus:border-primary"
            placeholder="예: 3시간 만에 개인 홈페이지 만들기"
          />
        </LabeledField>

        <LabeledField label="요약" required>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-border-soft text-[13.5px] outline-none focus:border-primary resize-none"
          />
        </LabeledField>

        <LabeledField label="대상">
          <ChipGroup options={TARGET_OPTIONS} selected={targetUsers} onToggle={(v) => toggleFrom(targetUsers, setTargetUsers, v)} />
        </LabeledField>

        <LabeledField label="목적">
          <ChipGroup options={PURPOSE_OPTIONS} selected={categories} onToggle={(v) => toggleFrom(categories, setCategories, v)} />
        </LabeledField>

        <LabeledField label="사용 툴">
          <ChipGroup options={TOOL_OPTIONS} selected={tools} onToggle={(v) => toggleFrom(tools, setTools, v)} />
        </LabeledField>

        <div className="grid sm:grid-cols-3 gap-4">
          <LabeledField label="난이도">
            <select
              value={difficulty ?? ""}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border-soft text-[13.5px] outline-none focus:border-primary bg-white"
            >
              {DIFFICULTY_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </LabeledField>
          <LabeledField label="소요 시간">
            <input
              value={estimatedTime ?? ""}
              onChange={(e) => setEstimatedTime(e.target.value)}
              placeholder="예: 3시간"
              className="w-full px-4 py-2.5 rounded-xl border border-border-soft text-[13.5px] outline-none focus:border-primary"
            />
          </LabeledField>
          <LabeledField label="예상 비용">
            <input
              value={estimatedCost ?? ""}
              onChange={(e) => setEstimatedCost(e.target.value)}
              placeholder="예: 무료"
              className="w-full px-4 py-2.5 rounded-xl border border-border-soft text-[13.5px] outline-none focus:border-primary"
            />
          </LabeledField>
        </div>

        <LabeledField label="썸네일 이미지 URL" hint="파일 업로드는 다음 버전에서 지원 예정이에요">
          <input
            value={thumbnailUrl ?? ""}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2.5 rounded-xl border border-border-soft text-[13.5px] outline-none focus:border-primary"
          />
        </LabeledField>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-[13px] text-text-dark cursor-pointer">
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="accent-[#2F9B67]" />
            공개
          </label>
          <label className="flex items-center gap-2 text-[13px] text-text-dark cursor-pointer">
            <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} className="accent-[#2F9B67]" />
            프리미엄 (결제 미구현 · 필드만 준비)
          </label>
        </div>
      </Card>

      <Card className="p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-text-dark">단계별 내용</h2>
          <Button type="button" variant="secondary" size="sm" onClick={addStep} icon={<Plus size={14} />}>
            단계 추가
          </Button>
        </div>

        {stepList.map((step, i) => (
          <div key={i} className="border border-border-soft rounded-2xl p-5 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-primary-deep">
                <GripVertical size={14} className="text-text-gray" /> {i + 1}단계
              </span>
              {stepList.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(i)}
                  className="text-text-gray hover:text-heart"
                  aria-label="단계 삭제"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <input
                value={step.title}
                onChange={(e) => updateStep(i, { title: e.target.value })}
                placeholder="단계 제목 (예: 준비하기)"
                className="w-full px-3.5 py-2 rounded-lg border border-border-soft text-[13px] outline-none focus:border-primary"
              />
              <textarea
                value={step.description}
                onChange={(e) => updateStep(i, { description: e.target.value })}
                placeholder="이 단계에서 해야 할 일 설명"
                rows={2}
                className="w-full px-3.5 py-2 rounded-lg border border-border-soft text-[13px] outline-none focus:border-primary resize-none"
              />
              <textarea
                value={step.checklist.join("\n")}
                onChange={(e) => updateStep(i, { checklist: e.target.value.split("\n").filter(Boolean) })}
                placeholder={"체크리스트 (한 줄에 하나씩)\n예: 작업 폴더 만들기"}
                rows={2}
                className="w-full px-3.5 py-2 rounded-lg border border-border-soft text-[13px] outline-none focus:border-primary resize-none"
              />
              <textarea
                value={step.prompt_text}
                onChange={(e) => updateStep(i, { prompt_text: e.target.value })}
                placeholder="사용한 프롬프트"
                rows={2}
                className="w-full px-3.5 py-2 rounded-lg border border-border-soft text-[13px] outline-none focus:border-primary resize-none bg-pale-green"
              />
              <input
                value={step.tip}
                onChange={(e) => updateStep(i, { tip: e.target.value })}
                placeholder="실험자 팁 (선택)"
                className="w-full px-3.5 py-2 rounded-lg border border-border-soft text-[13px] outline-none focus:border-primary"
              />
            </div>
          </div>
        ))}
      </Card>

      <div className="flex justify-end gap-3">
        <Button href="/admin/recipes" variant="secondary">
          취소
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "저장 중..." : mode === "create" ? "레시피 만들기" : "변경사항 저장"}
        </Button>
      </div>
    </form>
  );
}

function LabeledField({
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

function ChipGroup({
  options,
  selected,
  onToggle,
}: {
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onToggle(opt)}
          className={`text-[12.5px] px-3 py-1.5 rounded-full border transition-colors ${
            selected.includes(opt)
              ? "bg-soft-green border-primary text-primary-deep"
              : "bg-white border-border-soft text-text-gray hover:bg-pale-green"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
