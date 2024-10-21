import * as THREE from 'three';
import { mazeGenerator } from '../maze-generator/maze-generator'
import Player from './player';
import settings from './settings.json';

let scene, camera, renderer;
let width = 20;
let height = 20;
let startRow = 0;
let startCol = 0;
let endRow = 19;
let endCol = 19;
let complexity = 0;
const cellSize = 3; // Size of each cell
var player;
let frameCount = 0;
const moveEveryNFrames = 10; // Move the player every 10 frames

// Initialize Three.js
function initThreeJS() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x6c6c6c); // White background
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    camera.position.set(0, 0, Math.max(width, height) * 2 * cellSize); // Adjust the camera position
    camera.lookAt(0, 0, 0); // Adjust the camera position to look at the maze
}

// Render the maze
function renderMaze(maze) {
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x593ac0 }); // Red walls
    const pathMaterial = new THREE.MeshBasicMaterial({ color: 0xb199e1 }); // White paths
    const winMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green win cell
    const startMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Blue start cell 

    maze.forEach((row, y) => {
        row.forEach((cell, x) => {
            switch (cell) {
                case 0: // Wall
                    const wallGeometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize);
                    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                    wall.position.set((x - width + 1) * cellSize, (height - y - 1) * cellSize, 0); // Adjust position
                    scene.add(wall);
                    break;
                case 1:
                    const pathGeometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize);
                    const path = new THREE.Mesh(pathGeometry, pathMaterial);
                    path.position.set((x - width + 1) * cellSize, (height - y - 1) * cellSize, 0); // Adjust position
                    scene.add(path);
                    break;
                case 2:
                    const winGeometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize);
                    const win = new THREE.Mesh(winGeometry, winMaterial);
                    win.position.set((x - width + 1) * cellSize, (height - y - 1) * cellSize, 0); // Adjust position
                    scene.add(win);
                    break;
                case 3:
                    const startGeometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize);
                    const start = new THREE.Mesh(startGeometry, startMaterial);
                    start.position.set((x - width + 1) * cellSize, (height - y - 1) * cellSize, 0); // Adjust position
                    scene.add(start);
                    break;
            }
        });
    });

    // Add border walls
    for (let y = 0; y < 2 * height - 1; y++) {
        addBorderWall(-width, height - y - 1, cellSize);
        addBorderWall(width, height - y - 1, cellSize);
    }
    for (let x = 0; x < 2 * width - 1; x++) {
        addBorderWall(x - width + 1, height, cellSize);
        addBorderWall(x - width + 1, -height, cellSize);
    }
    addBorderWall(-width, height, cellSize);
    addBorderWall(width, height, cellSize);
    addBorderWall(-width, -height, cellSize);
    addBorderWall(width, -height, cellSize);
}

function addBorderWall(x, y, cellSize) {
    const borderMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Black border
    const borderGeometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize);
    const border = new THREE.Mesh(borderGeometry, borderMaterial);
    border.position.set(x * cellSize, y * cellSize, 0); // Adjust position
    scene.add(border);
}


// Animation loop
// function animate() {
//     requestAnimationFrame(animate);
//     renderer.render(scene, camera);
// }

function playerMovemoment() {
    frameCount++;

    // Move the player every 10 frames
    if (frameCount >= moveEveryNFrames) {
        player.move();
        if (player.isWin()) {
            alert('You win!');
            window.location.reload(); // Reload the page
        }
        frameCount = 0; // Reset the frame counter
    }

    // Request the next frame
    requestAnimationFrame(playerMovemoment);
    renderer.render(scene, camera);
}

// Initialize the game
function initGame(game = "default") { 
    // TODO: Add difficulty levels
    const maze = mazeGenerator(width, height, startRow, startCol, endRow, endCol, complexity);
    initThreeJS();
    renderMaze(maze);
    // animate();

    player = new Player(startRow, startCol, (1 - width) * cellSize, (height - 1) * cellSize, maze); // Start at (0, 0)
    scene.add(player.hitbox); // Add the player to the scene

    // Handle keyboard input
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                player.turnDirection(1); // Move up
                console.log('up')
                break;
            case 'ArrowRight':
                player.turnDirection(2); // Move right
                console.log('right')
                break;
            case 'ArrowDown':
                player.turnDirection(3); // Move down
                console.log('down')
                break;
            case 'ArrowLeft':
                player.turnDirection(4); // Move left
                console.log('left')
                break;
        }
    });
    playerMovemoment()
}

export default initGame
