import React, { useContext, useState } from 'react';
import YouTube from 'react-youtube';
import { Box } from '@mui/material';
import { GlobalStoreContext } from '../store';

function YouTubePlayer({ playlist, currentSongIndex, setCurrentSongIndex, setPlayerRef, repeat }) {
    const { store } = useContext(GlobalStoreContext);
    const [song, setSong] = useState(playlist[currentSongIndex]);
    const [videoId, setVideoId] = useState(song ? song.youTubeId : "");


    React.useEffect(() => {
        const newSong = playlist[currentSongIndex];
        setSong(newSong);
        setVideoId(newSong ? newSong.youTubeId : "");
        store.updateSongListens(newSong._id);
    }, [playlist, currentSongIndex]);

    const playerOptions = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 1,
        },
    };

    React.useEffect(() => {
        let isMounted = true;

        const checkVideoValidity = async () => {
            if (!videoId) return;

            try {
                const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
                const data = await response.json();

                if (data.error) {
                    console.log(`[YouTubePlayer] Video ${videoId} invalid: ${data.error}`);
                    if (isMounted) handleInternalSongEnd();
                } else {
                    console.log(`[YouTubePlayer] Video ${videoId} valid: ${data.title}`);
                }
            } catch (error) {
                console.error("Validation error", error);
            }
        };

        checkVideoValidity();

        return () => { isMounted = false; };
    }, [videoId]);

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
                if (repeat) {
                    nextIndex = 0;
                    setCurrentSongIndex(nextIndex);
                }
            } else {
                setCurrentSongIndex(nextIndex);
            }
        }
    }

    return (
        <Box sx={{
            width: '100%',
            aspectRatio: '640 / 330'
        }}>
            {videoId ? (
                <YouTube
                    key={song ? `${song.title}-${song.artist}-${song.year}-${videoId}-${currentSongIndex}` : currentSongIndex}
                    videoId={videoId}
                    opts={playerOptions}
                    onReady={onPlayerReady}
                    onEnd={handleInternalSongEnd}
                    onError={handleInternalSongEnd}
                    style={{ height: '100%', width: '100%' }}
                />
            ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: 'black', color: 'gray' }}>
                    No Song
                </Box>
            )}
        </Box>
    );
}

export default YouTubePlayer;