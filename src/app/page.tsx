"use client";

import { useAnalyze } from "@/hooks/useAnalyze";
import HeroSection from "@/components/home/HeroSection";
import SearchResults from "@/components/home/SearchResults";
import PopularGamesSection from "@/components/home/PopularGamesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import StatsNumbers from "@/components/home/StatsNumbers";

export default function HomePage() {
  const {
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
  } = useAnalyze();

  const showLanding = games.length === 0 && !searchLoading;

  return (
    <div className="pb-24">
      <HeroSection onSearch={handleSearch} loading={searchLoading || analyzeLoading} />

      {error && (
        <div
          className="mb-6 text-center text-sm px-4 py-3 rounded-xl"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}
        >
          {error}
        </div>
      )}

      <SearchResults
        games={games}
        selected={selected}
        searchLoading={searchLoading}
        analyzeLoading={analyzeLoading}
        step={step}
        noResults={noResults}
        onSelect={setSelected}
        onAnalyze={handleAnalyze}
      />

      {showLanding && (
        <>
          <PopularGamesSection disabled={analyzeLoading} onSelect={handleQuickSelect} />
          <HowItWorksSection />
          <StatsNumbers />
        </>
      )}
    </div>
  );
}
