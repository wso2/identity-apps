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

import { policyAdministrationNS } from "../../../models";

export const policyAdministration: policyAdministrationNS = {
    advancedSearch: {
        placeholder: "Search by policy name"
    },
    alerts: {
        activateFailure: {
            description: "Failed to activate the policy. Please try again.",
            message: "Activation Failed"
        },
        activateSuccess: {
            description: "The policy has been activated successfully.",
            message: "Activation Successful"
        },
        createFailure: {
            description: "Failed to create the policy. Please try again.",
            message: "Creation Failed"
        },
        createSuccess: {
            description: "The policy has been created successfully.",
            message: "Creation Successful"
        },
        deactivateFailure: {
            description: "Failed to deactivate the policy. Please try again.",
            message: "Deactivation Failed"
        },
        deactivateSuccess: {
            description: "The policy has been deactivated successfully.",
            message: "Deactivation Successful"
        },
        deleteFailure: {
            description: "Failed to delete the policy. Please try again.",
            message: "Delete Failed"
        },
        deleteSuccess: {
            description: "The policy has been deleted successfully.",
            message: "Delete Successful"
        },
        updateAlgorithmFailure: {
            description: "Failed to update the policy algorithm. Please try again.",
            message: "Algorithm Update Failed"
        },
        updateAlgorithmSuccess: {
            description: "The policy algorithm has been updated successfully.",
            message: "Algorithm Update Successful"
        },
        updateFailure: {
            description: "Failed to update the policy. Please try again.",
            message: "Update Failed"
        },
        updateSuccess: {
            description: "The policy has been updated successfully.",
            message: "Update Successful"
        }
    },
    buttons: {
        newPolicy: "New Policy",
        policyAlgorithm: "Policy Algorithm"
    },
    createPolicy: {
        description: "Defines access control rules for secure and fine-grained resource authorization.",
        title: "Create Policy"
    },
    editPolicy: {
        backBtn: "Go back to Policy Administration "
    },
    policyAlgorithm: {
        actionText: "Select a policy combining algorithm",
        algorithmOptions: {
            denyOverrides: {
                description: "The deny overrides combining algorithm is intended for those cases where a deny decision should have priority over a permit decision."
            },
            denyUnlessPermit: {
                description: "This algorithm denies access unless explicitly permitted. If none of the policies produce a \"Permit,\" the result is \"Deny.\" However, if any policy results in a \"Permit,\" the final decision will be \"Permit.\""
            },
            firstApplicable: {
                description: "The first policy that produces a definitive result (\"Permit\" or \"Deny\") determines the final decision."
            },
            onlyOneApplicable: {
                description: "This algorithm requires exactly one applicable policy. If multiple policies can apply or none of them do, the result is \"Indeterminate.\" Otherwise, the decision from the single applicable policy is returned."
            },
            orderedDenyOverrides: {
                description: "The policies are evaluated in the order they are listed, and the first \"Deny\" encountered overrides others."
            },
            orderedPermitOverrides: {
                description: "The policies are evaluated in the order they are listed, and the first \"Permit\" encountered overrides others."
            },
            permitOverrides: {
                description: "The permit overrides combining algorithm is intended for those cases where a permit decision should have priority over a deny decision."
            },
            permitUnlessDeny: {
                description: "This algorithm allows access unless explicitly denied. If none of the policies produce a \"Deny,\" the result is \"Permit.\" However, if any policy results in a \"Deny,\" the final decision will be \"Deny.\""
            }
        },
        primaryBtn: "Update",
        title: "Policy Algorithm"
    },
    subtitle: "Create and manage your policies here.",
    title: "Policy Administration"
};
