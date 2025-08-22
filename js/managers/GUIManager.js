export default class GUIManager {
    constructor(devTools, tower) {
        this.devTools = devTools;
        this.tower = tower;
        this.gui = new dat.GUI();

        // Properties for dat.GUI to bind to
        this.spawnOptions = {
            enemyType: 'enemy_type_1',
            count: 1
        };

        this.waveOptions = {
            waveIndex: 0
        };

        this.init();
    }

    init() {
        // --- Tower Folder ---
        const towerFolder = this.gui.addFolder('Tower');
        towerFolder.add(this, 'toggleGodMode').name('Toggle God Mode');
        towerFolder.add(this.tower, 'attackDamage', 1, 100, 1).name('Attack Damage');
        towerFolder.add(this.tower, 'attackSpeed', 100, 2000, 50).name('Attack Speed (ms)');
        towerFolder.open();

        // --- Spawning Folder ---
        const spawningFolder = this.gui.addFolder('Enemy Spawning');
        spawningFolder.add(this.spawnOptions, 'enemyType', ['enemy_type_1', 'enemy_type_2']).name('Enemy Type');
        spawningFolder.add(this.spawnOptions, 'count', 1, 10, 1).name('Count');
        spawningFolder.add(this, 'spawnEnemies').name('Spawn Enemies');
        spawningFolder.open();

        // --- Wave Folder ---
        const waveFolder = this.gui.addFolder('Wave Control');
        waveFolder.add(this.waveOptions, 'waveIndex', 0, 10, 1).name('Wave Index'); // Assuming max 10 waves for now
        waveFolder.add(this, 'startWave').name('Start Wave');
        waveFolder.open();
    }

    spawnEnemies() {
        this.devTools.spawnEnemy(this.spawnOptions.enemyType, this.spawnOptions.count);
    }

    startWave() {
        this.devTools.startWave(this.waveOptions.waveIndex);
    }

    toggleGodMode() {
        this.devTools.godMode();
    }
}
