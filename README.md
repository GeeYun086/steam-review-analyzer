# Steam 리뷰 분석기

Steam 게임 유저 리뷰를 AI가 자동 분석해 개선 우선순위를 30초 안에 제공하는 대시보드

**배포 주소**: https://steam-review-analyzer-pi.vercel.app

---

## 주요 기능

1. **게임 검색** — Steam Web API를 이용한 실시간 게임 검색 (인기 게임 8개 빠른 선택 지원)
2. **리뷰 자동 수집** — 긍정 50개 + 부정 50개, 최대 100개 자동 수집
3. **AI 감성 분석** — 7개 카테고리(게임플레이·그래픽·사운드·스토리·최적화·가격·멀티플레이) 도넛 차트 시각화
4. **개선 우선순위 카드** — 핵심 문제 요약 + 액션 가능한 우선순위 리스트 + 대표 유저 발언 인용

---

## 화면 구성

- **홈 화면**: 딥 퍼플 그라데이션 배경, 검색창 히어로 섹션, 인기 게임 8개 카드 그리드
- **검색 결과**: 게임 카드 목록, 선택 시 "리뷰 분석 시작" 버튼
- **분석 진행**: 단계별 로딩 ("리뷰 수집 중..." → "AI 분석 중...")
- **대시보드**: 7개 카테고리 도넛 차트, 개선 우선순위 카드, 대표 유저 발언 인용

---

## 기술 스택

| 영역 | 기술 |
|---|---|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| 차트 | Recharts |
| AI | Groq API (llama-3.3-70b-versatile) |
| 외부 데이터 | Steam Web API (무료, 키 불필요) |
| 테스트 | Playwright E2E (14개 테스트) |
| 배포 | Vercel |

---

## 시작하기

### 요구 사항

- Node.js 18 이상
- Groq API 키 (없으면 mock 모드로 동작)

### 설치 및 실행

```bash
git clone https://github.com/GeeYun086/steam-review-analyzer.git
cd steam-review-analyzer
npm install
```

`.env.local` 파일을 프로젝트 루트에 생성합니다.

```bash
# .env.local
GROQ_API_KEY=gsk_...   # Groq API 키 (없으면 mock 모드로 동작)
```

```bash
npm run dev
# http://localhost:3000
```

> API 키가 없어도 mock 모드로 실행되어 UI 전체를 확인할 수 있습니다.

---

## 테스트

```bash
npm run test:e2e
```

Playwright E2E 테스트 14개 (검색·분석·대시보드·엣지케이스) 가 포함되어 있습니다.

---

## 환경 변수

| 변수명 | 설명 | 필수 여부 |
|---|---|---|
| `GROQ_API_KEY` | Groq API 키 (`gsk_...`) | 선택 (없으면 mock 모드) |

`.env.local` 파일은 `.gitignore`에 포함되어 있어 저장소에 추적되지 않습니다.

---

## 보안 및 제한 사항

- **Rate Limiting**: analyze 10회/분, reviews 20회/분, search 30회/분
- **보안 헤더**: `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection` 등 적용

### 제외 범위

- 로그인 / 인증
- 결제
- 분석 히스토리 저장
- PDF 내보내기
- 다국어 필터
- 여러 게임 동시 비교

---

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx                      # 홈 (검색 화면)
│   ├── dashboard/
│   │   └── page.tsx                  # 분석 결과 대시보드
│   └── api/
│       ├── search/route.ts           # GET /api/search?q=게임명
│       ├── reviews/[appId]/route.ts  # GET /api/reviews/:appId
│       └── analyze/route.ts         # POST /api/analyze
├── components/
│   ├── SearchBar.tsx
│   ├── GameCard.tsx
│   ├── SentimentChart.tsx
│   ├── FeedbackCard.tsx
│   └── ReviewSample.tsx
└── services/
    ├── steamService.ts
    └── aiService.ts
```

---

## 라이선스

MIT
