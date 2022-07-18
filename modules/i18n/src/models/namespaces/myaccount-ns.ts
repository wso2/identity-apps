/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import {
    AppSwitchItemInterface,
    DangerZone,
    ModalInterface,
    Notification,
    NotificationItem,
    Page,
    Placeholder
} from "../common";

/**
 * Model for the user portal portal namespace
 */
export interface MyAccountNS {
    components: {
        advancedSearch: {
            form: {
                inputs: {
                    filterAttribute: {
                        label: string;
                        placeholder: string;
                        validations: {
                            empty: string;
                        };
                    };
                    filterCondition: {
                        label: string;
                        placeholder: string;
                        validations: {
                            empty: string;
                        };
                    };
                    filterValue: {
                        label: string;
                        placeholder: string;
                        validations: {
                            empty: string;
                        };
                    };
                };
            };
            hints: {
                querySearch: {
                    actionKeys: string;
                    label: string;
                };
            };
            options: {
                header: string;
            };
            placeholder: string;
            popups: {
                clear: string;
                dropdown: string;
            };
            resultsIndicator: string;
        };
        accountRecovery: {
            codeRecovery: {
                descriptions: {
                    add: string;
                };
                heading: string;
            };
            preference?: {
                notifications?: Notification;
            };
            emailRecovery: {
                descriptions: {
                    add: string;
                    update: string;
                    view: string;
                };
                forms: {
                    emailResetForm: {
                        inputs: {
                            email: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                    invalidFormat: string;
                                };
                            };
                        };
                    };
                };
                heading: string;
                notifications: {
                    updateEmail: Notification;
                };
            };
            questionRecovery: {
                descriptions: {
                    add: string;
                };
                forms: {
                    securityQuestionsForm: {
                        inputs: {
                            answer: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            question: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                };
                            };
                        };
                    };
                };
                heading: string;
                notifications: {
                    addQuestions: Notification;
                    updateQuestions: Notification;
                };
            };
        };
        applications: {
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
            };
            all: {
                heading: string;
            };
            favourite: {
                heading: string;
            };
            notifications: {
                fetchApplications: Notification;
            };
            placeholders: {
                emptyList: Placeholder;
            };
            recent: {
                heading: string;
            };
        };
        changePassword: {
            forms: {
                passwordResetForm: {
                    inputs: {
                        confirmPassword: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                mismatch: string;
                            };
                        };
                        currentPassword: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                invalid: string;
                            };
                        };
                        newPassword: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                            };
                        };
                    };
                    validations: {
                        genericError: {
                            description: string;
                            message: string;
                        };
                        invalidCurrentPassword: {
                            description: string;
                            message: string;
                        };
                        passwordCaseRequirement: string,
                        passwordCharRequirement: string,
                        passwordLengthRequirement: string,
                        passwordNumRequirement: string,
                        submitError: {
                            description: string;
                            message: string;
                        };
                        submitSuccess: {
                            description: string;
                            message: string;
                        };
                    };
                };
            };
            modals: {
                confirmationModal: {
                    heading: string;
                    message: string;
                };
            };
        };
        consentManagement: {
            editConsent: {
                collectionMethod: string;
                dangerZones: {
                    revoke: DangerZone;
                };
                description: string;
                piiCategoryHeading: string;
                state: string;
                version: string;
            };
            modals: {
                consentRevokeModal: {
                    heading: string;
                    message: string;
                    warning: string;
                };
            };
            notifications: {
                consentReceiptFetch: Notification;
                consentedAppsFetch: Notification;
                revokeConsentedApp: Notification;
                updateConsentedClaims: Notification;
            };
        };
        footer: {
            copyright: string;
        };
        header: {
            appSwitch: {
                console: AppSwitchItemInterface;
                myAccount: AppSwitchItemInterface;
                tooltip: string;
            };
            organizationLabel: string;
        },
        linkedAccounts: {
            accountTypes: {
                local: {
                    label: string;
                };
            };
            forms: {
                addAccountForm: {
                    inputs: {
                        password: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                            };
                        };
                        username: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                            };
                        };
                    };
                };
            };
            deleteConfirmation: string;
            notifications: {
                addAssociation: Notification;
                getAssociations: Notification;
                removeAllAssociations: Notification;
                removeAssociation: Notification;
                switchAccount: Notification;
            };
        };
        cookieConsent: {
            content: string;
            confirmButton: string;
        };
        federatedAssociations: {
            deleteConfirmation: string;
            notifications: {
                getFederatedAssociations: Notification;
                removeFederatedAssociation: Notification;
                removeAllFederatedAssociations: Notification;
            };
        };
        mfa: {
            fido: {
                description: string;
                heading: string;
                modals: {
                    deviceRegistrationErrorModal: {
                        description: string;
                        tryWithOlderDevice: string;
                        heading: string;
                    };
                    deleteConfirmation: {
                        description: string;
                        heading: string;
                        content: string;
                        assertionHint: string;
                    }
                };
                notifications: {
                    removeDevice: Notification;
                    startFidoFlow: Notification;
                    updateDeviceName: Notification;
                };
                tryButton: string;
                form: {
                    label: string;
                    placeholder: string;
                    remove: string;
                    required: string;
                };
            };
            smsOtp: {
                descriptions: {
                    hint: string;
                };
                heading: string;
                notifications: {
                    updateMobile: Notification;
                };
            };
            authenticatorApp: {
                description: string;
                configuredDescription:string;
                heading: string;
                hint: string;
                enableHint: string;
                addHint: string;
                deleteHint: string;
                regenerate: string;
                modals: {
                    heading: string;
                    scan: {
                        heading: string;
                        generate: string;
                        additionNote:string;
                        messageHeading: string;
                        messageBody: string;
                        authenticatorApps: string;
                        regenerateWarning: string;
                    };
                    verify: {
                        heading: string;
                        label: string;
                        placeholder: string;
                        error: string;
                        requiredError: string;
                        reScanQuestion: string;
                        reScan: string;
                    };
                    delete: {
                        heading: string;
                        message: string;
                    };
                    done: string;
                    toolTip: string;
                };
                notifications: {
                    initError: {
                        genericError: NotificationItem;
                        error: NotificationItem;
                    };
                    refreshError: {
                        genericError: NotificationItem;
                        error: NotificationItem;
                    };
                    deleteError: {
                        genericError: NotificationItem;
                        error: NotificationItem;
                    };
                    updateAuthenticatorError: {
                        error: NotificationItem;
                        genericError: NotificationItem;
                    };
                    deleteSuccess: {
                        genericMessage: string;
                        message: string;
                    };
                };
            };
            backupCode: {
                description: string;
                download: {
                    heading: string;
                    info1: string;
                    info2: string;
                    subHeading: string;
                };
                heading: string;
                modals: {
                    description: string;
                    download: {
                        heading: string;
                    };
                    generate: {
                        description: string;
                        heading: string;
                    };
                    heading: string;
                    info: string;
                    regenerate: {
                        heading: string;
                        description: string;
                    };
                    refresh: {
                        heading: string;
                    };
                    subHeading: string;
                    warn: string;
                },
                notifications: {
                    deleteError: {
                        error: NotificationItem;
                        genericError: NotificationItem;
                    };
                    downloadError: {
                        error: NotificationItem;
                        genericError: NotificationItem;
                    };
                    downloadSuccess: {
                        message: NotificationItem;
                        genericMessage: NotificationItem;
                    };
                    refreshError: {
                        error: NotificationItem;
                        genericError: NotificationItem;
                    };
                    retrieveAuthenticatorError: {
                        error: NotificationItem;
                        genericError: NotificationItem;
                    };
                    retrieveError: {
                        error: NotificationItem;
                        genericError: NotificationItem;
                    };
                    updateAuthenticatorError: {
                        error: NotificationItem;
                        genericError: NotificationItem;
                    };

                }
            }
        };
        loginVerifyData: {
            heading: string;
            description: string;
            typingdna: {
                heading: string;
                description: string;
            };
            modals: {
                clearTypingPatternsModal: {
                    heading: string;
                    message: string;
                };
            };
            notifications: {
                clearTypingPatterns: {
                    success: {
                        description: string;
                        message: string;
                    };
                    error: {
                        description: string;
                        message: string;
                    };
                };
            };
        };
        overview: {
            widgets: {
                accountActivity: {
                    actionTitles: {
                        update: string;
                    };
                    description: string;
                    header: string;
                };
                accountSecurity: {
                    actionTitles: {
                        update: string;
                    };
                    description: string;
                    header: string;
                };
                profileStatus: {
                    completionPercentage: string;
                    userSourceText: string;
                    header: string;
                    description: string;
                    readOnlyDescription: string;
                    profileText:string
                };
                accountStatus: {
                    complete: string;
                    completedFields: string;
                    completionPercentage: string;
                    inComplete: string;
                    inCompleteFields: string;
                    mandatoryFieldsCompletion: string;
                    optionalFieldsCompletion: string;
                };
                consentManagement: {
                    actionTitles: {
                        manage: string;
                    };
                    description: string;
                    header: string;
                };
            };
        };
        privacy: {
            about: {
                description: string;
                heading: string;
            };
            privacyPolicy: {
                collectionOfPersonalInfo: {
                    description: {
                        list1: {
                            0: string;
                            1: string;
                            2: string;
                        };
                        para1: string;
                    };
                    heading: string;
                    trackingTechnologies: {
                        description: {
                            list1: {
                                0: string;
                                1: string;
                                2: string;
                                3: string;
                            };
                            para1: string;
                        };
                        heading: string;
                    };
                };
                description: {
                    para1: string;
                    para2: string;
                    para3: string;
                };
                disclaimer: {
                    description: {
                        list1: {
                            0: string;
                            1: string;
                        };
                    };
                    heading: string;
                };
                disclosureOfPersonalInfo: {
                    description: string;
                    heading: string;
                    legalProcess: {
                        description: string;
                        heading: string;
                    };
                };
                heading: string;
                moreInfo: {
                    changesToPolicy: {
                        description: {
                            para1: string;
                            para2: string;
                        };
                        heading: string;
                    };
                    contactUs: {
                        description: {
                            para1: string;
                        };
                        heading: string;
                    };
                    heading: string;
                    yourChoices: {
                        description: {
                            para1: string;
                            para2: string;
                        };
                        heading: string;
                    };
                };
                storageOfPersonalInfo: {
                    heading: string;
                    howLong: {
                        description: {
                            list1: {
                                0: string;
                                1: string;
                            };
                            para1: string;
                            para2: string;
                        };
                        heading: string;
                    };
                    requestRemoval: {
                        description: {
                            para1: string;
                            para2: string;
                        };
                        heading: string;
                    };
                    where: {
                        description: {
                            para1: string;
                            para2: string;
                        };
                        heading: string;
                    };
                };
                useOfPersonalInfo: {
                    description: {
                        list1: {
                            0: string;
                            1: string;
                            2: string;
                        };
                        para1: string;
                        para2: string;
                        subList1: {
                            heading: string;
                            list: {
                                0: string;
                                1: string;
                                2: string;
                            };
                        };
                        subList2: {
                            heading: string;
                            list: {
                                0: string;
                                1: string;
                            };
                        };
                    };
                    heading: string;
                };
                whatIsPersonalInfo: {
                    description: {
                        list1: {
                            0: string;
                            1: string;
                            2: string;
                            3: string;
                        };
                        list2: {
                            0: string;
                            1: string;
                            2: string;
                            3: string;
                        };
                        para1: string;
                        para2: string;
                    };
                    heading: string;
                };
            };
        };
        profile: {
            fields: {
                generic: {
                    default: string;
                };
                emails: string;
                profileUrl: string;
                nameFamilyName: string;
                nameGivenName: string;
                profileImage: string;
                phoneNumbers: string;
                userName: string;
            };
            forms: {
                generic: {
                    inputs: {
                        placeholder: string;
                        readonly: {
                            placeholder: string;
                            popup: string;
                        };
                        validations: {
                            empty: string;
                            invalidFormat: string;
                        };
                    };
                };
                emailChangeForm: {
                    inputs: {
                        email: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                invalidFormat: string;
                            };
                            note: string;
                        };
                    };
                };
                mobileChangeForm: {
                    inputs: {
                        mobile: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                invalidFormat: string;
                            };
                            note: string;
                        };
                    };
                };
                nameChangeForm: {
                    inputs: {
                        firstName: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                            };
                        };
                        lastName: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                            };
                        };
                    };
                };
                organizationChangeForm: {
                    inputs: {
                        organization: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                            };
                        };
                    };
                };
                countryChangeForm: {
                    inputs: {
                        country: {
                            placeholder: string;
                        };
                    };
                },
                dateChangeForm: {
                    inputs: {
                        date: {
                            validations: {
                                futureDateError : string;
                                invalidFormat: string;
                            };
                        };
                    };
                };
            };
            messages: {
                emailConfirmation: {
                    content: string;
                    header: string;
                };
                mobileVerification: {
                    content: string;
                };
            };
            notifications: {
                getProfileCompletion: Notification;
                getProfileInfo: Notification;
                getUserReadOnlyStatus: Notification;
                updateProfileInfo: Notification;
            };
            placeholders: {
                SCIMDisabled: {
                    heading: string;
                };
            };
        };
        profileExport: {
            notifications: {
                downloadProfileInfo: Notification;
            };
        };
        userAvatar: {
            infoPopover: string;
            urlUpdateHeader: string;
        };
        userSessions: {
            browserAndOS: string;
            dangerZones: {
                terminate: DangerZone;
            };
            lastAccessed: string;
            modals: {
                terminateAllUserSessionsModal: {
                    heading: string;
                    message: string;
                };
                terminateUserSessionModal: {
                    heading: string;
                    message: string;
                };
            };
            notifications: {
                fetchSessions: Notification;
                terminateAllUserSessions: Notification;
                terminateUserSession: Notification;
            };
        };
        mobileUpdateWizard: {
            submitMobile: {
                heading: string;
            };
            verifySmsOtp: {
                heading: string;
                generate: string;
                label: string;
                placeholder: string;
                error: string;
                requiredError: string;
            };
            done: string;
            notifications: {
                resendSuccess: {
                    message: string;
                };
                resendError: {
                    genericError: NotificationItem;
                    error: NotificationItem;
                };
            };
        };
    };
    modals: {
        editAvatarModal: ModalInterface;
        sessionTimeoutModal: {
            description: string;
            heading: string;
            content?: Record<string, unknown>;
            primaryButton: string;
            secondaryButton: string;
            loginAgainButton: string;
            sessionTimedOutHeading: string;
            sessionTimedOutDescription: string;
        };
    };
    pages: {
        applications: Page;
        overview: Page;
        personalInfo: Page;
        personalInfoWithoutLinkedAccounts: Page;
        personalInfoWithoutExportProfile: Page;
        privacy: Page;
        readOnlyProfileBanner: string;
        security: Page;
    };
    placeholders: {
        404: Placeholder;
        accessDeniedError: Placeholder;
        emptySearchResult: Placeholder;
        genericError: Placeholder;
        loginError: Placeholder;
        sessionStorageDisabled: Placeholder;
    };
    sections: {
        accountRecovery: {
            description: string;
            heading: string;
        };
        changePassword: {
            actionTitles: {
                change: string;
            };
            description: string;
            heading: string;
        };
        createPassword: {
            actionTitles: {
                create: string;
            };
            description: string;
            heading: string;
        };
        consentManagement: {
            actionTitles: {
                empty: string;
            };
            description: string;
            heading: string;
            placeholders: {
                emptyConsentList: {
                    heading: string;
                };
            };
        };
        linkedAccounts: {
            actionTitles: {
                add: string;
            };
            description: string;
            heading: string;
        };
        federatedAssociations: {
            description: string;
            heading: string;
        };
        mfa: {
            description: string;
            heading: string;
        };
        profile: {
            description: string;
            heading: string;
        };
        profileExport: {
            actionTitles: {
                export: string;
            };
            description: string;
            heading: string;
        };
        userSessions: {
            actionTitles: {
                empty: string;
                terminateAll: string;
            };
            description: string;
            heading: string;
            placeholders: {
                emptySessionList: {
                    heading: string;
                };
            };
        };
    };
}
