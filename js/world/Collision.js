/* Shared collision constants and AABB helpers */

// Building collision insets — single source of truth
export const COLLISION_X_INSET = 0.1;
export const COLLISION_Y_INSET = 0.3;
export const COLLISION_W_RATIO = 0.8;
export const COLLISION_H_RATIO = 0.65;

export function getBuildingCollisionRect(b) {
    return {
        x: b.x + b.w * COLLISION_X_INSET,
        y: b.y + b.h * COLLISION_Y_INSET,
        w: b.w * COLLISION_W_RATIO,
        h: b.h * COLLISION_H_RATIO,
    };
}

export function isPointInBuilding(px, py, b) {
    const r = getBuildingCollisionRect(b);
    return px > r.x && px < r.x + r.w && py > r.y && py < r.y + r.h;
}

export function isRectCollidingBuilding(rx, ry, rw, rh, b) {
    const c = getBuildingCollisionRect(b);
    return rx < c.x + c.w && rx + rw > c.x && ry < c.y + c.h && ry + rh > c.y;
}
