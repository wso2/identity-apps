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
export interface LoginFlowNS {
    adaptiveLoginFlowSelectConfirmationModal: {
        content: string;
        heading: string;
        message: string;
    };
    basicLoginFlowSelectConfirmationModal: {
        content: string;
        heading: string;
        message: string;
    };
    options: {
        controls: {
            remove: string;
        };
        displayName: string;
        divider: string;
    };
    modes: {
        legacy: {
            label: string;
        };
        visual: {
            label: string;
        };
        switchConfirmationModal: {
            assertionHint: string;
            content: string;
            primaryActionButtonText: string;
            secondaryActionButtonText: string;
            title: string;
            warningMessage: string;
        };
    };
    nodes: {
        controls: {
            attributeSelector: {
                label: string;
            };
            enableBackupCodes: {
                label: string;
            };
            userAttributeSelector: {
                label: string;
            };
        };
        emailOTP: {
            controls: {
                optionRemoveTooltipContent: string;
            };
            form: {
                actions: {
                    primary: string;
                    secondary: string;
                };
                fields: {
                    code: {
                        label: string;
                        placeholder: string;
                    };
                };
            };
            header: string;
        };
        identifierFirst: {
            controls: {
                optionRemoveTooltipContent: string;
                optionSwitchTooltipContent: string;
            };
            form: {
                actions: {
                    primary: string;
                };
                fields: {
                    rememberMe: {
                        label: string;
                    };
                    username: {
                        label: string;
                        placeholder: string;
                    };
                };
            };
            header: string;
        };
        signIn: {
            controls: {
                optionRemoveTooltipContent: string;
                optionSwitchTooltipContent: string;
            };
            form: {
                actions: {
                    primary: string;
                };
                fields: {
                    password: {
                        label: string;
                        placeholder: string;
                    };
                    rememberMe: {
                        label: string;
                    };
                    username: {
                        label: string;
                        placeholder: string;
                    };
                };
            };
            header: string;
        };
        smsOTP: {
            controls: {
                optionRemoveTooltipContent: string;
            };
            form: {
                actions: {
                    primary: string;
                    secondary: string;
                };
                fields: {
                    code: {
                        label: string;
                        placeholder: string;
                    };
                };
            };
            header: string;
        };
        totp: {
            controls: {
                optionRemoveTooltipContent: string;
            };
            form: {
                actions: {
                    primary: string;
                };
                fields: {
                    code: {
                        label: string;
                        placeholder: string;
                    };
                };
                help: string;
            };
            header: string;
        };
        activeSessionsLimit: {
            controls: {
                optionRemoveTooltipContent: string;
            };
            form: {
                sessions: {
                    browserLabel: string;
                    lastAccessedLabel: string;
                };
                help: string;
            };
            header: string;
        };
    };
    revertConfirmationModal: {
        assertionHint: string;
        content: string;
        primaryActionButtonText: string;
        secondaryActionButtonText: string;
        title: string;
        warningMessage: string;
    };
    steps: {
        controls: {
            addOption: string;
            remove: string;
            signUp: {
                hint: string;
                label: string;
            };
        };
    };
    predefinedFlows: {
        adaptive: {
            actions: {
                add: string;
            };
            header: string;
        };
        authenticators: {
            apple: {
                displayName: string;
            };
            facebook: {
                displayName: string;
            };
            github: {
                displayName: string;
            };
            google: {
                displayName: string;
            };
            microsoft: {
                displayName: string;
            };
        };
        basic: {
            header: string;
        };
        categories: {
            basic: {
                label: string;
            };
            mfa: {
                label: string;
            };
            passwordless: {
                label: string;
            };
            social: {
                label: string;
            };
        };
        header: string;
        panelHeader: string;
    };
    scriptEditor: {
        panelHeader: string;
        secretSelector: {
            actions: {
                create: {
                    label: string;
                };
            };
            emptyPlaceholder: {
                header: string;
                description: string;
            };
            label: string;
        };
        themes: {
            dark: {
                label: string;
            };
            highContrast: {
                label: string;
            };
            light: {
                label: string;
            };
        };
    };
    visualEditor: {
        actions: {
            revert: {
                label: string;
            };
            update: {
                label: string;
            };
        };
    };
}
