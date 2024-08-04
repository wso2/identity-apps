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

import { AlertLevels, RolesInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { updateRole } from "../../api/roles";
import { TreeNode } from "../../models/permission";
import { PatchRoleDataInterface } from "../../models/roles";
import { PermissionList } from "../wizard/role-permission";

/**
 * Interface to capture permission edit props.
 */
interface RolePermissionDetailProps {
    /**
     * Role details
     */
    roleObject: RolesInterface;
    /**
     * Show if it is role.
     */
    isGroup: boolean;
    /**
     * Handle role update callback.
     */
    onRoleUpdate: () => void;
    /**
     * Show if the user is read only.
     */
    isReadOnly?: boolean;
}

/**
 * Component to update permissions of the selected role.
 * @param props - Contains role id to get permission details.
 */
export const RolePermissionDetails: FunctionComponent<RolePermissionDetailProps> = (props:
    RolePermissionDetailProps): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch<any> = useDispatch();
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const {
        isReadOnly,
        roleObject,
        onRoleUpdate,
        isGroup
    } = props;

    const onPermissionUpdate = (updatedPerms: TreeNode[]) => {
        const roleData: PatchRoleDataInterface = {
            "Operations": [ {
                "op": "replace",
                "path": "permissions",
                "value": updatedPerms.map((perm: TreeNode) => perm.key)
            } ],
            "schemas": [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        setIsSubmitting(true);

        updateRole(roleObject.id, roleData)
            .then(() => {
                dispatch(
                    addAlert({
                        description: isGroup
                            ? t("console:manage.features.groups.notifications.updateGroup.success.description")
                            : t("roles:notifications.updateRole.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: isGroup
                            ? t("console:manage.features.groups.notifications.updateGroup.success.message")
                            : t("roles:notifications.updateRole.success.message")
                    })
                );
                onRoleUpdate();
            })
            .catch((error: AxiosError) => {
                if (!error.response || error.response.status === 401) {
                    dispatch(
                        addAlert({
                            description: isGroup
                                ? t("console:manage.features.groups.notifications.createPermission.error.description")
                                : t("roles:notifications.createPermission.error.description"),
                            level: AlertLevels.ERROR,
                            message: isGroup
                                ? t("console:manage.features.groups.notifications.createPermission.error.message")
                                : t("roles:notifications.createPermission.error.message")
                        })
                    );
                } else if (error.response && error.response.data.detail) {
                    dispatch(
                        addAlert({
                            description: isGroup
                                ? t("console:manage.features.groups.notifications.createPermission.error.description",
                                    { description: error.response.data.detail })
                                : t("roles:notifications.createPermission.error.description",
                                    { description: error.response.data.detail }),
                            level: AlertLevels.ERROR,
                            message: isGroup
                                ? t("console:manage.features.groups.notifications.createPermission.error.message")
                                : t("roles:notifications.createPermission.error.message")
                        })
                    );
                } else {
                    dispatch(
                        addAlert({
                            description: isGroup
                                ? t("console:manage.features.groups.notifications.createPermission.genericError."+
                                "description")
                                : t("roles:notifications.createPermission.genericError."+
                                "description"),
                            level: AlertLevels.ERROR,
                            message: isGroup
                                ? t("console:manage.features.groups.notifications.createPermission.genericError."+
                                "message")
                                : t("roles:notifications.createPermission.genericError."+
                                "message")
                        })
                    );
                }
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <div className="permissions-edit-container">
            <PermissionList
                isReadOnly={ isReadOnly }
                isEdit={ !isReadOnly }
                isRole
                onSubmit={ onPermissionUpdate }
                roleObject={ roleObject }
                isSubmitting={ isSubmitting }
            />
        </div>
    );
};
