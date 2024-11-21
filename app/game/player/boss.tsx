import Player from './player';
import StateMachine from './state-machine';
import Projectile from './projectile';
import * as THREE from 'three';

export class updateMessage {
    public projectile: Projectile | null;
    public hasNewProjectile: boolean;
    public playerHit: boolean;
    constructor(projectile: Projectile | null, hasNewProjectile: boolean, playerHit: boolean) {
        this.projectile = projectile;
        this.hasNewProjectile = hasNewProjectile;
        this.playerHit = playerHit;
        return this;
    }
}

export default class Boss extends Player {
    // public state: StateMachine;
    // public visual: THREE.Sprite;
    // protected currentTile: number;
    // protected tilesHorizontal: number;
    // protected tilesVertical: number;
    private projectiles: Projectile[];
    private lastMove: number;
    private lastNewProjectile: number;
    private lastProjectileUpdate: number;
    private lastAnimate: number;
    private player: Player;
    constructor(characterSize: number[], hitboxWidth: number, mapStartCoord: number[], mapEndCoord: number[], mazeMap: number[][], player: Player, spawnPoint: number[]) {
        super(characterSize, hitboxWidth, mapStartCoord, mapEndCoord, mazeMap, 0);
        this.tilesHorizontal = 4;
        this.tilesVertical = 2;
        this.state = new StateMachine(mazeMap, characterSize, hitboxWidth, 0, mapStartCoord, mapEndCoord);
        this.visual = this.renderBoss();
        this.visual.position.set(spawnPoint[0], spawnPoint[1], 2);
        this.projectiles = [];
        this.lastMove = 400;
        this.lastNewProjectile = 400;
        this.lastProjectileUpdate = 400;
        this.lastAnimate = 400;
        this.player = player;
    }

    private renderBoss(): THREE.Sprite {
        const offsetX = (this.currentTile % this.tilesHorizontal) / this.tilesHorizontal;
        const offsetY = (this.tilesVertical - Math.floor(this.currentTile / this.tilesHorizontal)) / this.tilesVertical;
        let bossTexture = new THREE.TextureLoader().load('/texture/Boss.png');
        bossTexture.magFilter = THREE.NearestFilter;
        bossTexture.minFilter = THREE.NearestFilter;
        bossTexture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);
        bossTexture.offset.set(offsetX, offsetY);
        const bossMaterial = new THREE.SpriteMaterial({ map: bossTexture, sizeAttenuation: false });
        bossMaterial.transparent = true;
        const boss = new THREE.Sprite(bossMaterial);
        boss.scale.set(4, 4, 1);
        return boss;
    }

    public update(tick: number): updateMessage {
        const message = new updateMessage(null, false, false);
        if (this.player.state.isDead() === true) {
            return message;
        }

        this.lastMove -= tick;
        if (this.lastMove <= 0) {
            // move 
            // if (this.state.isMove()) {
            //     let [x, y] = this.state.update();
            //     this.visual.position.set(x, y, 3);
            // }

            // through walls
            // console.log("this.state.isMove() = ", this.state.isMove());
            // this.chasePlayer(0.2);
        }
        
        this.lastProjectileUpdate -= tick;
        if (this.lastProjectileUpdate <= 0) {
            message.playerHit = this.updateProjectiles(tick);
        }

        this.lastNewProjectile -= tick;
        if (this.lastNewProjectile <= 0) {
            message.projectile = this.shootProjectiles();
            message.hasNewProjectile = true;
        }

        this.lastAnimate -= tick;
        if (this.lastAnimate <= 0) {
            this.animate();
        }

        return message;
    }

    private chasePlayer(speed: number = 0.2) {
        const direction = new THREE.Vector3().subVectors(this.player.visual.position, this.visual.position).normalize();
        this.visual.position.add(direction.multiplyScalar(speed)); // Boss speed
        this.lastMove = 2;
        
        if (direction.x < 0) {
            this.state.setDirection(4);
        } else {
            this.state.setDirection(2);
        }
    }

    private updateProjectiles(tick: number) {
        let playerHit = false;
        let remove: number[] = [];
        this.projectiles.forEach((projectile) => {
            projectile.update(tick)
            // check if projectile hitbox has hit player hitbox
            if (projectile.hasHitPlayer(this.player.visual)) {
                playerHit = true;
                projectile.visual.material.opacity = 0;
                remove.push(this.projectiles.indexOf(projectile));
                // this.player.bumpWallUpdate();
            }
            // check if projectile has exited the map
            if (projectile.visual.position.x < -100 || projectile.visual.position.y < -100 || projectile.visual.position.x > 100 || projectile.visual.position.y > 100) {
                remove.push(this.projectiles.indexOf(projectile));
            }

        });
        if (remove.length > 0) {
            remove.forEach((index) => {
                this.projectiles.splice(index, 1);
            });
        }
        this.lastProjectileUpdate = 5;
        return playerHit;
    }

    private shootProjectiles(): Projectile {
        const direction = new THREE.Vector3().subVectors(this.player.visual.position, this.visual.position).normalize();
        const projectile = new Projectile(this.visual.position.clone(), direction, );
        this.projectiles.push(projectile);
        this.lastNewProjectile = 100;
        return projectile;
    }

    public animate() {
        switch (this.state.getDirection()) {
            case 2:
                this.currentTile = (this.currentTile >= 0 && this.currentTile < 3) ? this.currentTile + 1 : 0;
                break;
            case 4:
                this.currentTile = (this.currentTile >= 4 && this.currentTile < 7) ? this.currentTile + 1 : 4;
                break;
        }
        const offsetX = (this.currentTile % this.tilesHorizontal) / this.tilesHorizontal;
        const offsetY = (this.tilesVertical - Math.floor(this.currentTile / this.tilesHorizontal) - 1) / this.tilesVertical;
        if (this.visual && this.visual.material && this.visual.material.map) {
            this.visual.material.map.offset.set(offsetX, offsetY);
        }
        this.lastAnimate = 10;
    }
}