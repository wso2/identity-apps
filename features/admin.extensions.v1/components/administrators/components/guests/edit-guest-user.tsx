/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { UserstoreConstants } from "@wso2is/core/constants";
import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertInterface, ProfileInfoInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ContentLoader, Message, ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid } from "semantic-ui-react";
import { UserRolesList as LegacyUserRolesList } from "./user-roles-edit";
import useAuthorization from "@wso2is/admin.authorization.v1/hooks/use-authorization";
import { AppConstants } from "@wso2is/admin.core.v1/constants";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models";
import { AppState } from "@wso2is/admin.core.v1/store";
import { ConnectorPropertyInterface, RealmConfigInterface } from "@wso2is/admin.server-configurations.v1/models";
import { UserProfile } from "@wso2is/admin.users.v1/components/user-profile";
import { UserRolesList } from "@wso2is/admin.users.v1/components/user-roles-list";
import { UserSessions } from "@wso2is/admin.users.v1/components/user-sessions";
import { UserManagementConstants } from "@wso2is/admin.users.v1/constants/user-management-constants";
import { UserManagementUtils } from "@wso2is/admin.users.v1/utils/user-management-utils";
import { administratorConfig } from "../../../../configs/administrator";
import { SCIMConfigs } from "../../../../configs/scim";
import { hiddenPermissions } from "../../../roles/meta";
import { AdminAccountTypes } from "../../constants";

interface EditGuestUserPropsInterface extends SBACInterface<FeatureConfigInterface> {
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
     * Is read only user stores loading.
     */
    isReadOnlyUserStoresLoading?: boolean;
    /**
     * Tenant details
     */
    realmConfigs: RealmConfigInterface;
}

/**
 * Guest user edit component.
 *
 * @returns edit guest user component.
 */
export const EditGuestUser: FunctionComponent<EditGuestUserPropsInterface> = (
    props: EditGuestUserPropsInterface
): JSX.Element => {

    const {
        user,
        realmConfigs,
        handleUserUpdate,
        readOnlyUserStores,
        featureConfig,
        connectorProperties,
        isReadOnlyUserStoresLoading
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { legacyAuthzRuntime } = useAuthorization();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const isGroupAndRoleSeparationEnabled: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.isGroupAndRoleSeparationEnabled);

    const [ isReadOnly, setReadOnly ] = useState<boolean>(false);
    const [ allowDeleteOnly, setAllowDeleteOnly ] = useState<boolean>(false);
    const [ isProfileTabsLoading, setIsProfileTabsLoading ] = useState<boolean>(true);
    const [ isReadOnlyUserStore, setReadOnlyUserStore ] = useState<boolean>(false);
    const [ adminUserType, setAdminUserType ] = useState<string>(AdminAccountTypes.EXTERNAL);

    const authenticatedUserTenanted: string = useSelector((state: AppState) => state?.auth?.username);

    const authenticatedUser: string = useMemo(() => {
        const authenticatedUserComponents: string[] = authenticatedUserTenanted.split("@");

        authenticatedUserComponents.pop();

        return authenticatedUserComponents.join("@");
    }, [ authenticatedUserTenanted ]);

    /**
     * Handles the visibility of the tab panes.
     */
    useEffect(() => {
        if((!administratorConfig.enableAdminInvite || realmConfigs?.adminUser) && user.userName) {
            setIsProfileTabsLoading(false);
        }
    }, [ user, realmConfigs ]);

    useEffect(() => {
        if (!user) {
            return;
        }

        const userStore: string = user?.userName?.split("/").length > 1
            ? user?.userName?.split("/")[ 0 ]
            : UserstoreConstants.PRIMARY_USER_STORE;

        setReadOnlyUserStore(readOnlyUserStores?.includes(userStore?.toString()));

        if (!isFeatureEnabled(featureConfig?.users, UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE"))
            || readOnlyUserStores?.includes(userStore?.toString())
            || !hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.update, allowedScopes)
            || user[ SCIMConfigs.scim.enterpriseSchema ]?.userSourceId
        ) {
            setReadOnly(true);
        }

        if (isFeatureEnabled(featureConfig?.users, UserManagementConstants.FEATURE_DICTIONARY.get("USER_DELETE")) &&
            !(user.userName == realmConfigs?.adminUser) &&
            hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.delete, allowedScopes)) {
            setAllowDeleteOnly(true);
        }

        if (user[ SCIMConfigs.scim.enterpriseSchema ]?.idpType === "Asgardeo") {
            setAdminUserType(AdminAccountTypes.EXTERNAL);
        } else {
            setAdminUserType(AdminAccountTypes.INTERNAL);
        }

    }, [ user, readOnlyUserStores ]);

    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert<AlertInterface>(alert));
    };

    const panes = () => ([
        {
            menuItem: t("users:editUser.tab.menuItems.0"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <UserProfile
                        adminUsername={ realmConfigs?.adminUser }
                        tenantAdmin={ realmConfigs?.adminUser }
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
                        onAlertFired={ handleAlerts }
                        user={ user }
                        handleUserUpdate={ handleUserUpdate }
                        allowDeleteOnly={ allowDeleteOnly }
                        isReadOnly={ isReadOnly }
                        connectorProperties={ connectorProperties }
                        isReadOnlyUserStoresLoading={ isReadOnlyUserStoresLoading }
                        isReadOnlyUserStore={ isReadOnlyUserStore }
                        adminUserType={ adminUserType }
                    />
                </ResourceTab.Pane>
            )
        },
        realmConfigs?.adminUser !== user.userName ?
            {
                menuItem: t("users:editUser.tab.menuItems.2"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        { legacyAuthzRuntime ?
                            (<LegacyUserRolesList
                                showDomain={ false }
                                hideApplicationRoles={ true }
                                isGroupAndRoleSeparationEnabled={ isGroupAndRoleSeparationEnabled }
                                onAlertFired={ handleAlerts }
                                user={ user }
                                handleUserUpdate={ handleUserUpdate }
                                isReadOnly={ false }
                                permissionsToHide={
                                    (AppConstants.getTenant() !== AppConstants.getSuperTenant())
                                        ? hiddenPermissions
                                        : []
                                }
                                realmConfigs={ realmConfigs }
                            />)
                            : <UserRolesList user={ user } /> }



                    </ResourceTab.Pane>
                )
            }
            : null,
        adminUserType === AdminAccountTypes.INTERNAL ||
        UserManagementUtils.isAuthenticatedUser(authenticatedUser, user?.userName)
            ? {
                menuItem: t("users:editUser.tab.menuItems.3"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <UserSessions
                            user={ user }
                            showSessionTerminationButton={ realmConfigs?.adminUser !== user.userName
                                ||  authenticatedUser === user?.userName
                            }
                        />
                    </ResourceTab.Pane>
                )
            }
            : null
    ]);

    return (
        <>
            {
                !isProfileTabsLoading
                    ? (
                        < ResourceTab
                            panes={ panes() }
                        />
                    ) : (
                        <ContentLoader/>
                    )
            }
        </>
    );
};
