import Player from './player';
import StateMachine from './state-machine';
import Projectile from './projectile';
import * as THREE from 'three';

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
    private player: Player;
    constructor(characterSize: number[], hitboxWidth: number, mapStartCoord: number[], mapEndCoord: number[], mazeMap: number[][], player: Player, spawnPoint: number[]) {
        super(characterSize, hitboxWidth, mapStartCoord, mapEndCoord, mazeMap, 0);
        this.state = new StateMachine(mazeMap, characterSize, hitboxWidth, 0, mapStartCoord, mapEndCoord);
        this.visual = this.renderBoss();
        this.visual.position.set(spawnPoint[0], spawnPoint[1], 2);
        this.projectiles = [];
        this.lastMove = 200;
        this.lastNewProjectile = 200;
        this.lastProjectileUpdate = 200;
        this.player = player;
    }

    private renderBoss(): THREE.Sprite {
        // const offsetX = (this.currentTile % this.tilesHorizontal) / this.tilesHorizontal;
        // const offsetY = (this.tilesVertical - Math.floor(this.currentTile / this.tilesHorizontal)) / this.tilesVertical;
        let bossTexture = new THREE.TextureLoader().load('/texture/ust.png');
        bossTexture.magFilter = THREE.NearestFilter;
        bossTexture.minFilter = THREE.NearestFilter;
        const bossMaterial = new THREE.SpriteMaterial({ map: bossTexture, sizeAttenuation: false });
        bossMaterial.transparent = true;
        const boss = new THREE.Sprite(bossMaterial);
        boss.scale.set(3, 3, 1);
        return boss;
    }

    public update(tick: number): Projectile | null {
        this.lastMove -= tick;
        if (this.lastMove <= 0) {
            // move 
            // if (this.state.isMove()) {
            //     let [x, y] = this.state.update();
            //     this.visual.position.set(x, y, 3);
            // }

            // through walls
            this.chasePlayer(0.25);
        }
        
        this.lastProjectileUpdate -= tick;
        if (this.lastProjectileUpdate <= 0) {
            this.updateProjectiles(tick);
        }

        this.lastNewProjectile -= tick;
        if (this.lastNewProjectile <= 0) {
            return this.shootProjectiles();
        }

        // this.animate();
    }

    private chasePlayer(speed: number = 0.2) {
        const direction = new THREE.Vector3().subVectors(this.player.visual.position, this.visual.position).normalize();
        this.visual.position.add(direction.multiplyScalar(speed)); // Boss speed
    }

    private updateProjectiles(tick: number) {
        let remove: number[] = [];
        this.projectiles.forEach((projectile) => {
            projectile.update(tick)
            // check if projectile hitbox has hit player hitbox
            if (projectile.hasHitPlayer(this.player)) {
                projectile.visual.material.opacity = 0;
                remove.push(this.projectiles.indexOf(projectile));
                this.player.bumpWallUpdate();
            }
            // check if projectile has exited the map
            // if (projectile.visual.position.x < -100 || projectile.visual.position.y < -100 || projectile.visual.position.x > 100 || projectile.visual.position.y > 100) {
            //     projectile.opacity = 0;
            //     remove.push(this.projectiles.indexOf(projectile));
            // }

        });
        remove.forEach((index) => {
            this.projectiles.splice(index, 1);
        });
        this.lastProjectileUpdate = 5;
    }

    private shootProjectiles(): Projectile {
        const direction = new THREE.Vector3().subVectors(this.player.visual.position, this.visual.position).normalize();
        const projectile = new Projectile(this.visual.position.clone(), direction);
        this.projectiles.push(projectile);
        this.lastNewProjectile = 100;
        return projectile.visual;
    }

    // private animate() {
    //     // implemented after finding the texture
    //     return;
    // }
}