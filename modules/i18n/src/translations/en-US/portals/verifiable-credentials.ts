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
        description: "Configure credential templates that can be issued to users as verifiable credentials."
    },
    buttons: {
        addTemplate: "New Credential Template"
    },
    placeholders: {
        emptyList: {
            title: "No Credential Templates Configured",
            subtitle: "There are no credential templates configured at the moment. You can add a new credential template by clicking on the button below."
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
                message: "This action is irreversible and will permanently delete the credential template.",
                content: "If you delete this credential template, users will no longer be able to obtain credentials of this type. Please proceed with caution.",
                assertionHint: "Please confirm your action."
            }
        }
    },
    wizard: {
        title: "Create Credential Template",
        subtitle: "Configure a new verifiable credential template that can be issued to users.",
        form: {
            identifier: {
                label: "Identifier",
                placeholder: "Enter a unique identifier",
                hint: "A unique identifier for the credential template. This will also be used as the credential type.",
                validation: "Identifier cannot contain spaces."
            },
            displayName: {
                label: "Display Name",
                placeholder: "Enter a display name",
                hint: "A human-readable name for the credential template that will be shown to users."
            },
            submitButton: "Create"
        }
    },
    editPage: {
        title: "Edit Credential Template",
        tabs: {
            general: "General",
            offer: "Offer"
        },
        backButton: "Go back to Verifiable Credentials",
        form: {
            displayName: {
                label: "Display Name",
                placeholder: "Enter a display name",
                hint: "A human-readable name for the credential template that will be shown to users."
            },
            identifier: {
                label: "Identifier",
                hint: "A unique identifier for the credential template. This cannot be changed."
            },
            expiresIn: {
                label: "Expiration Time",
                placeholder: "Enter expiration time in seconds",
                hint: "The validity period of the credential in seconds. For example, 31536000 seconds equals 1 year."
            },
            claims: {
                label: "Attributes",
                placeholder: "Search and select attributes",
                hint: "Select the user attributes to include in the verifiable credential."
            }
        },
        dangerZone: {
            header: "Danger Zone",
            delete: {
                header: "Delete Credential Template",
                subheader: "Once you delete a credential template, there is no going back. Please be certain.",
                actionTitle: "Delete Credential Template"
            }
        },
        confirmations: {
            deleteTemplate: {
                header: "Are you sure?",
                message: "This action is irreversible and will permanently delete the credential template.",
                content: "If you delete this credential template, users will no longer be able to obtain credentials of this type. Please proceed with caution.",
                assertionHint: "Please confirm your action."
            }
        }
    },
    offer: {
        title: "Offer",
        empty: "No offer has been created for this credential.",
        active: "An offer URI is active. You can regenerate it or revoke it.",
        generate: "Generate",
        regenerate: "Regenerate",
        revoke: "Revoke",
        notifications: {
            generate: {
                success: {
                    message: "Offer Generated",
                    description: "Credential offer generated successfully."
                },
                error: {
                    message: "Generation Failed",
                    description: "Failed to generate credential offer."
                }
            },
            revoke: {
                success: {
                    message: "Offer Revoked",
                    description: "Credential offer revoked successfully."
                },
                error: {
                    message: "Revocation Failed",
                    description: "Failed to revoke credential offer."
                }
            }
        }
    },
    notifications: {
        fetchClaims: {
            error: {
                message: "Error Fetching Claims",
                description: "An error occurred while fetching the claims list."
            }
        },
        deleteTemplate: {
            success: {
                message: "Deleted Successfully",
                description: "The credential template has been deleted successfully."
            },
            error: {
                message: "Deletion Failed",
                description: "An error occurred while deleting the credential template."
            }
        },
        fetchTemplates: {
            error: {
                message: "Retrieval Failed",
                description: "An error occurred while fetching the credential templates."
            }
        },
        fetchTemplate: {
            error: {
                message: "Retrieval Failed",
                description: "An error occurred while fetching the credential template details."
            }
        },
        createTemplate: {
            success: {
                message: "Created Successfully",
                description: "The credential template has been created successfully."
            },
            error: {
                message: "Creation Failed",
                description: "An error occurred while creating the credential template."
            },
            duplicateError: {
                message: "Duplicate Identifier",
                description: "A credential template with this identifier already exists. Please use a different identifier."
            }
        },
        updateTemplate: {
            success: {
                message: "Updated Successfully",
                description: "The credential template has been updated successfully."
            },
            error: {
                message: "Update Failed",
                description: "An error occurred while updating the credential template."
            }
        }
    }
};
