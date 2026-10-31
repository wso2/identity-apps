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

import { CliSettingsNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
export const cliSettings: CliSettingsNS = {
    enablement: {
        description: "When disabled, all CLI access to this organization is blocked.",
        disableConfirmation: {
            content: "You can re-enable this at any time without losing existing user access.",
            heading: "Disable CLI access?",
            message: "Active CLI sessions will be terminated immediately, and users will no longer be able to sign in through the CLI. Please proceed with caution."
        },
        notifications: {
            disabled: {
                description: "The CLI has been disabled successfully.",
                message: "CLI Disabled"
            },
            enabled: {
                description: "The CLI has been enabled successfully.",
                message: "CLI Enabled"
            },
            genericError: {
                disableDescription: "Failed to disable the CLI.",
                enableDescription: "Failed to enable the CLI.",
                message: "Something went wrong"
            }
        },
        status: {
            disabled: "Disabled",
            enabled: "Enabled"
        },
        title: "CLI",
        toggleAriaLabel: "Enable CLI"
    },
    notConfigured: {
        subtitle: "The {{productName}} CLI is not configured for this deployment.",
        title: "{{productName}} CLI is not available"
    },
    page: {
        description: "Enable the CLI to manage your organization from the command line.",
        title: "CLI Settings"
    },
    tabs: {
        users: "Users"
    },
    users: {
        heading: "Users with CLI Access",
        list: {
            emptyPlaceholder: {
                action: "Assign Users",
                subtitles: "There are no users with CLI access yet.",
                title: "No users with CLI access"
            }
        },
        notifications: {
            pendingApproval: {
                description: "The CLI access update was accepted and is pending approval.",
                message: "CLI access update accepted for approval"
            },
            success: {
                description: "CLI access has been successfully updated for the users.",
                message: "CLI access updated"
            }
        },
        roleNotFound: {
            description: "A role named \"{{roleName}}\" could not be found.",
            subtitle: "Create the role to manage CLI access.",
            title: "CLI Administrator role not found"
        },
        subHeading: "Add or remove users who can access the CLI."
    }
};
