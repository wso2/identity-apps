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

export interface flowExtensionNS {
    createWizard: {
        steps: {
            generalSettings: {
                title: string;
                name: {
                    label: string;
                    placeholder: string;
                    hint: string;
                    validations: {
                        invalid: string;
                    };
                };
                description: {
                    label: string;
                    placeholder: string;
                    validations: {
                        maxLength: string;
                    };
                };
            };
            endpointConfig: {
                title: string;
            };
        };
    };
    notifications: {
        createSuccess: {
            message: string;
            description: string;
        };
        createError: {
            message: string;
        };
        createGenericError: {
            message: string;
            description: string;
        };
    };
    properties: {
        description: string;
        connectionLabel: string;
        connectionPlaceholder: string;
        noConnectionsWarning: string;
        noConnectionsWarningWithSupport: string;
    };
}
