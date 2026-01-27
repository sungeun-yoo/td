import { EventManager } from './EventManager.js';

export default class FloatingTextManager {
    constructor(scene) {
        this.scene = scene;
        this.pool = this.scene.add.group({
            classType: Phaser.GameObjects.Text,
            runChildUpdate: true
        });

        EventManager.on('ENEMY_HIT', this.showDamageText, this);
    }

    showDamageText(data) {
        const { x, y, damage } = data;

        // Convert GameScene world coordinates to UIScene screen coordinates
        // We assume the main game scene is named 'GameScene'
        const gameScene = this.scene.game.scene.getScene('GameScene');
        let screenX = x;
        let screenY = y;

        if (gameScene && gameScene.cameras && gameScene.cameras.main) {
            // worldToView returns the position relative to the camera's viewport (top-left 0,0)
            // Since UIScene covers the whole screen, this is exactly what we want.
            const point = gameScene.cameras.main.worldToView(x, y);

            // However, worldToView might return a point object that is reused or needs checking.
            // Also, if the game is scaled (ScaleManager), we might need to account for that, 
            // but usually scene coordinates match if both scenes are same size.

            // Let's debug log to see what we get
            // console.log(`World: ${x},${y} -> Screen: ${point.x},${point.y}`);

            screenX = point.x;
            screenY = point.y;
        }

        // Get a text object from the pool or create a new one
        let text = this.pool.getFirstDead(false);

        if (!text) {
            text = this.scene.add.text(screenX, screenY, damage.toString(), {
                fontFamily: 'Arial',
                fontSize: '24px',
                fontStyle: 'bold',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 2
            });
            this.pool.add(text);
        } else {
            text.setText(damage.toString());
            text.setPosition(screenX, screenY);
            text.setActive(true);
            text.setVisible(true);
            text.setAlpha(1);
            text.setScale(1);
        }

        // Animate the text using standard tweens (since this scene is unscaled)
        this.scene.tweens.add({
            targets: text,
            y: screenY - 50, // Float up
            alpha: 0,
            scale: 1.5,
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
                text.setActive(false);
                text.setVisible(false);
            }
        });
    }

    destroy() {
        EventManager.off('ENEMY_HIT', this.showDamageText, this);
    }
}
