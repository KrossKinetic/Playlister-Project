
import { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import RepeatIcon from '@mui/icons-material/Repeat';
import YouTubePlayer from './youtube';
import { GlobalStoreContext } from '../store';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    height: 700,
    bgcolor: '#f0f0f0',
    border: 'none',
    borderRadius: '16px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
    p: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
};

const headerStyle = {
    bgcolor: '#6a5acd',
    color: 'white',
    p: 2,
    pl: 3,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: 2
};

const contentStyle = {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    p: 3,
    gap: 3,
    bgcolor: '#f0f0f0',
    overflow: 'hidden'
};

const leftPanelStyle = {
    width: '45%',
    bgcolor: 'white',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '100%',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
};

const rightPanelStyle = {
    width: '55%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    bgcolor: 'white',
    borderRadius: '12px',
    p: 2,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
};

const songItemStyle = {
    p: 1.5,
    mx: 2,
    my: 1,
    borderRadius: '8px',
    border: '1px solid #eee',
    fontSize: '0.95rem',
    fontWeight: '500',
    bgcolor: '#fafafa',
    transition: 'all 0.2s',
    '&:hover': {
        bgcolor: '#f5f5f5',
    }
};

const activeSongStyle = {
    ...songItemStyle,
    bgcolor: '#e8f5e9',
    color: '#1b5e20',
    border: '1px solid #c8e6c9',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
};

const controlsStyle = {
    bgcolor: '#f5f5f5',
    borderRadius: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    mt: 3,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: 'fit-content',
    p: 1,
    gap: 2
};

export default function MUIPlayPlaylistModal({ open, handleClose, playlist }) {
    const { store } = useContext(GlobalStoreContext);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [videoId, setVideoId] = useState(null);
    const [player, setPlayer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);

    useEffect(() => {
        if (open && playlist && playlist.songs && playlist.songs.length > 0) {
            setCurrentSongIndex(0); // Reset to first song when modal opens
            setVideoId(playlist.songs[0].youTubeId); // Set videoId for the first song
            setIsPlaying(true);
            store.updatePlaylistLastAccessed(playlist._id);
        }
    }, [open, playlist]);

    useEffect(() => {
        if (playlist && playlist.songs && playlist.songs.length > 0) {
            setVideoId(playlist.songs[currentSongIndex].youTubeId);
        }
    }, [currentSongIndex, playlist]);

    const handleSkipPrevious = () => {
        let newIndex = currentSongIndex - 1;
        if (newIndex < 0) newIndex = (playlist?.songs?.length || 1) - 1;
        setCurrentSongIndex(newIndex);
    };

    const handleSkipNext = () => {
        let newIndex = currentSongIndex + 1;
        if (newIndex >= (playlist?.songs?.length || 0)) newIndex = 0;
        setCurrentSongIndex(newIndex);
    };

    const handlePlayPause = () => {
        if (player) {
            const playerState = player.getPlayerState();
            if (playerState === 1) {
                player.pauseVideo();
                setIsPlaying(false);
            } else {
                player.playVideo();
                setIsPlaying(true);
            }
        }
    };

    if (!playlist) return null;

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Box sx={headerStyle}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                            Play Playlist
                        </Typography>
                    </Box>
                </Box>

                <Box sx={contentStyle}>
                    <Box sx={leftPanelStyle}>
                        <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0', bgcolor: '#fafafa', display: 'flex', alignItems: 'center' }}>
                            <Avatar
                                src={playlist.avatarPng}
                                sx={{ width: 48, height: 48, mr: 2, border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                            />
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#333' }}>
                                    {playlist.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {playlist.songs.length} Songs
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ overflowY: 'auto', flexGrow: 1, py: 1 }}>
                            {playlist.songs && playlist.songs.map((song, index) => (
                                <Box
                                    key={index}
                                    sx={index === currentSongIndex ? activeSongStyle : songItemStyle}
                                    onClick={() => setCurrentSongIndex(index)}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'inherit' }}>
                                            {index + 1}. {song.title}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: index === currentSongIndex ? '#2e7d32' : '#888' }}>
                                            {song.artist}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                    <Box sx={rightPanelStyle}>
                        <Box sx={{
                            width: '100%',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            bgcolor: 'black',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}>
                            <YouTubePlayer
                                playlist={playlist.songs}
                                currentSongIndex={currentSongIndex}
                                setCurrentSongIndex={setCurrentSongIndex}
                                setPlayerRef={setPlayer}
                                playerRef={player}
                                repeat={isRepeat}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt: 'auto', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', textAlign: 'center', mb: 0.5 }}>
                                {playlist.songs[currentSongIndex]?.title || "Unknown Song"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {playlist.songs[currentSongIndex]?.artist || "Unknown Artist"} ({playlist.songs[currentSongIndex]?.year})
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                <IconButton onClick={() => setIsRepeat(!isRepeat)} sx={{ color: isRepeat ? '#6a5acd' : '#555' }}>
                                    <RepeatIcon />
                                </IconButton>
                                <Button
                                    variant="contained"
                                    onClick={handleSkipPrevious}
                                    sx={{
                                        minWidth: 'auto',
                                        bgcolor: '#6a5acd',
                                        color: 'white',
                                        borderRadius: '8px',
                                        p: 1,
                                        '&:hover': { bgcolor: '#483d8b' }
                                    }}
                                >
                                    <SkipPreviousIcon />
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handlePlayPause}
                                    sx={{
                                        minWidth: 'auto',
                                        bgcolor: '#6a5acd',
                                        color: 'white',
                                        borderRadius: '8px',
                                        p: 1,
                                        mx: 1,
                                        '&:hover': { bgcolor: '#483d8b' }
                                    }}
                                >
                                    {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSkipNext}
                                    sx={{
                                        minWidth: 'auto',
                                        bgcolor: '#6a5acd',
                                        color: 'white',
                                        borderRadius: '8px',
                                        p: 1,
                                        '&:hover': { bgcolor: '#483d8b' }
                                    }}
                                >
                                    <SkipNextIcon />
                                </Button>
                            </Box>
                        </Box>
                        <Button
                            onClick={handleClose}
                            sx={{
                                color: '#888',
                                textTransform: 'none',
                                mt: 1,
                                '&:hover': { bgcolor: '#f5f5f5', color: '#555' }
                            }}
                        >
                            Close Player
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}
