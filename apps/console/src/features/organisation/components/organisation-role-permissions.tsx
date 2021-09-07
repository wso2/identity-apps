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
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Modal } from "semantic-ui-react";
// import { PermissionList, getRoleById } from "../../roles";

/**
 * Proptypes for the user role permission component.
 */
interface UserRolePermissionsInterface extends TestableComponentInterface {
    openRolePermissionModal: boolean;
    handleCloseRolePermissionModal: () => void;
    roleId: string;
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
            // getRoleById(roleId)
            //     .then((response) => {
            //         setRoleCheck(false);
            //         setRole(response.data);
            //     });
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
                        t("adminPortal:components.user.updateUser.roles.viewPermissionModal.heading",
                            { role: role.displayName })
                    }
                </Modal.Header>
                <Modal.Content image>
                    <div className="permissions-edit-container">
                        {/* <PermissionList isEdit={ false } isRole roleObject={ role }/> */}
                        <></>
                    </div>
                </Modal.Content>
                <Modal.Actions>
                    <Grid>
                        <Grid.Row column={ 1 }>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <LinkButton
                                    data-testid={ `${ testId }-back-button` }
                                    floated="left"
                                    onClick={ handleCloseRolePermissionModal }
                                >
                                    Cancel
                                </LinkButton>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Actions>
            </Modal>
        )
    )
};
