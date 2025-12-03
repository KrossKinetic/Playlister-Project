import { Box, Button, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import imageNote from './image_note.png';
import AuthContext from '../auth'
import { useContext } from 'react';

export default function SplashScreen() {
    const history = useHistory();
    const { auth } = useContext(AuthContext);

    const handleContinueAsGuest = () => {
        auth.loginGuest();
    }

    const handleLogin = () => {
        history.push('/login/');
    }

    const handleRegister = () => {
        history.push('/register/');
    }

    return (
        <Box id="splash-screen" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h2" component="div" sx={{ mb: 4, fontWeight: 'bold', fontFamily: 'inherit' }}>
                The Playlister
            </Typography>
            <Box
                component="img"
                src={imageNote}
                alt="Playlister Logo"
                sx={{
                    width: '200px',
                    height: 'auto',
                    mb: 5
                }}
            />
            <Box sx={{ display: 'flex', gap: 3 }}>
                <Button variant="contained" sx={{ bgcolor: '#333', color: 'white', '&:hover': { bgcolor: '#555' } }} onClick={handleContinueAsGuest}>Continue as Guest</Button>
                <Button variant="contained" sx={{ bgcolor: '#333', color: 'white', '&:hover': { bgcolor: '#555' } }} onClick={handleLogin}>Login</Button>
                <Button variant="contained" sx={{ bgcolor: '#333', color: 'white', '&:hover': { bgcolor: '#555' } }} onClick={handleRegister}>Create Account</Button>
            </Box>
        </Box>
    )
}