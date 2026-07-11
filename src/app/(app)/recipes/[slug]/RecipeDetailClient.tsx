"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { SaveButton } from "@/components/shared/SaveButton";
import { HeartButton } from "@/components/shared/HeartButton";
import { CloverMascot } from "@/components/icons/CloverMascot";
import { awardGrowth } from "@/lib/supabase-actions";
import { createClient } from "@/lib/supabase/client";
import type { Recipe, RecipeStep } from "@/types/database";
import { Copy, Check, ChevronRight, ChevronLeft, MessageCircle, PartyPopper } from "lucide-react";

export function RecipeDetailClient({
  recipe,
  steps,
}: {
  recipe: Recipe;
  steps: RecipeStep[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [awarding, setAwarding] = useState(false);

  // Personalized state (who's logged in, have they saved/hearted this recipe)
  // is fetched client-side so the page itself stays static/cacheable.
  const [userId, setUserId] = useState<string | null>(null);
  const [initialSaved, setInitialSaved] = useState(false);
  const [initialHearted, setInitialHearted] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const [{ data: bookmark }, { data: heart }] = await Promise.all([
        supabase
          .from("bookmarks")
          .select("id")
          .eq("user_id", user.id)
          .eq("recipe_id", recipe.id)
          .maybeSingle(),
        supabase
          .from("hearts")
          .select("id")
          .eq("user_id", user.id)
          .eq("target_type", "recipe")
          .eq("target_id", recipe.id)
          .maybeSingle(),
      ]);
      setInitialSaved(!!bookmark);
      setInitialHearted(!!heart);
    })();
  }, [recipe.id]);

  const step = steps[activeIndex];
  const isLastStep = activeIndex === steps.length - 1;

  function toggleChecklist(stepId: string, itemIdx: number) {
    const key = `${stepId}-${itemIdx}`;
    setChecklistState((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleCopyPrompt() {
    if (!step?.prompt_text) return;
    await navigator.clipboard.writeText(step.prompt_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleComplete() {
    if (completed || awarding) return;
    setAwarding(true);
    const key = `recipe_complete_${recipe.id}`;
    if (userId && !sessionStorage.getItem(key)) {
      await awardGrowth("recipe_complete");
      sessionStorage.setItem(key, "1");
    }
    setCompleted(true);
    setAwarding(false);
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <p className="text-[12px] text-text-gray mb-4">
        클로버 레시피 {(recipe.categories ?? [])[0] ? `› ${recipe.categories?.[0]}` : ""}
      </p>

      {/* Header */}
      <Card className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-40 aspect-[4/3] md:aspect-square rounded-2xl bg-pale-green flex items-center justify-center shrink-0">
          <CloverMascot className="w-16 h-16" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-[22px] md:text-[24px] font-bold text-text-dark leading-snug">
              {recipe.title}
            </h1>
            <div className="flex items-center gap-2 shrink-0">
              <HeartButton
                targetType="recipe"
                targetId={recipe.id}
                initialActive={initialHearted}
                initialCount={recipe.heart_count}
                userId={userId}
              />
            </div>
          </div>
          <p className="text-[13.5px] text-text-gray mt-2 leading-relaxed">{recipe.summary}</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-4 text-[12.5px] text-text-gray">
            <span>⏱ {recipe.estimated_time}</span>
            <span>📊 {recipe.difficulty}</span>
            {recipe.estimated_cost && <span>💰 {recipe.estimated_cost}</span>}
            {recipe.tools && <span>🛠 {recipe.tools.join(", ")}</span>}
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {(recipe.target_users ?? []).map((t) => (
              <span key={t} className="text-[11px] text-primary-deep bg-soft-green px-2.5 py-1 rounded-full">
                {t}
              </span>
            ))}
            {(recipe.categories ?? []).map((c) => (
              <span key={c} className="text-[11px] text-text-gray bg-pale-green px-2.5 py-1 rounded-full">
                #{c}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mt-5">
            <SaveButton recipeId={recipe.id} initialSaved={initialSaved} userId={userId} variant="full" />
            <Button href="/mailbox" variant="secondary" size="sm" icon={<MessageCircle size={14} />}>
              1:1 세팅 문의하기
            </Button>
          </div>
        </div>
      </Card>

      {steps.length === 0 ? (
        <Card className="p-10 mt-8 text-center">
          <CloverMascot className="w-16 h-16 mx-auto mb-3" />
          <p className="text-[13.5px] text-text-gray">
            아직 상세 단계가 준비되지 않았어요. 곧 업데이트될 예정이에요.
          </p>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-[1fr_260px] gap-6 mt-8 items-start">
          <div>
            {/* Step tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-6">
              {steps.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActiveIndex(i)}
                  className={`flex items-center gap-1.5 shrink-0 px-3.5 py-2 rounded-full text-[12.5px] font-medium whitespace-nowrap transition-colors ${
                    i === activeIndex
                      ? "bg-primary text-white"
                      : i < activeIndex
                      ? "bg-soft-green text-primary-deep"
                      : "bg-pale-green text-text-gray"
                  }`}
                >
                  {i + 1}. {s.title}
                  {i < steps.length - 1 && <ChevronRight size={12} className="opacity-50" />}
                </button>
              ))}
            </div>

            {/* Active step content */}
            <Card className="p-6 md:p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-bold text-text-dark">
                  {activeIndex + 1}. {step.title}
                </h2>
                <span className="text-[11.5px] text-text-gray shrink-0">
                  {activeIndex + 1} / {steps.length}
                </span>
              </div>
              {step.description && (
                <p className="text-[13.5px] text-text-gray mt-2 leading-relaxed">{step.description}</p>
              )}

              {step.checklist && step.checklist.length > 0 && (
                <div className="mt-5 flex flex-col gap-2">
                  {step.checklist.map((item, idx) => {
                    const key = `${step.id}-${idx}`;
                    const done = checklistState[key] ?? false;
                    return (
                      <button
                        key={key}
                        onClick={() => toggleChecklist(step.id, idx)}
                        className="flex items-center gap-2.5 text-left text-[13px] text-text-dark p-2.5 rounded-xl hover:bg-pale-green transition-colors"
                      >
                        <span
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            done ? "bg-primary border-primary text-white" : "border-border-soft"
                          }`}
                        >
                          {done && <Check size={12} />}
                        </span>
                        <span className={done ? "line-through text-text-gray" : ""}>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {step.prompt_text && (
                <div className="mt-6">
                  <p className="text-[12.5px] font-semibold text-text-dark mb-2">사용한 프롬프트</p>
                  <div className="relative bg-pale-green rounded-xl p-4">
                    <p className="text-[12.5px] text-text-dark leading-relaxed whitespace-pre-wrap pr-8">
                      {step.prompt_text}
                    </p>
                    <button
                      onClick={handleCopyPrompt}
                      className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white flex items-center justify-center text-text-gray hover:text-primary-deep"
                      aria-label="프롬프트 복사"
                    >
                      {copied ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
              )}

              {step.screenshot_urls && step.screenshot_urls.length > 0 && (
                <div className="mt-5 grid sm:grid-cols-2 gap-3">
                  {step.screenshot_urls.map((url, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={url}
                      alt={`${step.title} 진행 캡처 ${i + 1}`}
                      className="w-full rounded-xl border border-border-soft object-cover"
                    />
                  ))}
                </div>
              )}

              {step.tip && (
                <div className="mt-5 flex items-start gap-2.5 bg-warm-beige rounded-xl p-4">
                  <span className="text-[15px]">💡</span>
                  <p className="text-[12.5px] text-text-dark leading-relaxed">{step.tip}</p>
                </div>
              )}

              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                  disabled={activeIndex === 0}
                  className="inline-flex items-center gap-1 text-[13px] font-medium text-text-gray disabled:opacity-30"
                >
                  <ChevronLeft size={15} /> 이전 단계
                </button>

                {isLastStep ? (
                  <Button onClick={handleComplete} disabled={completed} icon={<PartyPopper size={15} />}>
                    {completed ? "완료했어요!" : "레시피 완료하기"}
                  </Button>
                ) : (
                  <Button onClick={() => setActiveIndex((i) => Math.min(steps.length - 1, i + 1))}>
                    다음 단계로 <ChevronRight size={15} />
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <Card className="p-5">
              <p className="text-[13px] font-bold text-text-dark mb-3">전체 단계</p>
              <ol className="flex flex-col gap-2">
                {steps.map((s, i) => (
                  <li key={s.id}>
                    <button
                      onClick={() => setActiveIndex(i)}
                      className={`w-full text-left flex items-center gap-2 text-[12.5px] px-2.5 py-2 rounded-lg transition-colors ${
                        i === activeIndex ? "bg-soft-green text-primary-deep font-semibold" : "text-text-gray hover:bg-pale-green"
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white border border-border-soft flex items-center justify-center text-[10px] shrink-0">
                        {i + 1}
                      </span>
                      {s.title}
                    </button>
                  </li>
                ))}
              </ol>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-soft-green to-pale-green border-none text-center">
              <CloverMascot className="w-12 h-12 mx-auto mb-2" />
              <p className="text-[12px] text-text-gray leading-relaxed">
                작은 단계를 하나씩 완성하면, 어느새 멋진 결과물이 완성되어 있을 거예요!
              </p>
            </Card>

            <Link
              href="/clover-map"
              className="text-[12.5px] text-text-gray hover:text-primary-deep text-center"
            >
              ← 클로버 지도로 돌아가기
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
