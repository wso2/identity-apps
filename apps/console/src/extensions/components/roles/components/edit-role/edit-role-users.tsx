/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AlertInterface, AlertLevels, RolesInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { updateRoleDetails } from "../../../../../features/roles/api";
import { PRIMARY_DOMAIN } from "../../../../../features/roles/constants";
import { CreateRoleMemberInterface, PatchRoleDataInterface } from "../../../../../features/roles/models";
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
    const dispatch = useDispatch();

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

        const roleName = roleObject.displayName;
        if (roleName.indexOf("/") !== -1) {
            setCurrentUserStore(roleName.split("/")[0]);
        } else {
            setCurrentUserStore(PRIMARY_DOMAIN);
        }
    }, [ currentUserStore, roleObject ]);

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

        for (const selectedUser of userList) {
            newUsers.push({
                value: selectedUser.id
            });
        }

        const roleData: PatchRoleDataInterface = {
            Operations: [{
                "op": "replace",
                "path": "users",
                "value": newUsers
            }],
            schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"]
        };

        updateRoleDetails(roleObject.id, roleData)
            .then(() => {
                handleAlerts({
                    description: t("console:manage.features.roles.notifications.updateRole.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.roles.notifications.updateRole.success.message")
                });
                onRoleUpdate();
            }).catch(() => {
            handleAlerts({
                description: t("console:manage.features.roles.notifications.updateRole.error.description"),
                level: AlertLevels.ERROR,
                message: t("console:manage.features.roles.notifications.updateRole.error.message")
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
