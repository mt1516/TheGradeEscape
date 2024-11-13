"use client";

import * as THREE from 'three';
import Maze, { MAZECELL } from './maze-generator';
import Player from './player/player';
import settings from './settings.json';

export type Mode = 'default' | 'DBTW' | 'DITD';
export type Difficulty = 'easy' | 'medium' | 'hard';

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
    public maskOnDuration: number;
    constructor() {
        const maskGeometry = new THREE.RingGeometry(10, 200);
        const maskMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        maskMaterial.opacity = 0;
        maskMaterial.transparent = true;
        this.mask = new THREE.Mesh(maskGeometry, maskMaterial);
        this.mask.position.set(0, 0, 10);
        this.maskOnDuration = 0;
        this.showMask();
    }

    public showMask() {
        this.mask.material.opacity = 1;
        return this.mask;
    }

    public thunder(probability: number=0.05) {
        if (this.maskOnDuration > 0) {
            return;
        }
        if (Math.random() < probability) {
            this.mask.material.opacity = 0.8
            this.maskOnDuration = Math.floor(Math.random() * 3) + 1;
        } else {
            this.mask.material.opacity = 1;
        }
    }

    // public moveMask(x: number, y: number) {
    //     this.mask.position.set(x, y, 10);
    // }
};

export default class Game {
    private keyOrder: string[];
    private gamemode: Mode;
    private pumpedKey: string[];
    private gameSetting: setting;
    private maze: Maze;
    private scene: THREE.Scene;
    private camera: THREE.OrthographicCamera;
    private sceneRender: THREE.WebGLRenderer;
    private player: Player;
    private frameCount: number;
    private moveEveryNFrames: number;
    private animationFrameCount: number;
    private maskPlayerView: Mask;
    constructor(scene: THREE.Scene, camera: THREE.OrthographicCamera, sceneRender: THREE.WebGLRenderer, mode: Mode, difficulty: Difficulty) {
        this.scene = scene;
        this.camera = camera;
        this.sceneRender = sceneRender;
        this.keyOrder = [];
        this.gamemode = mode;
        this.pumpedKey = [];
        this.gameSetting = (settings[mode] as Record<Difficulty, setting>)[difficulty];
        this.maze = new Maze(this.gameSetting);
        let [middleX, middleY] = this.maze.getMiddleOfMap();
        this.camera.position.set(middleX, middleY, Math.max(this.gameSetting.width, this.gameSetting.height) * 2 * this.gameSetting.cellSize); // Adjust the camera position
        this.camera.lookAt(middleX, middleY, 0); // Adjust the camera position to look at the maze
        this.player = new Player(mode, [1, 2], 1, this.maze.getStartOfMap(), this.maze.getWinOfMap(), this.maze.mazeMap);
        this.frameCount = 0;
        this.moveEveryNFrames = 5;
        this.animationFrameCount = 0;
        this.scene.add(this.player.visual);
        this.maskPlayerView = new Mask();
        if (mode === 'DITD') {
            this.maskPlayerView.mask.position.set(this.player.visual.position.x, this.player.visual.position.y, 10);
            this.maskPlayerView.showMask();
            this.scene.add(this.maskPlayerView.mask);
        }
    }
    
    public run() {
        this.renderMaze();
        this.resizeWindow();
        this.keyboardControls();
        this.playerMovemoment();
        this.onWindowResize();
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

    private resizeWindow() {
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = Math.max(this.gameSetting.width, this.gameSetting.height) * 2 * this.gameSetting.cellSize * 1.05;
        if (window.innerWidth >= window.innerHeight) {
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
        this.sceneRender.setSize(window.innerWidth, window.innerHeight);
    }

    private keyboardControls() {
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                case 'w':
                    if (this.keyOrder.indexOf('up') === -1 && this.pumpedKey.indexOf('up') === -1) {
                        this.keyOrder.push('up');
                    }
                    break;
                case 'ArrowRight':
                case 'd':
                    if (this.keyOrder.indexOf('right') === -1 && this.pumpedKey.indexOf('right') === -1) {
                        this.keyOrder.push('right');
                    }
                    break;
                case 'ArrowDown':
                case 's':
                    if (this.keyOrder.indexOf('down') === -1 && this.pumpedKey.indexOf('down') === -1) {
                        this.keyOrder.push('down');
                    }
                    break;
                case 'ArrowLeft':
                case 'a':
                    if (this.keyOrder.indexOf('left') === -1 && this.pumpedKey.indexOf('left') === -1) {
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
                    this.pumpedKey = this.pumpedKey.filter((key) => key !== 'up');
                    break;
                
                case 'ArrowRight':
                case 'd':
                    this.keyOrder = this.keyOrder.filter((key) => key !== 'right');
                    this.pumpedKey = this.pumpedKey.filter((key) => key !== 'right');
                    break;
                case 'ArrowDown':
                case 's':
                    this.keyOrder = this.keyOrder.filter((key) => key !== 'down');
                    this.pumpedKey = this.pumpedKey.filter((key) => key !== 'down');
                    break;
                case 'ArrowLeft':
                case 'a':
                    this.keyOrder = this.keyOrder.filter((key) => key !== 'left');
                    this.pumpedKey = this.pumpedKey.filter((key) => key !== 'left');
                    break;
            }
        }, false);
    }

    private playerMovemoment() {
        // this.camera.rotateZ(-Math.PI / 1800); // this is so funny lol
        this.frameCount++;
    
        // Move the player every 10 frames
        if (this.frameCount >= this.moveEveryNFrames) {
            this.player.state.checkWin();
            if (this.player.state.isWin()) {
                this.player.state.reset();
                // TODO: Chnage this to popup
                alert('You win!');
                window.location.href = '/game-level'; // Redirect to the home page
                return;
            }
            this.update();
            
            this.frameCount = 0; // Reset the frame counter
            
        }
        if (this.animationFrameCount == this.moveEveryNFrames / 2 || this.animationFrameCount == this.moveEveryNFrames) {
            this.player.animate();
        }

        requestAnimationFrame(this.playerMovemoment.bind(this));
    }

    private onWindowResize() {
        window.addEventListener('resize', () => {
            this.resizeWindow();
        });
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
        // this.player.update();
        let pumpWallFlag = this.player.update();
        this.maskPlayerView.mask.position.set(this.player.visual.position.x, this.player.visual.position.y, 10);
        this.maskPlayerView.maskOnDuration = Math.max(0, this.maskPlayerView.maskOnDuration - 1);
        this.maskPlayerView.thunder();
        if (pumpWallFlag) {
            // console.log(`before: keyOrder = ${this.keyOrder}`)
            this.pumpedKey = [...this.keyOrder]
            this.keyOrder = [];
            // console.log(`after: keyOrder = ${this.keyOrder}`)
        }
        this.sceneRender.render(this.scene, this.camera);
    }
    
    private addBorder() {
        // Add border walls
        let cellMiddle = Math.floor(this.gameSetting.cellSize / 2);
        for (let x=cellMiddle; x < this.maze.mazeMap[0].length; x+=this.gameSetting.cellSize + cellMiddle) {
            this.addBorderWall(x, this.maze.mazeMap[0].length + cellMiddle, this.gameSetting.cellSize);
            if (x != cellMiddle) {
                this.addBorderWall(x, -0.3, this.gameSetting.cellSize, false, true);
            }
        }
        for (let x=this.gameSetting.cellSize; x<this.maze.mazeMap[0].length; x+=this.gameSetting.cellSize+1) {
            this.addPillarBorderWall(x, this.maze.mazeMap[0].length + cellMiddle, this.gameSetting.cellSize);
            this.addPillarBorderWall(x, -0.3, this.gameSetting.cellSize, false, true);
        }
        for (let y=this.gameSetting.cellSize + cellMiddle; y<this.maze.mazeMap.length; y+=this.gameSetting.cellSize + cellMiddle) {
            this.addBorderWall(this.maze.mazeMap.length, y, this.gameSetting.cellSize, true);
            this.addBorderWall(-1, y, this.gameSetting.cellSize, true);
        }
        for (let y=this.gameSetting.cellSize-1; y < this.maze.mazeMap.length; y += this.gameSetting.cellSize+1) {
            this.addPillarBorderWall(this.maze.mazeMap.length, y, this.gameSetting.cellSize, true);
            this.addPillarBorderWall(-1, y, this.gameSetting.cellSize, true);
        }
        this.addEdgeBorderWall(this.maze.mazeMap.length + cellMiddle, this.maze.mazeMap[0].length + cellMiddle, this.gameSetting.cellSize);
        this.addEdgeBorderWall(this.maze.mazeMap.length + cellMiddle, 1, this.gameSetting.cellSize);
        this.addEdgeBorderWall(-1 - cellMiddle, this.maze.mazeMap[0].length + cellMiddle, this.gameSetting.cellSize);
        this.addEdgeBorderWall(-1 - cellMiddle, 1, this.gameSetting.cellSize);
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
        border.position.set(x, y, 3); // Adjust position
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
        border.position.set(x, y, 3); // Adjust position
        this.scene.add(border);
    }

    private addEdgeBorderWall(x: number, y: number, cellSize: number) {
        let borderTexture = new THREE.TextureLoader().load('/texture/border-edge.png');
        borderTexture.magFilter = THREE.NearestFilter;
        borderTexture.minFilter = THREE.NearestFilter;
        const borderMaterial = new THREE.MeshBasicMaterial({ map: borderTexture });
        borderMaterial.transparent = true;
        const borderGeometry = new THREE.BoxGeometry(cellSize, cellSize, 1);
        const border = new THREE.Mesh(borderGeometry, borderMaterial);
        border.position.set(x, y, 3); // Adjust position
        this.scene.add(border);
    }
    
}