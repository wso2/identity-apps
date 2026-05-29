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
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import useResourceEndpoints from "@wso2is/admin.core.v1/hooks/use-resource-endpoints";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { SessionStorageUtils } from "@wso2is/core/utils";
import { TabPageLayout } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router-dom";
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

const POLL_INTERVAL_MS: number = 2000;
const POLL_MAX_ATTEMPTS: number = 30;
const DEBUG_STATUS_INCOMPLETE: string = "SUCCESS_INCOMPLETE";
const TEST_ID: string = "idp-test-connection";

interface RouteParams {
    tenantDomain?: string;
    id?: string;
}

interface ConnectionTestLocationStateInterface {
    debugId?: string;
}

interface ConnectionTestPagePropsInterface extends IdentifiableComponentInterface, RouteComponentProps<RouteParams> {}

const decodeJWT = (
    token?: string
): { header: unknown; payload: unknown; signature: string } | null => {
    if (!token || typeof token !== "string" || token.split(".").length < 3) {
        return null;
    }

    const [ header, payload, signature ] = token.split(".");
    const decode = (value: string): unknown => {
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

const formatClaimValue = (value: unknown): string => {
    if (value === null || value === undefined) {
        return "-";
    }
    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value);
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

const renderDiagnosticLogValue = (value: unknown): string | ReactElement => {
    if (value === null || value === undefined || value === "") {
        return "-";
    }

    if (typeof value === "object") {
        return (
            <StyledDiagnosticValueBlock component="pre">
                { JSON.stringify(value, null, 2) }
            </StyledDiagnosticValueBlock>
        );
    }

    return String(value);
};

const getExpandedDiagnosticRows = (
    log: ConnectionTestDiagnosticLogInterface
): Array<{ label: string; value: unknown }> => {
    const rows: Array<{ label: string; value: unknown }> = [
        { label: "recordedAt", value: log.timestamp ? new Date(log.timestamp).toLocaleString() : null },
        { label: "resultStatus", value: log.status },
        { label: "details", value: log.details },
        { label: "errorCode", value: log.errorCode },
        { label: "federatedAttribute", value: log.federatedAttribute },
        { label: "errorDescription", value: log.errorDescription }
    ];

    return rows.filter(
        (row: { label: string; value: unknown }) =>
            row.value !== undefined && row.value !== null && row.value !== ""
    );
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
    const { id: connectorId = "" } = props.match.params || {};
    const { location } = props;
    const resultCacheKey: string = `idp-test-result:${ connectorId }`;
    const locationState: ConnectionTestLocationStateInterface | undefined =
        location?.state as ConnectionTestLocationStateInterface | undefined;

    const getCachedResult = (): ConnectionTestResultInterface | null => {
        if (!connectorId) {
            return null;
        }

        const cachedResult: string = SessionStorageUtils.getItemFromSessionStorage(resultCacheKey);

        if (!cachedResult) {
            return null;
        }

        try {
            return JSON.parse(cachedResult);
        } catch {
            SessionStorageUtils.clearItemFromSessionStorage(resultCacheKey);

            return null;
        }
    };

    const { t } = useTranslation();
    const { resourceEndpoints } = useResourceEndpoints();

    const [ debugId, setDebugId ] = useState<string | null>(null);
    const [ result, setResult ] = useState<ConnectionTestResultInterface | null>(() =>
        locationState?.debugId ? null : getCachedResult()
    );
    const [ error, setError ] = useState<string | null>(null);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ hasError, setHasError ] = useState<boolean>(false);
    const [ hasPartial, setHasPartial ] = useState<boolean>(false);
    const [ activeTab, setActiveTab ] = useState<number>(0);
    const [ autoRunTriggered, setAutoRunTriggered ] = useState<boolean>(false);
    const [ isStatusBannerVisible, setIsStatusBannerVisible ] = useState<boolean>(true);
    const [ expandedDiagnosticLogs, setExpandedDiagnosticLogs ] = useState<number[]>([]);

    const popupInterval: React.MutableRefObject<NodeJS.Timeout | null> = useRef<NodeJS.Timeout | null>(null);
    const fetchTimer: React.MutableRefObject<NodeJS.Timeout | null> = useRef<NodeJS.Timeout | null>(null);

    const clearCachedResult = (): void => {
        if (!connectorId) {
            return;
        }

        SessionStorageUtils.clearItemFromSessionStorage(resultCacheKey);
    };

    const cacheResult = (value: ConnectionTestResultInterface): void => {
        if (!connectorId) {
            return;
        }

        SessionStorageUtils.setItemToSessionStorage(resultCacheKey, JSON.stringify(value));
    };

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

    useEffect(() => {
        return () => clearTimers();
    }, []);

    useEffect(() => {
        if (locationState?.debugId && !autoRunTriggered) {
            setResult(null);
            setError(null);
            setHasError(false);
            setHasPartial(false);
            setIsStatusBannerVisible(true);
            setExpandedDiagnosticLogs([]);
            clearCachedResult();

            setAutoRunTriggered(true);
            setDebugId(locationState.debugId);
            setLoading(true);

            fetchTimer.current = setTimeout(() => {
                pollForResult(locationState.debugId);
            }, POLL_INTERVAL_MS);
        }
    }, [ locationState, autoRunTriggered ]);

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
        } catch (fetchError) {
            setError(
                resolveConnectionTestErrorMessage(fetchError) ??
                    t("authenticationProvider:notifications.getIDP.genericError.description")
            );
        } finally {
            setLoading(false);
        }
    };

    /**
     * Polls the backend for test results, retrying while the session is still in progress.
     * Used for the auto-run path where the popup was opened by a previous page and
     * we have no direct reference to detect when it closes.
     */
    const pollForResult = async (sid: string, attempt: number = 0): Promise<void> => {
        if (!sid) {
            setError(t("authenticationProvider:notifications.getIDP.genericError.description"));
            setLoading(false);

            return;
        }

        try {
            const response: AxiosResponse<ConnectionTestResultInterface> =
                await getConnectionTestResult<ConnectionTestResultInterface>(resourceEndpoints, sid);

            if (response.data?.status === DEBUG_STATUS_INCOMPLETE) {
                if (attempt < POLL_MAX_ATTEMPTS) {
                    fetchTimer.current = setTimeout(() => {
                        pollForResult(sid, attempt + 1);
                    }, POLL_INTERVAL_MS);
                } else {
                    clearCachedResult();
                    setError(t("authenticationProvider:notifications.getIDP.genericError.description"));
                    setIsStatusBannerVisible(true);
                    setLoading(false);
                }

                return;
            }

            clearCachedResult();
            setResult(response.data);
            setIsStatusBannerVisible(true);
            cacheResult(response.data);
            setExpandedDiagnosticLogs([]);
            setLoading(false);
        } catch (fetchError) {
            setError(
                resolveConnectionTestErrorMessage(fetchError) ??
                    t("authenticationProvider:notifications.getIDP.genericError.description")
            );
            setLoading(false);
        }
    };

    const handleRunTests = async (): Promise<void> => {
        clearTimers();
        setLoading(true);
        setError(null);
        setResult(null);
        setHasError(false);
        setHasPartial(false);
        setIsStatusBannerVisible(true);
        setExpandedDiagnosticLogs([]);
        clearCachedResult();

        if (!connectorId) {
            setLoading(false);
            setError(t("authenticationProvider:notifications.getIDP.genericError.description"));

            return;
        }

        try {
            const response: AxiosResponse<ConnectionTestSessionResponseInterface> =
                await startConnectionTestSession(resourceEndpoints, connectorId);

            const authorizationUrl: string | undefined = response.data?.metadata?.authorizationUrl;
            const newDebugId: string | undefined = response.data?.debugId;

            if (!newDebugId) {
                setLoading(false);
                setError(t("authenticationProvider:notifications.getIDP.genericError.description"));

                return;
            }

            setDebugId(newDebugId);

            if (authorizationUrl) {
                const authPopup: Window | null = window.open(authorizationUrl, "_blank");

                popupInterval.current = setInterval(() => {
                    try {
                        if (authPopup && authPopup.closed) {
                            clearTimers();
                            fetchTimer.current = setTimeout(() => {
                                fetchResult(newDebugId);
                            }, 1000);
                        }
                    } catch {
                        // ignore cross-origin access errors
                    }
                }, 500);

                // Fallback: fetch after 30s if popup close detection fails
                fetchTimer.current = setTimeout(() => {
                    clearTimers();
                    fetchResult(newDebugId);
                }, 30000);
            } else {
                fetchTimer.current = setTimeout(() => {
                    fetchResult(newDebugId);
                }, POLL_INTERVAL_MS);
            }
        } catch (runError) {
            clearTimers();
            setLoading(false);
            setError(
                resolveConnectionTestErrorMessage(runError) ??
                    t("authenticationProvider:notifications.getIDP.genericError.description")
            );
        }
    };

    useEffect(() => {
        if (!result) {
            return;
        }

        const metadataObj: ConnectionTestResultMetadataInterface =
            result?.metadata?.metadata || result?.metadata || {};
        const stepStatus: ConnectionTestStepStatusInterface =
            metadataObj?.stepStatus || metadataObj?.steps || {};

        const steps: Record<string, string | undefined> = {
            accountLinkingStatus: stepStatus?.accountLinkingStatus || metadataObj?.accountLinkingStatus,
            authenticationStatus: stepStatus?.authenticationStatus || metadataObj?.authenticationStatus,
            claimExtractionStatus: stepStatus?.claimExtractionStatus || metadataObj?.claimExtractionStatus,
            claimMappingStatus: stepStatus?.claimMappingStatus || metadataObj?.claimMappingStatus,
            connectionCreation: stepStatus?.connectionCreation || metadataObj?.connectionCreation
        };

        const topLevelFailure: boolean = result?.status === "FAILURE";

        const hasStepError: boolean = Boolean(
            (steps.connectionCreation &&
                steps.connectionCreation !== "success" &&
                steps.connectionCreation !== "pending") ||
                (steps.authenticationStatus &&
                    steps.authenticationStatus !== "success" &&
                    steps.authenticationStatus !== "pending") ||
                (steps.claimMappingStatus &&
                    steps.claimMappingStatus !== "success" &&
                    steps.claimMappingStatus !== "pending" &&
                    steps.claimMappingStatus !== "partial") ||
                (steps.accountLinkingStatus &&
                    steps.accountLinkingStatus !== "success" &&
                    steps.accountLinkingStatus !== "pending") ||
                result?.error
        );

        const hasPartialStatus: boolean = steps.claimMappingStatus === "partial";

        const hasErrorFields: boolean = Boolean(
            metadataObj?.error_details || metadataObj?.error_description || metadataObj?.error_code
        );

        if (topLevelFailure || hasStepError || hasErrorFields) {
            setHasError(true);
            setHasPartial(false);
            setActiveTab(2);
        } else if (hasPartialStatus) {
            setHasError(false);
            setHasPartial(true);
            setActiveTab(2);
        } else {
            setHasError(false);
            setHasPartial(false);
        }
    }, [ result ]);

    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("IDP_EDIT").replace(":id", connectorId));
    };

    const renderCodeBlock = (
        value: unknown,
        options: {
            color?: string;
            marginBottom?: number;
            wordBreak?: "break-all" | "break-word";
        } = {}
    ): ReactElement => (
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

    const toggleDiagnosticLog = (index: number): void => {
        setExpandedDiagnosticLogs((previous: number[]) =>
            previous.includes(index)
                ? previous.filter((item: number) => item !== index)
                : [ ...previous, index ]
        );
    };

    const renderResultsTabs = (): ReactElement => {
        const tabPanes: Array<{ key: string; menuItem: string; render: () => ReactElement }> = [
            {
                key: "id-token",
                menuItem: t("authenticationProvider:connectionTest.tabs.idToken"),
                render: (): ReactElement => {
                    const idToken: string | undefined = result?.metadata?.idToken;
                    const decoded: { header: unknown; payload: unknown; signature: string } | null =
                        decodeJWT(idToken);

                    return (
                        <Box sx={ { pt: 3 } }>
                            <Stack spacing={ 3 }>
                                { decoded ? (
                                    <StyledResultCard variant="outlined">
                                        <Typography variant="h6" sx={ { mb: 1 } }>
                                            { t("authenticationProvider:connectionTest.idToken.header") }
                                        </Typography>
                                        { renderCodeBlock(decoded.header, { marginBottom: 2 }) }

                                        <Typography variant="h6" sx={ { mb: 1 } }>
                                            { t("authenticationProvider:connectionTest.idToken.payload") }
                                        </Typography>
                                        { renderCodeBlock(decoded.payload, { marginBottom: 2 }) }

                                        <Typography variant="h6" sx={ { mb: 1 } }>
                                            { t("authenticationProvider:connectionTest.idToken.signature") }
                                        </Typography>
                                        { renderCodeBlock(decoded.signature, { wordBreak: "break-all" }) }
                                    </StyledResultCard>
                                ) : (
                                    <Alert severity="info" icon={ false }>
                                        { t("authenticationProvider:connectionTest.idToken.decodeError") }
                                    </Alert>
                                ) }
                            </Stack>
                        </Box>
                    );
                }
            },
            {
                key: "claim-mappings",
                menuItem: t("authenticationProvider:connectionTest.tabs.claimMappings"),
                render: (): ReactElement => {
                    const claimsArray: MappedClaimInterface[] = Array.isArray(result?.metadata?.mappedClaims)
                        ? (result?.metadata?.mappedClaims as MappedClaimInterface[])
                        : [];
                    const sortedClaims: MappedClaimInterface[] = [ ...claimsArray ].sort(
                        (a: MappedClaimInterface, b: MappedClaimInterface) => {
                            if (a.status === "Successful" && b.status !== "Successful") {
                                return -1;
                            }
                            if (a.status !== "Successful" && b.status === "Successful") {
                                return 1;
                            }

                            return 0;
                        }
                    );

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
                                                <StyledHeaderCell component="th" sx={ { width: "48%" } }>
                                                    { t(
                                                        "authenticationProvider:connectionTest.claimMappings.localClaimColumn"
                                                    ) }
                                                </StyledHeaderCell>
                                                <StyledHeaderCell component="th" sx={ { width: "24%" } }>
                                                    { t(
                                                        "authenticationProvider:connectionTest.claimMappings.idpClaimColumn"
                                                    ) }
                                                </StyledHeaderCell>
                                                <StyledHeaderCell
                                                    component="th"
                                                    sx={ {
                                                        borderRight: "none",
                                                        width: "28%"
                                                    } }
                                                >
                                                    { t(
                                                        "authenticationProvider:connectionTest.claimMappings.valueColumn"
                                                    ) }
                                                </StyledHeaderCell>
                                            </StyledTableHeaderRow>
                                        </thead>
                                        <tbody>
                                            { sortedClaims.length === 0 && (
                                                <Box component="tr">
                                                    <Box
                                                        component="td"
                                                        colSpan={ 3 }
                                                        sx={ {
                                                            color: "text.secondary",
                                                            p: 2,
                                                            textAlign: "center"
                                                        } }
                                                    >
                                                        { t(
                                                            "authenticationProvider:connectionTest.claimMappings.empty"
                                                        ) }
                                                    </Box>
                                                </Box>
                                            ) }
                                            { sortedClaims.map((claim: MappedClaimInterface, idx: number) => (
                                                <StyledTableRow component="tr" key={ idx }>
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
                                                        title={ formatClaimValue(claim.value) }
                                                    >
                                                        { formatClaimValue(claim.value) }
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
                menuItem: t("authenticationProvider:connectionTest.tabs.diagnosis"),
                render: (): ReactElement => {
                    const metadataObj: ConnectionTestResultMetadataInterface = result?.metadata || {};
                    const stepStatus: ConnectionTestStepStatusInterface = metadataObj?.stepStatus || {};
                    const allDiagnostics: ConnectionTestDiagnosticLogInterface[] = Array.isArray(
                        metadataObj?.diagnostics
                    )
                        ? metadataObj.diagnostics
                        : [];
                    // Skip 'started' entries and claim-validation noise from diagnostics list
                    const diagnostics: ConnectionTestDiagnosticLogInterface[] = allDiagnostics.filter(
                        (log: ConnectionTestDiagnosticLogInterface) =>
                            !(log.status === "started" || log.stage === "claimValidation")
                    );
                    const steps: Record<string, string | undefined> = {
                        accountLinkingStatus:
                            stepStatus?.accountLinkingStatus || metadataObj?.accountLinkingStatus,
                        authenticationStatus:
                            stepStatus?.authenticationStatus || metadataObj?.authenticationStatus,
                        claimExtractionStatus:
                            stepStatus?.claimExtractionStatus || metadataObj?.claimExtractionStatus,
                        claimMappingStatus: stepStatus?.claimMappingStatus || metadataObj?.claimMappingStatus,
                        connectionCreation: stepStatus?.connectionCreation || metadataObj?.connectionCreation
                    };
                    const errorDescription: string | null = metadataObj?.error_description || null;
                    const errorCode: string | null = metadataObj?.error_code || null;
                    const topLevelStatus: string | undefined = result?.status;

                    return (
                        <Box sx={ { pt: 3 } }>
                            <Stack spacing={ 2 }>
                                { !errorDescription &&
                                    !errorCode &&
                                    Object.values(steps).every((v: string | undefined) => !v) &&
                                    diagnostics.length === 0 &&
                                    topLevelStatus !== "FAILURE" && (
                                        <Alert severity="info" icon={ false }>
                                            { t("authenticationProvider:connectionTest.diagnosis.noLogs") }
                                        </Alert>
                                    ) }

                                { diagnostics.length > 0 && (
                                    <Box>
                                        <StyledDiagnosticsScroller sx={ { maxHeight: { md: 520, xs: 420 } } }>
                                            <Accordion exclusive={ false } fluid>
                                                { diagnostics.map(
                                                    (
                                                        log: ConnectionTestDiagnosticLogInterface,
                                                        idx: number
                                                    ) => {
                                                        const timestamp: string = log.timestamp
                                                            ? new Date(log.timestamp).toLocaleString()
                                                            : t(
                                                                  "authenticationProvider:connectionTest.diagnosis.timestampUnavailable"
                                                              );
                                                        const isExpanded: boolean =
                                                            expandedDiagnosticLogs.includes(idx);

                                                        return (
                                                            <StyledDiagnosticAccordionRow
                                                                key={ idx }
                                                                sx={
                                                                    idx === diagnostics.length - 1
                                                                        ? { borderBottom: "none" }
                                                                        : undefined
                                                                }
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
                                                                                pt: { sm: 0, xs: 0.25 }
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
                                                                            { getDiagnosticStatusIcon(
                                                                                log.status
                                                                            ) }
                                                                            <Typography
                                                                                sx={ {
                                                                                    color: "text.primary",
                                                                                    fontSize: 13,
                                                                                    overflow: "hidden",
                                                                                    textOverflow: "ellipsis",
                                                                                    whiteSpace: "nowrap"
                                                                                } }
                                                                            >
                                                                                { log.message ||
                                                                                    t(
                                                                                        "authenticationProvider:connectionTest.diagnosis.noMessage"
                                                                                    ) }
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
                                                                    <Box sx={ { pb: 2, px: 5.5 } }>
                                                                        <StyledExpandedDetailsTable
                                                                            component="table"
                                                                        >
                                                                            <tbody>
                                                                                { getExpandedDiagnosticRows(
                                                                                    log
                                                                                ).map(
                                                                                    (row: {
                                                                                        label: string;
                                                                                        value: unknown;
                                                                                    }) => (
                                                                                        <Box
                                                                                            component="tr"
                                                                                            key={ row.label }
                                                                                        >
                                                                                            <StyledExpandedLabelCell component="td">
                                                                                                { row.label }:
                                                                                            </StyledExpandedLabelCell>
                                                                                            <StyledExpandedValueCell component="td">
                                                                                                { renderDiagnosticLogValue(
                                                                                                    row.value
                                                                                                ) }
                                                                                            </StyledExpandedValueCell>
                                                                                        </Box>
                                                                                    )
                                                                                ) }
                                                                            </tbody>
                                                                        </StyledExpandedDetailsTable>
                                                                    </Box>
                                                                </Accordion.Content>
                                                            </StyledDiagnosticAccordionRow>
                                                        );
                                                    }
                                                ) }
                                            </Accordion>
                                        </StyledDiagnosticsScroller>
                                    </Box>
                                ) }
                            </Stack>
                        </Box>
                    );
                }
            }
        ];

        return (
            <Box>
                <Tabs
                    value={ activeTab }
                    onChange={ (_: React.SyntheticEvent, value: number) => setActiveTab(value) }
                >
                    { tabPanes.map((tabPane: { key: string; menuItem: string }) => (
                        <Tab key={ tabPane.key } label={ tabPane.menuItem } />
                    )) }
                </Tabs>
                { tabPanes.map(
                    (
                        tabPane: { key: string; menuItem: string; render: () => ReactElement },
                        index: number
                    ) => (
                        <TabPanel key={ tabPane.key } value={ activeTab } index={ index }>
                            { tabPane.render() }
                        </TabPanel>
                    )
                ) }
            </Box>
        );
    };

    return (
        <TabPageLayout
            isLoading={ loading }
            pageTitle={ t("authenticationProvider:connectionTest.pageTitle") }
            title={ t("authenticationProvider:connectionTest.pageTitle") }
            description={ t("authenticationProvider:connectionTest.pageDescription") }
            backButton={ {
                "data-componentid": `${ TEST_ID }-back-button`,
                onClick: handleBackButtonClick,
                text: t("authenticationProvider:connectionTest.backButton")
            } }
            action={
                <Button
                    onClick={ handleRunTests }
                    disabled={ loading }
                    color="primary"
                    variant="contained"
                    data-componentid="idp-test-result-rerun-button"
                >
                    { t("authenticationProvider:connectionTest.rerunButton") }
                </Button>
            }
            titleTextAlign="left"
            contentTopMargin={ true }
            bottomMargin={ false }
            data-componentid={ `${ TEST_ID }-page-layout` }
        >
            { result && !error && isStatusBannerVisible && (
                <Box sx={ { mt: 4 } } data-componentid="test-status-banner">
                    <Alert
                        severity={ hasError ? "error" : hasPartial ? "warning" : "success" }
                        onClose={ () => setIsStatusBannerVisible(false) }
                    >
                        <AlertTitle>
                            { hasError
                                ? t("authenticationProvider:connectionTest.status.failed")
                                : hasPartial
                                ? t("authenticationProvider:connectionTest.status.partial")
                                : t("authenticationProvider:connectionTest.status.passed") }
                        </AlertTitle>
                        { hasError
                            ? t("authenticationProvider:connectionTest.status.failedDescription")
                            : hasPartial
                            ? t("authenticationProvider:connectionTest.status.partialDescription")
                            : t("authenticationProvider:connectionTest.status.passedDescription") }
                    </Alert>
                </Box>
            ) }

            { error && (
                <Card variant="outlined" sx={ { mt: 4, p: 3 } } data-componentid="idp-test-result-error">
                    <Alert severity="error" sx={ { mb: 2 } }>
                        <AlertTitle>{ t("authenticationProvider:connectionTest.error.title") }</AlertTitle>
                        { error }
                    </Alert>
                    <Box sx={ { mt: 1.5 } }>
                        <Button
                            onClick={ handleRunTests }
                            color="primary"
                            variant="contained"
                            data-componentid="idp-test-result-retry"
                        >
                            { t("authenticationProvider:connectionTest.error.retry") }
                        </Button>
                    </Box>
                </Card>
            ) }

            { !error && result && (
                <Card variant="outlined" sx={ { mt: 4, p: 3 } } data-componentid="idp-test-result-tabs">
                    { renderResultsTabs() }
                </Card>
            ) }

            { !error && !result && (debugId || loading) && (
                <Card
                    variant="outlined"
                    sx={ { mt: 4, p: 3 } }
                    data-componentid="idp-test-result-loading"
                >
                    <Box sx={ { alignItems: "center", display: "flex", gap: 1, mb: 2 } }>
                        <CircularProgress color="primary" size={ 20 } />
                        <Typography variant="body2" color="text.secondary">
                            { loading
                                ? t("authenticationProvider:connectionTest.loading.results")
                                : t("authenticationProvider:connectionTest.loading.waitingForAuth") }
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
