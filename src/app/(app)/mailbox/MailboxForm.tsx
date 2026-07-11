"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { CloverMascot } from "@/components/icons/CloverMascot";
import { createClient } from "@/lib/supabase/client";
import { awardGrowth } from "@/lib/supabase-actions";
import { INDUSTRY_OPTIONS, REQUESTED_INDUSTRY_CHIPS } from "@/lib/mailbox-data";
import { useLoginModal } from "@/lib/login-modal-context";
import { Lock, Mail, CheckCircle2 } from "lucide-react";

export function MailboxForm({ userId }: { userId: string | null }) {
  const router = useRouter();
  const { openForAction } = useLoginModal();
  const [industry, setIndustry] = useState("");
  const [painTitle, setPainTitle] = useState("");
  const [desiredOutcome, setDesiredOutcome] = useState("");
  const [currentSituation, setCurrentSituation] = useState("");
  const [freeText, setFreeText] = useState("");
  const [requestedIndustry, setRequestedIndustry] = useState<string | null>(null);
  const [allowAnonymousUse, setAllowAnonymousUse] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const canSubmit =
    industry && painTitle.trim() && desiredOutcome.trim() && currentSituation.trim() && privacyConsent;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    if (!userId) {
      openForAction("mailbox");
      return;
    }

    setSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.from("clover_mailbox").insert({
      user_id: userId,
      industry,
      pain_title: painTitle,
      desired_outcome: desiredOutcome,
      current_situation: currentSituation,
      free_text: freeText || null,
      requested_industry: requestedIndustry,
      allow_anonymous_use: allowAnonymousUse,
    });

    if (!error) {
      await awardGrowth("mailbox_submit");
      setSuccess(true);
      setIndustry("");
      setPainTitle("");
      setDesiredOutcome("");
      setCurrentSituation("");
      setFreeText("");
      setRequestedIndustry(null);
      setAllowAnonymousUse(false);
      setPrivacyConsent(false);
      router.refresh();
      setTimeout(() => setSuccess(false), 4000);
    }
    setSubmitting(false);
  }

  return (
    <div className="grid md:grid-cols-[1fr_1.1fr] gap-0 rounded-[var(--radius-card)] overflow-hidden border border-border-soft">
      {/* Intro panel */}
      <div className="bg-gradient-to-br from-soft-green to-pale-green p-8 flex flex-col justify-between">
        <div>
          <p className="text-[13px] text-text-gray">당신의 이야기가 누군가의 클로버가 될 수 있어요</p>
          <h2 className="text-[20px] font-bold text-text-dark mt-2 leading-snug">
            요즘 당신이
            <br />
            찾고 있는 클로버는
            <br />
            무엇인가요?
          </h2>
          <p className="text-[12.5px] text-text-gray mt-4 leading-relaxed">
            지금 느끼는 막막함, 걱정, 바람을 클로버 우체통에 조용히 남겨보세요.
            <br />
            운영자만 확인하고, 정성껏 답변드립니다.
          </p>
        </div>
        <div className="flex items-center justify-center py-8">
          <CloverMascot className="w-28 h-28" />
        </div>
        <div className="flex items-start gap-2 bg-white/70 rounded-xl p-3.5 text-[11.5px] text-text-gray">
          <Lock size={14} className="text-primary-deep shrink-0 mt-0.5" />
          걱정하지 마세요, 모든 내용은 운영자만 확인할 수 있어요. 여러분의 소중한 이야기는
          안전하게 보호됩니다.
        </div>
      </div>

      {/* Form panel */}
      <Card className="rounded-none border-0 p-6 md:p-8">
        {success && (
          <div className="flex items-center gap-2 bg-soft-green text-primary-deep text-[13px] font-semibold px-4 py-3 rounded-xl mb-5">
            <CheckCircle2 size={16} />
            클로버 우체통에 잘 도착했어요! 성장도 +80을 받았어요.
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field label="업종" required>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border-soft text-[13.5px] outline-none focus:border-primary bg-white"
            >
              <option value="">업종을 선택해주세요</option>
              {INDUSTRY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </Field>

          <Field label="가장 막막한 일" required hint="무엇이 가장 힘든가요?">
            <input
              value={painTitle}
              onChange={(e) => setPainTitle(e.target.value)}
              placeholder="지금 가장 막막하게 느껴지는 일을 한 가지 적어주세요."
              className="w-full px-4 py-2.5 rounded-xl border border-border-soft text-[13.5px] outline-none focus:border-primary"
            />
          </Field>

          <Field label="원하는 결과" required hint="바라시는 모습을 적어주세요.">
            <input
              value={desiredOutcome}
              onChange={(e) => setDesiredOutcome(e.target.value)}
              placeholder="이 고민이 해결되면, 어떤 결과를 얻고 싶으신가요?"
              className="w-full px-4 py-2.5 rounded-xl border border-border-soft text-[13.5px] outline-none focus:border-primary"
            />
          </Field>

          <Field label="현재 상황" required hint="현재 상황을 공유해 주세요.">
            <input
              value={currentSituation}
              onChange={(e) => setCurrentSituation(e.target.value)}
              placeholder="지금 상황을 간단히 설명해 주세요."
              className="w-full px-4 py-2.5 rounded-xl border border-border-soft text-[13.5px] outline-none focus:border-primary"
            />
          </Field>

          <Field label="자유 입력" hint="더 자세히 들려주세요.">
            <textarea
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              rows={3}
              placeholder="하고 싶은 말이 있다면 자유롭게 적어주세요. 추가로 공유하고 싶은 정보도 좋아요."
              className="w-full px-4 py-2.5 rounded-xl border border-border-soft text-[13.5px] outline-none focus:border-primary resize-none"
            />
          </Field>

          <div>
            <p className="text-[12.5px] font-semibold text-text-dark mb-2">
              이 업종도 필요해요! <span className="text-text-gray font-normal">(선택)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {REQUESTED_INDUSTRY_CHIPS.map((chip) => (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() =>
                    setRequestedIndustry((prev) => (prev === chip.value ? null : chip.value))
                  }
                  className={`text-[12px] px-3 py-1.5 rounded-full border transition-colors ${
                    requestedIndustry === chip.value
                      ? "bg-soft-green border-primary text-primary-deep"
                      : "bg-white border-border-soft text-text-gray hover:bg-pale-green"
                  }`}
                >
                  {chip.emoji} {chip.value}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5 pt-1">
            <label className="flex items-start gap-2.5 text-[12px] text-text-gray cursor-pointer">
              <input
                type="checkbox"
                checked={allowAnonymousUse}
                onChange={(e) => setAllowAnonymousUse(e.target.checked)}
                className="mt-0.5 accent-[#2F9B67]"
              />
              내 고민이 익명으로 공개 결과 사례에 활용되는 것에 동의해요. (선택)
            </label>
            <label className="flex items-start gap-2.5 text-[12px] text-text-gray cursor-pointer">
              <input
                type="checkbox"
                checked={privacyConsent}
                onChange={(e) => setPrivacyConsent(e.target.checked)}
                className="mt-0.5 accent-[#2F9B67]"
              />
              개인정보 수집 및 익명 처리 방침에 동의해요. (필수)
            </label>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!canSubmit || submitting}
            icon={<Mail size={16} />}
          >
            {submitting ? "보내는 중..." : "클로버 우체통에 남기기"}
          </Button>
        </form>
      </Card>
    </div>
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
