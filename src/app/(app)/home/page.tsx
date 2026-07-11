import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { CloverMascot } from "@/components/icons/CloverMascot";
import { Briefcase, Store, Users2, ArrowRight } from "lucide-react";

const TARGET_CARDS = [
  {
    icon: Briefcase,
    title: "1인사업자 / 프리랜서",
    desc: "기획부터 마케팅, 문서 작성까지 혼자서도 더 가볍게.",
    tags: ["#기획", "#마케팅", "#콘텐츠"],
  },
  {
    icon: Store,
    title: "소상공인",
    desc: "매출, 고객관리, 홍보까지 사업 운영을 더 쉽게.",
    tags: ["#매출관리", "#고객응대", "#홍보"],
  },
  {
    icon: Users2,
    title: "직장인 / 실무자",
    desc: "문서, 보고서, 반복업무를 더 빠르고 효율적으로.",
    tags: ["#문서", "#보고서", "#업무자동화"],
  },
];

export default async function HomePage() {
  const profile = await getCurrentProfile();

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <p className="text-[13px] text-text-gray mb-1">
        {profile ? `${profile.nickname ?? "클로버"}님, 좋은 하루예요! 🍀` : "환영해요 🍀"}
      </p>

      <section className="rounded-[var(--radius-card)] bg-gradient-to-br from-white to-soft-green p-8 md:p-10 flex items-center justify-between gap-8 border border-border-soft">
        <div>
          <h1 className="text-[26px] md:text-[30px] font-bold text-text-dark leading-snug">
            오늘 당신에게 필요한
            <br />
            <span className="text-primary">네잎클로버</span>는 무엇인가요?
          </h1>
          <p className="text-[14px] text-text-gray mt-3">
            일과 하루를 더 가볍게, 더 잘 해낼 수 있도록 AI 클로버가 도와드릴게요.
          </p>
          <Button href="/clover-finder" className="mt-6">
            클로버 찾기 시작
          </Button>
        </div>
        <CloverMascot className="w-32 h-32 shrink-0 hidden sm:block" />
      </section>

      <section className="mt-10">
        <h2 className="text-[17px] font-bold text-text-dark mb-4">어떤 여정을 시작하고 계신가요?</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {TARGET_CARDS.map((card) => (
            <Card key={card.title} className="p-6">
              <div className="w-11 h-11 rounded-xl bg-pale-green flex items-center justify-center mb-4">
                <card.icon size={20} className="text-primary-deep" />
              </div>
              <h3 className="font-bold text-[15px] text-text-dark">{card.title}</h3>
              <p className="text-[13px] text-text-gray mt-2 leading-relaxed">{card.desc}</p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] text-primary-deep bg-soft-green px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10 grid md:grid-cols-2 gap-5">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-bold text-text-dark">🍀 추천 클로버 레시피</h2>
            <Link href="/clover-map" className="text-[12px] font-semibold text-primary-deep flex items-center gap-1">
              전체 보기 <ArrowRight size={13} />
            </Link>
          </div>
          <p className="text-[13px] text-text-gray">
            클로버 지도가 다음 스프린트에서 열리면, 여기에 맞춤 레시피가 채워져요.
          </p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-soft-green to-pale-green border-none">
          <h2 className="text-[16px] font-bold text-primary-deep mb-2">👑 첫 클로버 100인</h2>
          <p className="text-[13px] text-text-gray leading-relaxed">
            지금 가입하면 기본 기능을 평생 무료로 사용할 수 있어요.
          </p>
          <p className="text-[26px] font-bold text-text-dark mt-3">
            {profile?.clover_number ? `첫 클로버 ${String(profile.clover_number).padStart(3, "0")}` : "가입 대기 중"}
          </p>
        </Card>
      </section>
    </div>
  );
}
