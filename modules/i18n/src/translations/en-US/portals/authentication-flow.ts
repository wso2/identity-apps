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
import { AuthenticationFlowNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */

export const authenticationFlow: AuthenticationFlowNS = {
    adaptiveLoginFlowSelectConfirmationModal: {
        content: "The selected template will replace the existing script in the editor as well as the login steps you configured. Click <1>Confirm</1> to proceed.",
        heading: "Are you sure?",
        message: "This action is irreversible."
    },
    basicLoginFlowSelectConfirmationModal: {
        content: "The selected template will replace the existing login steps you configured. Click <1>Confirm</1> to proceed.",
        heading: "Are you sure?",
        message: "This action is irreversible."
    },
    options: {
        controls: {
            remove: "Remove"
        },
        displayName: "Sign In With {{displayName}}",
        divider: "OR"
    },
    modes: {
        legacy: {
            label: "Classic Editor"
        },
        visual: {
            label: "Visual Editor"
        },
        switchConfirmationModal: {
            assertionHint: "Yes, I understand. I want to switch.",
            content: "This action is irreversible and you will permanently loose the unsaved changes in the current flow.",
            primaryActionButtonText: "Confirm",
            secondaryActionButtonText: "Cancel",
            title: "Are you sure?",
            warningMessage: "If you switch to the <1>{{mode}}</1>, you will loose the unsaved changes in the current flow. Please proceed with caution."
        }
    },
    nodes: {
        controls: {
            attributeSelector: {
                label: "Pick attributes from this step"
            },
            enableBackupCodes: {
                label: "Enable backup codes"
            },
            userAttributeSelector: {
                label: "Pick user identifier from this step"
            }
        },
        emailOTP: {
            controls: {
                optionRemoveTooltipContent: "Remove"
            },
            form: {
                actions: {
                    primary: "Continue",
                    secondary: "Resend Code"
                },
                fields: {
                    code: {
                        label: "Enter the code sent to your email ID (john*****@gmail.com)",
                        placeholder: ""
                    }
                }
            },
            header: "OTP Verification"
        },
        identifierFirst: {
            controls: {
                optionRemoveTooltipContent: "Remove",
                optionSwitchTooltipContent: "Switch to Username & Password"
            },
            form: {
                actions: {
                    primary: "Sign In"
                },
                fields: {
                    rememberMe: {
                        label: "Remember me on this computer"
                    },
                    username: {
                        label: "Username",
                        placeholder: "Enter your username"
                    }
                }
            },
            header: "Sign in"
        },
        signIn: {
            controls: {
                optionRemoveTooltipContent: "Remove",
                optionSwitchTooltipContent: "Switch to Identifier First"
            },
            form: {
                actions: {
                    primary: "Sign In"
                },
                fields: {
                    password: {
                        label: "Password",
                        placeholder: "Enter your password"
                    },
                    rememberMe: {
                        label: "Remember me on this computer"
                    },
                    username: {
                        label: "Username",
                        placeholder: "Enter your username"
                    }
                }
            },
            header: "Sign in"
        },
        smsOTP: {
            controls: {
                optionRemoveTooltipContent: "Remove"
            },
            form: {
                actions: {
                    primary: "Continue",
                    secondary: "Resend Code"
                },
                fields: {
                    code: {
                        label: "Enter the code sent to your mobile phone (******3830)",
                        placeholder: ""
                    }
                }
            },
            header: "OTP Verification"
        },
        totp: {
            controls: {
                optionRemoveTooltipContent: "Remove"
            },
            form: {
                actions: {
                    primary: "Continue"
                },
                fields: {
                    code: {
                        label: "Enter the verification code generated by your authenticator app.",
                        placeholder: ""
                    }
                },
                help: "Haven't setup your TOTP authenticator yet? Contact support"
            },
            header: "Verify Your Identity"
        },
        activeSessionsLimit: {
            controls: {
                optionRemoveTooltipContent: "Remove"
            },
            form: {
                sessions: {
                    browserLabel: "Browser",
                    lastAccessedLabel: "Last Accessed"
                },
                help: "Terminate active sessions to continue."
            },
            header: "Multiple Active Sessions Found"
        }
    },
    revertConfirmationModal: {
        assertionHint: "Yes, I understand. I want to revert.",
        content: "This action is irreversible and you will permanently loose the progress you have made.",
        primaryActionButtonText: "Confirm",
        secondaryActionButtonText: "Cancel",
        title: "Are you sure?",
        warningMessage: "If you revert back to default, you will not be able to recover the progress. Please proceed with caution."
    },
    steps: {
        controls: {
            addOption: "Add Sign In Option",
            remove: "Remove",
            signUp: {
                hint: "Don't have an account?",
                label: "Sign up"
            }
        }
    },
    predefinedFlows: {
        adaptive: {
            actions: {
                add: "ADD"
            },
            header: "Conditional Login Flows"
        },
        authenticators: {
            apple: {
                displayName: "Apple"
            },
            facebook: {
                displayName: "Facebook"
            },
            github: {
                displayName: "GitHub"
            },
            google: {
                displayName: "Google"
            },
            microsoft: {
                displayName: "Microsoft"
            }
        },
        basic: {
            header: "Basic Login Flows"
        },
        categories: {
            basic: {
                label: "Add Basic Login"
            },
            mfa: {
                label: "Add Multi-factor Login"
            },
            passwordless: {
                label: "Add Passwordless Login"
            },
            social: {
                label: "Add Social Login"
            }
        },
        header: "Predefined Flows",
        panelHeader: "Predefined Flows"
    },
    scriptEditor: {
        panelHeader: "Script Editor",
        secretSelector: {
            actions: {
                create: {
                    label: "Create New Secret"
                }
            },
            emptyPlaceholder: {
                header: "No secrets available.",
                description: "Securely store access keys as secrets. A secret can replace the consumer secret in <1>callChoreo()</1> function in the conditional authentication scripts."
            },
            label: "Add Secret"
        },
        themes: {
            dark: {
                label: "Dark (Visual Studio)"
            },
            highContrast: {
                label: "High Contrast"
            },
            light: {
                label: "Light (Visual Studio)"
            }
        }
    },
    visualEditor: {
        actions: {
            revert: {
                label: "Revert to default"
            },
            update: {
                label: "Update"
            }
        }
    }
};
