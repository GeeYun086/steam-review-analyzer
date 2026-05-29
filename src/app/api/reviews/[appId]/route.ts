import { NextRequest, NextResponse } from "next/server";
import { getReviews } from "@/services/steamService";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const { appId } = await params;
  const id = parseInt(appId, 10);

  if (isNaN(id) || id <= 0 || id > 2_147_483_647) {
    return NextResponse.json({ error: "Invalid appId" }, { status: 400 });
  }

  try {
    const { reviews, totalReviews } = await getReviews(id);
    return NextResponse.json({ reviews, count: reviews.length, totalReviews });
  } catch {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
