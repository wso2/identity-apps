/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AlertInterface, AlertLevels, RolesInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { updateRoleDetails } from "../../../../../admin.roles.v2/api";
import { PRIMARY_DOMAIN } from "../../../../../admin.roles.v2/constants";
import { CreateRoleMemberInterface, PatchRoleDataInterface } from "../../../../../admin.roles.v2/models";
import { AddRoleUsers } from "../wizard";

interface RoleUserDetailsProps {
    roleObject: RolesInterface;
    isGroup: boolean;
    onRoleUpdate: () => void;
    isReadOnly?: boolean;
}

export const RoleUserDetails: FunctionComponent<RoleUserDetailsProps> = (
    props: RoleUserDetailsProps
): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const {
        roleObject,
        onRoleUpdate,
        isReadOnly
    } = props;

    const [ currentUserStore, setCurrentUserStore ] = useState<string>(undefined);

    useEffect(() => {

        if (!roleObject?.displayName) {
            return;
        }

        const roleName: string = roleObject.displayName;
        
        if (roleName.indexOf("/") !== -1) {
            setCurrentUserStore(roleName.split("/")[0]);
        } else {
            setCurrentUserStore(PRIMARY_DOMAIN);
        }
    }, [ currentUserStore, roleObject ]);

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    const onUserUpdate = (userList: any) => {
        const newUsers: CreateRoleMemberInterface[] = [];

        for (const selectedUser of userList) {
            newUsers.push({
                value: selectedUser.id
            });
        }

        const roleData: PatchRoleDataInterface = {
            Operations: [ {
                "op": "replace",
                "path": "users",
                "value": newUsers
            } ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        updateRoleDetails(roleObject.id, roleData)
            .then(() => {
                handleAlerts({
                    description: t("roles:notifications.updateRole.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("roles:notifications.updateRole.success.message")
                });
                onRoleUpdate();
            }).catch(() => {
                handleAlerts({
                    description: t("roles:notifications.updateRole.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("roles:notifications.updateRole.error.message")
                });
            });
    };

    return (
        <AddRoleUsers
            data-testid="role-mgt-edit-role-users"
            isGroup={ false }
            isEdit={ true }
            isReadOnly={ isReadOnly }
            userStore={ currentUserStore }
            assignedUsers={ roleObject?.users }
            onSubmit={ onUserUpdate }
        />
    );
};
