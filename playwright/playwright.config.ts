import { defineConfig, devices } from "@playwright/test";

/**
 * General Playwright configuration.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    workers: 2,
    reporter: [["html"], ["list"]],
    snapshotPathTemplate: "{testDir}/{testFileDir}/snapshots/{testFileName}/{arg}{ext}",
    expect: {
        timeout: 5000,
    },
    use: {
        actionTimeout: 5000,
        screenshot: "on",
        trace: "on",
    },
    projects: [
        {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
        },
    ],
});
