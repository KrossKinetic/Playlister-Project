/*
    This is our http api, which we use to send requests to
    our back-end API. Note we`re using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

const BASE_URL = 'http://localhost:4000/store';

export async function api(path, options = {}) {
    const url = `${BASE_URL}${path}`;

    const res = await fetch(url, {
        credentials: 'include',
        ...options,
    });

    return res;
}

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES
export async function createPlaylist(newListName, userEmail) {
    const res = await api('/playlist/', { // This sends you the promise for the Response object
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: newListName,
            listeners_user: [],
            ownerEmail: userEmail
        })
    });

    let data = { success: false };
    try {
        data = await res.json();
    } catch (err) { }

    // res.json() is async because that retrieves the actual data, which could be big
    return { data: data, status: res.status, statusText: res.statusText };
}

export async function deletePlaylistById(id) {

    const res = await api(`/playlist/${id}`, {
        method: 'DELETE'
    });

    let data = { success: false };
    try {
        data = await res.json();
    } catch (err) { }

    return { data: data, status: res.status, statusText: res.statusText };
}

export async function getPlaylistById(id) {
    const res = await api(`/playlist/${id}`, {
        method: 'GET'
    });

    let data = { success: false };
    try {
        data = await res.json();
    } catch (err) { }

    return { data: data, status: res.status, statusText: res.statusText };
}

export async function getPlaylistPairs() {
    const res = await api(`/playlistpairs/`, {
        method: 'GET'
    });

    let data = { success: false };
    try {
        data = await res.json();
    } catch (err) { }

    return { data: data, status: res.status, statusText: res.statusText };
}

export async function getSongPairs() {
    const res = await api(`/songpairs/`, {
        method: 'GET'
    });

    let data = { success: false };
    try {
        data = await res.json();
    } catch (err) { }

    return { data: data, status: res.status, statusText: res.statusText };
}

export async function createSong(title, artist, year, youTubeId) {
    const res = await api(`/song/`, {
        method: 'POST',
        body: JSON.stringify({
            title: title,
            artist: artist,
            year: year,
            youTubeId: youTubeId
        }),
        headers: { 'Content-Type': 'application/json' }
    });

    let data = { success: false };
    try {
        data = await res.json();
    } catch (err) { }

    return { data: data, status: res.status, statusText: res.statusText };
}

export async function deleteSong(id) {
    const res = await api(`/song/${id}`, {
        method: 'DELETE'
    });

    let data = { success: false };
    try {
        data = await res.json();
    } catch (err) { }

    return { data: data, status: res.status, statusText: res.statusText };
}

export async function updateSong(id, song) {
    const res = await api(`/song/${id}`, {
        method: 'PUT',
        body: JSON.stringify(song),
        headers: { 'Content-Type': 'application/json' }
    });

    let data = { success: false };
    try {
        data = await res.json();
    } catch (err) { }

    return { data: data, status: res.status, statusText: res.statusText };
}

export async function updatePlaylistById(id, playlist) {
    const res = await api(`/playlist/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ playlist }),
        headers: { 'Content-Type': 'application/json' }
    });

    let data = { success: false };
    try {
        data = await res.json();
    } catch (err) { }

    return { data: data, status: res.status, statusText: res.statusText };
}

export async function getPlaylists() {
    const res = await api(`/playlists/`, {
        method: 'GET'
    });

    let data = { success: false };
    try {
        data = await res.json();
    } catch (err) { }

    return { data: data, status: res.status, statusText: res.statusText };
}

export async function updatePlaylistListeners(playlist_id) {
    const res = await api(`/playlistlisteners/${playlist_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    });

    let data = { success: false };
    try {
        data = await res.json();
    } catch (err) { }

    return { data: data, status: res.status, statusText: res.statusText };
}

export async function updateSongListens(song_id) {
    const res = await api(`/songlistens/${song_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    });

    let data = { success: false };
    try {
        data = await res.json();
    } catch (err) { }

    return { data: data, status: res.status, statusText: res.statusText };
}

const apis = {
    createPlaylist,
    deletePlaylistById,
    getPlaylistById,
    getPlaylistPairs,
    getSongPairs,
    updatePlaylistById,
    createSong,
    deleteSong,
    updateSong,
    getPlaylists,
    updatePlaylistListeners,
    updateSongListens
}
export default apis
