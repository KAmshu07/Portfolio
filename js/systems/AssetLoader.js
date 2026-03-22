/* Asset loading system — loads images from path registry, reports progress */
import { assetPaths } from '../data/assetPaths.js';

export const IMG = {};
export const TOTAL_ASSETS = Object.keys(assetPaths).length;

// Critical assets that must load before gameplay starts
const CRITICAL_KEYS = new Set([
    'idleDown', 'idleUp', 'idleLeft', 'idleRight',
    'runDown', 'runUp', 'runLeft', 'runRight',
    'house1', 'house2', 'house3', 'castle', 'barracks', 'tower', 'archery', 'monastery', 'forge',
    'tilemap', 'water',
]);

const LOAD_TIMEOUT = 15000;

function loadImage(key, src) {
    return new Promise((resolve) => {
        const img = new Image();
        const timer = setTimeout(() => { resolve(false); }, LOAD_TIMEOUT);
        img.onload = () => { clearTimeout(timer); IMG[key] = img; resolve(true); };
        img.onerror = () => { clearTimeout(timer); resolve(false); };
        img.src = src;
    });
}

export function loadAssets(onProgress) {
    const entries = Object.entries(assetPaths);
    const critical = entries.filter(([key]) => CRITICAL_KEYS.has(key));
    const deferred = entries.filter(([key]) => !CRITICAL_KEYS.has(key));
    let loaded = 0, failed = 0;
    const total = entries.length;

    return new Promise((resolve, reject) => {
        // Phase 1: Load critical assets
        const criticalPromises = critical.map(([key, src]) =>
            loadImage(key, src).then(ok => {
                ok ? loaded++ : failed++;
                onProgress?.(loaded + failed, total, failed);
            })
        );

        Promise.all(criticalPromises).then(() => {
            // Phase 2: Load deferred assets (non-blocking)
            const deferredPromises = deferred.map(([key, src]) =>
                loadImage(key, src).then(ok => {
                    ok ? loaded++ : failed++;
                    onProgress?.(loaded + failed, total, failed);
                })
            );

            Promise.all(deferredPromises).then(() => {
                if (failed > total * 0.5) reject(new Error('Too many assets failed'));
                else resolve();
            });
        });
    });
}
