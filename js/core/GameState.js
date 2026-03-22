/* Shared game state — mode, visited buildings, zone tracking */
import { TOTAL_BUILDINGS } from '../data/buildings.js';
import { GameMode } from '../data/enums.js';
import { loadVisited } from '../systems/SaveSystem.js';

export let mode = GameMode.INTRO;
export function setMode(m) { mode = m; }

// Visited building tracking (persisted via localStorage)
export const visitedBuildings = new Set();

// Restore saved visited buildings on init
const saved = loadVisited();
for (const label of saved) visitedBuildings.add(label);
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
