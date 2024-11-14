import * as THREE from 'three';
import { useState, useEffect, useRef } from "react";
import Game, { Mode, Difficulty, Mode2Name } from '@/app/game/game';

export default function Canvas(props: {
    mode: Mode;
    difficulty: Difficulty;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const gameRef = useRef<Game | null>(null);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera();
    const sceneRender = new THREE.WebGLRenderer();
    sceneRender.setClearColor(0x000000);
    sceneRender.setClearAlpha(0);

    const [playerHealth, setPlayerHealth] = useState(0);
    const [playerSteps, setPlayerSteps] = useState(0);
    const [mazeSolutionLength, setMazeSolutionLength] = useState(0);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const game: Game = new Game(scene, camera, sceneRender, props.mode, props.difficulty);
            gameRef.current = game;

            game.resizeWindow([(2 * window.innerWidth / 3), window.innerHeight])
            containerRef.current?.appendChild(sceneRender.domElement);

            // Handle window resize
            const handleResize = () => {
                if (gameRef.current) {
                    game.resizeWindow([(2 * window.innerWidth / 3), window.innerHeight])
                }
            };
            window.addEventListener('resize', handleResize);

            let unsubscribeToHealthChange: () => void;
            let unsubscribeToMazeSolutionLengthChange: () => void;
            let unsubscribeToPlayerStepsChange: () => void;

            switch (props.mode) {
                case 'DBTW':
                    unsubscribeToHealthChange = game.subscribeToPlayerHealthChange((health) => {
                        setPlayerHealth(health);
                    });
                    break;
                case 'DTWS':
                    unsubscribeToMazeSolutionLengthChange = game.subscribeToMazeSolutionLengthChange((length) => {
                        setMazeSolutionLength(length);
                    });
                    unsubscribeToPlayerStepsChange = game.subscribeToPlayerStepsChange((steps) => {
                        setPlayerSteps(steps);
                    });
                    break;
            }

            game.run();
            return () => {
                game.end();
                window.removeEventListener('resize', handleResize);
                switch (props.mode) {
                    case 'DBTW':
                        unsubscribeToHealthChange();
                        break;
                    case 'DTWS':
                        unsubscribeToMazeSolutionLengthChange();
                        unsubscribeToPlayerStepsChange();
                        break;
                }
                scene.clear();
                sceneRender.dispose();
                camera.clear();
                containerRef.current?.removeChild(sceneRender.domElement);
                gameRef.current = null;
            }
        }
    }, []);

    const renderHearts = () => {
        const hearts = [];
        for (let i = 0; i < playerHealth; i++) {
          hearts.push(
            <img key={i} src={"/texture/heart.svg"} alt="Heart" className="w-8 h-8 mr-2" />
          );
        }
        return hearts;
      };

    return (
        <div className="flex flex-row w-full h-screen bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: 'url("/texture/hkust.jpg")',
            }}
        >
            <div className="flex justify-start w-8/12 h-full"
                ref={containerRef}
            >
            </div>
            <div className="flex justify-start items-center w-full h-full">
                <div className="bg-gray-500 border-2 border-black p-9 w-11/12 h-4/6">
                    <h1 className="text-2xl my-5">Game Information</h1>
                    <div className="grid grid-cols-1 text-black border-2">
                        <div className="m-5">
                            Gamemode:
                            <div>
                                {Mode2Name.get(props.mode)}
                            </div>
                        </div>
                        <div className="m-5">
                            Difficulty:
                            <div>
                                {props.difficulty}
                            </div>
                        </div>
                        <div className="m-5">
                            Character:
                        </div>
                        <div className="m-5">
                            Player status:
                            <div className="m-2">
                                Health:
                                <div className='flex flex-row'>
                                    {renderHearts()}
                                </div>
                            </div>
                            <div className="m-2">
                                Player steps/ Maze solution length:
                                <div className='flex flex-row'>
                                    {playerSteps}/{mazeSolutionLength}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}