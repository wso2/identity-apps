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
import { approvalWorkflowsNS } from "../../../models";

export const approvalWorkflows: approvalWorkflowsNS = {
    confirmation: {
        confirm: "Confirm",
        content:
            "If you delete this approval workflow, all the data in this approval workflow will also be deleted. " +
            "Please proceed with caution.",
        header: "Are you sure?",
        hint: "Please confirm your action.",
        message:
            "This action is irreversible and will permanently delete the" +
            " selected approval workflow and the data in it."
    },
    form: {
        dangerZone: {
            delete: {
                actionTitle: "Delete Approval Workflow",
                header: "Delete Approval Workflow",
                subheader: "Once you delete a approval workflow, there is no going back. " + "Please be certain."
            }
        },
        fields: {
            description: {
                label: "Description",
                placeholder: "Describe the purpose of this approval workflow"
            },
            engine: {
                label: "Workflow Engine",
                placeholder: "Select the suitable workflow engine",
                validation: {
                    required: "Workflow engine is required"
                }
            },
            name: {
                label: "Name",
                placeholder: "Sample Approval Workflow",
                validation: {
                    required: "Name is required"
                }
            }
        },
        placeholders: {
            ApprovalWorkflowError: {
                subtitles: {
                    0: "Couldn't fetch approval workflows",
                    1: "Please try again"
                },
                title: "Something went wrong"
            },
            emptyList: {
                action: "New Approval Workflow",
                subtitles:
                "There are currently no approval workflows available. " +
                "You can add a new approval workflow easily by following the " +
                "steps in the approval workflow creation wizard.",
                title: "Add a new approval workflow"
            },
            emptyListReadOnly: {
                subtitles: "There are currently no approval workflows available.",
                title: "No approval workflows"
            },
            emptySearch: {
                action: "Clear search query",
                subtitles: "We couldn't find any results for {{searchQuery}}. " + "Please try a different search term.",
                title: "No results found"
            }
        },
        sqlEditor: {
            create: "Create",
            darkMode: "Dark Mode",
            delete: "Delete",
            read: "Read",
            reset: "Reset Changes",
            title: "SQL Query Types",
            update: "Update"
        }
    } ,
    forms: {
        configurations: {
            template: {
                condition: "or",
                label: "Add Approval Step",
                placeholder: "Type role/s to search and assign",
                roles: {
                    label: "Roles"
                },
                users: {
                    label: "Users"
                }
            }
        },
        connection: {
            connectionErrorMessage:
            "Please ensure the provided connection " + "URL, name, password and driver name are correct",
            testButton: "Test Connection",
            updatePassword: "Update connection password"
        },
        custom: {
            placeholder: "Enter a {{name}}",
            requiredErrorMessage: "{{name}} is required"
        },
        general: {
            description: {
                label: "Description",
                placeholder: "Describe the purpose of this approval workflow",
                validationErrorMessages: {
                    allSymbolsErrorMessage: "Description should have a combination of " +
                    "alphanumerics and special characters. Please try a different name.",
                    invalidInputErrorMessage: "Description cannot contain the pattern {{invalidString}}.",
                    invalidSymbolsErrorMessage: "The name you entered contains disallowed characters. It can not contain '/' or '_'."
                }
            },
            engine: {
                label: "Workflow Engine",
                placeholder: "Select the suitable engine",
                requiredErrorMessage: "Workflow engine is required"
            },
            name: {
                label: "Name",
                placeholder: "Approval Workflow",
                requiredErrorMessage: "Name is a required field",
                validationErrorMessages: {
                    allSymbolsErrorMessage: "The approval workflow name should have a combination of " +
                    "alphanumerics and special characters. Please try a different name.",
                    alreadyExistsErrorMessage: "An approval workflow with this name already exists.",
                    invalidInputErrorMessage: "Approval workflow name cannot contain the pattern {{invalidString}}.",
                    invalidSymbolsErrorMessage: "The name you entered contains disallowed characters. It can not contain '/' or '_'.",
                    maxCharLimitErrorMessage: "Approval Workflow name cannot exceed {{maxLength}} characters."
                }
            }
        },
        operations: {
            dropDown: {
                label: "Operations",
                placeholder: "Type operation/s to search and assign"
            }
        }
    },
    notifications: {
        addApprovalWorkflow: {
            genericError: {
                description: "There was an error while creating the approval workflow.",
                message: "Something went wrong!"
            },
            success: {
                description: "The approval workflow has been added successfully!",
                message: "Approval workflow added successfully!"
            }
        },
        addWorkflowAssociation: {
            genericError: {
                description: "There was an error while adding workflow operations.",
                message: "Something went wrong!"
            },
            success: {
                description: "Workflow operation has been added successfully!",
                message: "Workflow operation added successfully!"
            }
        },
        apiLimitReachedError: {
            error: {
                description: "You have reached the maximum number of approval workflows allowed.",
                message: "Failed to create the approval workflow"
            }
        },
        delay: {
            description:
            "It may take a while for the approval workflow list to be updated. " +
            "Refresh in a few seconds to get the updated approval workflow list.",
            message: "Updating approval workflow list takes time"
        },
        deleteApprovalWorkflow: {
            genericError: {
                description: "There was an error while deleting the approval workflow.",
                message: "Something went wrong!"
            },
            success: {
                description: "The approval workflow has been deleted successfully!",
                message: "Approval workflow deleted successfully!"
            }
        },
        deleteWorkflowAssociation: {
            genericError: {
                description: "There was an error while removing workflow operations.",
                message: "Something went wrong!"
            },
            success: {
                description: "Workflow operation has been deleted successfully!",
                message: "Workflow operation deleted successfully!"
            }
        },
        fetchApprovalWorkflowTemplates: {
            genericError: {
                description: "An error occurred while fetching the approval workflow type details.",
                message: "Something went wrong"
            }
        },
        fetchApprovalWorkflows: {
            genericError: {
                description: "An error occurred while fetching approval workflows.",
                message: "Something went wrong"
            }
        },
        fetchWorkflowAssociations: {
            genericError: {
                description: "An error occurred while fetching the operations associated with the workflow.",
                message: "Something went wrong"
            }
        },
        testConnection: {
            genericError: {
                description: "An error occurred while testing the connection to the approval workflow",
                message: "Something went wrong"
            },
            success: {
                description: "The connection is healthy.",
                message: "Connection successful!"
            }
        },
        updateApprovalWorkflow: {
            error: {
                description: "{{description}}",
                message: "Error occurred while updating the approval workflow."
            },
            genericError: {
                description: "An error occurred while updating the approval workflow.",
                message: "Something went wrong"
            },
            success: {
                description: "This approval workflow has been updated successfully!",
                message: "Approval workflow updated successfully!"
            }
        },
        updateDelay: {
            description: "It might take some time for the updated properties to appear.",
            message: "Updating properties takes time"
        },
        deleteWorkflowRequest: {
            genericError: {
                description: "An error occurred while deleting the workflow request",
                message: "Something went wrong"
            },
            success: {
                description: "Workflow request deleted successfully.",
                message: "Workflow request deleted successfully!"
            }
        },
        fetchWorkflowRequestDetails: {
            genericError: {
                description: "An error occurred while fetching the workflow request details",
                message: "Something went wrong"
            },
            success: {
                description: "Workflow request details fetched successfully.",
                message: "Workflow request details fetched successfully!"
            }
        },
        fetchWorkflowRequests: {
            genericError: {
                description: "An error occurred while fetching the workflow requests",
                message: "Something went wrong"
            }
        },
        searchWorkflowRequests: {
            genericError: {
                description: "An error occurred while searching the workflow requests",
                message: "Something went wrong"
            }
        }
    },
    pageLayout: {
        create: {
            back: "Go back to approval workflows",
            description: "Follow the steps to create a new approval workflow.",
            stepper: {
                step1: {
                    description: "Provide the basic details of the approval workflow you want to create.",
                    title: "General Details"
                },
                step2: {
                    description: "Select the operations that would trigger this approval workflow",
                    hint: "This approval workflow will be triggered when any of the selected operations are initiated.",
                    title:  "Workflow Operation Details"
                },
                step3: {
                    description: "Configure the approval steps of the model. Approval by any selected user or role member will complete each step.",
                    hint: "You can add multiple approval steps to the workflow. Each step can have different approvers. Approval by any selected user or role member will complete each step.",
                    title:  "Approval Step Details"
                }
            },
            title: "Create an Approval Workflow"
        },
        edit: {
            back: "Go back to approval workflows",
            description: "Edit approval workflow",
            title: "Edit Approval Workflow"
        },
        list: {
            description: "Create and manage approval workflows.",
            newApprovalWorkflowDropdown: {
                connectDirectly: "Connect directly",
                connectRemotely: "Connect via agent"
            },
            popups: {
                delete: "Delete Approval Workflow",
                edit: "Edit Approval Workflow"
            },
            primaryAction: "New Approval Workflow",
            title: "Approval Workflows"
        }
    },
    list: {
        columns: {
            workflowInstanceId: "Operation Type",
            status: "Status",
            requestInitiator: "Request Initiator",
            createdAt: "Created At",
            updatedAt: "Updated At",
            actions: "Actions"
        }
    },
    status: {
        all: "All Tasks",
        approved: "Approved",
        deleted: "Deleted",
        failed: "Failed",
        pending: "Pending",
        rejected: "Rejected"
    },
    eventType: {
        all: "All Tasks",
        myTasks: "My Tasks"
    },
    operationType: {
        all: "All Operations",
        createUser: "Create User",
        deleteUser: "Delete User",
        updateUserRoles: "Update User Roles",
        createRole: "Create Role",
        deleteRole: "Delete Role",
        updateRoleName: "Update Role Name",
        updateRoleUsers: "Update Role Users",
        deleteUserClaims: "Delete User Claims",
        updateUserClaims: "Update User Claims"
    },
    details: {
        header: "Workflow Request Details",
        fields: {
            id: "ID",
            eventType: "Event Type",
            requestInitiator: "Request Initiator",
            status: "Status",
            createdAt: "Created At",
            updatedAt: "Updated At",
            requestParams: "Request Params"
        },
        loading: "Loading...",
        error: {
            header: "Error",
            content: "Failed to load workflow request details."
        },
        backButton: "Back",
        dangerZone: {
            header: "Danger Zone",
            delete: {
                actionTitle: "Delete Workflow Request",
                header: "Delete Workflow Request",
                subheader: "Once you delete a workflow request, there is no going back. Please be certain.",
                confirm: "Are you sure you want to delete this workflow request? This action cannot be undone."
            }
        }
    },
    timeRanges: {
        all: "All",
        last6Hours: "Last 6 hours",
        last12Hours: "Last 12 hours",
        last24Hours: "Last 24 hours",
        last2Days: "Last 2 days",
        last7Days: "Last 7 days",
        last14Days: "Last 14 days",
        last30Days: "Last 30 days",
        customRange: "Custom Range",
        customRangeTitle: "Custom {{label}}",
        range: "Range"
    },
    activeFiltersBar: {
        removeFilter: "Remove {{filter}} filter",
        noActiveFilters: "No active filters",
        clearAll: "Clear all"
    },
    filters: {
        requestType: "Request Type",
        status: "Status",
        operationType: "Operation Type",
        createdTimeRange: "Created Time Range",
        updatedTimeRange: "Updated Time Range"
    }
};
