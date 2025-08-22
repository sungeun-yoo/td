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

        // 1. Tower Body - A stroked circle to match the summon effect's final frame
        const towerBody = this.scene.add.graphics();
        towerBody.lineStyle(5, 0xffffff, 1); // 5px thickness, white
        towerBody.strokeCircle(0, 0, 24); // 24px radius
        this.add(towerBody);

        // 2. Outer Attack Range Indicator
        const attackRangeCircle = this.scene.add.graphics();
        attackRangeCircle.lineStyle(3, 0xffffff, 1); // 3px thickness, white
        attackRangeCircle.strokeCircle(0, 0, 270); // 270px radius
        this.add(attackRangeCircle);

        // Store references to the parts
        this.towerBody = towerBody;
        this.attackRangeCircle = attackRangeCircle;

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
