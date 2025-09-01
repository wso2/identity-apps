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

export interface flowsNS {
    askPassword: {
        banner: {
            description: string;
            title: string;
        };
        breadcrumb: string;
        labels: {
            disableFlow: string;
            enableFlow: string;
        };
        notifications: {
            disableFlow: {
                genericError: {
                    description: string;
                    message: string;
                };
                success: {
                    description: string;
                    message: string;
                };
            };
            enableFlow: {
                genericError: {
                    description: string;
                    message: string;
                };
                success: {
                    description: string;
                    message: string;
                };
            };
            fetchFlowConfig: {
                genericError: {
                    description: string;
                    message: string;
                };
            };
        };
        tooltip: {
            disableFlow: string;
            enableFlow: string;
        };
    };
    core: {
        elements: {
            richText: {
                linkEditor: {
                    placeholder: string;
                    predefinedUrls: {
                        applicationAccessUrl: string;
                        callbackOrApplicationAccessUrl: string;
                        customUrl: string;
                        supportEmail: string;
                        privacyPolicyUrl: string;
                        termsOfUseUrl: string;
                    };
                    urlTypeLabel: string;
                };
                placeholder: string;
            };
            textPropertyField: {
                i18nCard: {
                    chip: {
                        commonScreen: {
                            label: string;
                        };
                    };
                    commonKeyWarning: string;
                    configure: string;
                    createTitle: string;
                    i18nKey: string;
                    i18nKeyInputHint: string;
                    i18nKeyInputPlaceholder: string;
                    language: string;
                    languageText: string;
                    languageTextPlaceholder: string;
                    selectI18nKey: string;
                    selectLanguage: string;
                    title: string;
                    tooltip: {
                        addNewTranslation: string;
                        commonKeyTooltip: string;
                        editExistingTranslation: string;
                    };
                    updateTitle: string;
                };
                placeholder: string;
                tooltip: {
                    configureTranslation: string;
                    enableBrandingRequired: string;
                };
            };
        };
        executions: {
            names: {
                apple: string;
                confirmationCode: string;
                default: string;
                facebook: string;
                github: string;
                google: string;
                microsoft: string;
                passkeyEnrollment: string;
                magicLink: string;
            };
        };
        notificationPanel: {
            emptyMessages: {
                errors: string;
                info: string;
                warnings: string;
            };
            header: string;
            tabs: {
                errors: string;
                info: string;
                warnings: string;
            };
        };
        notifications: {
            brandingPreferenceFetch: {
                genericError: {
                    description: string;
                    message: string;
                };
            };
            customTextPreferenceMetaFetch: {
                genericError: {
                    description: string;
                    message: string;
                };
            };
            fallbackTextPreferenceFetch: {
                genericError: {
                    description: string;
                    message: string;
                };
            };
            flowConfigsFetch: {
                genericError: {
                    description: string;
                    message: string;
                };
            };
            flowMetadataFetch: {
                genericError: {
                    description: string;
                    message: string;
                };
            };
            textPreferenceFetch: {
                genericError: {
                    description: string;
                    message: string;
                };
            };
            updateI18nKey: {
                genericError: {
                    description: string;
                    message: string;
                };
                success: {
                    description: string;
                    message: string;
                };
            };
        };
        validation: {
            fields: {
                button: {
                    action: string;
                    general: string;
                    text: string;
                    variant: string;
                };
                checkbox: {
                    general: string;
                    identifier: string;
                    label: string;
                };
                divider: {
                    general: string;
                    variant: string;
                };
                image: {
                    general: string;
                    src: string;
                    variant: string;
                };
                input: {
                    general: string;
                    identifier: string;
                    label: string;
                };
                otpInput: {
                    general: string;
                    label: string;
                };
                phoneNumberInput: {
                    general: string;
                    identifier: string;
                    label: string;
                };
                richText: {
                    general: string;
                    text: string;
                };
                typography: {
                    general: string;
                    text: string;
                    variant: string;
                };
            };
        };
        validationStatusLabels: {
            error: string;
            errors: string;
            info: string;
            warning: string;
            warnings: string;
        };
    };
    label?: string;
    passwordRecovery: {
        banner: {
            description: string;
            title: string;
        };
        labels: {
            disableFlow: string;
            enableFlow: string;
        };
        name: string;
        notifications: {
            disableFlow: {
                genericError: {
                    description: string;
                    message: string;
                };
                success: {
                    description: string;
                    message: string;
                };
            };
            enableFlow: {
                genericError: {
                    description: string;
                    message: string;
                };
                success: {
                    description: string;
                    message: string;
                };
            };
            fetchFlowConfig: {
                genericError: {
                    description: string;
                    message: string;
                };
            };
        };
        tooltip: {
            disableFlow: string;
            enableFlow: string;
        };
    };
    registrationFlow: {
        breadcrumb: string;
        labels: {
            disableFlow: string;
            enableFlow: string;
        };
        notifications: {
            disableFlow: {
                genericError: {
                    description: string;
                    message: string;
                };
                success: {
                    description: string;
                    message: string;
                };
            };
            enableFlow: {
                genericError: {
                    description: string;
                    message: string;
                };
                success: {
                    description: string;
                    message: string;
                };
            };
            fetchFlowConfig: {
                genericError: {
                    description: string;
                    message: string;
                };
            };
        };
        steps: {
            emailConfirmation: string;
        };
        tooltip: {
            disableFlow: string;
            enableFlow: string;
        };
    };
}
