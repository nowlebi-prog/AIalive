export const TARGET_OPTIONS = [
  "1인사업자/프리랜서",
  "소상공인",
  "직장인/실무자",
] as const;

export const PURPOSE_OPTIONS = [
  "홈페이지",
  "브랜딩",
  "콘텐츠",
  "업무정리",
  "자동화",
  "고객응대",
] as const;

export const TIME_OPTIONS = ["10분", "30분", "1시간", "3시간+"] as const;

export const DIFFICULTY_OPTIONS = ["가벼움", "보통", "차근차근"] as const;

export const TOOL_OPTIONS = [
  "ChatGPT",
  "Claude",
  "Canva",
  "Notion",
  "Vercel",
  "Google Sheets",
] as const;

export type SortOption = "popular" | "easy" | "most_saved" | "newest";

export const SORT_LABELS: Record<SortOption, string> = {
  popular: "많이 찾는 순",
  easy: "쉬운 순",
  most_saved: "저장 많은 순",
  newest: "최신순",
};

export const DIFFICULTY_ORDER: Record<string, number> = {
  가벼움: 0,
  보통: 1,
  차근차근: 2,
};
