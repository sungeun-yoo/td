import FloatingTextManager from '../managers/FloatingTextManager.js';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        // Initialize FloatingTextManager in this scene (which is unscaled)
        this.floatingTextManager = new FloatingTextManager(this);

        // Bring this scene to top
        this.scene.bringToTop();
    }
}
