import BaseGameObject from './BaseGameObject.js';
import TowerSummonEffect from '../effects/TowerSummonEffect.js';
import { EventManager } from '../managers/EventManager.js';
import { RangedWeapon, MeleeWeapon } from './Weapon.js';

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

        // Weapon System
        this.weaponSlots = [];
        this.addWeapon('default_weapon'); // Initialize with default weapon

        // --- Upgrade Levels (Kept for UI compatibility, but delegates to default weapon) ---
        // These now track the *Default Weapon's* upgrade levels
        this.upgradeLevels = {
            damage: 1,
            range: 1,
            speed: 1
        };

        // Costs are now retrieved from the weapon itself, but we keep this structure if needed for UI
        // actually UI calls getUpgradeCost, so we can remove this hardcoded object if we update getUpgradeCost.
        // But let's keep it simple.


        // --- Spawn Effect ---
        this.spawnEffect = this.playEffect(TowerSummonEffect);
        this.setVisible(false);
    }

    // findTarget() removed - handled by Weapon classes

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

        // Update all weapons
        this.weaponSlots.forEach(weapon => weapon.update(time, delta));
    }

    addWeapon(type) {
        let weapon;
        if (type === 'default_weapon') {
            weapon = new RangedWeapon(this.scene, this, type);
        } else if (type === 'melee_weapon') {
            weapon = new MeleeWeapon(this.scene, this, type);
        }

        if (weapon) {
            this.weaponSlots.push(weapon);
            console.log(`Added weapon: ${type}`);
        }
    }

    updateAttackRangeCircle(newRange) {
        this.attackRangeCircle.clear();
        this.attackRangeCircle.lineStyle(3, 0xffffff, 1);
        this.attackRangeCircle.strokeCircle(0, 0, newRange);
    }

    // attack(target) removed - handled by Weapon classes

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
        // Delegate to default weapon for basic stats
        if (this.weaponSlots.length > 0) {
            return this.weaponSlots[0].getUpgradeCost(type);
        }
        return 0;
    }

    upgrade(type) {
        this.upgradeLevels[type]++;

        // Delegate to default weapon
        if (this.weaponSlots.length > 0) {
            this.weaponSlots[0].upgrade(type);

            // If range upgraded, update visual circle
            if (type === 'range') {
                this.updateAttackRangeCircle(this.weaponSlots[0].data.range);
            }
        }
    }

    useShockwave() {
        const range = 500;
        const damage = 50;
        const pushForce = 300;

        // Visual Effect
        const shockwave = this.scene.add.circle(this.x, this.y, 10, 0x00ffff, 0.5);
        this.scene.tweens.add({
            targets: shockwave,
            radius: range,
            alpha: 0,
            duration: 500,
            onComplete: () => shockwave.destroy()
        });

        // Logic
        this.enemiesGroup.getChildren().forEach(enemy => {
            if (!enemy.active) return;

            const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
            if (distance <= range) {
                // Damage
                if (typeof enemy.takeDamage === 'function') {
                    enemy.takeDamage(damage);
                }

                // Pushback
                const angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
                const velocityX = Math.cos(angle) * pushForce;
                const velocityY = Math.sin(angle) * pushForce;

                // Apply velocity directly (assuming Arcade Physics)
                if (enemy.body) {
                    enemy.body.setVelocity(velocityX, velocityY);
                    // Disable normal movement temporarily? 
                    // BaseEnemy update resets velocity, so we might need a "stunned" state or just let the physics engine handle the impulse for one frame.
                    // To make it noticeable, let's stun them briefly.
                    enemy.stun(500); // We need to implement this in BaseEnemy
                }
            }
        });

        console.log("Shockwave used!");
    }
}
