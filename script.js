/* ═══════════════════════════════════════════════════════════════
   GAME PORTFOLIO — Amritanshu Kumar
   Top-down village with Tiny Swords assets
   ═══════════════════════════════════════════════════════════════ */
(function () {
'use strict';

/* ═══ SECTION 1 — CONFIG ═══ */
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const SPEED = 2.5;
const WORLD_W = 2400;
const WORLD_H = 1800;
const TILE = 64;
const PSCALE = 0.5;  // player sprite scale

/* ═══ SECTION 2 — ASSET LOADER ═══ */
const ASSET_DEFS = {
    warrior_idle: 'Assets/Tiny Swords (Free Pack)/Units/Blue Units/Warrior/Warrior_Idle.png',
    warrior_run:  'Assets/Tiny Swords (Free Pack)/Units/Blue Units/Warrior/Warrior_Run.png',
    house1:    'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/House1.png',
    house2:    'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/House2.png',
    house3:    'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/House3.png',
    castle:    'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Castle.png',
    barracks:  'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Barracks.png',
    tower:     'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Tower.png',
    archery:   'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Archery.png',
    monastery: 'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Monastery.png',
    tree1: 'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree1.png',
    tree2: 'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree2.png',
    tree3: 'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree3.png',
    tree4: 'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree4.png',
    bush1: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Bushes/Bushe1.png',
    bush2: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Bushes/Bushe2.png',
    rock1: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Rocks/Rock1.png',
    rock2: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Rocks/Rock2.png',
    sheep:  'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Meat/Sheep/Sheep_Idle.png',
    gold1:  'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Gold/Gold Stones/Gold Stone 1.png',
    tilemap: 'Assets/Tiny Swords (Free Pack)/Terrain/Tileset/Tilemap_color1.png',
};
const IMG = {};
function loadAssets() {
    const entries = Object.entries(ASSET_DEFS);
    let loaded = 0;
    const btn = document.getElementById('introStart');
    btn.textContent = 'Loading...';
    btn.disabled = true;
    return new Promise((resolve, reject) => {
        for (const [key, src] of entries) {
            const img = new Image();
            img.onload = () => {
                IMG[key] = img;
                loaded++;
                btn.textContent = 'Loading... ' + Math.round(loaded / entries.length * 100) + '%';
                if (loaded === entries.length) { btn.textContent = 'Press ENTER or Click to Start'; btn.disabled = false; resolve(); }
            };
            img.onerror = () => reject(new Error('Failed: ' + src));
            img.src = src;
        }
    });
}

/* ═══ SECTION 3 — STATE ═══ */
let state = 'INTRO';
let keys = {};
let camera = { x: 0, y: 0 };
let w, h;
function resize() { w = canvas.width = innerWidth; h = canvas.height = innerHeight; ctx.imageSmoothingEnabled = false; }
resize();
addEventListener('resize', resize);

/* ═══ SECTION 4 — INPUT ═══ */
const TOTAL_ASSETS = Object.keys(ASSET_DEFS).length;
addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'Enter' && state === 'INTRO' && Object.keys(IMG).length === TOTAL_ASSETS) startGame();
});
addEventListener('keyup', e => { keys[e.code] = false; });
document.getElementById('introStart').addEventListener('click', () => {
    if (Object.keys(IMG).length === TOTAL_ASSETS) startGame();
});
function startGame() {
    state = 'PLAYING';
    document.getElementById('intro').classList.add('hidden');
    document.querySelector('.hud').classList.add('visible');
}

/* ═══ SECTION 5 — PLAYER ═══ */
const player = {
    x: WORLD_W / 2 - 200, y: WORLD_H / 2 + 100,
    w: 40, h: 30, // collision box (footprint for top-down)
    vx: 0, vy: 0,
    facing: 1, walking: false, frame: 0, ft: 0
};

/* ═══ SECTION 6 — WORLD DATA ═══ */
// Village layout — buildings placed in a natural village cluster
const buildings = [
    // About zone — small houses on the left
    { x: 350,  y: 500,  asset: 'house1',  w: 128, h: 192, label: 'BIO' },
    { x: 600,  y: 350,  asset: 'house2',  w: 128, h: 192, label: 'SKILLS' },
    { x: 200,  y: 800,  asset: 'house3',  w: 128, h: 192, label: 'TECH' },
    // Contact — bottom right
    { x: 1800, y: 1100, asset: 'house1',  w: 128, h: 192, label: 'CONTACT' },
    // Projects zone — bigger buildings in center
    { x: 1000, y: 600,  asset: 'castle',  w: 320, h: 256, label: 'PONGZ' },
    { x: 1450, y: 400,  asset: 'barracks',w: 192, h: 256, label: 'ALNAHSHA' },
    { x: 1700, y: 750,  asset: 'tower',   w: 128, h: 256, label: 'ENGINE' },
    { x: 1200, y: 1000, asset: 'archery', w: 192, h: 256, label: 'RECURVE' },
    { x: 1900, y: 500,  asset: 'monastery',w: 192, h: 320, label: 'SYSTEMS' },
];

// Trees scattered around
const trees = [];
const treeSpots = [
    [80,300],[250,200],[500,150],[150,600],[700,700],[850,400],
    [950,250],[1100,150],[1350,200],[1600,150],[1800,300],
    [2000,700],[2100,400],[2200,900],[500,1100],[800,1200],
    [1400,1100],[1700,1200],[2000,1100],[100,1000],[2100,600],
    [700,500],[1550,650],[1850,950],[400,1300],[1000,1350],
];
for (const [tx, ty] of treeSpots) {
    trees.push({ x: tx, y: ty, asset: 'tree' + (Math.floor(Math.random()*4)+1), frame: Math.floor(Math.random()*8), timer: Math.floor(Math.random()*10) });
}

// Decorations
const decos = [];
for (let i = 0; i < 30; i++) {
    decos.push({ x: Math.random()*WORLD_W, y: Math.random()*WORLD_H, asset: Math.random()>0.5?'bush1':'bush2', frame: Math.floor(Math.random()*8), timer: Math.floor(Math.random()*10) });
}
for (let i = 0; i < 15; i++) {
    decos.push({ x: Math.random()*WORLD_W, y: Math.random()*WORLD_H, asset: Math.random()>0.5?'rock1':'rock2', frame: 0, timer: 0, isStatic: true });
}
// Gold stones near castle
for (let i = 0; i < 5; i++) {
    decos.push({ x: 900+Math.random()*400, y: 500+Math.random()*300, asset: 'gold1', frame: 0, timer: 0, isStatic: true });
}
// Sheep
const sheep = { x: 500, y: 650, frame: 0, timer: 0 };

/* ═══ SECTION 7 — INTERACTABLES ═══ */
// Each interactable is linked to a building by matching label
const interactables = [
    { label:'BIO',
      content:`<h2>About Me</h2><p>Client, server, API, and deployment pipeline — I build across the complete stack. Currently leading a production multiplayer game from Unity client through TypeScript game server to cloud deployment.</p><p>Built a game engine in C++ from first principles. Shipped titles with over <strong style="color:#eec941">5M downloads</strong>.</p><p><strong>Current:</strong> Team Lead at RootHoot Pvt Ltd (Remote)</p><p><strong>Previous:</strong> Game Developer at DeftSoft</p>` },
    { label:'SKILLS',
      content:`<h2>What I Do</h2><p><strong style="color:#eec941">01 — Full-Stack Game Dev</strong><br>Unity client to backend to deployment.</p><br><p><strong style="color:#eec941">02 — Backend & Multiplayer</strong><br>Node.js, Socket.IO, Express, MongoDB, Docker.</p><br><p><strong style="color:#eec941">03 — Engine & Systems</strong><br>C++ engine dev, ECS, reusable Unity frameworks.</p>` },
    { label:'TECH',
      content:`<h2>Tech Stack</h2><div class="popup-tags"><span class="t-lang">C#</span><span class="t-lang">TypeScript</span><span class="t-lang">C++</span><span class="t-lang">Go</span><span class="t-lang">Python</span><span class="t-engine">Unity</span><span class="t-engine">Unreal</span><span class="t-infra">Node.js</span><span class="t-infra">Express</span><span class="t-infra">MongoDB</span><span class="t-infra">Redis</span><span class="t-infra">Socket.IO</span><span class="t-devops">Docker</span><span class="t-devops">Cloud Run</span><span class="t-devops">GitHub Actions</span></div>` },
    { label:'PONGZ',
      content:`<span class="popup-badge">FLAGSHIP — EARLY ACCESS</span><h2>Pongz</h2><p class="popup-metrics">14K+ Players • 2,800+ DAU • 62K+ Matches</p><p>Production multiplayer Mahjong game. Unity 6 client, TypeScript/Socket.IO game server, Express/MongoDB REST API. Docker on Cloud Run.</p><ul><li>Ranked matchmaking with 34-tier skill rating</li><li>7,400+ ranked players competing</li><li>AFK detection with bot stand-ins</li><li>CI/CD: GitHub Actions → Docker → Cloud Run</li></ul><div class="popup-pills"><span>Unity 6</span><span>TypeScript</span><span>Socket.IO</span><span>Express</span><span>MongoDB</span><span>Docker</span></div>` },
    { label:'ALNAHSHA',
      content:`<h2>Alnahsha Run</h2><p class="popup-metrics">5M+ Downloads • 4.6 Stars</p><p>Endless runner reaching 5M+ downloads on Google Play. Improved engagement 30% through player-driven iteration.</p><div class="popup-pills"><span>Unity</span><span>C#</span><span>Google Play</span></div><a href="https://play.google.com/store/apps/details?id=com.moderndoctors.alnahsharun" target="_blank" class="popup-link">Play Store →</a>` },
    { label:'ENGINE',
      content:`<h2>Nimirta Engine</h2><p class="popup-metrics">C++ from first principles</p><p>Custom 2D game engine in C++/SFML. Physics simulation, ECS architecture, AI opponents across 3 difficulty levels.</p><div class="popup-pills"><span>C++</span><span>SFML</span><span>ECS</span><span>Physics</span></div>` },
    { label:'RECURVE',
      content:`<h2>Recurve 28</h2><p>Hardware-integrated archery game — camera, Arduino, projector with OpenCV for real-time arrow detection.</p><div class="popup-pills"><span>Unity</span><span>OpenCV</span><span>Arduino</span></div>` },
    { label:'SYSTEMS',
      content:`<h2>Unity Systems</h2><p>8 reusable engine systems: UI, Event Bus, State Machine, Logging, Save, Pause, Popup, Loading.</p><div class="popup-pills"><span>C#</span><span>Unity</span><span>Patterns</span></div>` },
    { label:'CONTACT',
      content:`<h2>Let's Talk</h2><p>Open to opportunities at studios that value ownership and shipping games people play.</p><div class="contact-grid"><a href="mailto:kamshu00@gmail.com" class="contact-card"><small>EMAIL</small><span>kamshu00@gmail.com</span></a><a href="https://www.linkedin.com/in/amritanshu-kumar-/" target="_blank" class="contact-card"><small>LINKEDIN</small><span>amritanshu-kumar</span></a><a href="tel:+917903734532" class="contact-card"><small>PHONE</small><span>+91 7903734532</span></a><a href="Amritanshu_Kumar_Resume.pdf" target="_blank" download class="contact-card"><small>RESUME</small><span>Download PDF ↓</span></a></div>` },
];

/* ═══ SECTION 8 — SPRITE HELPERS ═══ */
function drawFrame(img, frame, fw, fh, x, y, scale, flip) {
    ctx.save();
    const dw = fw * scale, dh = fh * scale;
    if (flip) { ctx.translate(x + dw, y); ctx.scale(-1, 1); x = 0; y = 0; }
    ctx.drawImage(img, frame * fw, 0, fw, fh, x, y, dw, dh);
    ctx.restore();
}
function drawImg(img, x, y, scale) {
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}

/* ═══ SECTION 9 — UPDATE ═══ */
function update() {
    if (state === 'INTRO') {
        // Slow pan around village during intro
        const t = Date.now() * 0.0003;
        camera.x = WORLD_W * 0.25 + Math.sin(t) * 300;
        camera.y = WORLD_H * 0.25 + Math.cos(t * 0.7) * 200;
        // Still animate trees/decos
        for (const tr of trees) { tr.timer++; if (tr.timer >= 10) { tr.timer = 0; tr.frame = (tr.frame + 1) % 8; } }
        for (const d of decos) { if (!d.isStatic) { d.timer++; if (d.timer >= 12) { d.timer = 0; d.frame = (d.frame + 1) % 8; } } }
        sheep.timer++; if (sheep.timer >= 10) { sheep.timer = 0; sheep.frame = (sheep.frame + 1) % 6; }
        return;
    }
    if (state !== 'PLAYING') return;

    // Movement — 4 directional, no gravity
    let mx = 0, my = 0;
    if (keys.ArrowLeft || keys.KeyA) { mx = -1; player.facing = -1; }
    if (keys.ArrowRight || keys.KeyD) { mx = 1; player.facing = 1; }
    if (keys.ArrowUp || keys.KeyW) my = -1;
    if (keys.ArrowDown || keys.KeyS) my = 1;

    // Normalize diagonal
    if (mx && my) { mx *= 0.707; my *= 0.707; }
    player.walking = mx !== 0 || my !== 0;

    const nx = player.x + mx * SPEED;
    const ny = player.y + my * SPEED;

    // Building collision — check against building footprints
    let blocked = false;
    const pFoot = { x: nx, y: ny, w: player.w, h: player.h };
    for (const b of buildings) {
        // Building footprint: bottom portion of building sprite
        const bFoot = { x: b.x + b.w*0.15, y: b.y + b.h*0.6, w: b.w*0.7, h: b.h*0.35 };
        if (pFoot.x < bFoot.x + bFoot.w && pFoot.x + pFoot.w > bFoot.x &&
            pFoot.y < bFoot.y + bFoot.h && pFoot.y + pFoot.h > bFoot.y) {
            blocked = true; break;
        }
    }
    if (!blocked) {
        player.x = Math.max(0, Math.min(WORLD_W - player.w, nx));
        player.y = Math.max(0, Math.min(WORLD_H - player.h, ny));
    }

    // Camera — center on player
    camera.x += ((player.x + player.w/2 - w/2) - camera.x) * 0.08;
    camera.y += ((player.y + player.h/2 - h/2) - camera.y) * 0.08;
    camera.x = Math.max(0, Math.min(WORLD_W - w, camera.x));
    camera.y = Math.max(0, Math.min(WORLD_H - h, camera.y));

    // Walk anim
    if (player.walking) {
        player.ft++;
        if (player.ft > 5) { player.ft = 0; player.frame = (player.frame + 1) % 6; }
    } else {
        player.ft++;
        if (player.ft > 8) { player.ft = 0; player.frame = (player.frame + 1) % 8; }
    }

    // Animate trees & decos
    for (const tr of trees) { tr.timer++; if (tr.timer >= 10) { tr.timer = 0; tr.frame = (tr.frame + 1) % 8; } }
    for (const d of decos) { if (!d.isStatic) { d.timer++; if (d.timer >= 12) { d.timer = 0; d.frame = (d.frame + 1) % 8; } } }
    sheep.timer++; if (sheep.timer >= 10) { sheep.timer = 0; sheep.frame = (sheep.frame + 1) % 6; }

    // Info panel
    updatePanel();
}

/* ═══ SECTION 10 — RENDER ═══ */
function render() {
    const ox = -camera.x;
    const oy = -camera.y;

    // Ground — tile grass across visible area
    ctx.fillStyle = '#7ab648';
    ctx.fillRect(0, 0, w, h);
    if (IMG.tilemap) {
        // Use the center grass tile (col 1, row 1 of the tilemap, 64x64)
        const srcX = 64, srcY = 64, srcW = 64, srcH = 64;
        const startX = -(camera.x % TILE);
        const startY = -(camera.y % TILE);
        for (let gx = startX; gx < w + TILE; gx += TILE) {
            for (let gy = startY; gy < h + TILE; gy += TILE) {
                ctx.drawImage(IMG.tilemap, srcX, srcY, srcW, srcH, gx, gy, TILE, TILE);
            }
        }
    }

    // Collect all drawable objects for Y-sort (isometric depth)
    const drawList = [];

    // Buildings
    for (const b of buildings) {
        const sx = b.x + ox, sy = b.y + oy;
        if (sx < -b.w-20 || sx > w+20 || sy < -b.h-20 || sy > h+20) continue;
        drawList.push({ y: b.y + b.h, type: 'building', data: b, sx, sy });
    }

    // Trees
    for (const tr of trees) {
        const sx = tr.x + ox, sy = tr.y + oy;
        if (sx < -200 || sx > w+200 || sy < -300 || sy > h+100) continue;
        drawList.push({ y: tr.y + 200, type: 'tree', data: tr, sx, sy });
    }

    // Decos
    for (const d of decos) {
        const sx = d.x + ox, sy = d.y + oy;
        if (sx < -100 || sx > w+100 || sy < -100 || sy > h+100) continue;
        drawList.push({ y: d.y + 50, type: 'deco', data: d, sx, sy });
    }

    // Sheep
    {
        const sx = sheep.x + ox, sy = sheep.y + oy;
        if (sx > -100 && sx < w+100 && sy > -100 && sy < h+100) {
            drawList.push({ y: sheep.y + 60, type: 'sheep', sx, sy });
        }
    }

    // Player
    drawList.push({ y: player.y + player.h, type: 'player', sx: player.x + ox, sy: player.y + oy });

    // Sort by Y (bottom of object) for depth
    drawList.sort((a, b) => a.y - b.y);

    // Draw everything
    for (const item of drawList) {
        switch (item.type) {
            case 'building': {
                const b = item.data;
                if (IMG[b.asset]) drawImg(IMG[b.asset], item.sx, item.sy, 1.0);
                // Label nameplate above building
                const lx = item.sx + b.w/2;
                const ly = item.sy - 12;
                ctx.font = "700 10px 'Press Start 2P',monospace";
                const tw = ctx.measureText(b.label).width;
                // Dark pill background
                const px = 10, py = 4;
                ctx.fillStyle = 'rgba(20,10,5,0.75)';
                ctx.beginPath();
                ctx.roundRect(lx - tw/2 - px, ly - 10 - py, tw + px*2, 16 + py*2, 6);
                ctx.fill();
                // Gold border
                ctx.strokeStyle = 'rgba(238,201,65,0.5)';
                ctx.lineWidth = 1.5;
                ctx.stroke();
                // Text
                ctx.fillStyle = '#eec941';
                ctx.textAlign = 'center';
                ctx.fillText(b.label, lx, ly);
                break;
            }
            case 'tree': {
                const tr = item.data;
                if (IMG[tr.asset]) drawFrame(IMG[tr.asset], tr.frame, 192, 256, item.sx, item.sy - 56, 1.0, false);
                break;
            }
            case 'deco': {
                const d = item.data;
                if (d.isStatic) {
                    if (IMG[d.asset]) drawImg(IMG[d.asset], item.sx, item.sy, 0.8);
                } else {
                    if (IMG[d.asset]) drawFrame(IMG[d.asset], d.frame, 128, 128, item.sx, item.sy, 0.6, false);
                }
                break;
            }
            case 'sheep':
                if (IMG.sheep) drawFrame(IMG.sheep, sheep.frame, 128, 128, item.sx, item.sy, 0.7, false);
                break;
            case 'player':
                drawPlayer(item.sx, item.sy);
                break;
        }
    }

    // Proximity indicator — glowing arrow + prompt over nearest building
    const nearB = getNearBuilding();
    if (nearB && state === 'PLAYING') {
        const t = Date.now() * 0.001;
        const bx = nearB.x + ox + nearB.w/2;
        const by = nearB.y + oy - 30 + Math.sin(t * 4) * 6;
        // Glow
        ctx.shadowColor = '#eec941';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#eec941';
        ctx.beginPath();
        ctx.moveTo(bx - 8, by);
        ctx.lineTo(bx + 8, by);
        ctx.lineTo(bx, by + 12);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    // Bottom HUD bar
    if (state === 'PLAYING') {
        // Dark gradient bar at bottom
        const barH = 36;
        const barGrad = ctx.createLinearGradient(0, h - barH - 10, 0, h);
        barGrad.addColorStop(0, 'rgba(15,10,5,0)');
        barGrad.addColorStop(0.4, 'rgba(15,10,5,0.7)');
        barGrad.addColorStop(1, 'rgba(15,10,5,0.85)');
        ctx.fillStyle = barGrad;
        ctx.fillRect(0, h - barH - 10, w, barH + 10);

        ctx.textAlign = 'center';
        if (nearB) {
            // Show building name + explore prompt
            ctx.font = "700 11px 'Press Start 2P',monospace";
            ctx.fillStyle = '#eec941';
            ctx.fillText(nearB.label, w/2, h - 18);
            ctx.font = "400 8px 'Press Start 2P',monospace";
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.fillText('Walk closer to explore', w/2, h - 6);
        } else {
            ctx.font = "400 8px 'Press Start 2P',monospace";
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.fillText('WASD to move  •  Walk to buildings to explore', w/2, h - 12);
        }
    }
}

/* ═══ SECTION 11 — DRAW PLAYER ═══ */
function drawPlayer(sx, sy) {
    const img = player.walking ? IMG.warrior_run : IMG.warrior_idle;
    if (!img) return;
    const flip = player.facing === -1;
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(sx + player.w/2, sy + player.h, 18, 5, 0, 0, 6.28);
    ctx.fill();
    // Sprite — offset so feet sit on shadow
    drawFrame(img, player.frame, 192, 192, sx - 28, sy - 38, PSCALE, flip);
}

/* ═══ SECTION 12 — INFO PANEL ═══ */
const infoPanel = document.getElementById('infoPanel');
const infoPanelInner = document.getElementById('infoPanelInner');
let activeLabel = null;

function getNearBuilding() {
    const pcx = player.x + player.w/2;
    const pcy = player.y + player.h/2;
    let nearest = null, dist = 999;
    for (const b of buildings) {
        const bcx = b.x + b.w/2, bcy = b.y + b.h/2;
        const d = Math.sqrt((pcx-bcx)**2 + (pcy-bcy)**2);
        const threshold = Math.max(b.w, b.h) * 0.7;
        if (d < threshold && d < dist) { nearest = b; dist = d; }
    }
    return nearest;
}

function updatePanel() {
    const nearB = getNearBuilding();
    if (nearB) {
        if (nearB.label !== activeLabel) {
            activeLabel = nearB.label;
            const data = interactables.find(i => i.label === nearB.label);
            if (data) infoPanelInner.innerHTML = data.content;
        }
        infoPanel.classList.add('visible');
    } else {
        infoPanel.classList.remove('visible');
        activeLabel = null;
    }
}

/* ═══ SECTION 13 — GAME LOOP ═══ */
function loop() { update(); render(); requestAnimationFrame(loop); }
loop();

loadAssets().catch(err => {
    console.error(err);
    const btn = document.getElementById('introStart');
    btn.textContent = 'Load failed — Download Resume';
    btn.disabled = false;
    btn.onclick = () => window.open('Amritanshu_Kumar_Resume.pdf');
});

})();
