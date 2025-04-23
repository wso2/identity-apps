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
export interface workflowModelsNS {
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
        fetchWorkflowModels: {
            genericError: {
                message: string;
                description: string;
            };
        };
        fetchWorkflowModelTemplates: {
            genericError: {
                message: string;
                description: string;
            };
        };
        fetchWorkflowModelTypes: {
            genericError: {
                message: string;
                description: string;
            };
        };
        fetchWorkflowModelMetadata: {
            genericError: {
                message: string;
                description: string;
            };
        };
        deleteWorkflowModel: {
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
        updateWorkflowModel: {
            error: {
                description: string;
                message: string;
            },
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
        addWorkflowModel: {
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
            newWorkflowModelDropdown: {
                connectDirectly: string;
                connectRemotely: string;
            };
            primaryAction: string;
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
        create: {
            title: string;
            description: string;
            back: string;
            stepper: {
                step1: {
                    title: string,
                    description: string
                },
                step2: {
                    title:  string,
                    description: string
                }
            }
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
                    allSymbolsErrorMessage: string;
                    alreadyExistsErrorMessage: string;
                    invalidInputErrorMessage: string;
                    invalidSymbolsErrorMessage: string;
                    maxCharLimitErrorMessage: string;
                };
            };
            engine: {
                label: string;
                placeholder: string;
                requiredErrorMessage: string;
            };
            description: {
                label: string;
                placeholder: string;
                validationErrorMessages: {
                    allSymbolsErrorMessage: string;
                    invalidInputErrorMessage: string;
                    invalidSymbolsErrorMessage: string;
                };
            };
        };
        configurations: {
            template: {
                label: string;
                placeholder: string;
                roles: {
                    label: string
                };
                users: {
                    label: string
                }
            }
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
    form: {
        fields: {
            name: {
                label: string,
                placeholder: string,
                validation: {
                    required: string
                }
            },
            engine: {
                label: string,
                placeholder: string,
                validation: {
                    required: string
                }
            },
            description: {
                label: string,
                placeholder: string
            },
    },
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
        workflowModelError: {
            subtitles: {
                0: string,
                1: string;
            },
            title: string;
        }
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
}
