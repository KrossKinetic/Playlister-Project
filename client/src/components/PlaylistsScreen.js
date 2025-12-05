import { useContext, useEffect } from 'react';
import { GlobalStoreContext } from '../store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function PlaylistsScreen() {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadPlaylists();
    }, []);

    return (
        <Box sx={{ display: 'flex', width: '100%', height: '80vh', bgcolor: '#fffff0' }}>
            <Box sx={{ width: '50%', borderRight: '2px solid #9d9d9dff', p: 2 }}>
                {/* Left Side - For now empty/placeholder as requested */}
            </Box>
            <Box sx={{ width: '50%', p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
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
                            <Box
                                key={playlist._id}
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    border: '1px solid #000',
                                    borderRadius: 2,
                                    bgcolor: '#ffecb3',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative'
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Box sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                        {playlist.name}
                                    </Box>
                                </Box>
                                <Box sx={{ fontSize: '1.0rem', mb: 1 }}>
                                    By: {playlist.ownerEmail}
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <Box>Listens: {playlist.listens}</Box>
                                    <Box>{playlist.songs ? playlist.songs.length : 0} Songs</Box>
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
