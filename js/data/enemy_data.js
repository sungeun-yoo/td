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
        }
    }
};
