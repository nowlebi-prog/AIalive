export type UserRole = "user" | "admin";
export type MailboxStatus = "received" | "reviewing" | "in_progress" | "completed";
export type Difficulty = "가벼움" | "보통" | "차근차근";
export type HeartTargetType = "recipe" | "public_result";

export type GrowthStage =
  | "클로버 씨"
  | "작은 새싹"
  | "차근차근 시작"
  | "꾸준한 발견자"
  | "나만의 길 찾는 중";

export interface Profile {
  id: string;
  email: string | null;
  phone: string | null;
  nickname: string | null;
  avatar_url: string | null;
  provider: string | null;
  clover_number: number | null;
  role: UserRole;
  current_stage: GrowthStage;
  growth_points: number;
  card_theme: string;
  created_at: string;
  updated_at: string;
}

export interface CloverDiagnosis {
  id: string;
  user_id: string | null;
  user_type: string | null;
  pain_categories: string[] | null;
  ai_experience: string | null;
  desired_result: string | null;
  result_type: string | null;
  created_at: string;
}

export interface CloverMailbox {
  id: string;
  user_id: string;
  industry: string | null;
  pain_title: string | null;
  desired_outcome: string | null;
  current_situation: string | null;
  free_text: string | null;
  requested_industry: string | null;
  allow_anonymous_use: boolean;
  status: MailboxStatus;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  target_users: string[] | null;
  categories: string[] | null;
  tools: string[] | null;
  difficulty: Difficulty | null;
  estimated_time: string | null;
  estimated_cost: string | null;
  thumbnail_url: string | null;
  is_public: boolean;
  is_premium: boolean;
  view_count: number;
  save_count: number;
  heart_count: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface RecipeStep {
  id: string;
  recipe_id: string;
  step_order: number;
  title: string;
  description: string | null;
  checklist: { label: string; done?: boolean }[] | null;
  prompt_text: string | null;
  tip: string | null;
  screenshot_urls: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
}

export interface Heart {
  id: string;
  user_id: string;
  target_type: HeartTargetType;
  target_id: string;
  created_at: string;
}

export interface PublicResult {
  id: string;
  title: string;
  summary: string | null;
  image_url: string | null;
  source_mailbox_id: string | null;
  related_recipe_id: string | null;
  heart_count: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface GrowthLog {
  id: string;
  user_id: string;
  action_type: string;
  points: number;
  description: string | null;
  created_at: string;
}

// Minimal Database generic shape so @supabase/ssr generics are happy.
// Can be replaced later with `supabase gen types typescript`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = any;

/**
 * Trimmed field set for list/browse views (Clover Map, Finder results).
 * Detail pages fetch the full `Recipe` row instead — keeps list payloads small.
 */
export type RecipeListItem = Pick<
  Recipe,
  | "id"
  | "title"
  | "slug"
  | "summary"
  | "target_users"
  | "categories"
  | "tools"
  | "difficulty"
  | "estimated_time"
  | "thumbnail_url"
  | "is_premium"
  | "save_count"
  | "heart_count"
  | "view_count"
  | "created_at"
>;

export const RECIPE_LIST_COLUMNS =
  "id, title, slug, summary, target_users, categories, tools, difficulty, estimated_time, thumbnail_url, is_premium, save_count, heart_count, view_count, created_at";

