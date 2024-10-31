// player.js
import * as THREE from 'three';

// let width = 14; // TODO: Change to access the JSON file to get the width and height for a specific difficulty and gamemode
// let height = 14; // TODO: Change to access the JSON file to get the width and height for a specific difficulty and gamemode
const cellSize = 3; // Size of each cell    --> change to character size --> for collision detection

class Player {
    constructor(startX, startY, visualizeX, visualizeY, maze) {
        this.x = startX;
        this.y = startY;
        this.visualizeX = visualizeX;
        this.visualizeY = visualizeY;
        this.hitbox = this.renderPlayer();
        this.maze = maze; // Reference to the maze for collision detection
        this.maze_height = maze.length;
        this.maze_width = maze[0].length;
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
                newY = - Math.round(newVisualizeY/3) + Math.trunc(this.maze_height/2);
                break;
            case 2:
                newVisualizeX += this.speed;
                newX = Math.round(newVisualizeX/3) + Math.trunc(this.maze_width/2);
                break;
            case 3:
                newVisualizeY -= this.speed;
                newY = - Math.round(newVisualizeY/3) + Math.trunc(this.maze_height/2);
                break;
            case 4:
                newVisualizeX -= this.speed;
                newX = Math.round(newVisualizeX/3) + Math.trunc(this.maze_width/2);
                break;
        }
        if (this.isValidMove(newVisualizeX, newVisualizeY, newX, newY)) {
            this.updatePosition(newVisualizeX, newVisualizeY, newX, newY);
        } else {
            console.log('Invalid move, x:', newVisualizeX, 'y:', newVisualizeY, 'newX:', newX, 'newY:', newY);
            if (newX < 0 || newY < 0 || newX >= this.maze_width || newY >= this.maze_width) {
                console.log('Out of bounds');
            } else {
                console.log('Hit a wall, maze value:', this.maze[newY][newX]);
            }
        }
    }

    isValidMove(newVisualizeX, newVisualizeY, newX, newY) {
        return (
            newVisualizeX >= -Math.trunc(this.maze_width/2) * cellSize - 1 &&
            newVisualizeY <= Math.trunc(this.maze_height/2) * cellSize + 1 &&
            newVisualizeX <= Math.trunc(this.maze_width/2) * cellSize + 1 &&
            newVisualizeY >= -Math.trunc(this.maze_height/2) * cellSize - 1 &&
            newX >= 0 &&
            newY >= 0 &&
            newX < this.maze_width &&
            newY < this.maze_height && 
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