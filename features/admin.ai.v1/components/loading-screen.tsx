/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import Box from "@oxygen-ui/react/Box";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import LinearProgress from "@oxygen-ui/react/LinearProgress";
import Typography from "@oxygen-ui/react/Typography";
import axios, { AxiosResponse } from "axios";
import useAIBrandingPreference from "features/admin.ai.v1/hooks/use-ai-branding-preference";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as LoadingPlaceholder }
    from "../../../modules/theme/src/themes/wso2is/assets/images/illustrations/ai-loading-screen-placeholder.svg";

export const LoadingScreen = (): JSX.Element => {
    const { t } = useTranslation();
    // const [ currentStatus, setCurrentStatus ] = useState("Initializing...");
    const [ progress, setProgress ] = useState(0);
    const [ factIndex, setFactIndex ] = useState(0);
    const facts: string[] = [
        t("branding:ai.screens.loading.facts.0"),
        t("branding:ai.screens.loading.facts.1"),
        t("branding:ai.screens.loading.facts.2")
    ];
    const [ currentStatus, setCurrentStatus ] = useState("branding:ai.screens.loading.states.0");

    const { handleGenerate,
        isGeneratingBranding,
        mergedBrandingPreference,
        setGeneratingBranding,
        operationId
         } = useAIBrandingPreference();

    const [ polling, setPolling ] = useState(isGeneratingBranding);

    const statusSequence: string[] = [
        "render_webpage",
        "extract_webpage_content",
        "webpage_extraction_completed",
        "generate_branding",
        "color_palette",
        "style_properties",
        "create_branding_theme",
        "branding_generation_completed"
    ];

    const statusLabels: Record<string, string> = {
        branding_generation_completed: t("branding:ai.screens.loading.states.8"),
        color_palette: t("branding:ai.screens.loading.states.5"),
        create_branding_theme: t("branding:ai.screens.loading.states.7"),
        extract_webpage_content: t("branding:ai.screens.loading.states.2"),
        generate_branding: t("branding:ai.screens.loading.states.4"),
        render_webpage: t("branding:ai.screens.loading.states.1"),
        style_properties: t("branding:ai.screens.loading.states.6"),
        webpage_extraction_completed: t("branding:ai.screens.loading.states.3")
    };

    const statusProgress: Record<string, number> = {
        branding_generation_completed: 100,
        color_palette: 75,
        create_branding_theme: 97,
        extract_webpage_content: 25,
        generate_branding: 50,
        render_webpage: 10,
        style_properties: 95,
        webpage_extraction_completed: 30
    };

    const initialProgress: number = 5;
    const increment: number = 0.5;

    useEffect(() => {
        const increaseProgress = () => {
            setProgress((prevProgress: number) => {
                if (prevProgress < initialProgress) {
                    const updatedProgress: number = prevProgress + increment;

                    setTimeout(increaseProgress, 300);

                    return updatedProgress;
                }

                return prevProgress;
            });
        };

        setCurrentStatus("Initializing...");
        increaseProgress();
    }, []);

    const fetchProgress = async () => {
        try {
            console.log("operationId loading screen: ", operationId);
            const response: AxiosResponse<any> = await axios.get(
                `http://0.0.0.0:8080/t/cryd1/api/server/v1/branding-preference/status/${operationId}`,
                // "http://localhost:3000/status",
            );

            // const response = await axios.get('http://localhost:3000/status', { headers: { 'trace-id': 'custom' } });
            return response.data.status;
        } catch (error) {
            if (
                error.response &&
                error.response.status === 404 &&
                error.response.data.detail === "No branding request found with the provided tracking reference."
            ) {
                setProgress(100);

                return { branding_generation_completed: true };
            }
        }
    };

    const fetchBrandingPreference = async () => {
        try {
            const response: AxiosResponse<any> = await axios.get(
                `http://0.0.0.0:8080/t/cryd1/api/server/v1/branding-preference/result/${operationId}`,
                // { headers: { "correlation-id": traceId } }
            );
            // console.log("Branding preference: ", response.data.data);
            return response.data.data;
        } catch (error) {
            console.error("Error while fetching branding preference: ", error);
        }
    };

    const updateProgress = (fetchedStatus: Record<string, any>) => {
        let latestCompletedStep: string = t("branding:ai.screens.loading.states.0");
        let currentProgress: number = 0;

        statusSequence.forEach((key: string) => {
            if (
                fetchedStatus[key] ||
                (fetchedStatus.branding_generation_status && fetchedStatus.branding_generation_status[key])
            ) {
                setCurrentStatus(statusLabels[key]);
                latestCompletedStep = statusLabels[key];
                currentProgress = statusProgress[key];
            }
        });
        let interval: NodeJS.Timeout;

        if (currentProgress > progress) {
            const increment: number = 0.5;

            interval = setInterval(() => {
                setProgress((prevProgress: number) => {
                    const updatedProgress: number = Math.min(prevProgress + increment, currentProgress);

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
            setCurrentStatus(statusLabels["branding_generation_completed"]);
            console.log("######Branding generation completed######");
            setPolling(false);
            fetchBrandingPreference().then(brandingPreference => {
                console.log("Branding preference: ", brandingPreference);
                handleGenerate(brandingPreference);
            });
        }
    };

    useEffect(() => {
        if (!polling) return;

        const interval: NodeJS.Timeout = setInterval(async () => {
            const fetchedStatus: Record<string, any> = await fetchProgress();
            updateProgress(fetchedStatus);
        }, 1000);

        return () => clearInterval(interval);
    }, [ polling ]);

    useEffect(() => {
        if (progress === 100) {
            setPolling(false);
        }
    }, [ progress ]);

    useEffect(() => {
        const interval: NodeJS.Timeout = setInterval(() => {
            setFactIndex((factIndex + 1) % facts.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [ factIndex ]);

    // return (
    //     <Box className="loading-screen-container">
    //         <Box className="loading-screen-content">
    //             <Box className="loading-screen-row">
    //                 <Box className="loading-screen-facts">
    //                     <Box className="loading-screen-facts-content">
    //                         <Typography variant="h5" className="loading-screen-facts-text">
    //                             Did you know?
    //                         </Typography>
    //                         <Typography
    //                             variant="body1"
    //                             align="justify"
    //                             className="loading-screen-facts-detail">
    //                             { facts[factIndex] }
    //                         </Typography>
    //                     </Box>
    //                 </Box>
    //                 <Box className="loading-screen-placeholder">
    //                     <LoadingPlaceholder />
    //                 </Box>
    //             </Box>
    //             <Box className="loading-screen-progress">
    //                 <LinearProgress variant="determinate" value={ progress } />
    //             </Box>
    //             <Box className="loading-screen-status">
    //                 { polling && <CircularProgress size={ 20 } className="loading-screen-status-progress" /> }
    //                 <Typography variant="h6">
    //                     { currentStatus }
    //                 </Typography>
    //             </Box>
    //         </Box>
    //     </Box>
    // );


    return (
        // <Box className="loading-screen-container">
        <Box
            sx={ {
                alignItems: "center",
                display: "flex",
                justifyContent: "center"
            } }>
            <Box sx={ { alignItems: "center", display: "flex", flexDirection: "column", width: "75%" } }>
                <Box
                    sx={ {
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        marginBottom: "20px"
                    } }>
                    <Box sx={ { alignItems: "center", display: "flex", flexDirection: "column", mt: 2 } }>
                        <Box sx={ { alignItems: "left", display: "flex", flexDirection: "column", maxWidth: "75%" } }>
                            <Typography variant="h5" sx={ { color: "rgba(0, 0, 0, 0.6)", fontWeight: "bold" } }>
                                Did you know?
                            </Typography>
                            <Typography
                                variant="body1"
                                align="justify"
                                sx={ {
                                    color: "#757575",
                                    height: "150px",
                                    mt: 2,
                                    overflow: "auto"
                                } }>
                                { facts[factIndex] }
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={ { display: "flex", justifyContent: "left" } }>
                        <LoadingPlaceholder />
                    </Box>
                </Box>
                <Box sx={ { width: "100%" } }>
                    <LinearProgress variant="determinate" value={ progress } />
                </Box>
                <Box
                    sx={ {
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "flex-start",
                        mt: 2,
                        width: "100%"
                    } }>
                    { polling && <CircularProgress size={ 20 } sx={ { mr: 2 } } /> }
                    <Typography variant="h6">
                        { currentStatus }
                    </Typography>
                </Box>
            </Box>
        </Box>
    );

};
