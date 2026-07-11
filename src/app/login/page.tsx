import { TopNav } from "@/components/shared/TopNav";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { CloverMascot } from "@/components/icons/CloverMascot";
import { CloverLogomark } from "@/components/icons/CloverLogomark";
import { KakaoLoginButton, NaverLoginButton } from "@/components/shared/LoginButtons";
import { Shield, BookOpen, MessageCircleHeart } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-mint-bg relative overflow-hidden">
      <TopNav showLoginCta={false} />

      <div className="max-w-5xl mx-auto px-6 pt-6 pb-20 grid md:grid-cols-[1fr_auto] gap-10 items-center">
        <Card className="p-8 md:p-12 max-w-xl w-full mx-auto">
          <div className="flex justify-center mb-5">
            <CloverLogomark size={48} />
          </div>
          <div className="text-center">
            <p className="text-[13px] text-text-gray">AI 시대에서 살아남기</p>
            <h1 className="text-[22px] font-bold text-text-dark mt-1">
              내 일에 맞는 네잎클로버를 찾는 여정
            </h1>
            <p className="text-[24px] font-bold text-text-dark mt-5">
              클로버 여정에 함께할까요?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-7">
            <Button href="/clover-finder" variant="primary" size="lg">
              🌱 네, 시작할게요
            </Button>
            <Button href="/clover-map" variant="secondary" size="lg">
              👀 먼저 둘러볼게요
            </Button>
          </div>

          <div className="flex items-center gap-3 my-7">
            <div className="h-px bg-border-soft flex-1" />
            <span className="text-[12px] text-text-gray">간편하게 시작하기</span>
            <div className="h-px bg-border-soft flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <KakaoLoginButton />
            <NaverLoginButton />
          </div>

          <div className="grid grid-cols-3 gap-3 mt-8 pt-7 border-t border-border-soft text-center">
            <BenefitItem
              icon={<Shield size={18} className="text-primary-deep" />}
              title="생존번호 발급"
              desc="AI 시대 생존을 위한 나만의 생존번호"
            />
            <BenefitItem
              icon={<BookOpen size={18} className="text-primary-deep" />}
              title="무료 레시피 둘러보기"
              desc="일과 성장을 위한 맞춤 레시피 확인"
            />
            <BenefitItem
              icon={<MessageCircleHeart size={18} className="text-primary-deep" />}
              title="고민 남기기"
              desc="익명으로 고민을 남기고 맞춤 인사이트 받기"
            />
          </div>

          <p className="text-center text-[12px] text-text-gray mt-7">
            🔒 로그인하면 더 많은 기능을 이용할 수 있어요!
          </p>
        </Card>

        <div className="hidden md:flex justify-center">
          <CloverMascot className="w-72 h-72" />
        </div>
      </div>
    </div>
  );
}

function BenefitItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-9 h-9 rounded-full bg-soft-green flex items-center justify-center">
        {icon}
      </div>
      <p className="text-[12px] font-semibold text-text-dark leading-tight">{title}</p>
      <p className="text-[10.5px] text-text-gray leading-tight">{desc}</p>
    </div>
  );
}
