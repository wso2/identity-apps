/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

export interface emailTemplateTypesNS {
    advancedSearch: {
        form: {
            inputs: {
                filterAttribute: {
                    placeholder: string;
                };
                filterCondition: {
                    placeholder: string;
                };
                filterValue: {
                    placeholder: string;
                };
            };
        };
        placeholder: string;
        error: string;
    };
    buttons: {
        createTemplateType: string;
        deleteTemplate: string;
        editTemplate: string;
        newType: string;
    };
    confirmations: {
        deleteTemplateType: {
            assertionHint: string;
            header: string;
            message: string;
            content: string;
        };
    };
    forms: {
        addTemplateType: {
            fields: {
                type: {
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                    };
                };
            };
        };
    };
    list: {
        actions: string;
        name: string;
    };
    notifications: {
        deleteTemplateType: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        getTemplateTypes: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        updateTemplateType: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        createTemplateType: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
    };
    placeholders: {
        emptySearch: {
            action: string;
            title: string;
            subtitles: string;
        };
        emptyList: {
            action: string;
            title: string;
            subtitles: {
                0: string;
                1: string;
                2: string;
            };
        };
    };
    wizards: {
        addTemplateType: {
            heading: string;
            subHeading: string;
            steps: {
                templateType: {
                    heading: string;
                };
            };
        };
    };
}
