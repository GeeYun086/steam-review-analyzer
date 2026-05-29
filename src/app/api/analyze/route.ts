import { NextRequest, NextResponse } from "next/server";
import { analyzeReviews } from "@/services/aiService";
import type { Review } from "@/services/steamService";

export async function POST(request: NextRequest) {
  let body: { reviews?: Review[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { reviews } = body;
  if (!Array.isArray(reviews)) {
    return NextResponse.json({ error: "'reviews' array is required" }, { status: 400 });
  }
  if (reviews.length > 100) {
    return NextResponse.json({ error: "reviews must contain 100 or fewer items" }, { status: 400 });
  }

  try {
    const result = await analyzeReviews(reviews);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/analyze]", err);
    return NextResponse.json({ error: "분석 중 오류가 발생했습니다." }, { status: 500 });
  }
}
