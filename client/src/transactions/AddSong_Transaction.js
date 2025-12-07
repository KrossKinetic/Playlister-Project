import { jsTPS_Transaction } from "jstps"

export default class AddSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, initId, oldList, newList) {
        super();
        this.store = initStore;
        this.id = initId;
        this.oldList = oldList;
        this.newList = newList;
    }

    executeDo() {
        this.store.updatePlaylist(this.id, this.newList);
    }

    executeUndo() {
        this.store.updatePlaylist(this.id, this.oldList);
    }
}