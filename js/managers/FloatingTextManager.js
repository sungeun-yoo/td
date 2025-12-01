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

        // Get a text object from the pool or create a new one
        let text = this.pool.getFirstDead(false);

        if (!text) {
            text = this.scene.add.text(x, y, damage.toString(), {
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
            text.setPosition(x, y);
            text.setActive(true);
            text.setVisible(true);
            text.setAlpha(1);
            text.setScale(1);
        }

        // Animate the text
        this.scene.tweens.add({
            targets: text,
            y: y - 50, // Float up
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
