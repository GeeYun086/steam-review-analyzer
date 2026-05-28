## Why

구현이 완료된 Steam 리뷰 분석 앱에 자동화된 E2E 검증이 없어, Vercel 배포 전 핵심 사용자 플로우의 정상 동작을 보장할 수 없다. Playwright로 핵심 시나리오를 커버하면 회귀 오류를 조기에 발견할 수 있다.

## What Changes

- Playwright 패키지 및 설정 파일(`playwright.config.ts`) 신규 추가
- `tests/` 폴더에 E2E 테스트 파일 작성 (mock 모드 기반)
- `package.json`에 `test:e2e` 스크립트 추가

## Capabilities

### New Capabilities

- `e2e-happy-path`: 게임 검색 → 게임 선택 → 분석 시작 → 대시보드 표시까지 전체 흐름 검증
- `e2e-edge-cases`: 검색 결과 없음, 빈 쿼리 400 처리 등 엣지 케이스 검증

### Modified Capabilities

<!-- 없음 -->

## Impact

- **신규 파일**: `playwright.config.ts`, `tests/e2e/search.spec.ts`, `tests/e2e/dashboard.spec.ts`, `tests/e2e/edge-cases.spec.ts`
- **수정 파일**: `package.json` (test:e2e 스크립트 추가)
- **신규 의존성**: `@playwright/test` (devDependency)
- **실행 환경**: Next.js dev 서버(`localhost:3000`) 기반, mock 모드(API 키 불필요)
