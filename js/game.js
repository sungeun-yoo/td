// Phaser 게임 설정 객체
const config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 1920,
    backgroundColor: '#000000',
    scene: {
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

/**
 * create 함수: 게임 오브젝트를 생성하고 초기화합니다.
 */
function create() {
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;

    // 원 관련 크기 설정 (기존 40% 축소된 버전)
    this.towerRadius = 24;
    this.towerLineThickness = 5;
    this.dashedCircleRadius = 180;
    this.solidCircleRadius = 270;
    this.solidCircleLineThickness = 3;

    // 그래픽스 객체 분리
    this.phaseAGraphics = this.add.graphics(); // 점선 원
    this.glitchGraphics = this.add.graphics(); // 지지직 효과 및 최종 타워
    this.solidCircleGraphics = this.add.graphics(); // 깜빡이는 실선 원

    // 애니메이션 상태 관리
    this.animationState = 'DRAWING_DASHED';
    this.dashedCircleProgress = 0; // 점선 원 진행도 초기화
}

/**
 * update 함수: 매 프레임마다 호출되어 애니메이션을 구현합니다.
 */
function update() {
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

            // (수정된 부분) 점선 원 그리기가 끝나면 PAUSING 상태로 전환하고 딜레이를 겁니다.
            if (this.dashedCircleProgress >= 1) {
                this.animationState = 'PAUSING_AFTER_DASH';
                // 700ms 딜레이 후에 GLITCHING 상태로 전환합니다.
                this.time.delayedCall(700, () => {
                    this.animationState = 'GLITCHING';
                    // GLITCHING 상태는 1500ms 동안 지속됩니다.
                    this.time.delayedCall(1200, () => {
                        this.animationState = 'STABLE';
                    });
                });
            }
            break;

        // (추가된 부분) 딜레이 동안 아무것도 하지 않고 대기하는 상태
        case 'PAUSING_AFTER_DASH':
            // 점선 원이 그려진 상태로 대기합니다.
            break;

        case 'GLITCHING':
            this.glitchGraphics.clear();
            this.solidCircleGraphics.clear();

            for (let i = 0; i < 5; i++) {
                this.glitchGraphics.fillStyle(0xffffff, Math.random() * 0.3);
                this.glitchGraphics.fillRect(0, Math.random() * this.cameras.main.height, this.cameras.main.width, Math.random() * 3);
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
            this.glitchGraphics.clear();
            this.solidCircleGraphics.clear();

            this.glitchGraphics.lineStyle(this.towerLineThickness, 0xffffff, 1);
            this.glitchGraphics.strokeCircle(this.centerX, this.centerY, this.towerRadius);

            this.solidCircleGraphics.lineStyle(this.solidCircleLineThickness, 0xffffff, 1);
            this.solidCircleGraphics.strokeCircle(this.centerX, this.centerY, this.solidCircleRadius);

            this.animationState = 'DONE';
            break;

        case 'DONE':
            // 아무것도 하지 않음
            break;
    }
}
