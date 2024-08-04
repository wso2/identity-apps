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
import { SecretsNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */
export const secrets: SecretsNS = {
    advancedSearch: {
        form: {
            inputs: {
                filterAttribute: {
                    placeholder: "E.g. Name, Description etc."
                },
                filterCondition: {
                    placeholder: "E.g. Starts with etc."
                },
                filterValue: {
                    placeholder: "Enter value to search"
                }
            }
        },
        placeholder: "Search by secret name"
    },
    alerts: {
        createdSecret: {
            description: "Successfully created the secret.",
            message: "Creation successful."
        },
        deleteSecret: {
            description: "Successfully deleted the secret.",
            message: "Delete successful."
        },
        updatedSecret: {
            description: "Successfully updated the secret.",
            message: "Update successful."
        }
    },
    banners: {
        adaptiveAuthSecretType: {
            content: "These secrets can be used in the Conditional Authentication script of a " +
                "registered application when accessing external APIs.",
            title: "Conditional Authentication Secrets"
        },
        secretIsHidden: {
            content: "Once created, you won't be able to see the secret value again. " +
                "You will only be able to delete the secret. ",
            title: "Why can't I see the secret?"
        }
    },
    emptyPlaceholders: {
        buttons: {
            addSecret: {
                ariaLabel: "Add a new Secret.",
                label: "New Secret"
            },
            backToSecrets: {
                ariaLabel: "Navigate to Secrets list.",
                label: "Take me back to Secrets"
            }
        },
        emptyListOfSecrets: {
            messages: [
                "There are no secrets available at the moment."
            ]
        },
        resourceNotFound: {
            messages: [
                "Oops! we couldn't find the requested secret!",
                "Perhaps you have landed on an invalid URL..."
            ]
        }
    },
    errors: {
        generic: {
            description: "We were unable to complete this request. Please retry again.",
            message: "Something is not right."
        }
    },
    forms: {
        actions: {
            submitButton: {
                ariaLabel: "Update to save the form",
                label: "Update"
            }
        },
        editSecret: {
            page: {
                description: "Edit secret"
            },
            secretDescriptionField: {
                ariaLabel: "Secret Description",
                hint: "Provide a description for this secret (i.e., When to use this secret).",
                label: "Secret description",
                placeholder: "Enter a secret description"
            },
            secretValueField: {
                ariaLabel: "Enter a Secret Value",
                cancelButton: "Cancel",
                editButton: "Change secret value",
                hint: "You can enter a value between length {{minLength}} to {{maxLength}}.",
                label: "Secret value",
                placeholder: "Enter a secret value",
                updateButton: "Update secret value"
            }
        }
    },
    modals: {
        deleteSecret: {
            assertionHint: "Yes, I understand. I want to delete it.",
            content: "This action is irreversible and will permanently delete the secret.",
            primaryActionButtonText: "Confirm",
            secondaryActionButtonText: "Cancel",
            title: "Are you sure?",
            warningMessage: "If you delete this secret, conditional authentication scripts " +
                "depending on this value will stop working. Please proceed with caution."
        }
    },
    page: {
        description: "Create and manage secrets for conditional authentication",
        primaryActionButtonText: "New Secret",
        subFeatureBackButton: "Go back to Secrets",
        title: "Secrets"
    },
    routes: {
        category: "secrets",
        name: "Secrets",
        sidePanelChildrenNames: [
            "Secret Edit"
        ]
    },
    wizards: {
        actions: {
            cancelButton: {
                ariaLabel: "Cancel and Close Modal",
                label: "Cancel"
            },
            createButton: {
                ariaLabel: "Create and Submit",
                label: "Create"
            }
        },
        addSecret: {
            form: {
                secretDescriptionField: {
                    ariaLabel: "Secret Description",
                    hint: "Provide a description for this secret (i.e., When to use this secret).",
                    label: "Secret description",
                    placeholder: "Enter a secret description"
                },
                secretNameField: {
                    alreadyPresentError: "This Secret name is already added!",
                    ariaLabel: "Secret Name for the Secret Type",
                    hint: "Provide a meaningful name for this secret. Note that once " +
                        "you create this secret with the name above, you cannot change it afterwards.",
                    label: "Secret name",
                    placeholder: "Enter a secret name"
                },
                secretTypeField: {
                    ariaLabel: "Select Secret Type",
                    hint: "Select a Secret Type which this Secret falls into.",
                    label: "Select secret type"
                },
                secretValueField: {
                    ariaLabel: "Enter a secret value",
                    hint: "This is the value of the secret. You can enter a value between length" +
                        " {{minLength}} to {{maxLength}}.",
                    label: "Secret value",
                    placeholder: "Enter a secret value"
                }
            },
            heading: "Create Secret",
            subheading: "Create a new secret for conditional authentication scripts"
        }
    }
};
