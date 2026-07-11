"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { SelectChip } from "@/components/shared/SelectChip";
import { FocusAreaTile } from "@/components/shared/FocusAreaTile";
import { FinderStepper } from "@/components/shared/FinderStepper";
import { CloverMascot } from "@/components/icons/CloverMascot";
import {
  USER_TYPE_OPTIONS,
  FOCUS_AREA_OPTIONS,
  PAIN_OPTIONS,
  AI_EXPERIENCE_OPTIONS,
  DESIRED_RESULT_OPTIONS,
  EMPTY_ANSWERS,
  RESULT_TYPES,
  FINDER_STORAGE_KEY,
  type FinderAnswers,
  type ResultTypeId,
} from "@/lib/clover-finder-data";
import { computeFinderResult } from "@/lib/clover-finder-engine";
import { createClient } from "@/lib/supabase/client";
import { Sparkles } from "lucide-react";

export default function CloverFinderPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<FinderAnswers>(EMPTY_ANSWERS);
  const [submitting, setSubmitting] = useState(false);

  const preview = useMemo(() => computeFinderResult(answers), [answers]);
  const previewMeta = preview.resultType ? RESULT_TYPES[preview.resultType] : null;

  const activeStep =
    !answers.userType || answers.focusAreas.length === 0
      ? 1
      : answers.pains.length === 0
      ? 2
      : !answers.aiExperience
      ? 3
      : !answers.desiredResult
      ? 4
      : 4;

  const canSubmit =
    !!answers.userType &&
    answers.focusAreas.length > 0 &&
    !!answers.aiExperience &&
    !!answers.desiredResult;

  function toggleFocusArea(id: ResultTypeId) {
    setAnswers((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(id)
        ? prev.focusAreas.filter((v) => v !== id)
        : [...prev.focusAreas, id],
    }));
  }

  function togglePain(value: string) {
    setAnswers((prev) => ({
      ...prev,
      pains: prev.pains.includes(value)
        ? prev.pains.filter((v) => v !== value)
        : [...prev.pains, value],
    }));
  }

  async function handleSubmit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);

    const result = computeFinderResult(answers);

    // Persist for the result page to read (works for guests too — no DB round-trip needed).
    sessionStorage.setItem(
      FINDER_STORAGE_KEY,
      JSON.stringify({ answers, result })
    );

    // Best-effort log to Supabase for analytics; never blocks navigation.
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      await supabase.from("clover_diagnoses").insert({
        user_id: user?.id ?? null,
        user_type: answers.userType,
        pain_categories: [...answers.focusAreas, ...answers.pains],
        ai_experience: answers.aiExperience,
        desired_result: answers.desiredResult,
        result_type: result.resultType,
      });
    } catch (err) {
      console.error("diagnosis log failed:", err);
    }

    router.push("/clover-finder/result");
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-text-dark">클로버 찾기</h1>
          <p className="text-[13px] text-text-gray mt-1">
            몇 가지 질문으로 나에게 맞는 업무·성장 방향을 찾아드려요
          </p>
        </div>
        <FinderStepper activeStep={activeStep} />
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Main form */}
        <Card className="p-6 md:p-8 flex flex-col gap-9">
          {/* Step 1 */}
          <section>
            <SectionTitle
              step={1}
              title="어떤 클로버를 찾고 계신가요?"
              subtitle="현재 하고 계신 일이나 관심 있는 분야를 선택해 주세요."
            />
            <p className="text-[13px] font-semibold text-text-dark mt-5 mb-2.5">
              어떤 유형에 가장 가까우신가요?
            </p>
            <div className="flex flex-wrap gap-2">
              {USER_TYPE_OPTIONS.map((opt) => (
                <SelectChip
                  key={opt.value}
                  label={opt.label}
                  selected={answers.userType === opt.value}
                  onClick={() => setAnswers((p) => ({ ...p, userType: opt.value }))}
                />
              ))}
            </div>

            <p className="text-[13px] font-semibold text-text-dark mt-6 mb-2.5">
              업종/분야 선택 <span className="text-text-gray font-normal">(복수 선택 가능)</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {FOCUS_AREA_OPTIONS.map((opt) => (
                <FocusAreaTile
                  key={opt.value}
                  emoji={opt.emoji ?? "🍀"}
                  label={opt.label}
                  description={opt.description ?? ""}
                  selected={answers.focusAreas.includes(opt.value)}
                  onClick={() => toggleFocusArea(opt.value)}
                />
              ))}
            </div>
          </section>

          {/* Step 2 */}
          <section>
            <SectionTitle
              step={2}
              title="현재 가장 막막한 일은 무엇인가요?"
              subtitle="복수 선택이 가능해요."
            />
            <div className="flex flex-wrap gap-2 mt-4">
              {PAIN_OPTIONS.map((opt) => (
                <SelectChip
                  key={opt.value}
                  label={opt.label}
                  selected={answers.pains.includes(opt.value)}
                  onClick={() => togglePain(opt.value)}
                />
              ))}
            </div>
          </section>

          {/* Step 3 */}
          <section>
            <SectionTitle step={3} title="AI 사용 경험은 어느 정도인가요?" />
            <div className="flex flex-wrap gap-2 mt-4">
              {AI_EXPERIENCE_OPTIONS.map((opt) => (
                <SelectChip
                  key={opt.value}
                  label={opt.label}
                  selected={answers.aiExperience === opt.value}
                  onClick={() => setAnswers((p) => ({ ...p, aiExperience: opt.value }))}
                />
              ))}
            </div>
          </section>

          {/* Step 4 */}
          <section>
            <SectionTitle step={4} title="이 진단을 통해 얻고 싶은 결과는 무엇인가요?" />
            <div className="flex flex-wrap gap-2 mt-4">
              {DESIRED_RESULT_OPTIONS.map((opt) => (
                <SelectChip
                  key={opt.value}
                  label={opt.label}
                  selected={answers.desiredResult === opt.value}
                  onClick={() => setAnswers((p) => ({ ...p, desiredResult: opt.value }))}
                />
              ))}
            </div>
          </section>

          <Button
            size="lg"
            className="w-full"
            disabled={!canSubmit || submitting}
            onClick={handleSubmit}
          >
            {submitting ? "결과를 준비하는 중..." : "진단 결과 보기 →"}
          </Button>
          {!canSubmit && (
            <p className="text-[12px] text-text-gray text-center -mt-6">
              모든 질문에 답하면 결과를 볼 수 있어요.
            </p>
          )}
        </Card>

        {/* Live preview */}
        <div className="lg:sticky lg:top-6 flex flex-col gap-4">
          <Card className="p-6">
            <p className="text-[13px] font-bold text-text-dark flex items-center gap-1.5">
              <Sparkles size={15} className="text-primary" />
              당신에게 어울리는 방향 미리보기
            </p>
            <p className="text-[12px] text-text-gray mt-1.5 leading-relaxed">
              지금까지의 선택을 바탕으로, 잘 맞을 클로버 방향을 미리 보여드려요.
            </p>

            {previewMeta ? (
              <div className="mt-5 rounded-2xl bg-soft-green p-4">
                <p className="text-[11px] font-semibold text-primary-deep">예상 매칭 클로버</p>
                <p className="text-[16px] font-bold text-text-dark mt-1">
                  {previewMeta.emoji} {previewMeta.label}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {previewMeta.tags.map((t) => (
                    <span key={t} className="text-[10.5px] text-primary-deep bg-white px-2 py-0.5 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-[12px] text-text-gray mt-3 leading-relaxed">
                  {previewMeta.description}
                </p>
                <div className="flex items-center gap-1 mt-3">
                  <span className="text-[11px] text-text-gray mr-1">매칭 강도</span>
                  {[1, 2, 3, 4].map((i) => (
                    <span key={i} className={i <= preview.matchScore ? "opacity-100" : "opacity-25"}>
                      🍀
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl bg-pale-green p-6 flex flex-col items-center text-center gap-2">
                <CloverMascot className="w-14 h-14" />
                <p className="text-[12px] text-text-gray">
                  분야를 선택하면 미리보기가 나타나요.
                </p>
              </div>
            )}
          </Card>

          {previewMeta && (
            <Card className="p-6">
              <p className="text-[13px] font-bold text-text-dark mb-3">예상 도움 포인트</p>
              <ul className="flex flex-col gap-2">
                {previewMeta.helpPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-[12.5px] text-text-gray">
                    <span className="text-primary mt-0.5">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card className="p-5 bg-gradient-to-br from-soft-green to-pale-green border-none text-center">
            <p className="text-[12px] text-text-gray">
              정확한 진단을 위해 모든 단계를 완료해 주세요!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  step,
  title,
  subtitle,
}: {
  step: number;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-6 h-6 rounded-full bg-pale-green text-primary-deep text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
        {step}
      </span>
      <div>
        <h2 className="text-[16px] font-bold text-text-dark">{title}</h2>
        {subtitle && <p className="text-[12.5px] text-text-gray mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
