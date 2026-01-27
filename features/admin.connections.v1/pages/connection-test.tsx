/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
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

import { history } from "@wso2is/admin.core.v1/helpers/history";
import {
    PageLayout,
    PrimaryButton,
    TabPageLayout,
    AppAvatar,
    AnimatedAvatar
} from "@wso2is/react-components";
import React, { useState, useRef, Fragment, useEffect } from "react";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router-dom";
import { Header, Icon, List, Segment, Tab } from "semantic-ui-react";
import { ConnectionsManagementUtils } from "@wso2is/admin.connections.v1/utils/connection-utils";
import { AuthenticatorMeta } from "../meta/authenticator-meta";
import { getConnectionDetails } from "../api/connections";
import { EmptyPlaceholder } from "@wso2is/react-components";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";


/**
 * Interface for the route parameters.
 */
interface RouteParams {
    tenantDomain?: string;
    idpId?: string;
}

/**
 * Enum for test status.
 */
type TestStatus = "idle" | "pending" | "success" | "error";

/**
 * Connection Test page component.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
const ConnectionTestPage: React.FC<RouteComponentProps<RouteParams>> = (props) => {
    const { tenantDomain = "", idpId = "" } = props.match.params || {};

    const { t } = useTranslation();

    const [ connectionStatus, setConnectionStatus ] = useState<TestStatus>("idle");
    const [ authStatus, setAuthStatus ] = useState<TestStatus>("idle");
    const [ claimsStatus, setClaimsStatus ] = useState<TestStatus>("idle");
    const [ debugId, setDebugId ] = useState<string | null>(null);
    const [ result, setResult ] = useState<any>(null);
    const [ error, setError ] = useState<string | null>(null);
    const [ loading, setLoading ] = useState(false);
    const [ hasError, setHasError ] = useState(false);
    const [ activeTab, setActiveTab ] = useState(0);
    const [ showResults, setShowResults ] = useState(false);

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
                `https://localhost:9443/api/server/v1/debug/result/${sid}`,
                { withCredentials: true }
            );
            setResult(response.data);
            setShowResults(true);
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
        setConnectionStatus("pending");
        setAuthStatus("pending");
        setClaimsStatus("pending");
        setError(null);
        setResult(null);
        setShowResults(false);

        try {
            const axios = (await import("axios")).default;
            const payload = {
                resourceId: idpId,
                resourceType: "IDP",
                properties: {}
            };

            const response = await axios.post(
                `https://localhost:9443/api/server/v1/debug/`,
                payload,
                { withCredentials: true }
            );

            const newDebugId = response.data.result.debugId;
            const authorizationUrl = response.data.result.authorizationUrl;
            const status = response.data.result.status;

            setDebugId(newDebugId);

            // Open authorizationUrl in a new tab if present
            if (authorizationUrl) {
                const authPopup = window.open(authorizationUrl, "_blank");
                
                // Monitor the popup and fetch results when it closes
                const checkPopupClosed = setInterval(() => {
                    try {
                        if (authPopup && authPopup.closed) {
                            clearInterval(checkPopupClosed);
                            // Fetch results after popup closes
                            setTimeout(() => {
                                fetchResult(newDebugId);
                            }, 1000);
                        }
                    } catch (e) {
                        // ignore
                    }
                }, 500);

                // Set a timeout to fetch results after 30 seconds in case popup detection doesn't work
                setTimeout(() => {
                    clearInterval(checkPopupClosed);
                    fetchResult(newDebugId);
                }, 30000);
            } else {
                // If no authorizationUrl, fetch results immediately
                setTimeout(() => {
                    fetchResult(newDebugId);
                }, 2000);
            }

            // Update status based on response
            if (status === "SUCCESS") {
                setConnectionStatus("success");
            } else {
                setConnectionStatus("error");
            }
        } catch (error: any) {
            setConnectionStatus("error");
            setAuthStatus("error");
            setClaimsStatus("error");
            setError(error?.response?.data?.message || error?.message || "Failed to run test.");
        }
    };

    // Update test statuses based on result metadata
    useEffect(() => {
        if (result && result.metadata) {
            const metadata = result.metadata;
            setConnectionStatus(metadata.connectionStatus === "success" ? "success" : metadata.connectionStatus === "pending" ? "pending" : "error");
            setAuthStatus(metadata.authenticationStatus === "success" ? "success" : metadata.authenticationStatus === "pending" ? "pending" : "error");
            setClaimsStatus(metadata.claimMappingStatus === "success" ? "success" : metadata.claimMappingStatus === "pending" ? "pending" : "error");
            
            // Check if any step explicitly failed (not pending or success)
            const hasStepError = (
                (metadata.connectionStatus !== "success" && metadata.connectionStatus !== "pending") ||
                (metadata.authenticationStatus !== "success" && metadata.authenticationStatus !== "pending") ||
                (metadata.claimMappingStatus !== "success" && metadata.claimMappingStatus !== "pending") ||
                result?.error
            );
            
            if (hasStepError) {
                setHasError(true);
                setActiveTab(2); // Switch to Logs tab (index 2)
            } else {
                setHasError(false);
            }
        }
    }, [result]);

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {
        // Navigate to the specific connection page
        history.push(`/t/${tenantDomain}/console/connections/${idpId}`);
    };

    /**
     * Handles the "Back to Test" button when viewing results.
     */
    const handleBackToTest = (): void => {
        setShowResults(false);
        setResult(null);
        setError(null);
        setDebugId(null);
        setConnectionStatus("idle");
        setAuthStatus("idle");
        setClaimsStatus("idle");
        setHasError(false);
        setActiveTab(0);
    };

    /**
     * Renders the status icon based on the test status.
     *
     * @param status - The status of the test.
     * @returns React element.
     */
    const renderStatusIcon = (status: TestStatus) => {
        switch (status) {
            case "pending":
                // Use spinner for "pending" (running) state
                return <Icon name="spinner" loading color="blue" data-testid="test-status-pending" />;
            case "success":
                return <Icon name="check circle" color="green" data-testid="test-status-success" />;
            case "error":
                return <Icon name="times circle" color="red" data-testid="test-status-error" />;
            case "idle":
            default:
                // Use clock icon for "idle" state (matching wireframe's "Pending")
                return <Icon name="clock outline" color="grey" data-testid="test-status-idle" />;
        }
    };


    // State for connector details
    const [ connector, setConnector ] = useState(undefined);
    const [ isConnectorDetailsFetchRequestLoading, setConnectorDetailFetchRequestLoading ] = useState(false);
    // Get UIConfig and connectionResourcesUrl like in edit page
    const { UIConfig } = useUIConfig();
    const connectionResourcesUrl = UIConfig?.connectionResourcesUrl;
    const idpDescElement = useRef(null);
    const testId = "idp-test-connection";

    // Fetch connector details on mount
    React.useEffect(() => {
        if (!idpId) return;
        setConnectorDetailFetchRequestLoading(true);
        (async () => {
            try {
                const response = await getConnectionDetails(idpId);
                setConnector(response);
            } catch (error) {
                setConnector(undefined);
            } finally {
                setConnectorDetailFetchRequestLoading(false);
            }
        })();
    }, [idpId]);

    const resolveConnectorName = (conn) => {
        if (!conn) {
            return "Connection Test";
        }

        if (ConnectionsManagementUtils.isConnectorIdentityProvider(conn)) {
            return conn.name;
        }

        const name = conn.friendlyName || conn.displayName || conn.name || "Connection Test";

        return name;
    };

    const resolveConnectorImage = (conn) => {
        const isOrganizationSSOIDP: boolean = ConnectionsManagementUtils.isOrganizationSSOConnection(
            conn?.federatedAuthenticators?.defaultAuthenticatorId
        );

        if (!conn) {
            return <AppAvatar hoverable={ false } isLoading={ true } size="tiny" />;
        }

        if (ConnectionsManagementUtils.isConnectorIdentityProvider(conn) && !isOrganizationSSOIDP) {
            if (conn.image) {
                const resolvedPath = ConnectionsManagementUtils.resolveConnectionResourcePath(
                    connectionResourcesUrl,
                    conn?.image
                );
                return (
                    <AppAvatar
                        hoverable={ false }
                        name={ conn.name }
                        image={ resolvedPath }
                        size="tiny"
                    />
                );
            }
            return <AnimatedAvatar hoverable={ false } name={ conn.name } size="tiny" floated="left" />;
        }
        return (
            <AppAvatar
                hoverable={ false }
                name={ conn.name }
                image={
                    !isOrganizationSSOIDP
                        ? AuthenticatorMeta.getAuthenticatorIcon(conn?.id)
                        : AuthenticatorMeta.getAuthenticatorIcon(
                            conn?.federatedAuthenticators?.defaultAuthenticatorId
                        )
                }
                size="tiny"
            />
        );
    };

    const resolveConnectorDescription = (conn) => {
        if (!conn) {
            return "Test Federated IdP connection";
        }
        return `Test the ${conn?.name || "connection"} connection`;
    };

    /**
     * Renders the results tabs when test results are available.
     */
    const renderResultsTabs = () => {
        const tabPanes = [
            {
                menuItem: "Token Details",
                render: () => {
                    // Helper to decode JWT
                    const decodeJWT = (token) => {
                        if (!token || typeof token !== "string" || token.split(".").length < 3) return null;
                        const [header, payload, signature] = token.split(".");
                        const decode = (str) => {
                            try {
                                let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
                                while (base64.length % 4) base64 += "=";
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

                    const idToken = result?.idToken;
                    const decoded = decodeJWT(idToken);

                    return (
                        <Tab.Pane>
                            <div style={{ maxWidth: 900, margin: '0 auto', padding: 0 }}>
                                {decoded ? (
                                    <div style={{ marginTop: 24 }}>
                                        <Header as="h4" style={{ marginBottom: 16 }}>ID Token</Header>
                                        <div style={{
                                            display: 'block',
                                            background: '#f9fafb',
                                            borderRadius: 8,
                                            padding: 18,
                                            border: '1px solid #e0e0e0',
                                            marginBottom: 24
                                        }}>
                                            <div style={{ marginBottom: 18 }}>
                                                <Header as="h5" style={{ color: '#2185d0', marginBottom: 6 }}>Header</Header>
                                                <pre style={{ background: "#f4f6fa", borderRadius: 4, padding: 12, fontSize: 13, border: '1px solid #e0e0e0', margin: 0 }}>
                                                    {JSON.stringify(decoded.header, null, 2)}
                                                </pre>
                                            </div>
                                            <div style={{ marginBottom: 18 }}>
                                                <Header as="h5" style={{ color: '#21ba45', marginBottom: 6 }}>Payload</Header>
                                                <pre style={{ background: "#f4f6fa", borderRadius: 4, padding: 12, fontSize: 13, border: '1px solid #e0e0e0', margin: 0 }}>
                                                    {JSON.stringify(decoded.payload, null, 2)}
                                                </pre>
                                            </div>
                                            <div>
                                                <Header as="h5" style={{ color: '#db2828', marginBottom: 6 }}>Signature</Header>
                                                <div style={{
                                                    overflowX: 'auto',
                                                    maxWidth: '100%',
                                                    background: '#f4f6fa',
                                                    borderRadius: 4,
                                                    border: '1px solid #e0e0e0',
                                                    padding: 0,
                                                    margin: 0
                                                }}>
                                                    <pre style={{
                                                        background: 'transparent',
                                                        padding: 12,
                                                        fontSize: 13,
                                                        wordBreak: 'break-all',
                                                        margin: 0,
                                                        minWidth: 0,
                                                        border: 'none'
                                                    }}>
                                                        {decoded.signature}
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ marginTop: 16, color: '#888' }}>
                                        <em>Unable to decode token or not a valid JWT.</em>
                                    </div>
                                )}
                                <Header as="h4" style={{ marginBottom: 8 }}>External Redirect URL</Header>
                                <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", background: '#f8f8f8', borderRadius: 6, padding: 12, fontSize: 14, border: '1px solid #e0e0e0' }}>
                                    {typeof result?.externalRedirectUrl === 'string' ? result.externalRedirectUrl : JSON.stringify(result?.externalRedirectUrl, null, 2)}
                                </pre>
                            </div>
                        </Tab.Pane>
                    );
                }
            },
            {
                menuItem: "Claims Mappings",
                render: () => {
                    const claimsArray = Array.isArray(result?.mappedClaims) ? result?.mappedClaims : [];
                    const sortedClaims = claimsArray.sort((a, b) => {
                        if (a.status === 'Successful' && b.status !== 'Successful') return -1;
                        if (a.status !== 'Successful' && b.status === 'Successful') return 1;
                        return 0;
                    });

                    const formatValue = (val) => {
                        if (val === null || val === undefined) return '-';
                        if (typeof val === 'object') return JSON.stringify(val);
                        return String(val);
                    };

                    return (
                        <Tab.Pane>
                            <div>
                                <Header as="h4">Claims Mapping Table</Header>
                                <div style={{ overflowX: 'auto', marginTop: 16 }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#f9fafb', borderRadius: 8, overflow: 'hidden' }}>
                                        <thead>
                                            <tr style={{ background: '#f4f6fa', borderBottom: '1px solid #e0e0e0' }}>
                                                <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 600, fontSize: 15, borderRight: '1px solid #e0e0e0' }}>IDP Claim</th>
                                                <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 600, fontSize: 15, borderRight: '1px solid #e0e0e0' }}>IS Claim (URI)</th>
                                                <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 600, fontSize: 15, borderRight: '1px solid #e0e0e0' }}>Value</th>
                                                <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 600, fontSize: 15 }}>Mapping Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedClaims.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} style={{ padding: 16, textAlign: 'center', color: '#888' }}>No claims found.</td>
                                                </tr>
                                            )}
                                            {sortedClaims.map((claim, idx) => (
                                                <tr key={idx} style={{ borderBottom: '1px solid #e0e0e0', background: claim.status === 'Successful' ? '#eaffea' : '#fff' }}>
                                                    <td style={{ padding: '8px', borderRight: '1px solid #e0e0e0', fontFamily: 'monospace', fontSize: 13, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={claim.idpClaim}>{claim.idpClaim}</td>
                                                    <td style={{ padding: '8px', borderRight: '1px solid #e0e0e0', fontFamily: 'monospace', fontSize: 13, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={claim.isClaim || '-'}>{claim.isClaim || '-'}</td>
                                                    <td style={{ padding: '8px', borderRight: '1px solid #e0e0e0', fontFamily: 'monospace', fontSize: 13, maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', color: '#666' }} title={formatValue(claim.value)}>{formatValue(claim.value)}</td>
                                                    <td style={{ padding: '8px', color: claim.status === 'Successful' ? '#21ba45' : '#db2828', fontWeight: 500 }}>{claim.status}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Tab.Pane>
                    );
                }
            },
            {
                menuItem: "Logs",
                render: () => {
                    const formatLogs = () => {
                        const metadata = result?.metadata || {};
                        const errorDetails = result?.error_details || null;
                        const errorDescription = result?.error_description || null;
                        
                        return (
                            <div>
                                {(errorDetails || errorDescription) && (
                                    <div style={{ marginBottom: 16 }}>
                                        <Header as="h5" style={{ marginBottom: 12, color: '#db2828' }}>Error Information</Header>
                                        <div style={{ background: '#fff5f5', borderRadius: 6, borderLeft: '4px solid #db2828', padding: 12, marginBottom: 12 }}>
                                            {errorDescription && (
                                                <div style={{ marginBottom: 8 }}>
                                                    <span style={{ fontWeight: 600, color: '#db2828' }}>Description:</span>
                                                    <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#db2828', margin: '4px 0 0 0', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                                        {errorDescription}
                                                    </p>
                                                </div>
                                            )}
                                            {errorDetails && (
                                                <div>
                                                    <span style={{ fontWeight: 600, color: '#db2828' }}>Details:</span>
                                                    <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#db2828', margin: '4px 0 0 0', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                                        {errorDetails}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {Object.keys(metadata).length > 0 && (
                                    <div>
                                        <Header as="h5" style={{ marginBottom: 12, marginTop: 16 }}>Steps</Header>
                                        <div style={{ background: '#f9fafb', borderRadius: 6, padding: 12, marginBottom: 16, border: '1px solid #e0e0e0' }}>
                                            {[
                                                { key: 'connectionStatus', label: 'Connection Creation' },
                                                { key: 'authenticationStatus', label: 'Authentication' },
                                                { key: 'claimMappingStatus', label: 'Claims Mapping' }
                                            ].map(({ key, label }) => (
                                                key in metadata ? (
                                                    <div key={key} style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ fontFamily: 'monospace', color: '#666', fontSize: 13 }}>{label}:</span>
                                                        <span style={{
                                                            fontFamily: 'monospace',
                                                            fontSize: 13,
                                                            padding: '2px 8px',
                                                            borderRadius: 4,
                                                            background: metadata[key] === 'success' ? '#e6ffe6' : metadata[key] === 'failed' || metadata[key] === 'error' ? '#ffe6e6' : '#f0f0f0',
                                                            color: metadata[key] === 'success' ? '#21ba45' : metadata[key] === 'failed' || metadata[key] === 'error' ? '#db2828' : '#666',
                                                            fontWeight: 500
                                                        }}>
                                                            {String(metadata[key])}
                                                        </span>
                                                    </div>
                                                ) : null
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!errorDetails && !errorDescription && Object.keys(metadata).length === 0 && (
                                    <div style={{ color: '#888', textAlign: 'center', padding: '24px' }}>
                                        <em>No log information available.</em>
                                    </div>
                                )}
                            </div>
                        );
                    };

                    return (
                        <Tab.Pane>
                            <div>
                                {formatLogs()}
                            </div>
                        </Tab.Pane>
                    );
                }
            }
        ];

        return <Tab panes={tabPanes} activeIndex={activeTab} onTabChange={(e, data) => setActiveTab(data.activeIndex as number)} />;
    };

    return (
        <TabPageLayout
            isLoading={isConnectorDetailsFetchRequestLoading || loading}
            pageTitle={showResults ? "Test Results" : "Test Connection"}
            title={showResults ? "Test Results" : "Test " + resolveConnectorName(connector)}
            description={showResults ? "Results for the connection test session." : resolveConnectorDescription(connector)}
            image={!showResults ? resolveConnectorImage(connector) : undefined}
            backButton={{
                "data-testid": `${testId}-back-button`,
                onClick: showResults ? handleBackToTest : handleBackButtonClick,
                text: showResults ? "Back to Test" : t("console:develop.pages.idpTest.backButton", "Go back to Connection")
            }}
            action={
                showResults ? (
                    <PrimaryButton
                        onClick={handleRunTests}
                        loading={loading}
                        disabled={loading}
                        data-testid="idp-test-result-rerun-button"
                    >
                        <Icon name="redo" />
                        Rerun Test
                    </PrimaryButton>
                ) : null
            }
            titleTextAlign="left"
            contentTopMargin={true}
            bottomMargin={false}
            data-testid={`${testId}-page-layout`}
        >
            { !showResults && (
                <>
                    <div style={{ marginTop: "2rem" }}>
                        <PrimaryButton
                            data-testid="idp-run-tests-button"
                            onClick={ handleRunTests }
                            loading={ connectionStatus === "pending" || authStatus === "pending" || claimsStatus === "pending" }
                        >
                            <Icon name="play" />
                            Run Tests
                        </PrimaryButton>
                    </div>
                    <EmptyPlaceholder
                        image={ getEmptyPlaceholderIllustrations().newList }
                        imageSize="tiny"
                        subtitle={ [
                            t("console:develop.pages.idpTest.runTestPlaceholder",
                                "Click on the 'Run Tests' button to start testing the connection.")
                        ] }
                        data-componentid={ `${ testId }-placeholder` }
                        data-testid={ `${ testId }-placeholder` }
                    />
                </>
            ) }


            {showResults && (
                <>
                    {/* Test Status Section */}
                    <Segment
                        basic
                        padded="very"
                        className="bordered emphasized"
                        style={{ marginTop: "2rem" }}
                        data-componentid="emphasized-segment"
                        data-testid="emphasized-segment"
                    >
                        <Header as="h3" data-testid="test-status-header">
                            {t("console:develop.pages.idpTest.statusHeader", "Test Status")}
                        </Header>
                        {hasError && (
                            <div style={{ background: '#fff5f5', borderLeft: '4px solid #db2828', padding: 12, marginBottom: 16, borderRadius: 4 }}>
                                <p style={{ color: '#db2828', fontWeight: 500, margin: 0 }}>⚠️ Errors Detected</p>
                                <p style={{ color: '#666', fontSize: 13, margin: '4px 0 0 0' }}>Check the details below about the failed steps.</p>
                            </div>
                        )}
                        <List divided relaxed verticalAlign="middle" data-testid="test-status-list">
                            <List.Item>
                                <List.Content floated="right">
                                    {renderStatusIcon(connectionStatus)}
                                </List.Content>
                                <List.Content>
                                    <List.Header>
                                        {t("console:develop.pages.idpTest.connectionCreation", "Connection Creation")}
                                    </List.Header>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content floated="right">
                                    {renderStatusIcon(authStatus)}
                                </List.Content>
                                <List.Content>
                                    <List.Header>
                                        {t("console:develop.pages.idpTest.authentication", "Authentication")}
                                    </List.Header>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content floated="right">
                                    {renderStatusIcon(claimsStatus)}
                                </List.Content>
                                <List.Content>
                                    <List.Header>
                                        {t("console:develop.pages.idpTest.claimsMapping", "Claims Mapping")}
                                    </List.Header>
                                </List.Content>
                            </List.Item>
                        </List>
                    </Segment>

                    {/* Results Section */}
                    {error && (
                        <Segment
                            basic
                            padded="very"
                            className="bordered emphasized"
                            style={{ marginTop: "2rem", color: "red" }}
                            data-testid="idp-test-result-error"
                        >
                            {error}
                            <div style={{ marginTop: 12 }}>
                                <PrimaryButton onClick={handleRunTests} data-testid="idp-test-result-retry">
                                    Retry
                                </PrimaryButton>
                            </div>
                        </Segment>
                    )}

                    {!error && result && (
                        <Segment
                            basic
                            padded="very"
                            className="bordered emphasized"
                            style={{ marginTop: "2rem" }}
                            data-testid="idp-test-result-tabs"
                        >
                            {renderResultsTabs()}
                        </Segment>
                    )}

                    {!error && !result && debugId && !loading && (
                        <Segment
                            basic
                            padded="very"
                            className="bordered emphasized"
                            style={{ marginTop: "2rem" }}
                            data-testid="idp-test-result-empty"
                        >
                            No results available.
                            <div style={{ marginTop: 12 }}>
                                <PrimaryButton onClick={() => fetchResult(debugId)} data-testid="idp-test-result-refresh">
                                    Refresh
                                </PrimaryButton>
                            </div>
                        </Segment>
                    )}
                </>
            )}
        </TabPageLayout>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ConnectionTestPage;
