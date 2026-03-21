/* Info panel — building proximity detection and content display */
import { player } from '../entities/Player.js';
import { buildings } from '../world/WorldBuilder.js';
import { interactables } from '../data/content.js';
import { visitedBuildings } from '../core/GameState.js';
import { play } from '../systems/AudioSystem.js';

const infoPanel = document.getElementById('infoPanel');
const infoPanelInner = document.getElementById('infoPanelInner');
let activeLabel = null;
let cachedNearB = null;

function findNearBuilding() {
    const pcx = player.x + player.w / 2;
    const pcy = player.y + player.h / 2;
    let nearest = null, dist = Infinity;
    for (const b of buildings) {
        const bcx = b.x + b.w / 2;
        const bcy = b.y + b.h / 2;
        const d = Math.sqrt((pcx - bcx) ** 2 + (pcy - bcy) ** 2);
        const threshold = Math.max(b.w, b.h) * 0.7;
        if (d < threshold && d < dist) { nearest = b; dist = d; }
    }
    return nearest;
}

export function getNearBuilding() { return cachedNearB; }

export function updatePanel() {
    cachedNearB = findNearBuilding();
    if (cachedNearB) {
        if (cachedNearB.label !== activeLabel) {
            play('panelOpen');
            activeLabel = cachedNearB.label;
            const data = interactables.find(i => i.label === cachedNearB.label);
            if (data) {
                if (!visitedBuildings.has(cachedNearB.label)) play('chime');
                visitedBuildings.add(cachedNearB.label);
                infoPanelInner.innerHTML = data.content;
            }
        }
        infoPanel.classList.add('visible');
    } else {
        if (activeLabel) play('panelClose');
        infoPanel.classList.remove('visible');
        activeLabel = null;
    }
}
