/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AlertLevels, RolesInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { updateRole } from "../../../../../features/roles/api";
import { TreeNode } from "../../../../../features/roles/models";
import { PermissionList } from "../wizard";

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
 * @param props Contains role id to get permission details.
 */
export const RolePermissionDetails: FunctionComponent<RolePermissionDetailProps> = (props:
    RolePermissionDetailProps): ReactElement => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const {
        isReadOnly,
        roleObject,
        onRoleUpdate,
        isGroup
    } = props;

    const onPermissionUpdate = (updatedPerms: TreeNode[]) => {
        const roleData = {
            "Operations": [ {
                "op": "replace",
                "path": "permissions",
                "value": updatedPerms.map((perm: TreeNode) => perm.key)
            } ],
            "schemas": [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };
        updateRole(roleObject.id, roleData)
            .then(() => {
                dispatch(
                    addAlert({
                        description: isGroup
                            ? t("console:manage.features.groups.notifications.updateGroup.success.description")
                            : t("console:manage.features.roles.notifications.updateRole.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: isGroup
                            ? t("console:manage.features.groups.notifications.updateGroup.success.message")
                            : t("console:manage.features.roles.notifications.updateRole.success.message")
                    })
                );
                onRoleUpdate();
            })
            .catch(error => {
                if (!error.response || error.response.status === 401) {
                    dispatch(
                        addAlert({
                            description: isGroup
                                ? t("console:manage.features.groups.notifications.createPermission.error.description")
                                : t("console:manage.features.roles.notifications.createPermission.error.description"),
                            level: AlertLevels.ERROR,
                            message: isGroup
                                ? t("console:manage.features.groups.notifications.createPermission.error.message")
                                : t("console:manage.features.roles.notifications.createPermission.error.message")
                        })
                    );
                } else if (error.response && error.response.data.detail) {
                    dispatch(
                        addAlert({
                            description: isGroup
                                ? t("console:manage.features.groups.notifications.createPermission.error.description",
                                { description: error.response.data.detail })
                                : t("console:manage.features.roles.notifications.createPermission.error.description",
                                { description: error.response.data.detail }),
                            level: AlertLevels.ERROR,
                            message: isGroup
                                ? t("console:manage.features.groups.notifications.createPermission.error.message")
                                : t("console:manage.features.roles.notifications.createPermission.error.message")
                        })
                    );
                } else {
                    dispatch(
                        addAlert({
                            description: isGroup
                                ? t("console:manage.features.groups.notifications.createPermission.genericError."+
                                "description")
                                : t("console:manage.features.roles.notifications.createPermission.genericError."+
                                "description"),
                            level: AlertLevels.ERROR,
                            message: isGroup
                                ? t("console:manage.features.groups.notifications.createPermission.genericError."+
                                "message")
                                : t("console:manage.features.roles.notifications.createPermission.genericError."+
                                "message")
                        })
                    );
                }
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
            />
        </div>
    );
};
