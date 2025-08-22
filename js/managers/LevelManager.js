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

        EventManager.on('TOWER_SPAWNED', this.onTowerSpawned, this);
    }

    onTowerSpawned() {
        console.log('LevelManager received TOWER_SPAWNED event. Starting first wave.');
        this.startNextWave();
    }

    startLevel(levelNumber) {
        this.currentLevel = levelNumber;
        this.levelData = LEVEL_DATA[levelNumber];
        if (!this.levelData) {
            console.error(`Level data for level ${levelNumber} not found!`);
            return;
        }
        this.currentWaveIndex = -1;
        console.log(`Starting Level ${this.currentLevel}. Waiting for tower to spawn...`);
        // We no longer start the wave here; we wait for the TOWER_SPAWNED event.
    }

    startNextWave() {
        this.currentWaveIndex++;
        if (this.currentWaveIndex >= this.levelData.waves.length) {
            EventManager.emit('LEVEL_CLEAR', { level: this.currentLevel });
            console.log(`Level ${this.currentLevel} CLEARED!`);
            return;
        }

        const waveData = this.levelData.waves[this.currentWaveIndex];
        this.isWaveActive = true;
        this.enemiesSpawnedThisWave = 0;

        EventManager.emit('WAVE_START', { level: this.currentLevel, wave: this.currentWaveIndex + 1 });
        console.log(`--- Starting Wave ${this.currentWaveIndex + 1}: ${waveData.waveName} ---`);

        waveData.enemies.forEach(enemyGroup => {
            this.scene.time.addEvent({
                delay: enemyGroup.spawnDelay,
                repeat: enemyGroup.count,
                callback: () => {
                    // Only spawn if the wave is still active (e.g., not cleared prematurely)
                    if(this.isWaveActive) {
                        this.scene.spawnEnemy(enemyGroup.type);
                        this.enemiesSpawnedThisWave++;
                    }
                }
            });
        });
    }

    update() {
        if (!this.isWaveActive) return;

        const totalEnemiesInWave = this.levelData.waves[this.currentWaveIndex].enemies.reduce((total, group) => total + group.count, 0);

        // This check is flawed because the timers are asynchronous.
        // A better way is to count enemies as they are defeated.
        // The current check is: all enemies have been spawned AND all enemies are dead.
        if (this.enemiesSpawnedThisWave >= totalEnemiesInWave) {
            if (this.scene.enemies.countActive(true) === 0) {
                this.isWaveActive = false;
                const waveData = this.levelData.waves[this.currentWaveIndex];

                EventManager.emit('WAVE_CLEAR', { level: this.currentLevel, wave: this.currentWaveIndex + 1 });
                console.log(`--- Wave ${this.currentWaveIndex + 1} CLEARED! ---`);

                this.scene.time.delayedCall(waveData.delayAfterWave, this.startNextWave, [], this);
            }
        }
    }

    destroy() {
        EventManager.off('TOWER_SPAWNED', this.onTowerSpawned, this);
    }
}
