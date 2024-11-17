var characters = [
    {
        className: 'container bg-red-500 w-32 h-4/6 rounded-md border-black border-2 shadow-md',
        name: 'norm',
        buff: '-',
        debuff: '-',
    },
    {
        className: "container bg-gray-500 w-32 h-4/6 rounded-md border-black border-2 shadow-md",
        name: 'cs guy',
        buff: 'walk 50% faster',
        debuff: 'mind your steps...',
    }, 
    {
        className: "container bg-green-500 w-32 h-4/6 rounded-md border-black border-2 shadow-md",
        name: 'business guy',
        buff: 'better version',
        debuff: '-'
    }
];

export default function Choose(props: {
    current: number;
}
) {
    return (
        <div className="flex flex-col w-full h-4/6 justify-center items-center">
            <div className="grid grid-cols-3 gap-10 h-full w-fit items-center">
                <div className={`${characters[(props.current - 1 + 3) % 3].className}`}>
                    {characters[(props.current - 1 + 3) % 3].name}
                </div>
                <div className={`${characters[props.current % 3].className}`}>
                    {characters[props.current % 3].name}
                </div>
                <div className={`${characters[(props.current +1) % 3].className}`}>
                    {characters[(props.current + 1) % 3].name}
                </div>
            </div>
            <div className="container mx-auto h-3/6 flex flex-col items-center">
                <div className="grid grid-cols-3 gap-10 h-full w-fit items-center justify-self-start">
                    <div className="container text-green-400 text-start text-xl w-40 h-4/6 rounded-md">
                        Buff: <br/>
                        {characters[props.current % 3].buff}
                    </div>
                    <div className="container text-black text-center text-3xl w-40 h-4/6 rounded-md">
                        ^
                    </div>
                    <div className="container text-red-500 text-start text-xl w-40 h-4/6 rounded-md">
                        Debuff: <br/>
                        {characters[props.current % 3].debuff}
                    </div>
                </div>
            </div>
        </div >
    );
}