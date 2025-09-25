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
import { flowsNS } from "../../../models";

export const flows: flowsNS = {
    askPassword: {
        banner: {
            description: "Provide a seamless invited user onboarding experience to your users by customizing the registration flow to suit your organization's needs.",
            title: "Construct your ideal invited user registration experience with our new <1>Invited User Registration Flow Builder</1>"
        },
        flowDisplayName: "Invited User Registration",
        steps: {
            end: {
                description: "The <1>End Screen</1> defines what happens once the invited user registration flow is completed. It allows you to control the user's final experience by selecting one of the following outcomes:",
                flowCompletionNotification: {
                    label: "Send a notification email on flow completion",
                    hint: "Notify the user via email once the flow is successfully completed."
                },
                autoLogin: {
                    label: "Auto Login",
                    hint: "Immediately log the user in once the flow is completed, without additional steps."
                }
            }
        },
        tooltip: {
            disableFlow: "Click to disable the invited user registration flow",
            enableFlow: "Click to enable the invited user registration flow"
        }
    },
    core: {
        breadcrumb: "Edit {{flowType}} Flow",
        labels: {
            disableFlow: "Disable",
            enableFlow: "Enable"
        },
        elements: {
            richText: {
                linkEditor: {
                    placeholder: "Enter link URL here...",
                    predefinedUrls: {
                        applicationAccessUrl: "Application Access URL",
                        callbackOrApplicationAccessUrl: "Callback or Application Access URL",
                        customUrl: "Custom URL",
                        privacyPolicyUrl: "Privacy Policy URL",
                        supportEmail: "Contact Support Email",
                        termsOfUseUrl: "Terms of Use URL"
                    },
                    urlTypeLabel: "URL Type"
                },
                placeholder: "Enter rich text content here..."
            },
            textPropertyField: {
                i18nCard: {
                    chip: {
                        commonScreen: {
                            label: "Common"
                        }
                    },
                    commonKeyWarning: "You are editing a shared translation key that affects multiple pages across the system. Changes will be reflected on all pages that use this key.",
                    configure: "More",
                    createTitle: "Create Translations",
                    i18nKey: "Translation key",
                    i18nKeyInputHint: "Translation key will be prefixed with '{{newI18nKeyPrefix}}' and added to the {{primaryI18nScreen}} screen",
                    i18nKeyInputPlaceholder: "Enter a new translation key",
                    language: "Language",
                    languageText: "Translation",
                    languageTextPlaceholder: "Enter text for the selected language",
                    selectI18nKey: "Select a translation key",
                    selectLanguage: "Select language",
                    title: "Translations - {{propertyKey}}",
                    tooltip: {
                        addNewTranslation: "Add a new translation",
                        commonKeyTooltip: "This is a shared translation key used across multiple end user facing pages",
                        editExistingTranslation: "Update an existing translation"
                    },
                    updateTitle: "Update Translations"
                },
                placeholder: "Enter {{propertyName}}",
                tooltip: {
                    configureTranslation: "Configure translation",
                    enableBrandingRequired: "Enable branding to update translations. <1>Go to Branding</1>"
                }
            }
        },
        executions: {
            names: {
                apple: "Apple",
                confirmationCode: "Confirmation Code",
                default: "Execution",
                facebook: "Facebook",
                github: "GitHub",
                google: "Google",
                magicLink: "Magic Link",
                microsoft: "Microsoft",
                passkeyEnrollment: "Enroll Passkey"
            }
        },
        notificationPanel: {
            emptyMessages: {
                errors: "No errors found.",
                info: "No information messages found.",
                warnings: "No warnings found."
            },
            header: "Notifications",
            tabs: {
                errors: "Errors",
                info: "Info",
                warnings: "Warnings"
            }
        },
        notifications: {
            brandingPreferenceFetch: {
                genericError: {
                    description: "An error occurred while fetching the branding preferences.",
                    message: "Branding Preference Fetch Error"
                }
            },
            customTextPreferenceMetaFetch: {
                genericError: {
                    description: "An error occurred while fetching the custom text preference metadata.",
                    message: "Custom Text Preference Meta Fetch Error"
                }
            },
            disableFlow: {
                genericError: {
                    description: "An error occurred while disabling the {{flowType}} flow.",
                    message: "Disable {{flowType}} Flow Error"
                },
                success: {
                    description: "Successfully disabled the {{flowType}} flow.",
                    message: "{{flowType}} Flow Disabled"
                }
            },
            enableFlow: {
                genericError: {
                    description: "An error occurred while enabling the {{flowType}} flow.",
                    message: "Enable {{flowType}} Flow Error"
                },
                success: {
                    description: "Successfully enabled the {{flowType}} flow.",
                    message: "{{flowType}} Flow Enabled"
                }
            },
            fallbackTextPreferenceFetch: {
                genericError: {
                    description: "An error occurred while fetching the fallback text preferences.",
                    message: "Fallback Text Preference Fetch Error"
                }
            },
            fetchFlowConfig: {
                genericError: {
                    description: "An error occurred while fetching the {{flowType}} flow configuration.",
                    message: "Fetch {{flowType}} Flow Error"
                }
            },
            flowMetadataFetch: {
                genericError: {
                    description: "An error occurred while fetching the flow metadata.",
                    message: "Flow Metadata Fetch Error"
                }
            },
            textPreferenceFetch: {
                genericError: {
                    description: "An error occurred while fetching the custom text preferences.",
                    message: "Text Preference Fetch Error"
                }
            },
            updateI18nKey: {
                genericError: {
                    description: "An error occurred while updating the custom text in the flow.",
                    message: "Update Custom Text Error"
                },
                success: {
                    description: "Successfully updated the custom text in the flow.",
                    message: "Update Custom Text Success"
                }
            }
        },
        validation: {
            fields: {
                button: {
                    action: "Button must have an action type defined for proper functionality.",
                    general: "Required fields are not properly configured for the button with ID <1>{{id}}</1>.",
                    text: "Button must have text to be displayed to users.",
                    variant: "Button must have a variant defined for proper styling."
                },
                checkbox: {
                    general: "Required fields are not properly configured for the checkbox field with ID <1>{{id}}</1>.",
                    identifier: "Checkbox field must be mapped to an attribute for data collection.",
                    label: "Checkbox field must have a label to be displayed to users."
                },
                divider: {
                    general: "Required fields are not properly configured for the divider with ID <1>{{id}}</1>.",
                    variant: "Divider must have a variant defined for proper styling and orientation."
                },
                image: {
                    general: "Required fields are not properly configured for the image with ID <1>{{id}}</1>.",
                    src: "Image must have a source URL to be displayed to users.",
                    variant: "Image must have a variant defined for proper styling and layout."
                },
                input: {
                    general: "Required fields are not properly configured for the input field with ID <1>{{id}}</1>.",
                    identifier: "Input field must be mapped to an attribute for data collection.",
                    idpName: "Connection is required and must be selected.",
                    label: "Input field must have a label to be displayed to users."
                },
                otpInput: {
                    general: "Required fields are not properly configured for the OTP input field with ID <1>{{id}}</1>.",
                    label: "OTP input field must have a label to guide users."
                },
                phoneNumberInput: {
                    general: "Required fields are not properly configured for the phone number field with ID <1>{{id}}</1>.",
                    identifier: "Phone number field must be mapped to an attribute for data collection.",
                    label: "Phone number field must have a label to be displayed to users."
                },
                richText: {
                    general: "Required fields are not properly configured for the rich text with ID <1>{{id}}</1>.",
                    text: "Rich text must have content to be displayed to users."
                },
                typography: {
                    general: "Required fields are not properly configured for the typography with ID <1>{{id}}</1>.",
                    text: "Typography must have text content to be displayed to users.",
                    variant: "Typography must have a variant defined for proper text styling."
                }
            }
        },
        steps: {
            end: {
                flowCompletionProperties: "Flow Completion Properties"
            }
        },
        validationStatusLabels: {
            error: "Error",
            errors: "Errors",
            info: "Info",
            warning: "Warning",
            warnings: "Warnings"
        }
    },
    label: "Flows",
    passwordRecovery: {
        banner: {
            description: "Provide a seamless password recovery experience to your users by customizing the recovery flow to suit your organization's needs.",
            title: "Construct your ideal password recovery experience with our new <1>Password Recovery Flow Builder</1>"
        },
        flowDisplayName: "Password Recovery",
        name: "Password Recovery Flow Builder",
        steps: {
            end: {
                description: "The <1>End Screen</1> defines what happens once the password recovery flow is completed. It allows you to control the user&apos;s final experience by selecting one of the following outcomes:",
                autoLogin: {
                    label: "Auto Login",
                    hint: "Immediately log the user in once the password recovery is completed, without additional steps."
                },
                flowCompletionNotification: {
                    label: "Send a notification email on flow completion",
                    hint: "Notify the user via email once the password recovery flow is successfully completed."
                }
            }
        },
        tooltip: {
            disableFlow: "Click to disable the password recovery flow",
            enableFlow: "Click to enable the password recovery flow"
        }
    },
    registrationFlow: {
        flowDisplayName: "Registration",
        notifications: {
            updateFlowConfig: {
                genericError: {
                    description: "Failed to update the registration flow completion configurations.",
                    message: "Configuration Update Failure"
                }
            },
            updateRegistrationFlow: {
                genericError: {
                    description: "Failed to update the registration flow.",
                    message: "Flow Update Failure"
                },
                success: {
                    description: "Registration flow updated successfully.",
                    message: "Flow Updated Successfully"
                }
            }
        },
        steps: {
            emailConfirmation: "Email Confirmation",
            end: {
                description: "The <1>End Screen</1> defines what happens once the flow is completed. It allows you to control the user&apos;s final experience by selecting one of the following outcomes:",
                accountVerification: {
                    label: "Verify the account on flow completion",
                    hint: "Require the user to confirm their account via email before granting access."
                },
                accountActivation: {
                    activateImmediately: {
                        label: "Activate the account on creation",
                        hint: "Automatically activate the user account upon creation, allowing immediate access without waiting for verification."
                    }
                },
                accountFlowCompletion: {
                    label: "Send a notification email on flow completion",
                    hint: "Notify the user via email once the flow is successfully completed."
                },
                autoLogin: {
                    label: "Auto Login",
                    hint: "Immediately log the user in once the flow is completed, without additional steps."
                }
            }
        },
        tooltip: {
            disableFlow: "Click to disable the registration flow",
            enableFlow: "Click to enable the registration flow"
        }
    }
};
