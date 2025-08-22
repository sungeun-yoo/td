import BaseGameObject from './BaseGameObject.js';
import { PROJECTILE_DATA } from '../data/projectile_data.js';

export default class BaseProjectile extends BaseGameObject {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {string} projectileType The key for the projectile's data.
     * @param {BaseGameObject} target The game object to fly towards.
     */
    constructor(scene, x, y, projectileType, target) {
        super(scene, x, y);

        this.data = PROJECTILE_DATA[projectileType];
        this.target = target;
        this.speed = this.data.speed;
        this.damage = this.data.damage;

        // Draw the projectile's shape
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(this.data.color, 1);
        if (this.data.shape.type === 'circle') {
            graphics.fillCircle(0, 0, this.data.shape.radius);
        }
        // Can add other shapes like 'square' here later
        this.add(graphics);

        // Match the physics body size to the graphic
        this.body.setSize(this.data.shape.radius * 2, this.data.shape.radius * 2);

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
            if (distance < 20) { // A small threshold to register a hit.
                // In a real game, you would apply damage to the target here.
                // this.target.takeDamage(this.damage);
                console.log(`'${this.data.name}' hit the target!`);
                this.destroy(); // Destroy the projectile on hit.
            }
        }

        // Destroy projectile if it goes too far off-screen
        if (!Phaser.Geom.Rectangle.Overlaps(this.scene.physics.world.bounds, this.getBounds())) {
            this.destroy();
        }
    }
}
