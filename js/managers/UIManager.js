import { EventManager } from './EventManager.js';

export default class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.waveStatusText = null; // To hold the persistent wave status text
        this.setupUI();
        EventManager.on('WAVE_START', this.onWaveStart, this);
    }

    setupUI() {
        // Create a container for the wave status
        const statusContainer = document.createElement('div');
        statusContainer.style.position = 'absolute';
        statusContainer.style.top = '10px';
        statusContainer.style.left = '10px';
        statusContainer.style.backgroundColor = 'rgba(0,0,0,0.5)';
        statusContainer.style.padding = '10px';
        statusContainer.style.borderRadius = '5px';
        statusContainer.style.color = 'white';
        statusContainer.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(statusContainer);

        this.waveStatusText = document.createElement('div');
        this.waveStatusText.innerText = 'Waiting to start...';
        statusContainer.appendChild(this.waveStatusText);

        // Create a container for the controls
        const controlsContainer = document.createElement('div');
        controlsContainer.style.position = 'absolute';
        controlsContainer.style.top = '10px';
        controlsContainer.style.right = '10px';
        controlsContainer.style.backgroundColor = 'rgba(0,0,0,0.5)';
        controlsContainer.style.padding = '10px';
        controlsContainer.style.borderRadius = '5px';
        controlsContainer.style.color = 'white';
        controlsContainer.style.width = '200px';
        document.body.appendChild(controlsContainer);

        // Attack Speed Slider
        const speedLabel = document.createElement('label');
        speedLabel.htmlFor = 'speed-slider';
        speedLabel.innerText = 'Attack Speed';
        controlsContainer.appendChild(speedLabel);

        const speedSlider = document.createElement('input');
        speedSlider.type = 'range';
        speedSlider.id = 'speed-slider';
        speedSlider.min = '100';
        speedSlider.max = '1000';
        speedSlider.value = this.scene.tower.attackSpeed;
        speedSlider.style.width = '100%';
        controlsContainer.appendChild(speedSlider);

        const speedValueLabel = document.createElement('span');
        speedValueLabel.innerText = speedSlider.value;
        controlsContainer.appendChild(speedValueLabel);

        speedSlider.addEventListener('input', (event) => {
            const newSpeed = parseInt(event.target.value, 10);
            this.scene.tower.attackSpeed = newSpeed;
            speedValueLabel.innerText = newSpeed;
        });

        // Attack Range Slider
        const rangeLabel = document.createElement('label');
        rangeLabel.htmlFor = 'range-slider';
        rangeLabel.innerText = 'Attack Range';
        rangeLabel.style.marginTop = '10px';
        rangeLabel.style.display = 'block';
        controlsContainer.appendChild(rangeLabel);

        const rangeSlider = document.createElement('input');
        rangeSlider.type = 'range';
        rangeSlider.id = 'range-slider';
        rangeSlider.min = '100';
        rangeSlider.max = '500';
        rangeSlider.value = this.scene.tower.attackRange;
        rangeSlider.style.width = '100%';
        controlsContainer.appendChild(rangeSlider);

        const rangeValueLabel = document.createElement('span');
        rangeValueLabel.innerText = rangeSlider.value;
        controlsContainer.appendChild(rangeValueLabel);

        rangeSlider.addEventListener('input', (event) => {
            const newRange = parseInt(event.target.value, 10);
            this.scene.tower.attackRange = newRange;
            if (this.scene.tower.updateAttackRangeCircle) {
                this.scene.tower.updateAttackRangeCircle(newRange);
            }
            rangeValueLabel.innerText = newRange;
        });

        // Attack Damage Slider
        const damageLabel = document.createElement('label');
        damageLabel.htmlFor = 'damage-slider';
        damageLabel.innerText = 'Attack Damage';
        damageLabel.style.marginTop = '10px';
        damageLabel.style.display = 'block';
        controlsContainer.appendChild(damageLabel);

        const damageSlider = document.createElement('input');
        damageSlider.type = 'range';
        damageSlider.id = 'damage-slider';
        damageSlider.min = '10';
        damageSlider.max = '100';
        damageSlider.value = this.scene.tower.attackDamage;
        damageSlider.style.width = '100%';
        controlsContainer.appendChild(damageSlider);

        const damageValueLabel = document.createElement('span');
        damageValueLabel.innerText = damageSlider.value;
        controlsContainer.appendChild(damageValueLabel);

        damageSlider.addEventListener('input', (event) => {
            const newDamage = parseInt(event.target.value, 10);
            this.scene.tower.attackDamage = newDamage;
            damageValueLabel.innerText = newDamage;
        });

        // Wave Navigation Buttons
        const waveNavContainer = document.createElement('div');
        waveNavContainer.style.marginTop = '20px';
        waveNavContainer.style.display = 'flex';
        waveNavContainer.style.justifyContent = 'space-between';
        controlsContainer.appendChild(waveNavContainer);

        const prevWaveButton = document.createElement('button');
        prevWaveButton.innerText = 'Prev Wave';
        waveNavContainer.appendChild(prevWaveButton);

        const nextWaveButton = document.createElement('button');
        nextWaveButton.innerText = 'Next Wave';
        waveNavContainer.appendChild(nextWaveButton);

        prevWaveButton.addEventListener('click', () => {
            EventManager.emit('PREVIOUS_WAVE_REQUESTED');
        });

        nextWaveButton.addEventListener('click', () => {
            EventManager.emit('NEXT_WAVE_REQUESTED');
        });
    }

    onWaveStart(waveData) {
        const levelInfo = `Level ${waveData.level}`;
        const waveInfo = `Wave ${waveData.wave}`;
        const fullText = `${levelInfo} - ${waveInfo}`;

        // Update the persistent status text
        if (this.waveStatusText) {
            this.waveStatusText.innerText = fullText;
        }

        // Update the temporary splash text
        const screenCenterX = this.scene.cameras.main.worldView.x + this.scene.cameras.main.width / 2;
        const screenCenterY = this.scene.cameras.main.worldView.y + this.scene.cameras.main.height / 2;

        const waveText = this.scene.add.text(screenCenterX, screenCenterY, fullText, {
            fontFamily: '"Arial Black"',
            fontSize: '96px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        });
        waveText.setOrigin(0.5);
        waveText.setAlpha(0);

        // A tween sequence to fade in, hold, and fade out.
        this.scene.tweens.add({
            targets: waveText,
            alpha: { from: 0, to: 1 },
            yoyo: true,
            duration: 1000,
            ease: 'Sine.easeInOut',
            hold: 1500,
            onComplete: () => {
                waveText.destroy();
            }
        });
    }

    showGameOverScreen() {
        // Create a semi-transparent overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '100'; // Ensure it's on top
        document.body.appendChild(overlay);

        // "GAME OVER" text
        const gameOverText = document.createElement('h1');
        gameOverText.innerText = 'GAME OVER';
        gameOverText.style.color = 'white';
        gameOverText.style.fontSize = '72px';
        gameOverText.style.fontFamily = '"Arial Black"';
        gameOverText.style.textShadow = '4px 4px 8px #000';
        overlay.appendChild(gameOverText);

        // Restart button
        const restartButton = document.createElement('button');
        restartButton.innerText = '다시 시작';
        restartButton.style.marginTop = '20px';
        restartButton.style.padding = '15px 30px';
        restartButton.style.fontSize = '24px';
        restartButton.style.cursor = 'pointer';
        restartButton.style.border = '2px solid white';
        restartButton.style.borderRadius = '10px';
        restartButton.style.backgroundColor = '#333';
        restartButton.style.color = 'white';
        overlay.appendChild(restartButton);

        // Add event listener to reload the page on click
        restartButton.addEventListener('click', () => {
            window.location.reload();
        });
    }

    destroy() {
        // Clean up the global event listener
        EventManager.off('WAVE_START', this.onWaveStart, this);
    }
}
