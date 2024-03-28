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

import { OrganizationType } from "@wso2is/common";
import { RoleConstants } from "@wso2is/core/constants";
import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { FeatureAccessConfigInterface, RolesInterface, SBACInterface } from "@wso2is/core/models";
import { ResourceTab, ResourceTabPaneInterface } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { BasicRoleDetails } from "./edit-role-basic";
import { RoleConnectedApps } from "./edit-role-connected-apps";
import { RoleGroupsList } from "./edit-role-groups";
import { UpdatedRolePermissionDetails } from "./edit-role-permission";
import { RoleUsersList } from "./edit-role-users";
import { AppState, FeatureConfigInterface } from "../../../admin-core-v1";
import { useGetCurrentOrganizationType } from "../../../organizations/hooks/use-get-organization-type";
import { UserManagementConstants } from "../../../admin-users-v1/constants";
import { RoleConstants as LocalRoleConstants, RoleAudienceTypes } from "../../constants";

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
    const { organizationType } = useGetCurrentOrganizationType();

    const featureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRoles);
    const usersFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.users);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const administratorRoleDisplayName: string = useSelector(
        (state: AppState) => state?.config?.ui?.administratorRoleDisplayName);

    const isReadOnly: boolean = useMemo(() => {
        return !isFeatureEnabled(featureConfig,
            LocalRoleConstants.FEATURE_DICTIONARY.get("ROLE_UPDATE")) ||
            !hasRequiredScopes(featureConfig,
                featureConfig?.scopes?.update, allowedScopes);
    }, [ featureConfig, allowedScopes ]);

    const isUserReadOnly: boolean = useMemo(() => {
        return !isFeatureEnabled(usersFeatureConfig,
            UserManagementConstants.FEATURE_DICTIONARY.get("USER_CREATE")) ||
            !hasRequiredScopes(usersFeatureConfig,
                usersFeatureConfig?.scopes?.update, allowedScopes);
    }, [ usersFeatureConfig, allowedScopes ]);

    const [ isAdminRole, setIsAdminRole ] = useState<boolean>(false);
    const [ isEveryoneRole, setIsEveryoneRole ] = useState<boolean>(false);

    const isSubOrg: boolean = organizationType === OrganizationType.SUBORGANIZATION;

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
                            isReadOnly={ isSubOrg || isAdminRole || isEveryoneRole || isReadOnly }
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
                            isReadOnly={ isSubOrg || isAdminRole || isReadOnly }
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
                            isReadOnly={ isReadOnly }
                            role={ roleObject }
                            onRoleUpdate={ onRoleUpdate }
                            tabIndex={ 2 }
                        />
                    </ResourceTab.Pane>
                )
            },
            {
                menuItem: t("roles:edit.menuItems.users"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <RoleUsersList
                            isReadOnly={ isReadOnly || isUserReadOnly }
                            role={ roleObject }
                            onRoleUpdate={ onRoleUpdate }
                            tabIndex={ 3 }
                        />
                    </ResourceTab.Pane>
                )
            },
            // Hide connected apps tab if the audience is application.
            roleObject?.audience?.type === RoleAudienceTypes.ORGANIZATION.toLocaleLowerCase()
                ? {
                    menuItem: t("roles:edit.menuItems.connectedApps"),
                    render: () => (
                        <ResourceTab.Pane controlledSegmentation attached={ false }>
                            <RoleConnectedApps
                                isReadOnly={ isReadOnly }
                                role={ roleObject }
                                onRoleUpdate={ onRoleUpdate }
                                tabIndex={ 4 }
                            />
                        </ResourceTab.Pane>
                    )
                }
                : null
        ];

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
