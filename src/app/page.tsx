import Link from "next/link";
import { TopNav } from "@/components/shared/TopNav";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { CloverMascot } from "@/components/icons/CloverMascot";
import { OpenLoginModalButton } from "@/components/shared/OpenLoginModalButton";
import { Briefcase, Store, Users2, Mailbox, ArrowRight } from "lucide-react";

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

const RECIPE_HIGHLIGHTS = [
  {
    title: "3시간 만에 개인 홈페이지 만들기",
    target: "1인사업자",
    time: "3시간",
    level: "가벼움",
  },
  {
    title: "릴스 10개 기획안 한 번에 뽑기",
    target: "소상공인",
    time: "1시간",
    level: "보통",
  },
  {
    title: "반복 업무 리스트 정리하기",
    target: "직장인",
    time: "30분",
    level: "가벼움",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-mint-bg">
      <TopNav />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-8 pb-16 grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        <div>
          <p className="inline-block text-[13px] font-semibold text-primary-deep bg-soft-green px-3 py-1.5 rounded-full mb-5">
            내 일에 맞는 네잎클로버를 찾는 여정
          </p>
          <h1 className="text-[34px] md:text-[44px] font-bold leading-[1.3] text-text-dark">
            오늘 당신에게 필요한
            <br />
            <span className="text-primary">네잎클로버</span>는 무엇인가요?
          </h1>
          <p className="mt-5 text-[16px] text-text-gray leading-relaxed">
            일과 하루를 더 가볍게, 더 잘 해낼 수 있도록 AI 클로버가 도와드릴게요.
            <br />
            무섭게 따라가기보다, 내 일에 맞는 작은 해결책을 하나씩 발견하는 여정이에요.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/clover-finder" size="lg">
              🍀 클로버 찾기 시작
            </Button>
            <Button href="/clover-map" variant="secondary" size="lg">
              공개 레시피 둘러보기
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-soft-green rounded-full blur-3xl opacity-60" />
            <CloverMascot className="w-64 h-64 relative" />
          </div>
        </div>
      </section>

      {/* 첫 클로버 100인 */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <Card className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-soft-green to-pale-green border-none">
          <div>
            <p className="text-[13px] font-semibold text-primary-deep">
              👑 지금 시작하면 평생 무료!
            </p>
            <h2 className="text-[22px] font-bold text-text-dark mt-2">
              첫 클로버 100인에게 기본 기능 평생 무료 혜택을 드려요
            </h2>
            <p className="text-[14px] text-text-gray mt-2">
              초기 100명에게만 드리는 특별한 혜택이에요. 지금 가입하면 평생 함께해요.
            </p>
          </div>
          <OpenLoginModalButton className="shrink-0">
            첫 클로버 100인 되기
          </OpenLoginModalButton>
        </Card>
      </section>

      {/* Target cards */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-[20px] font-bold text-text-dark mb-1">
          어떤 여정을 시작하고 계신가요?
        </h2>
        <p className="text-[14px] text-text-gray mb-6">
          당신의 자리에 맞는 클로버를 먼저 보여드릴게요.
        </p>
        <div className="grid md:grid-cols-3 gap-5">
          {TARGET_CARDS.map((card) => (
            <Card key={card.title} className="p-6 hover:shadow-[var(--shadow-soft)] transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-pale-green flex items-center justify-center mb-4">
                <card.icon size={20} className="text-primary-deep" />
              </div>
              <h3 className="font-bold text-[16px] text-text-dark">{card.title}</h3>
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

      {/* Recipe highlights */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[20px] font-bold text-text-dark">추천 클로버 레시피</h2>
            <p className="text-[14px] text-text-gray mt-1">
              지금 가장 많이 활용되는 AI 활용 팁이에요.
            </p>
          </div>
          <Link
            href="/clover-map"
            className="text-[13px] font-semibold text-primary-deep flex items-center gap-1 shrink-0"
          >
            전체 보기 <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {RECIPE_HIGHLIGHTS.map((r) => (
            <Card key={r.title} className="p-5">
              <div className="aspect-[4/3] rounded-2xl bg-pale-green mb-4 flex items-center justify-center">
                <CloverMascot className="w-14 h-14" />
              </div>
              <h3 className="font-semibold text-[15px] text-text-dark leading-snug">
                {r.title}
              </h3>
              <div className="flex items-center gap-2 mt-3 text-[12px] text-text-gray">
                <span className="bg-pale-green text-primary-deep px-2 py-0.5 rounded-full">
                  {r.target}
                </span>
                <span>{r.time}</span>
                <span>·</span>
                <span>{r.level}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Mailbox CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <Card className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 rounded-2xl bg-soft-green flex items-center justify-center shrink-0">
            <Mailbox size={26} className="text-primary-deep" />
          </div>
          <div className="flex-1">
            <h2 className="text-[19px] font-bold text-text-dark">
              요즘 당신이 찾고 있는 클로버는 무엇인가요?
            </h2>
            <p className="text-[14px] text-text-gray mt-2 leading-relaxed">
              지금 막막한 일을 편하게 남겨주세요. 운영자만 확인하고, 더 나은 레시피로
              이어갈게요. 작성하신 내용은 외부에 공개되지 않습니다.
            </p>
          </div>
          <Button href="/mailbox" variant="secondary" size="lg" className="shrink-0">
            고민 남기기
          </Button>
        </Card>
      </section>

      <footer className="border-t border-border-soft py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-text-gray">
          <p>© 2026 Clover Desk · AI 시대에서 살아남기</p>
          <p>무섭게 따라가기보다, 내 일에 맞는 작은 해결책을 하나씩 발견하는 여정.</p>
        </div>
      </footer>
    </div>
  );
}
