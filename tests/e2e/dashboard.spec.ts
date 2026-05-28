import { test, expect } from "@playwright/test";

const MOCK_GAME = { appid: 1245620, name: "Elden Ring", icon: "", logo: "" };

const MOCK_REVIEWS = {
  reviews: [
    { text: "Great game, amazing gameplay and graphics!", recommended: true, timestamp: 1700000000 },
    { text: "Performance issues but story is excellent", recommended: false, timestamp: 1700000001 },
  ],
  count: 2,
};

const MOCK_ANALYSIS = {
  categories: {
    gameplay: { positive: 8, negative: 2, total: 10 },
    graphics: { positive: 7, negative: 3, total: 10 },
    sound: { positive: 6, negative: 2, total: 8 },
    story: { positive: 9, negative: 1, total: 10 },
    performance: { positive: 3, negative: 7, total: 10 },
    price: { positive: 5, negative: 5, total: 10 },
    multiplayer: { positive: 4, negative: 2, total: 6 },
  },
  summary: "Overall positive reception with performance issues as the main concern.",
  priorities: ["최적화 개선 필요", "멀티플레이 안정성 향상"],
  quotes: ["\"Great game but performance needs work\""],
};

test.describe("분석 대시보드", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("/api/search*", async (route) => {
      await route.fulfill({ status: 200, json: { games: [MOCK_GAME] } });
    });
    await page.route(/\/api\/reviews\/\d+/, async (route) => {
      await route.fulfill({ status: 200, json: MOCK_REVIEWS });
    });
    await page.route("/api/analyze", async (route) => {
      await route.fulfill({ status: 200, json: MOCK_ANALYSIS });
    });
  });

  test("분석 완료 후 /dashboard로 이동한다", async ({ page }) => {
    await page.goto("/");

    await page.getByPlaceholder("게임 이름 검색 (예: Elden Ring)").fill("Elden Ring");
    await page.getByRole("button", { name: "검색" }).click();
    await page.getByRole("button", { name: /Elden Ring/ }).first().click();
    await page.getByRole("button", { name: /리뷰 분석 시작/ }).click();

    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    expect(page.url()).toContain("/dashboard");
  });

  test("대시보드에 AI 요약, 차트, 우선순위 카드가 표시된다", async ({ page }) => {
    await page.goto("/");

    await page.getByPlaceholder("게임 이름 검색 (예: Elden Ring)").fill("Elden Ring");
    await page.getByRole("button", { name: "검색" }).click();
    await page.getByRole("button", { name: /Elden Ring/ }).first().click();
    await page.getByRole("button", { name: /리뷰 분석 시작/ }).click();

    await page.waitForURL(/\/dashboard/, { timeout: 15000 });

    await expect(page.getByText("AI 요약")).toBeVisible();
    await expect(page.getByText("카테고리별 감성 분석")).toBeVisible();
    await expect(page.getByText("개선 우선순위")).toBeVisible();
    await expect(page.getByText(MOCK_ANALYSIS.summary)).toBeVisible();
  });

  test("'다른 게임 검색' 버튼 클릭 시 홈으로 이동한다", async ({ page }) => {
    await page.goto("/");

    await page.getByPlaceholder("게임 이름 검색 (예: Elden Ring)").fill("Elden Ring");
    await page.getByRole("button", { name: "검색" }).click();
    await page.getByRole("button", { name: /Elden Ring/ }).first().click();
    await page.getByRole("button", { name: /리뷰 분석 시작/ }).click();

    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    await page.getByRole("button", { name: "다른 게임 검색" }).click();

    await expect(page).toHaveURL("/");
  });
});
