/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ListLayout, PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { DropdownItemProps, DropdownProps, PaginationProps } from "semantic-ui-react";
import { useGetWorkflowInstances } from "../api/use-get-workflow-instances";
import ActiveFiltersBar from "../components/active-filters-bar";
import WorkflowRequestsFilter from "../components/workflow-requests-filter";
import WorkflowRequestsList from "../components/workflow-requests-list";
import {
    PredefinedFilter,
    WorkflowInstanceListItemInterface,
    WorkflowInstanceOperationType,
    WorkflowInstanceStatus
} from "../models/workflowRequests";
import { formatMsToBackend } from "../utils/formatDateTimeToBackend";
import { generateFilterString } from "../utils/generateFilterString";
import "./workflow-requests.scss";

type WorkflowsLogsPageInterface = IdentifiableComponentInterface & {
    "data-testid"?: string;
};

interface FilterTag {
    key: string;
    label: string;
    value: string;
    type: "status" | "createdTimeRange" | "updatedTimeRange" | "operationType";
}

const WorkflowRequestsPage: FunctionComponent<WorkflowsLogsPageInterface> = (
    props: WorkflowsLogsPageInterface
): ReactElement => {

    const {
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ workflowRequests, setWorkflowRequests ] = useState<WorkflowInstanceListItemInterface[]>([]);
    const [ status, setStatus ] = useState<string>("ALL_TASKS");
    const [ operationType, setOperationType ] = useState<string>("ALL");
    const [ predefinedFilter, setPredefinedFilter ] = useState<string>("");
    const [ createdTimeRange, setCreatedTimeRange ] = useState<number | undefined>(-2);
    const [ createdFromTime, setCreatedFromTime ] = useState<string>("");
    const [ createdToTime, setCreatedToTime ] = useState<string>("");
    const [ updatedTimeRange, setUpdatedTimeRange ] = useState<number | undefined>(-2);
    const [ updatedFromTime, setUpdatedFromTime ] = useState<string>("");
    const [ updatedToTime, setUpdatedToTime ] = useState<string>("");
    const [ filterString, setFilterString ] = useState<string>("");
    const [ limit, setLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ offset, setOffset ] = useState<number>(0);
    const [ totalResults, setTotalResults ] = useState<number>(0);

    const {
        data: workflowInstancesData,
        isLoading: isWorkflowInstancesLoading,
        error: workflowInstancesError
    } = useGetWorkflowInstances(limit, offset, filterString, true);

    useEffect(() => {
        if (workflowInstancesData) {
            setWorkflowRequests(workflowInstancesData.instances);
            setTotalResults(workflowInstancesData.totalResults);
        }
    }, [ workflowInstancesData ]);

    useEffect(() => {
        if (workflowInstancesError) {
            if (workflowInstancesError.response && workflowInstancesError.response.data
                    && workflowInstancesError.response.data.detail) {
                dispatch(addAlert({
                    description: t(
                        "console:manage.features.workflowRequests.notifications." +
                        "fetchWorkflowRequests.error.description",
                        { description: workflowInstancesError.response.data.detail }
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.workflowRequests.notifications.fetchWorkflowRequests.error.message"
                    )
                }));
            } else {
                dispatch(addAlert({
                    description: t(
                        "console:manage.features.workflowRequests.notifications." +
                        "fetchWorkflowRequests.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.workflowRequests.notifications." +
                        "fetchWorkflowRequests.genericError.message"
                    )
                }));
            }
        }
    }, [ workflowInstancesError, dispatch, t ]);

    const INSTANCE_STATUSES: DropdownItemProps[] = [
        { key: WorkflowInstanceStatus.ALL_TASKS, text: t("approvalWorkflows:status.all"), value: "ALL_TASKS" },
        { key: WorkflowInstanceStatus.FAILED, text: t("approvalWorkflows:status.failed"), value: "FAILED" },
        { key: WorkflowInstanceStatus.APPROVED, text: t("approvalWorkflows:status.approved"), value: "APPROVED" },
        { key: WorkflowInstanceStatus.PENDING, text: t("approvalWorkflows:status.pending"), value: "PENDING" },
        { key: WorkflowInstanceStatus.DELETED, text: t("approvalWorkflows:status.deleted"), value: "DELETED" },
        { key: WorkflowInstanceStatus.REJECTED, text: t("approvalWorkflows:status.rejected"), value: "REJECTED" }
    ];


    const TIME_RANGE_OPTIONS: { key: number; text: string; value: number }[] = [
        { key: -2, text: t("approvalWorkflows:timeRanges.all"), value: -2 },
        { key: 0.25, text: t("approvalWorkflows:timeRanges.last15Minutes"), value: 0.25 },
        { key: 0.5, text: t("approvalWorkflows:timeRanges.last30Minutes"), value: 0.5 },
        { key: 1, text: t("approvalWorkflows:timeRanges.last1Hour"), value: 1 },
        { key: 6, text: t("approvalWorkflows:timeRanges.last6Hours"), value: 6 },
        { key: 12, text: t("approvalWorkflows:timeRanges.last12Hours"), value: 12 },
        { key: 24, text: t("approvalWorkflows:timeRanges.last24Hours"), value: 24 },
        { key: 48, text: t("approvalWorkflows:timeRanges.last2Days"), value: 48 },
        { key: 72, text: t("approvalWorkflows:timeRanges.last3Days"), value: 72 },
        { key: 168, text: t("approvalWorkflows:timeRanges.last7Days"), value: 168 },
        { key: 720, text: t("approvalWorkflows:timeRanges.last30Days"), value: 720 },
        { key: -1, text: t("approvalWorkflows:timeRanges.customRange"), value: -1 }
    ];

    const getDisplayLabel = (type: string, value: string): string => {
        switch (type) {
            case "operationType":
                switch (value) {
                    case WorkflowInstanceOperationType.ALL:
                        return t("approvalWorkflows:operationType.all");
                    case WorkflowInstanceOperationType.ADD_USER:
                        return t("approvalWorkflows:operationType.createUser");
                    case WorkflowInstanceOperationType.DELETE_USER:
                        return t("approvalWorkflows:operationType.deleteUser");
                    case WorkflowInstanceOperationType.UPDATE_ROLES_OF_USERS:
                        return t("approvalWorkflows:operationType.updateUserRoles");
                    case WorkflowInstanceOperationType.ADD_ROLE:
                        return t("approvalWorkflows:operationType.createRole");
                    case WorkflowInstanceOperationType.DELETE_ROLE:
                        return t("approvalWorkflows:operationType.deleteRole");
                    // TODO: Enable these operation types when backend support is added
                    // case WorkflowInstanceOperationType.UPDATE_ROLE_NAME:
                    //     return t("approvalWorkflows:operationType.updateRoleName");
                    // case WorkflowInstanceOperationType.UPDATE_USERS_OF_ROLES:
                    //     return t("approvalWorkflows:operationType.updateRoleUsers");
                    // case WorkflowInstanceOperationType.DELETE_USER_CLAIMS:
                    //     return t("approvalWorkflows:operationType.deleteUserClaims");
                    // case WorkflowInstanceOperationType.UPDATE_USER_CLAIMS:
                    //     return t("approvalWorkflows:operationType.updateUserClaims");
                    default: return value;
                }
            case "status":
                return (
                    INSTANCE_STATUSES.find(
                        (item: DropdownItemProps) => item.value === value
                    )?.text?.toString() || value
                );
            case "createdTimeRange":
            case "updatedTimeRange": {
                if (value === "-1") {
                    return TIME_RANGE_OPTIONS.find(
                        (item: { key: number; text: string; value: number }) => item.value === -1
                    )?.text || value;
                }

                const option: { key: number; text: string; value: number } | undefined = TIME_RANGE_OPTIONS.find(
                    (item: { key: number; text: string; value: number }) => item.value === Number(value)
                );

                return option ? option.text : value;
            }
            default:
                return value;
        }
    };

    const getActiveFilters = (): FilterTag[] => {
        const filters: FilterTag[] = [];

        if (status !== "ALL_TASKS") {
            filters.push({
                key: "status",
                label: getDisplayLabel("status", status),
                type: "status",
                value: status
            });
        }

        if (operationType !== "ALL") {
            filters.push({
                key: "operationType",
                label: getDisplayLabel("operationType", operationType),
                type: "operationType",
                value: operationType
            });
        }

        if (createdTimeRange !== undefined && createdTimeRange !== -2) {
            filters.push({
                key: "createdTimeRange",
                label: `${getDisplayLabel("createdTimeRange", createdTimeRange.toString())}`,
                type: "createdTimeRange",
                value: createdTimeRange.toString()
            });
        }

        if (updatedTimeRange !== undefined && updatedTimeRange !== -2) {
            filters.push({
                key: "updatedTimeRange",
                label: `${getDisplayLabel("updatedTimeRange", updatedTimeRange.toString())}`,
                type: "updatedTimeRange",
                value: updatedTimeRange.toString()
            });
        }

        return filters;
    };

    const removeFilter = (filterToRemove: FilterTag): void => {
        switch (filterToRemove.type) {
            case "status":
                setStatus("ALL_TASKS");

                break;
            case "operationType":
                setOperationType("ALL");

                break;
            case "createdTimeRange":
                setCreatedTimeRange(undefined);
                setCreatedFromTime("");
                setCreatedToTime("");

                break;
            case "updatedTimeRange":
                setUpdatedTimeRange(undefined);
                setUpdatedFromTime("");
                setUpdatedToTime("");

                break;
        }
    };

    const clearAllFilters = (): void => {
        setStatus("ALL_TASKS");
        setOperationType("ALL");
        setPredefinedFilter("");
        setCreatedTimeRange(undefined);
        setUpdatedTimeRange(undefined);
        setCreatedFromTime("");
        setCreatedToTime("");
        setUpdatedFromTime("");
        setUpdatedToTime("");
    };

    const handleCreatedTimeRangeChange = (range: number) => {
        setCreatedTimeRange(range);
        setCreatedFromTime("");
        setCreatedToTime("");
        setUpdatedTimeRange(undefined);
        setUpdatedFromTime("");
        setUpdatedToTime("");
    };
    const handleCreatedCustomDateChange = (from: string, to: string) => {
        setCreatedFromTime(from);
        setCreatedToTime(to);
        setUpdatedFromTime("");
        setUpdatedToTime("");
        searchWorkflowRequests();
    };
    const handleUpdatedTimeRangeChange = (range: number) => {
        setUpdatedTimeRange(range);
        setUpdatedFromTime("");
        setUpdatedToTime("");
        setCreatedTimeRange(undefined);
        setCreatedFromTime("");
        setCreatedToTime("");
    };
    const handleUpdatedCustomDateChange = (from: string, to: string) => {
        setUpdatedFromTime(from);
        setUpdatedToTime(to);
        setCreatedFromTime("");
        setCreatedToTime("");
        searchWorkflowRequests();
    };

    const handlePredefinedFilterApply = (filter: PredefinedFilter): void => {
        // Reset all filters first
        setStatus("ALL_TASKS");
        setOperationType("ALL");
        setCreatedTimeRange(undefined);
        setUpdatedTimeRange(undefined);
        setCreatedFromTime("");
        setCreatedToTime("");
        setUpdatedFromTime("");
        setUpdatedToTime("");

        // Apply the predefined filter settings
        if (filter.status) {
            setStatus(filter.status);
        }
        if (filter.operationType) {
            setOperationType(filter.operationType);
        }
        if (filter.timeRange) {
            setCreatedTimeRange(filter.timeRange);
        }

        // Trigger search after filter is applied
        setTimeout(() => {
            searchWorkflowRequests();
        }, 100);
    };

    const searchWorkflowRequests = (): void => {
        const generatedFilter: string = generateFilterString(
            status,
            operationType,
            createdFromTime ? formatMsToBackend(createdFromTime, true) : "",
            createdToTime ? formatMsToBackend(createdToTime, false) : "",
            updatedFromTime ? formatMsToBackend(updatedFromTime, true) : "",
            updatedToTime ? formatMsToBackend(updatedToTime, false) : ""
        );

        setFilterString(generatedFilter);
        setOffset(0);
        // The hook will automatically refetch when filterString changes
    };

    /**
     * Handles pagination change.
     *
     * @param event - Event.
     * @param data - Dropdown data.
     */
    const handlePaginationChange = (event: MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        setOffset((data.activePage as number - 1) * limit);
    };

    /**
     * Handles the change in the number of items to display.
     *
     * @param event - Event.
     * @param data - Dropdown data.
     */
    const handleItemsPerPageDropdownChange = (event: MouseEvent<HTMLAnchorElement>, data: DropdownProps): void => {
        setLimit(data.value as number);
    };

    // The hook automatically handles fetching when limit, offset, or filterString changes

    useEffect(() => {
        searchWorkflowRequests();
    }, [ status, createdTimeRange, createdFromTime, createdToTime, updatedTimeRange, updatedFromTime,
        updatedToTime, operationType ]);

    const activeFilters: FilterTag[] = getActiveFilters();

    return (
        <PageLayout
            title={ t("pages:workflowRequestsPage.title") }
            pageTitle={ t("pages:workflowRequestsPage.title") }
            description={ t("pages:workflowRequestsPage.subTitle") }
            data-testid={ `${testId}-page-layout` }
        >
            <div className="workflow-requests-page-content">
                <ActiveFiltersBar
                    filters={ activeFilters }
                    onRemove={ removeFilter }
                    onClearAll={ clearAllFilters }
                    data-componentid="workflow-requests-active-filters-bar"
                />
                <WorkflowRequestsFilter
                    status={ status }
                    setStatus={ setStatus }
                    operationType={ operationType }
                    setOperationType={ setOperationType }
                    predefinedFilter={ predefinedFilter }
                    setPredefinedFilter={ setPredefinedFilter }
                    onPredefinedFilterApply={ handlePredefinedFilterApply }
                    createdTimeRange={ createdTimeRange }
                    handleCreatedTimeRangeChange={ handleCreatedTimeRangeChange }
                    handleCreatedCustomDateChange={ handleCreatedCustomDateChange }
                    updatedTimeRange={ updatedTimeRange }
                    handleUpdatedTimeRangeChange={ handleUpdatedTimeRangeChange }
                    handleUpdatedCustomDateChange={ handleUpdatedCustomDateChange }
                    searchWorkflowRequests={ searchWorkflowRequests }
                    loading={ isWorkflowInstancesLoading }
                />

                <ListLayout
                    currentListSize={ workflowRequests.length }
                    listItemLimit={ limit }
                    onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                    onPageChange={ handlePaginationChange }
                    showPagination={ true }
                    totalPages={ Math.ceil(totalResults / limit) }
                    totalListSize={ totalResults }
                    isLoading={ isWorkflowInstancesLoading }
                    data-componentid="workflow-requests-list-layout"
                >
                    <WorkflowRequestsList
                        workflowRequestsList={ workflowRequests }
                        isLoading={ isWorkflowInstancesLoading }
                        handleWorkflowRequestView={
                            (workflowRequest: WorkflowInstanceListItemInterface) =>
                                history.push(
                                    AppConstants.getPaths().get("WORKFLOW_REQUESTS") +
                                    "/" +
                                    workflowRequest.workflowInstanceId
                                )
                        }
                        onSearchQueryClear={ clearAllFilters }
                        searchQuery={ null }
                        data-componentid="workflow-requests-list"
                    />
                </ListLayout>
            </div>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
WorkflowRequestsPage.defaultProps = {
    "data-testid": "workflow-requests"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */

export default WorkflowRequestsPage;
