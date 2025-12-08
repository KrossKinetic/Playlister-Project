const dotenv = require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Song = require('../db/mongo/song-model');
const Playlist = require('../db/mongo/playlist-model');
const User = require('../db/mongo/user-model');

const playlisterData = require('./PlaylisterData.json');

async function isValidYoutube(videoId) {
    if (!videoId) return false;
    const url = `https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${videoId}&format=json`;
    try {
        const response = await fetch(url);
        return response.status === 200;
    } catch (error) {
        return false;
    }
}

async function seed() {
    try {
        await mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true });
        console.log('Connected to Mongo, clearing collections...');

        await Song.deleteMany({});
        await Playlist.deleteMany({});
        await User.deleteMany({});
        console.log('Collections cleared.');

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash("123456789", salt);

        console.log('Seeding Users...');
        const usersToInsert = playlisterData.users.map(u => ({
            username: u.name,
            email: u.email.toLowerCase(),
            passwordHash: passwordHash,
            avatarPng: "1",
            playlists: []
        }));

        await User.insertMany(usersToInsert);
        console.log(`Inserted ${usersToInsert.length} users.`);

        console.log('Seeding Playlists & Songs');
        let totalSongsInserted = 0;
        let skippedSongs = 0;

        for (const pData of playlisterData.playlists) {
            const ownerEmailLower = pData.ownerEmail.toLowerCase();
            const playlistDoc = new Playlist({
                name: pData.name,
                ownerEmail: ownerEmailLower,
                listeners_user: [],
                songs: [],
                lastAccessed: Date.now()
            });

            for (const sData of pData.songs) {
                const existingSong = await Song.findOne({
                    youTubeId: { $regex: new RegExp(`^${sData.youTubeId}$`, "i") }
                });

                if (existingSong) {
                    playlistDoc.songs.push(existingSong._id);
                    continue;
                }

                if (await isValidYoutube(sData.youTubeId)) {
                    const songDoc = new Song({
                        title: sData.title,
                        artist: sData.artist,
                        year: sData.year,
                        youTubeId: sData.youTubeId,
                        listens: 0,
                        created_by: ownerEmailLower,
                        duration: "0:00"
                    });

                    const savedSong = await songDoc.save();
                    playlistDoc.songs.push(savedSong._id);
                    totalSongsInserted++;
                } else {
                    console.log(`Skipping invalid song: ${sData.title} (${sData.youTubeId})`);
                    skippedSongs++;
                }
            }

            await playlistDoc.save();

            await User.findOneAndUpdate(
                { email: ownerEmailLower },
                { $push: { playlists: playlistDoc._id } }
            );
        }

        console.log(`Seeding complete. Inserted ${totalSongsInserted} songs. Skipped ${skippedSongs} invalid songs.`);

    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        try { await mongoose.disconnect(); } catch (e) { }
        process.exit(0);
    }
}

seed();
