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

import { RoleConstants } from "@wso2is/core/constants";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { RolesInterface, SBACInterface } from "@wso2is/core/models";
import { ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RoleGroupsList } from "./edit-organization-groups";
import { RolePermissionDetails } from "./edit-organization-permission";
import { BasicRoleDetails } from "./edit-organization-role-basic";
import { RoleUserDetails } from "./edit-organization-role-users";
import { AppState, FeatureConfigInterface, history } from "../../../core";
import { OrganizationRoleInterface } from "../../models";

/**
 * Captures props needed for edit role component
 */
interface EditRoleProps extends SBACInterface<FeatureConfigInterface> {
    roleId: string;
    roleObject: OrganizationRoleInterface;
    onRoleUpdate: () => void;
    readOnlyUserStores?: string[];
}

/**
 * Component which will allow editing of a selected role.
 *
 * @param props contains role details to be edited.
 */
export const EditOrganizationRole: FunctionComponent<EditRoleProps> = (props: EditRoleProps): ReactElement => {

    const {
        roleId,
        roleObject,
        onRoleUpdate
    } = props;

    const { t } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const [ isGroup, setIsGroup ] = useState<boolean>(false);
    const [ isAdminRole, setIsAdminRole ] = useState<boolean>(false);

    /**
     * Get is groups url to proceed as groups
     */
    useEffect(() => {
        if(!roleObject) {
            return;
        }

        setIsGroup(history.location.pathname.includes("/groups/"));

    }, [ roleObject ]);

    /**
     * Set the if the role is `Internal/admin`.
     */
    useEffect(() => {
        if(!roleObject) {
            return;
        }

        setIsAdminRole(roleObject.displayName === RoleConstants.ADMIN_ROLE ||
            roleObject.displayName === RoleConstants.ADMIN_GROUP);

    }, [ roleObject ]);

    const resolveResourcePanes = () => {
        const panes = [
            {
                menuItem: t("console:manage.features.roles.edit.menuItems.basic"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <BasicRoleDetails
                            isReadOnly={ isAdminRole
                                || !hasRequiredScopes(
                                    featureConfig?.roles, featureConfig?.roles?.scopes?.update, allowedScopes) }
                            data-testid="role-mgt-edit-role-basic"
                            roleId={ roleId }
                            isGroup={ isGroup }
                            roleObject={ roleObject }
                            onRoleUpdate={ onRoleUpdate }
                        />
                    </ResourceTab.Pane>
                )
            },{
                menuItem: t("console:manage.features.roles.edit.menuItems.permissions"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <RolePermissionDetails
                            isReadOnly={ isAdminRole
                                || !hasRequiredScopes(
                                    featureConfig?.roles, featureConfig?.roles?.scopes?.update, allowedScopes) }
                            data-testid="role-mgt-edit-role-permissions"
                            isGroup={ false }
                            roleObject={ roleObject }
                            onRoleUpdate={ onRoleUpdate }
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
                            data-testid="role-mgt-edit-role-groups"
                            role={ roleObject }
                            onRoleUpdate={ onRoleUpdate }
                        />
                    </ResourceTab.Pane>
                )
            },
            {
                menuItem: t("console:manage.features.roles.edit.menuItems.users"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <RoleUserDetails
                            isReadOnly={ !hasRequiredScopes(
                                featureConfig?.roles, featureConfig?.roles?.scopes?.update, allowedScopes) }
                            data-testid="role-mgt-edit-role-users"
                            isGroup={ false }
                            roleObject={ roleObject }
                            onRoleUpdate={ onRoleUpdate }
                        />
                    </ResourceTab.Pane>
                )
            }
        ];

        return panes;
    };

    return (
        <ResourceTab panes={ resolveResourcePanes() } />
    );
};
