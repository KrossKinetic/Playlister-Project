import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { Box } from '@mui/material';

function YouTubePlayer({ videoId, title, artist, year, id }) {
    const [isVideoValid, setIsVideoValid] = useState(false);
    const [isValidating, setIsValidating] = useState(false);

    const playerOptions = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 1,
        },
    };

    useEffect(() => {
        let isMounted = true;

        const checkVideoValidity = async () => {
            if (!videoId) {
                if (isMounted) setIsVideoValid(false);
                return;
            };

            setIsValidating(true);
            setIsVideoValid(false);

            try {
                const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
                const data = await response.json();

                if (isMounted) {
                    if (data.error) {
                        console.log(`[YouTubePlayer] Video ${videoId} invalid: ${data.error}`);
                        setIsVideoValid(false);
                    } else {
                        console.log(`[YouTubePlayer] Video ${videoId} valid: ${data.title}`);
                        setIsVideoValid(true);
                    }
                }
            } catch (error) {
                console.error("Validation error", error);
                if (isMounted) setIsVideoValid(true);
            } finally {
                if (isMounted) setIsValidating(false);
            }
        };

        checkVideoValidity();

        return () => { isMounted = false; };
    }, [videoId]);

    return (
        <Box sx={{
            width: '100%',
            aspectRatio: '640 / 330'
        }}>
            {isVideoValid ?
                <YouTube
                    key={`${title}-${artist}-${year}-${videoId}-${id}`}
                    videoId={videoId}
                    opts={playerOptions}
                    onReady={(event) => event.target.playVideo()}
                    style={{ height: '100%', width: '100%' }}
                />
                :
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: 'black', color: 'white' }}>
                    {isValidating ? "Loading..." : (videoId ? "Invalid Video ID" : "No Song Selected")}
                </Box>
            }
        </Box>
    );
}

export default YouTubePlayer;