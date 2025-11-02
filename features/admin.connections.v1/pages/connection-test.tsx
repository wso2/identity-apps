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
import React, { useState, useRef, Fragment } from "react";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router-dom";
import { Header, Icon, List, Segment } from "semantic-ui-react";
import { ConnectionsManagementUtils } from "@wso2is/admin.connections.v1/utils/connection-utils";
import { AuthenticatorMeta } from "../meta/authenticator-meta";
import { getConnectionDetails } from "../api/connections";

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

    /**
     * Handles the "Run Tests" button click event.
     * Executes GET request to test connection.
     */
    const handleRunTests = async (): Promise<void> => {
        setConnectionStatus("pending");
        setAuthStatus("pending");
        setClaimsStatus("pending");

        try {
            // Dynamically import axios if not already imported
            const axios = (await import("axios")).default;
            // const response = await axios.post(
            //     `/api/server/v1/debug/connection/${idpId}`,
            //     { baseURL: window.location.origin }
            // );
            const response = await axios.post(
                `https://localhost:9443/api/server/v1/debug/connection/${idpId}`,
                {},
                { withCredentials: true }
            );
            // Adjust response parsing as per actual API response
            // Save sessionId and idpId for later API calls
            const sessionId = response.data.sessionId;
            window.sessionStorage.setItem("idpDebugSessionId", sessionId);
            window.sessionStorage.setItem("idpDebugIdpId", idpId);
            window.sessionStorage.setItem("idpDebugTenantDomain", tenantDomain);

            // Open authorizationUrl in a new tab if present
            if (response.data.authorizationUrl) {
                const authPopup = window.open(response.data.authorizationUrl, "_blank");
                
                // Monitor the popup and redirect when it closes (auth complete)
                // This is the fallback if the backend doesn't redirect to debugSuccess.jsp
                const checkPopupClosed = setInterval(() => {
                    try {
                        if (authPopup && authPopup.closed) {
                            clearInterval(checkPopupClosed);
                            const resultsUrl = `/t/${tenantDomain}/console/connections/${idpId}/debug-results#status=successful&sessionId=${encodeURIComponent(sessionId)}`; 
                            history.push(resultsUrl);
                        }
                    } catch (e) {
                    }
                }, 500);

                // Also set a timeout to navigate after 30 seconds in case popup.closed detection doesn't work
                setTimeout(() => {
                    clearInterval(checkPopupClosed);
                    const resultsUrl = `/t/${tenantDomain}/console/connections/${idpId}/debug-results#status=successful&sessionId=${encodeURIComponent(sessionId)}`;
                    history.push(resultsUrl);
                }, 30000);
            }

            // Optionally update statuses based on response.status
            if (response.data.status === "URL_GENERATED") {
                setConnectionStatus("success");
            } else {
                setConnectionStatus("error");
            }
            // You may want to update authStatus/claimsStatus based on further API calls
        } catch (error) {
            setConnectionStatus("error");
            setAuthStatus("error");
            setClaimsStatus("error");
        }
    };

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {
    // Navigate to the specific connection page
    history.push(`/t/${tenantDomain}/console/connections/${idpId}`);
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

    return (
        <TabPageLayout
            isLoading={isConnectorDetailsFetchRequestLoading}
            pageTitle="Test Connection"
            title={ "Test " + resolveConnectorName(connector) }
            description={ resolveConnectorDescription(connector) }
            image={ resolveConnectorImage(connector) }
            backButton={{
                "data-testid": `${testId}-back-button`,
                onClick: handleBackButtonClick,
                text: t("console:develop.pages.idpTest.backButton", "Go back to Connection")
            }}
            titleTextAlign="left"
            contentTopMargin={ true }
            bottomMargin={ false }
            data-testid={ `${testId}-page-layout` }
        >
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
            <Segment
                basic
                padded="very"
                className="bordered emphasized"
                style={{ marginTop: "3rem" }}
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
        </TabPageLayout>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ConnectionTestPage;
