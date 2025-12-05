import { useContext, useEffect, useState, useRef } from 'react';
import { GlobalStoreContext } from '../store';
import AuthContext from '../auth';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import YouTubePlayer from './youtube';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MUIDeleteSongModal from './MUIDeleteSongModal';
import MUIEditSongModal from './MUIEditSongModal';
import MUICreateSongModal from './MUICreateSongModal';
import ErrorToast from './ErrorToast';

function SongsCatalog() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [filteredSongs, setFilteredSongs] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [searchArtist, setSearchArtist] = useState("");
    const [searchYear, setSearchYear] = useState("");
    const [sortType, setSortType] = useState("listens-hi-lo");
    const hasInitialSorted = useRef(false);
    const [isSongPlaying, setIsSongPlaying] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [wasModalOpen, setWasModalOpen] = useState(false);
    const [isUserFilterActive, setIsUserFilterActive] = useState(false);
    const isMenuOpen = Boolean(anchorEl);
    const [errorToastState, setErrorToastState] = useState({
        open: false,
        message: ""
    });

    const [currentSong, setCurrentSong] = useState({
        title: "",
        artist: "",
        year: "",
        youTubeId: "",
        created_by: "",
        listens: 0,
        playlists: [],
        playlistsCount: 0,
        _id: ""
    });

    const [isRemoveSongModalOpen, setIsRemoveSongModalOpen] = useState(false);
    const [isEditSongModalOpen, setIsEditSongModalOpen] = useState(false);
    const [isCreateSongModalOpen, setIsCreateSongModalOpen] = useState(false);

    const [EditSongModalError, setEditSongModalError] = useState("");
    const [CreateSongModalError, setCreateSongModalError] = useState("");


    useEffect(() => {
        store.loadSongCatalog();
        store.loadPlaylists();
    }, []);

    useEffect(() => {
        store.loadSongCatalog();
        store.loadPlaylists();
        if (auth.loggedIn && auth.guestLoggedIn === false) {
            setFilteredSongs(store.songCatalog.filter(s => (s.created_by === auth.user.email)));
            setIsUserFilterActive(true);
        } else {
            setFilteredSongs(store.songCatalog);
            setIsUserFilterActive(false);
        }
    }, [auth]);

    useEffect(() => {
        if (!wasModalOpen) {
            if (auth.loggedIn && auth.guestLoggedIn === false) {
                setFilteredSongs(store.songCatalog.filter(s => (s.created_by === auth.user.email)));
                setIsUserFilterActive(true);
            } else {
                setFilteredSongs(store.songCatalog);
                setIsUserFilterActive(false);
            }
        } else {
            setWasModalOpen(false);
            if (isUserFilterActive) {
                let tempFilter = store.songCatalog.filter(s => (s.created_by === auth.user.email));
                const comparator = getComparator(sortType);
                if (comparator && tempFilter) {
                    const sorted = [...tempFilter].sort(comparator);
                    setFilteredSongs(sorted);
                }
            } else {
                setFilteredSongs(store.songCatalog);
                handleSearch();
            }
        }
        if (store.songCatalog && (store.songCatalog.length > 0) && (!hasInitialSorted.current)) {
            handleSort("title-a-z");
            hasInitialSorted.current = true;
        }
    }, [store.songCatalog]);

    const getComparator = (type) => {
        switch (type) {
            case "listens-hi-lo":
                return (a, b) => b.listens - a.listens;
            case "listens-lo-hi":
                return (a, b) => a.listens - b.listens;
            case "playlists-hi-lo":
                return (a, b) => b.playlistsCount - a.playlistsCount;
            case "playlists-lo-hi":
                return (a, b) => a.playlistsCount - b.playlistsCount;
            case "title-a-z":
                return (a, b) => a.title.localeCompare(b.title);
            case "title-z-a":
                return (a, b) => b.title.localeCompare(a.title);
            case "artist-a-z":
                return (a, b) => a.artist.localeCompare(b.artist);
            case "artist-z-a":
                return (a, b) => b.artist.localeCompare(a.artist);
            case "year-hi-lo":
                return (a, b) => b.year - a.year;
            case "year-lo-hi":
                return (a, b) => a.year - b.year;
            default:
                return null;
        }
    };

    const handleSongClick = (song) => {
        setCurrentSongIndex(filteredSongs.indexOf(song));
        setIsSongPlaying(true);
    };

    const handleSort = (type) => {
        setSortType(type);
        const comparator = getComparator(type);
        if (comparator && filteredSongs) {
            const sorted = [...filteredSongs].sort(comparator);
            setFilteredSongs(sorted);
        }
    };

    const handleSearch = () => {
        const filtered = store.songCatalog.filter(song => {
            const titleMatch = song.title.toLowerCase().includes(searchTitle.toLowerCase());
            const artistMatch = song.artist.toLowerCase().includes(searchArtist.toLowerCase());
            const yearMatch = searchYear === "" || song.year.toString().includes(searchYear);
            return titleMatch && artistMatch && yearMatch;
        });
        const comparator = getComparator(sortType);
        if (comparator) {
            filtered.sort(comparator);
        }
        setFilteredSongs(filtered);
        setIsSongPlaying(false);
        setIsUserFilterActive(false);
    };

    const handleClear = () => {
        setSearchTitle("");
        setSearchArtist("");
        setSearchYear("");
        setSortType("listens-hi-lo");
        setIsSongPlaying(false);
        setCurrentSongIndex(0);
        if (auth.loggedIn && auth.guestLoggedIn === false) {
            setFilteredSongs(store.songCatalog.filter(s => (s.created_by === auth.user.email)));
            setIsUserFilterActive(true);
        } else {
            setFilteredSongs(store.songCatalog);
            setIsUserFilterActive(false);
        }
    };

    const handleMenuOpen = (event, song) => {
        setCurrentSong(song);
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const [anchorElAdd, setAnchorElAdd] = useState(null);
    const isMenuOpenAdd = Boolean(anchorElAdd);

    const handleMenuOpenAdd = (event) => {
        setAnchorElAdd(event.currentTarget);
        setWasModalOpen(true);
    };

    const handleMenuCloseAdd = () => {
        setAnchorElAdd(null);
        handleMenuClose();
    };

    const handleAddSongToPlaylist = async (playlist, song) => {
        console.log("Playlists:", song.playlists);
        const response = await store.updateSong(song._id, {
            title: song.title,
            artist: song.artist,
            year: song.year,
            youTubeId: song.youTubeId,
            playlists: [...song.playlists, playlist._id]
        });

        if (response === "success") {
            handleMenuCloseAdd();
        } else {
            if (response === "Song already exists, choose a different title, artist, or year") {
                setErrorToastState({
                    open: true,
                    message: "This song already exists in this playlist, choose a different song or playlist."
                })
            } else {
                setErrorToastState({
                    open: true,
                    message: response
                })
            }
        }
    };

    const handleMenuCloseEdit = () => {
        setAnchorEl(null);
        setIsEditSongModalOpen(true);
    };

    const handleMenuCloseRemove = () => {
        setAnchorEl(null);
        setIsRemoveSongModalOpen(true);
    };

    const handleConfirmRemoveSong = () => {
        store.removeSong(currentSong._id);
        setWasModalOpen(true);
        setIsRemoveSongModalOpen(false);
    };

    const handleCancelRemoveSong = () => {
        setIsRemoveSongModalOpen(false);
    };

    const handleConfirmEditSong = async (title, artist, year, youTubeId) => {
        const result = await store.updateSong(currentSong._id, {
            title: title,
            artist: artist,
            year: year,
            youTubeId: youTubeId
        });
        if (result === "success") {
            setIsEditSongModalOpen(false);
        } else {
            setEditSongModalError(result);
        }
        setWasModalOpen(true);
    };

    const handleCancelEditSong = () => {
        setIsEditSongModalOpen(false);
    };

    const handleCreateNewSong = () => {
        setIsCreateSongModalOpen(true);
    };

    const handleCreateNewSongSubmit = async (title, artist, year, youTubeId) => {
        const result = await store.createNewSong(title, artist, year, youTubeId);
        if (result === "success") {
            setIsCreateSongModalOpen(false);
        } else {
            setCreateSongModalError(result);
        }
        setWasModalOpen(true);
    };

    const handleCancelCreateSong = () => {
        setIsCreateSongModalOpen(false);
    };

    let menu_list = [];
    if (store.playlists && auth.user) {
        menu_list = store.playlists.filter(p => p.ownerEmail === auth.user.email);
    }

    return (
        <Box sx={{ display: 'flex', width: '100%', height: '80vh', bgcolor: '#fffff0' }}>
            <Box sx={{ width: '50%', borderRight: '2px solid #9d9d9dff', p: 2 }}>
                <h1 style={{ color: '#aa00aa', fontSize: '3rem', margin: '0 0 20px 0' }}>Songs Catalog</h1>
                <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); handleSearch(); }} sx={{ mt: 2 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="title"
                        label="by Title"
                        name="title"
                        autoComplete="off"
                        autoFocus
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                        variant="filled"
                        InputProps={{
                            disableUnderline: true,
                            endAdornment: searchTitle && (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setSearchTitle("")} edge="end">
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        sx={{ bgcolor: '#e6e6fa', borderRadius: 1, '& .MuiFilledInput-root': { bgcolor: '#e6e6fa', borderRadius: 1 } }}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="artist"
                        label="by Artist"
                        id="artist"
                        autoComplete="off"
                        value={searchArtist}
                        onChange={(e) => setSearchArtist(e.target.value)}
                        variant="filled"
                        InputProps={{
                            disableUnderline: true,
                            endAdornment: searchArtist && (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setSearchArtist("")} edge="end">
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        sx={{ bgcolor: '#e6e6fa', borderRadius: 1, '& .MuiFilledInput-root': { bgcolor: '#e6e6fa', borderRadius: 1 } }}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="year"
                        label="by Year"
                        id="year"
                        autoComplete="off"
                        value={searchYear}
                        onChange={(e) => setSearchYear(e.target.value)}
                        variant="filled"
                        InputProps={{
                            disableUnderline: true,
                            endAdornment: searchYear && (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setSearchYear("")} edge="end">
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        sx={{ bgcolor: '#e6e6fa', borderRadius: 1, '& .MuiFilledInput-root': { bgcolor: '#e6e6fa', borderRadius: 1 } }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <Button
                            type="button"
                            variant="contained"
                            startIcon={<SearchIcon />}
                            sx={{
                                borderRadius: 5,
                                bgcolor: '#6a5acd',
                                color: 'white',
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                px: 4,
                                '&:hover': { bgcolor: '#483d8b' }
                            }}
                            onClick={handleSearch}
                        >
                            Search
                        </Button>
                        <Button
                            type="button"
                            variant="contained"
                            sx={{
                                borderRadius: 5,
                                bgcolor: '#6a5acd',
                                color: 'white',
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                px: 4,
                                '&:hover': { bgcolor: '#483d8b' }
                            }}
                            onClick={handleClear}
                        >
                            Clear
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        {
                            isSongPlaying ? (
                                <YouTubePlayer playlist={(filteredSongs.length > 0) ? filteredSongs : store.songCatalog} currentSongIndex={currentSongIndex} setCurrentSongIndex={setCurrentSongIndex} />
                            ) : (
                                <div></div>
                            )
                        }
                    </Box>
                </Box>
            </Box>
            <Box sx={{ width: '50%', p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
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
                            <MenuItem value="playlists-hi-lo">Playlists (High-Low)</MenuItem>
                            <MenuItem value="playlists-lo-hi">Playlists (Low-High)</MenuItem>
                            <MenuItem value="title-a-z">Title (A-Z)</MenuItem>
                            <MenuItem value="title-z-a">Title (Z-A)</MenuItem>
                            <MenuItem value="artist-a-z">Artist (A-Z)</MenuItem>
                            <MenuItem value="artist-z-a">Artist (Z-A)</MenuItem>
                            <MenuItem value="year-hi-lo">Year (High-Low)</MenuItem>
                            <MenuItem value="year-lo-hi">Year (Low-High)</MenuItem>
                        </Select>
                    </FormControl>
                    {
                        filteredSongs && (
                            <Typography variant="h6" sx={{ m: 1 }}>
                                {filteredSongs.length} Songs
                            </Typography>
                        )
                    }
                </Box>
                <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
                    {
                        filteredSongs && (filteredSongs.map((song) => (
                            <Box
                                key={song._id}
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    border: song.created_by === auth.user.email ? '2px solid #990000' : '1px solid #000',
                                    borderRadius: 2,
                                    bgcolor: '#ffecb3',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative'
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Box onClick={() => handleSongClick(song)} sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                        {song.title} by {song.artist} ({song.year})
                                    </Box>
                                    {
                                        auth.loggedIn && (auth.guestLoggedIn === false) && (
                                            <Box sx={{ cursor: 'pointer' }}
                                                onClick={(event) => handleMenuOpen(event, song)}
                                            >
                                                <MoreVertIcon />
                                            </Box>
                                        )
                                    }
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <Box>Listens: {song.listens.toLocaleString()}</Box>
                                    <Box>Playlists: {song.playlistsCount}</Box>
                                </Box>
                            </Box>
                        )))
                    }
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'start', pb: 3, pt: 2 }}>
                    {
                        auth.loggedIn && (auth.guestLoggedIn === false) && (
                            <Button
                                variant="contained"
                                sx={{
                                    borderRadius: 5,
                                    bgcolor: '#6a5acd',
                                    color: 'white',
                                    textTransform: 'none',
                                    fontSize: '1.1rem',
                                    px: 4,
                                    '&:hover': { bgcolor: '#483d8b' }
                                }}
                                onClick={() => handleCreateNewSong()}
                            >
                                New Song
                            </Button>)
                    }
                </Box>
            </Box>
            {
                <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                >
                    {
                        auth.loggedIn && (auth.guestLoggedIn === false) && (
                            <MenuItem onClick={handleMenuOpenAdd}>Add to Playlist</MenuItem>
                        )
                    }
                    {
                        auth.loggedIn && (auth.user.email === currentSong.created_by) && (
                            <MenuItem onClick={handleMenuCloseEdit}>Edit Song</MenuItem>
                        )
                    }
                    {
                        auth.loggedIn && (auth.user.email === currentSong.created_by) && (
                            <MenuItem onClick={handleMenuCloseRemove}>Remove from Catalog</MenuItem>
                        )
                    }
                </Menu>
            }
            {
                <Menu
                    anchorEl={anchorElAdd}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={isMenuOpenAdd}
                    onClose={handleMenuCloseAdd}
                    PaperProps={{
                        style: {
                            maxHeight: 200,
                            width: '20ch',
                        },
                    }}
                >
                    {
                        menu_list.map((playlist) => (
                            <MenuItem
                                key={playlist._id}
                                onClick={() => handleAddSongToPlaylist(playlist, currentSong)}
                            >
                                {playlist.name}
                            </MenuItem>
                        ))
                    }
                </Menu>
            }
            {
                isRemoveSongModalOpen && (
                    <MUIDeleteSongModal
                        handleConfirmRemoveSong={handleConfirmRemoveSong}
                        handleCancelRemoveSong={handleCancelRemoveSong}
                        open={isRemoveSongModalOpen}
                    />
                )
            }
            {
                isEditSongModalOpen && (
                    <MUIEditSongModal
                        handleConfirmEdit={handleConfirmEditSong}
                        handleCancelEdit={handleCancelEditSong}
                        open={isEditSongModalOpen}
                        song={currentSong}
                        error={EditSongModalError}
                    />
                )
            }
            {
                isCreateSongModalOpen && (
                    <MUICreateSongModal
                        handleConfirmCreate={handleCreateNewSongSubmit}
                        handleCancelCreate={handleCancelCreateSong}
                        open={isCreateSongModalOpen}
                        error={CreateSongModalError}
                    />
                )
            }
            {
                errorToastState.open && (
                    <ErrorToast
                        open={errorToastState.open}
                        message={errorToastState.message}
                        setOpen={setErrorToastState}
                    />
                )
            }
        </Box>
    );
}

export default SongsCatalog;