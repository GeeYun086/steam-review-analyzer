## 1. Playwright 설치 및 설정

- [x] 1.1 `@playwright/test` 패키지 설치 (devDependency)
- [x] 1.2 `playwright install chromium` 으로 브라우저 바이너리 설치
- [x] 1.3 `playwright.config.ts` 작성 — baseURL `http://localhost:3000`, webServer `next dev`, timeout 설정
- [x] 1.4 `package.json`에 `"test:e2e": "playwright test"` 스크립트 추가

## 2. Happy Path 테스트 작성

- [x] 2.1 `tests/e2e/search.spec.ts` 생성 — "Elden Ring" 검색 후 게임 카드 1개 이상 표시 확인
- [x] 2.2 `tests/e2e/search.spec.ts` — 게임 카드 클릭 시 선택 상태 및 "리뷰 분석 시작" 버튼 등장 확인
- [x] 2.3 `tests/e2e/dashboard.spec.ts` 생성 — 분석 버튼 클릭 → `/dashboard` 라우팅 확인
- [x] 2.4 `tests/e2e/dashboard.spec.ts` — 대시보드 AI 요약 텍스트, 차트 영역, 우선순위 카드 렌더링 확인
- [x] 2.5 `tests/e2e/dashboard.spec.ts` — "다른 게임 검색" 버튼 클릭 시 홈으로 이동 확인

## 3. Edge Case 테스트 작성

- [x] 3.1 `tests/e2e/edge-cases.spec.ts` 생성 — 빈 검색창에서 API 호출 없음 확인 (버튼 비활성 또는 동작 없음)
- [x] 3.2 `tests/e2e/edge-cases.spec.ts` — 존재하지 않는 게임명 검색 시 "검색 결과가 없습니다." 메시지 표시 확인
- [x] 3.3 `tests/e2e/edge-cases.spec.ts` — `/dashboard?appId=123` 직접 접근 시 홈으로 리다이렉트 확인

## 4. 테스트 실행 및 검증

- [x] 4.1 `npm run test:e2e` 실행하여 모든 테스트 통과 확인
- [x] 4.2 실패한 테스트가 있으면 원인 파악 및 수정
