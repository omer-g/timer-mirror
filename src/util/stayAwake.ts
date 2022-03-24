// IMPORT AND USE ONLY ONCE IN APPLICATION

import NoSleep from "nosleep.js";

let noSleep = new NoSleep();
let eventListenerExists = false;

export function enableNoSleep() {
    document.removeEventListener("submit", enableNoSleep, false);
    if (noSleep.isEnabled === false) {
        noSleep.enable();
    }
}

export async function addNoSleepListener(element: HTMLElement) {
    element.addEventListener("submit", enableNoSleep, false);
}

export async function removeNoSleepListener() {
    if (eventListenerExists) {
        document.removeEventListener("submit", enableNoSleep, false);
        noSleep.disable();
        eventListenerExists = false;
    }
}
