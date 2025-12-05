import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function ErrorToast({ message, open, setOpen }) {

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen({
            open: false,
            message: ""
        });
    };

    return (
        <div>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Position
            >
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}