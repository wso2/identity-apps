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
                client_credential: {
                    name: "Client Credential",
                    properties: {
                        tokenEndpoint: {
                            label: "Token Endpoint",
                            placeholder: "Token Endpoint",
                            validations: {
                                empty: "Token Endpoint is a required field."
                            }
                        },
                        clientId: {
                            label: "Client ID",
                            placeholder: "Client ID",
                            validations: {
                                empty: "Client ID is a required field."
                            }
                        },
                        clientSecret: {
                            label: "CLient Secret",
                            placeholder: "Client Secret",
                            validations: {
                                empty: "Client Secret is a required field."
                            }
                        }
                    }
                }
            }
        },
        authenticationType: {
            hint: {
                create: "Once added, these secrets will not be displayed. You will only be able to reset them.",
                update: "Once updated, these secrets will not be displayed. You will only be able to reset them again."
            },
            label: "Authentication Scheme",
            placeholder: "Select Authentication Scheme",
            validations: {
                empty: "Authentication Scheme is a required field."
            }
        },
        authenticationTypeDropdown: {
            authProperties: {
                clientId: {
                    label: "Client Id",
                    placeholder: "Client Id",
                    validations: {
                        required: "Client Id is a required field."
                    }
                },
                clientSecret: {
                    label: "Client Secret",
                    placeholder: "Client Secret",
                    validations: {
                        required: "Client Secret is a required field."
                    }
                },
                tokenEndpoint: {
                    label: "Token Endpoint",
                    placeholder: "Token Endpoint",
                    validations: {
                        required: "Token Endpoint is a required field."
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
                }
            },
            hint: "Once added, these secrets will not be displayed. You will only be able to reset them.",
            label: "Authentication Type",
            placeholder: "Select Authentication Type",
            title: "Authentication Scheme",
            validations: {
                required: "Authentication Type is a required field."
            }
        }
    }
}
