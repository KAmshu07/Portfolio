/* Sprite drawing helpers */
import { ctx } from '../core/Canvas.js';

export function drawFrame(img, frame, fw, fh, x, y, scale, flip) {
    if (!img) return;
    ctx.save();
    const dw = fw * scale, dh = fh * scale;
    if (flip) { ctx.translate(x + dw, y); ctx.scale(-1, 1); x = 0; y = 0; }
    ctx.drawImage(img, frame * fw, 0, fw, fh, x, y, dw, dh);
    ctx.restore();
}

export function drawImg(img, x, y, s) {
    if (img) ctx.drawImage(img, x, y, img.width * s, img.height * s);
}
