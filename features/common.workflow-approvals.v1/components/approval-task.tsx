/**
 * Copyright (c) 2019-2025, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { LinkButton, Media, Popup, Text, useMediaContext } from "@wso2is/react-components";
import moment from "moment";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import {
    Button,
    Divider,
    Grid,
    Header,
    Label,
    List,
    ListItem,
    Modal,
    SemanticCOLORS,
    Table
} from "semantic-ui-react";
import { ApprovalStatus, ApprovalTaskDetails } from "../models";

/**
 * Prop-types for the approvals edit page component.
 */
interface ApprovalTaskComponentPropsInterface extends IdentifiableComponentInterface {
    /**
     * The selected approval task.
     */
    approval: ApprovalTaskDetails;
    /**
     * Open the approval task modal.
     */
    openApprovalTaskModal: boolean;
    /**
     * Function to handle closing the modal.
     */
    onCloseApprovalTaskModal: () => void;
    /**
     * Function to update the approval task status.
     * @param id - Id of the approval.
     * @param status - Status of the approval.
     */
    updateApprovalStatus: (
        id: string,
        status: ApprovalStatus.CLAIM | ApprovalStatus.RELEASE | ApprovalStatus.APPROVE | ApprovalStatus.REJECT
    ) => void;
    /**
     * Resolve the label color of the task.
     * @param status - Status of the approval.
     */
    resolveApprovalTagColor?: (
        status: ApprovalStatus.READY | ApprovalStatus.RESERVED | ApprovalStatus.BLOCKED |
            ApprovalStatus.APPROVED | ApprovalStatus.REJECTED
    ) => SemanticCOLORS;
    /**
     * Specifies if the form is submitting
     */
    isSubmitting?: boolean;
}

/**
 * Approvals task component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Approval Task component.
 */
export const ApprovalTaskComponent: FunctionComponent<ApprovalTaskComponentPropsInterface> = (
    props: ApprovalTaskComponentPropsInterface
): ReactElement => {

    const {
        approval,
        resolveApprovalTagColor,
        updateApprovalStatus,
        openApprovalTaskModal,
        onCloseApprovalTaskModal,
        isSubmitting,
        [ "data-componentid" ]: componentId = "approval-task"
    } = props;

    const { t } = useTranslation();
    const { isMobileViewport } = useMediaContext();

    const USERS_TO_BE_ADDED_PROPERTY: string = "Users to be Added";
    const USERS_TO_BE_DELETED_PROPERTY: string = "Users to be Deleted";
    const ROLE_NAME_PROPERTY: string = "Role Name";
    const roleUserAssignmentPropertyKeys: string[] = [ USERS_TO_BE_ADDED_PROPERTY, USERS_TO_BE_DELETED_PROPERTY ];

    /**
     * Filters and returns valid username values from a comma-separated string.
     *
     * @param value - Comma-separated string of usernames.
     * @returns Array of valid usernames.
     */
    const filterValidUsernamePropertyValues = (value: string): string[] => {
        return value.split(",")
            .map((username: string) => username.trim())
            .filter((username: string) => {
                return username &&
                       username !== "null" &&
                       username !== "undefined" &&
                       username !== "[]" &&
                       username !== "";
            });
    };

    /**
     * Checks if the approval task user related properties have valid users.
     */
    const hasValidUsers: boolean = React.useMemo(() => {
        if (!approval?.properties) return true;

        const userProperties: { key: string, value: string }[] = approval.properties.filter(
            (prop: { key: string, value: string }) => roleUserAssignmentPropertyKeys.includes(prop?.key)
        );

        if (userProperties.length === 0) return true;

        return userProperties.some((prop: { key: string, value: string }) => {
            const validUsernames: string[] = filterValidUsernamePropertyValues(prop.value);

            return validUsernames.length > 0;
        });
    }, [ approval?.properties ]);

    /**
     * Checks if any resource (like role) has been deleted.
     */
    const isResourceDeleted: boolean = React.useMemo(() => {
        if (!approval?.properties) return false;

        return approval.properties.some((prop: { key: string, value: string }) => {
            return prop.key === ROLE_NAME_PROPERTY && prop.value === "";
        });
    }, [ approval?.properties ]);

    /**
     * Removes unnecessary commas at the end of property values and splits
     * up the claim values.
     *
     * @remarks
     * The API returns properties as key value pairs and these values often contains
     * unnecessary commas at the end. This function will cleanup the values and it can
     * be removed once the API is fixed.
     *
     * @param key - Property key.
     * @param value - Property value.
     * @returns A cleaned up string.
     */
    const populateProperties = (key: string, value: string): string | JSX.Element => {
        if (key === ROLE_NAME_PROPERTY && value === "") {
            value = t("common:approvalsPage.propertyMessages.roleDeleted");
        }

        if (key === "Claims" || value === "[]" || value === "") {
            return;
        }

        if (key === "ClaimsUI") {
            // Remove the curly braces at the start and end of the value.
            value = value.replace(/^\{|\}$/g, "").trim();
            const claims: string[] = value.split(",");

            return (
                <>
                    { claims.map((claim: string, index: number) => {
                        const claimParts: string[] = claim.split("=");
                        const claimDisplayName: string = claimParts[0]?.trim();
                        const claimValue: string = claimParts[1]?.trim();

                        return (
                            <Table.Row key={ `${key}-${index}` }>
                                <Table.Cell className="key-cell">
                                    { claimDisplayName }
                                </Table.Cell>
                                <Table.Cell collapsing className="values-cell">
                                    <Popup
                                        content={ claimValue }
                                        trigger={ (
                                            <Text truncate>
                                                { claimValue }
                                            </Text>
                                        ) }
                                        position="top left"
                                        inverted
                                    />
                                </Table.Cell>
                            </Table.Row>
                        );
                    }) }
                </>
            );
        }

        if (key === "Roles" || key == "Permissions" || key === "Groups" || key === "Users") {
            value = value.replace(/^\[|\]$/g, "").trim();

            try {
                const valueList: string[] = value.split(",");

                return (
                    <Table.Row key={ key }>
                        <Table.Cell className="key-cell">
                            { key }
                        </Table.Cell>
                        <Table.Cell collapsing className="values-cell">
                            <List className="values-list">
                                { valueList.map((item: string, index: number) => (
                                    <ListItem key={ index }>
                                        <Text truncate>{ item.trim() }</Text>
                                    </ListItem>
                                )) }
                            </List>
                        </Table.Cell>
                    </Table.Row>
                );
            } catch(e) {
                // Let it pass through and use the default behavior.
                // Add debug logs here one a logger is added.
                // Tracked here https://github.com/wso2/product-is/issues/11650.
            }
        }

        // Check if usernames are valid.
        if (roleUserAssignmentPropertyKeys.includes(key)) {
            const validUsernames: string[] = filterValidUsernamePropertyValues(value);

            if (validUsernames.length > 0) {
                value = validUsernames.join(", ");
            } else {
                if (key === USERS_TO_BE_ADDED_PROPERTY) {
                    value = t("common:approvalsPage.propertyMessages.assignedUsersDeleted");
                } else if (key === USERS_TO_BE_DELETED_PROPERTY) {
                    value = t("common:approvalsPage.propertyMessages.unassignedUsersDeleted");
                }
            }
        }

        // Handle other properties that don't need special formatting.
        return (
            <Table.Row key={ key }>
                <Table.Cell className="key-cell">
                    { key }
                </Table.Cell>
                <Table.Cell collapsing className="values-cell">
                    <Text truncate>{ value.endsWith(",") ? value.slice(0, -1) : value }</Text>
                </Table.Cell>
            </Table.Row>
        );
    };

    /**
     * Properties table sub component.
     *
     * @param properties - List of properties.
     * @returns A table containing the list of properties.
     */
    const propertiesTable = (properties: { key: string, value: string }[]): JSX.Element => (
        <Table celled compact className="approval-tasks-table" verticalAlign="top">
            <Table.Body>
                {
                    properties.map((property: { key: string, value: string }) => (
                        property.key && (property.key === ROLE_NAME_PROPERTY || property.value)
                            ? (
                                populateProperties(property.key, property.value)
                            )
                            : null
                    )
                    )
                }
            </Table.Body>
        </Table>
    );

    /**
     * Button panel sub component to perform approval status changes.
     *
     * @param editingApproval - The editing approval.
     * @returns A panel containing all the possible action buttons.
     */
    const approvalActions = (editingApproval: ApprovalTaskDetails): JSX.Element => (
        <>
            {
                editingApproval?.taskStatus === ApprovalStatus.READY
                    ? (
                        <Button
                            default
                            className="mb-1x"
                            fluid={ isMobileViewport }
                            onClick={ () => {
                                updateApprovalStatus(editingApproval.id, ApprovalStatus.CLAIM);
                                onCloseApprovalTaskModal();
                            } }
                        >
                            { t("common:claim") }
                        </Button>
                    )
                    : editingApproval?.taskStatus === ApprovalStatus.RESERVED
                        ? (
                            <Button
                                default
                                className="mb-1x"
                                fluid={ isMobileViewport }
                                onClick={ () => {
                                    updateApprovalStatus(editingApproval.id, ApprovalStatus.RELEASE);
                                    onCloseApprovalTaskModal();
                                } }
                            >
                                { t("common:release") }
                            </Button>
                        )
                        : null
            }
            {
                editingApproval?.taskStatus != ApprovalStatus.BLOCKED
                    ? (
                        <>
                            <Button
                                primary
                                className="mb-1x"
                                fluid={ isMobileViewport }
                                onClick={ () => {
                                    updateApprovalStatus(editingApproval.id, ApprovalStatus.APPROVE);
                                    onCloseApprovalTaskModal();
                                } }
                                loading={ isSubmitting }
                                disabled={ isSubmitting || !hasValidUsers || isResourceDeleted }
                            >
                                { t("common:approve") }
                            </Button>
                            <Button
                                negative
                                className="mb-1x"
                                fluid={ isMobileViewport }
                                onClick={ () => {
                                    updateApprovalStatus(editingApproval.id, ApprovalStatus.REJECT);
                                    onCloseApprovalTaskModal();
                                } }
                            >
                                { t("common:reject") }
                            </Button>
                        </>
                    )
                    : null
            }
        </>
    );

    return (
        <Modal
            open={ openApprovalTaskModal }
            closeOnDimmerClick={ true }
            dimmer
        >
            <Modal.Header>
                <Header as="h4" image data-componentid={ `${ componentId }-item-heading` }>
                    <Header.Content>
                        { t("common:approvalsPage.modals.header") }
                        <Header.Subheader>
                            <Label
                                circular
                                size="mini"
                                className="micro spaced-right"
                                color={
                                    resolveApprovalTagColor &&
                                    (
                                        approval?.taskStatus === ApprovalStatus.READY ||
                                        approval?.taskStatus === ApprovalStatus.RESERVED ||
                                        approval?.taskStatus === ApprovalStatus.APPROVED ||
                                        approval?.taskStatus === ApprovalStatus.REJECTED ||
                                        approval?.taskStatus === ApprovalStatus.BLOCKED
                                    )
                                        ? resolveApprovalTagColor(approval?.taskStatus)
                                        : undefined
                                }
                            />

                            { t("common:approvalsPage.modals.subHeader") }
                        </Header.Subheader>
                    </Header.Content>
                </Header>
            </Modal.Header>
            <Modal.Content>
                <Grid.Row>
                    <Grid.Column>
                        <List.Content>
                            <Grid padded>
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column width={ 3 }>
                                        { t("common:createdOn") }
                                    </Grid.Column>
                                    <Grid.Column width={ 12 }>
                                        <List.Description>
                                            {
                                                moment(parseInt(approval?.createdTimeInMillis,
                                                    10)).format("lll")
                                            }
                                        </List.Description>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </List.Content>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <List.Content>
                            <Grid padded>
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column width={ 3 }>
                                        { t("common:description") }
                                    </Grid.Column>
                                    <Grid.Column width={ 12 }>
                                        <List.Description>
                                            {
                                                approval?.description
                                                    ? approval?.description
                                                    : t("common:approvalsPage.modals.description")
                                            }
                                        </List.Description>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </List.Content>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <List.Content>
                            <Grid padded>
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column width={ 3 }>
                                        { t("common:initiator") }
                                    </Grid.Column>
                                    <Grid.Column width={ 12 }>
                                        <List.Description>
                                            { approval?.initiator }
                                        </List.Description>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </List.Content>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <List.Content>
                            <Grid padded>
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column width={ 3 }>
                                        { t("common:approvalStatus") }
                                    </Grid.Column>
                                    <Grid.Column width={ 12 }>
                                        <List.Description>
                                            { approval?.approvalStatus }
                                        </List.Description>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </List.Content>
                    </Grid.Column>
                </Grid.Row>
                {
                    approval?.properties
                        ? (
                            <Grid.Row>
                                <Grid.Column>
                                    <List.Content>
                                        <Grid padded>
                                            <Grid.Row columns={ 2 }>
                                                <Grid.Column width={ 3 }>
                                                    { t("common:properties") }
                                                </Grid.Column>
                                                <Grid.Column mobile={ 16 } computer={ 12 }>
                                                    <Media lessThan="tablet">
                                                        <Divider hidden />
                                                    </Media>
                                                    { propertiesTable(approval?.properties) }
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </List.Content>
                                </Grid.Column>
                            </Grid.Row>
                        )
                        : null
                }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <LinkButton
                                floated="left"
                                onClick={ onCloseApprovalTaskModal }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                            {
                                approval?.taskStatus !== ApprovalStatus.APPROVED &&
                                approval?.taskStatus !== ApprovalStatus.REJECTED
                                    ? (
                                        <>{ approvalActions(approval) }</>
                                    )
                                    : null
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};
