/* Entry point — init, input, update loop, game loop */
import { canvas, WORLD_W, WORLD_H, viewport, resize, WIND_BIAS } from './config.js';
import { mode, setMode, camera, keys, visitedBuildings, isAllVisited } from './state.js';
import { loadAssets } from './assets.js';
import { player, updatePlayer } from './player.js';
import { animateWorld, updateNPCs, buildings } from './world.js';
import { updatePanel } from './ui.js';
import { updateParticles, spawnParticle } from './particles.js';
import { render } from './render.js';

// Wind wayfinding
let windTimer = 0;
function spawnWindLeaves() {
    windTimer++;
    if (windTimer < 10) return;
    windTimer = 0;

    // Find nearest unvisited building
    let target = null;
    if (!isAllVisited()) {
        let minDist = Infinity;
        for (const b of buildings) {
            if (visitedBuildings.has(b.label)) continue;
            const dx = (b.x + b.w / 2) - player.x;
            const dy = (b.y + b.h / 2) - player.y;
            const d = dx * dx + dy * dy;
            if (d < minDist) { minDist = d; target = { x: b.x + b.w / 2, y: b.y + b.h / 2 }; }
        }
    }

    // Spawn 1-2 leaves near player
    for (let i = 0; i < 2; i++) {
        const sx = player.x + (Math.random() - 0.5) * 400;
        const sy = player.y + (Math.random() - 0.5) * 300;
        let vx = (Math.random() - 0.5) * 1.5;
        let vy = (Math.random() - 0.5) * 1.0;
        if (target) {
            const dx = target.x - sx, dy = target.y - sy;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            vx += (dx / len) * WIND_BIAS * 1.5;
            vy += (dy / len) * WIND_BIAS * 1.0;
        }
        spawnParticle('leaf', sx, sy, { vx, vy, life: 90, scale: 1 + Math.random(), alpha: 0.6 });
    }
}

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
        updateNPCs();
        return;
    }
    if (mode !== 'PLAYING') return;

    updatePlayer();
    updateParticles();

    const { w, h } = viewport;
    camera.x += ((player.x + player.w / 2 - w / 2) - camera.x) * 0.08;
    camera.y += ((player.y + player.h / 2 - h / 2) - camera.y) * 0.08;
    camera.x = Math.max(0, Math.min(WORLD_W - w, camera.x));
    camera.y = Math.max(0, Math.min(WORLD_H - h, camera.y));

    animateWorld();
    updateNPCs();
    updatePanel();
    spawnWindLeaves();
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
