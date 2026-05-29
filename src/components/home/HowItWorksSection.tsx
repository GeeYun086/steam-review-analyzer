"use client";

import { useReveal } from "@/hooks/useReveal";

const HOW_IT_WORKS = [
  { num: "01", icon: "🔍", title: "게임 검색", desc: "Steam에서 게임 이름으로 검색하거나 인기 게임을 바로 선택합니다." },
  { num: "02", icon: "📥", title: "리뷰 자동 수집", desc: "Steam Web API로 최신 긍정·부정 리뷰 최대 100개를 자동으로 가져옵니다." },
  { num: "03", icon: "🤖", title: "AI 분석 결과", desc: "7개 카테고리 감성 분포와 개선 우선순위, 대표 유저 발언을 즉시 확인합니다." },
];

export default function HowItWorksSection() {
  const howRef = useReveal();

  return (
    <section className="mb-16">
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "3.5rem" }}>
        <p
          className="text-xs uppercase tracking-[0.2em] text-center mb-10 font-medium"
          style={{ color: "rgba(167,139,250,0.4)" }}
        >
          작동 방식
        </p>
        <div ref={howRef} className="reveal grid grid-cols-3 gap-5">
          {HOW_IT_WORKS.map((s, i) => (
            <div key={s.num} className={`glass rounded-2xl p-6 flex flex-col gap-3 reveal-delay-${i + 1}`}>
              <span className="font-mono text-xs font-bold" style={{ color: "#a78bfa" }}>{s.num}</span>
              <span className="text-2xl">{s.icon}</span>
              <h3 className="font-bold text-sm text-white">{s.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(196,181,253,0.55)" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
