import { EventManager } from './EventManager.js';

export default class ParticleManager {
    constructor(scene) {
        this.scene = scene;
        this.createParticleTextures();

        this.initEmitters();

        // Listeners
        EventManager.on('ENEMY_DESTROYED', this.playExplosion, this);
        EventManager.on('ENEMY_HIT', this.playHit, this);
        EventManager.on('TOWER_SHOOT', this.playShootEffect, this);
        EventManager.on('TOWER_HIT', this.playTowerHit, this);
    }

    createParticleTextures() {
        // Check if textures already exist to avoid recreation on restart
        if (this.scene.textures.exists('particle_circle')) return;

        // Create a simple white circle texture
        const graphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(8, 8, 8);
        graphics.generateTexture('particle_circle', 16, 16);

        // Create a flare/spark texture
        graphics.clear();
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(4, 4, 4);
        graphics.generateTexture('particle_spark', 8, 8);

        graphics.destroy();
    }

    initEmitters() {
        // --- Explosion Particles ---
        this.explosionParticles = this.scene.add.particles('particle_circle');
        this.explosionParticles.setDepth(100); // Ensure they are on top
        this.explosionEmitter = this.explosionParticles.createEmitter({
            active: true,
            on: false, // Don't emit automatically
            lifespan: { min: 300, max: 600 },
            speed: { min: 100, max: 400 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.8, end: 0 },
            alpha: { start: 1, end: 0 },
            blendMode: 'ADD',
            gravityY: 0
        });

        // --- Hit Sparks ---
        this.hitParticles = this.scene.add.particles('particle_spark');
        this.hitParticles.setDepth(101);
        this.hitEmitter = this.hitParticles.createEmitter({
            active: true,
            on: false,
            lifespan: { min: 100, max: 300 },
            speed: { min: 100, max: 300 },
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        });
    }

    playExplosion(data) {
        const { x, y, color } = data;
        this.explosionEmitter.setTint(color || 0xff8800);
        this.explosionEmitter.explode(30, x, y);

        // Optional: Screen shake on explosion
        this.scene.cameras.main.shake(100, 0.005);
    }

    playHit(data) {
        const { x, y } = data;
        this.hitEmitter.setTint(0xffffaa);
        this.hitEmitter.explode(5, x, y);
    }

    playShootEffect(data) {
        const { x, y } = data;
        // Muzzle flash using sparks
        this.hitEmitter.setTint(0x00ffff);
        this.hitEmitter.explode(10, x, y);
    }

    playTowerHit(data) {
        // Stronger screen shake for tower damage
        this.scene.cameras.main.shake(200, 0.01);

        // Red flash particles
        const { x, y } = data;
        this.hitEmitter.setTint(0xff0000);
        this.hitEmitter.explode(20, x, y);
    }

    destroy() {
        EventManager.off('ENEMY_DESTROYED', this.playExplosion, this);
        EventManager.off('ENEMY_HIT', this.playHit, this);
        EventManager.off('TOWER_SHOOT', this.playShootEffect, this);
        EventManager.off('TOWER_HIT', this.playTowerHit, this);
    }
}
