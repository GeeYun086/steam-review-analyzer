import { NextRequest, NextResponse } from "next/server";
import { searchGames } from "@/services/steamService";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q || q.trim().length === 0) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  try {
    const games = await searchGames(q.trim());
    return NextResponse.json({ games });
  } catch {
    return NextResponse.json({ error: "Failed to search games" }, { status: 500 });
  }
}
