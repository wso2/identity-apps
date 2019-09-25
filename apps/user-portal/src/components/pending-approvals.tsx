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
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid, Icon, Label, List, SemanticCOLORS, Table } from "semantic-ui-react";
import { fetchPendingApprovalDetails, fetchPendingApprovals, updatePendingApprovalState } from "../actions";
import { NotificationActionPayload } from "../models/notifications";
import { ApprovalStates, ApprovalTaskDetails } from "../models/pending-approvals";
import { EditSection } from "./edit-section";
import { SettingsSection } from "./settings-section";

/**
 * Proptypes for the pending approvals component.
 */
interface PendingApprovalsProps {
    onNotificationFired: (notification: NotificationActionPayload) => void;
}

/**
 * Pending approvals component.
 *
 * @return {JSX.Element}
 */
export const PendingApprovalsComponent: FunctionComponent<PendingApprovalsProps> = (
    props: PendingApprovalsProps
): JSX.Element => {
    const [pendingApprovals, setPendingApprovals] = useState([]);
    const [pendingApprovalsListActiveIndexes, setPendingApprovalsListActiveIndexes] = useState([]);
    const [filterStatus, setFilterStatus] = useState(ApprovalStates.READY);
    const { onNotificationFired } = props;
    const { t } = useTranslation();

    useEffect(() => {
        setPendingApprovals(pendingApprovals);
        console.log('updated pendingApprovals', pendingApprovals)
    }, [pendingApprovals]);

    useEffect(() => {
        getApprovals();
    }, [filterStatus]);

    const getApprovals = (shallowUpdate: boolean = false) => {
        fetchPendingApprovals(filterStatus)
            .then((response) => {
                if (!shallowUpdate) {
                    setPendingApprovals(response);
                    return;
                }

                const approvalsFromState = [...pendingApprovals];
                const approvalsFromResponse = [...response];
                const filteredApprovals = [];
                approvalsFromState.forEach((fromState) => {
                    approvalsFromResponse.forEach((fromResponse) => {
                        if (fromState.id === fromResponse.id) {
                            fromState.status = fromResponse.status;
                            filteredApprovals.push(fromState);
                        }
                    });
                });

                setPendingApprovals(filteredApprovals);
            })
            .catch((error) => {
                let notification = {
                    description: t(
                        "views:pendingApprovals.notifications.fetchPendingApprovals.genericError.description"
                    ),
                    message: t(
                        "views:pendingApprovals.notifications.fetchPendingApprovals.genericError.message"
                    ),
                    otherProps: {
                        negative: true
                    },
                    visible: true
                };
                if (error.response && error.response.data && error.response.detail) {
                    notification = {
                        ...notification,
                        description: t(
                            "views:pendingApprovals.notifications.fetchPendingApprovals.error.description",
                            { description: error.response.data.detail }
                        ),
                        message: t(
                            "views:pendingApprovals.notifications.fetchPendingApprovals.error.message"
                        ),
                    };
                }
                onNotificationFired(notification);
            });
    };

    const updateApprovalDetails = () => {
        const indexes = [...pendingApprovalsListActiveIndexes];
        const approvals = [...pendingApprovals];

        indexes.forEach((index) => {
            fetchPendingApprovalDetails(index)
                .then((response: ApprovalTaskDetails) => {
                    approvals.forEach((approval) => {
                        if (approval.id === index) {
                            approval.details = response;
                        }
                    });

                });
        });

        setPendingApprovals(approvals);
    };

    const updateApprovalState = (
        id: string,
        state: ApprovalStates.CLAIM | ApprovalStates.RELEASE | ApprovalStates.APPROVE | ApprovalStates.REJECT
    ) => {
        updatePendingApprovalState(id, state)
            .then((response) => {
                console.log("Res", response);
                getApprovals(true);
                updateApprovalDetails();
            })
            .catch((error) => {
                console.log("Error", error);
            });
    };

    const filterByStatus = (
        status:
            ApprovalStates.READY
            | ApprovalStates.RESERVED
            | ApprovalStates.COMPLETED
            | ApprovalStates.ALL
    ) => {
        setFilterStatus(status);
        setPendingApprovalsListActiveIndexes([]);
    };

    /**
     * Handler for the approval detail button click.
     *
     * @param e - Click event.
     * @param {any} id - Session id.
     */
    const handleApprovalDetailClick = (e, { id }) => {
        const indexes = [...pendingApprovalsListActiveIndexes];
        const approvals = [...pendingApprovals];

        if (!pendingApprovalsListActiveIndexes.includes(id)) {
            indexes.push(id);

            // Fetch and update the approval details.
            // Re-fetching on every click is necessary to avoid data inconsistency.
            fetchPendingApprovalDetails(id)
                .then((response: ApprovalTaskDetails) => {
                    approvals.forEach((approval) => {
                        if (approval.id === id) {
                            approval.details = response;
                        }
                    });
                    setPendingApprovals(approvals);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else if (pendingApprovalsListActiveIndexes.includes(id)) {
            const removingIndex = pendingApprovalsListActiveIndexes.indexOf(id);
            if (removingIndex !== -1) {
                indexes.splice(removingIndex, 1);
            }
        }
        setPendingApprovalsListActiveIndexes(indexes);
    };

    const resolveApprovalTagColor = (
        state: ApprovalStates.READY | ApprovalStates.RESERVED | ApprovalStates.COMPLETED
    ): SemanticCOLORS => {
        switch (state) {
            case ApprovalStates.READY:
                return "yellow";
            case ApprovalStates.RESERVED:
                return "orange";
            case ApprovalStates.COMPLETED:
                return "green";
            default:
                return "grey";
        }
    };

    const cleanupPropertyValues = (value: string): string => {
        const lastChar = value.substr(value.length - 1);
        if (lastChar !== ",") {
            return value;
        }
        return value.slice(0, -1);
    };

    const approvalEditView = (approval) => (
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
                                        {
                                            moment(parseInt(approval.createdTimeInMillis, 10))
                                                .format("lll")
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
                                            <Grid.Column width={ 11 }>
                                                <List.Description>
                                                    <Table celled compact>
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
                                                                approval.details.assignees.map((assignee, i) => (
                                                                        <Table.Row
                                                                            key={ i }>
                                                                            <Table.Cell>
                                                                                { assignee.key }
                                                                            </Table.Cell>
                                                                            <Table.Cell>
                                                                                { assignee.value }
                                                                            </Table.Cell>
                                                                        </Table.Row>
                                                                    )
                                                                )
                                                            }
                                                        </Table.Body>
                                                    </Table>
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
                                            <Grid.Column width={ 11 }>
                                                <List.Description>
                                                    <Table celled compact>
                                                        <Table.Body>
                                                            {
                                                                approval.details.properties.map((property, i) => (
                                                                        property.key && property.value
                                                                            ? (
                                                                                <Table.Row
                                                                                    key={ i }>
                                                                                    <Table.Cell>
                                                                                        { property.key }
                                                                                    </Table.Cell>
                                                                                    <Table.Cell>
                                                                                        { cleanupPropertyValues(property.value) }
                                                                                    </Table.Cell>
                                                                                </Table.Row>
                                                                            )
                                                                            : null
                                                                    )
                                                                )
                                                            }
                                                        </Table.Body>
                                                    </Table>
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
                approval.status !== ApprovalStates.COMPLETED
                    ? (
                        <Grid.Row>
                            <Grid.Column>
                                <List.Content>
                                    <Grid padded>
                                        <Grid.Row columns={ 2 }>
                                            <Grid.Column width={ 5 }>
                                                { " " }
                                            </Grid.Column>
                                            <Grid.Column width={ 11 }>
                                                {
                                                    approval.status === ApprovalStates.READY
                                                        ? (
                                                            <Button
                                                                default
                                                                onClick={
                                                                    () => updateApprovalState(approval.id, ApprovalStates.CLAIM)
                                                                }
                                                            >
                                                                { t("common:claim") }
                                                            </Button>
                                                        )
                                                        : (
                                                            <Button
                                                                default
                                                                onClick={
                                                                    () => updateApprovalState(approval.id, ApprovalStates.RELEASE)
                                                                }
                                                            >
                                                                { t("common:release") }
                                                            </Button>
                                                        )
                                                }
                                                <Button
                                                    primary
                                                    onClick={
                                                        () => updateApprovalState(approval.id, ApprovalStates.APPROVE)
                                                    }
                                                >
                                                    { t("common:approve") }
                                                </Button>
                                                <Button
                                                    negative
                                                    onClick={
                                                        () => updateApprovalState(approval.id, ApprovalStates.REJECT)
                                                    }
                                                >
                                                    { t("common:reject") }
                                                </Button>
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

    return (
        <SettingsSection
            description={ t("views:pendingApprovals:subTitle") }
            header={ t("views:pendingApprovals:title") }
        >
            <div className="top-action-panel">
                <Label.Group circular>
                    <Label
                        as="a"
                        className="filter-label"
                        onClick={ () => filterByStatus(ApprovalStates.READY) }
                        active={ filterStatus === ApprovalStates.READY }
                        basic
                    >
                        <Icon name="tag" color="yellow"/>
                        Ready
                    </Label>
                    <Label
                        as="a"
                        className="filter-label"
                        onClick={ () => filterByStatus(ApprovalStates.RESERVED) }
                        active={ filterStatus === ApprovalStates.RESERVED }
                        basic
                    >
                        <Icon name="tag" color="orange"/>
                        Reserved
                    </Label>
                    <Label
                        as="a"
                        className="filter-label"
                        onClick={ () => filterByStatus(ApprovalStates.COMPLETED) }
                        active={ filterStatus === ApprovalStates.COMPLETED }
                        basic
                    >
                        <Icon name="tag" color="green"/>
                        Completed
                    </Label>
                    <Label
                        as="a"
                        className="filter-label"
                        onClick={ () => filterByStatus(ApprovalStates.ALL) }
                        active={ filterStatus === ApprovalStates.ALL }
                        basic
                    >
                        <Icon name="tag" color="blue"/>
                        All
                    </Label>
                </Label.Group>
            </div>
            <List divided verticalAlign="middle" className="main-content-inner">
                {
                    (pendingApprovals && pendingApprovals.length && pendingApprovals.length > 0)
                        ? pendingApprovals.map((approval) => (
                            <List.Item className="inner-list-item" key={ approval.id }>
                                <Grid padded>
                                    <Grid.Row columns={ 2 }>
                                        <Grid.Column width={ 11 } className="first-column">
                                            <List.Content>
                                                <List.Header>{ approval.presentationSubject }</List.Header>
                                                <List.Description>
                                                    <p style={ { fontSize: "11px" } }>
                                                        <Icon
                                                            name="tag"
                                                            color={ resolveApprovalTagColor(approval.status) }
                                                        />
                                                        { approval.status }
                                                    </p>
                                                </List.Description>
                                            </List.Content>
                                        </Grid.Column>
                                        <Grid.Column width={ 5 } className="last-column">
                                            <List.Content floated="right">
                                                <Button
                                                    icon
                                                    basic
                                                    id={ approval.id }
                                                    labelPosition="right"
                                                    size="mini"
                                                    onClick={ handleApprovalDetailClick }
                                                >
                                                    {
                                                        pendingApprovalsListActiveIndexes.includes(approval.id) ?
                                                            <>
                                                                { t("common:showLess") }
                                                                <Icon name="arrow down" flipped="vertically"/>
                                                            </>
                                                            :
                                                            <>
                                                                { t("common:showMore") }
                                                                <Icon name="arrow down"/>
                                                            </>
                                                    }
                                                </Button>
                                            </List.Content>
                                        </Grid.Column>
                                    </Grid.Row>
                                    {
                                        pendingApprovalsListActiveIndexes.includes(approval.id) && approval.details
                                            ? (
                                                <Grid.Row columns={ 1 } className="no-padding">
                                                    <Grid.Column width={ 16 } className="no-padding">
                                                        { approvalEditView(approval) }
                                                    </Grid.Column>
                                                </Grid.Row>
                                            )
                                            : null
                                    }
                                </Grid>
                            </List.Item>
                        ))
                        : null
                }
            </List>
        </SettingsSection>
    );
};
