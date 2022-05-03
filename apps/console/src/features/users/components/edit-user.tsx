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
import { UserGroupsList } from "./user-groups-edit";
import { UserProfile } from "./user-profile";
import { UserRolesList } from "./user-roles-edit";
import { UserSessions } from "./user-sessions";
import { SCIMConfigs } from "../../../extensions/configs/scim";
import { getServerConfigs } from "../../../features/server-configurations";
import { FeatureConfigInterface } from "../../core/models";
import { AppState, store } from "../../core/store";
import { ConnectorPropertyInterface } from "../../server-configurations/models";
import { UserManagementConstants } from "../constants";

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
     * Is read only user stores loading.
     */
    isReadOnlyUserStoresLoading?: boolean;
}

/**
 * Application edit component.
 *
 * @return {JSX.Element}
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
        isReadOnlyUserStoresLoading
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const isGroupAndRoleSeparationEnabled: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.isGroupAndRoleSeparationEnabled);

    const [ isReadOnly, setReadOnly ] = useState<boolean>(false);
    const [ isSuperAdmin, setIsSuperAdmin ] = useState<boolean>(false); 
    const [ isSelectedSuperAdmin, setIsSelectedSuperAdmin ] = useState<boolean>(false); 
    const [ 
        isSuperAdminIdentifierFetchRequestLoading, 
        setIsSuperAdminIdentifierFetchRequestLoading 
    ] = useState<boolean>(false);
    const [ hideTermination, setHideTermination ] = useState<boolean>(false);
    const [ user, setUser ] = useState<ProfileInfoInterface>(selectedUser);

    useEffect(() => {
        //Since the parent component is refreshing twice we are doing a deep equals operation on the user object to 
        //see if they are the same values. If they are the same values we do not do anything. 
        //This makes sure the child components or side effects depending on the user object won't re-render or re-trigger.
        if (!selectedUser || isEqual(user, selectedUser)) {
            return;
        }
        setUser(selectedUser);
    }, [ selectedUser ]);

    useEffect(() => {
        const userStore = user?.userName?.split("/").length > 1
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
        checkIsSuperAdmin();
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
            .then((response) => {
                const loggedUserName: string = store.getState().profile.profileInfo.userName;
                const adminUser: string = response?.realmConfig.adminUser;

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
                            "console:manage.features.users.userSessions.notifications.getAdminUser." +
                            "error.message"
                        )
                    }));

                    return;
                }

                dispatch(addAlert<AlertInterface>({
                    description: t("console:manage.features.users.userSessions.notifications.getAdminUser." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.users.userSessions.notifications.getAdminUser." +
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
            menuItem: t("console:manage.features.users.editUser.tab.menuItems.0"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <UserProfile
                        onAlertFired={ handleAlerts }
                        user={ user }
                        handleUserUpdate={ handleUserUpdate }
                        isReadOnly={ isReadOnly }
                        connectorProperties={ connectorProperties }
                        isReadOnlyUserStoresLoading={ isReadOnlyUserStoresLoading }
                    />
                </ResourceTab.Pane>
            )
        },
        {
            menuItem: t("console:manage.features.users.editUser.tab.menuItems.1"),
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
            menuItem: t("console:manage.features.users.editUser.tab.menuItems.2"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <UserRolesList
                        isGroupAndRoleSeparationEnabled={ isGroupAndRoleSeparationEnabled }
                        onAlertFired={ handleAlerts }
                        user={ user }
                        handleUserUpdate={ handleUserUpdate }
                        isReadOnly={ isReadOnly }
                    />
                </ResourceTab.Pane>
            )
        },
        {
            menuItem: t("console:manage.features.users.editUser.tab.menuItems.3"),
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
            panes={ panes() }
        />
    );
};
