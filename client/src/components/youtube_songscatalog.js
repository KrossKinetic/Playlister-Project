import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { Box } from '@mui/material';

function YouTubePlayer({ videoId }) {
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
            setIsVideoValid(false); // Reset while validating

            try {
                // Fetch oEmbed data
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
                // On network error, default to valid so we at least try
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
                    key={videoId}
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