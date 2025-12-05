const DatabaseManager = require('../db/index');
const auth = require('../auth')
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const body = req.body;
    console.log("createPlaylist body: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            errorMessage: 'You must provide a Playlist',
        })
    }

    const response = await DatabaseManager.createPlaylist(req, body);

    if (!response || !response.success) {
        return res.status(400).json({
            success: false,
            errorMessage: response?.message || 'Failed to create playlist'
        });
    }

    return res.status(201).json({
        success: true,
        playlist: response.playlist
    });
}
deletePlaylist = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }

    console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);

    const response = await DatabaseManager.deletePlaylist(req);

    if (!response || !response.success) {
        return res.status(400).json({
            success: false,
            errorMessage: response?.message || 'Failed to delete playlist'
        });
    }

    return res.status(200).json({
        success: true,
        message: 'Playlist deleted successfully!'
    });
}
getPlaylistById = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

    const response = await DatabaseManager.getPlaylistById(req);

    console.log("stuff", response)

    if (!response || !response.success) {
        return res.status(400).json({
            success: false,
            errorMessage: response?.message || 'Failed to get playlist'
        });
    }

    return res.status(200).json({
        success: true,
        playlist: response.playlist
    });
}

getPlaylistPairs = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }

    console.log("getPlaylistPairs");

    const response = await DatabaseManager.getPlaylistPairs(req);

    if (!response || !response.success) {
        return res.status(400).json({
            success: false,
            errorMessage: response?.message || 'Failed to get playlist pairs'
        });
    }

    return res.status(200).json({
        success: true,
        idNamePairs: response.idNamePairs
    });
}

getSongPairs = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }

    console.log("getSongPairs");

    const response = await DatabaseManager.getSongPairs(req);

    if (!response || !response.success) {
        return res.status(400).json({
            success: false,
            errorMessage: response?.message || 'Failed to get song pairs'
        });
    }

    return res.status(200).json({
        success: true,
        songs: response.songs
    });
    return res.status(200).json({
        success: true,
        songs: response.songs
    });
}

createSong = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const body = req.body;
    console.log("createSong body: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            errorMessage: 'You must provide a Song',
        })
    }

    const response = await DatabaseManager.createSong(req, body);

    if (!response || !response.success) {
        return res.status(400).json({
            success: false,
            errorMessage: response?.message || 'Failed to create song'
        });
    }

    return res.status(201).json({
        success: true,
        song: response.song
    });
}

deleteSong = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    console.log("deleteSong with id: " + JSON.stringify(req.params.id));

    const response = await DatabaseManager.deleteSong(req);

    if (!response || !response.success) {
        return res.status(400).json({
            success: false,
            errorMessage: response?.message || 'Failed to delete song'
        });
    }

    return res.status(200).json({
        success: true,
        message: 'Song deleted successfully!'
    });
}

updateSong = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const body = req.body;
    console.log("updateSong: " + JSON.stringify(body));

    if (!body) {
        return res.status(400).json({
            success: false,
            errorMessage: 'You must provide a body to update',
        })
    }

    const response = await DatabaseManager.updateSong(req, body);

    if (!response || !response.success) {
        return res.status(400).json({
            success: false,
            errorMessage: response?.message || 'Failed to update song'
        });
    }

    return res.status(200).json({
        success: true,
        song: response.song
    });
}

getPlaylists = async (req, res) => {
    const response = await DatabaseManager.getPlaylists()

    if (!response || !response.success) {
        return res.status(400).json({
            success: false,
            errorMessage: response?.message || 'Failed to get playlists'
        });
    }

    return res.status(200).json({
        success: true,
        playlists: response.data
    });
}
updatePlaylist = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const body = req.body
    console.log("updatePlaylist: " + JSON.stringify(body));
    console.log("req.body.name: " + req.body.name);

    if (!body) {
        return res.status(400).json({
            success: false,
            errorMessage: 'You must provide a body to update',
        })
    }

    const response = await DatabaseManager.updatePlaylist(req, body);

    if (!response || !response.success) {
        return res.status(400).json({
            success: false,
            errorMessage: response?.message || 'Failed to update playlist'
        });
    }

    return res.status(200).json({
        success: true,
        playlist: response.playlist
    });
}
module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getSongPairs,
    getPlaylists,
    updatePlaylist,
    createSong,
    deleteSong,
    updateSong
}