import BaseGameObject from './BaseGameObject.js';
import TowerSummonEffect from '../effects/TowerSummonEffect.js';

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
        this.attackDamage = 10;
        this.attackRange = 270;
        this.attackSpeed = 1000;
        this.lastAttackTime = 0;

        // --- Spawn Effect ---
        this.spawnEffect = this.playEffect(TowerSummonEffect);
        this.setVisible(false);
    }

    findTarget() {
        let closestEnemy = null;
        let closestDistance = Infinity;

        this.enemiesGroup.getChildren().forEach(enemy => {
            if (enemy.active) {
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
                this.spawnEffect = null;
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

    attack(target) {
        // For now, this is an "instant hit" attack.
        console.log(`Tower is attacking ${target.data.name}!`);
        // In a real game, this would be: target.takeDamage(this.attackDamage);
    }

    playHitEffect() {
        console.log(`Tower at (${Math.round(this.x)}, ${Math.round(this.y)}) was hit!`);
    }

    playDestroyEffect() {
        console.log(`Tower at (${Math.round(this.x)}, ${Math.round(this.y)}) was destroyed!`);
    }
}
