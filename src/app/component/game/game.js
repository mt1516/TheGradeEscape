import * as THREE from 'three';
import Maze from '../maze/maze';
import Player from '../game/player';

class Game {
    constructor(container, mode, difficulty) {
        this.scene = new THREE.Scene();
        // this.scene.background = new THREE.Color(0x6c6c6c); // Gray background
        const background = new THREE.TextureLoader().load( "/texture/hkust.jpg" );
        // background.wrapS = THREE.RepeatWrapping;
        // background.wrapT = THREE.RepeatWrapping;
        this.scene.background = background;
        this.camera = new THREE.OrthographicCamera();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement); // Use the container parameter
        this.maze = new Maze(mode, difficulty);
        let [middleX, middleY] = this.maze.getMiddleOfMap();
        this.camera.position.set(middleX, middleY, Math.max(this.maze.width, this.maze.height) * 2 * this.maze.cellSize); // Adjust the camera position
        this.camera.lookAt(middleX, middleY, 0); // Adjust the camera position to look at the maze
        let [mapStartX, mapStartY] = this.maze.getStartOfMap()
        this.player = new Player(mapStartX, mapStartY);
        this.frameCount = 0;
        this.moveEveryNFrames = 5;
        let [winX, winY] = this.maze.getWinOfMap()
        this.mapWinX = winX;
        this.mapWinY = winY;
    }

    run() {
        this.scene.add(this.player.hitbox);
        this.renderMaze();
        this.resizeWindow();
        this.render();
        this.keyboardControls();
        this.onWindowResize();
    }

    keyboardControls() {
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    this.player.changeDirection(1); // Move up
                    console.log('up')
                    break;
                case 'ArrowRight':
                    this.player.changeDirection(2); // Move right
                    console.log('right')
                    break;
                case 'ArrowDown':
                    this.player.changeDirection(3); // Move down
                    console.log('down')
                    break;
                case 'ArrowLeft':
                    this.player.changeDirection(4); // Move left
                    console.log('left')
                    break;
                case 'w':
                    this.player.changeDirection(1); // Move up
                    console.log('up')
                    break;
                case 'd':
                    this.player.changeDirection(2); // Move right
                    console.log('right')
                    break;
                case 's':
                    this.player.changeDirection(3); // Move down
                    console.log('down')
                    break;
                case 'a':
                    this.player.changeDirection(4); // Move left
                    console.log('left')
                    break;
            }
        });
        this.playerMovemoment();
    }

    playerMovemoment() {
        // this.camera.rotateZ(-Math.PI / 1800); // this is so funny lol
        this.frameCount++;
    
        // Move the player every 10 frames
        if (this.frameCount >= this.moveEveryNFrames) {
            if (this.player.isWin(this.mapWinX, this.mapWinY)) {
                alert('You win!');
                this.player.win()
                window.location.reload(); // Reload the page
            }
            let [nextX, nextY] = this.player.getNextPosition();
            if (this.#isValidMove(nextX, nextY)) {
                this.player.move(nextX, nextY);
            }
            
            this.frameCount = 0; // Reset the frame counter
        }

        requestAnimationFrame(this.playerMovemoment.bind(this));
        this.renderer.render(this.scene, this.camera);
    }

    #isValidMove(nextX, nextY) {
        return (
            nextX >= 0 &&
            nextY >= 0 &&
            nextX < this.maze.mazeMap[0].length &&
            nextY < this.maze.mazeMap.length &&
            this.maze.mazeMap[nextY][nextX] !== 0
        )
    }

    onWindowResize() {
        window.addEventListener('resize', () => {
            this.resizeWindow();
        });
    }

    resizeWindow() {
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = Math.max(this.maze.width, this.maze.height) * 2 * this.maze.cellSize * 1.05;
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
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    renderMaze() {
        const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x593ac0 }); // Red walls
        const pathTexture = new THREE.TextureLoader().load( "/texture/Stone_Floor_002_COLOR.jpg" );
        // pathTexture.wrapS = THREE.RepeatWrapping;
        // pathTexture.wrapT = THREE.RepeatWrapping;
        // pathTexture.repeat.set( 1, 1 );
        const pathMaterial = new THREE.MeshBasicMaterial({ map: pathTexture });
        const startMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Blue start cell 
        const winMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green win cell
        this.maze.mazeMap.forEach((row, y) => {
            row.forEach((cell, x) => {
                switch (cell) {
                    case 0: // Wall
                        const wallGeometry = new THREE.BoxGeometry(1, 1, 1);
                        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                        wall.position.set(x, y, 0);
                        this.scene.add(wall);
                        break;
                    case 1:
                        const pathGeometry = new THREE.BoxGeometry(1, 1, 1);
                        const path = new THREE.Mesh(pathGeometry, pathMaterial);
                        path.position.set(x, y, 0);
                        this.scene.add(path);
                        break;
                    case 2:
                        const winGeometry = new THREE.BoxGeometry(1, 1, 1);
                        const win = new THREE.Mesh(winGeometry, winMaterial);
                        win.position.set(x, y, 0); // Adjust position
                        this.scene.add(win);
                        break;
                    case 3:
                        const startGeometry = new THREE.BoxGeometry(1, 1, 1);
                        const start = new THREE.Mesh(startGeometry, startMaterial);
                        start.position.set(x, y, 0); // Adjust position
                        this.scene.add(start);
                        break;
                }
            });
        });
    
        // Add border walls
        let cellMiddle = Math.floor(this.maze.cellSize / 2);
        for (let x=1; x < this.maze.mazeMap.length; x+=this.maze.cellSize) {
            this.addBorderWall(x, this.maze.mazeMap[0].length + cellMiddle, this.maze.cellSize);
            this.addBorderWall(x, -1 - cellMiddle, this.maze.cellSize);
        }
        for (let y=1; y<this.maze.mazeMap[0].length; y+=this.maze.cellSize) {
            this.addBorderWall(this.maze.mazeMap.length + cellMiddle, y, this.maze.cellSize);
            this.addBorderWall(-1 - cellMiddle, y, this.maze.cellSize);
        }
        this.addBorderWall(this.maze.mazeMap.length + cellMiddle, this.maze.mazeMap[0].length + cellMiddle, this.maze.cellSize);
        this.addBorderWall(this.maze.mazeMap.length + cellMiddle, -1 - cellMiddle, this.maze.cellSize);
        this.addBorderWall(-1 - cellMiddle, this.maze.mazeMap[0].length + cellMiddle, this.maze.cellSize);
        this.addBorderWall(-1 - cellMiddle, -1 - cellMiddle, this.maze.cellSize);
    }

    addBorderWall(x, y, cellSize) {
        const borderMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Black border
        const borderGeometry = new THREE.BoxGeometry(cellSize, cellSize, 1);
        const border = new THREE.Mesh(borderGeometry, borderMaterial);
        border.position.set(x, y, 0); // Adjust position
        this.scene.add(border);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

export default Game;