export const WEAPON_DATA = {
    'default_weapon': {
        name: 'Basic Turret',
        type: 'ranged',
        damage: 25,
        range: 270,
        speed: 400, // ms per shot
        projectileType: 'projectile_type_1',
        multishot: 1,
        upgrades: {
            damage: { cost: 50, increment: 5 },
            range: { cost: 50, increment: 20 },
            speed: { cost: 50, decrement: 50, min: 100 },
            multishot: { cost: 100, increment: 1 }
        }
    },
    'melee_weapon': {
        name: 'Rotating Blade',
        type: 'melee',
        damage: 50,
        range: 100, // Distance from tower center
        speed: 2, // Rotation speed (radians per second)
        count: 1, // Number of blades
        cost: 200, // Cost to buy
        upgrades: {
            count: { cost: 150, increment: 1 },
            speed: { cost: 100, increment: 0.5 }
        }
    }
};
