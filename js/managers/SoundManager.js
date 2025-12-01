import { EventManager } from './EventManager.js';

export default class SoundManager {
    constructor(scene) {
        this.scene = scene;
        this.isMuted = false;

        // Listen for events to play sounds
        EventManager.on('TOWER_SHOOT', this.playShootSound, this);
        EventManager.on('ENEMY_HIT', this.playHitSound, this);
        EventManager.on('ENEMY_DESTROYED', this.playExplosionSound, this);
        EventManager.on('GAME_OVER', this.playGameOverSound, this);
        EventManager.on('TOWER_HIT', this.playTowerHitSound, this);
    }

    playShootSound() {
        if (this.isMuted) return;
        // Placeholder: console.log("Pew!");
        // this.scene.sound.play('shoot');
    }

    playHitSound() {
        if (this.isMuted) return;
        // Placeholder: console.log("Hit!");
    }

    playExplosionSound() {
        if (this.isMuted) return;
        // Placeholder: console.log("Boom!");
    }

    playTowerHitSound() {
        if (this.isMuted) return;
        // Placeholder: console.log("Clang!");
    }

    playGameOverSound() {
        if (this.isMuted) return;
        // Placeholder: console.log("Game Over!");
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    destroy() {
        EventManager.off('TOWER_SHOOT', this.playShootSound, this);
        EventManager.off('ENEMY_HIT', this.playHitSound, this);
        EventManager.off('ENEMY_DESTROYED', this.playExplosionSound, this);
        EventManager.off('GAME_OVER', this.playGameOverSound, this);
        EventManager.off('TOWER_HIT', this.playTowerHitSound, this);
    }
}
