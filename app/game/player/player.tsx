"use client";

import * as THREE from 'three';
import StateMachine from './state-machine';
import { Mode } from '../game'

// var hurtAnimiationResetFrame = 5;

export default class Player {
    public state: StateMachine;
    public visual: THREE.Sprite;
    protected currentTile: number;
    protected tilesHorizontal: number;
    protected tilesVertical: number;
    // private hurtAnimiationFrameCount: number;
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
        this.tilesHorizontal = 3;
        this.tilesVertical = 4;
        this.state = new StateMachine(mazeMap, characterSize, hitboxWidth, limitedSteps, mapStartCoord, mapEndCoord);
        // console.log("this.mapX, this.mapY, this.left, this.right, this.top, this.bottom = ", this.mapX, this.mapY, this.leftX, this.rightP, this.topP, this.bottomY);
        this.visual = this.renderPlayer();
        this.visual.position.set(mapStartCoord[0], mapStartCoord[1] + Math.floor(characterSize[1] / 2), 2);
        // this.hurtAnimiationFrameCount = 0;
        this.hurtSound = new THREE.Audio(new THREE.AudioListener());
        this.immunityPeriod = 5000;
        this.immunityMask = new THREE.Mesh(new THREE.CircleGeometry(2), new THREE.MeshBasicMaterial({ color: 0xffd500, transparent: true, opacity: 0 }));
        this.immunityMask.position.set(mapStartCoord[0], mapStartCoord[1] + Math.floor(characterSize[1] / 2), 5);
        this.lastMove = 0;
        this.lastAnimate = 0;
        this.movePeriod = 100;
        this.animatePeriod = 100;
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
        // this.hurtAnimiationFrameCount = 1;
        this.audioLoader.load('/sounds/hurtsound.mp3', (buffer) => {
            this.hurtSound.setBuffer(buffer);
            this.hurtSound.setLoop(false);
            this.hurtSound.setVolume(1);
            this.hurtSound.play();
        });
        // if (this.state.isDead() || this.state.isWin()) {
        //     return;
        // }
        setTimeout(() => {
            this.visual.material.color.setHex(0xffffff);
        }, 200);
    }

    // private hurtAnimation() {
    //     if (this.hurtAnimiationFrameCount > 0) {
    //         this.hurtAnimiationFrameCount++;
    //         this.hurtAnimationCallback()
    //     }
    // }

    // private hurtAnimationCallback() {
    //     if (this.hurtAnimiationFrameCount > hurtAnimiationResetFrame) {
    //         this.hurtAnimiationFrameCount = 0;
    //         this.visual.material.color.setHex(0xffffff);
    //     }
    // }

    public bumpWallUpdate(): boolean {
        let flag = this.state.getbumpWallFlag()
        // if (flag && this.hurtAnimiationFrameCount === 0) {
        if (flag) {
            this.state.bumpWallUpdate();
            this.startHurtAnimation();
        }
        return flag;
    }

    public limitedStepsUpdate(): boolean {
        return this.state.limitedStepsUpdate();
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
                console.log("Immunity over");
            }, 2000);
        }, this.immunityPeriod - 2000);
    }

    public hitByBoss(): boolean {
        // console.log(this.state.isImmune(), this.state.immunity);
        if (this.state.isImmune()) {
            console.log("Player is immune");
            return false;
        }
        console.log("Player is hit");
        const successHit = this.state.hitByProjectile();
        if (successHit) {
            this.startHurtAnimation();
            this.startImmunity();
        }
        return successHit;
    }
}