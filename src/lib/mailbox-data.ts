export const INDUSTRY_OPTIONS = [
  "1인사업자/프리랜서",
  "소상공인",
  "직장인/실무자",
  "IT/SaaS",
  "제조/생산",
  "유통/커머스",
  "교육/교육서비스",
  "의료/헬스케어",
  "기타",
] as const;

export const REQUESTED_INDUSTRY_CHIPS = [
  { value: "IT/SaaS", emoji: "💻" },
  { value: "제조/생산", emoji: "🏭" },
  { value: "유통/커머스", emoji: "🛍️" },
  { value: "교육/교육서비스", emoji: "📚" },
  { value: "의료/헬스케어", emoji: "🩺" },
  { value: "기타 업종", emoji: "➕" },
] as const;

export const MAILBOX_STATUS_LABELS: Record<string, string> = {
  received: "접수",
  reviewing: "검토 중",
  in_progress: "레시피 준비 중",
  completed: "반영 완료",
};

export const MAILBOX_STATUS_COLORS: Record<string, string> = {
  received: "bg-pale-green text-text-gray",
  reviewing: "bg-soft-green text-primary-deep",
  in_progress: "bg-warning/20 text-warning",
  completed: "bg-primary/15 text-primary-deep",
};
