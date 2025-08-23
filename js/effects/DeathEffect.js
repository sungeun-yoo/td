import BaseEffect from './BaseEffect.js';

export default class DeathEffect extends BaseEffect {
    constructor(scene) {
        super(scene);
        this.particles = [];
        this.graphics = this.scene.add.graphics();
    }

    start(x, y, color) {
        this.isFinished = false;
        this.color = color || 0xffffff;
        this.duration = 600; // Effect duration in ms
        this.startTime = this.scene.time.now;

        const particleCount = 12;
        const particleSize = 4;
        const maxSpeed = 150;

        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * maxSpeed;
            this.particles.push({
                x: x,
                y: y,
                size: particleSize,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
            });
        }
    }

    update(time, delta) {
        if (this.isFinished) {
            return;
        }

        const elapsed = time - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1);
        const alpha = 1 - progress; // Fade out

        this.graphics.clear();
        this.graphics.fillStyle(this.color, alpha);

        // Update and draw each particle
        const dt = delta / 1000; // delta is in ms, convert to seconds
        this.particles.forEach(p => {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            this.graphics.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        });

        if (progress >= 1) {
            this.isFinished = true;
            this.emit('complete');
        }
    }

    destroy() {
        this.graphics.destroy();
    }
}
