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
import { emailTemplatesNS } from "../../../models";

export const emailTemplates: emailTemplatesNS = {
    buttons: {
        deleteTemplate: "Delete Template",
        editTemplate: "Edit Template",
        newTemplate: "New Template",
        viewTemplate: "View Template",
        createTemplateType: "Create Template Type",
        newType: "New Template Type"
    },
    confirmations: {
        deleteTemplate: {
            assertionHint: "Please type <1>{{ id }}</1> to confirm.",
            content: "If you delete this email template, all associated work flows will no longer " +
                "have a valid email template to work with. Please proceed cautiously.",
            header: "Are you sure?",
            message: "This action is irreversible and will permanently delete the selected email template."
        },
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
    editor: {
        tabs: {
            code: {
                tabName: "HTML Code"
            },
            preview: {
                tabName: "Preview"
            }
        }
    },
    list: {
        actions: "Actions",
        name: "Name"
    },
    notifications: {
        createTemplate: {
            error: {
                description: "{{description}}",
                message: "Error creating email template."
            },
            genericError: {
                description: "Couldn't create email template.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully created the email template.",
                message: "Creating email template is successful"
            }
        },
        deleteTemplate: {
            error: {
                description: "{{description}}",
                message: "Error deleting email template."
            },
            genericError: {
                description: "Couldn't delete email template.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully deleted the email template .",
                message: "Email template delete successful"
            }
        },
        getTemplateDetails: {
            error: {
                description: "{{description}}",
                message: "Retrieval error"
            },
            genericError: {
                description: "Couldn't retrieve the email template details.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully retrieved the email template details.",
                message: "Retrieval successful"
            }
        },
        getTemplates: {
            error: {
                description: "{{description}}",
                message: "Retrieval error"
            },
            genericError: {
                description: "Couldn't retrieve the email templates.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully retrieved the email templates.",
                message: "Retrieval successful"
            }
        },
        iframeUnsupported: {
            genericError: {
                description: "Your browser does not support iframes.",
                message: "Unsupported"
            }
        },
        updateTemplate: {
            error: {
                description: "{{description}}",
                message: "Error updating email template."
            },
            genericError: {
                description: "Couldn't update email template.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully updated the email template.",
                message: "Email template update successful"
            }
        },
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
            action: "New Template",
            subtitles: {
                0: "There are no templates available for the selected",
                1: "email template type at the moment. You can add a new template by ",
                2: "clicking on the button below."
            },
            title: "Add Template"
        },
        emptySearch: {
            action: "Clear search query",
            subtitles: "We couldn't find any results for {{searchQuery}}. "
                + "Please try a different search term.",
            title: "No results found"
        }
    },
    viewTemplate: {
        heading: "Email Template Preview"
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
    }
};
