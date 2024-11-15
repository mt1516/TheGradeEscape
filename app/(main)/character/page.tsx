export default function CharacterPage() {
    return (
        <div className="container mx-auto py-8 flex flex-col items-center">
            <div className="character-selection flex flex-wrap justify-center gap-4">
                <div className="character bg-gray-100 rounded-md shadow-md p-4 flex flex-col items-center gap-2">
                    <div className="buff-details text-green-500 font-bold text-2xl">+</div>
                    <div className="character-icon text-3xl">🟢</div>
                    <div className="debuff-details text-red-500 font-bold text-2xl">-</div>
                </div>
                <div className="character bg-gray-100 rounded-md shadow-md p-4 flex flex-col items-center gap-2">
                    <div className="buff-details text-green-500 font-bold text-2xl">+</div>
                    <div className="character-icon text-3xl">🔵</div>
                    <div className="debuff-details text-red-500 font-bold text-2xl">-</div>
                </div>
                <div className="character bg-gray-100 rounded-md shadow-md p-4 flex flex-col items-center gap-2">
                    <div className="buff-details text-green-500 font-bold text-2xl">+</div>
                    <div className="character-icon text-3xl">🟠</div>
                    <div className="debuff-details text-red-500 font-bold text-2xl">-</div>
                </div>
            </div>
            <div className="as-guy font-bold text-2xl mt-8">As Guy</div>
        </div>
    );
};
