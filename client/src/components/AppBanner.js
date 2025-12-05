import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'
import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import HomeIcon from '@mui/icons-material/Home';
import { Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';

export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const history = useHistory();

    const [curPage, setCurPage] = useState(window.location.pathname.substring(1));

    useEffect(() => {
        history.listen((location) => {
            if (history.location.pathname === '/playlists') {
                setCurPage('playlists');
            } else if (history.location.pathname === '/songs') {
                setCurPage('songs');
            }
        });
    }, [history]);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        history.push("/");
        auth.logoutUser();
    }

    const handleLogoutGuest = () => {
        handleMenuClose();
        auth.logoutUser();
    }

    const handleEditAccount = () => {
        handleMenuClose();
    }

    const handleHouseClick = () => {
        store.closeCurrentList();
    }

    const handleHouseClickGuest = () => {
        auth.logoutUser();
    }

    const handlePlaylistsClick = () => {
        history.push('/playlists');
    }

    const handleSongsClick = () => {
        history.push('/songs');
    }

    const menuId = 'primary-search-account-menu';
    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}><Link to='/login/'>Login</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to='/register/'>Create New Account</Link></MenuItem>
        </Menu>
    );
    const loggedInMenu =
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleEditAccount}><Link to='/updateAccount/'>Edit Account</Link></MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
    const guestMenu =
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogoutGuest}><Link to='/login/'>Login</Link></MenuItem>
            <MenuItem onClick={handleLogoutGuest}><Link to='/register/'>Create Account</Link></MenuItem>
        </Menu>
    let menu = loggedOutMenu;
    if (auth.loggedIn) {
        menu = loggedInMenu;
    }
    if (auth.guestLoggedIn) {
        menu = guestMenu;
    }

    function getAccountMenu(loggedIn) {
        let userAvatar = auth.getUserAvatar();
        if (loggedIn)
            return <Avatar src={userAvatar} sx={{ m: 1, bgcolor: 'secondary.main', width: 50, height: 50 }}></Avatar>
        else
            return <AccountCircle />;
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ bgcolor: 'purple' }}>
                <Toolbar>
                    <Typography
                        variant="h4"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        {
                            auth.guestLoggedIn ? (
                                <Link onClick={handleHouseClickGuest} style={{ textDecoration: 'none', color: 'white' }} to='/'><HomeIcon /></Link>
                            ) : auth.loggedIn ? (
                                <Link onClick={handleHouseClick} style={{ textDecoration: 'none', color: 'white' }} to='/playlists'><HomeIcon /></Link>
                            ) : (
                                <Link onClick={handleHouseClick} style={{ textDecoration: 'none', color: 'white' }} to='/'><HomeIcon /></Link>
                            )
                        }
                        {
                            auth.loggedIn ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={handlePlaylistsClick}
                                    sx={{ ml: 2, borderRadius: 2, bgcolor: curPage === 'playlists' ? 'black' : 'primary.main', '&:hover': { bgcolor: curPage === 'playlists' ? '#333' : 'primary.dark' } }}
                                >
                                    Playlists
                                </Button>
                            ) : null
                        } {
                            auth.loggedIn ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={handleSongsClick}
                                    sx={{ ml: 2, borderRadius: 2, bgcolor: curPage === 'songs' ? 'black' : 'primary.main', '&:hover': { bgcolor: curPage === 'songs' ? '#333' : 'primary.dark' } }}
                                >
                                    Songs
                                </Button>
                            ) : null
                        }
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}></Box>
                    <Box sx={{ height: "90px", display: { xs: 'none', md: 'flex' } }}>
                        {
                            auth.loggedIn ? (
                                <Typography variant="h6" color="inherit" component="div" sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                    Welcome {auth.user.username}!
                                </Typography>
                            ) : null
                        }
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            {getAccountMenu(auth.loggedIn)}
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {
                menu
            }
        </Box>
    );
}