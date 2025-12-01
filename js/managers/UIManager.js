import { EventManager } from './EventManager.js';

export default class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.setupUI();
        EventManager.on('WAVE_START', this.onWaveStart, this);
    }

    setupUI() {
        // --- Gold Display ---
        this.goldText = this.scene.add.text(20, 20, 'Gold: 0', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#FFD700', // Gold color
            stroke: '#000000',
            strokeThickness: 4
        });
        this.goldText.setScrollFactor(0); // Fix to camera

        // --- Upgrade Container ---
        const upgradeContainer = document.createElement('div');
        upgradeContainer.style.position = 'absolute';
        upgradeContainer.style.bottom = '20px';
        upgradeContainer.style.left = '50%';
        upgradeContainer.style.transform = 'translateX(-50%)';
        upgradeContainer.style.display = 'flex';
        upgradeContainer.style.gap = '10px';
        document.body.appendChild(upgradeContainer);
        this.upgradeContainer = upgradeContainer;

        // Create Upgrade Buttons
        this.createUpgradeButton('damage', 'Damage', upgradeContainer);
        this.createUpgradeButton('speed', 'Speed', upgradeContainer);
        this.createUpgradeButton('range', 'Range', upgradeContainer);

        // --- Wave Info ---
        this.waveText = this.scene.add.text(this.scene.cameras.main.width - 20, 20, 'Wave: 1', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.waveText.setOrigin(1, 0);
        this.waveText.setScrollFactor(0);

        // Listen for Gold Updates
        EventManager.on('GOLD_UPDATED', this.updateGoldDisplay, this);
    }

    createUpgradeButton(type, label, container) {
        const button = document.createElement('button');
        button.id = `btn-upgrade-${type}`;
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.cursor = 'pointer';
        button.style.backgroundColor = '#444';
        button.style.color = 'white';
        button.style.border = '2px solid #666';
        button.style.borderRadius = '5px';
        button.style.display = 'flex';
        button.style.flexDirection = 'column';
        button.style.alignItems = 'center';

        const typeLabel = document.createElement('span');
        typeLabel.innerText = label;
        typeLabel.style.fontWeight = 'bold';
        button.appendChild(typeLabel);

        const costLabel = document.createElement('span');
        costLabel.id = `cost-${type}`;
        costLabel.innerText = '50 G';
        costLabel.style.fontSize = '12px';
        costLabel.style.color = '#FFD700';
        button.appendChild(costLabel);

        button.addEventListener('click', () => {
            this.tryBuyUpgrade(type);
        });

        container.appendChild(button);
    }

    updateGoldDisplay(amount) {
        this.goldText.setText(`Gold: ${amount}`);
        this.updateUpgradeButtons();
    }

    updateUpgradeButtons() {
        if (!this.scene.tower) return;

        ['damage', 'speed', 'range'].forEach(type => {
            const cost = this.scene.tower.getUpgradeCost(type);
            const button = document.getElementById(`btn-upgrade-${type}`);
            const costLabel = document.getElementById(`cost-${type}`);

            if (button && costLabel) {
                costLabel.innerText = `${cost} G`;

                if (this.scene.gold >= cost) {
                    button.disabled = false;
                    button.style.opacity = '1';
                    button.style.backgroundColor = '#2ecc71'; // Green
                } else {
                    button.disabled = true;
                    button.style.opacity = '0.5';
                    button.style.backgroundColor = '#444';
                }
            }
        });
    }

    tryBuyUpgrade(type) {
        const cost = this.scene.tower.getUpgradeCost(type);
        if (this.scene.gold >= cost) {
            this.scene.gold -= cost;
            this.scene.tower.upgrade(type);
            this.updateGoldDisplay(this.scene.gold); // Update UI immediately
            EventManager.emit('GOLD_UPDATED', this.scene.gold); // Sync

            // Play upgrade sound (placeholder)
            // this.scene.soundManager.playUpgradeSound();
        }
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
        EventManager.off('GOLD_UPDATED', this.updateGoldDisplay, this);
        if (this.upgradeContainer) {
            this.upgradeContainer.remove();
        }
    }
}
