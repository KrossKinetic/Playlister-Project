const dotenv = require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose')
const Song = require('../db/mongo/song-model')

const songs = [
    {
        title: "I Want To Hold Your Hand",
        artist: "The Beatles",
        year: 1963,
        youTubeId: "v1HDt1tknTc",
        listens: 0,
        playlists: [],
        created_by: "kross@gmail.com"
    },
    {
        title: "Let It Be",
        artist: "The Beatles",
        year: 1970,
        youTubeId: "QDYfEBY9NM4",
        listens: 0,
        playlists: [],
        created_by: "kross@gmail.com"
    },
    {
        title: "Mister Sandman",
        artist: "Chet Atkins",
        year: 1954,
        youTubeId: "dfsG1ukihl4",
        listens: 0,
        playlists: [],
        created_by: "kross_other@gmail.com"
    },
    {
        title: "Folsom Prison Blues",
        artist: "Johnny Cash",
        year: 1955,
        youTubeId: "AeZRYhLDLeU",
        listens: 0,
        playlists: [],
        created_by: "kross_other@gmail.com"
    },
    {
        title: "Smooth Criminal",
        artist: "Michael Jackson",
        year: 1987,
        youTubeId: "h_D3VFfhvs4",
        listens: 0,
        playlists: [],
        created_by: "kross_other@gmail.com"
    },
    {
        title: "Yellow Submarine",
        artist: "The Beatles",
        year: 1968,
        youTubeId: "j_JaDDcyIIU",
        listens: 0,
        playlists: [],
        created_by: "kross_other@gmail.com"
    },
    {
        title: "Here Comes The Sun",
        artist: "The Beatles",
        year: 1969,
        youTubeId: "GKdl-GCsNJ0",
        listens: 0,
        playlists: [],
        created_by: "kross_other@gmail.com"
    },
    {
        title: "Don't Stop Me Now",
        artist: "Queen",
        year: 1979,
        youTubeId: "HgzGwKwLmgM",
        listens: 0,
        playlists: [],
        created_by: "kross_other@gmail.com"
    },
    {
        title: "September",
        artist: "Earth, Wind & Fire",
        year: 1978,
        youTubeId: "Gs069dndIYk",
        listens: 0,
        playlists: [],
        created_by: "kross_other@gmail.com"
    },
    {
        title: "Thunderstruck",
        artist: "AC/DC",
        year: 1990,
        youTubeId: "v2AC41dglnM",
        listens: 0,
        playlists: [],
        created_by: "kross_other@gmail.com"
    },
    {
        title: "Back In Black",
        artist: "AC/DC",
        year: 1980,
        youTubeId: "pAgnJDJN4VA",
        listens: 0,
        playlists: [],
        created_by: "kross_other@gmail.com"
    },
    {
        title: "Bohemian Rhapsody",
        artist: "Queen",
        year: 1975,
        youTubeId: "fJ9rUzIMcZQ",
        listens: 0,
        playlists: [],
        created_by: "kross_other@gmail.com"
    },
    {
        title: "Seven Nation Army",
        artist: "The White Stripes",
        year: 2003,
        youTubeId: "0J2QdDbelmY",
        listens: 0,
        playlists: [],
        created_by: "kross_other@gmail.com"
    },
    {
        title: "Paint It, Black",
        artist: "The Rolling Stones",
        year: 1966,
        youTubeId: "O4irXQhgMqg",
        listens: 0,
        playlists: [],
        created_by: "kross_other@gmail.com"
    },
    {
        title: "Dream On",
        artist: "Aerosmith",
        year: 1973,
        youTubeId: "89dGC8de0CA",
        listens: 0,
        playlists: [],
        created_by: "kross_other@gmail.com"
    },
    {
        title: "Hotel California",
        artist: "Eagles",
        year: 1976,
        youTubeId: "dLl4PZtxia8",
        listens: 0,
        playlists: [],
        created_by: "kross_other@gmail.com"
    },
    {
        title: "Yesterday",
        artist: "The Beatles",
        year: 1965,
        youTubeId: "NrgmdOz227I",
        listens: 0,
        playlists: [],
        created_by: "kross_other@gmail.com"
    },
    {
        title: "Stairway to Heaven",
        artist: "Led Zeppelin",
        year: 1971,
        youTubeId: "X791IzOwt3Q",
        listens: 0,
        playlists: [],
        created_by: "kross_other@gmail.com"
    },
    {
        title: "Just The Two Of Us",
        artist: "Grover Washington, Jr. and Bill Withers",
        year: 1980,
        youTubeId: "6POZlJAZsok",
        listens: 0,
        playlists: [],
        created_by: "kross_other@gmail.com"
    },
    {
        title: "Don't Worry, Be Happy",
        artist: "Bobby McFerrin",
        year: 1988,
        youTubeId: "d-diB65scQU",
        listens: 0,
        playlists: [],
        created_by: "kross_other@gmail.com"
    }
];

const Playlist = require('../db/mongo/playlist-model');

async function getYouTubeDuration(videoId) {

    const API_KEY = process.env.YOUTUBE_API_KEY;
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${API_KEY}`;

    try {
        // 2. FETCH: Call the API
        const response = await fetch(url);
        const data = await response.json();

        // 3. VALIDATE: Ensure video exists
        if (!data.items || data.items.length === 0) return "0:00";

        // 4. PARSE: Extract duration (Format is usually PT#H#M#S, e.g., "PT4M13S")
        const isoDuration = data.items[0].contentDetails.duration;
        const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

        // Parse parts (parseInt ignores the letters H, M, S automatically)
        const hours = (parseInt(match[1]) || 0);
        const minutes = (parseInt(match[2]) || 0);
        const seconds = (parseInt(match[3]) || 0);

        // 5. FORMAT: Convert to "MM:SS" or "H:MM:SS"
        let formattedDuration = "";

        if (hours > 0) {
            formattedDuration += `${hours}:`;
            formattedDuration += `${minutes.toString().padStart(2, '0')}:`;
        } else {
            formattedDuration += `${minutes}:`;
        }

        formattedDuration += seconds.toString().padStart(2, '0');

        return formattedDuration; // Returns "3:46" or "1:05:20"

    } catch (error) {
        console.error("Error fetching duration for videoId " + videoId + ":", error);
        return "0:00";
    }
};

async function populateSongs() {
    try {
        await mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true });
        console.log('Connected to Mongo, populating Song and Playlist collections...');

        // Clear existing data
        await Song.deleteMany({});
        console.log('Song collection cleared');
        await Playlist.deleteMany({});
        console.log('Playlist collection cleared');

        // Create Playlists (initially empty songs)
        const playlistsData = [
            { name: "Rock Classics", ownerEmail: "kross@gmail.com", listeners_user: [], songs: [] },
            { name: "My Pop Hits", ownerEmail: "kross@gmail.com", listeners_user: [], songs: [] },
            { name: "Chill Vibes", ownerEmail: "kross_other@gmail.com", listeners_user: [], songs: [] },
            { name: "Workout Mix", ownerEmail: "kross@gmail.com", listeners_user: [], songs: [] }
        ];

        // Insert empty playlists first to get IDs? Or just create docs?
        // Let's create docs but not save yet, or just save empty is fine.
        const createdPlaylists = await Playlist.insertMany(playlistsData);
        console.log(`Inserted ${createdPlaylists.length} playlists`);

        // Prepare Songs
        // We will insert songs first, then assign them to random playlists
        const songsWithDuration = [];

        for (let s = 0; s < songs.length; s++) {
            let song = songs[s];

            // Delete the old 'playlists' field if it exists in the source array object (it does in the file)
            delete song.playlists;

            // Fetch Duration
            let duration = "0:00";
            if (song.youTubeId) {
                // console.log(`Fetching duration for ${song.title} (${song.youTubeId})...`);
                duration = await getYouTubeDuration(song.youTubeId);
                // console.log(`Duration: ${duration}`);
            }

            songsWithDuration.push({
                ...song,
                duration: duration
            });
        }

        const createdSongs = await Song.insertMany(songsWithDuration);
        console.log(`Inserted ${createdSongs.length} songs`);

        // Now assign songs to playlists
        // For each song, randomly assign it to some playlists
        for (let i = 0; i < createdSongs.length; i++) {
            const song = createdSongs[i];
            const numAssignments = Math.floor(Math.random() * 2); // 0 or 1 playlist per song for simplicity, or more

            const shuffledPlaylists = createdPlaylists.sort(() => 0.5 - Math.random());

            // Let's ensure at least some songs get into playlists
            if (i < 10) {
                // Force first 10 songs into the first playlist
                createdPlaylists[0].songs.push(song._id);
            } else {
                if (Math.random() > 0.5) {
                    // randomly add to a random playlist
                    shuffledPlaylists[0].songs.push(song._id);
                }
            }
        }

        // Save updated playlists
        for (let p of createdPlaylists) {
            await p.save();
        }
        console.log("Updated playlists with songs");

    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        try { await mongoose.disconnect(); } catch (e) { }
        process.exit(0);
    }
}

populateSongs();
