import { Weapon } from './Weapon.js';
import BaseProjectile from '../BaseProjectile.js';

export class RangedWeapon extends Weapon {
    constructor(scene, tower, type) {
        super(scene, tower, type);
        this.fireTimer = 0;
    }

    update(time, delta) {
        if (this.fireTimer > 0) {
            this.fireTimer -= delta;
        }

        if (this.fireTimer <= 0) {
            const targets = this.findTargets(this.data.multishot);
            if (targets.length > 0) {
                this.fire(targets);
                this.fireTimer = this.data.speed;
            }
        }
    }

    findTargets(count) {
        const enemies = this.tower.enemiesGroup.getChildren();
        const validEnemies = enemies.filter(e => e.active && !e.isDying &&
            Phaser.Math.Distance.Between(this.tower.x, this.tower.y, e.x, e.y) <= this.data.range);

        // Sort by distance (closest first)
        validEnemies.sort((a, b) => {
            const distA = Phaser.Math.Distance.Between(this.tower.x, this.tower.y, a.x, a.y);
            const distB = Phaser.Math.Distance.Between(this.tower.x, this.tower.y, b.x, b.y);
            return distA - distB;
        });

        return validEnemies.slice(0, count);
    }

    fire(targets) {
        targets.forEach(target => {
            // Instant Hit Logic (Laser)
            if (target && target.active && typeof target.takeDamage === 'function') {
                target.takeDamage(this.data.damage);

                // Apply Effects
                if (this.data.effects.slowChance > 0 && Math.random() < this.data.effects.slowChance) {
                    if (typeof target.applySlow === 'function') target.applySlow(0.5, 2000);
                }
                if (this.data.effects.knockbackChance > 0 && Math.random() < this.data.effects.knockbackChance) {
                    if (typeof target.applyKnockback === 'function') {
                        const angle = Phaser.Math.Angle.Between(this.tower.x, this.tower.y, target.x, target.y);
                        target.applyKnockback(angle, 200);
                    }
                }
            }

            // Visual Effect (Laser Beam)
            // Random offset for start position if multishot to look cool? Or just center.
            // User asked for "randomly move slightly" for multishot.
            const startX = this.tower.x + (Math.random() - 0.5) * 10;
            const startY = this.tower.y + (Math.random() - 0.5) * 10;

            const laser = this.scene.add.graphics();
            laser.lineStyle(2, 0xffffff, 0.8);
            laser.lineBetween(startX, startY, target.x, target.y);

            this.scene.tweens.add({
                targets: laser,
                alpha: 0,
                duration: 200,
                ease: 'Sine.easeOut',
                onComplete: () => {
                    laser.destroy();
                }
            });

            // Chain Logic
            if (this.data.effects.chainChance > 0 && Math.random() < this.data.effects.chainChance) {
                // Try to find a target behind the current one
                this.fireChain(target);
            }
        });
    }

    fireChain(primaryTarget) {
        // Find closest enemy to the primary target (excluding itself)
        const enemies = this.tower.enemiesGroup.getChildren();
        let closestEnemy = null;
        let closestDist = 500; // Increased range to allow hitting enemies far outside tower range

        enemies.forEach(enemy => {
            if (enemy === primaryTarget || !enemy.active || enemy.isDying) return;

            const dist = Phaser.Math.Distance.Between(primaryTarget.x, primaryTarget.y, enemy.x, enemy.y);
            if (dist < closestDist) {
                closestDist = dist;
                closestEnemy = enemy;
            }
        });

        if (closestEnemy) {
            // Hit the chained enemy
            closestEnemy.takeDamage(this.data.damage);

            // Visual Effect (Chain Laser)
            const laser = this.scene.add.graphics();
            laser.lineStyle(2, 0x00ffff, 0.8); // Cyan for chain
            laser.lineBetween(primaryTarget.x, primaryTarget.y, closestEnemy.x, closestEnemy.y);

            this.scene.tweens.add({
                targets: laser,
                alpha: 0,
                duration: 200,
                ease: 'Sine.easeOut',
                onComplete: () => {
                    laser.destroy();
                }
            });
        }
    }
}
