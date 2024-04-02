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
export interface SecretsNS {
    advancedSearch: {
        form: {
            inputs: {
                filterAttribute: {
                    placeholder: string;
                };
                filterCondition: {
                    placeholder: string;
                };
                filterValue: {
                    placeholder: string;
                };
            };
        };
        placeholder: string;
    };
    page: {
        title: string;
        description: string;
        primaryActionButtonText: string;
        subFeatureBackButton: string;
    };
    errors: {
        generic: {
            message: string;
            description: string;
        };
    };
    routes: {
        name: string;
        category: string;
        sidePanelChildrenNames: string[];
    };
    alerts: {
        createdSecret: {
            description: string;
            message: string;
        };
        updatedSecret: {
            description: string;
            message: string;
        };
        deleteSecret: {
            description: string;
            message: string;
        };
    };
    modals: {
        deleteSecret: {
            assertionHint: string;
            primaryActionButtonText: string;
            secondaryActionButtonText: string;
            title: string;
            content: string;
            warningMessage: string;
        };
    };
    wizards: {
        addSecret: {
            heading: string;
            subheading: string;
            form: {
                secretTypeField: Record<string, string>;
                secretNameField: Record<string, string>;
                secretValueField: Record<string, string>;
                secretDescriptionField: Record<string, string>;
            };
        };
        actions: {
            createButton: {
                label: string;
                ariaLabel: string;
            };
            cancelButton: {
                label: string;
                ariaLabel: string;
            };
        };
    };
    banners: {
        secretIsHidden: {
            title: string;
            content: string;
        };
        adaptiveAuthSecretType: {
            title: string;
            content: string;
        };
    };
    forms: {
        editSecret: {
            page: {
                description: string;
            };
            secretValueField: Record<string, string>;
            secretDescriptionField: Record<string, string>;
        };
        actions: {
            submitButton: {
                label: string;
                ariaLabel: string;
            };
        };
    };
    emptyPlaceholders: {
        resourceNotFound: {
            messages: string[];
        };
        emptyListOfSecrets: {
            messages: string[];
        };
        buttons: {
            backToSecrets: {
                label: string;
                ariaLabel: string;
            };
            addSecret: {
                label: string;
                ariaLabel: string;
            };
        };
    };
}
