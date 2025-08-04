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
export interface ApplicationsNS {
    quickStart: {
        addUserOption: {
            description: string;
            hint: string;
            message: string;
        },
        spa: {
            customConfig: {
                heading:  string;
                anySPATechnology: string;
                configurations: string;
                protocolConfig: string;
                clientId: string;
                baseUrl: string;
                redirectUrl: string;
                scope: string;
                serverEndpoints: string;
            },
            techSelection: {
                heading: string;
            }
        },
        technologySelectionWrapper: {
            subHeading: string;
            otherTechnology: string;
        },
        twa: {
            common: {
                orAnyTechnology: string;
            },
            oidc: {
                customConfig: {
                    clientSecret: string;
                    heading: string;
                }
            },
            saml: {
                customConfig: {
                    heading: string;
                    issuer: string;
                    acsUrl: string;
                    idpEntityId: string;
                    idpUrl: string;
                }
            }
        };
        m2m: {
            customConfig: {
                tokenEndpoint: string;
                tokenRequest: string;
                configurations: string;
            }
        }
    };
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
        addSocialLogin: {
            content: string;
            header: string;
            subHeader: string;
        };
        changeProtocol: {
            header: string;
            message: string;
            content: string;
            assertionHint: string;
        };
        deleteApplication: {
            header: string;
            message: string;
            content: string;
            assertionHint: string;
        };
        deleteChoreoApplication: {
            header: string;
            message: string;
            content: string;
            assertionHint: string;
        };
        disableApplication: {
            header: string;
            message: string;
            content: {
                0: string;
                1: string;
            };
            assertionHint: string;
        },
        enableApplication: {
            header: string;
            message: string;
            content: string;
            assertionHint: string;
        },
        deleteOutboundProvisioningIDP: {
            header: string;
            message: string;
            content: string;
            assertionHint: string;
        };
        deleteProtocol: {
            header: string;
            message: string;
            content: string;
            assertionHint: string;
        };
        handlerAuthenticatorAddition: {
            header: string;
            message: string;
            content: string;
            assertionHint: string;
        };
        backupCodeAuthenticatorDelete: {
            header: string;
            message: string;
            content: string;
            assertionHint: string;
        };
        lowOIDCExpiryTimes: {
            header: string;
            message: string;
            content: string;
            assertionHint: string;
        };
        regenerateSecret: {
            header: string;
            message: string;
            content: string;
            assertionHint: string;
        };
        reactivateSPA: {
            header: string;
            message: string;
            content: string;
            assertionHint: string;
        };
        reactivateOIDC: {
            header: string;
            message: string;
            content: string;
            assertionHint: string;
        };
        removeApplicationUserAttribute: {
            content: string;
            header: string;
            subHeader: string;
        };
        removeApplicationUserAttributeMapping: {
            content: string;
            header: string;
            subHeader: string;
        };
        revokeApplication: {
            header: string;
            message: string;
            content: string;
            assertionHint: string;
        };
        inProgressReshare: {
            header: string;
            message: string;
            content: string;
            assertionHint: string;
        };
        clientSecretHashDisclaimer: {
            modal: {
                header: string;
                message: string;
                content: string;
                assertionHint: string;
            };
            forms: {
                clientIdSecretForm: {
                    clientId: {
                        hide: string;
                        show: string;
                        label: string;
                        placeholder: string;
                        validations: {
                            empty: string;
                        };
                    };
                    clientSecret: {
                        hide: string;
                        show: string;
                        label: string;
                        placeholder: string;
                        validations: {
                            empty: string;
                        };
                    };
                };
            };
        };
        certificateDelete: {
            header: string;
            message: string;
            content: string;
            assertionHint: string;
        } & Record<string, string>;
    };
    dangerZoneGroup: {
        header: string;
        deleteApplication: {
            actionTitle: string;
            header: string;
            subheader: string;
        };
        disableApplication: {
            actionTitle: string
            header: string;
            subheader: string;
        },
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
                                emptyPlaceholder: {
                                    title: string;
                                    subtitles: string;
                                };
                                heading: string;
                                subHeading: string;
                            };
                            quickSetup: {
                                emptyPlaceholder: {
                                    title: string;
                                    subtitles: string;
                                };
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
                };
            };
            advanced: {
                tabName: string;
            };
            attributes: {
                forms: {
                    fields: {
                        dynamic: {
                            localRole: {
                                label: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            applicationRole: {
                                label: string;
                                validations: {
                                    empty: string;
                                    duplicate: string;
                                };
                            };
                        };
                    };
                };
                selection: {
                    addWizard: {
                        header: string;
                        subHeading: string;
                        note: string;
                        steps: {
                            select: {
                                transfer: {
                                    searchPlaceholders: {
                                        attribute: string;
                                        role: string;
                                    };
                                    headers: {
                                        attribute: string;
                                    };
                                };
                            };
                        };
                    };
                    heading: string;
                    scopelessAttributes: {
                        description: string;
                        displayName: string;
                        name: string;
                        hint: string;
                    };
                    subjectAttributeSelectedHint: string;
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
                                claim: {
                                    label: string;
                                    placeholder: string;
                                };
                            };
                        };
                        searchPlaceholder: string;
                    };
                    selectAll: string;
                };
                attributeMappingChange: {
                    error: {
                        message: string;
                        description: string;
                    };
                };
                emptySearchResults: {
                    subtitles: {
                        0: string;
                        1: string;
                    };
                    title: string;
                };
                roleMapping: {
                    heading: string;
                };
                tabName: string;
            };
            info: {
                mtlsOidcHeading: string;
                mtlsOidcSubHeading: string;
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
                                };
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
                                    };
                                };
                            };
                            stepBased: {
                                actions: {
                                    addAuthentication: string;
                                    addNewStep: string;
                                    addStep: string;
                                    selectAuthenticator: string;
                                };
                                addAuthenticatorModal: {
                                    description: string;
                                    heading: string;
                                    content: Record<string, unknown>;
                                    primaryButton: string;
                                    secondaryButton: string;
                                };
                                heading: string;
                                hint: string;
                                forms: {
                                    fields: {
                                        attributesFrom: {
                                            label: string;
                                            placeholder: string;
                                        };
                                        subjectIdentifierFrom: {
                                            label: string;
                                            placeholder: string;
                                        };
                                        enableBackupCodes: {
                                            label: string;
                                        };
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
                        banners: {
                            registrationConfiguration: string;
                        };
                        defaultConfig: {
                            description: {
                                0: string;
                                1: string;
                            };
                            heading: string;
                        };
                        flowBuilder: {
                            addMissingSocialAuthenticatorModal: {
                                description: string;
                                heading: string;
                                content: Record<string, unknown>;
                                primaryButton: string;
                                secondaryButton: string;
                            };
                            duplicateSocialAuthenticatorSelectionModal: {
                                description: string;
                                heading: string;
                                content: Record<string, unknown>;
                                primaryButton: string;
                                secondaryButton: string;
                            };
                            heading: string;
                            headings: {
                                default: string;
                                socialLogin: string;
                                multiFactorLogin: string;
                                passwordlessLogin: string;
                            };
                            types: {
                                apple: {
                                    description: string;
                                    heading: string;
                                };
                                defaultConfig: {
                                    description: string;
                                    heading: string;
                                };
                                facebook: {
                                    description: string;
                                    heading: string;
                                };
                                github: {
                                    description: string;
                                    heading: string;
                                };
                                google: {
                                    description: string;
                                    heading: string;
                                };
                                idf: {
                                    tooltipText: string;
                                };
                                totp: {
                                    description: string;
                                    heading: string;
                                };
                                usernameless: {
                                    description: string;
                                    heading: string;
                                    info: string;
                                };
                                passkey: {
                                    description: string;
                                    heading: string;
                                    info: {
                                        progressiveEnrollmentEnabled: string;
                                        passkeyAsFirstStepWhenprogressiveEnrollmentEnabled: string;
                                        passkeyIsNotFirstStepWhenprogressiveEnrollmentEnabled: string;
                                        progressiveEnrollmentEnabledCheckbox: string;
                                        progressiveEnrollmentDisabled: string;
                                    };
                                };
                                magicLink: {
                                    description: string;
                                    heading: string;
                                };
                                microsoft: {
                                    description: string;
                                    heading: string;
                                };
                                emailOTP: {
                                    description: string;
                                    heading: string;
                                };
                                smsOTP: {
                                    description: string;
                                    heading: string;
                                };
                                emailOTPFirstFactor: {
                                    description: string;
                                    heading: string;
                                };
                                smsOTPFirstFactor: {
                                    description: string;
                                    heading: string;
                                };
                            };
                        };
                    };
                    requestPathAuthenticators: {
                        title: string;
                        subTitle: string;
                        notifications: {
                            getRequestPathAuthenticators: {
                                error: {
                                    message: string;
                                    description: string;
                                };
                                genericError: {
                                    message: string;
                                    description: string;
                                };
                                success: {
                                    message: string;
                                    description: string;
                                };
                            };
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
                doNotShareApplication: string;
                shareAllApplication: string;
                shareSelectedApplication: string;
                allRolesAndOrgsSharingMessage: string;
                allRolesAndOrgsNotSharingMessage: string;
                doNotShareRolesWithAllOrgs: string;
                subTitle: string;
                tabName: string;
                sharedAccessStatusOptions: {
                    all: string;
                    success: string;
                    failed: string;
                    partiallyCompleted: string;
                };
                orgNotSelectedForRoleSharing: string;
                noRolesAvailableForOrg: string;
                noSharedOrgs: string;
                rolesSharedPartially: string;
                shareRoleSubsetWithSelectedOrgs: string;
                shareRoleSubsetWithAllOrgs: string;
                searchAvailableRolesPlaceholder: string;
                manageRoleSharing: string;
                viewRoleSharing: string;
                selectAnOrganizationToViewRoles: string;
                shareAllRoles: string;
                shareSelectedRoles: string;
                doNotShareRoles: string;
                notifications: {
                    fetchApplicationOrgTree: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    fetchOrganizations: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    fetchApplicationRoles: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    unshare: {
                        success: {
                            message: string;
                            description: string;
                        };
                        error: {
                            message: string;
                            description: string;
                        };
                    };
                    share: {
                        success: {
                            message: string;
                            description: string;
                        };
                        error: {
                            message: string;
                            description: string;
                        };
                    };
                    noRolesSelected: {
                        description: string;
                        message: string;
                    };
                };
            };
            shareApplication: {
                heading: string;
                shareApplication: string;
                addSharingNotification: {
                    genericError: {
                        message: string;
                        description: string;
                    };
                    success: {
                        message: string;
                        description: string;
                    };
                };
                stopSharingNotification: {
                    genericError: {
                        message: string;
                        description: string;
                    };
                    success: {
                        message: string;
                        description: string;
                    };
                };
                getSharedOrganizations: {
                    genericError: {
                        message: string;
                        description: string;
                    };
                };
                stopAllSharingNotification: {
                    genericError: {
                        message: string;
                        description: string;
                    };
                    success: {
                        message: string;
                        description: string;
                    };
                };
                completedSharingNotification: {
                    failure: {
                        message: string;
                        description: string;
                    },
                    success: {
                        message: string;
                        description: string;
                    },
                    partialSuccess: {
                        message: string;
                        description: string;
                    }
                },
                addAsyncSharingNotification: {
                    message: string,
                    description: string,
                },
                asyncOperationStatus: {
                    inProgress: {
                        heading: string,
                        description: string
                    },
                    failed: {
                        heading: string,
                        description: string,
                        actionText: string
                    },
                    partiallyCompleted: {
                        heading: string,
                        description: string,
                        actionText: string
                    }
                },
                switchToSelectiveShareFromSharingWithAllSuborgsWarning: string;
                applicationShareFailureSummaryDefaultStatus: {
                    success: string,
                    failed: string,
                    partiallyCompleted: string
                }
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
            };
        };
    };
    forms: {
        advancedAttributeSettings: {
            sections: {
                linkedAccounts: {
                    errorAlert: {
                        message: string;
                        description: string;
                    };
                    heading: string;
                    descriptionFederated: string;
                    fields: {
                        validateLocalAccount: {
                            hint: string;
                            label: string;
                        };
                        mandateLocalAccount: {
                            hint: string;
                            label: string;
                        };
                    };
                };
                subject: {
                    fields: {
                        alternateSubjectAttribute: {
                            hint: string;
                            label: string;
                        };
                        subjectAttribute: {
                            hintOIDC: string;
                            hintSAML: string;
                            hint: string;
                            label: string;
                            validations: {
                                empty: string;
                            };
                            placeholder: string;
                            info: string;
                        };
                        subjectIncludeTenantDomain: {
                            hint: string;
                            label: string;
                            validations: {
                                empty: string;
                            };
                        };
                        subjectIncludeUserDomain: {
                            hint: string;
                            label: string;
                            validations: {
                                empty: string;
                            };
                        };
                        subjectUseMappedLocalSubject: {
                            hint: string;
                            label: string;
                            validations: {
                                empty: string;
                            };
                        };
                        subjectType: {
                            public: {
                                label: string;
                                hint: string;
                            };
                            pairwise: {
                                label: string;
                                hint: string;
                            };
                            label: string;
                        };
                        sectorIdentifierURI: {
                            multipleCallbackError: string;
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                invalid: string;
                                required: string;
                            };
                        };
                    };
                    heading: string;
                };
                role: {
                    heading: string;
                    fields: {
                        roleAttribute: {
                            hint: string;
                            label: string;
                            validations: {
                                empty: string;
                            };
                        };
                        role: {
                            hint: string;
                            label: string;
                            validations: {
                                empty: string;
                            };
                        };
                    };
                };
            };
        };
        advancedConfig: {
            fields: {
                enableAuthorization: {
                    hint: string;
                    label: string;
                    validations: {
                        empty: string;
                    };
                };
                returnAuthenticatedIdpList: {
                    hint: string;
                    label: string;
                    validations: {
                        empty: string;
                    };
                };
                saas: {
                    hint: string;
                    label: string;
                    validations: {
                        empty: string;
                    };
                };
                skipConsentLogin: {
                    hint: string;
                    label: string;
                    validations: {
                        empty: string;
                    };
                };
                skipConsentLogout: {
                    hint: string;
                    label: string;
                    validations: {
                        empty: string;
                    };
                };
            };
            sections: {
                applicationNativeAuthentication: {
                    heading: string;
                    fields: {
                        enableAPIBasedAuthentication: {
                            hint: string;
                            label: string;
                        };
                    };
                };
                clientAttestation: {
                    heading: string;
                    alerts: {
                        clientAttestationAlert: string;
                    };
                    fields: {
                        enableClientAttestation: {
                            hint: string;
                            label: string;
                        };
                        androidAttestationServiceCredentials: {
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                invalid: string;
                            };
                        };
                    };
                };
                trustedApps: {
                    heading: string;
                    alerts: {
                        trustedAppSettingsAlert: string;
                        link: string;
                    };
                    fields: {
                        enableFIDOTrustedApps: {
                            hint: string;
                            label: string;
                        };
                    };
                    modal:{
                        assertionHint: string;
                        header: string;
                        message: string;
                        content: string;
                    }
                };
                platformSettings: {
                    heading: string;
                    subTitle: string;
                    fields: {
                        android: {
                            heading: string;
                            fields: {
                                androidPackageName: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                    validations: {
                                        emptyForAttestation: string;
                                        emptyForFIDO: string;
                                    };
                                };
                                keyHashes: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                    validations: {
                                        invalidOrEmpty: string;
                                        duplicate: string;
                                    };
                                    tooltip: string;
                                };
                            };
                        };
                        apple: {
                            heading: string;
                            fields: {
                                appleAppId: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                            };
                        };
                    };
                };
                certificate: {
                    heading: string;
                    hint: {
                        customOidc: string;
                        customPassiveSTS: string;
                        customSaml: string;
                    };
                    fields: {
                        jwksValue: {
                            description: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                invalid: string;
                            };
                        };
                        pemValue: {
                            description: string;
                            actions: {
                                view: string;
                            };
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                invalid: string;
                            };
                        };
                        type: {
                            children: {
                                jwks: {
                                    label: string;
                                };
                                pem: {
                                    label: string;
                                };
                            };
                            label: string;
                        };
                    };
                    invalidOperationModal: {
                        header: string;
                        message: string;
                    };
                };
            };
        };
        applicationsSettings: {
            title: string;
            fields :{
                dcrEndpoint: {
                    label: string,
                    hint: string
                };
                ssaJwks: {
                    label: string,
                    placeholder: string,
                    hint: string,
                    validations: {
                        empty: string
                    }
                };
                mandateSSA: {
                    label: string,
                    hint: string
                };
                authenticationRequired: {
                    label: string,
                    hint: string
                };
                enforceFapi: {
                    label: string,
                    hint: string
                };
            }
        };
        generalDetails: {
            sections: {
                branding: {
                    title: string;
                }
            };
            brandingLink: {
                hint: string;
                label: string;
            };
            fields: {
                name: {
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                        duplicate: string;
                        reserved: string;
                    };
                };
                description: {
                    label: string;
                    placeholder: string;
                };
                imageUrl: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        invalid: string;
                    };
                };
                discoverable: {
                    hint: string;
                    label: string;
                };
                discoverableGroups: {
                    label: string;
                    action: {
                        assign: string;
                    };
                    radioOptions: {
                        everyone: string;
                        userGroups: string;
                    };
                };
                accessUrl: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    ariaLabel: string;
                    validations: {
                        empty: string;
                        invalid: string;
                    };
                };
                isSharingEnabled: {
                    hint: string;
                    label: string;
                };
                isManagementApp: {
                    hint: string;
                    label: string;
                };
                isFapiApp: {
                    hint: string;
                    label: string;
                };
            };
            managementAppBanner: string;
        };
        inboundCustom: {
            fields: {
                checkbox: {
                    label: string;
                    validations: {
                        empty: string;
                    };
                };
                dropdown: {
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                    };
                };
                generic: {
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                    };
                };
                password: {
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                    };
                };
            };
        };
        inboundOIDC: {
            description: string;
            documentation: string;
            fields: {
                allowedOrigins: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                    };
                };
                callBackUrls: {
                    info: string;
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                        invalid: string;
                        required: string;
                    };
                };
                clientID: {
                    label: string;
                };
                clientSecret: {
                    hashedDisclaimer: string;
                    hideSecret: string;
                    message: string;
                    showSecret: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                    };
                };
                grant: {
                    children: {
                        client_credential: {
                            hint: string;
                            label: string;
                        };
                        implicit: {
                            hint: string;
                            label: string;
                        };
                        password: {
                            hint: string;
                            label: string;
                        };
                    };
                    validation: {
                        refreshToken: string;
                    };
                    hint: string;
                    label: string;
                    validations: {
                        empty: string;
                    };
                };
                public: {
                    hint: string;
                    label: string;
                    validations: {
                        empty: string;
                    };
                };
                hybridFlow: {
                    hybridFlowResponseType: {
                        children: {
                            code_token: {
                                hint: string;
                            };
                            code_idtoken_token: {
                                hint: string;
                            }
                        }
                    }
                }
            };
            mobileApp: {
                discoverableHint: string;
                mobileAppPlaceholder: string;
            };
            dropdowns: {
                selectOption: string;
            };
            sections: {
                accessToken: {
                    heading: string;
                    hint: string;
                    fields: {
                        bindingType: {
                            children: {
                                ssoBinding: {
                                    label: string;
                                };
                                cookie: {
                                    label: string;
                                };
                                clientRequest: {
                                    label: string;
                                };
                                certificate: {
                                    label: string;
                                };
                                deviceFlow: {
                                    label: string;
                                };
                            };
                            description: string;
                            label: string;
                            valueDescriptions: {
                                cookie: string;
                                none: string;
                                sso_session: string;
                                dpop: string;
                            };
                        };
                        expiry: {
                            labelForSPA: string;
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                invalid: string;
                            };
                        };
                        applicationTokenExpiry: {
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                invalid: string;
                            };
                        };
                        type: {
                            label: string;
                            valueDescriptions: {
                                default: string;
                                jwt: string;
                            };
                        };
                        revokeToken: {
                            hint: string;
                            label: string;
                        };
                        validateBinding: {
                            hint: string;
                            label: string;
                        };
                        audience: {
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                duplicate: string;
                                invalid: string;
                            };
                        };
                        accessTokenAttributes: {
                            hint: string;
                            label:string;
                            placeholder: string;
                        };
                    };
                };
                idToken: {
                    heading: string;
                    fields: {
                        expiry: {
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                invalid: string;
                            };
                        };
                        algorithm: {
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                            };
                        };
                        audience: {
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                duplicate: string;
                                invalid: string;
                            };
                        };
                        encryption: {
                            hint: string;
                            label: string;
                            validations: {
                                empty: string;
                            };
                        };
                        signing: {
                            hint: string;
                            label: string;
                            placeholder: string;
                        };
                        method: {
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                            };
                        };
                    };
                };
                outdatedApplications: {
                    alert : {
                        title: string;
                        content: string;
                        viewButton: string;
                        hideButton: string;
                        action: string;
                    }
                    label: string;
                    documentationHint: string;
                    confirmationModal: {
                        assertionHint: string;
                        header: string;
                        message: string;
                        content: string;
                    },
                    fields: {
                        commonInstruction: string;
                        versions: {
                            version100: {
                                removeUsernameFromIntrospectionRespForAppTokens: {
                                    instruction: string;
                                },
                                useClientIdAsSubClaimOfAppTokens: {
                                    instruction: string;
                                }
                            },
                            version200: {
                                addAllRequestedClaimsInJWTAccessToken: {
                                    instruction: string;
                                }
                            }
                        };
                    }
                };
                logoutURLs: {
                    heading: string;
                    fields: {
                        back: {
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                invalid: string;
                            };
                        };
                        front: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                invalid: string;
                            };
                        };
                    };
                };
                pkce: {
                    description: string;
                    heading: string;
                    hint: string;
                    fields: {
                        pkce: {
                            children: {
                                mandatory: {
                                    label: string;
                                };
                                plainAlg: {
                                    label: string;
                                };
                            };
                            label: string;
                            validations: {
                                empty: string;
                            };
                        };
                    };
                };
                clientAuthentication: {
                    heading: string;
                    fields: {
                        authenticationMethod: {
                            hint: string;
                            label: string;
                            placeholder: string;
                        };
                        reusePvtKeyJwt: {
                            hint: string;
                            label: string;
                        };
                        signingAlgorithm: {
                            hint: string;
                            label: string;
                            placeholder: string;
                        };
                        subjectDN: {
                            hint: string;
                            label: string;
                            placeholder: string;
                        };
                    };
                };
                pushedAuthorization: {
                    heading: string;
                    fields: {
                        requirePushAuthorizationRequest: {
                            hint: string;
                            label: string;
                        };
                    };
                };
                requestObject: {
                    heading: string;
                    fields: {
                        requestObjectSigningAlg: {
                            hint: string;
                            label: string;
                            placeholder: string;
                        };
                        requestObjectEncryptionAlgorithm: {
                            hint: string;
                            label: string;
                            placeholder: string;
                        };
                        requestObjectEncryptionMethod: {
                            hint: string;
                            label: string;
                            placeholder: string;
                        };
                    };
                };
                refreshToken: {
                    heading: string;
                    fields: {
                        expiry: {
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                invalid: string;
                            };
                        };
                        renew: {
                            hint: string;
                            label: string;
                            validations: {
                                empty: string;
                            };
                        };
                    };
                };
                subjectToken: {
                    fields: {
                        enable: {
                            hint: string;
                            label: string;
                            validations: {
                                empty: string;
                            };
                        };
                        expiry: {
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                invalid: string;
                            };
                        };
                    };
                    heading: string;
                };
                requestObjectSignature: {
                    heading: string;
                    description: string;
                    fields: {
                        signatureValidation: {
                            label: string;
                        };
                    };
                };
                scopeValidators: {
                    heading: string;
                    fields: {
                        validator: {
                            label: string;
                            validations: {
                                empty: string;
                            };
                        };
                    };
                };
                certificates: {
                    disabledPopup: string;
                };
                hybridFlow: {
                    heading: string;
                    enable: {
                        label: string;
                    };
                    hybridFlowResponseType: {
                        label: string;
                        fields: {
                            children: {
                                code_token: {
                                    label: string;
                                };
                                code_idtoken: {
                                    label: string;
                                };
                                code_idtoken_token: {
                                    label: string;
                                };
                            };
                            hint: string;
                        };
                    }
                };
            };
            messages: {
                revokeDisclaimer: {
                    heading: string;
                    content: string;
                };
                customInvalidMessage: string;
            };
        };
        inboundSAML: {
            description: string;
            documentation: string;
            fields: {
                assertionURLs: {
                    info: string;
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                        invalid: string;
                        required: string;
                    };
                };
                defaultAssertionURL: {
                    hint: string;
                    label: string;
                    validations: {
                        empty: string;
                    };
                };
                idpEntityIdAlias: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                        invalid: string;
                    };
                };
                issuer: {
                    errorMessage: string;
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                    };
                };
                metaURL: {
                    errorMessage: string;
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                        invalid: string;
                    };
                };
                mode: {
                    children: {
                        manualConfig: {
                            label: string;
                        };
                        metadataFile: {
                            label: string;
                        };
                        metadataURL: {
                            label: string;
                        };
                    };
                    hint: string;
                    label: string;
                };
                qualifier: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                    };
                };
            };
            sections: {
                assertion: {
                    heading: string;
                    fields: {
                        audience: {
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                invalid: string;
                            };
                        };
                        nameIdFormat: {
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                            };
                        };
                        recipients: {
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                invalid: string;
                            };
                        };
                    };
                };
                attributeProfile: {
                    heading: string;
                    fields: {
                        attributeNameFormat: {
                            hint: string;
                            label: string;
                        };
                        enable: {
                            hint: string;
                            label: string;
                        };
                        includeAttributesInResponse: {
                            hint: string;
                            label: string;
                        };
                        serviceIndex: {
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                            };
                        };
                    };
                };
                encryption: {
                    heading: string;
                    fields: {
                        assertionEncryption: {
                            hint: string;
                            label: string;
                            validations: {
                                empty: string;
                            };
                        };
                        assertionEncryptionAlgorithm: {
                            label: string;
                            validations: {
                                empty: string;
                            };
                        };
                        keyEncryptionAlgorithm: {
                            label: string;
                            validations: {
                                empty: string;
                            };
                        };
                    };
                };
                idpInitiatedSLO: {
                    heading: string;
                    fields: {
                        enable: {
                            hint: string;
                            label: string;
                            validations: {
                                empty: string;
                            };
                        };
                        returnToURLs: {
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                invalid: string;
                            };
                        };
                    };
                };
                responseSigning: {
                    heading: string;
                    fields: {
                        digestAlgorithm: {
                            label: string;
                            validations: {
                                empty: string;
                            };
                        };
                        responseSigning: {
                            hint: string;
                            label: string;
                        };
                        signingAlgorithm: {
                            label: string;
                            validations: {
                                empty: string;
                            };
                        };
                    };
                };
                requestProfile: {
                    heading: string;
                    fields: {
                        enable: {
                            label: string;
                            validations: {
                                empty: string;
                            };
                        };
                    };
                };
                requestValidation: {
                    heading: string;
                    fields: {
                        signatureValidation: {
                            hint: string;
                            label: string;
                            validations: {
                                empty: string;
                            };
                        };
                        signatureValidationCertAlias: {
                            hint: string;
                            label: string;
                            validations: {
                                empty: string;
                            };
                        };
                    };
                };
                sloProfile: {
                    heading: string;
                    fields: {
                        enable: {
                            hint: string;
                            label: string;
                            validations: {
                                empty: string;
                            };
                        };
                        logoutMethod: {
                            label: string;
                            validations: {
                                empty: string;
                            };
                        };
                        requestURL: {
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                invalid: string;
                            };
                        };
                        responseURL: {
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                invalid: string;
                            };
                        };
                    };
                };
                ssoProfile: {
                    heading: string;
                    fields: {
                        artifactBinding: {
                            hint: string;
                            label: string;
                        };
                        bindings: {
                            hint: string;
                            label: string;
                            validations: {
                                empty: string;
                            };
                        };
                        idpInitiatedSSO: {
                            hint: string;
                            label: string;
                            validations: {
                                empty: string;
                            };
                        };
                    };
                };
                certificates: {
                    disabledPopup: string;
                    certificateRemoveConfirmation: {
                        header: string;
                        content: string;
                    };
                };
            };
        };
        inboundSTS: {
            fields: {
                realm: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                    };
                };
                replyTo: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                        invalid: string;
                    };
                };
                replyToLogout: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                        invalid: string;
                    };
                };
            };
        };
        inboundWSTrust: {
            fields: {
                audience: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                        invalid: string;
                    };
                };
                certificateAlias: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                    };
                };
            };
        };
        outboundProvisioning: {
            fields: {
                blocking: {
                    hint: string;
                    label: string;
                };
                connector: {
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                    };
                };
                idp: {
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                    };
                };
                jit: {
                    hint: string;
                    label: string;
                };
                rules: {
                    hint: string;
                    label: string;
                };
            };
        };
        provisioningConfig: {
            fields: {
                proxyMode: {
                    hint: string;
                    label: string;
                };
                userstoreDomain: {
                    hint: string;
                    label: string;
                };
            };
        };
        spaProtocolSettingsWizard: {
            fields: {
                callBackUrls: {
                    label: string;
                    validations: {
                        empty: string;
                        invalid: string;
                    };
                };
                name: {
                    label: string;
                    validations: {
                        invalid: string;
                    };
                };
                urlDeepLinkError: string;
            };
        };
    };
    helpPanel: {
        tabs: {
            configs: {
                content: {
                    subTitle: string;
                    title: string;
                };
                heading: string;
            };
            docs: {
                content: null;
                heading: string;
            };
            samples: {
                content: {
                    sample: {
                        configurations: {
                            btn: string;
                            subTitle: string;
                            title: string;
                        };
                        downloadSample: {
                            btn: string;
                            subTitle: string;
                            title: string;
                        };
                        goBack: string;
                        subTitle: string;
                        title: string;
                    };
                    technology: {
                        subTitle: string;
                        title: string;
                    };
                };
                heading: string;
            };
            sdks: {
                content: {
                    sdk: {
                        goBack: string;
                        subTitle: string;
                        title: string;
                    };
                };
                heading: string;
            };
            start: {
                content: {
                    endpoints: {
                        subTitle: string;
                        title: string;
                    };
                    oidcConfigurations: {
                        labels: {
                            authorize: string;
                            dynamicClientRegistration: string;
                            endSession: string;
                            introspection: string;
                            issuer: string;
                            jwks: string;
                            keystore: string;
                            openIdServer: string;
                            pushedAuthorizationRequest: string;
                            revoke: string;
                            sessionIframe: string;
                            token: string;
                            userInfo: string;
                            webFinger: string;
                            wellKnown: string;
                        };
                    };
                    samlConfigurations: {
                        buttons: {
                            certificate: string;
                            metadata: string;
                        };
                        labels: {
                            certificate: string;
                            issuer: string;
                            metadata: string;
                            slo: string;
                            sso: string;
                            destinationURL: string;
                            artifactResolutionUrl: string;
                        };
                    };
                    trySample: {
                        btn: string;
                        subTitle: string;
                        title: string;
                    };
                    useSDK: {
                        btns: {
                            withSDK: string;
                            withoutSDK: string;
                        };
                        subTitle: string;
                        title: string;
                    };
                    wsFedConfigurations: {
                        labels: {
                            passiveSTSUrl: string;
                        };
                    };
                };
                heading: string;
            };
        };
    };
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
        };
    };
    myaccount: {
        settings: string;
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
            };
            genericError: {
                description: string;
                message: string;
            };
        };
        overview: {
            tabName: string;
            heading: string;
            contentIntro: string;
            contentDescription: string;
            shareApplication: string;
        };
    };
    featureGate: {
        enabledFeatures: {
            tags: {
                premium: {
                    warning: string;
                };
            };
        };
    };
    notifications: {
        invalidPEMFile: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        addApplication: {
            error: {
                message: string;
                description: string;
            };
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
        authenticationStepMin: {
            genericError: {
                message: string;
                description: string;
            };
        };
        authenticationStepDeleteErrorDueToSecondFactors: {
            genericError: {
                message: string;
                description: string;
            };
        };
        authenticationStepDeleteErrorDueToAppShared: {
            genericError: {
                message: string;
                description: string;
            };
        };
        deleteApplication: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        deleteOptionErrorDueToSecondFactorsOnRight: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        deleteProtocolConfig: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        duplicateAuthenticationStep: {
            genericError: {
                message: string;
                description: string;
            };
        };
        emptyAuthenticationStep: {
            genericError: {
                message: string;
                description: string;
            };
        };
        fetchAllowedCORSOrigins: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        fetchApplication: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        fetchMyAccountApplication: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        fetchApplications: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        fetchCustomInboundProtocols: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        fetchInboundProtocols: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        fetchProtocolMeta: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        fetchSAMLIDPConfigs: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        fetchOIDCIDPConfigs: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        fetchTemplate: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        fetchTemplates: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        getInboundProtocolConfig: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        regenerateSecret: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        revokeApplication: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        tierLimitReachedError: {
            emptyPlaceholder: {
                action: string;
                title: string;
                subtitles: string;
            };
            heading: string;
        };
        updateAdvancedConfig: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        updateApplication: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        disableApplication: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        },
        updateAuthenticationFlow: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            invalidScriptError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        updateClaimConfig: {
            mistmatchAlternativesubjectIdentifierError: {
                message: string;
                description: string;
            }
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        updateInboundProtocolConfig: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        updateInboundProvisioningConfig: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        updateOutboundProvisioning: {
            genericError: {
                message: string;
                description: string;
            };
        };
        updateProtocol: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        fetchOIDCServiceEndpoints: {
            genericError: {
                message: string;
                description: string;
            };
        };
        secondFactorAuthenticatorToFirstStep: {
            genericError: {
                message: string;
                description: string;
            };
        };
        firstFactorAuthenticatorToSecondStep: {
            genericError: {
                message: string;
                description: string;
            };
        };
        conditionalScriptLoopingError: {
            message: string;
            description: string;
        };
        deleteCertificateSuccess: {
            message: string;
            description: string;
        };
        deleteCertificateGenericError: {
            message: string;
            description: string;
        };
        updateOnlyIdentifierFirstError: {
            message: string;
            description: string;
        };
        updateIdentifierFirstInFirstStepError: {
            message: string;
            description: string;
        };
    };
    popups: {
        appStatus: {
            active: {
                content: string;
                header: string;
                subHeader: string;
            };
            notConfigured: {
                content: string;
                header: string;
                subHeader: string;
            };
            revoked: {
                content: string;
                header: string;
                subHeader: string;
            };
        };
    };
    placeholders: {
        emptyAttributesList: {
            action: string;
            title: string;
            subtitles: string;
        };
        emptyAuthenticatorStep: {
            title: string;
            subtitles: {
                0: string;
            };
        };
        emptyAuthenticatorsList: {
            title: string;
            subtitles: string;
        };
        emptyOutboundProvisioningIDPs: {
            action: string;
            title: string;
            subtitles: string;
        };
        emptyList: {
            action: string;
            title: string;
            subtitles: {
                0: string;
                1: string;
                2: string;
            };
        };
        emptyProtocolList: {
            action: string;
            title: string;
            subtitles: {
                0: string;
                1: string;
                2: string;
            };
        };
    };
    resident: {
        provisioning: {
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
                };
                emptyPlaceholder: {
                    action: string;
                    title: string;
                    subtitles: string;
                };
                form: {
                    fields: {
                        connection: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                            };
                        };
                    };
                };
                heading: string;
                subHeading: string;
                notifications: {
                    create: {
                        error: {
                            message: string;
                            description: string;
                        };
                        genericError: {
                            message: string;
                            description: string;
                        };
                        success: {
                            message: string;
                            description: string;
                        };
                    };
                    delete: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                        success: {
                            message: string;
                            description: string;
                        };
                    };
                    fetch: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    update: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                        success: {
                            message: string;
                            description: string;
                        };
                    };
                };
            };
        };
    };
    templates: {
        emptyPlaceholder: {
            action: string;
            title: string;
            subtitles: string;
        };
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
                template: {
                    common: {
                        authorizedRedirectURLs: {
                            example: string;
                            subTitle: string;
                            title: string;
                        };
                        heading: {
                            example: string;
                            subTitle: string;
                            title: string;
                        };
                        protocol: {
                            subTitle: string;
                            title: string;
                        };
                    };
                    label: string;
                    samlWeb: {
                        assertionResponseURLs: {
                            example: string;
                            subTitle: string;
                            title: string;
                        };
                        issuer: {
                            example: string;
                            subTitle: string;
                            title: string;
                        };
                        metaFile: {
                            subTitle: string;
                            title: string;
                        };
                        metaURL: {
                            subTitle: string;
                            title: string;
                        };
                    };
                };
            };
        };
        applicationCertificateWizard: {
            heading: string;
            subHeading: string;
            emptyPlaceHolder: {
                title: string;
                description1: string;
                description2: string;
            };
        };
        sharedAccessStatus: {
            heading: string,
            subHeading: string,
            actionText: string,
            banner: {
                partiallyCompleted: string,
                failed: string
            }
        }
    };
}
