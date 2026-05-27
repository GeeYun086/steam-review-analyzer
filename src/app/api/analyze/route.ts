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

  try {
    const result = await analyzeReviews(reviews);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
