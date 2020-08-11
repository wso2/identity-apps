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

import { ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
// TODO: Move to shared components.
import { BasicRoleDetails, RoleUserDetails } from "../../../roles";
import { GroupsInterface } from "../../models";

/**
 * Captures props needed for edit group component
 */
interface EditGroupProps {
    groupId: string;
    group: GroupsInterface;
    onGroupUpdate: () => void;
}

/**
 * Component which will allow editing of a selected group.
 *
 * @param props contains group details to be edited.
 */
export const EditGroup: FunctionComponent<EditGroupProps> = (props: EditGroupProps): ReactElement => {

    const {
        group,
        onGroupUpdate
    } = props;

    const { t } = useTranslation();

    const panes = () => ([
        {
            menuItem: t("adminPortal:components.roles.edit.menuItems.basic"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <BasicRoleDetails
                        data-testid="group-mgt-edit-group-basic"
                        isGroup={ true }
                        roleObject={ group }
                        onRoleUpdate={ onGroupUpdate }
                    />
                </ResourceTab.Pane>
            )
        },{
            menuItem: t("adminPortal:components.roles.edit.menuItems.users"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <RoleUserDetails
                        data-testid="group-mgt-edit-group-users"
                        isGroup={ true }
                        roleObject={ group }
                        onRoleUpdate={ onGroupUpdate }
                    />
                </ResourceTab.Pane>
            )
        }
    ]);

    return (
        <ResourceTab panes={ panes() } />
    );
};
