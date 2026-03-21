/* Resume scroll overlay — E key toggle */
import { markScrollOpened } from '../systems/AchievementSystem.js';
import { getNearBuilding } from './InfoPanel.js';
import { DomId, DomClass, BuildingLabel } from '../data/enums.js';

const scrollOverlay = document.getElementById(DomId.SCROLL_OVERLAY);
let scrollOpen = false;

export function isScrollOpen() { return scrollOpen; }

export function toggleScroll() {
    if (scrollOpen) {
        scrollOverlay.classList.add(DomClass.HIDDEN);
        scrollOpen = false;
    } else if (getNearBuilding()?.label === BuildingLabel.CONTACT) {
        scrollOverlay.classList.remove(DomClass.HIDDEN);
        scrollOpen = true;
        markScrollOpened();
    }
}

export function closeScroll() {
    if (scrollOpen) {
        scrollOverlay.classList.add(DomClass.HIDDEN);
        scrollOpen = false;
    }
}
