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

  test("tracks button clicks in Google Analytics", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      const analyticsWindow = window as typeof window & { dataLayer: unknown[] };

      analyticsWindow.dataLayer = [];
      document.addEventListener("click", (event) => event.preventDefault(), true);
    });

    await page.getByRole("link", { name: "GitHub profile" }).click();
    await page.getByRole("link", { name: "LinkedIn profile" }).click();
    await page.getByRole("link", { name: "PayPal profile" }).click();
    await page.getByRole("link", { name: "Helm charts" }).click();
    await page.getByRole("link", { name: "Docker Hub profile" }).click();
    await page.getByRole("button", { name: "Email Jon Fairbanks" }).click();

    const events = await page.evaluate(() =>
      (window as typeof window & { dataLayer: unknown[] }).dataLayer
        .map((entry) => Array.from(entry as IArguments))
        .filter((entry) => entry[0] === "event" && entry[1] === "button_click")
    );

    expect(events).toEqual([
      [
        "event",
        "button_click",
        {
          button_label: "GitHub profile",
          button_target: "github",
          link_url: "https://github.com/jonfairbanks",
        },
      ],
      [
        "event",
        "button_click",
        {
          button_label: "LinkedIn profile",
          button_target: "linkedin",
          link_url: "https://www.linkedin.com/in/jonfairbanks",
        },
      ],
      [
        "event",
        "button_click",
        {
          button_label: "PayPal profile",
          button_target: "paypal",
          link_url: "https://paypal.me/fairbanks",
        },
      ],
      [
        "event",
        "button_click",
        {
          button_label: "Helm charts",
          button_target: "helm_charts",
          link_url: "https://jonfairbanks.github.io/helm-charts",
        },
      ],
      [
        "event",
        "button_click",
        {
          button_label: "Docker Hub profile",
          button_target: "docker_hub",
          link_url: "https://hub.docker.com/u/jonfairbanks",
        },
      ],
      [
        "event",
        "button_click",
        {
          button_label: "Email Jon Fairbanks",
          button_target: "email",
          link_url: "mailto:jon@fairbanks.io",
        },
      ],
    ]);
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

  test("applies Safari canvas blur without a hydration warning", async ({ browser }) => {
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
    });
    const page = await context.newPage();
    const consoleErrors: string[] = [];

    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });

    try {
      await page.goto("/");
      await expect(page.locator("canvas#canvas")).toHaveCSS("filter", "blur(10px)");
      await expect(page.locator("canvas#canvas").locator("..")).toHaveCSS(
        "background-color",
        "rgb(0, 0, 0)"
      );
      await page.waitForTimeout(500);

      expect(consoleErrors.join("\n")).not.toContain(
        "hydrated but some attributes of the server rendered HTML didn't match"
      );
      expect(consoleErrors.join("\n")).not.toContain("Hydration failed");
    } finally {
      await context.close();
    }
  });
});
