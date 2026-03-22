/* Shared game state — mode, visited buildings, zone tracking */
import { TOTAL_BUILDINGS } from '../data/buildings.js';
import { GameMode } from '../data/enums.js';

export let mode = GameMode.INTRO;
export function setMode(m) { mode = m; }

// Visited building tracking (session-only)
export const visitedBuildings = new Set();
export function isAllVisited() { return visitedBuildings.size >= TOTAL_BUILDINGS; }

// Zone announcements
export const announcedZones = new Set();
export let currentZone = null;
export function setCurrentZone(z) { currentZone = z; }

// Discovery celebration state
export const celebration = { active: false, startTime: 0, alpha: 0 };

export function triggerCelebration() {
    if (celebration.active) return;
    celebration.active = true;
    celebration.startTime = Date.now();
}
