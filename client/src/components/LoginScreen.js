import { useContext, useState } from 'react';
import AuthContext from '../auth'
import Copyright from './Copyright'
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function LoginScreen() {
    const { auth } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        auth.loginUser(
            formData.email,
            formData.password
        );
    };

    const isFormValid = formData.email.length > 0 && formData.password.length > 0;

    let modalJSX = "";
    console.log("auth.errorMessage: ", auth.errorMessage);
    console.log(modalJSX);

    return (
        <Grid container component="main" sx={{ height: '90%', overflow: 'hidden', m: 0 }}>
            <Grid
                item
                xs={12} sm={12} md={12}
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    bgcolor: 'transparent'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        height: '100%',
                        gap: 5,
                        pt: 10
                    }}
                >
                    <Avatar
                        sx={{
                            width: { xs: 50, md: 100 },
                            height: { xs: 50, md: 100 },
                            bgcolor: 'secondary.main',
                            m: 0
                        }}
                    >
                        <LockOutlinedIcon sx={{ fontSize: { xs: 30, md: 60 } }} />
                    </Avatar>

                    <Typography component="h1" variant="h3">
                        Sign in
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        {
                            auth.errorMessage !== null && (<Typography variant="body2" color="error">{auth.errorMessage}</Typography>)
                        }
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, borderRadius: 2, bgcolor: '#333', color: 'white', '&:hover': { bgcolor: '#555' } }}
                            disabled={!isFormValid}
                        >
                            Sign In
                        </Button>
                        {
                            !isFormValid && (
                                <Typography variant="body2" color="error">
                                    Text Fields must not be empty
                                </Typography>
                            )
                        }
                        <Grid container>
                            <Grid item>
                                <Link href="/register/" variant="body2">
                                    Don't have an account? Sign Up
                                </Link>
                            </Grid>
                        </Grid>
                        <Copyright sx={{ mt: 5 }} />
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}