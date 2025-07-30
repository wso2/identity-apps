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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ListLayout, PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Button, DropdownItemProps, DropdownProps, PaginationProps } from "semantic-ui-react";
import { UIConstants } from "../../admin.core.v1/constants/ui-constants";
import { deleteWorkflowInstance, fetchWorkflowInstance, fetchWorkflowInstances } from "../api/workflow-requests";
import { 
    WorkflowInstanceListItemInterface,
    WorkflowInstanceListResponseInterface,
    WorkflowInstanceOperationType,
    WorkflowInstanceRequestType,
    WorkflowInstanceStatus
} from "../models/workflowRequests";
import { generateFilterString } from "../utils/generateFilterString";
import WorkflowRequestsList from "../components/workflow-requests-list";
import ActiveFiltersBar from "../components/active-filters-bar";
import { history } from "../../admin.core.v1/helpers/history";
import { AppConstants } from "../../admin.core.v1/constants/app-constants";
import { formatMsToBackend } from "../utils/formatDateTimeToBackend";
import WorkflowRequestsFilter from "../components/workflow-requests-filter";
import { error } from "console";
import "../styles/workflow-requests.css";

type WorkflowsLogsPageInterface = IdentifiableComponentInterface & {
    "data-testid"?: string;
};

interface FilterTag {
    key: string;
    label: string;
    value: string;
    type: 'requestType' | 'status' | 'dateCategory' | 'createdTimeRange' | 'updatedTimeRange' | 'operationType';
}

const WorkflowRequestsPage: FunctionComponent<WorkflowsLogsPageInterface> = (
    props: WorkflowsLogsPageInterface
): ReactElement => {

    const {
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation([ "workflow-requests" ]);
    const dispatch: Dispatch = useDispatch();

    // State variables
    const [workflowRequests, setWorkflowRequests] = useState<WorkflowInstanceListItemInterface[]>([]);
    const [requestType, setRequestType] = useState<string>("ALL_TASKS");
    const [status, setStatus] = useState<string>("ALL_TASKS");
    const [operationType, setOperationType] = useState<string>("ALL");
    const [createdTimeRange, setCreatedTimeRange] = useState<number | undefined>(-2);
    const [createdFromTime, setCreatedFromTime] = useState<string>("");
    const [createdToTime, setCreatedToTime] = useState<string>("");
    const [updatedTimeRange, setUpdatedTimeRange] = useState<number | undefined>(-2);
    const [updatedFromTime, setUpdatedFromTime] = useState<string>("");
    const [updatedToTime, setUpdatedToTime] = useState<string>("");
    const [filterString, setFilterString] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [limit, setLimit] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [offset, setOffset] = useState<number>(0);
    const [totalResults, setTotalResults] = useState<number>(0);

    const getDateFilterParams = () => {
        let dateCategory = "";
        let beginDate = "";
        let endDate = "";
        if (createdTimeRange !== undefined && createdTimeRange !== -2) {
            dateCategory = "CREATED";
            beginDate = createdFromTime ? formatMsToBackend(createdFromTime, true) : "";
            endDate = createdToTime ? formatMsToBackend(createdToTime, false) : "";
        } else if (updatedTimeRange !== undefined && updatedTimeRange !== -2) {
            dateCategory = "UPDATED";
            beginDate = updatedFromTime ? formatMsToBackend(updatedFromTime, true) : "";
            endDate = updatedToTime ? formatMsToBackend(updatedToTime, false) : "";
        }
        return { dateCategory, beginDate, endDate };
    };

    const INSTANCE_STATUSES: DropdownItemProps[] = [
        { key: WorkflowInstanceStatus.ALL_TASKS, text: t("workflow-requests:status.all"), value: "ALL_TASKS" },
        { key: WorkflowInstanceStatus.FAILED, text: t("status.failed"), value: "FAILED" },
        { key: WorkflowInstanceStatus.APPROVED, text: t("status.approved"), value: "APPROVED" },
        { key: WorkflowInstanceStatus.PENDING, text: t("status.pending"), value: "PENDING" },
        { key: WorkflowInstanceStatus.DELETED, text: t("status.deleted"), value: "DELETED" },
        { key: WorkflowInstanceStatus.REJECTED, text: t("status.rejected"), value: "REJECTED" }
    ];

    const REQUEST_TYPES: DropdownItemProps[] = [
        { key: WorkflowInstanceRequestType.ALL_TASKS, text: t("eventType.all"), value: "ALL_TASKS" },
        { key: WorkflowInstanceRequestType.MY_TASKS, text: t("eventType.myTasks"), value: "MY_TASKS" }
    ];

    const OPERATION_TYPES: DropdownItemProps[] = [
        { key: WorkflowInstanceOperationType.ALL, text: t("operationType.all"), value: "ALL" },
        { key: WorkflowInstanceOperationType.ADD_USER, text: t("operationType.addUser"), value: "ADD_USER" },
        { key: WorkflowInstanceOperationType.DELETE_USER, text: t("operationType.deleteUser"), value: "DELETE_USER" },
        { key: WorkflowInstanceOperationType.UPDATE_ROLES_OF_USERS, text: t("operationType.updateRolesOfUsers"), value: "UPDATE_ROLES_OF_USERS" },
        { key: WorkflowInstanceOperationType.ADD_ROLE, text: t("operationType.addRole"), value: "ADD_ROLE" },
        { key: WorkflowInstanceOperationType.DELETE_ROLE, text: t("operationType.deleteRole"), value: "DELETE_ROLE" },
        { key: WorkflowInstanceOperationType.UPDATE_ROLE_NAME, text: t("operationType.updateRoleName"), value: "UPDATE_ROLE_NAME" },
        { key: WorkflowInstanceOperationType.UPDATE_USERS_OF_ROLES, text: t("operationType.updateUsersOfRoles"), value: "UPDATE_USERS_OF_ROLES" },
        { key: WorkflowInstanceOperationType.DELETE_USER_CLAIMS, text: t("operationType.deleteUserClaims"), value: "DELETE_USER_CLAIMS" },
        { key: WorkflowInstanceOperationType.UPDATE_USER_CLAIMS, text: t("operationType.updateUserClaims"), value: "UPDATE_USER_CLAIMS" }
    ];

    const TIME_RANGE_OPTIONS = [
        { key: -2, text: t("timeRanges.all"), value: -2 },
        { key: 0.25, text: t("timeRanges.last15Minutes"), value: 0.25 },
        { key: 0.5, text: t("timeRanges.last30Minutes"), value: 0.5 },
        { key: 1, text: t("timeRanges.last1Hour"), value: 1 },
        { key: 6, text: t("timeRanges.last6Hours"), value: 6 },
        { key: 12, text: t("timeRanges.last12Hours"), value: 12 },
        { key: 24, text: t("timeRanges.last24Hours"), value: 24 },
        { key: 48, text: t("timeRanges.last48Hours"), value: 48 },
        { key: 168, text: t("timeRanges.last7Days"), value: 168 },
        { key: 720, text: t("timeRanges.last30Days"), value: 720 },
        { key: -1, text: t("timeRanges.customRange"), value: -1 }
    ];

    const getDisplayLabel = (type: string, value: string): string => {
        switch (type) {
            case 'operationType':
                switch (value) {
                    case 'ALL': return t('operationType.all');
                    case 'ADD_USER': return t('operationType.addUser');
                    case 'DELETE_USER': return t('operationType.deleteUser');
                    case 'UPDATE_ROLES_OF_USERS': return t('operationType.updateRolesOfUsers');
                    case 'ADD_ROLE': return t('operationType.addRole');
                    case 'DELETE_ROLE': return t('operationType.deleteRole');
                    case 'UPDATE_ROLE_NAME': return t('operationType.updateRoleName');
                    case 'UPDATE_USERS_OF_ROLES': return t('operationType.updateUsersOfRoles');
                    case 'DELETE_USER_CLAIMS': return t('operationType.deleteUserClaims');
                    case 'UPDATE_USER_CLAIMS': return t('operationType.updateUserClaims');
                    default: return value;
                }
            case 'requestType':
                return REQUEST_TYPES.find(item => item.value === value)?.text?.toString() || value;
            case 'status':
                return INSTANCE_STATUSES.find(item => item.value === value)?.text?.toString() || value;
            case 'dateCategory':
                return TIME_RANGE_OPTIONS.find(item => item.value === Number(value))?.text || value;
            case 'createdTimeRange':
            case 'updatedTimeRange': {
                if (value === "-1") return TIME_RANGE_OPTIONS.find(item => item.value === -1)?.text || value;
                const option = TIME_RANGE_OPTIONS.find(item => item.value === Number(value));
                return option ? option.text : value;
            }
            default:
                return value;
        }
    };

    const getActiveFilters = (): FilterTag[] => {
        const filters: FilterTag[] = [];

        if (requestType !== "ALL_TASKS") {
            filters.push({
                key: 'requestType',
                label: getDisplayLabel('requestType', requestType),
                value: requestType,
                type: 'requestType'
            });
        }

        if (status !== "ALL_TASKS") {
            filters.push({
                key: 'status',
                label: getDisplayLabel('status', status),
                value: status,
                type: 'status'
            });
        }

        if (operationType !== "ALL") {
            filters.push({
                key: 'operationType',
                label: getDisplayLabel('operationType', operationType),
                value: operationType,
                type: 'operationType'
            });
        }

        if (createdTimeRange !== undefined && createdTimeRange !== -2) {
            filters.push({
                key: 'createdTimeRange',
                label: `${getDisplayLabel('createdTimeRange', createdTimeRange.toString())}`,
                value: createdTimeRange.toString(),
                type: 'createdTimeRange'
            });
        }

        if (updatedTimeRange !== undefined && updatedTimeRange !== -2) {
            filters.push({
                key: 'updatedTimeRange',
                label: `${getDisplayLabel('updatedTimeRange', updatedTimeRange.toString())}`,
                value: updatedTimeRange.toString(),
                type: 'updatedTimeRange'
            });
        }

        return filters;
    };

    const removeFilter = (filterToRemove: FilterTag): void => {
        switch (filterToRemove.type) {
            case 'requestType':
                setRequestType("ALL_TASKS");
                break;
            case 'status':
                setStatus("ALL_TASKS");
                break;
            case 'operationType':
                setOperationType("ALL");
                break;
            case 'createdTimeRange':
                setCreatedTimeRange(undefined);
                setCreatedFromTime("");
                setCreatedToTime("");
                break;
            case 'updatedTimeRange':
                setUpdatedTimeRange(undefined);
                setUpdatedFromTime("");
                setUpdatedToTime("");
                break;
        }
    };

    const clearAllFilters = (): void => {
        setRequestType("ALL_TASKS");
        setStatus("ALL_TASKS");
        setOperationType("ALL");
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

    const fetchWorkflowRequests = (limit: number, offset: number, filterString: string): void => {
        setLoading(true);
        fetchWorkflowInstances(limit, offset, filterString)
            .then((response: WorkflowInstanceListResponseInterface) => {
                setWorkflowRequests(response.instances);
                setTotalResults(response.totalResults);
                setLoading(false);
            })
            .catch((error: any) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    dispatch(addAlert({
                        description: t(
                            "console:manage.features.workflowRequests.notifications.fetchWorkflowRequests.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.workflowRequests.notifications.fetchWorkflowRequests.error.message"
                        )
                    }));
                } else {
                    dispatch(addAlert({
                        description: t(
                            "console:manage.features.workflowRequests.notifications.fetchWorkflowRequests.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.workflowRequests.notifications.fetchWorkflowRequests.genericError.message"
                        )
                    }));
                }
                setLoading(false);
            });
    };

    const searchWorkflowRequests = (): void => {
        const { dateCategory, beginDate, endDate } = getDateFilterParams();
        const generatedFilter = generateFilterString(
            requestType,
            status,
            operationType,
            dateCategory,
            beginDate,
            endDate
        );
        console.log("Generated filter:", generatedFilter);
        setFilterString(generatedFilter);
        setOffset(0);
        fetchWorkflowRequests(limit, 0, generatedFilter);
    };

    // Fetch workflow request details
    // const fetchWorkflowRequestDetails = (id: string): void => {
    //     fetchWorkflowInstance(id)
    //         .then((instance: WorkflowInstanceResponseInterface) => {
    //             console.log("=== Workflow Instance Details ===");
    //             console.log("ID:", instance.workflowInstanceId);
    //             console.log("Event Type:", instance.eventType);
    //             console.log("Status:", instance.status);
    //             console.log("Request Initiator:", instance.requestInitiator);
    //             console.log("Created At:", instance.createdAt);
    //             console.log("Updated At:", instance.updatedAt);
    //             console.log("Request Params:", instance.requestParams);
    //             console.log("Full Response Object:", instance);
    //             console.log("================================");

    //             dispatch(addAlert({
    //                 description: t(
    //                     "console:manage.features.workflowRequests.notifications.fetchWorkflowRequestDetails.success.description",
    //                     { id: instance.workflowInstanceId }
    //                 ),
    //                 level: AlertLevels.SUCCESS,
    //                 message: t(
    //                     "console:manage.features.workflowRequests.notifications.fetchWorkflowRequestDetails.success.message"
    //                 )
    //             }));
    //         })
    //         .catch((error: any) => {
    //             if (error.response && error.response.data && error.response.data.detail) {
    //                 dispatch(addAlert({
    //                     description: t(
    //                         "console:manage.features.workflowRequests.notifications.fetchWorkflowRequestDetails.error.description",
    //                         { description: error.response.data.detail }
    //                     ),
    //                     level: AlertLevels.ERROR,
    //                     message: t(
    //                         "console:manage.features.workflowRequests.notifications.fetchWorkflowRequestDetails.error.message"
    //                     )
    //                 }));
    //             } else {
    //                 dispatch(addAlert({
    //                     description: t(
    //                         "console:manage.features.workflowRequests.notifications.fetchWorkflowRequestDetails.genericError.description"
    //                     ),
    //                     level: AlertLevels.ERROR,
    //                     message: t(
    //                         "console:manage.features.workflowRequests.notifications.fetchWorkflowRequestDetails.genericError.message"
    //                     )
    //                 }));
    //             }
    //         });
    // };

    // Delete workflow request
    const deleteWorkflowRequest = (id: string): void => {
        setLoading(true);
        deleteWorkflowInstance(id)
            .then(() => {
                dispatch(addAlert({
                    description: t(
                        "console:manage.features.workflowRequests.notifications.deleteWorkflowRequest.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "console:manage.features.workflowRequests.notifications.deleteWorkflowRequest.success.message"
                    )
                }));
                fetchWorkflowRequests(limit, offset, filterString);
                history.push(AppConstants.getPaths().get("WORKFLOW_REQUESTS"));

            })
            .catch((error: any) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    dispatch(addAlert({
                        description: t(
                            "console:manage.features.workflowRequests.notifications.deleteWorkflowRequest.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.workflowRequests.notifications.deleteWorkflowRequest.error.message"
                        )
                    }));
                } else {
                    dispatch(addAlert({
                        description: t(
                            "console:manage.features.workflowRequests.notifications.deleteWorkflowRequest.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.workflowRequests.notifications.deleteWorkflowRequest.genericError.message"
                        )
                    }));
                }
            })
            .finally(() => {
                setLoading(false);
            });
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

    useEffect(() => {
        fetchWorkflowRequests(limit, offset, filterString);
    }, [limit, offset, filterString ]);

    useEffect(() => {
        searchWorkflowRequests();
    }, [requestType, status, createdTimeRange, createdFromTime, createdToTime, updatedTimeRange, updatedFromTime, updatedToTime, operationType]);

    const activeFilters = getActiveFilters();

    return (
        <PageLayout
            title={t("pages:workflowRequestsPage.title")}
            pageTitle={t("pages:workflowRequestsPage.title")}
            description={t("pages:workflowRequestsPage.subTitle")}
            data-testid={`${testId}-page-layout`}
        >
            <div className="workflow-requests-page-content">
                <ActiveFiltersBar
                    filters={activeFilters}
                    onRemove={removeFilter}
                    onClearAll={clearAllFilters}
                    data-componentid="workflow-requests-active-filters-bar"
                />
                <WorkflowRequestsFilter
                    requestType={requestType}
                    setRequestType={setRequestType}
                    status={status}
                    setStatus={setStatus}
                    operationType={operationType}
                    setOperationType={setOperationType}
                    createdTimeRange={createdTimeRange}
                    handleCreatedTimeRangeChange={handleCreatedTimeRangeChange}
                    handleCreatedCustomDateChange={handleCreatedCustomDateChange}
                    updatedTimeRange={updatedTimeRange}
                    handleUpdatedTimeRangeChange={handleUpdatedTimeRangeChange}
                    handleUpdatedCustomDateChange={handleUpdatedCustomDateChange}
                    searchWorkflowRequests={searchWorkflowRequests}
                    loading={loading}
                />
                
                <ListLayout
                    currentListSize={ workflowRequests.length }
                    listItemLimit={ limit }
                    onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                    onPageChange={ handlePaginationChange }
                    showPagination={ true }
                    totalPages={ Math.ceil(totalResults / limit) }
                    totalListSize={ totalResults }
                    isLoading={ loading }
                    data-componentid="workflow-requests-list-layout"
                >
                    <WorkflowRequestsList
                        workflowRequestsList={ workflowRequests }
                        isLoading={ loading }
                        handleWorkflowRequestDelete={ (workflowRequest) => {
                            if (workflowRequest) deleteWorkflowRequest(workflowRequest.workflowInstanceId);
                        } }
                        handleWorkflowRequestView={ (workflowRequest) => history.push(AppConstants.getPaths().get("WORKFLOW_LOGS") + "/" + workflowRequest.workflowInstanceId) }
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
