/* Save/load game progress to localStorage */
import { SaveKey } from '../data/enums.js';

export function saveVisited(visitedSet) {
    try {
        localStorage.setItem(SaveKey.VISITED, JSON.stringify([...visitedSet]));
    } catch { /* quota exceeded or private mode — fail silently */ }
}

export function loadVisited() {
    try {
        const raw = localStorage.getItem(SaveKey.VISITED);
        return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
}

export function saveAchievements(completedSet) {
    try {
        localStorage.setItem(SaveKey.ACHIEVEMENTS, JSON.stringify([...completedSet]));
    } catch { /* fail silently */ }
}

export function loadAchievements() {
    try {
        const raw = localStorage.getItem(SaveKey.ACHIEVEMENTS);
        return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
}

export function saveFlags(flags) {
    try {
        localStorage.setItem(SaveKey.FLAGS, JSON.stringify(flags));
    } catch { /* fail silently */ }
}

export function loadFlags() {
    try {
        const raw = localStorage.getItem(SaveKey.FLAGS);
        return raw ? JSON.parse(raw) : {};
    } catch { return {} }
}
