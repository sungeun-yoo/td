export const LEVEL_DATA = {
    1: { // Level 1
        waves: [
            {
                waveName: 'Wave 1',
                enemies: [
                    { type: 'enemy_type_1', count: 5, spawnDelay: 1000 }
                ],
                delayAfterWave: 2500
            },
            {
                waveName: 'Wave 2',
                enemies: [
                    { type: 'enemy_type_2', count: 3, spawnDelay: 1500 }
                ],
                delayAfterWave: 2500
            },
            {
                waveName: 'Wave 3',
                enemies: [
                    { type: 'enemy_type_1', count: 4, spawnDelay: 1200 },
                    { type: 'enemy_type_2', count: 2, spawnDelay: 2000 }
                ],
                delayAfterWave: 5000
            },
            {
                waveName: 'Wave 4',
                enemies: [
                    { type: 'enemy_type_4', count: 20, spawnDelay: 300 } // Swarmers
                ],
                delayAfterWave: 2500
            },
            {
                waveName: 'Wave 5',
                enemies: [
                    { type: 'enemy_type_3', count: 3, spawnDelay: 2000 }, // Tanks
                    { type: 'enemy_type_2', count: 4, spawnDelay: 1500 }
                ],
                delayAfterWave: 2500
            },
            {
                waveName: 'Wave 6',
                enemies: [
                    { type: 'enemy_type_4', count: 15, spawnDelay: 400 },
                    { type: 'enemy_type_1', count: 8, spawnDelay: 1000 }
                ],
                delayAfterWave: 5000
            },
            {
                waveName: 'Wave 7',
                enemies: [
                    { type: 'enemy_type_3', count: 5, spawnDelay: 2000 },
                    { type: 'enemy_type_4', count: 10, spawnDelay: 500 }
                ],
                delayAfterWave: 2500
            },
            {
                waveName: 'Wave 8',
                enemies: [
                    { type: 'enemy_type_2', count: 10, spawnDelay: 800 },
                    { type: 'enemy_type_3', count: 3, spawnDelay: 2500 }
                ],
                delayAfterWave: 2500
            },
            {
                waveName: 'Wave 9',
                enemies: [
                    { type: 'enemy_type_4', count: 30, spawnDelay: 200 }, // Massive swarm
                    { type: 'enemy_type_3', count: 2, spawnDelay: 3000 }
                ],
                delayAfterWave: 5000
            },
            {
                waveName: 'Wave 10',
                enemies: [
                    { type: 'enemy_type_3', count: 10, spawnDelay: 1500 }, // Tank parade
                    { type: 'enemy_type_2', count: 10, spawnDelay: 1000 }
                ],
                delayAfterWave: 7500
            }
        ]
    },
    2: {
        // Future levels can be easily added here
    }
};
