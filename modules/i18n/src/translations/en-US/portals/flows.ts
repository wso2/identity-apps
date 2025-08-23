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
        breadcrumb: "Edit Invited User Registration Flow",
        notifications: {
            disableFlow: {
                genericError: {
                    description: "An error occurred while disabling the invited user registration flow.",
                    message: "Disable Invited User Registration Flow Error"
                },
                success: {
                    description: "Successfully disabled the invited user registration flow.",
                    message: "Invited User Registration Flow Disabled"
                }
            },
            enableFlow: {
                genericError: {
                    description: "An error occurred while enabling the invited user registration flow.",
                    message: "Enable Invited User Registration Flow Error"
                },
                success: {
                    description: "Successfully enabled the invited user registration flow.",
                    message: "Invited User Registration Flow Enabled"
                }
            },
            fetchFlowConfig: {
                genericError: {
                    description: "An error occurred while fetching the invited user registration flow configuration.",
                    message: "Fetch Invited User Registration Flow Error"
                }
            }
        },
        tooltip: {
            disableFlow: "Click to disable the invited user registration flow",
            enableFlow: "Click to enable the invited user registration flow"
        }
    },
    core: {
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
                    title: "{{propertyKey}} translation",
                    tooltip: {
                        addNewTranslation: "Add a new translation",
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
            fallbackTextPreferenceFetch: {
                genericError: {
                    description: "An error occurred while fetching the fallback text preferences.",
                    message: "Fallback Text Preference Fetch Error"
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
        }
    },
    label: "Flows",
    passwordRecovery: {
        name: "Password Recovery Flow Builder",
        notifications: {
            disableFlow: {
                genericError: {
                    description: "An error occurred while disabling the password recovery flow.",
                    message: "Disable Password Recovery Flow Error"
                },
                success: {
                    description: "Successfully disabled the password recovery flow.",
                    message: "Password Recovery Flow Disabled"
                }
            },
            enableFlow: {
                genericError: {
                    description: "An error occurred while enabling the password recovery flow.",
                    message: "Enable Password Recovery Flow Error"
                },
                success: {
                    description: "Successfully enabled the password recovery flow.",
                    message: "Password Recovery Flow Enabled"
                }
            },
            fetchFlowConfig: {
                genericError: {
                    description: "An error occurred while fetching the password recovery flow configuration.",
                    message: "Fetch Password Recovery Flow Error"
                }
            }
        },
        tooltip: {
            disableFlow: "Click to disable the password recovery flow",
            enableFlow: "Click to enable the password recovery flow"
        }
    },
    registrationFlow: {
        breadcrumb: "Edit Registration Flow",
        notifications: {
            disableFlow: {
                genericError: {
                    description: "An error occurred while disabling the registration flow.",
                    message: "Disable Registration Flow Error"
                },
                success: {
                    description: "Successfully disabled the registration flow.",
                    message: "Registration Flow Disabled"
                }
            },
            enableFlow: {
                genericError: {
                    description: "An error occurred while enabling the registration flow.",
                    message: "Enable Registration Flow Error"
                },
                success: {
                    description: "Successfully enabled the registration flow.",
                    message: "Registration Flow Enabled"
                }
            },
            fetchFlowConfig: {
                genericError: {
                    description: "An error occurred while fetching the registration flow configuration.",
                    message: "Fetch Registration Flow Error"
                }
            }
        },
        steps: {
            emailConfirmation: "Email Confirmation"
        },
        tooltip: {
            disableFlow: "Click to disable the registration flow",
            enableFlow: "Click to enable the registration flow"
        }
    }
};
