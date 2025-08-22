export const LEVEL_DATA = {
    1: { // Level 1
        waves: [
            {
                waveName: 'First Wave - Melee',
                // A wave can have multiple enemy definitions
                enemies: [
                    { type: 'enemy_type_1', count: 5, spawnDelay: 1000 } // 5 melee enemies, 1 every second
                ],
                delayAfterWave: 5000 // 5 seconds until the next wave
            },
            {
                waveName: 'Second Wave - Ranged',
                enemies: [
                    { type: 'enemy_type_2', count: 3, spawnDelay: 1500 } // 3 ranged enemies, 1 every 1.5 seconds
                ],
                delayAfterWave: 5000
            },
            {
                waveName: 'Third Wave - Mixed',
                enemies: [
                    { type: 'enemy_type_1', count: 4, spawnDelay: 1200 }, // 4 melee enemies
                    { type: 'enemy_type_2', count: 2, spawnDelay: 2000 }  // 2 ranged enemies, spawning at a different interval
                ],
                delayAfterWave: 10000 // Longer delay after this wave
            }
        ]
    },
    2: {
        // Future levels can be easily added here
    }
};
