"use client";

import Level from "@/app/ui/game-level/level";
import Close from "@/app/ui/button";
import { getCurrentGrade } from "@/app/game/storage";

export default function Page() {
    const currentGrade = getCurrentGrade();
    const getBackgroundColor = (grade: string) => {
        switch (grade) {
            case 'A+':
            case 'A':
            case 'A-':
                return 'rgba(145,255,174,0.8)'
            case 'B+':
            case 'B':
            case 'B-':
                return 'rgba(255,255,174,0.5)'
            case 'C+':
            case 'C':
            case 'C-':
                return 'rgba(255,174,174,0.8)'
           case 'D':
                return 'rgba(255,174,174,0.8)'
           case 'F':
                return 'rgba(255,100,98,0.7)'
        }
    };
    const bgColor = getBackgroundColor(currentGrade);
    return (
        <div className='flex flex-row justify-center items-center h-screen w-screen'>
            <div className="container flex flex-col bg-gray-50 rounded-lg shadow-lg h-5/6 p-10">
                <div className="container flex flex-row">
                    <Close />
                    <h1 className='text-7xl font-bold text-black w-full text-center justify-self-center'>Course Syllabus</h1>
                    <div className='rounded-full' style={{ backgroundColor: bgColor,  position: 'absolute', top: '15%', right: '11.2%', width: '11%', height: 'fit-content', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                        <div className='text-black text-2xl'>Current Grade: {currentGrade}</div>
                    </div>
                </div>
                <Level />
            </div>
        </div>
    );
}