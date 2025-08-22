// This class serves as a base for all game objects like enemies, players, shields, etc.
// It extends Phaser.GameObjects.Container to allow grouping multiple sprites and graphics.
export default class BaseGameObject extends Phaser.GameObjects.Container {
    /**
     * @param {Phaser.Scene} scene The Scene to which this Game Object belongs.
     * @param {number} x The horizontal position of this Game Object in the world.
     * @param {number} y The vertical position of this Game Object in the world.
     */
    constructor(scene, x, y) {
        // The constructor for a Container takes the scene, x, and y position.
        // Children objects (like sprites or graphics) will be added to this container.
        super(scene, x, y);

        // Add the game object to the scene's display list.
        this.scene.add.existing(this);
    }

    // Common methods for all game objects can be added here.
    // For example:
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
