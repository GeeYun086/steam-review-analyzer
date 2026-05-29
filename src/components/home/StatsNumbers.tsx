"use client";

import { useReveal } from "@/hooks/useReveal";

const STATS_NUMBERS = [
  { value: "100개", label: "리뷰 분석", sub: "최신 긍정·부정 리뷰" },
  { value: "7개", label: "카테고리 자동 분류", sub: "게임플레이 · 그래픽 외" },
  { value: "30초", label: "AI 피드백 생성", sub: "개선 우선순위 즉시 제공" },
];

export default function StatsNumbers() {
  const statsRef = useReveal();

  return (
    <section>
      <div
        ref={statsRef}
        className="reveal grid grid-cols-3 gap-4 rounded-3xl p-8"
        style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)" }}
      >
        {STATS_NUMBERS.map((s, i) => (
          <div key={s.label} className={`text-center reveal-delay-${i + 1}`}>
            <div className="text-4xl font-black mb-1 text-gradient-purple">{s.value}</div>
            <div className="text-sm font-semibold text-white mb-0.5">{s.label}</div>
            <div className="text-xs" style={{ color: "rgba(196,181,253,0.45)" }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
