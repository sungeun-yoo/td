import { EventManager } from './EventManager.js';

export default class UIManager {
    constructor(scene) {
        this.scene = scene;
        EventManager.on('WAVE_START', this.onWaveStart, this);
    }

    onWaveStart(waveData) {
        const text = `Wave ${waveData.wave}`;
        const screenCenterX = this.scene.cameras.main.worldView.x + this.scene.cameras.main.width / 2;
        const screenCenterY = this.scene.cameras.main.worldView.y + this.scene.cameras.main.height / 2;

        const waveText = this.scene.add.text(screenCenterX, screenCenterY, text, {
            fontFamily: '"Arial Black"',
            fontSize: '96px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        });
        waveText.setOrigin(0.5);
        waveText.setAlpha(0);

        // A tween sequence to fade in, hold, and fade out.
        this.scene.tweens.add({
            targets: waveText,
            alpha: { from: 0, to: 1 },
            yoyo: true,
            duration: 1000,
            ease: 'Sine.easeInOut',
            hold: 1500,
            onComplete: () => {
                waveText.destroy();
            }
        });
    }

    displayDevModeText() {
        const devText = this.scene.add.text(15, 15, 'DEV MODE', {
            fontFamily: '"Arial"',
            fontSize: '32px',
            color: '#00ff00', // Bright green text
            backgroundColor: 'rgba(0,0,0,0.5)' // Semi-transparent black background
        });
        devText.setPadding(10, 5);
        devText.setScrollFactor(0); // Keep it fixed on the screen, unaffected by camera scroll
        devText.setDepth(1000); // Ensure it's on top of other UI elements
    }

    destroy() {
        // Clean up the global event listener
        EventManager.off('WAVE_START', this.onWaveStart, this);
    }
}
