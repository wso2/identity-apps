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
    activePoliciesPlaceholder: {
        subtitle: "There are currently no active policies to display.",
        title: "No active policies found"
    },
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
        backBtn: "Go back to Policy Administration ",
        disabledBtnTooltip: "You need to deactivate this policy to enable editing."
    },
    inactivePoliciesPlaceholder: {
        subtitle: "There are currently no inactive policies to display.",
        title: "No inactive policies found"
    },
    policyAlgorithm: {
        actionText: "Select a policy combining algorithm",
        algorithmOptions: {
            denyOverrides: {
                description: "The deny-overrides combining algorithm is intended for those cases where a \"Deny\" decision will have priority over a \"Permit\" decision."
            },
            denyUnlessPermit: {
                description: "This algorithm Denies unless explicitly permitted. If no policy results in a \"Permit\", the final decision is \"Deny\". However, if any policy results in a \"Permit,\" the final decision will be \"Permit.\""
            },
            firstApplicable: {
                description: "The first policy that produces a definitive result (\"Permit\" or \"Deny\") determines the final decision."
            },
            onlyOneApplicable: {
                description: "This algorithm ensures that exactly one policy applies and returns the decision from that policy. If multiple policies can apply or none at all, the result is \"Indeterminate.\""
            },
            orderedDenyOverrides: {
                description: "The policies are evaluated in order and if a \"Deny\" is encountered, the decision is \"Deny\"."
            },
            orderedPermitOverrides: {
                description: "The policies are evaluated in order and if a \"Permit\" is encountered, the decision is \"Permit\"."
            },
            permitOverrides: {
                description: "The permit-overrides combining algorithm is intended for those cases where a \"Permit\" decision will have priority over a \"Deny\" decision."
            },
            permitUnlessDeny: {
                description: "This algorithm Permits unless explicitly denied. If no policy results in a \"Deny\", the final decision is \"Permit\". However, if any policy results in a \"Deny,\" the final decision will be \"Deny.\""
            }
        },
        primaryBtn: "Update",
        title: "Policy Algorithm"
    },
    popup:{
        activate: "Activate",
        deactivate: "Deactivate"
    },
    subtitle: "Create and manage your policies here.",
    title: "Policy Administration"
};
