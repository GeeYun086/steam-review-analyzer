# Technical Design

## 1. 문서 목적

이 문서는 서비스의 기술 구현 방향을 정리한다.  
제품의 가치나 사용자 문제는 Product Brief에서 다루고, 이 문서에서는 실제 개발자가 구현할 구조를 정의한다.

---

## 2. Architecture Overview

### 전체 구조

```text
User
→ Next.js App (App Router)
→ Pages / Routes
→ UI Components
→ Next.js API Routes
→ steamService.ts   →  Steam Web API
→ aiService.ts      →  Anthropic Claude API
```

### 이번 MVP의 구현 범위

* 단일 사용자 기준
* Next.js 단일 프로젝트 (프론트 + API Routes 통합)
* 세션 내 데이터만 사용 — 별도 DB 없음
* Steam Web API 실데이터 연동
* Claude API를 통한 감성 분류 및 피드백 생성
* 인증, 결제, 데이터 저장 제외

---

## 3. Tech Stack

| Area            | Technology       | Reason                         |
| --------------- | ---------------- | ------------------------------ |
| Framework       | Next.js          | App Router 기반 웹앱 + API Routes  |
| UI Library      | React            | 컴포넌트 기반 UI 구성                  |
| Language        | TypeScript       | 타입 기반 안정성 확보                   |
| Styling         | Tailwind CSS     | 빠른 UI 스타일링                     |
| Chart           | Recharts         | 감성 분포 도넛 차트 시각화                |
| AI API          | Anthropic Claude | 리뷰 감성 분류 + 피드백 생성              |
| External Data   | Steam Web API    | 게임 검색 및 리뷰 수집 (키 불필요)          |
| AI Coding       | Claude Code      | 코드 생성, 수정, 검토                  |
| Version Control | GitHub           | 커밋, 브랜치 관리                     |
| Test            | Playwright       | 4회차 핵심 흐름 E2E 테스트              |
| Deploy          | Vercel           | Next.js 배포                     |

---

## 4. Route Design

| Route                    | File Path                             | Purpose          | Notes                    |
| ------------------------ | ------------------------------------- | ---------------- | ------------------------ |
| `/`                      | `src/app/page.tsx`                    | Landing + 검색     | Hero, 서비스 소개, 게임 검색창     |
| `/dashboard`             | `src/app/dashboard/page.tsx`          | 분석 결과 대시보드       | 차트, 피드백 카드, 유저 인용        |
| `/api/search`            | `src/app/api/search/route.ts`         | 게임 검색 API        | GET `?q=게임명`             |
| `/api/reviews/[appId]`   | `src/app/api/reviews/[appId]/route.ts`| 리뷰 수집 API        | GET, 긍정 50 / 부정 50       |
| `/api/analyze`           | `src/app/api/analyze/route.ts`        | AI 감성 분석 API     | POST, Claude API 호출      |

---

## 5. Source Structure

```text
src/
  app/
    page.tsx                     # Landing + 검색 화면
    dashboard/
      page.tsx                   # 분석 결과 대시보드
    api/
      search/
        route.ts                 # GET /api/search
      reviews/
        [appId]/
          route.ts               # GET /api/reviews/:appId
      analyze/
        route.ts                 # POST /api/analyze

  components/
    SearchBar.tsx
    GameCard.tsx
    GameHeader.tsx
    LoadingSteps.tsx
    SentimentChart.tsx
    FeedbackCard.tsx
    ReviewSample.tsx
    ErrorState.tsx

  services/
    steamService.ts              # Steam Web API 호출 로직
    aiService.ts                 # Claude API 호출 + 프롬프트 로직

  types/
    index.ts                     # 공유 타입 정의
```

### 폴더 역할

| Folder              | Role                             |
| ------------------- | -------------------------------- |
| `src/app`           | Next.js 라우트와 페이지 관리              |
| `src/app/api`       | 서버사이드 API Routes (Steam / Claude 호출) |
| `src/components`    | 재사용 가능한 UI 컴포넌트                  |
| `src/services`      | 외부 API 호출 로직 분리                  |
| `src/types`         | 전역 타입 정의                         |

---

## 6. Feature Module Design

### 핵심 Feature

| Feature             | Description                    | Priority |
| ------------------- | ------------------------------ | -------- |
| Game Search         | Steam에서 게임 이름으로 검색             | Must     |
| Review Collection   | 긍정·부정 리뷰 최대 100개 자동 수집         | Must     |
| AI Sentiment        | 7개 카테고리 자동 분류 + 긍정·부정 비율 계산    | Must     |
| Feedback Generation | 개선 우선순위 1~3위 + 대표 유저 발언 인용 생성  | Must     |
| Dashboard Chart     | 카테고리별 감성 도넛 차트 시각화             | Must     |
| Loading UX          | 단계별 진행 메시지 + 스켈레톤 표시           | Should   |
| Error Handling      | API 오류 시 메시지 + 재시도 버튼           | Should   |

### 이번 회차에서 구현할 Feature

* Route 구조 (Landing, Dashboard, API Routes)
* Landing Page 초안 (Hero + 검색창)
* steamService.ts — 게임 검색, 리뷰 수집
* aiService.ts — Claude API 호출, 프롬프트 로직
* 기본 타입 정의
* 컴포넌트 placeholder

### 다음 회차로 넘길 Feature

* Dashboard UI 완성 (차트, 피드백 카드, 인용)
* 로딩 단계 메시지 UX
* 오류 처리 흐름
* Playwright E2E 테스트

---

## 7. Data Model

### 기본 타입

```ts
// 게임 검색 결과
export type GameSearchResult = {
  appId: string;
  name: string;
  headerImage: string;
  reviewScore?: string;
};

// Steam 개별 리뷰
export type SteamReview = {
  reviewId: string;
  text: string;
  votedUp: boolean;
  votesUp: number;
};

// 수집된 리뷰 묶음
export type ReviewCollection = {
  appId: string;
  positive: SteamReview[];
  negative: SteamReview[];
};

// 카테고리별 감성 분석 결과
export type SentimentCategory = {
  key: "gameplay" | "graphics" | "sound" | "story" | "performance" | "value" | "multiplayer";
  name: string;
  positiveRate: number;
  negativeRate: number;
  count: number;
};

// 개선 우선순위 항목
export type FeedbackPriority = {
  rank: number;
  category: string;
  issue: string;
  suggestion: string;
};

// 대표 유저 발언
export type ReviewQuote = {
  category: string;
  text: string;
  sentiment: "positive" | "negative";
};

// 전체 분석 결과
export type AnalysisResult = {
  categories: SentimentCategory[];
  feedback: {
    summary: string;
    priorities: FeedbackPriority[];
    quotes: ReviewQuote[];
  };
};
```

### 서비스별 확장 필드

| Field           | Type                | Required | Description          |
| --------------- | ------------------- | -------- | -------------------- |
| `appId`         | `string`            | Yes      | Steam 게임 고유 ID       |
| `name`          | `string`            | Yes      | 게임 이름                |
| `headerImage`   | `string`            | Yes      | 커버 이미지 URL           |
| `reviewScore`   | `string`            | No       | 현재 Steam 평점          |
| `positiveRate`  | `number`            | Yes      | 카테고리 긍정 비율 (0~100)   |
| `negativeRate`  | `number`            | Yes      | 카테고리 부정 비율 (0~100)   |
| `sentiment`     | `"positive" \| "negative"` | Yes | 유저 발언 감성 분류  |

---

## 8. State Design

| State            | Type                        | Purpose                |
| ---------------- | --------------------------- | ---------------------- |
| `searchQuery`    | `string`                    | 검색창 입력값               |
| `searchResults`  | `GameSearchResult[]`        | 검색 결과 게임 목록           |
| `selectedGame`   | `GameSearchResult \| null`  | 선택된 게임                 |
| `analysisResult` | `AnalysisResult \| null`    | AI 분석 결과               |
| `loadingStep`    | `string \| null`            | 현재 단계 로딩 메시지           |
| `error`          | `string \| null`            | 오류 메시지                 |

### 상태 관리 방식

이번 MVP에서는 별도 상태 관리 라이브러리를 사용하지 않는다.

* React `useState`
* 필요 시 `useEffect`, `useMemo`
* 페이지 간 데이터 전달은 URL query parameter 또는 sessionStorage 사용

---

## 9. Storage Strategy

### 1차 MVP

| Option         | Decision                     |
| -------------- | ---------------------------- |
| DB             | 사용하지 않음                      |
| localStorage   | 사용하지 않음                      |
| sessionStorage | 게임 선택 → 대시보드 간 데이터 전달에 한해 사용 |
| mock data      | 개발 중 API 응답 시뮬레이션용           |

### 데이터 흐름

```text
User Action (게임 선택)
→ /api/reviews/:appId 호출 (Steam API)
→ /api/analyze 호출 (Claude API)
→ React State 업데이트
→ Dashboard UI 렌더링
```

### 향후 확장 가능성

* 분석 히스토리 DB 저장
* 사용자 인증 + 저장 기능
* 여러 게임 비교 분석

---

## 10. API Design

### 내부 API Routes

| API                      | Method | Request                            | Response                    |
| ------------------------ | ------ | ---------------------------------- | --------------------------- |
| `/api/search`            | GET    | `?q=게임명`                           | `GameSearchResult[]`        |
| `/api/reviews/:appId`    | GET    | `appId` (path)                     | `ReviewCollection`          |
| `/api/analyze`           | POST   | `{ appId, reviews: ReviewCollection }` | `AnalysisResult`        |

### 외부 API 호출 (서버사이드 only)

| API                        | 용도         | 키 필요 여부 |
| -------------------------- | ------------ | ------------ |
| Steam storesearch API      | 게임 검색       | 불필요         |
| Steam appreviews API       | 리뷰 수집       | 불필요         |
| Anthropic Messages API     | 감성 분석·피드백  | 필요 (서버사이드) |

---

## 11. Validation Rules

| Rule                  | Description                          |
| --------------------- | ------------------------------------ |
| Required Search Query | 검색어는 비어 있을 수 없다                      |
| Valid AppId           | appId는 숫자 문자열이어야 한다                  |
| Review Minimum        | 수집된 리뷰가 0개이면 분석을 진행하지 않는다           |
| Claude JSON Format    | Claude 응답은 유효한 JSON이어야 하며, 파싱 실패 시 오류 처리한다 |
| No Sensitive Data     | API key 등 민감 정보는 클라이언트에 노출하지 않는다    |

---

## 12. Error Handling

| Situation              | Handling                          |
| ---------------------- | --------------------------------- |
| 검색 결과 없음              | "검색 결과가 없습니다" 안내 문구 표시           |
| Steam API 호출 실패       | 오류 메시지 + 재시도 버튼 표시               |
| 리뷰 수집 결과 0개           | "리뷰가 충분하지 않습니다" 안내 문구 표시         |
| Claude API 호출 실패      | 오류 메시지 + 재시도 버튼 표시               |
| Claude JSON 파싱 실패     | 오류 메시지 표시, 원시 응답 로그              |
| 네트워크 오류               | ErrorState 컴포넌트 표시 + 재시도 버튼       |

---

## 13. Accessibility Considerations

* 입력 필드는 `label`을 가진다.
* 버튼 텍스트는 기능을 설명한다.
* 긍정·부정 구분 시 색상과 텍스트 레이블을 함께 사용한다.
* 차트에는 스크린리더용 `aria-label`을 포함한다.
* 주요 영역은 heading 구조를 가진다 (h1 → h2 → h3).
* 키보드로 주요 액션(검색, 선택)을 수행할 수 있어야 한다.

---

## 14. Security Considerations

이번 MVP에서 지킬 보안 원칙

* `ANTHROPIC_API_KEY`는 `.env.local`에만 저장하고 GitHub에 커밋하지 않는다.
* Claude API와 Steam API는 반드시 서버사이드(API Routes)에서만 호출한다.
* 클라이언트에 API key가 노출되지 않도록 `NEXT_PUBLIC_` prefix를 사용하지 않는다.
* 사용자의 민감한 개인정보를 수집하거나 저장하지 않는다.

---

## 15. Decision Log

| Decision                  | Reason                              | Consequence              |
| ------------------------- | ----------------------------------- | ------------------------ |
| Next.js App Router 사용     | API Routes와 UI를 단일 프로젝트로 통합        | 별도 Express 서버 불필요        |
| TypeScript 사용             | 외부 API 응답 타입과 컴포넌트 props를 명확히 하기 위해 | 초기 작성량 증가               |
| DB 미사용                   | 분석은 매번 최신 리뷰 기준으로 실행              | 분석 히스토리 저장 불가 (MVP 제외)  |
| Claude API 서버사이드 호출      | API key 보안                          | 클라이언트에서 직접 호출 불가        |
| Steam API 키 불필요          | 공개 엔드포인트 활용으로 초기 진입 장벽 제거         | 요청 빈도 제한 존재, 캐싱 고려 필요   |

---

## 16. Implementation Notes

3회차에서 구현할 때 Claude Code는 다음 순서를 따른다.

1. 현재 파일 구조 확인
2. `docs/` 문서 읽기
3. 수정 전 계획 제안
4. 작은 단위로 구현 (steamService → aiService → API Routes → UI 순)
5. `next dev`로 실행 또는 build로 검증
6. 변경 파일 요약
7. commit message 제안

---

## 17. Open Questions

| Question                          | Decision Needed By |
| --------------------------------- | ------------------ |
| Steam API 요청 빈도 제한 대응 전략은?       | 3회차 시작 전           |
| Claude 응답 JSON 파싱 실패 시 재시도할 것인가? | 3회차 시작 전           |
| 도넛 차트 라이브러리를 Recharts로 확정할 것인가?  | 3회차 시작 전           |
| 대시보드 진입 방식은 URL query vs sessionStorage? | 3회차 시작 전      |
