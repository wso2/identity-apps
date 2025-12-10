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

import { VerifiableCredentialsNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */

export const verifiableCredentials: VerifiableCredentialsNS = {
    page: {
        title: "Verifiable Credentials",
        heading: "Verifiable Credentials",
        description: "Configure credential types that can be issued to users as verifiable credentials."
    },
    buttons: {
        addConfig: "New Credential Type"
    },
    placeholders: {
        emptyList: {
            title: "No Credential Types Configured",
            subtitle: "There are no credential types configured at the moment. You can add a new credential type by clicking on the button below."
        },
        emptySearch: {
            title: "No Results Found",
            subtitle: "We couldn't find any results for your search. Please try a different search term."
        }
    },
    list: {
        columns: {
            name: "Name",
            identifier: "Identifier",
            actions: "Actions"
        },
        search: {
            placeholder: "Search by identifier or display name",
            filterAttributePlaceholder: "Select attribute",
            filterConditionsPlaceholder: "Select condition",
            filterValuePlaceholder: "Enter value",
            attributes: {
                identifier: "Identifier",
                displayName: "Display Name"
            }
        },
        confirmations: {
            deleteItem: {
                header: "Are you sure?",
                message: "This action is irreversible and will permanently delete the credential configuration.",
                content: "If you delete this credential configuration, users will no longer be able to obtain credentials of this type. Please proceed with caution.",
                assertionHint: "Please confirm your action."
            }
        }
    },
    wizard: {
        title: "Create Credential Type",
        subtitle: "Configure a new verifiable credential type that can be issued to users.",
        form: {
            identifier: {
                label: "Identifier",
                placeholder: "Enter a unique identifier",
                hint: "A unique identifier for the credential type. This will also be used as the credential type."
            },
            displayName: {
                label: "Display Name",
                placeholder: "Enter a display name",
                hint: "A human-readable name for the credential type that will be shown to users."
            },
            scope: {
                label: "Scope",
                placeholder: "Enter the scope",
                hint: "The OAuth scope required to issue credentials of this type."
            },
            submitButton: "Create"
        }
    },
    notifications: {
        deleteConfig: {
            success: {
                message: "Deleted Successfully",
                description: "The credential configuration has been deleted successfully."
            },
            error: {
                message: "Deletion Failed",
                description: "An error occurred while deleting the credential configuration."
            }
        },
        fetchConfigs: {
            error: {
                message: "Retrieval Failed",
                description: "An error occurred while fetching the credential configurations."
            }
        },
        fetchConfig: {
            error: {
                message: "Retrieval Failed",
                description: "An error occurred while fetching the credential configuration details."
            }
        },
        createConfig: {
            success: {
                message: "Created Successfully",
                description: "The credential configuration has been created successfully."
            },
            error: {
                message: "Creation Failed",
                description: "An error occurred while creating the credential configuration."
            },
            duplicateError: {
                message: "Duplicate Identifier",
                description: "A credential configuration with this identifier already exists. Please use a different identifier."
            }
        }
    }
};
