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

import { RoleConstants } from "@wso2is/core/constants";
import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { FeatureAccessConfigInterface, RolesInterface, SBACInterface } from "@wso2is/core/models";
import { ResourceTab, ResourceTabPaneInterface } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { BasicRoleDetails } from "./edit-role-basic";
import { RoleGroupsList } from "./edit-role-groups";
import { RolePermissionDetails } from "./edit-role-permission";
import { RoleUserDetails } from "./edit-role-users";
import { AppState, FeatureConfigInterface, history } from "../../../admin-core-v1";
import { UserManagementConstants } from "../../../users/constants";

/**
 * Captures props needed for edit role component
 */
interface EditRoleProps extends SBACInterface<FeatureConfigInterface> {
    /**
     * Is the data loading.
     */
    isLoading?: boolean;
    roleId: string;
    roleObject: RolesInterface;
    onRoleUpdate: () => void;
    readOnlyUserStores?: string[];
    /**
     * Is read only.
     */
    readOnly?: boolean;
}

/**
 * Component which will allow editing of a selected role.
 *
 * @param props - contains role details to be edited.
 */
export const EditRole: FunctionComponent<EditRoleProps> = (props: EditRoleProps): ReactElement => {

    const {
        isLoading,
        roleId,
        roleObject,
        onRoleUpdate,
        readOnly
    } = props;

    const { t } = useTranslation();

    const usersFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.users);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const [ isGroup, setIsGroup ] = useState<boolean>(false);
    const [ isAdminRole, setIsAdminRole ] = useState<boolean>(false);

    const isUserReadOnly: boolean = useMemo(() => {
        return !isFeatureEnabled(usersFeatureConfig,
            UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE")) ||
            !hasRequiredScopes(usersFeatureConfig,
                usersFeatureConfig?.scopes?.update, allowedScopes);
    }, [ usersFeatureConfig, allowedScopes ]);

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
        const panes: ResourceTabPaneInterface[] = [
            {
                menuItem: t("roles:edit.menuItems.basic"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <BasicRoleDetails
                            isReadOnly={ isAdminRole || readOnly }
                            data-testid="role-mgt-edit-role-basic"
                            roleId={ roleId }
                            isGroup={ isGroup }
                            roleObject={ roleObject }
                            onRoleUpdate={ onRoleUpdate }
                        />
                    </ResourceTab.Pane>
                )
            },{
                menuItem: t("roles:edit.menuItems.permissions"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <RolePermissionDetails
                            isReadOnly={ isAdminRole || readOnly }
                            data-testid="role-mgt-edit-role-permissions"
                            isGroup={ false }
                            roleObject={ roleObject }
                            onRoleUpdate={ onRoleUpdate }
                        />
                    </ResourceTab.Pane>
                )
            },
            {
                menuItem: t("roles:edit.menuItems.groups"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <RoleGroupsList
                            isReadOnly={ readOnly || isUserReadOnly }
                            data-testid="role-mgt-edit-role-groups"
                            role={ roleObject }
                            onRoleUpdate={ onRoleUpdate }
                        />
                    </ResourceTab.Pane>
                )
            },
            {
                menuItem: t("roles:edit.menuItems.users"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <RoleUserDetails
                            isReadOnly={ readOnly }
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
        <ResourceTab
            isLoading={ isLoading }
            panes={ resolveResourcePanes() } />
    );
};
