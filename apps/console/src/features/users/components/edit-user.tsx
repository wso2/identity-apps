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
import { AlertInterface, ProfileInfoInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { UserGroupsList } from "./user-groups-edit";
import { UserProfile } from "./user-profile";
import { UserRolesList } from "./user-roles-edit";
import { UserSessions } from "./user-sessions";
import { FeatureConfigInterface } from "../../core/models";
import { AppState } from "../../core/store";
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
        user,
        handleUserUpdate,
        featureConfig,
        readOnlyUserStores,
        connectorProperties
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);
    const isGroupAndRoleSeparationEnabled: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.isGroupAndRoleSeparationEnabled);

    const [ isReadOnly, setReadOnly ] = useState<boolean>(false);

    useEffect(() => {
        if(!user) {
            return;
        }

        const userStore = user?.userName?.split("/").length > 1
            ? user?.userName?.split("/")[0]
            : UserstoreConstants.PRIMARY_USER_STORE;

        if (!isFeatureEnabled(featureConfig?.users, UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE"))
            || readOnlyUserStores?.includes(userStore?.toString())
            || !hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.update, allowedScopes)
        ) {
            setReadOnly(true);
        }
    }, [ user, readOnlyUserStores ]);

    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert<AlertInterface>(alert));
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
                    <UserSessions user={ user } />
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
