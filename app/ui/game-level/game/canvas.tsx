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
    const background = new THREE.TextureLoader().load("/texture/hkust.jpg");
    scene.background = background;
    const camera = new THREE.OrthographicCamera();
    const sceneRender = new THREE.WebGLRenderer();

    const [playerHealth, setPlayerHealth] = useState(100);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sceneRender.setSize(window.innerWidth, window.innerHeight);
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
        <div>
            <div ref={containerRef}></div>
        </div>
    );
}