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

import { TestableComponentInterface } from "@wso2is/core/models";
import { ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { AddRoleUsers } from "./role-user-assign";
import { AssignGroups } from "../../../admin-core-v1";
import { GroupsInterface } from "../../../groups/models/groups";
import { UserBasicInterface } from "../../../admin-users-v1/models/user";

/**
 * Captures props needed for the assign roles and users component.
 */
interface AssignGroupsUsersPropsInterface extends TestableComponentInterface {
    onRoleUpdate: () => void;
    selectedUserStore: string;
    initialUsersList: any;
    initialGroupList: any;
    handleGroupListChange: (groups: GroupsInterface[]) => void;
    handleAddedGroupListChange: (groups: GroupsInterface[]) => void;
    handleAddedGroupInitialListChange: (groups: GroupsInterface[]) => void;
    handleInitialGroupListChange: (groups: GroupsInterface[]) => void;
    /**
     * Fired when a user is removed from the list.
     */
    handleTempUsersListChange: (list: UserBasicInterface[]) => void;
}

/**
 * Component which will allow to assign roles to groups and users.
 *
 * @param props - Props injected to the component.
 *
 * @returns Assgin groups and users component.
 */
export const AssignGroupsUsers: FunctionComponent<AssignGroupsUsersPropsInterface> = (
    props: AssignGroupsUsersPropsInterface
): ReactElement => {

    const {
        initialUsersList,
        initialGroupList,
        selectedUserStore,
        handleAddedGroupInitialListChange,
        handleAddedGroupListChange,
        handleGroupListChange,
        handleInitialGroupListChange,
        handleTempUsersListChange
    } = props;

    const panes = () => ([
        {
            menuItem: {
                content: "Groups",
                icon: "group",
                key: "groups"
            },
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <AssignGroups
                        initialValues={ initialGroupList }
                        handleGroupListChange={ (groups: GroupsInterface[]) => handleGroupListChange(groups) }
                        handleTempListChange={ (groups: GroupsInterface[]) => handleAddedGroupListChange(groups) }
                        handleInitialTempListChange={
                            (groups: GroupsInterface[]) => handleAddedGroupInitialListChange(groups) }
                        handleInitialGroupListChange={
                            (groups: GroupsInterface[]) => handleInitialGroupListChange(groups) }
                    />
                </ResourceTab.Pane>
            )
        },
        {
            menuItem: {
                content: "Users",
                icon: "user",
                key: "users"
            },
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <AddRoleUsers
                        data-testid="new-role"
                        isEdit={ false }
                        isGroup={ false }
                        userStore={ selectedUserStore }
                        initialValues={ initialUsersList }
                        handleTempUsersListChange={ handleTempUsersListChange }
                    />
                </ResourceTab.Pane>
            )
        }
    ]);

    return (
        <ResourceTab panes={ panes() } />
    );
};
