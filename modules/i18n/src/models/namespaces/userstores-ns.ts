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
export interface userstoresNS {
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
    notifications: {
        fetchUserstores: {
            genericError: {
                message: string;
                description: string;
            };
        };
        fetchUserstoreTemplates: {
            genericError: {
                message: string;
                description: string;
            };
        };
        fetchUserstoreTypes: {
            genericError: {
                message: string;
                description: string;
            };
        };
        fetchUserstoreMetadata: {
            genericError: {
                message: string;
                description: string;
            };
        };
        deleteUserstore: {
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        delay: {
            message: string;
            description: string;
        };
        updateUserstore: {
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        testConnection: {
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        addUserstore: {
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        apiLimitReachedError: {
            error: {
                message: string;
                description: string;
            };
        };
        updateDelay: {
            message: string;
            description: string;
        };
    };
    confirmation: {
        hint: string;
        header: string;
        message: string;
        content: string;
        confirm: string;
    };
    pageLayout: {
        list: {
            title: string;
            description: string;
            primaryAction: string;
        };
        templates: {
            title: string;
            description: string;
            back: string;
            templateHeading: string;
            templateSubHeading: string;
        };
        edit: {
            description: string;
            back: string;
            tabs: {
                general: string;
                connection: string;
                user: string;
                group: string;
            };
        };
    };
    forms: {
        general: {
            name: {
                label: string;
                placeholder: string;
                requiredErrorMessage: string;
                validationErrorMessages: {
                    [key: string]: string;
                };
            };
            type: {
                label: string;
                requiredErrorMessage: string;
            };
            description: {
                label: string;
                placeholder: string;
                validationErrorMessages: {
                    invalidInputErrorMessage: string;
                };
            };
        };
        connection: {
            updatePassword: string;
            testButton: string;
            connectionErrorMessage: string;
        };
        custom: {
            placeholder: string;
            requiredErrorMessage: string;
        };
    };
    dangerZone: {
        delete: {
            actionTitle: string;
            header: string;
            subheader: string;
        };
        disable: {
            actionTitle: string;
            header: string;
            subheader: string;
        };
    };
    wizard: {
        steps: {
            general: string;
            user: string;
            group: string;
            summary: string;
        };
        header: string;
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
            subtitles: string;
        };
        emptyListReadOnly: {
            title: string;
            subtitles: string;
        };
    };
    sqlEditor: {
        reset: string;
        title: string;
        create: string;
        update: string;
        read: string;
        delete: string;
        darkMode: string;
    };
}
