"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const ADMIN_EMAIL_DOMAIN = "clover.local";

function toAdminEmail(rawId: string) {
  const trimmed = rawId.trim();
  return trimmed.includes("@") ? trimmed : `${trimmed}@${ADMIN_EMAIL_DOMAIN}`;
}

export function AdminLoginWidget() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id.trim() || !password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: toAdminEmail(id),
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("아이디 또는 비밀번호가 올바르지 않아요.");
      return;
    }

    setOpen(false);
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {open && (
        <form
          onSubmit={handleSubmit}
          className="w-64 bg-white rounded-2xl shadow-xl border border-border-soft p-4 flex flex-col gap-2.5"
        >
          <div className="flex items-center justify-between mb-0.5">
            <p className="text-[12.5px] font-semibold text-text-dark">관리자 로그인</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-text-gray hover:text-text-dark"
              aria-label="닫기"
            >
              <X size={14} />
            </button>
          </div>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="아이디"
            autoComplete="username"
            className="w-full px-3.5 py-2 rounded-lg border border-border-soft text-[13px] outline-none focus:border-primary"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            autoComplete="current-password"
            className="w-full px-3.5 py-2 rounded-lg border border-border-soft text-[13px] outline-none focus:border-primary"
          />
          {error && <p className="text-[11.5px] text-heart">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-primary text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 hover:bg-primary-deep disabled:opacity-60"
          >
            {loading && <Loader2 size={13} className="animate-spin" />}
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="관리자 로그인"
        className="w-9 h-9 rounded-full bg-white/80 border border-border-soft text-text-gray hover:text-primary-deep hover:bg-white flex items-center justify-center shadow-sm backdrop-blur-sm"
      >
        <Lock size={14} />
      </button>
    </div>
  );
}
