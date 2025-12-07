import { useContext, useEffect, useState, useRef } from 'react';
import { GlobalStoreContext } from '../store';
import AuthContext from '../auth';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import MUIDeleteModal from './MUIDeleteModal';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MUIPlayPlaylistModal from './MUIPlayPlaylistModal';
import MUIEditPlaylistModal from './MUIEditPlaylistModal';

function PlaylistsScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [expandedPlaylists, setExpandedPlaylists] = useState({});

    const [filteredPlaylists, setFilteredPlaylists] = useState([]);
    const [searchPlaylistName, setSearchPlaylistName] = useState("");
    const [searchUserName, setSearchUserName] = useState("");
    const [searchSongTitle, setSearchSongTitle] = useState("");
    const [searchSongArtist, setSearchSongArtist] = useState("");
    const [searchSongYear, setSearchSongYear] = useState("");
    const [sortType, setSortType] = useState("listeners-hi-lo");
    const hasInitialSorted = useRef(false);

    const [wasModalOpen, setWasModalOpen] = useState(false);
    const [isUserFilterActive, setIsUserFilterActive] = useState(false);

    const [playingPlaylist, setPlayingPlaylist] = useState(null);
    const [editingPlaylist, setEditingPlaylist] = useState(null);
    const [playlistToDelete, setPlaylistToDelete] = useState(null);

    useEffect(() => {
        store.loadPlaylists();
    }, []);

    useEffect(() => {
        console.log(store.playlists);
        if (store.playlists) {
            if (wasModalOpen) {
                setWasModalOpen(false);
            }
            console.log("PlaylistsScreen Effect: Source=", store.songCatalogSource, "CurrentList=", store.currentList);
            if (store.songCatalogSource === "Modal" && store.currentList) {
                const freshPlaylist = store.playlists.find(p => p._id === store.currentList._id);
                if (freshPlaylist) {
                    store.setCurrentList(freshPlaylist);
                    setEditingPlaylist(freshPlaylist);
                }
                store.setSongCatalogSource(null);
            }

            const hasSearch = searchPlaylistName || searchUserName || searchSongTitle || searchSongArtist || searchSongYear;

            if (hasSearch) {
                handleSearch();
            } else {
                let listToRender;
                let shouldBeUserFilter = isUserFilterActive;

                if (auth.loggedIn && auth.guestLoggedIn === false) {
                    if (!hasInitialSorted.current) {
                        shouldBeUserFilter = true;
                        listToRender = store.playlists.filter(p => p.ownerEmail === auth.user.email);
                        const comparator = getComparator("listeners-hi-lo");
                        if (comparator) listToRender.sort(comparator);
                        hasInitialSorted.current = true;
                    } else if (isUserFilterActive) {
                        listToRender = store.playlists.filter(p => p.ownerEmail === auth.user.email);
                    } else {
                        listToRender = [...store.playlists];
                    }
                } else {
                    listToRender = [...store.playlists];
                    shouldBeUserFilter = false;
                }

                if (listToRender) {
                    const comparator = getComparator(sortType);
                    if (comparator) listToRender.sort(comparator);
                }

                setFilteredPlaylists(listToRender);
                setIsUserFilterActive(shouldBeUserFilter);
            }
        }
    }, [store.playlists]);

    const handleTogglePlaylist = (id) => {
        setExpandedPlaylists(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleCreateNewPlaylist = () => {
        store.createNewList();
        setWasModalOpen(true);
    };

    const handleDeletePlaylist = (playlist, event) => {
        event.stopPropagation();
        setPlaylistToDelete(playlist);
    };

    const handleConfirmDelete = () => {
        store.deleteList(playlistToDelete._id);
        setPlaylistToDelete(null);
        setWasModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setPlaylistToDelete(null);
    };

    const handlePlayPlaylist = (playlist) => {
        store.updatePlaylistListeners(playlist._id);
        setPlayingPlaylist(playlist);
    };

    const handleClosePlayModal = () => {
        setPlayingPlaylist(null);
    };

    const handleEditPlaylist = (playlist) => {
        store.setCurrentList(playlist);
        setEditingPlaylist(playlist);
    };

    const handleCloseEditModal = () => {
        store.setCurrentList(null);
        store.loadPlaylists();
        setEditingPlaylist(null);
    };

    const getComparator = (type) => {
        switch (type) {
            case "listeners-hi-lo": return (a, b) => (b.listeners_user?.length || 0) - (a.listeners_user?.length || 0);
            case "listeners-lo-hi": return (a, b) => (a.listeners_user?.length || 0) - (b.listeners_user?.length || 0);
            case "name-a-z": return (a, b) => a.name.localeCompare(b.name);
            case "name-z-a": return (a, b) => b.name.localeCompare(a.name);
            case "owner-a-z": return (a, b) => (a.username || "").localeCompare(b.username || "");
            case "owner-z-a": return (a, b) => (b.username || "").localeCompare(a.username || "");
            default: return null;
        }
    };

    const handleSort = (type) => {
        setSortType(type);
        const comparator = getComparator(type);
        if (comparator && filteredPlaylists) {
            const sorted = [...filteredPlaylists].sort(comparator);
            setFilteredPlaylists(sorted);
        }
    };

    const handleSearch = () => {

        if (!store.playlists) return;
        const filtered = store.playlists.filter(p => {
            const nameMatch = p.name.toLowerCase().includes(searchPlaylistName.toLowerCase());
            const userMatch = (p.username || "").toLowerCase().includes(searchUserName.toLowerCase());
            const songTitleMatch = !searchSongTitle || (p.songs && p.songs.some(s => s.title.toLowerCase().includes(searchSongTitle.toLowerCase())));
            const songArtistMatch = !searchSongArtist || (p.songs && p.songs.some(s => s.artist.toLowerCase().includes(searchSongArtist.toLowerCase())));
            const songYearMatch = !searchSongYear || (p.songs && p.songs.some(s => s.year.toString().includes(searchSongYear)));

            return nameMatch && userMatch && songTitleMatch && songArtistMatch && songYearMatch;
        });

        const comparator = getComparator(sortType);
        if (comparator) {
            filtered.sort(comparator);
        }
        setFilteredPlaylists(filtered);
        setIsUserFilterActive(false);
    };

    const handleClear = () => {
        setSearchPlaylistName("");
        setSearchUserName("");
        setSearchSongTitle("");
        setSearchSongArtist("");
        setSearchSongYear("");
        setSortType("listeners-hi-lo");

        let defaultList;
        if (auth.loggedIn && auth.guestLoggedIn === false) {
            defaultList = store.playlists.filter(p => (p.ownerEmail === auth.user.email));
            setIsUserFilterActive(true);
        } else {
            defaultList = [...store.playlists];
            setIsUserFilterActive(false);
        }
        const comparator = getComparator("listeners-hi-lo");
        if (comparator) {
            defaultList.sort(comparator);
        }
        setFilteredPlaylists(defaultList);
    };

    const renderTextField = (label, value, setter) => (
        <TextField
            margin="normal"
            fullWidth
            label={label}
            size="small"
            autoComplete="off"
            value={value}
            onChange={(e) => setter(e.target.value)}
            variant="filled"
            InputProps={{
                disableUnderline: true,
                endAdornment: value && (
                    <InputAdornment position="end">
                        <IconButton onClick={() => setter("")} edge="end" size="small">
                            <ClearIcon />
                        </IconButton>
                    </InputAdornment>
                )
            }}
            sx={{ bgcolor: '#d4d4f7', borderRadius: 1, '& .MuiFilledInput-root': { bgcolor: '#d4d4f7', borderRadius: 1 } }}
        />
    );

    return (
        <Box sx={{ display: 'flex', width: '100%', height: '90vh', bgcolor: '#fffff0' }}>
            <Box sx={{ width: '50%', borderRight: '2px solid #9d9d9dff', p: 2, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h4" sx={{ color: '#aa00aa', fontWeight: 'bold', mb: 2 }}>Playlists</Typography>
                <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); handleSearch(); }} sx={{ mt: 1 }}>
                    {renderTextField("by Playlist Name", searchPlaylistName, setSearchPlaylistName)}
                    {renderTextField("by User Name", searchUserName, setSearchUserName)}
                    {renderTextField("by Song Title", searchSongTitle, setSearchSongTitle)}
                    {renderTextField("by Song Artist", searchSongArtist, setSearchSongArtist)}
                    {renderTextField("by Song Year", searchSongYear, setSearchSongYear)}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <Button
                            variant="contained"
                            startIcon={<SearchIcon />}
                            onClick={handleSearch}
                            sx={{ borderRadius: 5, bgcolor: '#6a5acd', color: 'white', textTransform: 'none', px: 4, '&:hover': { bgcolor: '#483d8b' } }}
                        >
                            Search
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => handleClear()}
                            sx={{ borderRadius: 5, bgcolor: '#6a5acd', color: 'white', textTransform: 'none', px: 4, '&:hover': { bgcolor: '#483d8b' } }}
                        >
                            Clear
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ width: '50%', p: 2, display: 'flex', flexDirection: 'column', height: '95%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="sort-select-label">Sort By</InputLabel>
                        <Select
                            labelId="sort-select-label"
                            id="sort-select"
                            value={sortType}
                            label="Sort By"
                            onChange={(e) => handleSort(e.target.value)}
                        >
                            <MenuItem value="listeners-hi-lo">Listeners (High-Low)</MenuItem>
                            <MenuItem value="listeners-lo-hi">Listeners (Low-High)</MenuItem>
                            <MenuItem value="name-a-z">Name (A-Z)</MenuItem>
                            <MenuItem value="name-z-a">Name (Z-A)</MenuItem>
                            <MenuItem value="owner-a-z">User (A-Z)</MenuItem>
                            <MenuItem value="owner-z-a">User (Z-A)</MenuItem>
                        </Select>
                    </FormControl>
                    {
                        filteredPlaylists && (
                            <Typography variant="h6" sx={{ m: 1 }}>
                                {filteredPlaylists.length} Playlists
                            </Typography>
                        )
                    }
                </Box>
                <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
                    {
                        filteredPlaylists && filteredPlaylists.map((playlist) => (
                            <Box key={playlist._id} sx={{ mb: 2 }}>
                                <Box
                                    sx={{
                                        p: 2,
                                        border: playlist.ownerEmail === auth.user.email ? '2px solid #990000' : '1px solid #ddd',
                                        borderRadius: 3,
                                        bgcolor: '#ffecb3',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative',
                                        boxShadow: '0px 4px 6px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Avatar
                                                src={playlist.avatarPng}
                                                sx={{ width: 80, height: 80, mr: 2, border: '1px solid #ccc' }}
                                            />
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{playlist.name}</Typography>
                                                <Typography variant="body2" color="text.secondary">{playlist?.username ?? "Username"}</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 'bold', }} color="text.secondary">
                                                    {playlist.listeners_user?.length || 0} Listeners
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 'bold', }} color="text.secondary">
                                                    {playlist.songs.length} Songs
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Action Buttons */}
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            {
                                                playlist.ownerEmail === auth.user.email && (
                                                    <>
                                                        <Button
                                                            variant="contained"
                                                            onClick={(e) => handleDeletePlaylist(playlist, e)}
                                                            sx={{
                                                                bgcolor: '#d32f2f', color: 'white', textTransform: 'none', borderRadius: 2,
                                                                minWidth: '60px', height: '30px', fontSize: '0.8rem',
                                                                '&:hover': { bgcolor: '#b71c1c' }
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            onClick={(e) => { e.stopPropagation(); handleEditPlaylist(playlist); }}
                                                            sx={{
                                                                bgcolor: '#1976d2', color: 'white', textTransform: 'none', borderRadius: 2,
                                                                minWidth: '50px', height: '30px', fontSize: '0.8rem',
                                                                '&:hover': { bgcolor: '#1565c0' }
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </>
                                                )
                                            }
                                            {
                                                !auth.guestLoggedIn && (
                                                    <Button
                                                        variant="contained"
                                                        onClick={(e) => { e.stopPropagation(); store.copyPlaylist(playlist._id); }}
                                                        sx={{
                                                            bgcolor: '#388e3c', color: 'white', textTransform: 'none', borderRadius: 2,
                                                            minWidth: '50px', height: '30px', fontSize: '0.8rem',
                                                            '&:hover': { bgcolor: '#2e7d32' }
                                                        }}
                                                    >
                                                        Copy
                                                    </Button>
                                                )
                                            }
                                            <Button
                                                variant="contained"
                                                onClick={() => handlePlayPlaylist(playlist)}
                                                sx={{
                                                    bgcolor: '#e040fb', color: 'white', textTransform: 'none', borderRadius: 2,
                                                    minWidth: '50px', height: '30px', fontSize: '0.8rem',
                                                    '&:hover': { bgcolor: '#d500f9' }
                                                }}
                                            >
                                                Play
                                            </Button>
                                        </Box>
                                    </Box>


                                    <Collapse in={expandedPlaylists[playlist._id]} timeout="auto" unmountOnExit>
                                        <Box sx={{ mt: 2, borderTop: '1px solid #000000ff', pt: 1, maxHeight: '200px', overflowY: 'auto' }}>
                                            {playlist.songs && playlist.songs.map((song, index) => (
                                                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="body2" sx={{ ml: 2, py: 0.5 }}>
                                                        {index + 1}. {song.title}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ ml: 2, p: 0.5 }}>
                                                        {song.duration}
                                                    </Typography>
                                                </Box>
                                            ))}
                                            {(!playlist.songs || playlist.songs.length === 0) && (
                                                <Typography variant="body2" sx={{ ml: 2, fontStyle: 'italic' }}>No songs in this playlist.</Typography>
                                            )}
                                        </Box>
                                    </Collapse>

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                        <IconButton size="small" onClick={() => handleTogglePlaylist(playlist._id)}>
                                            {expandedPlaylists[playlist._id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Box>
                        ))
                    }
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'start', pb: 3, pt: 2 }}>
                    {
                        auth.loggedIn && (auth.guestLoggedIn === false) && (
                            <Button
                                variant="contained"
                                startIcon={<AddCircleIcon />}
                                sx={{
                                    borderRadius: 5,
                                    bgcolor: '#6a5acd',
                                    color: 'white',
                                    textTransform: 'none',
                                    fontSize: '1.1rem',
                                    px: 4,
                                    '&:hover': { bgcolor: '#483d8b' }
                                }}
                                onClick={handleCreateNewPlaylist}
                            >
                                New Playlist
                            </Button>)
                    }
                </Box>
            </Box>
            <MUIDeleteModal
                open={playlistToDelete !== null}
                playlistName={playlistToDelete ? playlistToDelete.name : ''}
                onConfirm={handleConfirmDelete}
                onClose={handleCloseDeleteModal}
            />
            <MUIPlayPlaylistModal
                open={playingPlaylist !== null}
                handleClose={handleClosePlayModal}
                playlist={playingPlaylist}
            />
            <MUIEditPlaylistModal
                open={editingPlaylist !== null}
                handleClose={handleCloseEditModal}
                playlist={editingPlaylist}
            />
        </Box>
    );
}

export default PlaylistsScreen;
