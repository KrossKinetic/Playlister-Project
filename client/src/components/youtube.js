import React from 'react';
import YouTube from 'react-youtube';
import { Box } from '@mui/material';

function YouTubePlayer({ playlist, currentSongIndex, setCurrentSongIndex, setPlayerRef }) {
    console.log(playlist);
    const song = playlist[currentSongIndex];
    const videoId = song ? song.youTubeId : "";

    const playerOptions = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 1,
        },
    };

    function onPlayerReady(event) {
        event.target.playVideo();
        if (setPlayerRef) {
            setPlayerRef(event.target);
        }
    }

    function handleInternalSongEnd() {
        if (playlist && playlist.length > 0) {
            let nextIndex = currentSongIndex + 1;

            if (nextIndex >= playlist.length) {
                nextIndex = 0;
            }

            setCurrentSongIndex(nextIndex);
        }
    }

    return (
        <Box sx={{
            width: '100%',
            aspectRatio: '640 / 330'
        }}>
            <YouTube
                videoId={videoId}
                opts={playerOptions}
                onReady={onPlayerReady}
                onEnd={handleInternalSongEnd}
                style={{ height: '100%', width: '100%' }}
            />
        </Box>
    );
}

export default YouTubePlayer;