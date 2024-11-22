export const characters = [
    {
        name: 'norm',
        buff: '-',
        debuff: '-',
    },
    {
        name: 'cs guy',
        buff: 'walk 50% faster',
        debuff: 'mind your steps...',
    },
    {
        name: 'business guy',
        buff: 'better version',
        debuff: '-'
    },
    {
        name: 'guy',
        buff: 'no buff',
        debuff: 'no debuff'
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
