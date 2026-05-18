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
import AlertTitle from "@oxygen-ui/react/AlertTitle";
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
import { Theme, useTheme } from "@mui/material/styles";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import useResourceEndpoints from "@wso2is/admin.core.v1/hooks/use-resource-endpoints";
import { TabPageLayout } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router-dom";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Accordion, Icon } from "semantic-ui-react";
import {
    ConnectionTestSessionResponseInterface,
    getConnectionTestResult,
    resolveConnectionTestErrorMessage,
    startConnectionTestSession
} from "../api/connection-test-api";
import {
    StyledCodeBlock,
    StyledCodeBlockContainer,
    StyledDiagnosticAccordionRow,
    StyledDiagnosticAccordionTitle,
    StyledDiagnosticsScroller,
    StyledDiagnosticValueBlock,
    StyledExpandedDetailsTable,
    StyledExpandedLabelCell,
    StyledExpandedValueCell,
    StyledHeaderCell,
    StyledMonoCell,
    StyledResultCard,
    StyledTableHeaderRow,
    StyledTableRow,
    StyledTableWrapper,
    StyledValueCell
} from "../components/connection-test-styles";
import { MappedClaimInterface } from "../models/connection";
import {
    ConnectionTestDiagnosticLogInterface,
    ConnectionTestResultInterface,
    ConnectionTestResultMetadataInterface,
    ConnectionTestStepStatusInterface
} from "../models/connection-test";

interface RouteParams {
    tenantDomain?: string;
    id?: string;
}

interface ConnectionTestLocationStateInterface {
    debugId?: string;
}

interface ConnectionTestPagePropsInterface
    extends IdentifiableComponentInterface, RouteComponentProps<RouteParams> {}

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
const ConnectionTestPage: FunctionComponent<ConnectionTestPagePropsInterface> = (
    props: ConnectionTestPagePropsInterface
): ReactElement => {
    const theme: Theme = useTheme();
    const { id: connectorId = "" } = props.match.params || {};
    const { location } = props;
    const resultCacheKey: string = `idp-test-result:${connectorId}`;
    const locationState: ConnectionTestLocationStateInterface | undefined =
        location?.state as ConnectionTestLocationStateInterface | undefined;
    const hasPendingAutoRun: boolean = Boolean(locationState?.debugId);

    const getCachedResult = (): ConnectionTestResultInterface | null => {
        if (typeof window === "undefined" || !connectorId) {
            return null;
        }

        const cachedResult = window.localStorage.getItem(resultCacheKey);

        if (!cachedResult) {
            return null;
        }

        try {
            return JSON.parse(cachedResult);
        } catch (e) {
            window.localStorage.removeItem(resultCacheKey);

            return null;
        }
    };

    const { t } = useTranslation();
    const { resourceEndpoints } = useResourceEndpoints();

    const [ debugId, setDebugId ] = useState<string | null>(null);
    const [ result, setResult ] = useState<ConnectionTestResultInterface | null>(
        () => hasPendingAutoRun ? null : getCachedResult()
    );
    const [ error, setError ] = useState<string | null>(null);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ hasError, setHasError ] = useState<boolean>(false);
    const [ hasPartial, setHasPartial ] = useState<boolean>(false);
    const [ activeTab, setActiveTab ] = useState<number>(0);
    const [ autoRunTriggered, setAutoRunTriggered ] = useState<boolean>(false);
    const [ isStatusBannerVisible, setIsStatusBannerVisible ] = useState<boolean>(true);
    const [ expandedDiagnosticLogs, setExpandedDiagnosticLogs ] = useState<number[]>([]);

    const popupInterval = useRef<NodeJS.Timeout | null>(null);
    const fetchTimer = useRef<NodeJS.Timeout | null>(null);

    /**
     * Clears cached test result for the current connection.
     */
    const clearCachedResult = (): void => {
        if (typeof window === "undefined" || !connectorId) {
            return;
        }

        window.localStorage.removeItem(resultCacheKey);
    };

    /**
     * Saves latest test result payload to browser cache.
     */
    const cacheResult = (value: ConnectionTestResultInterface): void => {
        if (typeof window === "undefined" || !connectorId) {
            return;
        }

        window.localStorage.setItem(resultCacheKey, JSON.stringify(value));
    };

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
     * Auto-run result retrieval if a debug id is provided via location state.
     */
    useEffect(() => {
        const state: ConnectionTestLocationStateInterface | undefined = locationState;

        if (state?.debugId && !autoRunTriggered) {
            // Reset stale UI/cached data before starting an auto-run flow.
            setResult(null);
            setError(null);
            setHasError(false);
            setHasPartial(false);
            setIsStatusBannerVisible(true);
            setExpandedDiagnosticLogs([]);
            clearCachedResult();

            setAutoRunTriggered(true);
            setDebugId(state.debugId);

            // Fetch results after the authorization flow has had time to complete.
            fetchTimer.current = setTimeout(() => {
                clearTimers();
                fetchResult(state.debugId);
            }, 30000);
        }
    }, [ locationState, autoRunTriggered ]);


    /**
     * Fetches the test results from the backend.
     */
    const fetchResult = async (sid: string): Promise<void> => {
        if (!sid) {
            setError(t("authenticationProvider:notifications.getIDP.genericError.description"));

            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);
        setExpandedDiagnosticLogs([]);

        try {
            const response: AxiosResponse<ConnectionTestResultInterface> =
                await getConnectionTestResult<ConnectionTestResultInterface>(resourceEndpoints, sid);

            clearCachedResult();
            setResult(response.data);
            setIsStatusBannerVisible(true);
            cacheResult(response.data);
            setExpandedDiagnosticLogs([]);

        } catch (error: unknown) {
            console.error("[ConnectionTest] Fetch error:", resolveConnectionTestErrorMessage(error));

            const errorMessage: string | undefined = resolveConnectionTestErrorMessage(error);

            if (errorMessage) {
                setError(errorMessage);

                return;
            }

            setError(t("authenticationProvider:notifications.getIDP.genericError.description"));
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
        setHasPartial(false);
        setIsStatusBannerVisible(true);
        setExpandedDiagnosticLogs([]);
        clearCachedResult();

        if (!connectorId) {
            setError(t("authenticationProvider:notifications.getIDP.genericError.description"));

            return;
        }

        try {
            const response: AxiosResponse<ConnectionTestSessionResponseInterface> =
                await startConnectionTestSession(resourceEndpoints, connectorId);

            const authorizationUrl: string | undefined = response.data?.metadata?.authorizationUrl;
            const newDebugId: string | undefined = response.data?.debugId;

            if (!newDebugId) {
                clearTimers();
                setError(t("authenticationProvider:notifications.getIDP.genericError.description"));

                return;
            }

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
        } catch (error: unknown) {
            // eslint-disable-next-line no-console
            console.error("[ConnectionTest] Error running test:", error);
            clearTimers();
            setError(
                resolveConnectionTestErrorMessage(error)
                    ?? t("authenticationProvider:notifications.getIDP.genericError.description")
            );
        }
    };

    // Update error status based on result metadata
    useEffect(() => {
        if (result) {
            // Handle nested metadata structure
            const metadataObj = result?.metadata?.metadata || result?.metadata || {};
            
            // Try to get steps from stepStatus directly
            const stepStatus = metadataObj?.stepStatus || metadataObj?.steps || {};
            
            const steps: Record<string, string | undefined> = {
                connectionCreation: stepStatus?.connectionCreation || metadataObj?.connectionCreation,
                authenticationStatus: stepStatus?.authenticationStatus || metadataObj?.authenticationStatus,
                claimMappingStatus: stepStatus?.claimMappingStatus || metadataObj?.claimMappingStatus,
                claimExtractionStatus: stepStatus?.claimExtractionStatus || metadataObj?.claimExtractionStatus,
                accountLinkingStatus: stepStatus?.accountLinkingStatus || metadataObj?.accountLinkingStatus
            };

            // Check for top-level FAILURE status first
            const topLevelFailure = result?.status === "FAILURE";

            // Check if any step explicitly failed (not pending or success)
            const hasStepError = (
                (steps.connectionCreation && steps.connectionCreation !== "success" && steps.connectionCreation !== "pending") ||
                (steps.authenticationStatus && steps.authenticationStatus !== "success" && steps.authenticationStatus !== "pending") ||
                (steps.claimMappingStatus && steps.claimMappingStatus !== "success" && steps.claimMappingStatus !== "pending" && steps.claimMappingStatus !== "partial") ||
                steps.accountLinkingStatus && steps.accountLinkingStatus !== "success" && steps.accountLinkingStatus !== "pending" ||
                result?.error
            );

            // Check if claim mapping is partial
            const hasPartialStatus = steps.claimMappingStatus === "partial";

            // Check for error fields in metadata
            const hasErrorFields = metadataObj?.error_details || metadataObj?.error_description || metadataObj?.error_code;

            if (topLevelFailure || hasStepError || hasErrorFields) {
                setHasError(true);
                setHasPartial(false);
                setActiveTab(2); // Switch to Logs tab (index 2)
            } else if (hasPartialStatus) {
                setHasError(false);
                setHasPartial(true);
                setActiveTab(2); // Switch to Logs tab (index 2) for partial status
            } else {
                setHasError(false);
                setHasPartial(false);
            }
        }
    }, [ result ]);

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("IDP_EDIT").replace(":id", connectorId));
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
            <StyledCodeBlockContainer sx={ { mb: options.marginBottom ?? 0 } }>
                <StyledCodeBlock
                    component="pre"
                    sx={ {
                        color: options.color ?? "text.primary",
                        wordBreak: options.wordBreak ?? "break-word"
                    } }
                >
                    { typeof value === "string" ? value : JSON.stringify(value, null, 2) }
                </StyledCodeBlock>
            </StyledCodeBlockContainer>
        );

        const tabPanes = [
            {
                key: "id-token",
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
                                    <StyledResultCard variant="outlined">
                                        <Typography variant="h6" sx={ { mb: 1 } }>
                                            Header
                                        </Typography>
                                        { renderCodeBlock(decoded.header, { marginBottom: 2 }) }

                                        <Typography variant="h6" sx={ { mb: 1 } }>
                                            Payload
                                        </Typography>
                                        { renderCodeBlock(decoded.payload, { marginBottom: 2 }) }

                                        <Typography variant="h6" sx={ { mb: 1 } }>
                                            Signature
                                        </Typography>
                                        { renderCodeBlock(decoded.signature, { wordBreak: "break-all" }) }
                                    </StyledResultCard>
                                ) : (
                                    <Alert severity="info" icon={ false }>
                                        Unable to decode token or not a valid JWT.
                                    </Alert>
                                ) }
                            </Stack>
                        </Box>
                    );
                }
            },
            {
                key: "claim-mappings",
                menuItem: "Claim Mappings",
                render: () => {
                    const claimsArray: MappedClaimInterface[] = Array.isArray(result?.metadata?.mappedClaims)
                        ? result?.metadata?.mappedClaims as MappedClaimInterface[]
                        : [];
                    const sortedClaims: MappedClaimInterface[] = [ ...claimsArray ].sort((
                        a: MappedClaimInterface,
                        b: MappedClaimInterface
                    ) => {
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
                                <StyledTableWrapper>
                                    <Box
                                    component="table"
                                    sx={ {
                                        borderCollapse: "collapse",
                                        minWidth: 760,
                                        width: "100%"
                                    } }
                                >
                                    <thead>
                                        <StyledTableHeaderRow component="tr">
                                            <StyledHeaderCell
                                                component="th"
                                                sx={ {
                                                    width: "48%"
                                                } }
                                            >
                                                Local Claim (URI)
                                            </StyledHeaderCell>
                                            <StyledHeaderCell
                                                component="th"
                                                sx={ {
                                                    width: "24%"
                                                } }
                                            >
                                                IDP Claim
                                            </StyledHeaderCell>
                                            <StyledHeaderCell
                                                component="th"
                                                sx={ {
                                                    borderRight: "none",
                                                    width: "28%"
                                                } }
                                            >
                                                Value
                                            </StyledHeaderCell>
                                        </StyledTableHeaderRow>
                                    </thead>
                                    <tbody>
                                        { sortedClaims.length === 0 && (
                                            <Box component="tr">
                                                <Box component="td" colSpan={ 3 } sx={ { color: "text.secondary", p: 2, textAlign: "center" } }>
                                                    No claim mappings configured.
                                                </Box>
                                            </Box>
                                        ) }
                                        { sortedClaims.map((claim, idx) => (
                                            <StyledTableRow
                                                component="tr"
                                                key={ idx }
                                            >
                                                <StyledMonoCell
                                                    component="td"
                                                    sx={ {
                                                        maxWidth: 360,
                                                        whiteSpace: "normal",
                                                        wordBreak: "break-word"
                                                    } }
                                                    title={ claim.localClaim || claim.isClaim || "-" }
                                                >
                                                    { claim.localClaim || claim.isClaim || "-" }
                                                </StyledMonoCell>
                                                <StyledMonoCell
                                                    component="td"
                                                    sx={ {
                                                        maxWidth: 180,
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis"
                                                    } }
                                                    title={ claim.idpClaim }
                                                >
                                                    { claim.idpClaim }
                                                </StyledMonoCell>
                                                <StyledValueCell
                                                    component="td"
                                                    sx={ {
                                                        borderRight: "none",
                                                        maxWidth: 200,
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis"
                                                    } }
                                                    title={ formatValue(claim.value) }
                                                >
                                                    { formatValue(claim.value) }
                                                </StyledValueCell>
                                            </StyledTableRow>
                                        )) }
                                    </tbody>
                                </Box>
                                </StyledTableWrapper>
                            </Box>
                        </Box>
                    );
                }
            },
            {
                key: "diagnosis",
                menuItem: "Diagnosis",
                render: () => {
                    const formatLogs = () => {
                        const metadataObj: ConnectionTestResultMetadataInterface = result?.metadata || {};
                        const stepStatus: ConnectionTestStepStatusInterface = metadataObj?.stepStatus || {};
                        const allDiagnostics: ConnectionTestDiagnosticLogInterface[] =
                            Array.isArray(metadataObj?.diagnostics) ? metadataObj.diagnostics : [];
                        // Filter out 'started' status entries and claim validation stage entries
                        const diagnostics: ConnectionTestDiagnosticLogInterface[] = allDiagnostics.filter((
                            log: ConnectionTestDiagnosticLogInterface
                        ) =>
                            !(log.status === "started" || log.stage === "claimValidation")
                        );
                        const steps: Record<string, string | undefined> = {
                            authenticationStatus: stepStatus?.authenticationStatus || metadataObj?.authenticationStatus,
                            claimExtractionStatus: stepStatus?.claimExtractionStatus || metadataObj?.claimExtractionStatus,
                            claimMappingStatus: stepStatus?.claimMappingStatus || metadataObj?.claimMappingStatus,
                            connectionCreation: stepStatus?.connectionCreation || metadataObj?.connectionCreation,
                            accountLinkingStatus: stepStatus?.accountLinkingStatus || metadataObj?.accountLinkingStatus
                        };
                        const errorDescription = metadataObj?.error_description || null;
                        const errorCode = metadataObj?.error_code || null;
                        const accountLinkingMessage = metadataObj?.accountLinkingMessage || null;
                        const topLevelStatus = result?.status;
                        const accountLinkingFailed = steps.accountLinkingStatus === "failed";
                        const getStepStatusPalette = (status?: string) => {
                            const normalizedStatus = String(status || "unknown").toLowerCase();

                            switch (normalizedStatus) {
                                case "success":
                                    return { background: theme.palette.success.light, color: theme.palette.success.dark };
                                case "partial":
                                    return { background: theme.palette.warning.light, color: theme.palette.warning.dark };
                                case "started":
                                case "pending":
                                    return { background: theme.palette.info.light, color: theme.palette.info.dark };
                                case "failed":
                                case "error":
                                    return { background: theme.palette.error.light, color: theme.palette.error.dark };
                                default:
                                    return { background: theme.palette.action.hover, color: theme.palette.text.secondary };
                            }
                        };
                        const getDiagnosticStatusIcon = (status?: string): ReactElement => {
                            let iconName: "check circle" | "times circle";
                            let iconColor: "green" | "yellow" | "red";

                            switch (String(status || "").toUpperCase()) {
                                case "SUCCESS":
                                    iconName = "check circle";
                                    iconColor = "green";
                                    break;
                                case "PARTIAL":
                                    iconName = "check circle";
                                    iconColor = "yellow";
                                    break;
                                case "FAILED":
                                case "ERROR":
                                    iconName = "times circle";
                                    iconColor = "red";
                                    break;
                                default:
                                    return <></>;
                            }

                            return (
                                <Box
                                    sx={ {
                                        alignItems: "center",
                                        display: "inline-flex",
                                        flexShrink: 0,
                                        height: 16,
                                        justifyContent: "center",
                                        position: "relative",
                                        top: -1,
                                        width: 16
                                    } }
                                >
                                    <Icon
                                        name={ iconName }
                                        color={ iconColor }
                                        style={ {
                                            display: "block",
                                            fontSize: 16,
                                            lineHeight: 1,
                                            margin: 0
                                        } }
                                    />
                                </Box>
                            );
                        };
                        const toggleDiagnosticLog = (index: number) => {
                            setExpandedDiagnosticLogs((previous: number[]) => (
                                previous.includes(index)
                                    ? previous.filter((item: number) => item !== index)
                                    : [ ...previous, index ]
                            ));
                        };
                        const renderDiagnosticLogValue = (value: unknown) => {
                            if (value === null || value === undefined || value === "") {
                                return "-";
                            }

                            if (typeof value === "object") {
                                return (
                                    <StyledDiagnosticValueBlock
                                        component="pre"
                                    >
                                        { JSON.stringify(value, null, 2) }
                                    </StyledDiagnosticValueBlock>
                                );
                            }

                            return String(value);
                        };
                        const renderExpandedDiagnosticRows = (log: ConnectionTestDiagnosticLogInterface) => {
                            const rows: Array<{ label: string; value: unknown }> = [
                                {
                                    label: "recordedAt",
                                    value: log.timestamp ? new Date(log.timestamp).toLocaleString() : null
                                },
                                { label: "resultStatus", value: log.status },
                                { label: "details", value: log.details },
                                { label: "errorCode", value: log.errorCode },
                                { label: "federatedAttribute", value: log.federatedAttribute },
                                { label: "errorDescription", value: log.errorDescription },
                            ];

                            return rows.filter((row) => row.value !== undefined && row.value !== null && row.value !== "");
                        };

                        return (
                            <Stack spacing={ 2 }>


                                { !errorDescription && !errorCode && Object.keys(steps).length === 0 && topLevelStatus !== "FAILURE" && (
                                    <Alert severity="info" icon={ false }>
                                        No log information available.
                                    </Alert>
                                ) }

                                { diagnostics.length > 0 && (
                                    <Box>
                                        <StyledDiagnosticsScroller sx={ { maxHeight: { xs: 420, md: 520 } } }>
                                            <Accordion exclusive={ false } fluid>
                                                { diagnostics.map((log: any, idx: number) => {
                                                    const timestamp = log.timestamp
                                                        ? new Date(log.timestamp).toLocaleString()
                                                        : "Timestamp unavailable";
                                                    const isExpanded = expandedDiagnosticLogs.includes(idx);

                                                    return (
                                                        <StyledDiagnosticAccordionRow
                                                            key={ idx }
                                                            sx={ idx === diagnostics.length - 1 ? { borderBottom: "none" } : undefined }
                                                        >
                                                            <Accordion.Title
                                                                active={ isExpanded }
                                                                index={ idx }
                                                                onClick={ () => toggleDiagnosticLog(idx) }
                                                                style={ { padding: 0 } }
                                                            >
                                                                <StyledDiagnosticAccordionTitle>
                                                                    <Box
                                                                        sx={ {
                                                                            alignItems: "center",
                                                                            display: "flex",
                                                                            minWidth: 22,
                                                                            pt: { xs: 0.25, sm: 0 }
                                                                        } }
                                                                    >
                                                                        <Icon name="dropdown" />
                                                                    </Box>
                                                                    <Box
                                                                        sx={ {
                                                                            alignItems: "center",
                                                                            display: "flex",
                                                                            flex: 1,
                                                                            gap: 1,
                                                                            minWidth: 0
                                                                        } }
                                                                    >
                                                                        { getDiagnosticStatusIcon(log.status) }
                                                                        <Typography
                                                                            sx={ {
                                                                                color: "text.primary",
                                                                                fontSize: 13,
                                                                                overflow: "hidden",
                                                                                textOverflow: "ellipsis",
                                                                                whiteSpace: "nowrap"
                                                                            } }
                                                                        >
                                                                            { log.message || "No diagnostic message provided." }
                                                                        </Typography>
                                                                    </Box>
                                                                    <Box
                                                                        sx={ {
                                                                            color: "text.primary",
                                                                            flexShrink: 0,
                                                                            fontSize: 12,
                                                                            ml: "auto",
                                                                            textAlign: "right",
                                                                            whiteSpace: "nowrap"
                                                                        } }
                                                                    >
                                                                        { timestamp }
                                                                    </Box>
                                                                </StyledDiagnosticAccordionTitle>
                                                            </Accordion.Title>
                                                            <Accordion.Content active={ isExpanded }>
                                                                <Box sx={ { px: 5.5, pb: 2 } }>
                                                                    <StyledExpandedDetailsTable
                                                                        component="table"
                                                                    >
                                                                        <tbody>
                                                                            { renderExpandedDiagnosticRows(log).map((row) => (
                                                                                <Box component="tr" key={ row.label }>
                                                                                    <StyledExpandedLabelCell
                                                                                        component="td"
                                                                                    >
                                                                                        { row.label }:
                                                                                    </StyledExpandedLabelCell>
                                                                                    <StyledExpandedValueCell
                                                                                        component="td"
                                                                                    >
                                                                                        { renderDiagnosticLogValue(row.value) }
                                                                                    </StyledExpandedValueCell>
                                                                                </Box>
                                                                            )) }
                                                                        </tbody>
                                                                    </StyledExpandedDetailsTable>
                                                                </Box>
                                                            </Accordion.Content>
                                                        </StyledDiagnosticAccordionRow>
                                                    );
                                                }) }
                                            </Accordion>
                                        </StyledDiagnosticsScroller>
                                    </Box>
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
                        <Tab key={ tabPane.key } label={ tabPane.menuItem } />
                    )) }
                </Tabs>
                { tabPanes.map((tabPane, index) => (
                    <TabPanel key={ tabPane.key } value={ activeTab } index={ index }>
                        { tabPane.render() }
                    </TabPanel>
                )) }
            </Box>
        );
    };

    return (
        <div className="diagnostic-logs">
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
            { result && !error && isStatusBannerVisible && (
                <Box sx={ { mt: 4 } } data-testid="test-status-banner">
                    <Alert
                        severity={ hasError ? "error" : hasPartial ? "warning" : "success" }
                        onClose={ () => setIsStatusBannerVisible(false) }
                    >
                        <AlertTitle>
                            { hasError ? "Test Failed" : hasPartial ? "Test Passed Partially" : "Test Passed" }
                        </AlertTitle>
                        { hasError
                            ? "Some steps failed during the connection test. Check the Diagnosis tab for details."
                            : hasPartial
                                ? "Test passed but some claims were not successfully mapped. Check the Claim Mappings tab for details."
                                : "All connection test steps completed successfully." }
                    </Alert>
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
                        <AlertTitle>Error</AlertTitle>
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
        </div>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ConnectionTestPage;
