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

function PlaylistsScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [expandedPlaylists, setExpandedPlaylists] = useState({});

    // Filtering & Sorting State
    const [filteredPlaylists, setFilteredPlaylists] = useState([]);
    const [searchPlaylistName, setSearchPlaylistName] = useState("");
    const [searchUserName, setSearchUserName] = useState("");
    const [searchSongTitle, setSearchSongTitle] = useState("");
    const [searchSongArtist, setSearchSongArtist] = useState("");
    const [searchSongYear, setSearchSongYear] = useState("");
    const [sortType, setSortType] = useState("listens-hi-lo");
    const hasInitialSorted = useRef(false);

    useEffect(() => {
        store.loadPlaylists();
    }, []);

    useEffect(() => {
        if (store.playlists) {
            let initialList;

            if (auth.loggedIn && auth.guestLoggedIn === false) {
                initialList = store.playlists.filter(p => (p.ownerEmail === auth.user.email));
            } else {
                initialList = store.playlists;
            }

            if (!hasInitialSorted.current && initialList.length > 0) {
                const comparator = getComparator("listens-hi-lo");
                if (comparator) {
                    initialList.sort(comparator);
                }
                hasInitialSorted.current = true;
            }
            setFilteredPlaylists(initialList);
        }
    }, [store.playlists]);

    const handleTogglePlaylist = (id) => {
        setExpandedPlaylists(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const getComparator = (type) => {
        switch (type) {
            case "listens-hi-lo": return (a, b) => b.listens - a.listens;
            case "listens-lo-hi": return (a, b) => a.listens - b.listens;
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
    };

    const handleClear = () => {
        setSearchPlaylistName("");
        setSearchUserName("");
        setSearchSongTitle("");
        setSearchSongArtist("");
        setSearchSongYear("");
        setSortType("listens-hi-lo");

        let defaultList;

        if (auth.loggedIn && auth.guestLoggedIn === false) {
            defaultList = store.playlists.filter(p => (p.ownerEmail === auth.user.email));
        } else {
            defaultList = store.playlists;
        }
        const comparator = getComparator(sortType);
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
        <Box sx={{ display: 'flex', width: '100%', height: '80vh', bgcolor: '#fffff0' }}>
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
                            <MenuItem value="listens-hi-lo">Listens (High-Low)</MenuItem>
                            <MenuItem value="listens-lo-hi">Listens (Low-High)</MenuItem>
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
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Avatar
                                            src={playlist.avatarPng}
                                            sx={{ width: 80, height: 80, mr: 2, border: '1px solid #ccc' }}
                                        />
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{playlist.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">{playlist?.username ?? "Username"}</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', }} color="text.secondary">
                                                {playlist.listens} Listeners
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', }} color="text.secondary">
                                                {playlist.songs.length} Songs
                                            </Typography>
                                        </Box>
                                    </Box>


                                    <Collapse in={expandedPlaylists[playlist._id]} timeout="auto" unmountOnExit>
                                        <Box sx={{ mt: 2, borderTop: '1px solid #000000ff', pt: 1, maxHeight: '200px', overflowY: 'auto' }}>
                                            {playlist.songs && playlist.songs.map((song, index) => (
                                                <Typography key={index} variant="body2" sx={{ ml: 2, py: 0.5 }}>
                                                    {index + 1}. {song.title}
                                                </Typography>
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
            </Box>
        </Box>
    );
}

export default PlaylistsScreen;
