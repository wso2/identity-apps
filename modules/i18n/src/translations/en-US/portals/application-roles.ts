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

import { ApplicationRolesNS } from "../../../models";

export const applicationRoles: ApplicationRolesNS = {
    assign: "Assign",
    assignGroupWizard: {
        heading: "Assign Groups",
        subHeading: "Assign groups to the application role."
    },
    authenticatorGroups: {
        goToConnections: "Go to Connections",
        groupsList: {
            assignGroups: "Assign Groups",
            notifications: {
                fetchAssignedGroups: {
                    error: {
                        description: "{{description}}",
                        message: "Error occurred while fetching assigned groups"
                    },
                    genericError: {
                        description: "An error occurred while fetching assigned groups.",
                        message: "Something went wrong"
                    }
                },
                updateAssignedGroups: {
                    error: {
                        description: "{{description}}",
                        message: "Error occurred while updating assigned groups"
                    },
                    genericError: {
                        description: "An error occurred while updating assigned groups.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully updated assigned groups.",
                        message: "Update successful"
                    }
                }
            }
        },
        hint: "When assigning external groups to a role, make sure that the connection is enabled in " +
            "<1>External Grooup Role Resolution Control</1> in the Roles tab of the <3>Application</3>.",
        placeholder: {
            subTitle: {
                0: "There are no external groups available at the moment.",
                1: "You can add a new external group by visiting the " +
                    "Groups tab in a connection."
            },
            title: "No External Groups"
        }
    },
    connectorGroups: {
        placeholder: {
            subTitle: {
                0: "There are no external groups available at the moment.",
                1: "Define the groups that you receive from your connections by adding a new group."
            },
            title: "No External Groups"
        }
    },
    heading: "Application Roles",
    roleGroups: {
        assignGroup: "Assign Group",
        confirmation: {
            deleteRole: {
                content: "If you remove this group from the application role, the permissions " +
                    "associated with this role will be removed from the group. Please proceed " +
                    "with caution.",
                message: "This action is irreversible and will remove " +
                    "the group from the application role."
            }
        },
        notifications: {
            addGroups: {
                error: {
                    description: "An error occurred while adding the group.",
                    message: "An error occurred"
                },
                success: {
                    description: "The group has been successfully added to the role.",
                    message: "Group added successfully"
                }
            },
            fetchGroups: {
                error: {
                    description: "An error occurred while fetching the groups.",
                    message: "An error occurred"
                }
            }
        },
        placeholder: {
            subTitle: {
                0: "There are no groups assigned to this role.",
                1: "To assign a group, click on the Assign Group button."
            },
            title: "No groups assigned"
        },
        searchGroup: "Search groups"
    },
    roleList: {
        placeholder: {
            subTitle: {
                0: "There are no application roles available at the moment.",
                1: "You can add a new application role by visiting the " +
                    "Roles tab in an Application."
            },
            title: "No Application Roles"
        }
    },
    roleMapping: {
        heading: "External groups Role Resolution Control",
        notifications: {
            sharedApplication: {
                error: {
                    description: "An error occurred while retrieving the shared applications.",
                    message: "An error occurred"
                }
            },
            updateRole: {
                error: {
                    description: "{{description}}",
                    message: "Error updating role"
                },
                genericError: {
                    description: "An error occurred while updating the role.",
                    message: "Something went wrong"
                },
                success: {
                    description: "Successfully updated the role.",
                    message: "Updated successfully"
                }
            }
        },
        subHeading: "Enable or disable application role resolving from external groups during authentication flow"
    },
    roles: {
        goBackToRoles: "Go back to Roles",
        heading: "Roles",
        orgRoles: {
            heading: "Organization Roles",
            subHeading: "Manage organization roles here."
        },
        subHeading: "Manage roles and permissions."
    },
    searchApplication: "Search Application",
    subHeading: "View and assign groups to your application roles."
};
