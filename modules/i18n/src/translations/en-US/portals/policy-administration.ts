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
        primaryBtn: "Update",
        title: "Policy Algorithm"
    },
    subtitle: "Create and manage your policies here.",
    title: "Policy Administration"
};
