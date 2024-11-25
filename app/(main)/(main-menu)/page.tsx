'use client';

import { getCurrentGrade, initStorage } from '@/app/game/storage';
import { useState, useEffect } from 'react';
import Progress from '@/app/ui/progress';
import Buttons from '@/app/ui/main-menu/buttons';

export default function Home() {
  const [currentGrade, setCurrentGrade] = useState('Z');
  useEffect(() => {
    setCurrentGrade(getCurrentGrade());
  });
  if (currentGrade === 'X') {
    initStorage();
    window.location.reload();
  }
  return (
    <div className='flex flex-row justify-center items-center h-screen w-screen'>
      <div className="container flex flex-col bg-gray-50 rounded-lg shadow-lg h-5/6 p-10">
        <Progress />
        <h1 className="container text-7xl font-bold text-center h-1/6 animate-[title_0.7s_linear_infinite] text-black">The Grade Escape</h1>
        <div className="container flex flex-row h-5/6 w-full items-center">
          <Buttons />
          <div className="container flex flex-col h-5/6 w-2/3 justify-self-end items-center bg-cover bg-no-repeat"
            style={{ backgroundImage: 'url(/background/hkust.jpg)' }}>
          </div>
        </div>
      </div>
    </div>
  );
}