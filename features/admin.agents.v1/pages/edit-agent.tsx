/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    AnimatedAvatar, AppAvatar, ResourceTab, ResourceTabPaneInterface, TabPageLayout
} from "@wso2is/react-components";
import React, { useEffect, useState } from "react";
import AgentConnectedApps from "../components/edit/agent-connected-apps";
import AgentCredentials from "../components/edit/agent-credentials";
import AgentGroups from "../components/edit/agent-groups";
import AgentIntegrations from "../components/edit/agent-integrations";
import AgentOverview from "../components/edit/agent-overview";
import AgentRoles from "../components/edit/agent-roles";
import useGetAgent from "../hooks/use-get-agent";
import AgentLogs from "../components/edit/agent-logs";

interface EditAgentPageProps extends IdentifiableComponentInterface {

}

export default function EditAgent({
    [ "data-componentid" ]: componentId
}: EditAgentPageProps) {

    const [ agentId, setAgentId ] = useState<string>();

    /**
     * Fetch the application details on initial component load.
     */
    useEffect(() => {
        const path: string[] = history?.location?.pathname?.split("/");
        // Get the application ID from the URL. Remove the hash if it's present.
        const id: string = path[ path?.length - 1 ]?.split("#")[ 0 ];

        setAgentId(id);
    }, []);

    const {
        data: agentInfo,
        isLoading: isAgentInfoLoading
    } = useGetAgent(agentId);

    /**
     * The list of tab panes rendered in the final render.
     */
    const renderedTabPanes: ResourceTabPaneInterface[] = [
        {
            componentId: "general",
            menuItem: "General",
            render: () => (<ResourceTab.Pane>
                <AgentOverview agentId={ agentId } />
            </ResourceTab.Pane>)
        },
        {
            componentId: "credentials",
            menuItem: "Credentials",
            render: () => (
                <ResourceTab.Pane>
                    <AgentCredentials agentId={ agentId } data-componentid="agent-credentials" />
                </ResourceTab.Pane>
            )
        },
        {
            componentId: "api-resources",
            menuItem: "API Resources",
            render: () =>  <ResourceTab.Pane><AgentConnectedApps /></ResourceTab.Pane>
        },
        {
            componentId: "connections",
            menuItem: "Connections",
            render: () =>  <ResourceTab.Pane><AgentIntegrations /></ResourceTab.Pane>
        },
        {
            componentId: "roles",
            menuItem: "Roles",
            render: () =>  <ResourceTab.Pane><AgentRoles /></ResourceTab.Pane>
        },
        {
            componentId: "groups",
            menuItem: "Groups",
            render: () =>  <ResourceTab.Pane><AgentGroups /></ResourceTab.Pane>
        },
        {
            componentId: "logs",
            menuItem: "Audit Logs",
            render: () => <AgentLogs />
        }
    ];

    const handleBackButtonClick = () => {
        history.push(AppConstants.getPaths().get("AGENTS"));
    };

    return (
        <TabPageLayout
            pageTitle="Edit agent"
            title={ agentInfo?.name }
            description={ agentInfo?.id }
            isLoading={ isAgentInfoLoading }
            backButton={ {
                "data-testid": `${componentId}-back-button`,
                onClick: handleBackButtonClick,
                text: "Go back to Agents"
            } }
            image={ agentInfo?.logo
                ? (
                    <AppAvatar
                        name={ agentInfo?.name }
                        image={ agentInfo?.logo }
                        size="tiny"
                    />
                )
                : (
                    <AnimatedAvatar
                        name={ agentInfo?.name }
                        size="tiny"
                        floated="left"
                    />
                )
            }
        >

            <ResourceTab
                panes={ renderedTabPanes }
            >

            </ResourceTab>
        </TabPageLayout>

    );
}
