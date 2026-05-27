# Delivery Plan

## 1. 문서 목적

이 문서는 2회차 후반부터 4회차까지의 개발 실행 계획을 정리한다.  
전체 MVP를 한 번에 구현하지 않고, 공통 베이스와 핵심 기능을 단계적으로 구현하기 위한 기준으로 사용한다.

---

## 2. 전체 개발 목표

최종 목표는 4회차 종료 시 배포 가능한 Steam 리뷰 분석 MVP를 완성하는 것이다.

최종 산출물:

- Landing Page (게임 검색 진입)
- Dashboard Page (분석 결과 시각화)
- Steam API + Claude API 연동
- GitHub 저장소
- Playwright E2E 테스트 또는 수동 QA 결과
- Vercel 배포 URL
- README

---

## 3. Session 2 Goal

2회차에서는 전체 프로젝트의 약 20~30%를 완성한다.

### 2회차 완료 기준

- Next.js 프로젝트가 준비되어 있다.
- `/` route가 존재한다.
- `/dashboard` route가 존재한다.
- Landing Page 초안이 있다.
- Dashboard Page shell이 있다.
- API Routes 파일 구조가 존재한다. (`search`, `reviews/[appId]`, `analyze`)
- 핵심 타입이 정의되어 있다.
- 주요 컴포넌트 placeholder가 있다.
- `pnpm dev`로 실행 가능하다.

---

## 4. Session 2 Must Have

| Task | Description | Done When |
|---|---|---|
| Project scaffold | Next.js 프로젝트 초기 세팅 | `pnpm dev` 실행 가능 |
| Landing route | `/` 페이지 생성 | 브라우저에서 `/` 접속 가능 |
| Dashboard route | `/dashboard` 페이지 생성 | 브라우저에서 `/dashboard` 접속 가능 |
| API Routes skeleton | `/api/search`, `/api/reviews/[appId]`, `/api/analyze` 파일 생성 | 파일이 존재하고 빈 응답 반환 |
| Type definition | 핵심 타입 정의 | `src/types/index.ts` 작성 |
| Service skeleton | `steamService.ts`, `aiService.ts` 파일 생성 | 함수 시그니처와 TODO 주석 존재 |
| Component placeholders | 주요 컴포넌트 파일 생성 | SearchBar, GameCard, SentimentChart, FeedbackCard, ReviewSample, ErrorState 구조 존재 |

---

## 5. Session 2 Should Have

| Task | Description | Done When |
|---|---|---|
| Basic layout | 다크 테마 기본 레이아웃 적용 | 배경색·폰트 색이 DESIGN.md 기준과 일치 |
| Landing Hero | 헤드라인·서브헤드라인·검색창 자리 | Hero 섹션이 화면에 보임 |
| Basic styling | Tailwind 기반 최소 스타일 | 화면이 읽을 수 있는 수준 |
| SearchBar UI | 검색창 기본 UI (로직 없어도 됨) | 입력창과 버튼이 화면에 표시됨 |

---

## 6. Session 2 Not Today

2회차에서는 아래 기능을 구현하지 않는다.

- Steam API 실제 호출
- Claude API 실제 호출
- 실제 리뷰 수집 및 분석
- 차트 렌더링 (데이터 없음)
- 로딩 UX 로직
- 오류 처리 로직
- Playwright 테스트 코드 작성
- Vercel 배포
- 로그인 / DB / 결제

---

## 7. Session 3 Goal

3회차에서는 실제 API 연동과 핵심 기능을 구현한다.

### 3회차 목표

- Steam API 연동 (게임 검색, 리뷰 수집)
- Claude API 연동 (감성 분류, 피드백 생성)
- Dashboard UI 완성 (차트, 피드백 카드, 유저 인용)
- 로딩 UX 구현 (단계별 메시지)
- 오류 처리 흐름 구현

---

## 8. Session 3 Must Have

| Task | Related Requirement | Done When |
|---|---|---|
| Game search | FR-001 | 검색창에 게임 이름 입력 시 Steam 결과 목록이 표시됨 |
| Game select | FR-002 | 게임 선택 시 기본 정보(이름, 평점 등)가 표시됨 |
| Review collection | FR-003 | Steam API로 긍정·부정 리뷰 각각 수집됨 |
| AI sentiment analysis | FR-004 | Claude API가 7개 카테고리로 리뷰를 분류함 |
| Feedback generation | FR-005 | 개선 우선순위 1~3위 카드가 표시됨 |
| Sentiment chart | FR-006 | 카테고리별 감성 도넛 차트가 렌더링됨 |

---

## 9. Session 3 Should Have

| Task | Description |
|---|---|
| Loading steps UI | 수집·분석 단계별 메시지가 순차적으로 표시됨 |
| Review quotes | 카테고리별 대표 유저 발언 인용이 표시됨 |
| Error state | API 오류 시 ErrorState 컴포넌트와 재시도 버튼이 표시됨 |
| Re-search button | "새 게임 분석하기" 버튼으로 홈 복귀 및 상태 초기화 |

---

## 10. Session 4 Goal

4회차에서는 테스트, 리팩토링, 배포를 진행한다.

### 4회차 목표

- Playwright E2E 테스트 작성 (검색 → 수집 → 분석 → 대시보드 핵심 흐름)
- 리팩토링 및 코드 정리
- README 작성
- Vercel 배포
- 최종 발표

---

## 11. Manual QA for Session 2

2회차 종료 전 확인할 항목:

- [ ] `pnpm dev`로 앱이 실행된다.
- [ ] `/` 페이지가 열린다.
- [ ] `/dashboard` 페이지가 열린다.
- [ ] 큰 TypeScript 오류가 없다.
- [ ] Landing Page에 Hero 섹션이 보인다.
- [ ] Dashboard Page shell이 보인다.
- [ ] 주요 컴포넌트 placeholder가 파일로 존재한다.
- [ ] 다크 테마 배경색이 적용되어 있다.
- [ ] 오늘 구현 범위를 넘는 API 호출이 없다.

---

## 12. Verification Commands

```bash
pnpm dev
pnpm build
git status
```

선택적으로 실행:

```bash
pnpm lint
```

---

## 13. Branch Plan

3회차 비교 실험을 위해 브랜치를 나눈다.

```text
main
├── md-driven-dev
└── openspec-driven-dev
```

### MD 기반 개발 브랜치

```bash
git checkout -b md-driven-dev
```

### OpenSpec 기반 개발 브랜치

```bash
git checkout main
git checkout -b openspec-driven-dev
```

---

## 14. Development Prompts

### 공통 베이스 구현 프롬프트

```text
docs/ 폴더의 설계 문서를 모두 참고해서
오늘 구현할 공통 베이스 20~30%만 제안해 주세요.

조건:
- Steam API와 Claude API 실제 호출은 하지 마세요.
- route, shell, type, placeholder, service 시그니처 중심으로 계획하세요.
- 로그인, DB, 결제는 넣지 마세요.
- 아직 파일은 수정하지 말고 수정할 파일과 구현 순서만 제안하세요.
```

### 구현 승인 프롬프트

```text
좋습니다. 제안한 계획대로 구현해 주세요.

조건:
- docs/ 설계 문서의 범위를 벗어나지 마세요.
- 실제 API 호출은 오늘 하지 않습니다.
- 오늘은 route, 화면 shell, 타입, placeholder, service 시그니처까지만 구현하세요.
- 구현 후 변경 파일과 실행 방법을 요약해 주세요.
```

---

## 15. Comparison Criteria for Session 3

3회차에서 두 방식의 결과를 비교할 때 볼 기준:

| Criteria                | Question                         |
| ----------------------- | -------------------------------- |
| Requirement Coverage    | 요구사항이 빠짐없이 구현되었는가?              |
| Scope Control           | 불필요한 기능이 추가되지 않았는가?             |
| Implementation Order    | 구현 순서가 자연스러웠는가?                  |
| File Structure          | 파일 위치가 Technical Design과 일치하는가?  |
| Code Quality            | 중복과 복잡도가 적절한가?                   |
| UI Consistency          | UI Spec과 DESIGN.md를 따랐는가?        |
| Verifiability           | Playwright 테스트 또는 QA로 확인하기 쉬운가? |
| Claude Response Quality | 계획, 요약, 검증 설명이 명확했는가?           |

---

## 16. Risks

| Risk                     | Mitigation                           |
| ------------------------ | ------------------------------------ |
| 기능 범위가 커짐               | Must / Should / Not Today로 분리        |
| Steam API 요청 빈도 제한       | 개발 중 mock data 사용, 실 호출은 최소화        |
| Claude API 응답 JSON 파싱 실패 | try-catch + 오류 메시지 처리 필수             |
| 구현 시간이 부족함              | 2회차는 shell과 타입까지만, 3회차에서 API 연동     |
| 문서와 구현이 어긋남             | 구현 전 docs/ 문서 확인 후 계획 제안 먼저         |
| Next.js 설치 이슈            | 공식 `create-next-app` 템플릿 사용          |

---

## 17. Commit Plan

2회차 종료 시 커밋:

```bash
git add .
git commit -m "session-2: add planning docs and project baseline"
git push
```

3회차 Steam + Claude API 연동 커밋:

```bash
git commit -m "session-3: implement steam api and claude analysis"
```

4회차 테스트·배포 커밋:

```bash
git commit -m "session-4: add playwright tests and deploy to vercel"
```

---

## 18. Final Checklist

2회차 종료 전 확인:

* [ ] 설계 문서 5개 작성 완료 (Product Brief, Requirements Spec, UX/UI Spec, Technical Design, Delivery Plan)
* [ ] Next.js 프로젝트 초기 세팅
* [ ] `/` route 확인
* [ ] `/dashboard` route 확인
* [ ] API Routes 파일 구조 생성
* [ ] 핵심 타입 정의 (`src/types/index.ts`)
* [ ] service 파일 skeleton (`steamService.ts`, `aiService.ts`)
* [ ] placeholder 컴포넌트 생성
* [ ] `pnpm dev` 실행 확인
* [ ] Git commit / push 완료
