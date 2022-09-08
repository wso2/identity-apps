/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { LinkButton, Media, useMediaContext } from "@wso2is/react-components";
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
    Modal,
    SemanticCOLORS,
    Table
} from "semantic-ui-react";
import { ApprovalStatus, ApprovalTaskDetails } from "../models";

/**
 * Prop-types for the approvals edit page component.
 */
interface ApprovalTaskComponentPropsInterface extends TestableComponentInterface {
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
        status: ApprovalStatus.READY | ApprovalStatus.RESERVED | ApprovalStatus.COMPLETED
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
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const { isMobileViewport } = useMediaContext();

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
    const cleanupPropertyValues = (key: string, value: string): string | JSX.Element => {
        if (key === "Claims") {
            const claims = value.split(",");

            return (
                <List className="values-list" items={ claims } />
            );
        }

        if (key === "Roles") {

            try {
                const roles: string[] = value.split(",");

                return <List className="values-list" items={ roles } />;
            } catch(e) {
                // Let it pass through and use the default behavior.
                // Add debug logs here one a logger is added.
                // Tracked here https://github.com/wso2/product-is/issues/11650.
            }
        }

        const lastChar = value.substr(value.length - 1);

        if (lastChar !== ",") {
            return value;
        }

        return value.slice(0, -1);
    };

    /**
     * Assignees table sub component.
     *
     * @param assignees - List of assignees.
     * @returns - A table containing the list of assignees.
     */
    const assigneesTable = (assignees): JSX.Element => (
        <Table celled compact className="edit-segment-table">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>
                        { t("common:type") }
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        { t("common:assignee") }
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    assignees.map((assignee, i) => (
                        <Table.Row key={ i }>
                            <Table.Cell className="key-cell">
                                { assignee.key }
                            </Table.Cell>
                            <Table.Cell className="values-cell">
                                { assignee.value }
                            </Table.Cell>
                        </Table.Row>
                    ))
                }
            </Table.Body>
        </Table>
    );

    /**
     * Properties table sub component.
     *
     * @param properties - List of properties.
     * @returns A table containing the list of properties.
     */
    const propertiesTable = (properties): JSX.Element => (
        <Table celled compact className="edit-segment-table" verticalAlign="top">
            <Table.Body>
                {
                    properties.map((property, i) => (
                        property.key && property.value
                            ? (
                                <Table.Row key={ i }>
                                    <Table.Cell className="key-cell">
                                        { t("console:manage.features.approvals.modals.approvalProperties." +
                                        `${ property.key }`) }
                                    </Table.Cell>
                                    <Table.Cell collapsing className="values-cell">
                                        { cleanupPropertyValues(property.key, property.value) }
                                    </Table.Cell>
                                </Table.Row>
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
    const approvalActions = (editingApproval): JSX.Element => (
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
                    : (
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
            }
            <Button
                primary
                className="mb-1x"
                fluid={ isMobileViewport }
                onClick={ () => {
                    updateApprovalStatus(editingApproval.id, ApprovalStatus.APPROVE);
                    onCloseApprovalTaskModal();
                } }
                loading={ isSubmitting }
                disabled={ isSubmitting }
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
    );

    return (
        <Modal
            open={ openApprovalTaskModal }
            closeOnDimmerClick={ true }
            dimmer
        >
            <Modal.Header>
                <Header as="h4" image data-testid={ `${ testId }-item-heading` }>
                    <Header.Content>
                        { t("console:manage.features.approvals.modals.taskDetails.header") }
                        <Header.Subheader>
                            <Label
                                circular
                                size="mini"
                                className="micro spaced-right"
                                color={ resolveApprovalTagColor(approval?.taskStatus) }
                            />
                            { approval?.id + " " + approval?.subject + " " }
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
                                    <Grid.Column width={ 5 }>
                                        { t("common:createdOn") }
                                    </Grid.Column>
                                    <Grid.Column width={ 11 }>
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
                                    <Grid.Column width={ 5 }>
                                        { t("common:description") }
                                    </Grid.Column>
                                    <Grid.Column width={ 11 }>
                                        <List.Description>
                                            {
                                                approval?.description
                                                    ? approval?.description
                                                    : t("console:manage.features.approvals.modals." +
                                                    "taskDetails.description")
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
                                    <Grid.Column width={ 5 }>
                                        { t("common:priority") }
                                    </Grid.Column>
                                    <Grid.Column width={ 11 }>
                                        <List.Description>
                                            { approval?.priority }
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
                                    <Grid.Column width={ 5 }>
                                        { t("common:initiator") }
                                    </Grid.Column>
                                    <Grid.Column width={ 11 }>
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
                                    <Grid.Column width={ 5 }>
                                        { t("common:approvalStatus") }
                                    </Grid.Column>
                                    <Grid.Column width={ 11 }>
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
                    approval?.assignees
                        ? (
                            <Grid.Row>
                                <Grid.Column>
                                    <List.Content>
                                        <Grid padded>
                                            <Grid.Row columns={ 2 }>
                                                <Grid.Column width={ 5 }>
                                                    { t("common:assignees") }
                                                </Grid.Column>
                                                <Grid.Column mobile={ 16 } computer={ 11 }>
                                                    <List.Description>
                                                        <Media lessThan="tablet">
                                                            <Divider hidden />
                                                        </Media>
                                                        { assigneesTable(approval?.assignees) }
                                                    </List.Description>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </List.Content>
                                </Grid.Column>
                            </Grid.Row>
                        )
                        : null
                }
                {
                    approval?.properties
                        ? (
                            <Grid.Row>
                                <Grid.Column>
                                    <List.Content>
                                        <Grid padded>
                                            <Grid.Row columns={ 2 }>
                                                <Grid.Column width={ 5 }>
                                                    { t("common:properties") }
                                                </Grid.Column>
                                                <Grid.Column mobile={ 16 } computer={ 11 }>
                                                    <List.Description>
                                                        <Media lessThan="tablet">
                                                            <Divider hidden />
                                                        </Media>
                                                        { propertiesTable(approval?.properties) }
                                                    </List.Description>
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
                                approval?.taskStatus !== ApprovalStatus.COMPLETED
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
