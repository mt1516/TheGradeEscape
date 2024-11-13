import * as THREE from 'three';
import { useEffect, useRef } from "react";
import Game, { Mode, Difficulty } from '@/app/game/game';

export default function Canvas(props: {
    mode: Mode;
    difficulty: Difficulty;
}) {
    const scene = new THREE.Scene();
    const background = new THREE.TextureLoader().load("/texture/hkust.jpg");
    scene.background = background;
    const camera = new THREE.OrthographicCamera();
    const sceneRender = new THREE.WebGLRenderer();
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sceneRender.setSize(window.innerWidth, window.innerHeight);
            containerRef.current?.appendChild(sceneRender.domElement);
            const game: Game = new Game(scene, camera, sceneRender, props.mode, props.difficulty);
            game.run();
            return () => {
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