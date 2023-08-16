/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { RoleConstants } from "@wso2is/core/constants";
import { RolesInterface, SBACInterface } from "@wso2is/core/models";
import { ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BasicRoleDetails } from "./edit-role-basic";
import { RolePermissionDetails } from "./edit-role-permission";
import { RoleUserDetails } from "./edit-role-users";
import { FeatureConfigInterface, history } from "../../../../../features/core";

/**
 * Captures props needed for edit role component
 */
interface EditRoleProps extends SBACInterface<FeatureConfigInterface> {
    roleId: string;
    roleObject: RolesInterface;
    onRoleUpdate: () => void;
    readOnlyUserStores?: string[];
}

/**
 * Component which will allow editing of a selected role.
 *
 * @param props contains role details to be edited.
 */
export const EditRole: FunctionComponent<EditRoleProps> = (props: EditRoleProps): ReactElement => {

    const {
        roleObject,
        onRoleUpdate
    } = props;

    const { t } = useTranslation();

    const [ isGroup, setIsGroup ] = useState<boolean>(false);
    const [ isAdminRole, setIsAdminRole ] = useState<boolean>(false);

    /**
     * Get is groups url to proceed as groups
     */
    useEffect(() => {
        if(!roleObject) {
            return;
        }

        setIsGroup(history.location.pathname.includes("/groups/"));

    }, [ roleObject ]);

    /**
     * Set the if the role is `Internal/admin`.
     */
    useEffect(() => {
        if(!roleObject) {
            return;
        }

        setIsAdminRole(roleObject.displayName === RoleConstants.ADMIN_ROLE ||
            roleObject.displayName === RoleConstants.ADMIN_GROUP);

    }, [ roleObject ]);

    const resolveResourcePanes = () => {
        const panes = [
            {
                menuItem: "General",
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <BasicRoleDetails
                            isReadOnly={ isAdminRole }
                            data-testid="role-mgt-edit-role-basic"
                            isGroup={ isGroup }
                            roleObject={ roleObject }
                            onRoleUpdate={ onRoleUpdate }
                        />
                    </ResourceTab.Pane>
                )
            },
            {
                menuItem: t("console:manage.features.roles.edit.menuItems.permissions"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <RolePermissionDetails
                            isReadOnly={ isAdminRole }
                            data-testid="role-mgt-edit-role-permissions"
                            isGroup={ false }
                            roleObject={ roleObject }
                            onRoleUpdate={ onRoleUpdate }
                        />
                    </ResourceTab.Pane>
                )
            },
            {
                menuItem: t("console:manage.features.roles.edit.menuItems.users"),
                render: () => (
                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                        <RoleUserDetails
                            data-testid="role-mgt-edit-role-users"
                            isGroup={ false }
                            roleObject={ roleObject }
                            onRoleUpdate={ onRoleUpdate }
                        />
                    </ResourceTab.Pane>
                )
            }
        ];

        return panes;
    };

    return (
        <ResourceTab panes={ resolveResourcePanes() } />
    );
};
