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

interface ConsentNotificationsNS {
    create: {
        error: {
            conflict: { description: string; message: string };
            description: string;
            message: string;
            notFound: { description: string; message: string };
            serverError: { description: string; message: string };
        };
        success: { description: string; message: string };
    };
    delete: {
        error: {
            conflict: { description: string; message: string };
            description: string;
            message: string;
            notFound: { description: string; message: string };
            serverError: { description: string; message: string };
        };
        success: { description: string; message: string };
    };
    update: {
        error: {
            conflict: { description: string; message: string };
            description: string;
            message: string;
            notFound: { description: string; message: string };
            serverError: { description: string; message: string };
        };
        success: { description: string; message: string };
    };
}

interface ConsentDeleteConfirmationNS {
    assertionHint: string;
    content: string;
    header: string;
    message: string;
    primaryAction: string;
    secondaryAction: string;
}

export interface ConsentsNS {
    preferenceManagement: {
        form: {
            description: {
                label: string;
                labelRoleHint: string;
            };
            linkHint: string;
            name: {
                label: string;
                placeholder: string;
                error: {
                    duplicateName: string;
                };
            };
        };
        list: {
            emptyPlaceholder: {
                addConsent: string;
                subtitle: string;
            };
            emptySearchPlaceholder: {
                action: string;
                subtitle: string;
                title: string;
            };
            labels: {
                sharedPreference: string;
            };
        };
        notifications: ConsentNotificationsNS;
        pages: {
            deleteConfirmation: ConsentDeleteConfirmationNS;
            edit: {
                backButton: string;
                dangerZone: {
                    actionTitle: string;
                    header: string;
                    subheader: string;
                };
                title: string;
            };
            list: {
                actions: {
                    addConsent: string;
                };
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
        preview: {
            consentHeader: string;
            emptyDescription: string;
            exampleDescription: string;
            pageTitle: string;
        };
    };
    policyConsents: {
        brandingRequired: string;
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
                activeHint: string;
            };
            versionDropdown: {
                trigger: string;
                currentVersionLabel: string;
            };
            createModal: {
                header: string;
                hint: string;
                promptAtLogin: string;
                promptDescription: string;
            };
            versionModal: {
                createNewVersion: string;
                hint: string;
                promptAtLogin: string;
                promptDescription: string;
            };
        };
        list: {
            emptyPlaceholder: {
                addPolicy: string;
                subtitle: string;
            };
            emptySearchPlaceholder: {
                action: string;
                subtitle: string;
                title: string;
            };
            labels: {
                defaultPolicy: string;
                notConfigured: string;
                sharedPolicy: string;
            };
        };
        notifications: ConsentNotificationsNS;
        pages: {
            deleteConfirmation: ConsentDeleteConfirmationNS;
            edit: {
                backButton: string;
                dangerZone: {
                    actionTitle: string;
                    header: string;
                    subheader: string;
                };
                title: string;
            };
            list: {
                actions: {
                    addPolicy: string;
                };
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
        wizard: {
            create: {
                form: {
                    description: {
                        configureTranslation: string;
                        i18nCard: {
                            brandingRequired: string;
                            brandingRequiredShort: string;
                            createTitle: string;
                            deleteError: { description: string; message: string };
                            deleteSuccess: { description: string; message: string };
                            deleteTooltip: string;
                            editTooltip: string;
                            i18nKey: string;
                            keyPlaceholder: string;
                            language: string;
                            newTooltip: string;
                            saveError: { description: string; message: string };
                            saveSuccess: { description: string; message: string };
                            selectKey: string;
                            title: string;
                            translationPlaceholder: string;
                            translationText: string;
                            updateTitle: string;
                        };
                        insertCustomLinkShort: string;
                        insertPolicyLink: string;
                        insertPolicyLinkInvalidUrl: string;
                        insertPolicyLinkShort: string;
                        insertPolicyLinkTooltip: string;
                        insertPolicyLinkNoPolicyUrl: string;
                        insertPolicyLinkNoSelection: string;
                        labelRoleHint: string;
                    };
                };
                preview: {
                    consentHeader: string;
                    emptyDescription: string;
                    exampleDescription: string;
                    pageTitle: string;
                    updatedPolicies: string;
                };
            };
        };
    };
    registrationFlow: {
        addAttribute: string;
        addPurpose: string;
        attributeDisplayName: string;
        attributeName: string;
        attributes: string;
        noPreference: string;
        noPolicies: string;
        purposeDescription: string;
        purposeLabel: string;
        purposeName: string;
        selectPreference: string;
        selectPolicies: string;
    };
    tabs: {
        content: { label: string };
        preview: { label: string };
    };
}
