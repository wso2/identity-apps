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

export interface emailTemplatesNS {
    buttons: {
        newTemplate: string;
        viewTemplate: string;
        createTemplateType: string;
        deleteTemplate: string;
        editTemplate: string;
        newType: string;
    };
    confirmations: {
        deleteTemplate: {
            assertionHint: string;
            header: string;
            message: string;
            content: string;
        };
        deleteTemplateType: {
            assertionHint: string;
            header: string;
            message: string;
            content: string;
        };
    };
    editor: {
        tabs: {
            code: {
                tabName: string;
            };
            preview: {
                tabName: string;
            };
        };
    };
    list: {
        actions: string;
        name: string;
    };
    notifications: {
        deleteTemplate: {
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
        createTemplate: {
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
        getTemplateDetails: {
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
        getTemplates: {
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
        iframeUnsupported: {
            genericError: {
                message: string;
                description: string;
            };
        };
        updateTemplate: {
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
        emptyList: {
            action: string;
            title: string;
            subtitles: {
                0: string;
                1: string;
                2: string;
            };
        };
        emptySearch: {
            action: string;
            title: string;
            subtitles: string;
        };
    };
    viewTemplate: {
        heading: string;
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
}
