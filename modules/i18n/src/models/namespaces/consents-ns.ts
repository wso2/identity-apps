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

export interface ConsentsNS {
    form: {
        createNewVersion: string;
        description: {
            label: string;
        };
        mandatory: {
            label: string;
            hint: string;
            linkHint: string;
        };
        name: {
            label: string;
            placeholder: string;
            error: {
                duplicateName: string;
            };
        };
        policyUrl: {
            label: string;
            hint: string;
            versionHint: string;
        };
        promptOnLogin: {
            label: string;
            hint: string;
        };
        versionDropdown: {
            trigger: string;
            currentVersionLabel: string;
        };
        versionModal: {
            createNewVersion: string;
            promptAtLogin: string;
            promptDescription: string;
        };
    };
    list: {
        emptyPlaceholder: {
            addPolicy: string;
            subtitle: string;
        };
    };
    registrationFlow: {
        noPolicies: string;
        selectPolicies: string;
    };
    notifications: {
        create: {
            error: {
                conflict: {
                    description: string;
                    message: string;
                };
                description: string;
                message: string;
                notFound: {
                    description: string;
                    message: string;
                };
                serverError: {
                    description: string;
                    message: string;
                };
            };
            success: {
                description: string;
                message: string;
            };
        };
        delete: {
            error: {
                conflict: {
                    description: string;
                    message: string;
                };
                description: string;
                message: string;
                notFound: {
                    description: string;
                    message: string;
                };
                serverError: {
                    description: string;
                    message: string;
                };
            };
            success: {
                description: string;
                message: string;
            };
        };
        updatePolicy: {
            error: {
                conflict: {
                    description: string;
                    message: string;
                };
                description: string;
                message: string;
                notFound: {
                    description: string;
                    message: string;
                };
                serverError: {
                    description: string;
                    message: string;
                };
            };
            success: {
                description: string;
                message: string;
            };
        };
    };
    pages: {
        edit: {
            backButton: string;
            dangerZone: {
                actionTitle: string;
                header: string;
                subheader: string;
            };
            deleteConfirmation: {
                assertionHint: string;
                content: string;
                header: string;
                message: string;
                primaryAction: string;
                secondaryAction: string;
            };
            title: string;
        };
        list: {
            actions: {
                addPolicy: string;
            };
            deleteConfirmation: {
                assertionHint: string;
                header: string;
                message: string;
                content: string;
                primaryAction: string;
                secondaryAction: string;
            };
            backButton: string;
            description: string;
            heading: string;
            search: {
                placeholder: string;
            };
            title: string;
        };
        new: {
            backButton: string;
            title: string;
        };
    };
    tabs: {
        content: { label: string };
        preview: { label: string };
    };
    wizard: {
        create: {
            form: {
                description: {
                    configureTranslation: string;
                    i18nCard: {
                        brandingRequired: string;
                        createTitle: string;
                        deleteError: {
                            description: string;
                            message: string;
                        };
                        deleteSuccess: {
                            description: string;
                            message: string;
                        };
                        deleteTooltip: string;
                        editTooltip: string;
                        i18nKey: string;
                        keyPlaceholder: string;
                        language: string;
                        newTooltip: string;
                        saveError: {
                            description: string;
                            message: string;
                        };
                        saveSuccess: {
                            description: string;
                            message: string;
                        };
                        selectKey: string;
                        title: string;
                        translationPlaceholder: string;
                        translationText: string;
                        updateTitle: string;
                    };
                    insertPolicyLink: string;
                    insertPolicyLinkShort: string;
                    insertPolicyLinkTooltip: string;
                    insertPolicyLinkNoPolicyUrl: string;
                    insertPolicyLinkNoSelection: string;
                    labelRoleHint: string;
                };
            };
            preview: {
                allowButton: string;
                appLoginMessage: string;
                consentHeader: string;
                denyButton: string;
                emptyDescription: string;
                exampleDescription: string;
                pageTitle: string;
            };
        };
    };
}
