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
                    { type: 'enemy_type_1', count: 10, spawnDelay: 800 }
                ],
                delayAfterWave: 2500
            },
            {
                waveName: 'Wave 5',
                enemies: [
                    { type: 'enemy_type_2', count: 6, spawnDelay: 1000 }
                ],
                delayAfterWave: 2500
            },
            {
                waveName: 'Wave 6',
                enemies: [
                    { type: 'enemy_type_1', count: 8, spawnDelay: 1000 },
                    { type: 'enemy_type_2', count: 4, spawnDelay: 1500 }
                ],
                delayAfterWave: 5000
            },
            {
                waveName: 'Wave 7',
                enemies: [
                    { type: 'enemy_type_1', count: 15, spawnDelay: 500 }
                ],
                delayAfterWave: 2500
            },
            {
                waveName: 'Wave 8',
                enemies: [
                    { type: 'enemy_type_2', count: 10, spawnDelay: 800 }
                ],
                delayAfterWave: 2500
            },
            {
                waveName: 'Wave 9',
                enemies: [
                    { type: 'enemy_type_1', count: 12, spawnDelay: 700 },
                    { type: 'enemy_type_2', count: 6, spawnDelay: 1200 }
                ],
                delayAfterWave: 5000
            },
            {
                waveName: 'Wave 10',
                enemies: [
                    { type: 'enemy_type_1', count: 20, spawnDelay: 400 },
                    { type: 'enemy_type_2', count: 10, spawnDelay: 800 }
                ],
                delayAfterWave: 7500
            }
        ]
    },
    2: {
        waves: [
            {
                waveName: 'Wave 11',
                enemies: [
                    { type: 'enemy_type_3', count: 8, spawnDelay: 800 } // Fast Melee
                ],
                delayAfterWave: 3000
            },
            {
                waveName: 'Wave 12',
                enemies: [
                    { type: 'enemy_type_4', count: 4, spawnDelay: 1500 } // Tank Melee
                ],
                delayAfterWave: 3000
            },
            {
                waveName: 'Wave 13',
                enemies: [
                    { type: 'enemy_type_3', count: 6, spawnDelay: 1000 },
                    { type: 'enemy_type_4', count: 3, spawnDelay: 2000 }
                ],
                delayAfterWave: 5000
            },
            {
                waveName: 'Wave 14',
                enemies: [
                    { type: 'enemy_type_8', count: 15, spawnDelay: 400 }, // Swarmer
                    { type: 'enemy_type_5', count: 5, spawnDelay: 1200 }  // Basic Ranged
                ],
                delayAfterWave: 4000
            },
            {
                waveName: 'Wave 15',
                enemies: [
                    { type: 'enemy_type_6', count: 6, spawnDelay: 1000 } // Rapid-Fire Ranged
                ],
                delayAfterWave: 4000
            },
            {
                waveName: 'Wave 16',
                enemies: [
                    { type: 'enemy_type_5', count: 4, spawnDelay: 1500 },
                    { type: 'enemy_type_6', count: 4, spawnDelay: 1500 }
                ],
                delayAfterWave: 5000
            },
            {
                waveName: 'Wave 17',
                enemies: [
                    { type: 'enemy_type_9', count: 8, spawnDelay: 900 },  // Heavy Swarmer
                    { type: 'enemy_type_7', count: 5, spawnDelay: 1300 }  // Glass Cannon
                ],
                delayAfterWave: 5000
            },
            {
                waveName: 'Wave 18',
                enemies: [
                    { type: 'enemy_type_11', count: 5, spawnDelay: 1200 }, // Elite Melee
                    { type: 'enemy_type_10', count: 5, spawnDelay: 1200 }  // Solid Ranged
                ],
                delayAfterWave: 6000
            },
            {
                waveName: 'Wave 19',
                enemies: [
                    { type: 'enemy_type_8', count: 25, spawnDelay: 200 }, // Swarmer
                    { type: 'enemy_type_3', count: 10, spawnDelay: 500 }  // Fast Melee
                ],
                delayAfterWave: 5000
            },
            {
                waveName: 'Wave 20 (Boss)',
                enemies: [
                    { type: 'enemy_type_12', count: 1, spawnDelay: 1000 }, // Mini-Boss
                    { type: 'enemy_type_9', count: 10, spawnDelay: 1500 } // Heavy Swarmer Escort
                ],
                delayAfterWave: 10000
            }
        ]
    }
};
