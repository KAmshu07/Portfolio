/* Entry point — init, input, update loop, game loop */
import { canvas, WORLD_W, WORLD_H, viewport, resize } from './config.js';
import { mode, setMode, camera, keys, introZoom } from './state.js';
import { loadAssets } from './assets.js';
import { player, updatePlayer } from './player.js';
import { animateWorld, buildings, npcs } from './world.js';
import { updateNPCs } from './npc.js';
import { updatePanel, getNearBuilding, updateZone } from './ui.js';
import { updateParticles } from './particles.js';
import { render } from './render.js';
import { initAudio, play, startLoops, toggleMute } from './audio.js';
import { checkAchievements, markScrollOpened, achievements, getCompleted } from './achievements.js';
import { updateWind, spawnWindParticles, triggerGuideWind } from './wind.js';

// Scroll overlay
const scrollOverlay = document.getElementById('scrollOverlay');
let scrollOpen = false;

// Achievement panel
const achievePanel = document.getElementById('achievePanel');
let achievePanelOpen = false;

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
            markScrollOpened();
        }
    }
    if (e.code === 'Tab' && mode === 'PLAYING') {
        e.preventDefault();
        if (achievePanelOpen) {
            achievePanel.classList.add('hidden');
            achievePanelOpen = false;
        } else {
            // Refresh panel content
            const completed = getCompleted();
            achievePanel.querySelector('.achieve-list').innerHTML = achievements.map(a =>
                `<div class="achieve-item ${completed.has(a.id) ? 'done' : ''}">
                    <span class="achieve-check">${completed.has(a.id) ? '★' : '☆'}</span>
                    <div><strong>${a.title}</strong><br><small>${a.desc}</small></div>
                </div>`
            ).join('');
            achievePanel.classList.remove('hidden');
            achievePanelOpen = true;
        }
    }
    if (e.code === 'Escape' && achievePanelOpen) {
        achievePanel.classList.add('hidden');
        achievePanelOpen = false;
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

let gameStartTime = 0;

function startGame() {
    setMode('PLAYING');
    gameStartTime = Date.now();
    document.getElementById('intro').classList.add('hidden');
    document.querySelector('.hud').classList.add('visible');
    canvas.style.cursor = "url('Assets/Tiny Swords (Free Pack)/UI Elements/UI Elements/Cursors/Cursor_01.png') 0 0, auto";
    introZoom.active = true;
    introZoom.startTime = Date.now();
    play('click');
    startLoops();

    // Auto-trigger wind toward nearest building after 2 seconds (Journey's mountain principle)
    setTimeout(() => triggerGuideWind(), 2000);
}

// Update
function update() {
    if (mode === 'INTRO') {
        const t = Date.now() * 0.0002;
        camera.x = WORLD_W * 0.3 + Math.sin(t) * 400;
        camera.y = WORLD_H * 0.25 + Math.cos(t * 0.7) * 300;
        animateWorld();
        updateNPCs(npcs);
        return;
    }
    if (mode !== 'PLAYING') return;
    if (scrollOpen || achievePanelOpen) return;

    updatePlayer();
    updateParticles();

    const { w, h } = viewport;
    camera.x += ((player.x + player.w / 2 - w / 2) - camera.x) * 0.08;
    camera.y += ((player.y + player.h / 2 - h / 2) - camera.y) * 0.08;
    camera.x = Math.max(0, Math.min(WORLD_W - w, camera.x));
    camera.y = Math.max(0, Math.min(WORLD_H - h, camera.y));

    animateWorld();
    updateNPCs(npcs);
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
    checkAchievements();
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
