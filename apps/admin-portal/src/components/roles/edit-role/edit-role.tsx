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

import { RolesInterface } from "@wso2is/core/models";
import { ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BasicRoleDetails } from "./edit-role-basic";
import { RolePermissionDetails } from "./edit-role-permission";
import { RoleUserDetails } from "./edit-role-users";
import { history } from "../../../helpers";

/**
 * Captures props needed for edit role component
 */
interface EditRoleProps {
    roleId: string;
    roleObject: RolesInterface;
    onRoleUpdate: () => void;
}

/**
 * Component which will allow editing of a selected role.
 * 
 * @param props contains role details to be edited.
 */
export const EditRole: FunctionComponent<EditRoleProps> = (props: EditRoleProps): ReactElement => {

    const {
        roleObject,
        onRoleUpdate
    } = props;

    const { t } = useTranslation();

    const [ isGroup, setIsGroup ] = useState<boolean>(false);

    /**
     * Get is groups url to proceed as groups
     */
    useEffect(() => {
        setIsGroup(history.location.pathname.includes("/groups/"));
    }, []);

    const panes = () => ([
        {
            menuItem: t("adminPortal:components.roles.edit.menuItems.basic"),
            render: () => (
                <ResourceTab.Pane attached={ false }>
                    <BasicRoleDetails
                        data-testid={
                            isGroup
                                ? "group-mgt-edit-group-basic"
                                : "role-mgt-edit-role-basic"
                        }
                        isGroup={ isGroup }
                        roleObject={ roleObject }
                        onRoleUpdate={ onRoleUpdate }
                    />
                </ResourceTab.Pane>
            )
        },{
            menuItem: t("adminPortal:components.roles.edit.menuItems.permissions"),
            render: () => (
                <ResourceTab.Pane attached={ false }>
                    <RolePermissionDetails
                        data-testid={
                            isGroup
                                ? "group-mgt-edit-group-permissions"
                                : "role-mgt-edit-role-permissions"
                        }
                        isGroup={ isGroup }
                        roleObject={ roleObject }
                        onRoleUpdate={ onRoleUpdate }
                    />
                </ResourceTab.Pane>
            )
        },{
            menuItem: t("adminPortal:components.roles.edit.menuItems.users"),
            render: () => (
                <ResourceTab.Pane attached={ false }>
                    <RoleUserDetails
                        data-testid={
                            isGroup
                                ? "group-mgt-edit-group-users"
                                : "role-mgt-edit-role-users"
                        }
                        isGroup={ isGroup }
                        roleObject={ roleObject }
                        onRoleUpdate={ onRoleUpdate }
                    />
                </ResourceTab.Pane>
            )
        }
    ]);

    return (
        <ResourceTab panes={ panes() } />
    );
};
