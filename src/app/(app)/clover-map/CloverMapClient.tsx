"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/shared/Card";
import { SaveButton } from "@/components/shared/SaveButton";
import { CloverMascot } from "@/components/icons/CloverMascot";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { createClient } from "@/lib/supabase/client";
import {
  TARGET_OPTIONS,
  PURPOSE_OPTIONS,
  TIME_OPTIONS,
  DIFFICULTY_OPTIONS,
  TOOL_OPTIONS,
  DIFFICULTY_ORDER,
  SORT_LABELS,
  type SortOption,
} from "@/lib/clover-map-data";
import type { RecipeListItem } from "@/types/database";
import { Building2, Target, Clock, Gauge, Wrench, RotateCcw, Search } from "lucide-react";

// Recipes are passed in already-fetched from the server (cached/ISR'd list).
// This component only handles client-side filtering/sorting and the
// logged-in user's own saved state — no recipe re-fetch happens here.
export function CloverMapClient({ recipes }: { recipes: RecipeListItem[] }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const [query, setQuery] = useState("");
  const [target, setTarget] = useState("");
  const [purpose, setPurpose] = useState("");
  const [time, setTime] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [tool, setTool] = useState("");
  const [sort, setSort] = useState<SortOption>("popular");

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: bookmarks } = await supabase
        .from("bookmarks")
        .select("recipe_id")
        .eq("user_id", user.id);
      setSavedIds(new Set((bookmarks ?? []).map((b: { recipe_id: string }) => b.recipe_id)));
    })();
  }, []);

  const popularTags = useMemo(() => {
    const counts = new Map<string, number>();
    recipes.forEach((r) => {
      [...(r.target_users ?? []), ...(r.categories ?? [])].forEach((tag) => {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      });
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [recipes]);

  const filtered = useMemo(() => {
    let list = recipes.filter((r) => {
      if (query && !r.title.toLowerCase().includes(query.toLowerCase())) return false;
      if (target && !(r.target_users ?? []).includes(target)) return false;
      if (purpose && !(r.categories ?? []).includes(purpose)) return false;
      if (time && r.estimated_time !== time) return false;
      if (difficulty && r.difficulty !== difficulty) return false;
      if (tool && !(r.tools ?? []).includes(tool)) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "easy":
          return (DIFFICULTY_ORDER[a.difficulty ?? ""] ?? 9) - (DIFFICULTY_ORDER[b.difficulty ?? ""] ?? 9);
        case "most_saved":
          return b.save_count - a.save_count;
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "popular":
        default:
          return b.view_count + b.heart_count - (a.view_count + a.heart_count);
      }
    });

    return list;
  }, [recipes, query, target, purpose, time, difficulty, tool, sort]);

  function resetFilters() {
    setQuery("");
    setTarget("");
    setPurpose("");
    setTime("");
    setDifficulty("");
    setTool("");
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <p className="text-[12px] text-text-gray mb-1">{today}</p>
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-[22px] font-bold text-text-dark">클로버 지도</h1>
      </div>
      <p className="text-[13px] text-text-gray mb-6">
        업종, 목적, 소요 시간, 난이도, 사용 툴로 나에게 맞는 레시피를 찾아보세요.
      </p>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-gray" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="어떤 레시피를 찾고 계신가요?"
          className="w-full pl-11 pr-4 py-3 rounded-full border border-border-soft bg-white text-[13.5px] outline-none focus:border-primary"
        />
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <FilterSelect icon={Building2} label="대상" value={target} options={TARGET_OPTIONS} onChange={setTarget} />
        <FilterSelect icon={Target} label="목적" value={purpose} options={PURPOSE_OPTIONS} onChange={setPurpose} />
        <FilterSelect icon={Clock} label="소요 시간" value={time} options={TIME_OPTIONS} onChange={setTime} />
        <FilterSelect icon={Gauge} label="난이도" value={difficulty} options={DIFFICULTY_OPTIONS} onChange={setDifficulty} />
        <FilterSelect icon={Wrench} label="사용 툴" value={tool} options={TOOL_OPTIONS} onChange={setTool} />
        <button
          onClick={resetFilters}
          className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-text-gray px-3 py-2 rounded-full border border-border-soft bg-white hover:bg-pale-green"
        >
          <RotateCcw size={13} /> 초기화
        </button>

        <div className="ml-auto flex items-center gap-1.5">
          {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={`text-[12px] font-medium px-3 py-1.5 rounded-full transition-colors ${
                sort === key ? "bg-soft-green text-primary-deep" : "text-text-gray hover:bg-pale-green"
              }`}
            >
              {SORT_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_240px] gap-8 items-start">
        {/* Recipe grid */}
        <section>
          {filtered.length === 0 ? (
            <Card className="p-12 text-center">
              <CloverMascot className="w-16 h-16 mx-auto mb-4" />
              <p className="text-[14px] font-semibold text-text-dark">
                조건에 맞는 레시피를 아직 못 찾았어요
              </p>
              <p className="text-[13px] text-text-gray mt-1.5">
                필터를 조정해보시거나, 클로버 우체통에 원하는 레시피를 남겨주세요.
              </p>
              <Link href="/mailbox" className="inline-block mt-4 text-[13px] font-semibold text-primary-deep">
                고민 남기러 가기 →
              </Link>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((r) => (
                <RecipeCard key={r.id} recipe={r} userId={userId} saved={savedIds.has(r.id)} />
              ))}
            </div>
          )}
        </section>

        {/* Popular tags sidebar */}
        <aside className="hidden lg:block">
          <Card className="p-5">
            <p className="text-[13px] font-bold text-text-dark mb-3">🍀 인기 태그</p>
            {popularTags.length === 0 ? (
              <p className="text-[12px] text-text-gray">아직 태그가 없어요.</p>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {popularTags.map(([tag, count]) => (
                  <li key={tag} className="flex items-center justify-between text-[12.5px]">
                    <button
                      onClick={() => setPurpose((p) => (p === tag ? "" : p))}
                      className="text-text-dark hover:text-primary-deep truncate"
                    >
                      {tag}
                    </button>
                    <span className="text-text-gray shrink-0">{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-5 mt-4 bg-gradient-to-br from-soft-green to-pale-green border-none">
            <p className="text-[12.5px] text-text-dark font-semibold mb-1.5">이 업종도 필요해요!</p>
            <p className="text-[11.5px] text-text-gray leading-relaxed mb-3">
              찾으시는 업종이 없다면 우체통으로 알려주세요.
            </p>
            <Link href="/mailbox" className="text-[12px] font-semibold text-primary-deep">
              클로버 우체통으로 이동 →
            </Link>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function RecipeCard({
  recipe,
  userId,
  saved,
}: {
  recipe: RecipeListItem;
  userId: string | null;
  saved: boolean;
}) {
  return (
    <Card className="p-5 flex flex-col relative">
      <div className="aspect-[4/3] rounded-xl bg-pale-green mb-3 flex items-center justify-center relative">
        <CloverMascot className="w-14 h-14" />
        <div className="absolute top-2 right-2">
          <SaveButton recipeId={recipe.id} initialSaved={saved} userId={userId} />
        </div>
      </div>
      <Link
        href={`/recipes/${recipe.slug}`}
        className="font-semibold text-[14.5px] text-text-dark leading-snug hover:text-primary-deep"
      >
        {recipe.title}
      </Link>
      <p className="text-[12px] text-text-gray mt-1.5 line-clamp-2">{recipe.summary}</p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {(recipe.target_users ?? []).slice(0, 1).map((t) => (
          <span key={t} className="text-[11px] text-primary-deep bg-soft-green px-2 py-0.5 rounded-full">
            {t}
          </span>
        ))}
        {(recipe.categories ?? []).slice(0, 2).map((c) => (
          <span key={c} className="text-[11px] text-text-gray bg-pale-green px-2 py-0.5 rounded-full">
            {c}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 text-[11.5px] text-text-gray">
        <span>⏱ {recipe.estimated_time}</span>
        <span>·</span>
        <span>{recipe.difficulty}</span>
      </div>
      {recipe.tools && recipe.tools.length > 0 && (
        <p className="text-[11px] text-text-gray mt-1.5 truncate">🛠 {recipe.tools.join(", ")}</p>
      )}
      <Link
        href={`/recipes/${recipe.slug}`}
        className="mt-4 text-center text-[12.5px] font-semibold text-primary-deep border border-primary rounded-full py-2 hover:bg-pale-green"
      >
        레시피 보기
      </Link>
    </Card>
  );
}
