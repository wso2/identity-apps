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

export interface AgentsNS {
    title: string;
    pageTitle: string;
    description: string;
    new: {
        action: {
            title: string;
        },
        fields: {
            name: {
                label: string;
            };
            description: {
                label: string;
                placeholder: string;
            };
        };
        alerts: {
            success: {
                message: string;
                description: string;
            };
        };
        title: string;
    };
    list: {
        featureUnavailable: {
            subtitle: {
                0: string;
                1: {
                    onprem: string;
                    saas: string;
                };

            };
            title: string;
        };
    };
    edit: {
        credentials: {
            title: string;
            regenerate: {
                alerts: {
                    error: {
                        description: string;
                        message: string;
                    };
                };
            };
            subtitle: string;
        };
        general: {
            title: string;
            fields: {
                name: {
                    label: string;
                };
                description: {
                    label: string;
                    placeholder: string;
                };
                languageModal: {
                    label: string;
                };
            };
        };
        roles: {
            title: string;
            subtitle: string;
        };
    };
}
