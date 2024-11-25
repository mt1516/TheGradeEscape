import * as THREE from 'three';

export default class Projectile {
    public visual: THREE.Sprite;
    private direction: THREE.Vector3;
    private speed: number;
    public exploded: boolean = false;

    constructor(position: THREE.Vector3, direction: THREE.Vector3, speed: number = 1) {
        this.visual = this.renderProjectile();
        this.visual.position.copy(position);
        this.direction = direction;
        this.speed = speed;
    }

    private renderProjectile(): THREE.Sprite {
        let projectileTexture = new THREE.TextureLoader().load('/texture/fbomb.png');
        projectileTexture.magFilter = THREE.NearestFilter;
        projectileTexture.minFilter = THREE.NearestFilter;
        projectileTexture.colorSpace = THREE.SRGBColorSpace;
        const projectileMaterial = new THREE.SpriteMaterial({ map: projectileTexture, sizeAttenuation: false });
        projectileMaterial.transparent = true;
        const projectile = new THREE.Sprite(projectileMaterial);
        projectile.scale.set(2, 2, 1);
        return projectile;
    }

    private renderExplosion(): THREE.Sprite {
        let explosionTexture = new THREE.TextureLoader().load('/texture/explode.png');
        explosionTexture.magFilter = THREE.NearestFilter;
        explosionTexture.minFilter = THREE.NearestFilter;
        explosionTexture.colorSpace = THREE.SRGBColorSpace;
        const explosionMaterial = new THREE.SpriteMaterial({ map: explosionTexture, sizeAttenuation: false });
        explosionMaterial.transparent = true;
        const explosion = new THREE.Sprite(explosionMaterial);
        explosion.scale.set(4, 4, 1);
        explosion.position.copy(this.visual.position);
        return explosion;
    }

    public explode() {
        this.exploded = true;
        return this.renderExplosion();
    }

    public update() {
        if (!this.exploded) {
            this.visual.position.add(this.direction.clone().multiplyScalar(this.speed));
        }
    }
        
    public hasHitPlayer(playerVisual: THREE.Sprite): boolean {
        let playerHitbox = playerVisual.scale.clone();
        let projectileHitbox = this.visual.scale.clone();
        let playerPos = playerVisual.position.clone();
        let projectilePos = this.visual.position.clone();
        let playerLeft = playerPos.x - playerHitbox.x / 2;
        let playerRight = playerPos.x + playerHitbox.x / 2;
        let playerTop = playerPos.y + playerHitbox.y / 2;
        let playerBottom = playerPos.y - playerHitbox.y / 2;
        let projectileLeft = projectilePos.x - projectileHitbox.x / 2;
        let projectileRight = projectilePos.x + projectileHitbox.x / 2;
        let projectileTop = projectilePos.y + projectileHitbox.y / 2;
        let projectileBottom = projectilePos.y - projectileHitbox.y / 2;
        return (playerLeft < projectileRight && playerRight > projectileLeft && playerTop > projectileBottom && playerBottom < projectileTop);
    }
}