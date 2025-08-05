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
        breadcrumb: string;
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
            }
        };
        errors: {
            flowMetadataFetch: {
                description: string;
                message: string;
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
    };
    label?: string;
    passwordRecovery: {
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
