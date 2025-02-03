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

import { customAuthenticationNS } from "../../../models";

export const customAuthentication: customAuthenticationNS = {
    fields: {
        createWizard: {
            authenticationTypeStep: {
                externalAuthenticationCard: {
                    examples: "E.g., Social Login, Enterprise IdP",
                    header: "External (Federated) User Authentication",
                    mainDescription: "Authenticate and provision federated users."
                },
                internalUserAuthenticationCard: {
                    examples: "E.g., Username & Password, Email OTP",
                    header: "Internal User Authentication",
                    mainDescription: "Collect identifier and authenticate user accounts managed in the organization."
                },
                label: "Select the authentication type you are implementing",
                title: "Authentication Type",
                twoFactorAuthenticationCard: {
                    examples: "E.g., TOTP",
                    header: "2FA Authentication",
                    mainDescription: "Only verify users in a second or later step in the login flow."
                }
            },
            configurationsStep: {
                authenticationTypeDropdown: {
                    authProperties: {
                        accessToken: {
                            label: "Access token",
                            placeholder: "Access Token",
                            validations: {
                                required: "Access Token is a required field."
                            }
                        },
                        header: {
                            label: "Header",
                            placeholder: "Header",
                            validations: {
                                invalid: "Please choose a valid header name that adheres to the given guidelines.",
                                required: "Header is a required field."
                            }
                        },
                        password: {
                            label: "Password",
                            placeholder: "Password",
                            validations: {
                                required: "Password is a required field."
                            }
                        },
                        username: {
                            label: "Username",
                            placeholder: "Username",
                            validations: {
                                required: "Username is a required field."
                            }
                        },
                        value: {
                            label: "Value",
                            placeholder: "Value",
                            validations: {
                                required: "Value is a required field."
                            }
                        }
                    },
                    hint: "Once added, these secrets will not be displayed. You will only be able to reset them.",
                    label: "Authentication Scheme",
                    placeholder: "Select Authentication Type",
                    title: "Endpoint Authentication",
                    validations: {
                        required: "Authentication Type is a required field."
                    }
                },
                endpoint: {
                    hint: "The URL of the configured external endpoint to integrate with the authenticator",
                    label: "Endpoint",
                    placeholder: "https://auth.service.example.com/authenticate",
                    validations: {
                        empty: "Empty endpoint URI",
                        general: "Please enter a valid URL.",
                        invalid: "The entered URL is not HTTPS. Please add a valid URL."
                    }
                },
                title: "Configuration"
            },
            generalSettingsStep: {
                displayName: {
                    label: "Display Name",
                    placeholder: "Authenticator Display Name",
                    validations: {
                        empty: "",
                        invalid: "Invalid Display Name"
                    }
                },
                helpPanel: {
                    displayName: {
                        description: "Provide a meaningful name to display in login pages and login flow editor.",
                        header: "Display Name"
                    },
                    identifier: {
                        description: "Provide a unique name to refer in authentication scripts and " +
                        "authentication parameters.",
                        header: "Identifier",
                        note: "Note that <1>custom-</1> will be prefixed to the identifier.",
                        warning: "This field should be unique; once created, it is not editable. "
                    }
                },
                identifier: {
                    hint: "Must be a string containing only letters (a-z, A-Z) numbers (0-9), " +
                    "underscore (_) and hyphen (-). ",
                    label: "Identifier",
                    placeholder: "Authenticator Identifier",
                    validations: {
                        empty: "",
                        invalid: "Invalid Identifier"
                    }
                },
                title: "General Settings"
            },
            subTitle: "Register externally implemented authentication service.",
            title: "Custom Authentication"
        }
    }
};
