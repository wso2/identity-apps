/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

import { AppState, FeatureConfigInterface, history } from "@wso2is/admin.core.v1";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { SBACInterface } from "@wso2is/core/models";
import { ContentLoader, ResourceTab, ResourceTabPaneInterface } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RoleGroupsList } from "./edit-organization-groups";
import { RolePermissionDetails } from "./edit-organization-permission";
import { BasicRoleDetails } from "./edit-organization-role-basic";
import { RoleUserDetails } from "./edit-organization-role-users";
import { OrganizationRoleManagementConstants } from "../../constants";
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
 * @param props - contains role details to be edited.
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

    const isReadOnly: boolean = useMemo(() => {
        return !hasRequiredScopes(featureConfig?.roles, featureConfig?.roles?.scopes?.update, allowedScopes)
                || roleObject?.displayName === OrganizationRoleManagementConstants.ORG_CREATOR_ROLE_NAME;
    }, [ featureConfig?.roles, roleObject,
        OrganizationRoleManagementConstants.ORG_CREATOR_ROLE_NAME ] );

    /**
     * Get is groups url to proceed as groups
     */
    useEffect(() => {
        if (!roleObject) {
            return;
        }

        setIsGroup(history.location.pathname.includes("/groups/"));

    }, [ roleObject ]);

    const resolveResourcePanes = () => {
        const panes: ResourceTabPaneInterface[] = [
            {
                menuItem: t("roles:edit.menuItems.basic"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <BasicRoleDetails
                            isReadOnly={
                                isReadOnly ||
                                roleObject?.displayName === OrganizationRoleManagementConstants.ORG_ADMIN_ROLE_NAME
                            }
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
                            isReadOnly={
                                isReadOnly ||
                                roleObject?.displayName === OrganizationRoleManagementConstants.ORG_ADMIN_ROLE_NAME
                            }
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
                            isReadOnly={ isReadOnly }
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
                            isReadOnly={ isReadOnly }
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
        roleObject ? <ResourceTab panes={ resolveResourcePanes() } /> : <ContentLoader/>
    );
};
