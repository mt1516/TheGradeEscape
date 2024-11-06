import * as THREE from 'three';

class Player {
    #width;     // character width
    #height;    // character height
    #leftX;     // use for coordinate for checking win
    #rightP;    // use for coordinate for rendering
    #topP;      // use for coordinate for rendering
    #bottomY;   // use for coordinate for checking win
    #speed;
    #direction;
    #currentTile;
    #tilesHorizontal;
    #tilesVertical;
    constructor(mapStartX, mapStartY) {
        // Simple box collision model
        this.#width = 1;
        this.#height = 2;
        this.#leftX = mapStartX;
        this.#rightP = mapStartX + Math.floor(this.#width/2);
        this.#topP = mapStartY + Math.floor(this.#height/2); 
        this.#bottomY = mapStartY; 

        this.#speed = 1; // Speed of the player
        this.#direction = 0; // Direction of the player
        // console.log("this.mapX, this.mapY, this.left, this.right, this.top, this.bottom = ", this.mapX, this.mapY, this.#leftX, this.rightP, this.topP, this.bottomY);
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
        this.visual = player;
    }

    changeDirection(direction) {
        this.#direction = direction;
    }

    getCurrentPosition() {
        return [this.#leftX, this.#rightP, this.#topP, this.#bottomY];
    }

    getNextPosition() {
        switch (this.#direction) {
            case 1:
                return [this.#leftX, this.#rightP, this.#topP + this.#speed, this.#bottomY + this.#speed];
            case 2:
                return [this.#leftX + this.#speed, this.#rightP + this.#speed, this.#topP, this.#bottomY];
            case 3:
                return [this.#leftX, this.#rightP, this.#topP - this.#speed, this.#bottomY - this.#speed];
            case 4:
                return [this.#leftX - this.#speed, this.#rightP - this.#speed, this.#topP, this.#bottomY];
        }
        return this.getCurrentPosition();
    }

    move(leftX, rightP, topP, bottomY) {
        this.#leftX = leftX;
        this.#rightP = rightP;
        this.#topP = topP;
        this.#bottomY = bottomY;
        this.visual.position.set(rightP, topP, 1);
    }

    win(wallX, wallY) {
        this.changeDirection(0);
        this.#leftX = wallX;
        this.#bottomY = wallY;
        this.visual.position.set(wallX, wallY, -1);
    }

    isWin(winX, winY) {
        return (this.#leftX === winX && this.#bottomY === winY);
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