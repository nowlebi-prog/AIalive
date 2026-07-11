"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { CloverMascot } from "@/components/icons/CloverMascot";
import {
  RESULT_TYPES,
  FINDER_STORAGE_KEY,
  type FinderAnswers,
  type ResultTypeId,
} from "@/lib/clover-finder-data";
import { getRecommendedRecipeCategories } from "@/lib/clover-finder-engine";
import { createClient } from "@/lib/supabase/client";
import { awardGrowth } from "@/lib/supabase-actions";
import { useLoginModal } from "@/lib/login-modal-context";
import type { RecipeListItem } from "@/types/database";
import { RECIPE_LIST_COLUMNS } from "@/types/database";
import { Bookmark, BookmarkCheck, Mailbox, RotateCcw } from "lucide-react";

interface StoredFinderState {
  answers: FinderAnswers;
  result: { resultType: ResultTypeId | null; matchScore: number };
}

export default function CloverFinderResultPage() {
  const { openForAction } = useLoginModal();
  const [state, setState] = useState<StoredFinderState | null | undefined>(undefined);
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingRecipes, setLoadingRecipes] = useState(true);

  // Load answers from sessionStorage (client-only, works for guests too).
  useEffect(() => {
    const raw = sessionStorage.getItem(FINDER_STORAGE_KEY);
    if (!raw) {
      setState(null);
      return;
    }
    try {
      setState(JSON.parse(raw));
    } catch {
      setState(null);
    }
  }, []);

  // Fetch matching public recipes + current user + award diagnosis growth points once.
  useEffect(() => {
    if (state === undefined || state === null || !state.result.resultType) return;

    const supabase = createClient();
    const categories = getRecommendedRecipeCategories(state.result.resultType);

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);

      const { data } = await supabase
        .from("recipes")
        .select(RECIPE_LIST_COLUMNS)
        .eq("is_public", true)
        .overlaps("categories", categories)
        .limit(3);

      setRecipes((data as unknown as RecipeListItem[]) ?? []);
      setLoadingRecipes(false);

      if (user) {
        const alreadyAwarded = sessionStorage.getItem("diagnosis_growth_awarded");
        if (!alreadyAwarded) {
          await awardGrowth("diagnosis_complete");
          sessionStorage.setItem("diagnosis_growth_awarded", "1");
        }
      }
    })();
  }, [state]);

  if (state === undefined) {
    return <ResultSkeleton />;
  }

  if (state === null || !state.result.resultType) {
    return (
      <div className="flex flex-col items-center justify-center text-center px-6 py-24 max-w-md mx-auto">
        <CloverMascot className="w-24 h-24 mb-6" />
        <h1 className="text-[19px] font-bold text-text-dark">아직 진단 결과가 없어요</h1>
        <p className="text-[13px] text-text-gray mt-2">
          클로버 찾기를 먼저 진행하면 나에게 맞는 방향을 알려드릴게요.
        </p>
        <Button href="/clover-finder" className="mt-6" icon={<RotateCcw size={16} />}>
          클로버 찾기 하러 가기
        </Button>
      </div>
    );
  }

  const meta = RESULT_TYPES[state.result.resultType];

  async function handleSave(recipeId: string) {
    if (!userId) {
      openForAction("finder_result_save");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase
      .from("bookmarks")
      .insert({ user_id: userId, recipe_id: recipeId });

    if (!error) {
      setSavedIds((prev) => new Set(prev).add(recipeId));
      await awardGrowth("recipe_save");
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <p className="text-[13px] text-text-gray mb-2">클로버 찾기 결과</p>

      <Card className="p-8 md:p-10 bg-gradient-to-br from-soft-green to-pale-green border-none">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <CloverMascot className="w-28 h-28 shrink-0" />
          <div className="text-center md:text-left">
            <p className="text-[12px] font-semibold text-primary-deep">당신에게 어울리는 방향은</p>
            <h1 className="text-[28px] font-bold text-text-dark mt-1">
              {meta.emoji} {meta.label}
            </h1>
            <div className="flex flex-wrap gap-1.5 mt-3 justify-center md:justify-start">
              {meta.tags.map((t) => (
                <span key={t} className="text-[11.5px] text-primary-deep bg-white px-2.5 py-1 rounded-full">
                  {t}
                </span>
              ))}
            </div>
            <p className="text-[13.5px] text-text-gray mt-4 leading-relaxed max-w-md">
              {meta.description}
            </p>
            <div className="flex items-center gap-1 mt-4 justify-center md:justify-start">
              <span className="text-[12px] text-text-gray mr-1">매칭 강도</span>
              {[1, 2, 3, 4].map((i) => (
                <span key={i} className={i <= state.result.matchScore ? "opacity-100" : "opacity-25"}>
                  🍀
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 mt-6">
        <h2 className="text-[14px] font-bold text-text-dark mb-3">예상 도움 포인트</h2>
        <ul className="grid sm:grid-cols-3 gap-3">
          {meta.helpPoints.map((point) => (
            <li key={point} className="flex items-start gap-2 text-[12.5px] text-text-gray bg-pale-green rounded-xl p-3">
              <span className="text-primary mt-0.5">✓</span>
              {point}
            </li>
          ))}
        </ul>
      </Card>

      <section className="mt-8">
        <h2 className="text-[16px] font-bold text-text-dark mb-4">추천 클로버 레시피</h2>

        {loadingRecipes ? (
          <div className="grid sm:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-40 rounded-2xl bg-pale-green animate-pulse" />
            ))}
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid sm:grid-cols-3 gap-4">
            {recipes.map((r) => {
              const saved = savedIds.has(r.id);
              return (
                <Card key={r.id} className="p-5 flex flex-col">
                  <div className="aspect-[4/3] rounded-xl bg-pale-green mb-3 flex items-center justify-center">
                    <CloverMascot className="w-12 h-12" />
                  </div>
                  <Link href={`/recipes/${r.slug}`} className="font-semibold text-[14px] text-text-dark leading-snug hover:text-primary-deep">
                    {r.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-2 text-[11.5px] text-text-gray">
                    <span>{r.estimated_time}</span>
                    <span>·</span>
                    <span>{r.difficulty}</span>
                  </div>
                  <button
                    onClick={() => handleSave(r.id)}
                    disabled={saved}
                    className="mt-4 inline-flex items-center justify-center gap-1.5 text-[12.5px] font-semibold text-primary-deep border border-primary rounded-full py-2 disabled:opacity-60"
                  >
                    {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                    {saved ? "저장됨" : "저장하기"}
                  </button>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-[13px] text-text-gray">
              아직 이 유형에 딱 맞는 공개 레시피가 준비 중이에요. 클로버 지도에서 더 둘러보시거나
              우체통에 원하는 레시피를 남겨주세요.
            </p>
          </Card>
        )}
      </section>

      <Card className="p-6 mt-8 flex flex-col sm:flex-row items-center gap-5">
        <Mailbox size={22} className="text-primary-deep shrink-0" />
        <p className="flex-1 text-[13px] text-text-gray text-center sm:text-left">
          찾으시는 레시피가 없다면, 클로버 우체통에 고민을 남겨주세요. 운영자가 확인하고
          맞춤 레시피로 이어갈게요.
        </p>
        <Button href="/mailbox" variant="secondary" className="shrink-0">
          고민 남기기
        </Button>
      </Card>

      {!userId && (
        <Card className="p-5 mt-4 text-center bg-warm-beige border-none">
          <p className="text-[13px] text-text-gray">
            로그인하면 진단 결과와 저장한 레시피가 나의 클로버 카드에 기록돼요.
          </p>
          <button
            onClick={() => openForAction("finder_result_save")}
            className="inline-flex items-center justify-center mt-3 px-5 py-2.5 rounded-full text-[13.5px] font-semibold bg-primary text-white hover:bg-primary-deep"
          >
            로그인하고 저장하기
          </button>
        </Card>
      )}

      <div className="text-center mt-8">
        <Link href="/clover-finder" className="text-[12.5px] text-text-gray hover:text-primary-deep inline-flex items-center gap-1.5">
          <RotateCcw size={13} /> 다시 진단하기
        </Link>
      </div>
    </div>
  );
}

function ResultSkeleton() {
  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto animate-pulse">
      <div className="h-40 rounded-2xl bg-pale-green" />
      <div className="h-24 rounded-2xl bg-pale-green mt-6" />
    </div>
  );
}
