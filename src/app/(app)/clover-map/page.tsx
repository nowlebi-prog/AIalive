import { createPublicClient } from "@/lib/supabase/public";
import { CloverMapClient } from "./CloverMapClient";
import { RECIPE_LIST_COLUMNS, type RecipeListItem } from "@/types/database";

// Public listing: no cookies/session read here, so this page can be
// statically rendered and revalidated on an interval rather than hitting
// the DB on every request. Only the minimal list columns are selected.
export const revalidate = 300; // 5 minutes

export default async function CloverMapPage() {
  const supabase = createPublicClient();

  const { data } = await supabase
    .from("recipes")
    .select(RECIPE_LIST_COLUMNS)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  return <CloverMapClient recipes={(data as unknown as RecipeListItem[]) ?? []} />;
}
