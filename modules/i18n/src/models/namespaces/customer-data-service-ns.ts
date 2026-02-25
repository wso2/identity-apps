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
            update: string; // NEW
        };
        dangerZone: {
            header: string;
        };
        featurePreview: {
            name: string;
            action: string;
            description: string
            message: string;
        };
        notifications: {
            error: string;
            notAllowed: string;
            loadAttributes: {
                error: {
                    message: string;
                    description: string;
                };
            };
        };
    };

    profileAttributes: {
        create: {
            forms: {
                advancedSettings: {
                    fields: {
                        canonicalValues: {
                            hint: string;
                            label: string;
                            labelField: string;
                            labelPlaceholder: string;
                            validations: {
                                atLeastOne: string;
                                empty: string;
                            };
                            valueField: string;
                            valuePlaceholder: string;
                        };
                        mergeStrategy: {
                            hint: string;
                            label: string;
                            options: {
                                combine:   { hint: string; label: string };
                                overwrite: { hint: string; label: string };
                            };
                        };
                        subAttributes: {
                            hint: string;
                            label: string;
                            noOptions: string;
                            placeholder: string;
                        };
                    };
                };

                attributeGeneral: {
                    fields: {
                        // NEW (used by the Create page’s compound row)
                        attribute: {
                            label: string;
                        };
                        scope: {
                            ariaLabel: string;
                            label: string;
                            options: {
                                traits: string;
                                applicationData: string;
                            };
                        };
                        applicationIdentifier: {
                            label: string;
                            loading: string;
                            noOptions: string;
                            validations: {
                                empty: string;
                            };
                        };

                        // existing
                        description: {
                            hint: string;
                            label: string;
                            placeholder: string;
                        };
                        displayName: {
                            hint: string;
                            label: string;
                            placeholder: string;
                        };
                        name: {
                            fullNameHint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                available: string;
                                empty: string;
                                exists: string;
                            };
                        };
                    };
                };

                typeConfig: {
                    fields: {
                        multiValued: {
                            hint: string;
                            label: string;
                        };
                        mutability: {
                            hint?: string; // optional (create page uses this)
                            label: string;
                            options: {
                                immutable:  { hint: string; label: string };
                                readOnly:   { hint: string; label: string };
                                readWrite:  { hint: string; label: string };
                                writeOnce:  { hint: string; label: string };
                            };
                        };
                        valueType: {
                            hint?: string; // optional (create page uses this)
                            label: string;
                            options: {
                                boolean:   { hint: string; label: string };
                                complex:   { hint: string; label: string };
                                date:      { hint: string; label: string };
                                date_time: { hint: string; label: string };
                                decimal:   { hint: string; label: string };
                                epoch:     { hint: string; label: string };
                                integer:   { hint: string; label: string };
                                options:   { hint: string; label: string };
                                string:    { hint: string; label: string };
                            };
                        };
                    };
                };
            };

            notifications: {
                addProfileAttribute: {
                    genericError: {
                        description: string;
                        message: string;
                    };
                    success: {
                        description: string;
                        message: string;
                    };
                };
            };

            pageLayout: {
                back: string;
                description: string;
                stepper: {
                    step1: { description: string; title: string };
                    step2: { description: string; title: string };
                };
                title: string;
            };
        };

        edit: {
            confirmations: {
                deleteAttribute: {
                    assertionHint: string;
                    content: string;
                    header: string;
                    message: string;
                };
            };
            dangerZone: {
                delete: {
                    actionTitle: string;
                    header: string;
                    subheader: string;
                };
            };
            fields: {
                applicationIdentifier: {
                    hint: string;
                    label: string;
                };
                attribute: {
                    hint: string;
                    label: string;
                };
                mergeStrategy: {
                    hint: string;
                    label: string;
                    options: {
                        combine: string;
                        overwrite: string;
                    };
                };
                multiValued: {
                    hint: string;
                    label: string;
                };

                // UPDATED / expanded
                mutability: {
                    hint: string;
                    label: string;
                };

                // UPDATED / expanded
                subAttributes: {
                    allAdded: string;
                    empty: string;
                    hint: string;
                    label: string;
                    placeholder: string;
                    validationError: string;
                    validationErrorMessage: string;
                };

                // UPDATED / expanded
                valueType: {
                    label: string;
                    options: {
                        boolean: string;
                        complex: string;
                        date: string;
                        dateTime: string;
                        decimal: string;
                        epoch: string;
                        integer: string;
                        text: string;
                    };
                };
            };
            identityAttributesNotice: string;
            notifications: {
                deleteAttribute: {
                    error: { description: string; message: string };
                    success: { description: string; message: string };
                };
                fetchAttribute: {
                    error: { description: string; message: string };
                };
                updateAttribute: {
                    error: { description: string; message: string };
                    success: { description: string; message: string };
                };
            };
            page: {
                backButton: string;
                pageTitle: string;
            };
            tabs: {
                general: string;
            };
        };

        list: {
            actions: {
                delete: string;
                edit: string;
                view: string;
            };
            buttons: {
                add: string;
                clearSearch: string;
                retry: string;
            };
            columns: {
                attribute: string;
            };
            confirmations: {
                deleteAttribute: {
                    assertionHint: string;
                    content: string;
                    header: string;
                    message: string;
                };
            };
            notifications: {
                deleteAttribute: {
                    error: {
                        description: string;
                        message: string;
                    };
                    success: {
                        description: string;
                        message: string;
                    };
                };
                filterProfileAttributes: {
                    genericError: {
                        description: string;
                        message: string;
                    };
                };
            };
            page: {
                description: string;
                pageTitle: string;
                title: string;
            };
            placeholders: {
                emptyList: {
                    subtitles: {
                        0: string;
                    };
                    title: string;
                };
                emptySearch: {
                    action: string;
                    subtitles: {
                        0: string;
                    };
                    title: string;
                };
            };
            search: {
                placeholder: string;
            };
            sortBy: {
                name: string;
                scope: string;
            };
        };
    };

    profiles: {
        list: {
            chips: {
                anonymous: string;
                unified: string;
            };
            columns: {
                profile: string;
                unifiedProfiles: string;
                user: string;
            };
            confirmations: {
                delete: {
                    assertionHint: string;
                    content: string;
                    header: string;
                    message: string;
                };
            };
            notifications: {
                delete: {
                    error: {
                        description: string;
                        message: string;
                    };
                    success: {
                        description: string;
                        message: string;
                    };
                };
                fetchProfiles: {
                    error: {
                        description: string;
                        message: string;
                    };
                };
            };
            page?: {
                description?: string;
                title?: string;
            };
            placeholders?: {
                emptyList: {
                    subtitle: string;
                    title: string;
                };
                emptySearch: {
                    action: string;
                    subtitle: string;
                    title: string;
                };
            };
            search?: {
                placeholder: string;
            };
        };
        details: {
            confirmations: {
                deleteProfile: {
                    assertionHint: string;
                    content: string;
                    header: string;
                    message: string;
                };
            };
            dangerZone: {
                delete: {
                    actionTitle: string;
                    header: string;
                    subheader: string;
                };
            };
            form: {
                createdDate: { label: string };
                location: { label: string };
                profileData: { label: string };
                profileId: { label: string };
                updatedDate: { label: string };
                userId: { label: string };
            };
            notifications: {
                deleteProfile: {
                    error: {
                        description: string;
                        message: string;
                    };
                    notAllowed: {
                        description: string;
                        message: string;
                    };
                    success: {
                        description: string;
                        message: string;
                    };
                };
                fetchProfile: {
                    error: {
                        description: string;
                        message: string;
                    };
                };
            };
            page: {
                backButton: string;
                description: string;
                fallbackTitle: string;
                pageTitle: string;
            };
            profileData: {
                actions: {
                    copy: string;
                    export: string;
                    view: string;
                };
                copy: {
                    success: {
                        description: string;
                        message: string;
                    };
                };
                export: {
                    success: {
                        description: string;
                        message: string;
                    };
                };
                modal: {
                    title: string;
                };
            };
            section: {
                profileData: {
                    description: string;
                    title: string;
                };
            };
            tabs: {
                general: string;
                unifiedProfiles: string;
            };
            unifiedProfiles: {
                columns: {
                    profileId: string;
                    reason: string;
                };
                description: string;
                empty: string;
                title: string;
            };
        };

        page: {
            description: string;
            pageTitle: string;
            title: string;
        };
    };

    sidePanel: {
        ProfileAttributes: string;
        Profiles: string;
        UnificationRules: string;
    };

    unificationRules: {
        common: {
            notifications: {
                deleted: {
                    description: string;
                    message: string;
                };
                deletionFailed: {
                    description: string;
                    message: string;
                };
                loadedFailed: {
                    description: string;
                    message: string;
                };
            };
        };
        create: {
            buttons: {
                cancel: string;
                create: string;
                creating: string;
            };
            fields: {
                attribute: {
                    attributeAriaLabel: string;
                    errors: {
                        alreadyUsed: string;
                        loadFailed: string;
                        required: string;
                    };
                    hint: string;
                    label: string;
                    loadingRulesHint: string;
                    noAvailableForScopeHint: string;
                    noOptions: string;
                    placeholder: string;
                    rulesLoadFailedHint: string;
                    scopeAriaLabel: string;
                };
                isActive: {
                    label: string;
                };
                priority: {
                    errors: {
                        alreadyUsed: string;
                        min: string;
                    };
                    hint: string;
                    label: string;
                };
                ruleName: {
                    errors: {
                        required: string;
                    };
                    hint: string;
                    label: string;
                    placeholder: string;
                };
                scope: {
                    options: {
                        identity: string;
                        trait: string;
                    };
                };
            };
            headings: {
                ruleDetails: string;
                ruleDetailsDescription: string;
            };
            notifications: {
                created: {
                    description: string;
                    message: string;
                };
                creationFailed: {
                    description: string;
                    message: string;
                };
                loadingRules: {
                    description: string;
                    message: string;
                };
            };
            page: {
                backButton: string;
                description: string;
                title: string;
            };
        };
        list: {
            actions: {
                delete: string;
                disable: string;
                enable: string;
                moveDown: string;
                moveUp: string;
            };
            buttons: {
                add: string;
                clearSearch: string;
                retry: string;
            };
            columns: {
                attribute: string;
                enabled: string;
                priority: string;
                rule: string;
            };
            confirmations: {
                delete: {
                    assertionHint: string;
                    content: string;
                    header: string;
                    message: string;
                };
                toggle: {
                    disableContent: string;
                    disableHeader: string;
                    disableMessage: string;
                    enableContent: string;
                    enableHeader: string;
                    enableMessage: string;
                };
            };
            labels: {
                scope: {
                    identity: string;
                    trait: string;
                };
            };
            notifications: {
                priorityUpdated: {
                    error: {
                        description: string;
                        message: string;
                    };
                    rollbackError: {
                        description: string;
                        message: string;
                    };
                    success: {
                        description: string;
                        message: string;
                    };
                };
                ruleDisabled: {
                    success: {
                        description: string;
                        message: string;
                    };
                };
                ruleEnabled: {
                    success: {
                        description: string;
                        message: string;
                    };
                };
                toggleFailed: {
                    error: {
                        description: string;
                        message: string;
                    };
                };
            };
            page: {
                description: string;
                title: string;
            };
            placeholders: {
                empty: {
                    subtitle: string;
                    title: string;
                };
                error: {
                    subtitle: string;
                    title: string;
                };
                noResults: {
                    subtitle1: string;
                    subtitle2: string;
                    title: string;
                };
                search: string;
            };
        };
    };
};
