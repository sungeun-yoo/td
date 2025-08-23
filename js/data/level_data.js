export const LEVEL_DATA = {
    1: { // Level 1 - Redesigned
        waves: [
            {
                waveName: 'First Contact',
                enemies: [ { type: 'enemy_type_1', count: 8, spawnDelay: 1200 } ], // Basic Melee
                delayAfterWave: 3000
            },
            {
                waveName: 'Look, they shoot!',
                enemies: [ { type: 'enemy_type_2', count: 6, spawnDelay: 1500 } ], // Basic Ranged
                delayAfterWave: 3000
            },
            {
                waveName: 'Fast & Furious',
                enemies: [
                    { type: 'enemy_type_1', count: 5, spawnDelay: 1000 },
                    { type: 'enemy_type_3', count: 5, spawnDelay: 1000 }  // Fast Melee
                ],
                delayAfterWave: 4000
            },
            {
                waveName: 'Swarm Tactics',
                enemies: [ { type: 'enemy_type_8', count: 20, spawnDelay: 300 } ], // Swarmers
                delayAfterWave: 4000
            },
            {
                waveName: 'The Walls',
                enemies: [
                    { type: 'enemy_type_4', count: 4, spawnDelay: 2000 }, // Tank Melee
                    { type: 'enemy_type_2', count: 4, spawnDelay: 1800 }
                ],
                delayAfterWave: 5000
            },
            {
                waveName: 'Ranged Reinforcements',
                enemies: [
                    { type: 'enemy_type_5', count: 5, spawnDelay: 1200 }, // Basic Ranged (orange)
                    { type: 'enemy_type_6', count: 5, spawnDelay: 1000 }  // Rapid-fire
                ],
                delayAfterWave: 5000
            },
            {
                waveName: 'High Threat',
                enemies: [
                    { type: 'enemy_type_9', count: 10, spawnDelay: 800 }, // Heavy Swarmer
                    { type: 'enemy_type_7', count: 6, spawnDelay: 1300 }  // Glass Cannon
                ],
                delayAfterWave: 5000
            },
            {
                waveName: 'Elite Guard',
                enemies: [
                    { type: 'enemy_type_11', count: 6, spawnDelay: 1500 }, // Elite Melee
                    { type: 'enemy_type_10', count: 6, spawnDelay: 1500 }  // Solid Ranged
                ],
                delayAfterWave: 6000
            },
            {
                waveName: 'Chaos Theory',
                enemies: [
                    { type: 'enemy_type_3', count: 10, spawnDelay: 500 },  // Fast Melee
                    { type: 'enemy_type_8', count: 15, spawnDelay: 300 },  // Swarmer
                    { type: 'enemy_type_6', count: 4, spawnDelay: 1000 }   // Rapid-fire
                ],
                delayAfterWave: 6000
            },
            {
                waveName: 'The Big One',
                enemies: [
                    { type: 'enemy_type_12', count: 1, spawnDelay: 1000 }, // Mini-Boss
                    { type: 'enemy_type_1', count: 10, spawnDelay: 2000 } // Basic Melee escort
                ],
                delayAfterWave: 10000
            }
        ]
    },
    2: { // Level 2 - Renumbered
        waves: [
            {
                waveName: 'Wave 1',
                enemies: [ { type: 'enemy_type_3', count: 8, spawnDelay: 800 } ],
                delayAfterWave: 3000
            },
            {
                waveName: 'Wave 2',
                enemies: [ { type: 'enemy_type_4', count: 4, spawnDelay: 1500 } ],
                delayAfterWave: 3000
            },
            {
                waveName: 'Wave 3',
                enemies: [
                    { type: 'enemy_type_3', count: 6, spawnDelay: 1000 },
                    { type: 'enemy_type_4', count: 3, spawnDelay: 2000 }
                ],
                delayAfterWave: 5000
            },
            {
                waveName: 'Wave 4',
                enemies: [
                    { type: 'enemy_type_8', count: 15, spawnDelay: 400 },
                    { type: 'enemy_type_5', count: 5, spawnDelay: 1200 }
                ],
                delayAfterWave: 4000
            },
            {
                waveName: 'Wave 5',
                enemies: [ { type: 'enemy_type_6', count: 6, spawnDelay: 1000 } ],
                delayAfterWave: 4000
            },
            {
                waveName: 'Wave 6',
                enemies: [
                    { type: 'enemy_type_5', count: 4, spawnDelay: 1500 },
                    { type: 'enemy_type_6', count: 4, spawnDelay: 1500 }
                ],
                delayAfterWave: 5000
            },
            {
                waveName: 'Wave 7',
                enemies: [
                    { type: 'enemy_type_9', count: 8, spawnDelay: 900 },
                    { type: 'enemy_type_7', count: 5, spawnDelay: 1300 }
                ],
                delayAfterWave: 5000
            },
            {
                waveName: 'Wave 8',
                enemies: [
                    { type: 'enemy_type_11', count: 5, spawnDelay: 1200 },
                    { type: 'enemy_type_10', count: 5, spawnDelay: 1200 }
                ],
                delayAfterWave: 6000
            },
            {
                waveName: 'Wave 9',
                enemies: [
                    { type: 'enemy_type_8', count: 25, spawnDelay: 200 },
                    { type: 'enemy_type_3', count: 10, spawnDelay: 500 }
                ],
                delayAfterWave: 5000
            },
            {
                waveName: 'Wave 10 (Boss)',
                enemies: [
                    { type: 'enemy_type_12', count: 1, spawnDelay: 1000 },
                    { type: 'enemy_type_9', count: 10, spawnDelay: 1500 }
                ],
                delayAfterWave: 10000
            }
        ]
    }
};
