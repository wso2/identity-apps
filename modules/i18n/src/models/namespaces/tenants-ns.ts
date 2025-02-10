/**
 * Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
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

export interface TenantsNS {
    actions: {
        newTenant: {
            title: string;
        };
        systemSettings: {
            tooltip: string;
        };
    };
    addTenant: {
        actions: {
            cancel: {
                label: string;
            };
            save: {
                label: string;
            };
        };
        form: {
            adminDetails: {
                title: string;
            };
        };
        notifications: {
            addTenant: {
                error: {
                    description: string;
                    message: string;
                };
                success: {
                    description: string;
                    message: string;
                };
            };
        };
        subtitle: string;
        title: string;
    };
    common: {
        form: {
            fields: {
                alphanumericUsername: {
                    label: string;
                    placeholder: string;
                    validations: {
                        usernameHint: string;
                        usernameSpecialCharHint: string;
                    };
                };
                domain: {
                    helperText: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        domainInvalidCharPattern: string;
                        domainInvalidPattern: string;
                        domainMandatoryExtension: string;
                        domainStartingWithDot: string;
                        domainUnavailable: string;
                        required: string;
                    };
                };
                email: {
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                emailUsername: {
                    helperTextAlt: string;
                    label: string;
                    placeholder: string;
                };
                firstname: {
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                id: {
                    helperText: string;
                    label: string;
                    placeholder: string;
                };
                lastname: {
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                password: {
                    actions: {
                        generate: {
                            label: string;
                        };
                    };
                    label: string;
                    placeholder: string;
                    validations: {
                        criteria: {
                            consecutiveCharacters: string;
                            lowerCase: string;
                            passwordCase: string;
                            passwordLength: string;
                            passwordNumeric: string;
                            specialCharacter: string;
                            uniqueCharacters: string;
                            upperCase: string;
                        };
                        required: string;
                    };
                };
                username: {
                    helperText: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        regExViolation: string;
                        required: string;
                        usernameLength: string;
                        usernameSpecialCharSymbols: string;
                        usernameSymbols: string;
                    };
                };
            };
        };
    };
    confirmationModals: {
        deleteTenant: {
            assertionHint: string;
            content: string;
            header: string;
            message: string;
            primaryAction: string;
            secondaryAction: string;
        };
        disableTenant: {
            assertionHint: string;
            content: string;
            header: string;
            message: string;
            primaryAction: string;
            secondaryAction: string;
        };
    },
    edit: {
        backButton: string;
        consoleURL: {
            label: string;
            hint: string;
        };
        subtitle: string;
    };
    editTenant: {
        actions: {
            save: {
                label: string;
            };
        };
        dangerZoneGroup: {
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
            header: string;
        };
        disabledDisclaimer: {
            actions: {
                enable: {
                    label: string;
                };
            };
            content: string;
            title: string;
        };
        notifications: {
            deleteTenantMeta: {
                error: {
                    description: string;
                    message: string;
                };
                success: {
                    description: string;
                    message: string;
                };
            };
            updateTenant: {
                error: {
                    description: string;
                    message: string;
                };
                success: {
                    description: string;
                    message: string;
                };
            };
            updateTenantStatus: {
                error: {
                    description: string;
                    message: string;
                };
                success: {
                    description: string;
                    message: string;
                };
            };
        };
    };
    listing: {
        advancedSearch: {
            form: {
                dropdown: {
                    filterAttributeOptions: {
                        domain: string;
                    };
                };
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
            placeholder: "Search by domain"
        },
        count: string;
        emptyPlaceholder: {
            actions: {
                configure: {
                    label: string;
                };
                divider: string;
                new: {
                    label: string;
                };
            };
            subtitles: {
                0: string;
                1: string;
            };
            title: string;
        };
        emptySearchResult: {
            actions: {
                clearSearchQuery: {
                    label: string;
                };
            };
            subtitles: {
                0: string;
                1: string;
            };
            title: string;
        };
        item: {
            actions: {
                delete: {
                    label: string;
                };
                edit: {
                    label: string;
                };
                more: {
                    label: string;
                };
            };
            meta: {
                createdOn: {
                    label: string;
                };
                owner: {
                    label: string;
                };
            };
        };
    };
    status: {
        activate: string;
        activated: string;
        deActivate: string;
        deActivated: string;
    };
    subtitle: string;
    systemSettings: {
        actions: {
            newTenant: {
                title: string;
            };
            systemSettings: {
                tooltip: string;
            };
        };
        backButton: string;
        subtitle: string;
        title: string;
    };
    tenantDropdown: {
        options: {
            manage: {
                label: string;
            };
        };
    };
    title: string;
}
