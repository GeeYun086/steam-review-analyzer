## 1. 프로젝트 초기 세팅

- [x] 1.1 `npx create-next-app@latest`로 Next.js + TypeScript + Tailwind CSS 프로젝트 초기화
- [x] 1.2 Recharts, `@anthropic-ai/sdk` 패키지 설치
- [x] 1.3 `.env.local` 파일 생성 및 `ANTHROPIC_API_KEY` 환경변수 설정
- [x] 1.4 `src/services/`, `src/components/`, `src/app/api/` 폴더 구조 생성

## 2. Steam 서비스 레이어

- [x] 2.1 `src/services/steamService.ts` 생성 — Steam 스토어 검색 API 연동(`/api/storesearch/`)
- [x] 2.2 게임 기본 정보 조회 함수 구현(`/api/appdetails?appids=`)
- [x] 2.3 리뷰 수집 함수 구현 — 긍정 50개 / 부정 50개 분리 요청
- [x] 2.4 10자 미만 리뷰 필터링 및 `{ text, recommended, timestamp }` 형식으로 정제

## 3. AI 서비스 레이어

- [x] 3.1 `src/services/aiService.ts` 생성 — Anthropic SDK 초기화
- [x] 3.2 시스템 프롬프트(7개 카테고리 정의 + JSON 출력 스키마) 작성 및 `cache_control` 적용
- [x] 3.3 단일 Claude API 호출로 카테고리 분류 + 개선 피드백 동시 생성 구현
- [x] 3.4 API 응답 JSON 파싱 및 유효성 검증 로직 추가

## 4. API Routes 구현

- [x] 4.1 `src/app/api/search/route.ts` — GET `/api/search?q=게임명` 엔드포인트
- [x] 4.2 `src/app/api/reviews/[appId]/route.ts` — GET `/api/reviews/:appId` 엔드포인트
- [x] 4.3 `src/app/api/analyze/route.ts` — POST `/api/analyze` 엔드포인트 (리뷰 목록 받아 AI 분석)
- [x] 4.4 각 엔드포인트에 입력값 검증 및 에러 응답 추가

## 5. UI 컴포넌트 구현

- [x] 5.1 `src/components/SearchBar.tsx` — 검색 입력창 + 검색 버튼
- [x] 5.2 `src/components/GameCard.tsx` — 게임 기본 정보 카드 (이름, 장르, 출시일, 평점)
- [x] 5.3 `src/components/SentimentChart.tsx` — Recharts 도넛 차트 (7개 카테고리별 긍정/부정 비율)
- [x] 5.4 `src/components/FeedbackCard.tsx` — 개선 우선순위 카드 (순위, 카테고리, 문제, 대표 발언)
- [x] 5.5 `src/components/ReviewSample.tsx` — 대표 유저 발언 인용 컴포넌트

## 6. 페이지 구현

- [x] 6.1 `src/app/page.tsx` — 홈 검색 화면 (SearchBar + GameCard 목록)
- [x] 6.2 분석 시작 버튼 클릭 시 로딩 상태 및 단계 메시지 표시
- [x] 6.3 분석 완료 후 결과를 sessionStorage에 저장하고 `/dashboard?appId=` 로 라우팅
- [x] 6.4 `src/app/dashboard/page.tsx` — 분석 결과 대시보드 (SentimentChart + FeedbackCard 배열)
- [x] 6.5 sessionStorage에 데이터 없을 때 홈으로 리다이렉트 처리

## 7. 검증 및 배포

- [ ] 7.1 실제 게임(예: "Elden Ring")으로 전체 플로우 동작 확인
- [ ] 7.2 리뷰 0개 / 100개 미만 엣지케이스 동작 확인
- [ ] 7.3 GitHub에 코드 푸시
- [ ] 7.4 Vercel에 프로젝트 연결 및 환경변수 설정 후 배포

