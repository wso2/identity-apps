/**
 * Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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

import { useRequiredScopes } from "@wso2is/access-control";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState, store } from "@wso2is/admin.core.v1/store";
import { SCIMConfigs } from "@wso2is/admin.extensions.v1/configs/scim";
import { userstoresConfig } from "@wso2is/admin.extensions.v1/configs/userstores";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { ServerConfigurationsInterface, getServerConfigs } from "@wso2is/admin.server-configurations.v1";
import { ConnectorPropertyInterface } from "@wso2is/admin.server-configurations.v1/models";
import useUserStores from "@wso2is/admin.userstores.v1/hooks/use-user-stores";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertInterface, AlertLevels, ProfileInfoInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Message, ResourceTab } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, TabProps } from "semantic-ui-react";
import { UserGroupsList } from "./user-groups-edit";
import { UserProfile } from "./user-profile";
import { UserRolesList } from "./user-roles-list";
import { UserSessions } from "./user-sessions";
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
     * Password reset connector properties
     */
    connectorProperties: ConnectorPropertyInterface[];
    /**
     * Is the page loading
     */
    isLoading: boolean
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
        user,
        handleUserUpdate,
        featureConfig,
        connectorProperties,
        isLoading
    } = props;

    const { t } = useTranslation();
    const { activeTab, updateActiveTab } = useUserManagement();
    const dispatch: Dispatch = useDispatch();
    const { isSuperOrganization } = useGetCurrentOrganizationType();

    const { isUserStoreReadOnly, readOnlyUserStoreNamesList, isLoading: isUserStoresLoading } = useUserStores();

    const hasUsersUpdatePermissions: boolean = useRequiredScopes(
        featureConfig?.users?.scopes?.update
    );

    const [ isReadOnly, setReadOnly ] = useState<boolean>(false);
    const [ isSuperAdmin, setIsSuperAdmin ] = useState<boolean>(false);
    const [ isSelectedSuperAdmin, setIsSelectedSuperAdmin ] = useState<boolean>(false);
    const [
        isSuperAdminIdentifierFetchRequestLoading,
        setIsSuperAdminIdentifierFetchRequestLoading
    ] = useState<boolean>(false);
    const [ hideTermination, setHideTermination ] = useState<boolean>(false);
    const [ adminUsername, setAdminUsername ] = useState<string|null>(null);
    const [ isUserManagedByParentOrg, setIsUserManagedByParentOrg ] = useState<boolean>(false);
    const [ isUserProfileReadOnly, setIsUserProfileReadOnly ] = useState<boolean>(false);

    const userRolesDisabledFeatures: string[] = useSelector((state: AppState) => {
        return state.config.ui.features?.users?.disabledFeatures;
    });

    const isUpdatingSharedProfilesEnabled: boolean = !userRolesDisabledFeatures?.includes(
        UserManagementConstants.FEATURE_DICTIONARY.get("USER_SHARED_PROFILES")
    );

    /**
     * Check whether the user is in a read only user store.
     */
    const isReadOnlyUserStore: boolean = useMemo(() => {
        const userStoreName: string = user?.userName?.split("/").length > 1
            ? user?.userName?.split("/")[0]
            : userstoresConfig.primaryUserstoreName;

        return isUserStoreReadOnly(userStoreName);
    }, [ user, readOnlyUserStoreNamesList ]);

    useEffect(() => {
        if (!isFeatureEnabled(featureConfig?.users, UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE"))
            || isReadOnlyUserStore
            || !hasUsersUpdatePermissions
            || user[ SCIMConfigs.scim.systemSchema ]?.userSourceId
            || user[ SCIMConfigs.scim.systemSchema ]?.isReadOnlyUser === "true"
        ) {
            setReadOnly(true);
        }

    }, [ user, isReadOnlyUserStore ]);

    useEffect(() => {
        if (!isSuperOrganization()) {
            return;
        }

        checkIsSuperAdmin();
    }, [ user ]);

    useEffect(() => {
        if (user[ SCIMConfigs.scim.systemSchema ]?.managedOrg) {
            if (!isUpdatingSharedProfilesEnabled) {
                setIsUserProfileReadOnly(true);
            }

            setIsUserManagedByParentOrg(true);
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
                        isReadOnlyUserStoresLoading={ isUserStoresLoading }
                        isReadOnlyUserStore={ isReadOnlyUserStore }
                        isUserManagedByParentOrg={ isUserManagedByParentOrg }
                        adminUserType={ AdminAccountTypes.INTERNAL }
                        allowDeleteOnly={
                            user[ SCIMConfigs.scim.systemSchema ]?.isReadOnlyUser === "true"
                        }
                        editUserDisclaimerMessage={ (
                            <Grid>
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 6 }>
                                        <Message
                                            type="info"
                                            content={ t("extensions:manage.users.editUserProfile.disclaimerMessage") }
                                        />
                                        <Divider hidden />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        ) }
                    />
                </ResourceTab.Pane>
            )
        },
        (
            !userRolesDisabledFeatures?.includes(UserManagementConstants.FEATURE_DICTIONARY.get("USER_GROUPS"))
            || user?.userName?.split("/").length !== 1
        )
        && {
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
        {
            menuItem: t("users:editUser.tab.menuItems.2"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <UserRolesList user={ user } />
                </ResourceTab.Pane>
            )
        },
        {
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
