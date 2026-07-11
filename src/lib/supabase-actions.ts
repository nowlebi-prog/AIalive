import { createClient } from "@/lib/supabase/client";
import { GROWTH_POINTS, type GrowthActionType } from "@/lib/growth";

const DESCRIPTIONS: Record<GrowthActionType, string> = {
  signup: "첫 가입을 축하해요!",
  diagnosis_complete: "클로버 찾기 진단을 완료했어요.",
  mailbox_submit: "클로버 우체통에 고민을 남겼어요.",
  recipe_save: "레시피를 저장했어요.",
  heart_received: "공개 결과가 하트를 받았어요.",
  recipe_complete: "레시피를 끝까지 완료했어요.",
};

/** Best-effort: never throws, since growth points should never block the main action. */
export async function awardGrowth(actionType: GrowthActionType) {
  try {
    const supabase = createClient();
    const { error } = await supabase.rpc("award_growth_points", {
      p_action_type: actionType,
      p_points: GROWTH_POINTS[actionType],
      p_description: DESCRIPTIONS[actionType],
    });
    if (error) console.error("awardGrowth failed:", error.message);
  } catch (err) {
    console.error("awardGrowth failed:", err);
  }
}
