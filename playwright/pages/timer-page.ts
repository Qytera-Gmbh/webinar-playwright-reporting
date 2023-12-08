import { Locator } from "@playwright/test";
import { PageObject } from "./page";

/**
 * Models the page displaying the timer.
 */
export class TimerPage extends PageObject {
    /**
     * Provides access to the timer page's button for configuring a new timer.
     *
     * @returns the button
     */
    public addTimerButton(): AddTimerButton {
        return new AddTimerButton(this.page);
    }

    /**
     * Provides access to the timer page's text displaying the remaining time.
     *
     * @returns the text
     */
    public time(): Locator {
        return this.page.locator("#lbl-time");
    }
}

/**
 * Models the button which opens the new timer modal when clicked.
 */
export class AddTimerButton extends PageObject {
    /**
     * Clicks the button.
     *
     * @returns the configuration modal
     */
    public async click(): Promise<AddTimerModal> {
        await this.page.locator("#btn-set-timer").click();
        return new AddTimerModal(this.page);
    }
}

/**
 * Models the modal for configuring new timers.
 */
export class AddTimerModal extends PageObject {
    /**
     * Set the timer's hours value.
     *
     * @param hours - the hours
     */
    public async setHours(hours: number): Promise<void> {
        const option = hours.toString().padStart(2, "0");
        await this.countdownGroup().locator("#edt-hour").selectOption(option);
    }

    /**
     * Set the timer's minutes value.
     *
     * @param minutes - the minutes
     */
    public async setMinutes(minutes: number): Promise<void> {
        const option = minutes.toString().padStart(2, "0");
        await this.countdownGroup().locator("#edt-minute").selectOption(option);
    }

    /**
     * Set the timer's seconds value.
     *
     * @param seconds - the seconds
     */
    public async setSeconds(seconds: number): Promise<void> {
        const option = seconds.toString().padStart(2, "0");
        await this.countdownGroup().locator("#edt-second").selectOption(option);
    }

    /**
     * Provides access to the checkbox for repeating the alarm sound.
     *
     * @returns the checkbox
     */
    public repeatCheckbox(): Locator {
        return this.page.getByLabel("chk-audio-repeat");
    }

    /**
     * Enterns the message to display when the timer runs out.
     *
     * @param message - the message
     */
    public async setMessage(message: string): Promise<void> {
        await this.page.locator("#edt-title").fill(message);
    }

    /**
     * Provides access to the checkbox toggling on or off the the alarm message.
     *
     * @returns the checkbox
     */
    public showMessageCheckbox(): Locator {
        // Actual input is invisible, we need to click the label.
        return this.page.locator("label[for='chk-show-message']");
    }

    /**
     * Provides access to the button for starting the timer.
     *
     * @returns the button
     */
    public startButton(): Locator {
        return this.page.locator("#btn-start-timer");
    }

    private countdownGroup(): Locator {
        return this.page.locator("#group-countdown");
    }
}

/**
 * Models the modal displayed when timers run out.
 */
export class AlarmModal extends PageObject {
    /**
     * Provides access to the alarm modal's displayed message.
     *
     * @returns the message
     */
    public message(): Locator {
        return this.page.locator("#lbl-dialog-alarm-title");
    }
}
