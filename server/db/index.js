const { MongoDatabaseManagerAuth, MongoDatabaseManagerStore } = require('./mongo/index')

class DatabaseManager {

    static async initDatabase() {
        await MongoDatabaseManagerStore.initDb()
    }

    static checkDatabase() {
        const db = require('./mongo/init');
        return new Promise((resolve, reject) => {
            db.on('error', err => {
                console.error('Database connection error:', err);
                reject(err);
            });
            db.once('open', () => {
                resolve();
            });
        });
    }

    static findOneUser = async (filter) => {
        return await MongoDatabaseManagerAuth.findOneUser(filter)
    }

    static createUser = async (username, email, passwordHash, avatarPng) => {
        return await MongoDatabaseManagerAuth.createSavedUser(username, email, passwordHash, avatarPng)
    }

    static updateUser = async (email, username, passwordHash, avatarPng) => {
        return await MongoDatabaseManagerAuth.updateUser(email, username, passwordHash, avatarPng)
    }

    static createPlaylist = async (req, body) => {
        return MongoDatabaseManagerStore.createPlaylist(req, body)
    }

    static deletePlaylist = async (req) => {
        return MongoDatabaseManagerStore.deletePlaylist(req)
    }

    static updatePlaylist = async (req, body) => {
        return MongoDatabaseManagerStore.updatePlaylist(req, body)
    }

    static getPlaylists = async () => {
        return MongoDatabaseManagerStore.getPlaylists()
    }

    static getPlaylistPairs = async (req) => {
        return MongoDatabaseManagerStore.getPlaylistPairs(req)
    }

    static getPlaylistById = async (req) => {
        return MongoDatabaseManagerStore.getPlaylistById(req)
    }

    static getSongPairs = async (req) => {
        return MongoDatabaseManagerStore.getSongPairs(req)
    }

    static createSong = async (req, body) => {
        return MongoDatabaseManagerStore.createSong(req, body)
    }

    static deleteSong = async (req) => {
        return MongoDatabaseManagerStore.deleteSong(req)
    }

    static updateSong = async (req, body) => {
        return MongoDatabaseManagerStore.updateSong(req, body)
    }

    static updateSongListens = async (req) => {
        return MongoDatabaseManagerStore.updateSongListens(req)
    }

    static updatePlaylistListeners = async (req) => {
        return MongoDatabaseManagerStore.updatePlaylistListeners(req)
    }
}

module.exports = DatabaseManager