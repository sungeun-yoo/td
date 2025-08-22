import TowerSummonEffect from './effects/TowerSummonEffect.js';
import Tower from './objects/Tower.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });

        this.towerEffect = null;
        this.tower = null;
    }

    create() {
        // For now, we'll trigger the tower creation automatically on start.
        // Let's create it at the center of the screen.
        const towerX = this.cameras.main.width / 2;
        const towerY = this.cameras.main.height / 2;

        // Start the creation effect at the target location.
        // (Our effect currently defaults to the center, which is fine for now)
        this.towerEffect = new TowerSummonEffect(this);
        this.towerEffect.start();
    }

    update(time, delta) {
        // If the summon effect is running, update it.
        if (this.towerEffect) {
            this.towerEffect.update(time, delta);

            // If the effect just finished, create the tower and clean up the effect.
            if (this.towerEffect.isFinished) {
                const towerX = this.towerEffect.centerX;
                const towerY = this.towerEffect.centerY;

                this.tower = new Tower(this, towerX, towerY);

                this.towerEffect.destroy();
                this.towerEffect = null;
            }
        }

        // If the tower exists, call its update method.
        if (this.tower) {
            this.tower.update(time, delta);
        }
    }
}

// Phaser 게임 설정 객체
const config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 1920,
    backgroundColor: '#000000',
    scene: [GameScene]
};

const game = new Phaser.Game(config);
