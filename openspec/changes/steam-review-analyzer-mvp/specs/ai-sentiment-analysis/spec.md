## ADDED Requirements

### Requirement: 7개 카테고리 감성 분류
시스템은 수집된 리뷰를 Claude API를 통해 게임플레이, 그래픽, 사운드, 스토리, 최적화, 가격, 멀티플레이 7개 카테고리로 분류하고, 각 카테고리의 긍정/부정 비율을 반환해야 한다(SHALL).

#### Scenario: 정상 분류 요청
- **WHEN** 유효한 리뷰 목록으로 분석 요청이 들어오면
- **THEN** 시스템은 7개 카테고리 각각에 대해 { positive: number, negative: number, total: number } 형태의 데이터를 반환한다

#### Scenario: 특정 카테고리 언급 없음
- **WHEN** 리뷰에 특정 카테고리(예: 멀티플레이)에 대한 언급이 없는 경우
- **THEN** 해당 카테고리는 total: 0으로 반환된다

#### Scenario: API 응답 JSON 파싱 실패
- **WHEN** Claude API가 유효하지 않은 JSON을 반환하면
- **THEN** 시스템은 500 에러를 반환하고 재시도를 권장하는 메시지를 표시한다

### Requirement: 개선 피드백 생성
시스템은 분류 결과를 기반으로 핵심 문제 요약, 개선 우선순위 리스트(최대 5개), 대표 유저 발언 인용(최대 3개)을 생성해야 한다(SHALL).

#### Scenario: 개선 피드백 정상 생성
- **WHEN** 분류된 리뷰 데이터로 피드백 생성을 요청하면
- **THEN** 시스템은 { summary: string, priorities: string[], quotes: string[] } 형태의 피드백을 반환한다

#### Scenario: 부정 리뷰가 없는 경우
- **WHEN** 모든 리뷰가 긍정인 경우
- **THEN** 시스템은 "개선 필요 사항 없음" 메시지와 함께 긍정적인 요약을 반환한다

### Requirement: 프롬프트 캐싱
시스템은 Claude API 호출 시 시스템 프롬프트에 cache_control을 적용하여 반복 요청 시 비용을 절감해야 한다(SHALL).

#### Scenario: 동일 게임 반복 분석
- **WHEN** 같은 게임을 다시 분석 요청하면
- **THEN** 시스템 프롬프트 토큰은 캐시에서 재사용되어 API 비용이 절감된다
