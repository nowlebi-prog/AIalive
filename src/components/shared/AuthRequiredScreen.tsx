"use client";

import { useEffect } from "react";
import { CloverMascot } from "@/components/icons/CloverMascot";
import { useLoginModal } from "@/lib/login-modal-context";
import { ACTION_COPY, type LoginModalActionContext } from "@/lib/login-modal-data";

export function AuthRequiredScreen({
  context,
  next,
}: {
  context: LoginModalActionContext;
  next: string;
}) {
  const { openForAction } = useLoginModal();
  const copy = ACTION_COPY[context];

  useEffect(() => {
    openForAction(context, next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-24 max-w-md mx-auto">
      <CloverMascot className="w-20 h-20 mb-5" />
      <h1 className="text-[18px] font-bold text-text-dark">{copy.title}</h1>
      <p className="text-[13px] text-text-gray mt-2 leading-relaxed">{copy.body}</p>
      <button
        onClick={() => openForAction(context, next)}
        className="mt-6 px-5 py-2.5 rounded-full text-[13.5px] font-semibold bg-primary text-white hover:bg-primary-deep"
      >
        클로버 등록하고 계속하기
      </button>
    </div>
  );
}
