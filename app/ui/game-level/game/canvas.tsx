import * as THREE from 'three';
import { useState, useEffect, useRef } from "react";
import Game, { Mode, Difficulty } from '@/app/game/game';

export default function Canvas(props: {
    mode: Mode;
    difficulty: Difficulty;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const gameRef = useRef<Game | null>(null);

    const scene = new THREE.Scene();
    // const background = new THREE.TextureLoader().load("/texture/hkust.jpg");
    // scene.background = background;
    const camera = new THREE.OrthographicCamera();
    const sceneRender = new THREE.WebGLRenderer();
    sceneRender.setClearColor(0x000000);
    sceneRender.setClearAlpha(0);

    const [playerHealth, setPlayerHealth] = useState(100);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sceneRender.setSize(window.innerWidth / 2, window.innerHeight);
            containerRef.current?.appendChild(sceneRender.domElement);
            const game: Game = new Game(scene, camera, sceneRender, props.mode, props.difficulty);
            gameRef.current = game;
            game.run();

            const unsubscribe = game.subscribeToPlayerHealthChange((health) => {
                setPlayerHealth(health);
                console.log("player health = ", health);
            });
            return () => {
                unsubscribe();
                scene.clear();
                containerRef.current?.removeChild(sceneRender.domElement);
                sceneRender.dispose();
                camera.clear();
            }
        }
    }, []);
    return (
        <div className="flex flex-row w-full h-screen bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: 'url("/texture/hkust.jpg")',
            }}
        >
            <div className="flex flex-row justify-start items-center w-8/12 h-full"
                ref={containerRef}
            >
            </div>
            <div className="flex flex-row justify-end w-4/12 h-full">
            {/* <div className="flex justify-content-end"> */}
                <div className="bg-white border-1 border-black p-10 mr-20">
                    <h3>Level Specified Information</h3>
                    <div className="grid grid-cols-2">
                    {`// style="display: grid; grid-template-columns: auto 1fr; grid-gap: 10px;"`}
                        <div>Gamemode:</div>
                        <div>Difficulty:</div>
                        <div>Restriction:</div>
                        <div>Player Status:</div>
                        <div>Deadline:</div>
                    </div>
                </div>
            </div>
            {/* </div> */}
        </div>
    );
}