import * as THREE from 'three';
import { mazeGenerator } from '../maze-generator/maze-generator'

let scene, camera, renderer;

// Initialize Three.js
function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    camera.position.set(0, 30, 0);
    camera.lookAt(0, -1, 0); // Adjust the camera position to look at the maze
}

// Render the maze
function renderMaze(maze) {
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Black walls
    const pathMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White paths
    const winMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green win cell
    const startMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Blue start cell

    const cellSize = 1; // Size of each cell

    maze.forEach((row, y) => {
        row.forEach((cell, x) => {
            switch (cell) {
                case 0: // Wall
                    const wallGeometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize);
                    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                    wall.position.set(x * cellSize, cellSize / 2, -y * cellSize); // Adjust position
                    scene.add(wall);
                    break;
                case 1:
                    const pathGeometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize);
                    const path = new THREE.Mesh(pathGeometry, pathMaterial);
                    path.position.set(x * cellSize, cellSize / 2, -y * cellSize);
                    scene.add(path);
                    break;
                case 2:
                    const startGeometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize);
                    const start = new THREE.Mesh(startGeometry, startMaterial);
                    start.position.set(x * cellSize, cellSize / 2, -y * cellSize);
                    scene.add(start);
                    break;
                case 3:
                    const winGeometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize);
                    const win = new THREE.Mesh(winGeometry, winMaterial);
                    win.position.set(x * cellSize, cellSize / 2, -y * cellSize);
                    scene.add(win);
                    break;
            }
        });
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Initialize the game
function initGame() { 
    // TODO: Add difficulty levels
    const maze = mazeGenerator(10, 10, 0, 0, 9, 9, 0);
    initThreeJS();
    renderMaze(maze);
    animate();
}

export default initGame
