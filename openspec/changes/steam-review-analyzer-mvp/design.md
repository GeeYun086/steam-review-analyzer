## Context

Steam 게임 리뷰 감성분석 도구의 MVP를 Next.js App Router 기반으로 처음부터 구현한다. 현재 프로젝트에는 문서(CLAUDE.md, docs/)만 존재하며 실제 코드가 없는 상태다. Steam Web API(무료)와 Anthropic Claude API를 연동하여 검색 → 리뷰 수집 → AI 분석 → 대시보드 표시의 단방향 파이프라인을 구성한다.

## Goals / Non-Goals

**Goals:**
- Next.js App Router + TypeScript + Tailwind CSS 프로젝트 초기 세팅
- Steam 게임 검색 및 리뷰 수집 API 엔드포인트 구현
- Claude API를 이용한 7개 카테고리 감성 분류 및 개선 피드백 생성
- 분석 결과 대시보드(도넛 차트 + 우선순위 카드) 렌더링

**Non-Goals:**
- 사용자 인증/로그인
- 분석 결과 영구 저장 (DB 없음, 세션 내 메모리 사용)
- 여러 게임 동시 비교, 시계열 트렌드, PDF 내보내기
- 한국어/영어 언어 필터

## Decisions

### D1: Next.js API Routes를 BFF로 사용

Steam API와 Anthropic API 호출을 클라이언트에서 직접 호출하지 않고 Next.js API Routes를 통해 프록시한다.

**Why**: Steam API는 CORS 제한이 있고, Anthropic API 키를 클라이언트에 노출하면 보안 위험이 있다. API Routes를 BFF(Backend-for-Frontend)로 두면 두 문제를 동시에 해결한다.

**Alternatives considered**: 별도 Express 서버 — 불필요한 복잡도 추가.

---

### D2: 분석 결과를 URL 쿼리 파라미터 + sessionStorage로 전달

홈(검색) → 대시보드 페이지 전환 시 분석 결과를 sessionStorage에 저장하고, URL에는 appId만 전달한다.

**Why**: DB 없이 간단하게 상태를 유지할 수 있다. URL에 전체 분석 JSON을 담으면 URL 길이 제한에 걸린다.

**Alternatives considered**: Zustand/Redux 같은 전역 상태 — 의존성 추가 대비 MVP에는 과도함.

---

### D3: Claude API 단일 요청으로 분류 + 피드백 동시 생성

리뷰 목록을 한 번의 Claude API 호출로 분류(카테고리별 감성 집계)와 개선 피드백(핵심 문제 요약 + 우선순위 + 대표 발언)을 JSON 형식으로 함께 받는다.

**Why**: API 호출 횟수를 최소화하여 비용과 레이턴시를 줄인다. Claude의 JSON mode(structured output)를 활용하면 파싱도 안정적이다.

**Alternatives considered**: 분류와 피드백을 별도 호출로 분리 — 레이턴시 2배, 비용 증가.

---

### D4: Prompt Caching 적용

시스템 프롬프트(카테고리 정의, 출력 스키마)에 cache_control을 설정한다.

**Why**: 동일 게임을 반복 조회할 때 시스템 프롬프트 토큰을 캐시하여 비용을 절감한다.

## Risks / Trade-offs

- **Steam API 속도 제한** → 100개 리뷰를 한 번에 요청하되, 실패 시 더 적은 수로 재시도하는 fallback 추가
- **Claude API 응답 지연 (수십 초)** → 프론트엔드에 로딩 스피너와 진행 상태 메시지 표시
- **리뷰 100개 미만 게임** → 실제 수집된 수로 분석 진행, 최솟값 제한 없음
- **sessionStorage 용량 한계** → 리뷰 원문 전체 저장 대신 분석 결과 JSON만 저장 (수 KB 수준)

## Migration Plan

1. `npx create-next-app@latest` 으로 프로젝트 초기화
2. 환경변수 `.env.local` 설정 (`ANTHROPIC_API_KEY`)
3. 서비스 레이어 → API Routes → UI 컴포넌트 순으로 구현
4. Vercel에 GitHub 연동 자동 배포

## Open Questions

- Steam 스토어 검색 API(`/api/storesearch/`)의 결과 정확도 — 게임명이 영어가 아닌 경우 테스트 필요
- Recharts 도넛 차트의 모바일 반응형 동작 — 실제 렌더링 후 확인
