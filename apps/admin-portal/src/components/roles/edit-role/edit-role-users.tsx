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
 * under the License
 */

import React, { FunctionComponent, ReactElement } from "react";
import { AddRoleUsers } from "../create-role-wizard/role-user-assign";
import { 
    RolesInterface,     
    AlertLevels,
    AlertInterface,
    CreateRoleMemberInterface,
    PatchRoleDataInterface
} from "../../../models";
import { updateRoleDetails } from "../../../api";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { addAlert } from "../../../store/actions";

interface RoleUserDetailsProps {
    roleObject: RolesInterface;
    onRoleUpdate: () => void;
}

export const RoleUserDetails: FunctionComponent<RoleUserDetailsProps> = (
    props: RoleUserDetailsProps
): ReactElement => {
    const {
        roleObject,
        onRoleUpdate
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    const onUserUpdate = (userList: any) => {
        const selectedUsers = userList.users;
        const newUsers: CreateRoleMemberInterface[] = [];
        
        selectedUsers.forEach(selectedUser => {
            newUsers.push({
                value: selectedUser.id,
                display: selectedUser.userName
            })
        });

        const roleData: PatchRoleDataInterface = {
            schemas: [
                "urn:ietf:params:scim:api:messages:2.0:PatchOp"
            ],
            Operations: [{
                "op": "replace",
                "value": {
                    "members": newUsers
                }
            }]
        };
        
        updateRoleDetails(roleObject.id, roleData).then(response => {
            handleAlerts({
                description: t(
                    "devPortal:components.roles.notifications.updateRole.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "devPortal:components.roles.notifications.updateRole.success.message"
                )
            });
            onRoleUpdate();
        }).catch(error => {
            handleAlerts({
                description: t(
                    "devPortal:components.roles.notifications.updateRole.error.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "devPortal:components.roles.notifications.updateRole.error.message"
                )
            });
        })
    };

    return (
        <AddRoleUsers isEdit={ true } assignedUsers={ roleObject.members } onSubmit={ onUserUpdate }/>
    )
};
