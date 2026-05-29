import { NextRequest, NextResponse } from "next/server";

// 간단한 in-memory 슬라이딩 윈도우 rate limiter
// (서버리스 환경에서는 함수 인스턴스마다 별도 메모리 — 강한 보장이 필요하면 Vercel KV/Redis 사용)
const WINDOW_MS = 60_000; // 1분
const LIMITS: Record<string, number> = {
  "/api/analyze": 10,  // 분당 10회 (AI 비용 보호)
  "/api/reviews":  20, // 분당 20회
  "/api/search":   30, // 분당 30회
};

const hits = new Map<string, number[]>();

function isRateLimited(ip: string, path: string): boolean {
  const limit = Object.entries(LIMITS).find(([prefix]) => path.startsWith(prefix))?.[1];
  if (!limit) return false;

  const key = `${ip}:${path.split("/").slice(0, 3).join("/")}`;
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(key, timestamps);

  return timestamps.length > limit;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/api/")) return NextResponse.next();

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip, pathname)) {
    return NextResponse.json(
      { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
