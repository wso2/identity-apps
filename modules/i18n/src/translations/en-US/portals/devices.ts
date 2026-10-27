/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { DevicesNS } from "../../../models/namespaces/devices-ns";

export const devices: DevicesNS = {
    assurancePolicies: {
        advancedSearch: {
            emptyResults: {
                clearButton: "Clear search query",
                subtitles: {
                    0: "We could not find any results for \"{{query}}\"",
                    1: "Please try a different search term."
                },
                title: "No results found"
            },
            placeholder: "Search by policy name"
        },
        backButton: "Go back to Login & Registration",
        connector: {
            description: "Define the device conditions users must meet on each platform.",
            header: "Device Assurance"
        },
        description: "Define the device conditions users must meet on each platform.",
        list: {
            columns: {
                actions: "Actions",
                name: "Policy Name"
            },
            confirmations: {
                delete: {
                    assertionHint: "Please confirm your action.",
                    content: "Flows that use this policy will no longer be able to evaluate it. " +
                        "Please proceed with caution.",
                    header: "Are you sure?",
                    message: "This action is irreversible and will permanently delete the policy."
                }
            }
        },
        notifications: {
            delete: {
                genericError: {
                    description: "An error occurred while deleting the device assurance policy.",
                    message: "Delete failed"
                },
                success: {
                    description: "The device assurance policy has been deleted successfully.",
                    message: "Policy deleted"
                }
            },
            fetch: {
                genericError: {
                    description: "An error occurred while retrieving device assurance policies.",
                    message: "Retrieval failed"
                }
            }
        },
        placeholders: {
            empty: {
                subtitles: {
                    0: "There are no device assurance policies configured yet."
                },
                title: "No policies"
            }
        },
        platforms: {
            android: "Android",
            ios: "iOS",
            macos: "macOS",
            windows: "Windows"
        },
        title: "Device Assurance Policies",
        view: {
            backButton: "Go back to Device Assurance Policies",
            notifications: {
                fetch: {
                    genericError: {
                        description: "An error occurred while retrieving the device assurance policy.",
                        message: "Retrieval failed"
                    }
                },
                fetchMetadata: {
                    genericError: {
                        description: "An error occurred while retrieving the device policy conditions.",
                        message: "Retrieval failed"
                    }
                }
            },
            rules: {
                empty: "No conditions are configured for this platform."
            }
        }
    }
};
