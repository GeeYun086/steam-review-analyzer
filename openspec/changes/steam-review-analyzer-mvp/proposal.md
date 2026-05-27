## Why

게임 개발자와 사업팀은 Steam 유저 리뷰를 수동으로 읽고 분류·정리하는 데 많은 시간을 소비하며, 수백 개 리뷰 중 어떤 문제가 평점에 가장 큰 영향을 주는지 즉시 파악하기 어렵다. MVP를 통해 검색 한 번으로 AI 기반 리뷰 분석과 액션 가능한 개선 피드백을 자동 제공한다.

## What Changes

- Steam 게임 검색 UI 및 API 엔드포인트 신규 추가
- Steam Web API 연동으로 게임별 리뷰(최대 100개) 자동 수집
- Claude API를 활용한 리뷰 7개 카테고리 감성 분류 및 개선 피드백 생성
- 분석 결과를 시각화하는 대시보드(도넛 차트 + 우선순위 카드) 구현
- Next.js App Router 기반 프로젝트 초기 구조 세팅

## Capabilities

### New Capabilities

- `game-search`: Steam API로 게임을 검색하고 기본 정보(이름, 장르, 출시일, 평점)를 반환하는 기능
- `review-collection`: 특정 appId에 대해 Steam 리뷰(긍정 50 / 부정 50)를 수집하는 기능
- `ai-sentiment-analysis`: 수집된 리뷰를 7개 카테고리(게임플레이, 그래픽, 사운드, 스토리, 최적화, 가격, 멀티플레이)로 분류하고 개선 피드백을 생성하는 AI 파이프라인
- `analysis-dashboard`: 카테고리별 감성 도넛 차트와 개선 우선순위 카드로 분석 결과를 시각화하는 대시보드 페이지

### Modified Capabilities

<!-- 기존 스펙 없음 -->

## Impact

- **신규 파일**: `src/app/page.tsx`, `src/app/dashboard/page.tsx`, `src/app/api/search/route.ts`, `src/app/api/reviews/[appId]/route.ts`, `src/app/api/analyze/route.ts`, `src/components/*.tsx`, `src/services/steamService.ts`, `src/services/aiService.ts`
- **외부 의존성**: Anthropic SDK (`@anthropic-ai/sdk`), Recharts, Steam Web API (무료, 키 불필요)
- **환경변수**: `ANTHROPIC_API_KEY` (.env.local)
- **배포**: Vercel 연동 예정
