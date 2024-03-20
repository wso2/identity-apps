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
import { oidcScopesNS } from "../../../models";

export const oidcScopes: oidcScopesNS ={
    back: "Go back to OpenID Connect Attrbute Mappings",
    viewAttributes: "View Attributes",
    manageAttributes: "Manage Attributes",
    addAttributes: {
        description: "Select which user attributes you want to associate with the scope {{name}}."
    },
    buttons: {
        addScope: "New OIDC Scope"
    },
    confirmationModals: {
        deleteClaim: {
            assertionHint: "Please type <1>{{ name }}</1> to confirm.",
            content: "If you delete this claim, you will not be able to get it back." +
                "Please proceed with caution.",
            header: "Are you sure?",
            message: "This action is irreversible and will permanently delete the OIDC claim."
        },
        deleteScope: {
            assertionHint: "Please confirm your action.",
            content: "If you delete this scope, you will not be able to get it back. " +
                "Please proceed with caution.",
            header: "Are you sure?",
            message: "This action is irreversible and will permanently delete the OIDC scope."
        }
    },
    editScope: {
        claimList: {
            addClaim:  "New Attribute",
            emptyPlaceholder: {
                action: "Add Attribute",
                subtitles: {
                    0: "There are no attributes added for this OIDC scope.",
                    1: "Please add the required attributes to view them here."
                },
                title: "No OIDC attributes"
            },
            emptySearch: {
                action: "View all",
                subtitles: {
                    0: "We couldn't find the attribute you searched for.",
                    1: "Please try a different name."
                },
                title: "No results found"
            },
            popupDelete: "Delete attribute",
            searchClaims: "search attributes",
            subTitle: "Add or remove attributes of an OIDC scope",
            title: "{{ name }}"
        }
    },
    forms: {
        addScopeForm: {
            inputs: {
                description: {
                    label: "Description",
                    placeholder: "Enter a description for the scope"
                },
                displayName: {
                    label: "Display name",
                    placeholder: "Enter the display name",
                    validations: {
                        empty: "This field cannot be empty"
                    }
                },
                scopeName: {
                    label: "Scope",
                    placeholder: "Enter the scope",
                    validations: {
                        duplicate: "This scope already exists.",
                        empty: "This field cannot be empty.",
                        invalid: "Scope can only contain alphanumeric characters and _. " +
                        "And must be of length between 3 to 40 characters."
                    }
                }
            }
        }
    },
    list: {
        columns: {
            actions: "Actions",
            name: "Name"
        },
        empty: {
            action: "Add OIDC Scope",
            subtitles: {
                0: "There no OIDC Scopes in the system.",
                1: "Please add new OIDC scopes to view them here."
            },
            title: "No OIDC Scopes"
        },
        searchPlaceholder: "Search by scope"
    },
    notifications: {
        addOIDCClaim: {
            error: {
                description: "{{description}}",
                message: "Creation error"
            },
            genericError: {
                description: "An error occurred while adding the OIDC attribute.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully added the new OIDC attribute.",
                message: "Creation successful"
            }
        },
        addOIDCScope: {
            error: {
                description: "{{description}}",
                message: "Creation error"
            },
            genericError: {
                description: "An error occurred while creating the OIDC scope.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully created the new OIDC scope.",
                message: "Creation successful"
            }
        },
        claimsMandatory: {
            error: {
                description: "To add a scope, you need to make sure that the scope " +
                    "has at least one attribute.",
                message: "You need to select at least one attribute."
            }
        },
        deleteOIDCScope: {
            error: {
                description: "{{description}}",
                message: "Deletion error"
            },
            genericError: {
                description: "An error occurred while deleting the OIDC scope.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully deleted the OIDC scope.",
                message: "Deletion successful"
            }
        },
        deleteOIDClaim: {
            error: {
                description: "{{description}}",
                message: "Deletion error"
            },
            genericError: {
                description: "An error occurred while deleting the OIDC attribute.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully deleted the OIDC attribute.",
                message: "Deletion successful"
            }
        },
        fetchOIDCScope: {
            error: {
                description: "{{description}}",
                message: "Retrieval error"
            },
            genericError: {
                description: "An error occurred while fetching the OIDC scope details.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully fetched the OIDC scope details.",
                message: "Retrieval successful"
            }
        },
        fetchOIDCScopes: {
            error: {
                description: "{{description}}",
                message: "Retrieval error"
            },
            genericError: {
                description: "An error occurred while fetching the OIDC scopes.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully fetched the OIDC scope list.",
                message: "Retrieval successful"
            }
        },
        fetchOIDClaims: {
            error: {
                description: "{{description}}",
                message: "Retrieval error"
            },
            genericError: {
                description: "An error occurred while fetching the OIDC attributes.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully fetched the OIDC scope list.",
                message: "Retrieval successful"
            }
        },
        updateOIDCScope: {
            error: {
                description: "{{description}}",
                message: "Update error"
            },
            genericError: {
                description: "An error occurred while updating the OIDC scope.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully updated the OIDC scope {{ scope }}.",
                message: "Update successful"
            }
        }
    },
    placeholders:{
        emptyList: {
            action: "New OIDC Scope",
            subtitles: {
                0: "There are no OIDC scopes at the moment.",
                1: "You can add a new OIDC scope easily by following the",
                2: "steps in the creation wizard."
            },
            title: "Add a new OIDC Scope"
        },
        emptySearch: {
            action: "Clear search query",
            subtitles: {
                0: "We couldn't find the scope you searched for.",
                1: "Please try a different name."
            },
            title: "No results found"
        }
    },
    wizards: {
        addScopeWizard: {
            buttons: {
                next: "Next",
                previous: "Previous"
            },
            claimList: {
                searchPlaceholder: "Search attributes",
                table: {
                    emptyPlaceholders: {
                        assigned: "All the available attributes are assigned for this OIDC scope.",
                        unAssigned: "There are no attributes assigned for this OIDC scope."
                    },
                    header: "Attributes"
                }
            },
            steps: {
                basicDetails: "Basic Details",
                claims: "Add Attributes"
            },
            subTitle: "Create a new OpenID Connect (OIDC) scope with required attributes",
            title: "Create OpenID Connect Scope"
        }
    }
};
