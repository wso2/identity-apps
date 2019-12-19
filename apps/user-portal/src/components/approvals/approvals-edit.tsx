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

import moment from "moment";
import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { Button, Divider, Grid, List, Responsive, Table } from "semantic-ui-react";
import { ApprovalStatus, ApprovalTaskSummary } from "../../models";
import { EditSection } from "../shared";

/**
 * Proptypes for the approvals edit component.
 */
interface ApprovalsEditProps {
    approval: ApprovalTaskSummary;
    updateApprovalStatus: (
        id: string,
        status: ApprovalStatus.CLAIM | ApprovalStatus.RELEASE | ApprovalStatus.APPROVE | ApprovalStatus.REJECT
    ) => void;
}

/**
 * Approvals edit component.
 *
 * @param {ApprovalsEditProps} props - Props injected to the approvals edit component.
 * @return {JSX.Element}
 */
export const ApprovalsEdit: FunctionComponent<ApprovalsEditProps> = (
    props: ApprovalsEditProps
): JSX.Element => {
    const { approval, updateApprovalStatus } = props;
    const { t } = useTranslation();

    /**
     * Removes unnecessary commas at the end of property values and splits
     * up the claim values.
     *
     * @remarks
     * The API returns properties as key value pairs and these values often contains
     * unnecessary commas at the end. This function will cleanup the values and it can
     * be removed once the API is fixed.
     *
     * @param {string} value - Property value.
     * @return {string} A cleaned up string.
     */
    const cleanupPropertyValues = (key: string, value: string): string | JSX.Element => {
        if (key === "Claims") {
            const claims = value.split(",");

            return (
                <List className="values-list" items={ claims } />
            );
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
     * @return {JSX.Element} - A table containing the list of assignees.
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
     * @return {JSX.Element} A table containing the list of properties.
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
                                        { property.key }
                                    </Table.Cell>
                                    <Table.Cell className="values-cell">
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
     * @return {JSX.Element} A panel containing all the possible action buttons.
     */
    const approvalActions = (editingApproval): JSX.Element => (
        <>
            {
                editingApproval.status === ApprovalStatus.READY
                    ? (
                        <Button
                            default
                            fluid={ window.innerWidth <= Responsive.onlyMobile.maxWidth }
                            className="mb-1x"
                            onClick={ () => updateApprovalStatus(editingApproval.id, ApprovalStatus.CLAIM) }
                        >
                            { t("common:claim") }
                        </Button>
                    )
                    : (
                        <Button
                            default
                            fluid={ window.innerWidth <= Responsive.onlyMobile.maxWidth }
                            className="mb-1x"
                            onClick={ () => updateApprovalStatus(editingApproval.id, ApprovalStatus.RELEASE) }
                        >
                            { t("common:release") }
                        </Button>
                    )
            }
            <Button
                primary
                fluid={ window.innerWidth <= Responsive.onlyMobile.maxWidth }
                className="mb-1x"
                onClick={ () => updateApprovalStatus(editingApproval.id, ApprovalStatus.APPROVE) }
            >
                { t("common:approve") }
            </Button>
            <Button
                negative
                fluid={ window.innerWidth <= Responsive.onlyMobile.maxWidth }
                className="mb-1x"
                onClick={ () => updateApprovalStatus(editingApproval.id, ApprovalStatus.REJECT) }
            >
                { t("common:reject") }
            </Button>
        </>
    );

    return (
        <EditSection marginTop>
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
                                        { moment(parseInt(approval.createdTimeInMillis, 10)).format("lll") }
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
                                        { approval.details.description }
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
                                        { approval.details.priority }
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
                                        { approval.details.initiator }
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
                                        { approval.details.approvalStatus }
                                    </List.Description>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </List.Content>
                </Grid.Column>
            </Grid.Row>
            {
                approval.details.assignees
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
                                                    <Responsive
                                                        maxWidth={ Responsive.onlyComputer.minWidth }
                                                        as={ Divider }
                                                        hidden
                                                    />
                                                    { assigneesTable(approval.details.assignees) }
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
                approval.details.properties
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
                                                    <Responsive
                                                        maxWidth={ Responsive.onlyComputer.minWidth }
                                                        as={ Divider }
                                                        hidden
                                                    />
                                                    { propertiesTable(approval.details.properties) }
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
                approval.status !== ApprovalStatus.COMPLETED
                    ? (
                        <Grid.Row>
                            <Grid.Column>
                                <List.Content>
                                    <Grid padded>
                                        <Grid.Row columns={ 2 }>
                                            <Grid.Column width={ 5 }>
                                                { " " }
                                            </Grid.Column>
                                            <Grid.Column mobile={ 16 } computer={ 11 }>
                                                { approvalActions(approval) }
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </List.Content>
                            </Grid.Column>
                        </Grid.Row>
                    )
                    : null
            }
        </EditSection>
    );
};
