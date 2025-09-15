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

import { EmailProviderNS } from "../../../models/namespaces/email-providers-ns";

export const emailProviders: EmailProviderNS = {
    fields: {
        authentication: {
            info: {
                message: "If you are changing the authentication, be aware that the authentication" +
                " secrets of the external endpoint need to be updated.",
                title: "<strong>{{ authType }}</strong> authentication scheme is configured."
            },
            label: "Authentication",
            types: {
                basic: {
                    name: "Basic",
                    properties: {
                        password: {
                            label: "Password",
                            placeholder: "Password",
                            validations: {
                                empty: "Password is a required field."
                            }
                        },
                        username: {
                            label: "Username",
                            placeholder: "Username",
                            validations: {
                                empty: "Username is a required field."
                            }
                        }
                    }
                },
                clientCredential: {
                    name: "Client Credential",
                    properties: {
                        clientID: {
                            label: "Client ID",
                            placeholder: "Client ID",
                            validations: {
                                empty: "Client id is a required field."
                            }
                        },
                        clientSecret: {
                            label: "Client Secret",
                            placeholder: "Client Secret",
                            validations: {
                                empty: "Client secret is a required field."
                            }
                        },
                        scopes: {
                            label: "Scopes",
                            placeholder: "Scopes",
                            validations: {
                                empty: "Scopes is a required field."
                            }
                        },
                        tokenEndpoint: {
                            label: "Token Endpoint",
                            placeholder: "Token Endpoint",
                            validations: {
                                empty: "Token endpoint is a required field."
                            }
                        }
                    }
                }
            }
        },
        authenticationType: {
            hint: {
                create: "Once added, these secrets will not be displayed. You will only be able to reset them.",
                update: "Once updated, these secrets will not be displayed. You will only be able to reset them."
            },
            label: "Authentication",
            placeholder: "Select authentication scheme",
            validations: {
                empty: "Authentication Scheme is a required field."
            }
        },
        authenticationTypeDropdown: {
            authProperties: {
                clientID: {
                    label: "Client ID",
                    placeholder: "Client ID",
                    validations: {
                        required: "Client ID is a required field."
                    }
                },
                clientSecret: {
                    label: "Client Secret",
                    placeholder: "Client Secret",
                    validations: {
                        required: "Client Secret is a required field."
                    }
                },
                password: {
                    label: "Password",
                    placeholder: "Password",
                    validations: {
                        required: "Password is a required field."
                    }
                },
                scopes: {
                    label: "Scopes",
                    placeholder: "Scopes",
                    validations: {
                        required: "Scopes is a required field."
                    }
                },
                tokenEndpoint: {
                    label: "Token Endpoint",
                    placeholder: "Token Endpoint",
                    validations: {
                        required: "Token Endpoint is a required field."
                    }
                },
                username: {
                    label: "Username",
                    placeholder: "Username",
                    validations: {
                        required: "Username is a required field."
                    }
                }
            },
            hint: {
                create: "Once added, these secrets will not be displayed. You will only be able to reset them.",
                update: "Once updated, these secrets will not be displayed. You will only be able to reset them again."
            },
            label: "Authentication Scheme",
            placeholder: "Select authentication scheme",
            title: "Authentication",
            validations: {
                required: "Authentication Scheme is a required field."
            }
        }
    },
    showPassword: {
        alert: {
            content: "The password will no longer be visible on the configuration page from 15th June 2025 onwards." ,
            title: "Notice"
        }
    }
};
