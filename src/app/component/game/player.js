import * as THREE from 'three';

class Player {
    #direction;
    #currentTile;
    #tilesHorizontal;
    #tilesVertical;
    #width;
    #height;
    #speed;
    constructor(mapX, mapY) {
        this.#width = 1;
        this.#height = 2;
        this.mapX = mapX;
        this.mapY = mapY + Math.floor(this.#height/2);
        this.left = mapX - Math.floor(this.#width/2);
        this.right = mapX + Math.floor(this.#width/2);
        this.top = mapY;
        this.bottom = mapY - Math.floor(this.#height/2);
        this.#speed = 1; // Speed of the player
        this.#direction = 0; // Direction of the player
        this.renderPlayer();
    }

    renderPlayer() {
        this.#currentTile = 0;
        this.#tilesHorizontal = 3;
        this.#tilesVertical = 4;
        const offsetX = (this.#currentTile % this.#tilesHorizontal) / this.#tilesHorizontal;
        const offsetY = (this.#tilesVertical - Math.floor(this.#currentTile / this.#tilesHorizontal)) / this.#tilesVertical;
        let playerTexture = new THREE.TextureLoader().load('/texture/student.png');
        playerTexture.magFilter = THREE.NearestFilter;
        playerTexture.minFilter = THREE.NearestFilter;
        playerTexture.repeat.set(1 / this.#tilesHorizontal, 1 / this.#tilesVertical);
        playerTexture.offset.set(offsetX, offsetY);
        const playerMaterial = new THREE.SpriteMaterial({ map: playerTexture, sizeAttenuation: false });
        playerMaterial.transparent = true;
        const player = new THREE.Sprite(playerMaterial);
        player.scale.set(3, 3, 1);
        // player.position.set(this.mapX, this.mapY, 2); // Adjust position
        // console.log('Player created at: ', this.mapX, this.mapY);
        this.visual = player;
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
                return [this.mapX, this.mapY + this.#speed];
            case 2:
                return [this.mapX + this.#speed, this.mapY];
            case 3:
                return [this.mapX, this.mapY - this.#speed];
            case 4:
                return [this.mapX - this.#speed, this.mapY];
        }
        return this.getCurrentPosition();
    }

    move(x, y) {
        this.mapX = x;
        this.mapY = y;
        this.visual.position.set(x, y, 1);
    }

    win(wallX, wallY) {
        this.changeDirection(0);
        this.mapX = wallX;
        this.mapY = wallY;
        this.visual.position.set(wallX, wallY, -1);
    }

    isWin(winX, winY) {
        return (this.mapX === winX && this.mapY === winY);
    }

    animate() {
        // console.log("BITCH", this.direction);
        switch (this.#direction) {
            case 1:
                this.#currentTile = (this.#currentTile >= 9 && this.#currentTile < 11) ? this.#currentTile + 1 : 9;
                break;
            case 2:
                this.#currentTile = (this.#currentTile >= 6 && this.#currentTile < 8) ? this.#currentTile + 1 : 6;
                break;
            case 3:
                this.#currentTile = (this.#currentTile >= 0 && this.#currentTile < 2) ? this.#currentTile + 1 : 0;
                break;
            case 4:
                this.#currentTile = (this.#currentTile >= 3 && this.#currentTile < 5) ? this.#currentTile + 1 : 3;
                break;
        }
        const offsetX = (this.#currentTile % this.#tilesHorizontal) / this.#tilesHorizontal;
        const offsetY = (this.#tilesVertical - Math.floor(this.#currentTile / this.#tilesHorizontal) - 1) / this.#tilesVertical;
        this.visual.material.map.offset.set(offsetX, offsetY);
    }
}

// Export the Player class
export default Player;