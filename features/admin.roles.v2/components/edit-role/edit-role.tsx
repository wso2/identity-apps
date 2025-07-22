/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { UserManagementConstants } from "@wso2is/admin.users.v1/constants";
import { RoleConstants } from "@wso2is/core/constants";
import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import {
    FeatureAccessConfigInterface,
    RolePropertyInterface,
    RolesInterface,
    SBACInterface
} from "@wso2is/core/models";
import { ResourceTab, ResourceTabPaneInterface } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { BasicRoleDetails } from "./edit-role-basic";
import { RoleGroupsList } from "./edit-role-groups";
import { UpdatedRolePermissionDetails } from "./edit-role-permission";
import { RoleUsersList } from "./edit-role-users";
import { RoleConstants as LocalRoleConstants } from "../../constants";
import { isMyAccountImpersonationRole } from "../role-utils";

/**
 * Captures props needed for edit role component
 */
interface EditRoleProps extends SBACInterface<FeatureConfigInterface> {
    /**
     * Is the data loading.
     */
    isLoading?: boolean;
    /**
     * Role object to be edited.
     */
    roleObject: RolesInterface;
    /**
     * Callback to update the list of roles.
     */
    onRoleUpdate: (activeTabIndex: number) => void;
    /**
     * Default active tab index.
     */
    defaultActiveIndex?: number;
}

/**
 * Component which will allow editing of a selected role.
 *
 * @param props - contains role details to be edited.
 */
export const EditRole: FunctionComponent<EditRoleProps> = (props: EditRoleProps): ReactElement => {

    const {
        isLoading,
        roleObject,
        onRoleUpdate,
        defaultActiveIndex
    } = props;

    const { t } = useTranslation();

    const featureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRoles);
    const userRoleV3Config: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userV3Roles);
    const usersFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.users);
    const agentsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.agents
    );

    const entitlementConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.entitlement);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const administratorRoleDisplayName: string = useSelector(
        (state: AppState) => state?.config?.ui?.administratorRoleDisplayName);
    const userRolesDisabledFeatures: string[] = useSelector((state: AppState) => {
        return state.config.ui.features?.userRoles?.disabledFeatures;
    });
    const isSharedRole: boolean = useMemo(() => roleObject?.properties?.some(
        (property: RolePropertyInterface) =>
            property?.name === LocalRoleConstants.IS_SHARED_ROLE && property?.value === "true"), [ roleObject ]);

    const isReadOnly: boolean = useMemo(() => {
        const hasMetaUpdate = hasRequiredScopes(userRoleV3Config, userRoleV3Config?.scopes?.update, allowedScopes);
        const hasLegacyUpdate = hasRequiredScopes(featureConfig, featureConfig?.scopes?.update, allowedScopes);

        return !(
            isFeatureEnabled(featureConfig, LocalRoleConstants.FEATURE_DICTIONARY.get("ROLE_UPDATE")) &&
            (hasMetaUpdate || hasLegacyUpdate) &&
            !roleObject?.meta?.systemRole
        );
    }, [ featureConfig, userRoleV3Config, allowedScopes, roleObject ]);

    const canEditRoleGroups = (
        featureConfig: FeatureAccessConfigInterface,
        userRoleV3Config: FeatureAccessConfigInterface,
        entitlementConfig: FeatureAccessConfigInterface,
        allowedScopes: string
    ): boolean =>
        hasRequiredScopes(entitlementConfig, entitlementConfig?.scopes?.update, allowedScopes) ? true
        : hasRequiredScopes(userRoleV3Config, userRoleV3Config?.scopes?.update, allowedScopes) ? false
        : hasRequiredScopes(featureConfig, featureConfig?.scopes?.update, allowedScopes);

    const isUserReadOnly: boolean = useMemo(() => {
    return !isFeatureEnabled(
                featureConfig,
                LocalRoleConstants.FEATURE_DICTIONARY.get("ROLE_UPDATE"))
        || !hasRequiredScopes(
                featureConfig,
                featureConfig?.scopes?.update, allowedScopes)
        || roleObject?.meta?.systemRole;
    }, [ featureConfig, allowedScopes ]);

    const [ isAdminRole, setIsAdminRole ] = useState<boolean>(false);
    const [ isEveryoneRole, setIsEveryoneRole ] = useState<boolean>(false);

    /**
     * Set the if the role is `Internal/admin`.
     */
    useEffect(() => {
        if(roleObject) {
            setIsAdminRole(roleObject.displayName === RoleConstants.ADMIN_ROLE ||
                roleObject?.displayName === RoleConstants.ADMIN_GROUP ||
                roleObject?.displayName === administratorRoleDisplayName);
            setIsEveryoneRole(roleObject.displayName === RoleConstants.EVERYONE_ROLE ||
                roleObject.displayName === RoleConstants.EVERYONE_GROUP);
        }
    }, [ roleObject ]);

    const resolveResourcePanes = () => {
        const panes: ResourceTabPaneInterface[] = [
            {
                menuItem: t("roles:edit.menuItems.basic"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <BasicRoleDetails
                            isReadOnly={ isAdminRole || isEveryoneRole || isReadOnly || isSharedRole
                                || isMyAccountImpersonationRole(roleObject?.displayName,
                                    roleObject?.audience?.display) }
                            role={ roleObject }
                            onRoleUpdate={ onRoleUpdate }
                            tabIndex={ 0 }
                        />
                    </ResourceTab.Pane>
                )
            },
            {
                menuItem: t("roles:edit.menuItems.permissions"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <UpdatedRolePermissionDetails
                            isReadOnly={ isAdminRole || isReadOnly || isSharedRole
                                || isMyAccountImpersonationRole(roleObject?.displayName,
                                    roleObject?.audience?.display) }
                            role={ roleObject }
                            onRoleUpdate={ onRoleUpdate }
                            tabIndex={ 1 }
                        />
                    </ResourceTab.Pane>
                )
            },
            {
                menuItem: t("roles:edit.menuItems.groups"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <RoleGroupsList
                            isReadOnly={ !canEditRoleGroups(featureConfig,
                                                            userRoleV3Config,
                                                            entitlementConfig,
                                                            allowedScopes
                                                        ) }
                            role={ roleObject }
                            onRoleUpdate={ onRoleUpdate }
                            tabIndex={ 2 }
                        />
                    </ResourceTab.Pane>
                )
            }
        ];

        if (!userRolesDisabledFeatures?.includes(
            LocalRoleConstants.FEATURE_DICTIONARY.get("ROLE_USERS")
        )) {
            panes.push(
                {
                    menuItem: t("roles:edit.menuItems.users"),
                    render: () => (
                        <ResourceTab.Pane controlledSegmentation attached={ false }>
                            <RoleUsersList
                                isReadOnly={ isUserReadOnly }
                                role={ roleObject }
                                onRoleUpdate={ onRoleUpdate }
                                tabIndex={ 3 }
                            />
                        </ResourceTab.Pane>
                    )
                }
            );
        }

        if (agentsFeatureConfig?.enabled) {
            panes.push(
                {
                    menuItem: t("roles:edit.menuItems.agents"),
                    render: () => (
                        <ResourceTab.Pane controlledSegmentation attached={ false }>
                            <RoleUsersList
                                isReadOnly={ isReadOnly || isUserReadOnly }
                                role={ roleObject }
                                isForNonHumanUser={ true }
                                activeUserStore="AGENT"
                                onRoleUpdate={ onRoleUpdate }
                                tabIndex={ 3 }
                            />
                        </ResourceTab.Pane>
                    )
                }
            );
        }

        return panes;
    };

    return (
        <ResourceTab
            isLoading={ isLoading }
            defaultActiveIndex={ defaultActiveIndex }
            panes={ resolveResourcePanes() } />
    );
};

/**
 * Default props for the component.
 */
EditRole.defaultProps = {
    defaultActiveIndex: 0
};
