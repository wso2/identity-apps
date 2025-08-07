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
export interface approvalWorkflowsNS {
    notifications: {
        fetchApprovalWorkflows: {
            genericError: {
                message: string;
                description: string;
            };
        };
        fetchWorkflowAssociations: {
            genericError: {
                message: string;
                description: string;
            };
        };
        fetchApprovalWorkflowTemplates: {
            genericError: {
                message: string;
                description: string;
            };
        };
        deleteWorkflowAssociation: {
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        deleteApprovalWorkflow: {
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
        updateApprovalWorkflow: {
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
        addWorkflowAssociation: {
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        addApprovalWorkflow: {
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
        // Workflow Requests notifications
        deleteWorkflowRequest: {
            genericError: {
                description: string;
                message: string;
            };
            success: {
                description: string;
                message: string;
            };
        };
        fetchWorkflowRequestDetails: {
            genericError: {
                description: string;
                message: string;
            };
            success: {
                description: string;
                message: string;
            };
        };
        fetchWorkflowRequests: {
            genericError: {
                description: string;
                message: string;
            };
        };
        searchWorkflowRequests: {
            genericError: {
                description: string;
                message: string;
            };
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
            newApprovalWorkflowDropdown: {
                connectDirectly: string;
                connectRemotely: string;
            };
            primaryAction: string;
            popups: {
                delete: string;
                edit: string;
            }
        };
        edit: {
            title: string;
            description: string;
            back: string;
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
                    description: string,
                    hint: string
                },
                step3: {
                    title:  string,
                    description: string,
                    hint: string
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
                condition: string;
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
        operations: {
            dropDown: {
                label: string;
                placeholder: string;
            }
        }
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
            }
        },
        dangerZone: {
            delete: {
                actionTitle: string;
                header: string;
                subheader: string;
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
                subtitles: string;
            };
            emptyListReadOnly: {
                title: string;
                subtitles: string;
            };
            ApprovalWorkflowError: {
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
    };
    // Workflow Requests specific properties
    list: {
        columns: {
            workflowInstanceId: string;
            status: string;
            requestInitiator: string;
            createdAt: string;
            updatedAt: string;
            actions: string;
        };
    };
    status: {
        all: string;
        approved: string;
        deleted: string;
        failed: string;
        pending: string;
        rejected: string;
    };
    eventType: {
        all: string;
        myTasks: string;
    };
    operationType: {
        all: string;
        createUser: string;
        deleteUser: string;
        updateUserRoles: string;
        createRole: string;
        deleteRole: string;
        updateRoleName: string;
        updateRoleUsers: string;
        deleteUserClaims: string;
        updateUserClaims: string;
    };
    details: {
        header: string;
        fields: {
            id: string;
            eventType: string;
            requestInitiator: string;
            status: string;
            createdAt: string;
            updatedAt: string;
            requestParams: string;
        };
        loading: string;
        error: {
            header: string;
            content: string;
        };
        backButton: string;
        dangerZone: {
            header: string;
            delete: {
                actionTitle: string;
                header: string;
                subheader: string;
                confirm: string;
            };
        };
    };
    timeRanges: {
        all: string;
        last1Hour: string;
        last6Hours: string;
        last12Hours: string;
        last24Hours: string;
        last2Days: string;
        last7Days: string;
        last14Days: string;
        last30Days: string;
        customRange: string;
        customRangeTitle: string;
        range: string;
    };
    activeFiltersBar: {
        removeFilter: string;
        noActiveFilters: string;
        clearAll: string;
    };
    filters: {
        requestType: string;
        status: string;
        operationType: string;
        createdTimeRange: string;
        updatedTimeRange: string;
    };
}
