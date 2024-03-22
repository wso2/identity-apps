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

import { emailTemplateTypesNS } from "../../../models"

export const emailTemplateTypes: emailTemplateTypesNS = {
    advancedSearch: {
        error: "Filter query format incorrect",
        form: {
            inputs: {
                filterAttribute: {
                    placeholder: "E.g. Name etc."
                },
                filterCondition: {
                    placeholder: "E.g. Starts with etc."
                },
                filterValue: {
                    placeholder: "E.g. TOTP, passwordResetSuccess etc."
                }
            }
        },
        placeholder: "Search by email template type"
    },
    buttons: {
        createTemplateType: "Create Template Type",
        deleteTemplate: "Delete Template",
        editTemplate: "Edit Template",
        newType: "New Template Type"
    },
    confirmations: {
        deleteTemplateType: {
            assertionHint: "Please type <1>{{ id }}</1> to confirm.",
            content: "If you delete this email template type, all associated work flows will no longer " +
                "have a valid email template to work with and this will delete all the locale templates " +
                "associated with this template type. Please proceed cautiously.",
            header: "Are you sure?",
            message: "This action is irreversible and will permanently delete the selected email " +
                "template type."
        }
    },
    forms: {
        addTemplateType: {
            fields: {
                type: {
                    label: "Template Type Name",
                    placeholder: "Enter a template type name",
                    validations: {
                        empty: "Template type name is required to proceed."
                    }
                }
            }
        }
    },
    list: {
        actions: "Actions",
        name: "Name"
    },
    notifications: {
        createTemplateType: {
            error: {
                description: "{{description}}",
                message: "Error creating email template type."
            },
            genericError: {
                description: "Couldn't create email template type.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully created the email template type.",
                message: "Creating email template type is successful"
            }
        },
        deleteTemplateType: {
            error: {
                description: "{{description}}",
                message: "Error deleting email template type."
            },
            genericError: {
                description: "Couldn't delete email template type.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully deleted the email template type.",
                message: "Email template type delete successful"
            }
        },
        getTemplateTypes: {
            error: {
                description: "{{description}}",
                message: "Retrieval error"
            },
            genericError: {
                description: "Couldn't retrieve the email template types.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully retrieved the email template types.",
                message: "Retrieval successful"
            }
        },
        updateTemplateType: {
            error: {
                description: "{{description}}",
                message: "Error updating email template type."
            },
            genericError: {
                description: "Couldn't update email template type.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully updated the email template type.",
                message: "Email template type update successful"
            }
        }
    },
    placeholders: {
        emptyList: {
            action: "New Template Type",
            subtitles: {
                0: "There are no templates types available at the moment.",
                1: "You can add a new template type by ",
                2: "clicking on the button below."
            },
            title: "Add new Template Type"
        },
        emptySearch: {
            action: "Clear search query",
            subtitles: "We couldn't find any results for {{searchQuery}}. "
                + "Please try a different search term.",
            title: "No results found"
        }
    },
    wizards: {
        addTemplateType: {
            heading: "Create Email Template Type",
            steps: {
                templateType: {
                    heading: "Template Type"
                }
            },
            subHeading: "Create a new template type to associate with email requirements."
        }
    }
}
