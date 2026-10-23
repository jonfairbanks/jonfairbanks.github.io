import { expect, test } from "@playwright/test";

test("blurs the canvas layer without filtering individual drawing operations", async ({ page }) => {
  await page.goto("/");
  const canvas = page.locator("canvas#canvas");
  await expect(canvas).toHaveCSS("filter", "blur(10px)");
  await expect.poll(() => canvas.evaluate((element) => {
    const canvas = element as HTMLCanvasElement;
    return canvas.width === window.innerWidth && canvas.height === window.innerHeight;
  })).toBe(true);
  expect(await canvas.evaluate((element) =>
    (element as HTMLCanvasElement).getContext("2d")!.filter
  )).toBe("none");
});

test("keeps the background still when reduced motion is requested", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const canvas = page.locator("canvas#canvas");
  await expect.poll(() => canvas.evaluate((element) =>
    (element as HTMLCanvasElement).width === window.innerWidth
  )).toBe(true);
  const firstFrame = await canvas.evaluate((element) =>
    (element as HTMLCanvasElement).toDataURL()
  );
  await page.waitForTimeout(250);
  expect(await canvas.evaluate((element) =>
    (element as HTMLCanvasElement).toDataURL()
  )).toBe(firstFrame);
});
