// This class serves as a base for all game objects like enemies, players, shields, etc.
// It extends Phaser.GameObjects.Sprite, but you could change it to Phaser.GameObjects.Container
// if you need to group multiple objects (e.g., a sprite and a health bar).

export default class BaseGameObject extends Phaser.GameObjects.Sprite {
    /**
     * @param {Phaser.Scene} scene The Scene to which this Game Object belongs.
     * @param {number} x The horizontal position of this Game Object in the world.
     * @param {number} y The vertical position of this Game Object in the world.
     * @param {string} texture The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
     * @param {string|number} [frame] An optional frame from the Texture this Game Object is rendering with.
     */
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // Add the game object to the scene. This is important for it to be rendered and updated.
        this.scene.add.existing(this);
    }

    // This is where you would add methods common to all your game objects.
    // For example, if all objects have health and can take damage:
    //
    // initHealth(health) {
    //     this.health = health;
    // }
    //
    // takeDamage(amount) {
    //     this.health -= amount;
    //     if (this.health <= 0) {
    //         this.die();
    //     }
    // }
    //
    // die() {
    //     // Could play an animation, drop loot, etc.
    //     this.destroy();
    // }
}
