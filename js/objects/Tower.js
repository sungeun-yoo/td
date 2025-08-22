import BaseGameObject from './BaseGameObject.js';

export default class Tower extends BaseGameObject {
    /**
     * @param {Phaser.Scene} scene The Scene to which this Game Object belongs.
     * @param {number} x The horizontal position of this Game Object in the world.
     * @param {number} y The vertical position of this Game Object in the world.
     */
    constructor(scene, x, y) {
        super(scene, x, y);

        // The Tower is a container. We add its visual components as children.
        // The positions of children are relative to the container's origin (0,0).

        // 1. Tower Body
        const towerBody = this.scene.add.graphics();
        towerBody.fillStyle(0x6666ff, 1); // A nice blue for the tower
        towerBody.fillCircle(0, 0, 24);
        this.add(towerBody);

        // 2. Two Shields
        const innerShield = this.scene.add.graphics();
        innerShield.lineStyle(2, 0x00ffff, 0.7); // Cyan shield
        innerShield.strokeCircle(0, 0, 35);
        this.add(innerShield);

        const outerShield = this.scene.add.graphics();
        outerShield.lineStyle(1, 0xffffff, 0.5); // White, fainter shield
        outerShield.strokeCircle(0, 0, 45);
        this.add(outerShield);

        // Store references to the parts in case we want to animate them later
        this.towerBody = towerBody;
        this.innerShield = innerShield;
        this.outerShield = outerShield;

        // --- Define Tower Properties ---
        this.energy = 100; // Health of the tower
        this.attackDamage = 10;
        this.attackRange = 270; // Matches the summon effect's outer circle
        this.attackSpeed = 1000; // Milliseconds between attacks
        this.lastAttackTime = 0; // To track cooldown
    }

    update(time, delta) {
        // This is where tower logic, like finding a target and attacking, would go.
        // For now, let's just make it try to attack periodically to show it works.

        // A placeholder for a target. In a real game, you would get this from a list of enemies.
        const target = { name: 'Enemy', x: this.x + 100, y: this.y };

        // Check if the target is in range
        const distance = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);

        if (distance <= this.attackRange) {
            // Check if the tower can attack (based on attackSpeed)
            if (time > this.lastAttackTime + this.attackSpeed) {
                this.attack(target);
                this.lastAttackTime = time; // Update the last attack time
            }
        }
    }

    attack(target) {
        // For now, this just logs a message.
        // Later, this could create a projectile or deal damage directly.
        console.log(`Tower at (${Math.round(this.x)}, ${Math.round(this.y)}) is attacking ${target.name}!`);
    }
}
