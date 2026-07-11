"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/shared/Button";
import { MessageCircle } from "lucide-react";

export function KakaoLoginButton() {
  const [loading, setLoading] = useState(false);

  async function handleKakaoLogin() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setLoading(false);
      alert("로그인 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.");
    }
  }

  return (
    <Button
      variant="kakao"
      size="lg"
      className="w-full"
      onClick={handleKakaoLogin}
      disabled={loading}
      icon={<MessageCircle size={18} fill="#3A2929" strokeWidth={0} />}
    >
      {loading ? "이동 중..." : "카카오 로그인"}
    </Button>
  );
}

export function NaverLoginButton() {
  return (
    <Button
      variant="naver"
      size="lg"
      className="w-full"
      disabled
      title="네이버 로그인은 곧 지원될 예정이에요"
    >
      <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#03C75A] text-white text-[11px] font-bold">
        N
      </span>
      네이버 로그인 (준비 중)
    </Button>
  );
}
