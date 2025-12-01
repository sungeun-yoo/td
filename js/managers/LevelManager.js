import { WAVE_DATA } from '../data/level_data.js';
import { EventManager } from './EventManager.js';

export default class LevelManager {
    constructor(scene) {
        this.scene = scene;
        this.currentWave = 0; // Global wave count, starting at 0 (will be 1 when started)
        this.waveTimers = [];
        this.nextWaveTimer = null;

        this.enemiesSpawnedThisWave = 0;
        this.isWaveActive = false;
        this.isGameOver = false;
        this.currentWaveData = null;

        EventManager.on('TOWER_SPAWNED', this.onTowerSpawned, this);
        EventManager.on('GAME_OVER', this.onGameOver, this);
    }

    onTowerSpawned() {
        console.log('LevelManager received TOWER_SPAWNED event. Starting first wave.');
        this.startNextWave();
    }

    onGameOver() {
        this.isGameOver = true;
        this.isWaveActive = false;
        this.waveTimers.forEach(timer => timer.destroy());
        this.waveTimers = [];
        if (this.nextWaveTimer) {
            this.nextWaveTimer.remove();
            this.nextWaveTimer = null;
        }
        console.log('LevelManager received GAME_OVER event. Halting all operations.');
    }

    startNextWave() {
        if (this.isGameOver) return;

        this.currentWave++;
        this.currentWaveData = this.getWaveData(this.currentWave);

        // Clear previous timers
        this.waveTimers.forEach(timer => timer.destroy());
        this.waveTimers = [];
        if (this.nextWaveTimer) {
            this.nextWaveTimer.remove();
            this.nextWaveTimer = null;
        }

        // Clear previous enemies (optional, but good for cleanup)
        // EventManager.emit('WAVE_CLEAR', { wave: this.currentWave }); 

        this.isWaveActive = true;
        this.enemiesSpawnedThisWave = 0;

        EventManager.emit('WAVE_START', {
            wave: this.currentWave,
            globalWave: this.currentWave // For UI compatibility
        });
        console.log(`--- Starting Wave ${this.currentWave}: ${this.currentWaveData.waveName} ---`);

        const difficultyMultiplier = 1 + ((this.currentWave - 1) * 0.1); // Gradual difficulty increase

        this.currentWaveData.enemies.forEach(enemyGroup => {
            const timer = this.scene.time.addEvent({
                delay: enemyGroup.spawnDelay,
                repeat: enemyGroup.count - 1,
                callback: () => {
                    if (this.isWaveActive) {
                        this.scene.spawnEnemy(enemyGroup.type, difficultyMultiplier);
                        this.enemiesSpawnedThisWave++;
                    }
                }
            });
            // Spawn first immediately
            if (this.isWaveActive) {
                this.scene.spawnEnemy(enemyGroup.type, difficultyMultiplier);
                this.enemiesSpawnedThisWave++;
            }
            this.waveTimers.push(timer);
        });
    }

    getWaveData(waveNumber) {
        // 1. Check if predefined data exists in WAVE_DATA
        // WAVE_DATA is 0-indexed array, so Wave 1 is at index 0.
        if (waveNumber <= WAVE_DATA.length) {
            return WAVE_DATA[waveNumber - 1];
        }

        // 2. Procedural Generation for subsequent waves
        return this.generateProceduralWave(waveNumber);
    }

    generateProceduralWave(waveNumber) {
        const isBossWave = waveNumber % 10 === 0;

        if (isBossWave) {
            return {
                waveName: `BOSS WAVE ${waveNumber}`,
                enemies: [
                    { type: 'boss_carrier', count: 1, spawnDelay: 0 }
                ],
                delayAfterWave: 5000
            };
        }

        // Normal Wave
        const difficultyFactor = waveNumber * 0.5;
        const enemyCount = Math.floor(10 + difficultyFactor * 2);
        const spawnDelay = Math.max(200, 1000 - (difficultyFactor * 20));

        const enemyTypes = ['enemy_type_1', 'enemy_type_2', 'enemy_type_3', 'enemy_type_4'];
        const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

        return {
            waveName: `Wave ${waveNumber}`,
            enemies: [
                { type: randomType, count: enemyCount, spawnDelay: spawnDelay }
            ],
            delayAfterWave: 3000
        };
    }

    update() {
        if (!this.isWaveActive || this.isGameOver) return;

        const totalEnemies = this.currentWaveData.enemies.reduce((total, group) => total + group.count, 0);

        if (this.enemiesSpawnedThisWave >= totalEnemies) {
            if (this.scene.enemies.countActive(true) === 0) {
                this.isWaveActive = false;
                console.log(`--- Wave ${this.currentWave} CLEARED! ---`);

                // Prepare next wave
                this.nextWaveTimer = this.scene.time.delayedCall(
                    this.currentWaveData.delayAfterWave,
                    this.startNextWave,
                    [],
                    this
                );
            }
        }
    }

    destroy() {
        EventManager.off('TOWER_SPAWNED', this.onTowerSpawned, this);
        EventManager.off('GAME_OVER', this.onGameOver, this);
        this.waveTimers.forEach(timer => timer.destroy());
        if (this.nextWaveTimer) {
            this.nextWaveTimer.remove();
        }
    }
}
