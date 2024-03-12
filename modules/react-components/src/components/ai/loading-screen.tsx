import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, LinearProgress, CircularProgress } from '@oxygen-ui/react';
import { ReactComponent as LoadingPlaceholder } from "../../../../theme/src/themes/wso2is/assets/images/branding/ai-loading-screen-placeholder.svg";

const facts = [
    "Asgardeo's advanced theming capabilities let you modify the site title, copyright information, and support email displayed on your login pages, aligning every detail with your brand identity.",
    "You can personalize your login portal even further with Asgardeo by updating links to your privacy policy, terms of service, and cookie policy, making your compliance visible and accessible.",
    "With Asgardeo's branding features, you can update your organization's logo directly in the login and registration pages, ensuring a consistent brand experience for your customers across all application touchpoints.",
];

export const LoadingScreen = () => {
    const [currentStatus, setCurrentStatus] = useState('Initializing...');
    const [progress, setProgress] = useState(0);
    const [factIndex, setFactIndex] = useState(0);
    const [polling, setPolling] = useState(true);

    const statusSequence = [
        'render_webpage',
        'extract_webpage_content',
        'webpage_extraction_completed',
        'generate_branding',
        'color_palette',
        'style_properties',
        'create_branding_theme',
        'branding_generation_completed',
    ];

    useEffect(() => {
        console.log('###### Progress' + progress);
    },[progress]);

    const statusLabels = {
        render_webpage: "Rendering Webpage...",
        extract_webpage_content: "Extracting Content...",
        webpage_extraction_completed: "Content Extracted.",
        generate_branding: "Generating Branding...",
        color_palette: "Creating Color Palette...",
        style_properties: "Defining Style Properties...",
        create_branding_theme: "Creating Branding Theme...",
        branding_generation_completed: "Branding Generation Completed!",
    };

    const statusProgress = {
        render_webpage: 10,
        extract_webpage_content: 25,
        webpage_extraction_completed: 30,
        generate_branding: 50,
        color_palette: 75,
        style_properties: 95,
        create_branding_theme: 97,
        branding_generation_completed: 100,
    };

    const initialProgress = 5;
    const increment = 0.5;

    useEffect(() => {
        const increaseProgress = () => {
            setProgress((prevProgress) => {
                if (prevProgress < initialProgress) {
                    const updatedProgress = prevProgress + increment;
                    setTimeout(increaseProgress, 300);
                    return updatedProgress;
                }
                return prevProgress; // Once initial progress is reached, stop increasing
            });
        };

        setCurrentStatus('Initializing...');
        increaseProgress(); // Start increasing the progress
    }, []);

    const fetchProgress = async () => {
        try {
            const response = await axios.get('http://localhost:3000/status', { headers: { 'trace-id': 'custom' } });
            return response.data.status;
        } catch (error) {
            if (error.response && error.response.status === 404 && error.response.data.detail === "No branding request found with the provided tracking reference.") {
                setProgress(100);
                return { branding_generation_completed: true };
            } else {
                console.error(error);
            }
        }
    };

    const updateProgress = (fetchedStatus) => {
        let latestCompletedStep = 'Initializing...';
        let currentProgress = 0;
    
        statusSequence.forEach((key) => {
            if (fetchedStatus[key] || (fetchedStatus.branding_generation_status && fetchedStatus.branding_generation_status[key])) {
                latestCompletedStep = statusLabels[key];
                currentProgress = statusProgress[key];
            }
        });
        let interval;
        if (currentProgress > progress) {
            const increment = 0.5;
            interval = setInterval(() => {
                setProgress((prevProgress) => {
                    const updatedProgress = Math.min(prevProgress + increment, currentProgress);
                    if (updatedProgress >= currentProgress) {
                        clearInterval(interval);
                    }
                    return updatedProgress;
                });
            }, 100);
        }

        if (fetchedStatus.branding_generation_completed) {
            clearInterval(interval);
        }
        setCurrentStatus(latestCompletedStep);
    
        if (fetchedStatus.branding_generation_completed) {
            setProgress(100);
            setCurrentStatus(statusLabels['branding_generation_completed']);
            setPolling(false);
        }
    };
    
    useEffect(() => {
        if (!polling) return;

        const interval = setInterval(async () => {
            const fetchedStatus = await fetchProgress();
            updateProgress(fetchedStatus);
        }, 3000);

        return () => clearInterval(interval);
    }, [polling]);

    useEffect(() => {
        if (progress === 100) {
            setPolling(false);
        }
    }, [progress]);

    useEffect(() => {
        const interval = setInterval(() => {
            setFactIndex((factIndex + 1) % facts.length);
        }, 8000); 

        return () => clearInterval(interval);
    }, [factIndex]);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '75%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: '20px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', maxWidth: '75%' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.6)' }}>
                            Did you know?
                        </Typography>
                        <Typography variant="body1" align="justify" sx={{ mt: 2, color: '#757575', height: '150px', overflow: 'auto' }}>
                            {facts[factIndex]}
                        </Typography>
                    </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                        <LoadingPlaceholder />
                    </Box>
                </Box>
                <Box sx={{ width: '100%' }}>
                    <LinearProgress variant="determinate" value={progress} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mt: 2, width: '100%' }}>
                    {polling && <CircularProgress size={20} sx={{ mr: 2 }} />}
                    <Typography variant="h6">
                        {currentStatus}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};
