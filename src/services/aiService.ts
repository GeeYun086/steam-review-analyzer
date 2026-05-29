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

##  ABSOLUTE LANGUAGE RULE — NO EXCEPTIONS ##
Every single character in "summary", "priorities", and "quotes" fields MUST be written in Korean (한국어).
This includes quotes — do NOT copy the original text. Always translate and rewrite in natural Korean.
If you output ANY non-Korean characters (English, Chinese, Thai, Japanese, Vietnamese, etc.) in text fields, the response is invalid.

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
  "summary": "전체 리뷰의 핵심 장단점을 2~3문장으로 요약 (반드시 한국어)",
  "priorities": ["개선 우선순위 1 (한국어)", "개선 우선순위 2 (한국어)", "개선 우선순위 3 (한국어)"],
  "quotes": ["대표 유저 발언을 한국어로 번역·요약한 것 1", "대표 유저 발언 2", "대표 유저 발언 3"]
}

Rules:
- Count each review-category mention once
- priorities: list top issues to fix (max 5, focus on negative feedback)
- quotes: translate and paraphrase the most insightful user opinions into natural Korean (NEVER copy original non-Korean text)
- If all reviews are positive, set priorities to ["주요 문제 없음"] and summarize strengths
- REMINDER: summary, priorities, quotes must contain ONLY Korean text (한국어만 사용)`;

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
