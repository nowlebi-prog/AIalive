import type { GrowthStage } from "@/types/database";

export const GROWTH_POINTS = {
  signup: 100,
  diagnosis_complete: 100,
  mailbox_submit: 80,
  recipe_save: 20,
  heart_received: 10,
  recipe_complete: 100,
} as const;

export type GrowthActionType = keyof typeof GROWTH_POINTS;

const STAGE_THRESHOLDS: { min: number; stage: GrowthStage }[] = [
  { min: 1500, stage: "나만의 길 찾는 중" },
  { min: 700, stage: "꾸준한 발견자" },
  { min: 300, stage: "차근차근 시작" },
  { min: 100, stage: "작은 새싹" },
  { min: 0, stage: "클로버 씨" },
];

export function getStageForPoints(points: number): GrowthStage {
  const found = STAGE_THRESHOLDS.find((t) => points >= t.min);
  return found?.stage ?? "클로버 씨";
}

/** Returns { current, next, percentToNext } for progress UI (e.g. "다음 단계까지 27%"). */
export function getStageProgress(points: number) {
  const sorted = [...STAGE_THRESHOLDS].sort((a, b) => a.min - b.min);
  const idx = sorted.findIndex(
    (t, i) => points >= t.min && (i === sorted.length - 1 || points < sorted[i + 1].min)
  );
  const current = sorted[idx];
  const next = sorted[idx + 1];

  if (!next) {
    return { current: current.stage, next: null, percentToNext: 100 };
  }

  const range = next.min - current.min;
  const progressed = points - current.min;
  const percentToNext = Math.round((progressed / range) * 100);

  return { current: current.stage, next: next.stage, percentToNext };
}
