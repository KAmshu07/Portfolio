/* Entry point — init, input, update loop, game loop */
import { canvas, WORLD_W, WORLD_H, viewport, resize, WIND_BIAS } from './config.js';
import { mode, setMode, camera, keys, visitedBuildings, isAllVisited, introZoom } from './state.js';
import { loadAssets } from './assets.js';
import { player, updatePlayer } from './player.js';
import { animateWorld, updateNPCs, buildings } from './world.js';
import { updatePanel, getNearBuilding, updateZone } from './ui.js';
import { updateParticles, spawnParticle } from './particles.js';
import { render } from './render.js';
import { initAudio, play, startLoops, toggleMute } from './audio.js';

// Scroll overlay
const scrollOverlay = document.getElementById('scrollOverlay');
let scrollOpen = false;

// Wind system — ambient weather that pivots toward objectives on demand
const wind = {
    // Ambient default: gentle right-to-left breeze
    ambientX: 0.8, ambientY: 0.2,
    // Current interpolated direction (what particles actually use)
    dirX: 0.8, dirY: 0.2,
    // Target direction (what we're lerping toward)
    targetX: 0.8, targetY: 0.2,
    // Guidance state
    guiding: false, guideTimer: 0,
    guideDuration: 300, // ~5 seconds at 60fps
    // Intensity boost during guidance (more particles, slightly faster)
    intensity: 1,
};
let windSpawnTimer = 0;

function updateWind() {
    // On Space press: pivot wind toward nearest unvisited building
    if (keys.Space && !wind.guiding && !isAllVisited()) {
        let minDist = Infinity, target = null;
        for (const b of buildings) {
            if (visitedBuildings.has(b.label)) continue;
            const dx = (b.x + b.w / 2) - player.x;
            const dy = (b.y + b.h / 2) - player.y;
            const d = dx * dx + dy * dy;
            if (d < minDist) { minDist = d; target = b; }
        }
        if (target) {
            const dx = (target.x + target.w / 2) - player.x;
            const dy = (target.y + target.h / 2) - player.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            wind.targetX = dx / len;
            wind.targetY = dy / len;
            wind.guiding = true;
            wind.guideTimer = wind.guideDuration;
        }
    }

    // Countdown guidance, then ease back to ambient
    if (wind.guiding) {
        wind.guideTimer--;
        wind.intensity = Math.min(2.5, wind.intensity + 0.05);
        if (wind.guideTimer <= 0) {
            wind.guiding = false;
            wind.targetX = wind.ambientX;
            wind.targetY = wind.ambientY;
        }
    } else {
        wind.intensity = Math.max(1, wind.intensity - 0.02);
    }

    // Smooth lerp current direction toward target (slow = natural)
    wind.dirX += (wind.targetX - wind.dirX) * 0.015;
    wind.dirY += (wind.targetY - wind.dirY) * 0.015;
    // Renormalize
    const len = Math.sqrt(wind.dirX * wind.dirX + wind.dirY * wind.dirY) || 1;
    wind.dirX /= len;
    wind.dirY /= len;
}

function spawnWindParticles() {
    windSpawnTimer++;
    const spawnRate = wind.guiding ? 2 : 4;
    if (windSpawnTimer < spawnRate) return;
    windSpawnTimer = 0;

    const count = wind.guiding ? 6 : 4;
    const perpX = -wind.dirY, perpY = wind.dirX;
    const { w, h } = viewport;

    for (let i = 0; i < count; i++) {
        // Spawn across the full visible area — upwind edge + scattered through view
        const spread = (Math.random() - 0.5) * Math.max(w, h) * 1.2;
        const depth = (Math.random() - 0.6) * Math.max(w, h);
        const sx = player.x + wind.dirX * depth + perpX * spread;
        const sy = player.y + wind.dirY * depth + perpY * spread;

        const wobble = (Math.random() - 0.5) * 0.15;
        const speed = (0.8 + Math.random() * 0.5) * wind.intensity;
        const vx = (wind.dirX + wobble) * speed;
        const vy = (wind.dirY + wobble) * speed;

        spawnParticle('leaf', sx, sy, {
            vx, vy,
            life: 80 + Math.random() * 50,
            scale: 14 + Math.random() * 18,
            alpha: (wind.guiding ? 0.7 : 0.5) + Math.random() * 0.3,
            curve: 0.3 + Math.random() * 0.7,
            thickness: 2.2 + Math.random() * 3.3,
        });
    }
}

// State
let loadFailed = false;
let assetsReady = false;
const btn = document.getElementById('introStart');
const loadingBar = document.getElementById('loadingBar');

// Init
resize();
initAudio();
addEventListener('resize', resize);

// Input
addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'Enter' && assetsReady && mode === 'INTRO') startGame();
    if (e.code === 'KeyE' && mode === 'PLAYING') {
        if (scrollOpen) {
            scrollOverlay.classList.add('hidden');
            scrollOpen = false;
        } else if (getNearBuilding()?.label === 'CONTACT') {
            scrollOverlay.classList.remove('hidden');
            scrollOpen = true;
        }
    }
    if (e.code === 'Escape' && scrollOpen) {
        scrollOverlay.classList.add('hidden');
        scrollOpen = false;
    }
});
addEventListener('keyup', e => { keys[e.code] = false; });
btn.addEventListener('click', () => {
    if (loadFailed) { window.open('Amritanshu_Kumar_Resume.pdf'); return; }
    if (assetsReady) startGame();
});
document.getElementById('muteBtn').addEventListener('click', () => {
    const m = toggleMute();
    document.getElementById('muteBtn').textContent = m ? '🔇' : '🔊';
});

function startGame() {
    setMode('PLAYING');
    document.getElementById('intro').classList.add('hidden');
    document.querySelector('.hud').classList.add('visible');
    canvas.style.cursor = "url('Assets/Tiny Swords (Free Pack)/UI Elements/UI Elements/Cursors/Cursor_01.png') 0 0, auto";
    introZoom.active = true;
    introZoom.startTime = Date.now();
    play('click');
    startLoops();
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
    if (scrollOpen) return;

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
    updateWind();
    spawnWindParticles();

    // Nameplate fade
    const nearB = getNearBuilding();
    for (const b of buildings) {
        if (nearB && b.label === nearB.label) {
            b.nameplateAlpha = Math.min(1, b.nameplateAlpha + 0.05);
        } else {
            b.nameplateAlpha = Math.max(0, b.nameplateAlpha - 0.08);
        }
    }

    updateZone();
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
    const pct = Math.round(done / total * 100);
    btn.textContent = `Loading... ${pct}%`;
    loadingBar.style.width = pct + '%';
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
