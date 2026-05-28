## Context

Steam 리뷰 분석 앱(Next.js App Router)은 mock 모드로 구현 완료된 상태다. 실제 Steam API 및 Claude API 호출 없이 `ANTHROPIC_API_KEY` 미설정 시 자동으로 mock 응답을 반환한다. Playwright는 실제 브라우저를 제어하므로 Next.js dev 서버를 띄운 상태에서 테스트를 실행한다.

## Goals / Non-Goals

**Goals:**
- Playwright 설치 및 기본 설정 (`playwright.config.ts`)
- 핵심 사용자 플로우 E2E 검증 (검색 → 선택 → 분석 → 대시보드)
- 엣지 케이스 자동 검증 (빈 쿼리, 검색 결과 없음)
- `npm run test:e2e`로 단일 명령 실행 가능

**Non-Goals:**
- 실제 Steam API / Claude API 호출 테스트 (mock 모드 전용)
- 시각적 회귀 테스트 (스크린샷 비교)
- CI/CD 파이프라인 연동

## Decisions

### D1: Playwright webServer 설정으로 dev 서버 자동 관리

`playwright.config.ts`의 `webServer` 옵션을 사용해 테스트 실행 전 `next dev`를 자동 시작하고 종료한다.

**Why**: 별도 터미널에서 서버를 수동으로 켜야 하는 번거로움 제거. CI 환경에서도 동일하게 동작.

**Alternatives considered**: 외부에서 서버를 켜놓고 테스트만 실행 — 개발 편의성 저하.

---

### D2: mock 모드 전제로 테스트 작성

`ANTHROPIC_API_KEY` 환경변수 없이 동작하는 mock 응답을 기준으로 assertion을 작성한다.

**Why**: 실제 API 호출은 비용 발생 및 외부 네트워크 의존성이 생긴다. mock 모드로도 UI 흐름, 컴포넌트 렌더링, 라우팅 전환을 충분히 검증할 수 있다.

**Alternatives considered**: MSW(Mock Service Worker)로 Steam API mock — 추가 의존성 및 설정 복잡도 증가.

---

### D3: 테스트 파일 3개로 분리

| 파일 | 커버 범위 |
|---|---|
| `search.spec.ts` | 검색 UI, 게임 목록 표시, 게임 선택 |
| `dashboard.spec.ts` | 분석 실행 → 대시보드 라우팅, 차트·카드 렌더링 |
| `edge-cases.spec.ts` | 빈 쿼리 검증, 검색 결과 없음 메시지 |

**Why**: 기능 단위로 분리하면 실패 시 원인 파악이 빠르고, 병렬 실행 시 독립적으로 동작한다.

## Risks / Trade-offs

- **Steam API CORS** → API Routes(/api/search)를 통해 호출하므로 브라우저 직접 호출 없음. 문제없음.
- **Mock 게임 검색 결과** → 실제 Steam API를 호출하므로 네트워크 환경에 따라 결과가 달라질 수 있음 → `page.route()`로 Steam API 응답 mock 처리 고려.
- **분석 시간 지연** → mock 모드는 즉시 응답하므로 timeout 5초면 충분.
