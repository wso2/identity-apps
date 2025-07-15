/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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
        verificationOnUpdate: {
            preference?: {
                notifications?: Notification;
            }
        }
        selfSignUp: {
            preference?: {
                notifications?: Notification;
            }
        },
        systemNotificationAlert: {
            resend: string;
            selfSignUp: {
                awaitingAccountConfirmation: string;
                notifications: {
                    resendSuccess: NotificationItem;
                    resendError: NotificationItem;
                }
            }
        }
        accountRecovery: {
            SMSRecovery: {
                descriptions: {
                    add: string;
                    update: string;
                    view: string;
                    emptyMobile: string;
                };
                forms: {
                    mobileResetForm: {
                        inputs: {
                            mobile: {
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
                    updateMobile: Notification;
                };
            };
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
                    emptyEmail: string;
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
                        invalidNewPassword: {
                            description: string;
                            message: string;
                        };
                        validationConfig: {
                            error: {
                                description: string;
                                message: string;
                            },
                            genericError: {
                                description: string;
                                message: string;
                            }
                        },
                        passwordCaseRequirement: string;
                        passwordCharRequirement: string;
                        passwordLowerCaseRequirement: string;
                        passwordUpperCaseRequirement: string;
                        passwordLengthRequirement: string,
                        passwordNumRequirement: string,
                        passwordUniqueChrRequirement: string;
                        passwordRepeatedChrRequirement: string;
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
            dropdown: {
                footer: {
                    cookiePolicy: string;
                    privacyPolicy: string;
                    termsOfService: string;
                };
            };
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
                noPassKeyMessage: string;
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
                        regenerateWarning: {
                            extended: string;
                            generic: string;
                        };
                        regenerateConfirmLabel: string;
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
            pushAuthenticatorApp: {
                description: string;
                configuredDescription:string;
                heading: string;
                hint: string;
                addHint: string;
                deleteHint: string;
                modals: {
                    scan: {
                        heading: string;
                        additionNote:string;
                        done: string;
                        messageBody: string;
                        subHeading: string;
                    };
                    deviceDeleteConfirmation: {
                        heading: string;
                        assertionHint: string;
                        description: string;
                        content: string;
                    }
                };
                notifications: {
                    initError: {
                        genericError: NotificationItem;
                        error: NotificationItem;
                    };
                    delete: {
                        genericError: NotificationItem;
                        error: NotificationItem;
                        success: NotificationItem;
                    };
                    deviceListFetchError: {
                        error: NotificationItem;
                    }
                };
            },
            backupCode: {
                actions: {
                    add: string;
                    delete: string;
                };
                description: string;
                download: {
                    heading: string;
                    info1: string;
                    info2: string;
                    subHeading: string;
                };
                heading: string;
                messages: {
                    disabledMessage: string;
                };
                modals: {
                    actions: {
                        download: string;
                        regenerate: string;
                        copy: string;
                        copied: string;
                    };
                    description: string;
                    delete: {
                        heading: string;
                        description: string;
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
                    subHeading: string;
                    warn: string;
                },
                mutedHeader: string;
                notifications: {
                    deleteError: {
                        error: NotificationItem;
                        genericError: NotificationItem;
                    };
                    deleteSuccess: {
                        genericMessage: string;
                        message: string;
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

                },
                remaining: string;
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
        profile: {
            actions: {
                verifyEmail: string;
                verifyMobile: string;
                deleteEmail: string;
                deleteMobile: string;
            }
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
                // Below is to allow all set of SCIM attributes.
                "Account Confirmed Time": string,
                "Account Disabled": string,
                "Account Locked": string,
                "Account State": string,
                "Active": string,
                "Address - Street": string,
                "Ask Password": string,
                "Backup Code Enabled": string,
                "Backup Codes": string,
                "Birth Date": string,
                "Country": string,
                "Created Time": string,
                "Disable EmailOTP": string,
                "Disable SMSOTP": string,
                "Display Name": string,
                "Email": string,
                "Email Verified": string,
                "Enabled Authenticators": string,
                "Existing Lite User": string,
                "External ID": string,
                "Failed Attempts Before Success": string,
                "Failed Backup Code Attempts": string,
                "Failed Email OTP Attempts": string,
                "Failed Lockout Count": string,
                "Failed Login Attempts": string,
                "Failed Password Recovery Attempts": string,
                "Failed SMS OTP Attempts": string,
                "Failed TOTP Attempts": string,
                "First Name": string,
                "Force Password Reset": string,
                "Full Name": string,
                "Gender": string,
                "Groups": string,
                "Identity Provider Type": string,
                "Last Logon": string,
                "Last Modified Time": string,
                "Last Name": string,
                "Last Password Update": string,
                "Lite User": string,
                "Lite User ID": string,
                "Local": string,
                "Local Credential Exists":string,
                "Locality": string,
                "Location": string,
                "Locked Reason": string,
                "Manager - Name": string,
                "Middle Name": string,
                "Mobile": string,
                "Nick Name": string,
                "Phone Verified": string,
                "Photo - Thumbnail": string,
                "Photo URL": string,
                "Postal Code": string,
                "Preferred Channel": string,
                "Read Only User": string,
                "Region": string,
                "Resource Type": string,
                "Roles": string,
                "Secret Key": string,
                "TOTP Enabled": string,
                "Time Zone": string,
                "URL": string,
                "Unlock Time": string,
                "User Account Type": string,
                "User ID": string,
                "User Metadata - Version": string,
                "User Source": string,
                "User Source ID": string,
                "Username": string,
                "Verification Pending Email": string,
                "Verification Pending Mobile Number": string,
                "Verify Email": string,
                "Verify Mobile": string,
                "Verify Secret Key": string,
                "Website URL": string,
                "Email Addresses": string,
                "Mobile Numbers": string,
                "Verified Email Addresses": string,
                "Verified Mobile Numbers": string,
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
            modals: {
                customMultiAttributeDeleteConfirmation: {
                    assertionHint: string;
                    content: string;
                    description: string;
                    heading: string;
                };
                emailAddressDeleteConfirmation: {
                    assertionHint: string;
                    content: string;
                    description: string;
                    heading: string;
                };
                mobileNumberDeleteConfirmation: {
                    assertionHint: string;
                    content: string;
                    description: string;
                    heading: string;
                };
            },
            notifications: {
                getProfileCompletion: Notification;
                getProfileInfo: Notification;
                getUserReadOnlyStatus: Notification;
                updateProfileInfo: Notification;
                verifyEmail: Notification;
                verifyMobile: Notification;
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
                terminateActiveUserSessionModal: {
                    heading: string;
                    message: string;
                    primaryAction: string;
                    secondaryAction: string;
                }
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
                didNotReceive: string;
                resend: string;
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
            verificationSent: {
                heading: string
            }
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
            emptyPlaceholderText: string;
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
