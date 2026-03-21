/* Zone tracking and Dark Souls-style announcement triggers */
import { player } from '../entities/Player.js';
import { currentZone, setCurrentZone, announcedZones } from '../core/GameState.js';
import { zones } from '../data/zones.js';

export const zoneAnnouncement = { text: '', alpha: 0, startTime: 0, active: false };

function testZone(zone, x, y) {
    if (zone.maxX !== undefined && x >= zone.maxX) return false;
    if (zone.minX !== undefined && x <= zone.minX) return false;
    if (zone.maxY !== undefined && y >= zone.maxY) return false;
    if (zone.minY !== undefined && y <= zone.minY) return false;
    return true;
}

export function updateZone() {
    for (const zone of zones) {
        if (testZone(zone, player.x, player.y)) {
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
