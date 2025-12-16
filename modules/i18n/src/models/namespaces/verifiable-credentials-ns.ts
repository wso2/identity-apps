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

export interface VerifiableCredentialsNS {
    page: {
        title: string;
        heading: string;
        description: string;
    };
    buttons: {
        addTemplate: string;
    };
    placeholders: {
        emptyList: {
            title: string;
            subtitle: string;
        };
        emptySearch: {
            title: string;
            subtitle: string;
        };
    };
    list: {
        columns: {
            name: string;
            identifier: string;
            actions: string;
        };
        search: {
            placeholder: string;
            filterAttributePlaceholder: string;
            filterConditionsPlaceholder: string;
            filterValuePlaceholder: string;
            attributes: {
                identifier: string;
                displayName: string;
            };
        };
        confirmations: {
            deleteItem: {
                header: string;
                message: string;
                content: string;
                assertionHint: string;
            };
        };
    };
    wizard: {
        title: string;
        subtitle: string;
        form: {
            identifier: {
                label: string;
                placeholder: string;
                hint: string;
                validation: string;
            };
            displayName: {
                label: string;
                placeholder: string;
                hint: string;
            };
            submitButton: string;
        };
    };
    editPage: {
        title: string;
        backButton: string;
        form: {
            displayName: {
                label: string;
                placeholder: string;
                hint: string;
            };
            identifier: {
                label: string;
                hint: string;
            };
            expiresIn: {
                label: string;
                placeholder: string;
                hint: string;
            };
            claims: {
                label: string;
                placeholder: string;
                hint: string;
            };
        };
        dangerZone: {
            header: string;
            delete: {
                header: string;
                subheader: string;
                actionTitle: string;
            };
        };
        confirmations: {
            deleteTemplate: {
                header: string;
                message: string;
                content: string;
                assertionHint: string;
            };
        };
    };
    notifications: {
        fetchClaims: {
            error: {
                message: string;
                description: string;
            };
        };
        deleteTemplate: {
            success: {
                message: string;
                description: string;
            };
            error: {
                message: string;
                description: string;
            };
        };
        fetchTemplates: {
            error: {
                message: string;
                description: string;
            };
        };
        fetchTemplate: {
            error: {
                message: string;
                description: string;
            };
        };
        createTemplate: {
            success: {
                message: string;
                description: string;
            };
            error: {
                message: string;
                description: string;
            };
            duplicateError: {
                message: string;
                description: string;
            };
        };
        updateTemplate: {
            success: {
                message: string;
                description: string;
            };
            error: {
                message: string;
                description: string;
            };
        };
    };
}
