import { Weapon } from './Weapon.js';

export class MeleeWeapon extends Weapon {
    constructor(scene, tower, type) {
        super(scene, tower, type);
        this.orbitAngle = 0;
        this.blades = [];
        this.createBlades();
    }

    createBlades() {
        // Clear existing
        this.blades.forEach(b => b.destroy());
        this.blades = [];

        for (let i = 0; i < this.data.count; i++) {
            const blade = this.scene.add.circle(0, 0, 10, 0xff0000);
            this.scene.physics.add.existing(blade);
            this.blades.push(blade);
        }
    }

    update(time, delta) {
        // Re-create blades if count changed (upgrade)
        if (this.blades.length !== this.data.count) {
            this.createBlades();
        }

        this.orbitAngle += this.data.speed * (delta / 1000);

        const radius = this.data.range;
        const angleStep = (Math.PI * 2) / this.blades.length;

        this.blades.forEach((blade, index) => {
            const angle = this.orbitAngle + (index * angleStep);
            blade.x = this.tower.x + Math.cos(angle) * radius;
            blade.y = this.tower.y + Math.sin(angle) * radius;

            // Collision check
            this.tower.enemiesGroup.getChildren().forEach(enemy => {
                if (enemy.active && !enemy.isDying) {
                    if (this.scene.physics.overlap(blade, enemy)) {
                        // Simple cooldown per enemy to avoid instant kill? 
                        // Or just continuous damage. Let's do continuous damage with a small timer on enemy?
                        // For simplicity, let's just hit.
                        // Ideally, we need an "immune" timer on enemy for melee hits.
                        if (!enemy.lastMeleeHit || time > enemy.lastMeleeHit + 500) {
                            enemy.takeDamage(this.data.damage);
                            enemy.lastMeleeHit = time;

                            // Visual effect
                            this.scene.tweens.add({
                                targets: blade,
                                scale: 1.5,
                                duration: 100,
                                yoyo: true
                            });
                        }
                    }
                }
            });
        });
    }

    upgrade(stat) {
        super.upgrade(stat);
        if (stat === 'count') {
            this.createBlades();
        }
    }
}
