/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { RolesInterface, TestableComponentInterface } from "@wso2is/core/models";
import { Heading, LinkButton } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Icon, Segment } from "semantic-ui-react";
import { getRoleById } from "../../../roles/api/roles";
import { PermissionList } from "../../../roles/components/wizard/role-permission";

/**
 * Proptypes for the role permission component.
 */
interface RolePermissionsInterface extends TestableComponentInterface {
    roleId: string;
    handleNavigateBack: () => void;
    handleViewNextButton?: (show: boolean) => void;
}

/**
 *  Roles permission component.
 *
 * @param props - Props injected to the component.
 * @returns Roles permission component.
 */
export const RolePermissions: FunctionComponent<RolePermissionsInterface> = (
    props: RolePermissionsInterface
): ReactElement => {

    const {
        roleId,
        handleNavigateBack,
        handleViewNextButton,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ isRoleSet, setRoleCheck ] = useState(false);
    const [ role, setRole ] = useState<RolesInterface>();

    /**
     * The following useEffect is triggered when the passed
     * role id is changed.
     */
    useEffect(() => {
        if (!roleId) {
            return;
        }

        if (roleId) {
            getRoleById(roleId)
                .then((response: AxiosResponse) => {
                    setRoleCheck(false);
                    setRole(response.data);
                });
        }
        handleViewNextButton(false);
    }, [ roleId ]);

    /**
     * The following useEffect is triggered when the role
     * object is reassigned.
     */
    useEffect(() => {
        if (!role) {
            return;
        }

        setRoleCheck(true);
    }, [ role ]);

    return (
        isRoleSet && (
            <>
                <Heading as="h5">
                    {
                        t("console:manage.features.user.updateUser.roles.viewPermissionModal.heading",
                            { role: role.displayName })
                    }
                </Heading>
                <Divider hidden/>
                <LinkButton
                    data-testid={ `${ testId }_back_button` }
                    floated="left"
                    onClick={ handleNavigateBack }
                >
                    <Icon name="arrow left"/>
                    { t("console:manage.features.user.updateUser.roles.viewPermissionModal.backButton") }
                </LinkButton>
                <Divider hidden/>
                <Divider hidden/>
                <Segment data-testid={ testId }>
                    <div className="permissions-edit-container">
                        <PermissionList emphasize={ false } isReadOnly isEdit={ false } isRole roleObject={ role }/>
                    </div>
                </Segment>
            </>
        )
    );
};
