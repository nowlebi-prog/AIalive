"use client";

import { useState, useTransition } from "react";
import { updateUserRole } from "./actions";
import type { UserRole } from "@/types/database";

export function RoleToggle({
  userId,
  role,
  disabled,
}: {
  userId: string;
  role: UserRole;
  disabled?: boolean;
}) {
  const [current, setCurrent] = useState(role);
  const [pending, startTransition] = useTransition();

  function handleChange(next: UserRole) {
    setCurrent(next);
    startTransition(() => {
      updateUserRole(userId, next);
    });
  }

  return (
    <select
      value={current}
      disabled={disabled || pending}
      onChange={(e) => handleChange(e.target.value as UserRole)}
      className={`text-[12px] font-semibold px-2.5 py-1.5 rounded-full border outline-none ${
        current === "admin" ? "bg-soft-green border-primary text-primary-deep" : "bg-white border-border-soft text-text-gray"
      } disabled:opacity-60`}
    >
      <option value="user">일반 사용자</option>
      <option value="admin">관리자</option>
    </select>
  );
}
