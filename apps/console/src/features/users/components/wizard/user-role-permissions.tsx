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
 * under the License.
 */

import { RolesInterface, TestableComponentInterface } from "@wso2is/core/models";
import { Heading, LinkButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Icon, Segment } from "semantic-ui-react";
import { PermissionList, getRoleById } from "../../../roles";

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
 * @param {RolePermissionsInterface} props - Props injected to the component.
 * @return {ReactElement}
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
                .then((response) => {
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
