import Link from "next/link";
import { CloverLogomark } from "@/components/icons/CloverLogomark";
import { Button } from "@/components/shared/Button";
import { OpenLoginModalButton } from "@/components/shared/OpenLoginModalButton";

export function TopNav({ showLoginCta = true }: { showLoginCta?: boolean }) {
  return (
    <header className="w-full">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <CloverLogomark size={34} />
          <div className="leading-tight">
            <p className="font-bold text-[16px] text-text-dark">Clover Desk</p>
            <p className="text-[11px] text-text-gray">AI 시대의 내 일 가이드</p>
          </div>
        </Link>
        {showLoginCta && (
          <div className="flex items-center gap-2">
            <Button href="/clover-map" variant="secondary" size="sm">
              둘러보기
            </Button>
            <OpenLoginModalButton className="px-4 py-2 text-[13px]">
              클로버 등록
            </OpenLoginModalButton>
          </div>
        )}
      </div>
    </header>
  );
}
