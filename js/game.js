// No longer need to import the effect here, the Tower handles it.
import Tower from './objects/Tower.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.tower = null;
    }

    create() {
        const towerX = this.cameras.main.width / 2;
        const towerY = this.cameras.main.height / 2;

        // Creating a tower now automatically handles its own spawn effect.
        this.tower = new Tower(this, towerX, towerY);
    }

    update(time, delta) {
        // The tower's own update method now handles everything:
        // a) the spawn effect lifecycle, and
        // b) its regular logic (like attacking) once spawned.
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
