# Security Review — Steam Review Analyzer MVP

> 검토일: 2026-05-29  
> 검토 범위: `src/`, `next.config.ts`, `package.json`, OpenSpec change specs  
> 기준: OWASP Top 10, Next.js App Router 보안 가이드라인

---

## 요약

| 심각도 | 건수 |
|--------|------|
| 🔴 높음 (High) | 2 |
| 🟠 보통 (Medium) | 4 |
| 🟡 낮음 (Low) | 2 |
| ✅ 안전 확인 | 7 |

---

## 🔴 High

### H-01 — 보안 헤더 미설정 (`next.config.ts`)

**파일**: `next.config.ts`

`X-Frame-Options`, `X-Content-Type-Options`, `Content-Security-Policy` 등 보안 헤더가 전혀 없음.  
현재 `next.config.ts`는 Turbopack 설정만 포함.

**위험**: Clickjacking, MIME 스니핑, XSS 벡터 확대

**권장 조치**:
```ts
// next.config.ts
const securityHeaders = [
  { key: "X-Frame-Options",          value: "DENY" },
  { key: "X-Content-Type-Options",   value: "nosniff" },
  { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",       value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};
```

---

### H-02 — API 요청 횟수 제한 없음 (Rate Limiting 미설정)

**파일**: `src/app/api/search/route.ts`, `src/app/api/reviews/[appId]/route.ts`, `src/app/api/analyze/route.ts`

모든 API 라우트에 Rate Limiting이 없음.

**위험**:
- `/api/analyze`: Groq API 무한 호출 → 비용 폭탄
- `/api/reviews/:id`: Steam API 남용으로 IP 차단 가능성
- `/api/search`: 검색어 브루트포싱

**권장 조치**: Vercel의 Firewall Rate Limiting 설정 (Dashboard → Firewall → Rate Limit Rules) 또는 Edge Middleware 레벨에서 처리.

---

## 🟠 Medium

### M-01 — 사용하지 않는 AI SDK 패키지 잔존 (`package.json`)

**파일**: `package.json` (lines 12–14)

```json
"@anthropic-ai/sdk": "^0.55.0",   // 미사용
"@google/genai": "^2.6.0",        // 미사용
"groq-sdk": "^1.2.1"              // 실제 사용
```

실제 코드(`src/services/aiService.ts`)는 `groq-sdk`만 사용하나 나머지 두 SDK가 `dependencies`에 포함됨.

**위험**: 번들 크기 증가, 불필요한 공격 표면 확대, 미래 취약점 노출 가능성

**권장 조치**:
```bash
npm uninstall @anthropic-ai/sdk @google/genai
```

---

### M-02 — `/api/analyze` 요청 본문 크기 제한 없음

**파일**: `src/app/api/analyze/route.ts`

```ts
body = await request.json();  // 크기 검사 없음
const { reviews } = body;
if (!Array.isArray(reviews)) { ... }
```

`reviews` 배열에 아무 크기 제한이 없음. 악의적으로 수천 개의 리뷰를 담아 보내면 Groq API 토큰 비용이 폭증.

**권장 조치**:
```ts
if (!Array.isArray(reviews) || reviews.length > 100) {
  return NextResponse.json({ error: "reviews must be an array of 100 or fewer items" }, { status: 400 });
}
```

---

### M-03 — `appId` 상한값 검사 없음

**파일**: `src/app/api/reviews/[appId]/route.ts` (line 9–12)

```ts
const id = parseInt(appId, 10);
if (isNaN(id) || id <= 0) { ... }  // 하한만 있음
```

Steam App ID는 최대 32비트 정수(약 21억). 하한 검사만 있고 상한이 없어 임의의 큰 숫자 전달 가능.

**권장 조치**:
```ts
if (isNaN(id) || id <= 0 || id > 2_147_483_647) {
  return NextResponse.json({ error: "Invalid appId" }, { status: 400 });
}
```

---

### M-04 — 외부 API 호출 타임아웃 없음

**파일**: `src/services/steamService.ts` (lines 27, 40, 66)

Steam API 호출 시 `AbortController` 타임아웃 미설정. Steam 서버가 응답을 지연하면 Vercel 서버리스 함수가 최대 300초까지 대기.

**권장 조치**:
```ts
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 10_000);
try {
  const res = await fetch(url, { signal: controller.signal });
} finally {
  clearTimeout(timer);
}
```

---

## 🟡 Low

### L-01 — API 오류 메시지 내부 정보 누출 가능성

**파일**: `src/app/api/analyze/route.ts` (line 22), `src/services/aiService.ts` (line 189)

```ts
const message = err instanceof Error ? err.message : "Analysis failed";
return NextResponse.json({ error: message }, { status: 500 });
```

`err.message`를 그대로 클라이언트에 전달. Groq API 오류 메시지에 내부 정보(모델명, API 한도 등)가 포함될 수 있음.

**권장 조치**: 서버 로그에는 전체 오류, 클라이언트에는 일반 메시지만 전달:
```ts
console.error("[analyze] error:", err);
return NextResponse.json({ error: "분석 중 오류가 발생했습니다." }, { status: 500 });
```

---

### L-02 — AI 응답 스키마 런타임 검증 없음

**파일**: `src/services/aiService.ts` (line 187)

```ts
const result = JSON.parse(text) as AnalysisResult;  // 타입 단언만 사용
```

LLM이 올바른 JSON이지만 예상과 다른 구조를 반환하면 런타임에서 조용히 실패.

**권장 조치**: `zod` 스키마로 런타임 검증:
```ts
import { z } from "zod";
const CategorySchema = z.object({ positive: z.number(), negative: z.number(), total: z.number() });
const AnalysisSchema = z.object({ categories: z.record(CategorySchema), summary: z.string(), priorities: z.array(z.string()), quotes: z.array(z.string()) });
const result = AnalysisSchema.parse(JSON.parse(text));
```

---

## ✅ 안전 확인 항목

| 항목 | 상태 | 근거 |
|------|------|------|
| `.env.local` Git 추적 여부 | ✅ 안전 | `.gitignore`에 포함, `git show HEAD:.env.local` → not tracked |
| API 키 소스코드 하드코딩 | ✅ 없음 | `aiService.ts` 전수 확인, `process.env` 경유만 사용 |
| `dangerouslySetInnerHTML` 사용 | ✅ 없음 | 전체 `src/` 검색 결과 없음 |
| XSS — React 자동 이스케이프 | ✅ 안전 | 모든 출력이 JSX 텍스트 노드 (자동 이스케이프), `innerHTML` 미사용 |
| sessionStorage 민감정보 저장 | ✅ 안전 | 저장 데이터: 게임명·appId·분석결과 — PII·결제정보 없음 |
| 외부 링크 보안 속성 | ✅ 해당 없음 | UI에 외부 `<a href>` 링크 없음 |
| 외부 API HTTPS 사용 | ✅ 안전 | 모든 Steam API 호출 `https://` 확인 |

---

## 배포 전 체크리스트

```
[ ] H-01: next.config.ts 보안 헤더 추가
[ ] H-02: Vercel Firewall Rate Limiting 설정
[ ] M-01: npm uninstall @anthropic-ai/sdk @google/genai
[ ] M-02: /api/analyze reviews 배열 최대 100개 제한
[ ] M-03: appId 상한값 검사 추가
[ ] M-04: steamService.ts 외부 fetch 타임아웃 추가
[ ] L-01: API 오류 메시지 일반화 (내부 정보 제거)
[ ] L-02: Zod 스키마로 AI 응답 런타임 검증
[ ] Vercel 환경변수 설정 확인 (GROQ_API_KEY)
```

---

*본 검토는 MVP 수준 코드베이스를 대상으로 하며, 실 서비스 전환 시 전문 보안 감사를 권장합니다.*
