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

async function populateSongs() {
    try {
        await mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true });
        console.log('Connected to Mongo, populating Song and Playlist collections...');

        // Clear existing data
        await Song.deleteMany({});
        console.log('Song collection cleared');
        await Playlist.deleteMany({});
        console.log('Playlist collection cleared');

        // Create Playlists
        const playlistsData = [
            { name: "Rock Classics", ownerEmail: "kross@gmail.com", listens: 0, songs: [] },
            { name: "My Pop Hits", ownerEmail: "kross@gmail.com", listens: 0, songs: [] },
            { name: "Chill Vibes", ownerEmail: "kross_other@gmail.com", listens: 0, songs: [] },
            { name: "Workout Mix", ownerEmail: "kross@gmail.com", listens: 0, songs: [] }
        ];

        const createdPlaylists = await Playlist.insertMany(playlistsData);
        console.log(`Inserted ${createdPlaylists.length} playlists`);

        // Prepare Songs with Random Playlist Assignments
        const songsWithPlaylists = songs.map(song => {
            const assignedPlaylists = [];
            // Randomly assign to 0-3 playlists
            const numAssignments = Math.floor(Math.random() * 4);
            // Shuffle playlists to pick random ones
            const shuffledPlaylists = createdPlaylists.sort(() => 0.5 - Math.random());

            for (let i = 0; i < numAssignments; i++) {
                if (shuffledPlaylists[i]) {
                    assignedPlaylists.push(shuffledPlaylists[i]._id);
                }
            }
            return {
                ...song,
                playlists: assignedPlaylists
            };
        });

        await Song.insertMany(songsWithPlaylists);
        console.log(`Inserted ${songsWithPlaylists.length} songs with playlist assignments`);

    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        try { await mongoose.disconnect(); } catch (e) { }
        process.exit(0);
    }
}

populateSongs();


