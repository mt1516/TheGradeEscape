"use client";

import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import Canvas from "@/app/ui/game-level/game/canvas";
import { Mode, Difficulty } from "@/app/game/game";
import Close from "@/app/ui/game-level/game/button";
import * as THREE from 'three';

export default function Page() {
    const searchParams: ReadonlyURLSearchParams = useSearchParams()
    const mode: Mode = (searchParams.get("mode") as Mode) ?? "null";
    const difficulty: Difficulty = (searchParams.get("difficulty") as Difficulty) ?? "null";
    const sceneRender = new THREE.WebGLRenderer();
    // TODO: Add error.tsx to handle error
    return (
        <>
            {/* <Close /> */}
            <div className="flex justify-center items-center h-screen">
                <Canvas mode={mode} difficulty={difficulty} sceneRender={sceneRender}/>
            </div>
        </>
    );
}