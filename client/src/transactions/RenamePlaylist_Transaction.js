import { jsTPS_Transaction } from "jstps"

export default class RenamePlaylist_Transaction extends jsTPS_Transaction {
    constructor(initStore, initOldName, initNewName) {
        super();
        this.store = initStore;
        this.oldName = initOldName;
        this.newName = initNewName;
    }

    executeDo() {
        this.store.renamePlaylist(this.newName);
    }

    executeUndo() {
        this.store.renamePlaylist(this.oldName);
    }
}