'use client';

import Close from '@/app/ui/button';
import Choose from '@/app/ui/character/choose';
import { useEffect, useState } from 'react';
import { getCurrentCharacter, setCurrentCharacter } from '../(main-menu)/page';

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
        <div className='flex flex-row justify-center items-center h-screen'>
            <div className="bg-gray-50 rounded-lg shadow-lg w-8/12 h-4/6">
                <Close />
                <div className="text-7xl font-bold text-black justify-self-center w-fit">Character Selection</div>
                <Choose current={c}/>
            </div>
        </div>
    );
};
