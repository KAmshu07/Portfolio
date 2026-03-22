/* Achievement definitions — declarative, no logic */
export const achievementDefs = [
    {
        id: 'archives',
        title: 'The Archives',
        desc: 'Discover who Amritanshu is',
        type: 'visitAll',
        buildings: ['BIO', 'SKILLS', 'TECH'],
    },
    {
        id: 'castle',
        title: 'The Castle',
        desc: 'See the flagship project',
        type: 'visit',
        building: 'PONGZ',
    },
    {
        id: 'workshop',
        title: "The Engineer's Workshop",
        desc: 'Explore 3+ project buildings',
        type: 'visitCount',
        buildings: ['PONGZ', 'ALNAHSHA', 'ENGINE', 'RECURVE', 'SYSTEMS', 'INSTA_RELOAD'],
        count: 3,
    },
    {
        id: 'contact',
        title: 'First Contact',
        desc: 'Find the way to connect',
        type: 'visit',
        building: 'CONTACT',
    },
    {
        id: 'explorer',
        title: 'Kingdom Explorer',
        desc: 'Visit every building in the kingdom',
        type: 'visitAllBuildings',
    },
    {
        id: 'wind',
        title: 'Wind Walker',
        desc: 'Let the wind guide you',
        type: 'flag',
        flag: 'windUsed',
    },
    {
        id: 'scroll',
        title: 'The Scroll',
        desc: 'Read the resume scroll',
        type: 'flag',
        flag: 'scrollOpened',
    },
];
