import Tower from './objects/Tower.js';
import BaseEnemy from './objects/BaseEnemy.js';
import BaseProjectile from './objects/BaseProjectile.js'; // Though not used directly here, good to have for context

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.tower = null;
        this.enemies = null;
        this.projectiles = null;
    }

    create() {
        // Create groups to manage enemies and projectiles
        this.enemies = this.physics.add.group({ classType: BaseEnemy, runChildUpdate: true });
        this.projectiles = this.physics.add.group({ classType: BaseProjectile, runChildUpdate: true });

        const towerX = this.cameras.main.width / 2;
        const towerY = this.cameras.main.height / 2;

        // Create the tower and pass it the enemies group for targeting
        this.tower = new Tower(this, towerX, towerY, this.enemies);

        // Spawn enemies periodically
        this.time.addEvent({
            delay: 2000, // spawn an enemy every 2 seconds
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });

        // Setup collision detection
        // Note: In a real game, the callbacks would handle damage and destruction.
        this.physics.add.overlap(this.tower, this.enemies, (tower, enemy) => {
            console.log(`Melee enemy '${enemy.data.name}' reached the tower!`);
            enemy.destroy(); // Destroy the enemy on collision
            // tower.takeDamage(enemy.attackData.damage);
        });

        this.physics.add.overlap(this.tower, this.projectiles, (tower, projectile) => {
             console.log(`Tower was hit by a projectile!`);
             projectile.destroy();
             // tower.takeDamage(projectile.damage);
        });
    }

    spawnEnemy() {
        // For demonstration, spawn enemies from the top of the screen at a random x position
        const x = Phaser.Math.Between(100, this.cameras.main.width - 100);
        const y = 0;

        // Alternate between spawning the two types of enemies
        const enemyType = Math.random() < 0.5 ? 'enemy_type_1' : 'enemy_type_2';

        const enemy = new BaseEnemy(this, x, y, enemyType, this.tower);
        this.enemies.add(enemy, true); // Add to the group
    }

    update(time, delta) {
        // The groups will automatically call update on their children (runChildUpdate: true).
        // We only need to call update on the tower, as it's not in a group.
        if (this.tower) {
            this.tower.update(time, delta);
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
