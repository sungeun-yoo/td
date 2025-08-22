import { EventManager } from './EventManager.js';

export default class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.setupUI();
        EventManager.on('WAVE_START', this.onWaveStart, this);
    }

    setupUI() {
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
        const text = `Wave ${waveData.wave}`;
        const screenCenterX = this.scene.cameras.main.worldView.x + this.scene.cameras.main.width / 2;
        const screenCenterY = this.scene.cameras.main.worldView.y + this.scene.cameras.main.height / 2;

        const waveText = this.scene.add.text(screenCenterX, screenCenterY, text, {
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

    destroy() {
        // Clean up the global event listener
        EventManager.off('WAVE_START', this.onWaveStart, this);
    }
}
