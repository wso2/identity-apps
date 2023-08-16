/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { AlertInterface, AlertLevels, RolesInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { AppState } from "../../../core";
import { AddRoleUsers } from "../../../roles/components/wizard/role-user-assign";
import { ScimOperationsInterface } from "../../../roles/models/roles";
import { UserBasicInterface } from "../../../users/models/user";
import { patchOrganizationRoleDetails } from "../../api";
import { PRIMARY_DOMAIN } from "../../constants";
import {
    OrganizationResponseInterface
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
    const dispatch: Dispatch = useDispatch();

    const {
        roleObject,
        onRoleUpdate,
        isReadOnly
    } = props;

    const [ currentUserStore, setCurrentUserStore ] = useState<string>(undefined);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const currentOrganization: OrganizationResponseInterface = useSelector(
        (state: AppState) => state.organization.organization
    );

    useEffect(() => {
        const roleName: string = roleObject?.displayName;

        if (roleName?.indexOf("/") !== -1) {
            setCurrentUserStore(roleName?.split("/")[0]);
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

    const onUserUpdate = async (addedUsers: UserBasicInterface[], removedUsers: UserBasicInterface[]) => {
        if(addedUsers?.length === 0 && removedUsers?.length === 0) {
            return;
        }
        
        const addedUserIds: string[] = [];
        const removedUserIds: string[] = [];

        for (const selectedUser of addedUsers) {
            addedUserIds.push(selectedUser.id);
        }

        for (const selectedUser of removedUsers) {
            removedUserIds.push(selectedUser.id);
        }

        const operations: ScimOperationsInterface[] = [];

        if(addedUserIds?.length > 0) {
            operations.push({
                "op": "ADD",
                "path": "users",
                "value": addedUserIds
            });
        }

        if(removedUserIds?.length > 0) {
            removedUserIds.forEach((userId: string) => {
                operations.push({
                    "op": "REMOVE",
                    "path": "users[ value eq " + userId + " ]]"
                });
            });
        }

        const payload: {
            operations: ScimOperationsInterface[];
        } = { operations: operations };

        setIsSubmitting(true);

        try {
            await patchOrganizationRoleDetails(currentOrganization.id, roleObject.id, payload);
            handleAlerts({
                description: t("console:manage.features.roles.notifications.updateRole.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("console:manage.features.roles.notifications.updateRole.success.message")
            });
            onRoleUpdate();
        } catch (error) {
            handleAlerts({
                description: t("console:manage.features.roles.notifications.updateRole.error.description"),
                level: AlertLevels.ERROR,
                message: t("console:manage.features.roles.notifications.updateRole.error.message")
            });
        } finally {
            setIsSubmitting(false);
        }
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
            isSubmitting={ isSubmitting }
        />
    );
};
