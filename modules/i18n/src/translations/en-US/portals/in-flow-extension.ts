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

import { inFlowExtensionNS } from "../../../models";

export const inFlowExtension: inFlowExtensionNS = {
    createWizard: {
        helpPanel: {
            encryption: {
                description: "Toggle the encryption switch on any field to encrypt its value " +
                    "before sending it to the extension endpoint. Encryption cascades " +
                    "to all child fields. The certificate must be uploaded in the Endpoint " +
                    "Configuration step.",
                heading: "Encryption"
            },
            expose: {
                description: "Select EXPOSE on a field to include it in the data sent to the " +
                    "extension. Selecting EXPOSE on a parent automatically exposes all its " +
                    "children. Conversely, exposing all children auto-selects the parent.",
                heading: "EXPOSE"
            },
            howToUse: {
                heading: "How to configure",
                step1: "Expand a tree node to see its children by clicking on it.",
                step2: "Hover over a row to see available operations (EXPOSE / MODIFY).",
                step3: "Click EXPOSE to share the field with your extension endpoint.",
                step4: "Click MODIFY on leaf fields to allow the extension to change them.",
                step5: "Toggle the ENC switch to encrypt sensitive values before sending.",
                step6: "Use + ADD ENTRY on map nodes to add custom keys at runtime."
            },
            operations: {
                description: "Select MODIFY on leaf fields to allow the extension endpoint to " +
                    "change their values. MODIFY is only available on leaf nodes (not " +
                    "containers) and does not propagate to parent or child nodes.",
                heading: "MODIFY"
            },
            whatIsContext: {
                description: "The flow execution context is the data available during an " +
                    "authentication flow. It includes user attributes, claims, flow " +
                    "metadata, graph state, user inputs, and custom properties. Use this " +
                    "tree to control exactly which data is exposed to and modifiable by " +
                    "your extension endpoint.",
                heading: "What is the Flow Execution Context?"
            }
        },
        steps: {
            accessConfig: {
                encrypted: "Encrypted",
                encryption: {
                    heading: "Encryption Certificate",
                    hint: "Provide a Base64-encoded PEM certificate used to encrypt sensitive " +
                        "data before sending it to the extension endpoint."
                },
                expose: {
                    add: "Add Path",
                    heading: "Expose Paths",
                    hint: "Define the paths that should be exposed from the authentication " +
                        "flow to the extension endpoint."
                },
                operations: {
                    addOperation: "Add Operation",
                    addPath: "Add Path",
                    heading: "Allowed Operations",
                    hint: "Define the operations that the extension endpoint is allowed to " +
                        "perform on the authentication flow.",
                    types: {
                        add: {
                            description: "Paths the extension can add new values to.",
                            heading: "ADD"
                        },
                        remove: {
                            description: "Paths the extension can remove values from.",
                            heading: "REMOVE"
                        },
                        replace: {
                            description: "Paths the extension can replace existing values in.",
                            heading: "REPLACE"
                        }
                    }
                },
                title: "Access Configuration"
            },
            endpointConfig: {
                authProperties: {
                    accessToken: {
                        label: "Access Token",
                        placeholder: "Access Token",
                        validations: {
                            required: "Access token is required."
                        }
                    },
                    header: {
                        label: "Header",
                        placeholder: "Header",
                        validations: {
                            invalid: "Header must be a valid HTTP header name.",
                            required: "Header is required."
                        }
                    },
                    password: {
                        label: "Password",
                        placeholder: "Password",
                        validations: {
                            required: "Password is required."
                        }
                    },
                    username: {
                        label: "Username",
                        placeholder: "Username",
                        validations: {
                            required: "Username is required."
                        }
                    },
                    value: {
                        label: "Value",
                        placeholder: "Value",
                        validations: {
                            required: "Value is required."
                        }
                    }
                },
                authenticationType: {
                    hint: "Once added, these secrets will not be displayed. " +
                        "You will only be able to reset them.",
                    label: "Authentication Scheme",
                    placeholder: "Select Authentication Type",
                    title: "Endpoint Authentication",
                    validations: {
                        required: "Authentication type is required."
                    }
                },
                certificate: {
                    hint: "Upload or paste the external service's PEM certificate. " +
                        "This is used to encrypt sensitive data before sending it to the extension endpoint.",
                    title: "Service Certificate"
                },
                endpoint: {
                    hint: "The URL of the external endpoint that this extension will call.",
                    label: "Endpoint URL",
                    placeholder: "https://extension.example.com/handle",
                    validations: {
                        empty: "Endpoint URL is required.",
                        general: "Please enter a valid URL."
                    }
                },
                title: "Endpoint Configuration"
            },
            generalSettings: {
                description: {
                    label: "Description",
                    placeholder: "A brief description of the in-flow extension.",
                    validations: {
                        maxLength: "Description must not exceed 255 characters."
                    }
                },
                name: {
                    hint: "A unique name for this in-flow extension. " +
                        "Must be alphanumeric and can include spaces, hyphens, and underscores.",
                    label: "Name",
                    placeholder: "My In-Flow Extension",
                    validations: {
                        duplicate: "An action with this name already exists. Please choose a different name.",
                        invalid: "Name must start with an alphanumeric character and can only " +
                            "contain alphanumeric characters, spaces, hyphens, and underscores."
                    }
                },
                title: "General Settings"
            }
        },
        subTitle: "Create a new In-Flow Extension to customize the authentication flow.",
        title: "Create In-Flow Extension"
    },
    notifications: {
        createError: {
            message: "Create error"
        },
        createGenericError: {
            description: "An error occurred while creating the in-flow extension.",
            message: "Something went wrong"
        },
        createSuccess: {
            description: "Successfully created the in-flow extension.",
            message: "Create successful"
        }
    }
};
