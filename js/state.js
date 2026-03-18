/* Shared mutable game state */
export let mode = 'INTRO';
export function setMode(m) { mode = m; }

export const camera = { x: 0, y: 0 };
export const keys = {};

// Visited building tracking (session-only)
export const visitedBuildings = new Set();
export function isAllVisited() { return visitedBuildings.size >= 9; }

// Zone announcements
export const announcedZones = new Set();
export let currentZone = null;
export function setCurrentZone(z) { currentZone = z; }

// Intro zoom
export const introZoom = { scale: 1, active: false, startTime: 0 };
