import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Steam 리뷰 분석기 — AI 감성 분석",
  description: "Steam 게임 리뷰를 AI가 자동 분류하고 개선 우선순위를 제시합니다",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen">
        {/* 배경 레이어 */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          {/* 딥 퍼플 베이스 그라데이션 */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(160deg, #0a0118 0%, #130230 40%, #0d011e 70%, #080118 100%)"
          }} />
          {/* dot grid */}
          <div className="absolute inset-0 dot-grid" />
          {/* 부유 오브 1 — 바이올렛 */}
          <div className="orb-1 absolute" style={{
            top: "-10%", left: "30%",
            width: "700px", height: "600px",
            background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)",
            borderRadius: "50%", filter: "blur(40px)"
          }} />
          {/* 부유 오브 2 — 핑크 */}
          <div className="orb-2 absolute" style={{
            top: "20%", right: "-5%",
            width: "500px", height: "500px",
            background: "radial-gradient(circle, rgba(219,39,119,0.12) 0%, transparent 65%)",
            borderRadius: "50%", filter: "blur(50px)"
          }} />
          {/* 부유 오브 3 — 인디고 */}
          <div className="orb-3 absolute" style={{
            bottom: "10%", left: "-5%",
            width: "400px", height: "400px",
            background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 65%)",
            borderRadius: "50%", filter: "blur(60px)"
          }} />
        </div>

        {/* 콘텐츠 */}
        <div className="relative" style={{ zIndex: 1 }}>
          <header className="border-b border-white/5 px-8 py-4 flex items-center justify-between backdrop-blur-sm"
            style={{ background: "rgba(10,1,24,0.7)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}>
                🎮
              </div>
              <span className="font-bold text-white text-base tracking-tight">Steam 리뷰 분석기</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-gray-400">실시간 분석 가능</span>
            </div>
          </header>
          <main className="px-6 max-w-4xl mx-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
