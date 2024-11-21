import * as THREE from 'three';

export default class Projectile {
    public visual: THREE.Sprite;
    private direction: THREE.Vector3;
    private speed: number;

    constructor(position: THREE.Vector3, direction: THREE.Vector3) {
        this.visual = this.renderProjectile();
        this.visual.position.copy(position);
        this.direction = direction;
        this.speed = 2;
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

    public update() {
        this.visual.position.add(this.direction.clone().multiplyScalar(this.speed));
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