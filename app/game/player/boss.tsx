import Player from './player';
import StateMachine from './state-machine';
import Projectile from './projectile';
import * as THREE from 'three';

export class updateMessage {
    public projectiles: (Projectile)[];
    public explosions: THREE.Sprite[];
    public hasNewProjectile: boolean;
    public playerHit: boolean;
    constructor(projectile: Projectile[], hasNewProjectile: boolean, playerHit: boolean) {
        this.projectiles = projectile;
        this.explosions = [];
        this.hasNewProjectile = hasNewProjectile;
        this.playerHit = playerHit;
        return this;
    }
}

export default class Boss extends Player {
    public projectiles: Projectile[];
    private lastNewProjectile: number;
    private lastProjectileUpdate: number;
    private player: Player;
    private chargedAttack: number;
    constructor(characterSize: number[], hitboxWidth: number, mapStartCoord: number[], mapEndCoord: number[], mazeMap: number[][], player: Player, spawnPoint: number[]) {
        super(characterSize, hitboxWidth, mapStartCoord, mapEndCoord, mazeMap, 0);
        this.tilesHorizontal = 4;
        this.tilesVertical = 2;
        this.state = new StateMachine(mazeMap, characterSize, hitboxWidth, 0, mapStartCoord, mapEndCoord);
        this.visual = this.renderBoss();
        this.visual.position.set(spawnPoint[0], spawnPoint[1], 2);
        this.projectiles = [];
        this.lastMove = 10000;
        this.lastNewProjectile = 10000;
        this.lastProjectileUpdate = 10000;
        this.lastAnimate = 10000;
        this.player = player;
        this.chargedAttack = Math.max(Math.floor(Math.random() * 20), 10);
        this.movePeriod = 300;
        this.animatePeriod = 300;
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

    public update(deltaTime: number): updateMessage {
        const message = new updateMessage([], false, false);
        console.log(this.projectiles.length);
        this.lastMove -= deltaTime;
        if (this.lastMove <= 0) {
            this.chasePlayer(0.5);
        }
        
        this.lastProjectileUpdate -= deltaTime;
        if (this.lastProjectileUpdate <= 0) {
            message.playerHit = this.updateProjectiles(message);
        }

        this.lastNewProjectile -= deltaTime;
        if (this.lastNewProjectile <= 0) {
            const newProjectile = this.shootProjectiles();
            message.projectiles = [newProjectile];
            message.hasNewProjectile = true;
        }

        if (this.chargedAttack <= 0) {
            message.projectiles = [...(message.projectiles), ...this.performChargedAttack()];
        }

        this.lastAnimate -= deltaTime;
        if (this.lastAnimate <= 0) {
            this.animate();
        }

        return message;
    }

    private chasePlayer(speed: number = 0.2) {
        const direction = new THREE.Vector3().subVectors(this.player.visual.position, this.visual.position).normalize();
        this.visual.position.add(direction.multiplyScalar(speed)); // Boss speed
        this.lastMove = this.movePeriod;
        
        if (direction.x < 0) {
            this.state.setDirection(4);
        } else {
            this.state.setDirection(2);
        }
    }

    private updateProjectiles(message: updateMessage): boolean {
        let playerHit = false;
        let remove: number[] = [];
        this.projectiles.forEach((projectile) => {
            projectile.update();
            // check if projectile hitbox has hit player hitbox
            if (projectile.hasHitPlayer(this.player.visual)) {
                playerHit = true;
                projectile.visual.material.opacity = 0;
                message.explosions.push(projectile.explode());
                if (this.hurtSound.isPlaying) {
                    this.hurtSound.stop();
                }
                this.audioLoader.load('/sounds/explode.mp3', (buffer) => {
                    this.hurtSound.setBuffer(buffer);
                    this.hurtSound.setLoop(false);
                    this.hurtSound.setVolume(1);
                    this.hurtSound.play();
                });
                remove.push(this.projectiles.indexOf(projectile));
            }
            // check if projectile has exited the map
            if (projectile.visual.position.x < -100 || projectile.visual.position.y < -100 || projectile.visual.position.x > 100 || projectile.visual.position.y > 100) {
                projectile.visual.material.opacity = 0;
                remove.push(this.projectiles.indexOf(projectile));
            }

        });
        if (remove.length > 0) {
            for (let i = remove.length - 1; i >= 0; i--) {
                const index = remove[i];
                this.projectiles[index].visual.material.opacity = 0;
                this.projectiles.splice(index, 1);
            }
        }
        this.lastProjectileUpdate = 100;
        return playerHit;
    }

    private shootProjectiles(): Projectile {
        const direction = new THREE.Vector3().subVectors(this.player.visual.position, this.visual.position).normalize();
        const projectile = new Projectile(this.visual.position.clone(), direction, 1);
        this.projectiles.push(projectile);
        this.chargedAttack -= 1;
        this.lastNewProjectile = Math.max(Math.floor(Math.random() * 25), 1500);
        return projectile;

    }

    private performChargedAttack(): Projectile[] {
        const projectiles: Projectile[] = [];
        // const numberProjectile = this.player.visual.position.distanceTo(this.visual.position) > 20 ? 36 : 24;
        let numberProjectile = 0;
        const distance = this.player.visual.position.distanceTo(this.visual.position);
        if (distance > 40) {
            numberProjectile = 24;
        } else {
            numberProjectile = 12;
        }
        const angleStep = (2 * Math.PI) / numberProjectile;
        for (let i = 0; i < numberProjectile; i++) {
            const angle = i * angleStep;
            const direction = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
            const projectile = new Projectile(this.visual.position.clone(), direction, 1);
            this.projectiles.push(projectile);
            projectiles.push(projectile);
        }
        this.chargedAttack = Math.max(Math.floor(Math.random() * 20), 10);
        return projectiles;
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
        this.lastAnimate = this.animatePeriod;
    }
}