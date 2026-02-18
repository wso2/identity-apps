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

export interface CustomerDataServiceNS {

    common: {
        buttons: {
            cancel: string;
            close: string;
            confirm: string;
            delete: string;
        };
        dangerZone: {
            header: string;
        };
        notifications: {
            error: string;
            notAllowed: string;
            loadAttributes: {
                error: {
                    message: string;
                    description: string;
                };
            }
        };
    };

    profiles: {

        /**
         * Profiles LIST PAGE
         */
        list: {
            page?: {
                title?: string;
                description?: string;
            };

            columns: {
                profile: string;
                user: string;
                unifiedProfiles: string;
            };

            chips: {
                anonymous: string;
                unified: string;
            };

            search?: {
                placeholder: string;
            };

            placeholders?: {
                emptyList: {
                    title: string;
                    subtitle: string;
                };
                emptySearch: {
                    action: string;
                    title: string;
                    subtitle: string;
                };
            };

            confirmations: {
                delete: {
                    header: string;
                    message: string;
                    content: string;
                    assertionHint: string;
                };
            };

            notifications: {
                delete: {
                    success: {
                        message: string;
                        description: string;
                    };
                    error: {
                        message: string;
                        description: string;
                    };
                };
                fetchProfiles: {
                    error: {
                        description: string;
                        message: string;
                    }
                };
            };
        };

        /**
         * PROFILE DETAILS PAGE
         */
        details: {
            page: {
                pageTitle: string;
                fallbackTitle: string;
                description: string;
                backButton: string;
            };

            tabs: {
                general: string;
                unifiedProfiles: string;
            };

            form: {
                profileId: { label: string };
                userId: { label: string };
                createdDate: { label: string };
                updatedDate: { label: string };
                location: { label: string };
                profileData: { label: string };
            };

            profileData: {
                actions: {
                    view: string;
                    copy: string;
                    export: string;
                };
                modal: {
                    title: string;
                };
                copy: {
                    success: {
                        message: string;
                        description: string;
                    };
                };
                export: {
                    success: {
                        message: string;
                        description: string;
                    };
                };
            };

            section: {
                profileData: {
                    title:  string;
                    description: string;
                }
            };

            unifiedProfiles: {
                description: string;
                title: string;
                empty: string;
                columns: {
                    profileId: string;
                    reason: string;
                };
            };

            dangerZone: {
                delete: {
                    header: string;
                    subheader: string;
                    actionTitle: string;
                };
            };

            confirmations: {
                deleteProfile: {
                    header: string;
                    message: string;
                    assertionHint: string;
                    content: string;
                };
            };

            notifications: {

                fetchProfile: {
                    error: {
                        message: string;
                        description: string;
                    };
                };

                deleteProfile: {

                    notAllowed: {
                        message: string;
                        description: string;
                    };

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
        };
        page: {
            description: string;
            pageTitle: string;
            title:  string;
        },
    };
    unificationRules: {
        common: {
            notifications: {
              deleted: {
                message: string;
                description: string;
              };
              deletionFailed: {
                message: string;
                description: string;
              };
              loadedFailed: {
                message: string;
                description: string;
              };
            };
        };
        create: {
            page: {
                title: string;
                description: string;
                backButton: string;
            };
            headings: {
                ruleDetails: string;
                ruleDetailsDescription: string;
            };
            fields: {
                ruleName: {
                    label: string;
                    placeholder: string;
                    hint: string;
                    errors: {
                        required: string;
                    };
                };
                attribute: {
                    label: string;
                    placeholder: string;
                    noOptions: string;
                    hint: string;
                    scopeAriaLabel: string;
                    attributeAriaLabel: string;
                    loadingRulesHint: string;
                    rulesLoadFailedHint: string;
                    noAvailableForScopeHint: string;
                    errors: {
                        required: string;
                        loadFailed: string;
                        alreadyUsed: string;
                    };
                };
                scope: {
                    options: {
                        identity: string;
                        trait: string;
                    };
                };
                priority: {
                    label: string;
                    hint: string;
                    errors: {
                        min: string;
                        alreadyUsed: string;
                    };
                };
                isActive: {
                    label: string;
                };
            };
            buttons: {
                create: string;
                creating: string;
                cancel: string;
            };
            notifications: {
                loadingRules: {
                message: string;
                description: string;
                };
                created: {
                message: string;
                description: string;
                };
                creationFailed: {
                message: string;
                description: string;
                };
            };
        };
        /**
         * List page.
         */
        list: {
            page: {
                title: string;
                description: string;
            };
            buttons: {
                add: string;
                retry: string;
                clearSearch: string;
            };
            placeholders: {
                empty: {
                    title: string;
                    subtitle: string;
                };
                error: {
                    title: string;
                    subtitle: string;
                };
                noResults: {
                    title: string;
                    subtitle1: string;
                    subtitle2: string;
                };
                search: string;
            };
            labels: {
                scope: {
                    identity: string;
                    trait: string
                };
            };
            // unificationRules.list.columns
            columns: {
                rule: string;
                attribute: string;
                priority: string;
                enabled: string;
            };

            // unificationRules.list.actions
            actions: {
                moveUp: string;
                moveDown: string;
                enable: string;
                disable: string;
                delete: string;
            };

            // unificationRules.list.confirmations  (add alongside existing fields)
            confirmations: {
                delete: {
                    header: string;
                    message: string;
                    content: string;
                    assertionHint: string;
                };
                toggle: {
                    enableHeader: string;
                    disableHeader: string;
                    enableMessage: string;
                    disableMessage: string;
                    enableContent: string;
                    disableContent: string;
                };
            };

            // unificationRules.list.notifications
            notifications: {
                priorityUpdated: {
                    success: {
                        message: string;
                        description: string;
                    };
                    error: {
                        message: string;
                        description: string;
                    };
                    rollbackError: {
                        message: string;
                        description: string;
                    };
                };
                ruleEnabled: {
                    success: {
                        message: string;
                        description: string;
                    };
                };
                ruleDisabled: {
                    success: {
                        message: string;
                        description: string;
                    };
                };
                toggleFailed: {
                    error: {
                        message: string;
                        description: string;
                    };
                };
            };
        };
    };
}
