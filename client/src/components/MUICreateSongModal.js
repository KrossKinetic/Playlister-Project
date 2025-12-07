import { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#f0f0f0',
    border: 'none',
    borderRadius: '16px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
    p: 0,
    overflow: 'hidden'
};

const headerStyle = {
    bgcolor: '#6a5acd', // Darker green for header
    color: 'white',
    p: 3,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '1.8rem',
    borderBottom: '1px solid #ddd'
};

const bodyStyle = {
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    bgcolor: '#ffffff'
};

const inputStyle = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        bgcolor: '#f9f9f9',
        '& fieldset': {
            borderColor: '#ccc',
        },
        '&:hover fieldset': {
            borderColor: '#6a5acd',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#6a5acd',
        },
    },
    '& .MuiInputLabel-root': {
        color: '#555',
        '&.Mui-focused': {
            color: '#6a5acd',
        },
    }
};

const buttonStyle = {
    bgcolor: '#6a5acd',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '8px',
    padding: '10px 20px',
    textTransform: 'none',
    fontSize: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '&:hover': {
        bgcolor: '#483d8b',
    },
    width: '140px'
};

export default function MUICreateSongModal({ handleConfirmCreate, handleCancelCreate, open, error = "" }) {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [year, setYear] = useState('');
    const [youTubeId, setYouTubeId] = useState('');

    useEffect(() => {
        if (open) {
            setTitle('');
            setArtist('');
            setYear('');
            setYouTubeId('');
        }
    }, [open]);


    const hasEmptyFields = () => {
        return title === "" || artist === "" || year === "" || youTubeId === "";
    };

    const isCompleteDisabled = hasEmptyFields();

    return (
        <Modal
            open={open}
            onClose={() => handleCancelCreate()}
        >
            <Box sx={style}>
                <Box sx={headerStyle}>
                    Create Song
                </Box>
                <Box sx={bodyStyle}>
                    <TextField
                        fullWidth
                        label="Title"
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={inputStyle}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setTitle('')} edge="end">
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Artist"
                        variant="outlined"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                        sx={inputStyle}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setArtist('')} edge="end">
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Year"
                        variant="outlined"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        sx={inputStyle}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setYear('')} edge="end">
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        fullWidth
                        label="YouTube ID"
                        variant="outlined"
                        value={youTubeId}
                        onChange={(e) => setYouTubeId(e.target.value)}
                        sx={inputStyle}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setYouTubeId('')} edge="end">
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                        <Button
                            variant="contained"
                            sx={{
                                ...buttonStyle,
                                opacity: isCompleteDisabled ? 0.5 : 1,
                                cursor: isCompleteDisabled ? 'not-allowed' : 'pointer',
                                '&:hover': {
                                    bgcolor: isCompleteDisabled ? '#6a5acd' : '#483d8b',
                                }
                            }}
                            onClick={() => handleConfirmCreate(title, artist, year, youTubeId)}
                            disabled={isCompleteDisabled}
                        >
                            Complete
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                ...buttonStyle,
                                bgcolor: '#757575',
                                '&:hover': {
                                    bgcolor: '#616161',
                                }
                            }}
                            onClick={() => handleCancelCreate()}
                        >
                            Cancel
                        </Button>
                    </Box>
                    {error && (
                        <Typography sx={{ color: 'red', textAlign: 'center', mt: 2, fontWeight: 'bold' }}>
                            {error}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Modal >
    );
}