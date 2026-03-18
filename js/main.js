/* Entry point — init, input, update loop, game loop */
import { canvas, WORLD_W, WORLD_H, viewport, resize } from './config.js';
import { mode, setMode, camera, keys } from './state.js';
import { loadAssets } from './assets.js';
import { player, updatePlayer } from './player.js';
import { animateWorld } from './world.js';
import { updatePanel } from './ui.js';
import { render } from './render.js';

// State
let loadFailed = false;
let assetsReady = false;
const btn = document.getElementById('introStart');

// Init
resize();
addEventListener('resize', resize);

// Input
addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'Enter' && assetsReady && mode === 'INTRO') startGame();
});
addEventListener('keyup', e => { keys[e.code] = false; });
btn.addEventListener('click', () => {
    if (loadFailed) { window.open('Amritanshu_Kumar_Resume.pdf'); return; }
    if (assetsReady) startGame();
});

function startGame() {
    setMode('PLAYING');
    document.getElementById('intro').classList.add('hidden');
    document.querySelector('.hud').classList.add('visible');
    canvas.style.cursor = "url('Assets/Tiny Swords (Free Pack)/UI Elements/UI Elements/Cursors/Cursor_01.png') 0 0, auto";
}

// Update
function update() {
    if (mode === 'INTRO') {
        const t = Date.now() * 0.0002;
        camera.x = WORLD_W * 0.3 + Math.sin(t) * 400;
        camera.y = WORLD_H * 0.25 + Math.cos(t * 0.7) * 300;
        animateWorld();
        return;
    }
    if (mode !== 'PLAYING') return;

    updatePlayer();

    const { w, h } = viewport;
    camera.x += ((player.x + player.w / 2 - w / 2) - camera.x) * 0.08;
    camera.y += ((player.y + player.h / 2 - h / 2) - camera.y) * 0.08;
    camera.x = Math.max(0, Math.min(WORLD_W - w, camera.x));
    camera.y = Math.max(0, Math.min(WORLD_H - h, camera.y));

    animateWorld();
    updatePanel();
}

// Game loop — starts immediately so intro camera pan shows terrain loading in
function loop() {
    update();
    render();
    requestAnimationFrame(loop);
}
loop();

// Asset loading — DOM updates owned here, not in the loader
btn.textContent = 'Loading...';
btn.disabled = true;

loadAssets((done, total) => {
    btn.textContent = `Loading... ${Math.round(done / total * 100)}%`;
}).then(() => {
    assetsReady = true;
    btn.textContent = 'Press ENTER or Click to Start';
    btn.disabled = false;
}).catch(err => {
    console.error(err);
    loadFailed = true;
    btn.textContent = 'Load failed — Download Resume';
    btn.disabled = false;
});
