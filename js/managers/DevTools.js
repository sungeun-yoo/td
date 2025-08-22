// js/managers/DevTools.js

export default class DevTools {
    constructor(scene) {
        this.scene = scene;
        this.levelManager = scene.levelManager;
        this.tower = scene.tower;
    }

    /**
     * Starts a specific level.
     * @param {number} levelNumber The level to start.
     */
    startLevel(levelNumber) {
        if (!this.levelManager) {
            console.error("LevelManager not found.");
            return;
        }
        console.log(`DEV: Starting level ${levelNumber}`);
        this.levelManager.startLevel(levelNumber);
    }

    /**
     * Starts a specific wave within the current level.
     * @param {number} waveIndex The zero-based index of the wave to start.
     */
    startWave(waveIndex) {
        if (!this.levelManager) {
            console.error("LevelManager not found.");
            return;
        }
        const levelData = this.levelManager.levelData;
        if (!levelData || waveIndex < 0 || waveIndex >= levelData.waves.length) {
            console.error(`DEV: Invalid wave index ${waveIndex}.`);
            return;
        }
        console.log(`DEV: Starting wave ${waveIndex}`);
        this.levelManager.currentWaveIndex = waveIndex - 1; // Since startNextWave increments it
        this.levelManager.startNextWave();
    }

    /**
     * Spawns a specific type of enemy.
     * @param {string} enemyType The type of enemy to spawn (e.g., 'enemy_type_1').
     * @param {number} [count=1] The number of enemies to spawn.
     */
    spawnEnemy(enemyType, count = 1) {
        console.log(`DEV: Spawning ${count} of ${enemyType}`);
        for (let i = 0; i < count; i++) {
            this.scene.spawnEnemy(enemyType);
        }
    }

    /**
     * Toggles god mode for the tower, making it invincible.
     */
    godMode() {
        if (!this.tower) {
            console.error("Tower not found.");
            return;
        }

        if (!this.tower.originalTakeDamage) {
            // Store the original takeDamage function
            this.tower.originalTakeDamage = this.tower.takeDamage;
            // Override takeDamage to do nothing
            this.tower.takeDamage = () => {};
            console.log("DEV: God mode ENABLED. Tower is invincible.");
        } else {
            // Restore the original takeDamage function
            this.tower.takeDamage = this.tower.originalTakeDamage;
            delete this.tower.originalTakeDamage;
            console.log("DEV: God mode DISABLED. Tower is vulnerable.");
        }
    }
}
