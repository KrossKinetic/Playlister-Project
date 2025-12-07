import { jsTPS_Transaction } from "jstps"

export default class RemoveSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, initIndex, initSong) {
        super();
        this.store = initStore;
        this.index = initIndex;
        this.song = initSong;
    }

    executeDo() {
        this.store.removeSong(this.index);
    }

    executeUndo() {
        this.store.createSongForRemove(this.index, this.song);
    }
}