/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { RolesInterface, TestableComponentInterface } from "@wso2is/core/models";
import {
    DocumentationLink,
    EmphasizedSegment,
    Heading,
    LinkButton,
    PrimaryButton,
    useDocumentation
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Form, Grid, Modal } from "semantic-ui-react";
import { getRolesList } from "../../../../../features/roles/api";
import { UserInviteInterface } from "../../../../../features/users/models";

interface InviteeRoleSelectionPropsInterface extends TestableComponentInterface {
    invitee: UserInviteInterface;
    showSelectionModal: boolean;
    handleSelectionModalClose: () => void;
    handleInviteeRolesUpdate: (inviteeID: string, RoleList: string[]) => void;
    readOnly: boolean;
    /**
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
}

/**
 * Invitee role selection component.
 *
 * @param props - Props injected to the component.
 *
 * @returns invitee role selection component.
 */
export const InviteeRoleSelection: FunctionComponent<InviteeRoleSelectionPropsInterface> = (
    props: InviteeRoleSelectionPropsInterface
): ReactElement => {

    const {
        invitee,
        showSelectionModal,
        handleSelectionModalClose,
        handleInviteeRolesUpdate,
        readOnly,
        isSubmitting
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const [ roleList, setRoleList ] = useState<RolesInterface[]>(undefined);
    const [ , setFilteredRoleList ] = useState<RolesInterface[]>(undefined);
    const [ selectedRoles, setSelectedRoles ] = useState<string[]>(undefined);
    const [ , setRoleListRequestLoading ] = useState<boolean>(false);
    const [ isAllRoleListSelected ] = useState<boolean>(false);

    /**
     * Set the available role list in the system to the state.
     */
    useEffect(() => {
        const roleList: RolesInterface[] = [];

        setRoleListRequestLoading(true);
        getRolesList(null)
            .then((response: any) => {
                response.data.Resources.map((role: RolesInterface) => {
                    if (role.displayName !== "system" &&
                        role.displayName !== "everyone" &&
                        role.displayName !== "selfsignup") {
                        roleList.push(role);
                    }
                });
                setRoleList(roleList);
                setFilteredRoleList(roleList);
            })
            .finally(() => {
                setRoleListRequestLoading(false);
            });
    }, []);

    /**
     * Set the initially selected roles in the state.
     */
    useEffect(() => {
        if (!invitee?.roles) {
            return;
        }

        setSelectedRoles(invitee.roles);
    }, [ invitee?.roles ]);

    /**
     * Select all selected roles
     */
    useEffect(() => {
        if (isAllRoleListSelected) {
            const selectedRoleList: string[] = [ ...invitee?.roles ];

            roleList.map((role: RolesInterface) => {
                selectedRoleList.push(role.displayName);
            });
            setSelectedRoles(selectedRoleList);
        } else {
            setSelectedRoles([]);
        }
    }, [ isAllRoleListSelected ]);

    /**
     * Handle the role selection checkbox change.
     */
    const handleRoleSelection = (roleName: string) => {
        const checkedRoles: string[] = [];

        checkedRoles.push(roleName);
        setSelectedRoles(checkedRoles);
    };

    return (
        <Modal
            open={ showSelectionModal }
            size="small"
            className="user-roles attribute-modal"
            dimmer="blurring"
        >
            <Modal.Header>
                { t("invite:rolesUpdateModal.header") }
                <Heading subHeading ellipsis as="h6">
                    { t("invite:rolesUpdateModal.subHeader") }
                    <DocumentationLink
                        link={ getLink("manage.users.collaboratorAccounts.roles.learnMore") }
                    >
                        { t("extensions:common.learnMore") }
                    </DocumentationLink>
                </Heading>
            </Modal.Header>
            <Modal.Content>
                <EmphasizedSegment>
                    <Form.Group>
                        <Divider hidden />
                        {
                            roleList?.map((role: RolesInterface, index: number) => {
                                const roleName: string[] = role?.displayName?.split("/");

                                if (
                                    roleName?.length >= 1 &&
                                    !roleName.includes("everyone") &&
                                    !roleName.includes("system") &&
                                    !roleName.includes("selfsignup")
                                ) {
                                    return (
                                        <>
                                            <Form.Radio
                                                onChange={ () => handleRoleSelection(role?.displayName) }
                                                key={ index }
                                                label={
                                                    roleName?.length > 1
                                                        ? roleName[ 1 ]
                                                        : roleName[ 0 ]
                                                }
                                                checked={ selectedRoles.includes(role?.displayName) }
                                                data-testid={
                                                    "user-mgt-update-roles-" +
                                                    "modal-unselected-roles"
                                                }
                                                readOnly={ readOnly }
                                            />
                                            <Divider hidden />
                                        </>
                                    );
                                }
                            })
                        }
                    </Form.Group>
                </EmphasizedSegment>
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 2 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                data-testid="group-mgt-update-roles-modal-cancel-button"
                                floated="left"
                                onClick={ handleSelectionModalClose }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { !readOnly && (
                                <PrimaryButton
                                    data-testid="group-mgt-update-roles-modal-save-button"
                                    floated="right"
                                    onClick={ () => handleInviteeRolesUpdate(invitee?.id, selectedRoles) }
                                    loading={ isSubmitting }
                                    disabled={ isSubmitting }

                                >
                                    { t("common:save") }
                                </PrimaryButton>
                            )
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};
