import * as THREE from 'three';
import { useState, useEffect, useRef } from "react";
import Game, { Mode, Difficulty, Mode2Name } from '@/app/game/game';
import React from 'react';
import Gameend from './popup'

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

    const [gameState, setGameState] = useState(0);
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

            let unsubscribeToGameState: () => void;
            let unsubscribeToHealthChange: () => void;
            let unsubscribeToMazeSolutionLengthChange: () => void;
            let unsubscribeToPlayerStepsChange: () => void;

            unsubscribeToGameState = game.subscribeToGameState((state) => {
                setGameState(state);
            });

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
                unsubscribeToGameState();
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

    const handleClosePopup = () => {
        setGameState(0);
        window.location.href = '/game-level';
    };

    const renderHearts = () => {
        if (props.mode !== 'DBTW') {
            return [
                <img key={0} src={"/texture/heart.svg"} alt="Heart" className="w-8 h-8 mr-2" />,
                <img key={1} src={"/texture/heart.svg"} alt="Heart" className="w-8 h-8 mr-2" />,
                <img key={2} src={"/texture/heart.svg"} alt="Heart" className="w-8 h-8 mr-2" />,
            ]
        }
        const hearts = [];
        for (let i = 0; i < playerHealth; i++) {
            hearts.push(
                <img key={i} src={"/texture/heart.svg"} alt="Heart" className="w-8 h-8 mr-2" />
            );
        }
        return hearts;
    };

    return (
        <div className="flex flex-row w-screen h-screen bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: 'url("/texture/hkust.jpg")',
            }}
        >
            <div className="flex justify-start w-8/12 h-full"
                ref={containerRef}
            >
            </div>
            {gameState !== 0 && <Gameend state={gameState} handleClosePopup={handleClosePopup}/>}
            <div className="flex justify-start items-center w-4/12 h-full">
                <div className="continaer bg-gray-500 border-2 border-black p-9 w-11/12 h-4/6">
                    <h1 className="text-3xl h-[12%]">Game Information</h1>
                    <div className="container border-2 h-[88%]">
                        <div className='grid grid-rows-5 w-full h-full p-4 text-lg text-black'>
                            <div className='h-fit'> Gamemode: <br /> {Mode2Name.get(props.mode)} </div>
                            <div className='h-fit'> Difficulty: <br />{props.difficulty} </div>
                            <div className='h-fit'> Character: </div>
                            <div className='h-fit'> Health: <div className='h-fit flex flex-row'> {renderHearts()} </div> </div>
                            <div className='h-fit'> Player steps/ Limited steps: <br /> {playerSteps}/{mazeSolutionLength} </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}