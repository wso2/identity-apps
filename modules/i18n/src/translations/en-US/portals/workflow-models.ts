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
import { workflowModelsNS } from "../../../models";

export const workflowModels: workflowModelsNS = {
    advancedSearch: {
        error: "Filter query format incorrect",
        form: {
            inputs: {
                filterAttribute: {
                    placeholder: "E.g. Name, Description etc."
                },
                filterCondition: {
                    placeholder: "E.g. Starts with etc."
                },
                filterValue: {
                    placeholder: "E.g. PRIMARY, SECONDARY etc."
                }
            }
        },
        placeholder: "Search by workflow model name"
    },
    confirmation: {
        confirm: "Confirm",
        content:
            "If you delete this workflow model, the user data in this workflow model will also be deleted. " +
            "Please proceed with caution.",
        header: "Are you sure?",
        hint: "Please confirm your action.",
        message:
            "This action is irreversible and will permanently delete the" +
            " selected workflow model and the data in it."
    },
    form: {
        dangerZone: {
            delete: {
                actionTitle: "Delete Workflow Model",
                header: "Delete Workflow Model",
                subheader: "Once you delete a workflow model, there is no going back. " + "Please be certain."
            },
            disable: {
                actionTitle: "Enable Workflow Model",
                header: "Enable Workflow Model",
                subheader:
                "Disabling a Workflow Model can make you lose access to the users in the workflow model. " +
                "Proceed with caution."
            }
        },
        fields: {
            description: {
                label: "Description",
                placeholder: "Describe the purpose of this workflow model"
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
                placeholder: "Sample Workflow Model",
                validation: {
                    required: "Name is required"
                }
            }
        },
        placeholders: {
            emptyList: {
                action: "New Workflow Model",
                subtitles:
                "There are currently no workflow models available. " +
                "You can add a new user store easily by following the " +
                "steps in the user store creation wizard.",
                title: "Add a new user store"
            },
            emptyListReadOnly: {
                subtitles: "There are currently no workflow models available.",
                title: "No workflow models"
            },
            emptySearch: {
                action: "Clear search query",
                subtitles: "We couldn't find any results for {{searchQuery}}. " + "Please try a different search term.",
                title: "No results found"
            },
            workflowModelError: {
                subtitles: {
                    0: "Couldn't fetch workflow models",
                    1: "Please try again"
                },
                title: "Something went wrong"
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
        },
        wizard: {
            header: "Add {{type}} Workflow Model",
            steps: {
                general: "General",
                group: "Group",
                summary: "Summary",
                user: "User"
            }
        }
    } ,
    forms: {
        configurations: {
            template: {
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
                placeholder: "Sample description",
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
                placeholder: "Approval Workflow Model",
                requiredErrorMessage: "Name is a required field",
                validationErrorMessages: {
                    allSymbolsErrorMessage: "The workflow model name should have a combination of " +
                    "alphanumerics and special characters. Please try a different name.",
                    alreadyExistsErrorMessage: "A workflow model with this name already exists.",
                    invalidInputErrorMessage: "Workflow model name cannot contain the pattern {{invalidString}}.",
                    invalidSymbolsErrorMessage: "The name you entered contains disallowed characters. It can not contain '/' or '_'.",
                    maxCharLimitErrorMessage: "Workflow model name cannot exceed {{maxLength}} characters."
                }
            }
        }
    },
    notifications: {
        addWorkflowModel: {
            genericError: {
                description: "There was an error while creating the workflow model.",
                message: "Something went wrong!"
            },
            success: {
                description: "The workflow model has been added successfully!",
                message: "Workflow model added successfully!"
            }
        },
        apiLimitReachedError: {
            error: {
                description: "You have reached the maximum number of workflow models allowed.",
                message: "Failed to create the workflow model"
            }
        },
        delay: {
            description:
            "It may take a while for the workflow model list to be updated. " +
            "Refresh in a few seconds to get the updated workflow model list.",
            message: "Updating workflow model list takes time"
        },
        deleteWorkflowModel: {
            genericError: {
                description: "There was an error while deleting the workflow model.",
                message: "Something went wrong!"
            },
            success: {
                description: "The workflow model has been deleted successfully!",
                message: "Workflow model deleted successfully!"
            }
        },
        fetchWorkflowModelMetadata: {
            genericError: {
                description: "An error occurred while fetching the type meta data.",
                message: "Something went wrong"
            }
        },
        fetchWorkflowModelTemplates: {
            genericError: {
                description: "An error occurred while fetching the workflow model type details.",
                message: "Something went wrong"
            }
        },
        fetchWorkflowModelTypes: {
            genericError: {
                description: "An error occurred while fetching the workflow model types.",
                message: "Something went wrong"
            }
        },
        fetchWorkflowModels: {
            genericError: {
                description: "An error occurred while fetching workflow models.",
                message: "Something went wrong"
            }
        },
        testConnection: {
            genericError: {
                description: "An error occurred while testing the connection to the workflow model",
                message: "Something went wrong"
            },
            success: {
                description: "The connection is healthy.",
                message: "Connection successful!"
            }
        },
        updateDelay: {
            description: "It might take some time for the updated properties to appear.",
            message: "Updating properties takes time"
        },
        updateWorkflowModel: {
            error: {
                description: "{{description}}",
                message: "Error occurred while updating the workflow model."
            },
            genericError: {
                description: "An error occurred while updating the workflow model.",
                message: "Something went wrong"
            },
            success: {
                description: "This workflow model has been updated successfully!",
                message: "Workflow model updated successfully!"
            }
        }
    },
    pageLayout: {
        create: {
            back: "Go back to workflow models",
            description: "Follow the steps to create a new workflow model.",
            stepper: {
                step1: {
                    description: "Provide the basic details of the workflow model you want to create.",
                    title: "General Details"
                },
                step2: {
                    description: "Configure the approval steps of the model.",
                    title:  "Configuration Details"
                }
            },
            title: "Create a Workflow Model"
        },
        edit: {
            back: "Go back to workflow models",
            description: "Edit workflow model",
            tabs: {
                connection: "Connection",
                general: "General",
                group: "Group",
                user: "User"
            }
        },
        list: {
            description: "Create and manage workflow models.",
            newWorkflowModelDropdown: {
                connectDirectly: "Connect directly",
                connectRemotely: "Connect via agent"
            },
            primaryAction: "New Workflow Model",
            title: "Workflow Models"
        }
    }
};
