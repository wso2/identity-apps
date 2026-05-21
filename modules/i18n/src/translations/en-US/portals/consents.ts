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

import { ConsentsNS } from "../../../models";

export const consents: ConsentsNS = {
    marketingConsents: {
        form: {
            createNewVersion: "Create New Version",
            description: {
                label: "Description",
                labelRoleHint: "Leave empty to use the default."
            },
            name: {
                error: {
                    duplicateName: "A marketing consent with this name already exists. Please use a different name."
                },
                label: "Name",
                placeholder: "Newsletter Subscription"
            },
            versionModal: {
                createNewVersion: "Create New Version?",
                description: "This will create a new version of the marketing consent."
            }
        },
        list: {
            emptyPlaceholder: {
                addConsent: "New Marketing Consent",
                subtitle: "There are no marketing consents available at the moment"
            },
            emptySearchPlaceholder: {
                action: "Clear search",
                subtitle: "No marketing consents found for the search query.",
                title: "No results found"
            }
        },
        notifications: {
            create: {
                error: {
                    conflict: {
                        description: "A marketing consent with this name already exists. Please use a different name.",
                        message: "Conflict"
                    },
                    description: "Failed to create marketing consent. Please try again.",
                    message: "Create Failed",
                    notFound: {
                        description: "The requested marketing consent was not found.",
                        message: "Not Found"
                    },
                    serverError: {
                        description: "A server error occurred while creating the marketing consent. Please try again later.",
                        message: "Server Error"
                    }
                },
                success: {
                    description: "Marketing consent created successfully.",
                    message: "Marketing Consent Created"
                }
            },
            delete: {
                error: {
                    conflict: {
                        description: "This marketing consent cannot be deleted because it is in use or is protected.",
                        message: "Cannot Delete"
                    },
                    description: "Failed to delete marketing consent. Please try again.",
                    message: "Delete Failed",
                    notFound: {
                        description: "The marketing consent you are trying to delete was not found.",
                        message: "Not Found"
                    },
                    serverError: {
                        description: "A server error occurred while deleting the marketing consent. Please try again later.",
                        message: "Server Error"
                    }
                },
                success: {
                    description: "Marketing consent deleted successfully.",
                    message: "Marketing Consent Deleted"
                }
            },
            update: {
                error: {
                    conflict: {
                        description: "This version already exists or conflicts with another version.",
                        message: "Version Conflict"
                    },
                    description: "Marketing consent update failed. Please try again.",
                    message: "Update Failed",
                    notFound: {
                        description: "The marketing consent or version you are trying to update was not found.",
                        message: "Not Found"
                    },
                    serverError: {
                        description: "A server error occurred while updating the marketing consent. Please try again later.",
                        message: "Server Error"
                    }
                },
                success: {
                    description: "Marketing consent updated successfully.",
                    message: "Update Successful"
                }
            }
        },
        pages: {
            edit: {
                backButton: "Back to Marketing Consents",
                dangerZone: {
                    actionTitle: "Delete Marketing Consent",
                    header: "Delete Marketing Consent",
                    subheader: "Once you delete a marketing consent, there is no going back. Please be certain."
                },
                deleteConfirmation: {
                    assertionHint: "I confirm that I want to delete this marketing consent.",
                    content: "You can delete this marketing consent only if no users have given consent to it.",
                    header: "Are you sure?",
                    message: "This action is irreversible and will permanently delete the marketing consent.",
                    primaryAction: "Confirm",
                    secondaryAction: "Cancel"
                },
                title: "Edit Marketing Consent"
            },
            list: {
                actions: {
                    addConsent: "New Marketing Consent"
                },
                backButton: "Go back to login & registration",
                deleteConfirmation: {
                    assertionHint: "I confirm that I want to delete this marketing consent.",
                    content: "You can delete this marketing consent only if no users have given consent to it.",
                    header: "Are you sure?",
                    message: "This action is irreversible and will permanently delete the marketing consent.",
                    primaryAction: "Confirm",
                    secondaryAction: "Cancel"
                },
                description: "Configure and manage marketing consents.",
                heading: "Marketing Consents",
                search: {
                    placeholder: "Search marketing consents by name"
                },
                title: "Marketing Consents"
            },
            new: {
                backButton: "Back to Marketing Consents",
                title: "Create Marketing Consent"
            }
        },
        preview: {
            allowButton: "Continue",
            denyButton: "Decline",
            emptyDescription: "Write a consent name to preview.",
            exampleDescription: "I agree to receive information and commerical offers.",
            pageTitle: "Marketing Consent Review"
        }
    },
    form: {
        createNewVersion: "Create New Version",
        description: {
            label: "Description"
        },
        mandatory: {
            hint: "Set during policy creation. When enabled, users will not be able to continue the flow without accepting this policy.",
            label: "Mandatory",
            linkHint: "To add to registration flow, navigate to <0>registration flow builder</0>."
        },
        name: {
            error: {
                duplicateName: "A policy with this name already exists. Please use a different name."
            },
            label: "Name",
            placeholder: "Privacy Policy"
        },
        policyUrl: {
            hint: "Provide the URL where the full policy document can be accessed. " +
                "You can use placeholders like {{lang}}, {{country}}, or {{locale}} " +
                "to customize the URL for different regions or languages.",
            label: "Policy URL",
            versionHint: "To create a new version, update the policy URL, description, or prompt settings above."
        },
        promptOnLogin: {
            activeHint: "Users will be prompted to review and accept this policy during login.",
            hint: "When enabled, users will be prompted to review and accept this policy during login.",
            label: "Prompt on Login"
        },
        versionDropdown: {
            currentVersionLabel: "Version {{version}} (current)",
            trigger: "Version {{version}}"
        },
        versionModal: {
            createNewVersion: "Create New Version?",
            promptAtLogin: "Prompt users at next login",
            promptDescription: "Choose whether users should be prompted to accept the updated policy."
        }
    },
    list: {
        emptyPlaceholder: {
            addPolicy: "New Policy",
            subtitle: "There are no policies available at the moment"
        },
        emptySearchPlaceholder: {
            action: "Clear search",
            subtitle: "No policies found for the search query.",
            title: "No results found"
        }
    },
    registrationFlow: {
        addAttribute: "Add Attribute",
        addPurpose: "Add Purpose",
        attributeDisplayName: "Display Name",
        attributeName: "Attribute Name",
        attributes: "User Attributes",
        noMarketing: "No marketing consents available. Create them from Marketing Consents.",
        noPolicies: "No policies available. Create policies from Policy Consents.",
        purposeDescription: "Description",
        purposeLabel: "Purpose {{index}}",
        purposeName: "Purpose Name",
        removeAttribute: "Remove attribute",
        removePurpose: "Remove purpose",
        selectMarketing: "Marketing Consent",
        selectPolicies: "Select Policies:"
    },
    notifications: {
        create: {
            error: {
                conflict: {
                    description: "A policy with this name already exists. Please use a different name.",
                    message: "Conflict"
                },
                description: "Failed to create policy. Please try again.",
                message: "Create Failed",
                notFound: {
                    description: "The requested policy was not found.",
                    message: "Policy Not Found"
                },
                serverError: {
                    description: "A server error occurred while creating the policy. Please try again later.",
                    message: "Server Error"
                }
            },
            success: {
                description: "Policy created successfully.",
                message: "Policy Created"
            }
        },
        delete: {
            error: {
                conflict: {
                    description: "This policy cannot be deleted because it is in use or is protected.",
                    message: "Cannot Delete"
                },
                description: "Failed to delete policy. Please try again.",
                message: "Delete Failed",
                notFound: {
                    description: "The policy you are trying to delete was not found.",
                    message: "Policy Not Found"
                },
                serverError: {
                    description: "A server error occurred while deleting the policy. Please try again later.",
                    message: "Server Error"
                }
            },
            success: {
                description: "Policy deleted successfully.",
                message: "Policy Deleted"
            }
        },
        updatePolicy: {
            error: {
                conflict: {
                    description: "This version already exists or conflicts with another version.",
                    message: "Version Conflict"
                },
                description: "Policy update failed. Please try again.",
                message: "Update Failed",
                notFound: {
                    description: "The consent or version you are trying to update was not found.",
                    message: "Not Found"
                },
                serverError: {
                    description: "A server error occurred while updating the policy. Please try again later.",
                    message: "Server Error"
                }
            },
            success: {
                description: "Policy updated successfully.",
                message: "Update Successful"
            }
        }
    },
    pages: {
        edit: {
            backButton: "Back to Policies",
            dangerZone: {
                actionTitle: "Delete Policy",
                header: "Delete Policy",
                subheader: "Once you delete a policy, there is no going back. Please be certain."
            },
            deleteConfirmation: {
                assertionHint: "I confirm that I want to delete this policy.",
                content: "You can delete this policy only if no users have given consent to it.",
                header: "Are you sure?",
                message: "This action is irreversible and will permanently delete the policy.",
                primaryAction: "Confirm",
                secondaryAction: "Cancel"
            },
            title: "Edit Policy"
        },
        list: {
            actions: {
                addPolicy: "New Policy"
            },
            deleteConfirmation: {
                assertionHint: "I confirm that I want to delete this policy.",
                content: "You can delete this policy only if no users have given consent to it.",
                header: "Are you sure?",
                message: "This action is irreversible and will permanently delete the policy.",
                primaryAction: "Confirm",
                secondaryAction: "Cancel"
            },
            backButton: "Go back to login & registration",
            description: "Configure and manage policy consents.",
            heading: "Policy Consents",
            search: {
                placeholder: "Search policies by name"
            },
            title: "Policy Consents"
        },
        new: {
            backButton: "Back to Policies",
            title: "Create Policy"
        }
    },
    tabs: {
        content: { label: "Content" },
        preview: { label: "Preview" }
    },
    wizard: {
        create: {
            form: {
                description: {
                    configureTranslation: "Configure translation",
                    i18nCard: {
                        brandingRequired: "Enable branding to configure translations.",
                        createTitle: "Create Translation",
                        deleteError: {
                            description: "Failed to delete the translation. Please try again.",
                            message: "Delete Failed"
                        },
                        deleteSuccess: {
                            description: "Translation deleted successfully.",
                            message: "Translation Deleted"
                        },
                        deleteTooltip: "Delete the translation for the selected key.",
                        editTooltip: "Edit the translation text for the selected key.",
                        i18nKey: "Translation Key",
                        keyPlaceholder: "e.g. consent.description",
                        language: "Language",
                        newTooltip: "Create a new translation key for this description.",
                        saveError: {
                            description: "Failed to save the translation. Please try again.",
                            message: "Save Failed"
                        },
                        saveSuccess: {
                            description: "Translation saved successfully.",
                            message: "Translation Saved"
                        },
                        selectKey: "Select a translation key",
                        title: "Configure Translation",
                        translationPlaceholder: "Enter the translated description text...",
                        translationText: "Translation Text",
                        updateTitle: "Update Translation"
                    },
                    insertPolicyLink: "Wrap selected text with the policy URL as a link",
                    insertPolicyLinkInvalidUrl: "The Policy URL must be a valid HTTP or HTTPS URL.",
                    insertPolicyLinkNoPolicyUrl: "Define a Policy URL above before inserting a link.",
                    insertPolicyLinkNoSelection: "Select the words you want to link, then click.",
                    insertPolicyLinkShort: "Policy Link",
                    insertPolicyLinkTooltip: "Wraps the selected text with your Policy URL as a hyperlink.",
                    labelRoleHint: "Leave empty to use the default. " +
                        "Select text and click \"Policy Link\" to wrap it with the policy URL."
                }
            },
            preview: {
                allowButton: "Continue",
                consentHeader: "Please review and accept the following to proceed.",
                denyButton: "Decline",
                emptyDescription: "Write a policy name to preview.",
                exampleDescription: "I have read and agree to the <0>{{policyName}}</0>.",
                pageTitle: "Policy Review Required"
            }
        }
    }
};
