import { useContext, useState, useRef } from 'react'; // Import useState and useRef
import AuthContext from '../auth'
import Copyright from './Copyright'

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function RegisterScreen() {
    const { auth } = useContext(AuthContext);

    const [image, setImage] = useState({
        src: null,
        isValid: true,
        isDefault: true
    });

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        passwordVerify: ""
    });
    const fileInputRef = useRef(null);

    const getImageDimensions = (file) => {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(file);
            const img = new Image();

            img.onload = () => {
                const width = img.width;
                const height = img.height;
                URL.revokeObjectURL(url);
                resolve({ width, height });
            };

            img.onerror = () => reject(new Error("Failed to load image"));

            img.src = url;
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("Image size: ", file.size);
            getImageDimensions(file).then(({ width, height }) => {
                console.log("Image dimensions: ", width, height);

                if (width !== 250 || height !== 250) {
                    setImage({ src: null, isValid: false, isDefault: false });
                    console.log("Image dimensions too large");
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    setImage({ src: e.target.result, isValid: true, isDefault: false });
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        auth.registerUser(
            formData.username,
            image.src,
            formData.email,
            formData.password,
            formData.passwordVerify
        );
    };
    const isPasswordMatch = formData.password === formData.passwordVerify;

    const isImageValid = (image.isValid === true);

    const isPasswordValid = (formData.password.length >= 8 || formData.password === "");

    const isUsernameValid = (formData.username.trim() !== "" || formData.username === "");

    const isEmailValid = ((formData.email.includes("@") && formData.email.includes(".")) || formData.email === "");

    const isFormValid = formData.username && formData.email && formData.password && formData.passwordVerify && isImageValid && !image.isDefault && isPasswordMatch && isPasswordValid;

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
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{ position: 'relative' }}>
                            <Box sx={{ position: 'absolute', left: '-85px', top: '0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar
                                    src={image.src}
                                    sx={{ m: 1, bgcolor: 'secondary.main', width: 60, height: 60 }}
                                >
                                    {!image.src && <LockOutlinedIcon />}
                                </Avatar>
                                <Button
                                    size="small"
                                    onClick={() => fileInputRef.current.click()}
                                    sx={{ fontSize: '0.7rem', minWidth: 'auto', borderRadius: 2, bgcolor: '#333', color: 'white', '&:hover': { bgcolor: '#555' } }}
                                >
                                    Select*
                                </Button>
                                {
                                    !isImageValid && (
                                        <Typography variant="body3" color="error">
                                            Image <br /> dimensions <br /> must be <br /> 250 x 250
                                        </Typography>
                                    )
                                }
                            </Box>
                            <TextField
                                autoComplete="username"
                                name="username"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                autoFocus
                                value={formData.username}
                                onChange={handleInputChange}
                                error={!isUsernameValid}
                                helperText={!isUsernameValid ? "Username must not be all white spaces" : ""}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                error={!isEmailValid}
                                helperText={!isEmailValid ? "Please enter a valid email address" : ""}
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
                                value={formData.password}
                                onChange={handleInputChange}
                                error={!isPasswordValid}
                                helperText={!isPasswordValid ? "Password must be at least 8 characters long" : ""}
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
                                value={formData.passwordVerify}
                                onChange={handleInputChange}
                                error={!isPasswordMatch}
                                helperText={!isPasswordMatch ? "Passwords do not match" : ""}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, borderRadius: 2, bgcolor: '#333', color: 'white', '&:hover': { bgcolor: '#555' } }}
                        disabled={!isFormValid}
                    >
                        Sign Up
                    </Button>
                    {
                        auth.errorMessage !== null && (<Typography variant="body2" color="error">{auth.errorMessage}</Typography>)
                    }
                    {
                        !isFormValid && (
                            <Grid item xs={12}>
                                <Typography variant="body2" color="error">
                                    Please fill out all fields and choose a 250 x 250 avatar.
                                </Typography>
                            </Grid>
                        )
                    }
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/login/" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
        </Container >
    );
}