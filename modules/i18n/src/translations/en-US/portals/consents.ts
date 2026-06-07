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
    preferenceManagement: {
        form: {
            description: {
                label: "Description",
                labelRoleHint: "Leave empty to use the default description."
            },
            linkHint: "To include this preference in a registration flow, go to the <0>Registration Flow Builder</0>.",
            name: {
                error: {
                    duplicateName: "A preference with this name already exists. Please use a different name."
                },
                label: "Name",
                placeholder: "Newsletter Subscription"
            }
        },
        list: {
            emptyPlaceholder: {
                addConsent: "New Preference",
                subtitle: "There are no preferences available at the moment"
            },
            emptySearchPlaceholder: {
                action: "Clear search",
                subtitle: "No preferences found for the search query.",
                title: "No results found"
            },
            labels: {
                sharedPreference: "Shared preference"
            }
        },
        notifications: {
            create: {
                error: {
                    conflict: {
                        description: "A preference with this name already exists. Please use a different name.",
                        message: "Conflict"
                    },
                    description: "Failed to create preference. Please try again.",
                    message: "Create Failed",
                    notFound: {
                        description: "The requested preference was not found.",
                        message: "Not Found"
                    },
                    serverError: {
                        description: "A server error occurred while creating the preference. Please try again later.",
                        message: "Server Error"
                    }
                },
                success: {
                    description: "Preference created successfully.",
                    message: "Preference Created"
                }
            },
            delete: {
                error: {
                    conflict: {
                        description: "This preference cannot be deleted because it is in use or is protected.",
                        message: "Cannot Delete"
                    },
                    description: "Failed to delete preference. Please try again.",
                    message: "Delete Failed",
                    notFound: {
                        description: "The preference you are trying to delete was not found.",
                        message: "Not Found"
                    },
                    serverError: {
                        description: "A server error occurred while deleting the preference. Please try again later.",
                        message: "Server Error"
                    }
                },
                success: {
                    description: "Preference deleted successfully.",
                    message: "Preference Deleted"
                }
            },
            update: {
                error: {
                    conflict: {
                        description: "This version already exists or conflicts with another version.",
                        message: "Version Conflict"
                    },
                    description: "Preference update failed. Please try again.",
                    message: "Update Failed",
                    notFound: {
                        description: "The preference or version you are trying to update was not found.",
                        message: "Not Found"
                    },
                    serverError: {
                        description: "A server error occurred while updating the preference. Please try again later.",
                        message: "Server Error"
                    }
                },
                success: {
                    description: "Preference updated successfully.",
                    message: "Update Successful"
                }
            }
        },
        pages: {
            deleteConfirmation: {
                assertionHint: "I understand this action is permanent and cannot be undone.",
                content: "This preference can only be deleted if no users have accepted it.",
                header: "Delete preference?",
                message: "This will permanently delete the preference. This cannot be undone.",
                primaryAction: "Confirm",
                secondaryAction: "Cancel"
            },
            edit: {
                backButton: "Back to Preference Management",
                dangerZone: {
                    actionTitle: "Delete Preference",
                    header: "Delete Preference",
                    subheader: "Once you delete a preference, there is no going back. Please be certain."
                },
                title: "Edit Preference"
            },
            list: {
                actions: {
                    addConsent: "New Preference"
                },
                description: "Manage communication preferences for your organization.",
                heading: "Preference Management",
                search: {
                    placeholder: "Search by name"
                },
                title: "Preference Management"
            },
            new: {
                backButton: "Back to Preference Management",
                title: "Create Preference"
            }
        },
        preview: {
            consentHeader: "Please review your preferences  to proceed.",
            emptyDescription: "Write a consent name to preview.",
            exampleDescription: "I agree to receive {{consentName}} communications.",
            pageTitle: "Communication Preferences"
        }
    },
    policyConsents: {
        brandingRequired: "Enable branding to update default policies. <1>Go to Branding</1>",
        form: {
            createNewVersion: "Create New Version",
            description: {
                label: "Description"
            },
            mandatory: {
                hint: "When enabled, users must accept this policy to proceed. This setting cannot be changed after creation.",
                label: "Mandatory",
                linkHint: "To include this consent in a registration flow, go to the <0>Registration Flow Builder</0>."
            },
            name: {
                error: {
                    duplicateName: "A policy with this name already exists. Please use a different name."
                },
                label: "Name",
                placeholder: "Privacy Policy"
            },
            policyUrl: {
                hint: "Link to the full policy document. You can use placeholders like <1>{{lang}}</1>, <3>{{country}}</3>, or <5>{{locale}}</5> to customize the URL for different regions or languages.",
                label: "Policy URL",
                versionHint: "To create a new version, update the policy URL, description, or prompt settings above."
            },
            promptOnLogin: {
                activeHint: "Users will be prompted to review and accept this policy during login.",
                hint: "When enabled, users will be prompted to review and accept this policy at each login.",
                label: "Prompt on Login"
            },
            versionDropdown: {
                currentVersionLabel: "Version {{version}} (current)",
                trigger: "Version {{version}}"
            },
            createModal: {
                header: "Create Policy",
                promptAtLogin: "Prompt users to accept at next login",
                promptDescription: "Choose whether existing users should be prompted to review and accept this new policy at their next login. This setting cannot be changed later."
            },
            versionModal: {
                createNewVersion: "Save as New Version",
                promptAtLogin: "Prompt users to accept at next login",
                promptDescription: "Choose whether users should be prompted to review and accept this updated policy at their next login. Note: users who have not yet accepted a previously prompted version will still be prompted, regardless of this setting."
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
            },
            labels: {
                defaultPolicy: "Default",
                sharedPolicy: "Shared policy"
            }
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
                        message: "Not Found"
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
                        message: "Not Found"
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
            update: {
                error: {
                    conflict: {
                        description: "This version already exists or conflicts with another version.",
                        message: "Version Conflict"
                    },
                    description: "Policy update failed. Please try again.",
                    message: "Update Failed",
                    notFound: {
                        description: "The policy or version you are trying to update was not found.",
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
            deleteConfirmation: {
                assertionHint: "I understand this action is permanent and cannot be undone.",
                content: "This policy can only be deleted if no users have accepted it.",
                header: "Delete policy?",
                message: "This will permanently delete the policy. This cannot be undone.",
                primaryAction: "Confirm",
                secondaryAction: "Cancel"
            },
            edit: {
                backButton: "Back to Policies",
                dangerZone: {
                    actionTitle: "Delete Policy",
                    header: "Delete Policy",
                    subheader: "Once you delete a policy, there is no going back. Please be certain."
                },
                title: "Edit Policy"
            },
            list: {
                actions: {
                    addPolicy: "New Policy"
                },
                description: "Manage policies for your organization.",
                heading: "Policy Management",
                search: {
                    placeholder: "Search by policy name"
                },
                title: "Policy Management"
            },
            new: {
                backButton: "Back to Policies",
                title: "Create Policy"
            }
        },
        wizard: {
            create: {
                form: {
                    description: {
                        configureTranslation: "Configure translation",
                        i18nCard: {
                            brandingRequired: "Enable branding to update translations. <1>Go to Branding</1>",
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
                        labelRoleHint: "Leave empty to use the default description. Select text and click \"Policy Link\" to hyperlink it to the policy URL."
                    }
                },
                preview: {
                    consentHeader: "Please review and accept the following to continue.",
                    emptyDescription: "Enter a policy name above to see a preview.",
                    exampleDescription: "I have read and agree to the <0>{{policyName}}</0>.",
                    pageTitle: "Review and Accept Policies",
                    updatedPolicies: "Updated policies"
                }
            }
        }
    },
    registrationFlow: {
        addAttribute: "Add Attribute",
        addPurpose: "Add Purpose",
        attributeDisplayName: "Display Name",
        attributeName: "Attribute Name",
        attributes: "User Attributes",
        noPreference: "No preferences available. Create them from Preference Management.",
        noPolicies: "No policies available. Create policies from Policy Management.",
        purposeDescription: "Description",
        purposeLabel: "Purpose {{index}}",
        purposeName: "Purpose Name",
        selectPreference: "Select Preferences:",
        selectPolicies: "Select Policies:"
    },
    tabs: {
        content: { label: "Content" },
        preview: { label: "Preview" }
    }
};
