export type ResultTypeId =
  | "homepage"
  | "reels"
  | "docs"
  | "branding"
  | "automation"
  | "customer";

export interface ResultTypeMeta {
  id: ResultTypeId;
  label: string; // "홈페이지 클로버"
  emoji: string;
  tags: string[];
  description: string;
  helpPoints: string[];
  recipeCategories: string[]; // matches recipes.categories in DB for recommendation lookup
}

export const RESULT_TYPES: Record<ResultTypeId, ResultTypeMeta> = {
  homepage: {
    id: "homepage",
    label: "홈페이지 클로버",
    emoji: "🖥️",
    tags: ["#홈페이지", "#포트폴리오", "#랜딩페이지"],
    description: "AI로 기획부터 디자인, 배포까지 나만의 웹사이트를 빠르게 완성해요.",
    helpPoints: [
      "홈페이지 구조와 콘텐츠 기획 아이디어 제공",
      "디자인 톤앤매너와 레이아웃 제안",
      "배포까지 이어지는 단계별 가이드",
    ],
    recipeCategories: ["홈페이지"],
  },
  reels: {
    id: "reels",
    label: "릴스 클로버",
    emoji: "🎬",
    tags: ["#콘텐츠제작", "#브랜딩", "#홍보"],
    description: "아이디어를 콘텐츠로 바꾸고, 효과적으로 알리는 데 강점을 보여요.",
    helpPoints: [
      "콘텐츠 기획과 구성 아이디어 제공",
      "릴스·숏폼 스크립트 및 대본 작성",
      "브랜드 톤에 맞는 문구·카피 생성",
    ],
    recipeCategories: ["콘텐츠"],
  },
  docs: {
    id: "docs",
    label: "업무정리 클로버",
    emoji: "📄",
    tags: ["#문서정리", "#보고서", "#자동요약"],
    description: "긴 문서와 반복되는 업무를 핵심만 남겨 깔끔하게 정리해요.",
    helpPoints: [
      "보고서·회의록 요약 템플릿 제공",
      "반복 업무 체크리스트 자동 정리",
      "문서 구조를 빠르게 잡아주는 가이드",
    ],
    recipeCategories: ["업무정리"],
  },
  branding: {
    id: "branding",
    label: "브랜딩 클로버",
    emoji: "🎨",
    tags: ["#브랜딩", "#아이덴티티", "#톤앤매너"],
    description: "나만의 색깔과 메시지를 정리해 브랜드다운 인상을 만들어요.",
    helpPoints: [
      "브랜드 톤앤매너와 핵심 메시지 정리",
      "슬로건·소개문 초안 작성",
      "일관된 브랜드 경험을 위한 가이드",
    ],
    recipeCategories: ["브랜딩"],
  },
  automation: {
    id: "automation",
    label: "자동화 클로버",
    emoji: "⚡",
    tags: ["#업무자동화", "#반복업무", "#시스템"],
    description: "반복되는 작업을 자동화해서 시간을 아낄 수 있도록 도와줘요.",
    helpPoints: [
      "반복 업무 흐름을 정리하고 자동화 지점 발견",
      "노코드 도구 연결 가이드 제공",
      "시간을 아끼는 워크플로우 설계",
    ],
    recipeCategories: ["자동화"],
  },
  customer: {
    id: "customer",
    label: "고객응대 클로버",
    emoji: "💬",
    tags: ["#고객응대", "#문의응답", "#친절한대응"],
    description: "고객 문의에 빠르고 친절하게 답할 수 있는 문구를 만들어줘요.",
    helpPoints: [
      "상황별 응대 문구 템플릿 제공",
      "톤을 유지하는 답변 초안 작성",
      "자주 묻는 질문 정리 가이드",
    ],
    recipeCategories: ["고객응대"],
  },
};

export interface ChipOption<T extends string = string> {
  value: T;
  label: string;
  emoji?: string;
  description?: string;
}

// Step 1 — 어떤 유형에 가장 가까우신가요
export const USER_TYPE_OPTIONS: ChipOption[] = [
  { value: "1인사업자/프리랜서", label: "1인사업자 / 프리랜서" },
  { value: "소상공인", label: "소상공인" },
  { value: "직장인/실무자", label: "직장인 / 실무자" },
];

// Step 1 — 지금 집중하고 싶은 분야 (직접 결과 유형으로 이어짐, 복수 선택 가능)
export const FOCUS_AREA_OPTIONS: ChipOption<ResultTypeId>[] = [
  { value: "homepage", label: "홈페이지 제작", emoji: "🖥️", description: "웹사이트·쇼핑몰 등" },
  { value: "reels", label: "릴스 / 홍보", emoji: "🎬", description: "콘텐츠 · 마케팅" },
  { value: "docs", label: "문서 / PPT", emoji: "📄", description: "보고서 · 발표자료" },
  { value: "branding", label: "브랜딩", emoji: "🎨", description: "아이덴티티 · 톤앤매너" },
  { value: "automation", label: "자동화", emoji: "⚡", description: "반복 업무 · 시스템" },
  { value: "customer", label: "고객응대", emoji: "💬", description: "문의 · 응대 메시지" },
];

// Step 2 — 현재 가장 막막한 일 (복수 선택 가능)
export const PAIN_OPTIONS: ChipOption[] = [
  { value: "아이디어가 떠오르지 않아요", label: "아이디어가 떠오르지 않아요" },
  { value: "자료 조사·정리가 오래 걸려요", label: "자료 조사·정리가 오래 걸려요" },
  { value: "디자인/구성이 어렵거나 막혀요", label: "디자인/구성이 어렵거나 막혀요" },
  { value: "완성까지 시간이 너무 오래 걸려요", label: "완성까지 시간이 너무 오래 걸려요" },
  { value: "일은 많은데 우선순위가 헷갈려요", label: "일은 많은데 우선순위가 헷갈려요" },
  { value: "기타", label: "기타" },
];

// Step 3 — AI 사용 경험 (단일 선택)
export const AI_EXPERIENCE_OPTIONS: ChipOption[] = [
  { value: "처음이에요", label: "처음이에요" },
  { value: "가끔 사용해요", label: "가끔 사용해요" },
  { value: "자주 사용해요", label: "자주 사용해요" },
  { value: "거의 전문가예요", label: "거의 전문가예요" },
];

// Step 4 — 원하는 결과 (단일 선택)
export const DESIRED_RESULT_OPTIONS: ChipOption[] = [
  { value: "업무 시간을 줄이고 싶어요", label: "업무 시간을 줄이고 싶어요" },
  { value: "더 좋은 결과물을 만들고 싶어요", label: "더 좋은 결과물을 만들고 싶어요" },
  { value: "새로운 일을 시도하고 싶어요", label: "새로운 일을 시도하고 싶어요" },
  { value: "수익/성과를 높이고 싶어요", label: "수익/성과를 높이고 싶어요" },
  { value: "나에게 맞는 방향을 찾고 싶어요", label: "나에게 맞는 방향을 찾고 싶어요" },
];

export interface FinderAnswers {
  userType: string | null;
  focusAreas: ResultTypeId[];
  pains: string[];
  aiExperience: string | null;
  desiredResult: string | null;
}

export const FINDER_STORAGE_KEY = "clover-finder-answers";

export const EMPTY_ANSWERS: FinderAnswers = {
  userType: null,
  focusAreas: [],
  pains: [],
  aiExperience: null,
  desiredResult: null,
};
