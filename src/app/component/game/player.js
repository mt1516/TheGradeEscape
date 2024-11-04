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
        this.currentTile = 0;
        this.tilesHorizontal = 3;
        this.tilesVertical = 4;
        const offsetX = (this.currentTile % this.tilesHorizontal) / this.tilesHorizontal;
        const offsetY = (this.tilesVertical - Math.floor(this.currentTile / this.tilesHorizontal)) / this.tilesVertical;
        let playerTexture = new THREE.TextureLoader().load('/texture/student.png');
        playerTexture.magFilter = THREE.NearestFilter;
        playerTexture.minFilter = THREE.NearestFilter;
        playerTexture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);
        playerTexture.offset.set(offsetX, offsetY);
        const playerMaterial = new THREE.SpriteMaterial({ map: playerTexture, sizeAttenuation: false });
        playerMaterial.transparent = true;
        const player = new THREE.Sprite(playerMaterial);
        player.scale.set(3, 3, 1);

        // const playerMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Yellow player
        // const playerTexture = new THREE.TextureLoader().load('/texture/steve.webp');
        // playerTexture.magFilter = THREE.NearestFilter;
        // playerTexture.minFilter = THREE.NearestFilter;
        // const playerMaterial = new THREE.MeshBasicMaterial({ map: playerTexture });
        // const playerGeometry = new THREE.BoxGeometry(2, 2, 0.00001);
        // const player = new THREE.Mesh(playerGeometry, playerMaterial);
        player.position.set(this.visualizeX, this.visualizeY, 1); // Adjust position
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

    animate() {
        // console.log("BITCH", this.direction);
        switch (this.direction) {
            case 1:
                this.currentTile = (this.currentTile >= 9 && this.currentTile < 11) ? this.currentTile + 1 : 9;
                break;
            case 2:
                this.currentTile = (this.currentTile >= 6 && this.currentTile < 8) ? this.currentTile + 1 : 6;
                break;
            case 3:
                this.currentTile = (this.currentTile >= 0 && this.currentTile < 2) ? this.currentTile + 1 : 0;
                break;
            case 4:
                this.currentTile = (this.currentTile >= 3 && this.currentTile < 5) ? this.currentTile + 1 : 3;
                break;
        }
        const offsetX = (this.currentTile % this.tilesHorizontal) / this.tilesHorizontal;
        const offsetY = (this.tilesVertical - Math.floor(this.currentTile / this.tilesHorizontal) - 1) / this.tilesVertical;
        this.hitbox.material.map.offset.set(offsetX, offsetY);
    }
}

// Export the Player class
export default Player;