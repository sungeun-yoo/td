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
    },
    'enemy_type_3': {
        name: 'Fast Melee',
        health: 30,
        speed: 200,
        shape: {
            type: 'square',
            size: 25,
            hollow: true,
            diagonal: 'tr-bl'
        },
        color: 0x00ffff, // Cyan
        attack: {
            type: 'melee',
            damage: 5
        }
    },
    'enemy_type_4': {
        name: 'Tank Melee',
        health: 150,
        speed: 80,
        shape: {
            type: 'square',
            size: 40,
            hollow: false
        },
        color: 0xff00ff, // Magenta
        attack: {
            type: 'melee',
            damage: 20
        }
    },
    'enemy_type_5': {
        name: 'Basic Ranged',
        health: 40,
        speed: 100,
        shape: {
            type: 'square',
            size: 30,
            hollow: true,
            diagonal: 'tr-bl'
        },
        color: 0xffa500, // Orange
        attack: {
            type: 'ranged',
            projectileType: 'projectile_type_1',
            fireRate: 2000
        }
    },
    'enemy_type_6': {
        name: 'Rapid-Fire Ranged',
        health: 50,
        speed: 90,
        shape: {
            type: 'square',
            size: 35,
            hollow: true,
            diagonal: 'tr-bl'
        },
        color: 0xadd8e6, // Light Blue
        attack: {
            type: 'ranged',
            projectileType: 'projectile_type_1',
            fireRate: 750
        }
    },
    'enemy_type_7': {
        name: 'Glass Cannon',
        health: 20,
        speed: 120,
        shape: {
            type: 'square',
            size: 28,
            hollow: true,
            diagonal: 'tr-bl'
        },
        color: 0xff4500, // OrangeRed
        attack: {
            type: 'ranged',
            projectileType: 'projectile_type_2', // Assuming a different projectile
            fireRate: 1000
        }
    },
    'enemy_type_8': {
        name: 'Swarmer',
        health: 15,
        speed: 180,
        shape: {
            type: 'square',
            size: 20,
            hollow: true
        },
        color: 0x808080, // Gray
        attack: {
            type: 'melee',
            damage: 2
        }
    },
    'enemy_type_9': {
        name: 'Heavy Swarmer',
        health: 40,
        speed: 150,
        shape: {
            type: 'square',
            size: 25,
            hollow: false
        },
        color: 0x696969, // DimGray
        attack: {
            type: 'melee',
            damage: 8
        }
    },
    'enemy_type_10': {
        name: 'Solid Ranged',
        health: 80,
        speed: 95,
        shape: {
            type: 'square',
            size: 35,
            hollow: false,
            diagonal: 'tr-bl'
        },
        color: 0x0000ff, // Blue
        attack: {
            type: 'ranged',
            projectileType: 'projectile_type_1',
            fireRate: 1800
        }
    },
    'enemy_type_11': {
        name: 'Elite Melee',
        health: 100,
        speed: 140,
        shape: {
            type: 'square',
            size: 38,
            hollow: false
        },
        color: 0x800080, // Purple
        attack: {
            type: 'melee',
            damage: 15
        }
    },
    'enemy_type_12': {
        name: 'Mini-Boss',
        health: 300,
        speed: 70,
        shape: {
            type: 'square',
            size: 50,
            hollow: false,
            diagonal: 'tr-bl'
        },
        color: 0xff0000, // Red
        attack: {
            type: 'ranged',
            projectileType: 'projectile_type_2',
            fireRate: 2500
        }
    }
};
