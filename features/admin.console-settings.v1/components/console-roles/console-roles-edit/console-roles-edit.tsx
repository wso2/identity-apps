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

import { OrganizationType } from "@wso2is/admin.core.v1";
import { RoleConstants } from "@wso2is/core/constants";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface, RolesInterface } from "@wso2is/core/models";
import { ResourceTab, ResourceTabPaneInterface } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ConsoleRolePermissions from "./console-role-permissions";
import { AppState } from "@wso2is/admin.core.v1";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { BasicRoleDetails } from "@wso2is/admin.roles.v2/components/edit-role/edit-role-basic";
import { RoleConnectedApps } from "@wso2is/admin.roles.v2/components/edit-role/edit-role-connected-apps";
import { RoleGroupsList } from "@wso2is/admin.roles.v2/components/edit-role/edit-role-groups";
import { RoleUsersList } from "@wso2is/admin.roles.v2/components/edit-role/edit-role-users";
import { RoleAudienceTypes } from "@wso2is/admin.roles.v2/constants/role-constants";
import "./console-roles-edit.scss";

/**
 * Captures props needed for edit role component
 */
interface ConsoleRolesEditPropsInterface extends IdentifiableComponentInterface {
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
const ConsoleRolesEdit: FunctionComponent<ConsoleRolesEditPropsInterface> = (
    props: ConsoleRolesEditPropsInterface): ReactElement => {

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
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const administratorRoleDisplayName: string = useSelector(
        (state: AppState) => state?.config?.ui?.administratorRoleDisplayName);

    const [ isAdminRole, setIsAdminRole ] = useState<boolean>(false);

    const isSubOrg: boolean = organizationType === OrganizationType.SUBORGANIZATION;

    /**
     * Set the if the role is `Internal/admin`.
     */
    useEffect(() => {
        if(roleObject) {
            setIsAdminRole(roleObject.displayName === RoleConstants.ADMIN_ROLE ||
                roleObject?.displayName === RoleConstants.ADMIN_GROUP ||
                roleObject?.displayName === administratorRoleDisplayName);
        }
    }, [ roleObject ]);

    const resolveResourcePanes = () => {
        const panes: ResourceTabPaneInterface[] = [
            {
                menuItem: t("roles:edit.menuItems.basic"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <BasicRoleDetails
                            isReadOnly={ isSubOrg || isAdminRole
                                || !hasRequiredScopes(
                                    featureConfig, featureConfig?.scopes?.update, allowedScopes) }
                            role={ roleObject }
                            onRoleUpdate={ onRoleUpdate }
                            tabIndex={ 0 }
                            enableDeleteErrorConnetedAppsModal={ false }
                        />
                    </ResourceTab.Pane>
                )
            },
            {
                menuItem: t("roles:edit.menuItems.permissions"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <ConsoleRolePermissions
                            isReadOnly={
                                isSubOrg
                                || isAdminRole
                                || !hasRequiredScopes(featureConfig, featureConfig?.scopes?.update, allowedScopes)
                            }
                            role={ roleObject }
                            onRoleUpdate={ onRoleUpdate }
                            tabIndex={ 1 }
                            isSubOrganization={ isSubOrg }
                        />
                    </ResourceTab.Pane>
                )
            },
            {
                menuItem: t("roles:edit.menuItems.groups"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <RoleGroupsList
                            isReadOnly={ !hasRequiredScopes(
                                featureConfig, featureConfig?.scopes?.update, allowedScopes) }
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
                            isReadOnly={ !hasRequiredScopes(
                                featureConfig, featureConfig?.scopes?.update, allowedScopes) }
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
                                isReadOnly={ !hasRequiredScopes(
                                    featureConfig, featureConfig?.scopes?.update, allowedScopes) }
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
            panes={ resolveResourcePanes() }
        />
    );
};

ConsoleRolesEdit.defaultProps = {
    defaultActiveIndex: 0
};

export default ConsoleRolesEdit;
