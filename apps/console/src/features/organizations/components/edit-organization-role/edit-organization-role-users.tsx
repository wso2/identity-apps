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

import { AlertInterface, AlertLevels, RolesInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../core";
import { AddRoleUsers } from "../../../roles";
import { patchOrganizationRoleDetails } from "../../api";
import { PRIMARY_DOMAIN } from "../../constants";
import {
    CreateOrganizationRoleMemberInterface,
    OrganizationInterface,
    PatchOrganizationRoleDataInterface
} from "../../models";

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
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const currentOrganization: OrganizationInterface = useSelector(
        (state: AppState) => state.organization.organization
    );

    useEffect(() => {
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
        const newUsers: CreateOrganizationRoleMemberInterface[] = [];

        for (const selectedUser of userList) {
            newUsers.push(selectedUser.id);
        }

        const roleData: PatchOrganizationRoleDataInterface = {
            operations: [ {
                "op": "REPLACE",
                "path": "users",
                "value": newUsers
            } ]
        };

        setIsSubmitting(true);

        patchOrganizationRoleDetails(currentOrganization.id, roleObject.id, roleData)
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
            }).finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <AddRoleUsers
            data-testid="role-mgt-edit-role-users"
            isGroup={ false }
            isEdit={ true }
            isReadOnly={ isReadOnly }
            userStore={ currentUserStore }
            assignedUsers={ roleObject.users }
            onSubmit={ onUserUpdate }
            isSubmitting={ isSubmitting }
        />
    );
};
