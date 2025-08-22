import TowerSummonEffect from './effects/TowerSummonEffect.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        this.towerEffect = new TowerSummonEffect(this);
        this.towerEffect.start();
    }

    update(time, delta) {
        if (this.towerEffect && !this.towerEffect.isFinished) {
            this.towerEffect.update(time, delta);
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
