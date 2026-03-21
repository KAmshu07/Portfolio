/* Shared game state — mode, visited buildings, zone tracking */
import { TOTAL_BUILDINGS } from '../data/buildings.js';

export let mode = 'INTRO';
export function setMode(m) { mode = m; }

// Visited building tracking (session-only)
export const visitedBuildings = new Set();
export function isAllVisited() { return visitedBuildings.size >= TOTAL_BUILDINGS; }

// Zone announcements
export const announcedZones = new Set();
export let currentZone = null;
export function setCurrentZone(z) { currentZone = z; }
