'use client';

import Link from 'next/link';
import { getCurrentGrade, initStorage } from '@/app/game/storage';
import { useState, useEffect } from 'react';

export default function Home() {
  const [currentGrade, setCurrentGrade] = useState('Z');
  useEffect(() => {
    setCurrentGrade(getCurrentGrade());
  });
  if (currentGrade === 'X') {
    initStorage();
  }
  return (
    <div className='contianer flex flex-row justify-center items-center h-screen w-screen'>
      <div className="container flex flex-col bg-gray-50 rounded-lg shadow-lg h-5/6 p-10">
        <h1 className="container text-7xl font-bold text-center h-1/6 animate-[title_0.7s_linear_infinite] text-black">The Grade Escape</h1>
        <div className="container flex flex-col h-5/6 w-full justify-center">
          <div className="container flex flex-col h-5/6 w-1/2 justify-self-start items-center">
            <div className="grid grid-rows-4 gap-12 w-1/2 h-full justify-center">
              <div className="container h-4/5 w-52 flex flex-row justify-center">
                <Link
                  className="w-full h-full font-bold rounded text-center content-center text-2xl bg-green-500 hover:bg-green-600 text-white "
                  href="/game-level">
                  Hell Start
                </Link>
              </div>
              <div className="container h-4/5 w-52 flex flex-row justify-center">
                <Link
                  className="w-full h-full font-bold rounded text-center content-center text-2xl bg-red-500 hover:bg-red-600 text-white"
                  href="/character">
                  Character
                </Link>
              </div>
              <div className="container h-4/5 w-52 flex flex-row justify-center">
                <Link
                  className="w-full h-full font-bold rounded text-center content-center text-2xl bg-blue-500 hover:bg-blue-600 text-white"
                  href="/credits">
                  Credits
                </Link>
              </div>
              <div className="container h-4/5 w-52 flex flex-row justify-center">
                <Link
                  className="w-full h-full font-bold rounded text-center content-center text-2xl bg-yellow-500 hover:bg-yellow-600 text-white"
                  href="/scoreboard">
                  Score Board
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}