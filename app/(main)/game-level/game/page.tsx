"use client";

import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import Canvas from "@/app/ui/game-level/game/canvas";
import { Mode, Difficulty } from "@/app/game/game";

export default function Page() {
    const searchParams: ReadonlyURLSearchParams = useSearchParams()
    const mode: Mode = (searchParams.get("mode") as Mode) ?? "null";
    const difficulty: Difficulty = (searchParams.get("difficulty") as Difficulty) ?? "null";
    // TODO: Add error.tsx to handle error
    // TODO: Add loading.tsx to handle strange laoding time
    return (
        // TODO: Add side menu for displaying game-level info
        <div className="flex justify-center items-center h-screen">
            <Canvas mode={mode} difficulty={difficulty} />
        </div>
    );
}