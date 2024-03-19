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

import { ApprovalsNS } from "../../../models/namespaces/approvals-ns";

export const approvals:ApprovalsNS ={
    list: {
        columns: {
            actions: "Actions",
            name: "Name"
        }
    },
    modals: {
        approvalProperties: {
            "Claims": "Claims",
            "REQUEST ID": "Request ID",
            "Roles": "Roles",
            "User Store Domain": "User Store Domain",
            "Username": "Username"
        },
        taskDetails: {
            description: "You have a request to approve an operational action of a user.",
            header: "Approval Task"
        }
    },
    notifications: {
        fetchApprovalDetails: {
            error: {
                description: "{{description}}",
                message: "Error retrieving the approval details"
            },
            genericError: {
                description: "Couldn't update the approval details",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully retrieved the approval details.",
                message: "Approval details retrieval successful"
            }
        },
        fetchPendingApprovals: {
            error: {
                description: "{{description}}",
                message: "Error retrieving pending approvals"
            },
            genericError: {
                description: "Couldn't retrieve pending approvals",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully retrieved pending approvals.",
                message: "Pending approvals retrieval successful"
            }
        },
        updatePendingApprovals: {
            error: {
                description: "{{description}}",
                message: "Error updating the approval"
            },
            genericError: {
                description: "Couldn't update the approval",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully updated the approval.",
                message: "Update successful"
            }
        }
    },
    placeholders: {
        emptyApprovalFilter: {
            action: "View all",
            subtitles: {
                0: "There are currently no approvals in {{status}} state.",
                1: "Please check if you have any tasks in {{status}} state to",
                2: "view them here."
            },
            title: "No results found"
        },
        emptyApprovalList: {
            action: "",
            subtitles: {
                0: "There are currently no approvals to review.",
                1: "Please check if you have added a workflow to control the operations in the system.",
                2: ""
            },
            title: "No Approvals"
        },
        emptySearchResults: {
            action: "View all",
            subtitles: {
                0: "We couldn't find the workflow you searched for.",
                1: "Please check if you have a workflow with that name in",
                2: "the system."
            },
            title: "No Approvals"
        }
    }
};
