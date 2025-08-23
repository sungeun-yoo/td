import BaseGameObject from './BaseGameObject.js';
import { ENEMY_DATA } from '../data/enemy_data.js';
import BaseProjectile from './BaseProjectile.js';
import { EventManager } from '../managers/EventManager.js';
import DeathEffect from '../effects/DeathEffect.js';

export default class BaseEnemy extends BaseGameObject {
    constructor(scene, x, y, enemyType, target) {
        super(scene, x, y);

        this.enemyData = ENEMY_DATA[enemyType];
        this.target = target;

        // --- Stats from Data ---
        this.health = this.enemyData.health;
        this.speed = this.enemyData.speed;
        this.attackData = this.enemyData.attack;
        this.lastAttackTime = 0;

        // --- Procedural Graphics ---
        this.drawShape();

        // --- Physics Body ---
        const size = this.enemyData.shape.size;
        this.body.setSize(size, size);

        // --- Event Listeners ---
        EventManager.on('WAVE_CLEAR', this.onWaveClear, this);
        EventManager.on('GAME_OVER', this.onGameOver, this);
        this.on('destroy', this.onDestroy, this);
    }

    drawShape() {
        const graphics = this.scene.add.graphics();
        const shapeData = this.enemyData.shape;
        const size = shapeData.size;
        const halfSize = size / 2;

        graphics.lineStyle(2, this.enemyData.color, 1);

        if (shapeData.type === 'square') {
            if (shapeData.hollow) {
                graphics.strokeRect(-halfSize, -halfSize, size, size);
            } else {
                graphics.fillStyle(this.enemyData.color, 1);
                graphics.fillRect(-halfSize, -halfSize, size, size);
            }

            if (shapeData.diagonal === 'tr-bl') {
                graphics.lineBetween(halfSize, -halfSize, -halfSize, halfSize);
            }
        }
        this.add(graphics);
    }

    update(time, delta) {
        super.update(time, delta); // Manages effects

        // If the super.update() call resulted in the object being destroyed (e.g. from an effect),
        // stop further processing.
        if (!this.active) {
            return;
        }

        if (!this.target) {
            this.body.setVelocity(0, 0);
            return;
        }

        // --- Movement and Attack Logic ---
        const distanceToTarget = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
        const attackType = this.attackData.type;

        if (attackType === 'melee') {
            const direction = new Phaser.Math.Vector2(this.target.x - this.x, this.target.y - this.y).normalize();
            this.body.setVelocity(direction.x * this.speed, direction.y * this.speed);

            if (distanceToTarget < 30) {
                 this.destroy(); // Melee units are destroyed on impact
            }
        } else if (attackType === 'ranged') {
            const attackRange = 250;
            if (distanceToTarget > attackRange) {
                const direction = new Phaser.Math.Vector2(this.target.x - this.x, this.target.y - this.y).normalize();
                this.body.setVelocity(direction.x * this.speed, direction.y * this.speed);
            } else {
                this.body.setVelocity(0, 0);
                if (time > this.lastAttackTime + this.attackData.fireRate) {
                    this.performRangedAttack();
                    this.lastAttackTime = time;
                }
            }
        }
    }

    performRangedAttack() {
        new BaseProjectile(this.scene, this.x, this.y, this.attackData.projectileType, this.target);
    }

    takeDamage(amount) {
        if (!this.active) {
            return; // Don't take damage if already dying
        }

        this.health -= amount;
        console.log(`'${this.enemyData.name}' took ${amount} damage, health is now ${this.health}`);

        if (this.health <= 0) {
            // Immediately hide the enemy and disable its physics body
            this.setVisible(false);
            this.body.enable = false;

            // Play the death effect and destroy the object once the effect is complete
            this.playEffect(DeathEffect, this.enemyData.color).on('complete', () => {
                this.destroy();
            });
        } else {
            // Optional: Play a hit effect if not dead
            // this.playEffect(HitEffect);
        }
    }

    onWaveClear() {
        // When the wave is cleared, this enemy should be removed.
        console.log(`'${this.enemyData.name}' is being removed due to WAVE_CLEAR.`);
        this.destroy();
    }

    onGameOver() {
        // When the game is over, this enemy should be removed.
        console.log(`'${this.enemyData.name}' is being removed due to GAME_OVER.`);
        this.destroy();
    }

    destroy(fromScene) {
        if (!this.active) {
            return; // Already being destroyed
        }

        // Manually destroy children to avoid the suspected error in Phaser's container destroy logic.
        // The children are just graphics objects in this class.
        this.list.forEach(child => {
            child.destroy();
        });

        // Call the parent's destroy method.
        // This will handle emitting the 'destroy' event (which our onDestroy handler listens for),
        // and removing the object from the scene and physics.
        super.destroy(fromScene);
    }

    onDestroy() {
        // Clean up the global event listeners when this object is destroyed.
        EventManager.off('WAVE_CLEAR', this.onWaveClear, this);
        EventManager.off('GAME_OVER', this.onGameOver, this);
    }
}
