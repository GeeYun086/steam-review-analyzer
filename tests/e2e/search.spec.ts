import { test, expect } from "@playwright/test";

const MOCK_GAMES = [
  { appid: 1245620, name: "Elden Ring", icon: "", logo: "" },
  { appid: 2001, name: "Elden Ring Test", icon: "", logo: "" },
];

test.describe("게임 검색", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("/api/search*", async (route) => {
      const url = new URL(route.request().url());
      const q = url.searchParams.get("q") ?? "";
      if (!q.trim()) {
        await route.fulfill({ status: 400, json: { error: "Query required" } });
      } else {
        await route.fulfill({ status: 200, json: { games: MOCK_GAMES } });
      }
    });
    await page.goto("/");
  });

  test("유효한 게임명으로 검색하면 게임 카드가 표시된다", async ({ page }) => {
    await page.getByPlaceholder("게임 이름 검색 (예: Elden Ring)").fill("Elden Ring");
    await page.getByRole("button", { name: "검색" }).click();

    const cards = page.getByRole("button", { name: /Elden Ring/ });
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThanOrEqual(1);
  });

  test("게임 카드 클릭 시 선택 상태와 분석 버튼이 나타난다", async ({ page }) => {
    await page.getByPlaceholder("게임 이름 검색 (예: Elden Ring)").fill("Elden Ring");
    await page.getByRole("button", { name: "검색" }).click();

    await page.getByRole("button", { name: /Elden Ring/ }).first().click();

    await expect(page.getByRole("button", { name: /리뷰 분석 시작/ })).toBeVisible();
  });
});
