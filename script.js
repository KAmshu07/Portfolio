/* ═══════════════════════════════════════════════════════════════
   GAME PORTFOLIO — Amritanshu Kumar
   Clean rewrite: COC fantasy art style, modular sections
   ═══════════════════════════════════════════════════════════════ */
(function () {
'use strict';

/* ╔═══════════════════════════════════════════════════════════╗
   ║  SECTION 1 — CONSTANTS & CONFIG                          ║
   ╚═══════════════════════════════════════════════════════════╝ */
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const MOVE_SPEED = 1.5;
const GRAVITY = 0.35;
const TILE = 40;
const WORLD_W = 5500;
const WORLD_H = 1200;
const GROUND_Y = WORLD_H - TILE * 2;
/* ╔═══════════════════════════════════════════════════════════╗
   ║  SECTION 2 — ASSET LOADER                                ║
   ╚═══════════════════════════════════════════════════════════╝ */
const ASSET_DEFS = {
    // Player
    warrior_idle: 'Assets/Tiny Swords (Free Pack)/Units/Blue Units/Warrior/Warrior_Idle.png',
    warrior_run:  'Assets/Tiny Swords (Free Pack)/Units/Blue Units/Warrior/Warrior_Run.png',
    // Buildings
    house1:    'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/House1.png',
    house2:    'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/House2.png',
    house3:    'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/House3.png',
    castle:    'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Castle.png',
    barracks:  'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Barracks.png',
    tower:     'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Tower.png',
    archery:   'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Archery.png',
    monastery: 'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Monastery.png',
    // Trees
    tree1: 'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree1.png',
    tree2: 'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree2.png',
    tree3: 'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree3.png',
    tree4: 'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree4.png',
    // Bushes
    bush1: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Bushes/Bushe1.png',
    bush2: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Bushes/Bushe2.png',
    bush3: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Bushes/Bushe3.png',
    bush4: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Bushes/Bushe4.png',
    // Rocks
    rock1: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Rocks/Rock1.png',
    rock2: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Rocks/Rock2.png',
    rock3: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Rocks/Rock3.png',
    rock4: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Rocks/Rock4.png',
    // Clouds
    cloud1: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Clouds/Clouds_01.png',
    cloud2: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Clouds/Clouds_02.png',
    cloud3: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Clouds/Clouds_03.png',
    // Special
    sheep:  'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Meat/Sheep/Sheep_Idle.png',
    gold1:  'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Gold/Gold Stones/Gold Stone 1.png',
    // Terrain
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
                if (loaded === entries.length) {
                    btn.textContent = 'Press ENTER or Click to Start';
                    btn.disabled = false;
                    resolve();
                }
            };
            img.onerror = () => reject(new Error('Failed: ' + src));
            img.src = src;
        }
    });
}

/* ╔═══════════════════════════════════════════════════════════╗
   ║  SECTION 3 — STATE                                       ║
   ╚═══════════════════════════════════════════════════════════╝ */
let state = 'INTRO';
let keys = {};
let camera = { x: 0 };
let w, h;
let currentZone = '';

function resize() { w = canvas.width = innerWidth; h = canvas.height = innerHeight; ctx.imageSmoothingEnabled = false; }
resize();
addEventListener('resize', resize);

/* ╔═══════════════════════════════════════════════════════════╗
   ║  SECTION 4 — INPUT                                       ║
   ╚═══════════════════════════════════════════════════════════╝ */
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

/* ╔═══════════════════════════════════════════════════════════╗
   ║  SECTION 5 — PLAYER                                      ║
   ╚═══════════════════════════════════════════════════════════╝ */
const player = {
    x: 200, y: GROUND_Y - 64, w: 40, h: 64,
    vx: 0, vy: 0, onGround: false,
    facing: 1, walking: false, frame: 0, ft: 0
};

/* ╔═══════════════════════════════════════════════════════════╗
   ║  SECTION 6 — WORLD DATA                                  ║
   ╚═══════════════════════════════════════════════════════════╝ */

// Buildings (matched to interactables by position)
const buildings = [
    { x: 900,  asset: 'house1',    w: 128, h: 192 },
    { x: 1200, asset: 'house2',    w: 128, h: 192 },
    { x: 1500, asset: 'house3',    w: 128, h: 192 },
    { x: 2200, asset: 'castle',    w: 320, h: 256 },
    { x: 2700, asset: 'barracks',  w: 192, h: 256 },
    { x: 3200, asset: 'tower',     w: 128, h: 256 },
    { x: 3600, asset: 'archery',   w: 192, h: 256 },
    { x: 3950, asset: 'monastery', w: 192, h: 320 },
];

// Trees (scattered, randomly assigned tree1-4)
const trees = [];
const treePositions = [60, 450, 750, 1050, 1400, 1750, 2000, 2550, 3000, 3500, 4400, 4800, 5200];
for (const tx of treePositions) {
    trees.push({
        x: tx + Math.random() * 30,
        asset: 'tree' + (Math.floor(Math.random() * 4) + 1),
        frame: Math.floor(Math.random() * 8),
        timer: Math.floor(Math.random() * 10),
        depth: Math.random() > 0.3 ? 1.0 : 0.5,
    });
}

// Bushes
const bushes = [];
for (let bx = 100; bx < WORLD_W; bx += 200 + Math.random() * 300) {
    bushes.push({
        x: bx + Math.random() * 40,
        asset: 'bush' + (Math.floor(Math.random() * 4) + 1),
        frame: Math.floor(Math.random() * 8),
        timer: Math.floor(Math.random() * 10),
    });
}

// Rocks
const rocks = [];
for (let rx = 300; rx < WORLD_W; rx += 400 + Math.random() * 500) {
    rocks.push({
        x: rx + Math.random() * 50,
        asset: 'rock' + (Math.floor(Math.random() * 4) + 1),
    });
}

// Clouds (parallax background)
const clouds = [];
for (let i = 0; i < 8; i++) {
    clouds.push({
        x: Math.random() * WORLD_W,
        y: 60 + Math.random() * 180,
        asset: 'cloud' + (Math.floor(Math.random() * 3) + 1),
        spd: 0.08 + Math.random() * 0.12,
        scale: 0.3 + Math.random() * 0.3,
    });
}

// Gold stones (near Projects zone)
const goldStones = [];
for (let gx = 2000; gx < 4200; gx += 350 + Math.random() * 200) {
    goldStones.push({ x: gx + Math.random() * 80 });
}

// Sheep (easter egg in About zone)
const sheep = { x: 1100, frame: 0, timer: 0 };

// Zones
const zones = [
    { name: 'SPAWN', start: 0, end: 750 },
    { name: 'ABOUT', start: 750, end: 1800 },
    { name: 'PROJECTS', start: 1800, end: 4200 },
    { name: 'CONTACT', start: 4200, end: WORLD_W },
];

/* ╔═══════════════════════════════════════════════════════════╗
   ║  SECTION 7 — INTERACTABLES + CONTENT                     ║
   ╚═══════════════════════════════════════════════════════════╝ */
const interactables = [
    { x:350, y:GROUND_Y-60, w:60, h:60, type:'sign', label:'?',
      content:`<h2>Welcome!</h2><p>Walk right to explore my portfolio.</p><p>I'm <strong>Amritanshu Kumar</strong> — a Game Engineer who ships end-to-end.</p><p style="color:#eec941">5M+ Downloads • 14K+ Players • 62K+ Matches • 3+ Years</p>` },
    { x:900, y:GROUND_Y-192, w:128, h:192, type:'building', label:'BIO',
      content:`<h2>About Me</h2><p>Client, server, API, and deployment pipeline — I build across the complete stack. Currently leading a production multiplayer game from Unity client through TypeScript game server to cloud deployment.</p><p>Built a game engine in C++ from first principles. Shipped titles with over <strong style="color:#eec941">5M downloads</strong>.</p><p><strong>Current:</strong> Team Lead at RootHoot Pvt Ltd (Remote)</p><p><strong>Previous:</strong> Game Developer at DeftSoft</p>` },
    { x:1200, y:GROUND_Y-192, w:128, h:192, type:'building', label:'SKILLS',
      content:`<h2>What I Do</h2><p><strong style="color:#eec941">01 — Full-Stack Game Dev</strong><br>Unity client to backend to deployment.</p><br><p><strong style="color:#eec941">02 — Backend & Multiplayer</strong><br>Node.js, Socket.IO, Express, MongoDB, Docker.</p><br><p><strong style="color:#eec941">03 — Engine & Systems</strong><br>C++ engine dev, ECS, reusable Unity frameworks.</p>` },
    { x:1500, y:GROUND_Y-192, w:128, h:192, type:'building', label:'TECH',
      content:`<h2>Tech Stack</h2><div class="popup-tags"><span class="t-lang">C#</span><span class="t-lang">TypeScript</span><span class="t-lang">C++</span><span class="t-lang">Go</span><span class="t-lang">Python</span><span class="t-engine">Unity</span><span class="t-engine">Unreal</span><span class="t-infra">Node.js</span><span class="t-infra">Express</span><span class="t-infra">MongoDB</span><span class="t-infra">Redis</span><span class="t-infra">Socket.IO</span><span class="t-devops">Docker</span><span class="t-devops">Cloud Run</span><span class="t-devops">GitHub Actions</span></div>` },
    { x:2200, y:GROUND_Y-256, w:320, h:256, type:'building', label:'PONGZ',
      content:`<span class="popup-badge">FLAGSHIP — EARLY ACCESS</span><h2>Pongz</h2><p class="popup-metrics">14K+ Players • 2,800+ DAU • 62K+ Matches</p><p>Production multiplayer Mahjong game. Unity 6 client, TypeScript/Socket.IO game server, Express/MongoDB REST API. Docker on Cloud Run.</p><ul><li>Ranked matchmaking with 34-tier skill rating</li><li>7,400+ ranked players competing</li><li>AFK detection with bot stand-ins</li><li>CI/CD: GitHub Actions → Docker → Cloud Run</li></ul><div class="popup-pills"><span>Unity 6</span><span>TypeScript</span><span>Socket.IO</span><span>Express</span><span>MongoDB</span><span>Docker</span></div>` },
    { x:2700, y:GROUND_Y-256, w:192, h:256, type:'building', label:'ALNAHSHA',
      content:`<h2>Alnahsha Run</h2><p class="popup-metrics">5M+ Downloads • 4.6 Stars</p><p>Endless runner reaching 5M+ downloads on Google Play. Improved engagement 30% through player-driven iteration.</p><div class="popup-pills"><span>Unity</span><span>C#</span><span>Google Play</span></div><a href="https://play.google.com/store/apps/details?id=com.moderndoctors.alnahsharun" target="_blank" class="popup-link">Play Store →</a>` },
    { x:3200, y:GROUND_Y-256, w:128, h:256, type:'building', label:'ENGINE',
      content:`<h2>Nimirta Engine</h2><p class="popup-metrics">C++ from first principles</p><p>Custom 2D game engine in C++/SFML. Physics simulation, ECS architecture, AI opponents across 3 difficulty levels.</p><div class="popup-pills"><span>C++</span><span>SFML</span><span>ECS</span><span>Physics</span></div>` },
    { x:3600, y:GROUND_Y-256, w:192, h:256, type:'building', label:'RECURVE',
      content:`<h2>Recurve 28</h2><p>Hardware-integrated archery game — camera, Arduino, projector with OpenCV for real-time arrow detection.</p><div class="popup-pills"><span>Unity</span><span>OpenCV</span><span>Arduino</span></div>` },
    { x:3950, y:GROUND_Y-320, w:192, h:320, type:'building', label:'SYSTEMS',
      content:`<h2>Unity Systems</h2><p>8 reusable engine systems: UI, Event Bus, State Machine, Logging, Save, Pause, Popup, Loading.</p><div class="popup-pills"><span>C#</span><span>Unity</span><span>Patterns</span></div>` },
    { x:4500, y:GROUND_Y-80, w:60, h:80, type:'contact', label:'MAIL',
      content:`<h2>Let's Talk</h2><p>Open to opportunities at studios that value ownership and shipping games people play.</p><div class="contact-grid"><a href="mailto:kamshu00@gmail.com" class="contact-card"><small>EMAIL</small><span>kamshu00@gmail.com</span></a><a href="https://www.linkedin.com/in/amritanshu-kumar-/" target="_blank" class="contact-card"><small>LINKEDIN</small><span>amritanshu-kumar</span></a><a href="tel:+917903734532" class="contact-card"><small>PHONE</small><span>+91 7903734532</span></a><a href="Amritanshu_Kumar_Resume.pdf" target="_blank" download class="contact-card"><small>RESUME</small><span>Download PDF ↓</span></a></div>` },
];

/* ╔═══════════════════════════════════════════════════════════╗
   ║  SECTION 8 — SPRITE HELPERS                              ║
   ╚═══════════════════════════════════════════════════════════╝ */
function drawFrame(img, frame, fw, fh, x, y, scale, flip) {
    ctx.save();
    const dw = fw * scale, dh = fh * scale;
    if (flip) {
        ctx.translate(x + dw, y);
        ctx.scale(-1, 1);
        x = 0; y = 0;
    }
    ctx.drawImage(img, frame * fw, 0, fw, fh, x, y, dw, dh);
    ctx.restore();
}

function drawStatic(img, x, y, scale) {
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}

/* ╔═══════════════════════════════════════════════════════════╗
   ║  SECTION 9 — UPDATE                                      ║
   ╚═══════════════════════════════════════════════════════════╝ */
function update() {
    if (state !== 'PLAYING') return;

    player.walking = false;
    if (keys.ArrowLeft || keys.KeyA) { player.vx = -MOVE_SPEED; player.facing = -1; player.walking = true; }
    else if (keys.ArrowRight || keys.KeyD) { player.vx = MOVE_SPEED; player.facing = 1; player.walking = true; }
    else { player.vx *= 0.8; if (Math.abs(player.vx) < 0.05) player.vx = 0; }

    player.vy += GRAVITY;
    player.x += player.vx;
    player.y += player.vy;
    player.x = Math.max(0, Math.min(WORLD_W - player.w, player.x));

    // Ground collision
    player.onGround = false;
    if (player.y + player.h >= GROUND_Y) {
        player.y = GROUND_Y - player.h;
        player.vy = 0;
        player.onGround = true;
    }

    // Camera
    const targetX = player.x - w / 2 + player.w / 2;
    camera.x += (targetX - camera.x) * 0.08;
    camera.x = Math.max(0, Math.min(WORLD_W - w, camera.x));

    // Walk anim
    if (player.walking && player.onGround) {
        player.ft++;
        if (player.ft > 6) { player.ft = 0; player.frame = (player.frame + 1) % 6; }
    } else {
        player.ft++;
        if (player.ft > 8) { player.ft = 0; player.frame = (player.frame + 1) % 8; }
    }

    // Animate trees
    for (const tr of trees) {
        tr.timer++;
        if (tr.timer >= 10) { tr.timer = 0; tr.frame = (tr.frame + 1) % 8; }
    }
    // Animate bushes
    for (const b of bushes) {
        b.timer++;
        if (b.timer >= 12) { b.timer = 0; b.frame = (b.frame + 1) % 8; }
    }
    // Animate sheep
    sheep.timer++;
    if (sheep.timer >= 10) { sheep.timer = 0; sheep.frame = (sheep.frame + 1) % 6; }

    // Zone
    const z = zones.find(z => player.x >= z.start && player.x < z.end);
    if (z && z.name !== currentZone) {
        currentZone = z.name;
        const el = document.getElementById('zoneIndicator');
        el.textContent = '// ' + z.name;
        el.classList.add('visible');
        clearTimeout(el._t);
        el._t = setTimeout(() => el.classList.remove('visible'), 2000);
    }

    // Info panel
    updatePanel();
}

/* ╔═══════════════════════════════════════════════════════════╗
   ║  SECTION 10 — RENDER                                     ║
   ╚═══════════════════════════════════════════════════════════╝ */
function render() {
    const gY = GROUND_Y + (h - WORLD_H);
    const ox = -camera.x;
    const t = Date.now() * 0.001;

    // 1. Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, gY);
    sky.addColorStop(0, '#4a90d9');
    sky.addColorStop(0.7, '#87CEEB');
    sky.addColorStop(1, '#b8e4f0');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, gY);

    // 2. Clouds (parallax 0.15)
    for (const c of clouds) {
        const cx = ((c.x + t * c.spd * 20) % (WORLD_W + 600)) - 300;
        const sx = cx - camera.x * 0.15;
        if (sx < -300 || sx > w + 300) continue;
        if (IMG[c.asset]) drawStatic(IMG[c.asset], sx, c.y + (h - WORLD_H) * 0.2, c.scale);
    }

    // 3. Background trees (parallax 0.5)
    for (const tr of trees) {
        if (tr.depth !== 0.5) continue;
        const tx = tr.x - camera.x * 0.5;
        if (tx < -200 || tx > w + 200) continue;
        if (IMG[tr.asset]) drawFrame(IMG[tr.asset], tr.frame, 192, 256, tx, gY - 200, 0.7, false);
    }

    // 4. Buildings (parallax 1.0, bottom-aligned to ground)
    for (const b of buildings) {
        const bx = b.x + ox;
        if (bx < -b.w - 20 || bx > w + 20) continue;
        if (IMG[b.asset]) drawStatic(IMG[b.asset], bx, gY - b.h, 1.0);
    }

    // 5. Foreground trees (parallax 1.0)
    for (const tr of trees) {
        if (tr.depth !== 1.0) continue;
        const tx = tr.x + ox;
        if (tx < -200 || tx > w + 200) continue;
        if (IMG[tr.asset]) drawFrame(IMG[tr.asset], tr.frame, 192, 256, tx, gY - 230, 0.9, false);
    }

    // 6. Ground
    ctx.fillStyle = '#5a9a42';
    ctx.fillRect(0, gY, w, h - gY);
    // Grass edge using tilemap (draw repeating grass top tiles)
    if (IMG.tilemap) {
        for (let gx = -(camera.x % 64); gx < w + 64; gx += 64) {
            ctx.drawImage(IMG.tilemap, 64, 0, 64, 64, gx, gY - 16, 64, 64);
        }
    }
    // Stone layer below
    ctx.fillStyle = '#4a7a6a';
    ctx.fillRect(0, gY + 48, w, h - gY);

    // 7. Near decorations
    // Gold stones
    for (const gs of goldStones) {
        const gsx = gs.x + ox;
        if (gsx < -64 || gsx > w + 64) continue;
        if (IMG.gold1) drawStatic(IMG.gold1, gsx, gY - 40, 0.5);
    }
    // Bushes
    for (const b of bushes) {
        const bx = b.x + ox;
        if (bx < -128 || bx > w + 128) continue;
        if (IMG[b.asset]) drawFrame(IMG[b.asset], b.frame, 128, 128, bx, gY - 80, 0.7, false);
    }
    // Rocks
    for (const r of rocks) {
        const rx = r.x + ox;
        if (rx < -64 || rx > w + 64) continue;
        if (IMG[r.asset]) drawStatic(IMG[r.asset], rx, gY - 30, 0.6);
    }
    // Sheep
    if (IMG.sheep) {
        const sx = sheep.x + ox;
        if (sx > -128 && sx < w + 128) {
            drawFrame(IMG.sheep, sheep.frame, 128, 128, sx, gY - 70, 0.6, false);
        }
    }

    // 8. Player
    drawPlayer(player.x + ox, player.y + (h - WORLD_H), t);

    // 9. Proximity indicators (bouncing arrows above interactables)
    for (const obj of interactables) {
        const ix = obj.x + ox;
        if (ix < -80 || ix > w + 80) continue;
        const near = Math.abs(player.x + player.w / 2 - (obj.x + obj.w / 2)) < obj.w / 2 + 30 &&
                     player.y + player.h > obj.y - 20 && player.y < obj.y + obj.h + 20;
        if (near && state === 'PLAYING') {
            const cx = ix + obj.w / 2;
            const iy = obj.y + (h - WORLD_H);
            const b = Math.sin(t * 4) * 4;
            ctx.fillStyle = '#eec941';
            ctx.beginPath();
            ctx.moveTo(cx - 6, iy - 16 + b);
            ctx.lineTo(cx + 6, iy - 16 + b);
            ctx.lineTo(cx, iy - 8 + b);
            ctx.closePath();
            ctx.fill();
        }
    }

    // Arrow hint at start
    if (player.x < 180 && state === 'PLAYING') {
        const px = player.x + ox;
        const py = player.y + (h - WORLD_H);
        ctx.font = "400 10px 'Press Start 2P',monospace";
        ctx.fillStyle = '#eec941';
        ctx.globalAlpha = 0.4;
        ctx.textAlign = 'center';
        ctx.fillText('→→→', px + 70 + Math.sin(t * 3) * 5, py + player.h / 2);
        ctx.globalAlpha = 1;
    }
}

/* ╔═══════════════════════════════════════════════════════════╗
   ║  SECTION 11 — DRAW PLAYER                                ║
   ╚═══════════════════════════════════════════════════════════╝ */
function drawPlayer(screenX, screenY) {
    const img = player.walking ? IMG.warrior_run : IMG.warrior_idle;
    if (!img) return;
    const scale = 0.4;
    const flip = player.facing === -1;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(screenX + player.w / 2, screenY + player.h, 16, 4, 0, 0, 6.28);
    ctx.fill();

    // Sprite (offset to center 77px sprite over 40x64 collision box)
    drawFrame(img, player.frame, 192, 192, screenX - 18, screenY - 13, scale, flip);
}

/* ╔═══════════════════════════════════════════════════════════╗
   ║  SECTION 12 — INFO PANEL (proximity auto-show)           ║
   ╚═══════════════════════════════════════════════════════════╝ */
const infoPanel = document.getElementById('infoPanel');
const infoPanelInner = document.getElementById('infoPanelInner');
let activeObj = null;

function updatePanel() {
    let nearest = null, dist = 999;
    for (const obj of interactables) {
        const dx = Math.abs(player.x + player.w / 2 - (obj.x + obj.w / 2));
        const vy = player.y + player.h > obj.y - 20 && player.y < obj.y + obj.h + 20;
        if (dx < obj.w / 2 + 30 && vy && dx < dist) { nearest = obj; dist = dx; }
    }
    if (nearest && nearest !== activeObj) { activeObj = nearest; infoPanelInner.innerHTML = nearest.content; }
    if (nearest) infoPanel.classList.add('visible');
    else { infoPanel.classList.remove('visible'); activeObj = null; }
}

/* ╔═══════════════════════════════════════════════════════════╗
   ║  SECTION 13 — GAME LOOP                                  ║
   ╚═══════════════════════════════════════════════════════════╝ */
let gameActive = true;
const heroObs = new IntersectionObserver(([e]) => {
    // pause when not visible (tab switch etc)
}, { threshold: 0.1 });

function loop() {
    update();
    render();
    requestAnimationFrame(loop);
}
loop();

loadAssets().catch(err => {
    console.error(err);
    const btn = document.getElementById('introStart');
    btn.textContent = 'Load failed — Download Resume';
    btn.disabled = false;
    btn.onclick = () => window.open('Amritanshu_Kumar_Resume.pdf');
});

})();
