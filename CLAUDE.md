# CLAUDE.md

## Project
Steam 게임 리뷰 감성분석 & 개선 피드백 도구. Vibe Coding 수업 MVP 프로젝트.

## Product Idea
Steam 게임 이름을 검색하면 AI가 유저 리뷰 수집 → 분류 → 피드백 생성까지 전 과정을 자동화하는 웹 대시보드. 기존에 사람이 수백 개 리뷰를 직접 읽고 정리하던 작업을 버튼 한 번으로 대체하며, "어떤 부분을 개선하면 평점이 올라갈지" 액션 가능한 인사이트를 즉시 제공한다.

**Target User**:
- 게임회사 사업팀 / 마케팅팀 (자사 게임 유저 반응 모니터링)
- 인디 게임 개발자 (경쟁 게임 분석, 자기 게임 피드백)

**Core Problem**: 게임 개발자와 사업팀은 Steam 유저 리뷰를 수동으로 읽고 직접 분류·정리해야 하며, 수백 개 리뷰 중 어떤 문제가 평점에 가장 큰 영향을 주는지 파악하는 데 많은 시간이 소요된다.

**Core Value**:
- 게임 검색: Steam에서 게임 검색 후 기본 정보(장르, 출시일, 평점) 표시
- 리뷰 수집: Steam Web API로 최신 리뷰 최대 100개 자동 수집 (긍정 50 / 부정 50)
- AI 감성 분석: 리뷰를 7개 카테고리(게임플레이, 그래픽, 사운드, 스토리, 최적화, 가격, 멀티플레이)로 자동 분류
- 개선 피드백 생성: 핵심 문제 요약 + 개선 우선순위 리스트 + 대표 유저 발언 인용
- 대시보드 시각화: 카테고리별 감성 도넛 차트 + 개선 우선순위 카드

## Tech Stack

| 영역 | 사용 기술 |
|---|---|
| 웹 프레임워크 | Next.js (App Router) |
| UI 라이브러리 | React |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| 차트 | Recharts |
| AI API | Anthropic Claude API |
| 외부 데이터 | Steam Web API (무료, 키 불필요) |
| AI 개발 도구 | Claude Code |
| 버전 관리 | GitHub |
| 테스트 | Playwright |
| 배포 | Vercel |

## Folder Structure

```
project/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # 홈 (검색 화면)
│   │   ├── dashboard/
│   │   │   └── page.tsx              # 분석 결과 대시보드
│   │   └── api/
│   │       ├── search/route.ts       # GET /api/search?q=게임명
│   │       ├── reviews/
│   │       │   └── [appId]/route.ts  # GET /api/reviews/:appId
│   │       └── analyze/route.ts      # POST /api/analyze
│   ├── components/
│   │   ├── SearchBar.tsx
│   │   ├── GameCard.tsx
│   │   ├── SentimentChart.tsx
│   │   ├── FeedbackCard.tsx
│   │   └── ReviewSample.tsx
│   └── services/
│       ├── steamService.ts
│       └── aiService.ts
├── tests/                            # Playwright 테스트
├── .env.local
└── package.json
```

## Environment Variables

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-...
```

## Current Stage
Session 2: 주제 전환 및 문서 재정비.

## Working Rules
- 파일 수정 전 반드시 관련 파일을 먼저 읽는다.
- 변경 전 계획을 설명한다.
- 변경 범위를 작게 유지한다.
- 불필요한 의존성을 추가하지 않는다.
- 프로젝트 방향이 바뀌면 문서를 먼저 업데이트한다.
- 커밋 전 변경 파일을 요약한다.

## Boundaries
Do not add:
- 로그인 / 인증
- 결제
- 여러 게임 동시 비교 분석
- 시계열 트렌드 분석
- 한국어/영어 언어 필터
- 분석 결과 PDF 내보내기
- 분석 히스토리 저장

## References
- Follow docs/DESIGN.md for UI direction.
- Follow docs/ARCHITECTURE.md for project structure.
