'use client';

import React, { useState } from 'react';
import Confirm, { TYPE } from './popup';

export default function Buttons() {
    const [resetGamePopup, setResetGamePopup] = useState(false);
    const [resetScoreBoardPopup, setResetScoreBoardPopup] = useState(false);
    const [resetAllPopup, setResetAllPopup] = useState(false);
    const openResetGamePopup = () => {
        setResetGamePopup(true);
    }
    const openResetScoreBoardPopup = () => {
        setResetScoreBoardPopup(true);
    }
    const openResetAllPopup = () => {
        setResetAllPopup(true);
    }
    const closeResetGradePopup = () => {
        setResetGamePopup(false);
    }
    const closeResetScoreBoardPopup = () => {
        setResetScoreBoardPopup(false);
    }
    const closeResetAllPopup = () => {
        setResetAllPopup(false);
    }
    return (
        <div className="container flex flex-row w-3/4 h-1/5 justify-between my-5">
            {resetGamePopup && <Confirm type={TYPE.GAME} closePopup={closeResetGradePopup} />
            || resetScoreBoardPopup && <Confirm type={TYPE.BOARD} closePopup={closeResetScoreBoardPopup} />
            || resetAllPopup && <Confirm type={TYPE.ALL} closePopup={closeResetAllPopup} />}
            <button className="container h-1/2 w-1/5 text-center text-xl border-2 border-black rounded-sm bg-blue-700 hover:bg-blue-800 text-white"
                onClick={openResetGamePopup}>
                Reset Grade
            </button>
            <button className="container h-1/2 w-1/5 text-center text-xl border-2 border-black rounded-sm bg-yellow-500 hover:bg-yellow-600 text-white"
                onClick={openResetScoreBoardPopup}>
                Reset Score Board
            </button>
            <button className="container h-1/2 w-1/5 text-center text-xl border-2 border-black rounded-sm bg-red-500 hover:bg-red-600 text-white"
                onClick={openResetAllPopup}>
                Reset All
            </button>
        </div>
    );
}