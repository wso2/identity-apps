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
        remoteConfig: {
            pageTitles: {
                listingPage: {
                    title: "Remote Repository Deployment Configuration",
                    description: "Configure a remote repository to work seamlessly with the identity server."
                },
                editPage: {
                    title: "Edit Configuration : ",
                    description: "Edit remote repository configurations.",
                    backLink: "Back to configurations"
                }
            },
            createConfigForm: {
                configName: {
                    label: "Configuration Name",
                    placeholder: "Name for the repository configuration",
                    requiredMessage: "Configuration Name is required."
                },
                gitUrl: {
                    label: "Git Repository URI",
                    placeholder: "Link for github repository URL.",
                    requiredMessage: "Git Repository URL is required."
                },
                gitBranch: {
                    label: "Git Branch",
                    placeholder: "github branch location",
                    requiredMessage: "Git Branch is required."
                },
                gitDirectory: {
                    label: "Git Directory",
                    placeholder: "github directory location",
                    requiredMessage: "Git directory is required."
                },
                gitUserName: {
                    label: "Git User Name",
                    placeholder: "Username of the github account."
                },
                gitAccessToken: {
                    label: "Personal Access Token",
                    placeholder: "Access token for the github account."
                },
                enableConfig: {
                    label: "Enable Configuration"
                }
            },
            placeholders: {
                emptyList: {
                    action: "New Remote Repository Config",
                    subtitles: {
                        0: "Currently there are no configs available.",
                        1: "You can add a new config by ",
                        2: "clicking on the button below."
                    },
                    title: "Add new Remote Repository Config"
                },
                emptyDetails: {
                    subtitles: {
                        0: "The configuration is not yet deployed.",
                        1: "Please deploy the configuration and check back."
                    },
                    title: "Configuration is not deployed."
                }
            },
            list: {
                confirmations: {
                    deleteConfig: {
                        assertionHint: "Please type <1>{{ name }}</1> to confirm.",
                        content: "If you delete this configuration, you will not be able to get it back." +
                            "Please proceed with caution.",
                        header: "Are you sure?",
                        message: "This action is irreversible and will permanently delete the configuration."
                    }
                }
            },
            notifications: {
                deleteConfig: {
                    error: {
                        description: "{{description}}",
                        message: "Deletion Error"
                    },
                    genericError: {
                        description: "Failed to delete the configuration",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully deleted the configuration.",
                        message: "Deletetion successful"
                    }
                },
                triggerConfig: {
                    error: {
                        description: "{{description}}",
                        message: "Trigger Error"
                    },
                    genericError: {
                        description: "Failed to trigger the configuration",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully triggered the configuration.",
                        message: "Trigger successful"
                    }
                },
                editConfig: {
                    error: {
                        description: "{{description}}",
                        message: "Edit Error"
                    },
                    genericError: {
                        description: "Failed to edit the configuration",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully edited the configuration.",
                        message: "Edit successful"
                    }
                },
                createConfig: {
                    error: {
                        description: "{{description}}",
                        message: "Creation Error"
                    },
                    genericError: {
                        description: "Failed to create the configuration",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully created the confuguration.",
                        message: "Creation successful"
                    }
                },
                getConfig: {
                    error: {
                        description: "{{description}}",
                        message: "Creation Error"
                    },
                    genericError: {
                        description: "Failed to retrieve the configuration",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully created the confuguration.",
                        message: "Creation successful"
                    }
                }
            }
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
                                heading: "Redirect URL(s)"
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
                            },
                            requestPathAuthenticators: {
                                notifications: {
                                    getRequestPathAuthenticators: {
                                        error: {
                                            description: "{{ description }}",
                                            message: "Retrieval Error"
                                        },
                                        genericError: {
                                            description: "An error occurred while retrieving request path " +
                                                "authenticators.",
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
                            templateDescription: {
                                description: {
                                    code: "Code",
                                    defaultSteps: "Default Steps",
                                    description: "Description",
                                    helpReference: "Help Reference",
                                    parameters: "Parameters",
                                    prerequisites: "Prerequisites"
                                },
                                popupContent: "More details"
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
                            placeholder: "Enter a name for the application.",
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
                            hint: "After the authentication, we will only redirect to the above redirect URLs " +
                                "and you can specify multiple URLs",
                            label: "Redirect URLs",
                            placeholder: "Enter redirect URLs",
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
                                bindingType: {
                                    label: "Token binding type"
                                },
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
                    configs: {
                        content: {
                            subTitle: "Update the pre defined configurations through the template or add new " +
                                "configurations depending on the protocol (OIDC, SAML, WS-Trust, etc.) configured " +
                                "for the application.",
                            title: "Application Configurations"
                        },
                        heading: "Configurations Guide"
                    },
                    docs: {
                        content: null,
                        heading: "Docs"
                    },
                    start: {
                        content: {
                            endpoints: {
                                subTitle: "If you implement your application without using a WSO2 SDK, the " +
                                    "following server endpoints will be useful for you to implement authentication " +
                                    "for the app.",
                                title: "Server endpoints"
                            },
                            oidcConfigurations: {
                                labels: {
                                    authorize: "Authorize",
                                    introspection: "Introspection",
                                    keystore: "Key Set",
                                    token: "Token",
                                    userInfo: "UserInfo"
                                }
                            },
                            samlConfigurations: {
                                buttons: {
                                    certificate: "Download Certificate",
                                    metadata: "Download IDP Metadata"
                                },
                                labels: {
                                    certificate: "IDP certificate",
                                    issuer: "Issuer",
                                    metadata: "IDP Metadata",
                                    slo: "Single Logout",
                                    sso: "Single Sign-On"
                                }
                            },
                            trySample: {
                                btn: "Explore samples",
                                subTitle: "You can try out the samples which will demonstrate the authentication " +
                                    "flow. Click the button below to download and deploy the sample application.",
                                title: "Try with a sample"
                            },
                            useSDK: {
                                btns: {
                                    withSDK: "Using SDK",
                                    withoutSDK: "Manually"
                                },
                                subTitle: "Install and use our SDKs to integrate authentication to your application " +
                                    "with minimum number of code lines.",
                                title: "Integrate your own app"
                            }
                        },
                        heading: "What's Next?"
                    },
                    samples: {
                        content: {
                            sample: {
                                configurations: {
                                    btn: "Download the Configuration",
                                    subTitle: "In order to integrate the application created in the server with " +
                                        "the sample application, you need to initialise the client with following " +
                                        "configurations.",
                                    title: "Initialize the client"
                                },
                                downloadSample: {
                                    btn: "Download the sample",
                                    subTitle: "This sample application will show case the usage of the of WSO2 " +
                                        "Identity Server SDK and how you can integrate any application with Identity " +
                                        "Server.",
                                    title: "Try out the sample"
                                },
                                goBack: "Go back",
                                subTitle: "Quickly start prototyping by downloading our preconfigured sample " +
                                    "application.",
                                title: "Sample Applications"
                            },
                            technology: {
                                subTitle: "Sample and required SDKs along with useful information will be provided " +
                                    "once you select a technology",
                                title: "Select a technology"
                            }
                        },
                        heading: "Samples"
                    },
                    sdks: {
                        content: {
                            sdk: {
                                goBack: "Go back",
                                subTitle: "Following software development kits can be used to jump start your " +
                                    "application development.",
                                title: "Software Development Kits (SDKs)"
                            }
                        },
                        heading: "SDKs"
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
                fetchOIDCIDPConfigs: {
                    error: {
                        description: "{{description}}",
                        message: "Retrieval error"
                    },
                    genericError: {
                        description: "An error occurred retrieving the IDP configurations for the OIDC application.",
                        message: "Retrieval error"
                    },
                    success: {
                        description: "Successfully retrieved the IDP configurations for the OIDC application.",
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
                fetchSAMLIDPConfigs: {
                    error: {
                        description: "{{description}}",
                        message: "Retrieval error"
                    },
                    genericError: {
                        description: "An error occurred retrieving the IDP configurations for the SAML application.",
                        message: "Retrieval error"
                    },
                    success: {
                        description: "Successfully retrieved the IDP configurations for the SAML application.",
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
            },
            wizards: {
                minimalAppCreationWizard: {
                    help: {
                        heading: "Help",
                        subHeading: "Use the following as a guidance",
                    }
                }
            }
        },
        footer: {
            copyright: "WSO2 Identity Server © {{year}}"
        },
        header: {
            links: {
                adminPortalNav: "Admin Portal",
                userPortalNav: "My Account"
            }
        },
        helpPanel: {
            actions: {
                close: "Close",
                open: "Open help panel",
                pin: "Pin",
                unPin: "Unpin"
            },
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
        oidcScopes: {
            buttons: {
                addScope: "New OIDC Scope"
            },
            confirmationModals: {
                deleteClaim: {
                    assertionHint: "Please type <1>{{ name }}</1> to confirm.",
                    content: "If you delete this claim, you will not be able to get it back." +
                        "Please proceed with caution.",
                    header: "Are you sure?",
                    message: "This action is irreversible and will permanently delete the OIDC claim."
                },
                deleteScope: {
                    assertionHint: "Please type <1>{{ name }}</1> to confirm.",
                    content: "If you delete this scope, you will not be able to get it back." +
                        "Please proceed with caution.",
                    header: "Are you sure?",
                    message: "This action is irreversible and will permanently delete the OIDC scope."
                }
            },
            editScope: {
                claimList: {
                    addClaim:  "New Attribute",
                    emptyPlaceholder: {
                        action: "Add Attribute",
                        subtitles: {
                            0: "There are no attributes added for this OIDC scope",
                            1: "Please add the required attributes to view them here."
                        },
                        title: "No OIDC attributes"
                    },
                    popupDelete: "Delete attribute",
                    searchClaims: "search attributes",
                    subTitle: "Add or remove attributes of an OIDC scope",
                    title: "{{ name }}"
                }
            },
            forms: {
                addScopeForm: {
                    inputs: {
                        description: {
                            label: "Description",
                            placeholder: "Enter a description for the scope"
                        },
                        displayName: {
                            label: "Display name",
                            placeholder: "Enter the display name",
                            validations: {
                                empty: "Display name is a required field"
                            }
                        },
                        scopeName: {
                            label: "Scope name",
                            placeholder: "Enter the scope name",
                            validations: {
                                empty: "Scope name is a required field"
                            }
                        }
                    }
                }
            },
            list: {
                empty: {
                    action: "Add OIDC Scope",
                    subtitles: {
                        0: "There no OIDC Scopes in the system.",
                        1: "Please add new OIDC scopes to view them here."
                    },
                    title: "No OIDC Scopes"
                }
            },
            notifications: {
                addOIDCClaim: {
                    error: {
                        description: "{{description}}",
                        message: "Creation error"
                    },
                    genericError: {
                        description: "An error occurred while adding the OIDC attribute.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully added the new OIDC attribute",
                        message: "Creation successful"
                    }
                },
                addOIDCScope: {
                    error: {
                        description: "{{description}}",
                        message: "Creation error"
                    },
                    genericError: {
                        description: "An error occurred while creating the OIDC scope.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully the new OIDC scope",
                        message: "Creation successful"
                    }
                },
                deleteOIDCScope: {
                    error: {
                        description: "{{description}}",
                        message: "Deletion error"
                    },
                    genericError: {
                        description: "An error occurred while deleting the OIDC scope.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully deleted the OIDC scope.",
                        message: "Deletion successful"
                    }
                },
                deleteOIDClaim: {
                    error: {
                        description: "{{description}}",
                        message: "Deletion error"
                    },
                    genericError: {
                        description: "An error occurred while deleting the OIDC attribute.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully deleted the OIDC attribute.",
                        message: "Deletion successful"
                    }
                },
                fetchOIDCScope: {
                    error: {
                        description: "{{description}}",
                        message: "Retrieval error"
                    },
                    genericError: {
                        description: "An error occurred while fetching the OIDC scope details.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully fetched the OIDC scope details.",
                        message: "Retrieval successful"
                    }
                },
                fetchOIDCScopes: {
                    error: {
                        description: "{{description}}",
                        message: "Retrieval error"
                    },
                    genericError: {
                        description: "An error occurred while fetching the OIDC scopes.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully fetched the OIDC scope list.",
                        message: "Retrieval successful"
                    }
                },
                fetchOIDClaims: {
                    error: {
                        description: "{{description}}",
                        message: "Retrieval error"
                    },
                    genericError: {
                        description: "An error occurred while fetching the OIDC attributes.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully fetched the OIDC scope list.",
                        message: "Retrieval successful"
                    }
                },
                updateOIDCScope: {
                    error: {
                        description: "{{description}}",
                        message: "Update error"
                    },
                    genericError: {
                        description: "An error occurred while updating the OIDC scope.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully updated the OIDC scope.",
                        message: "Update successful"
                    }
                }
            },
            wizards: {
                addScopeWizard: {
                    buttons: {
                        next: "Next",
                        previous: "Previous"
                    },
                    claimList: {
                        searchPlaceholder: "search attributes",
                        table: {
                            emptyPlaceholders: {
                                assigned: "All the available attributes are assigned for this OIDC scope.",
                                unAssigned: "There are no attributes assigned for this OIDC scope."
                            },
                            header: "Attributes"
                        }
                    },
                    steps: {
                        basicDetails: "Basic Details",
                        claims: "Add Attributes"
                    },
                    subTitle: "Create a new OIDC scope with required attributes",
                    title: "Create OIDC Scope"
                }
            }
        },
        overview: {
            banner: {
                heading: "WSO2 Identity Server for Developers",
                subHeading: "Utilize SDKs & other developer tools to build a customized experience",
                welcome: "Welcome, {{username}}"
            },
            quickLinks: {
                cards: {
                    applications: {
                        heading: "Applications",
                        subHeading: "Create applications using predefined templates and manage configurations."
                    },
                    idps: {
                        heading: "Identity Providers",
                        subHeading: "Create and manage identity providers based on templates and configure " +
                            "authentication."
                    },
                    remoteFetch: {
                        heading: "Remote Fetch",
                        subHeading: "Configure a remote repository to work seamlessly with WSO2 Identity Server."
                    }
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
        sidePanel: {
            applicationEdit: "Application Edit",
            applicationTemplates: "Application Templates",
            applications: "Applications",
            categories: {
                application: "Applications",
                general: "General",
                gettingStarted: "Getting Started",
                identityProviders: "Identity Providers"
            },
            customize: "Customize",
            identityProviderEdit: "Identity Providers Edit",
            identityProviderTemplates: "Identity Provider Templates",
            identityProviders: "Identity Providers",
            oidcScopes: "OIDC Scopes",
            oidcScopesEdit: "OIDC Scopes Edit",
            overview: "Overview",
            privacy: "Privacy",
            remoteRepo: "Remote Repo Config",
            remoteRepoEdit: "Remote Repo Config Edit"
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
        }
    },
    notifications: {
        endSession: {
            error: {
                description: "{{description}}",
                message: "Termination error"
            },
            genericError: {
                description: "Couldn't terminate the current session.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully terminated the current session.",
                message: "Termination successful"
            }
        },
        getProfileInfo: {
            error: {
                description: "{{description}}",
                message: "Retrieval error"
            },
            genericError: {
                description: "Couldn't retrieve user profile details.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully retrieved user profile details.",
                message: "Retrieval successful"
            }
        },
        getProfileSchema: {
            error: {
                description: "{{description}}",
                message: "Retrieval error"
            },
            genericError: {
                description: "Couldn't retrieve user profile schemas.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully retrieved user profile schemas.",
                message: "Retrieval successful"
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
        oidcScopes: {
            subTitle: "Create and manage OIDC scopes and the attributes bound to the scopes.",
            title: "OIDC Scopes"
        },
        oidcScopesEdit: {
            backButton: "Go back to scopes",
            subTitle: "Add or remove OIDC attributes of the scope",
            title: "Edit scope: {{ name }}"
        },
        overview: {
            subTitle: "Configure and  manage applications, identity providers, users and roles, attribute dialects, " +
                "etc.",
            title: "Welcome, {{firstName}}"
        }
    },
    componentExtensions: {
        component: {
            application: {
                quickStart: {
                    title: "Quick Start"
                }
            }
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
        accessDenied: {
            action: "Continue logout",
            subtitles: {
                0: "It seems like you don't have permission to use this portal.",
                1: "Please sign in with a different account."
            },
            title: "You are not authorized"
        },
        consentDenied: {
            action: "Continue logout",
            subtitles: {
                0: "It seems like you have not given consent for this application.",
                1: "Please give consent to use the application."
            },
            title: "You have denied consent"
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
        unauthorized: {
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
    },
    technologies: {
        android: "Android",
        angular: "Angular",
        ios: "iOS",
        java: "Java",
        python: "Python",
        react: "React",
        windows: "Windows"
    }
};
