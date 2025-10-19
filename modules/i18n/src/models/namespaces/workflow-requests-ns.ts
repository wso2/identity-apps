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

export interface workflowRequestsNS {
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
    status: {
        aborted: string;
        all: string;
        approved: string;
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
        createUser: string;
        selfRegisterUser: string;
        deleteUser: string;
        updateUserRoles: string;
        createRole: string;
        deleteRole: string;
        updateRoleName: string;
        updateRoleUsers: string;
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
        dangerZone: {
            header: string;
            abort: {
                action: string;
                actionTitle: string;
                header: string;
                subheader: string;
                confirm: string;
            };
        };
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
        last15Minutes: string;
        last30Minutes: string;
        last1Hour: string;
        customRange: string;
        customRangeTitle: string;
        range: string;
    };
    activeFiltersBar: {
        removeFilter: string;
        noActiveFilters: string;
        clearAll: string;
    };
    filters: {
        requestType: string;
        status: string;
        operationType: string;
        createdTimeRange: string;
        updatedTimeRange: string;
        disabledTimeRange: string;
    };
    placeholders: {
        emptySearch: {
            action: string;
            title: string;
            subtitles: {
                0: string;
            };
        };
        emptyListReadOnly: {
            title: string;
            subtitles: {
                0: string;
            };
        };
        workflowRequestError: {
            subtitles: {
                0: string;
                1: string;
            };
            title: string;
        };
    };
    notifications: {
        abortWorkflowRequest: {
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
    };
}
