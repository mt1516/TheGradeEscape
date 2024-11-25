"use client";

import * as THREE from 'three';
import StateMachine from './state-machine';
import { getCurrentCharacter } from '../storage';
import { characters } from './character';

export default class Player {
    public state: StateMachine;
    public visual: THREE.Sprite;
    protected currentTile: number;
    protected tilesHorizontal: number;
    protected tilesVertical: number;
    private currentCharacter: any;
    protected hurtSound: THREE.Audio;
    public immunityPeriod: number;
    public immunityMask: THREE.Mesh;
    protected audioLoader = new THREE.AudioLoader();
    protected lastMove = Date.now();
    protected lastAnimate = Date.now();
    public movePeriod: number;
    public animatePeriod: number
    constructor(characterSize: number[], hitboxWidth: number, mapStartCoord: number[], mapEndCoord: number[], mazeMap: number[][], limitedSteps: number) {
        this.currentTile = 0;
        this.currentCharacter = characters[getCurrentCharacter()];
        this.tilesHorizontal = this.currentCharacter.tilesHorizontal;
        this.tilesVertical = this.currentCharacter.tilesVertical;
        this.state = new StateMachine(mazeMap, characterSize, hitboxWidth, limitedSteps, mapStartCoord, mapEndCoord);
        this.visual = this.renderPlayer();
        this.visual.position.set(mapStartCoord[0], mapStartCoord[1] + Math.floor(characterSize[1] / 2), 2);
        this.hurtSound = new THREE.Audio(new THREE.AudioListener());
        this.immunityPeriod = 5000;
        this.immunityMask = new THREE.Mesh(new THREE.CircleGeometry(2), new THREE.MeshBasicMaterial({ color: 0xffd500, transparent: true, opacity: 0 }));
        this.immunityMask.position.set(mapStartCoord[0], mapStartCoord[1] + Math.floor(characterSize[1] / 2), 5);
        this.lastMove = 0;
        this.lastAnimate = 0;
        this.movePeriod = 100;
        this.animatePeriod = this.currentCharacter.animatePeriod;
    }

    public renderPlayer(): THREE.Sprite {
        const offsetX = (this.currentTile % this.tilesHorizontal) / this.tilesHorizontal;
        const offsetY = (this.tilesVertical - Math.floor(this.currentTile / this.tilesHorizontal)) / this.tilesVertical;
        let playerTexture = new THREE.TextureLoader().load(this.currentCharacter.texturePath);
        playerTexture.magFilter = THREE.NearestFilter;
        playerTexture.minFilter = THREE.NearestFilter;
        playerTexture.colorSpace = THREE.SRGBColorSpace;
        playerTexture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);
        playerTexture.offset.set(offsetX, offsetY);
        const playerMaterial = new THREE.SpriteMaterial({ map: playerTexture, sizeAttenuation: false });
        playerMaterial.transparent = true;
        const player = new THREE.Sprite(playerMaterial);
        player.scale.set(3, 3, 1);
        return player
    }

    public update(deltaTime: number): void {
        this.lastMove -= deltaTime;
        if (this.lastMove < 0) {
            if (this.state.isMove()) {
                let [x, y] = this.state.update();
                this.visual.position.set(x, y, 3);
            }
            this.immunityMask.position.set(this.visual.position.x, this.visual.position.y, 5);
            this.lastMove = this.movePeriod;
        }
        this.lastAnimate -= deltaTime;
        if (this.lastAnimate < 0) {
            this.animate();
            this.lastAnimate = this.animatePeriod;
        }
    }

    private startHurtAnimation() {
        this.visual.material.color.setHex(0xff0000);
        this.audioLoader.load('/sounds/hurtsound.mp3', (buffer) => {
            this.hurtSound.setBuffer(buffer);
            this.hurtSound.setLoop(false);
            this.hurtSound.setVolume(1);
            this.hurtSound.play();
        });
        setTimeout(() => {
            this.visual.material.color.setHex(0xffffff);
        }, 200);
    }

    public bumpWallUpdate(): boolean {
        let flag = this.state.getbumpWallFlag()
        // if (flag && this.hurtAnimiationFrameCount === 0) {
        if (flag) {
            this.state.bumpWallUpdate();
            this.startHurtAnimation();
        }
        return flag;
    }

    public limitedStepsUpdate(): void {
        this.state.limitedStepsUpdate();
    }

    public animate() {
        switch (this.state.getDirection()) {
            case 1:
                this.currentTile = (this.currentTile >= this.currentCharacter.upTile[0] && this.currentTile < this.currentCharacter.upTile[1]) ? this.currentTile + 1 : this.currentCharacter.upTile[0];
                break;
            case 2:
                this.currentTile = (this.currentTile >= this.currentCharacter.rightTile[0] && this.currentTile < this.currentCharacter.rightTile[1]) ? this.currentTile + 1 : this.currentCharacter.rightTile[0];
                break;
            case 3:
                this.currentTile = (this.currentTile >= this.currentCharacter.downTile[0] && this.currentTile < this.currentCharacter.downTile[1]) ? this.currentTile + 1 : this.currentCharacter.downTile[0];
                break;
            case 4:
                this.currentTile = (this.currentTile >= this.currentCharacter.leftTile[0] && this.currentTile < this.currentCharacter.leftTile[1]) ? this.currentTile + 1 : this.currentCharacter.leftTile[0];
                break;
        }
        const offsetX = (this.currentTile % this.tilesHorizontal) / this.tilesHorizontal;
        const offsetY = (this.tilesVertical - Math.floor(this.currentTile / this.tilesHorizontal) - 1) / this.tilesVertical;
        if (this.visual && this.visual.material && this.visual.material.map) {
            this.visual.material.map.offset.set(offsetX, offsetY);
        }
    }

    public startImmunity() {
        if (this.state.isDead() || this.state.isWin()) {
            return;
        }
        this.immunityMask.position.set(this.visual.position.x, this.visual.position.y, 5);
        this.immunityMask.material.opacity = 0.5;
        const flickerInterval = setInterval(() => {
            const opacity = this.visual.material.opacity === 1 ? 0.5 : 1;
            this.visual.material.opacity = opacity;
        }, 100);
        setTimeout(() => {
            clearInterval(flickerInterval);
            this.visual.material.opacity = 1;
            const shieldFailing = setInterval(() => {
                const opacity = this.immunityMask.material.opacity === 0.5 ? 0.1 : 0.5;
                this.immunityMask.material.opacity = opacity;
            }, 100);
            setTimeout(() => {
                clearInterval(shieldFailing);
                this.immunityMask.material.opacity = 0;
                this.state.setImmunity(false);
                // console.log("Immunity over");
            }, 2000);
        }, this.immunityPeriod - 2000);
    }

    public hitByBoss(): boolean {
        if (this.state.isImmune()) {
            // console.log("Player is immune");
            return false;
        }
        // console.log("Player is hit");
        const successHit = this.state.hitByProjectile();
        if (successHit) {
            this.startHurtAnimation();
            this.startImmunity();
        }
        return successHit;
    }
}