import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ReactComponent as LoadingPlaceholder } from "../../../../theme/src/themes/wso2is/assets/images/branding/ai-loading-screen-placeholder.svg";
import { Box, Typography } from '@oxygen-ui/react';
import { LinearProgress } from '@oxygen-ui/react';

export const LoadingScreen = () => {
    const [status, setStatus] = useState({
        render_webpage: false,
        extract_webpage_content: false,
        webpage_extraction_completed: false,
        generate_branding: false,
        branding_generation_status: {
            color_palette: false,
            style_properties: false
        },
        create_branding_theme: false,
        branding_generation_completed: false
    });

    const [polling, setPolling] = useState(true);

    const fetchProgress = async () => {
        try {
            const response = await axios.get('http://localhost:3000/status');
            return response.data.status;
        } catch (error) {
            console.error(error);
        }
    };

    const updateProgress = (fetchedStatus) => {
        setStatus(prevStatus => ({
            ...prevStatus,
            ...fetchedStatus,
            branding_generation_status: {
                ...prevStatus.branding_generation_status,
                ...fetchedStatus.branding_generation_status
            }
        }));
        if (fetchedStatus.branding_generation_completed) {
            setPolling(false);
        }
    };

    useEffect(() => {
        const interval = polling ? setInterval(async () => {
            const fetchedStatus = await fetchProgress();
            updateProgress(fetchedStatus);
        }, 1000) : null;

        return () => clearInterval(interval);
    }, [polling]);

    const calculateProgress = () => {
        let completedSteps = 0;
        const totalSteps = Object.keys(status).length + Object.keys(status.branding_generation_status).length - 1; // Adjusting total steps
        Object.keys(status).forEach(key => {
            if (key !== 'branding_generation_status' && status[key]) completedSteps++;
        });
        Object.keys(status.branding_generation_status).forEach(subKey => {
            if (status.branding_generation_status[subKey]) completedSteps++;
        });
        return (completedSteps / totalSteps) * 100;
    };

    const progress = calculateProgress();

    const statusLabels = {
        render_webpage: "Rendering Webpage",
        extract_webpage_content: "Extracting Content",
        webpage_extraction_completed: "Content Extracted",
        generate_branding: "Generating Branding",
        color_palette: "Creating Color Palette",
        style_properties: "Defining Style Properties",
        create_branding_theme: "Creating Branding Theme",
        branding_generation_completed: "Branding Generation Completed"
    };

    const inactiveColor = '#ccc'; // Example color for inactive statuses

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Box sx={{ marginBottom: '20px' }}>
                <LoadingPlaceholder />
            </Box>
            <Box sx={{ width: '75%' }}>
                <LinearProgress variant="determinate" value={progress} />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                    {Object.keys(status).map((key, index) => (
                        key !== 'branding_generation_status' && key !== 'branding_generation_completed' && (
                            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <Typography variant="body2" sx={{ fontWeight: status[key] ? 'bold' : 'normal', color: status[key] ? 'inherit' : inactiveColor }}>
                                    {statusLabels[key]}
                                </Typography>
                                {key === 'generate_branding' && Object.keys(status.branding_generation_status).map((subKey, subIndex) => (
                                    <Typography key={`sub-${subIndex}`} variant="body2" sx={{ fontWeight: status.branding_generation_status[subKey] ? 'bold' : 'normal', ml: 2, color: status.branding_generation_status[subKey] ? 'inherit' : inactiveColor }}>
                                        {statusLabels[subKey]}
                                    </Typography>
                                ))}
                            </Box>
                        )
                    ))}
                    {status.branding_generation_completed && (
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {statusLabels.branding_generation_completed}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
};
