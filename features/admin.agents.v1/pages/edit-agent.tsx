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

import { FeatureAccessConfigInterface } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    AnimatedAvatar, AppAvatar, ResourceTab, ResourceTabPaneInterface, TabPageLayout
} from "@wso2is/react-components";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import AgentCredentials from "../components/edit/agent-credentials";
import AgentGroups from "../components/edit/agent-groups";
import AgentOverview from "../components/edit/agent-overview";
import AgentRoles from "../components/edit/agent-roles";
import useGetAgent from "../hooks/use-get-agent";
import { AGENT_FEATURE_DICTIONARY } from "../constants/agents";

interface EditAgentPageProps extends IdentifiableComponentInterface {}

export default function EditAgent({
    [ "data-componentid" ]: componentId
}: EditAgentPageProps) {

    const [ agentId, setAgentId ] = useState<string>();

    const agentFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.agents);

    console.log(agentFeatureConfig)

    /**
     * Fetch the agent details on initial component load.
     */
    useEffect(() => {
        const path: string[] = history?.location?.pathname?.split("/");
        // Get the agent ID from the URL. Remove the hash if it's present.
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
    const renderedTabPanes: ResourceTabPaneInterface[] = useMemo(() => {
        const tabPanes: ResourceTabPaneInterface[] = [
            {
                componentId: "general",
                menuItem: "General",
                render: () => (
                    <ResourceTab.Pane
                        data-componentid="agent-overview"
                        attached={ false }
                        className="overview-tab-pane"
                    >
                        <AgentOverview agentId={ agentId } />
                    </ResourceTab.Pane>
                )
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


    const handleBackButtonClick = () => {
        history.push(AppConstants.getPaths().get("AGENTS"));
    };

    return (
        <TabPageLayout
            pageTitle="Edit agent"
            title={ agentInfo?.name?.givenName }
            description={ (<>
                <strong>Created by: </strong>admin@guardio.com
            </>) }
            isLoading={ isAgentInfoLoading }
            backButton={ {
                "data-testid": `${componentId}-back-button`,
                onClick: handleBackButtonClick,
                text: "Go back to Agents"
            } }
            image={ agentInfo?.logo
                ? (
                    <AppAvatar
                        name={ agentInfo?.name?.givenName }
                        image={ agentInfo?.logo }
                        size="tiny"
                    />
                )
                : (
                    <AnimatedAvatar
                        name={ agentInfo?.name?.givenName }
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
