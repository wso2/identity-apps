/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

export interface ApprovalsNS {
    list: {
        columns: {
            actions: string;
            name: string;
        };
    };
    modals: {
        approvalProperties: {
            "Claims": string,
            "REQUEST ID": string,
            "Roles": string,
            "User Store Domain": string,
            "Username": string,
        },
        taskDetails: {
            header: string;
            description: string;
        };
    };
    notifications: {
        fetchApprovalDetails: {
            error: {
                message: string;
                description: string;
            }
            genericError: {
                message: string;
                description: string;
            }
            success: {
                message: string;
                description: string;
            }
        };
        fetchPendingApprovals: {
            error: {
                message: string;
                description: string;
            }
            genericError: {
                message: string;
                description: string;
            }
            success: {
                message: string;
                description: string;
            }
        };
        updatePendingApprovals: {
            error: {
                message: string;
                description: string;
            }
            genericError: {
                message: string;
                description: string;
            }
            success: {
                message: string;
                description: string;
            }
        };
    };
    placeholders: {
        emptyApprovalList: {
            action: string;
            title: string;
            subtitles:  {
                0:string,
                1:string
                2:string
            }
        };
        emptyApprovalFilter: {
            action: string;
            title: string;
            subtitles:  {
                0:string,
                1:string
                2:string
            }
        };
        emptySearchResults: {
            action:string;
            title: string;
            subtitles:  {
                0: string,
                1:string
                2:string
            }
        }
    };
}
