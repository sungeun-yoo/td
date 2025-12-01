export const ENEMY_DATA = {
    'enemy_type_1': {
        name: 'Melee Enemy',
        health: 50,
        speed: 130,
        shape: {
            type: 'square',
            size: 30,
            hollow: true,
            diagonal: 'tr-bl' // top-right to bottom-left
        },
        color: 0x00ff00, // Fluorescent green
        attack: {
            type: 'melee',
            damage: 10
        }
    },
    'enemy_type_2': {
        name: 'Ranged Enemy',
        health: 40,
        speed: 104,
        shape: {
            type: 'square',
            size: 30,
            hollow: true,
            diagonal: 'tr-bl'
        },
        color: 0xffff00, // Fluorescent yellow
        attack: {
            type: 'ranged',
            projectileType: 'projectile_type_1',
            fireRate: 1500 // Time in ms between shots
        },
        goldReward: 15
    },
    'enemy_type_3': {
        name: 'Tank Enemy',
        health: 150,
        speed: 60,
        shape: {
            type: 'square',
            size: 40,
            hollow: false, // Solid
            diagonal: 'tr-bl'
        },
        color: 0x0000ff, // Blue
        attack: {
            type: 'melee',
            damage: 30
        },
        goldReward: 30
    },
    'enemy_type_4': {
        name: 'Swarmer Enemy',
        health: 20,
        speed: 200,
        shape: {
            type: 'square',
            size: 15,
            hollow: false,
            diagonal: null
        },
        color: 0xff00ff, // Purple
        attack: {
            type: 'melee',
            damage: 5
        },
        goldReward: 5
    },
    'boss_carrier': {
        name: 'Carrier Boss',
        health: 2000,
        speed: 30,
        shape: {
            type: 'square',
            size: 80,
            hollow: true,
            diagonal: 'cross' // 'X' shape
        },
        color: 0xffaa00, // Gold/Orange
        attack: {
            type: 'spawner',
            spawnType: 'enemy_type_4', // Spawns Swarmers
            spawnRate: 2000 // Every 2 seconds
        },
        goldReward: 500
    }
};
