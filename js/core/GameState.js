/* Shared game state — mode, visited buildings, zone tracking */
export let mode = 'INTRO';
export function setMode(m) { mode = m; }

// Visited building tracking (session-only)
export const visitedBuildings = new Set();
export function isAllVisited() { return visitedBuildings.size >= 9; }

// Zone announcements
export const announcedZones = new Set();
export let currentZone = null;
export function setCurrentZone(z) { currentZone = z; }
