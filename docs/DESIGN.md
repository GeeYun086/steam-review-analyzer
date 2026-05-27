# DESIGN.md

## Design Goal

게임 업계 담당자와 개발자가 Steam 리뷰 분석 결과를 한눈에 파악하고 즉시 의사결정에 활용할 수 있는 인터페이스. 데이터가 중심이 되고, 시각적 요소는 정보를 돋보이게 하는 역할에 집중한다.

## Design Reference

- **Steam / Epic Games Store** — 다크 배경, 게임 커버 이미지 중심, 고대비 UI
- **Linear** — 정제된 여백, 개발자 친화적 정보 구조
- **Vercel Dashboard** — 데이터 중심 다크 대시보드, 명확한 수치 강조

→ 이 프로젝트는 **다크 대시보드 스타일**로, 게임 감성을 유지하면서 데이터가 명확하게 읽히는 톤을 지향한다.

## Visual Tone

- Dark & Focused — 어두운 배경 위에 데이터가 선명하게 부각된다
- Data-first — 숫자와 차트가 먼저 눈에 들어온다
- Sharp — 불필요한 장식 없이 정보만 남긴다
- Game-industry — 네온 그린 포인트로 게임 업계 감성을 유지한다

## Color

| 역할 | 색상 | 값 |
|---|---|---|
| Background | 딥 네이비 (페이지 배경) | `#0F172A` |
| Surface | 카드·패널 배경 | `#1E293B` |
| Surface High | 중첩 카드·입력 필드 | `#334155` |
| Border | 구분선 | `#334155` |
| Text Primary | 밝은 흰색 | `#F1F5F9` |
| Text Secondary | 중간 회색 | `#94A3B8` |
| Accent | 네온 그린 (포인트) | `#22C55E` |
| Accent Hover | 진한 그린 | `#16A34A` |
| Positive | 긍정 리뷰 색상 | `#22C55E` |
| Negative | 부정 리뷰 색상 | `#EF4444` |
| Warning | 주의 | `#EAB308` |

## Typography

| 용도 | 폰트 | 크기 | 굵기 |
|---|---|---|---|
| 페이지 제목 | Inter | 28px | 700 |
| 섹션 제목 | Inter | 18px | 600 |
| 본문 | Inter | 14px | 400 |
| 보조 텍스트 | Inter | 12px | 400 |
| 수치 강조 | Inter | 32px | 700 |
| 버튼 | Inter | 14px | 500 |

- 한글은 **Pretendard** 사용 (Inter와 자연스럽게 혼용)

## Spacing

- 기본 단위: `4px`
- 컴포넌트 내부 패딩: `16px ~ 20px`
- 카드 간격: `16px`
- 섹션 간격: `40px ~ 56px`

## Components

**Card**
- 배경 `#1E293B`, border `1px solid #334155`, radius `10px`
- 그림자 없음 (flat 스타일)

**Button**
- Primary: 배경 `#22C55E`, 어두운 텍스트 `#0F172A`, radius `6px`
- Secondary: 배경 없음, border `1px solid #334155`, 텍스트 `#F1F5F9`
- 호버 시 brightness 변화로 피드백

**Badge / Sentiment**
- 긍정(Positive): 텍스트 `#22C55E`, 배경 `#22C55E1A`
- 부정(Negative): 텍스트 `#EF4444`, 배경 `#EF44441A`
- 순위 배지: 배경 `#334155`, 텍스트 `#F1F5F9`

**Input / SearchBar**
- 배경 `#1E293B`, border `1px solid #334155`, radius `8px`
- 포커스 시 border `#22C55E`로 변경

**Chart (Donut)**
- 배경 투명, 긍정 색상 `#22C55E`, 부정 색상 `#EF4444`
- 범례는 차트 우측에 텍스트로 병기

## Main Screens

- Home — 서비스 소개 + 게임 검색창 (Hero 중심)
- Dashboard — 게임 헤더 + 감성 차트 + 피드백 카드 + 유저 인용

## UI Rules

- 버튼 텍스트는 행동을 명확히 ("분석하기", "재시도", "새 게임 분석하기")
- 입력 필드에는 반드시 `label` 표시
- 아이콘만 단독으로 사용하지 않음 (텍스트 병기)
- 긍정·부정 구분 시 색상과 텍스트 레이블을 함께 사용
- 시맨틱 헤딩 구조 유지 (h1 → h2 → h3)
- 디자인 임의 변경 금지 — 변경 시 이 문서 먼저 업데이트
