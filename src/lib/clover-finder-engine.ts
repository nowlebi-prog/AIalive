import { FinderAnswers, ResultTypeId, RESULT_TYPES } from "./clover-finder-data";

export interface FinderResult {
  resultType: ResultTypeId | null;
  /** 0-4, used for the "매칭 강도" clover-dot indicator */
  matchScore: number;
}

/**
 * Rule-based (non-AI) recommendation.
 * Score = 3 points per selected focus area matching a result type,
 * +1 bonus if only one focus area is selected (clearer signal),
 * +1 bonus when desired_result implies deeper engagement ("새로운 일을 시도" / "수익").
 * Highest score wins; ties break by selection order.
 */
export function computeFinderResult(answers: FinderAnswers): FinderResult {
  if (answers.focusAreas.length === 0) {
    return { resultType: null, matchScore: 0 };
  }

  const scores = new Map<ResultTypeId, number>();
  answers.focusAreas.forEach((area, idx) => {
    const base = 3 - idx * 0.1; // earlier selections weigh slightly more
    scores.set(area, (scores.get(area) ?? 0) + base);
  });

  if (answers.focusAreas.length === 1) {
    const only = answers.focusAreas[0];
    scores.set(only, (scores.get(only) ?? 0) + 1);
  }

  if (
    answers.desiredResult === "새로운 일을 시도하고 싶어요" ||
    answers.desiredResult === "수익/성과를 높이고 싶어요"
  ) {
    const top = answers.focusAreas[0];
    scores.set(top, (scores.get(top) ?? 0) + 0.5);
  }

  let best: ResultTypeId = answers.focusAreas[0];
  let bestScore = -Infinity;
  scores.forEach((score, type) => {
    if (score > bestScore) {
      bestScore = score;
      best = type;
    }
  });

  // Map raw score onto a 1-4 dot scale for the UI.
  const dots = answers.focusAreas.length === 1 ? 4 : Math.max(2, 4 - (answers.focusAreas.length - 1));

  return { resultType: best, matchScore: dots };
}

export function getRecommendedRecipeCategories(resultType: ResultTypeId | null): string[] {
  if (!resultType) return [];
  return RESULT_TYPES[resultType].recipeCategories;
}
