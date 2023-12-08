import { expect, test } from "@playwright/test";
import { PicturePage } from "../pages/picture-page";

test.describe("https://picsum.photos", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("https://picsum.photos");
    });

    test("contains an image in the header", async ({ page }) => {
        const picturePage = new PicturePage(page);
        await expect(picturePage.headerImage()).toHaveScreenshot("expectedImage.png");
    });
});
