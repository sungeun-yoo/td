import BaseEffect from './BaseEffect.js';

export default class DeathEffect extends BaseEffect {
    constructor(scene) {
        super(scene);
        this.graphics = this.scene.add.graphics();
    }

    start(x, y, color) {
        this.isFinished = false;
        this.x = x;
        this.y = y;
        this.color = color || 0xff0000; // Default to red if no color is provided
        this.radius = 0;
        this.alpha = 1;
        this.duration = 500; // 0.5 seconds
        this.startTime = this.scene.time.now;
    }

    update(time, delta) {
        if (this.isFinished) {
            return;
        }

        const elapsed = time - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1);

        this.radius = 20 * progress;
        this.alpha = 1 - progress;

        this.graphics.clear();
        this.graphics.fillStyle(this.color, this.alpha);
        this.graphics.fillCircle(this.x, this.y, this.radius);

        if (progress >= 1) {
            this.isFinished = true;
            this.emit('complete');
        }
    }

    destroy() {
        this.graphics.destroy();
    }
}
