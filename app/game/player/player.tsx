"use client";

import * as THREE from 'three';
import StateMachine from './state-machine';
import { Mode } from '../game'

var hurtAnimiationResetFrame = 5;

export default class Player {
    public state: StateMachine;
    public visual: THREE.Sprite;
    private currentTile: number;
    private tilesHorizontal: number;
    private tilesVertical: number;
    private hurtAnimiationFrameCount: number;
    private hurtSound: THREE.Audio;
    constructor(gamemode: Mode, characterSize: number[], hitboxWidth: number, mapStartCoord: number[], mapEndCoord: number[], mazeMap: number[][]) {
        this.currentTile = 0;
        this.tilesHorizontal = 3;
        this.tilesVertical = 4;
        this.state = new StateMachine(mazeMap, characterSize, hitboxWidth, mapStartCoord, mapEndCoord);
        // console.log("this.mapX, this.mapY, this.left, this.right, this.top, this.bottom = ", this.mapX, this.mapY, this.leftX, this.rightP, this.topP, this.bottomY);
        this.visual = this.renderPlayer();
        this.visual.position.set(mapStartCoord[0], mapStartCoord[1] + Math.floor(characterSize[1] / 2), 2);
        this.hurtAnimiationFrameCount = 0;
        this.hurtSound = new THREE.Audio(new THREE.AudioListener());
    }

    public renderPlayer(): THREE.Sprite {
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

    public getHealth() {
        return this.state.getHealth();
    }

    public update() {
        this.animate();
        if (this.state.isMove()) {
            let [x, y]= this.state.update();
            this.visual.position.set(x, y, 3);
        }
    }

    public bumpWallUpdate(): boolean {
        if (this.hurtAnimiationFrameCount > 0) {
            this.hurtAnimiationFrameCount++;
            if (this.hurtAnimiationFrameCount > hurtAnimiationResetFrame) {
                this.hurtAnimiationFrameCount = 0;
                this.visual.material.color.setHex(0xffffff);
            }
            return false;
        }
        let flag = this.state.getbumpWallFlag()
        if (flag && this.hurtAnimiationFrameCount === 0) {
            this.state.bumpWallUpdate();
            this.visual.material.color.setHex(0xff0000);
            this.hurtAnimiationFrameCount = 1;
            const audioLoader = new THREE.AudioLoader();
            audioLoader.load('/sounds/hurtsound.mp3',  (buffer) => {
                this.hurtSound.setBuffer(buffer);
                this.hurtSound.setLoop(false);
                this.hurtSound.setVolume(1);
                this.hurtSound.play();
            });
        }
        return flag;
    }

    public animate() {
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