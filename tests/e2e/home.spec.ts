import { expect, test } from "@playwright/test";

test.describe("homepage", () => {
  test("renders the Fairbanks landing page", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle("Fairbanks.io");
    await expect(page.getByRole("img", { name: "Fairbanks.io" })).toBeVisible();
    await expect(
      page.getByText("Architecting Resilience: Transforming Systems for the World of Cloud & DevOps")
    ).toBeVisible();
    await expect(page.locator("canvas#canvas")).toBeVisible();
  });

  test("exposes expected accessible controls", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "GitHub profile" })).toHaveAttribute(
      "href",
      "https://github.com/jonfairbanks"
    );
    await expect(page.getByRole("link", { name: "LinkedIn profile" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/jonfairbanks"
    );
    await expect(page.getByRole("link", { name: "PayPal profile" })).toHaveAttribute(
      "href",
      "https://paypal.me/fairbanks"
    );
    await expect(page.getByRole("link", { name: "Helm charts" })).toHaveAttribute(
      "href",
      "https://jonfairbanks.github.io/helm-charts"
    );
    await expect(page.getByRole("link", { name: "Docker Hub profile" })).toHaveAttribute(
      "href",
      "https://hub.docker.com/u/jonfairbanks"
    );
    await expect(page.getByRole("button", { name: "Email Jon Fairbanks" })).toBeVisible();
  });

  test("stays within a single viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");

    const overflow = await page.evaluate(() => ({
      htmlOverflowX: getComputedStyle(document.documentElement).overflowX,
      htmlOverflowY: getComputedStyle(document.documentElement).overflowY,
      bodyOverflowX: getComputedStyle(document.body).overflowX,
      bodyOverflowY: getComputedStyle(document.body).overflowY,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight,
    }));

    expect(overflow).toMatchObject({
      htmlOverflowX: "hidden",
      htmlOverflowY: "hidden",
      bodyOverflowX: "hidden",
      bodyOverflowY: "hidden",
    });
    expect(overflow.scrollWidth).toBe(overflow.clientWidth);
    expect(overflow.scrollHeight).toBe(overflow.clientHeight);
  });
});
