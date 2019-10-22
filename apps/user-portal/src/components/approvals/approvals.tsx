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

import React, { FunctionComponent, MouseEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon, Label, SemanticCOLORS } from "semantic-ui-react";
import { fetchPendingApprovalDetails, fetchPendingApprovals, updatePendingApprovalStatus } from "../../api";
import { SETTINGS_SECTION_LIST_ITEMS_MAX_COUNT } from "../../configs";
import { ApprovalStatus, ApprovalTaskDetails, Notification } from "../../models";
import { SettingsSection } from "../shared";
import { ApprovalsList } from "./approvals-list";

/**
 * Proptypes for the pending approvals component.
 */
interface PendingApprovalsProps {
    onNotificationFired: (notification: Notification) => void;
}

/**
 * Pending approvals component.
 *
 * @param {PendingApprovalsProps} props
 * @return {JSX.Element}]
 */
export const PendingApprovalsComponent: FunctionComponent<PendingApprovalsProps> = (
    props: PendingApprovalsProps
): JSX.Element => {
    const [ pendingApprovals, setPendingApprovals ] = useState([]);
    const [ pendingApprovalsListActiveIndexes, setPendingApprovalsListActiveIndexes ] = useState([]);
    const [ filterStatus, setFilterStatus ] =
        useState<ApprovalStatus.READY
            | ApprovalStatus.RESERVED
            | ApprovalStatus.COMPLETED
            | ApprovalStatus.ALL>(ApprovalStatus.READY);
    const [ pagination, setPagination ] = useState({
        [ ApprovalStatus.READY ]: false,
        [ ApprovalStatus.RESERVED ]: false,
        [ ApprovalStatus.COMPLETED ]: false,
        [ ApprovalStatus.ALL ]: false
    });
    const { onNotificationFired } = props;
    const { t } = useTranslation();

    /**
     * Updates the pending approvals list on change.
     */
    useEffect(() => {
        setPendingApprovals(pendingApprovals);
    }, [ pendingApprovals ]);

    /**
     * Updates the approval list when the filter criteria changes.
     */
    useEffect(() => {
        getApprovals(false);
    }, [ filterStatus ]);

    /**
     * Updates the approvals list when the pagination buttons are being clicked.
     */
    useEffect(() => {
        getApprovals(false);
    }, [ pagination ]);

    /**
     * Fetches the list of pending approvals from the API.
     *
     * @param {boolean} shallowUpdate - A flag to specify if only the statuses should be updated.
     */
    const getApprovals = (shallowUpdate: boolean = false): void => {
        fetchPendingApprovals(pagination[ filterStatus ] ? 0 : SETTINGS_SECTION_LIST_ITEMS_MAX_COUNT, 0, filterStatus)
            .then((response) => {
                if (!shallowUpdate) {
                    setPendingApprovals(response);
                    return;
                }

                const approvalsFromState = [ ...pendingApprovals ];
                const approvalsFromResponse = [ ...response ];
                const filteredApprovals = [];

                // Compare the approvals list in the state with the new response
                // and update the new statuses. When the status of the approval is changed,
                // it has to be dropped from the list if the filter status is not `ALL`.
                // Therefore the matching entries are extracted out to the `filteredApprovals` array
                // and are set to the state.
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

    /**
     * Fetches the pending approval details from the API for the once
     * that are in the expanded state and updates the state.
     */
    const updateApprovalDetails = (): void => {
        const indexes = [ ...pendingApprovalsListActiveIndexes ];
        const approvals = [ ...pendingApprovals ];

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

    /**
     * Updates the approvals status.
     *
     * @param {string} id - ID of the approval.
     * @param {ApprovalStatus.CLAIM | ApprovalStatus.RELEASE | ApprovalStatus.APPROVE | ApprovalStatus.REJECT} status -
     *     New status of the approval.
     */
    const updateApprovalStatus = (
        id: string,
        status: ApprovalStatus.CLAIM | ApprovalStatus.RELEASE | ApprovalStatus.APPROVE | ApprovalStatus.REJECT
    ): void => {
        updatePendingApprovalStatus(id, status)
            .then((response) => {
                getApprovals(true);
                updateApprovalDetails();
            })
            .catch((error) => {
                let notification = {
                    description: t(
                        "views:pendingApprovals.notifications.updatePendingApprovals.genericError.description"
                    ),
                    message: t(
                        "views:pendingApprovals.notifications.updatePendingApprovals.genericError.message"
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
                            "views:pendingApprovals.notifications.updatePendingApprovals.error.description",
                            { description: error.response.data.detail }
                        ),
                        message: t(
                            "views:pendingApprovals.notifications.updatePendingApprovals.error.message"
                        ),
                    };
                }
                onNotificationFired(notification);
            });
    };

    /**
     * Filters the approvals list based on different criteria.
     *
     * @param {ApprovalStatus.READY | ApprovalStatus.RESERVED | ApprovalStatus.COMPLETED | ApprovalStatus.ALL} status -
     *     Status of the approvals.
     */
    const filterByStatus = (
        status: ApprovalStatus.READY | ApprovalStatus.RESERVED | ApprovalStatus.COMPLETED | ApprovalStatus.ALL
    ): void => {
        setFilterStatus(status);
        setPendingApprovalsListActiveIndexes([]);
    };

    /**
     * Handler for the approval detail button click.
     *
     * @param {React.MouseEvent<HTMLButtonElement>} e
     */
    const handleApprovalDetailClick = (e: MouseEvent<HTMLButtonElement>): void => {
        const id = e.currentTarget.id;
        const indexes = [ ...pendingApprovalsListActiveIndexes ];
        const approvals = [ ...pendingApprovals ];

        // If the list item is already extended, remove it from the active indexes
        // array and update the active indexes state.
        if (pendingApprovalsListActiveIndexes.includes(id)) {
            const removingIndex = pendingApprovalsListActiveIndexes.indexOf(id);
            if (removingIndex !== -1) {
                indexes.splice(removingIndex, 1);
            }
            setPendingApprovalsListActiveIndexes(indexes);
            return;
        }

        // If the list item is not extended, fetches the approval details and
        // updates the state.
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
                let notification = {
                    description: t(
                        "views:pendingApprovals.notifications.fetchApprovalDetails.genericError.description"
                    ),
                    message: t(
                        "views:pendingApprovals.notifications.fetchApprovalDetails.genericError.message"
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
                            "views:pendingApprovals.notifications.fetchApprovalDetails.error.description",
                            { description: error.response.data.detail }
                        ),
                        message: t(
                            "views:pendingApprovals.notifications.fetchApprovalDetails.error.message"
                        ),
                    };
                }
                onNotificationFired(notification);
            });
        setPendingApprovalsListActiveIndexes(indexes);
    };

    /**
     * Resolves the filter tag colors based on the approval statuses.
     *
     * @param {ApprovalStatus.READY | ApprovalStatus.RESERVED | ApprovalStatus.COMPLETED} status - Filter status.
     * @return {SemanticCOLORS} A semantic color instance.
     */
    const resolveApprovalTagColor = (
        status: ApprovalStatus.READY | ApprovalStatus.RESERVED | ApprovalStatus.COMPLETED
    ): SemanticCOLORS => {
        switch (status) {
            case ApprovalStatus.READY:
                return "yellow";
            case ApprovalStatus.RESERVED:
                return "orange";
            case ApprovalStatus.COMPLETED:
                return "green";
            default:
                return "grey";
        }
    };

    /**
     * Handles the show more pagination button click event.
     */
    const handleShowMoreClick = (): void => {
        setPagination({
            ...pagination,
            [ filterStatus ]: !pagination[ filterStatus ]
        });
    };

    return (
        <SettingsSection
            description={ t("views:pendingApprovals:subTitle") }
            header={ t("views:pendingApprovals:title") }
            primaryAction={
                (
                    pendingApprovals
                    && pendingApprovals.length
                    && pendingApprovals.length >= SETTINGS_SECTION_LIST_ITEMS_MAX_COUNT
                )
                    ? pagination[ filterStatus ] ? t("common:showLess") : t("common:showMore")
                    : null
            }
            onPrimaryActionClick={ handleShowMoreClick }
            placeholder={
                !(pendingApprovals && (pendingApprovals.length > 0))
                    ? t(
                    "views:pendingApprovals.placeholders.emptyApprovalList.heading",
                    { status: filterStatus !== ApprovalStatus.ALL ? filterStatus.toLocaleLowerCase() : "" }
                    )
                    : null
            }
        >
            <div className="top-action-panel">
                <Label.Group circular>
                    <Label
                        as="a"
                        className="filter-label"
                        onClick={ () => filterByStatus(ApprovalStatus.READY) }
                        active={ filterStatus === ApprovalStatus.READY }
                        basic
                    >
                        <Icon name="tag" color="yellow"/>
                        { t("common:ready") }
                    </Label>
                    <Label
                        as="a"
                        className="filter-label"
                        onClick={ () => filterByStatus(ApprovalStatus.RESERVED) }
                        active={ filterStatus === ApprovalStatus.RESERVED }
                        basic
                    >
                        <Icon name="tag" color="orange"/>
                        { t("common:reserved") }
                    </Label>
                    <Label
                        as="a"
                        className="filter-label"
                        onClick={ () => filterByStatus(ApprovalStatus.COMPLETED) }
                        active={ filterStatus === ApprovalStatus.COMPLETED }
                        basic
                    >
                        <Icon name="tag" color="green"/>
                        { t("common:completed") }
                    </Label>
                    <Label
                        as="a"
                        className="filter-label"
                        onClick={ () => filterByStatus(ApprovalStatus.ALL) }
                        active={ filterStatus === ApprovalStatus.ALL }
                        basic
                    >
                        <Icon name="tag" color="blue"/>
                        { t("common:all") }
                    </Label>
                </Label.Group>
            </div>
            <ApprovalsList
                approvals={ pendingApprovals }
                approvalsListActiveIndexes={ pendingApprovalsListActiveIndexes }
                onApprovalDetailClick={ handleApprovalDetailClick }
                resolveApprovalTagColor={ resolveApprovalTagColor }
                updateApprovalStatus={ updateApprovalStatus }
            />
        </SettingsSection>
    );
};
