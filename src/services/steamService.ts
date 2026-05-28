export interface GameSearchResult {
  appid: number;
  name: string;
  icon: string;
  logo: string;
}

export interface GameDetails {
  appid: number;
  name: string;
  shortDescription: string;
  headerImage: string;
  genres: string[];
  releaseDate: string;
  totalReviews: number;
  positiveReviews: number;
  reviewScore: number;
}

export interface Review {
  text: string;
  recommended: boolean;
  timestamp: number;
}

export async function searchGames(query: string): Promise<GameSearchResult[]> {
  const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&l=english&cc=US`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Steam search failed");
  const data = await res.json();
  return (data.items ?? []).slice(0, 5).map((item: { id: number; name: string; tiny_image: string; logo: string }) => ({
    appid: item.id,
    name: item.name,
    icon: item.tiny_image,
    logo: item.logo,
  }));
}

export async function getGameDetails(appId: number): Promise<GameDetails | null> {
  const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&l=english`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  const data = await res.json();
  const game = data[appId.toString()]?.data;
  if (!game) return null;

  return {
    appid: appId,
    name: game.name,
    shortDescription: game.short_description ?? "",
    headerImage: game.header_image ?? "",
    genres: (game.genres ?? []).map((g: { description: string }) => g.description),
    releaseDate: game.release_date?.date ?? "",
    totalReviews: 0,
    positiveReviews: 0,
    reviewScore: 0,
  };
}

interface ReviewBatchResult {
  reviews: Review[];
  totalReviews: number;
}

async function fetchReviewBatch(appId: number, filter: "positive" | "negative", count: number): Promise<ReviewBatchResult> {
  const url = `https://store.steampowered.com/appreviews/${appId}?json=1&filter=recent&review_type=${filter}&num_per_page=${count}&l=english`;
  const res = await fetch(url);
  if (!res.ok) return { reviews: [], totalReviews: 0 };
  const data = await res.json();
  if (!data.success || !data.reviews) return { reviews: [], totalReviews: 0 };

  const reviews = data.reviews
    .map((r: { review: string; voted_up: boolean; timestamp_created: number }) => ({
      text: r.review,
      recommended: r.voted_up,
      timestamp: r.timestamp_created,
    }))
    .filter((r: Review) => r.text.length >= 10);

  const totalReviews = data.query_summary?.total_reviews ?? 0;
  return { reviews, totalReviews };
}

export async function getReviews(appId: number): Promise<{ reviews: Review[]; totalReviews: number }> {
  const [positive, negative] = await Promise.all([
    fetchReviewBatch(appId, "positive", 50),
    fetchReviewBatch(appId, "negative", 50),
  ]);
  return {
    reviews: [...positive.reviews, ...negative.reviews],
    totalReviews: positive.totalReviews + negative.totalReviews,
  };
}
