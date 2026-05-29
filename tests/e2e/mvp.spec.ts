import { test, expect } from "@playwright/test";

// ─── 공통 Mock 데이터 ───────────────────────────────────────────────────────

const MOCK_GAME = { appid: 1245620, name: "Elden Ring", icon: "", logo: "" };

const MOCK_REVIEWS = {
  reviews: [
    { text: "Amazing gameplay and visuals!", recommended: true, timestamp: 1700000000 },
    { text: "Performance issues ruin the experience", recommended: false, timestamp: 1700000001 },
  ],
  count: 2,
  totalReviews: 2,
};

const MOCK_ANALYSIS = {
  categories: {
    gameplay:    { positive: 8, negative: 2, total: 10 },
    graphics:    { positive: 7, negative: 3, total: 10 },
    sound:       { positive: 6, negative: 2, total: 8  },
    story:       { positive: 9, negative: 1, total: 10 },
    performance: { positive: 3, negative: 7, total: 10 },
    price:       { positive: 5, negative: 5, total: 10 },
    multiplayer: { positive: 4, negative: 2, total: 6  },
  },
  summary: "전반적으로 게임플레이와 그래픽 평가가 높지만 최적화 문제가 주요 불만입니다.",
  priorities: ["최적화 개선 필요", "멀티플레이 안정성 향상"],
  quotes: ["\"게임 자체는 훌륭하지만 성능이 아쉽다.\""],
};

// ─── D-04: 로딩 단계 메시지 표시 ────────────────────────────────────────────

test.describe("D-04: 분석 로딩 단계 메시지", () => {
  test("분석 중 '리뷰 수집 중...' 텍스트가 표시된다", async ({ page }) => {
    // /api/reviews 를 200ms 지연시켜 로딩 상태를 유지
    await page.route("/api/search*", async (route) => {
      await route.fulfill({ status: 200, json: { games: [MOCK_GAME] } });
    });
    await page.route(/\/api\/reviews\/\d+/, async (route) => {
      await new Promise((r) => setTimeout(r, 1500)); // 로딩 상태 관찰 여유
      await route.fulfill({ status: 200, json: MOCK_REVIEWS });
    });
    await page.route("/api/analyze", async (route) => {
      await route.fulfill({ status: 200, json: MOCK_ANALYSIS });
    });

    await page.goto("/");

    // 검색 → 선택 → 분석 시작
    await page.getByPlaceholder("게임 이름 검색 (예: Elden Ring)").fill("Elden Ring");
    await page.getByRole("button", { name: "검색" }).click();
    await page.getByRole("button", { name: /Elden Ring/ }).first().click();
    await page.getByRole("button", { name: /리뷰 분석 시작/ }).click();

    // 로딩 스피너 + "리뷰 수집 중..." 텍스트 확인
    await expect(page.getByText("리뷰 수집 중...")).toBeVisible({ timeout: 3000 });
  });

  test("리뷰 수집 완료 후 'AI 분석 중...' 텍스트로 전환된다", async ({ page }) => {
    await page.route("/api/search*", async (route) => {
      await route.fulfill({ status: 200, json: { games: [MOCK_GAME] } });
    });
    await page.route(/\/api\/reviews\/\d+/, async (route) => {
      // reviews는 즉시 응답
      await route.fulfill({ status: 200, json: MOCK_REVIEWS });
    });
    await page.route("/api/analyze", async (route) => {
      await new Promise((r) => setTimeout(r, 1500)); // AI 분석 지연
      await route.fulfill({ status: 200, json: MOCK_ANALYSIS });
    });

    await page.goto("/");

    await page.getByPlaceholder("게임 이름 검색 (예: Elden Ring)").fill("Elden Ring");
    await page.getByRole("button", { name: "검색" }).click();
    await page.getByRole("button", { name: /Elden Ring/ }).first().click();
    await page.getByRole("button", { name: /리뷰 분석 시작/ }).click();

    // "AI 분석 중..." 텍스트 확인
    await expect(page.getByText("AI 분석 중...")).toBeVisible({ timeout: 5000 });
  });
});

// ─── E-04: 분석 API 오류 처리 ───────────────────────────────────────────────

test.describe("E-04: 분석 API 오류 처리", () => {
  test("/api/analyze 500 에러 시 에러 메시지가 표시되고 대시보드로 이동하지 않는다", async ({ page }) => {
    await page.route("/api/search*", async (route) => {
      await route.fulfill({ status: 200, json: { games: [MOCK_GAME] } });
    });
    await page.route(/\/api\/reviews\/\d+/, async (route) => {
      await route.fulfill({ status: 200, json: MOCK_REVIEWS });
    });
    await page.route("/api/analyze", async (route) => {
      await route.fulfill({ status: 500, json: { error: "분석 실패" } });
    });

    await page.goto("/");

    await page.getByPlaceholder("게임 이름 검색 (예: Elden Ring)").fill("Elden Ring");
    await page.getByRole("button", { name: "검색" }).click();
    await page.getByRole("button", { name: /Elden Ring/ }).first().click();
    await page.getByRole("button", { name: /리뷰 분석 시작/ }).click();

    // 에러 메시지 표시 확인
    await expect(page.getByText("분석 실패")).toBeVisible({ timeout: 5000 });

    // 대시보드로 이동하지 않았는지 확인
    expect(page.url()).not.toContain("/dashboard");
  });

  test("/api/reviews 500 에러 시에도 에러 메시지가 표시된다", async ({ page }) => {
    await page.route("/api/search*", async (route) => {
      await route.fulfill({ status: 200, json: { games: [MOCK_GAME] } });
    });
    await page.route(/\/api\/reviews\/\d+/, async (route) => {
      await route.fulfill({ status: 500, json: { error: "리뷰 수집 실패" } });
    });

    await page.goto("/");

    await page.getByPlaceholder("게임 이름 검색 (예: Elden Ring)").fill("Elden Ring");
    await page.getByRole("button", { name: "검색" }).click();
    await page.getByRole("button", { name: /Elden Ring/ }).first().click();
    await page.getByRole("button", { name: /리뷰 분석 시작/ }).click();

    await expect(page.getByText("리뷰 수집 실패")).toBeVisible({ timeout: 5000 });
    expect(page.url()).not.toContain("/dashboard");
  });
});

// ─── F-04: 인기 게임 빠른 선택 ──────────────────────────────────────────────

test.describe("F-04: 인기 게임 빠른 선택 (handleQuickSelect)", () => {
  test("인기 게임 카드 클릭 시 선택 상태와 분석 버튼이 즉시 나타난다", async ({ page }) => {
    await page.goto("/");

    // 홈 로드 시 인기 게임 섹션이 보여야 함 (games.length === 0)
    await expect(page.getByText("인기 게임으로 바로 시작하기")).toBeVisible();

    // 인기 게임 카드(Elden Ring) 클릭 — 검색 없이 바로 선택
    await page.getByRole("button", { name: /Elden Ring/ }).click();

    // 분석 버튼 즉시 등장 확인 (선택과 동시에 selected 상태 설정)
    await expect(page.getByRole("button", { name: /리뷰 분석 시작/ })).toBeVisible({ timeout: 2000 });
  });

  test("인기 게임 선택 후 검색 영역으로 스크롤되고 게임 카드가 표시된다", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /Stardew Valley/ }).click();

    // 게임 카드가 검색 결과 영역에 표시됨
    await expect(page.getByRole("button", { name: /Stardew Valley/ }).last()).toBeVisible();

    // 분석 버튼 등장
    await expect(page.getByRole("button", { name: /리뷰 분석 시작/ })).toBeVisible({ timeout: 2000 });
  });
});
