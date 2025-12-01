import { WEAPON_DATA } from '../data/weapon_data.js';
import { PROJECTILE_DATA } from '../data/projectile_data.js';
import BaseProjectile from './BaseProjectile.js';

export class Weapon {
    constructor(scene, tower, type) {
        this.scene = scene;
        this.tower = tower;
        this.type = type;
        this.data = JSON.parse(JSON.stringify(WEAPON_DATA[type])); // Deep copy to allow independent upgrades

        // Ensure effects object exists
        if (!this.data.effects) {
            // If it's a ranged weapon with a projectile type, try to inherit effects from projectile data
            if (this.data.projectileType && PROJECTILE_DATA[this.data.projectileType] && PROJECTILE_DATA[this.data.projectileType].effects) {
                this.data.effects = { ...PROJECTILE_DATA[this.data.projectileType].effects };
            } else {
                this.data.effects = { slowChance: 0, knockbackChance: 0, chainChance: 0 };
            }
        }

        this.level = 1;
        this.lastFireTime = 0;
    }

    update(time, delta) {
        // Override in subclasses
    }

    upgrade(stat) {
        const upgradeData = WEAPON_DATA[this.type].upgrades[stat];
        if (!upgradeData) return;

        if (upgradeData.increment) {
            this.data[stat] += upgradeData.increment;
        }
        if (upgradeData.decrement) {
            this.data[stat] = Math.max(upgradeData.min || 0, this.data[stat] - upgradeData.decrement);
        }

        console.log(`Upgraded ${this.type} ${stat} to ${this.data[stat]}`);
    }

    getUpgradeCost(stat) {
        const baseCost = WEAPON_DATA[this.type].upgrades[stat].cost;
        // Simple scaling: Base + (Level * 25) - simplified for now, can be complex later
        // We need to track levels per stat if we want per-stat cost scaling.
        // For now, let's just return base cost to keep it simple as per prompt requirements (or add scaling if needed).
        // The prompt says "Upgrade... increase by 0.5", doesn't specify cost scaling explicitly but usually it scales.
        // Let's assume constant cost for now or simple scaling.
        return baseCost;
    }
}

export class RangedWeapon extends Weapon {
    constructor(scene, tower, type) {
        super(scene, tower, type);
    }

    update(time, delta) {
        if (time > this.lastFireTime + this.data.speed) {
            const targets = this.findTargets(this.data.multishot);
            if (targets.length > 0) {
                this.fire(targets);
                this.lastFireTime = time;
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

export class MeleeWeapon extends Weapon {
    constructor(scene, tower, type) {
        super(scene, tower, type);
        this.orbitAngle = 0;
        this.blades = [];
        this.createBlades();
    }

    createBlades() {
        // Clear existing
        this.blades.forEach(b => b.destroy());
        this.blades = [];

        for (let i = 0; i < this.data.count; i++) {
            const blade = this.scene.add.circle(0, 0, 10, 0xff0000);
            this.scene.physics.add.existing(blade);
            this.blades.push(blade);
        }
    }

    update(time, delta) {
        // Re-create blades if count changed (upgrade)
        if (this.blades.length !== this.data.count) {
            this.createBlades();
        }

        this.orbitAngle += this.data.speed * (delta / 1000);

        const radius = this.data.range;
        const angleStep = (Math.PI * 2) / this.blades.length;

        this.blades.forEach((blade, index) => {
            const angle = this.orbitAngle + (index * angleStep);
            blade.x = this.tower.x + Math.cos(angle) * radius;
            blade.y = this.tower.y + Math.sin(angle) * radius;

            // Collision check
            this.tower.enemiesGroup.getChildren().forEach(enemy => {
                if (enemy.active && !enemy.isDying) {
                    if (this.scene.physics.overlap(blade, enemy)) {
                        // Simple cooldown per enemy to avoid instant kill? 
                        // Or just continuous damage. Let's do continuous damage with a small timer on enemy?
                        // For simplicity, let's just hit.
                        // Ideally, we need an "immune" timer on enemy for melee hits.
                        if (!enemy.lastMeleeHit || time > enemy.lastMeleeHit + 500) {
                            enemy.takeDamage(this.data.damage);
                            enemy.lastMeleeHit = time;

                            // Visual effect
                            this.scene.tweens.add({
                                targets: blade,
                                scale: 1.5,
                                duration: 100,
                                yoyo: true
                            });
                        }
                    }
                }
            });
        });
    }

    upgrade(stat) {
        super.upgrade(stat);
        if (stat === 'count') {
            this.createBlades();
        }
    }
}
