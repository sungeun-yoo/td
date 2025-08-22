import { LEVEL_DATA } from '../data/level_data.js';
import { EventManager } from './EventManager.js';

export default class LevelManager {
    constructor(scene) {
        this.scene = scene;
        this.levelData = null;
        this.currentLevel = 0;
        this.currentWaveIndex = -1;
        this.waveTimers = [];

        this.enemiesSpawnedThisWave = 0;
        this.isWaveActive = false;

        EventManager.on('TOWER_SPAWNED', this.onTowerSpawned, this);
        EventManager.on('PREVIOUS_WAVE_REQUESTED', this.onPreviousWaveRequested, this);
        EventManager.on('NEXT_WAVE_REQUESTED', this.onNextWaveRequested, this);
    }

    onTowerSpawned() {
        console.log('LevelManager received TOWER_SPAWNED event. Starting first wave.');
        this.startWave(0);
    }

    onPreviousWaveRequested() {
        if (this.currentWaveIndex > 0) {
            this.startWave(this.currentWaveIndex - 1);
        } else {
            console.log("Already at the first wave.");
        }
    }

    onNextWaveRequested() {
        if (this.currentWaveIndex < this.levelData.waves.length - 1) {
            this.startWave(this.currentWaveIndex + 1);
        } else {
            console.log("Already at the last wave.");
        }
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
    }

    startWave(waveIndex) {
        // Clear any active timers from the previous wave
        this.waveTimers.forEach(timer => timer.destroy());
        this.waveTimers = [];

        // Clear all existing enemies from the previous wave
        EventManager.emit('WAVE_CLEAR', { level: this.currentLevel, wave: this.currentWaveIndex + 1 });
        console.log(`--- Clearing previous wave enemies ---`);

        this.currentWaveIndex = waveIndex;

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
            const timer = this.scene.time.addEvent({
                delay: enemyGroup.spawnDelay,
                repeat: enemyGroup.count -1, // Repeat is N-1 times
                callback: () => {
                    if (this.isWaveActive) {
                        this.scene.spawnEnemy(enemyGroup.type);
                        this.enemiesSpawnedThisWave++;
                    }
                }
            });
            // Spawn the first one immediately
            if (this.isWaveActive) {
                this.scene.spawnEnemy(enemyGroup.type);
                this.enemiesSpawnedThisWave++;
            }
            this.waveTimers.push(timer);
        });
    }

    update() {
        if (!this.isWaveActive) return;

        const totalEnemiesInWave = this.levelData.waves[this.currentWaveIndex].enemies.reduce((total, group) => total + group.count, 0);

        if (this.enemiesSpawnedThisWave >= totalEnemiesInWave) {
            if (this.scene.enemies.countActive(true) === 0) {
                this.isWaveActive = false;

                EventManager.emit('WAVE_CLEAR', { level: this.currentLevel, wave: this.currentWaveIndex + 1 });
                console.log(`--- Wave ${this.currentWaveIndex + 1} CLEARED! ---`);

                // Automatic progression removed.
                // this.scene.time.delayedCall(waveData.delayAfterWave, this.startNextWave, [], this);
            }
        }
    }

    destroy() {
        EventManager.off('TOWER_SPAWNED', this.onTowerSpawned, this);
        EventManager.off('PREVIOUS_WAVE_REQUESTED', this.onPreviousWaveRequested, this);
        EventManager.off('NEXT_WAVE_REQUESTED', this.onNextWaveRequested, this);
        this.waveTimers.forEach(timer => timer.destroy());
    }
}
