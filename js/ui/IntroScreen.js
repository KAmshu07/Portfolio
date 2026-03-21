/* Intro screen — loading bar, start button, game start transition */
import { canvas } from '../core/Canvas.js';
import { setMode } from '../core/GameState.js';
import { GameMode, AudioKey, DomId, DomClass, UIText, FilePath } from '../data/enums.js';
import { introZoom } from '../core/Camera.js';
import { play, startLoops } from '../systems/AudioSystem.js';
import { triggerGuideWind } from '../systems/WindSystem.js';

const btn = document.getElementById(DomId.INTRO_START);
const loadingBar = document.getElementById(DomId.LOADING_BAR);

let assetsReady = false;
let loadFailed = false;

export function isAssetsReady() { return assetsReady; }

export function onLoadProgress(done, total, failed = 0) {
    const pct = Math.round(done / total * 100);
    btn.textContent = `${UIText.LOADING} ${pct}%`;
    loadingBar.style.width = pct + '%';
}

export function onLoadComplete() {
    assetsReady = true;
    btn.textContent = UIText.START_PROMPT;
    btn.disabled = false;
}

export function onLoadFailed(err) {
    console.error(err);
    loadFailed = true;
    btn.textContent = UIText.LOAD_FAILED;
    btn.disabled = false;
}

export function startGame() {
    setMode(GameMode.PLAYING);
    document.getElementById(DomId.INTRO).classList.add(DomClass.HIDDEN);
    document.querySelector(DomClass.HUD).classList.add(DomClass.VISIBLE);
    canvas.style.cursor = FilePath.CURSOR;
    introZoom.active = true;
    introZoom.startTime = Date.now();
    play(AudioKey.CLICK);
    startLoops();
    setTimeout(() => triggerGuideWind(), 2000);
}

function handleIntroClick() {
    if (loadFailed) { window.open(FilePath.RESUME); return; }
    if (assetsReady) startGame();
}

export function initIntroScreen() {
    btn.textContent = UIText.LOADING;
    btn.disabled = true;
    btn.addEventListener('click', handleIntroClick);
}
