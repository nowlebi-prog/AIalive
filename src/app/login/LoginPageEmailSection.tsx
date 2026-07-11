"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { EmailAuthForm } from "@/components/shared/EmailAuthForm";

export function LoginPageEmailSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/clover-finder";
  const [show, setShow] = useState(false);

  return (
    <div className="mt-6">
      <button
        onClick={() => setShow((v) => !v)}
        className="w-full flex items-center justify-center gap-1.5 text-[12.5px] text-text-gray hover:text-primary-deep"
      >
        또는 아이디·비번으로 {show ? "접기" : "시작하기"}
        <ChevronDown size={13} className={show ? "rotate-180 transition-transform" : "transition-transform"} />
      </button>
      {show && (
        <div className="mt-4 pt-5 border-t border-border-soft">
          <EmailAuthForm next={next} onSuccess={() => router.push(next)} />
        </div>
      )}
    </div>
  );
}
