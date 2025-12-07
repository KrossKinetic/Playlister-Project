import { useContext, useState } from 'react';
import GlobalStoreContext from '../store';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

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
    bgcolor: '#2E7D32',
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
    flexDirection: 'column',
    flexGrow: 1,
    p: 3,
    gap: 3,
    bgcolor: '#f0f0f0',
    overflow: 'hidden'
};

const mainPanelStyle = {
    width: '100%',
    bgcolor: 'white',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '100%',
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

export default function MUIEditPlaylistModal({ open, handleClose, playlist }) {
    const { store } = useContext(GlobalStoreContext);
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
                            Edit Playlist
                        </Typography>
                    </Box>
                </Box>

                <Box sx={contentStyle}>
                    <Box sx={mainPanelStyle}>
                        <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0', bgcolor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    disabled={!store.canAddNewSong()}
                                    onClick={store.addNewSong}
                                    variant="contained"
                                    sx={{
                                        bgcolor: '#2E7D32',
                                        color: 'white',
                                        textTransform: 'none',
                                        '&:hover': { bgcolor: '#1B5E20' }
                                    }}
                                >
                                    + Add Song
                                </Button>
                                <Button
                                    disabled={!store.canUndo()}
                                    onClick={store.undo}
                                    variant="contained"
                                    sx={{
                                        bgcolor: '#2E7D32',
                                        color: 'white',
                                        textTransform: 'none',
                                        '&:hover': { bgcolor: '#1B5E20' }
                                    }}
                                >
                                    Undo
                                </Button>
                                <Button
                                    disabled={!store.canRedo()}
                                    onClick={store.redo}
                                    variant="contained"
                                    sx={{
                                        bgcolor: '#2E7D32',
                                        color: 'white',
                                        textTransform: 'none',
                                        '&:hover': { bgcolor: '#1B5E20' }
                                    }}
                                >
                                    Redo
                                </Button>
                                <Button
                                    onClick={handleClose}
                                    variant="contained"
                                    sx={{
                                        bgcolor: '#2E7D32',
                                        color: 'white',
                                        textTransform: 'none',
                                        '&:hover': { bgcolor: '#1B5E20' }
                                    }}
                                >
                                    Close
                                </Button>
                            </Box>
                        </Box>
                        <Box sx={{ overflowY: 'auto', flexGrow: 1, py: 1 }}>
                            {playlist.songs && playlist.songs.map((song, index) => (
                                <Box
                                    key={index}
                                    sx={songItemStyle}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'inherit' }}>
                                            {index + 1}. {song.title} by {song.artist} ({song.year})
                                        </Typography>
                                        <Box>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    bgcolor: '#2E7D32',
                                                    color: 'white',
                                                    textTransform: 'none',
                                                    '&:hover': { bgcolor: '#1B5E20' },
                                                    mr: 1
                                                }}
                                            >
                                                Duplicate
                                            </Button>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    bgcolor: '#2E7D32',
                                                    color: 'white',
                                                    textTransform: 'none',
                                                    '&:hover': { bgcolor: '#1B5E20' }
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </Box>

                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}
