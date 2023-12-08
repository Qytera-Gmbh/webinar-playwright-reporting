import { Page } from "@playwright/test";

/**
 * An abstract page object, providing access to the root page.
 */
export class PageObject {
    /**
     * The root page.
     */
    protected readonly page: Page;

    /**
     * Constructs a new page object which might be displayed on the provided page.
     *
     * @param page - the page
     */
    constructor(page: Page) {
        this.page = page;
    }
}
