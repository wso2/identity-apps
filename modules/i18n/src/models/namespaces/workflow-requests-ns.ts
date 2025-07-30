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
export interface WorkflowRequestsNS {
    notifications: {
        deleteWorkflowRequest: {
            genericError: {
                description: string;
                message: string;
            };
            success: {
                description: string;
                message: string;
            };
        };
        fetchWorkflowRequestDetails: {
            genericError: {
                description: string;
                message: string;
            };
            success: {
                description: string;
                message: string;
            };
        };
        fetchWorkflowRequests: {
            genericError: {
                description: string;
                message: string;
            };
        };
        searchWorkflowRequests: {
            genericError: {
                description: string;
                message: string;
            };
        };
        testConnection: {
            genericError: {
                description: string;
                message: string;
            };
            success: {
                description: string;
                message: string;
            };
        };
    };
    pageLayout: {
        list: {
            description: string;
            popups: {
                delete: string;
            };
            title: string;
        };
    };
    list: {
        columns: {
            workflowInstanceId: string;
            status: string;
            requestInitiator: string;
            createdAt: string;
            updatedAt: string;
            actions: string;
        };
    };
    form: {
        placeholders: {
            emptySearch: {
                action: string;
                subtitles: string;
                title: string;
            };
            emptyListReadOnly: {
                subtitles: string;
                title: string;
            };
        };
    };
    confirmation: {
        content: string;
        header: string;
        hint: string;
        message: string;
    };
    status: {
        all: string;
        approved: string;
        deleted: string;
        failed: string;
        pending: string;
        rejected: string;
    };
    eventType: {
        all: string;
        myTasks: string;
    };
    operationType: {
        all: string;
        addUser: string;
        deleteUser: string;
        updateRolesOfUsers: string;
        addRole: string;
        deleteRole: string;
        updateRoleName: string;
        updateUsersOfRoles: string;
        deleteUserClaims: string;
        updateUserClaims: string;
    };
    details: {
        header: string;
        fields: {
            id: string;
            eventType: string;
            requestInitiator: string;
            status: string;
            createdAt: string;
            updatedAt: string;
            requestParams: string;
        };
        loading: string;
        error: {
            header: string;
            content: string;
        };
        backButton: string;
    };
    timeRanges: {
        all: string;
        last6Hours: string;
        last12Hours: string;
        last24Hours: string;
        last2Days: string;
        last7Days: string;
        last14Days: string;
        last30Days: string;
        customRange: string;
    };
}
