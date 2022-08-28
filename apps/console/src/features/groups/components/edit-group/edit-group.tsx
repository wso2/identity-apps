/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { SBACInterface } from "@wso2is/core/models";
import { ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
// TODO: Move to shared components.
import { useSelector } from "react-redux";
import { BasicGroupDetails } from "./edit-group-basic";
import { GroupRolesList } from "./edit-group-roles";
import { GroupUsersList } from "./edit-group-users";
import { FeatureConfigInterface } from "../../../core/models";
import { AppState } from "../../../core/store";
import { OrganizationUtils } from "../../../organizations/utils";
import { getUsersList } from "../../../users/api";
import { UserBasicInterface } from "../../../users/models";
import { GroupConstants } from "../../constants";
import { GroupsInterface } from "../../models";

/**
 * Captures props needed for edit group component
 */
interface EditGroupProps extends SBACInterface<FeatureConfigInterface> {
    /**
     * Group ID
     */
    groupId: string;
    /**
     * Group details
     */
    group: GroupsInterface;
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
 * @param props contains group details to be edited.
 */
export const EditGroup: FunctionComponent<EditGroupProps> = (props: EditGroupProps): ReactElement => {

    const {
        groupId,
        group,
        onGroupUpdate,
        featureConfig,
        readOnlyUserStores
    } = props;

    const { t } = useTranslation();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ isUsersFetchRequestLoading, setIsUsersFetchRequestLoading ] = useState<boolean>(true);
    const [ usersList, setUsersList ] = useState<UserBasicInterface[]>([]);
    const [ selectedUsersList, setSelectedUsersList ] = useState<UserBasicInterface[]>([]);
    const [ isReadOnly, setReadOnly ] = useState<boolean>(false);

    const currentOrganization = useSelector((state: AppState) => state.organization.organization);
    const isRootOrganization = useMemo(() =>
        OrganizationUtils.isRootOrganization(currentOrganization), [ currentOrganization ]);

    useEffect(() => {

        getUserList();
    }, [ group ]);

    useEffect(() => {
        if(!group) {
            return;
        }

        const userStore = group?.displayName.split("/");

        if (!isFeatureEnabled(featureConfig?.groups, GroupConstants.FEATURE_DICTIONARY.get("GROUP_UPDATE"))
            || readOnlyUserStores?.includes(userStore?.toString())
            || !hasRequiredScopes(featureConfig?.groups, featureConfig?.groups?.scopes?.update, allowedScopes)
        ) {
            setReadOnly(true);
        }
    }, [ group, readOnlyUserStores ]);

    /**
     * Get the users list.
     */
    const getUserList = (): void => {

        const userstore: string = group?.displayName?.indexOf("/") === -1
            ? "primary"
            : group?.displayName?.split("/")[ 0 ];

        setIsUsersFetchRequestLoading(true);

        getUsersList(null, null, null, null, userstore)
            .then((response) => {
                setUsersList(response.Resources);
                setSelectedUsersList(filterUsersList([ ...response.Resources ]));
            })
            .finally(() => {
                setIsUsersFetchRequestLoading(false);
            });
    };

    /**
     * Filter out the members of the group.
     *
     * @param {[]} usersToFilter - Original users list.
     * @return {UserBasicInterface[]}
     */
    const filterUsersList = (usersToFilter: UserBasicInterface[]): UserBasicInterface[] => {

        if (!group?.members || !Array.isArray(group.members) || group.members.length < 1) {
            return;
        }

        const selectedUserList: UserBasicInterface[] = [];

        usersToFilter
            .slice()
            .reverse()
            .forEach((user: UserBasicInterface) => {
                group.members.forEach(assignedUser => {
                    if (user.id === assignedUser.value) {
                        selectedUserList.push(user);
                        usersToFilter.splice(usersToFilter.indexOf(user), 1);
                    }
                });
            });

        selectedUserList.sort((userObject, comparedUserObject) =>
            userObject.name?.givenName?.localeCompare(comparedUserObject.name?.givenName)
        );

        return selectedUserList;
    };

    const resolveResourcePanes = () => {
        const panes = [
            {
                menuItem: t("console:manage.features.roles.edit.menuItems.basic"),
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
                menuItem: t("console:manage.features.roles.edit.menuItems.users"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false } loading={ isUsersFetchRequestLoading }>
                        <GroupUsersList
                            data-testid="group-mgt-edit-group-users"
                            isGroup={ true }
                            group={ group }
                            users={ usersList }
                            selectedUsers={ selectedUsersList }
                            isLoading={ isUsersFetchRequestLoading }
                            onGroupUpdate={ onGroupUpdate }
                            isReadOnly={ isReadOnly }
                        />
                    </ResourceTab.Pane>
                )
            },
            // ToDo - Enabled only for root organizations as BE doesn't have full SCIM support for organizations yet
            isRootOrganization ? {
                menuItem: t("console:manage.features.roles.edit.menuItems.roles"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <GroupRolesList
                            data-testid="group-mgt-edit-group-roles"
                            group={ group }
                            onGroupUpdate={ onGroupUpdate }
                            isReadOnly={ isReadOnly }
                        />
                    </ResourceTab.Pane>
                )
            } : null
        ];

        return panes;
    };

    return (
        <ResourceTab panes={ resolveResourcePanes() } />
    );
};
