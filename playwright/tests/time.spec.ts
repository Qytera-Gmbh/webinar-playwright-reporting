import { expect, test } from "@playwright/test";
import { AlarmModal, TimerPage } from "../pages/timer-page";

test.describe("https://webuhr.de", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("https://webuhr.de/timer/");
    });

    test("does not show a message if unchecked", async ({ page }) => {
        const timerPage = new TimerPage(page);
        const newTimerModal = await timerPage.addTimerButton().click();
        await newTimerModal.setSeconds(3);
        await newTimerModal.showMessageCheckbox().uncheck();
        await newTimerModal.startButton().click();
        await expect(timerPage.time()).toHaveText("00:00");
    });

    test("shows a message if checked", async ({ page }) => {
        const timerPage = new TimerPage(page);
        const newTimerModal = await timerPage.addTimerButton().click();
        await newTimerModal.setSeconds(3);
        await newTimerModal.setMessage("The clock's run out, time's up, over");
        await newTimerModal.showMessageCheckbox().check();
        await newTimerModal.startButton().click();
        const alarmModal = new AlarmModal(page);
        await expect(alarmModal.message()).toHaveText("The clock's run out, time's up, over");
    });

    test("can count down minutes", async ({ page }) => {
        const timerPage = new TimerPage(page);
        const newTimerModal = await timerPage.addTimerButton().click();
        await newTimerModal.setMinutes(5);
        await newTimerModal.showMessageCheckbox().uncheck();
        await newTimerModal.startButton().click();
        await expect(timerPage.time()).toHaveText("00:00");
    });
});
