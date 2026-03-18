/* Shared mutable game state */
export let mode = 'INTRO';
export function setMode(m) { mode = m; }

export const camera = { x: 0, y: 0 };
export const keys = {};
