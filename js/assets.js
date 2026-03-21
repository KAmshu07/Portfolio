/* Asset loader — loads images from path registry, reports progress */
import { assetPaths } from './data/assetPaths.js';

export const IMG = {};
export const TOTAL_ASSETS = Object.keys(assetPaths).length;

export function loadAssets(onProgress) {
    const entries = Object.entries(assetPaths);
    let loaded = 0, failed = 0;
    return new Promise((resolve, reject) => {
        for (const [key, src] of entries) {
            const img = new Image();
            img.onload = () => {
                IMG[key] = img;
                loaded++;
                onProgress?.(loaded + failed, entries.length, failed);
                if (loaded + failed === entries.length) resolve();
            };
            img.onerror = () => {
                console.warn('Failed: ' + src);
                IMG[key] = null;
                failed++;
                onProgress?.(loaded + failed, entries.length, failed);
                if (loaded + failed === entries.length) {
                    if (failed > entries.length / 2) reject(new Error(`${failed}/${entries.length} assets failed`));
                    else resolve();
                }
            };
            img.src = src;
        }
    });
}
