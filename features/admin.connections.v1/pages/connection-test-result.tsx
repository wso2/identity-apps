/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
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
 * Debug Result page for Identity Provider connection tests.
 */

import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { TabPageLayout, PrimaryButton } from "@wso2is/react-components";
import { Icon, Segment, Header, List, Tab } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import { history } from "@wso2is/admin.core.v1/helpers/history";

interface RouteParams {
    tenantDomain?: string;
    idpId?: string;
}

type TestStatus = "idle" | "pending" | "success" | "error";

const DebugResultPage: React.FC<RouteComponentProps<RouteParams>> = (props) => {
    const { tenantDomain = "", idpId = "" } = props.match.params || {};
    const { t } = useTranslation();

    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);
    const [ result, setResult ] = useState<any>(null);
    const [ sessionId, setSessionId ] = useState<string | null>(() => {
        try {
            return window.sessionStorage.getItem("idpDebugSessionId");
        } catch (e) {
            return null;
        }
    });
    const [ connectionStatus, setConnectionStatus ] = useState<TestStatus>("idle");
    const [ authStatus, setAuthStatus ] = useState<TestStatus>("idle");
    const [ claimsStatus, setClaimsStatus ] = useState<TestStatus>("idle");
    const [ activeTab, setActiveTab ] = useState(0);

    // Try to resolve a session id from multiple places (sessionStorage, URL, opener)
    useEffect(() => {
        if (sessionId) {
            return;
        }

        // 1. Try URL query params / hash
        try {
            const urlSearch = new URLSearchParams(window.location.search);
            const s1 = urlSearch.get("sessionId") || urlSearch.get("sessionid") || urlSearch.get("sid");
            if (s1) {
                setSessionId(s1);
                return;
            }

            // Check hash fragment (e.g., #sessionId=...)
            if (window.location.hash) {
                const hash = window.location.hash.replace(/^#/, "");
                const hashParams = new URLSearchParams(hash);
                const s2 = hashParams.get("sessionId") || hashParams.get("sessionid") || hashParams.get("sid");
                if (s2) {
                    setSessionId(s2);
                    return;
                }
            }
        } catch (e) {
            // ignore
        }

        // 2. Try opener's sessionStorage if accessible (popup flow)
        try {
            if (window.opener && !window.opener.closed) {
                try {
                    const openerSessionId = window.opener.sessionStorage.getItem("idpDebugSessionId");
                    if (openerSessionId) {
                        setSessionId(openerSessionId);
                        return;
                    }
                } catch (e) {
                    // cross-origin or inaccessible
                }
            }
        } catch (e) {
            // ignore
        }

        // leave sessionId null if not found
    }, [sessionId]);

    // Update test statuses based on result metadata
    useEffect(() => {
        if (result && result.metadata) {
            const metadata = result.metadata;
            setConnectionStatus(metadata.step_connection_status === "success" ? "success" : metadata.step_connection_status === "pending" ? "pending" : "error");
            setAuthStatus(metadata.step_authentication_status === "success" ? "success" : metadata.step_authentication_status === "pending" ? "pending" : "error");
            setClaimsStatus(metadata.step_claim_mapping_status === "success" ? "success" : metadata.step_claim_mapping_status === "pending" ? "pending" : "error");
        }
    }, [result]);

    const fetchResult = async (sid?: string) => {
        const effectiveSid = sid || sessionId;
        if (!effectiveSid) {
            setError("No debug session id found. Please run the connection test first.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const axios = (await import("axios")).default;
            const response = await axios.get(
                `https://localhost:9443/api/server/v1/debug/result/${effectiveSid}`,
                { withCredentials: true }
            );
            setResult(response.data);
            // eslint-disable-next-line no-console
            console.log("[DebugResult] Successfully fetched results:", response.data);
        } catch (err: any) {
            // eslint-disable-next-line no-console
            console.error("[DebugResult] Fetch error:", err?.response?.status, err?.message);
            
            // If 404, backend might still be processing - show a helpful message
            if (err?.response?.status === 404) {
                setError("Debug results not yet available. The backend may still be processing the authentication flow. Try refreshing in a few seconds.");
            } else {
                setError(err?.response?.data?.message || err?.message || t("console:develop.pages.idpTestResult.fetchError", "Failed to fetch debug results."));
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Auto-fetch when we have a session id
        if (sessionId) {
            fetchResult(sessionId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId]);

    const renderStatusIcon = (status: TestStatus) => {
        switch (status) {
            case "pending":
                return <Icon name="spinner" loading color="blue" data-testid="test-status-pending" />;
            case "success":
                return <Icon name="check circle" color="green" data-testid="test-status-success" />;
            case "error":
                return <Icon name="times circle" color="red" data-testid="test-status-error" />;
            case "idle":
            default:
                return <Icon name="clock outline" color="grey" data-testid="test-status-idle" />;
        }
    };

    const handleBack = (): void => {
        history.push(`/t/${tenantDomain}/console/connections/${idpId}`);
    };

    const tabPanes = [
        {
            menuItem: "General Info",
            render: () => (
                <Tab.Pane>
                    <pre data-testid="idp-test-result-general-info" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        {JSON.stringify({
                            sessionId: result?.sessionId,
                            idpName: result?.idpName,
                            authenticator: result?.authenticator,
                            username: result?.username,
                            userId: result?.userId,
                            success: result?.success,
                            error: result?.error,
                            timestamp: result?.timestamp
                        }, null, 2)}
                    </pre>
                </Tab.Pane>
            )
        },
        {
            menuItem: "Claims Mapping",
            render: () => (
                <Tab.Pane>
                    <div>
                        <Header as="h4">Incoming Claims</Header>
                        <pre data-testid="idp-test-result-incoming-claims" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            {JSON.stringify(result?.incomingClaims, null, 2)}
                        </pre>
                        <Header as="h4">Mapped Claims</Header>
                        <pre data-testid="idp-test-result-mapped-claims" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            {JSON.stringify(result?.mappedClaims, null, 2)}
                        </pre>
                        <Header as="h4">User Attributes</Header>
                        <pre data-testid="idp-test-result-user-attributes" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            {JSON.stringify(result?.userAttributes, null, 2)}
                        </pre>
                    </div>
                </Tab.Pane>
            )
        },
        {
            menuItem: "Logs",
            render: () => (
                <Tab.Pane>
                    <pre data-testid="idp-test-result-logs" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </Tab.Pane>
            )
        }
    ];

    return (
        <TabPageLayout
            isLoading={ loading }
            pageTitle={ t("console:develop.pages.idpTestResult.pageTitle", "Test Results") }
            title={ t("console:develop.pages.idpTestResult.title", "Test Results") }
            description={ t("console:develop.pages.idpTestResult.description", "Results for the connection test session.") }
            backButton={{
                onClick: handleBack,
                "data-testid": "idp-test-result-back-button",
                text: t("console:develop.pages.idpTest.backButton", "Go back to Connection")
            }}
        >
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
                    { t("console:develop.pages.idpTest.statusHeader", "Test Status") }
                </Header>
                <List divided relaxed verticalAlign="middle" data-testid="test-status-list">
                    <List.Item>
                        <List.Content floated="right">
                            { renderStatusIcon(connectionStatus) }
                        </List.Content>
                        <List.Content>
                            <List.Header>
                                { t("console:develop.pages.idpTest.connectionCreation", "Connection Creation") }
                            </List.Header>
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content floated="right">
                            { renderStatusIcon(authStatus) }
                        </List.Content>
                        <List.Content>
                            <List.Header>
                                { t("console:develop.pages.idpTest.authentication", "Authentication") }
                            </List.Header>
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content floated="right">
                            { renderStatusIcon(claimsStatus) }
                        </List.Content>
                        <List.Content>
                            <List.Header>
                                { t("console:develop.pages.idpTest.claimsMapping", "Claims Mapping") }
                            </List.Header>
                        </List.Content>
                    </List.Item>
                </List>
            </Segment>

            {/* Results Section */}
            { error && (
                <Segment
                    basic
                    padded="very"
                    className="bordered emphasized"
                    style={{ marginTop: "2rem", color: "red" }}
                    data-testid="idp-test-result-error"
                >
                    { error }
                    <div style={{ marginTop: 12 }}>
                        <PrimaryButton onClick={ () => fetchResult() } data-testid="idp-test-result-retry">
                            { t("console:develop.pages.idpTestResult.retry", "Retry") }
                        </PrimaryButton>
                    </div>
                </Segment>
            ) }

            { !error && !sessionId && !loading && (
                <Segment
                    basic
                    padded="very"
                    className="bordered emphasized"
                    style={{ marginTop: "2rem" }}
                    data-testid="idp-test-result-no-session"
                >
                    { t(
                        "console:develop.pages.idpTestResult.noSession",
                        "No debug session found. This page is usually opened after running the connection test."
                    ) }
                </Segment>
            ) }

            { !error && result && (
                <Segment
                    basic
                    padded="very"
                    className="bordered emphasized"
                    style={{ marginTop: "2rem" }}
                    data-testid="idp-test-result-tabs"
                >
                    <Tab panes={ tabPanes } activeIndex={ activeTab } onTabChange={ (e, data) => setActiveTab(data.activeIndex as number) } />
                </Segment>
            ) }

            { !error && !result && sessionId && !loading && (
                <Segment
                    basic
                    padded="very"
                    className="bordered emphasized"
                    style={{ marginTop: "2rem" }}
                    data-testid="idp-test-result-empty"
                >
                    { t("console:develop.pages.idpTestResult.noResult", "No results available.") }
                    <div style={{ marginTop: 12 }}>
                        <PrimaryButton onClick={ () => fetchResult() } data-testid="idp-test-result-refresh">
                            { t("console:develop.pages.idpTestResult.refresh", "Refresh") }
                        </PrimaryButton>
                    </div>
                </Segment>
            ) }
        </TabPageLayout>
    );
};

export default DebugResultPage;
