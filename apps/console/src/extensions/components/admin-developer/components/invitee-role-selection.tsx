/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { getRolesList } from "@wso2is/core/api";
import { RolesInterface, TestableComponentInterface } from "@wso2is/core/models";
import {
    Heading,
    LinkButton,
    PrimaryButton,
    TransferComponent,
    TransferList,
    TransferListItem
} from "@wso2is/react-components";
import escapeRegExp from "lodash-es/escapeRegExp";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Modal } from "semantic-ui-react";
import { UserInviteInterface } from "../models";

interface InviteeRoleSelectionPropsInterface extends TestableComponentInterface {
    invitee: UserInviteInterface;
    showSelectionModal: boolean;
    handleSelectionModalClose: () => void;
    handleInviteeRolesUpdate: (inviteeID: string, RoleList: string[]) => void;
}

/**
 * Invitee role selection component.
 *
 * @param {InviteeRoleSelectionPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const InviteeRoleSelection: FunctionComponent<InviteeRoleSelectionPropsInterface> = (
    props: InviteeRoleSelectionPropsInterface
): ReactElement => {

    const {
        invitee,
        showSelectionModal,
        handleSelectionModalClose,
        handleInviteeRolesUpdate,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();

    const [ roleList, setRoleList ] = useState<RolesInterface[]>(undefined);
    const [ filteredRoleList, setFilteredRoleList ] = useState<RolesInterface[]>(undefined);
    const [ selectedRoles, setSelectedRoles ] = useState<string[]>(undefined);
    const [ roleListRequestLoading, setRoleListRequestLoading ] = useState<boolean>(false);
    const [ isAllRoleListSelected, setIsAllRoleListSelected ] = useState<boolean>(false);

    /**
     * Set the available role list in the system to the state.
     */
    useEffect(() => {
        const roleList: RolesInterface[] = [];

        setRoleListRequestLoading(true);
        getRolesList(null)
            .then((response) => {
                response.data.Resources.map((role: RolesInterface) => {
                    if (role.displayName !== "system" && role.displayName !== "everyone") {
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
            roleList.map((role) => {
                selectedRoleList.push(role.displayName);
            });
            setSelectedRoles(selectedRoleList);
        } else {
            setSelectedRoles([]);
        }
    }, [ isAllRoleListSelected ]);

    /**
     * Handle select all roles checkbox action.
     */
    const handleSelectAllRoleList = () => {
        setIsAllRoleListSelected(!isAllRoleListSelected);
    };

    /**
     * Handle the role selection checkbox change.
     */
    const handleRoleSelection = (roleName: string) => {
        const selectedRoleList: string[] = [ ...selectedRoles ];

        if (selectedRoles?.includes(roleName)) {
            selectedRoleList.splice(selectedRoleList.indexOf(roleName), 1);
        } else {
            selectedRoleList.push(roleName);
        }

        setSelectedRoles(selectedRoleList);
    };

    const handleRoleListSearch = (e, { value }) => {
        if (!isEmpty(value)) {
            let isMatch = false;
            const filteredRoles = [];
            const re = new RegExp(escapeRegExp(value), "i");

            roleList && roleList?.map((role) => {
                const roleName = role?.displayName?.split("/").length > 1
                    ? role.displayName.split("/")[1]
                    : role.displayName;
                isMatch = re.test(roleName);
                if (isMatch) {
                    filteredRoles.push(role);
                    setFilteredRoleList(filteredRoles);
                }
            });
        } else {
            setFilteredRoleList(roleList);
        }
    };

    return (
        <Modal
            open={ showSelectionModal }
            size="small"
            className="user-roles attribute-modal"
            dimmer="blurring"
        >
            <Modal.Header>
                { t("console:manage.features.invite.rolesUpdateModal.header") }
                <Heading subHeading ellipsis as="h6">
                    { t("console:manage.features.invite.rolesUpdateModal.subHeader") }
                </Heading>
            </Modal.Header>
            <Modal.Content>
                <TransferComponent
                    selectionComponent
                    searchPlaceholder={ t("console:manage.features.invite.rolesUpdateModal.searchPlaceholder") }
                    handleHeaderCheckboxChange={ handleSelectAllRoleList }
                    isHeaderCheckboxChecked={ isAllRoleListSelected }
                    handleUnelectedListSearch={ handleRoleListSearch }
                    data-testid={ `${ testId }-transfer-component` }
                >
                    <TransferList
                        selectionComponent
                        isListEmpty={ !(roleList?.length > 0) }
                        listType="unselected"
                        data-testid={ `${ testId }-unselected-transfer-list` }
                        emptyPlaceholderDefaultContent={ t("console:manage.features.transferList.list."
                            + "emptyPlaceholders.default") }
                    >
                        {
                            filteredRoleList?.map((role, index) => {
                                return (
                                    <TransferListItem
                                        handleItemChange={ () => handleRoleSelection(role?.displayName) }
                                        key={ index }
                                        listItem={ role?.displayName }
                                        listItemId={ role?.id }
                                        listItemIndex={ role?.id }
                                        isItemChecked={ selectedRoles?.includes(role?.displayName) }
                                        showSecondaryActions={ false }
                                        showListSubItem={ true }
                                        listSubItem={ null }
                                        data-testid={ `${ testId }-unselected-transfer-list-item-${ index }` }
                                    />
                                );
                            })
                        }
                    </TransferList>
                </TransferComponent>
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
                            <PrimaryButton
                                data-testid="group-mgt-update-roles-modal-save-button"
                                floated="right"
                                onClick={ () => handleInviteeRolesUpdate(invitee?.id, selectedRoles) }
                            >
                                { t("common:save") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};
