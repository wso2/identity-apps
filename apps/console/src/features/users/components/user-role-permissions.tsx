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
import { LinkButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, Grid, Modal } from "semantic-ui-react";
import { AppConstants, AppState, history } from "../../core";
import { getOrganizationRoleById } from "../../organizations/api";
import { OrganizationUtils } from "../../organizations/utils";
import { PermissionList, getRoleById } from "../../roles";

/**
 * Proptypes for the user role permission component.
 */
interface UserRolePermissionsInterface extends TestableComponentInterface {
    openRolePermissionModal: boolean;
    handleCloseRolePermissionModal: () => void;
    roleId: string;
    /**
     * Permissions to hide.
     */
    permissionsToHide?: string[];
}

/**
 *  User roles permission component.
 *
 * @param {UserRolePermissionsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const UserRolePermissions: FunctionComponent<UserRolePermissionsInterface> = (
    props: UserRolePermissionsInterface
): ReactElement => {

    const {
        openRolePermissionModal,
        handleCloseRolePermissionModal,
        roleId,
        permissionsToHide,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ isRoleSet, setRoleCheck ] = useState(false);
    const [ role, setRole ] = useState<RolesInterface>();

    const currentOrganization = useSelector((state: AppState) => state.organization.organization);
    const isRootOrganization = useMemo(() =>
        OrganizationUtils.isRootOrganization(currentOrganization), [ currentOrganization ]);

    /**
     * The following useEffect is triggered when the passed
     * role id is changed.
     */
    useEffect(() => {
        if (!roleId) {
            return;
        }

        if (roleId) {
            if (isRootOrganization) {
                getRoleById(roleId)
                    .then((response) => {
                        setRoleCheck(false);
                        setRole(response.data);
                    });
            } else {
                getOrganizationRoleById(currentOrganization.id, roleId)
                    .then((response) => {
                        setRoleCheck(false);
                        setRole(response.data);
                    });
            }
        }
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

    /**
     * Redirect to the relevant role's edit page.
     */
    const handleEditPermissions = () => {
        history.push(AppConstants.getPaths().get("ROLE_EDIT").replace(":id", roleId));
    };

    return (
        isRoleSet && (
            <Modal
                data-testid={ testId }
                open={ openRolePermissionModal }
                size="small"
                className="user-roles"
            >
                <Modal.Header>
                    {
                        t("console:manage.features.user.updateUser.roles.viewPermissionModal.heading",
                            { role: role.displayName })
                    }
                </Modal.Header>
                <Modal.Content image>
                    <div className="permissions-edit-container fluid">
                        <PermissionList
                            isReadOnly={ true }
                            emphasize={ false }
                            isEdit={ false }
                            permissionsToHide={ permissionsToHide }
                            isRole
                            roleObject={ role }
                        />
                    </div>
                </Modal.Content>
                <Modal.Actions>
                    <Grid>
                        <Grid.Row column={ 2 }>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <LinkButton
                                    data-testid={ `${ testId }-back-button` }
                                    floated="left"
                                    onClick={ handleCloseRolePermissionModal }
                                >
                                    Cancel
                                </LinkButton>
                            </Grid.Column>
                            <Grid.Column floated="right" mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <Button
                                    data-testid={ `${ testId }-edit-button` }
                                    color="orange"
                                    basic
                                    onClick={ () => handleEditPermissions() }
                                >
                                    { t("console:manage.features.user.updateUser.roles.viewPermissionModal." +
                                        "editButton") }
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Actions>
            </Modal>
        )
    );
};
