import * as THREE from 'three';
import stateMachine from './state-machine';

const sleep = ms => new Promise(r => setTimeout(r, ms));

class Player {
    #direction;
    #currentTile;
    #tilesHorizontal;
    #tilesVertical;
    constructor(characterSize, hitboxSize, mapStartCoord, mapEndCoord, mazeMap) {
        // Simple box collision model
        this.state = new stateMachine(characterSize, hitboxSize, mapStartCoord, mapEndCoord, mazeMap);
        // this.#direction = 0; // Direction of the player
        // console.log("this.mapX, this.mapY, this.left, this.right, this.top, this.bottom = ", this.mapX, this.mapY, this.#leftX, this.rightP, this.topP, this.bottomY);
        this.renderPlayer();
        this.visual.position.set(mapStartCoord[0], mapStartCoord[1] + Math.floor(characterSize[1]/2), 2);
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

    update() {
        this.animate();
        let [x, y] = this.state.update();
        if (this.state.isMove()) {
            console.log("x, y = ", x, y);
            this.visual.position.set(x, y, 2);
        }
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