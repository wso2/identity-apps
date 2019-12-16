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

import React, { FunctionComponent, MouseEvent, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Dropdown, Icon, Menu, Segment, SemanticCOLORS, Tab } from "semantic-ui-react";
import { isUndefined } from "util";
import { fetchPendingApprovalDetails, fetchPendingApprovals, updatePendingApprovalStatus } from "../../api";
import * as UIConstants from "../../constants/ui-constants";
import { AlertInterface, AlertLevels, ApprovalStatus, ApprovalTaskDetails } from "../../models";
import { SettingsSection } from "../shared";
import { ApprovalsList } from "./approvals-list";

/**
 * Proptypes for the approvals component.
 */
interface ApprovalsProps {
    onAlertFired: (alert: AlertInterface) => void;
}

/**
 * Approvals component.
 *
 * @param {ApprovalsProps} props
 * @return {JSX.Element}]
 */
export const Approvals: FunctionComponent<ApprovalsProps> = (
    props: ApprovalsProps
): JSX.Element => {
    const [approvals, setApprovals] = useState([]);
    const [approvalsListActiveIndexes, setApprovalsListActiveIndexes] = useState([]);
    const [filterStatus, setFilterStatus] =
        useState<ApprovalStatus.READY
            | ApprovalStatus.RESERVED
            | ApprovalStatus.COMPLETED
            | ApprovalStatus.ALL>(ApprovalStatus.READY);
    const [pagination, setPagination] = useState({
        [ApprovalStatus.READY]: false,
        [ApprovalStatus.RESERVED]: false,
        [ApprovalStatus.COMPLETED]: false,
        [ApprovalStatus.ALL]: false
    });
    const [isMobile, setIsMobile] = useState(false);
    const [activeIndexTab, setActiveIndexTab] = useState(0);
    const { onAlertFired } = props;
    const { t } = useTranslation();

    /**
     * Function that sets the `screenWidth` to be passed as a callback function into even listeners.
     */
    const updateScreenWidth = () => {
        window.innerWidth <= 600 ? setIsMobile(true) : setIsMobile(false);
    };

    /**
     * This adds an event listener on mount to listen to the change in screen width and sets the
     * `isMobile` state. The event listener is removed when the component
     * unmounts.
     * This also sets the isMobile state on mount.
     */
    useEffect(() => {
        window.innerWidth <= 600 ? setIsMobile(true) : setIsMobile(false);
        window.addEventListener("resize", updateScreenWidth);
        return () => {
            window.removeEventListener("resize", updateScreenWidth);
        };
    }, []);

    /**
     * Updates the pending approvals list on change.
     */
    useEffect(() => {
        setApprovals(approvals);
    }, [approvals]);

    /**
     * Updates the approval list when the filter criteria changes.
     */
    useEffect(() => {
        getApprovals(false);
    }, [filterStatus]);

    /**
     * Updates the approvals list when the pagination buttons are being clicked.
     */
    useEffect(() => {
        getApprovals(false);
    }, [pagination]);

    /**
     * Fetches the list of pending approvals from the API.
     *
     * @param {boolean} shallowUpdate - A flag to specify if only the statuses should be updated.
     */
    const getApprovals = (shallowUpdate: boolean = false): void => {
        fetchPendingApprovals(
            pagination[filterStatus]
                ? 0
                : UIConstants.SETTINGS_SECTION_LIST_ITEMS_MAX_COUNT, 0, filterStatus
        )
            .then((response) => {
                if (!shallowUpdate) {
                    setApprovals(response);
                    return;
                }

                const approvalsFromState = [...approvals];
                const approvalsFromResponse = [...response];
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

                setApprovals(filteredApprovals);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.detail) {
                    onAlertFired({
                        description: t(
                            "views:components.approvals.notifications.fetchPendingApprovals.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "views:components.approvals.notifications.fetchPendingApprovals.error.message"
                        ),
                    });
                }

                onAlertFired({
                    description: t(
                        "views:components.approvals.notifications.fetchPendingApprovals.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "views:components.approvals.notifications.fetchPendingApprovals.genericError.message"
                    )
                });
            });
    };

    /**
     * Fetches the pending approval details from the API for the once
     * that are in the expanded state and updates the state.
     */
    const updateApprovalDetails = (): void => {
        const indexes = [...approvalsListActiveIndexes];
        const approvalsClone = [...approvals];

        indexes.forEach((index) => {
            fetchPendingApprovalDetails(index)
                .then((response: ApprovalTaskDetails) => {
                    approvalsClone.forEach((approval) => {
                        if (approval.id === index) {
                            approval.details = response;
                        }
                    });

                });
        });

        setApprovals(approvalsClone);
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
                removeApprovalsListIndex(id);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.detail) {
                    onAlertFired({
                        description: t(
                            "views:components.approvals.notifications.updatePendingApprovals.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "views:components.approvals.notifications.updatePendingApprovals.error.message"
                        )
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "views:components.approvals.notifications.updatePendingApprovals.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "views:components.approvals.notifications.updatePendingApprovals.genericError.message"
                    )
                });
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
        setApprovalsListActiveIndexes([]);
    };

    /**
     *
     * @param {string} id
     */
    const removeApprovalsListIndex = (id: string): boolean => {
        const indexes = [...approvalsListActiveIndexes];

        if (approvalsListActiveIndexes.includes(id)) {
            const removingIndex = approvalsListActiveIndexes.indexOf(id);
            if (removingIndex !== -1) {
                indexes.splice(removingIndex, 1);
            }
            setApprovalsListActiveIndexes(indexes);
            return true;
        }
        return false;
    };

    /**
     * Handler for the approval detail button click.
     *
     * @param {React.MouseEvent<HTMLButtonElement>} e
     */
    const handleApprovalDetailClick = (e: MouseEvent<HTMLButtonElement>): void => {
        const id = e.currentTarget.id;
        const indexes = [...approvalsListActiveIndexes];
        const approvalsClone = [...approvals];

        // If the list item is already extended, remove it from the active indexes
        // array and update the active indexes state.
        if (removeApprovalsListIndex(id)) {
            return;
        }

        // If the list item is not extended, fetches the approval details and
        // updates the state.
        indexes.push(id);

        // Fetch and update the approval details.
        // Re-fetching on every click is necessary to avoid data inconsistency.
        fetchPendingApprovalDetails(id)
            .then((response: ApprovalTaskDetails) => {
                setApprovalsListActiveIndexes(indexes);
                approvalsClone.forEach((approval) => {
                    if (approval.id === id) {
                        approval.details = response;
                    }
                });
                setApprovals(approvalsClone);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.detail) {
                    onAlertFired({
                        description: t(
                            "views:components.approvals.notifications.fetchApprovalDetails.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "views:components.approvals.notifications.fetchApprovalDetails.error.message"
                        ),
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "views:components.approvals.notifications.fetchApprovalDetails.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "views:components.approvals.notifications.fetchApprovalDetails.genericError.message"
                    )
                });
            });
    };

    /**
     * Resolves the filter tag colors based on the approval statuses.
     *
     * @param {ApprovalStatus.READY | ApprovalStatus.RESERVED | ApprovalStatus.COMPLETED | ApprovalStatus.ALL } status -
     *     Filter status.
     * @return {SemanticCOLORS} A semantic color instance.
     */
    const resolveApprovalTagColor = (
        status: ApprovalStatus.READY | ApprovalStatus.RESERVED | ApprovalStatus.COMPLETED | ApprovalStatus.ALL
    ): SemanticCOLORS => {
        switch (status) {
            case ApprovalStatus.READY:
                return "yellow";
            case ApprovalStatus.RESERVED:
                return "orange";
            case ApprovalStatus.COMPLETED:
                return "green";
            case ApprovalStatus.ALL:
                return "blue";
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
            [filterStatus]: !pagination[filterStatus]
        });
    };

    const panes = [
        {
            tabHeader: (
                <Menu.Item key="ready">
                    <Icon name="tag" color={ resolveApprovalTagColor(ApprovalStatus.READY) } />
                    { t("common:ready") }
                </Menu.Item>
            )
        },
        {
            tabHeader: (
                <Menu.Item key="reserved">
                    <Icon name="tag" color={ resolveApprovalTagColor(ApprovalStatus.RESERVED) } />
                    { t("common:reserved") }
                </Menu.Item>
            )
        },
        {
            tabHeader: (
                <Menu.Item key="completed">
                    <Icon name="tag" color={ resolveApprovalTagColor(ApprovalStatus.COMPLETED) } />
                    { t("common:completed") }
                </Menu.Item>
            )
        },
        {
            tabHeader: (
                <Menu.Item key="all">
                    <Icon name="tag" color={ resolveApprovalTagColor(ApprovalStatus.ALL) } />
                    { t("common:all") }
                </Menu.Item>
            )
        }
    ];

    /**
     * This function generates a tag icon with a certain color based on the active tab
     */
    const generateIcons = (): JSX.Element => {
        switch (activeIndexTab) {
            case 0:
                return <Icon name="tag" color={ resolveApprovalTagColor(ApprovalStatus.READY) } />;
            case 1:
                return <Icon name="tag" color={ resolveApprovalTagColor(ApprovalStatus.RESERVED) } />;
            case 2:
                return <Icon name="tag" color={ resolveApprovalTagColor(ApprovalStatus.COMPLETED) } />;
            case 3:
                return <Icon name="tag" color={ resolveApprovalTagColor(ApprovalStatus.ALL) } />;
            default:
                return <Icon name="tag" color="black" />;
        }
    };

    const paneOptions = [
        {
            image: <Icon name="tag" color={ resolveApprovalTagColor(ApprovalStatus.READY) } />,
            key: 0,
            text: t("common:ready"),
            value: 0
        },
        {
            image: <Icon name="tag" color={ resolveApprovalTagColor(ApprovalStatus.RESERVED) } />,
            key: 1,
            text: t("common:reserved"),
            value: 1
        },
        {
            image: <Icon name="tag" color={ resolveApprovalTagColor(ApprovalStatus.COMPLETED) } />,
            key: 2,
            text: t("common:completed"),
            value: 2
        },
        {
            image: <Icon name="tag" color={ resolveApprovalTagColor(ApprovalStatus.ALL) } />,
            key: 3,
            text: t("common:all"),
            value: 3
        }
    ];

    /**
     * Handles the approvals tab change event.
     *
     * @param {React.SyntheticEvent} e - React's original SyntheticEvent.
     * @param data - All props and proposed new activeIndex.
     */
    const handleApprovalsTabChange = (e: SyntheticEvent, data: any): void => {
        const { activeIndex, value } = data;
        isUndefined(activeIndex) ? setActiveIndexTab(value) : setActiveIndexTab(activeIndex);
        switch (isUndefined(activeIndex) ? value : activeIndex) {
            case 0:
                setFilterStatus(ApprovalStatus.READY);
                break;
            case 1:
                setFilterStatus(ApprovalStatus.RESERVED);
                break;
            case 2:
                setFilterStatus(ApprovalStatus.COMPLETED);
                break;
            case 3:
                setFilterStatus(ApprovalStatus.ALL);
                break;
            default:
                setFilterStatus(ApprovalStatus.READY);
                break;
        }
    };

    return (
        <SettingsSection
            description={ t("views:sections.approvals:description") }
            header={ t("views:sections.approvals.heading") }
            primaryAction={
                (
                    approvals
                    && approvals.length
                    && approvals.length >= UIConstants.SETTINGS_SECTION_LIST_ITEMS_MAX_COUNT
                )
                    ? pagination[filterStatus] ? t("common:showLess") : t("common:showMore")
                    : null
            }
            onPrimaryActionClick={ handleShowMoreClick }
            placeholder={
                !(approvals && (approvals.length > 0))
                    ? t(
                        "views:sections.approvals.placeholders.emptyApprovalList.heading",
                        { status: filterStatus !== ApprovalStatus.ALL ? filterStatus.toLocaleLowerCase() : "" }
                    )
                    : null
            }
        >

            { !isMobile
                ? (
                    <Tab
                        className="settings-section-tab"
                        menu={ { secondary: true, pointing: true, attached: "top" } }
                        panes={
                            panes.map((pane) => {
                                return {
                                    menuItem: pane.tabHeader,
                                    render: () => (
                                        <Tab.Pane className="tab-pane" attached={ false }>
                                            <ApprovalsList
                                                approvals={ approvals }
                                                approvalsListActiveIndexes={ approvalsListActiveIndexes }
                                                onApprovalDetailClick={ handleApprovalDetailClick }
                                                resolveApprovalTagColor={ resolveApprovalTagColor }
                                                updateApprovalStatus={ updateApprovalStatus }
                                            />
                                        </Tab.Pane>
                                    )
                                };
                            })
                        }
                        activeIndex={ activeIndexTab }
                        onTabChange={ handleApprovalsTabChange }
                    />
                )
                : (
                    <Card fluid>
                        <Card.Content>
                            { generateIcons() }
                            <Dropdown
                                value={ activeIndexTab }
                                onChange={ handleApprovalsTabChange }
                                inline
                                options={ paneOptions }
                            />
                        </Card.Content>
                        <Card.Content>
                            <ApprovalsList
                                approvals={ approvals }
                                approvalsListActiveIndexes={ approvalsListActiveIndexes }
                                onApprovalDetailClick={ handleApprovalDetailClick }
                                resolveApprovalTagColor={ resolveApprovalTagColor }
                                updateApprovalStatus={ updateApprovalStatus }
                            />
                        </Card.Content>
                    </Card>
                ) }
        </SettingsSection>
    );
};
