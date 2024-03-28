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
import { userstoresNS } from "../../../models";

export const userstores: userstoresNS = {
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
        placeholder: "Search by user store name"
    },
    confirmation: {
        confirm: "Confirm",
        content: "If you delete this user store, the user data in this user store will also be deleted. "
            + "Please proceed with caution.",
        header: "Are you sure?",
        hint: "Please confirm your action.",
        message: "This action is irreversible and will permanently delete the"
            + " selected user store and the data in it."
    },
    dangerZone: {
        delete: {
            actionTitle: "Delete User Store",
            header: "Delete User Store",
            subheader: "Once you delete a user store, there is no going back. "
                + "Please be certain."
        },
        disable: {
            actionTitle: "Enable User Store",
            header: "Enable User Store",
            subheader: "Disabling a user store can make you lose access to the users in the user store. " +
                "Proceed with caution."
        }
    },
    forms: {
        connection: {
            updatePassword: "Update connection password",
            connectionErrorMessage: "Please ensure the provided connection "
                + "URL, name, password and driver name are correct",
            testButton: "Test Connection"
        },
        custom: {
            placeholder: "Enter a {{name}}",
            requiredErrorMessage: "{{name}} is required"
        },
        general: {
            description: {
                label: "Description",
                placeholder: "Enter a description",
                validationErrorMessages: {
                    invalidInputErrorMessage: "Description cannot contain the pattern {{invalidString}}."
                }
            },
            name: {
                label: "Name",
                placeholder: "Enter a name",
                requiredErrorMessage: "Name is a required field",
                validationErrorMessages: {
                    alreadyExistsErrorMessage: "A user store with this name already exists.",
                    maxCharLimitErrorMessage: "User store name cannot exceed {{maxLength}} characters.",
                    invalidInputErrorMessage: "User store name cannot contain the pattern {{invalidString}}."
                }
            },
            type: {
                label: "Type",
                requiredErrorMessage: "Select a Type"
            }
        }
    },
    notifications: {
        addUserstore: {
            genericError: {
                description: "There was an error while creating the user store.",
                message: "Something went wrong!"
            },
            success: {
                description: "The user store has been added successfully!",
                message: "User store added successfully!"
            }
        },
        apiLimitReachedError: {
            error: {
                description: "You have reached the maximum number of user stores allowed.",
                message: "Failed to create the user store"
            }
        },
        delay: {
            description: "It may take a while for the user store list to be updated. "
                + "Refresh in a few seconds to get the updated user store list.",
            message: "Updating user store list takes time"
        },
        deleteUserstore: {
            genericError: {
                description: "There was an error while deleting the user store.",
                message: "Something went wrong!"
            },
            success: {
                description: "The user store has been deleted successfully!",
                message: "User store deleted successfully!"
            }
        },
        fetchUserstoreMetadata: {
            genericError: {
                description: "An error occurred while fetching the type meta data.",
                message: "Something went wrong"
            }
        },
        fetchUserstoreTemplates: {
            genericError: {
                description: "An error occurred while fetching the user store type details.",
                message: "Something went wrong"
            }
        },
        fetchUserstoreTypes: {
            genericError: {
                description: "An error occurred while fetching the user store types.",
                message: "Something went wrong"
            }
        },
        fetchUserstores: {
            genericError: {
                description: "An error occurred while fetching user stores.",
                message: "Something went wrong"
            }
        },
        testConnection: {
            genericError: {
                description: "An error occurred while testing the connection to the user store",
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
        updateUserstore: {
            genericError: {
                description: "An error occurred while updating the user store.",
                message: "Something went wrong"
            },
            success: {
                description: "This user store has been updated successfully!",
                message: "User store updated successfully!"
            }
        }
    },
    pageLayout: {
        edit: {
            back: "Go back to user stores",
            description: "Edit user store",
            tabs: {
                connection: "Connection",
                general: "General",
                group: "Group",
                user: "User"
            }
        },
        list: {
            description: "Create and manage user stores.",
            primaryAction: "New User Store",
            title: "User Stores"
        },
        templates: {
            back: "Go back to user stores",
            description: "Please choose one of the following user store types.",
            templateHeading: "Quick Setup",
            templateSubHeading: "Predefined set of templates to speed up your user store creation.",
            title: "Select User Store Type"
        }
    },
    placeholders: {
        emptyList: {
            action: "New User Store",
            subtitles: "There are currently no user stores available. "
                + "You can add a new user store easily by following the "
                + "steps in the user store creation wizard.",
            title: "Add a new user store"
        },
        emptyListReadOnly: {
            subtitles: "There are currently no user stores available.",
            title: "No user stores"
        },
        emptySearch: {
            action: "Clear search query",
            subtitles: "We couldn't find any results for {{searchQuery}}. "
                + "Please try a different search term.",
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
    },
    wizard: {
        header: "Add {{type}} User Store",
        steps: {
            general: "General",
            group: "Group",
            summary: "Summary",
            user: "User"
        }
    }
};
