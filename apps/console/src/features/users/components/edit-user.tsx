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

import useUIConfig from "@wso2is/common/src/hooks/use-ui-configs";
import { UserstoreConstants } from "@wso2is/core/constants";
import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertInterface, AlertLevels, ProfileInfoInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ResourceTab } from "@wso2is/react-components";
import { AxiosError } from "axios";
import isEqual from "lodash-es/isEqual";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { TabProps } from "semantic-ui-react";
import { UserGroupsList } from "./user-groups-edit";
import { UserProfile } from "./user-profile";
import { UserRolesList } from "./user-roles-list";
import { UserRolesV1List } from "./user-roles-v1-list";
import { UserSessions } from "./user-sessions";
import { SCIMConfigs } from "../../../extensions/configs/scim";
import { ServerConfigurationsInterface, getServerConfigs } from "../../../features/server-configurations";
import { FeatureConfigInterface } from "../../core/models";
import { AppState, store } from "../../core/store";
import { useGetCurrentOrganizationType } from "../../organizations/hooks/use-get-organization-type";
import { ConnectorPropertyInterface } from "../../server-configurations/models";
import { AdminAccountTypes, UserManagementConstants } from "../constants";
import useUserManagement from "../hooks/use-user-management";

interface EditUserPropsInterface extends SBACInterface<FeatureConfigInterface> {
    /**
     * User profile
     */
    user: ProfileInfoInterface;
    /**
     * Handle user update callback.
     */
    handleUserUpdate: (userId: string) => void;
    /**
     * List of readOnly user stores.
     */
    readOnlyUserStores?: string[];
    /**
     * Password reset connector properties
     */
    connectorProperties: ConnectorPropertyInterface[];
    /**
     * Is the page loading
     */
    isLoading: boolean
    /**
     * Is read only user stores loading.
     */
    isReadOnlyUserStoresLoading?: boolean;
}

/**
 * User edit component.
 *
 * @returns User edit component.
 */
export const EditUser: FunctionComponent<EditUserPropsInterface> = (
    props: EditUserPropsInterface
): JSX.Element => {

    const {
        user: selectedUser,
        handleUserUpdate,
        featureConfig,
        readOnlyUserStores,
        connectorProperties,
        isLoading,
        isReadOnlyUserStoresLoading
    } = props;

    const { t } = useTranslation();
    const { activeTab, updateActiveTab } = useUserManagement();
    const dispatch: Dispatch = useDispatch();
    const { isSuperOrganization } = useGetCurrentOrganizationType();
    const { UIConfig } = useUIConfig();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const isGroupAndRoleSeparationEnabled: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.isGroupAndRoleSeparationEnabled);
    const roleV1Enabled: boolean = UIConfig?.legacyMode?.rolesV1;

    const [ isReadOnly, setReadOnly ] = useState<boolean>(false);
    const [ isSuperAdmin, setIsSuperAdmin ] = useState<boolean>(false);
    const [ isSelectedSuperAdmin, setIsSelectedSuperAdmin ] = useState<boolean>(false);
    const [
        isSuperAdminIdentifierFetchRequestLoading,
        setIsSuperAdminIdentifierFetchRequestLoading
    ] = useState<boolean>(false);
    const [ hideTermination, setHideTermination ] = useState<boolean>(false);
    const [ user, setUser ] = useState<ProfileInfoInterface>(selectedUser);
    const [ adminUsername, setAdminUsername ] = useState<string|null>(null);
    const [ isUserManagedByParentOrg, setIsUserManagedByParentOrg ] = useState<boolean>(false);
    const [ isUserProfileReadOnly, setIsUserProfileReadOnly ] = useState<boolean>(false);

    useEffect(() => {
        //Since the parent component is refreshing twice we are doing a deep equals operation on the user object to
        //see if they are the same values. If they are the same values we do not do anything.
        //This makes sure the child components or side effects depending on the user object won't
        //re-render or re-trigger.
        if (!selectedUser || isEqual(user, selectedUser)) {
            return;
        }
        setUser(selectedUser);
    }, [ selectedUser ]);

    useEffect(() => {
        const userStore: string = user?.userName?.split("/").length > 1
            ? user?.userName?.split("/")[0]
            : UserstoreConstants.PRIMARY_USER_STORE;

        if (!isFeatureEnabled(featureConfig?.users, UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE"))
            || readOnlyUserStores?.includes(userStore?.toString())
            || !hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.update, allowedScopes)
            || user[ SCIMConfigs.scim.enterpriseSchema ]?.userSourceId
        ) {
            setReadOnly(true);
        }

    }, [ user, readOnlyUserStores ]);

    useEffect(() => {
        if (!isSuperOrganization()) {
            return;
        }

        checkIsSuperAdmin();
    }, [ user ]);

    useEffect(() => {
        if (user[ SCIMConfigs.scim.enterpriseSchema ]?.managedOrg) {
            setIsUserManagedByParentOrg(true);
            setIsUserProfileReadOnly(true);
        }
    }, [ user ]);

    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert<AlertInterface>(alert));
    };

    /**
    * Util function to check if current user and selected user is a super admin.
    */
    const checkIsSuperAdmin = (): void => {
        setIsSuperAdminIdentifierFetchRequestLoading(true);

        getServerConfigs()
            .then((response: ServerConfigurationsInterface) => {
                const loggedUserName: string = store.getState().profile.profileInfo.userName;
                const adminUser: string = response?.realmConfig.adminUser;

                setAdminUsername(adminUser);

                if (loggedUserName === adminUser) {
                    setIsSuperAdmin(true);
                }
                if (user?.userName === adminUser) {
                    setIsSelectedSuperAdmin(true);
                }
            })
            .catch((error: AxiosError) => {

                setHideTermination(true);

                if (error.response
                && error.response.data
                && (error.response.data.description || error.response.data.detail)) {

                    dispatch(addAlert<AlertInterface>({
                        description: error.response.data.description || error.response.data.detail,
                        level: AlertLevels.ERROR,
                        message: t(
                            "users:userSessions.notifications.getAdminUser." +
                            "error.message"
                        )
                    }));

                    return;
                }

                dispatch(addAlert<AlertInterface>({
                    description: t("users:userSessions.notifications.getAdminUser." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t(
                        "users:userSessions.notifications.getAdminUser." +
                        "genericError.message"
                    )
                }));
            })
            .finally(() => {
                setIsSuperAdminIdentifierFetchRequestLoading(false);
            });
    };

    const panes = () => ([
        {
            menuItem: t("users:editUser.tab.menuItems.0"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <UserProfile
                        adminUsername={ adminUsername }
                        onAlertFired={ handleAlerts }
                        user={ user }
                        handleUserUpdate={ handleUserUpdate }
                        isReadOnly={ isReadOnly || isUserProfileReadOnly }
                        connectorProperties={ connectorProperties }
                        isReadOnlyUserStoresLoading={ isReadOnlyUserStoresLoading }
                        isUserManagedByParentOrg={ isUserManagedByParentOrg }
                        adminUserType={ AdminAccountTypes.INTERNAL }
                    />
                </ResourceTab.Pane>
            )
        },
        {
            menuItem: t("users:editUser.tab.menuItems.1"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <UserGroupsList
                        onAlertFired={ handleAlerts }
                        user={ user }
                        handleUserUpdate={ handleUserUpdate }
                        isReadOnly={ isReadOnly }
                    />
                </ResourceTab.Pane>
            )
        },
        isSuperOrganization && roleV1Enabled ? {
            menuItem: t("users:editUser.tab.menuItems.2"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <UserRolesV1List
                        isGroupAndRoleSeparationEnabled={ isGroupAndRoleSeparationEnabled }
                        onAlertFired={ handleAlerts }
                        user={ user }
                        handleUserUpdate={ handleUserUpdate }
                        isReadOnly={ isReadOnly }
                    />
                </ResourceTab.Pane>
            )
        } : null,
        // ToDo - Enabled only for root organizations as BE doesn't have full SCIM support for organizations yet
        isSuperOrganization && !roleV1Enabled ? {
            menuItem: t("users:editUser.tab.menuItems.2"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <UserRolesList user={ user } />
                </ResourceTab.Pane>
            )
        } : null,
        isSuperOrganization && {
            menuItem: t("users:editUser.tab.menuItems.3"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <UserSessions
                        user={ user }
                        showSessionTerminationButton={ (!isSuperAdminIdentifierFetchRequestLoading && !hideTermination)
                        && ((isSelectedSuperAdmin && isSuperAdmin)
                            || (!isSelectedSuperAdmin && isSuperAdmin)
                            || (!isSelectedSuperAdmin && !isSuperAdmin))
                        } />
                </ResourceTab.Pane>
            )
        }
    ]);

    return (
        <ResourceTab
            activeIndex={ activeTab }
            isLoading={ isLoading }
            onTabChange={ (event: React.MouseEvent<HTMLDivElement>, data: TabProps) => {
                updateActiveTab(data.activeIndex as number);
            } }
            panes={ panes() }
        />
    );
};
