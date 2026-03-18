/* Info panel and building proximity detection */
import { player } from './player.js';
import { buildings } from './world.js';
import { interactables } from './content.js';
import { visitedBuildings, currentZone, setCurrentZone, announcedZones } from './state.js';
import { ZONES } from './config.js';

const infoPanel = document.getElementById('infoPanel');
const infoPanelInner = document.getElementById('infoPanelInner');
let activeLabel = null;
let cachedNearB = null;

function findNearBuilding() {
    const pcx = player.x + player.w / 2;
    const pcy = player.y + player.h / 2;
    let nearest = null, dist = 999;
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
            activeLabel = cachedNearB.label;
            const data = interactables.find(i => i.label === cachedNearB.label);
            if (data) {
                infoPanelInner.innerHTML = data.content;
                visitedBuildings.add(cachedNearB.label);
            }
            else console.warn('No content for building label:', cachedNearB.label);
        }
        infoPanel.classList.add('visible');
    } else {
        infoPanel.classList.remove('visible');
        activeLabel = null;
    }
}

export const zoneAnnouncement = { text: '', alpha: 0, startTime: 0, active: false };

export function updateZone() {
    for (const zone of ZONES) {
        if (zone.test(player.x, player.y)) {
            if (currentZone !== zone.name) {
                setCurrentZone(zone.name);
                if (!announcedZones.has(zone.name)) {
                    announcedZones.add(zone.name);
                    zoneAnnouncement.text = zone.name;
                    zoneAnnouncement.alpha = 0;
                    zoneAnnouncement.startTime = Date.now();
                    zoneAnnouncement.active = true;
                }
            }
            return;
        }
    }
}
