"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, MessageCircle, ArrowRight, Compass, ChevronDown } from "lucide-react";
import { CloverMascot } from "@/components/icons/CloverMascot";
import { useLoginModal } from "@/lib/login-modal-context";
import { createClient } from "@/lib/supabase/client";
import { ACTION_COPY, SIGNUP_BENEFITS } from "@/lib/login-modal-data";
import { EmailAuthForm } from "@/components/shared/EmailAuthForm";

export function LoginModal() {
  const { isOpen, step, actionContext, next, close, setStep } = useLoginModal();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  async function handleKakaoLogin() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setLoading(false);
      alert("로그인 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.");
    }
  }

  function goTo(path: string) {
    close();
    router.push(path);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-[24px] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="닫기"
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-text-gray hover:text-text-dark"
        >
          <X size={16} />
        </button>

        {step === "invite" && <InviteScreen onStart={() => setStep("benefits")} onBrowse={() => setStep("guest")} />}
        {step === "benefits" && (
          <BenefitsScreen
            loading={loading}
            onKakao={handleKakaoLogin}
            onBack={() => setStep("invite")}
            next={next}
            onEmailSuccess={() => {
              close();
              router.push(next);
            }}
          />
        )}
        {step === "guest" && (
          <GuestScreen
            onSeeRecipes={() => goTo("/clover-map")}
            onSeeMap={() => goTo("/clover-map")}
            onBackToInvite={() => setStep("invite")}
          />
        )}
        {step === "action" && (
          <ActionScreen
            copy={ACTION_COPY[actionContext]}
            loading={loading}
            onKakao={handleKakaoLogin}
            onKeepBrowsing={close}
            next={next}
            onEmailSuccess={() => {
              close();
              router.push(next);
            }}
          />
        )}
      </div>
    </div>
  );
}

function InviteScreen({ onStart, onBrowse }: { onStart: () => void; onBrowse: () => void }) {
  return (
    <div className="bg-gradient-to-b from-soft-green to-white px-8 pt-12 pb-8 flex flex-col items-center text-center">
      <CloverMascot className="w-24 h-24 mb-5" />
      <p className="text-[12.5px] text-text-gray">내 일에 맞는 네잎클로버를 찾는 여정</p>
      <h2 className="text-[21px] font-bold text-text-dark mt-2">클로버 여정에 함께할까요?</h2>
      <p className="text-[13px] text-text-gray mt-3 leading-relaxed max-w-[300px]">
        무섭게 따라가기보다, 내 일에 맞는 작은 해결책을 함께 찾아가는 여정이에요.
      </p>

      <div className="flex flex-col gap-2.5 w-full mt-7">
        <button
          onClick={onStart}
          className="w-full py-3.5 rounded-full bg-primary text-white font-semibold text-[14.5px] hover:bg-primary-deep transition-colors"
        >
          네, 시작할게요
        </button>
        <button
          onClick={onBrowse}
          className="w-full py-3.5 rounded-full bg-white border border-border-soft text-text-dark font-semibold text-[14.5px] hover:bg-pale-green transition-colors"
        >
          먼저 둘러볼게요
        </button>
      </div>
    </div>
  );
}

function BenefitsScreen({
  loading,
  onKakao,
  onBack,
  next,
  onEmailSuccess,
}: {
  loading: boolean;
  onKakao: () => void;
  onBack: () => void;
  next: string;
  onEmailSuccess: () => void;
}) {
  const [showEmail, setShowEmail] = useState(false);

  return (
    <div className="px-8 pt-12 pb-8">
      <div className="text-center mb-6">
        <CloverMascot className="w-16 h-16 mx-auto mb-3" />
        <h2 className="text-[19px] font-bold text-text-dark">시작하면 이런 것들이 열려요</h2>
      </div>

      <ul className="flex flex-col gap-2 mb-7">
        {SIGNUP_BENEFITS.map((b) => (
          <li
            key={b.label}
            className="flex items-center gap-3 text-[13px] text-text-dark bg-pale-green rounded-xl px-4 py-2.5"
          >
            <span className="text-[16px]">{b.emoji}</span>
            {b.label}
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2.5">
        <button
          onClick={onKakao}
          disabled={loading}
          className="w-full py-3.5 rounded-full bg-[#FEE500] text-[#3A2929] font-semibold text-[14.5px] flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <MessageCircle size={17} fill="#3A2929" strokeWidth={0} />
          {loading ? "이동 중..." : "카카오로 시작하기"}
        </button>
        <button
          disabled
          title="네이버 로그인은 곧 지원될 예정이에요"
          className="w-full py-3.5 rounded-full bg-white border border-border-soft text-text-gray font-semibold text-[14.5px] flex items-center justify-center gap-2 opacity-60 cursor-not-allowed"
        >
          <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#03C75A] text-white text-[11px] font-bold">
            N
          </span>
          네이버로 시작하기 (준비 중)
        </button>
      </div>

      <button
        onClick={() => setShowEmail((v) => !v)}
        className="w-full flex items-center justify-center gap-1.5 text-[12.5px] text-text-gray mt-5 hover:text-primary-deep"
      >
        또는 아이디·비번으로 {showEmail ? "접기" : "시작하기"}
        <ChevronDown size={13} className={showEmail ? "rotate-180 transition-transform" : "transition-transform"} />
      </button>

      {showEmail && (
        <div className="mt-4 pt-5 border-t border-border-soft">
          <EmailAuthForm next={next} onSuccess={onEmailSuccess} />
        </div>
      )}

      <button onClick={onBack} className="w-full text-center text-[12.5px] text-text-gray mt-5 hover:text-primary-deep">
        ← 초대장 다시 보기
      </button>
    </div>
  );
}

function GuestScreen({
  onSeeRecipes,
  onSeeMap,
  onBackToInvite,
}: {
  onSeeRecipes: () => void;
  onSeeMap: () => void;
  onBackToInvite: () => void;
}) {
  return (
    <div className="px-8 pt-12 pb-8">
      <div className="text-center mb-5">
        <Compass size={36} className="text-primary-deep mx-auto mb-3" />
        <h2 className="text-[18px] font-bold text-text-dark leading-snug">
          좋아요. 먼저 천천히
          <br />
          둘러봐도 괜찮아요.
        </h2>
      </div>

      <p className="text-[13px] text-text-gray leading-relaxed mb-5">
        아직 시작이 부담스럽다면, 로그인 없이도 공개 레시피와 클로버 지도를 먼저 둘러볼 수
        있어요. 다만 나의 클로버 카드, 레시피 저장, 성장도 기록, 고민 남기기는 클로버 등록
        후 이용할 수 있어요.
      </p>

      <div className="grid grid-cols-2 gap-3 text-[12px] mb-6">
        <div className="bg-pale-green rounded-xl p-3.5">
          <p className="font-semibold text-text-dark mb-1.5">🔓 비회원도 가능</p>
          <ul className="text-text-gray leading-relaxed space-y-0.5">
            <li>홈 둘러보기</li>
            <li>공개 레시피 보기</li>
            <li>클로버 지도 탐색</li>
            <li>클로버 찾기 체험</li>
          </ul>
        </div>
        <div className="bg-soft-green rounded-xl p-3.5">
          <p className="font-semibold text-primary-deep mb-1.5">🔐 로그인 후 가능</p>
          <ul className="text-text-gray leading-relaxed space-y-0.5">
            <li>결과·레시피 저장</li>
            <li>나의 클로버 카드</li>
            <li>우체통 고민 남기기</li>
            <li>성장도·하트</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <button
          onClick={onSeeRecipes}
          className="w-full py-3 rounded-full border border-primary text-primary-deep font-semibold text-[13.5px] flex items-center justify-center gap-1.5 hover:bg-pale-green"
        >
          공개 레시피 먼저 보기 <ArrowRight size={14} />
        </button>
        <button
          onClick={onSeeMap}
          className="w-full py-3 rounded-full border border-border-soft text-text-dark font-semibold text-[13.5px] hover:bg-pale-green"
        >
          클로버 지도 둘러보기
        </button>
        <button
          onClick={onBackToInvite}
          className="w-full py-3 text-[12.5px] text-text-gray hover:text-primary-deep"
        >
          다시 초대장 보기
        </button>
      </div>

      <p className="text-center text-[11.5px] text-text-gray mt-5">
        준비되면 언제든 다시 시작할 수 있어요.
      </p>
    </div>
  );
}

function ActionScreen({
  copy,
  loading,
  onKakao,
  onKeepBrowsing,
  next,
  onEmailSuccess,
}: {
  copy: { title: string; body: string };
  loading: boolean;
  onKakao: () => void;
  onKeepBrowsing: () => void;
  next: string;
  onEmailSuccess: () => void;
}) {
  const [showEmail, setShowEmail] = useState(false);

  return (
    <div className="px-8 pt-12 pb-8 text-center">
      <CloverMascot className="w-20 h-20 mx-auto mb-5" />
      <h2 className="text-[19px] font-bold text-text-dark">{copy.title}</h2>
      <p className="text-[13px] text-text-gray mt-2.5 leading-relaxed">{copy.body}</p>

      <div className="flex flex-col gap-2.5 mt-7">
        <button
          onClick={onKakao}
          disabled={loading}
          className="w-full py-3.5 rounded-full bg-[#FEE500] text-[#3A2929] font-semibold text-[14.5px] flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <MessageCircle size={17} fill="#3A2929" strokeWidth={0} />
          {loading ? "이동 중..." : "카카오로 시작하기"}
        </button>
        <button
          onClick={onKeepBrowsing}
          className="w-full py-3.5 rounded-full bg-white border border-border-soft text-text-dark font-semibold text-[14.5px] hover:bg-pale-green"
        >
          계속 둘러보기
        </button>
      </div>

      <button
        onClick={() => setShowEmail((v) => !v)}
        className="w-full flex items-center justify-center gap-1.5 text-[12px] text-text-gray mt-5 hover:text-primary-deep"
      >
        또는 아이디·비번으로 {showEmail ? "접기" : "시작하기"}
        <ChevronDown size={12} className={showEmail ? "rotate-180 transition-transform" : "transition-transform"} />
      </button>

      {showEmail && (
        <div className="mt-4 pt-5 border-t border-border-soft text-left">
          <EmailAuthForm next={next} onSuccess={onEmailSuccess} />
        </div>
      )}
    </div>
  );
}
