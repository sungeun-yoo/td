export default class BaseEffect {
    /**
     * @param {Phaser.Scene} scene The Scene to which this effect belongs.
     */
    constructor(scene) {
        this.scene = scene;
        this.isFinished = false;
    }

    /**
     * Starts the effect.
     * Should be overridden by subclasses.
     */
    start() {
        // To be implemented by subclasses
    }

    /**
     * Updates the effect on each frame.
     * @param {number} time The current time.
     * @param {number} delta The delta time in ms since the last frame.
     * Should be overridden by subclasses.
     */
    update(time, delta) {
        // To be implemented by subclasses
    }
}
