/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com).
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
    Confirmation,
    DangerZone,
    EditPage,
    FormAttributes,
    FormField,
    HelpPanelActionsInterface,
    HelpPanelInterface,
    InfoModal,
    Message,
    ModalInterface,
    Notification,
    NotificationItem,
    Page,
    Placeholder,
    Popup,
    TransferList,
    ValidationInterface
} from "../common";

/**
 * Model for the Console namespace
 */
export interface ConsoleNS {
    common: {
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
        cookieConsent: {
            content: string;
            confirmButton: string;
        };
        dateTime: {
            humanizedDateString: string;
        };
        header: {
            appSwitch: {
                console: AppSwitchItemInterface;
                myAccount: AppSwitchItemInterface;
                tooltip: string;
            };
            featureAnnouncements: {
                organizations: {
                    message: string;
                    buttons: {
                        tryout: string;
                    };
                };
            };
            organizationSwitch: {
                emptyOrgListMessage: string;
                orgSearchPlaceholder: string;
                breadcrumbError: NotificationItem;
            };
        },
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
        notifications: {
            invalidPEMFile: Notification;
        };
        placeholders: {
            404: Placeholder;
            accessDenied: Placeholder;
            brokenPage: Placeholder;
            consentDenied: Placeholder;
            genericError: Placeholder;
            loginError: Placeholder;
            sessionStorageDisabled: Placeholder;
            unauthorized: Placeholder;
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
        validations: {
            inSecureURL: ValidationInterface;
            unrecognizedURL: ValidationInterface;
        };
        sidePanel: {
            privacy: string;
            loginAndRegistration: {
                label: string,
                description: string,
            },
            userAttributesAndStores: string,
            userManagement: string,
            branding: string
        };
    };
    apiResources: {
        confirmations: {
            deleteAPIResource: {
                assertionHint: string;
                content: string;
                header: string;
                message: string;
            };
            deleteAPIResourcePermission: {
                assertionHint: string;
                content: string;
                header: string;
                message: string;
            };
        };
        tabs: {
            scopes: {
                button: string;
                label: string;
                title: string;
                subTitle: string;
                learnMore: string;
                search: string;
                empty: {
                    title: string;
                    subTitle: string;
                };
                emptySearch: {
                    title: string;
                    subTitle: {
                        0: string;
                        1: string;
                    },
                    viewAll: string;
                };
                copyPopupText: string;
                copiedPopupText: string;
                removeScopePopupText: string;
                form: {
                    button: string;
                    cancelButton: string;
                    submitButton: string;
                    title: string;
                    subTitle: string;
                    fields: {
                        displayName: {
                            emptyValidate: string;
                            label: string;
                            placeholder: string;
                        };
                        scope: {
                            emptyValidate: string;
                            label: string;
                            placeholder: string;
                        };
                        description: {
                            label: string;
                            placeholder: string;
                        };
                    };
                };
            };
        };
        wizard: {
            addApiResource: {
                steps: {
                    scopes: {
                        empty: {
                            title: string;
                            subTitle: string;
                        };
                        stepTitle: string;
                        form: {
                            button: string;
                            fields: {
                                displayName: {
                                    emptyValidate: string;
                                    label: string;
                                    placeholder: string;
                                    hint: string;
                                };
                                permission: {
                                    emptyValidate: string;
                                    uniqueValidate: string;
                                    invalid: string;
                                    label: string;
                                    placeholder: string;
                                    hint: string;
                                };
                                permissionList: {
                                    label: string;
                                }
                                description: {
                                    label: string;
                                    placeholder: string;
                                    hint: string;
                                };
                            };
                        };
                        removeScopePopupText: string;
                    };
                };
            };
        };
    };
    branding: {
        form: {
            actions: {
                save: string;
                resetAll: string;
            }
        };
        tabs: {
            text: {
                label: string;
            };
            preview: {
                label: string;
            }
        };
        screens: {
            common: string;
            login: string;
            "sms-otp": string;
            "email-otp": string;
            "email-template": string;
            "sign-up": string;
            "totp": string;
            myaccount: string;
        }
    };
    brandingCustomText: {
        revertScreenConfirmationModal: {
            content: string;
            heading: string;
            message: string;
        };
        revertUnsavedConfirmationModal: {
            content: string;
            heading: string;
            message: string;
        };
        form: {
            genericFieldResetTooltip: string;
            genericFieldPlaceholder: string;
            fields: {
                copyright: {
                    hint: string;
                };
                "site.title": {
                    hint: string;
                };
                "login.button": {
                    hint: string;
                };
                "login.heading": {
                    hint: string;
                };
                "sms.otp.heading": {
                    hint: string;
                };
                "email.otp.heading": {
                    hint: string;
                };
                "totp.heading": {
                    hint: string;
                };
                "sign.up.button": {
                    hint: string;
                };
                "sign.up.heading": {
                    hint: string;
                };
            }
        };
        localeSelectDropdown: {
            label: string;
            placeholder: string;
        };
        modes: {
            text: {
                label: string;
            };
            json: {
                label: string;
            }
        };
        notifications: {
            getPreferenceError: {
                description: string;
                message: string;
            };
            revertError: {
                description: string;
                message: string;
            };
            resetSuccess: {
                description: string;
                message: string;
            };
            updateError: {
                description: string;
                message: string;
            };
            updateSuccess: {
                description: string;
                message: string;
            };
        };
        screenSelectDropdown: {
            label: string;
            placeholder: string;
        };
    };
    consoleSettings: {
        administrators: {
            edit: {
                backButton: string;
            };
            tabLabel: string;
        };
        loginFlow: {
            tabLabel: string;
        };
        protocol: {
            tabLabel: string;
        };
        roles: {
            tabLabel: string;
            permissionLevels: {
                edit: string;
                view: string;
            };
        };
    };
    featureGate: {
        enabledFeatures: {
            tags: {
                premium: {
                    warning: string
                }
            }
        }
    };
    develop: {
        features: {
            URLInput: {
                withLabel: {
                    positive: {
                        header: string;
                        content: string;
                        detailedContent: {
                            0: string;
                            1: string;
                        };
                    };
                    negative: {
                        header: string;
                        content: string;
                        detailedContent: {
                            0: string;
                            1: string;
                        };
                        leftAction: string;
                    };
                };
            };
            applications: {
                addWizard: {
                    steps: {
                        generalSettings: {
                            heading: string;
                        };
                        protocolConfig: {
                            heading: string;
                        };
                        protocolSelection: {
                            heading: string;
                        };
                        summary: {
                            heading: string;
                            sections: {
                                accessURL: {
                                    heading: string;
                                };
                                applicationQualifier: {
                                    heading: string;
                                };
                                assertionURLs: {
                                    heading: string;
                                };
                                audience: {
                                    heading: string;
                                };
                                callbackURLs: {
                                    heading: string;
                                };
                                certificateAlias: {
                                    heading: string;
                                };
                                discoverable: {
                                    heading: string;
                                };
                                grantType: {
                                    heading: string;
                                };
                                issuer: {
                                    heading: string;
                                };
                                metaFile: {
                                    heading: string;
                                };
                                metadataURL: {
                                    heading: string;
                                };
                                public: {
                                    heading: string;
                                };
                                realm: {
                                    heading: string;
                                };
                                renewRefreshToken: {
                                    heading: string;
                                };
                                replyTo: {
                                    heading: string;
                                };
                            };
                        };
                    };
                };
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
                confirmations: {
                    addSocialLogin: Popup;
                    changeProtocol: Confirmation;
                    deleteApplication: Confirmation;
                    deleteChoreoApplication: Confirmation;
                    deleteOutboundProvisioningIDP: Confirmation;
                    deleteProtocol: Confirmation;
                    handlerAuthenticatorAddition: Confirmation;
                    backupCodeAuthenticatorDelete: Confirmation;
                    lowOIDCExpiryTimes: Confirmation;
                    regenerateSecret: Confirmation;
                    reactivateSPA: Confirmation;
                    reactivateOIDC: Confirmation;
                    removeApplicationUserAttribute: Popup;
                    removeApplicationUserAttributeMapping: Popup;
                    revokeApplication: Confirmation;
                    clientSecretHashDisclaimer: {
                        modal: Confirmation;
                        forms: {
                           clientIdSecretForm: {
                               clientId: FormAttributes;
                               clientSecret: FormAttributes;
                           };
                        };
                    };
                    certificateDelete: Confirmation & Record<string, string>;
                };
                dangerZoneGroup: {
                    header: string;
                    deleteApplication: DangerZone;
                };
                edit: {
                    sections: {
                        access: {
                            addProtocolWizard: {
                                heading: string;
                                subHeading: string;
                                steps: {
                                    protocolSelection: {
                                        manualSetup: {
                                            emptyPlaceholder: Placeholder;
                                            heading: string;
                                            subHeading: string;
                                        };
                                        quickSetup: {
                                            emptyPlaceholder: Placeholder;
                                            heading: string;
                                            subHeading: string;
                                        };
                                    };
                                };
                            };
                            tabName: string;
                            protocolLanding: {
                                heading: string;
                                subHeading: string;
                            }
                        };
                        advanced: {
                            tabName: string;
                        };
                        attributes: {
                            forms: {
                                fields: {
                                    dynamic: {
                                        localRole: FormAttributes;
                                        applicationRole: FormAttributes;
                                    };
                                };
                            };
                            selection: {
                                addWizard: {
                                    header: string;
                                    subHeading: string;
                                    steps: {
                                        select: {
                                            transfer: TransferList;
                                        };
                                    };
                                };
                                heading: string;
                                scopelessAttributes: {
                                    description: string;
                                    displayName: string;
                                    name: string;
                                    hint: string;
                                },
                                selectedScopesComponentHint: string;
                                howToUseScopesHint: string;
                                attributeComponentHint: string;
                                attributeComponentHintAlt: string;
                                description: string;
                                mandatoryAttributeHint: string;
                                mappingTable: {
                                    actions: {
                                        enable: string;
                                    };
                                    columns: {
                                        appAttribute: string;
                                        attribute: string;
                                        mandatory: string;
                                        requested: string;
                                    };
                                    mappedAtributeHint: string;
                                    mappingRevert: {
                                        confirmationHeading: string;
                                        confirmationMessage: string;
                                        confirmationContent: string;
                                        confirmPrimaryAction: string;
                                        confirmSecondaryAction: string;
                                    };
                                    listItem: {
                                        actions: {
                                            makeMandatory: string;
                                            makeRequested: string;
                                            makeScopeRequested: string;
                                            removeMandatory: string;
                                            removeRequested: string;
                                            removeScopeRequested: string;
                                            subjectDisabledSelection: string;
                                        };
                                        faultyAttributeMapping: string;
                                        faultyAttributeMappingHint: string;
                                        fields: {
                                            claim: FormAttributes;
                                        };
                                    };
                                    searchPlaceholder: string;
                                };
                                selectAll: string;
                            };
                            attributeMappingChange: Notification;
                            emptySearchResults: {
                                subtitles: {
                                    0: string,
                                    1: string
                                },
                                title: string;
                            },
                            roleMapping: {
                                heading: string;
                            };
                            tabName: string;
                        };
                        info: {
                            oidcHeading: string;
                            oidcSubHeading: string;
                            samlHeading: string;
                            samlSubHeading: string;
                            wsFedHeading: string;
                            wsFedSubHeading: string;
                            tabName: string;
                        };
                        general: {
                            tabName: string;
                        };
                        protocol: {
                            title: string;
                            subtitle: string;
                            button: string;
                        };
                        provisioning: {
                            tabName: string;
                            inbound: {
                                heading: string;
                                subHeading: string;
                            };
                            outbound: {
                                actions: {
                                    addIdp: string;
                                };
                                addIdpWizard: {
                                    heading: string;
                                    subHeading: string;
                                    steps: {
                                        details: string;
                                    };
                                    errors: {
                                        noProvisioningConnector: string;
                                    };
                                };
                                heading: string;
                                subHeading: string;
                            };
                        };
                        signOnMethod: {
                            tabName: string;
                            sections: {
                                authenticationFlow: {
                                    heading: string;
                                    sections: {
                                        scriptBased: {
                                            accordion: {
                                                title: {
                                                    description: string;
                                                    heading: string;
                                                };
                                            };
                                            conditionalAuthTour: {
                                                steps: {
                                                    0: {
                                                        heading: string;
                                                        content: {
                                                            0: string;
                                                            1: string;
                                                        };
                                                    };
                                                    1: {
                                                        heading: string;
                                                        content: {
                                                            0: string;
                                                        };
                                                    };
                                                    2: {
                                                        heading: string;
                                                        content: {
                                                            0: string;
                                                        };
                                                    };
                                                };
                                            },
                                            heading: string;
                                            hint: string;
                                            editor: {
                                                apiDocumentation: string;
                                                changeConfirmation: {
                                                    content: string;
                                                    heading: string;
                                                    message: string;
                                                };
                                                goToApiDocumentation: string;
                                                resetConfirmation: {
                                                    content: string;
                                                    heading: string;
                                                    message: string;
                                                };
                                                templates: {
                                                    heading: string;
                                                    darkMode: string;
                                                };
                                            };
                                            secretsList: {
                                                create: string;
                                                emptyPlaceholder: string;
                                                search: string;
                                                tooltips: {
                                                    keyIcon: string;
                                                    plusIcon: string;
                                                }
                                            }
                                        };
                                        stepBased: {
                                            actions: {
                                                addAuthentication: string;
                                                addNewStep: string;
                                                addStep: string;
                                                selectAuthenticator: string;
                                            };
                                            addAuthenticatorModal: ModalInterface;
                                            heading: string;
                                            hint: string;
                                            forms: {
                                                fields: {
                                                    attributesFrom: FormAttributes;
                                                    subjectIdentifierFrom: FormAttributes;
                                                    enableBackupCodes: FormAttributes;
                                                };
                                            };
                                            secondFactorDisabled: string;
                                            secondFactorDisabledDueToProxyMode: string;
                                            secondFactorDisabledInFirstStep: string;
                                            backupCodesDisabled: string;
                                            backupCodesDisabledInFirstStep: string;
                                            authenticatorDisabled: string;
                                            firstFactorDisabled: string;
                                            federatedSMSOTPConflictNote: {
                                                multipleIdps: string;
                                                singleIdp: string;
                                            };
                                            sessionExecutorDisabledInFirstStep: string;
                                            sessionExecutorDisabledInMultiOptionStep: string;
                                        };
                                    };
                                };
                                customization: {
                                    heading: string;
                                    revertToDefaultButton: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                                landing: {
                                    defaultConfig: {
                                        description: {
                                            0: string;
                                            1: string;
                                        },
                                        heading: string;
                                    },
                                    flowBuilder: {
                                        addMissingSocialAuthenticatorModal: ModalInterface;
                                        duplicateSocialAuthenticatorSelectionModal: ModalInterface;
                                        heading: string;
                                        headings: {
                                            default: string;
                                            socialLogin: string;
                                            multiFactorLogin: string;
                                            passwordlessLogin: string;
                                        }
                                        types: {
                                            apple: {
                                                description: string;
                                                heading: string;
                                            },
                                            defaultConfig: {
                                                description: string;
                                                heading: string;
                                            },
                                            facebook: {
                                                description: string;
                                                heading: string;
                                            },
                                            github: {
                                                description: string;
                                                heading: string;
                                            },
                                            google: {
                                                description: string;
                                                heading: string;
                                            },
                                            idf: {
                                                tooltipText: string;
                                            },
                                            totp: {
                                                description: string;
                                                heading: string;
                                            },
                                            usernameless: {
                                                description: string;
                                                heading: string;
                                                info: string;
                                            },
                                            passkey: {
                                                description: string;
                                                heading: string;
                                                info: {
                                                    progressiveEnrollmentEnabled: string;
                                                    passkeyAsFirstStepWhenprogressiveEnrollmentEnabled: string;
                                                    passkeyIsNotFirstStepWhenprogressiveEnrollmentEnabled: string;
                                                    progressiveEnrollmentEnabledCheckbox: string;
                                                    progressiveEnrollmentDisabled: string;
                                                }
                                            }
                                            magicLink: {
                                                description: string;
                                                heading: string;
                                            },
                                            microsoft: {
                                                description: string;
                                                heading: string;
                                            },
                                            emailOTP: {
                                                description: string,
                                                heading: string,
                                            },
                                            smsOTP: {
                                                description: string;
                                                heading: string;
                                            },
                                            emailOTPFirstFactor: {
                                                description: string;
                                                heading: string;
                                            }
                                        }
                                    }
                                },
                                requestPathAuthenticators: {
                                    title: string;
                                    subTitle: string;
                                    notifications: {
                                        getRequestPathAuthenticators: Notification;
                                    };
                                };
                                templateDescription: {
                                    popupContent: string;
                                    description: {
                                        prerequisites: string;
                                        parameters: string;
                                        description: string;
                                        defaultSteps: string;
                                        helpReference: string;
                                        code: string;
                                    };
                                };
                            };
                        };
                        sharedAccess: {
                            subTitle: string;
                            tabName: string;
                        };
                        shareApplication: {
                            heading: string;
                            shareApplication: string;
                            addSharingNotification: Notification;
                            stopSharingNotification: Notification;
                            getSharedOrganizations: Notification;
                            stopAllSharingNotification: Notification;
                        };
                        apiAuthorization: {
                            m2mPolicyMessage: string;
                        };
                        roles: {
                            createApplicationRoleWizard: {
                                title: string;
                                subTitle: string;
                                button: string;
                            };
                        }
                    };
                };
                forms: {
                    advancedAttributeSettings: {
                        sections: {
                            linkedAccounts: {
                                errorAlert: {
                                    message: string;
                                    description: string;
                                }
                                heading: string;
                                fields: {
                                    validateLocalAccount: FormAttributes;
                                    mandateLocalAccount: FormAttributes;
                                }
                            }
                            subject: {
                                fields: {
                                    subjectAttribute: FormAttributes;
                                    subjectIncludeTenantDomain: FormAttributes;
                                    subjectIncludeUserDomain: FormAttributes;
                                    subjectUseMappedLocalSubject: FormAttributes;
                                    subjectType: FormAttributes;
                                    sectorIdentifierURI: FormAttributes;
                                };
                                heading: string;
                            };
                            role: {
                                heading: string;
                                fields: {
                                    roleAttribute: FormAttributes;
                                    role: FormAttributes;
                                };
                            };
                        };
                    };
                    advancedConfig: {
                        fields: {
                            enableAuthorization: FormAttributes;
                            returnAuthenticatedIdpList: FormAttributes;
                            saas: FormAttributes;
                            skipConsentLogin: FormAttributes;
                            skipConsentLogout: FormAttributes;
                        };
                        sections: {
                            applicationNativeAuthentication: {
                                heading: string;
                                alerts: {
                                    clientAttestation: string;
                                },
                                fields: {
                                    enableAPIBasedAuthentication: FormAttributes;
                                    enableClientAttestation: FormAttributes;
                                    android: {
                                        heading: string;
                                        fields: {
                                            androidPackageName: FormAttributes;
                                            androidAttestationServiceCredentials: FormAttributes;
                                        }
                                    },
                                    apple: {
                                        heading: string;
                                        fields: {
                                            appleAppId: FormAttributes;
                                        }
                                    }
                                }
                            },
                            certificate: {
                                heading: string;
                                hint?: {
                                    customOidc: string;
                                    customSaml: string;
                                };
                                fields: {
                                    jwksValue: FormAttributes;
                                    pemValue: FormAttributes;
                                    type: FormAttributes;
                                };
                                invalidOperationModal?: {
                                    header: string;
                                    message: string;
                                };
                            };
                        };
                    };
                    generalDetails: {
                        fields: {
                            name: FormAttributes;
                            description: FormAttributes;
                            imageUrl: FormAttributes;
                            discoverable: FormAttributes;
                            accessUrl: FormAttributes;
                            isSharingEnabled: FormAttributes;
                            isManagementApp: FormAttributes;
                            isFapiApp: FormAttributes;
                        };
                        managementAppBanner: string;

                    };
                    inboundCustom: {
                        fields: {
                            checkbox: FormAttributes;
                            dropdown: FormAttributes;
                            generic: FormAttributes;
                            password: FormAttributes;
                        };
                    };
                    inboundOIDC: {
                        description: string;
                        documentation: string;
                        fields: {
                            allowedOrigins: FormAttributes;
                            callBackUrls: FormAttributes;
                            clientID: FormAttributes;
                            clientSecret: FormAttributes;
                            grant: FormAttributes;
                            public: FormAttributes;
                        };
                        mobileApp: {
                            discoverableHint: string;
                            mobileAppPlaceholder: string;
                        },
                        dropdowns: {
                            selectOption: string;
                        },
                        sections: {
                            accessToken: {
                                heading: string;
                                hint: string;
                                fields: {
                                    bindingType: FormAttributes;
                                    expiry: FormAttributes;
                                    applicationTokenExpiry: FormAttributes;
                                    type: FormAttributes;
                                    revokeToken: FormAttributes;
                                    validateBinding: FormAttributes;
                                    audience: FormAttributes;
                                };
                            };
                            idToken: {
                                heading: string;
                                fields: {
                                    expiry: FormAttributes;
                                    algorithm: FormAttributes;
                                    audience: FormAttributes;
                                    encryption: FormAttributes;
                                    signing: FormAttributes;
                                    method: FormAttributes;
                                };
                            };
                            logoutURLs: {
                                heading: string;
                                fields: {
                                    back: FormAttributes;
                                    front: FormAttributes;
                                };
                            };
                            pkce: {
                                description: string;
                                heading: string;
                                hint: string;
                                fields: {
                                    pkce: FormAttributes;
                                };
                            };
                            clientAuthentication: {
                                heading: string;
                                fields: {
                                    authenticationMethod: FormAttributes;
                                    signingAlgorithm: FormAttributes;
                                    subjectDN: FormAttributes;
                                };
                            };
                            pushedAuthorization: {
                                heading: string;
                                fields: {
                                    requirePushAuthorizationRequest: FormAttributes;
                                };
                            };
                            requestObject: {
                                heading: string;
                                fields: {
                                    requestObjectSigningAlg: FormAttributes;
                                    requestObjectEncryptionAlgorithm: FormAttributes;
                                    requestObjectEncryptionMethod: FormAttributes;
                                };
                            };
                            refreshToken: {
                                heading: string;
                                fields: {
                                    expiry: FormAttributes;
                                    renew: FormAttributes;
                                };
                            };
                            requestObjectSignature: {
                                heading: string;
                                description: string;
                                fields: {
                                    signatureValidation: FormAttributes;
                                };
                            };
                            scopeValidators: {
                                heading: string;
                                fields: {
                                    validator: FormAttributes;
                                };
                            };
                            certificates: {
                                disabledPopup: string;
                            }
                        };
                        messages: {
                            revokeDisclaimer: Message;
                            customInvalidMessage: string;
                        };
                    };
                    inboundSAML: {
                        description: string;
                        documentation: string;
                        fields: {
                            assertionURLs: FormAttributes;
                            defaultAssertionURL: FormAttributes;
                            idpEntityIdAlias: FormAttributes;
                            issuer: FormAttributes;
                            metaURL: FormAttributes;
                            mode: FormAttributes;
                            qualifier: FormAttributes;
                        };
                        sections: {
                            assertion: {
                                heading: string;
                                fields: {
                                    audience: FormAttributes;
                                    nameIdFormat: FormAttributes;
                                    recipients: FormAttributes;
                                };
                            };
                            attributeProfile: {
                                heading: string;
                                fields: {
                                    enable: FormAttributes;
                                    includeAttributesInResponse: FormAttributes;
                                    serviceIndex: FormAttributes;
                                };
                            };
                            encryption: {
                                heading: string;
                                fields: {
                                    assertionEncryption: FormAttributes;
                                    assertionEncryptionAlgorithm: FormAttributes;
                                    keyEncryptionAlgorithm: FormAttributes;
                                };
                            };
                            idpInitiatedSLO: {
                                heading: string;
                                fields: {
                                    enable: FormAttributes;
                                    returnToURLs: FormAttributes;
                                };
                            };
                            responseSigning: {
                                heading: string;
                                fields: {
                                    digestAlgorithm: FormAttributes;
                                    responseSigning: FormAttributes;
                                    signingAlgorithm: FormAttributes;
                                };
                            };
                            requestProfile: {
                                heading: string;
                                fields: {
                                    enable: FormAttributes;
                                };
                            };
                            requestValidation: {
                                heading: string;
                                fields: {
                                    signatureValidation: FormAttributes;
                                    signatureValidationCertAlias: FormAttributes;
                                };
                            };
                            sloProfile: {
                                heading: string;
                                fields: {
                                    enable: FormAttributes;
                                    logoutMethod: FormAttributes;
                                    requestURL: FormAttributes;
                                    responseURL: FormAttributes;
                                };
                            };
                            ssoProfile: {
                                heading: string;
                                fields: {
                                    artifactBinding: FormAttributes;
                                    bindings: FormAttributes;
                                    idpInitiatedSSO: FormAttributes;
                                };
                            };
                            certificates: {
                                disabledPopup: string;
                                certificateRemoveConfirmation: {
                                    header: string;
                                    content: string;
                                }
                            }
                        };
                    };
                    inboundSTS: {
                        fields: {
                            realm: FormAttributes;
                            replyTo: FormAttributes;
                            replyToLogout: FormAttributes;
                        };
                    };
                    inboundWSTrust: {
                        fields: {
                            audience: FormAttributes;
                            certificateAlias: FormAttributes;
                        };
                    };
                    outboundProvisioning: {
                        fields: {
                            blocking: FormAttributes;
                            connector: FormAttributes;
                            idp: FormAttributes;
                            jit: FormAttributes;
                            rules: FormAttributes;
                        };
                    };
                    provisioningConfig: {
                        fields: {
                            proxyMode: FormAttributes;
                            userstoreDomain: FormAttributes;
                        };
                    };
                    spaProtocolSettingsWizard: {
                        fields: {
                            callBackUrls: FormAttributes;
                            name: FormAttributes;
                            urlDeepLinkError: string;
                        };
                    };
                };
                helpPanel: HelpPanelInterface;
                list: {
                    columns: {
                        actions: string;
                        name: string;
                        inboundKey: string;
                    };
                    actions: {
                        add: string;
                        predefined: string;
                        custom: string;
                    };
                    labels: {
                        fragment: string;
                    }
                };
                myaccount: {
                    title: string;
                    description: string;
                    popup: string;
                    enable: {
                        0: string;
                        1: string;
                    };
                    Confirmation: {
                        enableConfirmation: {
                            content: string;
                            heading: string;
                            message: string;
                        };
                        disableConfirmation: {
                            content: string;
                            heading: string;
                            message: string;
                        };
                    };
                    notifications: {
                        error: {
                            description: string;
                            message: string;
                        };
                        genericError: {
                            description: string;
                            message: string;
                        };
                        success: {
                            description: string;
                            message: string;
                        };
                    };
                    fetchMyAccountStatus: {
                        error: {
                            description: string;
                            message: string;
                        },
                        genericError: {
                            description: string;
                            message: string;
                        },
                    }
                };
                notifications: {
                    addApplication: Notification;
                    apiLimitReachedError: Notification;
                    authenticationStepMin: Notification;
                    authenticationStepDeleteErrorDueToSecondFactors: Notification;
                    authenticationStepDeleteErrorDueToAppShared: Notification;
                    deleteApplication: Notification;
                    deleteOptionErrorDueToSecondFactorsOnRight: Notification;
                    deleteProtocolConfig: Notification;
                    duplicateAuthenticationStep: Notification;
                    emptyAuthenticationStep: Notification;
                    fetchAllowedCORSOrigins: Notification;
                    fetchApplication: Notification;
                    fetchMyAccountApplication: Notification;
                    fetchApplications: Notification;
                    fetchCustomInboundProtocols: Notification;
                    fetchInboundProtocols: Notification;
                    fetchProtocolMeta: Notification;
                    fetchSAMLIDPConfigs: Notification;
                    fetchOIDCIDPConfigs: Notification;
                    fetchTemplate: Notification;
                    fetchTemplates: Notification;
                    getInboundProtocolConfig: Notification;
                    regenerateSecret: Notification;
                    revokeApplication: Notification;
                    tierLimitReachedError: {
                        emptyPlaceholder: Placeholder;
                        heading: string;
                    };
                    updateAdvancedConfig: Notification;
                    updateApplication: Notification;
                    updateAuthenticationFlow: Notification;
                    updateClaimConfig: Notification;
                    updateInboundProtocolConfig: Notification;
                    updateInboundProvisioningConfig: Notification;
                    updateOutboundProvisioning: Notification;
                    updateProtocol: Notification;
                    fetchOIDCServiceEndpoints: Notification;
                    secondFactorAuthenticatorToFirstStep: Notification;
                    firstFactorAuthenticatorToSecondStep: Notification;
                    conditionalScriptLoopingError: NotificationItem;
                    deleteCertificateSuccess: NotificationItem;
                    deleteCertificateGenericError: NotificationItem;
                    updateOnlyIdentifierFirstError: NotificationItem;
                    updateIdentifierFirstInFirstStepError: NotificationItem;
                };
                popups: {
                    appStatus: {
                        active: Popup;
                        notConfigured: Popup;
                        revoked: Popup;
                    };
                };
                placeholders: {
                    emptyAttributesList: Placeholder;
                    emptyAuthenticatorStep: Placeholder;
                    emptyAuthenticatorsList: Placeholder;
                    emptyOutboundProvisioningIDPs: Placeholder;
                    emptyList: Placeholder;
                    emptyProtocolList: Placeholder;
                };
                templates: {
                    manualSetup: {
                        heading: string;
                        subHeading: string;
                    };
                    quickSetup: {
                        heading: string;
                        subHeading: string;
                    };
                };
                wizards: {
                    minimalAppCreationWizard: {
                        help: {
                            heading: string;
                            subHeading: string;
                            template : FormAttributes;
                        };
                    };
                    applicationCertificateWizard: {
                        heading: string;
                        subHeading: string;
                        emptyPlaceHolder: {
                            title: string;
                            description1: string;
                            description2: string;
                        }
                    }
                };
            }
            authenticationProvider?: {
                advancedSearch?: {
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
                buttons?: {
                    addIDP: string;
                    addAuthenticator: string;
                    addConnector: string;
                    addAttribute: string;
                    addCertificate: string;
                };
                confirmations?: {
                    deleteIDP: Confirmation;
                    deleteIDPWithConnectedApps: Confirmation;
                    deleteAuthenticator: Confirmation;
                    deleteConnector: Confirmation;
                    deleteCertificate: Confirmation;
                };
                dangerZoneGroup?: {
                    header: string;
                    disableIDP: DangerZone;
                    deleteIDP: DangerZone;
                };
                edit?: {
                    common: {
                        settings: {
                            tabName: string;
                        };
                    };
                    emailOTP: {
                        emailTemplate: {
                            tabName: string;
                        };
                    };
                    smsOTP: {
                        smsProvider: {
                            tabName: string;
                        };
                    };
                };
                forms?: {
                    advancedConfigs: {
                        federationHub: FormAttributes;
                        homeRealmIdentifier: FormAttributes;
                        alias: FormAttributes;
                        certificateType: {
                            label: string;
                            hint: string;
                            certificatePEM: FormAttributes;
                            certificateJWKS: FormAttributes;
                        };
                    };
                    attributeSettings: {
                        attributeMapping: {
                            attributeColumnHeader: string;
                            attributeMapColumnHeader: string;
                            attributeMapInputPlaceholderPrefix: string;
                            componentHeading: string;
                            hint: string;
                        };
                        attributeProvisioning: {
                            attributeColumnHeader: {
                                0: string;
                                1: string;
                            };
                            attributeMapColumnHeader: string;
                            attributeMapInputPlaceholderPrefix: string;
                            componentHeading: string;
                            hint: string;
                        };
                        attributeListItem: {
                            validation: {
                                empty: string;
                            };
                        };
                        attributeSelection: {
                            searchAttributes: {
                                placeHolder: string;
                            };
                        };
                    };
                    authenticatorAccordion: {
                        default: {
                            0: string;
                            1: string;
                        };
                        enable: {
                            0: string;
                            1: string;
                        };
                    };
                    authenticatorSettings: {
                        apple: {
                            additionalQueryParameters: FormAttributes;
                            callbackUrl: FormAttributes;
                            clientId: FormAttributes;
                            keyId: FormAttributes;
                            privateKey: FormAttributes;
                            secretValidityPeriod: FormAttributes;
                            scopes: {
                                heading: string;
                                hint: string;
                                list: {
                                    email: {
                                        description: string;
                                    };
                                    name: {
                                        description: string;
                                    };
                                };
                            };
                            teamId: FormAttributes;
                        };
                        emailOTP: {
                            enableBackupCodes: {
                                hint: string;
                                label: string;
                                validations: {
                                    required: string;
                                };
                            };
                            expiryTime: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    invalid: string;
                                    range: string;
                                    required: string;
                                };
                                unit: string;
                            };
                            tokenLength: {
                                hint: string;
                                label: string;
                                unit: {
                                    digits: string;
                                    characters: string;
                                },
                                placeholder: string;
                                validations: {
                                    invalid: string;
                                    range: {
                                        digits: string;
                                        characters: string;
                                    };
                                    required: string;
                                };
                            };
                            useNumericChars: {
                                hint: string;
                                label: string;
                                validations: {
                                    required: string;
                                };
                            };
                        };
                        smsOTP: {
                            expiryTime: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    invalid: string;
                                    range: string;
                                    required: string;
                                };
                                unit: string;
                            };
                            tokenLength: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    invalid: string;
                                    range: {
                                        digits: string;
                                        characters: string;
                                    };
                                    required: string;
                                };
                                unit: {
                                    digits: string;
                                    characters: string;
                                }
                            };
                            useNumericChars: {
                                hint: string;
                                label: string;
                                validations: {
                                    required: string;
                                };
                            };
                            allowedResendAttemptCount: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                    invalid: string;
                                    range: string;
                                };
                            };
                        };
                        fido2: {
                            allowProgressiveEnrollment: {
                                hint: string;
                                label: string;
                            };
                            allowUsernamelessAuthentication: {
                                hint: string;
                                label: string;
                            };
                        };
                        facebook: {
                            callbackUrl: FormAttributes;
                            clientId: FormAttributes;
                            clientSecret: FormAttributes;
                            scopes: {
                                heading: string;
                                hint: string;
                                list: {
                                    email: {
                                        description: string;
                                    },
                                    profile: {
                                        description: string;
                                    }
                                }
                            };
                            userInfo: {
                                heading: string;
                                hint: string;
                                placeholder: string;
                                list: {
                                    ageRange: {
                                        description: string;
                                    },
                                    email: {
                                        description: string;
                                    },
                                    firstName: {
                                        description: string;
                                    },
                                    gender: {
                                        description: string;
                                    }
                                    id: {
                                        description: string;
                                    },
                                    lastName: {
                                        description: string;
                                    },
                                    link: {
                                        description: string;
                                    },
                                    name: {
                                        description: string;
                                    }
                                }
                            };
                        };
                        github: {
                            callbackUrl: FormAttributes;
                            clientId: FormAttributes;
                            clientSecret: FormAttributes;
                            scopes: {
                                heading: string;
                                hint: string;
                                list: {
                                    email: {
                                        description: string;
                                    },
                                    profile: {
                                        description: string;
                                    }
                                }
                            };
                        };
                        google: {
                            callbackUrl: FormAttributes;
                            clientId: FormAttributes;
                            clientSecret: FormAttributes;
                            enableGoogleOneTap: FormAttributes;
                            AdditionalQueryParameters: FormAttributes;
                            scopes: {
                                heading: string;
                                hint: string;
                                list: {
                                    email: {
                                        description: string;
                                    },
                                    openid: {
                                        description: string;
                                    },
                                    profile: {
                                        description: string;
                                    }
                                }
                            };
                        };
                        microsoft: {
                            callbackUrl: FormAttributes;
                            clientId: FormAttributes;
                            clientSecret: FormAttributes;
                            commonAuthQueryParams: FormAttributes;
                            scopes: {
                                ariaLabel: string,
                                heading: string;
                                hint: string;
                                label: string;
                                list: {
                                    email: {
                                        description: string;
                                    },
                                    openid: {
                                        description: string;
                                    },
                                    profile: {
                                        description: string;
                                    }
                                }
                                placeholder: string;
                            };
                        };
                        hypr: {
                            appId: FormAttributes;
                            apiToken: FormAttributes;
                            baseUrl: FormAttributes;
                        };
                        saml: {
                            AuthRedirectUrl: FormAttributes;
                            SPEntityId: FormAttributes;
                            SSOUrl: FormAttributes;
                            IdPEntityId: FormAttributes;
                            NameIDType: FormAttributes;
                            RequestMethod: FormAttributes;
                            IsSLORequestAccepted: FormAttributes;
                            IsLogoutEnabled: FormAttributes;
                            LogoutReqUrl: FormAttributes;
                            IsAuthnRespSigned: FormAttributes;
                            IsLogoutReqSigned: FormAttributes;
                            ISAuthnReqSigned: FormAttributes;
                            SignatureAlgorithm: FormAttributes;
                            DigestAlgorithm: FormAttributes;
                            IncludeProtocolBinding: FormAttributes;
                            IsUserIdInClaims: FormAttributes;
                            commonAuthQueryParams: FormAttributes;

                            isAssertionSigned: FormAttributes;
                            includeCert: FormAttributes;
                            includeNameIDPolicy: FormAttributes;
                            isEnableAssertionEncryption: FormAttributes;

                            authenticationContextClass: FormAttributes;
                            customAuthenticationContextClass: FormAttributes;
                            attributeConsumingServiceIndex: FormAttributes;

                            isArtifactBindingEnabled: FormAttributes;
                            artifactResolveEndpointUrl: FormAttributes;
                            isArtifactResolveReqSigned: FormAttributes;
                            isArtifactResponseSigned: FormAttributes;
                            authContextComparisonLevel: FormAttributes;
                        }
                    },
                    outboundConnectorAccordion: {
                        default: {
                            0: string;
                            1: string;
                        };
                        enable: {
                            0: string;
                            1: string;
                        };
                    };
                    common: {
                        requiredErrorMessage: string;
                        invalidURLErrorMessage: string;
                        invalidQueryParamErrorMessage: string;
                        invalidScopesErrorMessage: string;
                        customProperties: string;
                    };
                    generalDetails: {
                        name: FormAttributes;
                        issuer: FormAttributes;
                        alias: FormAttributes;
                        description: FormAttributes;
                        image: FormAttributes;
                    };
                    jitProvisioning: {
                        enableJITProvisioning: FormAttributes;
                        provisioningUserStoreDomain: FormAttributes;
                        provisioningScheme: {
                            hint: string;
                            label: string;
                            children: {
                                0: string;
                                1: string;
                                2: string;
                                3: string;
                            };
                        };
                        associateLocalUser: FormAttributes;
                    };
                    roleMapping: {
                        heading: string;
                        keyName: string;
                        valueName: string;
                        validation: {
                            keyRequiredMessage: string;
                            valueRequiredErrorMessage: string;
                            duplicateKeyErrorMsg: string;
                        };
                        hint: string;
                    };
                    uriAttributeSettings: {
                        subject: {
                            heading: string;
                            hint: string;
                            placeHolder: string;
                            label: string;
                            validation: {
                                empty: string;
                            };
                        };
                        role: {
                            heading: string;
                            hint: string;
                            placeHolder: string;
                            label: string;
                            validation: {
                                empty: string;
                            };
                        };
                    };
                    outboundProvisioningRoles: {
                        heading: string;
                        hint: string;
                        placeHolder: string;
                        label: string;
                        popup: {
                            content: string;
                        };
                    };
                    certificateSection: {
                        certificateEditSwitch: {
                            jwks: string;
                            pem: string;
                        };
                        noCertificateAlert: string;
                    }
                };
                helpPanel?: HelpPanelInterface;
                templates?: {
                    manualSetup?: {
                        heading: string;
                        subHeading: string;
                    };
                    quickSetup?: {
                        heading: string;
                        subHeading: string;
                    };
                    apple: {
                        wizardHelp: {
                            clientId: {
                                description: string;
                                heading: string;
                            };
                            heading: string;
                            keyId: {
                                description: string;
                                heading: string;
                            };
                            name: {
                                connectionDescription: string;
                                idpDescription: string;
                                heading: string;
                            };
                            preRequisites: {
                                configureAppleSignIn: string;
                                configureReturnURL: string;
                                configureWebDomain: string;
                                getCredentials: string;
                                heading: string;
                            };
                            privateKey: {
                                description: string;
                                heading: string;
                            };
                            subHeading: string;
                            teamId: {
                                description: string;
                                heading: string;
                            };
                        };
                    };
                    expert: {
                        wizardHelp: {
                            heading: string;
                            description: {
                                connectionDescription: string;
                                heading: string;
                                idpDescription: string;
                            };
                            name: {
                                connectionDescription: string;
                                heading: string;
                                idpDescription: string;
                            };
                            subHeading: string;
                        };
                    };
                    facebook?: {
                        wizardHelp: {
                            clientId: {
                                description: string;
                                heading: string;
                            },
                            clientSecret: {
                                description: string;
                                heading: string;
                            },
                            heading: string;
                            name: {
                                idpDescription: string;
                                connectionDescription: string;
                                heading: string;
                            },
                            preRequisites: {
                                configureOAuthApps: string;
                                configureRedirectURL: string;
                                configureSiteURL: string;
                                getCredentials: string;
                                heading: string;
                            },
                            subHeading: string;
                        }
                    },
                    github?: {
                        wizardHelp: {
                            heading: string;
                            subHeading: string;
                            clientId: {
                                description: string;
                                heading: string;
                            },
                            clientSecret: {
                                description: string;
                                heading: string;
                            },
                            name: {
                                idpDescription: string;
                                connectionDescription: string;
                                heading: string;
                            },
                            preRequisites: {
                                configureOAuthApps: string;
                                configureHomePageURL: string;
                                configureRedirectURL: string;
                                heading: string;
                                getCredentials: string;
                            }
                        }
                    };
                    google?: {
                        wizardHelp: {
                            clientId: {
                                description: string;
                                heading: string;
                            };
                            clientSecret: {
                                description: string;
                                heading: string;
                            };
                            heading: string;
                            name: {
                                idpDescription: string;
                                connectionDescription: string;
                                heading: string;
                            };
                            preRequisites: {
                                configureOAuthApps: string;
                                configureRedirectURL: string;
                                getCredentials: string;
                                heading: string;
                            },
                            subHeading: string;
                        }
                    };
                    organizationIDP?: {
                        wizardHelp: {
                            name: {
                                description: string;
                                heading: string;
                            };
                            description: {
                                description: string;
                                heading: string;
                                example: string;
                            };
                        }
                    },
                    microsoft?: {
                        wizardHelp: {
                            clientId: {
                                description: string;
                                heading: string;
                            };
                            clientSecret: {
                                description: string;
                                heading: string;
                            };
                            heading: string;
                            name: {
                                idpDescription: string;
                                connectionDescription: string;
                                heading: string;
                            };
                            preRequisites: {
                                configureOAuthApps: string;
                                configureRedirectURL: string;
                                getCredentials: string;
                                heading: string;
                            },
                            subHeading: string;
                        }
                    };
                    hypr?: {
                        wizardHelp: {
                            apiToken: {
                                description: string;
                                heading: string;
                            };
                            appId: {
                                description: string;
                                heading: string;
                            };
                            baseUrl: {
                                description: string;
                                heading: string;
                            };
                            heading: string;
                            name: {
                                idpDescription: string;
                                connectionDescription: string;
                                heading: string;
                            };
                            preRequisites: {
                                rpDescription: string;
                                tokenDescription: string;
                                heading: string;
                            };
                        }
                    };
                    enterprise?: {
                        addWizard?: {
                            title: string;
                            subtitle: string;
                        };
                        saml?: {
                            preRequisites: {
                                configureIdp: string;
                                configureRedirectURL: string;
                                heading: string;
                                hint: string;
                            };
                        };
                        validation: {
                            name: string;
                            invalidName: string;
                        };
                    };
                    trustedTokenIssuer?: {
                        addWizard?: {
                            title: string;
                            subtitle: string;
                        };
                        forms?: {
                            steps?: {
                                general?: string;
                                certificate?: string;
                            }
                            name?: {
                                label?: string;
                                placeholder?: string;
                            };
                            issuer?: {
                                label?: string;
                                placeholder?: string;
                                hint?: string;
                                validation?: {
                                    notValid: string;
                                }
                            };
                            alias?: {
                                label?: string;
                                placeholder?: string;
                                hint?: string;
                                validation?: {
                                    notValid: string;
                                }
                            };
                            certificateType?: {
                                label?: string;
                                requiredCertificate?: string;
                            };
                            jwksUrl?: {
                                optionLabel?: string;
                                placeholder?: string;
                                label?: string;
                                hint?: string;
                                validation?: {
                                    notValid: string;
                                }
                            };
                            pem?: {
                                optionLabel?: string;
                                hint?: string;
                                uploadCertificateButtonLabel?: string;
                                dropzoneText?: string;
                                pasteAreaPlaceholderText?: string;
                            };
                        };
                    };
                };
                list?: {
                    actions: string;
                    name: string;
                };
                modals?: {
                    addAuthenticator: {
                        title: string;
                        subTitle: string;
                    };
                    addCertificate: {
                        title: string;
                        subTitle: string;
                    };
                    addProvisioningConnector: {
                        title: string;
                        subTitle: string;
                    };
                    attributeSelection: {
                        title: string;
                        subTitle: string;
                        content: {
                            searchPlaceholder: string;
                        };
                    };
                };
                notifications?: {
                    addFederatedAuthenticator: Notification;
                    addIDP: Notification;
                    changeCertType: {
                        pem: {
                            description: string;
                            message: string;
                        };
                        jwks: {
                            description: string;
                            message: string;
                        };
                    };
                    deleteCertificate: Notification;
                    deleteIDP: Notification;
                    deleteIDPWithConnectedApps: Notification;
                    deleteConnection: Notification;
                    disableAuthenticator: Notification;
                    disableIDPWithConnectedApps: Notification;
                    disableOutboundProvisioningConnector: Notification;
                    duplicateCertificateUpload: Notification;
                    getIDP: Notification;
                    getIDPList: Notification;
                    getIDPTemplate: Notification;
                    getIDPTemplateList: Notification;
                    getFederatedAuthenticator: Notification;
                    getFederatedAuthenticatorsList: Notification;
                    getFederatedAuthenticatorMetadata: Notification;
                    getConnectionDetails: Notification;
                    getOutboundProvisioningConnector: Notification;
                    getOutboundProvisioningConnectorsList: Notification;
                    getOutboundProvisioningConnectorMetadata: Notification;
                    getAllLocalClaims: Notification;
                    getRolesList: Notification;
                    submitAttributeSettings: Notification;
                    deleteDefaultAuthenticator: Notification;
                    deleteDefaultConnector: Notification;
                    updateAttributes: Notification;
                    updateClaimsConfigs: Notification;
                    updateFederatedAuthenticator: Notification;
                    updateFederatedAuthenticators: Notification;
                    updateEmailOTPAuthenticator: Notification;
                    updateSMSOTPAuthenticator: Notification;
                    updateGenericAuthenticator: Notification;
                    updateIDP: Notification;
                    updateIDPCertificate: Notification;
                    updateIDPRoleMappings: Notification;
                    updateJITProvisioning: Notification;
                    updateOutboundProvisioningConnectors: Notification;
                    updateOutboundProvisioningConnector: Notification;
                    apiLimitReachedError: {
                        error: {
                            description: string;
                            message: string;
                        }
                    }
                };
                popups?: {
                    appStatus: {
                        enabled: Popup;
                        disabled: Popup;
                    };
                };
                placeHolders?: {
                    emptyCertificateList: Placeholder;
                    emptyIDPList: Placeholder;
                    emptyIDPSearchResults: Placeholder;
                    emptyAuthenticatorList: Placeholder;
                    emptyConnectionTypeList: {
                        subtitles: {
                            0: string;
                            1: string;
                        },
                        title: string;
                    };
                    emptyConnectorList: Placeholder;
                    noAttributes: Placeholder;
                };
                wizards?: {
                    addAuthenticator: {
                        header: string;
                        steps: {
                            authenticatorSelection: {
                                title: string;
                                quickSetup: {
                                    title: string;
                                    subTitle: string;
                                };
                                manualSetup: {
                                    title: string;
                                    subTitle: string;
                                };
                            };
                            authenticatorConfiguration: {
                                title: string;
                            };
                            authenticatorSettings: {
                                emptyPlaceholder: {
                                    subtitles: [
                                        string,
                                        string
                                    ];
                                    title: string;
                                };
                            };
                            summary: {
                                title: string;
                            };
                        };
                    };
                    addIDP: {
                        header: string;
                        steps: {
                            generalSettings: {
                                title: string;
                            };
                            authenticatorConfiguration: {
                                title: string;
                            };
                            provisioningConfiguration: {
                                title: string;
                            };
                            summary: {
                                title: string;
                            };
                        };
                    };
                    addProvisioningConnector: {
                        header: string;
                        steps: {
                            connectorSelection: {
                                title: string;
                                defaultSetup: {
                                    title: string;
                                    subTitle: string;
                                };
                            };
                            connectorConfiguration: {
                                title: string;
                            };
                            summary: {
                                title: string;
                            };
                        };
                    };
                    buttons: {
                        next: string;
                        finish: string;
                        previous: string;

                    };
                };
            };
            suborganizations: {
                notifications: {
                    tierLimitReachedError: {
                        emptyPlaceholder: Placeholder;
                        heading: string;
                    };
                    subOrgLevelsLimitReachedError: {
                        emptyPlaceholder: Placeholder;
                        heading: string;
                    };
                    duplicateOrgError: {
                        message: string;
                        description: string;
                    };
                }
            },
            footer: {
                copyright: string;
            };
            header: {
                links: {
                    adminPortalNav: string;
                    userPortalNav: string;
                };
            };
            helpPanel: {
                actions: HelpPanelActionsInterface;
                notifications: {
                    pin: Notification;
                };
            };
            idp: {
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
                buttons: {
                    addIDP: string;
                    addAuthenticator: string;
                    addConnector: string;
                    addAttribute: string;
                    addCertificate: string;
                };
                confirmations: {
                    deleteIDP: Confirmation;
                    deleteIDPWithConnectedApps: Confirmation;
                    deleteAuthenticator: Confirmation;
                    deleteConnector: Confirmation;
                };
                connectedApps: {
                    action: string;
                    header: string;
                    subHeader: string;
                    placeholders: {
                        search: string;
                        emptyList: string;
                    };
                    applicationEdit: {
                        back: string;
                    };
                    genericError: {
                        description: string;
                        message: string;
                    }
                };
                dangerZoneGroup: {
                    header: string;
                    disableIDP: DangerZone;
                    deleteIDP: DangerZone;
                };
                forms: {
                    advancedConfigs: {
                        federationHub: FormAttributes;
                        homeRealmIdentifier: FormAttributes;
                        alias: FormAttributes;
                        certificateType: {
                            label: string;
                            hint: string;
                            certificatePEM: FormAttributes;
                            certificateJWKS: FormAttributes;
                        };
                        implicitAssociation: {
                            enable: {
                                label: string;
                                hint: string;
                            };
                            attributes: {
                                label: string;
                                placeholder: string;
                                hint: string;
                            };
                            warning: string;
                        };
                    };
                    attributeSettings: {
                        attributeMapping: {
                            attributeColumnHeader: string;
                            attributeMapColumnHeader: string;
                            attributeMapInputPlaceholderPrefix: string;
                            componentHeading: string;
                            hint: string;
                            placeHolder: {
                                title: string;
                                subtitle: string;
                                action: string;
                            };
                            attributeMapTable: {
                                mappedAttributeColumnHeader: string;
                                externalAttributeColumnHeader: string;
                            };
                            heading: string;
                            subheading: string;
                            search: {
                                placeHolder: string;
                            };
                            attributeDropdown: {
                                label: string;
                                placeHolder: string;
                                noResultsMessage: string;
                            };
                            externalAttributeInput: {
                                label: string;
                                placeHolder: string;
                                existingErrorMessage: string;
                            };
                            addAttributeButtonLabel: string;
                            modal: {
                                header: string;
                                placeholder: {
                                    title: string;
                                    subtitle: string
                                }
                            }
                        };
                        attributeProvisioning: {
                            attributeColumnHeader: {
                                0: string;
                                1: string;
                            };
                            attributeMapColumnHeader: string;
                            attributeMapInputPlaceholderPrefix: string;
                            componentHeading: string;
                            hint: string;
                        };
                        attributeListItem: {
                            validation: {
                                empty: string;
                            };
                        };
                        attributeSelection: {
                            searchAttributes: {
                                placeHolder: string;
                            };
                        };
                    };
                    authenticatorAccordion: {
                        default: {
                            0: string;
                            1: string;
                        };
                        enable: {
                            0: string;
                            1: string;
                        };
                    };
                    outboundConnectorAccordion: {
                        default: {
                            0: string;
                            1: string;
                        };
                        enable: {
                            0: string;
                            1: string;
                        };
                    };
                    common: {
                        requiredErrorMessage: string;
                        invalidURLErrorMessage: string;
                        invalidQueryParamErrorMessage: string;
                        customProperties: string;
                        internetResolvableErrorMessage: string;
                    };
                    generalDetails: {
                        name: FormAttributes;
                        description: FormAttributes;
                        image: FormAttributes;
                    };
                    jitProvisioning: {
                        enableJITProvisioning: FormAttributes;
                        provisioningUserStoreDomain: FormAttributes;
                        provisioningScheme: {
                            hint: string;
                            label: string;
                            children: {
                                0: string;
                                1: string;
                                2: string;
                                3: string;
                            };
                        };
                    };
                    roleMapping: {
                        heading: string;
                        keyName: string;
                        valueName: string;
                        validation: {
                            keyRequiredMessage: string;
                            valueRequiredErrorMessage: string;
                            duplicateKeyErrorMsg: string;
                        };
                        hint: string;
                    };
                    uriAttributeSettings: {
                        subject: {
                            heading: string;
                            hint: string;
                            placeHolder: string;
                            label: string;
                            validation: {
                                empty: string;
                            };
                        };
                        role: {
                            heading: string;
                            hint: string;
                            placeHolder: string;
                            label: string;
                            validation: {
                                empty: string;
                            };
                        };
                    };
                    outboundProvisioningRoles: {
                        heading: string;
                        hint: string;
                        placeHolder: string;
                        label: string;
                        popup: {
                            content: string;
                        };
                    };
                };
                helpPanel: HelpPanelInterface;
                templates: {
                    manualSetup: {
                        heading: string;
                        subHeading: string;
                    };
                    quickSetup: {
                        heading: string;
                        subHeading: string;
                    };
                };
                list: {
                    actions: string;
                    name: string;
                };
                modals: {
                    addAuthenticator: {
                        title: string;
                        subTitle: string;
                    };
                    addCertificate: {
                        title: string;
                        subTitle: string;
                    };
                    addProvisioningConnector: {
                        title: string;
                        subTitle: string;
                    };
                    attributeSelection: {
                        title: string;
                        subTitle: string;
                        content: {
                            searchPlaceholder: string;
                        };
                    };
                };
                notifications: {
                    addFederatedAuthenticator: Notification;
                    addIDP: Notification;
                    apiLimitReachedError: Notification;
                    changeCertType: {
                        pem: {
                           description: string;
                           message: string;
                        };
                        jwks: {
                            description: string;
                            message: string;
                        };
                    };
                    deleteCertificate: Notification;
                    deleteIDP: Notification;
                    disableAuthenticator: Notification;
                    disableOutboundProvisioningConnector: Notification;
                    duplicateCertificateUpload: Notification;
                    getIDP: Notification;
                    getIDPList: Notification;
                    getIDPTemplate: Notification;
                    getIDPTemplateList: Notification;
                    getFederatedAuthenticator: Notification;
                    getFederatedAuthenticatorsList: Notification;
                    getFederatedAuthenticatorMetadata: Notification;
                    getOutboundProvisioningConnector: Notification;
                    getOutboundProvisioningConnectorsList: Notification;
                    getOutboundProvisioningConnectorMetadata: Notification;
                    getAllLocalClaims: Notification;
                    getRolesList: Notification;
                    submitAttributeSettings: Notification;
                    tierLimitReachedError: {
                        emptyPlaceholder: Placeholder;
                        heading: string;
                    };
                    deleteDefaultAuthenticator: Notification;
                    deleteDefaultConnector: Notification;
                    updateClaimsConfigs: Notification;
                    updateFederatedAuthenticator: Notification;
                    updateFederatedAuthenticators: Notification;
                    updateIDP: Notification;
                    updateIDPCertificate: Notification;
                    updateIDPRoleMappings: Notification;
                    updateJITProvisioning: Notification;
                    updateOutboundProvisioningConnectors: Notification;
                    updateOutboundProvisioningConnector: Notification;
                };
                placeHolders: {
                    emptyCertificateList: Placeholder;
                    emptyIDPList: Placeholder;
                    emptyIDPSearchResults: Placeholder;
                    emptyAuthenticatorList: Placeholder;
                    emptyConnectorList: Placeholder;
                    noAttributes: Placeholder;
                };
                wizards: {
                    addAuthenticator: {
                        header: string;
                        steps: {
                            authenticatorSelection: {
                                title: string;
                                quickSetup: {
                                    title: string;
                                    subTitle: string;
                                };
                                manualSetup: {
                                    title: string;
                                    subTitle: string;
                                };
                            };
                            authenticatorConfiguration: {
                                title: string;
                            };
                            summary: {
                                title: string;
                            };
                        };
                    };
                    addIDP: {
                        header: string;
                        steps: {
                            generalSettings: {
                                title: string;
                            };
                            authenticatorConfiguration: {
                                title: string;
                            };
                            provisioningConfiguration: {
                                title: string;
                            };
                            summary: {
                                title: string;
                            };
                        };
                    };
                    addProvisioningConnector: {
                        header: string;
                        steps: {
                            connectorSelection: {
                                title: string;
                                defaultSetup: {
                                    title: string;
                                    subTitle: string;
                                };
                            };
                            connectorConfiguration: {
                                title: string;
                            };
                            summary: {
                                title: string;
                            };
                        };
                    };
                    buttons: {
                        next: string;
                        finish: string;
                        previous: string;

                    };
                };
            };
            idvp: {
                advancedSearch: {
                    form: {
                        inputs: {
                            filterValue: {
                                placeholder: string;
                            };
                        };
                    };
                    placeholder: string;
                };
                buttons: {
                    addIDVP: string;
                };
                placeholders: {
                    emptyIDVPList: Placeholder;
                    emptyIDVPTypeList: Placeholder;
                };
                confirmations: {
                    deleteIDVP: Confirmation;
                };
                notifications: {
                  getIDVPList: Notification;
                  deleteIDVP: Notification;
                  updateIDVP: Notification;
                  addIDVP: Notification;
                  submitAttributeSettings: Notification;
                  getAllLocalClaims: Notification;
                  getIDVP: Notification;
                  getUIMetadata: Notification;
                  getIDVPTemplateTypes: Notification;
                  getIDVPTemplateType: Notification;
                  getIDVPTemplate: Notification;
                };
                forms: {
                    attributeSettings: {
                        attributeMapping: {
                            heading: string;
                            hint: string;
                            addButton: string;
                            emptyPlaceholderEdit: {
                                title: string;
                                subtitle: string;
                            };
                            emptyPlaceholderCreate: {
                                title: string;
                                subtitle: string;
                            };
                        };
                        attributeMappingListItem: {
                            validation: {
                                duplicate: string;
                                required: string;
                                invalid: string;
                            };
                            placeholders: {
                                mappedValue: string;
                                localClaim: string;
                            };
                            labels: {
                                mappedValue: string;
                                localClaim: string;
                            }
                        };
                        attributeSelectionModal: {
                            header: string;
                        };
                    };
                    generalDetails: {
                        name: FormAttributes;
                        description: FormAttributes;
                    };
                };
                dangerZoneGroup?: {
                    header: string;
                    disableIDVP: DangerZone;
                    deleteIDVP: DangerZone;
                };
                list: {
                    actions: string;
                    name: string;
                };
            };
            overview: {
                banner: {
                    heading: string;
                    subHeading: string;
                    welcome: string;
                };
                quickLinks: {
                    cards: {
                        applications: {
                            heading: string;
                            subHeading: string;
                        };
                        idps: {
                            heading: string;
                            subHeading: string;
                        };
                        authenticationProviders?: {
                            heading: string;
                            subHeading: string;
                        };
                        remoteFetch: {
                            heading: string;
                            subHeading: string;
                        };
                    };
                };
            };
            sidePanel: {
                applicationEdit: string;
                applicationTemplates: string;
                applications: string;
                categories: {
                    application: string;
                    gettingStarted: string;
                    identityProviders: string;
                    authenticationProviders?: string;
                    general: string;
                    identityVerificationProviders: string;
                };
                customize: string;
                identityProviderEdit: string;
                identityProviderTemplates: string;
                identityProviders: string;
                authenticationProviderEdit?: string;
                authenticationProviderTemplates?: string;
                authenticationProviders?: string;
                oidcScopes: string;
                oidcScopesEdit: string;
                overview: string;
                remoteRepo: string;
                remoteRepoEdit: string;
            };
            templates: {
                emptyPlaceholder: Placeholder;
            };
            secrets?: {
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
                page?: {
                    title: string;
                    description: string;
                    primaryActionButtonText: string;
                    subFeatureBackButton: string;
                };
                errors?: {
                    generic: {
                        message: string;
                        description: string;
                    }
                },
                routes?: {
                    name: string;
                    category: string;
                    sidePanelChildrenNames: string[];
                },
                alerts?: {
                    createdSecret?: {
                        description: string;
                        message: string;
                    },
                    updatedSecret?: {
                        description: string;
                        message: string;
                    },
                    deleteSecret?: {
                        description: string;
                        message: string;
                    }
                },
                modals: {
                    deleteSecret: {
                        assertionHint: string;
                        primaryActionButtonText: string;
                        secondaryActionButtonText: string;
                        title: string;
                        content: string;
                        warningMessage: string;
                    }
                },
                wizards?: {
                    addSecret?: {
                        heading?: string;
                        subheading?: string;
                        form?: {
                            secretTypeField: Record<string, string>;
                            secretNameField: Record<string, string>;
                            secretValueField: Record<string, string>;
                            secretDescriptionField: Record<string, string>;
                        }
                    },
                    actions: {
                        createButton: {
                            label: string;
                            ariaLabel: string;
                        };
                        cancelButton: {
                            label: string;
                            ariaLabel: string;
                        };
                    }
                },
                banners?: {
                    secretIsHidden: {
                        title: string;
                        content: string;
                    },
                    adaptiveAuthSecretType: {
                        title: string;
                        content: string;
                    }
                },
                forms?: {
                    editSecret?: {
                        page: {
                            description: string;
                        },
                        secretValueField: Record<string, string>;
                        secretDescriptionField: Record<string, string>;
                    },
                    actions?: {
                        submitButton: {
                            label: string;
                            ariaLabel: string;
                        }
                    }
                },
                emptyPlaceholders?: {
                    resourceNotFound: {
                        messages: string[];
                    },
                    emptyListOfSecrets: {
                        messages: string[];
                    },
                    buttons?: {
                        backToSecrets: {
                            label: string;
                            ariaLabel: string;
                        },
                        addSecret: {
                            label: string;
                            ariaLabel: string;
                        }
                    }
                }
            }
        };
        notifications: {
            endSession: Notification;
            getProfileInfo: Notification;
            getProfileSchema: Notification;
        };
        pages: {
            applicationTemplate: EditPage;
            applications: Page;
            applicationsEdit: EditPage;
            authenticationProvider?: Page;
            authenticationProviderTemplate?: {
                title: string;
                subTitle: string;
                backButton: string;
                search: {
                    placeholder: string;
                };
                supportServices: {
                    authenticationDisplayName: string;
                    provisioningDisplayName: string;
                };
            };
            idp: Page;
            idpTemplate: {
                title: string;
                subTitle: string;
                backButton: string;
                supportServices: {
                    authenticationDisplayName: string;
                    provisioningDisplayName: string;
                };
            };
            idvp: Page;
            idvpTemplate: {
                title: string;
                subTitle: string;
                backButton: string;
                search: {
                    placeholder: string;
                };
            };
            overview: Page;
        };
        componentExtensions: {
            component: {
                application: {
                    quickStart: {
                        title: string;
                    };
                };
            };
        };
        placeholders: {
            emptySearchResult: Placeholder;
            underConstruction: Placeholder;
        };
        technologies: {
            android: string;
            angular: string;
            ios: string;
            java: string;
            python: string;
            react: string;
            windows: string;
        };
    };
    loginFlow: {
        adaptiveLoginFlowSelectConfirmationModal: {
            content: string;
            heading: string;
            message: string;
        };
        basicLoginFlowSelectConfirmationModal: {
            content: string;
            heading: string;
            message: string;
        };
        options: {
            controls: {
                remove: string;
            };
            displayName: string;
            divider: string;
        };
        modes: {
            legacy: {
                label: string;
            };
            visual: {
                label: string;
            };
            switchConfirmationModal: {
                assertionHint: string;
                content: string;
                primaryActionButtonText: string;
                secondaryActionButtonText: string;
                title: string;
                warningMessage: string;
            };
        };
        nodes: {
            controls: {
                attributeSelector: {
                    label: string;
                };
                enableBackupCodes: {
                    label: string;
                };
                userAttributeSelector: {
                    label: string;
                };
            };
            emailOTP: {
                controls: {
                    optionRemoveTooltipContent: string;
                };
                form: {
                    actions: {
                        primary: string;
                        secondary: string;
                    };
                    fields: {
                        code: {
                            label: string;
                            placeholder: string;
                        };
                    };
                };
                header: string;
            };
            identifierFirst: {
                controls: {
                    optionRemoveTooltipContent: string;
                    optionSwitchTooltipContent: string;
                };
                form: {
                    actions: {
                        primary: string;
                    };
                    fields: {
                        rememberMe: {
                            label: string;
                        };
                        username: {
                            label: string;
                            placeholder: string;
                        };
                    };
                };
                header: string;
            };
            signIn: {
                controls: {
                    optionRemoveTooltipContent: string;
                    optionSwitchTooltipContent: string;
                };
                form: {
                    actions: {
                        primary: string;
                    };
                    fields: {
                        password: {
                            label: string;
                            placeholder: string;
                        };
                        rememberMe: {
                            label: string;
                        };
                        username: {
                            label: string;
                            placeholder: string;
                        };
                    };
                };
                header: string;
            };
            smsOTP: {
                controls: {
                    optionRemoveTooltipContent: string;
                };
                form: {
                    actions: {
                        primary: string;
                        secondary: string;
                    };
                    fields: {
                        code: {
                            label: string;
                            placeholder: string;
                        };
                    };
                };
                header: string;
            };
            totp: {
                controls: {
                    optionRemoveTooltipContent: string;
                };
                form: {
                    actions: {
                        primary: string;
                    };
                    fields: {
                        code: {
                            label: string;
                            placeholder: string;
                        };
                    };
                    help: string;
                };
                header: string;
            };
            activeSessionsLimit: {
                controls: {
                    optionRemoveTooltipContent: string;
                };
                form: {
                    sessions: {
                        browserLabel: string;
                        lastAccessedLabel: string;
                    };
                    help: string;
                };
                header: string;
            };
        };
        revertConfirmationModal: {
            assertionHint: string;
            content: string;
            primaryActionButtonText: string;
            secondaryActionButtonText: string;
            title: string;
            warningMessage: string;
        };
        steps: {
            controls: {
                addOption: string;
                remove: string;
                signUp: {
                    hint: string;
                    label: string;
                };
            };
        };
        predefinedFlows: {
            adaptive: {
                actions: {
                    add: string;
                };
                header: string;
            };
            authenticators: {
                apple: {
                    displayName: string;
                };
                facebook: {
                    displayName: string;
                };
                github: {
                    displayName: string;
                };
                google: {
                    displayName: string;
                };
                microsoft: {
                    displayName: string;
                };
            };
            basic: {
                header: string;
            };
            categories: {
                basic: {
                    label: string;
                };
                mfa: {
                    label: string;
                };
                passwordless: {
                    label: string;
                };
                social: {
                    label: string;
                };
            };
            header: string;
            panelHeader: string;
        };
        scriptEditor: {
            panelHeader: string;
            secretSelector: {
                actions: {
                    create: {
                        label: string;
                    }
                };
                emptyPlaceholder: {
                    header: string;
                    description: string;
                };
                label: string;
            };
            themes: {
                dark: {
                    label: string;
                };
                highContrast: {
                    label: string;
                };
                light: {
                    label: string;
                };
            };
        };
        visualEditor: {
            actions: {
                revert: {
                    label: string;
                };
                update: {
                    label: string;
                };
            };
        };
    };
    manage: {
        features: {
            businessGroups: {
                fields: {
                    groupName: FormAttributes;
                };
            };
            organizationDiscovery: {
                advancedSearch: {
                    form: {
                        dropdown: {
                            filterAttributeOptions: {
                                organizationName: string;
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
                    placeholder: string;
                };
                assign: {
                    title: string;
                    description: string;
                    form: {
                        fields: {
                            emailDomains: {
                                label : string;
                                placeholder: string;
                                hint: string;
                                validations: {
                                    invalid: {
                                        0: string;
                                        1: string;
                                    }
                                }
                            },
                            organizationName: {
                                label: string;
                                placeholder: string;
                                emptyPlaceholder: {
                                    0: string;
                                    1: string;
                                }
                                hint: string;
                            }
                        }
                    },
                    buttons: {
                        assign: string;
                    }
                },
                emailDomains: {
                    actions: {
                        assign: string;
                        enable: string;
                    }
                };
                edit: {
                    back: string;
                    description: string;
                    form: {
                        fields: {
                            emailDomains: {
                                label : string;
                                placeholder: string;
                                hint: string;
                                validations: {
                                    invalid: {
                                        0: string;
                                        1: string;
                                    }
                                }
                            };
                            organizationName: {
                                label: string;
                                hint: string;
                            };
                        };
                        message: string;
                    };
                };
                message: string;
                notifications: {
                    addEmailDomains: {
                        error: {
                            description: string;
                            message: string;
                        };
                        success: {
                            message: string;
                            description: string;
                        };
                    };
                    checkEmailDomain: {
                        error: {
                            description: string;
                            message: string;
                        };
                    };
                    disableEmailDomainDiscovery: {
                        error: {
                            description: string;
                            message: string;
                        };
                        success: {
                            description: string;
                            message: string;
                        };
                    };
                    enableEmailDomainDiscovery: {
                        error: {
                            description: string;
                            message: string;
                        };
                        success: {
                            description: string;
                            message: string;
                        };
                    };
                    fetchOrganizationDiscoveryAttributes: {
                        error: {
                            description: string;
                            message: string;
                        };
                    };
                    getEmailDomainDiscovery: {
                        error: {
                            description: string;
                            message: string;
                        };
                    };
                    getOrganizationListWithDiscovery: {
                        error: {
                            description: string;
                            message: string;
                        };
                    };
                    updateOrganizationDiscoveryAttributes: {
                        error: {
                            description: string;
                            message: string;
                        };
                        success: {
                            description: string;
                            message: string;
                        };
                    };
                },
                placeholders: {
                    emptyList: Placeholder;
                };
                title: string;
            };
            organizations: {
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
                list: {
                    actions: {
                        add: string;
                    };
                    columns: {
                        name: string;
                        actions: string;
                    };
                };
                title: string;
                subTitle?: string;
                notifications: {
                    fetchOrganization: Notification;
                    deleteOrganization: Notification;
                    deleteOrganizationWithSubOrganizationError: string;
                    disableOrganization: Notification;
                    disableOrganizationWithSubOrganizationError: string;
                    enableOrganization: Notification;
                    updateOrganization: Notification;
                    updateOrganizationAttributes: Notification;
                    addOrganization: Notification;
                    getOrganizationList: Notification;
                };
                confirmations: {
                    deleteOrganization: {
                        assertionHint: string;
                        header: string;
                        message: string;
                        content: string;
                    };
                };
                placeholders: {
                    emptyList: Placeholder;
                };
                edit: {
                    description: string;
                    back: string;
                    tabTitles: {
                        overview: string;
                        attributes: string;
                    },
                    fields: {
                        id: FormAttributes;
                        name: FormAttributes;
                        description: FormAttributes;
                        domain: FormAttributes;
                        type: FormAttributes;
                        created: FormAttributes;
                        lastModified: FormAttributes;
                    },
                    dangerZone: {
                        title: string;
                        subHeader: string;
                        disableOrganization: {
                            enableActionTitle: string;
                            disableActionTitle: string;
                            subheader: string;
                        }
                    },
                    attributes: {
                        hint: string;
                        key: string;
                        value: string;
                        keyRequiredErrorMessage: string;
                        valueRequiredErrorMessage: string;
                    }
                };
                modals: {
                    addOrganization: {
                        header: string;
                        subtitle1: string;
                        subtitle2: string;
                    };
                };
                forms: {
                    addOrganization: {
                        name: FormAttributes;
                        description: FormAttributes;
                        domainName: FormAttributes;
                        type: string;
                        structural: string;
                        tenant: string;
                    };
                };
                homeList: {
                    name: string;
                    description: string;
                };
                shareApplicationSubTitle: string;
                shareApplicationRadio: string;
                shareApplicationInfo: string;
                unshareApplicationRadio: string;
                shareWithSelectedOrgsRadio: string;
                unshareApplicationInfo: string;
                switching: {
                    search: {
                        placeholder: string;
                    };
                    emptyList: string;
                    subOrganizations: string;
                    goBack: string;
                    switchLabel: string;
                    switchButton: string;
                    notifications: {
                        switchOrganization: Notification;
                    }
                }
            };
            users: {
                addUserType: {
                    createUser: {
                        title: string;
                        description: string
                    };
                    inviteParentUser: {
                        title: string;
                        description: string
                    };
                };
                consumerUsers: {
                    fields: {
                       username: {
                           label: string;
                           placeholder: string;
                           validations: {
                               empty: string;
                               invalid: string;
                               invalidCharacters: string;
                               regExViolation: string;
                           };
                       }
                    }
                };
                guestUsers: {
                    fields: {
                        username: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                invalid: string;
                                invalidCharacters: string;
                                regExViolation: string;
                            };
                        }
                    }
                };
                confirmations: {
                    terminateAllSessions: Confirmation;
                    terminateSession: Confirmation;
                    addMultipleUser: Confirmation
                };
                editUser: {
                    tab: {
                        menuItems: {
                            0: string;
                            1: string;
                            2: string;
                            3: string;
                        };
                    };
                    placeholders: {
                        undefinedUser: Placeholder;
                    };
                };
                userSessions: {
                    components: {
                        sessionDetails: {
                            actions: {
                                terminateAllSessions: string;
                                terminateSession: string;
                            };
                            labels: {
                                browser: string;
                                deviceModel: string;
                                ip: string;
                                lastAccessed: string;
                                loggedInAs: string;
                                loginTime: string;
                                os: string;
                                recentActivity: string;
                                activeApplication: string;
                            };
                        };
                    };
                    dangerZones: {
                        terminate: DangerZone;
                    };
                    notifications: {
                        getUserSessions: Notification;
                        terminateAllUserSessions: Notification;
                        terminateUserSession: Notification;
                        getAdminUser: Notification;
                    };
                    placeholders: {
                        emptyListPlaceholder: Placeholder;
                    };
                };
                advancedSearch: {
                    form: {
                        dropdown: {
                            filterAttributeOptions: {
                                username: string;
                                email: string;
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
                    placeholder: string;
                };
                all: {
                    heading: string;
                    subHeading: string;
                };
                buttons: {
                    addNewUserBtn: string;
                    assignUserRoleBtn: string;
                    metaColumnBtn: string;
                };
                addUserDropDown: {
                    addNewUser: string;
                    bulkImport: string;
                }
                forms: {
                    validation: {
                        formatError: string;
                        dateFormatError: string;
                        mobileFormatError: string;
                        futureDateError: string;
                    };
                };
                list: {
                    columns: {
                        actions: string;
                        name: string;
                    };
                };
                notifications: {
                    addUser: Notification;
                    addUserPendingApproval: Notification;
                    bulkImportUser: {
                        validation: {
                            emptyRowError: NotificationItem;
                            columnMismatchError: NotificationItem;
                            emptyHeaderError: NotificationItem;
                            missingRequiredHeaderError: NotificationItem;
                            blockedHeaderError: NotificationItem;
                            duplicateHeaderError: NotificationItem;
                            invalidHeaderError: NotificationItem;
                            emptyDataField: NotificationItem;
                            invalidRole: NotificationItem;
                            invalidGroup: NotificationItem;
                        },
                        submit: Notification;
                        timeOut: NotificationItem;
                    }
                    deleteUser: Notification;
                    fetchUsers: Notification;
                    getAdminRole: Notification;
                    revokeAdmin: Notification;
                };
                placeholders: {
                    emptyList: Placeholder;
                    userstoreError: Placeholder;
                };
                usersList: {
                    list: {
                        emptyResultPlaceholder: {
                            addButton: string;
                            subTitle: {
                                0: string;
                                1: string;
                                2: string;
                            };
                            title: string;
                        };
                        iconPopups: {
                            delete: string;
                            edit: string;
                        };
                    };
                    metaOptions: {
                        heading: string;
                        columns: {
                            name: string;
                            emails: string;
                            id: string;
                            userName: string;
                            lastModified: string;
                        };
                    };
                    search: {
                        emptyResultPlaceholder: {
                            clearButton: string;
                            subTitle: {
                                0: string;
                                1: string;
                            };
                            title: string;
                        };
                    };
                };
                userstores: {
                    userstoreOptions: {
                        all: string;
                        primary: string;
                    };
                };
            };
            approvals: {
                list: {
                    columns: {
                        actions: string;
                        name: string;
                    };
                };
                modals: {
                    approvalProperties: {
                        "Claims": string,
                        "REQUEST ID": string,
                        "Roles": string,
                        "User Store Domain": string,
                        "Username": string,
                    },
                    taskDetails: {
                        header: string;
                        description: string;
                    };
                };
                notifications: {
                    fetchApprovalDetails: Notification;
                    fetchPendingApprovals: Notification;
                    updatePendingApprovals: Notification;
                };
                placeholders: {
                    emptyApprovalList: Placeholder;
                    emptyApprovalFilter: Placeholder;
                    emptySearchResults: Placeholder;
                };
            };
            certificates: {
                keystore: {
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
                        error: string;
                        placeholder: string;
                    };
                    attributes: {
                        alias: string;
                    };
                    list: {
                        columns: {
                            actions: string;
                            name: string;
                        };
                    };
                    notifications: {
                        addCertificate: Notification;
                        getCertificates: Notification;
                        getAlias: Notification;
                        getPublicCertificate: Notification;
                        getCertificate: Notification;
                        deleteCertificate: Notification;
                        download: Notification;
                    };
                    certificateModalHeader: string;
                    placeholders: {
                        emptySearch: {
                            action: string;
                            title: string;
                            subtitle: string;
                        };
                        emptyList: {
                            action: string;
                            title: string;
                            subtitle: string;
                        };
                    };
                    confirmation: {
                        hint: string;
                        primaryAction: string;
                        header: string;
                        content: string;
                        message: string;
                        tenantContent: string;
                    };
                    pageLayout: {
                        title: string;
                        description: string;
                        primaryAction: string;
                    };
                    summary: {
                        sn: string;
                        validFrom: string;
                        validTill: string;
                        issuerDN: string;
                        subjectDN: string;
                        version: string;
                    };
                    wizard: {
                        panes: {
                            upload: string;
                            paste: string;
                        };
                        steps: {
                            upload: string;
                            summary: string;
                        };
                        header: string;
                        dropZone: {
                            description: string;
                            action: string;
                        };
                        pastePlaceholder: string;
                    };
                    forms: {
                        alias: FormField;
                    };
                    errorEmpty: string;
                    errorCertificate: string;
                };
                truststore: {
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
                };
            };
            claims: {
                attributeMappings: {
                    axschema: {
                        heading: string;
                        description: string;
                    },
                    eidas: {
                        heading: string;
                        description: string;
                    },
                    oidc: {
                        heading: string;
                        description: string;
                    };
                    scim: {
                        heading: string;
                        description: string;
                    };
                    custom: {
                        heading: string;
                        description: string;
                    };
                };
                dialects: {
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
                    attributes: {
                        dialectURI: string;
                    };
                    notifications: {
                        fetchDialects: Notification;
                        fetchADialect: Notification;
                        fetchExternalClaims: Notification;
                        deleteDialect: Notification;
                        addDialect: Notification;
                        updateDialect: Notification;
                        fetchSCIMResource: Notification;
                    };
                    pageLayout: {
                        list: {
                            title: string;
                            description: string;
                            primaryAction: string;
                            view: string;
                        };
                        edit: {
                            description: string;
                            back: string;
                            updateDialectURI: string;
                            updateExternalAttributes: string;
                        };
                    };
                    dangerZone: DangerZone;
                    sections: {
                        manageAttributes: {
                            heading: string;
                            description: string;
                            attributes: {
                                heading: string;
                                description: string;
                            };
                        };
                        manageAttributeMappings: {
                            heading: string;
                            description: string;
                            oidc: {
                                heading: string;
                                description: string;
                            };
                            scim: {
                                heading: string;
                                description: string;
                            };
                            custom: {
                                heading: string;
                                description: string;
                            };
                        };
                    };
                    confirmations: {
                        header: string;
                        message: string;
                        content: string;
                        hint: string;
                        action: string;
                    };
                    wizard: {
                        steps: {
                            dialectURI: string;
                            externalAttribute: string;
                            summary: string;
                        };
                        header: string;
                        summary: {
                            externalAttribute: string;
                            mappedAttribute: string;
                            notFound: string;
                        };
                    };
                    forms: {
                        fields: {
                            attributeName: {
                                validation: {
                                    invalid: string;
                                    alreadyExists: string;
                                };
                            };
                        };
                        dialectURI: FormField;
                        submit: string;
                    };
                };
                external: {
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
                        error: string;
                        placeholder: string;
                    };
                    attributes: {
                        attributeURI: string;
                        mappedClaim: string;
                    };
                    notifications: {
                        addExternalAttribute: Notification;
                        fetchExternalClaims: Notification;
                        getExternalAttribute: Notification;
                        updateExternalAttribute: Notification;
                        deleteExternalClaim: Notification;
                    };
                    forms: {
                        attributeURI: FormField;
                        localAttribute: FormField;
                        submit: string;
                        warningMessage: string;
                        emptyMessage: string;
                    };
                    pageLayout: {
                        edit: {
                            header: string;
                            primaryAction: string;
                        };
                    };
                    placeholders: {
                        empty: {
                            title: string;
                            subtitle: string;
                        };
                    };
                };
                local: {
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
                        error: string;
                        placeholder: string;
                    };
                    attributes: {
                        attributeURI: string;
                    };
                    notifications: {
                        fetchLocalClaims: Notification;
                        getAClaim: Notification;
                        getClaims: Notification;
                        getLocalDialect: Notification;
                        addLocalClaim: Notification;
                        updateClaim: Notification;
                        deleteClaim: Notification;
                    };
                    pageLayout: {
                        edit: {
                            tabs: {
                                general: string;
                                additionalProperties: string;
                                mappedAttributes: string;
                            };
                            description: string;
                            back: string;
                        };
                        local: {
                            description: string;
                            title: string;
                            back: string;
                            action: string;
                        };
                    };
                    wizard: {
                        steps: {
                            general: string;
                            mapAttributes: string;
                            summary: string;
                        };
                        header: string;
                        summary: {
                            userstore: string;
                            attribute: string;
                            supportedByDefault: string;
                            required: string;
                            readOnly: string;
                            attributeURI: string;
                            displayOrder: string;
                            regEx: string;
                        };
                    };
                    additionalProperties: {
                        hint: string;
                        key: string;
                        value: string;
                        keyRequiredErrorMessage: string;
                        valueRequiredErrorMessage: string;
                    };
                    confirmation: {
                        hint: string;
                        primaryAction: string;
                        header: string;
                        message: string;
                        content: string;
                    };
                    forms: {
                        attributeID: FormField;
                        attributeHint: string;
                        name: FormField;
                        nameHint: string;
                        description: FormField;
                        descriptionHint: string;
                        regEx: FormField;
                        regExHint: string;
                        supportedByDefault: FormField;
                        displayOrder: FormField;
                        displayOrderHint: string;
                        required: FormField;
                        requiredHint: string;
                        requiredWarning: string;
                        readOnly: FormField;
                        readOnlyHint: string;
                        attribute: FormField;
                        infoMessages?: {
                            disabledConfigInfo: string;
                            configApplicabilityInfo: string;
                        }
                    };
                    dangerZone: DangerZone;
                    mappedAttributes: {
                        hint: string;
                    };
                };
                list: {
                    columns: {
                        actions: string;
                        claimURI: string;
                        dialectURI: string;
                        name: string;
                    };
                    confirmation: {
                        local: {
                            message: string;
                            name: string;
                        };
                        dialect: {
                            message: string;
                            name: string;
                        };
                        external: {
                            message: string;
                            name: string;
                        };
                        hint: string;
                        header: string;
                        message: string;
                        content: string;
                        action: string;
                    };
                    placeholders: {
                        emptySearch: {
                            title: string;
                            subtitle: string;
                            action: string;
                        };
                        emptyList: {
                            title: {
                                local: string;
                                dialect: string;
                                external: string;
                            };
                            subtitle: string;
                            action: {
                                local: string;
                                dialect: string;
                                external: string;
                            };
                        };
                    };
                    warning: string;
                };
                scopeMappings: {
                    deletionConfirmationModal: {
                        assertionHint: string;
                        content: string;
                        header: string;
                        message: string;
                    },
                    saveChangesButton: string;
                };
            };
            emailLocale: {
                buttons: {
                    addLocaleTemplate: string;
                    saveChanges: string;
                };
                forms: {
                    addLocale: {
                        fields: {
                            bodyEditor: FormAttributes;
                            locale: FormAttributes;
                            signatureEditor: FormAttributes;
                            subject: FormAttributes;
                        };
                    };
                };
            };
            emailTemplateTypes: {
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
                buttons: {
                    createTemplateType: string;
                    deleteTemplate: string;
                    editTemplate: string;
                    newType: string;
                };
                confirmations: {
                    deleteTemplateType: Confirmation;
                };
                forms: {
                    addTemplateType: {
                        fields: {
                            type: FormAttributes;
                        };
                    };
                };
                list: {
                    actions: string;
                    name: string;
                };
                notifications: {
                    deleteTemplateType: Notification;
                    getTemplateTypes: Notification;
                    updateTemplateType: Notification;
                    createTemplateType: Notification;
                };
                placeholders: {
                    emptySearch: Placeholder;
                    emptyList: Placeholder;
                };
                wizards: {
                    addTemplateType: {
                        heading: string;
                        subHeading: string;
                        steps: {
                            templateType: {
                                heading: string;
                            }
                        };
                    };
                };
            };
            emailTemplates: {
                buttons: {
                    editTemplate: string;
                    deleteTemplate: string;
                    newTemplate: string;
                    viewTemplate: string;
                };
                confirmations: {
                    deleteTemplate: Confirmation;
                };
                editor: {
                    tabs: {
                        code: {
                            tabName: string;
                        };
                        preview: {
                            tabName: string;
                        };
                    };
                };
                list: {
                    actions: string;
                    name: string;
                };
                notifications: {
                    deleteTemplate: Notification;
                    createTemplate: Notification;
                    getTemplateDetails: Notification;
                    getTemplates: Notification;
                    iframeUnsupported: Notification;
                    updateTemplate: Notification;
                };
                placeholders: {
                    emptyList: Placeholder;
                };
                viewTemplate: {
                    heading: string;
                };
            };
            footer: {
                copyright: string;
            };
            groups: {
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
                edit: {
                    basics: {
                        fields: {
                            groupName: {
                                name: string;
                                required: string;
                                placeholder: string;
                            };
                        };
                    };
                    roles: {
                        addRolesModal: {
                            heading: string;
                            subHeading: string;
                        };
                        heading: string;
                        subHeading: string;
                        placeHolders: {
                            emptyListPlaceholder: Placeholder;
                        };
                    };
                };
                list: {
                    columns: {
                        actions: string;
                        lastModified: string;
                        name: string;
                        source: string;
                    };
                    storeOptions: string;
                };
                notifications: {
                    deleteGroup: Notification;
                    updateGroup: Notification;
                    createGroup: Notification;
                    createPermission: Notification;
                    fetchGroups: Notification;
                };
                placeholders: {
                    groupsError: Placeholder;
                };
            };
            header: {
                links: {
                    devPortalNav: string;
                    userPortalNav: string;
                };
            };
            governanceConnectors: {
                notifications: {
                    getConnectorCategories: Notification;
                    getConnector: Notification;
                    updateConnector: Notification;
                };
                form: {
                    errors: {
                        positiveIntegers: string;
                        format: string;
                    };
                };
                goBackLoginAndRegistration: string;
                enabled: string;
                disabled: string;
                categories: string;
                pageSubHeading: string;
                connectorSubHeading: string;
                connectorCategories: {
                    passwordPolicies : {
                        name: string;
                        description: string;
                        connectors: {
                            passwordExpiry: {
                                friendlyName: string;
                            };
                            passwordHistory: {
                                friendlyName: string;
                                properties: {
                                    passwordHistoryEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    passwordHistoryCount: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                            passwordPolicy: {
                                friendlyName: string;
                                properties: {
                                    passwordPolicyEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    passwordPolicyMinLength: {
                                        hint: string;
                                        label: string;
                                    };
                                    passwordPolicyMaxLength: {
                                        hint: string;
                                        label: string;
                                    };
                                    passwordPolicyPattern: {
                                        hint: string;
                                        label: string;
                                    };
                                    passwordPolicyErrorMsg: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                        };
                    };
                    userOnboarding : {
                        name: string;
                        description: string;
                        connectors: {
                            askPassword: {
                                friendlyName: string;
                            },
                            selfSignUp: {
                                friendlyName: string;
                                properties: {
                                    selfRegistrationEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    selfRegistrationLockOnCreation: {
                                        hint: string;
                                        label: string;
                                    };
                                    selfRegistrationSendConfirmationOnCreation: {
                                        hint: string;
                                        label: string;
                                    };
                                    selfRegistrationNotificationInternallyManage: {
                                        hint: string;
                                        label: string;
                                    };
                                    selfRegistrationReCaptcha: {
                                        hint: string;
                                        label: string;
                                    };
                                    selfRegistrationVerificationCodeExpiryTime: {
                                        hint: string;
                                        label: string;
                                    };
                                    selfRegistrationVerificationCodeSmsotpExpiryTime: {
                                        hint: string;
                                        label: string;
                                    };
                                    selfRegistrationSmsotpRegex: {
                                        hint: string;
                                        label: string;
                                    };
                                    selfRegistrationCallbackRegex: {
                                        hint: string;
                                        label: string;
                                    },
                                    urlListPurposeSelfSignUp: {
                                        hint: string;
                                        label: string;
                                    };
                                    selfRegistrationNotifyAccountConfirmation: {
                                        hint: string;
                                        label: string;
                                    };
                                    selfRegistrationResendConfirmationReCaptcha: {
                                        hint: string;
                                        label: string;
                                    };
                                    selfRegistrationAutoLoginEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    selfRegistrationAutoLoginAliasName: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                            liteUserSignUp: {
                                friendlyName: string;
                                properties: {
                                    liteRegistrationEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    liteRegistrationLockOnCreation: {
                                        hint: string;
                                        label: string;
                                    };
                                    liteRegistrationNotificationInternallyManage: {
                                        hint: string;
                                        label: string;
                                    };
                                    liteRegistrationReCaptcha: {
                                        hint: string;
                                        label: string;
                                    };
                                    liteRegistrationVerificationCodeExpiryTime: {
                                        hint: string;
                                        label: string;
                                    };
                                    liteRegistrationVerificationCodeSmsotpExpiryTime: {
                                        hint: string;
                                        label: string;
                                    };
                                    liteRegistrationSmsotpRegex: {
                                        hint: string;
                                        label: string;
                                    };
                                    liteRegistrationCallbackRegex: {
                                        hint: string;
                                        label: string;
                                    };
                                    urlListPurposeLiteUserSignUp: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                            userEmailVerification: {
                                friendlyName: string;
                                properties: {
                                    emailVerificationEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    emailVerificationLockOnCreation: {
                                        hint: string;
                                        label: string;
                                    };
                                    emailVerificationNotificationInternallyManage: {
                                        hint: string;
                                        label: string;
                                    };
                                    emailVerificationExpiryTime: {
                                        hint: string;
                                        label: string;
                                    };
                                    emailVerificationAskPasswordExpiryTime: {
                                        hint: string;
                                        label: string;
                                    };
                                    emailVerificationAskPasswordPasswordGenerator: {
                                        hint: string;
                                        label: string;
                                    };
                                    urlListPurposeJitProvisioning: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                        };
                    };
                    loginAttemptsSecurity : {
                        name: string;
                        description: string;
                        connectors: {
                            accountLockHandler: {
                                friendlyName: string;
                                properties: {
                                    accountLockHandlerLockOnMaxFailedAttemptsEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    accountLockHandlerOnFailureMaxAttempts: {
                                        hint: string;
                                        label: string;
                                    };
                                    accountLockHandlerTime: {
                                        hint: string;
                                        label: string;
                                    };
                                    accountLockHandlerLoginFailTimeoutRatio: {
                                        hint: string;
                                        label: string;
                                    };
                                    accountLockHandlerNotificationManageInternally: {
                                        hint: string;
                                        label: string;
                                    };
                                    accountLockHandlerNotificationNotifyOnLockIncrement: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                            ssoLoginRecaptcha: {
                                friendlyName: string;
                                properties: {
                                    ssoLoginRecaptchaEnableAlways: {
                                        hint: string;
                                        label: string;
                                    };
                                    ssoLoginRecaptchaEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    ssoLoginRecaptchaOnMaxFailedAttempts: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                        };
                    };
                    accountManagement : {
                        name: string;
                        description: string;
                        connectors: {
                            suspensionNotification: {
                                friendlyName: string;
                                properties: {
                                    suspensionNotificationEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    suspensionNotificationAccountDisableDelay: {
                                        hint: string;
                                        label: string;
                                    };
                                    suspensionNotificationDelays: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                            accountDisableHandler: {
                                friendlyName: string;
                                properties: {
                                    accountDisableHandlerEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    accountDisableHandlerNotificationManageInternally: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                            multiattributeLoginHandler: {
                                friendlyName: string;
                                properties: {
                                    accountMultiattributeloginHandlerEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    accountMultiattributeloginHandlerAllowedattributes: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                            accountRecovery: {
                                friendlyName: string;
                                properties: {
                                    recoveryNotificationPasswordEnable: {
                                        label: string;
                                    };
                                    recoveryReCaptchaPasswordEnable: {
                                        label: string;
                                    };
                                    recoveryQuestionPasswordEnable: {
                                        label: string;
                                    };
                                    recoveryQuestionPasswordMinAnswers: {
                                        label: string;
                                    };
                                    recoveryQuestionAnswerRegex: {
                                        hint: string;
                                        label: string;
                                    };
                                    recoveryQuestionAnswerUniqueness: {
                                        hint: string;
                                        label: string;
                                    };
                                    recoveryQuestionPasswordReCaptchaEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    recoveryQuestionPasswordReCaptchaMaxFailedAttempts: {
                                        label: string;
                                    };
                                    recoveryNotificationUsernameEnable: {
                                        label: string;
                                    };
                                    recoveryReCaptchaUsernameEnable: {
                                        label: string;
                                    };
                                    recoveryNotificationInternallyManage: {
                                        hint: string;
                                        label: string;
                                    };
                                    recoveryNotifySuccess: {
                                        label: string;
                                    };
                                    recoveryQuestionPasswordNotifyStart: {
                                        label: string;
                                    };
                                    recoveryExpiryTime: {
                                        label: string;
                                    };
                                    recoveryNotificationPasswordExpiryTimeSmsOtp: {
                                        hint: string;
                                        label: string;
                                    };
                                    recoveryNotificationPasswordSmsOtpRegex: {
                                        hint: string;
                                        label: string;
                                    };
                                    recoveryQuestionPasswordForcedEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    recoveryQuestionMinQuestionsToAnswer: {
                                        hint: string;
                                        label: string;
                                    };
                                    recoveryCallbackRegex: {
                                        hint: string;
                                        label: string;
                                    };
                                    recoveryAutoLoginEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                            adminForcedPasswordReset: {
                                friendlyName: string;
                                properties: {
                                    recoveryAdminPasswordResetRecoveryLink: {
                                        hint: string;
                                        label: string;
                                    };
                                    recoveryAdminPasswordResetOtp: {
                                        hint: string;
                                        label: string;
                                    };
                                    recoveryAdminPasswordResetOffline: {
                                        hint: string;
                                        label: string;
                                    };
                                    recoveryAdminPasswordResetExpiryTime: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                        };
                    };
                    otherSettings : {
                        name: string;
                        description: string;
                        connectors: {
                            piiController: {
                                friendlyName: string;
                                properties: {
                                    piiController: {
                                        hint: string;
                                        label: string;
                                    };
                                    contact: {
                                        hint: string;
                                        label: string;
                                    };
                                    email: {
                                        hint: string;
                                        label: string;
                                    };
                                    phone: {
                                        hint: string;
                                        label: string;
                                    };
                                    onBehalf: {
                                        hint: string;
                                        label: string;
                                    };
                                    piiControllerUrl: {
                                        hint: string;
                                        label: string;
                                    };
                                    addressCountry: {
                                        hint: string;
                                        label: string;
                                    };
                                    addressLocality: {
                                        hint: string;
                                        label: string;
                                    };
                                    addressRegion: {
                                        hint: string;
                                        label: string;
                                    };
                                    postOfficeBoxNumber: {
                                        hint: string;
                                        label: string;
                                    };
                                    postalCode: {
                                        hint: string;
                                        label: string;
                                    };
                                    streetAddress: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                            analyticsEngine: {
                                friendlyName: string;
                                messages: {
                                    deprecation: {
                                        description: string;
                                        heading: string;
                                    };
                                };
                                properties: {
                                    adaptiveAuthenticationAnalyticsReceiver: {
                                        hint: string;
                                        label: string;
                                    };
                                    adaptiveAuthenticationAnalyticsBasicAuthEnabled: {
                                        hint: string;
                                        label: string;
                                    };
                                    adaptiveAuthenticationAnalyticsBasicAuthUsername: {
                                        hint: string;
                                        label: string;
                                    };
                                    secretAdaptiveAuthenticationAnalyticsBasicAuthPassword: {
                                        hint: string;
                                        label: string;
                                    };
                                    adaptiveAuthenticationAnalyticsHttpConnectionTimeout: {
                                        hint: string;
                                        label: string;
                                    };
                                    adaptiveAuthenticationAnalyticsHttpReadTimeout: {
                                        hint: string;
                                        label: string;
                                    };
                                    adaptiveAuthenticationAnalyticsHttpConnectionRequestTimeout: {
                                        hint: string;
                                        label: string;
                                    };
                                    adaptiveAuthenticationAnalyticsHostnameVerfier: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                            elasticAnalyticsEngine: {
                                friendlyName: string;
                                warningModal: {
                                    configure: string,
                                    reassure: string
                                },
                                properties: {
                                    adaptiveAuthenticationElasticReceiver: {
                                        hint: string;
                                        label: string;
                                    };
                                    adaptiveAuthenticationElasticBasicAuthEnabled: {
                                        hint: string;
                                        label: string;
                                    };
                                    adaptiveAuthenticationElasticBasicAuthUsername: {
                                        hint: string;
                                        label: string;
                                    };
                                    secretAdaptiveAuthenticationElasticBasicAuthPassword: {
                                        hint: string;
                                        label: string;
                                    };
                                    adaptiveAuthenticationElasticHttpConnectionTimeout: {
                                        hint: string;
                                        label: string;
                                    };
                                    adaptiveAuthenticationElasticHttpReadTimeout: {
                                        hint: string;
                                        label: string;
                                    };
                                    adaptiveAuthenticationElasticHttpConnectionRequestTimeout: {
                                        hint: string;
                                        label: string;
                                    };
                                    adaptiveAuthenticationElasticHostnameVerfier: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                            userClaimUpdate: {
                                friendlyName: string;
                                properties: {
                                    userClaimUpdateEmailEnableVerification: {
                                        hint: string;
                                        label: string;
                                    };
                                    userClaimUpdateEmailVerificationCodeExpiryTime: {
                                        hint: string;
                                        label: string;
                                    };
                                    userClaimUpdateEmailEnableNotification: {
                                        hint: string;
                                        label: string;
                                    };
                                    userClaimUpdateMobileNumberEnableVerification: {
                                        hint: string;
                                        label: string;
                                    };
                                    userClaimUpdateMobileNumberVerificationCodeExpiryTime: {
                                        hint: string;
                                        label: string;
                                    };
                                    userClaimUpdateMobileNumberEnableVerificationByPrivilegedUser: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                        };
                    };
                    multiFactorAuthenticators : {
                        name: string;
                        friendlyName: string;
                        description: string;
                        connectors: {
                            backupCodeAuthenticator: {
                                friendlyName: string;
                                properties: {
                                    backupCodeBackupCodeLength: {
                                        hint: string;
                                        label: string;
                                    };
                                    backupCodeBackupCodeSize: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                        };
                    };
                    sessionManagement: {
                        description: string;
                    };
                    saml2WebSsoConfiguration: {
                        description: string;
                    };
                    wsFederationConfiguration: {
                        description: string;
                    };
                };
            };
            helpPanel: {
                notifications: {
                    pin: Notification;
                };
            };
            oidcScopes: {
                back: string;
                viewAttributes: string;
                manageAttributes: string;
                buttons: {
                    addScope: string;
                };
                confirmationModals: {
                    deleteScope: Confirmation;
                    deleteClaim: Confirmation;
                };
                addAttributes: {
                    description: string;
                };
                editScope: {
                    claimList: {
                        emptyPlaceholder: Placeholder;
                        emptySearch: Placeholder;
                        title: string;
                        subTitle: string;
                        addClaim: string;
                        popupDelete: string;
                        searchClaims: string;
                    };
                };
                forms: {
                    addScopeForm: {
                        inputs: {
                            displayName: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            scopeName: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    duplicate: string;
                                    empty: string;
                                    invalid: string;
                                };
                            };
                            description: {
                                label: string;
                                placeholder: string;
                            };
                        };
                    };
                };
                list: {
                    columns: {
                        actions: string;
                        name: string;
                    };
                    empty: Placeholder;
                    searchPlaceholder: string;
                };
                wizards: {
                    addScopeWizard: {
                        title: string;
                        subTitle: string;
                        steps: {
                            basicDetails: string;
                            claims: string;
                        };
                        buttons: {
                            next: string;
                            previous: string;
                        };
                        claimList: {
                            searchPlaceholder: string;
                            table: {
                                header: string;
                                emptyPlaceholders: {
                                    assigned: string;
                                    unAssigned: string;
                                };
                            };
                        };
                    };
                };
                notifications: {
                    addOIDCScope: Notification;
                    addOIDCClaim: Notification;
                    fetchOIDCScopes: Notification;
                    fetchOIDCScope: Notification;
                    fetchOIDClaims: Notification;
                    deleteOIDCScope: Notification;
                    deleteOIDClaim: Notification;
                    updateOIDCScope: Notification;
                    claimsMandatory: Notification;
                };
                placeholders: {
                    emptyList: {
                        action: string;
                        subtitles: {
                            0: string;
                            1: string;
                            2: string;
                        };
                        title: string;
                    };
                    emptySearch: Placeholder;
                };
            };
            overview: {
                widgets: {
                    insights: {
                        groups: {
                            heading: string;
                            subHeading: string;
                        };
                        users: {
                            heading: string;
                            subHeading: string;
                        };
                    };
                    overview: {
                        cards: {
                            groups: {
                                heading: string;
                            };
                            users: {
                                heading: string;
                            };
                            userstores: {
                                heading: string;
                            };
                        };
                        heading: string;
                        subHeading: string;
                    };
                    quickLinks: {
                        cards: {
                            certificates: {
                                heading: string;
                                subHeading: string;
                            };
                            dialects: {
                                heading: string;
                                subHeading: string;
                            };
                            emailTemplates: {
                                heading: string;
                                subHeading: string;
                            };
                            generalConfigs: {
                                heading: string;
                                subHeading: string;
                            };
                            groups: {
                                heading: string;
                                subHeading: string;
                            };
                            roles: {
                                heading: string;
                                subHeading: string;
                            };
                        };
                        heading: string;
                        subHeading: string;
                    };
                };
            };
            remoteFetch: {
                components: {
                    status: {
                        details: string;
                        header: string;
                        hint: string;
                        linkPopup: Popup;
                        refetch: string;
                    };
                };
                forms: {
                    getRemoteFetchForm: {
                        actions: {
                            remove: string;
                            save: string;
                        };
                        fields: {
                            accessToken: FormAttributes;
                            enable: FormAttributes;
                            connectivity: FormAttributes;
                            gitBranch: FormAttributes;
                            gitFolder: FormAttributes;
                            gitURL: FormAttributes;
                            pollingFrequency: FormAttributes;
                            sharedKey: FormAttributes;
                            username: FormAttributes;
                        };
                        heading: {
                            subTitle: string;
                            title: string;
                        };
                    };
                };
                modal: {
                    appStatusModal: ModalInterface;
                };
                notifications: {
                    createRepoConfig: Notification;
                    deleteRepoConfig: Notification;
                    getConfigDeploymentDetails: Notification;
                    getConfigList: Notification;
                    getRemoteRepoConfig: Notification;
                    triggerConfigDeployment: Notification;
                };
                pages: {
                    listing: Page;
                };
                placeholders: {
                    emptyListPlaceholder: Placeholder;
                };
            };
            roles: {
                addRoleWizard: {
                    buttons: {
                        finish: string;
                        next: string;
                        previous: string;
                    };
                    forms: {
                        roleBasicDetails: {
                            domain: {
                                label: {
                                    role: string;
                                    group: string;
                                };
                                placeholder: string;
                                validation: {
                                    empty: {
                                        role: string;
                                        group: string;
                                    };
                                };
                            };
                            roleName: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    duplicate: string;
                                    duplicateInAudience: string;
                                    empty: string;
                                    invalid: string;
                                }
                            };
                            roleAudience: FormAttributes;
                            assignedApplication: FormAttributes;
                            notes: {
                                orgNote: string,
                                appNote: string,
                                cannotCreateRole: string
                            }
                        };
                        rolePermission: {
                            apiResource: {
                                label: string;
                                placeholder: string;
                                hint: {
                                    empty: string;
                                }
                            };
                            permissions: {
                                label: string;
                                placeholder: string;
                                tooltips: {
                                    noScopes: string;
                                    selectAllScopes: string;
                                    removeAPIResource: string;
                                },
                                validation: {
                                    empty: string;
                                };
                                permissionsLabel: string;
                            };
                            notes: {
                                applicationRoles: string;
                            };
                            notifications: {
                                fetchAPIResourceError: Notification;
                            };
                        };
                    };
                    heading: string;
                    permissions: {
                        buttons: {
                            collapseAll: string;
                            expandAll: string;
                            update: string;
                        };
                    };
                    subHeading: string;
                    back: string;
                    summary: {
                        labels: {
                            domain: {
                                role: string;
                                group: string;
                            };
                            permissions: string;
                            roleName: string;
                            roles: string;
                            users: string;
                            groups: string;
                        };
                    };
                    users: {
                        assignUserModal: {
                            heading: string;
                            hint: string;
                            subHeading: string;
                            list: {
                                searchPlaceholder: string;
                                searchByEmailPlaceholder: string;
                                listHeader: string;
                            };
                        };
                    };
                    wizardSteps: {
                        0: string;
                        1: string;
                        2: string;
                        3: string;
                        4: string;
                        5: string;
                    };
                };
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
                edit: {
                    placeholders: {
                        errorPlaceHolder: Placeholder;
                    };
                    basics: {
                        buttons: {
                            update: string;
                        };
                        confirmation: Confirmation;
                        dangerZone: DangerZone;
                        fields: {
                            roleName: {
                                name: string;
                                required: string;
                                placeholder: string;
                            };
                        };
                    };
                    groups: {
                        addGroupsModal: {
                            heading: string;
                            subHeading: string;
                        };
                        placeholders: {
                            emptyPlaceholder: Placeholder;
                            errorPlaceholder: Placeholder;
                        };
                        notifications: {
                            error: NotificationItem;
                            success: NotificationItem;
                            genericError: NotificationItem;
                            fetchError: NotificationItem;
                        };
                        heading: string;
                        localGroupsHeading: string;
                        externalGroupsHeading: string;
                        subHeading: string;
                        actions: {
                            search: {
                                placeholder: string;
                            },
                            assign: {
                                placeholder: string;
                            },
                            remove: {
                                label: string;
                                placeholder: string;
                            }
                        };
                    };
                    menuItems: {
                        basic: string;
                        connectedApps: string;
                        permissions: string;
                        groups: string;
                        users: string;
                        roles: string;
                    };
                    users: {
                        heading: string;
                        subHeading: string;
                        placeholders: {
                            emptyPlaceholder: Placeholder;
                            errorPlaceholder: Placeholder;
                        };
                        notifications: {
                            error: NotificationItem;
                            success: NotificationItem;
                            genericError: NotificationItem;
                            fetchError: NotificationItem;
                        };
                        list: {
                            emptyPlaceholder: Placeholder;
                            user: string;
                            organization: string;
                        };
                        actions: {
                            search: {
                                placeholder: string;
                            },
                            assign: {
                                placeholder: string;
                            },
                            remove: {
                                label: string;
                                placeholder: string;
                            }
                        };
                    };
                    permissions: {
                        heading: string;
                        subHeading: string;
                        readOnlySubHeading: string;
                        removedPermissions: string;
                    };
                };
                list: {
                    buttons: {
                        addButton: string;
                        filterDropdown: string;
                    };
                    columns: {
                        actions: string;
                        lastModified: string;
                        name: string;
                        managedByOrg: {
                            label: string;
                            header: string;
                        };
                        managedByApp: {
                            label: string;
                            header: string;
                        };
                        audience: string;
                    };
                    confirmations: {
                        deleteItem: Confirmation;
                        deleteItemError: InfoModal;
                    };
                    emptyPlaceholders: {
                        search: Placeholder;
                        emptyRoleList: Placeholder;
                    };
                    popups: {
                        delete: string;
                        edit: string;
                    };
                    filterOptions: {
                        all: string;
                        applicationRoles: string;
                        organizationRoles: string;
                    };
                    filterAttirbutes: {
                        name: string;
                        audience: string;
                    };
                };
                readOnlyList: {
                    emptyPlaceholders: {
                        searchAndFilter: Placeholder;
                    }
                }
                notifications: {
                    deleteRole: Notification;
                    fetchRoles: Notification;
                    fetchRole: Notification;
                    updateRole: Notification;
                    createRole: Notification;
                    createPermission: Notification;
                };
            };
            serverConfigs: {
                server: {
                    title: string;
                    description: string;
                };
                adminAdvisory: {
                    configurationEditSection: {
                        backButtonLabel: string;
                        pageHeading: string;
                        pageSubheading: string;
                        form: {
                            bannerContent: {
                                label: string;
                                hint: string;
                                placeholder: string;
                            };
                        };
                    };
                    configurationSection: {
                        disabled: string;
                        description: string;
                        enabled: string;
                        heading: string;
                    };
                    notifications: {
                        disbleAdminAdvisoryBanner: Notification;
                        enableAdminAdvisoryBanner: Notification;
                        getConfigurations: Notification;
                        updateConfigurations: Notification;
                    };
                    pageHeading: string;
                    pageSubheading: string;
                };
                manageNotificationSendingInternally: {
                    title: string;
                    description: string;
                };
                remoteLogPublishing: {
                    title: string;
                    pageTitle: string;
                    description: string;
                    fields: {
                        logTypes: {
                            label: string;
                            values: {
                                carbonLogs: string;
                                auditLogs: string;
                                allLogs: string;
                            }
                        },
                        remoteURL: {
                            label: string;
                        },
                        advanced: {
                            title: string,
                            connectionTimeout: {
                                label: string;
                            },
                            verifyHostname: {
                                label: string;
                            },
                            basicAuthConfig: {
                                title: string;
                                serverUsername: {
                                    label: string;
                                },
                                serverPassword: {
                                    label: string;
                                }
                            },
                            sslConfig: {
                                title: string;
                                keystorePath: {
                                    label: string;
                                },
                                keystorePassword: {
                                    label: string;
                                },
                                truststorePath: {
                                    label: string;
                                },
                                truststorePassword: {
                                    label: string;
                                },
                            }
                        }
                    };
                    dangerZone: {
                        title: string;
                        header: string;
                        subheader: string;
                        confirmation: {
                            hint: string;
                            header: string;
                            message: string;
                            content: string;
                        }
                    };
                    notification: {
                        success: {
                            description: string;
                            message: string;
                        };
                        error: {
                            updateError: {
                                description: string;
                                message: string;
                            };
                            fetchError: {
                                description: string;
                                message: string;
                            };
                        }
                    }
                };
                realmConfiguration: {
                    actionTitles: {
                        config: string;
                    };
                    description: string;
                    heading: string;
                    confirmation: {
                        heading: string;
                        message: string;
                    };
                    notifications: {
                        getConfigurations: Notification;
                        updateConfigurations: Notification;
                        emptyHomeRealmIdentifiers: Notification;
                    };
                    form: {
                        homeRealmIdentifiers: FormAttributes;
                        idleSessionTimeoutPeriod: FormAttributes;
                        rememberMePeriod: FormAttributes;
                    };
                };
            };
            sidePanel: {
                accountManagement: string;
                addEmailTemplate: string;
                addEmailTemplateLocale: string;
                approvals: string;
                attributeDialects: string;
                categories: {
                    attributes: string;
                    certificates: string;
                    configurations: string;
                    general: string;
                    users: string;
                    userstores: string;
                    organizations: string;
                };
                certificates: string;
                configurations: string;
                editEmailTemplate: string;
                editExternalDialect: string;
                editGroups: string;
                editLocalClaims: string;
                editRoles: string;
                editUsers: string;
                editUserstore: string;
                emailDomainDiscovery: string;
                emailTemplateTypes: string;
                emailTemplates: string;
                generalConfigurations: string;
                groups: string;
                localDialect: string;
                loginAttemptsSecurity: string;
                multiFactorAuthenticators: string;
                organizations: string;
                otherSettings: string;
                overview: string;
                passwordPolicies: string;
                remoteFetchConfig: string
                roles: string;
                userOnboarding: string;
                users: string;
                userstoreTemplates: string;
                userstores: string;
            };
            transferList: {
                searchPlaceholder: string;
                list: {
                    headers: {
                        0: string;
                        1: string;
                        2: string;
                    };
                    emptyPlaceholders: {
                        default: string;
                        groups: {
                            unselected: string;
                            selected: string;
                        };
                        roles: {
                            unselected: string;
                            selected: string;
                            common: string;
                        };
                        users: {
                            roles: {
                                unselected: string;
                                selected: string;
                            };
                        };
                    };
                };
            };
            user: {
                deleteJITUser: {
                    confirmationModal: {
                        content: string;
                    }
                };
                deleteUser: {
                    confirmationModal: Confirmation;
                };
                revokeAdmin: {
                    confirmationModal: Confirmation;
                };
                disableUser: {
                    confirmationModal: Confirmation;
                };
                editUser: {
                    dangerZoneGroup: {
                        header: string;
                        deleteUserZone: DangerZone;
                        disableUserZone: DangerZone;
                        lockUserZone: DangerZone;
                        passwordResetZone: DangerZone;
                        deleteAdminPriviledgeZone: DangerZone;
                    };
                    dateOfBirth: {
                        placeholder: {
                            part1: string;
                            part2: string;
                        }
                    };
                };
                forms: {
                    addUserForm: {
                        buttons: {
                            radioButton: {
                                label: string;
                                options: {
                                    createPassword: string;
                                    askPassword: string;
                                };
                            };
                        };
                        inputs: {
                            confirmPassword: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                    mismatch: string;
                                };
                            };
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
                            username: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                    invalid: string;
                                    invalidCharacters: string;
                                    regExViolation: string;
                                };
                            };
                            newPassword: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                    regExViolation: string;
                                };
                            };
                            domain: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            email: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                    invalid: string;
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
                lockUser: {
                    confirmationModal: Confirmation;
                };
                modals: {
                    addUserWarnModal: {
                        heading: string;
                        message: string;
                    };
                    addUserWizard: {
                        title: string;
                        subTitle: string;
                        askPassword: {
                            emailVerificationDisabled: string;
                            emailInvalid: string;
                            alphanumericUsernameEnabled: string;
                        };
                        steps: {
                            basicDetails: string;
                            roles: string;
                            groups: string;
                            summary: string;
                            method: string;
                        };
                        buttons: {
                            next: string;
                            previous: string;
                        };
                        wizardSummary: {
                            name: string;
                            groups: string;
                            roles: string;
                            username: string;
                            domain: string;
                            passwordOption: {
                                label: string;
                                message: {
                                    0: string;
                                    1: string;
                                };
                            };
                        };
                    };
                    bulkImportUserWizard: {
                        title: string;
                        subTitle: string;
                        wizardSummary: {
                            inviteEmailInfo: string;
                            successCount: string;
                            failedCount: string;
                            totalUserCreationCount: string;
                            totalUserAssignmentCount: string;
                            tableHeaders: {
                                username: string;
                                status: string;
                                message: string;
                            }
                            tableMessages: {
                                userCreatedMessage: string;
                                invalidDataMessage: string;
                                userAlreadyExistsMessage: string;
                                userCreationAcceptedMessage: string;
                                internalErrorMessage: string;
                                userAssignmentSuccessMessage: string;
                                userAssignmentFailedMessage: string;
                                userAssignmentInternalErrorMessage: string;
                            };
                            tableStatus: {
                                success: string;
                                warning: string;
                                failed: string;
                            };
                            alerts: {
                                importSuccess: NotificationItem;
                                importFailed: {
                                    message: string;
                                    userCreation: string;
                                    groupAssignment: string;
                                }
                            };
                            advanceSearch: {
                                searchByUsername: string;
                                searchByGroup: string;
                                roleGroupFilterAttributePlaceHolder: string;
                            };
                            manualCreation: {
                                alerts: {
                                    creationSuccess: NotificationItem;
                                };
                                hint: string;
                                emailsLabel: string;
                                emailsPlaceholder: string;
                                disabledHint: string;
                                upload: {
                                    buttonText: string;
                                    description: string;
                                };
                                primaryButton: string;
                                groupsLabel: string;
                                groupsPlaceholder: string;
                                warningMessage: string;
                            };
                            fileBased: {
                                hint: string;
                            };
                            responseOperationType: {
                                userCreation: string;
                                roleAssignment: string;
                            };
                            userstoreMessage: string;
                        };
                        buttons: {
                            import: string;
                        },
                        sidePanel: {
                            manual: string;
                            fileBased: string;
                            fileFormatTitle: string;
                            fileFormatContent: string;
                            fileFormatSampleHeading: string;
                        }
                    };
                    changePasswordModal: {
                        header: string;
                        message: string;
                        hint: {
                            setPassword: string;
                            forceReset: string;
                        };
                        passwordOptions: {
                            setPassword: string;
                            forceReset: string;
                        };
                        button: string;
                    };
                };
                profile: {
                    fields: {
                        createdDate: string;
                        generic: {
                            default: string;
                        };
                        userId: string;
                        emails: string;
                        modifiedDate: string;
                        profileUrl: string;
                        name_familyName: string;
                        name_givenName: string;
                        phoneNumbers: string;
                        photos: string;
                        oneTimePassword: string;
                        userName: string;
                    };
                    forms: {
                        generic: {
                            inputs: {
                                placeholder: string;
                                dropdownPlaceholder: string;
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
                    };
                    notifications: {
                        getProfileInfo: Notification;
                        updateProfileInfo: Notification;
                        lockUserAccount: Notification;
                        unlockUserAccount: Notification;
                        disableUserAccount: Notification;
                        enableUserAccount: Notification;
                        changeUserPassword: Notification;
                        forcePasswordReset: Notification;
                        noPasswordResetOptions: Notification;
                    };
                    placeholders: {
                        SCIMDisabled: {
                            heading: string;
                        };
                        userProfile: {
                            emptyListPlaceholder: Placeholder;
                        }
                    };
                };
                updateUser: {
                    groups: {
                        addGroupsModal: {
                            heading: string;
                            subHeading: string;
                        };
                        editGroups: {
                            groupList: {
                                emptyListPlaceholder: {
                                    subTitle: {
                                        0: string;
                                        1: string;
                                        2: string;
                                    };
                                    title: string;
                                };
                                headers: {
                                    0: string;
                                    1: string;
                                };
                            };
                            heading: string;
                            popups: {
                                viewPermissions: string;
                            };
                            searchPlaceholder: string;
                            subHeading: string;
                        };
                        notifications: {
                            addUserGroups: Notification;
                            fetchUserGroups: Notification;
                            removeUserGroups: Notification;
                            updateUserGroups: Notification;
                        };
                    };
                    roles: {
                        addRolesModal: {
                            heading: string;
                            subHeading: string;
                        };
                        editRoles: {
                            confirmationModal: Confirmation;
                            infoMessage: string;
                            roleList: {
                                emptyListPlaceholder: {
                                    subTitle: {
                                        0: string;
                                        1: string;
                                        2: string;
                                    };
                                    title: string;
                                };
                                headers: {
                                    0: string;
                                    1: string;
                                };
                            };
                            placeholders: {
                                emptyPlaceholder: Placeholder;
                            };
                            heading: string;
                            popups: {
                                viewPermissions: string;
                            };
                            searchPlaceholder: string;
                            subHeading: string;
                        };
                        notifications: {
                            addUserRoles: Notification;
                            fetchUserRoles: Notification;
                            removeUserRoles: Notification;
                            updateUserRoles: Notification;
                        };
                        viewPermissionModal: {
                            backButton: string;
                            editButton: string;
                            heading: string;
                        };
                    };
                };
            };
            userstores: {
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
                    fetchUserstores: Notification;
                    fetchUserstoreTemplates: Notification;
                    fetchUserstoreTypes: Notification;
                    fetchUserstoreMetadata: Notification;
                    deleteUserstore: Notification;
                    delay: NotificationItem;
                    updateUserstore: Notification;
                    testConnection: Notification;
                    addUserstore: Notification;
                    apiLimitReachedError: Notification;
                    updateDelay: NotificationItem;
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
                        name: FormField;
                        type: FormField;
                        description: FormField;
                    };
                    connection: {
                        updatePassword: string;
                        testButton: string;
                        connectionErrorMessage: string;
                    };
                    custom: FormField;
                };
                dangerZone: {
                    delete: DangerZone;
                    disable: DangerZone;
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
                    emptySearch: Placeholder;
                    emptyList: Placeholder;
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
            invite?: {
                inviteButton?: string;
                subSelection?: {
                    onBoard?: string;
                    invitees?: string;
                };
                notifications?: {
                    deleteInvite?: Notification;
                    resendInvite?: Notification;
                    sendInvite?: Notification;
                    updateInvite: Notification;
                };
                confirmationModal?: {
                    deleteInvite?: Confirmation;
                    resendInvite?: Confirmation;
                };
                placeholder?: {
                    emptySearchResultPlaceholder: {
                        clearButton: string;
                        subTitle: {
                            0: string;
                            1: string;
                        };
                        title: string;
                    };
                    emptyResultPlaceholder: {
                        addButton: string;
                        subTitle: {
                            0: string;
                            1: string;
                            2: string;
                        };
                        title: string;
                    };
                };
                advancedSearch?: {
                    form: {
                        dropdown: {
                            filterAttributeOptions: {
                                username: string;
                                email: string;
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
                    placeholder: string;
                };
                form?: {
                    sendmail?: {
                        title: string;
                        subTitle: string;
                    };
                };
                rolesUpdateModal?: {
                    header: string;
                    subHeader: string;
                    searchPlaceholder: string;
                };
            };
            parentOrgInvitations: {
                addUserWizard: {
                    heading: string;
                    description: string;
                    hint: string;
                    username: {
                        label: string;
                        placeholder: string;
                        hint: string;
                        validations: {
                            required: string;
                        }
                    },
                    roles: {
                        label: string;
                        placeholder: string;
                        hint: string;
                        validations: {
                            required: string;
                        }
                    },
                    inviteButton: string;
                };
                tab: {
                    usersTab: string
                    invitationsTab: string;
                };
                searchPlaceholder: string;
                searchdropdown: {
                    pendingLabel: string;
                    expiredLabel: string;
                };
                createDropdown: {
                    createLabel: string;
                    inviteLabel: string;
                };
                filterLabel: string;
                emptyPlaceholder: {
                    noPendingInvitations: string;
                    noExpiredInvitations: string;
                    noInvitations: string;
                    noCollaboratorUserInvitations: string;
                };
                invitedUserLabel: string;
            };
            onboarded?: {
                notifications?: {
                    removeUser?: Notification;
                };
                confirmationModal?: {
                    removeUser?: Confirmation;
                };
            };
            validation: {
                fetchValidationConfigData: {
                    error: {
                        description: string;
                        message: string;
                    },
                    genericError: {
                        description: string;
                        message: string;
                    },
                },
                validationError: {
                    minMaxMismatch: string;
                    uniqueChrMismatch: string;
                    consecutiveChrMismatch: string;
                    invalidConfig: string;
                    minLimitError: string;
                    maxLimitError: string;
                    wrongCombination: string;
                }
                notifications: {
                    error: {
                        description: string;
                        message: string;
                    },
                    genericError: {
                        description: string;
                        message: string;
                    },
                    success: {
                        description: string;
                        message: string;
                    }
                },
                pageTitle: string;
                description: string;
                goBackToApplication: string;
                goBackToValidationConfig: string;
            };
            jwtPrivateKeyConfiguration: {
                fetchValidationConfigData: {
                    error: {
                        description: string;
                        message: string;
                    },
                    genericError: {
                        description: string;
                        message: string;
                    },
                },
                notifications: {
                    error: {
                        description: string;
                        message: string;
                    },
                    genericError: {
                        description: string;
                        message: string;
                    },
                    success: {
                        description: string;
                        message: string;
                    }
                },
                pageTitle: string;
                description: string;
                goBackToApplication: string;
                goBackToAccountSecurityConfig: string;
                messageInfo: string;
                tokenReuseEnabled: string;
                tokenReuseDisabled: string;
            };
            insights: {
                pageTitle: string;
                title: string;
                description: string;
                durationMessage: string;
                durationOption: string;
                lastFetchedMessage: {
                    label: string;
                    tooltipText: string;
                },
                advancedFilter: {
                    filterAttribute: string;
                    filterCondition: string;
                    filterValue: string;
                },
                commonFilters: {
                    userId: string;
                },
                activityType: {
                    login: {
                        filters: {
                            userStore: string;
                            serviceProvider: string;
                            identityProvider: string;
                            authenticator: {
                                attributeName: string;
                                values: {
                                    basic: string;
                                    identifierFirst: string;
                                    fido2: string;
                                    magicLink: string;
                                    emailOtp: string;
                                    smsOtp: string;
                                    totp: string;
                                    backupCodes: string;
                                    google: string;
                                    facebook: string;
                                    github: string;
                                    apple: string;
                                    oidc: string;
                                    saml: string;
                                    hypr: string;
                                    organizationLogin: string;
                                };
                            };
                        };
                    };
                    registration: {
                        filters: {
                            onboardingMethod: {
                                attributeName: string;
                                values: {
                                    adminInitiated: string;
                                    userInvited: string;
                                    selfSignUp: string;
                                };
                            };
                        }
                    }
                },
                graphs: {
                    activeUsers: {
                        title: string;
                        titleHint: string;
                    };
                    successLogins: {
                        title: string;
                        titleHint: string;
                    },
                    failedLogins: {
                        title: string;
                    },
                    signups: {
                        title: string;
                        titleHint: string;
                    }
                },
                notifications: {
                    fetchInsights: {
                        genericError: {
                            description: string;
                            message: string;
                        }
                    }
                };
                compareToLastPeriodMessage: string;
            };
        };
        notifications: {
            endSession: Notification;
            getProfileInfo: Notification;
            getProfileSchema: Notification;
        };
        pages: {
            addEmailTemplate: EditPage;
            approvalsPage: Page;
            editTemplate: EditPage;
            emailDomainDiscovery: Page;
            emailLocaleAdd: EditPage;
            emailLocaleAddWithDisplayName: EditPage;
            emailTemplateTypes: Page;
            emailTemplates: EditPage;
            emailTemplatesWithDisplayName: EditPage;
            groups: Page;
            organizations: Page;
            overview: Page;
            oidcScopes: Page;
            oidcScopesEdit: EditPage;
            roles: Page;
            rolesEdit: EditPage;
            groupsEdit: EditPage;
            serverConfigurations: Page;
            users: Page;
            usersEdit: EditPage;
            invite?: Page;
        };
        placeholders: {
            emptySearchResult: Placeholder;
            underConstruction: Placeholder;
        };
    };
    saml2Config: {
        title: string;
        description: string;
        form: {
            metadataValidityPeriod: {
                hint: string;
                label: string;
            };
            destinationUrl: {
                hint: string;
                label: string;
            };
            enableMetadataSigning: {
                label: string;
            };
            validation: {
                metadataValidityPeriod: string;
                destinationURLs: string;
            };
        };
        notifications: {
            updateConfiguration: Notification;
            getConfiguration: Notification;
        };
    };
    sessionManagement: {
        title: string;
        description: string;
        form: {
            idleSessionTimeout: {
                hint: string;
                label: string;
                placeholder: string;
            };
            rememberMePeriod: {
                hint: string;
                label: string;
                placeholder: string;
            };
            validation: {
                rememberMePeriod: string;
                idleSessionTimeout: string;
            };
        };
        notifications: {
            updateConfiguration: Notification;
            getConfiguration: Notification;
        };
    };
    wsFederationConfig: {
        title: string;
        description: string;
        form: {
            enableRequestSigning: {
                label: string;
            };
        };
        notifications: {
            updateConfiguration: Notification;
            getConfiguration: Notification;
        };
    };
}
