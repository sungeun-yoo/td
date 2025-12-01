import { WEAPON_DATA } from '../../data/weapon_data.js';
import { PROJECTILE_DATA } from '../../data/projectile_data.js';

export class Weapon {
    constructor(scene, tower, type) {
        this.scene = scene;
        this.tower = tower;
        this.type = type;
        this.data = JSON.parse(JSON.stringify(WEAPON_DATA[type])); // Deep copy to allow independent upgrades

        // Ensure effects object exists
        if (!this.data.effects) {
            // If it's a ranged weapon with a projectile type, try to inherit effects from projectile data
            if (this.data.projectileType && PROJECTILE_DATA[this.data.projectileType] && PROJECTILE_DATA[this.data.projectileType].effects) {
                this.data.effects = { ...PROJECTILE_DATA[this.data.projectileType].effects };
            } else {
                this.data.effects = { slowChance: 0, knockbackChance: 0, chainChance: 0 };
            }
        }

        this.level = 1;
        this.lastFireTime = 0;
    }

    update(time, delta) {
        // Override in subclasses
    }

    upgrade(stat) {
        const upgradeData = WEAPON_DATA[this.type].upgrades[stat];
        if (!upgradeData) return;

        if (upgradeData.increment) {
            this.data[stat] += upgradeData.increment;
        }
        if (upgradeData.decrement) {
            this.data[stat] = Math.max(upgradeData.min || 0, this.data[stat] - upgradeData.decrement);
        }

        console.log(`Upgraded ${this.type} ${stat} to ${this.data[stat]}`);
    }

    getUpgradeCost(stat) {
        const baseCost = WEAPON_DATA[this.type].upgrades[stat].cost;
        // Simple scaling: Base + (Level * 25) - simplified for now, can be complex later
        // We need to track levels per stat if we want per-stat cost scaling.
        // For now, let's just return base cost to keep it simple as per prompt requirements (or add scaling if needed).
        // The prompt says "Upgrade... increase by 0.5", doesn't specify cost scaling explicitly but usually it scales.
        // Let's assume constant cost for now or simple scaling.
        return baseCost;
    }
}
