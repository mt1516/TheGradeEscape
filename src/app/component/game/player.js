// player.js
import * as THREE from 'three';

// let width = 14; // TODO: Change to access the JSON file to get the width and height for a specific difficulty and gamemode
// let height = 14; // TODO: Change to access the JSON file to get the width and height for a specific difficulty and gamemode
// const cellSize = 3; // Size of each cell    --> change to character size --> for collision detection

class Player {
    #direction;
    constructor(mapX, mapY) {
        // this.x = startX;
        // this.y = startY;
        this.mapX = mapX;
        this.mapY = mapY;
        this.hitbox = this.renderPlayer();
        // this.maze = maze; // Reference to the maze for collision detection
        // this.maze_height = maze.length;
        // this.maze_width = maze[0].length;
        this.speed = 1; // Speed of the player
        this.#direction = 0; // Direction of the player
    }

    renderPlayer() {
        const playerMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Yellow player
        const playerGeometry = new THREE.BoxGeometry(1, 1, 0.00001);
        const player = new THREE.Mesh(playerGeometry, playerMaterial);
        player.position.set(this.mapX, this.mapY, 2); // Adjust position
        console.log('Player created at: ', this.mapX, this.mapY);
        return player;
    }

    changeDirection(direction) {
        this.#direction = direction;
    }

    getCurrentPosition() {
        return [this.mapX, this.mapY];
    }

    getNextPosition() {
        switch (this.#direction) {
            case 1:
                return [this.mapX, this.mapY + this.speed];
            case 2:
                return [this.mapX + this.speed, this.mapY];
            case 3:
                return [this.mapX, this.mapY - this.speed];
            case 4:
                return [this.mapX - this.speed, this.mapY];
        }
        return this.getCurrentPosition();
    }

    move(x, y) {
        this.mapX = x;
        this.mapY = y;
        this.hitbox.position.set(x, y, 2);
    }

    win(wallX, wallY) {
        this.changeDirection(0);
        this.mapX = wallX;
        this.mapY = wallY;
        this.hitbox.position.set(wallX, wallY, -10);
    }

    isWin(winX, winY) {
        return (this.mapX === winX && this.mapY === winY);
    }
}

// Export the Player class
export default Player;