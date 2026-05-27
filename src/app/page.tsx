"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import GameCard from "@/components/GameCard";
import type { GameSearchResult } from "@/services/steamService";

type Step = "리뷰 수집 중..." | "AI 분석 중..." | "완료";

export default function HomePage() {
  const router = useRouter();
  const [games, setGames] = useState<GameSearchResult[]>([]);
  const [selected, setSelected] = useState<GameSearchResult | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [step, setStep] = useState<Step | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(query: string) {
    setSearchLoading(true);
    setGames([]);
    setSelected(null);
    setError(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "검색 실패");
      setGames(data.games ?? []);
      if (data.games?.length === 0) setError("검색 결과가 없습니다.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setSearchLoading(false);
    }
  }

  async function handleAnalyze() {
    if (!selected) return;
    setAnalyzeLoading(true);
    setError(null);

    try {
      setStep("리뷰 수집 중...");
      const reviewRes = await fetch(`/api/reviews/${selected.appid}`);
      const reviewData = await reviewRes.json();
      if (!reviewRes.ok) throw new Error(reviewData.error ?? "리뷰 수집 실패");

      if (reviewData.count === 0) {
        throw new Error("이 게임에는 분석할 리뷰가 없습니다.");
      }

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
        JSON.stringify({ game: selected, analysis: analysisData, reviewCount: reviewData.count })
      );
      router.push(`/dashboard?appId=${selected.appid}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
      setStep(null);
    } finally {
      setAnalyzeLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Steam 게임 리뷰 분석</h2>
        <p className="text-gray-400">게임 이름을 검색하고 AI가 유저 리뷰를 자동 분석합니다</p>
      </div>

      <div className="flex justify-center">
        <SearchBar onSearch={handleSearch} loading={searchLoading || analyzeLoading} />
      </div>

      {error && (
        <div className="text-center text-red-400 bg-red-900/20 border border-red-800 rounded-lg p-3">
          {error}
        </div>
      )}

      {searchLoading && (
        <p className="text-center text-gray-400 animate-pulse">게임 검색 중...</p>
      )}

      {games.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-400">검색 결과 {games.length}개 — 분석할 게임을 선택하세요</p>
          <div className="space-y-2">
            {games.map((game) => (
              <GameCard
                key={game.appid}
                game={game}
                onSelect={setSelected}
                selected={selected?.appid === game.appid}
                loading={analyzeLoading}
              />
            ))}
          </div>

          {selected && (
            <div className="pt-2">
              {analyzeLoading ? (
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center gap-2 text-blue-400">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span className="font-medium">{step}</span>
                  </div>
                  <p className="text-xs text-gray-500">AI 분석은 최대 30초 소요될 수 있습니다</p>
                </div>
              ) : (
                <button
                  onClick={handleAnalyze}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
                >
                  &ldquo;{selected.name}&rdquo; 리뷰 분석 시작
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
