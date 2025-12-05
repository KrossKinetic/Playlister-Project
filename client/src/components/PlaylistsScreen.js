import { useContext, useEffect, useState } from 'react';
import { GlobalStoreContext } from '../store';
import AuthContext from '../auth';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';

function PlaylistsScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [expandedPlaylists, setExpandedPlaylists] = useState({});

    useEffect(() => {
        store.loadPlaylists();
        console.log(store.playlists);
    }, []);

    const handleTogglePlaylist = (id) => {
        setExpandedPlaylists(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <Box sx={{ display: 'flex', width: '100%', height: '80vh', bgcolor: '#fffff0' }}>
            <Box sx={{ width: '50%', borderRight: '2px solid #9d9d9dff', p: 2 }}>
                {/* Left Side - For now empty/placeholder as requested */}
            </Box>
            <Box sx={{ width: '50%', p: 2, display: 'flex', flexDirection: 'column', height: '95%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    {
                        store.playlists && (
                            <Typography variant="h6" sx={{ m: 1 }}>
                                {store.playlists.length} Playlists
                            </Typography>
                        )
                    }
                </Box>
                <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
                    {
                        store.playlists && store.playlists.map((playlist) => (
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
                                            sx={{ width: 56, height: 56, mr: 2, border: '1px solid #ccc' }}
                                        />
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{playlist.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">{playlist?.username ?? "Username"}</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', }} color="text.secondary">
                                                {playlist.listens} Listeners
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Collapse in={expandedPlaylists[playlist._id]} timeout="auto" unmountOnExit>
                                        <Box sx={{ mt: 2, borderTop: '1px solid #eee', pt: 1, maxHeight: '200px', overflowY: 'auto' }}>
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
