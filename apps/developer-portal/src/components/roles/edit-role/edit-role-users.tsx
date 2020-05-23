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

import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { updateRoleDetails } from "../../../api";
import { PRIMARY_DOMAIN } from "../../../constants";
import {
    AlertInterface,
    AlertLevels,
    CreateRoleMemberInterface,
    PatchRoleDataInterface,
    RolesInterface
} from "../../../models";
import { AddRoleUsers } from "../create-role-wizard";

interface RoleUserDetailsProps {
    roleObject: RolesInterface;
    isGroup: boolean;
    onRoleUpdate: () => void;
}

export const RoleUserDetails: FunctionComponent<RoleUserDetailsProps> = (
    props: RoleUserDetailsProps
): ReactElement => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const {
        roleObject,
        onRoleUpdate,
        isGroup
    } = props;

    const [ currentUserStore, setCurrentUserStore ] = useState<string>(undefined);

    useEffect(() => {
        const roleName = roleObject.displayName;
        if (roleName.indexOf("/") !== -1) {
            setCurrentUserStore(roleName.split("/")[0]);
        } else {
            setCurrentUserStore(PRIMARY_DOMAIN);
        }
    }, [currentUserStore, roleObject, isGroup]);

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    const onUserUpdate = (userList: any) => {
        const newUsers: CreateRoleMemberInterface[] = [];
        
        userList?.forEach(selectedUser => {
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
        
        updateRoleDetails(roleObject.id, roleData)
            .then(() => {
                handleAlerts({
                    description: isGroup
                        ? t("devPortal:components.groups.notifications.updateGroup.success.description")
                        : t("devPortal:components.roles.notifications.updateRole.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: isGroup
                        ? t("devPortal:components.groups.notifications.updateGroup.success.message")
                        : t("devPortal:components.roles.notifications.updateRole.success.message")
                });
                onRoleUpdate();
            }).catch(() => {
                handleAlerts({
                    description: isGroup
                        ? t("devPortal:components.groups.notifications.updateGroup.error.description")
                        : t("devPortal:components.roles.notifications.updateRole.error.description"),
                    level: AlertLevels.ERROR,
                    message: isGroup
                        ? t("devPortal:components.groups.notifications.updateGroup.error.message")
                        : t("devPortal:components.roles.notifications.updateRole.error.message")
                });
            })
    };

    return (
        <AddRoleUsers
            data-testid={
                isGroup
                    ? "group-mgt-edit-group-users"
                    : "role-mgt-edit-role-users"
            }
            isGroup={ isGroup } 
            isEdit={ true } 
            userStore={ currentUserStore }
            assignedUsers={ roleObject.members } 
            onSubmit={ onUserUpdate }
        />
    )
};
