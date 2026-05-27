# DESIGN.md

## Design Goal
개발자와 대학생이 프로젝트를 관리할 때 인지 부담 없이 빠르게 파악하고 행동할 수 있는 인터페이스.
복잡하지 않고, 정보가 명확하게 읽히며, 쓸수록 신뢰가 쌓이는 느낌을 목표로 한다.

## Design Reference
- **Linear** — 극도로 정제된 여백, 보라 계열 액센트, 개발자 친화적 UX
- **Notion** — 따뜻한 미니멀리즘, 콘텐츠 중심 레이아웃
- **Mintlify** — 깔끔한 문서형 구조, 초록 계열 포인트

→ 이 프로젝트는 **Linear 스타일 기반**으로, 차갑지 않고 집중력을 유지하는 톤을 지향한다.

## Visual Tone
- Minimal — 불필요한 요소 없이, 정보만 남긴다
- Focused — 지금 해야 할 일이 한눈에 보인다
- Trustworthy — 일관된 스타일로 신뢰감을 준다
- Developer-friendly — 아이콘보다 텍스트, 장식보다 구조

## Color

| 역할 | 색상 | 값 |
|------|------|----|
| Background | 흰색 (라이트 모드 기준) | `#FFFFFF` |
| Surface | 연한 회색 카드 | `#F7F7F8` |
| Border | 얇은 구분선 | `#E4E4E7` |
| Text Primary | 거의 검정 | `#18181B` |
| Text Secondary | 중간 회색 | `#71717A` |
| Accent | 인디고 (포인트 색) | `#6366F1` |
| Accent Hover | 진한 인디고 | `#4F46E5` |
| Success | 초록 | `#22C55E` |
| Warning | 노랑 | `#EAB308` |
| Danger | 빨강 | `#EF4444` |

## Typography

| 용도 | 폰트 | 크기 | 굵기 |
|------|------|------|------|
| 페이지 제목 | Inter | 24px | 700 |
| 섹션 제목 | Inter | 18px | 600 |
| 본문 | Inter | 14px | 400 |
| 보조 텍스트 | Inter | 12px | 400 |
| 버튼 | Inter | 14px | 500 |

- 한글은 **Pretendard** 사용 (Inter와 자연스럽게 혼용)

## Spacing
- 기본 단위: `4px`
- 컴포넌트 내부 패딩: `12px ~ 16px`
- 카드 간격: `16px`
- 섹션 간격: `32px ~ 48px`

## Components

**Card**
- 배경 `#F7F7F8`, border `1px solid #E4E4E7`, radius `8px`
- 그림자 없음 (flat 스타일)

**Button**
- Primary: 배경 `#6366F1`, 흰색 텍스트, radius `6px`
- Secondary: 배경 없음, border `1px solid #E4E4E7`
- 호버 시 opacity 변화로 피드백

**Badge / Status**
- 진행 중: 인디고 배경 연하게
- 완료: 초록 배경 연하게
- 지연: 빨강 배경 연하게

## Main Screens
- Landing Page — 서비스 소개, CTA 버튼
- Dashboard — 내 프로젝트 목록 카드뷰
- Project Detail — 현황, 회의 로그, 일정
- Meeting Log — 회의록 입력 + AI 요약 결과
- Project Intro Page — 외부 공유용 퍼블릭 페이지

## UI Rules
- 버튼 텍스트는 행동을 명확히 ("저장", "요약하기", "새 프로젝트")
- 입력 필드에는 반드시 label 표시
- 아이콘만 단독으로 사용하지 않음 (텍스트 병기)
- 시맨틱 헤딩 구조 유지 (h1 → h2 → h3)
- 디자인 임의 변경 금지 — 변경 시 이 문서 먼저 업데이트
