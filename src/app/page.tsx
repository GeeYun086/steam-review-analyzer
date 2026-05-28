"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import GameCard from "@/components/GameCard";
import type { GameSearchResult } from "@/services/steamService";

type Step = "리뷰 수집 중..." | "AI 분석 중..." | "완료";

const POPULAR_GAMES = [
  { name: "Elden Ring",        emoji: "⚔️",  color: "#92400e", appid: 1245620 },
  { name: "Counter-Strike 2",  emoji: "🔫",  color: "#7f1d1d", appid: 730 },
  { name: "Cyberpunk 2077",    emoji: "🌆",  color: "#713f12", appid: 1091500 },
  { name: "Stardew Valley",    emoji: "🌾",  color: "#14532d", appid: 413150 },
  { name: "Baldur's Gate 3",   emoji: "🧙",  color: "#4c1d95", appid: 1086940 },
  { name: "Hollow Knight",     emoji: "🦋",  color: "#1e3a5f", appid: 367520 },
  { name: "Hades",             emoji: "🔱",  color: "#7f1d1d", appid: 1145360 },
  { name: "DAVE THE DIVER",    emoji: "🤿",  color: "#164e63", appid: 1868140 },
];

const STATS = [
  { label: "리뷰 분석", value: "100개", icon: "📋" },
  { label: "카테고리 분류", value: "7가지", icon: "🗂️" },
  { label: "AI 피드백", value: "30초", icon: "⚡" },
];

// 스크롤 reveal 훅
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// 카드 stagger reveal 훅
function useStaggerReveal(count: number) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>(".card-stagger");
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          cards.forEach((card, i) => {
            setTimeout(() => card.classList.add("visible"), i * 60);
          });
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(container);
    return () => obs.disconnect();
  }, [count]);
  return ref;
}

export default function HomePage() {
  const router = useRouter();
  const [games, setGames] = useState<GameSearchResult[]>([]);
  const [selected, setSelected] = useState<GameSearchResult | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [step, setStep] = useState<Step | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [noResults, setNoResults] = useState(false);

  const howRef = useReveal();
  const statsRef = useReveal();
  const cardsRef = useStaggerReveal(POPULAR_GAMES.length);

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
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setSearchLoading(false);
    }
  }

  async function handleQuickSelect(appid: number, name: string) {
    const fakeGame: GameSearchResult = { appid, name, icon: "", logo: "" };
    setGames([fakeGame]);
    setSelected(fakeGame);
    setError(null);
    setNoResults(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        JSON.stringify({ game: selected, analysis: analysisData, reviewCount: reviewData.count, totalReviews: reviewData.totalReviews })
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
    <div className="pb-24">

      {/* ──────────────── HERO ──────────────── */}
      <section className="pt-20 pb-16 text-center">

        {/* 뱃지 */}
        <div className="hero-el hero-el-1 inline-flex items-center gap-2 text-xs font-medium px-4 py-1.5 rounded-full mb-7"
          style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(167,139,250,0.25)", color: "#c4b5fd" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Steam Web API + Claude AI 실시간 연동
        </div>

        {/* 헤드라인 */}
        <h1 className="hero-el hero-el-2 font-black leading-[1.08] tracking-tight mb-5"
          style={{ fontSize: "clamp(2.8rem, 6vw, 4.5rem)" }}>
          게임 리뷰 분석,<br />
          <span className="text-gradient-purple">이제 30초면 됩니다</span>
        </h1>

        {/* 서브 */}
        <p className="hero-el hero-el-3 text-lg max-w-md mx-auto mb-10 leading-relaxed"
          style={{ color: "rgba(209,196,255,0.65)" }}>
          수백 개의 유저 피드백을 AI가 자동으로 읽고<br />
          어떤 문제부터 고쳐야 할지 알려드립니다.
        </p>

        {/* 검색창 */}
        <div className="hero-el hero-el-4 max-w-xl mx-auto mb-6">
          <div className="search-wrap rounded-2xl transition-all duration-300"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <SearchBar onSearch={handleSearch} loading={searchLoading || analyzeLoading} />
          </div>
        </div>

        {/* Stat 배지 */}
        <div className="hero-el hero-el-5 flex justify-center flex-wrap gap-6">
          {STATS.map((s) => (
            <span key={s.label} className="flex items-center gap-1.5 text-sm" style={{ color: "rgba(196,181,253,0.6)" }}>
              <span>{s.icon}</span>
              <span className="font-semibold text-violet-300">{s.value}</span>
              <span>{s.label}</span>
            </span>
          ))}
        </div>
      </section>

      {/* 에러 */}
      {error && (
        <div className="mb-6 text-center text-sm px-4 py-3 rounded-xl"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
          {error}
        </div>
      )}

      {/* 검색 결과 */}
      {(games.length > 0 || noResults || searchLoading) && (
        <section className="mb-12">
          {searchLoading && (
            <p className="text-center text-sm animate-pulse mb-4" style={{ color: "#a78bfa" }}>게임 검색 중...</p>
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
                    onSelect={setSelected}
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
                        <div className="h-full rounded-full btn-shimmer" style={{ width: step === "리뷰 수집 중..." ? "35%" : "75%", transition: "width 1s ease" }} />
                      </div>
                      <p className="text-xs" style={{ color: "rgba(196,181,253,0.4)" }}>AI 분석은 최대 30초 소요됩니다</p>
                    </div>
                  ) : (
                    <button
                      onClick={handleAnalyze}
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
      )}

      {/* ──────────────── 인기 게임 ──────────────── */}
      {games.length === 0 && !searchLoading && (
        <>
          <section className="mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-center mb-6 font-medium"
              style={{ color: "rgba(167,139,250,0.4)" }}>
              인기 게임으로 바로 시작하기
            </p>
            <div ref={cardsRef} className="grid grid-cols-4 gap-3">
              {POPULAR_GAMES.map((game) => (
                <button
                  key={game.appid}
                  onClick={() => handleQuickSelect(game.appid, game.name)}
                  disabled={analyzeLoading}
                  className="card-stagger game-card flex flex-col items-center gap-3 p-5 rounded-2xl text-center group"
                  style={{
                    background: `linear-gradient(160deg, ${game.color}55 0%, rgba(255,255,255,0.02) 100%)`,
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{game.emoji}</span>
                  <span className="text-xs font-medium leading-snug" style={{ color: "rgba(221,214,254,0.8)" }}>
                    {game.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* ──────────────── 작동 방식 ──────────────── */}
          <section className="mb-16">
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "3.5rem" }}>
              <p className="text-xs uppercase tracking-[0.2em] text-center mb-10 font-medium"
                style={{ color: "rgba(167,139,250,0.4)" }}>
                작동 방식
              </p>
              <div ref={howRef} className="reveal grid grid-cols-3 gap-5">
                {[
                  { num: "01", icon: "🔍", title: "게임 검색", desc: "Steam에서 게임 이름으로 검색하거나 인기 게임을 바로 선택합니다." },
                  { num: "02", icon: "📥", title: "리뷰 자동 수집", desc: "Steam Web API로 최신 긍정·부정 리뷰 최대 100개를 자동으로 가져옵니다." },
                  { num: "03", icon: "🤖", title: "AI 분석 결과", desc: "7개 카테고리 감성 분포와 개선 우선순위, 대표 유저 발언을 즉시 확인합니다." },
                ].map((s, i) => (
                  <div
                    key={s.num}
                    className={`glass rounded-2xl p-6 flex flex-col gap-3 reveal-delay-${i + 1}`}
                  >
                    <span className="font-mono text-xs font-bold" style={{ color: "#a78bfa" }}>{s.num}</span>
                    <span className="text-2xl">{s.icon}</span>
                    <h3 className="font-bold text-sm text-white">{s.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(196,181,253,0.55)" }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ──────────────── 숫자 강조 ──────────────── */}
          <section>
            <div ref={statsRef} className="reveal grid grid-cols-3 gap-4 rounded-3xl p-8"
              style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)" }}>
              {[
                { value: "100개", label: "리뷰 분석", sub: "최신 긍정·부정 리뷰" },
                { value: "7개", label: "카테고리 자동 분류", sub: "게임플레이 · 그래픽 외" },
                { value: "30초", label: "AI 피드백 생성", sub: "개선 우선순위 즉시 제공" },
              ].map((s, i) => (
                <div key={s.label} className={`text-center reveal-delay-${i + 1}`}>
                  <div className="text-4xl font-black mb-1 text-gradient-purple">{s.value}</div>
                  <div className="text-sm font-semibold text-white mb-0.5">{s.label}</div>
                  <div className="text-xs" style={{ color: "rgba(196,181,253,0.45)" }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
