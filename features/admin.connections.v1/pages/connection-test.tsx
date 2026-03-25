/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

/**
 * Connection Test page for Identity Provider.
 */

import Alert from "@oxygen-ui/react/Alert";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Card from "@oxygen-ui/react/Card";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Skeleton from "@oxygen-ui/react/Skeleton";
import Stack from "@oxygen-ui/react/Stack";
import Tab from "@oxygen-ui/react/Tab";
import TabPanel from "@oxygen-ui/react/TabPanel";
import Tabs from "@oxygen-ui/react/Tabs";
import Typography from "@oxygen-ui/react/Typography";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import useResourceEndpoints from "@wso2is/admin.core.v1/hooks/use-resource-endpoints";
import { TabPageLayout } from "@wso2is/react-components";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router-dom";


/**
 * Interface for the route parameters.
 */
interface RouteParams {
    tenantDomain?: string;
    id?: string;
}

const RotateIcon = (): ReactElement => {
    /* eslint-disable-next-line max-len */
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width={ 16 } height={ 16 } fill="currentColor"><path d="M129.9 292.5C143.2 199.5 223.3 128 320 128C373 128 421 149.5 455.8 184.2C456 184.4 456.2 184.6 456.4 184.8L464 192L416.1 192C398.4 192 384.1 206.3 384.1 224C384.1 241.7 398.4 256 416.1 256L544.1 256C561.8 256 576.1 241.7 576.1 224L576.1 96C576.1 78.3 561.8 64 544.1 64C526.4 64 512.1 78.3 512.1 96L512.1 149.4L500.8 138.7C454.5 92.6 390.5 64 320 64C191 64 84.3 159.4 66.6 283.5C64.1 301 76.2 317.2 93.7 319.7C111.2 322.2 127.4 310 129.9 292.6zM573.4 356.5C575.9 339 563.7 322.8 546.3 320.3C528.9 317.8 512.6 330 510.1 347.4C496.8 440.4 416.7 511.9 320 511.9C267 511.9 219 490.4 184.2 455.7C184 455.5 183.8 455.3 183.6 455.1L176 447.9L223.9 447.9C241.6 447.9 255.9 433.6 255.9 415.9C255.9 398.2 241.6 383.9 223.9 383.9L96 384C87.5 384 79.3 387.4 73.3 393.5C67.3 399.6 63.9 407.7 64 416.3L65 543.3C65.1 561 79.6 575.2 97.3 575C115 574.8 129.2 560.4 129 542.7L128.6 491.2L139.3 501.3C185.6 547.4 249.5 576 320 576C449 576 555.7 480.6 573.4 356.5z" /></svg>;
};

/**
 * Connection Test page component.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
const ConnectionTestPage: React.FC<RouteComponentProps<RouteParams>> = (props) => {
    const { id: connectorId = "" } = props.match.params || {};
    const { location } = props;

    const { t } = useTranslation();
    const { resourceEndpoints } = useResourceEndpoints();

    const [ debugId, setDebugId ] = useState<string | null>(null);
    const [ result, setResult ] = useState<any>(null);
    const [ error, setError ] = useState<string | null>(null);
    const [ loading, setLoading ] = useState(false);
    const [ hasError, setHasError ] = useState(false);
    const [ activeTab, setActiveTab ] = useState(0);
    const [ autoRunTriggered, setAutoRunTriggered ] = useState(false);

    const popupInterval = useRef<any>(null);
    const fetchTimer = useRef<any>(null);

    /**
     * Clears all running timers for popup monitoring and result fetching.
     */
    const clearTimers = (): void => {
        if (popupInterval.current) {
            clearInterval(popupInterval.current);
            popupInterval.current = null;
        }
        if (fetchTimer.current) {
            clearTimeout(fetchTimer.current);
            fetchTimer.current = null;
        }
    };

    /**
     * Effect to clear timers on component unmount.
     */
    useEffect(() => {
        return () => clearTimers();
    }, []);

    /**
     * Auto-run test if debugId and authUrl are provided via location state.
     */
    useEffect(() => {
        const state = location?.state as any;

        if (state?.debugId && state?.authorizationUrl && !autoRunTriggered) {
            setAutoRunTriggered(true);
            setDebugId(state.debugId);

            // Open the authorization URL
            const authPopup = window.open(state.authorizationUrl, "_blank");

            // Monitor the popup
            popupInterval.current = setInterval(() => {
                try {
                    if (authPopup && authPopup.closed) {
                        clearTimers();
                        // Fetch results after popup closes
                        fetchTimer.current = setTimeout(() => {
                            fetchResult(state.debugId);
                        }, 1000);
                    }
                } catch (e) {
                    // ignore
                }
            }, 500);

            // Set a timeout to fetch results after 30 seconds
            fetchTimer.current = setTimeout(() => {
                clearTimers();
                fetchResult(state.debugId);
            }, 30000);
        }
    }, [ location, autoRunTriggered ]);


    /**
     * Fetches the test results from the backend.
     */
    const fetchResult = async (sid: string): Promise<void> => {
        if (!sid) {
            setError("No debug session id found...");

            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const axios = (await import("axios")).default;
            const response = await axios.get(
                `${resourceEndpoints.debug}/${sid}/result`,
                { withCredentials: true }
            );

            setResult(response.data);

            // eslint-disable-next-line no-console
            console.log("[ConnectionTest] Successfully fetched results:", response.data);
        } catch (err: any) {
            // eslint-disable-next-line no-console
            console.error("[ConnectionTest] Fetch error:", err?.response?.status, err?.message);

            if (err?.response?.status === 404) {
                setError("Something went wrong.");
            } else {
                setError(err?.response?.data?.message || err?.message || "Failed to fetch debug results.");
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handles the "Run Tests" button click event.
     * Executes POST request to test connection.
     */
    const handleRunTests = async (): Promise<void> => {
        setError(null);
        setResult(null);
        setHasError(false);

        // eslint-disable-next-line no-console
        console.log("[ConnectionTest] Starting rerun test for connectorId:", connectorId);

        if (!connectorId) {
            setError("Connection ID is missing. Cannot run test.");

            return;
        }

        try {
            const axios = (await import("axios")).default;
            const payload = {
                connectionId: connectorId
            };

            // eslint-disable-next-line no-console
            console.log("[ConnectionTest] Posting debug request with payload:", payload);

            const response = await axios.post(
                `${resourceEndpoints.debug}/idp`,
                payload,
                { withCredentials: true }
            );

            const newDebugId = response.data.debugId;
            const authorizationUrl = response.data.metadata.authorizationUrl;

            // eslint-disable-next-line no-console
            console.log("[ConnectionTest] Debug session created:", { newDebugId, authorizationUrl });

            setDebugId(newDebugId);

            // Clear any existing timers from previous runs
            clearTimers();

            // Open authorizationUrl in a new tab if present
            if (authorizationUrl) {
                const authPopup = window.open(authorizationUrl, "_blank");

                // Monitor the popup and fetch results when it closes
                popupInterval.current = setInterval(() => {
                    try {
                        if (authPopup && authPopup.closed) {
                            clearTimers();
                            // Fetch results after popup closes
                            fetchTimer.current = setTimeout(() => {
                                fetchResult(newDebugId);
                            }, 1000);
                        }
                    } catch (e) {
                        // ignore
                    }
                }, 500);

                // Set a timeout to fetch results after 30 seconds in case popup detection doesn't work
                fetchTimer.current = setTimeout(() => {
                    clearTimers();
                    fetchResult(newDebugId);
                }, 30000);
            } else {
                // If no authorizationUrl, fetch results immediately
                fetchTimer.current = setTimeout(() => {
                    fetchResult(newDebugId);
                }, 2000);
            }
        } catch (error: any) {
            // eslint-disable-next-line no-console
            console.error("[ConnectionTest] Error running test:", error);
            clearTimers();
            setError(error?.response?.data?.message || error?.message || "Failed to run test.");
        }
    };

    // Update error status based on result metadata
    useEffect(() => {
        if (result) {
            // Handle nested metadata structure
            const metadataObj = result?.metadata?.metadata || result?.metadata || {};
            const steps = metadataObj?.steps || {
                connectionStatus: metadataObj?.connectionStatus,
                authenticationStatus: metadataObj?.authenticationStatus,
                claimMappingStatus: metadataObj?.claimMappingStatus,
                claimExtractionStatus: metadataObj?.claimExtractionStatus
            };

            // Check for top-level FAILURE status first
            const topLevelFailure = result?.status === "FAILURE";

            // Check if any step explicitly failed (not pending or success)
            const hasStepError = (
                (steps.connectionStatus && steps.connectionStatus !== "success" && steps.connectionStatus !== "pending") ||
                (steps.authenticationStatus && steps.authenticationStatus !== "success" && steps.authenticationStatus !== "pending") ||
                (steps.claimMappingStatus && steps.claimMappingStatus !== "success" && steps.claimMappingStatus !== "pending") ||
                result?.error
            );

            // Check for error fields in metadata
            const hasErrorFields = metadataObj?.error_details || metadataObj?.error_description || metadataObj?.error_code;

            if (topLevelFailure || hasStepError || hasErrorFields) {
                setHasError(true);
                setActiveTab(2); // Switch to Logs tab (index 2)
            } else {
                setHasError(false);
            }
        }
    }, [ result ]);

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {
        // Extract tenant domain from current path
        const pathParts = location.pathname.split("/");
        const tenantIndex = pathParts.indexOf("t");
        const tenantDomain = tenantIndex !== -1 ? pathParts[tenantIndex + 1] : "carbon.super";

        // Navigate to the specific connection page
        history.push(`/t/${tenantDomain}/console/connections/${connectorId}`);
    };

    // State for connector details - removed as we no longer display connector info on this page
    const testId = "idp-test-connection";

    /**
     * Renders the results tabs when test results are available.
     */
    const renderResultsTabs = () => {
        const renderCodeBlock = (
            value: unknown,
            options: {
                color?: string;
                marginBottom?: number;
                wordBreak?: "break-all" | "break-word";
            } = {}
        ) => (
            <Box
                sx={ {
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #E5E7EB",
                    borderRadius: 1.5,
                    mb: options.marginBottom ?? 0,
                    overflowX: "auto"
                } }
            >
                <Box
                    component="pre"
                    sx={ {
                        color: options.color ?? "text.primary",
                        fontFamily: "monospace",
                        fontSize: 13,
                        m: 0,
                        p: 1.5,
                        whiteSpace: "pre-wrap",
                        wordBreak: options.wordBreak ?? "break-word"
                    } }
                >
                    { typeof value === "string" ? value : JSON.stringify(value, null, 2) }
                </Box>
            </Box>
        );

        const tabPanes = [
            {
                menuItem: "ID Token",
                render: () => {
                    const decodeJWT = (token?: string) => {
                        if (!token || typeof token !== "string" || token.split(".").length < 3) {
                            return null;
                        }

                        const [ header, payload, signature ] = token.split(".");
                        const decode = (value: string) => {
                            try {
                                let base64: string = value.replace(/-/g, "+").replace(/_/g, "/");

                                while (base64.length % 4) {
                                    base64 += "=";
                                }

                                return JSON.parse(atob(base64));
                            } catch {
                                return null;
                            }
                        };

                        return {
                            header: decode(header),
                            payload: decode(payload),
                            signature
                        };
                    };

                    const idToken: string | undefined = result?.metadata?.idToken;
                    const decoded = decodeJWT(idToken);

                    return (
                        <Box sx={ { pt: 3 } }>
                            <Stack spacing={ 3 }>
                                { decoded ? (
                                    <Card variant="outlined" sx={ { backgroundColor: "#FCFDFD", borderRadius: 2, p: 3 } }>
                                        <Typography variant="h6" sx={ { color: "#0F6CBD", mb: 1 } }>
                                            Header
                                        </Typography>
                                        { renderCodeBlock(decoded.header, { marginBottom: 2 }) }

                                        <Typography variant="h6" sx={ { color: "#15803D", mb: 1 } }>
                                            Payload
                                        </Typography>
                                        { renderCodeBlock(decoded.payload, { marginBottom: 2 }) }

                                        <Typography variant="h6" sx={ { color: "#B42318", mb: 1 } }>
                                            Signature
                                        </Typography>
                                        { renderCodeBlock(decoded.signature, { wordBreak: "break-all" }) }
                                    </Card>
                                ) : (
                                    <Alert severity="info" icon={ false }>
                                        Unable to decode token or not a valid JWT.
                                    </Alert>
                                ) }

                                <Box>
                                    <Typography variant="h6" sx={ { mb: 1 } }>
                                        External Redirect URL
                                    </Typography>
                                    { renderCodeBlock(result?.metadata?.externalRedirectUrl) }
                                </Box>
                            </Stack>
                        </Box>
                    );
                }
            },
            {
                menuItem: "Claim Mappings",
                render: () => {
                    const claimsArray = Array.isArray(result?.metadata?.mappedClaims) ? result?.metadata?.mappedClaims : [];
                    const sortedClaims = claimsArray.sort((a, b) => {
                        if (a.status === "Successful" && b.status !== "Successful") {
                            return -1;
                        }
                        if (a.status !== "Successful" && b.status === "Successful") {
                            return 1;
                        }

                        return 0;
                    });

                    const formatValue = (value: unknown) => {
                        if (value === null || value === undefined) {
                            return "-";
                        }
                        if (typeof value === "object") {
                            return JSON.stringify(value);
                        }

                        return String(value);
                    };

                    return (
                        <Box sx={ { pt: 3 } }>
                            <Box sx={ { overflowX: "auto" } }>
                                <Box
                                    component="table"
                                    sx={ {
                                        backgroundColor: "#FCFDFD",
                                        borderCollapse: "collapse",
                                        borderRadius: 2,
                                        minWidth: 760,
                                        overflow: "hidden",
                                        width: "100%"
                                    } }
                                >
                                    <thead>
                                        <Box
                                            component="tr"
                                            sx={ { backgroundColor: "#F8FAFC", borderBottom: "1px solid #E5E7EB" } }
                                        >
                                            <Box component="th" sx={ { borderRight: "1px solid #E5E7EB", fontSize: 15, fontWeight: 600, p: "10px 8px", textAlign: "left" } }>
                                                IDP Claim
                                            </Box>
                                            <Box component="th" sx={ { borderRight: "1px solid #E5E7EB", fontSize: 15, fontWeight: 600, p: "10px 8px", textAlign: "left" } }>
                                                IS Claim (URI)
                                            </Box>
                                            <Box component="th" sx={ { borderRight: "1px solid #E5E7EB", fontSize: 15, fontWeight: 600, p: "10px 8px", textAlign: "left" } }>
                                                Value
                                            </Box>
                                            <Box component="th" sx={ { fontSize: 15, fontWeight: 600, p: "10px 8px", textAlign: "left" } }>
                                                Mapping Status
                                            </Box>
                                        </Box>
                                    </thead>
                                    <tbody>
                                        { sortedClaims.length === 0 && (
                                            <Box component="tr">
                                                <Box component="td" colSpan={ 4 } sx={ { color: "text.secondary", p: 2, textAlign: "center" } }>
                                                    No claims found.
                                                </Box>
                                            </Box>
                                        ) }
                                        { sortedClaims.map((claim, idx) => (
                                            <Box
                                                component="tr"
                                                key={ idx }
                                                sx={ {
                                                    backgroundColor: claim.status === "Successful" ? "#F0FDF4" : "#FFFFFF",
                                                    borderBottom: "1px solid #E5E7EB"
                                                } }
                                            >
                                                <Box
                                                    component="td"
                                                    sx={ {
                                                        borderRight: "1px solid #E5E7EB",
                                                        fontFamily: "monospace",
                                                        fontSize: 13,
                                                        maxWidth: 200,
                                                        overflow: "hidden",
                                                        p: 1,
                                                        textOverflow: "ellipsis"
                                                    } }
                                                    title={ claim.idpClaim }
                                                >
                                                    { claim.idpClaim }
                                                </Box>
                                                <Box
                                                    component="td"
                                                    sx={ {
                                                        borderRight: "1px solid #E5E7EB",
                                                        fontFamily: "monospace",
                                                        fontSize: 13,
                                                        maxWidth: 200,
                                                        overflow: "hidden",
                                                        p: 1,
                                                        textOverflow: "ellipsis"
                                                    } }
                                                    title={ claim.isClaim || "-" }
                                                >
                                                    { claim.isClaim || "-" }
                                                </Box>
                                                <Box
                                                    component="td"
                                                    sx={ {
                                                        borderRight: "1px solid #E5E7EB",
                                                        color: "text.secondary",
                                                        fontFamily: "monospace",
                                                        fontSize: 13,
                                                        maxWidth: 250,
                                                        overflow: "hidden",
                                                        p: 1,
                                                        textOverflow: "ellipsis"
                                                    } }
                                                    title={ formatValue(claim.value) }
                                                >
                                                    { formatValue(claim.value) }
                                                </Box>
                                                <Box
                                                    component="td"
                                                    sx={ {
                                                        color: claim.status === "Successful" ? "#15803D" : "#B42318",
                                                        fontWeight: 500,
                                                        p: 1
                                                    } }
                                                >
                                                    { claim.status }
                                                </Box>
                                            </Box>
                                        )) }
                                    </tbody>
                                </Box>
                            </Box>
                        </Box>
                    );
                }
            },
            {
                menuItem: "Diagnostics",
                render: () => {
                    const formatLogs = () => {
                        const metadataObj = result?.metadata || {};
                        const stepStatus = metadataObj?.stepStatus || {};
                        const steps: Record<string, string | undefined> = {
                            authenticationStatus: stepStatus?.authenticationStatus || metadataObj?.authenticationStatus,
                            claimExtractionStatus: stepStatus?.claimExtractionStatus || metadataObj?.claimExtractionStatus,
                            claimMappingStatus: stepStatus?.claimMappingStatus || metadataObj?.claimMappingStatus,
                            connectionStatus: stepStatus?.connectionStatus || metadataObj?.connectionStatus
                        };
                        const errorDescription = metadataObj?.error_description || null;
                        const errorCode = metadataObj?.error_code || null;
                        const topLevelStatus = result?.status;

                        return (
                            <Stack spacing={ 2 }>
                                { (errorDescription || errorCode) && (
                                    <Card
                                        variant="outlined"
                                        sx={ {
                                            backgroundColor: "#FEF3F2",
                                            borderColor: "#FECACA",
                                            borderLeft: "4px solid #B42318",
                                            borderRadius: 2,
                                            p: 2
                                        } }
                                    >
                                        <Typography variant="h6" sx={ { color: "#B42318", mb: 1.5 } }>
                                            Error Information
                                        </Typography>
                                        { errorCode && (
                                            <Box sx={ { mb: errorDescription ? 1.5 : 0 } }>
                                                <Typography sx={ { color: "#B42318", fontWeight: 600 } }>
                                                    Error Code
                                                </Typography>
                                                <Typography
                                                    sx={ {
                                                        color: "#B42318",
                                                        fontFamily: "monospace",
                                                        fontSize: 13,
                                                        mt: 0.5,
                                                        whiteSpace: "pre-wrap",
                                                        wordBreak: "break-word"
                                                    } }
                                                >
                                                    { errorCode }
                                                </Typography>
                                            </Box>
                                        ) }
                                        { errorDescription && (
                                            <Box>
                                                <Typography sx={ { color: "#B42318", fontWeight: 600 } }>
                                                    Description
                                                </Typography>
                                                <Typography
                                                    sx={ {
                                                        color: "#B42318",
                                                        fontFamily: "monospace",
                                                        fontSize: 13,
                                                        mt: 0.5,
                                                        whiteSpace: "pre-wrap",
                                                        wordBreak: "break-word"
                                                    } }
                                                >
                                                    { errorDescription }
                                                </Typography>
                                            </Box>
                                        ) }
                                    </Card>
                                ) }

                                { Object.keys(steps).length > 0 && (
                                    <Card variant="outlined" sx={ { backgroundColor: "#FCFDFD", borderRadius: 2, p: 2 } }>
                                        <Typography variant="h6" sx={ { mb: 1.5 } }>
                                            Step Status
                                        </Typography>
                                        <Stack spacing={ 1 }>
                                            { [
                                                { key: "connectionStatus", label: "Connection Creation" },
                                                { key: "authenticationStatus", label: "Authentication" },
                                                { key: "claimMappingStatus", label: "Claims Mapping" }
                                            ].map(({ key, label }) => (
                                                steps[key] ? (
                                                    <Box
                                                        key={ key }
                                                        sx={ {
                                                            alignItems: "center",
                                                            display: "flex",
                                                            justifyContent: "space-between"
                                                        } }
                                                    >
                                                        <Typography
                                                            sx={ {
                                                                color: "text.secondary",
                                                                fontFamily: "monospace",
                                                                fontSize: 13
                                                            } }
                                                        >
                                                            { label }
                                                        </Typography>
                                                        <Box
                                                            component="span"
                                                            sx={ {
                                                                backgroundColor: steps[key] === "success"
                                                                    ? "#E8F5E9"
                                                                    : steps[key] === "failed" || steps[key] === "error"
                                                                        ? "#FEE4E2"
                                                                        : "#F3F4F6",
                                                                borderRadius: 1,
                                                                color: steps[key] === "success"
                                                                    ? "#15803D"
                                                                    : steps[key] === "failed" || steps[key] === "error"
                                                                        ? "#B42318"
                                                                        : "text.secondary",
                                                                fontFamily: "monospace",
                                                                fontSize: 13,
                                                                fontWeight: 500,
                                                                px: 1,
                                                                py: 0.5,
                                                                textTransform: "capitalize"
                                                            } }
                                                        >
                                                            { String(steps[key]) }
                                                        </Box>
                                                    </Box>
                                                ) : null
                                            )) }
                                        </Stack>
                                    </Card>
                                ) }

                                { !errorDescription && !errorCode && Object.keys(steps).length === 0 && topLevelStatus !== "FAILURE" && (
                                    <Alert severity="info" icon={ false }>
                                        No log information available.
                                    </Alert>
                                ) }
                            </Stack>
                        );
                    };

                    return (
                        <Box sx={ { pt: 3 } }>
                            { formatLogs() }
                        </Box>
                    );
                }
            }
        ];

        return (
            <Box>
                <Tabs value={ activeTab } onChange={ (_, value: number) => setActiveTab(value) }>
                    { tabPanes.map((tabPane) => (
                        <Tab key={ tabPane.menuItem } label={ tabPane.menuItem } />
                    )) }
                </Tabs>
                { tabPanes.map((tabPane, index) => (
                    <TabPanel key={ tabPane.menuItem } value={ activeTab } index={ index }>
                        { tabPane.render() }
                    </TabPanel>
                )) }
            </Box>
        );
    };

    return (
        <TabPageLayout
            isLoading={ loading }
            pageTitle="Test Results"
            title="Test Results"
            description="Results for the connection test session."
            backButton={ {
                "data-testid": `${testId}-back-button`,
                onClick: handleBackButtonClick,
                text: t("console:develop.pages.idpTest.backButton", "Go back to Connection")
            } }
            action={
                (<Button
                    onClick={ handleRunTests }
                    disabled={ loading }
                    color="primary"
                    variant="contained"
                    startIcon={ <RotateIcon /> }
                    data-testid="idp-test-result-rerun-button"
                >
                    Rerun Test
                </Button>)
            }
            titleTextAlign="left"
            contentTopMargin={ true }
            bottomMargin={ false }
            data-testid={ `${testId}-page-layout` }
        >
            { /* Test Status Banner */ }
            { result && !error && (
                <Box
                    sx={ {
                        backgroundColor: hasError ? "#FEF3F2" : "#F0FDF4",
                        border: "1px solid",
                        borderColor: hasError ? "#FECACA" : "#BBF7D0",
                        borderLeft: `4px solid ${hasError ? "#B42318" : "#15803D"}`,
                        borderRadius: 2,
                        mt: 4,
                        p: "16px 20px"
                    } }
                    data-testid="test-status-banner"
                >
                    <Stack direction="row" spacing={ 1.5 } alignItems="flex-start">
                        <Box
                            sx={ {
                                alignItems: "center",
                                backgroundColor: hasError ? "#FEE4E2" : "#DCFCE7",
                                borderRadius: "50%",
                                color: hasError ? "#B42318" : "#15803D",
                                display: "flex",
                                flexShrink: 0,
                                fontSize: 18,
                                fontWeight: 700,
                                height: 28,
                                justifyContent: "center",
                                mt: 0.25,
                                width: 28
                            } }
                        >
                            { hasError ? "!" : "OK" }
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={ { color: hasError ? "#B42318" : "#15803D", mb: 0.25 } }>
                                { hasError ? "Test Failed" : "Test Passed" }
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                { hasError
                                    ? "Some steps failed during the connection test. Check the Logs tab for details."
                                    : "All connection test steps completed successfully." }
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            ) }

            { /* Results Section */ }
            { error && (
                <Card
                    variant="outlined"
                    sx={ { mt: 4, p: 3 } }
                    data-testid="idp-test-result-error"
                >
                    <Alert severity="error" sx={ { mb: 2 } }>
                        { error }
                    </Alert>
                    <Box sx={ { mt: 1.5 } }>
                        <Button
                            onClick={ handleRunTests }
                            color="primary"
                            variant="contained"
                            data-testid="idp-test-result-retry"
                        >
                                    Retry
                        </Button>
                    </Box>
                </Card>
            ) }

            { !error && result && (
                <Card
                    variant="outlined"
                    sx={ { mt: 4, p: 3 } }
                    data-testid="idp-test-result-tabs"
                >
                    { renderResultsTabs() }
                </Card>
            ) }

            { !error && !result && (debugId || loading) && (
                <Card
                    variant="outlined"
                    sx={ { mt: 4, p: 3 } }
                    data-testid="idp-test-result-loading"
                >
                    <Box sx={ { alignItems: "center", display: "flex", gap: 1, mb: 2 } }>
                        <CircularProgress color="primary" size={ 20 } />
                        <Typography variant="body2" color="text.secondary">
                            { loading ? "Loading test results..." : "Waiting for authentication to complete..." }
                        </Typography>
                    </Box>

                    <Stack spacing={ 1.5 }>
                        <Skeleton variant="rectangular" height={ 32 } />
                        <Skeleton width="65%" />
                        <Skeleton />
                        <Skeleton />
                    </Stack>
                </Card>
            ) }
        </TabPageLayout>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ConnectionTestPage;
