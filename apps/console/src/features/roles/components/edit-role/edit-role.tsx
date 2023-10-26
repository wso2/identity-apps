/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { RolesInterface, SBACInterface } from "@wso2is/core/models";
import { ResourceTab, ResourceTabPaneInterface } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { BasicRoleDetails } from "./edit-role-basic";
import { RoleGroupsList } from "./edit-role-groups";
import { UpdatedRolePermissionDetails } from "./edit-role-permission";
import { RoleUsersList } from "./edit-role-users";
import { AppState, FeatureConfigInterface } from "../../../core";
import { useGetOrganizationType } from "../../../organizations/hooks/use-get-organization-type";

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
    const orgType: OrganizationType = useGetOrganizationType();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ isAdminRole, setIsAdminRole ] = useState<boolean>(false);

    const isSubOrg: boolean = orgType === OrganizationType.SUBORGANIZATION;

    /**
     * Set the if the role is `Internal/admin`.
     */
    useEffect(() => {
        if(roleObject) {
            setIsAdminRole(roleObject.displayName === RoleConstants.ADMIN_ROLE ||
                roleObject.displayName === RoleConstants.ADMIN_GROUP);
        }
    }, [ roleObject ]);

    const resolveResourcePanes = () => {
        const panes: ResourceTabPaneInterface[] = [
            {
                menuItem: t("console:manage.features.roles.edit.menuItems.basic"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <BasicRoleDetails
                            isReadOnly={ isSubOrg || isAdminRole
                                || !hasRequiredScopes(
                                    featureConfig?.roles, featureConfig?.roles?.scopes?.update, allowedScopes) }
                            role={ roleObject }
                            onRoleUpdate={ onRoleUpdate }
                            tabIndex={ 0 }
                        />
                    </ResourceTab.Pane>
                )
            },
            {
                menuItem: t("console:manage.features.roles.edit.menuItems.permissions"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <UpdatedRolePermissionDetails 
                            isReadOnly={ isSubOrg || isAdminRole
                                || !hasRequiredScopes(
                                    featureConfig?.roles, featureConfig?.roles?.scopes?.update, allowedScopes) }
                            role={ roleObject }
                            onRoleUpdate={ onRoleUpdate }
                            tabIndex={ 1 }
                        />
                    </ResourceTab.Pane>
                )
            },
            {
                menuItem: t("console:manage.features.roles.edit.menuItems.groups"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <RoleGroupsList
                            isReadOnly={ !hasRequiredScopes(
                                featureConfig?.roles, featureConfig?.roles?.scopes?.update, allowedScopes) }
                            role={ roleObject }
                            onRoleUpdate={ onRoleUpdate }
                            tabIndex={ 2 }
                        />
                    </ResourceTab.Pane>
                )
            },
            {
                menuItem: t("console:manage.features.roles.edit.menuItems.users"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <RoleUsersList
                            isReadOnly={ !hasRequiredScopes(
                                featureConfig?.roles, featureConfig?.roles?.scopes?.update, allowedScopes) }
                            role={ roleObject }
                            onRoleUpdate={ onRoleUpdate }
                            tabIndex={ 3 }
                        />
                    </ResourceTab.Pane>
                )
            }
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
