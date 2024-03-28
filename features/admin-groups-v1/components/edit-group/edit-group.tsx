/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com).
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

import useUIConfig from "@wso2is/common/src/hooks/use-ui-configs";
import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, FeatureAccessConfigInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ResourceTab, ResourceTabPaneInterface } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
// TODO: Move to shared components.
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { TabProps } from "semantic-ui-react";
import { BasicGroupDetails } from "./edit-group-basic";
import { EditGroupRoles } from "./edit-group-roles";
import { GroupRolesV1List } from "./edit-group-roles-v1";
import { GroupUsersList } from "./edit-group-users";
import { FeatureConfigInterface } from "../../../admin-core-v1/models";
import { AppState } from "../../../admin-core-v1/store";
import { getUsersList } from "../../../admin-users-v1/api";
import { UserManagementConstants } from "../../../admin-users-v1/constants";
import { UserBasicInterface, UserListInterface } from "../../../admin-users-v1/models";
import { GroupConstants } from "../../constants";
import useGroupManagement from "../../hooks/use-group-management";
import { GroupsInterface, GroupsMemberInterface } from "../../models";

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
        featureConfig,
        readOnlyUserStores
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { UIConfig } = useUIConfig();

    const { activeTab, updateActiveTab } = useGroupManagement();

    const usersFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.users);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const roleV1Enabled: boolean = UIConfig?.legacyMode?.rolesV1;

    const [ isUsersFetchRequestLoading, setIsUsersFetchRequestLoading ] = useState<boolean>(true);
    const [ usersList, setUsersList ] = useState<UserBasicInterface[]>([]);
    const [ selectedUsersList, setSelectedUsersList ] = useState<UserBasicInterface[]>([]);
    const [ isReadOnly, setReadOnly ] = useState<boolean>(false);

    const isUserReadOnly: boolean = useMemo(() => {
        return !isFeatureEnabled(usersFeatureConfig,
            UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE")) ||
            !hasRequiredScopes(usersFeatureConfig,
                usersFeatureConfig?.scopes?.update, allowedScopes);
    }, [ usersFeatureConfig, allowedScopes ]);

    useEffect(() => {

        getUserList();
    }, [ group ]);

    useEffect(() => {
        if(!group) {
            return;
        }

        const userStore: string[] = group?.displayName.split("/");

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
            .then((response: UserListInterface) => {
                setUsersList(response.Resources);
                setSelectedUsersList(filterUsersList([ ...response.Resources ]));
            })
            .catch((error: AxiosError) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ?? error?.response?.data?.detail
                        ?? t("users:notifications.fetchUsers.error.description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message
                        ?? t("users:notifications.fetchUsers.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("users:notifications.fetchUsers.genericError." +
                    "description"),
                    level: AlertLevels.ERROR,
                    message: t("users:notifications.fetchUsers.genericError.message")
                }));

            })
            .finally(() => {
                setIsUsersFetchRequestLoading(false);
            });
    };

    /**
     * Filter out the members of the group.
     *
     * @param usersToFilter - Original users list.
     * @returns Filtered user list.
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
                group.members.forEach((assignedUser: GroupsMemberInterface) => {
                    if (user.id === assignedUser.value) {
                        selectedUserList.push(user);
                        usersToFilter.splice(usersToFilter.indexOf(user), 1);
                    }
                });
            });

        selectedUserList.sort((userObject: UserBasicInterface, comparedUserObject: UserBasicInterface) =>
            userObject.name?.givenName?.localeCompare(comparedUserObject.name?.givenName)
        );

        return selectedUserList;
    };

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
            roleV1Enabled ? {
                menuItem: t("roles:edit.menuItems.roles"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <GroupRolesV1List
                            data-testid="group-mgt-edit-group-roles-v1"
                            group={ group }
                            onGroupUpdate={ onGroupUpdate }
                            isReadOnly={ isReadOnly || isUserReadOnly }
                        />
                    </ResourceTab.Pane>
                )
            } : null,
            !roleV1Enabled ? {
                menuItem: t("roles:edit.menuItems.roles"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <EditGroupRoles group={ group } />
                    </ResourceTab.Pane>
                )
            } : null
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
