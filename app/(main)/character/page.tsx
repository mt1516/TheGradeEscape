'use client';

import Close from '@/app/ui/button';
import Choose from '@/app/ui/character/choose';
import { useEffect, useState } from 'react';
import { getCurrentCharacter, setCurrentCharacter } from '@/app/game/storage';

export enum CHARACTER {
    NORM = 0,
    CS_GUY,
    BUSINESS_GUY,
}

export default function CharacterPage() {
    const [c, setCurrent] = useState(getCurrentCharacter());
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' || e.key === 'a') {
                setCurrent((c - 1 + 3) % 3); // Ensure positive index
            } else if (e.key === 'ArrowRight' || e.key === 'd') {
                setCurrent((c + 1) % 3);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            setCurrentCharacter(c);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [c]);

    return (
        <div className='contianer flex flex-row justify-center items-center h-screen w-screen'>
            <div className="container flex flex-col bg-gray-50 rounded-lg shadow-lg h-5/6 p-10">
                <div className="container flex flex-row">
                    <Close />
                    <h1 className="text-7xl font-bold text-black w-full text-center justify-self-center">Character Selection</h1>
                </div>

                <Choose current={c} />
            </div>
        </div>
    );
};
