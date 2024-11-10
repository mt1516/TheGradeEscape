"use client";

import * as THREE from 'three';
import StateMachine from './state-machine';

export default class Player {
    public state: StateMachine;
    public visual: THREE.Sprite;
    private currentTile: number;
    private tilesHorizontal: number;
    private tilesVertical: number;
    constructor(characterSize: number[], hitboxWidth: number, mapStartCoord: number[], mapEndCoord: number[], mazeMap: number[][]) {
        this.currentTile = 0;
        this.tilesHorizontal = 3;
        this.tilesVertical = 4;
        this.state = new StateMachine(mazeMap, characterSize, hitboxWidth, mapStartCoord, mapEndCoord);
        // console.log("this.mapX, this.mapY, this.left, this.right, this.top, this.bottom = ", this.mapX, this.mapY, this.leftX, this.rightP, this.topP, this.bottomY);
        this.visual = this.renderPlayer();
        this.visual.position.set(mapStartCoord[0], mapStartCoord[1] + Math.floor(characterSize[1]/2), 2);
    }
    
    public renderPlayer() {
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
        return player
    }

    public update() {
        this.animate();
        if (this.state.isMove()) {
            const updateResult = this.state.update();
            if (Array.isArray(updateResult)) {
                let [x, y] = updateResult;
                this.visual.position.set(x, y, 2);
            }
        }
    }

    public animate() {
        // console.log("BITCH", this.direction);
        switch (this.state.getDirection()) {
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
        if (this.visual && this.visual.material && this.visual.material.map) {
            this.visual.material.map.offset.set(offsetX, offsetY);
        }
    }
}