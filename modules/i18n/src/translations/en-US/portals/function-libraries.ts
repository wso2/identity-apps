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
            subHeading: "Once deleted, this function library cannot be recovered. Any conditional " +
                "authentication scripts that import it will stop working. Please proceed with caution."
        },
        header: "Danger Zone"
    },
    editPage: {
        backButton: "Go back to Function Libraries",
        description: "View or update the description and content of this function library."
    },
    forms: {
        content: {
            hint: "Write the JavaScript content of the function library, or upload an existing .js file.",
            uploadButton: "Upload file",
            validations: {
                empty: "Function library content cannot be empty."
            }
        },
        description: {
            label: "Description",
            placeholder: "Enter a description for the function library"
        },
        name: {
            hint: "A unique name for the function library.",
            label: "Name",
            placeholder: "Enter a unique name for the function library",
            validations: {
                invalid: "Name can only contain alphanumeric characters, dots, hyphens and underscores."
            }
        }
    },
    list: {
        columns: {
            actions: "Actions",
            name: "Name"
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
        }
    },
    notFound: {
        subtitle: "We couldn't find the function library {{name}}.",
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
        backButton: "Go back to Applications Settings",
        description: "Create and manage reusable JavaScript function libraries that can be imported " +
            "into conditional authentication scripts.",
        primaryAction: "New Function Library",
        title: "Function Libraries"
    },
    wizards: {
        add: {
            heading: "Create Function Library",
            subHeading: "Create a new function library that can be imported into conditional " +
                "authentication scripts."
        }
    }
};
