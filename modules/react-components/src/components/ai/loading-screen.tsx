import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ReactComponent as LoadingPlaceholder } from "../../../../theme/src/themes/wso2is/assets/images/branding/ai-loading-screen-placeholder.svg";
import { Box, Typography } from '@oxygen-ui/react';
import { LinearProgress } from '@oxygen-ui/react';
import { CircularProgress } from '@oxygen-ui/react';

export const LoadingScreen = () => {
    const [currentStatus, setCurrentStatus] = useState('Initializing...');
    const [progress, setProgress] = useState(0);
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

    const fetchProgress = async () => {
        try {
            const response = await axios.get('http://localhost:3000/status');
            return response.data.status;
        } catch (error) {
            console.error(error);
        }
    };

    const updateProgress = (fetchedStatus) => {
        let latestCompletedStep = 'Initializing...';

        for (const key of statusSequence) {
            if (fetchedStatus[key] || (fetchedStatus.branding_generation_status && fetchedStatus.branding_generation_status[key])) {
                latestCompletedStep = statusLabels[key];
            }
        }

        setCurrentStatus(latestCompletedStep);

        let completedSteps = statusSequence.filter(key => fetchedStatus[key] || (fetchedStatus.branding_generation_status && fetchedStatus.branding_generation_status[key])).length;
        setProgress((completedSteps / statusSequence.length) * 100);

        if (fetchedStatus.branding_generation_completed) {
            setPolling(false);
        }
    };

    useEffect(() => {
        if (!polling) return;

        const interval = setInterval(async () => {
            const fetchedStatus = await fetchProgress();
            updateProgress(fetchedStatus);
        }, 1000);

        return () => clearInterval(interval);
    }, [polling]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Box sx={{ marginBottom: '20px' }}>
                <LoadingPlaceholder />
            </Box>
            <Box sx={{ width: '75%' }}>
                <LinearProgress variant="determinate" value={progress} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mt: 2, width: '75%' }}>
                {polling && <CircularProgress size={20} sx={{ mr: 2 }} />}
                <Typography variant="h6">
                    {currentStatus}
                </Typography>
            </Box>
        </Box>
    );
};
