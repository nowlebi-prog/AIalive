"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { normalizePhone, isValidKoreanPhone } from "@/lib/phone";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";

type Mode = "signup" | "login";

export function EmailAuthForm({
  next,
  onSuccess,
}: {
  next: string;
  onSuccess: () => void;
}) {
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsEmailConfirm, setNeedsEmailConfirm] = useState(false);

  function validate(): string | null {
    if (!email.trim()) return "아이디(이메일)를 입력해주세요.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "이메일 형식이 올바르지 않아요.";
    if (password.length < 8) return "비밀번호는 8자 이상이어야 해요.";
    if (mode === "signup") {
      if (password !== passwordConfirm) return "비밀번호가 서로 달라요.";
      if (!isValidKoreanPhone(phone)) return "전화번호를 정확히 입력해주세요. (예: 010-1234-5678)";
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const supabase = createClient();

    if (mode === "login") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      setLoading(false);
      if (signInError) {
        setError("아이디 또는 비밀번호가 올바르지 않아요.");
        return;
      }
      onSuccess();
      return;
    }

    // signup mode — check phone uniqueness before creating the auth user
    const normalizedPhone = normalizePhone(phone);
    const { data: phoneExists, error: checkError } = await supabase.rpc("check_phone_exists", {
      p_phone: normalizedPhone,
    });

    if (checkError) {
      setLoading(false);
      setError("확인 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.");
      return;
    }
    if (phoneExists) {
      setLoading(false);
      setError("이미 등록된 전화번호예요. 로그인을 시도해보세요.");
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { phone: normalizedPhone },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    setLoading(false);

    if (signUpError) {
      if (signUpError.message.toLowerCase().includes("already registered")) {
        setError("이미 가입된 이메일이에요. 로그인을 시도해보세요.");
      } else {
        setError("가입 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.");
      }
      return;
    }

    if (data.session) {
      // Email confirmation is off for this project — signed in immediately.
      onSuccess();
    } else {
      // Email confirmation required — user must click the link we just sent.
      setNeedsEmailConfirm(true);
    }
  }

  if (needsEmailConfirm) {
    return (
      <div className="text-center py-4">
        <CheckCircle2 size={28} className="text-primary mx-auto mb-3" />
        <p className="text-[13.5px] font-semibold text-text-dark">가입 확인 이메일을 보냈어요</p>
        <p className="text-[12.5px] text-text-gray mt-1.5 leading-relaxed">
          {email}로 보낸 메일의 링크를 눌러야 로그인이 완료돼요.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex bg-pale-green rounded-full p-1 mb-1">
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex-1 py-2 rounded-full text-[12.5px] font-semibold transition-colors ${
            mode === "signup" ? "bg-white text-primary-deep shadow-sm" : "text-text-gray"
          }`}
        >
          회원가입
        </button>
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 py-2 rounded-full text-[12.5px] font-semibold transition-colors ${
            mode === "login" ? "bg-white text-primary-deep shadow-sm" : "text-text-gray"
          }`}
        >
          로그인
        </button>
      </div>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="아이디 (이메일)"
        autoComplete="email"
        className="w-full px-4 py-2.5 rounded-xl border border-border-soft text-[13.5px] outline-none focus:border-primary"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호 (8자 이상)"
        autoComplete={mode === "signup" ? "new-password" : "current-password"}
        className="w-full px-4 py-2.5 rounded-xl border border-border-soft text-[13.5px] outline-none focus:border-primary"
      />

      {mode === "signup" && (
        <>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="비밀번호 확인"
            autoComplete="new-password"
            className="w-full px-4 py-2.5 rounded-xl border border-border-soft text-[13.5px] outline-none focus:border-primary"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="전화번호 (010-1234-5678)"
            autoComplete="tel"
            className="w-full px-4 py-2.5 rounded-xl border border-border-soft text-[13.5px] outline-none focus:border-primary"
          />
          <p className="text-[11px] text-text-gray -mt-1 px-1">
            전화번호는 중복 가입 확인에만 사용되고 공개되지 않아요.
          </p>
        </>
      )}

      {error && <p className="text-[12px] text-heart px-1">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-full bg-primary text-white font-semibold text-[13.5px] flex items-center justify-center gap-2 hover:bg-primary-deep disabled:opacity-60"
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <Mail size={15} />}
        {loading ? "처리 중..." : mode === "signup" ? "이메일로 가입하기" : "이메일로 로그인"}
      </button>
    </form>
  );
}
