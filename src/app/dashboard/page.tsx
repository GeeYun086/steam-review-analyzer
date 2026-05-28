"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SentimentChart from "@/components/SentimentChart";
import FeedbackCard from "@/components/FeedbackCard";
import ReviewSample from "@/components/ReviewSample";
import type { AnalysisResult } from "@/services/aiService";
import type { GameSearchResult } from "@/services/steamService";
import { CATEGORY_KEYS, CATEGORY_LABELS } from "@/constants/categories";

interface StoredData {
  game: GameSearchResult;
  analysis: AnalysisResult;
  reviewCount: number;
  totalReviews: number;
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appId = searchParams.get("appId");
  const [data, setData] = useState<StoredData | null>(null);

  useEffect(() => {
    if (!appId) {
      router.replace("/");
      return;
    }
    const stored = sessionStorage.getItem(`analysis_${appId}`);
    if (!stored) {
      router.replace("/");
      return;
    }
    try {
      setData(JSON.parse(stored) as StoredData);
    } catch {
      router.replace("/");
    }
  }, [appId, router]);

  if (!data) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-gray-400 animate-pulse">데이터를 불러오는 중...</p>
      </div>
    );
  }

  const { game, analysis, reviewCount, totalReviews } = data;

  return (
    <div className="space-y-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{game.name}</h2>
          <p className="text-gray-400 text-sm mt-1">
            최신 리뷰 {reviewCount}개 샘플 분석
            {totalReviews > 0 && (
              <span className="text-gray-500"> (전체 {totalReviews.toLocaleString()}개 중)</span>
            )}
          </p>
        </div>
        <button
          onClick={() => router.push("/")}
          className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition-colors shrink-0"
        >
          다른 게임 검색
        </button>
      </div>

      <section>
        <h3 className="text-lg font-semibold text-white mb-1">AI 요약</h3>
        <p className="text-gray-300 bg-gray-800 rounded-xl p-4 border border-gray-700 leading-relaxed">
          {analysis.summary}
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-white mb-4">카테고리별 감성 분석</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORY_KEYS.map((key) => (
            <SentimentChart
              key={key}
              category={key}
              data={analysis.categories[key]}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-white mb-4">개선 우선순위</h3>
        <div className="space-y-3">
          {analysis.priorities.map((priority, i) => (
            <FeedbackCard key={i} rank={i + 1} priority={priority} />
          ))}
        </div>
      </section>

      {analysis.quotes.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold text-white mb-4">대표 유저 발언</h3>
          <ReviewSample quotes={analysis.quotes} />
        </section>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<p className="text-center text-gray-400 animate-pulse">로딩 중...</p>}>
      <DashboardContent />
    </Suspense>
  );
}
