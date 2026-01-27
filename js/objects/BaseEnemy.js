import BaseGameObject from './BaseGameObject.js';
import { ENEMY_DATA } from '../data/enemy_data.js';
import BaseProjectile from './BaseProjectile.js';
import { EventManager } from '../managers/EventManager.js';
import DeathEffect from '../effects/DeathEffect.js';

export default class BaseEnemy extends BaseGameObject {
    constructor(scene, x, y, enemyType, target, difficultyMultiplier = 1) {
        super(scene, x, y);

        this.enemyData = ENEMY_DATA[enemyType];
        this.target = target;
        this.isDying = false;
        this.isStunned = false;
        this.stunEndTime = 0;
        this.goldReward = Math.ceil((this.enemyData.goldReward || 10) * difficultyMultiplier);

        // Status Effects
        this.speedModifier = 1;
        this.slowEndTime = 0;


        // --- Stats from Data ---
        this.health = this.enemyData.health * difficultyMultiplier;
        this.speed = this.enemyData.speed;
        this.attackData = this.enemyData.attack;
        this.attackData = this.enemyData.attack;
        this.attackTimer = 0; // Timer for attacks
        this.stunTimer = 0;   // Timer for stun
        this.slowTimer = 0;   // Timer for slow

        console.log(`Spawned ${this.enemyData.name} with Health: ${this.health}, Gold Reward: ${this.goldReward}`);

        if (this.enemyData.isBoss) {
            EventManager.emit('BOSS_SPAWNED', { enemy: this });
        }

        // --- Procedural Graphics ---

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
            } else if (shapeData.diagonal === 'cross') {
                graphics.lineBetween(halfSize, -halfSize, -halfSize, halfSize);
                graphics.lineBetween(-halfSize, -halfSize, halfSize, halfSize);
            }
        }
        this.add(graphics);
    }

    update(time, delta) {
        super.update(time, delta); // This updates and cleans up active effects

        // If the enemy is dying, wait for its effects to finish, then destroy it.
        if (this.isDying) {
            if (this.activeEffects.length === 0) {
                this.destroy();
            }
            return;
        }

        if (!this.active) {
            return;
        }

        // Stun Logic (Knockback recovery)
        if (this.isStunned) {
            this.stunTimer -= delta;
            if (this.stunTimer > 0) {
                // Apply drag to slow down from pushback
                this.body.drag.set(500);
                return; // Skip movement logic
            } else {
                this.isStunned = false;
                this.body.drag.set(0);
            }
        }

        // Slow Logic
        if (this.slowTimer > 0) {
            this.slowTimer -= delta;
            if (this.slowTimer <= 0) {
                this.speedModifier = 1;
            }
        }
        const currentSpeed = this.speed * this.speedModifier;

        if (!this.target) {
            this.body.setVelocity(0, 0);
            return;
        }

        // --- Movement and Attack Logic ---
        const distanceToTarget = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
        const attackType = this.attackData.type;

        if (attackType === 'melee') {
            const direction = new Phaser.Math.Vector2(this.target.x - this.x, this.target.y - this.y).normalize();
            this.body.setVelocity(direction.x * currentSpeed, direction.y * currentSpeed);

            if (distanceToTarget < 30) {
                this.die(); // Melee units die on impact
            }
        } else if (attackType === 'ranged') {
            const attackRange = 250;
            if (distanceToTarget > attackRange) {
                const direction = new Phaser.Math.Vector2(this.target.x - this.x, this.target.y - this.y).normalize();
                this.body.setVelocity(direction.x * currentSpeed, direction.y * currentSpeed);
            } else {
                this.body.setVelocity(0, 0);

                if (this.attackTimer > 0) {
                    this.attackTimer -= delta;
                }
                if (this.attackTimer <= 0) {
                    this.performRangedAttack();
                    this.attackTimer = this.attackData.fireRate;
                }
            }
        } else if (attackType === 'spawner') {
            const stopDistance = 300; // Stop a bit further away
            if (distanceToTarget > stopDistance) {
                const direction = new Phaser.Math.Vector2(this.target.x - this.x, this.target.y - this.y).normalize();
                this.body.setVelocity(direction.x * currentSpeed, direction.y * currentSpeed);
            } else {
                this.body.setVelocity(0, 0);
            }

            // Spawning Logic
            if (this.attackTimer > 0) {
                this.attackTimer -= delta;
            }
            if (this.attackTimer <= 0) {
                this.spawnMinion();
                this.attackTimer = this.attackData.spawnRate;
            }
        }
    }

    spawnMinion() {
        // Spawn a minion near the boss
        const spawnX = this.x + Phaser.Math.Between(-50, 50);
        const spawnY = this.y + Phaser.Math.Between(-50, 50);

        // Use the scene's spawnEnemy method but we need to adapt it since it picks a random edge position usually.
        // We'll instantiate BaseEnemy directly here.
        const minionType = this.attackData.spawnType;
        // Minions shouldn't be too hard, maybe scale them down or keep them base level.
        // Let's use the same difficulty multiplier as the boss for now, or 1.
        const minion = new BaseEnemy(this.scene, spawnX, spawnY, minionType, this.target, 1);
        this.scene.enemies.add(minion, true);

        // Visual effect for spawning
        this.scene.add.circle(spawnX, spawnY, 20, 0xffffff, 0.5).setDepth(10);
        // Fade out the circle
        // (Implementation omitted for brevity, but could be added)
    }

    stun(duration) {
        this.isStunned = true;
        this.stunTimer = duration;
    }

    applySlow(factor, duration) {
        this.speedModifier = factor;
        this.slowTimer = duration;

        // Visual feedback: Add a blue circle overlay
        if (!this.slowIndicator) {
            this.slowIndicator = this.scene.add.graphics();
            this.slowIndicator.fillStyle(0x0000ff, 0.3);
            this.slowIndicator.fillCircle(0, 0, this.body.width / 2 + 5);
            this.add(this.slowIndicator);
        }

        this.scene.time.delayedCall(duration, () => {
            if (this.active && this.scene.time.now >= this.slowEndTime) {
                if (this.slowIndicator) {
                    this.slowIndicator.destroy();
                    this.slowIndicator = null;
                }
            }
        });
    }

    applyKnockback(angle, force) {
        const velocityX = Math.cos(angle) * force;
        const velocityY = Math.sin(angle) * force;
        this.body.setVelocity(velocityX, velocityY);
        this.stun(300); // Stun briefly to allow knockback to take effect without immediate overwrite
    }

    performRangedAttack() {
        new BaseProjectile(this.scene, this.x, this.y, this.attackData.projectileType, this.target);
    }

    takeDamage(amount) {
        if (this.isDying) {
            return;
        }

        this.health -= amount;
        console.log(`'${this.enemyData.name}' took ${amount} damage, health is now ${this.health}`);

        EventManager.emit('ENEMY_HIT', { x: this.x, y: this.y, damage: amount });

        if (this.health <= 0) {
            this.die();
        } else {
            // Optional: Play a hit effect if not dead
            // this.playEffect(HitEffect);
        }
    }

    die() {
        if (this.isDying) {
            return;
        }
        this.isDying = true;

        // Immediately hide the enemy and disable its physics body
        this.setVisible(false);
        this.body.enable = false;

        EventManager.emit('ENEMY_DESTROYED', {
            x: this.x,
            y: this.y,
            color: this.enemyData.color,
            gold: this.goldReward
        });

        if (this.enemyData.isBoss) {
            EventManager.emit('BOSS_DEFEATED', { x: this.x, y: this.y });
        }

        // Play the death effect. The update loop will handle the final destruction.
        this.playEffect(DeathEffect, this.enemyData.color);
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
