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
import { rolesNS } from "../../../models"

export const roles: rolesNS ={
    addRoleWizard: {
        buttons: {
            finish: "Finish",
            next: "Next",
            previous: "Previous"
        },
        forms: {
            roleBasicDetails: {
                domain: {
                    label: {
                        group: "User Store",
                        role: "Role Type"
                    },
                    placeholder: "Domain",
                    validation: {
                        empty: {
                            group: "Select user store",
                            role: "Select Role Type"
                        }
                    }
                },
                roleName: {
                    hint: "A name for the {{type}}.",
                    label: "{{type}} Name",
                    placeholder: "Enter {{type}} name",
                    validations: {
                        duplicate: "A {{type}} already exists with the given {{type}} name.",
                        duplicateInAudience: "A role with this name already exists in the selected audience.",
                        empty: "{{type}} Name is required to proceed.",
                        invalid: "A {{type}} name can only contain alphanumeric characters, -, and _. "
                            + "And must be of length between 3 to 30 characters."
                    }
                },
                roleAudience: {
                    hint: "Set the audience of the role. <1>Note that audience of the role cannot be changed.</1>",
                    label: "Select the role audience",
                    values: {
                        organization: "Organization",
                        application: "Application"
                    }
                },
                notes: {
                    orgNote: "When the role audience is organization, you can associate the role with an application which allows organization audience roles.",
                    appNote: "When the role audience is application, you can associate the role with an application which allows application audience roles.",
                    cannotCreateRole: "You cannot create a role with role audience as application because there are currently no applications that support application audience roles. Please <1>create an application</1> that supports application audience roles to proceed."
                },
                assignedApplication: {
                    hint: "Assign an application for the role. Note that assigned application for this role cannot be edited after the role is created.",
                    label: "Assigned application",
                    placeholder: "Select application to assign the role",
                    applicationSubTitle: {
                        application: "Support application-scoped roles.",
                        organization: "Support organization-scoped role. ",
                        changeAudience: "Change the audience"
                    },
                    validations: {
                        empty: "Assigned application is required to create an application-scoped role."
                    },
                    note: "Note that assigned application for this role cannot be edited after the role is created."
                }
            },
            rolePermission: {
                apiResource: {
                    label: "Select API Resource",
                    placeholder: "Select an API resource to assign permissions(scopes)",
                    hint: {
                        empty: "There are no API resources authorized for the selected application. API Resources can be authorized through <1>here</1>."
                    }
                },
                permissions: {
                    label: "Select permissions(scopes) from the selected API resources",
                    placeholder: "Select permissions(scopes)",
                    tooltips: {
                        noScopes: "No scopes available for the selected API resource",
                        selectAllScopes: "Select all permissions(scopes)",
                        removeAPIResource: "Remove API resource"
                    },
                    validation: {
                        empty: "Permissions(scopes) list cannot be empty. Select at least one permission(scope)."
                    },
                    permissionsLabel: "Permissions (scopes)"
                },
                notes: {
                    applicationRoles: "Only the APIs and the permissions(scopes) that are authorized in the selected application(<1>{{applicationName}}</1>) will be listed to select."
                },
                notifications: {
                    fetchAPIResourceError: {
                        error: {
                            description: "Something went wrong while fetching API resources. Please try again.",
                            message: "Something went wrong"
                        }
                    }
                }
            }
        },
        heading: "Create {{type}}",
        permissions: {
            buttons: {
                collapseAll: "Collapse All",
                expandAll: "Expand All",
                update: "Update"
            }
        },
        subHeading: "Create a new {{type}} in the system.",
        back: "Go back",
        summary: {
            labels: {
                domain: {
                    group: "User Store",
                    role: "Role Type"
                },
                groups: "Assigned Group(s)",
                permissions: "Permission(s)",
                roleName: "{{type}} Name",
                roles: "Assigned Role(s)",
                users: "Assigned User(s)"
            }
        },
        users: {
            assignUserModal: {
                heading: "Manage Users",
                hint: "Select users to add them to the user group.",
                list: {
                    listHeader: "Name",
                    searchPlaceholder: "Search users",
                    searchByEmailPlaceholder: "Search users by email address"
                },
                subHeading: "Add new users or remove existing users assigned to the {{type}}."
            }
        },
        wizardSteps: {
            0: "Basic Details",
            1: "Permission Selection",
            2: "Assign Users",
            3: "Summary",
            4: "Groups & Users",
            5: "Assign Roles"
        }
    },
    advancedSearch: {
        form: {
            inputs: {
                filterAttribute: {
                    placeholder: "E.g. role name."
                },
                filterCondition: {
                    placeholder: "E.g. Starts with etc."
                },
                filterValue: {
                    placeholder: "Enter value to search"
                }
            }
        },
        placeholder: "Search by role name"
    },
    edit: {
        placeholders: {
            errorPlaceHolder: {
                action: "Go back",
                subtitles: {
                    0: "An error occurred while retrieving the requested role, possibly because the role does not exist.",
                    1: "Please try again."
                },
                title: "Something went wrong"
            }
        },
        basics: {
            buttons: {
                update: "Update"
            },
            confirmation: {
                assertionHint: "Please confirm your action.",
                content: "If you delete this {{type}}, the permissions attached to it will be " +
                    "deleted and the users attached to it will no longer be able to perform intended " +
                    "actions which were previously allowed. Please proceed with caution",
                header: "Are you sure?",
                message: "This action is irreversible and will permanently delete the selected {{type}}"
            },
            dangerZone: {
                actionTitle: "Delete {{type}}",
                buttonDisableHint: "Delete option is disabled because this {{type}} is managed in a" +
                    " remote user store.",
                header: "Delete {{type}}",
                subheader: "Once you delete the {{type}}, it cannot be recovered."
            },
            fields: {
                roleName: {
                    name: "Role Name",
                    placeholder: "Enter role name",
                    required: "Role name is required"
                }
            }
        },
        groups: {
            addGroupsModal: {
                heading: "Update Role Groups",
                subHeading: "Add new groups or remove existing groups assigned to the role."
            },
            placeholders: {
                emptyPlaceholder: {
                    action: "Assign Groups",
                    subtitles: {
                        0: "There are no groups assigned to this role at the moment."
                    },
                    title: "No groups assigned to the role."
                },
                errorPlaceholder: {
                    action: "Refresh",
                    subtitles: {
                        0: "An error occurred while fetching groups assigned to this role.",
                        1: "Please try again."
                    },
                    title: "Something went wrong"
                }
            },
            notifications: {
                error: {
                    description: "{{description}}",
                    message: "Error occurred while updating the groups assigned to the role."
                },
                success: {
                    message: "Role updated successfully",
                    description: "The groups assigned to the role have been successfully updated."
                },
                genericError: {
                    message: "Something went wrong",
                    description: "We were unable to update the groups assigned to the role."
                },
                fetchError: {
                    message: "Something went wrong",
                    description: "We were unable to fetch the groups assigned to the role."
                }
            },
            externalGroupsHeading: "External Groups",
            heading: "Assigned Groups",
            localGroupsHeading: "Local Groups",
            subHeading: "Add or remove the groups assigned to this role. Note that this "
                + "will affect performing certain tasks.",
            actions: {
                search: {
                    placeholder: "Search groups"
                },
                assign: {
                    placeholder: "Assign groups"
                },
                remove: {
                    label: "Removing groups",
                    placeholder: "Restore groups"
                }
            }

        },
        menuItems: {
            basic: "Basics",
            connectedApps: "Connected Apps",
            groups: "Groups",
            permissions: "Permissions",
            roles: "Roles",
            users: "Users"
        },
        users: {
            heading: "Assigned Users",
            subHeading: "Add or remove the users assigned to this role. Note that this will affect performing certain tasks.",
            actions: {
                search: {
                    placeholder: "Search users"
                },
                assign: {
                    placeholder: "Type username/s to search and assign users"
                },
                remove: {
                    label: "Removing users",
                    placeholder: "Restore users"
                }
            },
            placeholders: {
                emptyPlaceholder: {
                    action: "Assign Users",
                    subtitles: {
                        0: "There are no users assigned to this role at the moment."
                    },
                    title: "No users assigned to the role."
                },
                errorPlaceholder: {
                    action: "Refresh",
                    subtitles: {
                        0: "An error occurred while fetching users assigned to this role.",
                        1: "Please try again."
                    },
                    title: "Something went wrong"
                }
            },
            notifications: {
                error: {
                    description: "{{description}}",
                    message: "Error occurred while updating the users assigned to the role."
                },
                success: {
                    message: "Role updated successfully",
                    description: "The users assigned to the role have been successfully updated."
                },
                genericError: {
                    message: "Something went wrong",
                    description: "We were unable to update the users assigned to the role."
                },
                fetchError: {
                    message: "Something went wrong",
                    description: "We were unable to fetch the users assigned to the role."
                }
            },
            list: {
                emptyPlaceholder: {
                    action: "Assign User",
                    subtitles: "There are no users assigned to the {{type}} at the moment.",
                    title: "No Users Assigned"
                },
                user: "User",
                organization: "Managed By"
            }
        },
        permissions: {
            heading: "Assigned Permissions",
            readOnlySubHeading: "View the assigned permissions of the role.",
            removedPermissions: "Removed Permissions",
            subHeading: "Manage assigned permissions in the role."
        }
    },
    list: {
        buttons: {
            addButton: "New {{type}}",
            filterDropdown: "Filter By"
        },
        columns: {
            actions: "Actions",
            audience: "Audience",
            lastModified: "Modified Time",
            managedByApp: {
                label: "Can be used only in the application: ",
                header: "Managed By"
            },
            managedByOrg: {
                label: "Can be used within the organization: ",
                header: "Managed By"
            },
            name: "Role"
        },
        confirmations: {
            deleteItem: {
                assertionHint: "Please confirm your action.",
                content: "If you delete this {{type}}, the permissions attached to it will be " +
                    "deleted and the users attached to it will no longer be able to perform " +
                    "intended actions which were previously allowed. Please proceed with caution.",
                header: "Are you sure?",
                message: "This action is irreversible and will permanently delete the selected {{type}}"
            },
            deleteItemError: {
                content: "Remove the associations from following application before deleting:",
                header: "Unable to Delete",
                message: "There is an application using this role."
            }
        },
        emptyPlaceholders: {
            emptyRoleList: {
                action: "New {{type}}",
                emptyRoles: "No {{type}} found",
                subtitles: {
                    0: "There are currently no {{type}} available.",
                    1: "You can add a new {{type}} easily by following the",
                    2: "steps in the {{type}} creation wizard."
                },
                title: "Add a new {{type}}"
            },
            search: {
                action: "Clear search query",
                subtitles: {
                    0: "We couldn't find any results for {{searchQuery}}",
                    1: "Please try a different search term."
                },
                title: "No results found"
            }
        },
        popups: {
            delete: "Delete {{type}}",
            edit: "Edit {{type}}"
        },
        filterOptions: {
            all: "Show All",
            applicationRoles: "Application Roles",
            organizationRoles: "Organization Roles"
        },
        filterAttirbutes: {
            name: "Name",
            audience: "Role Audience"
        }
    },
    readOnlyList: {
        emptyPlaceholders: {
            searchAndFilter: {
                subtitles: {
                    0: "We couldn't find any results for the specified role name and audience combination.",
                    1: "Please try a different combination."
                },
                title: "No results found"
            }
        }
    },
    notifications: {
        createPermission: {
            error: {
                description: "{{description}}",
                message: "Error occurred while adding permission to role."
            },
            genericError: {
                description: "Couldn't add permissions to role.",
                message: "Something went wrong"
            },
            success: {
                description: "Permissions were successfully added to the role.",
                message: "Role created successfully."
            }
        },
        createRole: {
            error: {
                description: "{{description}}",
                message: "Error occurred while creating the role."
            },
            genericError: {
                description: "Couldn't create the role.",
                message: "Something went wrong"
            },
            success: {
                description: "The role was created successfully.",
                message: "Role created successfully."
            }
        },
        deleteRole: {
            error: {
                description: "{{description}}",
                message: "Unable to delete the selected role."
            },
            genericError: {
                description: "Couldn't remove the selected role.",
                message: "Something went wrong"
            },
            success: {
                description: "The selected role was deleted successfully.",
                message: "Role deleted successfully"
            }
        },
        fetchRoles: {
            genericError: {
                description: "An error occurred while retrieving roles.",
                message: "Something went wrong"
            }
        },
        fetchRole: {
            genericError: {
                description: "An error occurred while retrieving the role.",
                message: "Something went wrong"
            }
        },
        updateRole: {
            error: {
                description: "{{description}}",
                message: "Error updating the selected role."
            },
            genericError: {
                description: "Couldn't update the selected role.",
                message: "Something went wrong"
            },
            success: {
                description: "The selected role was updated successfully.",
                message: "Role updated successfully"
            }
        }
    }
}