/* Intro screen — loading bar, start button, game start transition */
import { canvas } from '../core/Canvas.js';
import { setMode } from '../core/GameState.js';
import { introZoom } from '../core/Camera.js';
import { play, startLoops } from '../systems/AudioSystem.js';
import { triggerGuideWind } from '../systems/WindSystem.js';

const btn = document.getElementById('introStart');
const loadingBar = document.getElementById('loadingBar');

let assetsReady = false;
let loadFailed = false;

export function isAssetsReady() { return assetsReady; }

export function onLoadProgress(done, total) {
    const pct = Math.round(done / total * 100);
    btn.textContent = `Loading... ${pct}%`;
    loadingBar.style.width = pct + '%';
}

export function onLoadComplete() {
    assetsReady = true;
    btn.textContent = 'Press ENTER or Click to Start';
    btn.disabled = false;
}

export function onLoadFailed(err) {
    console.error(err);
    loadFailed = true;
    btn.textContent = 'Load failed — Download Resume';
    btn.disabled = false;
}

export function startGame() {
    setMode('PLAYING');
    document.getElementById('intro').classList.add('hidden');
    document.querySelector('.hud').classList.add('visible');
    canvas.style.cursor = "url('Assets/Tiny Swords (Free Pack)/UI Elements/UI Elements/Cursors/Cursor_01.png') 0 0, auto";
    introZoom.active = true;
    introZoom.startTime = Date.now();
    play('click');
    startLoops();
    setTimeout(() => triggerGuideWind(), 2000);
}

export function handleIntroClick() {
    if (loadFailed) { window.open('Amritanshu_Kumar_Resume.pdf'); return; }
    if (assetsReady) startGame();
}

export function initIntroScreen() {
    btn.textContent = 'Loading...';
    btn.disabled = true;
    btn.addEventListener('click', handleIntroClick);
}
