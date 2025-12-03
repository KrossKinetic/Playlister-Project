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

    const [image, setImage] = useState({
        src: auth.user ? auth.user.avatarPng : null,
        isValid: true,
        isDefault: true
    });
    const [formData, setFormData] = useState({
        username: "",
        email: auth.user ? auth.user.email : "",
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
        auth.updateUser(
            formData.username,
            image,
            formData.password,
            formData.passwordVerify
        );
    };

    const isPasswordMatch = formData.password === formData.passwordVerify;
    const isPasswordValid = (formData.password.length >= 8 || formData.password === "");

    const isPassword = (isPasswordMatch && isPasswordValid);

    const isImageValid = (image.isValid === true || (image.src !== auth.user.avatarPng && image.src !== null));

    const isUsernameValid = (formData.username.trim() !== "" || formData.username === "");

    const isFormValid = isImageValid && isPassword && isUsernameValid;

    const hasImageChanged = (image.src !== auth.user.avatarPng);
    const hasPasswordChanged = (formData.password !== "");
    const hasUsernameChanged = (formData.username !== "");

    console.log("hasImageChanged: ", hasImageChanged);
    console.log("hasPasswordChanged: ", hasPasswordChanged);
    console.log("hasUsernameChanged: ", hasUsernameChanged);

    const hasChanges = hasImageChanged || hasPasswordChanged || hasUsernameChanged;

    console.log("hasChanges: ", hasChanges);
    console.log("isFormValid: ", isFormValid);

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
                                    src={image.src}
                                    sx={{ m: 1, bgcolor: 'secondary.main', width: 60, height: 60 }}
                                >
                                    {!image.src && <LockOutlinedIcon />}
                                </Avatar>
                                <Button
                                    size="small"
                                    onClick={() => fileInputRef.current.click()}
                                    sx={{ fontSize: '0.7rem', minWidth: 'auto', bgcolor: '#333', color: 'white', '&:hover': { bgcolor: '#555' } }}
                                >
                                    Select
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
                                value={formData.username}
                                onChange={handleInputChange}
                                autoFocus
                                error={!isUsernameValid}
                                helperText={!isUsernameValid ? "Username must not be all white spaces" : ""}
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
                        sx={{ mt: 3, mb: 2, bgcolor: '#333', color: 'white', '&:hover': { bgcolor: '#555' } }}
                        disabled={!hasChanges || !isFormValid}
                    >
                        Update Account
                    </Button>
                    {
                        !hasChanges && (
                            <Typography variant="body2" color="error">
                                No changes made. Empty fields are not updated.
                            </Typography>
                        )
                    }
                    {
                        !isFormValid && (
                            <Typography variant="body2" color="error">
                                Form is invalid. Please check your input.
                            </Typography>
                        )
                    }
                </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
            {modalJSX}
        </Container >
    );
}
