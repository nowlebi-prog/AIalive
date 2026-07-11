"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, MapPinned, Mailbox, IdCard, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { CloverLogomark } from "@/components/icons/CloverLogomark";
import { CloverMascot } from "@/components/icons/CloverMascot";
import { useLoginModal } from "@/lib/login-modal-context";
import type { Profile } from "@/types/database";

const NAV_ITEMS = [
  { href: "/home", label: "홈", icon: Home },
  { href: "/clover-finder", label: "클로버 찾기", icon: Search },
  { href: "/clover-map", label: "클로버 지도", icon: MapPinned },
  { href: "/mailbox", label: "클로버 우체통", icon: Mailbox },
  { href: "/my-clover-card", label: "나의 클로버 카드", icon: IdCard },
];

export function Sidebar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();
  const { open } = useLoginModal();

  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-border-soft bg-white px-5 py-6">
      <Link href="/home" className="flex items-center gap-2.5 px-2 mb-8">
        <CloverLogomark size={34} />
        <div className="leading-tight">
          <p className="font-bold text-[15px] text-text-dark">Clover Desk</p>
          <p className="text-[11px] text-text-gray">soft personal dashboard</p>
        </div>
      </Link>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-medium transition-colors",
                active
                  ? "bg-soft-green text-primary-deep"
                  : "text-text-gray hover:bg-pale-green hover:text-text-dark"
              )}
            >
              <Icon size={18} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-2xl bg-gradient-to-b from-soft-green to-pale-green p-4 flex flex-col items-center text-center">
        <CloverMascot className="w-16 h-16 mb-2" />
        <p className="text-[13px] font-semibold text-primary-deep leading-snug">
          오늘도 행운이
          <br />
          함께하길 바라요!
        </p>
        <p className="text-[11px] text-text-gray mt-1">
          당신의 성장을 응원하는 Clover Desk
        </p>
      </div>

      <div className="mt-auto pt-6 flex flex-col gap-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13px] text-text-gray hover:bg-pale-green"
        >
          <Settings size={16} />
          설정
        </Link>
        {profile ? (
          <div className="flex items-center gap-3 px-3.5 py-2.5 mt-1 border-t border-border-soft pt-4">
            <div className="w-9 h-9 rounded-full bg-soft-green flex items-center justify-center shrink-0">
              <CloverMascot className="w-7 h-7" />
            </div>
            <div className="leading-tight min-w-0">
              <p className="text-[13px] font-semibold text-text-dark truncate">
                {profile.nickname ?? "클로버 씨"}
              </p>
              <p className="text-[11px] text-text-gray truncate">
                {profile.clover_number
                  ? `첫 클로버 ${String(profile.clover_number).padStart(3, "0")}`
                  : "게스트"}
              </p>
            </div>
            <form action="/auth/signout" method="post" className="ml-auto">
              <button
                type="submit"
                className="text-text-gray hover:text-heart transition-colors"
                aria-label="로그아웃"
              >
                <LogOut size={16} />
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-1 border-t border-border-soft pt-4 px-1">
            <p className="text-[11.5px] text-text-gray mb-2.5 px-2.5">
              둘러보는 중이에요. 저장하고 이어가려면 클로버 등록이 필요해요.
            </p>
            <button
              onClick={() => open({ step: "invite" })}
              className="w-full py-2.5 rounded-full bg-primary text-white text-[13px] font-semibold hover:bg-primary-deep"
            >
              클로버 등록하기
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
