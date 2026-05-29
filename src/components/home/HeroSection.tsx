"use client";

import SearchBar from "@/components/SearchBar";

const STATS = [
  { label: "리뷰 분석", value: "100개", icon: "📋" },
  { label: "카테고리 분류", value: "7가지", icon: "🗂️" },
  { label: "AI 피드백", value: "30초", icon: "⚡" },
];

interface Props {
  onSearch: (query: string) => void;
  loading: boolean;
}

export default function HeroSection({ onSearch, loading }: Props) {
  return (
    <section className="pt-20 pb-16 text-center">
      {/* 뱃지 */}
      <div
        className="hero-el hero-el-1 inline-flex items-center gap-2 text-xs font-medium px-4 py-1.5 rounded-full mb-7"
        style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(167,139,250,0.25)", color: "#c4b5fd" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
        Steam Web API + Claude AI 실시간 연동
      </div>

      {/* 헤드라인 */}
      <h1
        className="hero-el hero-el-2 font-black leading-[1.08] tracking-tight mb-5"
        style={{ fontSize: "clamp(2.8rem, 6vw, 4.5rem)" }}
      >
        게임 리뷰 분석,<br />
        <span className="text-gradient-purple">이제 30초면 됩니다</span>
      </h1>

      {/* 서브 */}
      <p
        className="hero-el hero-el-3 text-lg max-w-md mx-auto mb-10 leading-relaxed"
        style={{ color: "rgba(209,196,255,0.65)" }}
      >
        수백 개의 유저 피드백을 AI가 자동으로 읽고<br />
        어떤 문제부터 고쳐야 할지 알려드립니다.
      </p>

      {/* 검색창 */}
      <div className="hero-el hero-el-4 max-w-xl mx-auto mb-6">
        <div
          className="search-wrap rounded-2xl transition-all duration-300"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <SearchBar onSearch={onSearch} loading={loading} />
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
  );
}
