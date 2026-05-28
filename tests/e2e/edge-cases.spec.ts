import { test, expect } from "@playwright/test";

test.describe("엣지 케이스", () => {
  test("빈 검색창에서는 검색 버튼이 비활성화된다", async ({ page }) => {
    await page.goto("/");

    const searchButton = page.getByRole("button", { name: "검색" });
    await expect(searchButton).toBeDisabled();

    await page.getByPlaceholder("게임 이름 검색 (예: Elden Ring)").fill("  ");
    await expect(searchButton).toBeDisabled();
  });

  test("존재하지 않는 게임명 검색 시 '검색 결과가 없습니다.' 메시지가 표시된다", async ({ page }) => {
    await page.route("/api/search*", async (route) => {
      await route.fulfill({ status: 200, json: { games: [] } });
    });

    await page.goto("/");
    await page.getByPlaceholder("게임 이름 검색 (예: Elden Ring)").fill("zzz_nonexistent_game_xyz_12345");
    await page.getByRole("button", { name: "검색" }).click();

    await expect(page.getByText("검색 결과가 없습니다.")).toBeVisible();
  });

  test("분석 데이터 없이 /dashboard 직접 접근 시 홈으로 리다이렉트된다", async ({ page }) => {
    await page.goto("/dashboard?appId=123");

    await expect(page).toHaveURL("/");
  });
});
