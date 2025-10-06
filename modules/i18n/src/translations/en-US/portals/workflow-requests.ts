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
import { workflowRequestsNS } from "../../../models";

export const workflowRequests: workflowRequestsNS = {
    activeFiltersBar: {
        clearAll: "Clear all",
        noActiveFilters: "No active filters",
        removeFilter: "Remove {{filter}} filter"
    },
    details: {
        backButton: "Go back to Workflow Requests",
        dangerZone: {
            abort: {
                action: "Abort",
                actionTitle: "Abort Workflow Request",
                confirm: "Are you sure you want to abort this workflow request? This action cannot be undone.",
                header: "Abort Workflow Request",
                subheader: "Once you abort a workflow request, there is no going back. Please be certain."
            },
            header: "Danger Zone"
        },
        error: {
            content: "Failed to load workflow request details.",
            header: "Error"
        },
        fields: {
            createdAt: "Created At",
            eventType: "Event Type",
            id: "ID",
            requestInitiator: "Request Initiator",
            requestParams: "Request Params",
            status: "Status",
            updatedAt: "Updated At"
        },
        header: "Workflow Request Details",
        loading: "Loading..."
    },
    eventType: {
        all: "All Tasks",
        myTasks: "My Tasks"
    },
    filters: {
        createdTimeRange: "Created Time Range",
        operationType: "Operation Type",
        requestType: "Request Type",
        status: "Status",
        updatedTimeRange: "Updated Time Range"
    },
    list: {
        columns: {
            actions: "Actions",
            createdAt: "Created At",
            requestInitiator: "Request Initiator",
            status: "Status",
            updatedAt: "Updated At",
            workflowInstanceId: "Operation Type"
        }
    },
    notifications: {
        deleteWorkflowRequest: {
            genericError: {
                description: "An error occurred while deleting the workflow request",
                message: "Something went wrong"
            },
            success: {
                description: "Workflow request deleted successfully.",
                message: "Workflow request deleted successfully!"
            }
        },
        fetchWorkflowRequestDetails: {
            genericError: {
                description: "An error occurred while fetching the workflow request details",
                message: "Something went wrong"
            },
            success: {
                description: "Workflow request details fetched successfully.",
                message: "Workflow request details fetched successfully!"
            }
        },
        fetchWorkflowRequests: {
            genericError: {
                description: "An error occurred while fetching the workflow requests",
                message: "Something went wrong"
            }
        },
        searchWorkflowRequests: {
            genericError: {
                description: "An error occurred while searching the workflow requests",
                message: "Something went wrong"
            }
        }
    },
    operationType: {
        all: "All Operations",
        createRole: "Create Role",
        createUser: "Create User",
        deleteRole: "Delete Role",
        deleteUser: "Delete User",
        deleteUserClaims: "Delete User Claims",
        selfRegisterUser: "Self Register User",
        updateRoleName: "Update Role Name",
        updateRoleUsers: "Update Role Users",
        updateUserClaims: "Update User Claims",
        updateUserRoles: "Update User Roles"
    },
    placeholders: {
        emptyListReadOnly: {
            subtitles: {
                0: "There are currently no workflow requests available."
            },
            title: "No workflow requests"
        },
        emptySearch: {
            action: "Clear search query",
            subtitles: {
                0: "We couldn't find any results for {{searchQuery}}. Please try a different search term."
            },
            title: "No results found"
        },
        workflowRequestError: {
            subtitles: {
                0: "Couldn't fetch workflow requests",
                1: "Please try again"
            },
            title: "Something went wrong"
        }
    },
    status: {
        aborted: "Aborted",
        all: "All Tasks",
        approved: "Approved",
        failed: "Failed",
        pending: "Pending",
        rejected: "Rejected"
    },
    timeRanges: {
        all: "All",
        customRange: "Custom Range",
        customRangeTitle: "Custom {{label}}",
        last12Hours: "Last 12 hours",
        last14Days: "Last 14 days",
        last15Minutes: "Last 15 minutes",
        last1Hour: "Last 1 hour",
        last24Hours: "Last 24 hours",
        last2Days: "Last 2 days",
        last30Days: "Last 30 days",
        last30Minutes: "Last 30 minutes",
        last6Hours: "Last 6 hours",
        last7Days: "Last 7 days",
        range: "Range"
    }
};
