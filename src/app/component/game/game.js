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
        // this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.camera = new THREE.OrthographicCamera();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement); // Use the container parameter
        this.maze = new Maze(mode, difficulty);
        // this.maze = new Maze("default");
        this.camera.position.set(0, 0, Math.max(this.maze.width, this.maze.height) * 2 * this.maze.cellSize); // Adjust the camera position
        this.camera.lookAt(0, 0, 0); // Adjust the camera position to look at the maze
        this.player = new Player(this.maze.startRow, this.maze.startCol, (this.maze.startCol - this.maze.width + 1) * this.maze.cellSize, (this.maze.height - this.maze.startRow - 1) * this.maze.cellSize, this.maze.visualizeMaze);
        this.frameCount = 0;
        this.moveEveryNFrames = 5;
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
        // this.camera.rotateZ(-Math.PI / 1800); // this is so funny lol
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

        requestAnimationFrame(this.playerMovemoment.bind(this));
        this.renderer.render(this.scene, this.camera);
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
        const winMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green win cell
        const startMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Blue start cell 
        
        // var visualX = 1 - this.width * this.cellSize;
        var visualY = this.height * this.cellSize - 1;
        var visualX = 0;
        // var visualY = Math.floor(this.maze.visualizeMaze.length) - 3;
        this.maze.visualizeMaze.forEach((row, y) => {
            row.forEach((cell, x) => {
                switch (cell) {
                    case 0: // Wall
                        // const wallGeometry = new THREE.BoxGeometry(this.maze.cellSize, this.maze.cellSize, this.maze.cellSize);
                        const wallGeometry = new THREE.BoxGeometry(1, 1, 1);
                        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                        // wall.position.set((x - this.maze.width + 1) * this.maze.cellSize, (this.maze.height - y - 1) * this.maze.cellSize, 0); // Adjust position
                        // wall.position.set((x - this.maze.width * this.maze.cellSize + 2), (this.maze.height * this.maze.cellSize - y), 0);
                        wall.position.set(visualX, visualY, 0);
                        this.scene.add(wall);
                        break;
                    case 1:
                        // const pathGeometry = new THREE.BoxGeometry(this.maze.cellSize, this.maze.cellSize, this.maze.cellSize);
                        const pathGeometry = new THREE.BoxGeometry(1, 1, 1);
                        const path = new THREE.Mesh(pathGeometry, pathMaterial);
                        // path.position.set((x - this.maze.width + 1) * this.maze.cellSize, (this.maze.height - y - 1) * this.maze.cellSize, 0); // Adjust position
                        // path.position.set((x - this.maze.width * this.maze.cellSize + 2), (this.maze.height * this.maze.cellSize - y), 0); // Adjust position
                        path.position.set(visualX, visualY, 0);
                        this.scene.add(path);
                        break;
                    case 2:
                        const winGeometry = new THREE.BoxGeometry(this.maze.cellSize, this.maze.cellSize, this.maze.cellSize);
                        const win = new THREE.Mesh(winGeometry, winMaterial);
                        // win.position.set((x - this.maze.width + 1) * this.maze.cellSize, (this.maze.height - y - 1) * this.maze.cellSize, 0); // Adjust position
                        win.position.set((x - this.maze.width * this.maze.cellSize + 1), (this.maze.height * this.maze.cellSize - y - 1), 0); // Adjust position
                        this.scene.add(win);
                        break;
                    case 3:
                        const startGeometry = new THREE.BoxGeometry(this.maze.cellSize, this.maze.cellSize, this.maze.cellSize);
                        const start = new THREE.Mesh(startGeometry, startMaterial);
                        // start.position.set((x - this.maze.width + 1) * this.maze.cellSize, (this.maze.height - y - 1) * this.maze.cellSize, 0); // Adjust position
                        start.position.set((x - this.maze.width * this.maze.cellSize + 1) , (this.maze.height * this.maze.cellSize - y - 1), 0); // Adjust position
                        this.scene.add(start);
                        break;
                }
                visualX += 1;
                if (visualX === this.width * this.cellSize) {
                    visualCol = 1 - this.width * this.cellSize;
                    visualRow += 1;
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