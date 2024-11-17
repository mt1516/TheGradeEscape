"use client";

import Level from "@/app/ui/game-level/level";
import Close from "@/app/ui/button";

export default function Page() {
    return (
        <div className='contianer flex flex-row justify-center items-center h-screen w-screen'>
            <div className="container flex flex-col bg-gray-50 rounded-lg shadow-lg h-2/3">
                <div className="container flex flex-row">
                    <Close />
                        <h1 className="text-7xl font-bold text-black w-full text-center justify-self-center">Course Syllabus</h1>
                </div>
                <Level />
            </div>
        </div>
    );
}