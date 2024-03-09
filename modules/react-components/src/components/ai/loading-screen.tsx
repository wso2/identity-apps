import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ReactComponent as LoadingPlaceholder } from "../../../../theme/src/themes/wso2is/assets/images/branding/ai-loading-screen-placeholder.svg";
import { Box, Typography } from '@oxygen-ui/react';
import { LinearProgress } from '@oxygen-ui/react';
import { CircularProgress } from '@oxygen-ui/react';

const facts = [
    "Asgardeo's advanced theming capabilities let you modify the site title, copyright information, and support email displayed on your login pages, aligning every detail with your brand identity.",
    "You can personalize your login portal even further with Asgardeo by updating links to your privacy policy, terms of service, and cookie policy, making your compliance visible and accessible.",
    "With Asgardeo's branding features, you can update your organization's logo directly in the login and registration pages, ensuring a consistent brand experience for your customers across all application touchpoints.",
    // Add more facts as needed
];

export const LoadingScreen = () => {
    const [currentStatus, setCurrentStatus] = useState('Initializing...');
    const [progress, setProgress] = useState(0);
    const [polling, setPolling] = useState(true);
    const [factIndex, setFactIndex] = useState(0);

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

    useEffect(() => {
        const interval = setInterval(() => {
            setFactIndex((factIndex + 1) % facts.length);
        }, 6000); 

        return () => clearInterval(interval);
    }, [factIndex]);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '75%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: '20px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                        <Typography variant="h6">
                            Did you know?
                        </Typography>
                        <Typography variant="body1">
                            {facts[factIndex]}
                        </Typography>
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
