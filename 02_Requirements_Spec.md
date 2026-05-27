# Requirements Spec

## 1. Actors

| Actor | Description |
|---|---|
| Primary User | 게임회사 사업팀·마케팅팀 담당자 또는 인디 게임 개발자. 로그인 없이 바로 사용한다. |
| Optional Admin | 이번 MVP에서는 제외. 단일 사용자 기준으로 동작한다. |

## 2. Main Use Cases

### UC-001. 게임 검색 및 선택

- **Actor:** Primary User
- **Goal:** 분석할 게임을 Steam에서 찾아 선택한다.
- **Precondition:** 앱이 실행 중이다.
- **Main Flow:**
  1. 사용자가 홈 화면의 검색창에 게임 이름을 입력한다.
  2. Steam API로 일치하는 게임 목록이 카드 형태로 표시된다.
  3. 사용자가 원하는 게임을 선택한다.
- **Alternative Flow:** 검색 결과가 없으면 "검색 결과가 없습니다" 안내 문구를 표시한다.
- **Result:** 선택한 게임의 기본 정보(이름, 커버 이미지, 장르, 출시일, 현재 평점)가 표시된다.

### UC-002. 리뷰 자동 수집

- **Actor:** Primary User
- **Goal:** 선택한 게임의 Steam 유저 리뷰를 자동으로 가져온다.
- **Precondition:** 게임이 선택되어 있다.
- **Main Flow:**
  1. 게임 선택 직후 자동으로 리뷰 수집이 시작된다.
  2. Steam Web API에서 최신 리뷰를 최대 100개(긍정 50 / 부정 50) 가져온다.
  3. 수집 진행 상황을 로딩 메시지로 표시한다.
- **Alternative Flow:** API 호출 실패 시 오류 메시지를 표시하고 재시도 버튼을 제공한다.
- **Result:** 수집된 리뷰 데이터가 분석 단계로 전달된다.

### UC-003. AI 감성 분석 실행

- **Actor:** Primary User
- **Goal:** 수집된 리뷰를 AI가 카테고리별로 분류하고 감성 비율을 계산한다.
- **Precondition:** 리뷰 수집이 완료되어 있다.
- **Main Flow:**
  1. 수집 완료 후 자동으로 Claude API에 분석 요청을 전송한다.
  2. AI가 리뷰를 7개 카테고리(게임플레이, 그래픽, 사운드, 스토리, 최적화, 가격, 멀티플레이)로 분류한다.
  3. 카테고리별 긍정·부정 비율을 계산하여 반환한다.
- **Alternative Flow:** AI 응답 오류 시 오류 메시지를 표시하고 재시도 버튼을 제공한다.
- **Result:** 카테고리별 감성 분석 결과가 대시보드에 표시된다.

### UC-004. 개선 피드백 확인

- **Actor:** Primary User
- **Goal:** AI가 생성한 개선 우선순위와 구체적인 제안을 확인한다.
- **Precondition:** AI 감성 분석이 완료되어 있다.
- **Main Flow:**
  1. 대시보드에서 개선 우선순위 카드(1~3위)를 확인한다.
  2. 각 카드에서 문제 카테고리, 핵심 문제 요약, 개선 제안을 읽는다.
  3. 카테고리별 대표 유저 발언 인용을 확인한다.
- **Alternative Flow:** 없음.
- **Result:** 사용자가 어떤 부분을 먼저 개선해야 할지 우선순위를 파악할 수 있다.

## 3. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-001 | 사용자는 게임 이름으로 Steam 게임을 검색할 수 있다. | Must |
| FR-002 | 사용자는 검색 결과에서 게임을 선택하면 기본 정보(장르, 출시일, 평점)를 확인할 수 있다. | Must |
| FR-003 | 시스템은 Steam Web API로 최신 리뷰를 최대 100개(긍정 50 / 부정 50) 자동 수집한다. | Must |
| FR-004 | 시스템은 수집된 리뷰를 7개 카테고리로 자동 분류하고 긍정·부정 비율을 계산한다. | Must |
| FR-005 | 시스템은 부정 비율이 높은 카테고리 순으로 개선 우선순위(1~3위)와 개선 제안을 생성한다. | Must |
| FR-006 | 사용자는 카테고리별 감성 분포를 도넛 차트로 확인할 수 있다. | Must |
| FR-007 | 사용자는 각 카테고리의 대표 유저 발언 인용을 확인할 수 있다. | Should |
| FR-008 | 시스템은 리뷰 수집 및 AI 분석 단계별 진행 상황을 로딩 메시지로 표시한다. | Should |

## 4. Non-functional Requirements

| ID | Requirement |
|---|---|
| NFR-001 | 데스크탑 화면을 우선으로 구현하며, 기본적인 모바일 대응(768px 이상)을 지원한다. |
| NFR-002 | 버튼과 입력 필드는 접근 가능한 label을 가져야 한다. |
| NFR-003 | ANTHROPIC_API_KEY 등 민감한 정보는 환경 변수로 관리하며 GitHub 저장소에 커밋하지 않는다. |
| NFR-004 | 로그인 없이 단일 사용자 기준으로 동작한다. |
| NFR-005 | AI 분석 요청은 30초 이내에 응답해야 하며, 단계별 로딩 상태를 시각적으로 표시한다. |

## 5. Acceptance Criteria

### AC-001. 게임 검색

Given 사용자가 게임 이름을 입력했을 때  
When 검색을 실행하면  
Then Steam 게임 목록이 카드 형태로 표시된다.

### AC-002. 리뷰 수집

Given 사용자가 게임을 선택했을 때  
When 수집이 완료되면  
Then 긍정·부정 리뷰가 각각 수집되어 분석 단계로 넘어간다.

### AC-003. AI 감성 분석

Given 리뷰 수집이 완료되었을 때  
When AI 분석이 완료되면  
Then 7개 카테고리별 긍정·부정 비율이 도넛 차트로 표시된다.

### AC-004. 개선 피드백

Given AI 감성 분석이 완료되었을 때  
When 대시보드를 확인하면  
Then 개선 우선순위 1~3위 카드와 각 카드의 문제 요약·개선 제안이 표시된다.

### AC-005. 대표 유저 발언

Given AI 감성 분석이 완료되었을 때  
When 대시보드를 확인하면  
Then 카테고리별 대표 유저 발언이 인용 형태로 표시된다.

## 6. Requirement Traceability Lite

| Requirement ID | Use Case | Acceptance Criteria | Test Candidate |
|---|---|---|---|
| FR-001 | UC-001 | AC-001 | E2E search game |
| FR-003 | UC-002 | AC-002 | E2E collect reviews |
| FR-004 | UC-003 | AC-003 | E2E AI sentiment analysis |
| FR-005 | UC-004 | AC-004 | E2E feedback card display |
| FR-007 | UC-004 | AC-005 | E2E user quote display |
