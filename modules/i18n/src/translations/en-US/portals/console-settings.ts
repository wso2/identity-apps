/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
import { ConsoleSettingsNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */
export const consoleSettings: ConsoleSettingsNS = {
    administrators: {
        add: {
            action: "Add Administrator",
            options: {
                addExistingUser: "Add Existing User",
                addExternalUser: "Invite Admins to Asgardeo",
                inviteParentUser: "Invite Parent User"
            }
        },
        edit: {
            backButton: "Go back to Administrators"
        },
        tabLabel: "Administrators"
    },
    invitations: {
        filterOptions: {
            accepted: "Accepted",
            pending: "Pending",
            expired: "Expired"
        }
    },
    loginFlow: {
        tabLabel: "Login Flow"
    },
    protocol: {
        tabLabel: "Protocol"
    },
    roles: {
        add: {
            organizationPermissions: {
                label: "Organization Permissions"
            },
            tenantPermissions: {
                label: "Root Organization Permissions"
            }
        },
        tabLabel: "Roles",
        permissionLevels: {
            edit: "Edit",
            view: "View"
        }
    },
    sharedAccess: {
        description: "Select the following options to share the application roles with the organizations.",
        selectRolesForOrganization: "Select roles for organization",
        organizations: "Organizations",
        availableRoles: "Available Roles",
        searchAvailableRolesPlaceholder: "Search available roles",
        tabLabel: "Shared Access",
        modes: {
            doNotShare: "Do not share any roles",
            shareWithAll: "Share a common set of roles with all organizations",
            shareWithSelected: "Share different set of roles with each organization",
            shareAllRolesWithAllOrgs: "Share all roles with all organizations"
        },
        notifications: {
            fetchRoles: {
                error: {
                    description: "An error occurred while fetching the roles.",
                    message: "Error fetching roles"
                }
            },
            fetchOrgTree: {
                error: {
                    description: "An error occurred while fetching the organization tree.",
                    message: "Error fetching organization tree"
                }
            },
            shareRoles: {
                error: {
                    description: "An error occurred while sharing the roles.",
                    message: "Error sharing roles"
                },
                success: {
                    description: "Roles have been successfully shared.",
                    message: "Roles shared successfully"
                }
            }
        }
    }
};
