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

import Typography from "@oxygen-ui/react/Typography";
import { FeatureAccessConfigInterface } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { getUserDetails } from "@wso2is/admin.users.v1/api/users";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    AnimatedAvatar, ResourceTab, ResourceTabPaneInterface, TabPageLayout
} from "@wso2is/react-components";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import AgentCredentials from "../components/edit/agent-credentials";
import AgentGroups from "../components/edit/agent-groups";
import AgentOverview from "../components/edit/agent-overview";
import AgentRoles from "../components/edit/agent-roles";
import { AGENT_FEATURE_DICTIONARY } from "../constants/agents";
import useGetAgent from "../hooks/use-get-agent";

type EditAgentPageProps = IdentifiableComponentInterface;

export default function EditAgent({
    [ "data-componentid" ]: componentId = "edit-agent"
}: EditAgentPageProps) {

    const agentId: string = useMemo(() => {
        const path: string[] = history?.location?.pathname?.split("/");
        // Get the agent ID from the URL. Remove the hash if it's present.
        const id: string = path[ path?.length - 1 ]?.split("#")[ 0 ];

        return id;
    }, [ history ]);

    const agentFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.agents);

    const {
        data: agentInfo,
        isLoading: isAgentInfoLoading
    } = useGetAgent(agentId);

    /**
     * The list of tab panes rendered in the final render.
     */
    const renderedTabPanes: ResourceTabPaneInterface[] = useMemo(() => {
        const tabPanes: ResourceTabPaneInterface[] = [
            {
                componentId: "general",
                menuItem: "General",
                render: () => <AgentOverview agentId={ agentId } />
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
                componentId: "roles",
                menuItem: "Roles",
                render: () =>  <ResourceTab.Pane><AgentRoles agentId={ agentId }/></ResourceTab.Pane>
            }
        ];

        if (isFeatureEnabled(agentFeatureConfig, AGENT_FEATURE_DICTIONARY.get("AGENT_GROUPS"))) {

            tabPanes.splice(2, 0, {
                componentId: "groups",
                menuItem: "Groups",
                render: () =>  <AgentGroups agentId={ agentId } />
            });
        }

        return tabPanes;

    }, [ agentFeatureConfig ]);

    const [ agentOwnerDisplayName, setAgentOwnerDisplayName ] = useState<string>("");

    useEffect(() => {
        const fetchOwnerDisplayName = async () => {
            const [ agentOwnerUserId ] = agentInfo["urn:scim:wso2:agent:schema"]?.Owner?.split("@") || [];

            if (!agentOwnerUserId) {
                setAgentOwnerDisplayName("");

                return;
            }

            try {
                const userInfo: any = await getUserDetails(agentOwnerUserId, "userName");

                setAgentOwnerDisplayName(userInfo?.userName);
            } catch (_err) {
                // Safely ignore the error
            }
        };

        if (!agentOwnerDisplayName && agentInfo?.["urn:scim:wso2:agent:schema"]?.Owner) {
            fetchOwnerDisplayName();
        }
    }, [ agentInfo ]);

    const handleBackButtonClick = () => {
        history.push(AppConstants.getPaths().get("AGENTS"));
    };

    return (
        <TabPageLayout
            pageTitle="Edit agent"
            title={ agentInfo?.["urn:scim:wso2:agent:schema"]?.DisplayName ?? agentInfo?.id }
            description={ (<>
                <Typography variant="body1">{
                    agentInfo?.["urn:scim:wso2:agent:schema"]?.DisplayName && agentInfo?.id
                }</Typography>
                { agentOwnerDisplayName && (
                    <Typography variant="body1">Created by <strong>{ agentOwnerDisplayName }</strong></Typography>
                ) }

            </>) }
            isLoading={ isAgentInfoLoading }
            backButton={ {
                "data-testid": `${componentId}-back-button`,
                onClick: handleBackButtonClick,
                text: "Go back to Agents"
            } }
            image={ (
                <AnimatedAvatar
                    name={ agentInfo?.["urn:scim:wso2:agent:schema"]?.DisplayName ?? "Agent" }
                    size="tiny"
                    floated="left"
                />
            ) }
            bottomMargin={ false }
            data-componentid={ componentId + "-page-layout" }
        >
            <ResourceTab panes={ renderedTabPanes } data-componentid={ componentId + "-tab-pane" }/>
        </TabPageLayout>

    );
}
