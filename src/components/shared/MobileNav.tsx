"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, MapPinned, Mailbox, IdCard } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/home", label: "홈", icon: Home },
  { href: "/clover-finder", label: "찾기", icon: Search },
  { href: "/clover-map", label: "지도", icon: MapPinned },
  { href: "/mailbox", label: "우체통", icon: Mailbox },
  { href: "/my-clover-card", label: "카드", icon: IdCard },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-border-soft flex items-stretch px-2 pb-[env(safe-area-inset-bottom)]">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
              active ? "text-primary-deep" : "text-text-gray"
            )}
          >
            <Icon size={19} strokeWidth={active ? 2.4 : 2} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
