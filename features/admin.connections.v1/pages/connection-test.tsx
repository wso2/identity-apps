/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
    PrimaryButton,
    TabPageLayout,
    ContentLoader
} from "@wso2is/react-components";
import React, { useState, useRef, useEffect } from "react";
import useResourceEndpoints from "@wso2is/admin.core.v1/hooks/use-resource-endpoints";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router-dom";
import { Header, Icon, Segment, Tab, Placeholder } from "semantic-ui-react";


/**
 * Interface for the route parameters.
 */
interface RouteParams {
    tenantDomain?: string;
    id?: string;
}

/**
 * Connection Test page component.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
const ConnectionTestPage: React.FC<RouteComponentProps<RouteParams>> = (props) => {
    const { id: idpId = "" } = props.match.params || {};
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
    }, [location, autoRunTriggered]);


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
                `${resourceEndpoints.debugResult}/${sid}`,
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
        console.log("[ConnectionTest] Starting rerun test for idpId:", idpId);

        if (!idpId) {
            setError("Connection ID is missing. Cannot run test.");
            return;
        }

        try {
            const axios = (await import("axios")).default;
            const payload = {
                resourceId: idpId,
                resourceType: "IDP",
                properties: {}
            };

            // eslint-disable-next-line no-console
            console.log("[ConnectionTest] Posting debug request with payload:", payload);

            const response = await axios.post(
                resourceEndpoints.debug,
                payload,
                { withCredentials: true }
            );

            const newDebugId = response.data.result.debugId;
            const authorizationUrl = response.data.result.authorizationUrl;

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
        if (result && result.metadata) {
            const metadata = result.metadata;
            
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
        // Extract tenant domain from current path
        const pathParts = location.pathname.split("/");
        const tenantIndex = pathParts.indexOf("t");
        const tenantDomain = tenantIndex !== -1 ? pathParts[tenantIndex + 1] : "carbon.super";
        
        // Navigate to the specific connection page
        history.push(`/t/${tenantDomain}/console/connections/${idpId}`);
    };

    // State for connector details - removed as we no longer display connector info on this page
    const testId = "idp-test-connection";

    /**
     * Renders the results tabs when test results are available.
     */
    const renderResultsTabs = () => {
        const tabPanes = [
            {
                menuItem: "ID Token",
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
                            <div>
                                {decoded ? (
                                    <div>
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
                                    <div style={{ color: '#888' }}>
                                        <em>Unable to decode token or not a valid JWT.</em>
                                    </div>
                                )}
                                <Header as="h4" style={{ marginBottom: 8, marginTop: 24 }}>External Redirect URL</Header>
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
                                <div style={{ overflowX: 'auto' }}>
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
            isLoading={loading}
            pageTitle="Test Results"
            title="Test Results"
            description="Results for the connection test session."
            backButton={{
                "data-testid": `${testId}-back-button`,
                onClick: handleBackButtonClick,
                text: t("console:develop.pages.idpTest.backButton", "Go back to Connection")
            }}
            action={
                <PrimaryButton
                    onClick={handleRunTests}
                    loading={loading}
                    disabled={loading}
                    data-testid="idp-test-result-rerun-button"
                >
                    <Icon name="redo" />
                    Rerun Test
                </PrimaryButton>
            }
            titleTextAlign="left"
            contentTopMargin={true}
            bottomMargin={false}
            data-testid={`${testId}-page-layout`}
        >
            {/* Test Status Banner */}
            {result && !error && (
                <Segment
                    basic
                    className="bordered emphasized"
                    style={{ 
                        marginTop: "2rem",
                        padding: "16px 20px",
                        background: hasError ? '#fff5f5' : '#f0fff4',
                        borderLeft: hasError ? '4px solid #db2828' : '4px solid #21ba45'
                    }}
                    data-testid="test-status-banner"
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Icon 
                            name={hasError ? 'times circle' : 'check circle'} 
                            size="large"
                            style={{ 
                                color: hasError ? '#db2828' : '#21ba45',
                                margin: 0 
                            }}
                        />
                        <div>
                            <Header as="h3" style={{ margin: '0 0 2px 0', color: hasError ? '#db2828' : '#21ba45' }}>
                                {hasError ? 'Test Failed' : 'Test Passed'}
                            </Header>
                            <p style={{ margin: 0, color: '#666', fontSize: 14 }}>
                                {hasError 
                                    ? 'Some steps failed during the connection test. Check the Logs tab for details.' 
                                    : 'All connection test steps completed successfully.'}
                            </p>
                        </div>
                    </div>
                </Segment>
            )}

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

                    {!error && !result && (debugId || loading) && (
                        <Segment
                            basic
                            padded="very"
                            className="bordered emphasized"
                            style={{ marginTop: "2rem" }}
                            data-testid="idp-test-result-loading"
                        >
                            <div style={{ marginBottom: 16 }}>
                                <Icon name="spinner" loading color="blue" />
                                <span style={{ marginLeft: 8, color: '#666' }}>
                                    {loading ? 'Loading test results...' : 'Waiting for authentication to complete...'}
                                </span>
                            </div>
                            
                            {/* Skeleton Loader */}
                            <Placeholder fluid>
                                <Placeholder.Header>
                                    <Placeholder.Line />
                                </Placeholder.Header>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Paragraph>
                            </Placeholder>
                        </Segment>
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
