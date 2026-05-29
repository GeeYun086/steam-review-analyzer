import { useState } from "react";
import { useRouter } from "next/navigation";
import type { GameSearchResult } from "@/services/steamService";

type Step = "리뷰 수집 중..." | "AI 분석 중..." | "완료";

function toErrorMessage(e: unknown): string {
  return e instanceof Error ? e.message : "오류가 발생했습니다.";
}

export function useAnalyze() {
  const router = useRouter();
  const [games, setGames] = useState<GameSearchResult[]>([]);
  const [selected, setSelected] = useState<GameSearchResult | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [step, setStep] = useState<Step | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [noResults, setNoResults] = useState(false);

  const analyzeLoading = step !== null;

  async function handleSearch(query: string) {
    setSearchLoading(true);
    setGames([]);
    setSelected(null);
    setError(null);
    setNoResults(false);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "검색 실패");
      setGames(data.games ?? []);
      if ((data.games ?? []).length === 0) setNoResults(true);
    } catch (e) {
      setError(toErrorMessage(e));
    } finally {
      setSearchLoading(false);
    }
  }

  function handleQuickSelect(appid: number, name: string) {
    const fakeGame: GameSearchResult = { appid, name, icon: "", logo: "" };
    setGames([fakeGame]);
    setSelected(fakeGame);
    setError(null);
    setNoResults(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleAnalyze() {
    if (!selected) return;
    setError(null);
    try {
      setStep("리뷰 수집 중...");
      const reviewRes = await fetch(`/api/reviews/${selected.appid}`);
      const reviewData = await reviewRes.json();
      if (!reviewRes.ok) throw new Error(reviewData.error ?? "리뷰 수집 실패");
      if (reviewData.count === 0) throw new Error("이 게임에는 분석할 리뷰가 없습니다.");

      setStep("AI 분석 중...");
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviews: reviewData.reviews }),
      });
      const analysisData = await analyzeRes.json();
      if (!analyzeRes.ok) throw new Error(analysisData.error ?? "분석 실패");

      setStep("완료");
      sessionStorage.setItem(
        `analysis_${selected.appid}`,
        JSON.stringify({
          game: selected,
          analysis: analysisData,
          reviewCount: reviewData.count,
          totalReviews: reviewData.totalReviews,
        })
      );
      router.push(`/dashboard?appId=${selected.appid}`);
    } catch (e) {
      setError(toErrorMessage(e));
      setStep(null);
    }
  }

  return {
    games,
    selected,
    setSelected,
    searchLoading,
    analyzeLoading,
    step,
    error,
    noResults,
    handleSearch,
    handleQuickSelect,
    handleAnalyze,
  };
}
