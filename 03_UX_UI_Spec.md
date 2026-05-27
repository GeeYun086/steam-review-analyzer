# UX / UI Spec

## 1. Design Reference

Follow:

- docs/DESIGN.md

## 2. Screen Map

| Screen | Route | Purpose |
|---|---|---|
| Landing Page | `/` | 서비스 소개와 게임 검색 진입 |
| App Page | `/dashboard` | 분석 결과 확인 |

## 3. Landing Page

### Purpose

서비스의 문제, 가치, 핵심 기능을 설명하고 사용자가 게임 검색을 바로 시작하도록 유도한다.

### Required Sections

- Hero
- Problem
- Core Features
- CTA Button

### Key Copy

- **Headline:** Steam 리뷰, AI가 대신 읽어드립니다
- **Subheadline:** 게임 이름 하나로 유저 피드백을 자동 분석하고 개선 우선순위를 제시합니다
- **CTA:** 지금 바로 분석하기

## 4. App Page

### Purpose

선택한 게임의 리뷰 수집·AI 분석 결과를 시각화하고, 개선 피드백을 제공하는 화면이다.

### Required Areas

- **Header:** 선택된 게임의 커버 이미지, 이름, 장르, 출시일, 현재 평점
- **Loading Steps:** 수집 → 분석 단계별 진행 메시지 (분석 완료 전 표시)
- **Chart Area:** 카테고리별 긍정·부정 비율 도넛 차트
- **Feedback List:** 개선 우선순위 1~3위 카드 목록
- **Quote Area:** 카테고리별 대표 유저 발언 인용
- **Empty State:** 분석 결과가 없거나 오류 발생 시 안내 + 재시도 버튼

## 5. Component Plan

| Component | Purpose | Requirement Link |
|---|---|---|
| `SearchBar` | 게임 이름 입력 및 검색 결과 드롭다운 표시 | FR-001 |
| `GameCard` | 검색 결과 게임 항목 (이미지·이름·평점) | FR-001, FR-002 |
| `GameHeader` | 선택된 게임 기본 정보 표시 | FR-002 |
| `LoadingSteps` | 수집·분석 단계별 진행 상황 메시지 | FR-008 |
| `SentimentChart` | 카테고리별 긍정·부정 비율 도넛 차트 | FR-006 |
| `FeedbackCard` | 개선 우선순위 카드 (순위·카테고리·문제·제안) | FR-005 |
| `ReviewSample` | 카테고리별 대표 유저 발언 인용 | FR-007 |
| `ErrorState` | API 오류 시 메시지 + 재시도 버튼 | FR-003, FR-004 |

## 6. Interaction Rules

- 게임을 선택하는 즉시 리뷰 수집이 자동으로 시작된다.
- 수집·분석 중에는 단계별 메시지가 순차적으로 표시된다.
- 분석 완료 전까지 차트·카드 영역은 스켈레톤 상태로 표시된다.
- API 오류 발생 시 오류 메시지와 재시도 버튼을 표시한다.
- 검색창에 입력값이 없으면 드롭다운을 표시하지 않는다.
- "새 게임 분석하기" 버튼을 누르면 홈으로 이동하고 상태가 초기화된다.

## 7. Accessibility Rules

- 모든 입력 필드에는 `label`이 있어야 한다.
- 버튼 텍스트는 기능을 명확하게 설명해야 한다.
- 색상만으로 긍정·부정을 구분하지 않고 텍스트 레이블을 함께 표시한다.
- 주요 영역은 heading 구조를 가진다 (h1 → h2 → h3).
