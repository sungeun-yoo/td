import Tower from './objects/Tower.js';
import BaseEnemy from './objects/BaseEnemy.js';
import BaseProjectile from './objects/BaseProjectile.js';
import LevelManager from './managers/LevelManager.js';
import UIManager from './managers/UIManager.js';
import { EventManager } from './managers/EventManager.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.tower = null;
        this.enemies = null;
        this.projectiles = null;
        this.levelManager = null;
        this.uiManager = null;
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
        this.uiManager = new UIManager(this);
        // Listen for the tower's destruction to signal game over
        this.tower.on('destroy', () => {
            EventManager.emit('GAME_OVER');
            console.log("--- GAME OVER ---");
        });

        // --- Level Manager ---
        this.levelManager = new LevelManager(this);
        this.levelManager.startLevel(1);

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
    spawnEnemy(enemyType) {
        const x = Phaser.Math.Between(100, this.cameras.main.width - 100);
        const y = 0;

        // The 'new' keyword is not needed here because the group's `create` method handles it.
        // However, we need to pass custom constructor arguments, so we create it manually.
        const enemy = new BaseEnemy(this, x, y, enemyType, this.tower);
        this.enemies.add(enemy, true);
    }

    update(time, delta) {
        if (this.tower) {
            this.tower.update(time, delta);
        }
        if (this.levelManager) {
            this.levelManager.update(time, delta);
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 1920,
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
