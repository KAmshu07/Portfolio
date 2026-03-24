/* Portfolio content for each interactable building */
export const interactables = [
    {
        label: 'BIO',
        content: `<h2>The Short Version</h2>
<p>Most engineers pick a layer and stay there. Client or server. Engine or tools. Amritanshu builds across all of them \u2014 and leads teams that do the same.</p>
<p>Currently <strong class="highlight">Team Lead</strong> at RootHoot, running a production multiplayer game from Unity client through TypeScript game server to cloud deployment. Previously shipped a title to <strong class="highlight">5 million downloads</strong> at DeftSoft.</p>
<p>The castle to the east tells the full story of Pongz. The tower shows what happens when you start from absolute zero in C++.</p>
<p><strong>Current:</strong> Team Lead \u2014 RootHoot Pvt Ltd (Remote)<br><strong>Previous:</strong> Game Developer \u2014 DeftSoft</p>`,
    },
    {
        label: 'SKILLS',
        content: `<h2>Three Disciplines, One Engineer</h2>
<p><strong class="highlight">01 \u2014 Full-Stack Game Dev</strong><br>Client to server to deployment. The castle (Pongz) is the proof \u2014 14K players on infrastructure he built end-to-end.</p><br>
<p><strong class="highlight">02 \u2014 Backend & Multiplayer</strong><br>Node.js, Socket.IO, Express, MongoDB, Docker. Real-time systems that handle 2,800 daily players without flinching.</p><br>
<p><strong class="highlight">03 \u2014 Engine & Systems</strong><br>C++ engine from first principles. 8 reusable Unity systems. An open-source UI framework. The monastery has the full collection.</p>`,
    },
    {
        label: 'TECH',
        content: `<h2>The Arsenal</h2>
<p style="font-size:10px;color:#8a6a30;margin-bottom:10px;">Every tool here was used in production. No hello world entries.</p>
<div class="popup-tags">
    <span class="t-lang">C#</span><span class="t-lang">TypeScript</span>
    <span class="t-lang">C++</span><span class="t-lang">Go</span>
    <span class="t-lang">Python</span><span class="t-engine">Unity</span>
    <span class="t-engine">Unreal</span><span class="t-infra">Node.js</span>
    <span class="t-infra">Express</span><span class="t-infra">MongoDB</span>
    <span class="t-infra">Redis</span><span class="t-infra">Socket.IO</span>
    <span class="t-devops">Docker</span><span class="t-devops">Cloud Run</span>
    <span class="t-devops">GitHub Actions</span>
</div>
<p style="font-size:10px;color:#6a5a4a;margin-top:10px;">C# and TypeScript power the castle. C++ built the engine tower. The forge runs on Roslyn and MonoMod. Follow the wind east to see them in action.</p>`,
    },
    {
        label: 'PONGZ',
        content: `<span class="popup-badge">FLAGSHIP \u2014 EARLY ACCESS</span>
<h2>14,000 Players and Counting</h2>
<p>This is the full picture. Unity client. TypeScript game server. Express REST API. MongoDB. Docker on Cloud Run. One engineer led the stack, wrote 55% of the code, and manages a team of seven.</p>
<p class="popup-metrics">14K+ Players &bull; 2,800+ DAU &bull; 62K+ Matches</p>
<ul>
    <li>Socket framework with reconnection \u2014 the same architecture powering the forge's hot reload pipeline</li>
    <li>34-tier ranked matchmaking \u2014 7,400+ ranked players competing</li>
    <li>AFK detection with bot stand-ins \u2014 no idle hands in this kingdom</li>
    <li>The 8 reusable systems in the monastery? Built for this project, then extracted for everyone.</li>
</ul>
<div class="popup-pills"><span>Unity 6</span><span>TypeScript</span><span>Socket.IO</span><span>Express</span><span>MongoDB</span><span>Docker</span></div>
<div class="popup-links">
    <a href="https://play.google.com/store/apps/details?id=com.pixelstackstudios.pongz" target="_blank" class="popup-link">Play Store &rarr;</a>
    <a href="https://apps.apple.com/in/app/pongz-sg-mahjong/id6755418562" target="_blank" class="popup-link">App Store &rarr;</a>
</div>`,
    },
    {
        label: 'ALNAHSHA',
        content: `<h2>Five Million Downloads</h2>
<p>Before leading a team, before building servers and engines \u2014 there was this. An endless runner that reached <strong class="highlight">5M+ downloads</strong> and <strong class="highlight">4.6 stars</strong> on Google Play.</p>
<p>This is where the engineering discipline started. Player-driven iteration improved engagement 30%. The skills that scaled Pongz to 14K players? They were forged here.</p>
<p>The lessons from this project became a <strong class="highlight">25-chapter technical course</strong> on game architecture \u2014 not a tutorial, a textbook.</p>
<div class="popup-pills"><span>Unity</span><span>C#</span><span>Google Play</span></div>
<div class="popup-links">
    <a href="https://play.google.com/store/apps/details?id=com.moderndoctors.alnahsharun" target="_blank" class="popup-link">Play Store &rarr;</a>
    <a href="https://apps.apple.com/in/app/\u0627\u0644\u0646\u062d\u0634\u0629-run/id1473582650" target="_blank" class="popup-link">App Store &rarr;</a>
    <a href="https://nimritagames.com/Infinite_Runners/" target="_blank" class="popup-link">Runner Course &rarr;</a>
</div>`,
    },
    {
        label: 'ENGINE',
        content: `<h2>Starting from Absolute Zero</h2>
<p>No Unity. No Unreal. No framework. Just C++, SFML, and the question: <em>what actually happens between your code and the screen?</em></p>
<p>Custom 2D game engine built from first principles. Physics simulation. ECS architecture. AI opponents across 3 difficulty levels.</p>
<p>This is the project that makes the InstaReload forge make sense \u2014 you don't build an IL-level hot reload tool unless you understand engines at the metal.</p>
<div class="popup-pills"><span>C++</span><span>SFML</span><span>ECS</span><span>Physics</span></div>
<a href="https://github.com/nimritagames/NimirtaEngine" target="_blank" class="popup-link">GitHub &rarr;</a>`,
    },
    {
        label: 'RECURVE',
        content: `<h2>When Software Meets the Physical World</h2>
<p>A real bow. A real arrow. A camera, an Arduino, and a projector. OpenCV tracks the arrow in real-time. Unity renders the target. The player shoots for real.</p>
<p>Most game engineers never leave the screen. This project crossed into hardware integration \u2014 the same problem-solving instinct that built a C++ engine and a 7ms hot reload tool, applied to physical computing.</p>
<div class="popup-pills"><span>Unity</span><span>OpenCV</span><span>Arduino</span></div>`,
    },
    {
        label: 'SYSTEMS',
        content: `<h2>Building Once, Shipping Everywhere</h2>
<p>One project is a feat. Repeating it is a system. These are the tools that make the next project faster than the last.</p>
<p><strong class="highlight">8 Reusable Unity Systems</strong><br>UI, Event Bus, State Machine, Logging, Save, Pause, Popup, Loading. Built for Pongz, extracted for the team, now powering multiple projects.</p>
<p><strong class="highlight">FlowUI</strong> \u2014 Open-source Unity UI framework. MIT licensed, full documentation site. The kind of tool you build when you're tired of solving the same problem twice.</p>
<div class="popup-pills"><span>C#</span><span>Unity</span><span>Open Source</span></div>
<div class="popup-links">
    <a href="https://github.com/nimritagames/Unity-FlowUI" target="_blank" class="popup-link">FlowUI GitHub &rarr;</a>
    <a href="https://nimritagames.com/flowui/" target="_blank" class="popup-link">FlowUI Docs &rarr;</a>
</div>`,
    },
    {
        label: 'INSTA_RELOAD',
        content: `<h2>7 Milliseconds</h2>
<p class="popup-metrics">100x Faster Than Unity's Default</p>
<p>Unity's domain reload takes 3-5 seconds and destroys all game state. The answer: a 5-stage IL pipeline that patches running code without Unity knowing.</p>
<p>Detect &rarr; Analyze &rarr; Compile (Roslyn) &rarr; Patch (MonoMod) &rarr; Dispatch.</p>
<ul>
    <li>Dual compilation: Debug path (7ms) vs Release path (700ms)</li>
    <li>IL-level method patching via MonoMod runtime detours</li>
    <li>Blocks Unity's compilation pipeline to prevent race conditions</li>
</ul>
<p>The C++ engine tower shows <em>why</em> this person thinks at the engine level. Press <strong>[F]</strong> to read the full development story \u2014 three failed attempts before the breakthrough.</p>
<div class="popup-pills"><span>C#</span><span>Roslyn</span><span>MonoMod</span><span>Mono.Cecil</span><span>IL Patching</span></div>
<a href="https://github.com/nimritagames/Insta_Reload" target="_blank" class="popup-link">GitHub &rarr;</a>`,
    },
    {
        label: 'CONTACT',
        content: `<h2>You've Seen the Kingdom</h2>
<p>14,000 players. 5 million downloads. A game engine from scratch. A hot reload tool that beats Unity at its own game. 8 reusable systems, an open-source framework, and a 25-chapter course.</p>
<p><strong class="highlight">One engineer. Three years.</strong></p>
<p>The question was how one person builds all of this. Now you know. The next question is: what could he build with your team?</p>
<div class="contact-grid">
    <a href="mailto:kamshu00@gmail.com" class="contact-card"><small>EMAIL</small><span>kamshu00@gmail.com</span></a>
    <a href="https://www.linkedin.com/in/amritanshu-kumar-/" target="_blank" class="contact-card"><small>LINKEDIN</small><span>amritanshu-kumar</span></a>
    <a href="https://github.com/KAmshu07" target="_blank" class="contact-card"><small>GITHUB</small><span>KAmshu07</span></a>
    <a href="tel:+917903734532" class="contact-card"><small>PHONE</small><span>+91 7903734532</span></a>
    <a href="Amritanshu_Kumar_Resume.pdf" target="_blank" download class="contact-card"><small>RESUME</small><span>Download PDF &darr; <span style="font-size:9px;color:#9a8a7a;margin-left:8px">[E] view here</span></span></a>
</div>`,
    },
];
