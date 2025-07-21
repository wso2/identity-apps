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
        breadcrumb: "Edit Invite User Password Flow"
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
                        termsOfUseUrl: "Terms of Use URL"
                    },
                    urlTypeLabel: "URL Type"
                },
                placeholder: "Enter rich text content here..."
            }
        },
        errors: {
            flowMetadataFetch: {
                description: "An error occurred while fetching the flow metadata.",
                message: "Flow Metadata Fetch Error"
            }
        }
    },
    label: "Flows",
    passwordRecovery: {
        name: "Password Recovery Flow Builder"
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
        tooltip: {
            disableFlow: "Click to disable the registration flow",
            enableFlow: "Click to enable the registration flow"
        }
    }
};
