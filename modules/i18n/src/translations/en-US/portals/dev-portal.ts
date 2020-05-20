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

import { DevPortalNS } from "../../../models";
import { FormAttributes } from "../../../models/common";

export const devPortal: DevPortalNS = {
    components: {
        advancedSearch: {
            form: {
                inputs: {
                    filterAttribute: {
                        label: "Filter attribute",
                        placeholder: "E.g. Name, Description etc.",
                        validations: {
                            empty: "Filter attribute is a required field."
                        }
                    },
                    filterCondition: {
                        label: "Filter condition",
                        placeholder: "E.g. Starts with etc.",
                        validations: {
                            empty: "Filter condition is a required field."
                        }
                    },
                    filterValue: {
                        label: "Filter value",
                        placeholder: "E.g. admin, wso2 etc.",
                        validations: {
                            empty: "Filter value is a required field."
                        }
                    }
                }
            },
            hints: {
                querySearch: {
                    actionKeys: "Shift + Enter",
                    label: "To search as a query"
                }
            },
            options: {
                header: "Advanced search"
            },
            placeholder: "Search by {{attribute}}",
            popups: {
                clear: "clear search",
                dropdown: "Show options"
            },
            resultsIndicator: "Showing results for the query \"{{query}}\""
        },
        applications: {
            addWizard: {
                steps: {
                    generalSettings: {
                        heading: "General Settings"
                    },
                    protocolConfig: {
                        heading: "Protocol Configuration"
                    },
                    protocolSelection: {
                        heading: "Protocol Selection"
                    },
                    summary: {
                        heading: "Summary",
                        sections: {
                            accessURL: {
                                heading: "Access URL"
                            },
                            applicationQualifier: {
                                heading: "Application qualifier"
                            },
                            assertionURLs: {
                                heading: "Assertion consumer URL(s)"
                            },
                            audience: {
                                heading: "Audience"
                            },
                            callbackURLs: {
                                heading: "Callback URL(s)"
                            },
                            certificateAlias: {
                                heading: "Certificate alias"
                            },
                            discoverable: {
                                heading: "Discoverable"
                            },
                            grantType: {
                                heading: "Grant Type(s)"
                            },
                            issuer: {
                                heading: "Issuer"
                            },
                            metaFile: {
                                heading: "Meta File(Base64Encoded)"
                            },
                            metadataURL: {
                                heading: "Metadata URL"
                            },
                            public: {
                                heading: "Public"
                            },
                            realm: {
                                heading: "Realm"
                            },
                            renewRefreshToken: {
                                heading: "Renew RefreshToken"
                            },
                            replyTo: {
                                heading: "Reply To"
                            }
                        }
                    }
                }
            },
            advancedSearch: {
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: "E.g. Name, Description etc."
                        },
                        filterCondition: {
                            placeholder: "E.g. Starts with etc."
                        },
                        filterValue: {
                            placeholder: "E.g. Zoom, Salesforce etc."
                        }
                    }
                },
                placeholder: "Search by application name"
            },
            confirmations: {
                deleteApplication: {
                    assertionHint: "Please type <1>{{ name }}</1> to confirm.",
                    content: "If you delete this application, you will not be able to get it back. All the " +
                        "applications depending on this also might stop working. Please proceed with caution.",
                    header: "Are you sure?",
                    message: "This action is irreversible and will permanently delete the application."
                },
                deleteOutboundProvisioningIDP: {
                    assertionHint: "Please type <1>{{ name }}</1> to confirm.",
                    content: "If you delete this outbound provisioning IDP, you will not be able to get it back. " +
                        "Please proceed with caution.",
                    header: "Are you sure?",
                    message: "This action is irreversible and will remove the IDP."
                },
                deleteProtocol: {
                    assertionHint: "Please type <1>{{ name }}</1> to confirm.",
                    content: "If you delete this protocol, you will not be able to get it back. All the " +
                        "applications depending on this also might stop working. Please proceed with caution.",
                    header: "Are you sure?",
                    message: "This action is irreversible and will permanently delete the protocol."
                },
                regenerateSecret: {
                    assertionHint: "Please type <1>{{ id }}</1> to confirm.",
                    content: "If you regenerate this application, All the applications depending on this also might " +
                        "stop working. Please proceed with caution.",
                    header: "Are you sure?",
                    message: "This action is irreversible and permanently change the client secret."
                },
                revokeApplication: {
                    assertionHint: "Please type <1>{{ id }}</1> to confirm.",
                    content: "If you Revoke this application, All the applications depending on this also might stop " +
                        "working. Please proceed with caution.",
                    header: "Are you sure?",
                    message: "This action is can be reversed by regenerating client secret."
                }
            },
            dangerZoneGroup: {
                deleteApplication: {
                    actionTitle: "Delete",
                    header: "Delete application",
                    subheader: "Once you delete an application, there is no going back. Please be certain."
                },
                header: "Danger Zone"
            },
            edit: {
                sections: {
                    access: {
                        addProtocolWizard: {
                            heading: "Add Protocol",
                            steps: {
                                protocolSelection: {
                                    manualSetup: {
                                        emptyPlaceholder: {
                                            subtitles: "All the protocols have been configured",
                                            title: "No templates available"
                                        },
                                        heading: "Manual Setup",
                                        subHeading: "Add an protocol with custom configurations"
                                    },
                                    quickSetup: {
                                        emptyPlaceholder: {
                                            subtitles: "All the protocols have been configured",
                                            title: "No templates available"
                                        },
                                        heading: "Quick Setup",
                                        subHeading: "Get protocol configuration from a template"
                                    }
                                }
                            },
                            subHeading: "Add new protocol to {{appName}} application"
                        },
                        tabName: "Access"
                    },
                    advanced: {
                        tabName: "Advanced"
                    },
                    attributes: {
                        forms: {
                            fields: {
                                dynamic: {
                                    applicationRole: {
                                        label: "Application Role",
                                        validations: {
                                            duplicate: "This role is already mapped. Please select another role",
                                            empty: "Please enter an attribute to map to"
                                        }
                                    },
                                    localRole: {
                                        label: "Local Role",
                                        validations: {
                                            empty: "Please enter the local role"
                                        }
                                    }
                                }
                            }
                        },
                        roleMapping: {
                            heading: "Role Mapping"
                        },
                        selection: {
                            addWizard: {
                                header: "Update Attribute Selection",
                                steps: {
                                    select: {
                                        transfer: {
                                            headers: {
                                                attribute: "Attribute"
                                            },
                                            searchPlaceholders: {
                                                attribute: "Search attribute",
                                                role: "Search Role"
                                            }
                                        }
                                    }
                                },
                                subHeading: "Add new attributes or remove existing attributes."
                            },
                            heading: "Attribute Selection",
                            mappingTable: {
                                actions: {
                                    enable: "Enable mapping"
                                },
                                columns: {
                                    appAttribute: "Application attribute",
                                    attribute: "Attribute",
                                    mandatory: "Mandatory",
                                    requested: "Requested"
                                },
                                listItem: {
                                    actions: {
                                        makeMandatory: "Make mandatory",
                                        makeRequested: "Make requested",
                                        removeMandatory: "Remove mandatory",
                                        removeRequested: "Remove requested"
                                    },
                                    fields: {
                                        claim: {
                                            label: "Please enter a value",
                                            placeholder: "eg: custom {{name}}, new {{name}}"
                                        }
                                    }
                                },
                                searchPlaceholder: "Search attributes"
                            }
                        },
                        tabName: "Attributes"
                    },
                    general: {
                        tabName: "General"
                    },
                    provisioning: {
                        inbound: {
                            heading: "Inbound Provisioning",
                            subHeading: "Provision users or groups to a WSO2 Identity Server’s userstore via this " +
                                "application."
                        },
                        outbound: {
                            actions: {
                                addIdp: "New Identity Provider"
                            },
                            addIdpWizard: {
                                heading: "Add Outbound Provisioning IDP",
                                steps: {
                                    details: "IDP Details"
                                },
                                subHeading: "Select the IDP to provision users that self-register to your application."
                            },
                            heading: "Outbound Provisioning",
                            subHeading: "Configure an identity provider to outbound provision the users of this " +
                                "application."
                        },
                        tabName: "Provisioning"
                    },
                    signOnMethod: {
                        sections: {
                            authenticationFlow: {
                                heading: "Authentication flow",
                                sections: {
                                    scriptBased: {
                                        editor: {
                                            templates: {
                                                darkMode: "Dark Mode",
                                                heading: "Templates"
                                            }
                                        },
                                        heading: "Script based configuration",
                                        hint: "Define the authentication flow via an adaptive script. You can select " +
                                            "one of the templates fom the panel to get started."
                                    },
                                    stepBased: {
                                        actions: {
                                            addStep: "New Authentication Step",
                                            selectAuthenticator: "Select an Authenticator"
                                        },
                                        forms: {
                                            fields: {
                                                attributesFrom: {
                                                    label: "Use Attributes from",
                                                    placeholder: "Select step"
                                                },
                                                subjectIdentifierFrom: {
                                                    label: "Use Subject identifier from",
                                                    placeholder: "Select step"
                                                }
                                            }
                                        },
                                        heading: "Step based configuration",
                                        hint: "Create authentication steps by dragging the local/federated " +
                                            "authenticators on to the relevant steps."
                                    }
                                }
                            }
                        },
                        tabName: "Sign-on Method"
                    }
                }
            },
            forms: {
                advancedAttributeSettings: {
                    sections: {
                        role: {
                            fields: {
                                role: {
                                    hint: "This option will append the user store domain that the user resides to " +
                                        "role",
                                    label: "Include userDomain",
                                    validations: {
                                        empty: "Select the role attribute"
                                    }
                                },
                                roleAttribute: {
                                    hint: "Choose the attribute",
                                    label: "Role attribute",
                                    validations: {
                                        empty: "Select the role attribute"
                                    }
                                }
                            },
                            heading: "Role"
                        },
                        subject: {
                            fields:{
                                subjectAttribute: {
                                    hint: "Choose the attribute",
                                    label: "Subject attribute",
                                    validations: {
                                        empty: "Select the subject attribute"
                                    }
                                },
                                subjectIncludeTenantDomain: {
                                    hint: "This option will append the tenant domain to the local subject identifier",
                                    label: "Include Tenant Domain",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                },
                                subjectIncludeUserDomain: {
                                    hint: "This option will append the user store domain that the user resides in " +
                                        "the local subject identifier",
                                    label: "Include User Domain",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                },
                                subjectUseMappedLocalSubject: {
                                    hint: "This option will use the local subject identifier when asserting the " +
                                        "identity",
                                    label: "Use mapped local subject",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                }
                            },
                            heading: "Subject"
                        }
                    }
                },
                advancedConfig: {
                    fields: {
                        enableAuthorization: {
                            hint: "Decides whether authorization policies needs to be engaged during authentication " +
                                "flows.",
                            label: "Enable authorization",
                            validations: {
                                empty: "This is a required field."
                            }
                        },
                        returnAuthenticatedIdpList: {
                            hint: " The list of authenticated Identity Providers will be returned in the " +
                                "authentication response.",
                            label: "Return authenticated idP list",
                            validations: {
                                empty: "This is a required field."
                            }
                        },
                        saas: {
                            hint: "Applications are by default restricted for usage by users of the service" +
                                "provider&apos;s tenant. If this application is SaaS enabled it is opened up for " +
                                "all the users of all the tenants.",
                            label: "SaaS application",
                            validations: {
                                empty: "This is a required field."
                            }
                        },
                        skipConsentLogin: {
                            hint: "User consent will be skipped during login flows.",
                            label: "Skip login consent",
                            validations: {
                                empty: "This is a required field."
                            }
                        },
                        skipConsentLogout: {
                            hint: "User consent will be skipped during logout flows.",
                            label: "Skip logout consent",
                            validations: {
                                empty: "This is a required field."
                            }
                        }
                    },
                    sections: {
                        certificate: {
                            fields: {
                                jwksValue: {
                                    label: "Value",
                                    placeholder: "Application JWKS endpoint URL.",
                                    validations: {
                                        empty: "This is a required field.",
                                        invalid: "This is not a valid URL"
                                    }
                                },
                                pemValue: {
                                    actions: {
                                        view: "View certificate info"
                                    },
                                    hint: "The certificate (in PEM format) of the application.",
                                    label: "Value",
                                    placeholder: "Certificate in PEM format.",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                },
                                type: {
                                    children: {
                                        jwks: {
                                            label: "Use JWKS endpoint"
                                        },
                                        pem: {
                                            label: "Provide certificate"
                                        }
                                    },
                                    label: "Type"
                                }
                            },
                            heading: "Certificate"
                        }
                    }
                },
                generalDetails: {
                    fields: {
                        accessUrl: {
                            hint: "Applications flagged as discoverable are visible for end users.",
                            label: "Access URL",
                            placeholder: "Enter access url for the application login page",
                            validations: {
                                empty: "A valid access URL needs to be defined for an application to be marked as " +
                                    "discoverable",
                                invalid: "This is not a valid URL"
                            }
                        },
                        description: {
                            label: "Description",
                            placeholder: "Enter a description for the application"
                        },
                        discoverable: {
                            label: "Discoverable application"
                        },
                        imageUrl: {
                            label: "Application image",
                            placeholder: "Enter a image url for the application",
                            validations: {
                                invalid: "This is not a valid image URL"
                            }
                        },
                        name: {
                            label: "Name",
                            placeholder: "Enter a name for the application. E.g. Zoom, Salesforce, etc.",
                            validations: {
                                empty: "This is a required field."
                            }
                        }
                    }
                },
                inboundCustom: {
                    fields: {
                        checkbox: {
                            label: "{{label}}",
                            validations: {
                                empty: "Provide {{name}}"
                            }
                        },
                        dropdown: {
                            label: "{{label}}",
                            placeholder: "Enter {{name}}",
                            validations: {
                                empty: "Provide {{name}}"
                            }
                        },
                        generic: {
                            label: "{{label}}",
                            validations: {
                                empty: "Select the {{name}}"
                            }
                        },
                        password: {
                            label: "{{label}}",
                            placeholder: "Enter {{name}}",
                            validations: {
                                empty: "Provide {{name}}"
                            }
                        }
                    }
                },
                inboundOIDC: {
                    fields: {
                        callBackUrls: {
                            hint: "After the authentication, we will only redirect to the above callback URLs " +
                                "and you can specify multiple URLs",
                            label: "Callback URL",
                            placeholder: "Enter callback URL",
                            validations: {
                                empty: "Please add valid URL."
                            }
                        },
                        clientID: {
                            label: "Client ID"
                        },
                        clientSecret: {
                            hideSecret: "Hide secret",
                            label: "Client secret",
                            placeholder: "Enter Client Secret",
                            showSecret: "Show secret",
                            validations: {
                                empty: "This is a required field."
                            }
                        },
                        grant: {
                            label: "Allowed grant type",
                            validations: {
                                empty: "Select at least a  grant type"
                            }
                        },
                        public: {
                            hint: "Allow the client to authenticate without a client secret.",
                            label: "Public client",
                            validations: {
                                empty: "This is a required field."
                            }
                        }
                    },
                    sections: {
                        accessToken: {
                            fields: {
                                expiry: {
                                    hint: "Configure the user access token expiry time (in seconds).",
                                    label: "User access token expiry time",
                                    placeholder: "Enter the user access token expiry time",
                                    validations: {
                                        empty: "Please fill the user access token expiry time"
                                    }
                                },
                                type: {
                                    label: "Token type"
                                }
                            },
                            heading: "Access Token",
                            hint: " Configure the access token issuer, user access token expiry time, application " +
                                "access token expiry time etc."
                        },
                        idToken: {
                            fields: {
                                algorithm: {
                                    hint: "Choose encryption algorithm of ID token for the client.",
                                    label: "Algorithm",
                                    placeholder: "Select Algorithm",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                },
                                audience: {
                                    hint: "The recipients that the ID token is intended for.",
                                    label: "Audience",
                                    placeholder: "Enter Audience",
                                    validations: {
                                        empty: "Please fill the audience"
                                    }
                                },
                                encryption: {
                                    label: "Enable encryption",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                },
                                expiry: {
                                    hint: "Configure the ID token expiry time (in seconds).",
                                    label: "Id token expiry time",
                                    placeholder: "Enter the ID token expiry time",
                                    validations: {
                                        empty: "Please fill the ID token expiry time"
                                    }
                                },
                                method: {
                                    hint: "Choose the method for the ID token encryption.",
                                    label: "Encryption method",
                                    placeholder: "Select Method",
                                    validations: {
                                        empty:  "This is a required field."
                                    }
                                }
                            },
                            heading: "ID Token"
                        },
                        logoutURLs: {
                            fields: {
                                back: {
                                    label: "Back channel logout URL",
                                    placeholder: "Enter the Back Channel Logout URL",
                                    validations: {
                                        empty: "Please fill the Back Channel Logout URL",
                                        invalid: "Please add valid URL"
                                    }
                                },
                                front: {
                                    label: "Front channel logout URL",
                                    placeholder: "Enter the Front Channel Logout URL",
                                    validations: {
                                        empty: "Please fill the Front Channel Logout URL",
                                        invalid: "Please add valid URL"
                                    }
                                },
                                signatureValidation: {
                                    label: "Enable request object signature validation"
                                }
                            },
                            heading: "PKCE"
                        },
                        pkce: {
                            fields: {
                                pkce: {
                                    children: {
                                        mandatory: {
                                            label: "PKCE mandatory"
                                        },
                                        plainAlg: {
                                            label: "Support PKCE 'Plain' Transform Algorithm"
                                        }
                                    },
                                    label: "{{label}}",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                }
                            },
                            heading: "PKCE",
                            hint: "PKCE (RFC 7636) is an extension to the Authorization Code flow to prevent " +
                                "certain attacks and to be able to securely perform the OAuth exchange from public " +
                                "clients."
                        },
                        refreshToken: {
                            fields: {
                                expiry: {
                                    hint: "Configure the refresh token expiry time (in seconds).",
                                    label: "Refresh token expiry time",
                                    placeholder: "Enter the refresh token expiry time",
                                    validations: {
                                        empty: "Please fill the refresh token expiry time"
                                    }
                                },
                                renew: {
                                    hint: "Issue a new refresh token per request when Refresh Token Grant is used.",
                                    label: "Renew refresh token",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                }
                            },
                            heading: "Refresh Token"
                        },
                        scopeValidators: {
                            fields: {
                                validator: {
                                    label: "{{label}}",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                }
                            },
                            heading: "Scope validators"
                        }
                    }
                },
                inboundSAML: {
                    fields: {
                        assertionURLs: {
                            hint: "This specifies the assertion Consumer URLs that the browser " +
                                "should be redirected to after the authentication is successful. " +
                                "This is the Assertion Consumer Service (ACS) URL of the Application.",
                            label: "Assertion consumer URLs",
                            placeholder: "Enter Assertion URL",
                            validations: {
                                invalid: "Please add valid URL"
                            }
                        },
                        defaultAssertionURL: {
                            hint: "As there can be multiple assertion consumer URLs, you must define a " +
                                "Default Assertion Consumer URL in case you are unable to retrieve " +
                                "it from the authentication request.",
                            label: "Default assertion consumer URL",
                            validations: {
                                empty: "This is a required field."
                            }
                        },
                        idpEntityIdAlias: {
                            hint: "This value can override identity provider entity Id that is specified under " +
                                "SAML SSO inbound authentication configuration of the resident identity provider. " +
                                "The Identity Provider Entity Id is used as the issuer of " +
                                "the SAML response that is generated.",
                            label: "Idp entityId alias",
                            placeholder: "Enter alias",
                            validations: {
                                empty: "This is a required field."
                            }
                        },
                        issuer: {
                            hint: "This specifies the issuer. This is the &quot;saml:Issuer&quot; element that " +
                                "contains the unique identifier of the Application. This is also the issuer value" +
                                "specified in the SAML Authentication Request issued by the Application.",
                            label: "Issuer",
                            placeholder: "Enter the issuer name",
                            validations: {
                                empty: "Please provide the issuer"
                            }
                        },
                        metaURL: {
                            hint: "URL for the meta file",
                            label: "Meta URL",
                            placeholder: "Enter the meta file url",
                            validations: {
                                empty: "Please provide the meta file url",
                                invalid: "This is not a valid URL"
                            }
                        },
                        mode: {
                            children: {
                                manualConfig: {
                                    label: "Manual Configuration"
                                },
                                metadataFile: {
                                    label: "Metadata File"
                                },
                                metadataURL: {
                                    label: "Metadata URL"
                                }
                            },
                            hint: "Select the mode to configure saml.",
                            label: "Mode"
                        },
                        qualifier: {
                            hint: "This value is needed only if you have to configure multiple SAML SSO " +
                                "inbound authentication configurations for the same Issuer value. Qualifier " +
                                "that is defined here will be appended to the issuer internally to " +
                                "identify a application uniquely at runtime.",
                            label: "Application qualifier",
                            placeholder: "Enter the application qualifier",
                            validations: {
                                empty: "This is a required field."
                            }
                        }
                    },
                    sections: {
                        assertion: {
                            fields: {
                                audience: {
                                    hint: "Restrict the audience.",
                                    label: "Audience",
                                    placeholder: "Enter audience",
                                    validations: {
                                        invalid: "Please add valid URL"
                                    }
                                },
                                nameIdFormat: {
                                    hint: "This defines the name identifier formats that are supported by " +
                                        "the identity provider. Name identifiers are used to provide information\n" +
                                        "regarding a user.",
                                    label: "Name ID format",
                                    placeholder: "Enter name ID format",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                },
                                recipients: {
                                    hint:  "Validate the recipients of the response.",
                                    label: "Recipients",
                                    placeholder: "Enter recipients",
                                    validations: {
                                        invalid: "Please add valid URL"
                                    }
                                }
                            },
                            heading: "Assertion"
                        },
                        attributeProfile: {
                            fields: {
                                enable: {
                                    hint: "The Identity Server provides support for a basic attribute profile where " +
                                        "the identity provider can include the user’s attributes in the SAML " +
                                        "Assertions as part of the attribute statement.",
                                    label: "Enable"
                                },
                                includeAttributesInResponse: {
                                    hint: "Once you select the checkbox to Include Attributes in the Response " +
                                        "Always, the identity provider always includes the attribute values related " +
                                        "to the selected claims in the SAML attribute statement.",
                                    label: "Always include attributes in response"
                                },
                                serviceIndex: {
                                    hint: "This is an optional field if not provided a value will be generated " +
                                        "automatically.",
                                    label: "Attribute consuming service index",
                                    placeholder: "Enter attribute consuming service index",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                }
                            },
                            heading: "Attribute Profile"
                        },
                        encryption: {
                            fields: {
                                assertionEncryption: {
                                    label: "Enable",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                },
                                assertionEncryptionAlgorithm: {
                                    label: "Assertion encryption algorithm",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                },
                                keyEncryptionAlgorithm: {
                                    label: "Key encryption algorithm",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                }
                            },
                            heading: "Encryption"
                        },
                        idpInitiatedSLO: {
                            fields: {
                                enable: {
                                    hint: "When this is enabled, the service provider is not required to send " +
                                        "the SAML request.",
                                    label: "Enable",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                },
                                returnToURLs: {
                                    label: "Return to URLs",
                                    placeholder: "Enter URL",
                                    validations: {
                                        invalid: "Please add valid URL"
                                    }
                                }
                            },
                            heading: "Idp Initiated SingleLogout"
                        },
                        requestProfile: {
                            fields: {
                                enable: {
                                    label: "Enable assertion query profile",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                }
                            },
                            heading: "Assertion Query/Request Profile"
                        },
                        requestValidation: {
                            fields: {
                                signatureValidation: {
                                    hint: "This specifies whether the identity provider must validate the signature " +
                                        "of the SAML2 authentication request and the SAML2 logout request " +
                                        "that are sent by the application.",
                                    label: "Enable request signature validation",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                },
                                signatureValidationCertAlias: {
                                    hint: "If application certificate is provided then it will be used and above " +
                                        "selected certificate will be ignored.",
                                    label: "Request validation certificate alias",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                }
                            },
                            heading: "Request Validation"
                        },
                        responseSigning: {
                            fields: {
                                digestAlgorithm: {
                                    label: "Digest algorithm",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                },
                                responseSigning: {
                                    hint: "Sign the SAML2 Responses returned after the authentication process.",
                                    label: "Sign SAML responses"
                                },
                                signingAlgorithm: {
                                    label: "Signing algorithm",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                }
                            },
                            heading: "Assertion/Response Signing"
                        },
                        sloProfile: {
                            fields: {
                                enable: {
                                    label: "Enable",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                },
                                logoutMethod: {
                                    label: "Logout method",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                },
                                requestURL: {
                                    label: "Single logout request URL",
                                    placeholder: "Enter single logout request URL",
                                    validations: {
                                        empty: "This is a required field.",
                                        invalid: "This is not a valid URL"
                                    }
                                },
                                responseURL: {
                                    label: "Single logout response URL",
                                    placeholder: "Enter single logout response URL",
                                    validations: {
                                        empty: "This is a required field.",
                                        invalid: "This is not a valid URL"
                                    }
                                }
                            },
                            heading: "Single Logout Profile"
                        },
                        ssoProfile: {
                            fields: {
                                artifactBinding: {
                                    hint: "Artifact resolve request signature will be validated against " +
                                        "the Application certificate.",
                                    label: "Enable signature validation for artifact binding"
                                },
                                bindings: {
                                    hint: "The mechanisms to transport SAML messages.",
                                    label: "Bindings",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                },
                                idpInitiatedSSO: {
                                    label: "Enable idP initiated SSO",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                }
                            },
                            heading: "Single SignOn Profile"
                        }
                    }
                },
                inboundSTS: {
                    fields: {
                        realm: {
                            hint: "Enter realm identifier for passive sts",
                            label: "Realm",
                            placeholder: "Enter realm.",
                            validations: {
                                empty: "This is a required field."
                            }
                        },
                        replyTo: {
                            hint: "Enter RP endpoint URL that handles the response.",
                            label: "Reply URL",
                            placeholder: "Enter Reply URL",
                            validations: {
                                empty: "This is a required field.",
                                invalid: "This is not a valid URL"
                            }
                        }
                    }
                },
                inboundWSTrust: {
                    fields: {
                        audience: {
                            hint: "The trusted relying party's endpoint address.",
                            label: "Audience",
                            placeholder: "Enter audience",
                            validations: {
                                empty: "Enter the audience.",
                                invalid: "This is not a valid URL"
                            }
                        },
                        certificateAlias: {
                            hint: "Public certificate of the trusted relying party.",
                            label: "Certificate alias",
                            placeholder: "Enter audience",
                            validations: {
                                empty: "Select the certificate alias"
                            }
                        }
                    }
                },
                outboundProvisioning: {
                    fields: {
                        blocking: {
                            hint: "Block the authentication flow until the provisioning is completed.",
                            label: "Blocking"
                        },
                        connector: {
                            label: "Provisioning Connector",
                            placeholder: "Select provisioning connector",
                            validations: {
                                empty: "It is mandatory to select a provisioning connector."
                            }
                        },
                        idp: {
                            label: "Identity Provider",
                            placeholder: "Select identity provider",
                            validations: {
                                empty: "It is mandatory to select an IDP."
                            }
                        },
                        jit: {
                            hint: "Provision users to the store authenticated using just-in-time provisioning.",
                            label: "JIT Outbound"
                        },
                        rules: {
                            hint: "Provision users based on the pre-defined XACML rules",
                            label: "Enable Rules"
                        }
                    }
                },
                provisioningConfig: {
                    fields: {
                        proxyMode: {
                            hint: "Users/Groups are not provisioned to the user store. They are only outbound " +
                                "provisioned.",
                            label: "Proxy mode"
                        },
                        userstoreDomain: {
                            hint: "Select userstore domain name to provision users and groups.",
                            label: "Provisioning userstore domain"
                        }
                    }
                }
            },
            helpPanel: {
                tabs: {
                    docs: {
                        content: null,
                        heading: "Docs"
                    },
                    samples: {
                        content: {
                            sample: {
                                goBack: "Go back",
                                hint: "Quickly start prototyping by downloading our preconfigured sample application.",
                                title: "HTML Sample"
                            },
                            sdks: {
                                subTitle: "Following software development kits can be used to jump start your " +
                                    "application development.",
                                title: "Software Development Kits (SDKs)"
                            },
                            technology: {
                                subTitle: "Sample and required SDKs along with useful information will be provided " +
                                    "once you select a technology",
                                title: "Select a technology"
                            }
                        },
                        heading: "Samples"
                    }
                }
            },
            list: {
                actions: {
                    add: "New Application"
                }
            },
            notifications: {
                addApplication: {
                    error: {
                        description: "{{description}}",
                        message: "Creation Error"
                    },
                    genericError: {
                        description: "Failed to create the application",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully created the application.",
                        message: "Creation successful"
                    }
                },
                authenticationStepMin: {
                    genericError: {
                        description: "At least one authentication step is required.",
                        message: "Removal error"
                    }
                },
                deleteApplication: {
                    error: {
                        description: "{{description}}",
                        message: "Removal Error"
                    },
                    genericError: {
                        description: "Failed to delete the application",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully deleted the application.",
                        message: "Removal successful"
                    }
                },
                deleteProtocolConfig: {
                    error: {
                        description: "{{description}}",
                        message: "Removal Error"
                    },
                    genericError: {
                        description: "An error occurred while deleting inbound protocol configurations.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully deleted the {{protocol}} protocol configurations.",
                        message: "Removal successful"
                    }
                },
                duplicateAuthenticationStep: {
                    genericError: {
                        description: "The same authenticator is not allowed to repeated in a single step.",
                        message: "Not allowed"
                    }
                },
                emptyAuthenticationStep: {
                    genericError: {
                        description: "There is an empty authentication step. Please remove it or add authenticators " +
                            "to proceed.",
                        message: "Update error"
                    }
                },
                fetchApplication: {
                    error: {
                        description: "{{description}}",
                        message: "Retrieval error"
                    },
                    genericError: {
                        description: "Couldn't retrieve application details.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully retrieved application details.",
                        message: "Retrieval successful"
                    }
                },
                fetchApplications: {
                    error: {
                        description: "{{description}}",
                        message: "Retrieval error"
                    },
                    genericError: {
                        description: "Couldn't retrieve applications",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully retrieved the applications.",
                        message: "Retrieval successful"
                    }
                },
                fetchCustomInboundProtocols: {
                    error: {
                        description: "{{description}}",
                        message: "Retrieval error"
                    },
                    genericError: {
                        description: "An error occurred retrieving the custom inbound protocols.",
                        message: "Retrieval error"
                    },
                    success: {
                        description: "Successfully retrieved the custom inbound protocols.",
                        message: "Retrieval successful"
                    }
                },
                fetchInboundProtocols: {
                    error: {
                        description: "{{description}}",
                        message: "Retrieval error"
                    },
                    genericError: {
                        description: "An error occurred retrieving the available inbound protocols.",
                        message: "Retrieval error"
                    },
                    success: {
                        description: "Successfully retrieved the inbound protocols.",
                        message: "Retrieval successful"
                    }
                },
                fetchProtocolMeta: {
                    error: {
                        description: "{{description}}",
                        message: "Retrieval error"
                    },
                    genericError: {
                        description: "An error occurred retrieving the protocol metadata.",
                        message: "Retrieval error"
                    },
                    success: {
                        description: "Successfully retrieved the protocol metadata.",
                        message: "Retrieval successful"
                    }
                },
                fetchTemplate: {
                    error: {
                        description: "{{description}}",
                        message: "Retrieval error"
                    },
                    genericError: {
                        description: "An error occurred while retrieving application template data",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully retrieved the application template data.",
                        message: "Retrieval successful"
                    }
                },
                fetchTemplates: {
                    error: {
                        description: "{{description}}",
                        message: "Retrieval error"
                    },
                    genericError: {
                        description: "Couldn't retrieve application templates.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully retrieved the application templates.",
                        message: "Retrieval successful"
                    }
                },
                getInboundProtocolConfig: {
                    error: {
                        description: "{{description}}",
                        message: "Retrieval error"
                    },
                    genericError: {
                        description: "An error occurred retrieving the protocol configurations.",
                        message: "Retrieval error"
                    },
                    success: {
                        description: "Successfully retrieved the inbound protocol configurations.",
                        message: "Retrieval successful"
                    }
                },
                regenerateSecret: {
                    error: {
                        description: "{{description}}",
                        message: "Regenerate error"
                    },
                    genericError: {
                        description: "An error occurred while regenerating the application",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully regenerated the application",
                        message: "Regenerate successful"
                    }
                },
                revokeApplication: {
                    error: {
                        description: "{{description}}",
                        message: "Revoke error"
                    },
                    genericError: {
                        description: "An error occurred while revoking the application",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully revoked the application",
                        message: "Revoke successful"
                    }
                },
                updateAdvancedConfig: {
                    error: {
                        description: "{{description}}",
                        message: "Update error"
                    },
                    genericError: {
                        description: "An error occurred while the advanced configurations.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully updated the advanced configurations.",
                        message: "Update successful"
                    }
                },
                updateApplication: {
                    error: {
                        description: "{{description}}",
                        message: "Update error"
                    },
                    genericError: {
                        description: "Failed to update the applications",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully updated the application.",
                        message: "Update successful"
                    }
                },
                updateAuthenticationFlow: {
                    error: {
                        description: "{{description}}",
                        message: "Update error"
                    },
                    genericError: {
                        description: "An error occurred while updating authentication flow of the application",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully updated the authentication flow of the application",
                        message: "Update successful"
                    }
                },
                updateClaimConfig: {
                    error: {
                        description: "{{description}}",
                        message: "Update error"
                    },
                    genericError: {
                        description: "An error occurred while updating the claim configuration",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully updated the claim configuration",
                        message: "Update successful"
                    }
                },
                updateInboundProtocolConfig: {
                    error: {
                        description: "{{description}}",
                        message: "Update Error"
                    },
                    genericError: {
                        description: "An error occurred while updating inbound protocol configurations.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully updated the inbound protocol configurations.",
                        message: "Update successful"
                    }
                },
                updateInboundProvisioningConfig: {
                    error: {
                        description: "{{description}}",
                        message: "Update Error"
                    },
                    genericError: {
                        description: "An error occurred while the provisioning configurations.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully updated the provisioning configurations.",
                        message: "Update successful"
                    }
                },
                updateOutboundProvisioning: {
                    genericError: {
                        description: "The outbound provisioning IDP already exists.",
                        message: "Update Error"
                    }
                },
                updateProtocol: {
                    error: {
                        description: "{{description}}",
                        message: "Update Error"
                    },
                    genericError: {
                        description: "An error occurred while updating the application",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully added new protocol configurations.",
                        message: "Update successful"
                    }
                }
            },
            placeholders: {
                emptyAttributesList: {
                    action: "Add Attribute",
                    subtitles: "There are no attributes selected to the application at the moment.",
                    title: "No attributes added"
                },
                emptyAuthenticatorStep: {
                    subtitles: {
                        0: "Drag and drop any of the above authenticators",
                        1: "to build an authentication sequence."
                    },
                    title: null
                },
                emptyAuthenticatorsList: {
                    subtitles: "Could not find any {{type}} authenticators",
                    title: null
                },
                emptyList: {
                    action: "New Application",
                    subtitles: {
                        0: "Currently there are no applications available.",
                        1: "You can add a new application easily by following the",
                        2: "steps in the application creation wizard."
                    },
                    title: "Add a new Application"
                },
                emptyOutboundProvisioningIDPs: {
                    action: "New IDP",
                    subtitles: "This Application has no outbound provisioning IDPs configured." +
                        " Add an IDP to view it here.",
                    title: "No outbound provisioning IDPs"
                },
                emptyProtocolList: {
                    action: "New Protocol",
                    subtitles: {
                        0: "There are currently no protocols available.",
                        1: "You can add protocol easily by using the",
                        2: "predefined templates."
                    },
                    title: "Add a protocol"
                }
            },
            templates: {
                manualSetup: {
                    heading: "Manual Setup",
                    subHeading: "Create an application with custom configurations."
                },
                quickSetup: {
                    heading: "Quick Setup",
                    subHeading: "Predefined set of application templates to speed up your application creation."
                }
            }
        },
        certificates: {
            keystore: {
                advancedSearch: {
                    error: "Filter query format incorrect",
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "E.g. alias etc."
                            },
                            filterCondition: {
                                placeholder: "E.g. Starts with etc."
                            },
                            filterValue: {
                                placeholder: "E.g. wso2carbon etc."
                            }
                        }
                    },
                    placeholder: "Search by alias"
                },
                attributes: {
                    alias: "Alias"
                },
                certificateModalHeader: "View Certificate",
                confirmation: {
                    content: "This action is irreversible and will permanently delete the certificate.",
                    header: "Are you sure?",
                    hint: "Please type <1>{{id}}</1> to confirm.",
                    message: "This action is irreversible and will permanently delete the certificate.",
                    primaryAction: "Confirm",
                    tenantContent: "This will delete the tenant certificate permanently."
                        + "Once deleted, unless you import a new tenant certificate,"
                        + "you won't be able to access the portal applications."
                        + "To continue deleting, enter the alias of the certificate and click delete."
                },
                errorCertificate: "An error occurred while decoding the certificate."
                    + " Please ensure the certificate is valid.",
                errorEmpty: "Either add a certificate file or paste the content of a PEM-encoded certificate.",
                forms: {
                    alias: {
                        label: "Alias",
                        placeholder: "Enter an alias",
                        requiredErrorMessage: "Alias is required"
                    }
                },
                notifications: {
                    addCertificate:{
                        genericError: {
                            description: "An error occurred while importing the certificate.",
                            message: "Something went wrong!"
                        },
                        success: {
                            description: "The certificate has been imported successfully.",
                            message: "Certificate import success"
                        }
                    },
                    deleteCertificate: {
                        genericError: {
                            description: "There was an error while deleting the certificate",
                            message: "Something went wrong!"
                        },
                        success: {
                            description: "The certificate has been successfully deleted.",
                            message: "Certificate deleted successfully"
                        }
                    },
                    download: {
                        success: {
                            description: "The certificate has started downloading.",
                            message: "Certificate download started"
                        }
                    },
                    getAlias: {
                        genericError: {
                            description: "An error occurred while fetching the certificate.",
                            message: "Something went wrong"
                        }
                    },
                    getCertificate: {
                        genericError: {
                            description: "There was an error while fetching "
                                + "the certificate",
                            message: "Something went wrong!"
                        }
                    },
                    getCertificates: {
                        genericError: {
                            description: "An error occurred while fetching certificates",
                            message: "Something went wrong"
                        }
                    },
                    getPublicCertificate: {
                        genericError: {
                            description: "There was an error while fetching the tenant certificate.",
                            message: "Something went wrong!"
                        }
                    }
                },
                pageLayout: {
                    description: "Create and manage certificates in the keystore",
                    primaryAction: "Import Certificate",
                    title: "Certificates"
                },
                placeholders: {
                    emptyList: {
                        action: "Import Certificate",
                        subtitle: "There are currently no certificates available."
                            + "You can import a new certificate by clicking on"
                            + "the button below.",
                        title: "Import Certificate"
                    },
                    emptySearch: {
                        action: "Clear search query",
                        subtitle: "We couldn't find any results for {{searchQuery}},"
                            + "Please try a different search term.",
                        title: "No results found"
                    }
                },
                summary: {
                    issuerDN: "Issuer DN",
                    sn: "Serial Number:",
                    subjectDN: "Subject DN",
                    validFrom: "Not valid before",
                    validTill: "Not valid after",
                    version: "Version"
                },
                wizard: {
                    dropZone: {
                        action: "Upload Certificate",
                        description: "Drag and drop a certificate file here"
                    },
                    header: "Import Certificate",
                    panes: {
                        paste: "Paste",
                        upload: "Upload"
                    },
                    pastePlaceholder: "Paste the content of a PEM certificate",
                    steps: {
                        summary: "Summary",
                        upload: "Upload certificate"
                    }
                }
            },
            truststore: {
                advancedSearch: {
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "E.g. alias, certificate etc."
                            },
                            filterCondition: {
                                placeholder: "E.g. Starts with etc."
                            },
                            filterValue: {
                                placeholder: "E.g. wso2carbon etc."
                            }
                        }
                    },
                    placeholder: "Search by group name"
                }
            }
        },
        claims: {
            dialects: {
                advancedSearch: {
                    error: "Filter query format incorrect",
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "E.g. Dialect URI etc."
                            },
                            filterCondition: {
                                placeholder: "E.g. Starts with etc."
                            },
                            filterValue: {
                                placeholder: "E.g. http://wso2.org/oidc/claim"
                            }
                        }
                    },
                    placeholder: "Search by Dialect URI"
                },
                attributes: {
                    dialectURI: "Dialect URI"
                },
                confirmations: {
                    action: "Confirm",
                    content: "If you delete this external dialect, all the associated external attributes will "
                        + "also be deleted.Please proceed with caution.",
                    header: "Are you sure?",
                    hint: "Please type <1>{{confirm}}</1> to confirm.",
                    message: "This action is irreversible and will permanently delete the selected external dialect."
                },
                dangerZone: {
                    actionTitle: "Delete External Dialect",
                    header: "Delete External Dialect",
                    subheader: "Once you delete an external dialect, there is no going back. " + "Please be certain."
                },
                forms: {
                    dialectURI: {
                        label: "Dialect URI",
                        placeholder: "Enter a dialect URI",
                        requiredErrorMessage: "Enter a dialect URI"
                    },
                    submit: "Update"
                },
                localDialect: "Local Dialect",
                notifications: {
                    addDialect: {
                        error: {
                            description: "An error occurred while adding the external dialect",
                            message: "Something went wrong"
                        },
                        genericError: {
                            description: "The external dialect has been added but not all external "
                                + "attributes were added successfully",
                            message: "External attributes couldn't be added"
                        },
                        success: {
                            description: "The external dialect has been added successfully",
                            message: "External Dialect added successfully"
                        }
                    },
                    deleteDialect: {
                        genericError: {
                            description: "There was an error while deleting the dialect",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The dialect has been deleted successfully!",
                            message: "Dialect deleted successfully"
                        }
                    },
                    fetchADialect: {
                        genericError: {
                            description: "There was an error while fetching the external dialect",
                            message: "Something went wrong"
                        }
                    },
                    fetchDialects: {
                        error: {
                            description: "{{description}}",
                            message: "Retrieval error"
                        },
                        genericError: {
                            description: "Couldn't retrieve claim dialects.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully retrieved claim dialects.",
                            message: "Retrieval successful"
                        }
                    },
                    fetchExternalClaims: {
                        genericError: {
                            description: "There was an error while fetching the external attributes",
                            message: "Something went wrong"
                        }
                    },
                    updateDialect: {
                        genericError: {
                            description: "An error occurred while updating the dialect",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The dialect has been successfully updated.",
                            message: "Dialect update successful"
                        }
                    }
                },
                pageLayout: {
                    edit: {
                        back: "Go back to attribute dialects",
                        description: "Edit external dialect and its attributes",
                        updateDialectURI: "Update Dialect URI",
                        updateExternalAttributes: "Update External Attributes"
                    },
                    list: {
                        description: "Create and manage attribute dialects",
                        primaryAction: "New External Dialect",
                        title: "Attribute Dialects",
                        view: "View local claims"
                    }
                },
                wizard: {
                    header: "Add External Dialect",
                    steps: {
                        dialectURI: "Dialect URI",
                        externalAttribute: "External attributes",
                        summary: "Summary"
                    },
                    summary: {
                        externalAttribute: "External Attribute URI",
                        mappedAttribute: "Mapped Local Attribute URI",
                        notFound: "No external attribute was added."
                    }
                }
            },
            external: {
                advancedSearch: {
                    error: "Filter query format incorrect",
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "E.g. Attribute URI etc."
                            },
                            filterCondition: {
                                placeholder: "E.g. Starts with etc."
                            },
                            filterValue: {
                                placeholder: "E.g. http://axschema.org/namePerson/last"
                            }
                        }
                    },
                    placeholder: "Search by Attribute URI"
                },
                attributes: {
                    attributeURI: "Attribute URI",
                    mappedClaim: "Mapped Local Attribute URI"
                },
                forms: {
                    attributeURI: {
                        label: "Attribute URI",
                        placeholder: "Enter an attribute URI",
                        requiredErrorMessage: "Attribute URI is required"
                    },
                    localAttribute: {
                        label: "Local attribute URI to map to",
                        placeholder: "Select a Local Attribute",
                        requiredErrorMessage: "Select a local attribute to map to"
                    },
                    submit: "Add External Attribute"
                },
                notifications: {
                    addExternalAttribute: {
                        genericError: {
                            description: "An error occurred while adding the external attribute.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The external attribute has been added to the dialect successfully!",
                            message: "External attribute added successfully"
                        }
                    },
                    deleteExternalClaim: {
                        genericError: {
                            description: "There was an error while deleting the external attribute",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The external attribute has been deleted successfully!",
                            message: "External attribute deleted successfully"
                        }
                    },
                    fetchExternalClaims: {
                        error: {
                            description: "{{description}}",
                            message: "Retrieval error"
                        },
                        genericError: {
                            description: "Couldn't retrieve external claims.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully retrieved external claims.",
                            message: "Retrieval successful"
                        }
                    },
                    getExternalAttribute: {
                        genericError: {
                            description: "There was an error while fetching the external attribute",
                            message: "Something went wrong"
                        }
                    },
                    updateExternalAttribute: {
                        genericError: {
                            description: "There was an error while updating the" + " external attribute",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The external attribute has been updated successfully!",
                            message: "External attribute updated successfully"
                        }
                    }
                },
                pageLayout: {
                    edit: {
                        header: "Add External Attribute",
                        primaryAction: "New External Attribute"
                    }
                },
                placeholders: {
                    empty: {
                        subtitle: "Currently, there are no external attributes available for "
                            + "this dialect.",
                        title: "No External Attributes"
                    }
                }
            },
            list: {
                confirmation: {
                    action: "confirm",
                    content: "{{message}} Please proceed with caution.",
                    dialect: {
                        message: "If you delete this external dialect, all the"
                            + " associated external attributes will also be deleted.",
                        name: "external dialect"
                    },
                    external: {
                        message: "This will permanently delete the external attribute.",
                        name: "external attribute"
                    },
                    header: "Are you sure?",
                    hint: "Please type <1>{{assertion}}</1> to confirm.",
                    local: {
                        message: "If you delete this local attribute, the user data belonging "
                            + "to this attribute will also be deleted.",
                        name: "local attribute"
                    },
                    message: "This action is irreversible and will permanently delete the selected {{name}}."
                },
                placeholders: {
                    emptyList: {
                        action: {
                            dialect: "New External Attribute",
                            external: "New External Attribute",
                            local: "New Local Attribute"
                        },
                        subtitle: "There are currently no results available."
                            + "You can add a new item easily by following the" + "steps in the creation wizard.",
                        title: {
                            dialect: "Add an External Dialect",
                            external: "Add an External Attribute",
                            local: "Add a Local Attribute"
                        }
                    },
                    emptySearch: {
                        action: "Clear search query",
                        subtitle: "We couldn't find any results for {{searchQuery}}."
                            + "Please try a different search term.",
                        title: "No results found"
                    }
                },
                warning: "This attribute has not been mapped to an attribute" +
                    " in the following userstores:"
            },
            local: {
                additionalProperties: {
                    hint: "Use when writing an extension using current attributes",
                    key: "Name",
                    keyRequiredErrorMessage: "Enter a name",
                    value: "Value",
                    valueRequiredErrorMessage: "Enter a value"
                },
                advancedSearch: {
                    error: "Filter query format incorrect",
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "E.g. name, attribute URI etc."
                            },
                            filterCondition: {
                                placeholder: "E.g. Starts with etc."
                            },
                            filterValue: {
                                placeholder: "E.g. address, gender etc."
                            }
                        }
                    },
                    placeholder: "Search by name"
                },
                attributes: {
                    attributeURI: "Attribute URI"
                },
                confirmation: {
                    content: "If you delete this local attribute, the user data belonging to this attribute "
                        + "will also be deleted. Please proceed with caution.",
                    header: "Are you sure?",
                    hint: "Please type <1>{{name}}</1> to confirm.",
                    message: "This action is irreversible and will permanently delete the selected local attribute.",
                    primaryAction: "Confirm"
                },
                dangerZone: {
                    actionTitle: "Delete Local Attribute",
                    header: "Delete Local Attribute",
                    subheader: "Once you delete a local attribute, there is no going back. "
                        + "Please be certain."
                },
                forms: {
                    attribute: {
                        placeholder: "Enter an attribute to map to",
                        requiredErrorMessage: "Attribute name is a required field"
                    },
                    attributeHint: "A unique ID for the attribute."
                        + " The ID will be appended to the dialect URI to create a attribute URI",
                    attributeID: {
                        label: "Attribute ID",
                        placeholder: "Enter an attribute ID",
                        requiredErrorMessage: "Attribute ID is required"
                    },
                    description: {
                        label: "Description",
                        placeholder: "Enter a description",
                        requiredErrorMessage: "Description is required"
                    },
                    displayOrder: {
                        label: "Display Order",
                        placeholder: "Enter the display order"
                    },
                    displayOrderHint: "This determines the position at which this attribute is "
                        + "displayed in the user profile and the user registration page",
                    name: {
                        label: "Name",
                        placeholder: "Enter a name for the attribute",
                        requiredErrorMessage: "Name is required"
                    },
                    nameHint: "Name of the attribute that will be shown on the user profile "
                        + "and user registration page",
                    readOnly: {
                        label: "Make this attribute read-only"
                    },
                    regEx: {
                        label: "Regular expression",
                        placeholder: "Enter a regular expression"
                    },
                    regExHint: "This regular expression is used to validate the value this attribute can take",
                    required: {
                        label: "Make this attribute required during user registration"
                    },
                    supportedByDefault: {
                        label: "Show this attribute on user profile and user registration page"
                    }
                },
                mappedAttributes: {
                    hint: "Enter the attribute from each userstore that you want to map to this attribute."
                },
                notifications: {
                    addLocalClaim: {
                        genericError: {
                            description: "There was an error while adding the local attribute",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The local attribute has been added successfully!",
                            message: "Local attribute added successfully"
                        }
                    },
                    deleteClaim: {
                        genericError: {
                            description: "There was an error while deleting the local attribute",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The local claim has been deleted successfully!",
                            message: "Local attribute deleted successfully"
                        }
                    },
                    fetchLocalClaims: {
                        error: {
                            description: "{{description}}",
                            message: "Retrieval error"
                        },
                        genericError: {
                            description: "Couldn't retrieve local claims.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully retrieved local claims.",
                            message: "Retrieval successful"
                        }
                    },
                    getAClaim: {
                        genericError: {
                            description: "There was an error while fetching the local attribute",
                            message: "Something went wrong"
                        }
                    },
                    getClaims: {
                        genericError: {
                            description: "There was an error while fetching the local attributes",
                            message: "Something went wrong"
                        }
                    },
                    getLocalDialect: {
                        genericError: {
                            description: "There was an error while fetching the local dialect",
                            message: "Something went wrong"
                        }
                    },
                    updateClaim: {
                        genericError: {
                            description: "There was an error while updating the" + " local attribute",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "This local attribute has been "
                                + "updated successfully!",
                            message: "Local attribute updated successfully"
                        }
                    }
                },
                pageLayout: {
                    edit: {
                        back: "Go back to Local Attributes",
                        description: "Edit local attribute",
                        tabs: {
                            additionalProperties: "Additional Properties",
                            general: "General",
                            mappedAttributes: "Mapped Attributes"
                        }
                    },
                    local: {
                        action: "New Local Attribute",
                        back: "Go back to attribute dialects",
                        description: "Create and manage local attributes",
                        title: "Local Attributes"
                    }
                },
                wizard: {
                    header: "Add Local Attribute",
                    steps: {
                        general: "General",
                        mapAttributes: "Map Attributes",
                        summary: "Summary"
                    },
                    summary: {
                        attribute: "Attribute",
                        attributeURI: "Attribute URI",
                        displayOrder: "Display Order",
                        readOnly: "This attribute is read-only",
                        regEx: "Regular Expression",
                        required: "This attribute is required during user registration",
                        supportedByDefault: "This attribute is shown on user profile and user registration page",
                        userstore: "Userstore"
                    }
                }
            }
        },
        emailLocale: {
            buttons: {
                addLocaleTemplate: "Add Locale Template",
                saveChanges: "Save Changes"
            },
            forms: {
                addLocale: {
                    fields: {
                        bodyEditor: {
                            label: "Body"
                        },
                        locale: {
                            label: "Locale",
                            placeholder: "Select Locale",
                            validations: {
                                empty: "Select locale"
                            }
                        },
                        signatureEditor: {
                            label: "Mail signature"
                        },
                        subject: {
                            label: "Subject",
                            placeholder: "Enter your email subject",
                            validations: {
                                empty: "Email Subject is required"
                            }
                        }
                    }
                }
            }
        },
        emailTemplateTypes: {
            buttons: {
                createTemplateType: "Create Template Type",
                deleteTemplate: "Delete Template",
                editTemplate: "Edit Template",
                newType: "New Template Type"
            },
            confirmations: {
                deleteTemplateType: {
                    assertionHint: "Please type <1>{{ id }}</1> to confirm.",
                    content: "If you delete this email template type, all associated work flows will no longer " +
                        "have a valid email template to work with and this will delete all the locale templates " +
                        "associated with this template type. Please proceed cautiously.",
                    header: "Are you sure?",
                    message: "This action is irreversible and will permanently delete the selected email template " +
                        "type."
                }
            },
            forms: {
                addTemplateType: {
                    fields: {
                        type: {
                            label: "Template Type Name",
                            placeholder: "Enter a template type name",
                            validations: {
                                empty: "Template type name is required to proceed."
                            }
                        }
                    }
                }
            },
            notifications: {
                createTemplateType: {
                    error: {
                        description: "{{description}}",
                        message: "Error creating email template type."
                    },
                    genericError: {
                        description: "Couldn't create email template type.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully created the email template type.",
                        message: "Creating email template type is successful"
                    }
                },
                deleteTemplateType: {
                    error: {
                        description: "{{description}}",
                        message: "Error deleting email template type."
                    },
                    genericError: {
                        description: "Couldn't delete email template type.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully deleted the email template type.",
                        message: "Email template type delete successful"
                    }
                },
                updateTemplateType: {
                    error: {
                        description: "{{description}}",
                        message: "Error updating email template type."
                    },
                    genericError: {
                        description: "Couldn't update email template type.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully updated the email template type.",
                        message: "Email template type update successful"
                    }
                }
            },
            placeholders: {
                emptyList: {
                    action: "New Template Type",
                    subtitles: {
                        0: "Currently there are no templates types available.",
                        2: "You can add a new template type by ",
                        3: "clicking on the button below."
                    },
                    title: "Add new Template Type"
                }
            },
            wizards: {
                addTemplateType: {
                    heading: "Create Email Template Type",
                    steps: {
                        templateType: {
                            heading: "Template Type"
                        }
                    },
                    subHeading: "Create a new template type to associate with email requirements."
                }
            }
        },
        emailTemplates: {
            buttons: {
                deleteTemplate: "Delete Template",
                editTemplate: "Edit Template",
                newTemplate: "New Template",
                viewTemplate: "View Template"
            },
            confirmations: {
                deleteTemplate: {
                    assertionHint: "Please type <1>{{ id }}</1> to confirm.",
                    content: "If you delete this email template, all associated work flows will no longer " +
                        "have a valid email template to work with. Please proceed cautiously.",
                    header: "Are you sure?",
                    message: "This action is irreversible and will permanently delete the selected email template."
                }
            },
            editor: {
                tabs: {
                    code: {
                        tabName: "HTML Code"
                    },
                    preview: {
                        tabName: "Preview"
                    }
                }
            },
            notifications: {
                createTemplate: {
                    error: {
                        description: "{{description}}",
                        message: "Error creating email template."
                    },
                    genericError: {
                        description: "Couldn't create email template.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully created the email template.",
                        message: "Creating email template is successful"
                    }
                },
                deleteTemplate: {
                    error: {
                        description: "{{description}}",
                        message: "Error deleting email template."
                    },
                    genericError: {
                        description: "Couldn't delete email template.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully deleted the email template .",
                        message: "Email template delete successful"
                    }
                },
                iframeUnsupported: {
                    genericError: {
                        description: "Your browser does not support iframes.",
                        message: "Unsupported"
                    }
                },
                updateTemplate: {
                    error: {
                        description: "{{description}}",
                        message: "Error updating email template."
                    },
                    genericError: {
                        description: "Couldn't update email template.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully updated the email template.",
                        message: "Email template update successful"
                    }
                }
            },
            placeholders: {
                emptyList: {
                    action: "New Template",
                    subtitles: {
                        0: "Currently there are no templates available for the selected",
                        1: "email template type. You can add a new template by ",
                        2: "clicking on the button below."
                    },
                    title: "Add Template"
                }
            },
            viewTemplate: {
                heading: "Email Template Preview"
            }
        },
        footer: {
            copyright: "WSO2 Identity Server © {{year}}"
        },
        groups: {
            advancedSearch: {
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: "E.g. group name."
                        },
                        filterCondition: {
                            placeholder: "E.g. Starts with etc."
                        },
                        filterValue: {
                            placeholder: "Enter value to search"
                        }
                    }
                },
                placeholder: "Search by group name"
            },
            edit: {
                basics: {
                    fields: {
                        groupName: {
                            name: "Group Name",
                            placeholder: "Enter your group name",
                            required: "Group name is required"
                        }
                    }
                }
            },
            list: {
                storeOptions: "Select User Store"
            },
            notifications: {
                createGroup: {
                    error: {
                        description: "{{description}}",
                        message: "Error occurred while creating the group."
                    },
                    genericError: {
                        description: "Couldn't create the group.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The group was created successfully.",
                        message: "Group created successfully."
                    }
                },
                createPermission: {
                    error: {
                        description: "{{description}}",
                        message: "Error occurred while adding permission to group."
                    },
                    genericError: {
                        description: "Couldn't add permissions to group.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Permissions were successfully added to the group.",
                        message: "Group created successfully."
                    }
                },
                deleteGroup: {
                    error: {
                        description: "{{description}}",
                        message: "Error deleting the selected group."
                    },
                    genericError: {
                        description: "Couldn't remove the selected group.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The selected group was deleted successfully.",
                        message: "Group deleted successfully"
                    }
                },
                updateGroup: {
                    error: {
                        description: "{{description}}",
                        message: "Error updating the selected group."
                    },
                    genericError: {
                        description: "Couldn't update the selected group.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The selected group was updated successfully.",
                        message: "Group updated successfully"
                    }
                }
            }
        },
        helpPanel: {
            notifications: {
                pin: {
                    success: {
                        description: "Help panel will always appear {{state}} unless you change explicitly.",
                        message: "Help panel {{state}}"
                    }
                }
            }
        },
        idp: {
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
                            placeholder: "E.g. Google, Github etc."
                        }
                    }
                },
                placeholder: "Search by IDP name"
            },
            buttons: {
                addAttribute: "Add Attribute",
                addAuthenticator: "New Authenticator",
                addCertificate: "New Certificate",
                addConnector: "New Connector",
                addIDP: "New Identity Provider"
            },
            confirmations: {
                deleteAuthenticator: {
                    assertionHint: "Please type <1>{{ name }}</1> to confirm.",
                    content: "If you delete this authenticator, you will not be able to get it back. All the " +
                        "applications depending on this also might stop working. Please proceed with caution.",
                    header: "Are you sure?",
                    message: "This action is irreversible and will permanently delete the authenticator."
                },
                deleteConnector: {
                    assertionHint: "Please type <1>{{ name }}</1> to confirm.",
                    content: "If you delete this connector, you will not be able to get it back. Please " +
                        "proceed with caution.",
                    header: "Are you sure?",
                    message: "This action is irreversible and will permanently delete the connector."
                },
                deleteIDP: {
                    assertionHint: "Please type <1>{{ name }}</1> to confirm.",
                    content: "If you delete this identity provider, you will not be able to get it back. All the " +
                        "applications depending on this also might stop working. Please proceed with caution.",
                    header: "Are you sure?",
                    message: "This action is irreversible and will permanently delete the IDP."
                }
            },
            dangerZoneGroup: {
                deleteIDP: {
                    actionTitle: "Delete Identity Provider",
                    header: "Delete identity provider",
                    subheader: "Once you delete an identity provider, there is no going back." +
                        " Please be certain."
                },
                disableIDP: {
                    actionTitle: "Enable Identity Provider",
                    header: "Enable identity provider",
                    subheader: "Once you disable an identity provider, it can no longer be used until " +
                        "you enable it again. Please be certain."
                },
                header: "Danger Zone"
            },
            forms: {
                advancedConfigs: {
                    alias: {
                        hint: "If the resident identity provider is known by an alias at the federated identity " +
                            "provider, specify it here.",
                        label: "Alias"
                    },
                    certificateType: {
                        certificateJWKS: {
                            label: "Use JWKS endpoint",
                            placeholder: "Value should be the certificate in JWKS format.",
                            validations: {
                                empty: "Certificate value is required"
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
                        label: "Home Realm Identifier"
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
                        attributeMapColumnHeader: "Identity provider attribute",
                        attributeMapInputPlaceholderPrefix: "eg: IdP's attribute for ",
                        componentHeading: "Attributes Mapping",
                        hint: "Add attributes supported by Identity Provider"
                    },
                    attributeProvisioning: {
                        attributeColumnHeader: {
                            0: "Attribute",
                            1: "Identity provider attribute"
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
                common: {
                    invalidQueryParamErrorMessage: "These are not valid query parameters",
                    invalidURLErrorMessage: "This is not a valid URL",
                    requiredErrorMessage: "This is required"
                },
                generalDetails: {
                    description: {
                        hint: "A meaningful description about the identity provider.",
                        label: "Description",
                        placeholder: "This is a sample IDP."
                    },
                    image: {
                        hint: "A URL to query the image of the identity provider.",
                        label: "Identity Provider Image URL",
                        placeholder: "https://example.com/image01"
                    },
                    name: {
                        hint: "Enter a unique name for this identity provider.",
                        label: "Identity Provider Name",
                        validations: {
                            duplicate: "An identity provider already exists with this name",
                            empty: "Identity Provider name is required"
                        }
                    }
                },
                jitProvisioning: {
                    enableJITProvisioning: {
                        hint: "Specifies if users federated from this identity provider " +
                            "needs to be provisioned locally.",
                        label: "Enable Just-in-time Provisioning"
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
                    default: "Make default",
                    enable: "Enabled"
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
                    role: {
                        heading: "Role",
                        hint: "Specifies the attribute that identifies the roles at the Identity Provider",
                        label: "Role Attribute",
                        placeHolder: "Select Attribute",
                        validation: {
                            empty: "Please select an attribute for role"
                        }
                    },
                    subject: {
                        heading: "Subject",
                        hint: "Specifies the attribute that identifies the user at the identity provider",
                        label: "Subject Attribute",
                        placeHolder: "Select Attribute",
                        validation: {
                            empty: "Please select an attribute for subject"
                        }
                    }
                }
            },
            modals: {
                addAuthenticator: {
                    subTitle: "Add new authenticator to the identity provider: {{ idpName }}",
                    title: "Add New Authenticator"
                },
                addCertificate: {
                    subTitle: "Add new certificate to the identity provider: {{ idpName }}",
                    title: "Add New Certificate"
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
                        description: "An error occurred while creating the identity provider.",
                        message: "Create error"
                    },
                    success: {
                        description: "Successfully created the identity provider.",
                        message: "Create successful"
                    }
                },
                changeCertType: {
                    jwks: {
                        description: "Please note that if you have added a certificate it'll be overridden by the " +
                            "the JWKS endpoint.",
                        message: "Warning!"
                    },
                    pem: {
                        description: "Please note that if you have added a JWKS endpoint it'll be overridden by the " +
                            "certificate.",
                        message: "Warning!"
                    }
                },
                deleteIDP: {
                    error: {
                        description: "{{ description }}",
                        message: "Identity Provider Delete Error"
                    },
                    genericError: {
                        description: "An error occurred while deleting the identity provider",
                        message: "Identity Provider Delete Error"
                    },
                    success: {
                        description: "Successfully deleted the identity provider",
                        message: "Delete successful"
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
                        description: "An error occurred while retrieving local claims.",
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
                getIDP: {
                    error: {
                        description: "{{ description }}",
                        message: "Retrieval Error"
                    },
                    genericError: {
                        description: "An error occurred while retrieving identity provider details",
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
                        description: "An error occurred while retrieving identity providers",
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
                        description: "An error occurred while retrieving identity provider template list",
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
                        description: "An error occurred while retrieving roles",
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
                updateIDP: {
                    error: {
                        description: "{{ description }}",
                        message: "Update error"
                    },
                    genericError: {
                        description: "An error occurred while updating the identity provider.",
                        message: "Update Error"
                    },
                    success: {
                        description: "Successfully updated the identity provider.",
                        message: "Update successful"
                    }
                },
                updateIDPCertificate: {
                    error: {
                        description: "{{ description }}",
                        message: "Update error"
                    },
                    genericError: {
                        description: "An error occurred while updating the identity provider certificate.",
                        message: "Update Error"
                    },
                    success: {
                        description: "Successfully updated the identity provider certificate.",
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
                emptyConnectorList: {
                    subtitles: {
                        0: "This IDP has no outbound provisioning connectors configured.",
                        1: "Add a connector to view it here."
                    },
                    title: "No outbound provisioning connectors"
                },
                emptyIDPList: {
                    subtitles: {
                        0: "Currently there are no identity providers available.",
                        1: "You can add a new identity provider easily by following the",
                        2: "steps in the identity providers creation wizard."
                    },
                    title: "Add a new Identity Provider"
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
            templates: {
                manualSetup: {
                    heading: "Manual Setup",
                    subHeading: "Create an identity provider with custom configurations."
                },
                quickSetup: {
                    heading: "Quick Setup",
                    subHeading: "Predefined set of templates to speed up your identity provider creation."
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
                        summary: {
                            title: "Summary"
                        }
                    }
                },
                addIDP: {
                    header: "Fill the basic information about the identity provider.",
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
        },
        overview: {
            widgets: {
                insights: {
                    applications: {
                        heading: "Applications",
                        subHeading: "Overview of applications"
                    },
                    idp: {
                        heading: "Identity Providers",
                        subHeading: "Overview of Identity Providers"
                    }
                },
                overview: {
                    cards: {
                        applications: {
                            heading: "Applications"
                        },
                        idp: {
                            heading: "Identity Providers"
                        },
                        userstores: {
                            heading: "Userstores"
                        }
                    },
                    heading: "Overview",
                    subHeading: "Basic set of stats to understand the status of the instance."
                },
                quickLinks: {
                    cards: {
                        certificates: {
                            heading: "Certificates",
                            subHeading: "Manage certificates in the keystore."
                        },
                        dialects: {
                            heading: "Attribute Dialects",
                            subHeading: "Manage attribute dialects."
                        },
                        emailTemplates: {
                            heading: "Email Templates",
                            subHeading: "Manage email templates."
                        },
                        generalConfigs: {
                            heading: "General Configurations",
                            subHeading: "Manage configurations, policies, etc."
                        },
                        groups: {
                            heading: "Groups",
                            subHeading: "Manage user groups and permissions."
                        },
                        roles: {
                            heading: "Roles",
                            subHeading: "Manage user roles and permissions."
                        }
                    },
                    heading: "Quick Links",
                    subHeading: "Links to quickly navigate to features."
                }
            }
        },
        privacy: {
            about: {
                description: "WSO2 Identity Server (referred to as “WSO2 IS” within this policy) is an open source " +
                    "Identity Management and Entitlement Server that is based on open standards and specifications.",
                heading: "About WSO2 Identity Server"
            },
            privacyPolicy: {
                collectionOfPersonalInfo: {
                    description: {
                        list1: {
                            0: "WSO2 IS uses your IP address to detect any suspicious login attempts to your account.",
                            1: "WSO2 IS uses attributes like your first name, last name, etc., to provide a rich and" +
                                " personalized user experience.",
                            2: "WSO2 IS uses your security questions and answers only to allow account recovery."
                        },
                        para1: "WSO2 IS collects your information only to serve your access requirements. For example:"
                    },
                    heading: "Collection of personal information",
                    trackingTechnologies: {
                        description: {
                            list1: {
                                0: "Collecting information from the user profile page where you enter your personal" +
                                    " data.",
                                1: "Tracking your IP address with HTTP request, HTTP headers, and TCP/IP.",
                                2: "Tracking your geographic information with the IP address.",
                                3: "Tracking your login history with browser cookies. Please see our" +
                                    " {{cookiePolicyLink}} for more information."
                            },
                            para1: "WSO2 IS collects your information by:"
                        },
                        heading: "Tracking Technologies"
                    }
                },
                description: {
                    para1: "This policy describes how WSO2 IS captures your personal information, the purposes of" +
                        " collection, and information about the retention of your personal information.",
                    para2: "Please note that this policy is for reference only, and is applicable for the software " +
                        "as a product. WSO2 Inc. and its developers have no access to the information held within " +
                        "WSO2 IS. Please see the <1>disclaimer</1> section for more information.",
                    para3: "Entities, organizations or individuals controlling the use and administration of WSO2 IS " +
                        "should create their own privacy policies setting out the manner in which data is controlled " +
                        "or processed by the respective entity, organization or individual."
                },
                disclaimer: {
                    description: {
                        list1: {
                            0: "WSO2, its employees, partners, and affiliates do not have access to and do not " +
                                "require, store, process or control any of the data, including personal data " +
                                "contained in WSO2 IS. All data, including personal data is controlled and " +
                                "processed by the entity or individual running WSO2 IS. WSO2, its employees partners " +
                                "and affiliates are not a data processor or a data controller within the meaning of " +
                                "any data privacy regulations. WSO2 does not provide any warranties or undertake any " +
                                "responsibility or liability in connection with the lawfulness or the manner and " +
                                "purposes for which WSO2 IS is used by such entities or persons.",
                            1: "This privacy policy is for the informational purposes of the entity or persons " +
                                "running WSO2 IS and sets out the processes and functionality contained within " +
                                "WSO2 IS regarding personal data protection. It is the responsibility of entities " +
                                "and persons running WSO2 IS to create and administer its own rules and processes " +
                                "governing users' personal data, and such rules and processes may change the use, " +
                                "storage and disclosure policies contained herein. Therefore users should consult " +
                                "the entity or persons running WSO2 IS for its own privacy policy for details " +
                                "governing users' personal data."
                        }
                    },
                    heading: "Disclaimer"
                },
                disclosureOfPersonalInfo: {
                    description: "WSO2 IS only discloses personal information to the relevant applications (also " +
                        "known as Service Provider) that are registered with WSO2 IS. These applications are " +
                        "registered by the identity administrator of your entity or organization. Personal " +
                        "information is disclosed only for the purposes for which it was collected (or for a " +
                        "use identified as consistent with that purpose), as controlled by such Service Providers, " +
                        "unless you have consented otherwise or where it is required by law.",
                    heading: "Disclosure of personal information",
                    legalProcess: {
                        description: "Please note that the organization, entity or individual running WSO2 IS may " +
                            "be compelled to disclose your personal information with or without your consent when " +
                            "it is required by law following due and lawful process.",
                        heading: "Legal process"
                    }
                },
                heading: "Privacy Policy",
                moreInfo: {
                    changesToPolicy: {
                        description: {
                            para1: "Upgraded versions of WSO2 IS may contain changes to this policy and " +
                                "revisions to this policy will be packaged within such upgrades. Such changes " +
                                "would only apply to users who choose to use upgraded versions.",
                            para2: "The organization running WSO2 IS may revise the Privacy Policy from time to " +
                                "time. You can find the most recent governing policy with the respective link " +
                                "provided by the organization running WSO2 IS. The organization will notify " +
                                "any changes to the privacy policy over our official public channels."
                        },
                        heading: "Changes to this policy"
                    },
                    contactUs: {
                        description: {
                            para1: "Please contact WSO2 if you have any question or concerns regarding this privacy " +
                                "policy."
                        },
                        heading: "Contact us"
                    },
                    heading: "More information",
                    yourChoices: {
                        description: {
                            para1: "If you are already have a user account within WSO2 IS, you have the right to " +
                                "deactivate your account if you find that this privacy policy is unacceptable to you.",
                            para2: "If you do not have an account and you do not agree with our privacy policy, " +
                                "you can choose not to create one."
                        },
                        heading: "Your choices"
                    }
                },
                storageOfPersonalInfo: {
                    heading: "Storage of personal information",
                    howLong: {
                        description: {
                            list1: {
                                0: "Current password",
                                1: "Previously used passwords"
                            },
                            para1: "WSO2 IS retains your personal data as long as you are an active user of our " +
                                "system. You can update your personal data at any time using the given self-care " +
                                "user portals.",
                            para2: "WSO2 IS may keep hashed secrets to provide you with an added level of security. " +
                                "This includes:"
                        },
                        heading: "How long your personal information is retained"
                    },
                    requestRemoval: {
                        description: {
                            para1: "You can request the administrator to delete your account. The administrator is " +
                                "the administrator of the tenant you are registered under, or the " +
                                "super-administrator if you do not use the tenant feature.",
                            para2: "Additionally, you can request to anonymize all traces of your activities " +
                                "that WSO2 IS may have retained in logs, databases or analytical storage."
                        },
                        heading: "How to request removal of your personal information"
                    },
                    where: {
                        description: {
                            para1: "WSO2 IS stores your personal information in secured databases. WSO2 IS " +
                                "exercises proper industry accepted security measures to protect the database " +
                                "where your personal information is held. WSO2 IS as a product does not transfer " +
                                "or share your data with any third parties or locations.",
                            para2: "WSO2 IS may use encryption to keep your personal data with an added level " +
                                "of security."
                        },
                        heading: "Where your personal information is stored"
                    }
                },
                useOfPersonalInfo: {
                    description: {
                        list1: {
                            0: "To provide you with a personalized user experience. WSO2 IS uses your name and " +
                                "uploaded profile pictures for this purpose.",
                            1: "To protect your account from unauthorized access or potential hacking attempts. " +
                                "WSO2 IS uses HTTP or TCP/IP Headers for this purpose.",
                            2: "Derive statistical data for analytical purposes on system performance improvements. " +
                                "WSO2 IS will not keep any personal information after statistical calculations. " +
                                "Therefore, the statistical report has no means of identifying an individual person."
                        },
                        para1: "WSO2 IS will only use your personal information for the purposes for which it was " +
                            "collected (or for a use identified as consistent with that purpose).",
                        para2: "WSO2 IS uses your personal information only for the following purposes.",
                        subList1: {
                            heading: "This includes:",
                            list: {
                                0: "IP address",
                                1: "Browser fingerprinting",
                                2: "Cookies"
                            }
                        },
                        subList2: {
                            heading: "WSO2 IS may use:",
                            list: {
                                0: "IP Address to derive geographic information",
                                1: "Browser fingerprinting to determine the browser technology or/and version"
                            }
                        }
                    },
                    heading: "Use of personal information"
                },
                whatIsPersonalInfo: {
                    description: {
                        list1: {
                            0: "Your user name (except in cases where the user name created by your employer is " +
                                "under contract)",
                            1: "Your date of birth/age",
                            2: "IP address used to log in",
                            3: "Your device ID if you use a device (E.g., phone or tablet) to log in"
                        },
                        list2: {
                            0: "City/Country from which you originated the TCP/IP connection",
                            1: "Time of the day that you logged in (year, month, week, hour or minute)",
                            2: "Type of device that you used to log in (E.g., phone or tablet)",
                            3: "Operating system and generic browser information"
                        },
                        para1: "WSO2 IS considers anything related to you, and by which you may be identified, as " +
                            "your personal information. This includes, but is not limited to:",
                        para2: "However, WSO2 IS also collects the following information that is not considered " +
                            "personal information, but is used only for <1>statistical</1> purposes. The reason " +
                            "for this is that this information can not be used to track you."
                    },
                    heading: "What is personal information?"
                }
            }
        },
        roles: {
            addRoleWizard: {
                buttons: {
                    finish: "Finish",
                    next: "Next",
                    previous: "Previous"
                },
                forms: {
                    roleBasicDetails: {
                        domain: {
                            label: {
                                group: "Userstore",
                                role: "Role Type"
                            },
                            placeholder: "Domain",
                            validation: {
                                empty: {
                                    group: "Select user store",
                                    role: "Select Role Type"
                                }
                            }
                        },
                        roleName: {
                            label: "{{type}} Name",
                            placeholder: "Enter {{type}} Name",
                            validations: {
                                duplicate: "A {{type}} already exists with the given {{type}} name.",
                                empty: "{{type}} Name is required to proceed.",
                                invalid: "Please enter a valid {{type}} name."
                            }
                        }
                    }
                },
                heading: "Create {{type}}",
                permissions: {
                    buttons: {
                        collapseAll: "Collapse All",
                        expandAll: "Expand All",
                        update: "Update"
                    }
                },
                subHeading: "Create a new {{type}} in the system with specific permissions",
                summary: {
                    labels: {
                        domain: {
                            group: "Userstore",
                            role: "Role Type"
                        },
                        permissions: "Permission(s)",
                        roleName: "{{type}} Name",
                        users: "Assigned User(s)"
                    }
                },
                users: {
                    assignUserModal: {
                        heading: "Update {{type}} Users",
                        list: {
                            listHeader: "Name",
                            searchPlaceholder: "Search users"
                        },
                        subHeading: "Add new users or remove existing users assigned to the {{type}}."
                    }
                },
                wizardSteps: {
                    0: "Basic Details",
                    1: "Permission Selection",
                    2: "Assign Users",
                    3: "Summary"
                }
            },
            advancedSearch: {
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: "E.g. role name."
                        },
                        filterCondition: {
                            placeholder: "E.g. Starts with etc."
                        },
                        filterValue: {
                            placeholder: "Enter value to search"
                        }
                    }
                },
                placeholder: "Search by role name"
            },
            edit: {
                basics: {
                    buttons: {
                        update: "Update"
                    },
                    confirmation: {
                        assertionHint: "Please type <1>{{ roleName }}</1> to confirm.",
                        content: "If you delete this {{type}}, the permissions attached to it will be deleted and " +
                            "the users attached to it will no longer be able to perform intended actions which were " +
                            "previously allowed. Please proceed with caution",
                        header: "Are you sure?",
                        message: "This action is irreversible and will permanently delete the selected {{type}}"
                    },
                    dangerZone: {
                        actionTitle: "Delete {{type}}",
                        header: "Delete {{type}}",
                        subheader: "Once you delete the {{type}}, there is no going back. Please be certain."
                    },
                    fields: {
                        roleName: {
                            name: "Role Name",
                            placeholder: "Enter your role name",
                            required: "Role name is required"

                        }
                    }
                },
                menuItems: {
                    basic: "Basics",
                    permissions: "Permissions",
                    users: "Users"
                },
                users: {
                    list: {
                        emptyPlaceholder: {
                            action: "Assign User",
                            subtitles: "There are no Users assigned to the {{type}} at the moment.",
                            title: "No Users Assigned"
                        },
                        header: "Users"
                    }
                }
            },
            list: {
                buttons: {
                    addButton: "New {{type}}",
                    filterDropdown: "Filter By"
                },
                confirmations: {
                    deleteItem: {
                        assertionHint: "Please type <1>{{ roleName }}</1> to confirm.",
                        content: "If you delete this {{type}}, the permissions attached to it will be deleted and " +
                            "the users attached to it will no longer be able to perform intended actions which were " +
                            "previously allowed. Please proceed with caution.",
                        header: "Are you sure?",
                        message: "This action is irreversible and will permanently delete the selected {{type}}"
                    }
                },
                emptyPlaceholders: {
                    emptyRoleList: {
                        action: "New {{type}}",
                        subtitles: {
                            0: "There are currently no {{type}} available.",
                            1: "You can add a new {{type}} easily by following the",
                            2: "steps in the {{type}} creation wizard."
                        },
                        title: "Add a new {{type}}"
                    },
                    search: {
                        action: "Clear search query",
                        subtitles: {
                            0: "We couldn't find any results for {{searchQuery}}",
                            1: "Please try a different search term."
                        },
                        title: "No results found"
                    }
                },
                popups: {
                    delete: "Delete {{type}}",
                    edit: "Edit {{type}}"
                }
            },
            notifications: {
                createPermission: {
                    error: {
                        description: "{{description}}",
                        message: "Error occurred while adding permission to role."
                    },
                    genericError: {
                        description: "Couldn't add permissions to role.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Permissions were successfully added to the role.",
                        message: "Role created successfully."
                    }
                },
                createRole: {
                    error: {
                        description: "{{description}}",
                        message: "Error occurred while creating the role."
                    },
                    genericError: {
                        description: "Couldn't create the role.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The role was created successfully.",
                        message: "Role created successfully."
                    }
                },
                deleteRole: {
                    error: {
                        description: "{{description}}",
                        message: "Error deleting the selected role."
                    },
                    genericError: {
                        description: "Couldn't remove the selected role.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The selected role was deleted successfully.",
                        message: "Role deleted successfully"
                    }
                },
                fetchRoles: {
                    genericError: {
                        description: "An error occurred while retrieving roles.",
                        message: "Something went wrong"
                    }
                },
                updateRole: {
                    error: {
                        description: "{{description}}",
                        message: "Error updating the selected role."
                    },
                    genericError: {
                        description: "Couldn't update the selected role.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The selected role was updated successfully.",
                        message: "Role updated successfully"
                    }
                }
            }
        },
        serverConfigs: {
            accountRecovery: {
                actionTitles: {
                    config: "More"
                },
                confirmation: {
                    heading: "Confirmation",
                    message: "Do you wish to save the configurations related to user account recovery?"
                },
                description: "Configure how account recovery should happen with your users.",
                heading: "Account Recovery",
                notifications: {
                    getConfigurations: {
                        error: {
                            description: "{{ description }}",
                            message: "Retrieval Error"
                        },
                        genericError: {
                            description: "An error occurred while retrieving the account recovery configurations.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    updateConfigurations: {
                        error: {
                            description: "{{ description }}",
                            message: "Update Error"
                        },
                        genericError: {
                            description: "An error occurred while updating the account recovery configurations.",
                            message: "Update Error"
                        },
                        success: {
                            description: "Successfully updated the account recovery configurations.",
                            message: "Update Successful"
                        }
                    },
                    updateEnableNotificationPasswordRecovery: {
                        error: {
                            description: "{{ description }}",
                            message: "Update Error"
                        },
                        genericError: {
                            description: "An error occurred while updating the account recovery configurations.",
                            message: "Update Error"
                        },
                        success: {
                            description: "Successfully updated notification based password recovery status.",
                            message: ""
                        }
                    },
                    updateEnableUsernameRecovery: {
                        error: {
                            description: "{{ description }}",
                            message: "Update Error"
                        },
                        genericError: {
                            description: "An error occurred while updating the account recovery configurations.",
                            message: "Update Error"
                        },
                        success: {
                            description: "Successfully updated username recovery status.",
                            message: ""
                        }
                    },
                    updateNotificationPasswordRecoveryReCaptcha: {
                        error: {
                            description: "{{ description }}",
                            message: "Update Error"
                        },
                        genericError: {
                            description: "An error occurred while updating the account recovery configurations.",
                            message: "Update Error"
                        },
                        success: {
                            description: "Successfully configured reCaptcha for notification based password recovery.",
                            message: ""
                        }
                    },
                    updateSecurityQuestionPasswordRecoveryReCaptcha: {
                        error: {
                            description: "{{ description }}",
                            message: "Update Error"
                        },
                        genericError: {
                            description: "An error occurred while updating the account recovery configurations.",
                            message: "Update Error"
                        },
                        success: {
                            description: "Successfully configured security question based password recovery status.",
                            message: ""
                        }
                    },
                    updateUsernameRecoveryReCaptcha: {
                        error: {
                            description: "{{ description }}",
                            message: "Update Error"
                        },
                        genericError: {
                            description: "An error occurred while updating the account recovery configurations.",
                            message: "Update Error"
                        },
                        success: {
                            description: "Successfully configured reCaptcha for username recovery.",
                            message: ""
                        }
                    }
                },
                otherSettings: {
                    form: {
                        enableForcedChallengeQuestions: {
                            hint: "Force users to provide answers to challenge questions during sign in",
                            label: "Enable forced challenge questions"
                        },
                        enableInternalNotificationManagement: {
                            hint: "Set false if the client application handles notification sending",
                            label: "Enable internal notification management"
                        },
                        notifyQuestionRecoveryStart: {
                            label: "Notify when questions based recovery starts"
                        },
                        notifyRecoverySuccess: {
                            label: "Notify when recovery success"
                        },
                        reCaptchaMaxFailedAttempts: {
                            label: "Max failed attempts for reCaptcha",
                            placeholder: "2",
                            validations: {
                                empty: "Max failed attempts for reCaptcha is required."
                            }
                        },
                        recoveryCallbackURLRegex: {
                            hint: "Callback URL regex for the recovery.",
                            label: "Recovery callback URL regex",
                            placeholder: ".*",
                            validations: {
                                empty: "Recovery callback URL regex is required."
                            }
                        },
                        recoveryLinkExpiryTime: {
                            hint: "Specify the time to expire the recovery link in minutes.",
                            label: "Recovery link expiry time",
                            placeholder: "1440",
                            validations: {
                                empty: "Number of questions required for password recovery is required."
                            }
                        },
                        smsOTPExpiryTime: {
                            hint: "Specify the time to expire the SMS OTP in minutes.",
                            label: "SMS OTP expiry time",
                            placeholder: "1",
                            validations: {
                                empty: "Number of questions required for password recovery is required."
                            }
                        }
                    },
                    heading: "Other Settings"
                },
                passwordRecovery: {
                    form: {
                        enableNotificationBasedRecovery: {
                            label: "Enable notification based password recovery"
                        },
                        enableReCaptchaForNotificationBasedRecovery: {
                            hint: "reCaptcha will be prompted during notification based password recovery.",
                            label: "Enable reCaptcha for notification based password recovery"
                        },
                        enableReCaptchaForSecurityQuestionBasedRecovery: {
                            hint: "Show captcha for challenge question based password recovery",
                            label: "Enable reCaptcha for security questions based password recovery"
                        },
                        enableSecurityQuestionBasedRecovery: {
                            label: "Enable security question based password recovery"
                        },
                        noOfQuestionsRequired: {
                            hint: "The user will have to successfully answer this number of security questions to " +
                                "recover the password.",
                            label: "Number of questions required for password recovery",
                            placeholder: "2",
                            validations: {
                                empty: "Number of questions required for password recovery is required."
                            }
                        }
                    },
                    heading: "Password Recovery"
                },
                usernameRecovery: {
                    form: {
                        enable: {
                            label: "Enable username recovery"
                        },
                        enableReCaptcha: {
                            hint: "reCaptcha will be prompted during the username recovery flow.",
                            label: "Enable reCaptcha for username recovery"
                        }
                    },
                    heading: "Username Recovery"
                }
            },
            loginPolicies: {
                accountDisable: {
                    form: {
                        accountDisableInternalNotificationManagement: {
                            hint: "If disabled, the client application should handle notification sending.",
                            label: "Manage account disabling notifications internally"
                        },
                        accountDisablingEnable: {
                            hint: "Allow administrator to disable user accounts.",
                            label: "Allow the administrator to disable user accounts."
                        }
                    },
                    heading: "Account Disabling"
                },
                accountLock: {
                    form: {
                        accountLockEnable: {
                            hint: "Lock user account on failed login attempts.",
                            label: "Lock user accounts on failed login attempts."
                        },
                        accountLockInternalNotificationManagement: {
                            hint: "If disabled, the client application should handle notification sending.",
                            label: "Manage account locking notifications internally"
                        },
                        accountLockTime: {
                            hint: "Initial account lock time period in minutes.",
                            label: "Initial account lock duration",
                            placeholder: "5"
                        },
                        accountLockTimeIncrementFactor: {
                            hint: "Account lock duration will be increased by this factor. " +
                                "Ex: Initial duration: 5m; Increment factor: 2; Next lock duration: 5 x 2 = 10m",
                            label: "Account lock duration increment factor",
                            placeholder: "2"
                        },
                        maxFailedLoginAttemptsToAccountLock: {
                            hint: "Number of failed login attempts allowed until account lock.",
                            label: "Maximum failed login attempts",
                            placeholder: "2"
                        }
                    },
                    heading: "Account Locking"
                },
                actionTitles: {
                    config: "More"
                },
                confirmation: {
                    heading: "Confirmation",
                    message: "Do you wish to save the configurations related to login policies?"
                },
                description: "Configure the login policies of the system.",
                heading: "Login Policies",
                notifications: {
                    getConfigurations: {
                        error: {
                            description: "{{ description }}",
                            message: "Retrieval Error"
                        },
                        genericError: {
                            description: "An error occurred while retrieving the login policies.",
                            message: "Retrieval Error"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    updateAccountDisableInternalNotificationManagement: {
                        error: {
                            description: "{{ description }}",
                            message: "Update Error"
                        },
                        genericError: {
                            description: "An error occurred while updating the login policies.",
                            message: "Update Error"
                        },
                        success: {
                            description: "Successfully updated the account disabling notification settings.",
                            message: ""
                        }
                    },
                    updateAccountDisablingEnable: {
                        error: {
                            description: "{{ description }}",
                            message: "Update Error"
                        },
                        genericError: {
                            description: "An error occurred while updating the login policies.",
                            message: "Update Error"
                        },
                        success: {
                            description: "Successfully updated the account disabling policy.",
                            message: ""
                        }
                    },
                    updateAccountLockEnable: {
                        error: {
                            description: "{{ description }}",
                            message: "Update Error"
                        },
                        genericError: {
                            description: "An error occurred while updating the login policies.",
                            message: "Update Error"
                        },
                        success: {
                            description: "Successfully updated the account locking policy.",
                            message: ""
                        }
                    },
                    updateConfigurations: {
                        error: {
                            description: "{{ description }}",
                            message: "Update Error"
                        },
                        genericError: {
                            description: "An error occurred while updating the login policies.",
                            message: "Update Error"
                        },
                        success: {
                            description: "Successfully updated the login policies.",
                            message: "Update Successful"
                        }
                    }
                },
                reCaptcha: {
                    form: {
                        maxFailedLoginAttemptsToReCaptcha: {
                            hint: "Number of failed login attempts allowed until prompting reCaptcha.",
                            label: "Maximum failed login attempts",
                            placeholder: "3"
                        },
                        reCaptchaPreference: {
                            label: "Select reCaptcha preference.",
                            reCaptchaAfterMaxFailedAttemptsEnable: {
                                label: "Prompt reCaptcha after max failed attempts"
                            },
                            reCaptchaAlwaysEnable: {
                                label: "Always prompt reCaptcha"
                            }
                        }
                    },
                    heading: "Captcha for SSO Login"
                }
            },
            passwordPolicies: {
                actionTitles: {
                    config: "More"
                },
                confirmation: {
                    heading: "Confirmation",
                    message: "Do you wish to save the configurations related to password policies?"
                },
                description: "Configure the password policies of the system.",
                heading: "Password Policies",
                notifications: {
                    accountDisablingEnable: {
                        error: {
                            description: "{{ description }}",
                            message: "Update Error"
                        },
                        genericError: {
                            description: "An error occurred while updating the password policies.",
                            message: "Update Error"
                        },
                        success: {
                            description: "Successfully updated the account disabling policy.",
                            message: ""
                        }
                    },
                    accountLockEnable: {
                        error: {
                            description: "{{ description }}",
                            message: "Update Error"
                        },
                        genericError: {
                            description: "An error occurred while updating the password policies.",
                            message: "Update Error"
                        },
                        success: {
                            description: "Successfully updated the account locking policy.",
                            message: ""
                        }
                    },
                    getConfigurations: {
                        error: {
                            description: "{{ description }}",
                            message: "Retrieval Error"
                        },
                        genericError: {
                            description: "An error occurred while retrieving the password policies.",
                            message: "Retrieval Error"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    updateConfigurations: {
                        error: {
                            description: "{{ description }}",
                            message: "Update Error"
                        },
                        genericError: {
                            description: "An error occurred while updating the password policies.",
                            message: "Update Error"
                        },
                        success: {
                            description: "Successfully updated the password policies.",
                            message: "Update Successful"
                        }
                    }
                },
                passwordHistory: {
                    form: {
                        enable: {
                            hint: "Restrict users from using previously used passwords.",
                            label: "Validate password history"
                        },
                        passwordHistoryCount: {
                            hint: "Restrict reusing last n number of password during password update",
                            label: "Password history validation count",
                            placeholder: "3",
                            validations: {
                                empty: "Password history validation count cannot be empty."
                            }
                        }
                    },
                    heading: "Password History"
                },
                passwordPatterns: {
                    form: {
                        enable: {
                            hint: "",
                            label: "Validate passwords based on a policy pattern"
                        },
                        errorMessage: {
                            hint: "This error message will be displayed when a pattern violation is ditected.",
                            label: "Error message on pattern violation"
                        },
                        policyMaxLength: {
                            hint: "Maximum number of characters in the password.",
                            label: "Maximum number of characters"
                        },
                        policyMinLength: {
                            hint: "Minimum number of characters in the password.",
                            label: "Minimum number of characters"
                        },
                        policyPattern: {
                            hint: "A regex pattern to validate the password.",
                            label: "Password pattern regex"
                        }
                    },
                    heading: "Password Patterns"
                }
            },
            realmConfiguration: {
                actionTitles: {
                    config: "More"
                },
                confirmation: {
                    heading: "Confirmation",
                    message: "Do you wish to save the configurations related to realm?"
                },
                description: "Configure the basic configurations related to realm.",
                form: {
                    homeRealmIdentifiers: {
                        hint: "Enter home realm identifier. Multiple identifiers are allowed.",
                        label: "Home realm identifiers",
                        placeholder: "localhost",
                    },
                    idleSessionTimeoutPeriod: {
                        hint: "Enter the idle session timeout in minutes",
                        label: "Idle Session Time Out"
                    },
                    rememberMePeriod: {
                        hint: "Enter the remember me period in minutes",
                        label: "Remember Me Period"
                    }
                },
                heading: "Realm configurations",
                notifications: {
                    emptyHomeRealmIdentifiers: {
                        error: {
                            description: "You must declare at least one home realm identifier.",
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
                    getConfigurations: {
                        error: {
                            description: "{{ description }}",
                            message: "Retrieval Error"
                        },
                        genericError: {
                            description: "An error occurred while retrieving the realm configurations.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    updateConfigurations: {
                        error: {
                            description: "{{ description }}",
                            message: "Update Error"
                        },
                        genericError: {
                            description: "An error occurred while updating the realm configurations.",
                            message: "Update Error"
                        },
                        success: {
                            description: "Successfully updated the realm configurations.",
                            message: "Update Successful"
                        }
                    }
                }
            },
            requestPathAuthenticators: {
                notifications: {
                    getRequestPathAuthenticators: {
                        error: {
                            description: "{{ description }}",
                            message: "Retrieval Error"
                        },
                        genericError: {
                            description: "An error occurred while retrieving request path authenticators.",
                            message: "Retrieval Error"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    }
                },
                subTitle: "Local authenticators for request path authentication.",
                title: "Request Path Authentication"
            },
            selfRegistration: {
                actionTitles: {
                    config: "More"
                },
                confirmation: {
                    heading: "Confirmation",
                    message: "Do you wish to save the configurations related to user self registration?"
                },
                description: "Configure how the user self registration should happen with your users.",
                form: {
                    callbackURLRegex: {
                        hint: "This prefix will be used to validate the callback URL.",
                        label: "User self registration callback URL prefix",
                        placeholder: "https://localhost:9443/authenticationendpoint/login.do",
                        validations: {
                            empty: "User self registration callback URL regex is required."
                        }
                    },
                    enable: {
                        label: "User self registration"
                    },
                    enableAccountLockOnCreation: {
                        label: "Lock user account on creation"
                    },
                    enableReCaptcha: {
                        label: "Enable reCaptcha"
                    },
                    internalNotificationManagement: {
                        label: "Internal notification management"
                    },
                    smsOTPExpiryTime: {
                        hint: "Specify the expiry time in minutes for the SMS OTP.",
                        label: "User self registration SMS OTP expiry time",
                        placeholder: "1",
                        validations: {
                            empty: "User self registration SMS OTP expiry time is required."
                        }
                    },
                    verificationLinkExpiryTime: {
                        hint: "Specify the expiry time in minutes for the verification link.",
                        label: "User self registration verification link expiry time",
                        placeholder: "1440",
                        validations: {
                            empty: "User self registration verification link expiry time is required."
                        }
                    }
                },
                heading: "User Self Registration",
                notifications: {
                    getConfigurations: {
                        error: {
                            description: "{{ description }}",
                            message: "Retrieval Error"
                        },
                        genericError: {
                            description: "An error occurred while retrieving the self registration configurations.",
                            message: "Retrieval Error"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    updateAccountLockOnCreation: {
                        error: {
                            description: "{{ description }}",
                            message: "Update Error"
                        },
                        genericError: {
                            description: "An error occurred while updating the self registration configurations.",
                            message: "Update Error"
                        },
                        success: {
                            description: "Successfully updated self registration account lock on creation status.",
                            message: ""
                        }
                    },
                    updateConfigurations: {
                        error: {
                            description: "{{ description }}",
                            message: "Update Error"
                        },
                        genericError: {
                            description: "An error occurred while updating the self registration configurations.",
                            message: "Update Error"
                        },
                        success: {
                            description: "Successfully updated the self registration configurations.",
                            message: "Update Successful"
                        }
                    },
                    updateEnable: {
                        error: {
                            description: "{{ description }}",
                            message: "Update Error"
                        },
                        genericError: {
                            description: "An error occurred while updating the self registration configurations.",
                            message: "Update Error"
                        },
                        success: {
                            description: "Successfully updated self registration enabled status.",
                            message: ""
                        }
                    },
                    updateInternalNotificationManagement: {
                        error: {
                            description: "{{ description }}",
                            message: "Update Error"
                        },
                        genericError: {
                            description: "An error occurred while updating the self registration configurations.",
                            message: "Update Error"
                        },
                        success: {
                            description: "Successfully updated self registration internal notification management " +
                                "status.",
                            message: ""
                        }
                    },
                    updateReCaptcha: {
                        error: {
                            description: "{{ description }}",
                            message: "Update Error"
                        },
                        genericError: {
                            description: "An error occurred while updating the self registration configurations.",
                            message: "Update Error"
                        },
                        success: {
                            description: "Successfully updated self registration enable reCaptcha status.",
                            message: ""
                        }
                    }

                }
            }
        },
        templates: {
            emptyPlaceholder: {
                action: null,
                subtitles: "Please add templates to display here.",
                title: "No templates to display."
            }
        },
        transferList: {
            list: {
                emptyPlaceholders: {
                    default: "There are no items in this list at the moment.",
                    users: {
                        roles: {
                            selected: "There are no {{type}} assigned to this user.",
                            unselected: "There are no {{type}} available to assign to this user."
                        }
                    }
                },
                headers: {
                    0: "Domain",
                    1: "Name"
                }
            },
            searchPlaceholder: "Search {{type}}"
        },
        user: {
            deleteUser: {
                confirmationModal: {
                    assertionHint: "Please type <1>{{ userName }}</1> to confirm.",
                    content: "If you delete this user, the user will not be able to login to the developer portal or " +
                        "any other application the user was subscribed before. Please proceed with caution.",
                    header: "Are you sure?",
                    message: "This action is irreversible and will permanently delete the user."
                }
            },
            editUser: {
                dangerZoneGroup: {
                    dangerZone: {
                        actionTitle: "Delete User",
                        header: "Delete user",
                        subheader: "Once you delete a user, there is no going back. Please be certain."
                    },
                    header: "Danger Zone"
                },
                menu: {
                    menuItems: {
                        0: "Profile",
                        1: "Groups",
                        2: "Roles"
                    }
                }
            },
            forms: {
                addUserForm: {
                    buttons: {
                        radioButton: {
                            label: "Select the method to set the user password",
                            options: {
                                askPassword: "Invite user to set password",
                                createPassword: "Set user password"

                            }
                        }
                    },
                    inputs: {
                        confirmPassword: {
                            label: "Confirm Password",
                            placeholder: "Enter the new password",
                            validations: {
                                empty: "Confirm password is a required field",
                                mismatch: "The password confirmation doesn't match"
                            }
                        },
                        domain: {
                            label: "Userstore",
                            placeholder: "Select user store",
                            validations: {
                                empty: "User store name cannot be empty."
                            }
                        },
                        email: {
                            label: "Email Address",
                            placeholder: "Enter the email address",
                            validations: {
                                empty: "Email address cannot be empty",
                                invalid: "Please enter a valid email address"
                            }
                        },
                        firstName: {
                            label: "First Name",
                            placeholder: "Enter your first name",
                            validations: {
                                empty: "First name is a required field"
                            }
                        },
                        lastName: {
                            label: "Last Name",
                            placeholder: "Enter your last name",
                            validations: {
                                empty: "Last name is a required field"
                            }
                        },
                        newPassword: {
                            label: "New Password",
                            placeholder: "Enter the new password",
                            validations: {
                                empty: "New password is a required field",
                                regExViolation: "Please enter a valid password"
                            }
                        },
                        username: {
                            label: "Username",
                            placeholder: "Enter the username",
                            validations: {
                                empty: "Username is a required field",
                                invalid: "A user already exists with this username.",
                                regExViolation: "Please enter a valid username"
                            }
                        }
                    },
                    validations: {
                        genericError: {
                            description: "Something went wrong. Please try again",
                            message: "Change password error"
                        },
                        invalidCurrentPassword: {
                            description: "The current password you entered appears to be invalid. Please try again",
                            message: "Change password error"
                        },
                        submitError: {
                            description: "{{description}}",
                            message: "Change password error"
                        },
                        submitSuccess: {
                            description: "The password has been changed successfully",
                            message: "Password reset successful"
                        }
                    }
                }
            },
            modals: {
                addUserWarnModal: {
                    heading: "Warning",
                    message: "Please note that this created user will not be assigned with a role. If you wish to " +
                        "assign roles to this user please click on the button below."
                },
                addUserWizard: {
                    buttons: {
                        next: "Next",
                        previous: "Previous"
                    },
                    steps: {
                        basicDetails: "Basic Details",
                        groups: "User Groups",
                        roles: "User Roles",
                        summary: "Summary"
                    },
                    subTitle: "Follow the steps to create the new user",
                    title: "Create User",
                    wizardSummary: {
                        domain: "Userstore",
                        groups: "Group(s)",
                        name: "Name",
                        passwordOption: {
                            label: "Password option",
                            message: {
                                0: "An email will be sent to {{email}} with the link to set the password.",
                                1: "The password was set by the administrator."
                            }
                        },
                        roles: "Role(s)",
                        username: "Username"
                    }
                }
            },
            profile: {
                fields: {
                    /* eslint-disable @typescript-eslint/camelcase */
                    addresses_home: "Home Address",
                    addresses_work: "Work Address",
                    emails: "Email",
                    emails_home: "Home Email",
                    emails_other: "Other Email",
                    emails_work: "Work Email",
                    generic: {
                        default: "Add {{fieldName}}"
                    },
                    name_familyName: "Last Name",
                    name_givenName: "First Name",
                    phoneNumbers: "Phone Number",
                    phoneNumbers_home: "Home Phone Number",
                    phoneNumbers_mobile: "Mobile Number",
                    phoneNumbers_other: "Other Phone Number",
                    phoneNumbers_work: "Work Phone Number",
                    profileUrl: "URL",
                    userName: "Username"
                    /* eslint-enable @typescript-eslint/camelcase */
                },
                forms: {
                    emailChangeForm: {
                        inputs: {
                            email: {
                                label: "Email",
                                note: "NOTE: This will change the email address in your profile",
                                placeholder: "Enter your email address",
                                validations: {
                                    empty: "Email address is a required field",
                                    invalidFormat: "The email address is not of the correct format"
                                }
                            }
                        }
                    },
                    generic: {
                        inputs: {
                            placeholder: "Enter your {{fieldName}}",
                            validations: {
                                empty: "{{fieldName}} is a required field",
                                invalidFormat: "The {{fieldName}} is not of the correct format"
                            }
                        }
                    },
                    mobileChangeForm: {
                        inputs: {
                            mobile: {
                                label: "Mobile number",
                                note: "NOTE: This will change the mobile number in your profile",
                                placeholder: "Enter your mobile number",
                                validations: {
                                    empty: "Mobile number is a required field",
                                    invalidFormat: "The mobile number is not of the right format"
                                }
                            }
                        }
                    },
                    nameChangeForm: {
                        inputs: {
                            firstName: {
                                label: "First name",
                                placeholder: "Enter the first name",
                                validations: {
                                    empty: "First name is a required field"
                                }
                            },
                            lastName: {
                                label: "Last name",
                                placeholder: "Enter the last name",
                                validations: {
                                    empty: "Last name is a required field"
                                }
                            }
                        }
                    },
                    organizationChangeForm: {
                        inputs: {
                            organization: {
                                label: "Organization",
                                placeholder: "Enter your organization",
                                validations: {
                                    empty: "Organization is a required field"
                                }
                            }
                        }
                    }
                },
                notifications: {
                    getProfileInfo: {
                        error: {
                            description: "{{description}}",
                            message: "Error occurred while retrieving the profile details"
                        },
                        genericError: {
                            description: "Error occurred while retrieving the profile details",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The required user profile details are retrieved successfully",
                            message: "Successfully retrieved user profile"
                        }
                    },
                    updateProfileInfo: {
                        error: {
                            description: "{{description}}",
                            message: "Error occurred while updating the profile details"
                        },
                        genericError: {
                            description: "Error occurred while updating the profile details",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The required user profile details were successfully updated",
                            message: "User profile updated successfully"
                        }
                    }
                },
                placeholders: {
                    SCIMDisabled: {
                        heading: "This feature is not available for your account"
                    }
                }
            },
            updateUser: {
                groups: {
                    addGroupsModal: {
                        heading: "Update User Groups",
                        subHeading: "Add new groups or remove existing groups assigned to the user."
                    },
                    editGroups: {
                        groupList: {
                            emptyListPlaceholder: {
                                subTitle: {
                                    0: "There are no groups assigned to the user at the moment.",
                                    1: "This might restrict user from performing certain",
                                    2: "tasks like accessing certain applications."
                                },
                                title: "No Groups Assigned"
                            },
                            headers: {
                                0: "Domain",
                                1: "Name"
                            }
                        },
                        heading: "Assigned Groups",
                        popups: {
                            viewPermissions: "View Permissions"
                        },
                        searchPlaceholder: "Search groups",
                        subHeading: "Add or remove the groups user is assigned with and note that this will affect " +
                            "performing certain tasks."
                    },
                    notifications: {
                        addUserGroups: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while updating user groups"
                            },
                            genericError: {
                                description: "An error occurred while updating user groups",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "Assigning new groups for the user successful",
                                message: "Update user groups successful"
                            }
                        },
                        fetchUserGroups: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while fetching the groups list"
                            },
                            genericError: {
                                description: "Error occurred while fetching the groups list",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "The groups list was successfully retrieved",
                                message: "User groups list retrieved successfully"
                            }
                        },
                        removeUserGroups: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while updating the groups of the user"
                            },
                            genericError: {
                                description: "An error occurred while updating user groups",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "Removing assigned groups for the user successful",
                                message: "Update user groups successful"
                            }
                        }
                    }
                },
                roles: {
                    addRolesModal: {
                        heading: "Update User Roles",
                        subHeading: "Add new roles or remove existing roles assigned to the user."
                    },
                    editRoles: {
                        heading: "Assigned Roles",
                        popups: {
                            viewPermissions: "View Permissions"
                        },
                        roleList: {
                            emptyListPlaceholder: {
                                subTitle: {
                                    0: "There are no roles assigned to the user at the moment.",
                                    1: "This might restrict user from performing certain",
                                    2: "tasks like accessing certain applications."
                                },
                                title: "No Roles Assigned"
                            },
                            headers: {
                                0: "Domain",
                                1: "Name"
                            }
                        },
                        searchPlaceholder: "Search Roles",
                        subHeading: "Add or remove the roles user is assigned with and note that this will affect " +
                            "performing certain tasks."
                    },
                    notifications: {
                        addUserRoles: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while updating user roles"
                            },
                            genericError: {
                                description: "An error occurred while updating user roles",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "Assigning new roles for the user successful",
                                message: "Update user roles successful"
                            }
                        },
                        fetchUserRoles: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while fetching the roles list"
                            },
                            genericError: {
                                description: "Error occurred while fetching the roles list",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "The roles list was successfully retrieved",
                                message: "User roles list retrieved successfully"
                            }
                        },
                        removeUserRoles: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while updating the roles of the user"
                            },
                            genericError: {
                                description: "An error occurred while updating user roles",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "Removing assigned roles for the user successful",
                                message: "Update user roles successful"
                            }
                        }
                    },
                    viewPermissionModal: {
                        backButton: "Back to list",
                        heading: "Permissions for {{role}}"
                    }
                }
            }
        },
        users: {
            advancedSearch: {
                form: {
                    dropdown: {
                        filterAttributeOptions: {
                            email: "Email",
                            username: "Username"
                        }
                    },
                    inputs: {
                        filterAttribute: {
                            placeholder: "E.g. Username, Email etc."
                        },
                        filterCondition: {
                            placeholder: "E.g. Starts with etc."
                        },
                        filterValue: {
                            placeholder: "Enter value to search"
                        }
                    }
                },
                placeholder: "Search by Username"
            },
            all: {
                heading: "Users",
                subHeading: "Add and manage user accounts, assign roles to the users and maintain user identities."
            },
            buttons: {
                addNewUserBtn: "New User",
                assignUserRoleBtn: "Assign roles",
                metaColumnBtn: "Columns"
            },
            notifications: {
                addUser: {
                    error: {
                        description: "{{description}}",
                        message: "Error adding the new user"
                    },
                    genericError: {
                        description: "Couldn't add the new user",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The new user was added successfully.",
                        message: "User added successfully"
                    }
                },
                deleteUser: {
                    error: {
                        description: "{{description}}",
                        message: "Error deleting the user"
                    },
                    genericError: {
                        description: "Couldn't delete the user",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The user was deleted successfully.",
                        message: "User deleted successfully"
                    }
                },
                fetchUsers: {
                    error: {
                        description: "{{description}}",
                        message: "Error retrieving users"
                    },
                    genericError: {
                        description: "Couldn't retrieve users",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully retrieved the users.",
                        message: "Users retrieval successful"
                    }
                }
            },
            placeholders: {
                emptyList: {
                    action: "Refresh list",
                    subtitles: {
                        0: "The users list returned empty.",
                        1: "Something went wrong while fetching the user list"
                    },
                    title: "No Users Found"
                }
            },
            usersList: {
                list: {
                    emptyResultPlaceholder: {
                        addButton: "New User",
                        subTitle: {
                            0: "There are currently no users available.",
                            1: "You can add a new user easily by following the",
                            2: "steps in the user creation wizard."
                        },
                        title: "Add a new User"
                    },
                    iconPopups: {
                        delete: "Delete",
                        edit: "Edit"
                    }
                },
                metaOptions: {
                    columns: {
                        emails: "Email",
                        id: "User id",
                        lastModified: "Last modified",
                        name: "Name",
                        userName: "Username"
                    },
                    heading: "Show Columns"
                },
                search: {
                    emptyResultPlaceholder: {
                        clearButton: "Clear search query",
                        subTitle: {
                            0: "We couldn't find any results for {{query}}",
                            1: "Please try a different search term."
                        },
                        title: "No results found"
                    }
                }
            },
            userstores: {
                userstoreOptions: {
                    all: "All userstores",
                    primary: "Primary"
                }
            }
        },
        userstores: {
            advancedSearch: {
                error: "Filter query format incorrect",
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: "E.g. Name, Description etc."
                        },
                        filterCondition: {
                            placeholder: "E.g. Starts with etc."
                        },
                        filterValue: {
                            placeholder: "E.g. PRIMARY, SECONDARY etc."
                        }
                    }
                },
                placeholder: "Search by userstore name"
            },
            confirmation: {
                confirm: "Confirm",
                content: "If you delete this userstore, the user data in this userstore will also be deleted. "
                    + "Please proceed with caution.",
                header: "Are you sure?",
                hint: "Please type <1>{{name}}</1> to confirm.",
                message: "This action is irreversible and will permanently delete the"
                    + " selected userstore and the data in it."
            },
            dangerZone: {
                actionTitle: "Delete Userstore",
                header: "Delete Userstore",
                subheader: "Once you delete a userstore, there is no going back. "
                    + "Please be certain."
            },
            forms: {
                connection: {
                    connectionErrorMessage: "Please ensure the provided connection "
                        + "URL, name, password and driver name are correct",
                    testButton: "Test Connection"
                },
                custom: {
                    placeholder: "Enter a {{name}}",
                    requiredErrorMessage: "{{name}} is required"
                },
                general: {
                    description: {
                        label: "Description",
                        placeholder: "Enter a description"
                    },
                    name: {
                        label: "Name",
                        placeholder: "Enter a name",
                        requiredErrorMessage: "Name is a required field"
                    },
                    type: {
                        label: "Type",
                        requiredErrorMessage: "Select a Type"
                    }
                }
            },
            notifications: {
                addUserstore: {
                    genericError: {
                        description: "There was an error while creating the userstore",
                        message: "Something went wrong!"
                    },
                    success: {
                        description: "The userstore has been added successfully!",
                        message: "Userstore added successfully!"
                    }
                },
                delay: {
                    description: "It may take a while for the userstore list to be updated. "
                        + "Refresh in a few seconds to get the updated userstore list.",
                    message: "Updating Userstore list takes time"
                },
                deleteUserstore: {
                    genericError: {
                        description: "There was an error while deleting the userstore",
                        message: "Something went wrong!"
                    },
                    success: {
                        description: "The userstore has been deleted successfully!",
                        message: "Userstore deleted successfully!"
                    }
                },
                fetchUserstoreMetadata: {
                    genericError: {
                        description: "An error occurred while fetching the type meta data.",
                        message: "Something went wrong"
                    }
                },
                fetchUserstoreTemplates: {
                    genericError: {
                        description: "An error occurred while fetching the userstore type details.",
                        message: "Something went wrong"
                    }
                },
                fetchUserstoreTypes: {
                    genericError: {
                        description: "An error occurred while fetching the userstore types.",
                        message: "Something went wrong"
                    }
                },
                fetchUserstores: {
                    genericError: {
                        description: "An error occurred while fetching userstores",
                        message: "Something went wrong"
                    }
                },
                testConnection: {
                    genericError: {
                        description: "An error occurred while testing the " + "connection to the userstore",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The connection is healthy",
                        message: "Connection successful!"
                    }
                },
                updateUserstore: {
                    genericError: {
                        description: "An error occurred while updating the userstore.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "This userstore has been updated successfully!",
                        message: "Userstore updated successfully!"
                    }
                }
            },
            pageLayout: {
                edit: {
                    back: "Go back to userstores",
                    description: "Edit userstore",
                    tabs: {
                        connection: "Connection",
                        general: "General",
                        group: "Group",
                        user: "User"
                    }
                },
                list: {
                    description: "Create and manage userstores",
                    primaryAction: "New Userstore",
                    title: "Userstores"
                },
                templates: {
                    back: "Go back to userstores",
                    description: "Please choose one of the following userstore types.",
                    templateHeading: "Quick Setup",
                    templateSubHeading: "Predefined set of templates to speed up your userstore creation.",
                    title: "Select Userstore Type"
                }
            },
            placeholders: {
                emptyList: {
                    action: "New Userstore",
                    subtitles: "There are currently no userstores available."
                        + "You can add a new userstore easily by following the"
                        + "steps in the userstore creation wizard." + "Please try a different search term.",
                    title: "Add a new Userstore"
                },
                emptySearch: {
                    action: "Clear search query",
                    subtitles: "We couldn't find any results for {{searchQuery}}. "
                        + "Please try a different search term.",
                    title: "No results found"
                }
            },
            sqlEditor: {
                create: "Create",
                darkMode: "Dark Mode",
                delete: "Delete",
                read: "Read",
                reset: "Reset",
                title: "SQL Query Types",
                update: "Update"
            },
            wizard: {
                header: "Add {{type}} Userstore",
                steps: {
                    general: "General",
                    group: "Group",
                    summary: "Summary",
                    user: "User"
                }
            }
        }
    },
    pages: {
        applicationTemplate: {
            backButton: "Go back to applications",
            subTitle: "Please choose one of the following application types.",
            title: "Select Application Type"
        },
        applications: {
            subTitle: "Create and manage applications based on templates and configure authentication.",
            title: "Applications"
        },
        applicationsEdit: {
            backButton: "Go back to applications",
            subTitle: null,
            title: null
        },
        emailLocaleAdd: {
            backButton: "Go back to {{name}} template",
            subTitle: null,
            title: "Edit template - {{name}}"
        },
        emailLocaleAddWithDisplayName: {
            backButton: "Go back to {{name}} template",
            subTitle: null,
            title: "Add new template for {{displayName}}"
        },
        emailTemplateTypes: {
            subTitle: "Create and manage templates types.",
            title: "Email Templates Types"
        },
        emailTemplates: {
            backButton: "Go back to email templates types",
            subTitle: null,
            title: "Email Templates"
        },
        emailTemplatesWithDisplayName: {
            backButton: "Go back to applications",
            subTitle: null,
            title: "Templates - {{displayName}}"
        },
        groups: {
            subTitle: "Create and manage user groups, assign permissions for groups.",
            title: "Groups"
        },
        idp: {
            subTitle: "Create and manage identity providers based on templates and configure authentication.",
            title: "Identity Providers"
        },
        idpTemplate: {
            backButton: "Go back to Identity Providers",
            subTitle: "Please choose one of the following identity provider types.",
            supportServices: {
                authenticationDisplayName: "Authentication",
                provisioningDisplayName: "Provisioning"
            },
            title: "Select Identity Provider Type"
        },
        overView: {
            subTitle: "Configure and  manage applications, identity providers, users and roles, attribute dialects, " +
                "etc.",
            title: "Welcome, {{firstName}}"
        },
        roles: {
            subTitle: "Create and manage roles, assign permissions for roles.",
            title: "Roles"
        },
        rolesEdit: {
            backButton: "Go back to {{type}}",
            subTitle: null,
            title: "Edit Role"
        },
        serverConfigurations: {
            subTitle: "Manage general configurations of the server.",
            title: "General Configurations"
        },
        users: {
            subTitle: "Create and manage users, user access, and user profiles.",
            title: "Users"
        },
        usersEdit: {
            backButton: "Go back to users",
            subTitle: "{{name}}",
            title: "{{email}}"
        }
    },
    placeholders: {
        404: {
            action: "Back to home",
            subtitles: {
                0: "We couldn't find the page you are looking for.",
                1: "Please check the URL or click on the button below to be redirected back to the home page."
            },
            title: "Page not found"
        },
        emptySearchResult: {
            action: "Clear search query",
            subtitles: {
                0: "We couldn't find any results for \"{{query}}\"",
                1: "Please try a different search term."
            },
            title: "No results found"
        },
        genericError: {
            action: "Refresh the page",
            subtitles: {
                0: "Something went wrong while displaying this page.",
                1: "See the browser console for technical details."
            },
            title: "Something went wrong"
        },
        loginError: {
            action: "Continue logout",
            subtitles: {
                0: "It seems like you don't have permission to use this portal.",
                1: "Please sign in with a different account."
            },
            title: "You are not authorized"
        },
        underConstruction: {
            action: "Back to home",
            subtitles: {
                0: "We're doing some work on this page.",
                1: "Please bare with us and come back later. Thank you for your patience."
            },
            title: "Page under construction"
        }
    }
};
