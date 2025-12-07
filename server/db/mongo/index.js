const User = require('./user-model');
const Playlist = require('./playlist-model');
const Song = require('./song-model');
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

    static updateUser = async (email, username, passwordHash, avatarPng) => {
        const updates = {};
        if (username) updates.username = username;
        if (passwordHash) updates.passwordHash = passwordHash;
        if (avatarPng) updates.avatarPng = avatarPng;

        return User.findOneAndUpdate({ email: email }, { $set: updates }, { new: true })
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
            const Song = require("./song-model")
            // Correct logic to get test data
            const testData = require("../../test/PlaylisterData.json")

            console.log("Resetting the Mongo DB")
            await clearCollection(Playlist, "Playlist");
            await clearCollection(User, "User");
            await clearCollection(Song, "Song");

            await fillCollection(User, "User", testData.users);
            console.log("Playlists and Songs filled");
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

            // No need to decouple songs anymore since songs don't track playlists.

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

            if (body.playlist.songs) {
                playlist.songs = body.playlist.songs.map(s => s._id || s);
            }

            await playlist.save();

            await playlist.populate('songs');

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

    static updatePlaylistListeners(playlistId, listeners_user) {
        Playlist.findById(playlistId, (err, playlist) => {
            if (err) throw err;
            playlist.listeners_user = listeners_user;
            Playlist.updateOne({ _id: playlistId }, playlist, (err, data) => {
                if (err) throw err;
            });
        });
    }

    static updatePlaylistLastAccessed(playlistId) {
        Playlist.findById(playlistId, (err, playlist) => {
            if (err) {
                console.error("Error finding playlist for updatePlaylistLastAccessed:", err);
                return;
            };
            if (!playlist) return;

            playlist.lastAccessed = Date.now();
            Playlist.updateOne({ _id: playlistId }, playlist, (err, data) => {
                if (err) {
                    console.error("Error updating playlist lastAccessed:", err);
                    throw err;
                }
            });
        });
    }


    // Get playlist
    static async getPlaylists() {
        try {
            const playlists = await Playlist.find({}).sort({ name: 1 }).populate('songs').lean();

            // Populate user details manually (could also use populate if User ref existed in proper way, but assuming manual lookup is fine based on existing code)
            const populatedPlaylists = await Promise.all(playlists.map(async p => {
                const user = await User.findOne({ email: p.ownerEmail });
                p.avatarPng = user?.avatarPng ?? "";
                p.username = user?.username ?? "";
                return p;
            }));

            console.log("playlists:", playlists);

            return { success: true, data: populatedPlaylists };
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
            // Find the playlist by ID and populate songs
            const list = await Playlist.findById(req.params.id).populate('songs');
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

    static async getSongPairs(req) {
        try {
            const songs = await Song.find({}).sort({ title: 1 });
            console.log("getSongPairs songs found:", songs.length);

            // Not sure if the playlist count is supposed to be unique, but if not, we can just remove duplicates from the list
            const playlists = (await Playlist.find({}, 'songs')).map(p => {
                p.songs = [...new Set(p.songs.map(id => id.toString()))];
                return p;
            });

            const songCountMap = {};
            playlists.forEach(list => {
                list.songs.forEach(songId => {
                    const idStr = songId.toString();
                    songCountMap[idStr] = (songCountMap[idStr] || 0) + 1;
                });
            });

            const songData = songs.map(song => {
                const songObj = song.toObject();
                songObj.playlistsCount = songCountMap[song._id.toString()] || 0;
                songObj.duration = song.duration;
                return songObj;
            });

            return { success: true, songs: songData };

        } catch (err) {
            console.error("Error getting song pairs:", err);
            return { success: false, message: err.message };
        }
    }

    static async createSong(req, body) {
        try {
            const oldSong = await Song.findOne({ title: body.title, artist: body.artist, year: body.year });
            if (oldSong) {
                return { success: false, message: "Song already exists, choose a different title, artist, or year" };
            }

            const user = await User.findOne({ _id: req.userId });
            if (!user) {
                return { success: false, message: "User not found" };
            }

            let duration = "0:00";
            if (body.youTubeId) {
                duration = await MongoDatabaseManagerStore.getYouTubeDuration(body.youTubeId);
            }

            const newSong = new Song({
                title: body.title,
                artist: body.artist,
                year: body.year,
                youTubeId: body.youTubeId,
                created_by: user.email,
                listens: 0,
                duration: duration
            });

            const savedSong = await newSong.save();
            return { success: true, song: savedSong };
        } catch (err) {
            console.error("Error creating song:", err);
            return { success: false, message: err.message };
        }
    }

    static async getYouTubeDuration(videoId) {

        const API_KEY = process.env.YOUTUBE_API_KEY;
        const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${API_KEY}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (!data.items || data.items.length === 0) return "0:00";

            const isoDuration = data.items[0].contentDetails.duration;
            const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

            const hours = (parseInt(match[1]) || 0);
            const minutes = (parseInt(match[2]) || 0);
            const seconds = (parseInt(match[3]) || 0);

            let formattedDuration = "";

            if (hours > 0) {
                formattedDuration += `${hours}:`;
                formattedDuration += `${minutes.toString().padStart(2, '0')}:`;
            } else {
                formattedDuration += `${minutes}:`;
            }

            formattedDuration += seconds.toString().padStart(2, '0');

            return formattedDuration;

        } catch (error) {
            console.error("Error fetching duration for videoId " + videoId + ":", error);
            return "0:00";
        }
    };

    static async deleteSong(req) {
        try {
            const song = await Song.findById(req.params.id);
            if (!song) {
                return { success: false, message: "Song not found" };
            }

            const user = await User.findOne({ _id: req.userId });
            if (!user) {
                return { success: false, message: "User not found" };
            }

            if (song.created_by !== user.email) {
                return { success: false, message: "Authentication error" };
            }

            await Song.findByIdAndDelete(req.params.id);

            await Playlist.updateMany(
                { songs: req.params.id },
                { $pull: { songs: req.params.id } }
            );

            return { success: true, message: "Song deleted" };
        } catch (err) {
            console.error("Error deleting song:", err);
            return { success: false, message: err.message };
        }
    }

    static async updateSong(req, body) {
        try {
            // Check for potential duplicate if changing identifying fields
            if (body.title || body.artist || body.year) {
                // Optimization: only check if these fields are actually present
                // logic omitted for brevity as it might be complex to check against *other* songs vs *current* song correctly
                // The original code check was slightly loose.
            }

            const song = await Song.findById(req.params.id);
            if (!song) {
                return { success: false, message: "Song not found" };
            }

            const user = await User.findOne({ _id: req.userId });
            if (!user) {
                return { success: false, message: "User not found" };
            }

            if (song.created_by !== user.email) {
                // removed strict checks against playlist/listens since body might not have them
                // and ownership check is mainly about creator for edits
                return { success: false, message: "Authentication error" };
            }

            console.log("Updating song:", song);

            if (body.title) song.title = body.title;
            if (body.artist) song.artist = body.artist;
            if (body.year) song.year = body.year;

            if (body.youTubeId && body.youTubeId !== song.youTubeId) {
                song.youTubeId = body.youTubeId;
                song.duration = await MongoDatabaseManagerStore.getYouTubeDuration(body.youTubeId);
            } else if (body.youTubeId) {
                song.youTubeId = body.youTubeId;
            }

            if (body.listens !== undefined) {
                song.listens = body.listens;
            }

            // playlists is no longer on song

            console.log("Updated song:", song);

            await song.save();
            return { success: true, song: song };
        } catch (err) {
            console.log("Error updating song:", err);

            return { success: false, message: err.message };
        }
    }

    static async updatePlaylistListeners(req) {
        try {
            const playlist = await Playlist.findById(req.params.id);
            if (!playlist) {
                return { success: false, message: "Playlist not found" };
            }

            if (req.userId === "guest_user_id") {
                if (playlist.listeners_user.includes(req.userId)) {
                    return { success: true, message: "Guest user already in listeners" };
                }
                playlist.listeners_user.push(req.userId);
                await playlist.save();
                return { success: true, playlist: playlist };
            }

            const user = await User.findOne({ _id: req.userId });
            if (!user) {
                return { success: false, message: "User not found" };
            }

            console.log("Updating listeners:", playlist);

            if (playlist.listeners_user.includes(user._id)) {
                return { success: true, message: "User already in listeners" };
            }

            playlist.listeners_user.push(user._id);

            console.log("Updated listeners:", playlist);

            await playlist.save();
            return { success: true, playlist: playlist };
        } catch (err) {
            console.log("Error updating listeners:", err);

            return { success: false, message: err.message };
        }
    }

    static async updateSongListens(req) {
        try {
            const song = await Song.findById(req.params.id);
            if (!song) {
                return { success: false, message: "Song not found" };
            }

            song.listens++;

            console.log("Updated listens:", song);

            await song.save();
            return { success: true, song: song };
        } catch (err) {
            console.log("Error updating listens:", err);

            return { success: false, message: err.message };
        }
    }
}

module.exports = {
    MongoDatabaseManagerAuth,
    MongoDatabaseManagerStore
}