/* Audio system — music, ambient, SFX with mute toggle */
import { audioPaths } from '../data/audioPaths.js';

let audioCtx = null;
let muted = true;
const sounds = {};
const loops = {};

function ensureContext() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function loadAudio(key, src, opts = {}) {
    if (opts.loop) {
        const el = new Audio(src);
        el.loop = true;
        el.volume = opts.volume ?? 0.3;
        el.preload = 'auto';
        loops[key] = el;
    } else {
        const el = new Audio(src);
        el.volume = opts.volume ?? 0.5;
        el.preload = 'auto';
        sounds[key] = el;
    }
}

const cooldowns = {};
export function play(key, minInterval = 150) {
    if (muted) return;
    const now = Date.now();
    if (cooldowns[key] && now - cooldowns[key] < minInterval) return;
    cooldowns[key] = now;
    ensureContext();
    const s = sounds[key];
    if (s) { s.currentTime = 0; s.play().catch(() => {}); }
}

export function startLoops() {
    if (muted) return;
    ensureContext();
    for (const el of Object.values(loops)) { el.play().catch(() => {}); }
}

function stopLoops() {
    for (const el of Object.values(loops)) { el.pause(); el.currentTime = 0; }
}

export function toggleMute() {
    muted = !muted;
    if (muted) stopLoops();
    else startLoops();
    return muted;
}


export function initAudio() {
    for (const { key, src, loop, volume } of audioPaths) {
        loadAudio(key, src, { loop, volume });
    }
}
