/* Achievement definitions — declarative, no logic */
export const achievementDefs = [
    {
        id: 'archives',
        title: 'Origin Story',
        desc: 'Discover who Amritanshu is',
        type: 'visitAll',
        buildings: ['BIO', 'SKILLS', 'TECH'],
    },
    {
        id: 'castle',
        title: 'The Flagship',
        desc: 'See Pongz \u2014 14K players and counting',
        type: 'visit',
        building: 'PONGZ',
    },
    {
        id: 'workshop',
        title: 'The Proving Grounds',
        desc: 'Explore 3+ projects',
        type: 'visitCount',
        buildings: ['PONGZ', 'ALNAHSHA', 'ENGINE', 'RECURVE', 'SYSTEMS', 'INSTA_RELOAD'],
        count: 3,
    },
    {
        id: 'contact',
        title: 'The Crossing',
        desc: 'Find the way forward',
        type: 'visit',
        building: 'CONTACT',
    },
    {
        id: 'explorer',
        title: 'Kingdom Complete',
        desc: 'Every chapter discovered',
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
        title: 'The Full Record',
        desc: 'Read the resume scroll',
        type: 'flag',
        flag: 'scrollOpened',
    },
];
