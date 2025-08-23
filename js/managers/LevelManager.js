import { LEVEL_DATA } from '../data/level_data.js';
import { EventManager } from './EventManager.js';

export default class LevelManager {
    constructor(scene) {
        this.scene = scene;
        this.levelData = null;
        this.currentLevel = 0;
        this.currentWaveIndex = -1;
        this.waveTimers = [];
        this.nextWaveTimer = null;

        this.enemiesSpawnedThisWave = 0;
        this.isWaveActive = false;
        this.isGameOver = false;

        EventManager.on('TOWER_SPAWNED', this.onTowerSpawned, this);
        EventManager.on('GAME_OVER', this.onGameOver, this);
        EventManager.on('PREVIOUS_WAVE_REQUESTED', this.onPreviousWaveRequested, this);
        EventManager.on('NEXT_WAVE_REQUESTED', this.onNextWaveRequested, this);
    }

    onTowerSpawned() {
        console.log('LevelManager received TOWER_SPAWNED event. Starting first wave.');
        this.startWave(0);
    }

    onGameOver() {
        this.isGameOver = true;
        this.isWaveActive = false;
        // Stop all wave-related timers
        this.waveTimers.forEach(timer => timer.destroy());
        this.waveTimers = [];
        // Stop the pending next-wave timer if it exists
        if (this.nextWaveTimer) {
            this.nextWaveTimer.remove();
            this.nextWaveTimer = null;
        }
        console.log('LevelManager received GAME_OVER event. Halting all operations.');
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
        if (this.isGameOver) return;

        // Clear any active timers from the previous wave, including the next-wave timer
        this.waveTimers.forEach(timer => timer.destroy());
        this.waveTimers = [];
        if (this.nextWaveTimer) {
            this.nextWaveTimer.remove();
            this.nextWaveTimer = null;
        }

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

    startNextWave() {
        if (this.isGameOver) return;

        if (this.currentWaveIndex < this.levelData.waves.length - 1) {
            this.startWave(this.currentWaveIndex + 1);
        } else {
            console.log("All waves cleared, level finished.");
            EventManager.emit('LEVEL_CLEAR', { level: this.currentLevel });
        }
    }

    update() {
        if (!this.isWaveActive || this.isGameOver) return;

        const totalEnemiesInWave = this.levelData.waves[this.currentWaveIndex].enemies.reduce((total, group) => total + group.count, 0);

        if (this.enemiesSpawnedThisWave >= totalEnemiesInWave) {
            if (this.scene.enemies.countActive(true) === 0) {
                this.isWaveActive = false;

                EventManager.emit('WAVE_CLEAR', { level: this.currentLevel, wave: this.currentWaveIndex + 1 });
                console.log(`--- Wave ${this.currentWaveIndex + 1} CLEARED! ---`);

                const waveData = this.levelData.waves[this.currentWaveIndex];
                // Automatically start the next wave after the specified delay
                if (this.currentWaveIndex < this.levelData.waves.length - 1) {
                    this.nextWaveTimer = this.scene.time.delayedCall(waveData.delayAfterWave, this.startNextWave, [], this);
                }
            }
        }
    }

    destroy() {
        EventManager.off('TOWER_SPAWNED', this.onTowerSpawned, this);
        EventManager.off('GAME_OVER', this.onGameOver, this);
        EventManager.off('PREVIOUS_WAVE_REQUESTED', this.onPreviousWaveRequested, this);
        EventManager.off('NEXT_WAVE_REQUESTED', this.onNextWaveRequested, this);
        this.waveTimers.forEach(timer => timer.destroy());
        if (this.nextWaveTimer) {
            this.nextWaveTimer.remove();
        }
    }
}
