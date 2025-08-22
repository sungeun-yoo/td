import BaseGameObject from './BaseGameObject.js';
import { ENEMY_DATA } from '../data/enemy_data.js';
import BaseProjectile from './BaseProjectile.js';

export default class BaseEnemy extends BaseGameObject {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {string} enemyType The key for the enemy's data.
     * @param {BaseGameObject} target The game object to move towards and attack.
     */
    constructor(scene, x, y, enemyType, target) {
        super(scene, x, y);

        this.data = ENEMY_DATA[enemyType];
        this.target = target;

        // --- Stats from Data ---
        this.health = this.data.health;
        this.speed = this.data.speed;
        this.attackData = this.data.attack;
        this.lastAttackTime = 0;

        // --- Procedural Graphics ---
        this.drawShape();

        // --- Physics Body ---
        const size = this.data.shape.size;
        this.body.setSize(size, size);
    }

    drawShape() {
        const graphics = this.scene.add.graphics();
        const shapeData = this.data.shape;
        const size = shapeData.size;
        const halfSize = size / 2;

        graphics.lineStyle(2, this.data.color, 1);

        if (shapeData.type === 'square') {
            if (shapeData.hollow) {
                graphics.strokeRect(-halfSize, -halfSize, size, size);
            } else {
                graphics.fillStyle(this.data.color, 1);
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

        if (!this.target || !this.active) {
            this.body.setVelocity(0, 0);
            return;
        }

        const distanceToTarget = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
        const attackType = this.attackData.type;

        if (attackType === 'melee') {
            // Move directly towards the target
            const direction = new Phaser.Math.Vector2(this.target.x - this.x, this.target.y - this.y).normalize();
            this.body.setVelocity(direction.x * this.speed, direction.y * this.speed);

            // Check for collision (a simple distance check)
            if (distanceToTarget < 30) {
                 console.log(`'${this.data.name}' hit the tower with a melee attack!`);
                 // In a real game: this.target.takeDamage(this.attackData.damage);
                 this.destroy(); // Melee units are destroyed on impact
            }
        } else if (attackType === 'ranged') {
            const attackRange = 250; // Ranged enemies stop at a distance
            if (distanceToTarget > attackRange) {
                // Move towards target if too far
                const direction = new Phaser.Math.Vector2(this.target.x - this.x, this.target.y - this.y).normalize();
                this.body.setVelocity(direction.x * this.speed, direction.y * this.speed);
            } else {
                // Stop when in range and attack
                this.body.setVelocity(0, 0);
                if (time > this.lastAttackTime + this.attackData.fireRate) {
                    this.performRangedAttack();
                    this.lastAttackTime = time;
                }
            }
        }
    }

    performRangedAttack() {
        console.log(`'${this.data.name}' is firing a projectile!`);
        new BaseProjectile(this.scene, this.x, this.y, this.attackData.projectileType, this.target);
    }
}
