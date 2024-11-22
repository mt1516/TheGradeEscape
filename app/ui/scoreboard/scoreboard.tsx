"use client";

import { getScoreBoard, getCurrentScore, getCurrentGrade } from "@/app/game/storage";
import { useEffect, useState } from "react";

export default function Scoreboard() {
  const [scores, setScores] = useState<{ score: number; grade: string }[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [currentGrade, setCurrentGrade] = useState('F');

  useEffect(() => {
    setScores(getScoreBoard());
    setCurrentScore(getCurrentScore());
    setCurrentGrade(getCurrentGrade());
  }, []);
  return (
    <div className="grid grid-rows-12 border-2 border-black w-3/4 h-4/5 my-5 text-black">
      <div className="grid grid-cols-3">
        <div className="col-span-1 text-center font-bold">Top</div>
        <div className="col-span-1 text-center font-bold">Score</div>
        <div className="col-span-1 text-center font-bold">Grade</div>
      </div>
      {scores.map((s, i) => (
        <div key={i} className="grid grid-cols-3">
          <div className="col-span-1 text-center">{i + 1}</div>
          <div className="col-span-1 text-center">{s.score}</div>
          <div className="col-span-1 text-center">{s.grade}</div>
        </div>
      ))}
      <div className="grid grid-cols-3">
        <div className="col-span-1 text-center">Current</div>
        <div className="col-span-1 text-center">{currentScore}</div>
        <div className="col-span-1 text-center">{currentGrade}</div>
      </div>
    </div>
  );
}