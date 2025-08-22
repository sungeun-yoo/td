import BaseEffect from './BaseEffect.js';

export default class TowerSummonEffect extends BaseEffect {
    constructor(scene) {
        super(scene);

        // 그래픽스 객체들을 생성합니다.
        this.phaseAGraphics = this.scene.add.graphics();
        this.glitchGraphics = this.scene.add.graphics();
        this.solidCircleGraphics = this.scene.add.graphics();
    }

    start() {
        this.isFinished = false;

        this.centerX = this.scene.cameras.main.width / 2;
        this.centerY = this.scene.cameras.main.height / 2;

        // 원 관련 크기 설정
        this.towerRadius = 24;
        this.towerLineThickness = 5;
        this.dashedCircleRadius = 180;
        this.solidCircleRadius = 270;
        this.solidCircleLineThickness = 3;

        // 애니메이션 상태 관리
        this.animationState = 'DRAWING_DASHED';
        this.dashedCircleProgress = 0;
    }

    update(time, delta) {
        if (this.isFinished) {
            return;
        }

        switch (this.animationState) {
            case 'DRAWING_DASHED':
                this.phaseAGraphics.clear();
                this.dashedCircleProgress += 0.015;

                const totalSteps = 100;
                const stepsToDraw = Math.floor(totalSteps * this.dashedCircleProgress);
                const points = [];

                for (let i = 0; i <= stepsToDraw; i++) {
                    const angle = Phaser.Math.DegToRad(-90 + (i / totalSteps) * 360);
                    const x = this.centerX + this.dashedCircleRadius * Math.cos(angle);
                    const y = this.centerY + this.dashedCircleRadius * Math.sin(angle);
                    points.push({ x, y });
                }

                this.phaseAGraphics.lineStyle(2, 0xffffff, 0.8);

                for (let i = 0; i < points.length - 1; i += 2) {
                    if (points[i+1]) {
                        this.phaseAGraphics.lineBetween(points[i].x, points[i].y, points[i+1].x, points[i+1].y);
                    }
                }

                if (this.dashedCircleProgress >= 1) {
                    this.animationState = 'PAUSING_AFTER_DASH';
                    this.scene.time.delayedCall(700, () => {
                        this.animationState = 'GLITCHING';
                        this.scene.time.delayedCall(1200, () => {
                            this.animationState = 'STABLE';
                        });
                    });
                }
                break;

            case 'PAUSING_AFTER_DASH':
                break;

            case 'GLITCHING':
                this.glitchGraphics.clear();
                this.solidCircleGraphics.clear();

                for (let i = 0; i < 5; i++) {
                    this.glitchGraphics.fillStyle(0xffffff, Math.random() * 0.3);
                    this.glitchGraphics.fillRect(0, Math.random() * this.scene.cameras.main.height, this.scene.cameras.main.width, Math.random() * 3);
                }

                if (Math.random() > 0.15) {
                    for (let i = 0; i < 5; i++) {
                        const offsetX = (Math.random() - 0.5) * 12;
                        const offsetY = (Math.random() - 0.5) * 12;
                        const radiusOffset = (Math.random() - 0.5) * 9;
                        const alpha = Math.random() * 0.6 + 0.2;
                        this.glitchGraphics.lineStyle(Math.random() * 4 + 1, 0xffffff, alpha);
                        this.glitchGraphics.strokeCircle(this.centerX + offsetX, this.centerY + offsetY, this.towerRadius + radiusOffset);
                    }
                    this.solidCircleGraphics.lineStyle(this.solidCircleLineThickness, 0xffffff, 0.9);
                    this.solidCircleGraphics.strokeCircle(this.centerX, this.centerY, this.solidCircleRadius);
                }
                break;

            case 'STABLE':
                // The effect is over. Clear all graphics and transition to DONE.
                // The actual tower object will be made visible by the scene.
                this.glitchGraphics.clear();
                this.solidCircleGraphics.clear();
                this.phaseAGraphics.clear(); // Also clear the dashed circle

                this.animationState = 'DONE';
                break;

            case 'DONE':
                this.isFinished = true;
                break;
        }
    }

    destroy() {
        this.phaseAGraphics.destroy();
        this.glitchGraphics.destroy();
        this.solidCircleGraphics.destroy();
    }
}
