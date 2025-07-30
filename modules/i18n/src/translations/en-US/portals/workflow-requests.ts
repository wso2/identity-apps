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
import { WorkflowRequestsNS } from "../../../models/namespaces/workflow-requests-ns";

const addPrefix = (obj: any): any => {
    if (typeof obj === "string") {
        return `workflow_requests:${obj}`;
    } else if (Array.isArray(obj)) {
        return obj.map(addPrefix);
    } else if (typeof obj === "object" && obj !== null) {
        const newObj: any = {};
        for (const key in obj) {
            newObj[key] = addPrefix(obj[key]);
        }
        return newObj;
    }
    return obj;
};

const workflowRequests: WorkflowRequestsNS = addPrefix({
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
        },
        testConnection: {
            genericError: {
                description: "An error occurred while testing the connection to the workflow requests",
                message: "Something went wrong"
            },
            success: {
                description: "The connection is healthy.",
                message: "Connection successful!"
            }
        }
    },
    pageLayout: {
        list: {
            description: "Create and manage workflow requests.",
            popups: {
                delete: "Delete Workflow request",
            },
            title: "Workflow Requests"
        }
    },
    list: {
        columns: {
            workflowInstanceId: "Workflow Instance ID",
            status: "Status",
            requestInitiator: "Request Initiator",
            createdAt: "Created At",
            updatedAt: "Updated At",
            actions: "Actions"
        }
    },
    form: {
        placeholders: {
            emptySearch: {
                action: "Clear search query",
                subtitles: "We couldn't find any workflow requests for {{searchQuery}}",
                title: "No results found"
            },
            emptyListReadOnly: {
                subtitles: "There are currently no workflow requests available.",
                title: "No workflow requests found"
            }
        }
    },
    confirmation: {
        content: "This action is irreversible and will permanently delete the selected workflow request.",
        header: "Are you sure?",
        hint: "Please type <bold>confirm</bold> to proceed.",
        message: "This action is irreversible and will permanently delete the selected workflow request."
    },
    status: {
        all: "All Tasks",
        approved: "Approved",
        deleted: "Deleted",
        failed: "Failed",
        pending: "Pending",
        rejected: "Rejected"
    },
    eventType: {
        all: "All Tasks",
        myTasks: "My Tasks"
    },
    operationType: {
        all: "All Operations",
        addUser: "Add User",
        deleteUser: "Delete User",
        updateRolesOfUsers: "Update Roles of Users",
        addRole: "Add Role",
        deleteRole: "Delete Role",
        updateRoleName: "Update Role Name",
        updateUsersOfRoles: "Update Users of Roles",
        deleteUserClaims: "Delete User Claims",
        updateUserClaims: "Update User Claims"
    },
    details: {
        header: "Workflow Request Details",
        fields: {
            id: "ID",
            eventType: "Event Type",
            requestInitiator: "Request Initiator",
            status: "Status",
            createdAt: "Created At",
            updatedAt: "Updated At",
            requestParams: "Request Params"
        },
        loading: "Loading...",
        error: {
            header: "Error",
            content: "Failed to load workflow request details."
        },
        backButton: "Back"
    },
    timeRanges: {
        all: "All",
        last6Hours: "Last 6 hours",
        last12Hours: "Last 12 hours",
        last24Hours: "Last 24 hours",
        last2Days: "Last 2 days",
        last7Days: "Last 7 days",
        last14Days: "Last 14 days",
        last30Days: "Last 30 days",
        customRange: "Custom Range"
    }
});

export default workflowRequests;
