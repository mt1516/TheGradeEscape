"use client";

import * as THREE from 'three';
import Maze, { MAZECELL } from './maze-generator';
import Player from './player/player';
import settings from './settings.json';
import Boss, { updateMessage } from './player/boss';
import { promoteGrade, demoteGrade, setPlayed, updateScoreBoard } from './storage';

export type Mode = 'default' | 'DBTW' | 'DITD' | 'DTWS' | 'Final';
export type Difficulty = 'easy' | 'medium' | 'hard';
export let Mode2Name = new Map<Mode, string>([
    ['DBTW', 'Don\'t Break The Wall'],
    ['DITD', 'Dancing In The Dark'],
    ['DTWS', 'Don\'t Take Wrong Steps'],
    ['Final', 'Final Boss']
]);

let moveEveryNFrames = 5;

export interface setting {
    width: number;
    height: number;
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
    complexity: number;
    cellSize: number;
};

export class Mask {
    public mask: THREE.Mesh;
    public needMask: boolean;
    public maskOnDuration: number;
    private hurtSound: THREE.Audio = new THREE.Audio(new THREE.AudioListener());
    constructor() {
        const maskGeometry = new THREE.RingGeometry(10, 200);
        const maskMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        maskMaterial.opacity = 0;
        maskMaterial.transparent = true;
        this.mask = new THREE.Mesh(maskGeometry, maskMaterial);
        this.mask.position.set(0, 0, 10);
        this.needMask = false;
        this.maskOnDuration = 0;
        this.showMask();
    }

    public showMask() {
        (this.mask.material as THREE.Material).opacity = 1;
        return this.mask;
    }

    public thunder(probability: number=0.05) {
        if (this.maskOnDuration > 0) {
            return;
        }
        if (Math.random() < probability) {
            (this.mask.material as THREE.Material).opacity = 0.8
            this.maskOnDuration = Math.floor(Math.random() * 5) + 1;
            const audioLoader = new THREE.AudioLoader();
            if (this.maskOnDuration <= 2) {
                audioLoader.load('/sounds/SoftThunder.mp3',  (buffer) => {
                    this.hurtSound.setBuffer(buffer);
                    this.hurtSound.setLoop(false);
                    this.hurtSound.setVolume(1);
                    this.hurtSound.play();
                });
            } else if (this.maskOnDuration <= 4) {
                audioLoader.load('/sounds/MediumThunder.mp3',  (buffer) => {
                    this.hurtSound.setBuffer(buffer);
                    this.hurtSound.setLoop(false);
                    this.hurtSound.setVolume(1);
                    this.hurtSound.play();
                });
            } else {
                audioLoader.load('/sounds/LoudThunder.mp3',  (buffer) => {
                    this.hurtSound.setBuffer(buffer);
                    this.hurtSound.setLoop(false);
                    this.hurtSound.setVolume(1);
                    this.hurtSound.play();
                });
            }
        } else {
            (this.mask.material as THREE.Material).opacity = 1;
        }
    }

    // public moveMask(x: number, y: number) {
    //     this.mask.position.set(x, y, 10);
    // }
};

export default class Game {
    private keyOrder: string[];
    private bumpedKey: string[];
    private scene: THREE.Scene;
    private camera: THREE.OrthographicCamera;
    private sceneRender: THREE.WebGLRenderer;
    private gamemode: Mode;
    private difficulty: Difficulty;
    private gameSetting: setting;
    private maze: Maze;
    private stepLimit: number;
    private player: Player;
    private frameCount: number;
    private animationFrameCount: number;
    private maskPlayerView: Mask | null;
    private stateCallbacks: Set<(state: number) => void>;
    private mazeSolutionLengthCallbacks: Set<(length: number) => void> | null;
    private playerStepsCallbacks: Set<(steps: number) => void> | null;
    private healthChangeCallbacks: Set<(health: number) => void> | null;
    private boss: Boss | null;
    constructor(scene: THREE.Scene, camera: THREE.OrthographicCamera, sceneRender: THREE.WebGLRenderer, mode: Mode, difficulty: Difficulty) {
        this.frameCount = 0;
        this.animationFrameCount = 0;
        this.scene = scene;
        this.camera = camera;
        this.sceneRender = sceneRender;
        this.keyOrder = [];
        this.gamemode = mode;
        this.difficulty = difficulty;
        this.bumpedKey = [];
        this.gamemode = mode;
        this.gameSetting = (settings[this.gamemode] as Record<Difficulty, setting>)[difficulty];
        this.maze = new Maze(this.gameSetting);
        this.stepLimit = -1;
        let [middleX, middleY] = this.maze.getMiddleOfMap();
        this.camera.position.set(middleX, middleY, Math.max(this.gameSetting.width, this.gameSetting.height) * 2 * this.gameSetting.cellSize); // Adjust the camera position
        this.camera.lookAt(middleX, middleY, 0); // Adjust the camera position to look at the maze
        let [startX, startY] = this.maze.getStartOfMap();
        this.maskPlayerView = null;
        this.stateCallbacks = new Set();
        this.mazeSolutionLengthCallbacks = null;
        this.playerStepsCallbacks = null;
        this.healthChangeCallbacks = null;
        this.stepLimit = -1;
        this.boss = null;
        switch (this.gamemode) {
            case 'DBTW':
                this.healthChangeCallbacks = new Set();
                break;
            case 'DITD':
                this.maskPlayerView = new Mask();
                this.maskPlayerView.mask.position.set(startX, startY, 10);
                this.maskPlayerView.showMask();
                this.maskPlayerView.needMask = true;
                this.scene.add(this.maskPlayerView.mask);
                break;
            case 'DTWS':
                this.stepLimit = Math.ceil(this.maze.getLengthOfSolution() * 1.3);
                this.mazeSolutionLengthCallbacks = new Set();
                this.playerStepsCallbacks = new Set();
                break;
        }
        this.player = new Player([1, 2], 1, [startX, startY], this.maze.getWinOfMap(), this.maze.mazeMap, this.stepLimit);
        if (this.gamemode === 'Final') {
            this.healthChangeCallbacks = new Set();
            this.boss = new Boss([1, 2], 1, this.maze.getStartOfMap(), this.maze.getWinOfMap(), this.maze.mazeMap, this.player, [startX, startY]);
            this.scene.add(this.boss.visual);
        }
        this.scene.add(this.player.visual);
        this.renderMaze();
    }

    public resizeWindow(windowSize: number[]) {
        let frustumSize = this.getFrustumSize();
        const aspect = windowSize[0] / windowSize[1];
        if (windowSize[0] >= windowSize[1]) {
            this.camera.left = -frustumSize * aspect / 2;
            this.camera.right = frustumSize * aspect / 2;
            this.camera.top = frustumSize / 2;
            this.camera.bottom = -frustumSize / 2;
        } else {
            this.camera.left = -frustumSize / 2;
            this.camera.right = frustumSize / 2;
            this.camera.top = frustumSize / aspect / 2;
            this.camera.bottom = -frustumSize / aspect / 2;
        }
        this.camera.updateProjectionMatrix();
        this.sceneRender.setSize(windowSize[0], windowSize[1]);
    }
    
    public run() {
        switch (this.gamemode) {
            case 'DBTW':
                this.notifyHealthChange();
                break;
            case 'DITD':
                break;
            case 'DTWS':
                this.notifytMazeSolutionLengthChange();
                this.notifyPlayerStepsChange();
                break;
            case 'Final':
                this.notifyHealthChange();
                break;
        }
        this.keyboardControls();
        this.playerMovemoment();
    }

    public end() {
        switch (this.gamemode) {
            case 'DBTW':
                this.healthChangeCallbacks?.clear();
                break;
            case 'DITD':
                break;
            case 'DTWS':
                this.mazeSolutionLengthCallbacks?.clear();
                this.playerStepsCallbacks?.clear();
                break;
            case 'Final':
                this.healthChangeCallbacks?.clear();
                break;
        }
        window.removeEventListener('keydown', () => {});
        window.removeEventListener('keyup', () => {});
    }

    public subscribeToGameState(callback: (state: number) => void): () => void {
        this.stateCallbacks.add(callback);
        return () => {
            this.stateCallbacks.delete(callback);
        };
    }

    public subscribeToPlayerHealthChange(callback: (health: number) => void): () => void {
        this.healthChangeCallbacks?.add(callback);
        return () => {
            this.healthChangeCallbacks?.delete(callback);
        };
    }

    public subscribeToMazeSolutionLengthChange(callback: (length: number) => void): () => void {
        this.mazeSolutionLengthCallbacks?.add(callback);
        return () => {
            this.mazeSolutionLengthCallbacks?.delete(callback);
        };
    }

    public subscribeToPlayerStepsChange(callback: (steps: number) => void): () => void {
        this.playerStepsCallbacks?.add(callback);
        return () => {
            this.playerStepsCallbacks?.delete(callback);
        };
    }

    private notifyGameState(state: number) {
        this.stateCallbacks.forEach((callback) => callback(state));
    }

    private notifyHealthChange() {
        this.healthChangeCallbacks?.forEach((callback) => callback(this.player.state.getHealth()));
    }

    private notifytMazeSolutionLengthChange() {
        this.mazeSolutionLengthCallbacks?.forEach((callback) => callback(this.stepLimit));
    }

    private notifyPlayerStepsChange() {
        this.playerStepsCallbacks?.forEach((callback) => callback(this.player.state.getSteps()));
    }

    private renderMaze() {
        const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x593ac0 }); // Red walls
        const pathTexture = new THREE.TextureLoader().load( "/texture/Stone_Floor_002_COLOR.jpg" );
        const pathMaterial = new THREE.MeshBasicMaterial({ map: pathTexture });
        const startMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Blue start cell 
        const winMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green win cell
        this.maze.mazeMap.forEach((row, y) => {
            row.forEach((cell, x) => {
                switch (cell) {
                    case MAZECELL.WALL:
                        const wallGeometry = new THREE.BoxGeometry(1, 1, 1);
                        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                        wall.position.set(x, y, 0);
                        this.scene.add(wall);
                        break;
                    case MAZECELL.PATH:
                        const pathGeometry = new THREE.BoxGeometry(1, 1, 1);
                        const path = new THREE.Mesh(pathGeometry, pathMaterial);
                        path.position.set(x, y, 0);
                        this.scene.add(path);
                        break;
                    case MAZECELL.WIN:
                        const winGeometry = new THREE.BoxGeometry(1, 1, 1);
                        const win = new THREE.Mesh(winGeometry, winMaterial);
                        win.position.set(x, y, 0); // Adjust position
                        this.scene.add(win);
                        break;
                    case MAZECELL.START:
                        const startGeometry = new THREE.BoxGeometry(1, 1, 1);
                        const start = new THREE.Mesh(startGeometry, startMaterial);
                        start.position.set(x, y, 0); // Adjust position
                        this.scene.add(start);
                        break;
                }
            });
        });
        this.addBorder();
    }

    private keyboardControls() {
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                case 'w':
                    if (this.keyOrder.indexOf('up') === -1 && this.bumpedKey.indexOf('up') === -1) {
                        this.keyOrder.push('up');
                    }
                    break;
                case 'ArrowRight':
                case 'd':
                    if (this.keyOrder.indexOf('right') === -1 && this.bumpedKey.indexOf('right') === -1) {
                        this.keyOrder.push('right');
                    }
                    break;
                case 'ArrowDown':
                case 's':
                    if (this.keyOrder.indexOf('down') === -1 && this.bumpedKey.indexOf('down') === -1) {
                        this.keyOrder.push('down');
                    }
                    break;
                case 'ArrowLeft':
                case 'a':
                    if (this.keyOrder.indexOf('left') === -1 && this.bumpedKey.indexOf('left') === -1) {
                        this.keyOrder.push('left');
                    }
                    break;
            }
        }, false);
        window.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                case 'w':
                    this.keyOrder = this.keyOrder.filter((key) => key !== 'up');
                    this.bumpedKey = this.bumpedKey.filter((key) => key !== 'up');
                    break;
                
                case 'ArrowRight':
                case 'd':
                    this.keyOrder = this.keyOrder.filter((key) => key !== 'right');
                    this.bumpedKey = this.bumpedKey.filter((key) => key !== 'right');
                    break;
                case 'ArrowDown':
                case 's':
                    this.keyOrder = this.keyOrder.filter((key) => key !== 'down');
                    this.bumpedKey = this.bumpedKey.filter((key) => key !== 'down');
                    break;
                case 'ArrowLeft':
                case 'a':
                    this.keyOrder = this.keyOrder.filter((key) => key !== 'left');
                    this.bumpedKey = this.bumpedKey.filter((key) => key !== 'left');
                    break;
            }
        }, false);
    }

    private playerMovemoment() {
        // this.camera.rotateZ(-Math.PI / 1800); // this is so funny lol
        this.frameCount++;
    
        // Move the player every 10 frames
        if (this.frameCount >= moveEveryNFrames) {
            
            this.player.state.checkWin();
            // TODO: Chnage this to popup
            if (this.player.state.isWin()) {
                this.player.state.reset(); 
                promoteGrade();
                const score = this.getScore();
                setPlayed(this.gamemode, this.difficulty, score);
                if (this.gamemode === 'Final') {
                   updateScoreBoard(score);
                }
                this.notifyGameState(1);
                return;
            } else if (this.player.state.isDead()) {
                this.player.state.reset(); 
                demoteGrade();
                this.notifyGameState(-1)
                return;
            }
            this.update();
            this.frameCount = 0; // Reset the frame counter
        }
        if (this.animationFrameCount == moveEveryNFrames / 2 || this.animationFrameCount == moveEveryNFrames) {
            this.player.animate();
        }

        requestAnimationFrame(this.playerMovemoment.bind(this));
    }

    private getScore() {
        var score = 50;
                switch (this.difficulty) {
                    case 'medium':
                        score *= 2;
                        break;
                    case 'hard':
                        score *= 3;
                        break;
                }
                switch (this.gamemode) {
                    case 'DBTW':
                        score += 2 * this.player.state.getSteps();
                        break;
                    case 'DITD':
                        score += 300;
                        break;
                    case 'DTWS':
                        score += 200 * this.player.state.getHealth();
                        break;
                    case 'Final':
                        score += 500 * this.player.state.getHealth(); 
                        break;
                }
        return score;
    }

    private update() {
        if (this.keyOrder.length > 0) {
            switch (this.keyOrder[this.keyOrder.length - 1]) {
                case 'up':
                    this.player.state.up(); // Move up
                    break;
                case 'right':
                    this.player.state.right(); // Move right
                    break;
                case 'down':
                    this.player.state.down(); // Move down
                    break;
                case 'left':
                    this.player.state.left(); // Move left
                    break;
            }
        } else {
            this.player.state.stop();
        }
        this.player.update(1);
        this.bumpWallUpdate();
        this.darkModeUpdate();
        this.limitedStepsUpdate();
        this.bossUpdate();
        this.sceneRender.render(this.scene, this.camera);
    }

    private bumpWallUpdate() {
        if (this.gamemode !== 'DBTW') {
            return;
        }
        if (this.player.bumpWallUpdate()) {
            // console.log(`before: keyOrder = ${this.keyOrder}`)
            this.notifyHealthChange()
            this.bumpedKey = [...this.keyOrder]
            this.keyOrder = [];
            // console.log(`after: keyOrder = ${this.keyOrder}`)
        }
    }

    private darkModeUpdate() {
        if (this.gamemode !== 'DITD') {
            return;
        }
        this.maskPlayerView?.mask.position.set(this.player.visual.position.x, this.player.visual.position.y, 10);
        if (this.maskPlayerView) {
            this.maskPlayerView.maskOnDuration = Math.max(0, this.maskPlayerView.maskOnDuration - 1);
        }
        this.maskPlayerView?.thunder();
    }

    private limitedStepsUpdate() {
        if (this.gamemode !== 'DTWS') {
            return;
        }
        if (this.player.state.isStop()) {
            this.notifyPlayerStepsChange();
            return;
        }
        if (this.player.limitedStepsUpdate()) {
            this.notifyPlayerStepsChange();
        }
    }

    private bossUpdate() {
        if (this.gamemode !== 'Final') {
            return;
        }
        if (this.boss) {
            const message: updateMessage = this.boss.update(moveEveryNFrames);
            if (message.hasNewProjectile) {
                this.scene.add(message.projectile.visual);
            }
            if (message.playerHit) {
                this.notifyHealthChange();
            }
        }
    }

    private getFrustumSize() {
        return Math.max(this.gameSetting.width, this.gameSetting.height) * 1.48 * this.gameSetting.cellSize;
    }
    
    private addBorder() {
        // Add border walls
        let cellMiddle = Math.floor(this.gameSetting.cellSize / 2);
        for (let x=cellMiddle; x < this.maze.mazeMap[0].length; x+=this.gameSetting.cellSize + cellMiddle) {
            this.addBorderWall(x, this.maze.mazeMap[0].length + cellMiddle, this.gameSetting.cellSize);
            if (x != cellMiddle) {
                this.addBorderWall(x, 0, this.gameSetting.cellSize, false, true);
            }
        }
        for (let x=this.gameSetting.cellSize; x<this.maze.mazeMap[0].length; x+=this.gameSetting.cellSize+1) {
            this.addPillarBorderWall(x, this.maze.mazeMap[0].length + cellMiddle, this.gameSetting.cellSize);
            this.addPillarBorderWall(x, 0, this.gameSetting.cellSize, false, true);
        }
        for (let y=this.gameSetting.cellSize + cellMiddle; y<this.maze.mazeMap.length; y+=this.gameSetting.cellSize + cellMiddle) {
            this.addBorderWall(this.maze.mazeMap.length, y, this.gameSetting.cellSize, true);
            this.addBorderWall(-1, y, this.gameSetting.cellSize, true);
        }
        for (let y=this.gameSetting.cellSize-1; y < this.maze.mazeMap.length; y += this.gameSetting.cellSize+1) {
            this.addPillarBorderWall(this.maze.mazeMap.length, y, this.gameSetting.cellSize, true);
            this.addPillarBorderWall(-1, y, this.gameSetting.cellSize, true);
        }
        this.addEdgeBorderWall(this.maze.mazeMap.length, this.maze.mazeMap[0].length + cellMiddle, this.gameSetting.cellSize);
        this.addEdgeBorderWall(this.maze.mazeMap.length, 0.2, this.gameSetting.cellSize, true);
        this.addEdgeBorderWall(-1, this.maze.mazeMap[0].length + cellMiddle, this.gameSetting.cellSize);
        this.addEdgeBorderWall(-1, 0.2, this.gameSetting.cellSize, true);
    }

    private addBorderWall(x: number, y: number, cellSize: number, isVertical: boolean = false, isBottom: boolean = false) {
        var borderTexture, borderGeometry;
        if (isVertical) {
            borderTexture = new THREE.TextureLoader().load('/texture/border-gate-vertical.png');
            borderGeometry = new THREE.BoxGeometry(1, cellSize, 3);
        } else {
            if (isBottom) {
                borderTexture = new THREE.TextureLoader().load('/texture/border-gate.png');
                borderGeometry = new THREE.BoxGeometry(cellSize, cellSize - Math.floor(cellSize/2), 3);
            } else {
                borderTexture = new THREE.TextureLoader().load('/texture/border-gate.png');
                borderGeometry = new THREE.BoxGeometry(cellSize, cellSize, 3);
            }
        }
        borderTexture.magFilter = THREE.NearestFilter;
        borderTexture.minFilter = THREE.NearestFilter;
        const borderMaterial = new THREE.MeshBasicMaterial({ map: borderTexture });
        borderMaterial.transparent = true;
        const border = new THREE.Mesh(borderGeometry, borderMaterial);
        if (isBottom) {
            border.position.set(x, y, 5); // Adjust position
        } else {
            border.position.set(x, y, 1); // Adjust position
        }
        this.scene.add(border);
    }

    private addPillarBorderWall(x: number, y: number, cellSize: number, isVertical: boolean = false, isBottom: boolean = false) {
        var borderTexture, borderGeometry;
        if (isVertical) {
            borderTexture = new THREE.TextureLoader().load('/texture/border-pillar-vertical.png');
            borderGeometry = new THREE.BoxGeometry(1, 1, 1);
        } else {
            if (isBottom) {
                borderTexture = new THREE.TextureLoader().load('/texture/border-pillar.png');
                borderGeometry = new THREE.BoxGeometry(1, cellSize - Math.floor(cellSize/2), 1);
            } else {
                borderTexture = new THREE.TextureLoader().load('/texture/border-pillar.png');
                borderGeometry = new THREE.BoxGeometry(1, cellSize, 1);
            }
        }
        borderTexture.magFilter = THREE.NearestFilter;
        borderTexture.minFilter = THREE.NearestFilter;
        const borderMaterial = new THREE.MeshBasicMaterial({ map: borderTexture });
        borderMaterial.transparent = true;
        const border = new THREE.Mesh(borderGeometry, borderMaterial);
        if (isBottom) {
            border.position.set(x, y, 5); // Adjust position
        } else {
            border.position.set(x, y, 1); // Adjust position
        }
        this.scene.add(border);
    }

    private addEdgeBorderWall(x: number, y: number, cellSize: number, isBottom: boolean = false) {
        if (isBottom) {
            let borderTexture = new THREE.TextureLoader().load('/texture/border-edge-bottom.png');
            borderTexture.magFilter = THREE.NearestFilter;
            borderTexture.minFilter = THREE.NearestFilter;
            const borderMaterial = new THREE.MeshBasicMaterial({ map: borderTexture });
            borderMaterial.transparent = true;
            const borderGeometry = new THREE.BoxGeometry(0.9, 2.5, 1);
            const border = new THREE.Mesh(borderGeometry, borderMaterial);
            border.position.set(x, y, 5); // Adjust position
            this.scene.add(border);
        } else {
            let borderTexture = new THREE.TextureLoader().load('/texture/border-edge.png');
            borderTexture.magFilter = THREE.NearestFilter;
            borderTexture.minFilter = THREE.NearestFilter;
            const borderMaterial = new THREE.MeshBasicMaterial({ map: borderTexture });
            borderMaterial.transparent = true;
            const borderGeometry = new THREE.BoxGeometry(1, 3, 1);
            const border = new THREE.Mesh(borderGeometry, borderMaterial);
            border.position.set(x, y, 1); // Adjust position
            this.scene.add(border);
        }
    }
}