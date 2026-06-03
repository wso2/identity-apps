/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { flowExtensionNS } from "../../../models";

export const flowExtension: flowExtensionNS = {
    createWizard: {
        steps: {
            endpointConfig: {
                title: "Endpoint Configuration"
            },
            generalSettings: {
                description: {
                    label: "Description",
                    placeholder: "Enter a description for the flow extension.",
                    validations: {
                        maxLength: "The description cannot exceed 255 characters."
                    }
                },
                name: {
                    hint: "Enter a unique name to identify this flow extension.",
                    label: "Name",
                    placeholder: "Enter a name for the flow extension.",
                    validations: {
                        invalid: "Please enter a valid name. It must start with an alphanumeric character and"
                            + " can contain letters, numbers, spaces, hyphens and underscores (max 255 characters)."
                    }
                },
                title: "General Settings"
            }
        }
    },
    notifications: {
        createError: {
            message: "Flow Extension Creation Error"
        },
        createGenericError: {
            description: "An error occurred while creating the flow extension.",
            message: "Flow Extension Creation Error"
        },
        createSuccess: {
            description: "Successfully created the flow extension.",
            message: "Creation Successful"
        }
    },
    properties: {
        connectionLabel: "Connection",
        connectionPlaceholder: "Select a connection",
        description: "Select an flow extension to link with this flow step.",
        noConnectionsWarning: "No active flow extensions available. You can create a flow extension connection using the {{productName}} APIs.",
        noConnectionsWarningWithSupport: "No active flow extensions available. You can create a flow extension connection using the {{productName}} APIs. Please contact <1>{{productName}} support</1> to get started."
    }
};
