const { MongoDatabaseManagerAuth, MongoDatabaseManagerStore } = require('./mongo/index')

class DatabaseManager {

    static async resetDb() {
        await MongoDatabaseManagerStore.reset();
    }

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

    static createPlaylist = async (req, body) => {
        return MongoDatabaseManagerStore.createPlaylist(req, body)
    }

    static deletePlaylist = async (req) => {
        return MongoDatabaseManagerStore.deletePlaylist(req)
    }

    static updatePlaylist = async (req, body) => {
        return MongoDatabaseManagerStore.updatePlaylist(req, body)
    }

    static getPlaylist = async () => {
        return MongoDatabaseManagerStore.getPlaylist()
    }

    static getPlaylistPairs = async (req) => {
        return MongoDatabaseManagerStore.getPlaylistPairs(req)
    }

    static getPlaylistById = async (req) => {
        return MongoDatabaseManagerStore.getPlaylistById(req)
    }
}

module.exports = DatabaseManager