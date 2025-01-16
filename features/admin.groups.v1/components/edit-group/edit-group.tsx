/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { AppState } from "@wso2is/admin.core.v1/store";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { ResourceTab, ResourceTabPaneInterface } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// TODO: Move to shared components.
import { useSelector } from "react-redux";
import { TabProps } from "semantic-ui-react";
import { BasicGroupDetails } from "./edit-group-basic";
import { EditGroupRoles } from "./edit-group-roles";
import { GroupUsersList } from "./edit-group-users";
import { GroupConstants } from "../../constants";
import useGroupManagement from "../../hooks/use-group-management";
import { GroupsInterface } from "../../models";

/**
 * Captures props needed for edit group component
 */
interface EditGroupProps {
    /**
     * Group ID
     */
    groupId: string;
    /**
     * Group details
     */
    group: GroupsInterface;
    /**
     * Is the data still loading.
     */
    isLoading?: boolean;
    /**
     * Handle group update callback.
     */
    onGroupUpdate: () => void;
    /**
     * List of readOnly user stores.
     */
    readOnlyUserStores?: string[];
}

/**
 * Component which will allow editing of a selected group.
 *
 * @param props - contains group details to be edited.
 */
export const EditGroup: FunctionComponent<EditGroupProps> = (props: EditGroupProps): ReactElement => {

    const {
        groupId,
        group,
        isLoading,
        onGroupUpdate,
        readOnlyUserStores
    } = props;

    const { t } = useTranslation();
    const { activeTab, updateActiveTab } = useGroupManagement();

    const groupsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features.groups);

    const hasGroupsUpdatePermissions: boolean = useRequiredScopes(groupsFeatureConfig?.scopes?.update);

    const [ isReadOnly, setReadOnly ] = useState<boolean>(false);

    useEffect(() => {
        if(!group) {
            return;
        }

        const userStore: string[] = group?.displayName.split("/");

        if (!isFeatureEnabled(groupsFeatureConfig, GroupConstants.FEATURE_DICTIONARY.get("GROUP_UPDATE"))
            || readOnlyUserStores?.includes(userStore?.toString())
            || !hasGroupsUpdatePermissions
        ) {
            setReadOnly(true);
        }
    }, [ group, readOnlyUserStores ]);

    const resolveResourcePanes = () => {
        const panes: ResourceTabPaneInterface[] = [
            {
                menuItem: t("roles:edit.menuItems.basic"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <BasicGroupDetails
                            data-testid="group-mgt-edit-group-basic"
                            groupId={ groupId }
                            isGroup={ true }
                            groupObject={ group }
                            onGroupUpdate={ onGroupUpdate }
                            isReadOnly={ isReadOnly }
                        />
                    </ResourceTab.Pane>
                )
            },{
                menuItem: t("roles:edit.menuItems.users"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <GroupUsersList
                            data-testid="group-mgt-edit-group-users"
                            isGroup={ true }
                            group={ group }
                            onGroupUpdate={ onGroupUpdate }
                            isReadOnly={ isReadOnly }
                        />
                    </ResourceTab.Pane>
                )
            },
            {
                menuItem: t("roles:edit.menuItems.roles"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <EditGroupRoles group={ group } />
                    </ResourceTab.Pane>
                )
            }
        ];

        return panes;
    };

    return (
        <ResourceTab
            activeIndex={ activeTab }
            isLoading={ isLoading }
            onTabChange={ (event: React.MouseEvent<HTMLDivElement>, data: TabProps) => {
                updateActiveTab(data.activeIndex as number);
            } }
            panes={ resolveResourcePanes() }
        />
    );
};
