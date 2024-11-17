"use client";

import Level from "@/app/ui/game-level/level";
import Close from "@/app/ui/button";

export default function Page() {
    return (
        <div className='flex flex-row justify-center items-center h-screen'>
            <div className="bg-gray-50 rounded-lg shadow-lg w-8/12 h-4/6">
                <Close />
                <div className="text-7xl font-bold text-black justify-self-center w-fit">Course Syllabus</div>
                <Level />
            </div>
        </div>
    );
}