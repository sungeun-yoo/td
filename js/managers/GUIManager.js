export default class GUIManager {
    constructor(devTools) {
        this.devTools = devTools;
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
