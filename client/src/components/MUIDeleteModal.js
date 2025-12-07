import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

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
    bgcolor: '#2E7D32',
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
    bgcolor: '#ffffff',
    textAlign: 'center'
};

const buttonStyle = {
    bgcolor: '#2E7D32',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '8px',
    padding: '10px 20px',
    textTransform: 'none',
    fontSize: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '&:hover': {
        bgcolor: '#1B5E20',
    },
    width: '140px',
    mx: 2
};

export default function MUIDeleteModal({ open, playlistName, onConfirm, onClose }) {

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Box sx={headerStyle}>
                    Delete Playlist?
                </Box>
                <Box sx={bodyStyle}>
                    <Typography variant="h5" component="div" sx={{ mb: 2, color: '#333' }}>
                        Are you sure you want to delete the <b>{playlistName}</b> playlist?
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, color: '#333', fontWeight: 'bold' }}>
                        This action cannot be undone.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            sx={buttonStyle}
                            onClick={onConfirm}
                        >
                            Confirm
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
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}