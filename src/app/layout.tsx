import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Steam 리뷰 분석기",
  description: "Steam 게임 리뷰 AI 감성 분석 & 개선 피드백 도구",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-900 text-gray-100">
        <header className="border-b border-gray-800 px-6 py-4">
          <h1 className="text-xl font-bold text-white">Steam 리뷰 분석기</h1>
          <p className="text-xs text-gray-400 mt-0.5">AI 기반 게임 리뷰 감성 분석 & 개선 피드백</p>
        </header>
        <main className="px-6 py-8 max-w-5xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
