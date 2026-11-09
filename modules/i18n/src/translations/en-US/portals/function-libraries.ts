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

import { functionLibrariesNS } from "../../../models";

export const functionLibraries: functionLibrariesNS = {
    dangerZone: {
        delete: {
            actionTitle: "Delete function library",
            heading: "Delete function library",
            subHeading: "Once deleted, this function library cannot be recovered. Please proceed with caution."
        },
        header: "Danger Zone"
    },
    editPage: {
        backButton: "Go back to Function Libraries",
        description: "View or update the description and content of this function library."
    },
    forms: {
        content: {
            hint: "Export the functions scripts can use, e.g. module.exports.getAge = getAge;",
            validations: {
                empty: "Function library content cannot be empty."
            }
        },
        description: {
            label: "Description",
            placeholder: "Enter a description for the function library"
        },
        name: {
            hint: "A unique name ending with .js. Scripts import the library by this name.",
            label: "Name",
            placeholder: "e.g. age-based.js",
            validations: {
                invalid: "Name must end with .js and can only contain alphanumeric characters, spaces, " +
                    "dots, hyphens and underscores.",
                maxLength: "Name cannot exceed 255 characters.",
                required: "Name is required."
            }
        },
        usage: {
            hint: "Add this line to a script to use the library.",
            label: "Usage"
        }
    },
    list: {
        columns: {
            name: "Function Library"
        },
        emptyPlaceholder: {
            action: "New Function Library",
            subtitle: "There are no function libraries created yet.",
            title: "Create a Function Library"
        }
    },
    modals: {
        deleteConfirmation: {
            assertionHint: "Please confirm your action.",
            content: "This action is irreversible and will permanently delete the function " +
                "library {{name}}.",
            heading: "Are you sure?",
            message: "This will remove the function library and any scripts importing it will stop " +
                "working. This action cannot be undone."
        },
        renameConfirmation: {
            content: "The function library {{oldName}} will be renamed to {{newName}}.",
            heading: "Are you sure you want to edit the function library name?",
            message: "If you edit this library name, the authentication scripts which used this will no " +
                "longer function properly!"
        }
    },
    notFound: {
        subtitle: "We couldn't find the function library you are looking for.",
        title: "Function Library Not Found"
    },
    notifications: {
        create: {
            genericError: {
                description: "An error occurred while creating the function library.",
                message: "Something went wrong"
            },
            success: {
                description: "The function library was created successfully.",
                message: "Create successful"
            }
        },
        delete: {
            genericError: {
                description: "An error occurred while deleting the function library.",
                message: "Something went wrong"
            },
            success: {
                description: "The function library {{name}} was deleted successfully.",
                message: "Delete successful"
            }
        },
        duplicateName: "Script library already exist for the provided name.",
        fetch: {
            genericError: {
                description: "An error occurred while retrieving the function library.",
                message: "Something went wrong"
            }
        },
        fetchList: {
            genericError: {
                description: "An error occurred while retrieving the function libraries.",
                message: "Something went wrong"
            }
        },
        update: {
            genericError: {
                description: "An error occurred while updating the function library.",
                message: "Something went wrong"
            },
            success: {
                description: "The function library was updated successfully.",
                message: "Update successful"
            }
        }
    },
    page: {
        description: "Manage reusable JavaScript libraries for conditional authentication scripts.",
        primaryAction: "New Function Library",
        title: "Function Libraries"
    },
    sidePanel: {
        name: "Function Libraries"
    },
    wizards: {
        add: {
            heading: "Create Function Library",
            subHeading: "Create a new function library that can be imported into conditional " +
                "authentication scripts."
        }
    }
};
