// This file exports a single instance of Phaser's EventEmitter.
// It will be used as a global event bus for different parts of the game to communicate
// without needing direct references to each other.

export const EventManager = new Phaser.Events.EventEmitter();
