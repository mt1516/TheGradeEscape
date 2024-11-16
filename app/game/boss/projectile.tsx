
"use client";

import * as THREE from 'three';

export default class Projectile {
    public visual: THREE.Sprite;
    private direction: THREE.Vector3;
    private speed: number;

    constructor(position: THREE.Vector3, direction: THREE.Vector3) {
        this.visual = this.renderProjectile();
        this.visual.position.copy(position);
        this.direction = direction;
        this.speed = 0.3;
    }

    private renderProjectile(): THREE.Sprite {
        let projectileTexture = new THREE.TextureLoader().load('/texture/ust.png');
        projectileTexture.magFilter = THREE.NearestFilter;
        projectileTexture.minFilter = THREE.NearestFilter;
        const projectileMaterial = new THREE.SpriteMaterial({ map: projectileTexture, sizeAttenuation: false });
        projectileMaterial.transparent = true;
        const projectile = new THREE.Sprite(projectileMaterial);
        projectile.scale.set(1, 1, 1);
        return projectile;
    }

    public update(deltaTime: number) {
        this.visual.position.add(this.direction.clone().multiplyScalar(this.speed * deltaTime));
    }

    public hasHitWall(): boolean {
        // Check if projectile has hit wall
        // if 
        return false;
    }
}