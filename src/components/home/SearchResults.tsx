"use client";

import GameCard from "@/components/GameCard";
import type { GameSearchResult } from "@/services/steamService";

type Step = "리뷰 수집 중..." | "AI 분석 중..." | "완료";

interface Props {
  games: GameSearchResult[];
  selected: GameSearchResult | null;
  searchLoading: boolean;
  analyzeLoading: boolean;
  step: Step | null;
  noResults: boolean;
  onSelect: (game: GameSearchResult) => void;
  onAnalyze: () => void;
}

export default function SearchResults({
  games,
  selected,
  searchLoading,
  analyzeLoading,
  step,
  noResults,
  onSelect,
  onAnalyze,
}: Props) {
  if (!games.length && !noResults && !searchLoading) return null;

  return (
    <section className="mb-12">
      {searchLoading && (
        <p className="text-center text-sm animate-pulse mb-4" style={{ color: "#a78bfa" }}>
          게임 검색 중...
        </p>
      )}

      {noResults && !searchLoading && (
        <div className="text-center py-10" style={{ color: "rgba(196,181,253,0.5)" }}>
          <p className="text-base mb-1">검색 결과가 없습니다.</p>
          <p className="text-sm">다른 게임 이름으로 검색해 보세요.</p>
        </div>
      )}

      {games.length > 0 && (
        <div className="space-y-2 max-w-xl mx-auto">
          <p className="text-xs mb-3 text-center" style={{ color: "rgba(196,181,253,0.5)" }}>
            검색 결과 {games.length}개 — 분석할 게임을 선택하세요
          </p>

          {games.map((game, i) => (
            <div key={game.appid} className="reveal visible" style={{ transitionDelay: `${i * 80}ms` }}>
              <GameCard
                game={game}
                onSelect={onSelect}
                selected={selected?.appid === game.appid}
                loading={analyzeLoading}
              />
            </div>
          ))}

          {selected && (
            <div className="pt-3">
              {analyzeLoading ? (
                <div className="text-center space-y-3 py-4">
                  <div className="inline-flex items-center gap-2.5" style={{ color: "#c084fc" }}>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span className="font-medium text-sm">{step}</span>
                  </div>
                  <div className="w-full rounded-full h-1 overflow-hidden" style={{ background: "rgba(124,58,237,0.15)" }}>
                    <div
                      className="h-full rounded-full btn-shimmer"
                      style={{ width: step === "리뷰 수집 중..." ? "35%" : "75%", transition: "width 1s ease" }}
                    />
                  </div>
                  <p className="text-xs" style={{ color: "rgba(196,181,253,0.4)" }}>AI 분석은 최대 30초 소요됩니다</p>
                </div>
              ) : (
                <button
                  onClick={onAnalyze}
                  className="btn-press w-full py-4 rounded-2xl font-bold text-white text-sm tracking-wide btn-shimmer"
                  style={{ boxShadow: "0 8px 32px rgba(124,58,237,0.35)" }}
                >
                  &ldquo;{selected.name}&rdquo; 리뷰 분석 시작 →
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
