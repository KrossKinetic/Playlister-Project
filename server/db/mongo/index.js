const User = require('./user-model');
const Playlist = require('./playlist-model');
const db = require('./init')

// FOR AUTH FUNCTIONS 
class MongoDatabaseManagerAuth {
    static findOneUser = async (filter) => {
        return User.findOne(filter)
    }

    static createSavedUser = async (username, email, passwordHash, avatarPng) => {
        let new_user = new User({ username, email, passwordHash, avatarPng });
        return new_user.save()
    }
}

class MongoDatabaseManagerStore {

    static reset = async () => {
        async function clearCollection(collection, collectionName) {
            try {
                await collection.deleteMany({});
                console.log(collectionName + " cleared");
            }
            catch (err) {
                console.log(err);
            }
        }

        async function fillCollection(collection, collectionName, data) {
            for (let i = 0; i < data.length; i++) {
                let doc = new collection(data[i]);
                await doc.save();
            }
            console.log(collectionName + " filled");
        }

        async function resetMongo() {
            const Playlist = require('./playlist-model')
            const User = require("./user-model")
            const testData = require("../../test/data/example-db-data.json")

            console.log("Resetting the Mongo DB")
            await clearCollection(Playlist, "Playlist");
            await clearCollection(User, "User");
            await fillCollection(Playlist, "Playlist", testData.playlists);
            await fillCollection(User, "User", testData.users);
        }
        await resetMongo();
    }

    static initDb = async () => {
        const mongoose = require('mongoose')
        return mongoose
            .connect(process.env.DB_CONNECT, { useNewUrlParser: true })
            .catch(e => { console.error('Connection error', e.message) })
    }

    // Create a new playlist based on req, res and body
    static createPlaylist = async (req, body) => {
        try {
            const playlist = new Playlist(body);
            if (!playlist) throw new Error("Invalid playlist data");

            const user = await User.findOne({ _id: req.userId });
            if (!user) throw new Error("User not found");

            user.playlists.push(playlist._id);
            await user.save();
            await playlist.save();

            // Return value instead of sending response
            return { success: true, playlist };
        } catch (err) {
            console.error("Error creating playlist:", err);
            return { success: false, message: err.message };
        }
    };


    // Delete Playlist
    static async deletePlaylist(req) {
        try {
            const playlist = await Playlist.findById({ _id: req.params.id });
            console.log("playlist found:", JSON.stringify(playlist));

            if (!playlist) {
                return { success: false, message: "Playlist not found!" };
            }

            // Find the user who owns this playlist
            const user = await User.findOne({ email: playlist.ownerEmail });
            if (!user) {
                return { success: false, message: "User not found!" };
            }

            console.log("user._id:", user._id);
            console.log("req.userId:", req.userId);

            // Ensure the playlist belongs to the logged-in user
            if (user._id.toString() !== req.userId.toString()) {
                console.log("incorrect user!");
                return { success: false, message: "Authentication error" };
            }

            // Delete the playlist
            await Playlist.findOneAndDelete({ _id: req.params.id });
            console.log("Playlist deleted successfully!");

            return { success: true };
        } catch (err) {
            console.error("Error deleting playlist:", err);
            return { success: false, message: err.message };
        }
    }


    // Update Playlist
    static async updatePlaylist(req, body) {
        try {
            const playlist = await Playlist.findOne({ _id: req.params.id });
            console.log("playlist found:", JSON.stringify(playlist));

            if (!playlist) {
                return { success: false, message: "Playlist not found!" };
            }

            const user = await User.findOne({ email: playlist.ownerEmail });
            if (!user) {
                return { success: false, message: "User not found!" };
            }

            console.log("user._id:", user._id);
            console.log("req.userId:", req.userId);

            if (user._id.toString() !== req.userId.toString()) {
                console.log("incorrect user!");
                return { success: false, message: "Authentication error" };
            }

            console.log("req.body.name:", body.playlist.name);

            playlist.name = body.playlist.name;
            playlist.songs = body.playlist.songs;

            await playlist.save();
            console.log("SUCCESS!!! Playlist updated.");

            return {
                success: true,
                id: playlist._id,
                message: "Playlist updated!",
                playlist
            };
        } catch (error) {
            console.log("FAILURE:", error);
            return { success: false, message: "Playlist not updated!", error };
        }
    }


    // Get playlist
    static async getPlaylist() {
        try {
            const playlists = (await Playlist.find({}).sort({ name: 1 })).map(p => p.toObject());

            if (!playlists.length) {
                return { success: false, message: "Playlists not found" };
            }

            return { success: true, data: playlists };
        } catch (err) {
            console.error("Error fetching playlists:", err);
            return { success: false, message: err.message };
        }
    }


    // Get Playlist Pairs
    static async getPlaylistPairs(req) {
        try {
            // Find the user by ID
            const user = await User.findOne({ _id: req.userId });
            if (!user) {
                return { success: false, message: "User not found" };
            }

            // Find all playlists owned by that user
            const playlists = await Playlist.find({ ownerEmail: user.email }).sort({ name: 1 });
            if (!playlists || playlists.length === 0) {
                return { success: false, message: "Playlists not found" };
            }

            // Build id-name pairs
            const pairs = playlists.map(list => ({
                _id: list._id,
                name: list.name
            }));

            return { success: true, idNamePairs: pairs };

        } catch (err) {
            console.error("Error getting playlist pairs:", err);
            return { success: false, message: err.message };
        }
    }


    static async getPlaylistById(req) {
        try {
            // Find the playlist by ID
            const list = await Playlist.findById({ _id: req.params.id });
            if (!list) {
                return { success: false, message: "Playlist not found" };
            }

            console.log("Found list:", JSON.stringify(list));

            // Find the user who owns it
            const user = await User.findOne({ email: list.ownerEmail });
            if (!user) {
                return { success: false, message: "User not found" };
            }

            console.log("user._id:", user._id);
            console.log("req.userId:", req.userId);

            // Verify ownership
            if (user._id.toString() !== req.userId.toString()) {
                console.log("Incorrect user!");
                return { success: false, message: "Authentication error" };
            }

            console.log("Correct user!");
            return { success: true, playlist: list };

        } catch (err) {
            console.error("Error fetching playlist:", err);
            return { success: false, message: err.message };
        }
    }

}

module.exports = {
    MongoDatabaseManagerAuth,
    MongoDatabaseManagerStore
}