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
import { AuthenticationProviderNS } from "../../../models";
/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */

export const authenticationProvider:AuthenticationProviderNS = {
    advancedSearch: {
        form: {
            inputs: {
                filterAttribute: {
                    placeholder: "E.g. Name, Enabled etc."
                },
                filterCondition: {
                    placeholder: "E.g. Starts with etc."
                },
                filterValue: {
                    placeholder: "Enter value to search"
                }
            }
        },
        placeholder: "Search by name"
    },
    buttons: {
        addAttribute: "Add Attribute",
        addAuthenticator: "New Authenticator",
        addCertificate: "New Certificate",
        addConnector: "New Connector",
        addIDP: "New Connection"
    },
    confirmations: {
        deleteAuthenticator: {
            assertionHint: "Please type <1>{{ name }}</1> to confirm.",
            content: "If you delete this authenticator, you will not be able to get it back. All the " +
                "applications depending on this also might stop working. Please proceed with caution.",
            header: "Are you sure?",
            message: "This action is irreversible and will permanently delete the authenticator."
        },
        deleteCertificate: {
            assertionHint: "Please confirm your action.",
            content: "This is the only certificate available for this trusted token issuer. " +
                "If this certificate is deleted, {{productName}} will no longer be able to validate tokens " +
                "issued from this issuer.<1> Proceed with caution.</1>",
            header: "Are you sure?",
            message: "This action is irreversible and will permanently delete the certificate."
        },
        deleteConnector: {
            assertionHint: "Please type <1>{{ name }}</1> to confirm.",
            content: "If you delete this connector, you will not be able to get it back. Please " +
                "proceed with caution.",
            header: "Are you sure?",
            message: "This action is irreversible and will permanently delete the connector."
        },
        deleteIDP: {
            assertionHint: "Please confirm your action.",
            content: "If you delete this connection, you will not be able to recover it. " +
                "Please proceed with caution.",
            header: "Are you sure?",
            message: "This action is irreversible and will permanently delete the connection."
        },
        deleteIDPWithConnectedApps: {
            assertionHint: "",
            content: "Remove the associations from these applications before deleting:",
            header: "Unable to Delete",
            message: "There are applications using this connection."
        }
    },
    dangerZoneGroup: {
        deleteIDP: {
            actionTitle: "Delete",
            header: "Delete connection",
            subheader: "Once you delete it, it cannot be recovered. Please be certain."
        },
        disableIDP: {
            actionTitle: "{{ state }} Connection",
            header: "{{ state }} connection",
            subheader: "Once you disable it, it can no longer be used until you enable it again.",
            subheader2: "Enable the connection to use it with your applications."
        },
        header: "Danger Zone"
    },
    edit: {
        common: {
            settings: {
                tabName: "Settings"
            }
        },
        emailOTP: {
            emailTemplate: {
                tabName: "Email Template <1>(Coming Soon)</1>"
            }
        },
        smsOTP: {
            smsProvider:{
                tabName: "SMS Provider <1>(Coming Soon)</1>"
            }
        }
    },
    forms: {
        advancedConfigs: {
            alias: {
                hint: "If the resident identity provider is known by an alias at the federated " +
                    "identity provider, specify it here.",
                label: "Alias",
                placeholder: "Enter value for Alias."
            },
            certificateType: {
                certificateJWKS: {
                    label: "Use JWKS endpoint",
                    placeholder: "Value should be the certificate in JWKS format.",
                    validations: {
                        empty: "Certificate value is required",
                        invalid: "JWKS endpoint should be a valid URI."
                    }
                },
                certificatePEM: {
                    label: "Provide certificate",
                    placeholder: "Value should be a PEM URL.",
                    validations: {
                        empty: "Certificate value is required"
                    }
                },
                hint: "If the type is JWKS, the value should be a JWKS URL. If the type is PEM, the" +
                    " value should be the certificate in PEM format.",
                label: "Select Certificate Type"
            },
            federationHub: {
                hint: "Check if this points to a federation hub identity provider",
                label: "Federation Hub"
            },
            homeRealmIdentifier: {
                hint: "Enter the home realm identifier for this identity provider",
                label: "Home Realm Identifier",
                placeholder: "Enter value for Home Realm Identifier."
            }
        },
        attributeSettings: {
            attributeListItem: {
                validation: {
                    empty: "Please enter a value"
                }
            },
            attributeMapping: {
                attributeColumnHeader: "Attribute",
                attributeMapColumnHeader: "Identity Provider attribute",
                attributeMapInputPlaceholderPrefix: "eg: IdP's attribute for ",
                componentHeading: "Attributes Mapping",
                hint: "Add attributes supported by Identity Provider"
            },
            attributeProvisioning: {
                attributeColumnHeader: {
                    0: "Attribute",
                    1: "Identity Provider attribute"
                },
                attributeMapColumnHeader: "Default value",
                attributeMapInputPlaceholderPrefix: "eg: a default value for the ",
                componentHeading: "Provisioning Attributes Selection",
                hint: "Specify required attributes for provisioning"
            },
            attributeSelection: {
                searchAttributes: {
                    placeHolder: "Search attributes"
                }
            }
        },
        authenticatorAccordion: {
            default: {
                0: "Default",
                1: "Make default"
            },
            enable: {
                0: "Enabled",
                1: "Disabled"
            }
        },
        authenticatorSettings: {
            apple: {
                additionalQueryParameters: {
                    hint: "Additional query parameters to be sent to Apple.",
                    label: "Additional Query Parameters",
                    placeholder: "Enter additional query parameters.",
                    validations: {
                        required: "Additional query parameters is not a required field."
                    }
                },
                callbackUrl: {
                    hint: "The authorized redirect URI used to obtain Apple credentials.",
                    label: "Authorized redirect URI",
                    placeholder: "Enter the Authorized redirect URI.",
                    validations: {
                        required: "Authorized redirect URI is a required field."
                    }
                },
                clientId: {
                    hint: "The unique identifier which is provided when creating the Apple Services ID.",
                    label: "Services ID",
                    placeholder: "Enter the Services ID registered for the Apple application.",
                    validations: {
                        required: "Services ID is a required field."
                    }
                },
                keyId: {
                    hint: "The key identifier which is generated when registering the private key for " +
                        "the Apple application.",
                    label: "Key ID",
                    placeholder: "Enter the the Key ID of the application's private key.",
                    validations: {
                        required: "Key ID is a required field."
                    }
                },
                privateKey: {
                    hint: "The generated private key for the Apple application.",
                    label: "Private Key",
                    placeholder: "Enter the Private Key generated for the Apple application.",
                    validations: {
                        required: "Private Key is a required field."
                    }
                },
                scopes: {
                    heading: "Scopes",
                    hint: "The type of access provided for the connected apps to access data " +
                        "from Apple. Click <1>here</1> to learn more.",
                    list: {
                        email: {
                            description: "Grants read access to a user's email address."
                        },
                        name: {
                            description: "Grants read access to a user's name fields."
                        }
                    }
                },
                secretValidityPeriod: {
                    hint: "The validity period of the generated client secret in seconds. A new client secret " +
                        "will be generated after this time.",
                    label: "Client Secret Validity Period",
                    placeholder: "Enter the Validity Period for the Client Secret.",
                    validations: {
                        required: "Client Secret Validity Period is not a required field."
                    }
                },
                teamId: {
                    hint: "The generated unique ID which is assigned to the Apple developer team.",
                    label: "Team ID",
                    placeholder: "Enter the Team ID of the Apple developer team.",
                    validations: {
                        required: "Team ID is a required field."
                    }
                }
            },
            emailOTP: {
                enableBackupCodes: {
                    hint: "Allow users to authenticate with backup codes.",
                    label: "Enable authenticate with backup codes",
                    validations: {
                        required: "Enable authenticate with backup codes is a required field."
                    }
                },
                expiryTime: {
                    hint: "Please pick a value between <1>1 minute</1> & <3>1440 minutes (1 day)</3>.",
                    label: "Email OTP expiry time",
                    placeholder: "Enter Email OTP expiry time.",
                    unit: "minutes",
                    validations: {
                        invalid: "Email OTP expiry time should be an integer.",
                        range: "Email OTP expiry time should be between 1 minute & 1440 minutes (1 day).",
                        required: "Email OTP expiry time is a required field."
                    }
                },
                tokenLength: {
                    hint: "The number of allowed characters in the OTP. Please " +
                        "pick a value between <1>4-10</1>.",
                    label: "Email OTP length",
                    placeholder: "Enter Email OTP length.",
                    unit: {
                        characters: "characters",
                        digits: "digits"
                    },
                    validations: {
                        invalid: "Email OTP length should be an integer.",
                        range: {
                            characters: "Email OTP length should be between 4 & 10 characters.",
                            digits: "Email OTP length should be between 4 & 10 digits."
                        },
                        required: "Email OTP length is a required field."
                    }
                },
                useAlphanumericChars: {
                    hint: "Please check this checkbox to enable alphanumeric "+
                    "characters. Otherwise numeric characters will be used.",
                    label: "Use alphanumeric characters for OTP",
                    validations: {
                        required: "Use alphanumeric characters for OTP is a required field."
                    }
                }
            },
            facebook: {
                callbackUrl: {
                    hint: "The redirect URI specified as valid in the Facebook OAuth app.",
                    label: "Valid OAuth redirect URI",
                    placeholder: "Enter Valid OAuth redirect URIs.",
                    validations: {
                        required: "Valid OAuth redirect URIs is a required field."
                    }
                },
                clientId: {
                    hint: "The generated unique ID which is generated when the Facebook OAuth app is " +
                        "created.",
                    label: "App ID",
                    placeholder: "Enter App ID from Facebook application.",
                    validations: {
                        required: "App ID is a required field."
                    }
                },
                clientSecret: {
                    hint: "The <1>App secret</1> value of the Facebook OAuth app.",
                    label: "App secret",
                    placeholder: "Enter App secret from Facebook application.",
                    validations: {
                        required: "App secret is a required field."
                    }
                },
                scopes: {
                    heading: "Permissions",
                    hint: "Permissions granted for the connected apps to access data from Facebook. " +
                        "Click <1>here</> to learn more.",
                    list: {
                        email: {
                            description: "Grants read access to a user's primary email address."
                        },
                        profile: {
                            description: "Grants read access to a user's default public profile fields."
                        }
                    }
                },
                userInfo: {
                    heading: "User information fields",
                    hint: "Requested default public profile fields of a user. These information can " +
                        "provide authenticated app users with a personalized in-app experience. Click " +
                        "<1>here</1> to learn more.",
                    list: {
                        ageRange: {
                            description: "The age segment for this person expressed as a minimum and " +
                                "maximum age."
                        },
                        email: {
                            description: "The User's primary email address listed on their profile."
                        },
                        firstName: {
                            description: "The person's first name."
                        },
                        gender: {
                            description: "The gender selected by this person, male or female."
                        },
                        id: {
                            description: "The app user's App-Scoped User ID."
                        },
                        lastName: {
                            description: "The person's last name."
                        },
                        link: {
                            description: "A link to the person's Timeline."
                        },
                        name: {
                            description: "The person's full name."
                        }
                    },
                    placeholder: "Enter fields to extract from user's profile."
                }
            },
            fido2: {
                allowProgressiveEnrollment: {
                    hint: "Please clear this checkbox to disable passkey progressive enrollment.",
                    label: "Allow passkey progressive enrollment"
                },
                allowUsernamelessAuthentication: {
                    hint: "Please clear this checkbox to disable usernameless authentication.",
                    label: "Allow passkey usernameless authentication"
                },
                trustedOrigins: {
                    hint: "Origins from which FIDO-based authentication requests are initiated and need to be trusted by the server.",
                    label: "Passkey Trusted Origins",
                    placeholder: "https://mydomain.io/register",
                    validations: {
                        invalid: "The entered trusted origin is invalid."
                    }
                },
                trustedApps: {
                    heading: "Passkey Trusted Apps",
                    subHeading: "Apps from which FIDO-based authentication requests are initiated and need to be trusted by the server.",
                    removeTrustedAppPopOver: "Remove the Trusted App",
                    buttons: {
                        addButton: "App",
                        emptySearchButton: "View all API resources"
                    },
                    search: "Search apps by package name or app ID",
                    placeHolderTexts: {
                        emptyText: "There are no added Passkey Trusted Apps",
                        errorText: {
                            subtitles: {
                                0: "An error occurred while retrieving the trusted apps.",
                                1: "Please try again."
                            },
                            title: "Something went wrong"
                        },
                        emptySearch: {
                            title: "No results found",
                            subTitle: {
                                0: "We couldn't find the trusted apps you searched for.",
                                1: "Please try using a different parameter."
                            }
                        }
                    },
                    types: {
                        android: "Android",
                        ios: "iOS"
                    },
                    wizard: {
                        title: "New Passkey Trusted App",
                        subTitle: "Add a new Android or iOS app as a passkey trusted app.",
                        fields: {
                            appName: {
                                label: "App Package Name or App ID",
                                placeholder: "Enter the package name or ID of the application",
                                validations: {
                                    required: "App package name or app ID is required",
                                    duplicate: "This trusted app is already added"
                                }
                            },
                            appType: {
                                label: "Application Type"
                            }
                        },
                        buttons: {
                            finish: "Finish",
                            cancel: "Cancel"
                        }
                    }
                },
                trustedAppSHAValues: {
                    hint: "The SHA256 fingerprints related to the signing certificate of your application.",
                    label: "Key Hashes",
                    add: "Add Key Hash",
                    placeholder: "D4:B9:A3:...",
                    validations: {
                        invalid: "The entered SHA256 fingerprint is invalid.",
                        duplicate: "This key hash is already added"
                    }
                }
            },
            github: {
                callbackUrl: {
                    hint: "The set of redirect URIs specified as valid in the GitHub for your OAuth app.",
                    label: "Authorization callback URL",
                    placeholder: "Enter Authorization callback URL.",
                    validations: {
                        required: "Authorization callback URL is a required field."
                    }
                },
                clientId: {
                    hint: "The <1>Client ID</1> you received from GitHub for your OAuth app.",
                    label: "Client ID",
                    placeholder: "Enter Client ID from Github application.",
                    validations: {
                        required: "Client ID is a required field."
                    }
                },
                clientSecret: {
                    hint: "The <1>Client secret</1> you received from GitHub for your OAuth app.",
                    label: "Client secret",
                    placeholder: "Enter Client secret from Github application.",
                    validations: {
                        required: "Client secret is a required field."
                    }
                },
                scopes: {
                    heading: "Scopes",
                    hint: "The type of access provided for the connected apps to access data " +
                        "from GitHub. Click <1>here</1> to learn more.",
                    list: {
                        email: {
                            description: "Grants read access to a user's email addresses."
                        },
                        profile: {
                            description: "Grants access to read a user's profile data."
                        }
                    }
                }
            },
            google: {
                AdditionalQueryParameters: {
                    ariaLabel: "Google authenticator additional query parameters",
                    hint: "Additional query parameters to be sent to Google.",
                    label: "Additional Query Parameters",
                    placeholder: "Enter additional query parameters.",
                    validations: {
                        required: "Client secret is not a required field."
                    }
                },
                callbackUrl: {
                    hint: "The authorized redirect URI used to obtain Google credentials.",
                    label: "Authorized redirect URI",
                    placeholder: "Enter Authorized redirect URI.",
                    validations: {
                        required: "Authorized redirect URI is a required field."
                    }
                },
                clientId: {
                    hint: "The <1>Client ID</1> you received from Google for your OAuth app.",
                    label: "Client ID",
                    placeholder: "Enter Client ID from Google application.",
                    validations: {
                        required: "Client ID is a required field."
                    }
                },
                clientSecret: {
                    hint: "The <1>Client secret</1> you received from Google for your OAuth app.",
                    label: "Client secret",
                    placeholder: "Enter Client secret from Google application.",
                    validations: {
                        required: "Client secret is a required field."
                    }
                },
                enableGoogleOneTap: {
                    hint: "Enabling Google One Tap as a sign in option",
                    label: "Google One Tap",
                    placeholder: "Google one tap as a sign in option"
                },
                scopes: {
                    heading: "Scopes",
                    hint: "The type of access provided for the connected apps to access data " +
                        "from Google. Click <1>here</1> to learn more.",
                    list: {
                        email: {
                            description: "Allows to view user's email address."
                        },
                        openid: {
                            description: "Allows to authenticate using OpenID Connect."
                        },
                        profile: {
                            description: "Allows to view user's basic profile data."
                        }
                    }
                }
            },
            hypr: {
                apiToken: {
                    hint: "The relying party app access token generated in the control center.",
                    label: "API Token",
                    placeholder: "Enter API token from HYPR",
                    validations: {
                        required: "API token is a required field."
                    }
                },
                appId: {
                    hint: "The <1>Application ID</1> you received from HYPR for your OAuth app.",
                    label: "Relying Party App ID",
                    placeholder: "Enter App ID from HYPR application.",
                    validations: {
                        required: "Relying Party App ID is a required field."
                    }
                },
                baseUrl: {
                    hint: "The base URL of your HYPR server deployment.",
                    label: "Base URL",
                    placeholder: "Enter HYPR server base URL",
                    validations: {
                        required: "Base URL is a required field."
                    }
                }
            },
            iproov: {
                apiKey: {
                    hint: "API Key from created identity provider in iProov.",
                    label: "API Key",
                    placeholder: "Enter API Key from created identity provider in iProov.",
                    validations: {
                        required: "API Key is a required field."
                    }
                },
                apiSecret: {
                    hint: "API Secret from created identity provider in iProov.",
                    label: "API Secret",
                    placeholder: "Enter API Secret from created identity provider in iProov.",
                    validations: {
                        required: "API Secret is a required field."
                    }
                },
                baseUrl: {
                    hint: "iProov base URL",
                    label: "Base URL",
                    placeholder: "Enter Base URL.",
                    validations: {
                        required: "Base URL is a required field."
                    }
                },
                enableProgressiveEnrollment: {
                    hint: "Enable Progressive Enrollment with iProov.",
                    label: "Enable Progressive Enrollment"
                },
                oauthPassword: {
                    hint: "OAuth password from created identity provider in iProov.",
                    label: "OAuth Password",
                    placeholder: "Enter OAuth password from created identity provider in iProov.",
                    validations: {
                        required: "OAuth password is a required field."
                    }
                },
                oauthUsername: {
                    hint: "OAuth username from created identity provider in iProov.",
                    label: "OAuth Username",
                    placeholder: "Enter OAuth username from created identity provider in iProov.",
                    validations: {
                        required: "OAuth username is a required field."
                    }
                }
            },
            microsoft: {
                callbackUrl: {
                    hint: "The authorized redirect URI used to obtain Microsoft credentials.",
                    label: "Authorized redirect URI",
                    placeholder: "Enter Authorized redirect URI.",
                    validations: {
                        required: "Authorized redirect URI is a required field."
                    }
                },
                clientId: {
                    hint: "The <1>Client ID</1> you received from Microsoft for your OAuth app.",
                    label: "Client ID",
                    placeholder: "Enter Client ID from Microsoft application.",
                    validations: {
                        required: "Client ID is a required field."
                    }
                },
                clientSecret: {
                    hint: "The <1>Client secret</1> you received from Microsoft for your OAuth app.",
                    label: "Client secret",
                    placeholder: "Enter Client secret from Microsoft application.",
                    validations: {
                        required: "Client secret is a required field."
                    }
                },
                commonAuthQueryParams: {
                    ariaLabel: "Microsoft authenticator additional query parameters",
                    hint: "Additional query parameters to be sent to Microsoft.",
                    label: "Additional Query Parameters",
                    placeholder: "Enter additional query parameters.",
                    validations: {
                        required: "Client secret is not a required field."
                    }
                },
                scopes: {
                    ariaLabel: "Scopes provided by Microsoft Authenticator",
                    heading: "Scopes",
                    hint: "The type of access provided for the connected apps to access data " +
                        "from Microsoft. Click <1>here</1> to learn more.",
                    label: "Scopes",
                    list: {
                        email: {
                            description: "Allows to view user's email address."
                        },
                        openid: {
                            description: "Allows to authenticate using OpenID Connect."
                        },
                        profile: {
                            description: "Allows to view user's basic profile data."
                        }
                    },
                    placeholder: "e.g: openid"
                }
            },
            saml: {
                AuthRedirectUrl: {
                    ariaLabel: "SAML assertion consumer service URL",
                    hint: "The Assertion Consumer Service (ACS) URL determines where" +
                        " {{productName}} expects the external identity provider to send the" +
                        " SAML response.",
                    label: "Assertion Consumer Service (ACS) URL",
                    placeholder: "Assertion Consumer Service (ACS) URL"
                },
                DigestAlgorithm: {
                    ariaLabel: "Select the digest algorithm for description.",
                    label: "Select digest algorithm",
                    placeholder: "Select digest algorithm"
                },
                ISAuthnReqSigned: {
                    ariaLabel: "Is authentication request signed?",
                    hint: "When enabled {{productName}} will sign the SAML2 authentication" +
                        " request to the external IdP.",
                    label: "Authentication request signing"
                },
                IdPEntityId: {
                    ariaLabel: "Identity provider entity ID",
                    hint: "This is the <1>&lt;saml2:Issuer&gt;</1> value specified in" +
                        " the SAML responses issued by the external IdP. Also, this needs to" +
                        " be a unique value to identify the external IdP within your organization.",
                    label: "Identity provider entity ID",
                    placeholder: "Enter identity provider entity ID"
                },
                IncludeProtocolBinding: {
                    ariaLabel: "Include protocol binding in the request",
                    hint: "Specifies whether the transport mechanism should be included in the" +
                        " small authentication request.",
                    label: "Include protocol binding in the request"
                },
                IsAuthnRespSigned: {
                    ariaLabel: "Authentication response must be signed always?",
                    hint: "Specifies if SAML2 authentication response from the external" +
                        " IdP must be signed or not.",
                    label: "Strictly verify authentication response signature info"
                },
                IsLogoutEnabled: {
                    ariaLabel: "Specify whether logout is enabled for IdP",
                    hint: "Specify whether logout is supported by the external IdP.",
                    label: "Identity provider logout enabled"
                },
                IsLogoutReqSigned: {
                    ariaLabel: "Specify whether logout is enabled for IdP",
                    hint: "When enabled {{productName}} will sign the SAML2 logout" +
                        " request sent to the external IdP.",
                    label: "Logout request signing",
                    placeholder: ""
                },
                IsSLORequestAccepted: {
                    ariaLabel: "Specify whether logout is enabled for IdP",
                    hint: "Specify whether single logout request from the" +
                        " IdP must be accepted by {{productName}}.",
                    label: "Accept identity provider logout request"
                },
                IsUserIdInClaims: {
                    ariaLabel: "Use Name ID as the user identifier.",
                    hint: "To specify an attribute from the SAML 2.0 assertion as the user" +
                        " identifier, configure the subject attribute from the attributes section.",
                    label: "Find user ID from attributes"
                },
                LogoutReqUrl: {
                    ariaLabel: "Specify SAML 2.0 IdP Logout URL",
                    hint: "Enter the IdP's logout URL value if it's different from the Single Sign-On URL" +
                        " mentioned above.",
                    label: "IdP logout URL",
                    placeholder: "Enter logout URL"
                },
                NameIDType: {
                    ariaLabel: "Choose NameIDFormat for SAML 2.0 assertion",
                    hint: "This specifies the name identifier format that is used to " +
                        "exchange information regarding the user in the SAML " +
                        "assertion sent from the external IdP.",
                    label: "Identity provider NameID format",
                    placeholder: "Select identity provider NameIDFormat"
                },
                RequestMethod: {
                    ariaLabel: "HTTP protocol for SAML 2.0 bindings",
                    hint: "This specifies the mechanisms to transport SAML" +
                        " messages in communication protocols.",
                    label: "HTTP protocol binding",
                    placeholder: "Select HTTP protocol binding"
                },
                SPEntityId: {
                    ariaLabel: "Service provider entity ID",
                    hint: "This value will be used as the <1><saml2:Issuer></1> in the" +
                        " SAML requests initiated from {{productName}} to" +
                        " external Identity Provider (IdP). You need to provide" +
                        " a unique value as the Service Provider (SP) entity ID.",
                    label: "Service provider entity ID",
                    placeholder: "Enter service provider entity ID"
                },
                SSOUrl: {
                    ariaLabel: "Single Sign-On URL",
                    hint: "Single sign-on URL of the external IdP. This is " +
                        "where {{productName}} will send its authentication requests.",
                    label: "Identity provider Single Sign-On URL",
                    placeholder: "https://ENTERPRISE_IDP/samlsso"
                },
                SignatureAlgorithm: {
                    ariaLabel: "Select the signature algorithm for request signing.",
                    label: "Signature algorithm",
                    placeholder: "Select signature algorithm."
                },
                artifactResolveEndpointUrl: {
                    ariaLabel: "Artifact resolve endpoint URL",
                    hint: "Specify the artifact resolve endpoint URL",
                    label: "Artifact resolve endpoint URL",
                    placeholder: "Enter artifact resolve endpoint URL"
                },
                attributeConsumingServiceIndex: {
                    ariaLabel: "Attribute consuming service index",
                    hint: "Specify the Attribute Consuming Service Index",
                    label: "Attribute consuming service index",
                    placeholder: "Enter attribute consuming service index"
                },
                authContextComparisonLevel: {
                    ariaLabel: "Authentication context comparison level",
                    hint: "Authentication context comparison level",
                    label: "Authentication context comparison level",
                    placeholder: ""
                },
                authenticationContextClass: {
                    ariaLabel: "Authentication context class",
                    hint: "Authentication context class",
                    label: "Authentication context class",
                    placeholder: "Search available authentication context classes"
                },
                commonAuthQueryParams: {
                    ariaLabel: "SAML request additional query parameters",
                    label: "Additional query parameters"
                },
                customAuthenticationContextClass: {
                    ariaLabel: "Custom Authentication context class",
                    hint: "Specify the custom authentication context class",
                    label: "Custom authentication context class",
                    placeholder: "Enter custom authentication context class"
                },
                includeCert:  {
                    ariaLabel: "Include public certificate",
                    hint: "Include public certificate in the request",
                    label: "Include public certificate"
                },
                includeNameIDPolicy: {
                    ariaLabel: "Include Name ID Policy",
                    hint: "Include NameIDPolicy in the request",
                    label: "Include Name ID Policy"
                },
                isArtifactBindingEnabled: {
                    ariaLabel: "Enable artifact binding",
                    hint: "Enable artifact binding",
                    label: "Enable artifact binding"
                },
                isArtifactResolveReqSigned: {
                    ariaLabel: "Sign artifact resolve request",
                    hint: "Sign artifact resolve request",
                    label: "Sign artifact resolve request"
                },
                isArtifactResponseSigned: {
                    ariaLabel: "Sign artifact response",
                    hint: "Sign artifact response",
                    label: "Sign artifact response"
                },
                isAssertionSigned: {
                    ariaLabel: "Enable assertion signing",
                    hint: "Specify if SAMLAssertion element is signed",
                    label: "Enable assertion signing"
                },
                isEnableAssertionEncryption: {
                    ariaLabel: "Enable assertion encryption",
                    hint: "Specify if SAMLAssertion element is encrypted",
                    label: "Enable assertion encryption"
                }
            },
            smsOTP: {
                allowedResendAttemptCount: {
                    hint: "The number of allowed OTP resend attempts.",
                    label: "Allowed OTP resend attempt count",
                    placeholder: "Enter allowed resend attempt count.",
                    validations: {
                        invalid: "Allowed OTP resend attempt count should be an integer.",
                        range: "Allowed OTP resend attempt count should be between 0 & 100.",
                        required: "Allowed OTP resend attempt count is a required field."
                    }
                },
                expiryTime: {
                    hint: "Please pick a value between <1>1 minute</1> & <3> 1440 minutes (1 day)</3>.",
                    label: "SMS OTP expiry time",
                    placeholder: "Enter SMS OTP expiry time.",
                    unit: "minutes",
                    validations: {
                        invalid: "SMS OTP expiry time should be an integer.",
                        range: "SMS OTP expiry time should be between 1 minutes & 1440 minutes (1 day).",
                        required: "SMS OTP expiry time is a required field."
                    }
                },
                hint: "Ensure that an <1>SMS Provider</1> is configured for the OTP feature to work properly.",
                tokenLength: {
                    hint: "The number of allowed characters in the OTP. Please " +
                        "pick a value between <1>4-10</1>.",
                    label: "SMS OTP length",
                    placeholder: "Enter SMS OTP length.",
                    unit: {
                        characters: "characters",
                        digits: "digits"
                    },
                    validations: {
                        invalid: "SMS OTP length should be an integer.",
                        range: {
                            characters: "SMS OTP length should be between 4 & 10 characters.",
                            digits: "SMS OTP length should be between 4 & 10 digits."
                        },
                        required: "SMS OTP length is a required field."
                    }
                },
                useNumericChars: {
                    hint: "Please clear this checkbox to enable alphanumeric characters.",
                    label: "Use only numeric characters for OTP",
                    validations: {
                        required: "Use only numeric characters for OTP token is a required field."
                    }
                }
            }
        },
        certificateSection: {
            certificateEditSwitch: {
                jwks: "Use JWKS Endpoint",
                pem: "Provide Certificates"
            },
            noCertificateAlert: "There are no certificates available for this trusted token issuer. " +
                "Therefore {{productName}} will no longer be able to validate tokens issued from this issuer."
        },
        common: {
            customProperties: "Custom Properties",
            invalidQueryParamErrorMessage: "These are not valid query parameters",
            invalidScopesErrorMessage: "Scopes must contain 'openid'",
            invalidURLErrorMessage: "Enter a valid URL",
            requiredErrorMessage: "This field cannot be empty"
        },
        generalDetails: {
            alias: {
                hint: "Alias value for {{productName}} in the trusted token issuer.",
                label: "Alias",
                placeholder: "Enter the alias."
            },
            description: {
                hint: "A text description of the connection.",
                label: "Description",
                placeholder: "Enter a description of the connection."
            },
            image: {
                hint: "A URL for the image of the connection for display purposes. If not provided" +
                    " a generated thumbnail will be displayed. Recommended size is 200x200 pixels.",
                label: "Logo",
                placeholder: "https://myapp-resources.io/my_app_image.png"
            },
            issuer: {
                hint: "A unique issuer value of the trusted token issuer.",
                label: "Issuer",
                placeholder: "Enter the issuer."
            },
            name: {
                hint: "Enter a unique name for this connection.",
                label: "Name",
                placeholder: "Enter a name for the connection.",
                validations: {
                    duplicate: "A connection already exists with this name",
                    empty: "Connection name is required",
                    maxLengthReached: "Connection name cannot exceed {{ maxLength }} characters.",
                    required: "Connection name is required"
                }
            }
        },
        jitProvisioning: {
            associateLocalUser: {
                hint: "When enabled, users that are provisioned with this identity " +
                    "provider will be linked to the local users who are already registered " +
                    "with the same email address.",
                label: "Associate provisioned users with existing local users"
            },
            enableJITProvisioning: {
                disabledMessageContent: "You cannot disable the Just-in-Time User" +
                    " Provisioning setting because the following applications" +
                    " require it to be enabled.",
                disabledMessageHeader: "Operation Not Allowed",
                hint: "Specify if users federated from this identity provider need to be proxied.",
                label: "Just-in-Time (JIT) User Provisioning"
            },
            provisioningScheme: {
                children: {
                    0: "Prompt for username, password and consent",
                    1: "Prompt for password and consent",
                    2: "Prompt for consent",
                    3: "Provision silently"
                },
                hint: "Select the scheme to be used, when users are provisioned.",
                label: "Provisioning scheme"
            },
            provisioningUserStoreDomain: {
                hint: "Select user store domain name to provision users.",
                label: "User store domain to always provision users"
            }
        },
        outboundConnectorAccordion: {
            default: {
                0: "Default",
                1: "Make default"
            },
            enable: {
                0: "Enabled",
                1: "Disabled"
            }
        },
        outboundProvisioningRoles: {
            heading: "OutBound Provisioning Roles",
            hint: "Select and add as identity provider outbound provisioning roles",
            label: "Role",
            placeHolder: "Select Role",
            popup: {
                content: "Add Role"
            }
        },
        roleMapping: {
            heading: "Role Mapping",
            hint: "Map local roles with the Identity Provider roles",
            keyName: "Local Role",
            validation: {
                duplicateKeyErrorMsg: "This role is already mapped. Please select another role",
                keyRequiredMessage: "Please enter the local role",
                valueRequiredErrorMessage: "Please enter an IDP role to map to"
            },
            valueName: "Identity Provider Role"
        },
        uriAttributeSettings: {
            group: {
                heading: "Group",
                hint: "Specifies the attribute that identifies the groups at the connection.",
                label: "Group Attribute",
                mappedRolesAbsentMessage: "With your current configuration, <1>Group Attribute</1> "+
                "is not configured. " +
                    "You can select an attribute from the dropdown.",
                mappedRolesPresentMessage: "Please note that <1>{{ mappedRolesClaim }}</1> "+
                "which is mapped to the <1>{{ rolesClaim }}</1> attribute " +
                    "will be considered as the default <1>Group Attribute</1> with the current configuration. " +
                    "You can select an attribute from the dropdown.",
                messageOIDC: "Please note that OpenID Connect attribute named "+
                "<1>{{ attribute }}</1> will be considered as the default " +
                    "<1>Group Attribute</1> as you have not added a custom attribute mapping.",
                messageSAML: "Please note that <1>{{ attribute }}</1> attribute will be considered as the default " +
                    "<1>Group Attribute</1> as you have not added a custom attribute mapping.",
                placeHolder: "Select the attribute",
                roleMappingDisabledMessage: "<1>Custom Attribute Mapping</1> is disabled in " +
                    "your system configuration. This might affect certain flows related to " +
                    "the connection. Proceed with caution.",
                validation: {
                    empty: "Please select an attribute for groups"
                }
            },
            subject: {
                heading: "Subject",
                hint: "The attribute that identifies the user at the enterprise connection. " +
                    "When attributes are configured based on the authentication response of " +
                    "this connection, you can use one of them as the subject. " +
                    "Otherwise, the default <1>saml2:Subject</1> in the SAML response is used " +
                    "as the subject attribute.",
                label: "Subject Attribute",
                placeHolder: "Default Subject",
                validation: {
                    empty: "Please select an attribute for subject"
                }
            }
        }
    },
    helpPanel: {
        tabs: {
            samples: {
                content: {
                    docs: {
                        goBack: "Go back",
                        hint: "Click on the following  Identity Provider types to check out the " +
                            "corresponding documentation.",
                        title: "Select a Template Type"
                    }
                },
                heading: "Docs"
            }
        }
    },
    list: {
        actions: "Actions",
        name: "Name"
    },
    modals: {
        addAuthenticator: {
            subTitle: "Add new authenticator to the connection",
            title: "Add New Authenticator"
        },
        addCertificate: {
            subTitle: "Add new certificate to the connection",
            title: "Configure Certificates"
        },
        addProvisioningConnector: {
            subTitle: "Follow the steps to add new outbound provisioning connector",
            title: "Create outbound provisioning connector"
        },
        attributeSelection: {
            content: {
                searchPlaceholder: "Search Attributes"
            },
            subTitle: "Add new attributes or remove existing attributes.",
            title: "Update attribute selection"
        }
    },
    notifications: {
        addFederatedAuthenticator: {
            error: {
                description: "{{ description }}",
                message: "Create error"
            },
            genericError: {
                description: "An error occurred while adding the authenticator.",
                message: "Create error"
            },
            success: {
                description: "Successfully added the authenticator.",
                message: "Create successful"
            }
        },
        addIDP: {
            error: {
                description: "{{ description }}",
                message: "Create error"
            },
            genericError: {
                description: "An error occurred while creating the connection.",
                message: "Create error"
            },
            success: {
                description: "Successfully created the connection.",
                message: "Create successful"
            }
        },
        apiLimitReachedError: {
            error: {
                description: "You have reached the maximum number of connections allowed.",
                message: "Failed to create the connection"
            }
        },
        changeCertType: {
            jwks: {
                description: "Please note that the certificates will be overridden " +
                    "by the the JWKS endpoint.",
                message: "Warning!"
            },
            pem: {
                description: "Please note that the JWKS endpoint will be overridden " +
                    "by the certificates.",
                message: "Warning!"
            }
        },
        deleteCertificate: {
            error: {
                description: "{{ description }}",
                message: "Certificate delete error"
            },
            genericError: {
                description: "An error occurred while deleting the certificate.",
                message: "Certificate delete error"
            },
            success: {
                description: "Successfully deleted the certificate.",
                message: "Delete successful"
            }
        },
        deleteConnection: {
            error: {
                description: "{{ description }}",
                message: "Connection Delete Error"
            },
            genericError: {
                description: "An error occurred while deleting the connection.",
                message: "Connection Delete Error"
            },
            success: {
                description: "Successfully deleted the connection.",
                message: "Delete Successful"
            }
        },
        deleteDefaultAuthenticator: {
            error: {
                description: "The default federated authenticator cannot be deleted.",
                message: "Federated Authenticator Deletion Error"
            },
            genericError: null,
            success: null
        },
        deleteDefaultConnector: {
            error: {
                description: "The default outbound provisioning connector cannot be deleted.",
                message: "Outbound Connector Deletion error"
            },
            genericError: null,
            success: null
        },
        deleteIDP: {
            error: {
                description: "{{ description }}",
                message: "Connection Delete Error"
            },
            genericError: {
                description: "An error occurred while deleting the connection.",
                message: "Connection Delete Error"
            },
            success: {
                description: "Successfully deleted the connection.",
                message: "Delete successful"
            }
        },
        deleteIDPWithConnectedApps: {
            "error": {
                "description": "There are applications using this connection.",
                "message": "Cannot Delete"
            }
        },
        disableAuthenticator: {
            error: {
                description: "You cannot disable the default authenticator.",
                message: "Data validation error"
            },
            genericError: {
                description: "",
                message: ""
            },
            success: {
                description: "",
                message: ""
            }
        },
        disableIDPWithConnectedApps: {
            "error": {
                "description": "There are applications using this connection.",
                "message": "Cannot Disable"
            }
        },
        disableOutboundProvisioningConnector: {
            error: {
                description: "You cannot disable the default outbound provisioning connector.",
                message: "Data validation error"
            },
            genericError: {
                description: "",
                message: ""
            },
            success: {
                description: "",
                message: ""
            }
        },
        duplicateCertificateUpload: {
            error: {
                description: "The certificate already exists for the IDP: {{idp}}",
                message: "Certificate duplication error "
            },
            genericError: {
                description: "",
                message: ""
            },
            success: {
                description: "",
                message: ""
            }
        },
        getAllLocalClaims: {
            error: {
                description: "{{ description }}",
                message: "Retrieval Error"
            },
            genericError: {
                description: "An error occurred while retrieving attributes.",
                message: "Retrieval Error"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getConnectionDetails: {
            error: {
                description: "{{ description }}",
                message: "Retrieval Error"
            },
            genericError: {
                description: "An error occurred while retrieving connection details.",
                message: "Retrieval Error"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getFederatedAuthenticator: {
            error: {
                description: "{{ description }}",
                message: "Retrieval error"
            },
            genericError: {
                description: "",
                message: "Retrieval error"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getFederatedAuthenticatorMetadata: {
            error: {
                description: "{{ description }}",
                message: "Retrieval error"
            },
            genericError: {
                description: "An error occurred while retrieving authenticator metadata.",
                message: "Retrieval error"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getFederatedAuthenticatorsList: {
            error: {
                description: "{{ description }}",
                message: "Retrieval error"
            },
            genericError: {
                description: "",
                message: "Retrieval error"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getFIDOConnectorConfigs: {
            error: {
                description: "{{ description }}",
                message: "Retrieval Error"
            },
            genericError: {
                description: "An error occurred while retrieving Passkey connector configs.",
                message: "Retrieval Error"
            }
        },
        getFIDOTrustedApps: {
            error: {
                description: "{{ description }}",
                message: "Retrieval Error"
            },
            genericError: {
                description: "An error occurred while retrieving Passkey trusted apps.",
                message: "Retrieval Error"
            }
        },
        getIDP: {
            error: {
                description: "{{ description }}",
                message: "Retrieval Error"
            },
            genericError: {
                description: "An error occurred while retrieving connection details.",
                message: "Retrieval Error"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getIDPList: {
            error: {
                description: "{{ description }}",
                message: "Retrieval Error"
            },
            genericError: {
                description: "An error occurred while retrieving connections.",
                message: "Retrieval Error"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getIDPTemplate: {
            error: {
                description: "{{ description }}",
                message: "Retrieval error"
            },
            genericError: {
                description: "An error occurred while retrieving IDP template.",
                message: "Retrieval error"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getIDPTemplateList: {
            error: {
                description: "{{ description }}",
                message: "Retrieval Error"
            },
            genericError: {
                description: "An error occurred while retrieving connection template list.",
                message: "Retrieval Error"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getOutboundProvisioningConnector: {
            error: {
                description: "{{ description }}",
                message: "Retrieval error"
            },
            genericError: {
                description: "An error occurred retrieving the outbound provisioning connector details.",
                message: "Retrieval error"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getOutboundProvisioningConnectorMetadata: {
            error: {
                description: "{{ description }}",
                message: "Retrieval error"
            },
            genericError: {
                description: "An error occurred retrieving the outbound provisioning connector metadata.",
                message: "Retrieval error"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getOutboundProvisioningConnectorsList: {
            error: {
                description: "{{ description }}",
                message: "Retrieval error"
            },
            genericError: {
                description: "An error occurred retrieving the outbound provisioning connectors list.",
                message: "Retrieval error"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getRolesList: {
            error: {
                description: "{{ description }}",
                message: "Retrieval Error"
            },
            genericError: {
                description: "An error occurred while retrieving roles.",
                message: "Retrieval Error"
            },
            success: {
                description: "",
                message: ""
            }
        },
        submitAttributeSettings: {
            error: {
                description: "Need to configure all the mandatory properties.",
                message: "Cannot perform update"
            },
            genericError: {
                description: "",
                message: ""
            },
            success: {
                description: "",
                message: ""
            }
        },
        updateAttributes: {
            error: {
                description: "{{ description }}",
                message: "Update error"
            },
            genericError: {
                description: "An error occurred while updating connection attributes.",
                message: "Update error"
            },
            success: {
                description: "Successfully updated connection attributes.",
                message: "Update successful"
            }
        },
        updateClaimsConfigs: {
            error: {
                description: "{{ description }}",
                message: "Update Error"
            },
            genericError: {
                description: "An error occurred while updating claim configurations.",
                message: "Update Error"
            },
            success: {
                description: "Successfully updated claim configurations.",
                message: "Update successful"
            }
        },
        updateEmailOTPAuthenticator: {
            error: {
                description: "{{ description }}",
                message: "Update error"
            },
            genericError: {
                description: "An error occurred while updating Email OTP connector.",
                message: "Update error"
            },
            success: {
                description: "Successfully updated the Email OTP connector.",
                message: "Update successful"
            }
        },
        updateFIDOConnectorConfigs: {
            error: {
                description: "{{ description }}",
                message: "Update error"
            },
            genericError: {
                description: "An error occurred while updating Passkey Connector configs.",
                message: "Update error"
            },
            success: {
                description: "Successfully updated the Passkey connector.",
                message: "Update successful"
            }
        },
        updateFIDOTrustedApps: {
            error: {
                description: "{{ description }}",
                message: "Update error"
            },
            genericError: {
                description: "An error occurred while updating Passkey Trusted Apps.",
                message: "Update error"
            },
            success: {
                description: "Successfully updated the Passkey Trusted Apps.",
                message: "Update successful"
            }
        },
        updateFederatedAuthenticator: {
            error: {
                description: "{{ description }}",
                message: "Update error"
            },
            genericError: {
                description: "An error occurred while updating the federated authenticator.",
                message: "Update error"
            },
            success: {
                description: "Successfully updated the federated authenticator.",
                message: "Update successful"
            }
        },
        updateFederatedAuthenticators: {
            error: {
                description: "{{ description }}",
                message: "Update error"
            },
            genericError: {
                description: "An error occurred while updating the federated authenticators.",
                message: "Update error"
            },
            success: {
                description: "Successfully updated the federated authenticators.",
                message: "Update successful"
            }
        },
        updateGenericAuthenticator: {
            error: {
                description: "{{ description }}",
                message: "Update error"
            },
            genericError: {
                description: "An error occurred while updating the connector.",
                message: "Update error"
            },
            success: {
                description: "Successfully updated the connector.",
                message: "Update successful"
            }
        },
        updateIDP: {
            error: {
                description: "{{ description }}",
                message: "Update error"
            },
            genericError: {
                description: "An error occurred while updating the connection.",
                message: "Update Error"
            },
            success: {
                description: "Successfully updated the connection.",
                message: "Update successful"
            }
        },
        updateIDPCertificate: {
            error: {
                description: "{{ description }}",
                message: "Update error"
            },
            genericError: {
                description: "An error occurred while updating the connection certificate.",
                message: "Update Error"
            },
            success: {
                description: "Successfully updated the connection certificate.",
                message: "Update successful"
            }
        },
        updateIDPRoleMappings: {
            error: {
                description: "{{ description }}",
                message: "Update Error"
            },
            genericError: {
                description: "An error occurred while updating outbound provisioning role configurations.",
                message: "Update Error"
            },
            success: {
                description: "Successfully updated outbound provisioning role configurations.",
                message: "Update successful"
            }
        },
        updateJITProvisioning: {
            error: {
                description: "",
                message: ""
            },
            genericError: {
                description: "An error occurred while the updating JIT provisioning configurations.",
                message: "Update Error"
            },
            success: {
                description: "Successfully updated the JIT provisioning configurations.",
                message: "Update successful"
            }
        },
        updateOutboundProvisioningConnector: {
            error: {
                description: "{{ description }}",
                message: "Update Error"
            },
            genericError: {
                description: "An error occurred while updating the outbound provisioning connector.",
                message: "Update Error"
            },
            success: {
                description: "Successfully updated the outbound provisioning connector.",
                message: "Update successful"
            }
        },
        updateOutboundProvisioningConnectors: {
            error: {
                description: "{{ description }}",
                message: "Update Error"
            },
            genericError: {
                description: "An error occurred while updating the outbound provisioning connectors.",
                message: "Update Error"
            },
            success: {
                description: "Successfully updated the outbound provisioning connectors.",
                message: "Update Successful"
            }
        },
        updateSMSOTPAuthenticator: {
            error: {
                description: "{{ description }}",
                message: "Update error"
            },
            genericError: {
                description: "An error occurred while updating the SMS OTP connector.",
                message: "Update error"
            },
            success: {
                description: "Successfully updated the SMS OTP connector.",
                message: "Update successful"
            }
        }
    },
    placeHolders: {
        emptyAuthenticatorList: {
            subtitles: {
                0: "There are currently no authenticators available.",
                1: "You can add a new authenticator easily by using the",
                2: "predefined templates."
            },
            title: "Add an authenticator"
        },
        emptyCertificateList: {
            subtitles: {
                0: "This IDP has no certificates added.",
                1: "Add a certificate to view it here."
            },
            title: "No certificates"
        },
        emptyConnectionTypeList: {
            subtitles: {
                0: "There are currently no connection types available.",
                1: "for configuration."
            },
            title: "No connection types found"
        },
        emptyConnectorList: {
            subtitles: {
                0: "This IDP has no outbound provisioning connectors configured.",
                1: "Add a connector to view it here."
            },
            title: "No outbound provisioning connectors"
        },
        emptyIDPList: {
            subtitles: {
                0: "There are no connections available at the moment.",
                1: "You can add a new connection by following",
                2: "the steps in the creation wizard."
            },
            title: "Add a new Connection"
        },
        emptyIDPSearchResults: {
            subtitles: {
                0: "We couldn't find any results for '{{ searchQuery }}'",
                1: "Please try a different search term."
            },
            title: "No results found"
        },
        noAttributes: {
            subtitles: {
                0: "There are no attributes selected at the moment."
            },
            title: "No attributes added"
        }
    },
    popups: {
        appStatus: {
            disabled: {
                content: "The connection is disabled. Please enable the authentication " +
                    "provider to use it's services.",
                header: "Disabled",
                subHeader: ""
            },
            enabled: {
                content: "The connection is enabled.",
                header: "Enabled",
                subHeader: ""
            }
        }
    },
    templates: {
        apple: {
            wizardHelp: {
                clientId: {
                    description: "Provide the <1>Services ID</1> created at Apple.",
                    heading: "Services ID"
                },
                heading: "Help",
                keyId: {
                    description: "Provide the <1>Key Identifier</1> of the private key generated.",
                    heading: "Key ID"
                },
                name: {
                    connectionDescription: "Provide a unique name for the connection.",
                    heading: "Name",
                    idpDescription: "Provide a unique name for the connection."
                },
                preRequisites: {
                    configureAppleSignIn: "See Apple's guide on configuring your environment for" +
                    " Sign in with Apple.",
                    configureReturnURL: "Add the following URL as a <1>Return URL</1>.",
                    configureWebDomain: "Use the following as a <1>Web Domain</1>.",
                    getCredentials: "Before you begin, create a <1>Sign in With Apple</1> enabled" +
                        " application on <3>Apple Developer Portal</3> with a <5>Services ID</5> and a" +
                        " <5>Private Key</5>.",
                    heading: "Prerequisite"
                },
                privateKey: {
                    description: "Provide the <1>Private Key</1> generated for the application.",
                    heading: "Private Key"
                },
                subHeading: "Use the guide below",
                teamId: {
                    description: "Provide the Apple developer <1>Team ID</1>.",
                    heading: "Team ID"
                }
            }
        },
        enterprise: {
            addWizard: {
                subtitle: "Configure an IDP to connect with standard authentication protocols.",
                title: "Standard based Connections"
            },
            saml: {
                preRequisites: {
                    configureIdp: "See Asgardeo guide on configuring SAML IdP",
                    configureRedirectURL: "Use the following URL as the " +
                        "<1>Assertion Consumer Service (ACS) URL</1>.",
                    heading: "Prerequisite",
                    hint: "The Assertion Consumer Service (ACS) URL determines" +
                        " where {{productName}} expects the external identity" +
                        " provider to send the SAML response."
                }
            },
            validation: {
                invalidName: "{{idpName}} is not a valid name. It should not contain any other" +
                    " alphanumerics except for periods (.), dashes (-), underscores (_) and spaces.",
                name: "Identity verification provider name is not valid"
            }
        },
        expert: {
            wizardHelp: {
                description: {
                    connectionDescription: "Provide a unique name for the connection.",
                    heading: "Name",
                    idpDescription: "Provide a unique name for the connection."
                },
                heading: "Help",
                name: {
                    connectionDescription: "Provide a description for the connection to explain more about it.",
                    heading: "Description",
                    idpDescription: "Provide a description for the connection to explain more about it."
                },
                subHeading: "Use the guide below"
            }
        },
        facebook: {
            wizardHelp: {
                clientId: {
                    description: "Provide the <1>App ID</1> you received from Facebook when you " +
                        "registered the OAuth app.",
                    heading: "App ID"
                },
                clientSecret: {
                    description: "Provide the <1>App secret</1> you received from Facebook when you " +
                        "registered the OAuth app.",
                    heading: "App secret"
                },
                heading: "Help",
                name: {
                    connectionDescription: "Provide a unique name for the connection.",
                    heading: "Name",
                    idpDescription: "Provide a unique name for the connection."
                },
                preRequisites: {
                    configureOAuthApps: "See Facebooks's guide on configuring apps.",
                    configureRedirectURL: "Add the following URL as a <1>Valid OAuth Redirect URI</1>.",
                    configureSiteURL: "Use the following as the <1>Site URL</1>.",
                    getCredentials: "Before you begin, create an <1>app</1> " +
                        "<3>on Facebook</3>, and obtain an <5>App ID & secret</5>.",
                    heading: "Prerequisite"
                },
                subHeading: "Use the guide below"
            }
        },
        github: {
            wizardHelp: {
                clientId: {
                    description: "Provide the <1>Client ID</1> you received from GitHub when you " +
                        "registered the OAuth app.",
                    heading: "Client ID"
                },
                clientSecret: {
                    description: "Provide the <1>Client secret</1> you received from GitHub when you " +
                        "registered the OAuth app.",
                    heading: "Client secret"
                },
                heading: "Help",
                name: {
                    connectionDescription: "Provide a unique name for the connection.",
                    heading: "Name",
                    idpDescription: "Provide a unique name for the connection."
                },
                preRequisites: {
                    configureHomePageURL: "Use the following as the <1>HomePage URL</1>.",
                    configureOAuthApps: "See GitHub's guide on configuring OAuth Apps.",
                    configureRedirectURL: "Add the following URL as the <1>Authorization callback URL</1>.",
                    getCredentials: "Before you begin, create an <1>OAuth application</1> " +
                        "<3>on GitHub</3>, and obtain a <5>client ID & secret</5>.",
                    heading: "Prerequisite"
                },
                subHeading: "Use the guide below"
            }
        },
        google: {
            wizardHelp: {
                clientId: {
                    description: "Provide the <1>Client ID</1> you received from Google when you " +
                        "registered the OAuth app.",
                    heading: "Client ID"
                },
                clientSecret: {
                    description: "Provide the <1>Client secret</1> you received from Google when you " +
                        "registered the OAuth app.",
                    heading: "Client secret"
                },
                heading: "Help",
                name: {
                    connectionDescription: "Provide a unique name for the connection.",
                    heading: "Name",
                    idpDescription: "Provide a unique name for the connection."
                },
                preRequisites: {
                    configureOAuthApps: "See Google's guide on configuring OAuth Apps.",
                    configureRedirectURL: "Add the following URL as the <1>Authorized Redirect URI</1>.",
                    getCredentials: "Before you begin, create an <1>OAuth application</1> " +
                        "<3>on Google Console</3>, and obtain a <5>client ID & secret</5>.",
                    heading: "Prerequisite"
                },
                subHeading: "Use the guide below"
            }
        },
        hypr: {
            wizardHelp: {
                apiToken: {
                    description: "Provide the <1>API Token</1> obtained from "+
                    "HYPR. This will be used to access HYPR's APIs.",
                    heading: "API Token"
                },
                appId: {
                    description: "Provide the <1>Application ID</1> of the "+
                    "application registered in the HYPR control center.",
                    heading: "App ID"
                },
                baseUrl: {
                    description: "Provide the <1>base URL</1> of your HYPR server deployment.",
                    heading: "Base URL"
                },
                heading: "Help",
                name: {
                    connectionDescription: "Provide a unique name for the connection.",
                    heading: "Name",
                    idpDescription: "Provide a unique name for the connection."
                },
                preRequisites: {
                    heading: "Prerequisite",
                    rpDescription: "Before you begin, create a relying party application "+
                    "in the <1>HYPR control center</1>, and obtain the application ID.",
                    tokenDescription: "You also have to obtain an <1>API token</1> for your application "+
                    "created on HYPR."
                }
            }
        },
        iproov: {
            wizardHelp: {
                apiKey: {
                    description: "Provide the <1>API Key</1> of the application "+
                    "registered in the iProov control center.",
                    heading: "API Key"
                },
                apiSecret: {
                    description: "Provide the <1>API Secret</1> of the application "+
                    "registered in the iProov control center.",
                    heading: "API Secret"
                },
                baseUrl: {
                    description: "Provide the <1>base URL</1>  of your iProov server deployment.",
                    heading: "Base URL"
                },
                enableProgressiveEnrollment: {
                    description: "Enable Progressive Enrollment with iProov.",
                    heading: "Enable Progressive Enrollment"
                },
                heading: "Help",
                name: {
                    connectionDescription: "Provide a unique name for the connection.",
                    heading: "Name",
                    idpDescription: "Provide a unique name for the connection."
                },
                oauthPassword: {
                    description: "Provide the <1>OAuth Password</1> of the application "+
                    "registered in the iProov control center.",
                    heading: "OAUTH Password"
                },
                oauthUsername: {
                    description: "Provide the <1>OAuth Username</1> of "+
                    "the application registered in the iProov control center.",
                    heading: "OAUTH Username"
                },
                preRequisites: {
                    appDescription:
                    "Before you begin, create an identity provider " +
                    "in the <1>iPortal</1>, and obtain the API key, API Secret, OAuth username and OAuth password.",
                    heading: "Prerequisite"
                }
            }
        },
        manualSetup: {
            heading: "Manual Setup",
            subHeading: "Create a connection with custom configurations."
        },
        microsoft: {
            wizardHelp: {
                clientId: {
                    description: "Provide the <1>Client ID</1> you received from Microsoft when you " +
                        "registered the OAuth app.",
                    heading: "Client ID"
                },
                clientSecret: {
                    description: "Provide the <1>Client secret</1> you received from Microsoft when you " +
                        "registered the OAuth app.",
                    heading: "Client secret"
                },
                heading: "Help",
                name: {
                    connectionDescription: "Provide a unique name for the connection.",
                    heading: "Name",
                    idpDescription: "Provide a unique name for the connection."
                },
                preRequisites: {
                    configureOAuthApps: "See Microsoft's guide on configuring OAuth Apps.",
                    configureRedirectURL: "Add the following URL as the <1>Authorized Redirect URI</1>.",
                    getCredentials: "Before you begin, create an <1>OAuth application</1> " +
                        "<3>on Microsoft</3>, and obtain a <5>client ID & secret</5>.",
                    heading: "Prerequisite"
                },
                subHeading: "Use the guide below"
            }
        },
        organizationIDP: {
            wizardHelp: {
                description: {
                    description: "Provide a description for the enterprise authentication provider to" +
                    " explain more about it.",
                    example: "E.g., This is the authenticator for MyOrg, which acts as the IDP for MyApp.",
                    heading: "Description"
                },
                name: {
                    description: "Provide a unique name for the enterprise authentication provider so" +
                        " that it can be easily identified.",
                    heading: "Name"
                }
            }
        },
        quickSetup: {
            heading: "Quick Setup",
            subHeading: "Predefined set of templates to speed up your connection creation."
        },
        trustedTokenIssuer: {
            addWizard: {
                subtitle: "Register a trusted token issuer to exchange its token for a token issued by {{productName}}",
                title: "Trusted token issuer"
            },
            forms: {
                alias: {
                    hint: "Alias value for {{productName}} in the trusted token issuer.",
                    label: "Alias",
                    placeholder: "Enter the alias",
                    validation: {
                        notValid: "{{alias}} is not a valid alias."
                    }
                },
                certificateType: {
                    label: "Mode of certificate configuration",
                    requiredCertificate: "A certificate is required to create a trusted token issuer."
                },
                issuer: {
                    hint: "A unique issuer value of the trusted token issuer.",
                    label: "Issuer",
                    placeholder: "Enter the issuer",
                    validation: {
                        notValid: "{{issuer}} is not a valid issuer."
                    }
                },
                jwksUrl: {
                    hint: "{{productName}} will use this URL to obtain keys to verify the signed responses from " +
                        "your trusted token issuer.",
                    label: "JWKS endpoint URL",
                    optionLabel: "JWKS endpoint",
                    placeholder: "Enter JWKS endpoint URL",
                    validation: {
                        notValid: "Please enter a valid URL"
                    }
                },
                name: {
                    label: "Trusted token issuer name",
                    placeholder: "Enter a name for the trusted token isser"
                },
                pem: {
                    dropzoneText: "Drag and drop a certificate file here.",
                    hint: "{{productName}} will use this certificate to verify the signed responses from " +
                        "your trusted token issuer.",
                    optionLabel: "Use PEM certificate",
                    pasteAreaPlaceholderText: "Paste trusted token issuer certificate in PEM format.",
                    uploadCertificateButtonLabel: "Upload certificate file"
                },
                steps: {
                    certificate: "Certificates",
                    general: "General Settings"
                }
            }
        }
    },
    wizards: {
        addAuthenticator: {
            header: "Fill the basic information about the authenticator.",
            steps: {
                authenticatorConfiguration: {
                    title: "Authenticator Configuration"
                },
                authenticatorSelection: {
                    manualSetup: {
                        subTitle: "Add a new authenticator with custom configurations.",
                        title: "Manual Setup"
                    },
                    quickSetup: {
                        subTitle: "Predefined authenticator templates to speed up the process.",
                        title: "Quick Setup"
                    },
                    title: "Authenticator Selection"
                },
                authenticatorSettings: {
                    emptyPlaceholder: {
                        subtitles: [
                            "This authenticator does not have any settings available to be",
                            "configured at this level. Simply click on <1>Finish</1>."
                        ],
                        title: "No Settings available for this Authenticator."
                    }
                },
                summary: {
                    title: "Summary"
                }
            }
        },
        addIDP: {
            header: "Fill the basic information about the connection.",
            steps: {
                authenticatorConfiguration: {
                    title: "Authenticator Configuration"
                },
                generalSettings: {
                    title: "General settings"
                },
                provisioningConfiguration: {
                    title: "Provisioning Configuration"
                },
                summary: {
                    title: "Summary"
                }
            }
        },
        addProvisioningConnector: {
            header: "Fill the basic information about the provisioning connector.",
            steps: {
                connectorConfiguration: {
                    title: "Connector Details"
                },
                connectorSelection: {
                    defaultSetup: {
                        subTitle: "Select the type of the new outbound provisioning connector",
                        title: "Connector Types"
                    },
                    title: "Connector selection"
                },
                summary: {
                    title: "Summary"
                }
            }
        },
        buttons: {
            finish: "Finish",
            next: "Next",
            previous: "Previous"
        }
    }
};
