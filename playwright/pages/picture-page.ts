import { Locator } from "@playwright/test";
import { PageObject } from "./page";

/**
 * Models the page displaying the placeholder images.
 */
export class PicturePage extends PageObject {
    /**
     * Provides access to the page's header image.
     *
     * @returns the header image
     */
    public headerImage(): Locator {
        // The header contains two images. We need to retrieve the photo, not the title image.
        // It's ugly, but what else can you do if the application does not have any IDs :(
        return this.page
            .locator("header")
            .locator("div")
            .filter({ hasNot: this.page.locator("h1") })
            .locator("img");
    }
}
