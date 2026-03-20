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
    enterpriseLogin: {
        banner: {
            action: "Contact Us",
            description: "Reach out to us to configure enterprise login for your console setup.",
            title: "Configure Enterprise Login"
        },
        configured: {
            connectionLabel: "Enterprise Connection",
            description: "Enterprise login has been configured for the console. Users can sign in using the configured enterprise connection.",
            heading: "Enterprise Login Configuration",
            mappingsHeading: "Group-Role Mappings",
            noMappings: "No group-role mappings configured."
        },
        confirmations: {
            removeConfiguration: {
                assertionHint: "Please confirm your action.",
                content: "This will remove the enterprise connection from the console login flow and delete all associated group-role mappings. Users who rely on this login method will no longer be able to sign in to the console.",
                header: "Are you sure?",
                message: "This action is irreversible and will remove the enterprise login configuration.",
                primaryAction: "Confirm",
                secondaryAction: "Cancel"
            },
            removeMapping: {
                content: "This group-role mapping will be removed. The connection group will no longer grant the associated console role.",
                header: "Remove Group-Role Mapping?",
                primaryAction: "Remove",
                secondaryAction: "Cancel"
            }
        },
        form: {
            addMapping: "Add Mapping",
            connectionLabel: "Enterprise Connection",
            createGroup: "Create \"{{name}}\" as a new group'",

            connectionPlaceholder: "Select an enterprise connection",
            idpGroupLabel: "Connection Group",
            idpGroupPlaceholder: "Select or type a connection group name",
            mappingDescription: "Map connection groups to console roles to grant users the appropriate access level.",
            roleLabel: "Console Role",
            rolePlaceholder: "Select a console role",
            sectionHeading: "Configure Enterprise Login",
            sectionDescription: "Select an enterprise connection and map its groups to console roles. At least one mapping is required."
        },
        learnMore: "Learn More",
        notifications: {
            createGroup: {
                error: {
                    description: "An error occurred while creating the connection group.",
                    message: "Error Creating Group"
                },
                success: {
                    description: "Connection group has been created successfully.",
                    message: "Group Created"
                }
            },
            deleteConfiguration: {
                error: {
                    description: "An error occurred while removing the enterprise login configuration.",
                    message: "Error Removing Configuration"
                },
                success: {
                    description: "Enterprise login configuration has been removed successfully.",
                    message: "Configuration Removed"
                }
            },
            fetchConfiguration: {
                error: {
                    description: "An error occurred while loading the enterprise login configuration.",
                    message: "Error Loading Configuration"
                }
            },
            updateConfiguration: {
                error: {
                    description: "An error occurred while saving the enterprise login configuration.",
                    message: "Error Saving Configuration"
                },
                success: {
                    description: "Enterprise login configuration has been saved successfully.",
                    message: "Configuration Saved"
                }
            }
        },
        actions: {
            configure: "Configure",
            remove: "Remove Enterprise Login",
            save: "Save",
            update: "Update"
        },
        tabLabel: "Enterprise Login",
        validations: {
            atLeastOneMapping: "At least one group-role mapping is required.",
            connectionRequired: "Please select an enterprise connection.",
            duplicateMapping: "This group-role mapping already exists.",
            incompleteMapping: "Please complete all group-role mappings before saving."
        }
    },
    sharedAccess: {
        description: "Select the following options to share the application roles with the organizations.",
        sharingRolesTakeTimeMessage: "Sharing roles may take sometime to reflect across the organization.",
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
