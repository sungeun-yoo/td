import BaseGameObject from './BaseGameObject.js';
import { PROJECTILE_DATA } from '../data/projectile_data.js';

export default class BaseProjectile extends BaseGameObject {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {string} projectileType The key for the projectile's data.
     * @param {BaseGameObject} target The game object to fly towards.
     * @param {number} [damageOverride] Optional damage override.
     * @param {object} [effectsOverride] Optional effects override.
     */
    constructor(scene, x, y, projectileType, target, damageOverride, effectsOverride) {
        super(scene, x, y);

        this.projectileData = PROJECTILE_DATA[projectileType];
        this.target = target;
        this.speed = this.projectileData.speed;

        // Damage and Effects (merged from data and overrides)
        this.damage = damageOverride !== undefined ? damageOverride : this.projectileData.damage;
        this.effects = effectsOverride || { ...this.projectileData.effects };

        // Draw the projectile's shape
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(this.projectileData.color, 1);
        if (this.projectileData.shape.type === 'circle') {
            graphics.fillCircle(0, 0, this.projectileData.shape.radius);
        }
        // Can add other shapes like 'square' here later
        this.add(graphics);

        // Match the physics body size to the graphic
        this.body.setSize(this.projectileData.shape.radius * 2, this.projectileData.shape.radius * 2);

        // Set its velocity towards the target
        // This is a one-time calculation. For a homing missile, this logic would be in update().
        if (this.target) {
            const direction = new Phaser.Math.Vector2(this.target.x - this.x, this.target.y - this.y).normalize();
            this.body.setVelocity(direction.x * this.speed, direction.y * this.speed);
        }
    }

    update(time, delta) {
        super.update(time, delta);

        // A simple way to handle collision: check distance.
        // A better way is to use physics overlap detection in the scene.
        if (this.target && this.active) {
            const distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
            if (distance < 20) {
                this.onHit(this.target);
            }
        }

        // Destroy projectile if it goes too far off-screen
        if (!Phaser.Geom.Rectangle.Overlaps(this.scene.physics.world.bounds, this.getBounds())) {
            this.destroy();
        }
    }

    onHit(target) {
        if (target && target.active && typeof target.takeDamage === 'function') {
            target.takeDamage(this.damage);

            // Apply Effects
            if (this.effects.slowChance > 0 && Math.random() < this.effects.slowChance) {
                if (typeof target.applySlow === 'function') target.applySlow(0.5, 2000); // 50% slow for 2s
            }
            if (this.effects.knockbackChance > 0 && Math.random() < this.effects.knockbackChance) {
                if (typeof target.applyKnockback === 'function') {
                    const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
                    target.applyKnockback(angle, 200); // force 200
                }
            }
        }

        console.log(`'${this.projectileData.name}' hit the target!`);

        // Chain Logic (formerly Pierce)
        if (this.effects.chainChance > 0) {
            if (Math.random() < this.effects.chainChance) {
                // Pierced! 
                // We need to avoid hitting the same target again immediately.
                this.hitList = this.hitList || [];
                this.hitList.push(target);

                // Stop homing if we pierce, just keep going? 
                // Or just retarget? For now, let's stop homing to simulate "passing through".
                this.target = null;
                return;
            }
        }

        this.destroy();
    }
}
