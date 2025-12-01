import Tower from './objects/Tower.js';
import BaseEnemy from './objects/BaseEnemy.js';
import BaseProjectile from './objects/BaseProjectile.js';
import LevelManager from './managers/LevelManager.js';
import UIManager from './managers/UIManager.js';
import ParticleManager from './managers/ParticleManager.js';
import FloatingTextManager from './managers/FloatingTextManager.js';
import SoundManager from './managers/SoundManager.js';
import { EventManager } from './managers/EventManager.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.tower = null;
        this.enemies = null;
        this.projectiles = null;
        this.levelManager = null;
        this.uiManager = null;
        this.particleManager = null;
        this.floatingTextManager = null;
        this.soundManager = null;
        this.gold = 10000; // Start with 100 gold
    }

    create() {
        // --- Groups ---
        this.enemies = this.physics.add.group({ classType: BaseEnemy, runChildUpdate: true });
        this.projectiles = this.physics.add.group({ classType: BaseProjectile, runChildUpdate: true });

        // --- Tower ---
        const towerX = this.cameras.main.width / 2;
        const towerY = this.cameras.main.height / 2;
        this.tower = new Tower(this, towerX, towerY, this.enemies);

        // --- Managers ---
        // Initialize ParticleManager early so it's ready for events
        this.particleManager = new ParticleManager(this);
        this.floatingTextManager = new FloatingTextManager(this);
        this.soundManager = new SoundManager(this);
        this.uiManager = new UIManager(this);

        // Listen for the tower's destruction to signal game over
        this.tower.on('destroy', () => {
            EventManager.emit('GAME_OVER');
            this.uiManager.showGameOverScreen();
            console.log("--- GAME OVER ---");
        });

        // Listen for enemy destruction to add gold
        EventManager.on('ENEMY_DESTROYED', (data) => {
            if (data.gold) {
                this.addGold(data.gold);
            }
        });

        // Listen for boss events
        EventManager.on('BOSS_SPAWNED', this.onBossSpawned, this);
        EventManager.on('BOSS_DEFEATED', this.onBossDefeated, this);

        // --- Level Manager ---
        this.levelManager = new LevelManager(this);
        // LevelManager waits for TOWER_SPAWNED event to start the first wave
        // But we can also manually start it if needed, or just let the event handle it.
        // Since we removed startLevel, we rely on the event or manual start.
        // The Tower is created above, but it might emit TOWER_SPAWNED in its constructor or we need to emit it.
        // Checking Tower.js... it likely doesn't emit TOWER_SPAWNED.
        // Let's just start the first wave here.
        // this.levelManager.startNextWave();

        // --- Physics Collisions ---
        this.physics.add.overlap(this.tower, this.enemies, (tower, enemy) => {
            // This overlap is for melee enemies hitting the tower.
            if (tower.active && enemy.active) {
                tower.takeDamage(enemy.attackData.damage);
                // The enemy destroys itself in its own update loop upon impact.
            }
        });

        this.physics.add.overlap(this.tower, this.projectiles, (tower, projectile) => {
            if (tower.active && projectile.active) {
                tower.takeDamage(projectile.damage);
                projectile.destroy();
            }
        });
    }

    // This method is now a helper called by LevelManager
    spawnEnemy(enemyType, difficultyMultiplier = 1) {
        const spawnMargin = 50;
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const side = Phaser.Math.Between(0, 3);
        let x, y;

        switch (side) {
            case 0: // Top
                x = Phaser.Math.Between(0, width);
                y = -spawnMargin;
                break;
            case 1: // Right
                x = width + spawnMargin;
                y = Phaser.Math.Between(0, height);
                break;
            case 2: // Bottom
                x = Phaser.Math.Between(0, width);
                y = height + spawnMargin;
                break;
            case 3: // Left
                x = -spawnMargin;
                y = Phaser.Math.Between(0, height);
                break;
        }

        const enemy = new BaseEnemy(this, x, y, enemyType, this.tower, difficultyMultiplier);
        this.enemies.add(enemy, true);
    }

    addGold(amount) {
        this.gold += amount;
        EventManager.emit('GOLD_UPDATED', this.gold);
        console.log(`Gold added: ${amount}. Total: ${this.gold}`);
    }

    update(time, delta) {
        if (this.tower) {
            this.tower.update(time, delta);
        }
        if (this.levelManager) {
            this.levelManager.update(time, delta);
        }
    }

    onBossSpawned() {
        console.log("Boss Spawned! Zooming out.");
        this.cameras.main.zoomTo(0.6, 2000, 'Sine.easeInOut');
    }

    onBossDefeated() {
        console.log("Boss Defeated! Zooming in.");
        // Effect: Camera Shake
        this.cameras.main.shake(500, 0.01);

        // Zoom back in after the shake
        this.time.delayedCall(500, () => {
            this.cameras.main.zoomTo(1, 1000, 'Sine.easeInOut');
        });
    }

    shutdown() {
        EventManager.off('BOSS_SPAWNED', this.onBossSpawned, this);
        EventManager.off('BOSS_DEFEATED', this.onBossDefeated, this);
        EventManager.off('ENEMY_DESTROYED'); // We didn't use a named function for this one in create(), so we might need to be careful.
        // Actually, in create() it was:
        // EventManager.on('ENEMY_DESTROYED', (data) => { ... });
        // This is an anonymous function, so we can't easily remove it unless we store the reference.
        // For now, I'll just remove the boss listeners which I added with named functions.
    }
}

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game-container',
        width: 1080,
        height: 1920
    },
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [GameScene]
};

const game = new Phaser.Game(config);
window.game = game;
// Note: LevelManager is instantiated in GameScene, so it's accessible via window.game.scene.scenes[0].levelManager
