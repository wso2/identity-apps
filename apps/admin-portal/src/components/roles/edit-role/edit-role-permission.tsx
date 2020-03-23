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

import React, { FunctionComponent, ReactElement, useEffect, useState } from "react"
import { PermissionList } from "../create-role-wizard/role-permisson";
import { updatePermissionForRole } from "../../../api";
import { addAlert } from "../../../store/actions";
import { AlertLevels, RolesInterface } from "../../../models";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

/**
 * Interface to capture permission edit props.
 */
interface RolePermissionDetailProps {
    roleObject: RolesInterface;
    onRoleUpdate: () => void;
}

/**
 * Component to update permissions of the selected role.
 * @param props Contains role id to get permission details.
 */
export const RolePermissionDetails: FunctionComponent<RolePermissionDetailProps> = (props: 
    RolePermissionDetailProps): ReactElement => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const {
        roleObject,
        onRoleUpdate
    } = props;
    
    const onPermissionUpdate = (updatedPerms: string[]) => {
        updatePermissionForRole(roleObject.id, updatedPerms).then(() => {
            dispatch(addAlert({
                description: t(
                    "devPortal:components.roles.notifications.updateRole.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "devPortal:components.roles.notifications.updateRole.success.message"
                )
            }));
            onRoleUpdate();
        }).catch(error => {
            if (!error.response || error.response.status === 401) {
                dispatch(addAlert({
                    description: t(
                        "devPortal:components.roles.notifications.updateRole.error.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "devPortal:components.roles.notifications.updateRole.error.message"
                    )
                }));
            } else if (error.response && error.response.data.detail) {
                dispatch(addAlert({
                    description: t(
                        "devPortal:components.roles.notifications.updateRole.error.description",
                        { description: error.response.data.detail }
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "devPortal:components.roles.notifications.updateRole.error.message"
                    )
                }));
            } else {
                dispatch(addAlert({
                    description: t(
                        "devPortal:components.roles.notifications.updateRole.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "devPortal:components.roles.notifications.updateRole.genericError.message"
                    )
                }));
            }
        })
    }
    
    return (
        <PermissionList onSubmit={ onPermissionUpdate } roleObject={ roleObject } />
    )
}
