/* Keyboard state — tracks which keys are currently pressed */

export const keys = {};

export function initInput() {
    addEventListener('keydown', e => { keys[e.code] = true; });
    addEventListener('keyup', e => { keys[e.code] = false; });
}
