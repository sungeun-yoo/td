import BaseGameObject from './BaseGameObject.js';
import TowerSummonEffect from '../effects/TowerSummonEffect.js';

export default class Tower extends BaseGameObject {
    constructor(scene, x, y) {
        super(scene, x, y);

        // --- Graphics ---
        const towerBody = this.scene.add.graphics();
        towerBody.lineStyle(5, 0xffffff, 1);
        towerBody.strokeCircle(0, 0, 24);
        this.add(towerBody);

        // Inner Dashed Shield
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
        this.attackDamage = 10;
        this.attackRange = 270;
        this.attackSpeed = 1000;
        this.lastAttackTime = 0;

        // --- Spawn Effect ---
        // Use the generic effect player from the base class.
        this.spawnEffect = this.playEffect(TowerSummonEffect);
        this.setVisible(false);
    }

    update(time, delta) {
        // Call the parent's update method to manage the effect lifecycle.
        super.update(time, delta);

        // If the spawn effect is playing, wait for it to finish.
        if (this.spawnEffect) {
            if (this.spawnEffect.isFinished) {
                this.setVisible(true);
                this.spawnEffect = null; // We no longer need to track it.
            }
            return; // Don't run attack logic until the spawn is complete.
        }

        // --- Attack Logic ---
        const target = { name: 'Enemy', x: this.x + 100, y: this.y };
        const distance = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);

        if (distance <= this.attackRange) {
            if (time > this.lastAttackTime + this.attackSpeed) {
                this.attack(target);
                this.lastAttackTime = time;
            }
        }
    }

    attack(target) {
        console.log(`Tower at (${Math.round(this.x)}, ${Math.round(this.y)}) is attacking ${target.name}!`);
    }

    playHitEffect() {
        // Placeholder for when the tower is hit.
        console.log(`Tower at (${Math.round(this.x)}, ${Math.round(this.y)}) was hit!`);
    }

    playDestroyEffect() {
        // Placeholder for when the tower is destroyed.
        console.log(`Tower at (${Math.round(this.x)}, ${Math.round(this.y)}) was destroyed!`);
    }
}
