import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { jsTPS } from "jstps"
import storeRequestSender from './requests'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import RenamePlaylist_Transaction from '../transactions/RenamePlaylist_Transaction'
import AddSong_Transaction from '../transactions/AddSong_Transaction'
import AuthContext from '../auth'

export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    LOAD_SONG_CATALOG: "LOAD_SONG_CATALOG",
    LOAD_PLAYLISTS: "LOAD_PLAYLISTS",
    SONGS_CATALOG_SOURCE: "SONGS_CATALOG_SOURCE"
}

const tps = new jsTPS();

const CurrentModal = {
    NONE: "NONE",
    DELETE_LIST: "DELETE_LIST",
    EDIT_SONG: "EDIT_SONG",
    ERROR: "ERROR"
}

function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        currentModal: CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        currentSongIndex: -1,
        currentSong: null,
        currentSong: null,
        songCatalogSource: null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        songCatalog: [],
        playlists: [],
        songsCatalogSource: ""
    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    const storeReducer = (action) => {
        const { type, payload } = action;
        setStore(prevStore => {
            switch (type) {
                case GlobalStoreActionType.CHANGE_LIST_NAME: {
                    return {
                        currentModal: CurrentModal.NONE,
                        idNamePairs: payload.idNamePairs,
                        currentList: payload.playlist,
                        currentSongIndex: -1,
                        currentSong: null,
                        newListCounter: prevStore.newListCounter,
                        listNameActive: false,
                        listIdMarkedForDeletion: null,
                        listMarkedForDeletion: null,
                        songCatalog: prevStore.songCatalog,
                        playlists: prevStore.playlists,
                        songCatalogSource: prevStore.songCatalogSource
                    };
                }
                case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                    return {
                        currentModal: CurrentModal.NONE,
                        idNamePairs: prevStore.idNamePairs,
                        currentList: null,
                        currentSongIndex: -1,
                        currentSong: null,
                        newListCounter: prevStore.newListCounter,
                        listNameActive: false,
                        listIdMarkedForDeletion: null,
                        listMarkedForDeletion: null,
                        songCatalog: prevStore.songCatalog,
                        playlists: prevStore.playlists,
                        songCatalogSource: prevStore.songCatalogSource
                    };
                }
                case GlobalStoreActionType.CREATE_NEW_LIST: {
                    return {
                        currentModal: CurrentModal.NONE,
                        idNamePairs: prevStore.idNamePairs,
                        currentList: null,
                        currentSongIndex: -1,
                        currentSong: null,
                        newListCounter: prevStore.newListCounter + 1,
                        listNameActive: false,
                        listIdMarkedForDeletion: null,
                        listMarkedForDeletion: null,
                        songCatalog: prevStore.songCatalog,
                        playlists: prevStore.playlists,
                        songCatalogSource: prevStore.songCatalogSource
                    };
                }
                case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                    return {
                        currentModal: CurrentModal.NONE,
                        idNamePairs: payload,
                        currentList: null,
                        currentSongIndex: -1,
                        currentSong: null,
                        newListCounter: prevStore.newListCounter,
                        listNameActive: false,
                        listIdMarkedForDeletion: null,
                        listMarkedForDeletion: null,
                        songCatalog: prevStore.songCatalog,
                        playlists: prevStore.playlists,
                        songCatalogSource: prevStore.songCatalogSource
                    };
                }
                case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                    return {
                        currentModal: CurrentModal.DELETE_LIST,
                        idNamePairs: prevStore.idNamePairs,
                        currentList: null,
                        currentSongIndex: -1,
                        currentSong: null,
                        newListCounter: prevStore.newListCounter,
                        listNameActive: false,
                        listIdMarkedForDeletion: payload.id,
                        listMarkedForDeletion: payload.playlist,
                        songCatalog: prevStore.songCatalog,
                        playlists: prevStore.playlists,
                        songCatalogSource: prevStore.songCatalogSource
                    };
                }
                case GlobalStoreActionType.SET_CURRENT_LIST: {
                    return {
                        currentModal: CurrentModal.NONE,
                        idNamePairs: prevStore.idNamePairs,
                        currentList: payload,
                        currentSongIndex: -1,
                        currentSong: null,
                        newListCounter: prevStore.newListCounter,
                        listNameActive: false,
                        listIdMarkedForDeletion: null,
                        listMarkedForDeletion: null,
                        songCatalog: prevStore.songCatalog,
                        playlists: prevStore.playlists,
                        songCatalogSource: prevStore.songCatalogSource
                    };
                }
                case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                    return {
                        currentModal: CurrentModal.NONE,
                        idNamePairs: prevStore.idNamePairs,
                        currentList: payload,
                        currentSongIndex: -1,
                        currentSong: null,
                        newListCounter: prevStore.newListCounter,
                        listNameActive: true,
                        listIdMarkedForDeletion: null,
                        listMarkedForDeletion: null,
                        songCatalog: prevStore.songCatalog,
                        playlists: prevStore.playlists,
                        songCatalogSource: prevStore.songCatalogSource
                    };
                }
                case GlobalStoreActionType.EDIT_SONG: {
                    return {
                        currentModal: CurrentModal.EDIT_SONG,
                        idNamePairs: prevStore.idNamePairs,
                        currentList: prevStore.currentList,
                        currentSongIndex: -1,
                        currentSong: null,
                        newListCounter: prevStore.newListCounter,
                        listNameActive: false,
                        listIdMarkedForDeletion: null,
                        listMarkedForDeletion: null,
                        songCatalog: payload,
                        playlists: prevStore.playlists,
                        songCatalogSource: prevStore.songCatalogSource
                    };
                }
                case GlobalStoreActionType.REMOVE_SONG: {
                    return {
                        currentModal: CurrentModal.NONE,
                        idNamePairs: prevStore.idNamePairs,
                        currentList: prevStore.currentList,
                        currentSongIndex: -1,
                        currentSong: null,
                        newListCounter: prevStore.newListCounter,
                        listNameActive: false,
                        listIdMarkedForDeletion: null,
                        listMarkedForDeletion: null,
                        songCatalog: payload,
                        playlists: prevStore.playlists,
                        songCatalogSource: prevStore.songCatalogSource
                    };
                }
                case GlobalStoreActionType.HIDE_MODALS: {
                    return {
                        currentModal: CurrentModal.NONE,
                        idNamePairs: prevStore.idNamePairs,
                        currentList: prevStore.currentList,
                        currentSongIndex: -1,
                        currentSong: null,
                        newListCounter: prevStore.newListCounter,
                        listNameActive: false,
                        listIdMarkedForDeletion: null,
                        listMarkedForDeletion: null,
                        songCatalog: prevStore.songCatalog,
                        playlists: prevStore.playlists,
                        songCatalogSource: prevStore.songCatalogSource
                    };
                }
                case GlobalStoreActionType.LOAD_SONG_CATALOG: {
                    return {
                        currentModal: CurrentModal.NONE,
                        idNamePairs: prevStore.idNamePairs,
                        currentList: prevStore.currentList,
                        currentSongIndex: -1,
                        currentSong: null,
                        newListCounter: prevStore.newListCounter,
                        listNameActive: false,
                        listIdMarkedForDeletion: null,
                        listMarkedForDeletion: null,
                        songCatalog: payload,
                        playlists: prevStore.playlists,
                        songCatalogSource: prevStore.songCatalogSource
                    };
                }
                case GlobalStoreActionType.LOAD_PLAYLISTS: {
                    return {
                        currentModal: CurrentModal.NONE,
                        idNamePairs: prevStore.idNamePairs,
                        currentList: prevStore.currentList,
                        currentSongIndex: -1,
                        currentSong: null,
                        newListCounter: prevStore.newListCounter,
                        listNameActive: false,
                        listIdMarkedForDeletion: null,
                        listMarkedForDeletion: null,
                        songCatalog: prevStore.songCatalog,
                        playlists: payload,
                        songCatalogSource: prevStore.songCatalogSource
                    };
                }
                case GlobalStoreActionType.SONGS_CATALOG_SOURCE: {
                    return {
                        currentModal: CurrentModal.NONE,
                        idNamePairs: prevStore.idNamePairs,
                        currentList: prevStore.currentList,
                        currentSongIndex: -1,
                        currentSong: null,
                        newListCounter: prevStore.newListCounter,
                        listNameActive: false,
                        listIdMarkedForDeletion: null,
                        listMarkedForDeletion: null,
                        songCatalog: prevStore.songCatalog,
                        playlists: prevStore.playlists,
                        songCatalogSource: payload
                    };
                }

                case GlobalStoreActionType.SONGS_CATALOG_SOURCE: {
                    return {
                        currentModal: CurrentModal.NONE,
                        idNamePairs: prevStore.idNamePairs,
                        currentList: prevStore.currentList,
                        currentSongIndex: -1,
                        currentSong: null,
                        newListCounter: prevStore.newListCounter,
                        listNameActive: false,
                        listIdMarkedForDeletion: null,
                        listMarkedForDeletion: null,
                        songCatalog: prevStore.songCatalog,
                        playlists: prevStore.playlists,
                        songCatalogSource: payload
                    };
                }
                default:
                    return prevStore;
            }
        });
    }

    store.loadPlaylists = async function () {
        const response = await storeRequestSender.getPlaylists();
        if (response.data.success) {
            let playlistsArray = response.data.playlists;
            console.log(playlistsArray);
            storeReducer({
                type: GlobalStoreActionType.LOAD_PLAYLISTS,
                payload: playlistsArray
            });
            return { success: true, playlists: playlistsArray };
        }
        else {
            console.log("FAILED TO GET THE LIST PAIRS");
            return { success: false };
        }
    }


    store.createNewSong = async function (title, artist, year, youTubeId) {
        const response = await storeRequestSender.createSong(title, artist, year, youTubeId);
        if (response.data.success) {
            const song = response.data.song;
            store.loadSongCatalog();
            return { success: true, song: song };
        } else {
            console.log("createNewSong failed: " + response.data.errorMessage);
            return { success: false, song: null, errorMessage: response.data.errorMessage };
        }
    }

    store.updatePlaylistListeners = async function (playlist_id) {
        const response = await storeRequestSender.updatePlaylistListeners(playlist_id);
        if (response.data.success) {
            store.loadPlaylists();
            return "success";
        } else {
            return response.data.errorMessage;
        }
    }

    store.updateSongListens = async function (song_id) {
        const response = await storeRequestSender.updateSongListens(song_id);
        if (response.data.success) {
            store.loadSongCatalog();
            return "success";
        } else {
            return response.data.errorMessage;
        }
    }

    store.createNewList = async function () {
        let newListName = "Untitled 0";
        if (store.playlists) {
            let userPlaylists = store.playlists.filter(p => p.ownerEmail === auth.user.email);
            let pattern = /^Untitled (\d+)$/;
            let numbers = userPlaylists
                .map(p => {
                    let match = p.name.match(pattern);
                    return match ? parseInt(match[1]) : -1;
                })
                .filter(n => n >= 0)
                .sort((a, b) => a - b);

            let nextNumber = 0;
            for (let i = 0; i < numbers.length; i++) {
                if (numbers[i] > nextNumber) {
                    break;
                }
                if (numbers[i] === nextNumber) {
                    nextNumber++;
                }
            }
            newListName = "Untitled " + nextNumber;
        }

        const response = await storeRequestSender.createPlaylist(newListName, auth.user.email);
        console.log("createNewList response: " + response);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            store.loadPlaylists();
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            });
        }
        else {
            console.log("FAILED TO CREATE A NEW LIST");
        }
    }

    store.copyPlaylist = async function (id) {
        let playlistToCopy = store.playlists.find(p => p._id === id);
        if (!playlistToCopy) return;

        let baseName = playlistToCopy.name;
        let suffix = " (Copy)";
        let newName = baseName + suffix;

        while (store.playlists.some(p => p.name === newName && p.ownerEmail === auth.user.email)) {
            newName += suffix;
        }

        const response = await storeRequestSender.createPlaylist(newName, auth.user.email);

        if (response.status === 201) {
            let newPlaylist = response.data.playlist;

            if (playlistToCopy.songs && playlistToCopy.songs.length > 0) {
                let songIds = playlistToCopy.songs.map(s => s._id);
                newPlaylist.songs = songIds;
                await storeRequestSender.updatePlaylistById(newPlaylist._id, newPlaylist);
            }

            store.loadPlaylists();
            store.loadSongCatalog();
        } else {
            console.log("Failed to copy playlist");
        }
    }

    store.loadSongCatalog = async function () {
        const response = await storeRequestSender.getSongPairs();
        if (response.data.success) {
            let songs = response.data.songs;
            storeReducer({
                type: GlobalStoreActionType.LOAD_SONG_CATALOG,
                payload: songs
            });
        } else {
            console.log("FAILED TO GET THE SONG CATALOG");
        }
    }

    store.markListForDeletion = async function (id) {
        let response = await storeRequestSender.getPlaylistById(id);
        if (response.data.success) {
            let playlist = response.data.playlist;
            storeReducer({
                type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                payload: { id: id, playlist: playlist }
            });
        }
    }
    store.deleteList = async function (id) {
        let response = await storeRequestSender.deletePlaylistById(id);
        store.loadPlaylists();
        if (!response.data.success) {
            console.log("FAILED TO DELETE LIST");
        }
    }

    store.deleteSong = function (id) {
        async function asyncDeleteSong(id) {
            let response = await storeRequestSender.deleteSong(id);
            if (response.data.success) {
                store.loadSongCatalog();
            }
        }
        asyncDeleteSong(id);
    }


    store.updateSongDetails = async function (id, songData) {
        let response = await storeRequestSender.updateSong(id, songData);
        if (response.data.success) {
            store.loadSongCatalog();
            return "success";
        } else {
            return response.data.errorMessage;
        }
    }

    store.updatePlaylist = async function (id, playlist) {
        let response = await storeRequestSender.updatePlaylistById(id, playlist);
        if (response.data.success) {
            await store.loadPlaylists();
            store.loadSongCatalog();

            if (store.currentList && store.currentList._id === id) {
                store.setCurrentList(playlist);
            }

            return "success";
        } else {
            return response.data.errorMessage;
        }
    }



    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function () {
        return (store.currentList !== null);
    }
    store.canUndo = function () {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function () {
        return ((store.currentList !== null) && tps.hasTransactionToDo());
    }
    store.setCurrentList = function (list) {
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: list
        });
        if (list === null) {
            tps.clearAllTransactions();
        }
    }
    store.updateCurrentList = async function () {
        const response = await storeRequestSender.updatePlaylistById(store.currentList._id, store.currentList);
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: store.currentList
            });
        }
    }

    store.removeSong = function (index) {
        let list = store.currentList;
        list.songs.splice(index, 1);
        store.updateCurrentList();
    }
    store.removeSongForDuplication = function (index) {
        let list = store.currentList;
        storeRequestSender.deleteSong(list.songs[index]._id);
        list.songs.splice(index, 1);
        store.updateCurrentList();
    }
    store.addRemoveSongTransaction = (song, index) => {
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.processTransaction(transaction);
    }


    store.addRenamePlaylistTransaction = (oldName, newName) => {
        let transaction = new RenamePlaylist_Transaction(store, oldName, newName);
        tps.processTransaction(transaction);
    }
    store.renamePlaylist = function (name) {
        let list = store.currentList;
        list.name = name;
        store.updateCurrentList();
    }

    store.addCreateSongTransaction = (index, title, artist, year, youTubeId) => {
        let song = {
            title: title,
            artist: artist,
            year: year,
            youTubeId: youTubeId,
        };

        let transaction = new CreateSong_Transaction(store, index, song);
        tps.processTransaction(transaction);
    }
    store.createSong = async function (index, song) {
        let songCopy = { ...song };
        let list = store.currentList;
        let newSong = null;

        while (newSong === null) {
            songCopy.title = songCopy.title + " (COPY)";
            newSong = (await store.createNewSong(songCopy.title, songCopy.artist, songCopy.year, songCopy.youTubeId)).song;
        }

        if (newSong) {
            list.songs.splice(index, 0, newSong);
            store.updateCurrentList();
        }
    }

    store.createSongForRemove = function (index, song) {
        let songCopy = { ...song };
        let list = store.currentList;
        list.songs.splice(index, 0, songCopy);
        store.updateCurrentList();
    }

    store.addSongToPlaylistTransaction = (playlist_id, playlistOld, playlistNew) => {
        let transaction = new AddSong_Transaction(store, playlist_id, playlistOld, playlistNew);
        tps.processTransaction(transaction);
    }

    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.processTransaction(transaction);
    }
    store.moveSong = function (start, end) {
        let list = store.currentList;

        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }
        store.updateCurrentList();
    }

    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "?", new Date().getFullYear(), "dQw4w9WgXcQ");
    }

    store.canClose = function () {
        return (store.currentList !== null);
    }

    store.getPlaylistSize = function () {
        return store.currentList.songs.length;
    }

    function KeyPress(event) {
        if (!store.modalOpen && event.ctrlKey) {
            if (event.key === 'z') {
                store.undo();
            }
            if (event.key === 'y') {
                store.redo();
            }
        }
    }

    document.onkeydown = (event) => KeyPress(event);

    store.setSongCatalogSource = function (source) {
        storeReducer({
            type: GlobalStoreActionType.SONGS_CATALOG_SOURCE,
            payload: source
        });
    }

    store.updatePlaylistLastAccessed = async function (id) {
        await storeRequestSender.updatePlaylistLastAccessed(id);
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };