export const characters = [
    {
        name: 'Regular',
        buff: 'You\'re more NPC than a NPC',
        debuff: 'On the bright side, you\'re not a NPC',
        walkingSpeedMultiplier: 1,
        stepLimitMultiplier: 1,
        viewInDarkModeMultiplier: 1,
        timeLimitMultiplier: 1,
        extraHeart: 0,
        immunityPeriodMultiplier: 1,
    },
    {
        name: 'CS guy',
        buff: '"Dark mode": +10% visibility in dark mode',
        debuff: '"Just use AI": -5% time limit',
        walkingSpeedMultiplier: 1,
        stepLimitMultiplier: 1,
        viewInDarkModeMultiplier: 1.1,
        timeLimitMultiplier: 0.95,
        extraHeart: 0,
        immunityPeriodMultiplier: 1,
    },
    {
        name: 'Business guy',
        buff: '"I\'m busy": +10% walking speed',
        debuff: 'Look where you\'re going',
        walkingSpeedMultiplier: 1.1,
        stepLimitMultiplier: 1,
        viewInDarkModeMultiplier: 1,
        timeLimitMultiplier: 1,
        extraHeart: 0,
        immunityPeriodMultiplier: 1,
    },
    {
        name: 'Cat',
        buff: '"Nine lives": +1 extra heart',
        debuff: '"Cat nap": -50% immunity time',
        walkingSpeedMultiplier: 1,
        stepLimitMultiplier: 1,
        viewInDarkModeMultiplier: 1,
        timeLimitMultiplier: 1,
        extraHeart: 1,
        immunityPeriodMultiplier: 0.5,
    }
];

export const characterClassName = [
    {
        selected: 'container bg-red-500 w-full h-4/6 rounded-md border-yellow-400 border-8 shadow-md',
        unselected: 'container bg-red-500 w-full h-4/6 rounded-md border-black border-2 shadow-md',
    },
    {
        selected: "container bg-gray-500 w-full h-4/6 rounded-md border-yellow-400 border-8 shadow-md",
        unselected: "container bg-gray-500 w-full h-4/6 rounded-md border-black border-2 shadow-md",
    },
    {
        selected: "container bg-green-500 w-full h-4/6 rounded-md border-yellow-400 border-8 shadow-md",
        unselected: "container bg-green-500 w-full h-4/6 rounded-md border-black border-2 shadow-md",
    },
    {
        selected: "container bg-blue-500 w-full h-4/6 rounded-md border-yellow-400 border-8 shadow-md",
        unselected: "container bg-blue-500 w-full h-4/6 rounded-md border-black border-2 shadow-md",
    }
]

export const characterTotal = characters.length;
export const characterLayoutClassName = {
    3: 'grid grid-cols-4 gap-10 h-full w-full items-center',
    4: 'grid grid-cols-5 gap-10 h-full w-full items-center',
    5: 'grid grid-cols-6 gap-10 h-full w-full items-center',
};
