export type LoginModalStep = "invite" | "benefits" | "guest" | "action";

export type LoginModalActionContext =
  | "recipe_save"
  | "finder_result_save"
  | "heart"
  | "mailbox"
  | "clover_card"
  | "generic";

export interface ActionCopy {
  title: string;
  body: string;
}

export const ACTION_COPY: Record<LoginModalActionContext, ActionCopy> = {
  recipe_save: {
    title: "이 클로버를 저장해둘까요?",
    body: "로그인하면 지금 찾은 레시피를 나의 클로버 카드에 저장하고, 나중에 다시 이어볼 수 있어요.",
  },
  finder_result_save: {
    title: "이 결과를 저장해둘까요?",
    body: "로그인하면 방금 찾은 진단 결과와 레시피를 나의 클로버 카드에 기록해둘 수 있어요.",
  },
  heart: {
    title: "마음을 전해볼까요?",
    body: "로그인하면 하트를 남기고, 내가 응원한 기록도 나의 클로버 카드에 함께 쌓여요.",
  },
  mailbox: {
    title: "고민을 남겨볼까요?",
    body: "로그인하면 고민을 편하게 남기고, 운영자의 답변을 나의 클로버 카드에서 확인할 수 있어요.",
  },
  clover_card: {
    title: "나의 클로버 카드가 아직 없어요",
    body: "로그인하면 클로버 번호가 발급되고, 저장한 레시피와 성장 기록이 이 카드 하나에 모여요.",
  },
  generic: {
    title: "클로버 등록이 필요해요",
    body: "이 기능은 클로버 등록 후 사용할 수 있어요. 저장하고 이어가려면 클로버 등록이 필요해요.",
  },
};

export const SIGNUP_BENEFITS = [
  { emoji: "🍀", label: "나의 클로버 카드 생성" },
  { emoji: "🔢", label: "클로버 번호 발급" },
  { emoji: "🧭", label: "클로버 찾기 결과 저장" },
  { emoji: "🔖", label: "레시피 저장" },
  { emoji: "🌱", label: "성장도 기록" },
  { emoji: "📮", label: "클로버 우체통에 고민 남기기" },
  { emoji: "👑", label: "첫 클로버 100인 평생 무료 혜택" },
] as const;
