/* Resume scroll overlay — E key toggle */
import { markScrollOpened } from '../systems/AchievementSystem.js';
import { getNearBuilding } from './InfoPanel.js';

const scrollOverlay = document.getElementById('scrollOverlay');
let scrollOpen = false;

export function isScrollOpen() { return scrollOpen; }

export function toggleScroll() {
    if (scrollOpen) {
        scrollOverlay.classList.add('hidden');
        scrollOpen = false;
    } else if (getNearBuilding()?.label === 'CONTACT') {
        scrollOverlay.classList.remove('hidden');
        scrollOpen = true;
        markScrollOpened();
    }
}

export function closeScroll() {
    if (scrollOpen) {
        scrollOverlay.classList.add('hidden');
        scrollOpen = false;
    }
}
