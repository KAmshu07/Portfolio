/* NPC dialogue lines — keyed by NPC index matching WorldBuilder order */

/* Guide NPC (index 0) dialogue tiers — changes based on visitedBuildings.size */
export const guideDialogueTiers = {
    0: [
        'Welcome to the kingdom, traveler. Every building holds a chapter.',
        'Start with the Archives nearby. They hold the origin of all this.',
        'Press SPACE and follow the wind. It knows where to go.',
    ],
    1: [
        'You are beginning to see the picture. There is much more east of here.',
        'The castle holds the flagship — 14,000 players. Worth the walk.',
        'Every building connects to the others. Watch for the threads.',
    ],
    2: [
        'Halfway through the kingdom. The pattern is becoming clear.',
        'One engineer, everything from C++ to cloud deployment.',
        'The forge has a story worth reading. Press [F] when you are close.',
    ],
    3: [
        'Nearly everything explored. The Crossing lies to the south.',
        'You came in asking how one person builds all this. Getting clearer?',
        'When you are ready, the contact house has everything you need.',
    ],
    4: [
        'The full kingdom, explored. Not many make it this far.',
        'The question was how. Now you know the answer.',
        'The Crossing awaits. Amritanshu is ready to hear from you.',
    ],
};

export const npcDialogue = [
    // 0: Kingdom Ranger (Guide) — roams entire map, dialogue swapped at runtime
    guideDialogueTiers[0],
    // 1: Monk — monastery/archery/monument
    [
        'Eight systems. All reusable. The monastery holds them.',
        'FlowUI draws visitors from beyond the kingdom walls.',
    ],
    // 2: Woodcutter — trees, tech house
    [
        'Fifteen tools in the tech house. Every one battle-tested.',
        'C++ to Docker. Quite the range for one woodsman to guard.',
    ],
    // 3: Gold Carrier — monument to castle
    [
        'Gold flows from every match. Sixty-two thousand and counting.',
        'Seven builders at the castle. One leads the charge.',
    ],
    // 4: Shepherd — sheep area
    [
        'Peaceful here in the Archives. Good place to begin a journey.',
        'The wind will guide you when you are ready.',
    ],
    // 5: Border Guard (Black Lancer) — perimeter
    [
        'Docker on Cloud Run keeps the kingdom running.',
        'CI/CD pipelines never sleep. Neither does the border guard.',
    ],
    // 6: Miner — tower/barracks
    [
        'The tower was built from bedrock. C++ and SFML. Nothing borrowed.',
        'Five million downloads from the barracks. The mine never runs dry.',
    ],
    // 7: Gate Warrior — gate/path/tech house
    [
        'Sockets keep the gates open. Real-time, all the time.',
        'The path east leads to the proving grounds. Worth the march.',
    ],
    // 8: Lumberjack — projects district trees
    [
        'The forge heats in seven milliseconds. Blink and you miss it.',
        'Three failed attempts before the breakthrough. Persistence.',
    ],
    // 9: Builder — barracks/tower
    [
        'The barracks shipped five million. The tower was built from nothing.',
        'Same engineer, different problems. Both solved.',
    ],
    // 10: Castle Guard (Blue Warrior) — castle perimeter
    [
        'Twenty-eight hundred visitors every day. The castle thrives.',
        'Seven thousand ranked warriors in the tournament.',
    ],
];
