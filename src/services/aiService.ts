import Groq from "groq-sdk";
import type { Review } from "./steamService";

const isMockMode = !process.env.GROQ_API_KEY;

const client = isMockMode ? null : new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface CategorySentiment {
  positive: number;
  negative: number;
  total: number;
}

export interface AnalysisResult {
  categories: {
    gameplay: CategorySentiment;
    graphics: CategorySentiment;
    sound: CategorySentiment;
    story: CategorySentiment;
    performance: CategorySentiment;
    price: CategorySentiment;
    multiplayer: CategorySentiment;
  };
  summary: string;
  priorities: string[];
  quotes: string[];
}

const SYSTEM_PROMPT = `You are a game review analyst. Analyze Steam game reviews and categorize them.
LANGUAGE RULE: All text values in your JSON response (summary, priorities, quotes) MUST be written in Korean (한국어). No exceptions. Do not use English, Chinese, Vietnamese, or any other language in text fields.

Categories:
- gameplay: Game mechanics, controls, level design, replayability
- graphics: Visual quality, art style, animations
- sound: Music, sound effects, voice acting
- story: Narrative, characters, plot
- performance: FPS, bugs, crashes, optimization, loading times
- price: Value for money, pricing fairness
- multiplayer: Online features, co-op, PvP, matchmaking

For each review, identify which categories it mentions and whether the sentiment is positive or negative.

Output ONLY valid JSON matching this exact schema:
{
  "categories": {
    "gameplay": { "positive": 0, "negative": 0, "total": 0 },
    "graphics": { "positive": 0, "negative": 0, "total": 0 },
    "sound": { "positive": 0, "negative": 0, "total": 0 },
    "story": { "positive": 0, "negative": 0, "total": 0 },
    "performance": { "positive": 0, "negative": 0, "total": 0 },
    "price": { "positive": 0, "negative": 0, "total": 0 },
    "multiplayer": { "positive": 0, "negative": 0, "total": 0 }
  },
  "summary": "2-3 sentence summary of the main issues and strengths",
  "priorities": ["Top improvement priority 1", "Top improvement priority 2", "Top improvement priority 3"],
  "quotes": ["Representative user quote 1", "Representative user quote 2", "Representative user quote 3"]
}

Rules:
- Count each review-category mention once
- priorities: list top issues to fix (max 5, focus on negative feedback)
- quotes: pick the most insightful user quotes verbatim (max 3)
- If all reviews are positive, set priorities to ["주요 문제 없음"] and summarize strengths
- CRITICAL: You MUST write ALL text fields (summary, priorities, quotes) in Korean ONLY. Do not use any other language. Translate and paraphrase user quotes into natural Korean.`;

function makeMockResult(reviews: Review[]): AnalysisResult {
  const positiveCount = reviews.filter((r) => r.recommended).length;
  const negativeCount = reviews.length - positiveCount;
  const ratio = reviews.length > 0 ? positiveCount / reviews.length : 0.7;

  const make = (posRate: number, total: number): CategorySentiment => ({
    positive: Math.round(total * posRate),
    negative: Math.round(total * (1 - posRate)),
    total,
  });

  return {
    categories: {
      gameplay: make(ratio * 0.9, Math.round(reviews.length * 0.7)),
      graphics: make(ratio * 1.0, Math.round(reviews.length * 0.4)),
      sound: make(ratio * 0.85, Math.round(reviews.length * 0.3)),
      story: make(ratio * 0.8, Math.round(reviews.length * 0.5)),
      performance: make(Math.max(0.2, ratio * 0.6), Math.round(reviews.length * 0.5)),
      price: make(ratio * 0.75, Math.round(reviews.length * 0.35)),
      multiplayer: make(ratio * 0.7, Math.round(reviews.length * 0.2)),
    },
    summary: `[MOCK] 총 ${reviews.length}개 리뷰 중 긍정 ${positiveCount}개, 부정 ${negativeCount}개입니다. 게임플레이와 그래픽에 대한 평가는 전반적으로 긍정적이나, 최적화 문제가 주요 불만 요인으로 나타납니다. 실제 분석을 위해 GROQ_API_KEY를 설정해 주세요.`,
    priorities: [
      "[MOCK] 최적화 개선 — 프레임 드롭 및 로딩 시간 단축 필요",
      "[MOCK] 멀티플레이 안정성 — 매칭 오류 및 서버 끊김 보고 다수",
      "[MOCK] 가격 대비 콘텐츠 볼륨 확대",
    ],
    quotes: [
      "[MOCK] \"게임 자체는 훌륭하지만 최적화가 아쉽다.\"",
      "[MOCK] \"그래픽과 스토리는 최고 수준이다.\"",
    ],
  };
}

export async function analyzeReviews(reviews: Review[]): Promise<AnalysisResult> {
  if (reviews.length === 0) {
    return {
      categories: {
        gameplay: { positive: 0, negative: 0, total: 0 },
        graphics: { positive: 0, negative: 0, total: 0 },
        sound: { positive: 0, negative: 0, total: 0 },
        story: { positive: 0, negative: 0, total: 0 },
        performance: { positive: 0, negative: 0, total: 0 },
        price: { positive: 0, negative: 0, total: 0 },
        multiplayer: { positive: 0, negative: 0, total: 0 },
      },
      summary: "리뷰가 없습니다.",
      priorities: [],
      quotes: [],
    };
  }

  if (isMockMode) return makeMockResult(reviews);

  const positive = reviews.filter((r) => r.recommended).slice(0, 20);
  const negative = reviews.filter((r) => !r.recommended).slice(0, 20);
  const sampled = [...positive, ...negative];

  const reviewText = sampled
    .map((r, i) => `[${i + 1}] ${r.recommended ? "👍" : "👎"} ${r.text.slice(0, 300)}`)
    .join("\n\n");

  const completion = await client!.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Analyze these ${sampled.length} Steam game reviews:\n\n${reviewText}` },
    ],
    response_format: { type: "json_object" },
    max_tokens: 2000,
  });

  const text = completion.choices[0].message.content ?? "";

  const result = JSON.parse(text) as AnalysisResult;

  if (!result.categories || !result.summary || !result.priorities || !result.quotes) {
    throw new Error("Invalid response structure");
  }

  return result;
}
