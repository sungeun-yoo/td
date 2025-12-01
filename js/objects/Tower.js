import BaseGameObject from './BaseGameObject.js';
import TowerSummonEffect from '../effects/TowerSummonEffect.js';
import { EventManager } from '../managers/EventManager.js';

export default class Tower extends BaseGameObject {
    constructor(scene, x, y, enemiesGroup) {
        super(scene, x, y);
        this.enemiesGroup = enemiesGroup;

        // --- Graphics ---
        // ... (rest of graphics code is unchanged)
        const towerBody = this.scene.add.graphics();
        towerBody.lineStyle(5, 0xffffff, 1);
        towerBody.strokeCircle(0, 0, 24);
        this.add(towerBody);

        const innerDashedShield = this.scene.add.graphics();
        const radius = 180;
        const totalSteps = 100;
        innerDashedShield.lineStyle(2, 0xffffff, 0.8);
        for (let i = 0; i < totalSteps; i += 2) {
            const startAngle = Phaser.Math.DegToRad(-90 + (i / totalSteps) * 360);
            const endAngle = Phaser.Math.DegToRad(-90 + ((i + 1) / totalSteps) * 360);
            innerDashedShield.beginPath();
            innerDashedShield.arc(0, 0, radius, startAngle, endAngle, false);
            innerDashedShield.strokePath();
        }
        this.add(innerDashedShield);

        const attackRangeCircle = this.scene.add.graphics();
        attackRangeCircle.lineStyle(3, 0xffffff, 1);
        attackRangeCircle.strokeCircle(0, 0, 270);
        this.add(attackRangeCircle);

        this.towerBody = towerBody;
        this.innerDashedShield = innerDashedShield;
        this.attackRangeCircle = attackRangeCircle;


        // --- Properties ---
        this.energy = 100;
        this.attackDamage = 25; // Buffed from 20
        this.attackRange = 270;
        this.attackSpeed = 400; // Buffed from 500
        this.lastAttackTime = 0;

        // --- Upgrade Levels ---
        this.upgradeLevels = {
            damage: 1,
            range: 1,
            speed: 1
        };

        this.upgradeCosts = {
            damage: 50,
            range: 50,
            speed: 50
        };

        // --- Spawn Effect ---
        this.spawnEffect = this.playEffect(TowerSummonEffect);
        this.setVisible(false);
    }

    findTarget() {
        let closestEnemy = null;
        let closestDistance = Infinity;

        this.enemiesGroup.getChildren().forEach(enemy => {
            // Target must be active and not in the process of dying.
            if (enemy.active && !enemy.isDying) {
                const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestEnemy = enemy;
                }
            }
        });

        if (closestDistance <= this.attackRange) {
            return closestEnemy;
        }
        return null;
    }

    update(time, delta) {
        super.update(time, delta);

        if (this.spawnEffect) {
            if (this.spawnEffect.isFinished) {
                this.setVisible(true);
                this.spawnEffect = null; // Set to null before emitting to prevent re-triggering
                EventManager.emit('TOWER_SPAWNED', this);
                console.log('Tower has spawned and emitted TOWER_SPAWNED event.');
            }
            return;
        }

        const target = this.findTarget();
        if (target) {
            if (time > this.lastAttackTime + this.attackSpeed) {
                this.attack(target);
                this.lastAttackTime = time;
            }
        }
    }

    updateAttackRangeCircle(newRange) {
        this.attackRangeCircle.clear();
        this.attackRangeCircle.lineStyle(3, 0xffffff, 1);
        this.attackRangeCircle.strokeCircle(0, 0, newRange);
    }

    attack(target) {
        // 1. Inflict damage on the target
        if (target && target.active && typeof target.takeDamage === 'function') {
            target.takeDamage(this.attackDamage);
        }

        EventManager.emit('TOWER_SHOOT', { x: this.x, y: this.y });

        // 2. Create visual effect (a temporary laser line)
        const laser = this.scene.add.graphics();
        laser.lineStyle(2, 0xffffff, 0.8);
        laser.lineBetween(this.x, this.y, target.x, target.y);

        // Use a tween to make the laser fade out and then destroy itself
        this.scene.tweens.add({
            targets: laser,
            alpha: 0,
            duration: 200, // Laser beam lasts for 0.2 seconds
            ease: 'Sine.easeOut',
            onComplete: () => {
                laser.destroy();
            }
        });
    }

    playHitEffect() {
        console.log(`Tower at (${Math.round(this.x)}, ${Math.round(this.y)}) was hit!`);
    }

    playDestroyEffect() {
        console.log(`Tower at (${Math.round(this.x)}, ${Math.round(this.y)}) was destroyed!`);
    }

    takeDamage(amount) {
        this.energy -= amount;
        console.log(`Tower took ${amount} damage, energy is now ${this.energy}`);

        if (this.energy <= 0 && this.active) {
            // The 'destroy' event is emitted by the parent class,
            // which GameScene listens for to trigger the GAME_OVER event.
            this.destroy();
        } else {
            this.playHitEffect();
            EventManager.emit('TOWER_HIT', { x: this.x, y: this.y });
        }
    }
    getUpgradeCost(type) {
        // Simple linear cost scaling: Base + (Level * 25)
        const baseCost = 50;
        return baseCost + (this.upgradeLevels[type] - 1) * 25;
    }

    upgrade(type) {
        this.upgradeLevels[type]++;

        switch (type) {
            case 'damage':
                this.attackDamage += 5;
                console.log(`Upgraded Damage to ${this.attackDamage}`);
                break;
            case 'range':
                this.attackRange += 20;
                this.updateAttackRangeCircle(this.attackRange);
                console.log(`Upgraded Range to ${this.attackRange}`);
                break;
            case 'speed':
                this.attackSpeed = Math.max(100, this.attackSpeed - 50); // Cap at 100ms
                console.log(`Upgraded Speed to ${this.attackSpeed}`);
                break;
        }
    }
}
