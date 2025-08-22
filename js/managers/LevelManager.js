import { LEVEL_DATA } from '../data/level_data.js';
import { EventManager } from './EventManager.js';

export default class LevelManager {
    constructor(scene) {
        this.scene = scene;
        this.levelData = null;
        this.currentLevel = 0;
        this.currentWaveIndex = -1;

        this.enemiesSpawnedThisWave = 0;
        this.isWaveActive = false;
    }

    startLevel(levelNumber) {
        this.currentLevel = levelNumber;
        this.levelData = LEVEL_DATA[levelNumber];
        if (!this.levelData) {
            console.error(`Level data for level ${levelNumber} not found!`);
            return;
        }
        this.currentWaveIndex = -1;
        console.log(`Starting Level ${this.currentLevel}`);
        this.startNextWave();
    }

    startNextWave() {
        this.currentWaveIndex++;
        if (this.currentWaveIndex >= this.levelData.waves.length) {
            EventManager.emit('LEVEL_CLEAR', { level: this.currentLevel });
            console.log(`Level ${this.currentLevel} CLEARED!`);
            return; // No more waves
        }

        const waveData = this.levelData.waves[this.currentWaveIndex];
        this.isWaveActive = true;
        this.enemiesSpawnedThisWave = 0;

        EventManager.emit('WAVE_START', { level: this.currentLevel, wave: this.currentWaveIndex + 1 });
        console.log(`--- Starting Wave ${this.currentWaveIndex + 1}: ${waveData.waveName} ---`);

        // Create timer events for each enemy group in the wave
        waveData.enemies.forEach(enemyGroup => {
            this.scene.time.addEvent({
                delay: enemyGroup.spawnDelay,
                repeat: enemyGroup.count - 1,
                callback: () => {
                    this.scene.spawnEnemy(enemyGroup.type);
                    this.enemiesSpawnedThisWave++;
                }
            });
            // Spawn the first enemy of this group immediately
            this.scene.spawnEnemy(enemyGroup.type);
            this.enemiesSpawnedThisWave++;
        });
    }

    update() {
        if (!this.isWaveActive) {
            return;
        }

        const totalEnemiesInWave = this.levelData.waves[this.currentWaveIndex].enemies.reduce((total, group) => total + group.count, 0);

        // Check if all enemies for the current wave have been spawned
        if (this.enemiesSpawnedThisWave >= totalEnemiesInWave) {
            // If all spawned, check if they are all defeated
            if (this.scene.enemies.countActive(true) === 0) {
                this.isWaveActive = false;
                const waveData = this.levelData.waves[this.currentWaveIndex];

                EventManager.emit('WAVE_CLEAR', { level: this.currentLevel, wave: this.currentWaveIndex + 1 });
                console.log(`--- Wave ${this.currentWaveIndex + 1} CLEARED! ---`);

                // Wait for the delay and then start the next wave
                this.scene.time.delayedCall(waveData.delayAfterWave, this.startNextWave, [], this);
            }
        }
    }
}
