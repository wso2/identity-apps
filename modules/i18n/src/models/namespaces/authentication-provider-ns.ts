/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
export interface AuthenticationProviderNS {
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
        deleteIDP: {
            header: string;
            message: string;
            content: string;
            assertionHint: string;
        };
        deleteIDPWithConnectedApps: {
            header: string;
            message: string;
            content: string;
            assertionHint: string;
        };
        deleteAuthenticator: {
            header: string;
            message: string;
            content: string;
            assertionHint: string;
        };
        deleteConnector: {
            header: string;
            message: string;
            content: string;
            assertionHint: string;
        };
        deleteCertificate: {
            header: string;
            message: string;
            content: string;
            assertionHint: string;
        };
    };
    dangerZoneGroup: {
        header: string;
        disableIDP: {
            actionTitle: string;
            header: string;
            subheader: string;
            subheader2: string;
        };
        deleteIDP: {
            actionTitle: string;
            header: string;
            subheader: string;
        };
    };
    edit: {
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
    forms: {
        advancedConfigs: {
            federationHub: {
                hint: string;
                label: string;
            };
            homeRealmIdentifier: {
                hint: string;
                label: string;
                placeholder: string;
            };
            alias: {
                hint: string;
                label: string;
                placeholder: string;
            };
            certificateType: {
                label: string;
                hint: string;
                certificatePEM: {
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                    };
                };
                certificateJWKS: {
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                        invalid: string;
                    };
                };
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
                additionalQueryParameters: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                callbackUrl: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                clientId: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                keyId: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                privateKey: {
                    hint: string;
                    label: string;
                    placeholder: string;

                    validations: {
                        required: string;
                    };
                };
                secretValidityPeriod: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
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
                teamId: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
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
                    };
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
                allowedResendAttemptCount: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    unit: string;
                    validations: {
                        required: string;
                        invalid: string;
                        range: string;
                    };
                };
                useAlphanumericChars: {
                    hint: string;
                    label: string;
                    validations: {
                        required: string;
                    };
                };
            };
            smsOTP: {
                hint: string;
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
                    };
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
                    unit: string;
                    validations: {
                        required: string;
                        invalid: string;
                        range: string;
                    };
                };
            };
            push: {
                hint: string;
                allowedResendAttemptsCount: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                        invalid: string;
                        range: string;
                    };
                    unit: string;
                };
                resendInterval: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                        invalid: string;
                        range: string;
                    };
                    unit: string;
                };
                enableNumberChallenge: {
                    hint: string;
                    label: string;
                    validations: {
                        required: string;
                    };
                };
                enableProgressiveEnrollment: {
                    hint: string;
                    label: string;
                    validations: {
                        required: string;
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
                trustedOrigins: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        invalid: string;
                    };
                };
            };
            facebook: {
                callbackUrl: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                clientId: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                clientSecret: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                scopes: {
                    heading: string;
                    hint: string;
                    list: {
                        email: {
                            description: string;
                        };
                        profile: {
                            description: string;
                        };
                    };
                };
                userInfo: {
                    heading: string;
                    hint: string;
                    placeholder: string;
                    list: {
                        ageRange: {
                            description: string;
                        };
                        email: {
                            description: string;
                        };
                        firstName: {
                            description: string;
                        };
                        gender: {
                            description: string;
                        };
                        id: {
                            description: string;
                        };
                        lastName: {
                            description: string;
                        };
                        link: {
                            description: string;
                        };
                        name: {
                            description: string;
                        };
                    };
                };
            };
            github: {
                callbackUrl: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                clientId: {
                    hint: string;
                    label: string;
                    placeholder: string;

                    validations: {
                        required: string;
                    };
                };
                clientSecret: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                scopes: {
                    heading: string;
                    hint: string;
                    list: {
                        email: {
                            description: string;
                        };
                        profile: {
                            description: string;
                        };
                    };
                };
            };
            google: {
                callbackUrl: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                clientId: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                clientSecret: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                enableGoogleOneTap: {
                    hint: string;
                    label: string;
                    placeholder: string;
                };
                AdditionalQueryParameters: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    ariaLabel: string;
                    validations: {
                        required: string;
                    };
                };
                scopes: {
                    heading: string;
                    hint: string;
                    list: {
                        email: {
                            description: string;
                        };
                        openid: {
                            description: string;
                        };
                        profile: {
                            description: string;
                        };
                    };
                };
            };
            microsoft: {
                callbackUrl: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                clientId: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                clientSecret: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                commonAuthQueryParams: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    ariaLabel: string;
                    validations: {
                        required: string;
                    };
                };
                scopes: {
                    ariaLabel: string;
                    heading: string;
                    hint: string;
                    label: string;
                    list: {
                        email: {
                            description: string;
                        };
                        openid: {
                            description: string;
                        };
                        profile: {
                            description: string;
                        };
                    };
                    placeholder: string;
                };
            };
            hypr: {
                appId: {
                    hint: string;
                    label: string;
                    placeholder: string;

                    validations: {
                        required: string;
                    };
                };
                apiToken: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                baseUrl: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
            };
            iproov: {
                apiKey: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                apiSecret: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                oauthUsername: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                oauthPassword: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                baseUrl: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                enableProgressiveEnrollment: {
                    hint: string;
                    label: string;
                };
            };
            saml: {
                AuthRedirectUrl: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    ariaLabel: string;
                };
                SPEntityId: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    ariaLabel: string;
                };
                SSOUrl: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    ariaLabel: string;
                };
                IdPEntityId: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    ariaLabel: string;
                };
                NameIDType: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    ariaLabel: string;
                };
                RequestMethod: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    ariaLabel: string;
                };
                IsSLORequestAccepted: {
                    hint: string;
                    label: string;
                    ariaLabel: string;
                };
                IsLogoutEnabled: {
                    hint: string;
                    label: string;

                    ariaLabel: string;
                };
                LogoutReqUrl: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    ariaLabel: string;
                };
                IsAuthnRespSigned: {
                    hint: string;
                    label: string;

                    ariaLabel: string;
                };
                IsLogoutReqSigned: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    ariaLabel: string;
                };
                ISAuthnReqSigned: {
                    hint: string;
                    label: string;
                    ariaLabel: string;
                };
                SignatureAlgorithm: {
                    label: string;
                    placeholder: string;
                    ariaLabel: string;
                };
                DigestAlgorithm: {
                    label: string;
                    placeholder: string;
                    ariaLabel: string;
                };
                IncludeProtocolBinding: {
                    hint: string;
                    label: string;

                    ariaLabel: string;
                };
                IsUserIdInClaims: {
                    hint: string;
                    label: string;
                    ariaLabel: string;
                };
                commonAuthQueryParams: {
                    label: string;
                    ariaLabel: string;
                };

                isAssertionSigned: {
                    hint: string;
                    label: string;
                    ariaLabel: string;
                };
                includeCert: {
                    hint: string;
                    label: string;
                    ariaLabel: string;
                };
                includeNameIDPolicy: {
                    hint: string;
                    label: string;
                    ariaLabel: string;
                };
                isEnableAssertionEncryption: {
                    hint: string;
                    label: string;
                    ariaLabel: string;
                };

                authenticationContextClass: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    ariaLabel: string;
                };
                customAuthenticationContextClass: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    ariaLabel: string;
                };
                attributeConsumingServiceIndex: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    ariaLabel: string;
                };

                isArtifactBindingEnabled: {
                    hint: string;
                    label: string;
                    ariaLabel: string;
                };
                artifactResolveEndpointUrl: {
                    placeholder: string;
                    hint: string;
                    label: string;
                    ariaLabel: string;
                };
                isArtifactResolveReqSigned: {
                    hint: string;
                    label: string;
                    ariaLabel: string;
                };
                isArtifactResponseSigned: {
                    hint: string;
                    label: string;
                    ariaLabel: string;
                };
                authContextComparisonLevel: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    ariaLabel: string;
                };
                samlAuthnRequestProviderName: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    ariaLabel: string;
                };
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
            invalidScopesErrorMessage: string;
            customProperties: string;
        };
        generalDetails: {
            name: {
                hint: string;
                label: string;
                placeholder: string;
                validations: {
                    empty: string;
                    duplicate: string;
                    required: string;
                    maxLengthReached: string;
                };
            };
            issuer: {
                hint: string;
                label: string;
                placeholder: string;
            };
            alias: {
                hint: string;
                label: string;
                placeholder: string;
            };
            description: {
                hint: string;
                label: string;
                placeholder: string;
            };
            image: {
                hint: string;
                label: string;
                placeholder: string;
                validations: {
                    invalid: string;
                }
            };
        };
        jitProvisioning: {
            accountLinkingAttributes: {
                heading: string;
                infoNotification: string;
                linkAccountIf: string;
                equals: string;
                noneOption: {
                    label: string;
                    description: string;
                };
                matchRule: {
                    federatedAttribute: {
                        label: string;
                        placeholder: string;
                    };
                    localAttribute: {
                        label: string;
                        placeholder: string;
                    };
                };
            };
            attributeSyncMethod: {
                hint: string;
                label: string;
                options: {
                    overrideAll: {
                        label: string;
                        description: string;
                    };
                    none: {
                        label: string;
                        description: string;
                    };
                    preserveLocal: {
                        label: string;
                        description: string;
                    };
                };
            };
            associateLocalUser: {
                hint: string;
                label: string;
            };
            enableJITProvisioning: {
                hint: string;
                label: string;
                disabledMessageContent: string;
                disabledMessageHeader: string;
            };
            provisioningUserStoreDomain: {
                hint: string;
                label: string;
            };
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
            skipJITForNoRuleMatch: {
                hint: string;
                label: string;
                infoMessage: string;
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
            group: {
                heading: string;
                hint: string;
                mappedRolesAbsentMessage: string;
                mappedRolesPresentMessage: string;
                messageOIDC: string;
                messageSAML: string;
                placeHolder: string;
                roleMappingDisabledMessage: string;
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
        };
    };
    helpPanel: {
        tabs: {
            samples: {
                content: {
                    docs: {
                        goBack: string;
                        hint: string;
                        title: string;
                    };
                };
                heading: string;
            };
        };
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
        facebook: {
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
                    configureSiteURL: string;
                    getCredentials: string;
                    heading: string;
                };
                subHeading: string;
            };
        };
        github: {
            wizardHelp: {
                heading: string;
                subHeading: string;
                clientId: {
                    description: string;
                    heading: string;
                };
                clientSecret: {
                    description: string;
                    heading: string;
                };
                name: {
                    idpDescription: string;
                    connectionDescription: string;
                    heading: string;
                };
                preRequisites: {
                    configureOAuthApps: string;
                    configureHomePageURL: string;
                    configureRedirectURL: string;
                    heading: string;
                    getCredentials: string;
                };
            };
        };
        google: {
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
                };
                subHeading: string;
            };
        };
        organizationIDP: {
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
            };
        };
        microsoft: {
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
                };
                subHeading: string;
            };
        };
        hypr: {
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
            };
        };
        iproov: {
            wizardHelp: {
                baseUrl: {
                    description: string;
                    heading: string;
                };
                oauthUsername: {
                    description: string;
                    heading: string;
                };
                oauthPassword: {
                    description: string;
                    heading: string;
                };
                apiKey: {
                    description: string;
                    heading: string;
                };
                apiSecret: {
                    description: string;
                    heading: string;
                };
                enableProgressiveEnrollment: {
                    description: string;
                    heading: string;
                }
                heading: string;
                name: {
                    idpDescription: string;
                    connectionDescription: string;
                    heading: string;
                };
                preRequisites: {
                    appDescription: string;
                    heading: string;
                };
            }
        };
        enterprise: {
            addWizard: {
                title: string;
                subtitle: string;
            };
            saml: {
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
        trustedTokenIssuer: {
            addWizard: {
                title: string;
                subtitle: string;
            };
            forms: {
                steps: {
                    general: string;
                    certificate: string;
                };
                name: {
                    label: string;
                    placeholder: string;
                };
                issuer: {
                    label: string;
                    placeholder: string;
                    hint: string;
                    validation: {
                        notValid: string;
                    };
                };
                alias: {
                    label: string;
                    placeholder: string;
                    hint: string;
                    validation: {
                        notValid: string;
                    };
                };
                certificateType: {
                    label: string;
                    requiredCertificate: string;
                };
                jwksUrl: {
                    optionLabel: string;
                    placeholder: string;
                    label: string;
                    hint: string;
                    validation: {
                        notValid: string;
                    };
                };
                pem: {
                    optionLabel: string;
                    hint: string;
                    uploadCertificateButtonLabel: string;
                    dropzoneText: string;
                    pasteAreaPlaceholderText: string;
                };
            };
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
        addFederatedAuthenticator: {
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
        addIDP: {
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
        deleteCertificate: {
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
        deleteIDP: {
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
        deleteIDPWithConnectedApps: {
            error: {
                message: string;
                description: string;
            };
        };
        deleteConnection: {
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
        disableAuthenticator: {
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
        disableIDPWithConnectedApps: {
            error: {
                message: string;
                description: string;
            };
        };
        disableOutboundProvisioningConnector: {
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
        duplicateCertificateUpload: {
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
        getFIDOConnectorConfigs: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
        };
        getIDP: {
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
        getIDPList: {
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
        getIDPTemplate: {
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
        getIDPTemplateList: {
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
        getFederatedAuthenticator: {
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
        getFederatedAuthenticatorsList: {
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
        getFederatedAuthenticatorMetadata: {
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
        getConnectionDetails: {
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
        getOutboundProvisioningConnector: {
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
        getOutboundProvisioningConnectorsList: {
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
        getOutboundProvisioningConnectorMetadata: {
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
        getAllLocalClaims: {
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
        getRolesList: {
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
        submitAttributeSettings: {
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
        deleteDefaultAuthenticator: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
                genericMessage: string;
            };
            success: {
                message: string;
                description: string;
                genericMessage: string;
            };
        };
        deleteDefaultConnector: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
                genericMessage: string;
            };
            success: {
                message: string;
                description: string;
                genericMessage: string;
            };
        };
        updateAttributes: {
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
        updateClaimsConfigs: {
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
        updateFederatedAuthenticator: {
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
        updateFederatedAuthenticators: {
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
        updateEmailOTPAuthenticator: {
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
        updateFIDOConnectorConfigs: {
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
        updateSMSOTPAuthenticator: {
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
        updateGenericAuthenticator: {
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
        updateIDP: {
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
        updateIDPCertificate: {
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
        updateIDPRoleMappings: {
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
        updateJITProvisioning: {
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
        updateOutboundProvisioningConnectors: {
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
        updateOutboundProvisioningConnector: {
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
                description: string;
                message: string;
            };
        };
        getLocalClaims: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
        };
    };
    popups: {
        appStatus: {
            enabled: {
                content: string;
                header: string;
                subHeader: string;
            };
            disabled: {
                content: string;
                header: string;
                subHeader: string;
            };
        };
    };
    placeHolders: {
        emptyCertificateList: {
            title: string;
            subtitles: {
                0: string;
                1: string;
            };
        };
        emptyIDPList: {
            title: string;
            subtitles: {
                0: string;
                1: string;
                2: string;
            };
        };
        emptyIDPSearchResults: {
            title: string;
            subtitles: {
                0: string;
                1: string;
            };
        };
        emptyAuthenticatorList: {
            title: string;
            subtitles: {
                0: string;
                1: string;
                2: string;
            };
        };
        emptyConnectionTypeList: {
            subtitles: {
                0: string;
                1: string;
            };
            title: string;
        };
        emptyConnectorList: {
            title: string;
            subtitles: {
                0: string;
                1: string;
            };
        };
        noAttributes: {
            title: string;
            subtitles: {
                0: string;
            };
        };
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
                authenticatorSettings: {
                    emptyPlaceholder: {
                        subtitles: [string, string];
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
    overrides: {
        authenticators: {
            customAuthenticators: {
                pluginBased: {
                    name: string;
                }
            }
        }
    }
}
