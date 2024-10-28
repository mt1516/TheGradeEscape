import * as THREE from 'three';
import Maze from '../maze/maze';
import Player from '../game/player';

class Game {
    constructor(container) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x6c6c6c); // Gray background
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement); // Use the container parameter
        this.maze = new Maze("testing");
        this.camera.position.set(0, 0, Math.max(this.maze.width, this.maze.height) * 2 * this.maze.cellSize); // Adjust the camera position
        this.camera.lookAt(0, 0, 0); // Adjust the camera position to look at the maze
        this.player = new Player(this.maze.startRow, this.maze.startCol, (1 - this.maze.width) * this.maze.cellSize, (1 - this.maze.height) * this.maze.cellSize, this.maze.visualizeMaze);
        this.frameCount = 0;
        this.moveEveryNFrames = 10;
        this.scene.add(this.player.hitbox);
        this.renderMaze();
        this.render();
        this.keyboardControls(container);
    }

    keyboardControls(container) {
        container.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    this.player.turnDirection(1); // Move up
                    console.log('up')
                    break;
                case 'ArrowRight':
                    this.player.turnDirection(2); // Move right
                    console.log('right')
                    break;
                case 'ArrowDown':
                    this.player.turnDirection(3); // Move down
                    console.log('down')
                    break;
                case 'ArrowLeft':
                    this.player.turnDirection(4); // Move left
                    console.log('left')
                    break;
                case 'w':
                    this.player.turnDirection(1); // Move up
                    console.log('up')
                    break;
                case 'd':
                    this.player.turnDirection(2); // Move right
                    console.log('right')
                    break;
                case 's':
                    this.player.turnDirection(3); // Move down
                    console.log('down')
                    break;
                case 'a':
                    this.player.turnDirection(4); // Move left
                    console.log('left')
                    break;
            }
        });
        this.playerMovemoment();
    }

    playerMovemoment() {
        this.frameCount++;
    
        // Move the player every 10 frames
        if (this.frameCount >= this.moveEveryNFrames) {
            this.player.move();
            if (this.player.isWin()) {
                alert('You win!');
                window.location.reload(); // Reload the page
            }
            this.frameCount = 0; // Reset the frame counter
        }
    
        // Request the next frame
        // wait for 1/60th of a second
        setTimeout(() => {
            requestAnimationFrame(this.playerMovemoment.bind(this));
            this.renderer.render(this.scene, this.camera);
        }, 1000 / 60);
        // requestAnimationFrame(this.playerMovemoment());
        // this.renderer.render(this.scene, this.camera);
    }

    renderMaze() {
        const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x593ac0 }); // Red walls
        const pathMaterial = new THREE.MeshBasicMaterial({ color: 0xb199e1 }); // White paths
        const winMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green win cell
        const startMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Blue start cell 
    
        this.maze.visualizeMaze.forEach((row, y) => {
            row.forEach((cell, x) => {
                switch (cell) {
                    case 0: // Wall
                        const wallGeometry = new THREE.BoxGeometry(this.maze.cellSize, this.maze.cellSize, this.maze.cellSize);
                        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                        wall.position.set((x - this.maze.width + 1) * this.maze.cellSize, (this.maze.height - y - 1) * this.maze.cellSize, 0); // Adjust position
                        this.scene.add(wall);
                        break;
                    case 1:
                        const pathGeometry = new THREE.BoxGeometry(this.maze.cellSize, this.maze.cellSize, this.maze.cellSize);
                        const path = new THREE.Mesh(pathGeometry, pathMaterial);
                        path.position.set((x - this.maze.width + 1) * this.maze.cellSize, (this.maze.height - y - 1) * this.maze.cellSize, 0); // Adjust position
                        this.scene.add(path);
                        break;
                    case 2:
                        const winGeometry = new THREE.BoxGeometry(this.maze.cellSize, this.maze.cellSize, this.maze.cellSize);
                        const win = new THREE.Mesh(winGeometry, winMaterial);
                        win.position.set((x - this.maze.width + 1) * this.maze.cellSize, (this.maze.height - y - 1) * this.maze.cellSize, 0); // Adjust position
                        this.scene.add(win);
                        break;
                    case 3:
                        const startGeometry = new THREE.BoxGeometry(this.maze.cellSize, this.maze.cellSize, this.maze.cellSize);
                        const start = new THREE.Mesh(startGeometry, startMaterial);
                        start.position.set((x - this.maze.width + 1) * this.maze.cellSize, (this.maze.height - y - 1) * this.maze.cellSize, 0); // Adjust position
                        this.scene.add(start);
                        break;
                }
            });
        });
    
        // Add border walls
        for (let y = 0; y < 2 * this.maze.height - 1; y++) {
            this.addBorderWall(-this.maze.width, this.maze.height - y - 1, this.maze.cellSize);
            this.addBorderWall(this.maze.width, this.maze.height - y - 1, this.maze.cellSize);
        }
        for (let x = 0; x < 2 * this.maze.width - 1; x++) {
            this.addBorderWall(x - this.maze.width + 1, this.maze.height, this.maze.cellSize);
            this.addBorderWall(x - this.maze.width + 1, -this.maze.height, this.maze.cellSize);
        }
        this.addBorderWall(-this.maze.width, this.maze.height, this.maze.cellSize);
        this.addBorderWall(this.maze.width, this.maze.height, this.maze.cellSize);
        this.addBorderWall(-this.maze.width, -this.maze.height, this.maze.cellSize);
        this.addBorderWall(this.maze.width, -this.maze.height, this.maze.cellSize);
    }

    addBorderWall(x, y, cellSize) {
        const borderMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Black border
        const borderGeometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize);
        const border = new THREE.Mesh(borderGeometry, borderMaterial);
        border.position.set(x * cellSize, y * cellSize, 0); // Adjust position
        this.scene.add(border);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

export default Game;