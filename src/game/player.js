// player.js
import * as THREE from 'three';

let width = 10;
let height = 10;
const cellSize = 3; // Size of each cell

class Player {
    constructor(startX, startY, visualizeX, visualizeY, maze) {
        this.x = startX;
        this.y = startY;
        this.visualizeX = visualizeX;
        this.visualizeY = visualizeY;
        this.hitbox = this.renderPlayer();
        this.maze = maze; // Reference to the maze for collision detection
        this.speed = 1; // Speed of the player
        this.direction = 0; // Direction of the player
    }

    renderPlayer() {
        const playerMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Yellow player
        const playerGeometry = new THREE.BoxGeometry(1, 1, 0.00001);
        const player = new THREE.Mesh(playerGeometry, playerMaterial);
        player.position.set(this.visualizeX, this.visualizeY, 2); // Adjust position
        console.log('Player created at: ', this.visualizeX, this.visualizeY);
        return player;
    }

    turnDirection(direction) {
        this.direction = direction;
    }

    move() {
        var newVisualizeX = this.visualizeX;
        var newVisualizeY = this.visualizeY;
        var newX = this.x;
        var newY = this.y;
        switch (this.direction) {
            case 1:
                newVisualizeY += this.speed;
                newY = - Math.round(newVisualizeY/3) + height - 1;
                break;
            case 2:
                newVisualizeX += this.speed;
                newX = Math.round(newVisualizeX/3) + width - 1;
                break;
            case 3:
                newVisualizeY -= this.speed;
                newY = - Math.round(newVisualizeY/3) + height - 1;
                break;
            case 4:
                newVisualizeX -= this.speed;
                newX = Math.round(newVisualizeX/3) + width - 1;
                break;
        }
        if (this.isValidMove(newVisualizeX, newVisualizeY, newX, newY)) {
            this.updatePosition(newVisualizeX, newVisualizeY, newX, newY);
        // } else {
        //     console.log('Invalid move, x:', newVisualizeX, 'y:', newVisualizeY, 'newX:', newX, 'newY:', newY);
        //     if (newX < 0 || newY < 0 || newX >= this.maze[0].length || newY >= this.maze.length) {
        //         console.log('Out of bounds');
        //     } else {
        //         console.log('Hit a wall, maze value:', this.maze[newY][newX]);
        //     }
        }
    }

    isValidMove(newVisualizeX, newVisualizeY, newX, newY) {
        return (
            newVisualizeX >= -width * cellSize + 2 &&
            newVisualizeY <= height * cellSize - 2 &&
            newVisualizeX <= width * cellSize -2 &&
            newVisualizeY >= -height * cellSize + 2 &&
            newX >= 0 &&
            newY >= 0 &&
            newX < this.maze[0].length &&
            newY < this.maze.length && 
            this.maze[newY][newX] !== 0
        );
    }

    isWin() {
        return this.maze[this.y][this.x] === 2;
    }

    updatePosition(newVisualizeX, newVisualizeY, newX, newY) {
        // Update the player's position both on the canvas and the maze
        console.log(`Player moved to: (${newVisualizeX}, ${newVisualizeY}), (${newX}, ${newY})`);
        this.hitbox.position.set(newVisualizeX, newVisualizeY, 2); // Adjust position
        this.visualizeX = newVisualizeX;
        this.visualizeY = newVisualizeY;
        this.x = newX;
        this.y = newY;
    }
}

// Export the Player class
export default Player;