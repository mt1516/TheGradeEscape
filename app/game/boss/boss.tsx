"use client";

import * as THREE from 'three';
import Player from '../player/player';
import Projectile from './projectile';

export default class Boss {
    public visual: THREE.Sprite;
    private player: Player;
    private projectiles: Projectile[];
    private steps: number;
    private shootInterval: number;
    private lastShootTime: number;
    private lastNewProjectile: number;

    constructor(player: Player, position: THREE.Vector3) {
        this.player = player;
        this.visual = this.renderBoss();
        this.visual.position.copy(position);
        this.projectiles = [];
        this.steps = 0;
        this.shootInterval = 1; // Shoot every second
        this.lastShootTime = 0;
        this.lastNewProjectile = 100;
    }

    private renderBoss(): THREE.Sprite {
        let bossTexture = new THREE.TextureLoader().load('/texture/ust.png');
        bossTexture.magFilter = THREE.NearestFilter;
        bossTexture.minFilter = THREE.NearestFilter;
        const bossMaterial = new THREE.SpriteMaterial({ map: bossTexture, sizeAttenuation: false });
        bossMaterial.transparent = true;
        const boss = new THREE.Sprite(bossMaterial);
        boss.scale.set(3, 3, 1);
        return boss;
    }

    public update(deltaTime: number) {
        this.chasePlayer();
        this.updateProjectiles(deltaTime);
        this.lastNewProjectile -= deltaTime;
        if (this.lastNewProjectile <= 0) {
            const new_projectile = this.shootProjectiles(deltaTime);
            this.lastNewProjectile = 100;
            return new_projectile;
        }
        return null;
    }

    private chasePlayer() {
        const direction = new THREE.Vector3().subVectors(this.player.visual.position, this.visual.position).normalize();
        this.visual.position.add(direction.multiplyScalar(0.25)); // Boss speed
    }

    private shootProjectiles(deltaTime: number) {
        this.lastShootTime += deltaTime;
        if (this.lastShootTime >= this.shootInterval) {
            const direction = new THREE.Vector3().subVectors(this.player.visual.position, this.visual.position).normalize();
            const projectile = new Projectile(this.visual.position.clone(), direction);
            this.projectiles.push(projectile);
            this.lastShootTime = 0;
            return projectile.visual;
        }
    }

    private updateProjectiles(deltaTime: number) {
        this.projectiles.forEach((projectile, index) => {
            projectile.update(deltaTime);
            if (projectile.hasHitWall()) {
                this.projectiles.splice(index, 1);
            }
        });
    }
}
