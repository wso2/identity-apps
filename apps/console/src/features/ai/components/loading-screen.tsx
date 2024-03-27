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
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as LoadingPlaceholder }
    from "../../../themes/wso2is/assets/images/ai/ai-loading-screen-placeholder.svg";

const LoadingScreen = ( { traceId }: { traceId: string } ): JSX.Element => {
    const { t } = useTranslation();
    const [ currentStatus, setCurrentStatus ] = useState("Initializing...");
    const [ progress, setProgress ] = useState(0);
    const [ factIndex, setFactIndex ] = useState(0);
    const facts: string[] = [
        t("console:develop.features.ai.screens.loading.facts.0"),
        t("console:develop.features.ai.screens.loading.facts.1"),
        t("console:develop.features.ai.screens.loading.facts.2"),
    ];
    const [ polling, setPolling ] = useState(true);

    const statusSequence: string[] = [
        "optimizing_and_validating_user_query",
        "optimization_and_validation_complete",
        "retrieving_examples",
        "retrieval_of_examples_complete",
        "generating_login_flow_script",
        "generation_of_login_flow_script_complete",
        "generating_login_flow_authenticators",
        "generation_of_login_flow_authenticators_complete",
        "optimizing_and_validating_final_login_flow",
        "login_flow_generation_complete"
    ];

    const statusLabels: Record<string, string> = {
        optimizing_and_validating_user_query: t("console:develop.features.ai.screens.loading.states.1"),
        optimization_and_validation_complete: t("console:develop.features.ai.screens.loading.states.2"),
        retrieving_examples: t("console:develop.features.ai.screens.loading.states.3"),
        retrieval_of_examples_complete: t("console:develop.features.ai.screens.loading.states.4"),
        generating_login_flow_script: t("console:develop.features.ai.screens.loading.states.5"),
        generation_of_login_flow_script_complete: t("console:develop.features.ai.screens.loading.states.6"),
        generating_login_flow_authenticators: t("console:develop.features.ai.screens.loading.states.7"),
        generation_of_login_flow_authenticators_complete: t("console:develop.features.ai.screens.loading.states.8"),
        optimizing_and_validating_final_login_flow: t("console:develop.features.ai.screens.loading.states.9"),
        login_flow_generation_complete: t("console:develop.features.ai.screens.loading.states.10")
    };

    const statusProgress: Record<string, number> = {
        optimizing_and_validating_user_query: 10,
        optimization_and_validation_complete: 20,
        retrieving_examples: 25,
        retrieval_of_examples_complete: 40,
        generating_login_flow_script: 45,
        generation_of_login_flow_script_complete: 70,
        generating_login_flow_authenticators: 75,
        generation_of_login_flow_authenticators_complete: 95,
        optimizing_and_validating_final_login_flow: 97,
        login_flow_generation_complete: 100
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
            const response: AxiosResponse<any> = await axios.get(
                "http://localhost:3000/loginflow/status",
                { headers: { "trace-id": traceId } }
            );
            // const response = await axios.get('http://localhost:3000/status', { headers: { 'trace-id': 'custom' } });
            return response.data.status;
        } catch (error) {
            console.log("error",error);
            console.log("error.reponse",error.response);
            if (
                error.response &&
                error.response.status === 404 &&
                error.response.data.detail === "No login flow generation request with the provided tracking reference."
            ) {

                return {optimizing_and_validating_user_query: true,
                        optimization_and_validation_complete: true,
                        retrieving_examples: true,
                        retrieval_of_examples_complete: true,
                        generating_login_flow_script: true,
                        generation_of_login_flow_script_complete: true,
                        generating_login_flow_authenticators: true,
                        generation_of_login_flow_authenticators_complete: true,
                        optimizing_and_validating_final_login_flow: true,
                        login_flow_generation_complete: true};
            }
        }
    };

    const updateProgress = (fetchedStatus: Record<string, any>) => {
        let latestCompletedStep: string = t("console:develop.features.ai.screens.loading.states.0");
        let currentProgress: number = 0;

        statusSequence.forEach((key: string) => {
            if (
                fetchedStatus[key]
            ) {
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

        setCurrentStatus(latestCompletedStep);

        if (fetchedStatus.login_flow_generation_complete) {
            setProgress(100);
            clearInterval(interval);
            setPolling(false);
            // Issue : polling timing doesn't match with the status update timing.
            // Response is generated and the loading screen is leaved before completing.
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
    
        if (polling) {
            interval = setInterval(async () => {
                const fetchedStatus: Record<string, any> = await fetchProgress();
                updateProgress(fetchedStatus);
            }, 1000);
        } else {
            clearInterval(interval);
        }
    
        return () => clearInterval(interval);
    }, [ polling ]);
    

    useEffect(() => {
        const interval: NodeJS.Timeout = setInterval(() => {
            setFactIndex((factIndex + 1) % facts.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [ factIndex ]);

    return (
        <Box sx={ { alignItems: "center", display: "flex", justifyContent: "center" } }>
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
export default LoadingScreen;
