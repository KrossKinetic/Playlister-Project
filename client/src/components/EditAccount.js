import { useContext, useState, useRef } from 'react';
import AuthContext from '../auth'
import MUIErrorModal from './MUIErrorModal'
import Copyright from './Copyright'

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function EditAccount() {
    const { auth } = useContext(AuthContext);

    const [image, setImage] = useState(auth.user ? auth.user.avatarPng : null);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 250 * 250) {
                alert("File size must be less than 250 x 250 pixels");
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        auth.updateUser(
            formData.get('username'),
            image,
            formData.get('password'),
            formData.get('passwordVerify')
        );
    };

    let modalJSX = "";
    if (auth.errorMessage !== null) {
        modalJSX = <MUIErrorModal />;
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept="image/*"
                    name="avatarPng"
                />

                <Typography component="h1" variant="h5">
                    Edit Account
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{ position: 'relative' }}>
                            <Box sx={{ position: 'absolute', left: '-85px', top: '0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar
                                    src={image}
                                    sx={{ m: 1, bgcolor: 'secondary.main', width: 60, height: 60 }}
                                >
                                    {!image && <LockOutlinedIcon />}
                                </Avatar>
                                <Button
                                    size="small"
                                    onClick={() => fileInputRef.current.click()}
                                    sx={{ fontSize: '0.7rem', minWidth: 'auto', bgcolor: '#333', color: 'white', '&:hover': { bgcolor: '#555' } }}
                                >
                                    Select
                                </Button>
                            </Box>
                            <TextField
                                autoComplete="username"
                                name="username"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                defaultValue={auth.user ? auth.user.username : ""}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="passwordVerify"
                                label="Password Verify"
                                type="password"
                                id="passwordVerify"
                                autoComplete="new-password"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, bgcolor: '#333', color: 'white', '&:hover': { bgcolor: '#555' } }}
                    >
                        Update Account
                    </Button>
                </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
            {modalJSX}
        </Container >
    );
}
