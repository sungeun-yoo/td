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

        // Add the game object to the scene's display and physics lists.
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.activeEffects = []; // To store and manage running effects.
    }

    // A generic update method for the base class.
    // Subclasses should call super.update(time, delta) if they override this.
    update(time, delta) {
        // Update all active effects.
        // We loop backwards because an effect might be removed from the list during iteration.
        for (let i = this.activeEffects.length - 1; i >= 0; i--) {
            const effect = this.activeEffects[i];
            effect.update(time, delta);
            if (effect.isFinished) {
                effect.destroy();
                this.activeEffects.splice(i, 1); // Remove from the list.
            }
        }
    }

    /**
     * Creates and plays an effect associated with this game object.
     * @param {class} EffectClass The class of the effect to play (e.g., TowerSummonEffect).
     * @param {...any} args Additional arguments to pass to the effect's start method.
     * @returns The instance of the effect that was created.
     */
    playEffect(EffectClass, ...args) {
        const effect = new EffectClass(this.scene);
        // We assume the effect's start method takes x, y as its first two arguments.
        effect.start(this.x, this.y, ...args);
        this.activeEffects.push(effect);
        return effect;
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
