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

import React, { FunctionComponent, ReactElement } from "react";
import { RolesInterface } from "../../../models";
import { ResourceTab } from "@wso2is/react-components";
import { BaiscRoleDetails } from "./edit-role-basic";
import { RolePermissionDetails } from "./edit-role-permission";
import { RoleUserDetails } from "./edit-role-users";

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

    const panes = () => ([
        {
            menuItem: "Basics",
            render: () => (
                <ResourceTab.Pane attached={ false }>
                    <BaiscRoleDetails roleObject={ roleObject } onRoleUpdate={ onRoleUpdate } />
                </ResourceTab.Pane>
            ),
        },{
            menuItem: "Permissions",
            render: () => (
                <ResourceTab.Pane attached={ false }>
                    <RolePermissionDetails roleObject={ roleObject } onRoleUpdate={ onRoleUpdate }/>
                </ResourceTab.Pane>
            ),
        },{
            menuItem: "Users",
            render: () => (
                <ResourceTab.Pane attached={ false }>
                    <RoleUserDetails roleObject={ roleObject } onRoleUpdate={ onRoleUpdate }/>
                </ResourceTab.Pane>
            ),
        }
    ]);

    return (
        <ResourceTab panes={ panes() } />
    );
}
