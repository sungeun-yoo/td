import { EventManager } from './EventManager.js';

export default class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.setupUI();
    }

    setupUI() {
        // --- Top UI (Gold & Wave) ---
        const topUI = document.createElement('div');
        topUI.id = 'top-ui';
        topUI.innerHTML = `
            <div class="stat-box">
                <span class="gold-icon">💰</span>
                <span id="gold-display">100</span>
            </div>
            <div class="stat-box">
                <span>Wave <span id="wave-display">1</span></span>
            </div>
        `;
        document.getElementById('game-container').appendChild(topUI);
        this.goldDisplay = document.getElementById('gold-display');
        this.waveDisplay = document.getElementById('wave-display');

        // --- Bottom Sheet ---
        const bottomSheet = document.createElement('div');
        bottomSheet.id = 'bottom-sheet';
        document.getElementById('game-container').appendChild(bottomSheet);
        this.bottomSheet = bottomSheet;

        // Toggle Handle
        const handle = document.createElement('div');
        handle.id = 'toggle-handle';
        handle.addEventListener('click', () => this.toggleBottomSheet());
        bottomSheet.appendChild(handle);

        // Content Area
        const contentArea = document.createElement('div');
        contentArea.id = 'content-area';
        bottomSheet.appendChild(contentArea);

        // --- Tabs Content ---

        // 1. Upgrades Tab
        const upgradesTab = document.createElement('div');
        upgradesTab.className = 'tab-content active';
        upgradesTab.id = 'tab-upgrades';
        upgradesTab.innerHTML = `<div class="upgrade-grid" id="upgrade-grid"></div>`;
        contentArea.appendChild(upgradesTab);

        this.createUpgradeButtons();

        // 2. Weapons Tab
        const weaponsTab = document.createElement('div');
        weaponsTab.className = 'tab-content';
        weaponsTab.id = 'tab-weapons';
        weaponsTab.innerHTML = `<div style="text-align:center; color:#888; margin-top:50px;">New Weapons Coming Soon...</div>`;
        contentArea.appendChild(weaponsTab);

        // 3. Skills Tab
        const skillsTab = document.createElement('div');
        skillsTab.className = 'tab-content';
        skillsTab.id = 'tab-skills';
        skillsTab.innerHTML = `
            <div class="upgrade-grid" id="skill-grid">
                <!-- Shockwave Skill Button will go here -->
            </div>
        `;
        contentArea.appendChild(skillsTab);
        this.createSkillButtons();


        // --- Tab Bar ---
        const tabBar = document.createElement('div');
        tabBar.id = 'tab-bar';
        bottomSheet.appendChild(tabBar);

        this.createTabButton(tabBar, 'Upgrades', 'resources/icons/upgrade.png', 'tab-upgrades', true);
        this.createTabButton(tabBar, 'Weapons', 'resources/icons/weapon.png', 'tab-weapons');
        this.createTabButton(tabBar, 'Skills', 'resources/icons/skill.png', 'tab-skills');

        // Listeners
        EventManager.on('GOLD_UPDATED', this.updateGoldDisplay, this);
        EventManager.on('WAVE_START', this.updateWaveDisplay, this);
    }

    createTabButton(container, label, iconPath, targetId, isActive = false) {
        const btn = document.createElement('button');
        btn.className = `tab-button ${isActive ? 'active' : ''}`;
        btn.innerHTML = `
            <img src="${iconPath}" alt="${label}">
            <span>${label}</span>
        `;
        btn.addEventListener('click', () => {
            // Switch Tabs
            document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
        });
        container.appendChild(btn);
    }

    createUpgradeButtons() {
        const grid = document.getElementById('upgrade-grid');
        const upgrades = [
            { type: 'damage', label: 'Damage' },
            { type: 'speed', label: 'Speed' },
            { type: 'range', label: 'Range' }
        ];

        upgrades.forEach(u => {
            const btn = document.createElement('div');
            btn.className = 'upgrade-btn';
            btn.id = `btn-upgrade-${u.type}`;
            btn.innerHTML = `
                <span class="upgrade-label">${u.label}</span>
                <span class="upgrade-cost" id="cost-${u.type}">50 G</span>
                <span class="upgrade-level" id="level-${u.type}">Lv. 1</span>
            `;
            btn.addEventListener('click', () => this.tryBuyUpgrade(u.type));
            grid.appendChild(btn);
        });
    }

    createSkillButtons() {
        const grid = document.getElementById('skill-grid');

        // Shockwave Skill
        const btn = document.createElement('div');
        btn.className = 'upgrade-btn';
        btn.id = 'btn-skill-shockwave';
        btn.style.borderColor = '#00ffff';
        btn.innerHTML = `
            <span class="upgrade-label">Shockwave</span>
            <span class="upgrade-cost">Active</span>
            <span class="upgrade-level">10s CD</span>
        `;

        let cooldown = false;
        btn.addEventListener('click', () => {
            if (!cooldown && this.scene.tower) {
                this.scene.tower.useShockwave();
                cooldown = true;
                btn.style.opacity = '0.5';
                btn.style.filter = 'grayscale(100%)';

                setTimeout(() => {
                    cooldown = false;
                    btn.style.opacity = '1';
                    btn.style.filter = 'grayscale(0%)';
                }, 10000);
            }
        });

        grid.appendChild(btn);
    }

    toggleBottomSheet() {
        const sheet = this.bottomSheet;
        // Simple toggle logic (could be improved with classes)
        if (sheet.style.transform === 'translateY(80%)') {
            sheet.style.transform = 'translateY(0)';
        } else {
            sheet.style.transform = 'translateY(80%)';
        }
    }

    updateGoldDisplay(amount) {
        if (this.goldDisplay) this.goldDisplay.innerText = amount;
        this.updateUpgradeButtons();
    }

    updateWaveDisplay(data) {
        // Use globalWave if available, otherwise fallback to local wave
        const waveNum = data.globalWave || data.wave;
        if (this.waveDisplay) this.waveDisplay.innerText = waveNum;
        this.onWaveStart(data); // Call original wave start animation
    }

    updateUpgradeButtons() {
        if (!this.scene.tower) return;

        ['damage', 'speed', 'range'].forEach(type => {
            const cost = this.scene.tower.getUpgradeCost(type);
            const level = this.scene.tower.upgradeLevels[type];
            const btn = document.getElementById(`btn-upgrade-${type}`);
            const costLabel = document.getElementById(`cost-${type}`);
            const levelLabel = document.getElementById(`level-${type}`);

            if (btn && costLabel) {
                costLabel.innerText = `${cost} G`;
                levelLabel.innerText = `Lv. ${level}`;

                if (this.scene.gold >= cost) {
                    btn.classList.add('affordable');
                    btn.style.opacity = '1';
                } else {
                    btn.classList.remove('affordable');
                    btn.style.opacity = '0.5';
                }
            }
        });
    }

    tryBuyUpgrade(type) {
        const cost = this.scene.tower.getUpgradeCost(type);
        if (this.scene.gold >= cost) {
            this.scene.gold -= cost;
            this.scene.tower.upgrade(type);
            this.updateGoldDisplay(this.scene.gold);
            EventManager.emit('GOLD_UPDATED', this.scene.gold);
        }
    }

    onWaveStart(waveData) {
        const waveNum = waveData.globalWave || waveData.wave;
        const text = `Wave ${waveNum}`;
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
        document.getElementById('game-container').appendChild(overlay);

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

        if (this.bottomSheet) this.bottomSheet.remove();
        const topUI = document.getElementById('top-ui');
        if (topUI) topUI.remove();
    }
}
