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
import { useDispatch } from "react-redux";
import { AlertInterface } from "../../../models";
import { addAlert } from "../../../store/actions";
import { ResourceTab } from "@wso2is/react-components";
import { BaiscRoleDetails } from "./edit-role-basic";
import { RolePermissionDetails } from "./edit-role-permission";
import { RoleUserDetails } from "./edit-role-users";

interface EditRoleProps {
    role: string;
}

export const EditRole: FunctionComponent<EditRoleProps> = (props: EditRoleProps): ReactElement => {

    const {
        role
    } = props;

    const panes = () => ([
        {
            menuItem: "Basics",
            render: () => (
                <ResourceTab.Pane attached={ false }>
                    <BaiscRoleDetails />
                </ResourceTab.Pane>
            ),
        },{
            menuItem: "Permissions",
            render: () => (
                <ResourceTab.Pane attached={ false }>
                    <RolePermissionDetails role={ role }/>
                </ResourceTab.Pane>
            ),
        },{
            menuItem: "Users",
            render: () => (
                <ResourceTab.Pane attached={ false }>
                    <RoleUserDetails/>
                </ResourceTab.Pane>
            ),
        }
    ]);

    return (
        <ResourceTab
            panes={ panes() }
        />
    );
}
