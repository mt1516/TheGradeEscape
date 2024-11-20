"use client";

import { getScoreBoard } from "@/app/game/storage";
import { useEffect, useState } from "react";

export default function Scoreboard() {
  const [scores, setScores] = useState<{ score: number; grade: string }[]>([]);

  useEffect(() => {
    setScores(getScoreBoard());
  }, []);
  return (
    <div className="grid grid-rows-11 border-2 border-black w-3/4 h-4/5 my-5">
      <div className="grid grid-cols-3">
        <div className="col-span-1 text-center font-bold text-black">Top</div>
        <div className="col-span-1 text-center font-bold text-black">Score</div>
        <div className="col-span-1 text-center font-bold text-black">Grade</div>
      </div>
      {scores.map((s, i) => (
        <div key={i} className="grid grid-cols-3">
          <div className="col-span-1 text-center">{i + 1}</div>
          <div className="col-span-1 text-center">{s.score}</div>
          <div className="col-span-1 text-center">{s.grade}</div>
        </div>
      ))}
    </div>
  );
}