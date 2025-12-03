import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function SongsCatalog() {
    return (
        <Box sx={{ display: 'flex', width: '100%', height: '80vh' }}>
            <Box sx={{ width: '50%', borderRight: '2px solid #9d9d9dff', p: 2 }}>
                <h1>Songs Catalog</h1>
                <Box component="form" noValidate onSubmit={(e) => { }} sx={{ mt: 2 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="title"
                        label="Filter By Title"
                        name="title"
                        autoComplete="off"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="artist"
                        label="Filter By Artist"
                        id="artist"
                        autoComplete="off"
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="year"
                        label="Filter By Year"
                        id="year"
                        autoComplete="off"
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, borderRadius: 2, bgcolor: '#333', color: 'white', '&:hover': { bgcolor: '#555' } }}
                            disabled={false}
                        >
                            Search
                        </Button>
                        <Box sx={{ flexGrow: 1 }} /> {/* Spacer */}
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, borderRadius: 2, bgcolor: '#333', color: 'white', '&:hover': { bgcolor: '#555' } }}
                            disabled={false}
                        >
                            Clear
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ width: '50%', p: 2 }}>
                <h1>Songs Catalog Right</h1>
            </Box>
        </Box>
    );
}

export default SongsCatalog;