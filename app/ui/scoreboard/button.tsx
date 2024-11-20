'use client';

import React, { useState } from 'react';
import Confirm, { TYPE } from './popup';

export default function Buttons() {
    const [gradePopup, setGradePopup] = useState(false);
    const [scoreBoardPopup, setScoreBoardPopup] = useState(false);
    const [gamePopup, setGamePopup] = useState(false);
    const openGradePopup = () => {
        setGradePopup(true);
    }
    const openScoreBoardPopup = () => {
        setScoreBoardPopup(true);
    }
    const openGamePopup = () => {
        setGamePopup(true);
    }
    const closeGradePopup = () => {
        setGradePopup(false);
    }
    const closeScoreBoardPopup = () => {
        setScoreBoardPopup(false);
    }
    const closeGamePopup = () => {
        setGamePopup(false);
    }
    return (
        <div className="container flex flex-row w-3/4 h-1/5 justify-between my-5">
            {gradePopup && <Confirm type={TYPE.GRADE} closePopup={closeGradePopup} />
            || scoreBoardPopup && <Confirm type={TYPE.BOARD} closePopup={closeScoreBoardPopup} />
            || gamePopup && <Confirm type={TYPE.GAME} closePopup={closeGamePopup} />}
            <button className="container h-1/2 w-1/5 text-center text-xl border-2 border-black rounded-sm bg-blue-700 hover:bg-blue-800 text-white"
                onClick={openGradePopup}>
                Reset Grade
            </button>
            <button className="container h-1/2 w-1/5 text-center text-xl border-2 border-black rounded-sm bg-yellow-500 hover:bg-yellow-600 text-white"
                onClick={openScoreBoardPopup}>
                Reset Score Board
            </button>
            <button className="container h-1/2 w-1/5 text-center text-xl border-2 border-black rounded-sm bg-red-500 hover:bg-red-600 text-white"
                onClick={openGamePopup}>
                Reset Entire Game
            </button>
        </div>
    );
}