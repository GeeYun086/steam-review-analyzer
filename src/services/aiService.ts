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

## ABSOLUTE LANGUAGE RULE — VIOLATIONS WILL BREAK THE SYSTEM ##
- "summary", "priorities", "quotes" 필드의 모든 텍스트는 반드시 한국어(Korean)로만 작성하세요.
- 원문이 어떤 언어여도 무조건 한국어로 번역하세요. 원문을 그대로 복사하지 마세요.
- 일본어(ゲーム 등), 중국어, 태국어, 영어 단어를 텍스트 필드에 절대 포함하지 마세요.
- 게임 제목은 괄호 없이 그냥 한국어 설명으로 대체하세요.

Categories:
- gameplay: 게임 메커닉, 조작감, 레벨 디자인, 재플레이성
- graphics: 그래픽 품질, 아트 스타일, 애니메이션
- sound: 음악, 효과음, 보이스
- story: 스토리, 캐릭터, 플롯
- performance: FPS, 버그, 크래시, 최적화, 로딩 시간
- price: 가격 대비 가치
- multiplayer: 온라인, 협동, PvP, 매칭

Output ONLY valid JSON:
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
  "summary": "2~3문장 한국어 요약",
  "priorities": ["한국어 개선 우선순위 1", "한국어 개선 우선순위 2", "한국어 개선 우선순위 3"],
  "quotes": ["한국어로 번역된 유저 발언 1", "한국어로 번역된 유저 발언 2", "한국어로 번역된 유저 발언 3"]
}

Rules:
- priorities: 개선이 필요한 상위 항목 (최대 5개, 부정 피드백 중심)
- quotes: 가장 핵심적인 유저 의견을 자연스러운 한국어로 번역·요약 (원문 절대 사용 금지)
- 긍정 리뷰만 있으면 priorities를 ["주요 문제 없음"]으로 설정`;

// AI 응답 런타임 스키마 검증
function validateAnalysisResult(data: unknown): AnalysisResult {
  if (typeof data !== "object" || data === null) throw new Error("AI response is not an object");
  const d = data as Record<string, unknown>;

  const CATEGORY_KEYS = ["gameplay","graphics","sound","story","performance","price","multiplayer"] as const;
  if (typeof d.categories !== "object" || d.categories === null) throw new Error("Missing categories");
  for (const key of CATEGORY_KEYS) {
    const cat = (d.categories as Record<string, unknown>)[key];
    if (typeof cat !== "object" || cat === null) throw new Error(`Missing category: ${key}`);
    const c = cat as Record<string, unknown>;
    if (typeof c.positive !== "number" || typeof c.negative !== "number" || typeof c.total !== "number") {
      throw new Error(`Invalid category shape: ${key}`);
    }
  }
  if (typeof d.summary !== "string") throw new Error("Missing summary");
  if (!Array.isArray(d.priorities) || d.priorities.some((p) => typeof p !== "string")) throw new Error("Invalid priorities");
  if (!Array.isArray(d.quotes) || d.quotes.some((q) => typeof q !== "string")) throw new Error("Invalid quotes");

  return data as AnalysisResult;
}

// 한국어·ASCII 이외 문자(일본어·중국어·태국어 등) 감지
function hasForeignChars(text: string): boolean {
  // 허용: 인쇄 가능 ASCII(U+0020-U+007E), 한글 음절(U+AC00-U+D7A3), 한글 자모(U+1100+, U+3130+)
  return /[^ -~가-힣ᄀ-ᇿ㄰-㆏]/.test(text);
}

// 비한국어 텍스트 감지 시 2차 번역 API 호출로 강제 교정
async function enforceKorean(result: AnalysisResult): Promise<AnalysisResult> {
  const allTexts = [result.summary, ...result.priorities, ...result.quotes];
  if (!allTexts.some(hasForeignChars)) return result;

  const input = {
    summary: result.summary,
    priorities: result.priorities,
    quotes: result.quotes,
  };

  const correction = await client!.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are a Korean translator. Translate every string value in the given JSON to natural Korean. " +
          "Output ONLY valid JSON with the exact same structure. " +
          "Every character in string values must be Korean (한국어) or basic punctuation. " +
          "Do NOT include Japanese, Chinese, Thai, English words, or any non-Korean script.",
      },
      {
        role: "user",
        content: `Translate all text values to Korean:\n${JSON.stringify(input, null, 2)}`,
      },
    ],
    response_format: { type: "json_object" },
    max_tokens: 1000,
  });

  const corrected = JSON.parse(correction.choices[0].message.content ?? "{}") as Partial<typeof input>;

  return {
    ...result,
    summary: corrected.summary ?? result.summary,
    priorities: corrected.priorities ?? result.priorities,
    quotes: corrected.quotes ?? result.quotes,
  };
}

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
  const parsed = JSON.parse(text);
  const result = validateAnalysisResult(parsed);

  // 비한국어 문자 감지 시 자동 교정
  return await enforceKorean(result);
}
