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

import { ConsoleNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
export const console: ConsoleNS = {
    common: {
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
        cookieConsent: {
            confirmButton: "Got It",
            content: "We use cookies to ensure that you get the best overall experience. These cookies are used to " +
                "maintain an uninterrupted continuous session while providing smooth and personalized services. To " +
                "learn more about how we use cookies, refer our <1>Cookie Policy</1>."
        },
        dateTime: {
            humanizedDateString: "Last modified {{date}} ago"
        },
        header: {
            appSwitch: {
                console: {
                    description: "Manage as developers or administrators",
                    name: "Console"
                },
                myAccount: {
                    description: "Manage your own account",
                    name: "My Account"
                },
                tooltip: "Apps"
            },
            organizationSwitch: {
                emptyOrgListMessage: "No organizations available",
                orgSearchPlaceholder: "Search by organization name"
            }
        },
        modals: {
            editAvatarModal: {
                content: {
                    gravatar: {
                        errors: {
                            noAssociation: {
                                content: "It seems like the selected email is not registered on Gravatar. " +
                                    "Sign up for a Gravatar account by visiting Gravatar official website or use " +
                                    "one of the following.",
                                header: "No matching Gravatar image found!"
                            }
                        },
                        heading: "Gravatar based on "
                    },
                    hostedAvatar: {
                        heading: "Hosted Image",
                        input: {
                            errors: {
                                http: {
                                    content: "The selected URL points to an insecure image served over HTTP. " +
                                        "Please proceed with caution.",
                                    header: "Insecure Content!"
                                },
                                invalid: {
                                    content: "Please enter a valid image URL"
                                }
                            },
                            hint: "Enter a valid image URL which is hosted on a third party location.",
                            placeholder: "Enter URL for the image.",
                            warnings: {
                                dataURL: {
                                    content: "Using Data URLs with large character count might result in database " +
                                        "issues. Proceed with caution.",
                                    header: "Double check the entered Data URL!"
                                }
                            }
                        }
                    },
                    systemGenAvatars: {
                        heading: "System generated avatar",
                        types: {
                            initials: "Initials"
                        }
                    }
                },
                description: null,
                heading: "Update Profile Picture",
                primaryButton: "Save",
                secondaryButton: "Cancel"
            },
            sessionTimeoutModal: {
                description: "When you click on <1>Go back</1>, we will try to recover the session if " +
                    "it exists. If you don't have an active session, you will be redirected to the login page.",
                heading: "It looks like you have been inactive for a long time.",
                loginAgainButton: "Login again",
                primaryButton: "Go back",
                secondaryButton: "Logout",
                sessionTimedOutDescription: "Please log in again to continue from where you left off.",
                sessionTimedOutHeading: "User session has expired due to inactivity."
            }
        },
        notifications: {
            invalidPEMFile: {
                error: {
                    description: "{{ description }}",
                    message: "Decoding Error"
                },
                genericError: {
                    description: "An error occurred while decoding the certificate.",
                    message: "Decoding Error"
                },
                success: {
                    description: "Successfully decoded the certificate file.",
                    message: "Decoding Successful"
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
            brokenPage: {
                action: "Refresh the page",
                subtitles: {
                    0: "Something went wrong while displaying this page.",
                    1: "See the browser console for technical details."
                },
                title: "Something went wrong"
            },
            consentDenied: {
                action: "Continue logout",
                subtitles: {
                    0: "It seems like you have not given consent for this application.",
                    1: "Please give consent to use the application."
                },
                title: "You have denied consent"
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
            sessionStorageDisabled: {
                subtitles: {
                    0: "To use this application, you have to enable cookies in your web browser settings.",
                    1: "For more information on how to enable cookies, see the help section of your web browser."
                },
                title: "Cookies are disabled in your browser."
            },
            unauthorized: {
                action: "Continue logout",
                subtitles: {
                    0: "It seems like you don't have permission to use this portal.",
                    1: "Please sign in with a different account."
                },
                title: "You are not authorized"
            }
        },
        privacy: {
            about: {
                description: "WSO2 Identity Server (referred to as “WSO2 IS” within this policy) is an open " +
                    "source Identity Management and Entitlement Server that is based on open standards and " +
                    "specifications.",
                heading: "About WSO2 Identity Server"
            },
            privacyPolicy: {
                collectionOfPersonalInfo: {
                    description: {
                        list1: {
                            0: "WSO2 IS uses your IP address to detect any suspicious login attempts to your" +
                                " account.",
                            1: "WSO2 IS uses attributes like your first name, last name, etc., to provide a " +
                                "rich and personalized user experience.",
                            2: "WSO2 IS uses your security questions and answers only to allow account recovery."
                        },
                        para1: "WSO2 IS collects your information only to serve your access requirements." +
                            " For example:"
                    },
                    heading: "Collection of personal information",
                    trackingTechnologies: {
                        description: {
                            list1: {
                                0: "Collecting information from the user profile page where you enter your " +
                                    "personal data.",
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
                    para1: "This policy describes how WSO2 IS captures your personal information, the " +
                        "purposes of collection, and information about the retention of your personal information.",
                    para2: "Please note that this policy is for reference only, and is applicable for " +
                        "the software as a product. WSO2 Inc. and its developers have no access to the " +
                        "information held within WSO2 IS. Please see the <1>disclaimer</1> section for " +
                        "more information.",
                    para3: "Entities, organizations or individuals controlling the use and administration " +
                        "of WSO2 IS should create their own privacy policies setting out the manner in which " +
                        "data is controlled or processed by the respective entity, organization or individual."
                },
                disclaimer: {
                    description: {
                        list1: {
                            0: "WSO2, its employees, partners, and affiliates do not have access to and do not " +
                                "require, store, process or control any of the data, including personal data " +
                                "contained in WSO2 IS. All data, including personal data is controlled and " +
                                "processed by the entity or individual running WSO2 IS. WSO2, its employees " +
                                "partners and affiliates are not a data processor or a data controller within " +
                                "the meaning of any data privacy regulations. WSO2 does not provide any " +
                                "warranties or undertake any responsibility or liability in connection with " +
                                "the lawfulness or the manner and purposes for which WSO2 IS is used by " +
                                "such entities or persons.",
                            1: "This privacy policy is for the informational purposes of the entity or persons " +
                                "running WSO2 IS and sets out the processes and functionality contained within " +
                                "WSO2 IS regarding personal data protection. It is the responsibility of " +
                                "entities and persons running WSO2 IS to create and administer its own rules " +
                                "and processes governing users' personal data, and such rules and processes " +
                                "may change the use, storage and disclosure policies contained herein. " +
                                "Therefore users should consult the entity or persons running WSO2 IS for its " +
                                "own privacy policy for details governing users' personal data."
                        }
                    },
                    heading: "Disclaimer"
                },
                disclosureOfPersonalInfo: {
                    description: "WSO2 IS only discloses personal information to the relevant applications (also " +
                        "known as Service Provider) that are registered with WSO2 IS. These applications are " +
                        "registered by the identity administrator of your entity or organization. Personal " +
                        "information is disclosed only for the purposes for which it was collected (or for a " +
                        "use identified as consistent with that purpose), as controlled by such Service " +
                        "Providers, unless you have consented otherwise or where it is required by law.",
                    heading: "Disclosure of personal information",
                    legalProcess: {
                        description: "Please note that the organization, entity or individual running WSO2 IS " +
                            "may be compelled to disclose your personal information with or without your consent " +
                            "when it is required by law following due and lawful process.",
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
                            para1: "Please contact WSO2 if you have any question or concerns regarding this " +
                                "privacy policy."
                        },
                        heading: "Contact us"
                    },
                    heading: "More information",
                    yourChoices: {
                        description: {
                            para1: "If you are already have a user account within WSO2 IS, you have the right to " +
                                "deactivate your account if you find that this privacy policy is unacceptable " +
                                "to you.",
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
                            para2: "WSO2 IS may keep hashed secrets to provide you with an added level of " +
                                "security. This includes:"
                        },
                        heading: "How long your personal information is retained"
                    },
                    requestRemoval: {
                        description: {
                            para1: "You can request the administrator to delete your account. The " +
                                "administrator is the administrator of the organization you are registered under, or " +
                                "the super-administrator if you do not use the organization feature.",
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
                            2: "Derive statistical data for analytical purposes on system performance " +
                                "improvements. WSO2 IS will not keep any personal information after statistical" +
                                " calculations. Therefore, the statistical report has no means of identifying " +
                                "an individual person."
                        },
                        para1: "WSO2 IS will only use your personal information for the purposes for which it" +
                            " was collected (or for a use identified as consistent with that purpose).",
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
                            0: "Your username (except in cases where the username created by your employer is " +
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
                        para1: "WSO2 IS considers anything related to you, and by which you may be identified, " +
                            "as your personal information. This includes, but is not limited to:",
                        para2: "However, WSO2 IS also collects the following information that is not considered " +
                            "personal information, but is used only for <1>statistical</1> purposes. The reason " +
                            "for this is that this information can not be used to track you."
                    },
                    heading: "What is personal information?"
                }
            }
        },
        sidePanel: {
            privacy: "Privacy"
        },
        validations: {
            inSecureURL: {
                description: "The entered URL is a non-TLS URL. Please proceed with caution.",
                heading: "Insecure URL"
            },
            unrecognizedURL: {
                description: "The entered URL is neither HTTP nor HTTPS. Please proceed with caution.",
                heading: "Unrecognized URL"
            }
        }
    },
    develop: {
        componentExtensions: {
            component: {
                application: {
                    quickStart: {
                        title: "Quick Start"
                    }
                }
            }
        },
        features: {
            URLInput: {
                withLabel: {
                    negative: {
                        content: "You need to enable CORS for the origin of this URL to make requests" +
                            " to {{productName}} from a browser.",
                        detailedContent: {
                            0: "",
                            1: ""
                        },
                        header: "CORS is not Allowed for",
                        leftAction: "Allow"
                    },
                    positive: {
                        content: "The origin of this URL is allowed to make requests to " +
                            "{{productName}} APIs from a browser.",
                        detailedContent: {
                            0: "",
                            1: ""
                        },
                        header: "CORS is Allowed for"
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
                                    heading: "Authorized redirect URIs"
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
                                placeholder: "Enter value to search"
                            }
                        }
                    },
                    placeholder: "Search by application name"
                },
                confirmations: {
                    addSocialLogin: {
                        content : "To add a new social login, we will need to route you to a different page and " +
                            "any unsaved changes in this page will be lost. Please confirm.",
                        header: "Do you want to continue?",
                        subHeader: "You will lose any unsaved changes."
                    },
                    certificateDelete: {
                        assertionHint: "Please confirm your action.",
                        content: "N/A",
                        header: "Are you sure?",
                        message: "This action is irreversible and will permanently delete the certificate.",
                        primaryAction: "Delete",
                        secondaryAction: "Cancel"
                    },
                    changeProtocol: {
                        assertionHint: "Please type <1>{{ name }}</1> to confirm.",
                        content: "This action is irreversible and will permanently remove " +
                            "the current protocol configurations",
                        header: "Are you sure?",
                        message: "If you change to a different protocol, {{ name }} configurations " +
                            "will be removed. Please proceed with caution."
                    },
                    clientSecretHashDisclaimer: {
                        forms: {
                            clientIdSecretForm: {
                                clientId: {
                                    hide: "Hide ID",
                                    label: "Client ID",
                                    placeholder: "Client ID",
                                    show: "Show ID",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                },
                                clientSecret: {
                                    hide: "Hide secret",
                                    label: "Client secret",
                                    placeholder: "Client secret",
                                    show: "Show secret",
                                    validations: {
                                        empty: "This is a required field."
                                    }
                                }
                            }
                        },
                        modal: {
                            assertionHint: "",
                            content: "",
                            header: "OAuth Application Credentials",
                            message: "The consumer secret value will be displayed in plain text only once. " +
                                "Please make sure to copy and save it somewhere safe."
                        }
                    },
                    deleteApplication: {
                        assertionHint: "Please confirm your action.",
                        content: "This action is irreversible and will permanently delete the application.",
                        header: "Are you sure?",
                        message: "If you delete this application, authentication flows for this application will " +
                            "stop working. Please proceed with caution."
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
                    handlerAuthenticatorAddition: {
                        assertionHint: "Please type <1>{{ name }}</1> to confirm.",
                        content: "The authenticator you are trying to add is a handler. Make sure you add " +
                            "authenticators in other steps.",
                        header: "You are adding a Handler",
                        message: "This is a handler."
                    },
                    lowOIDCExpiryTimes: {
                        assertionHint: "Click Confirm to continue with your values.",
                        content: "This means that your tokens may expire too soon. Please recheck your values " +
                            "for the following configuration(s).",
                        header: "Are you sure?",
                        message: "You have entered a value less than 60 seconds for token expiry."
                    },
                    reactivateOIDC: {
                        assertionHint: "Please type <1>{{ id }}</1> to reactivate the application.",
                        content: "If you reactivate the application, a new client secret will be generated. " +
                            "Please update the application client secret on your client application.",
                        header: "Are you sure?",
                        message: ""
                    },
                    reactivateSPA: {
                        assertionHint: "Please type <1>{{ id }}</1> to reactivate the application.",
                        content: "If you reactivate the application, authentication flows for this " +
                            "application will start working. Please proceed with caution.",
                        header: "Are you sure?",
                        message: "This action can be reversed by revoking the client id later."
                    },
                    regenerateSecret: {
                        assertionHint: "Please type <1>{{ id }}</1> to regenerate the client secret.",
                        content: "If you regenerate the client secret, authentication flows using old client secret " +
                            "for this application will stop working. Please update the application client secret on " +
                            "your client application.",
                        header: "Are you sure?",
                        message: "This action is irreversible and permanently changes the client secret. " +
                            "Please proceed with caution."
                    },
                    removeApplicationUserAttribute: {
                        content : "If you confirm this action, the subject attribute will be set to the default " +
                            "attribute: <1>{{ default }}</1>",
                        header: "Are you sure?",
                        subHeader: "The attribute you are trying to remove is currently selected as the subject " +
                            "attribute."
                    },
                    removeApplicationUserAttributeMapping: {
                        content : "If you confirm this action, you have to select a new subject attribute",
                        header: "Are you sure?",
                        subHeader: "The attribute you are trying to remove is currently selected as the subject " +
                            "attribute."
                    },
                    revokeApplication: {
                        assertionHint: "Please type <1>{{ id }}</1> to confirm.",
                        content: "This action can be reversed by activating the application later.",
                        header: "Are you sure?",
                        message: "If you revoke this application, authentication flows for this application will " +
                            "stop working. Please proceed with caution."
                    }
                },
                dangerZoneGroup: {
                    deleteApplication: {
                        actionTitle: "Delete",
                        header: "Delete application",
                        subheader: "Once the application is deleted, it cannot be recovered and the clients " +
                            "using this application will no longer work."
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
                            protocolLanding: {
                                heading: "Which protocol are you using?",
                                subHeading: "Select the protocol for your application to connect."
                            },
                            tabName: "Protocol"
                        },
                        advanced: {
                            tabName: "Advanced"
                        },
                        attributes: {
                            attributeMappingChange: {
                                error: {
                                    description: "The mapped user attributes were changed to default values.",
                                    message: "User Attribute Mapping Changed"
                                }
                            },
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
                                    header: "Select User Attributes",
                                    steps: {
                                        select: {
                                            transfer: {
                                                headers: {
                                                    attribute: "Select All User Attributes"
                                                },
                                                searchPlaceholders: {
                                                    attribute: "Search user attribute",
                                                    role: "Search Role"
                                                }
                                            }
                                        }
                                    },
                                    subHeading: "Select which user attributes you want to share with the application."
                                },
                                attributeComponentHint: "Manage the user attributes you want to share with this " +
                                    "application via <1>OpenID Connect Scopes.</1> You can add new attributes " +
                                    "and mappings by navigating to <3>Attributes.</3>",
                                attributeComponentHintAlt: "Manage the user attributes you want to share with this" +
                                    " application. You can add new attributes and mappings by navigating to " +
                                    "<1>Attributes.</1>",
                                description: "Add the user attributes that are allowed to be shared with this " +
                                    "application.",
                                heading: "User Attribute Selection",
                                mandatoryAttributeHint: "Mark which user attributes are mandatory to be shared " +
                                    "with the application. At login, {{productName}} prompts the user to enter these " +
                                    "attribute values, if not already provided in the user's profile.",
                                mappingTable: {
                                    actions: {
                                        enable: "Enable mapping"
                                    },
                                    columns: {
                                        appAttribute: "Mapped user attribute",
                                        attribute: "User Attribute",
                                        mandatory: "Mandatory",
                                        requested: "Requested"
                                    },
                                    listItem: {
                                        actions: {
                                            makeMandatory: "Make mandatory",
                                            makeRequested: "Make requested",
                                            removeMandatory: "Remove mandatory",
                                            removeRequested: "Remove requested",
                                            subjectDisabledSelection: "This attribute is mandatory because it " +
                                                "is the subject attribute."
                                        },
                                        faultyAttributeMapping: "Missing OpenID Connect Attribute Mapping",
                                        faultyAttributeMappingHint: "Attribute value will not be shared to the" +
                                            " application at the user login.",
                                        fields: {
                                            claim: {
                                                label: "Please enter a value",
                                                placeholder: "eg: custom {{name}}, new {{name}}"
                                            }
                                        }
                                    },
                                    mappedAtributeHint: "Enter the custom attribute that should be requested " +
                                        "instead of the default attribute.",
                                    mappingRevert: {
                                        confirmPrimaryAction: "Confirm",
                                        confirmSecondaryAction: "Cancel",
                                        confirmationContent: "The mapped custom attributes will change  " +
                                            "back to the default attribute values. " +
                                            "Please proceed with caution since you will not be able to " +
                                            "retrieve the mapped custom attribute values.",
                                        confirmationHeading: "Are you sure?",
                                        confirmationMessage: "This action will revert mapped custom attribute " +
                                            "values to default values."
                                    },
                                    searchPlaceholder: "Search user attributes"
                                },
                                selectAll: "Select all attributes"
                            },
                            tabName: "User Attributes"
                        },
                        general: {
                            tabName: "General"
                        },
                        info: {
                            oidcHeading: "Server Endpoints",
                            oidcSubHeading: "The following server endpoints will be useful for you to implement and " +
                                "configure authentication for your application using OpenID Connect.",
                            samlHeading: "Identity Provider Details",
                            samlSubHeading: "The following IdP details will be useful for you to implement and " +
                                "configure authentication for your application using SAML 2.0.",
                            tabName: "Info"
                        },
                        provisioning: {
                            inbound: {
                                heading: "Inbound Provisioning",
                                subHeading: "Provision users or groups to a WSO2 Identity Server’s user store via " +
                                    "this application."
                            },
                            outbound: {
                                actions: {
                                    addIdp: "New Provisioner"
                                },
                                addIdpWizard: {
                                    errors: {
                                        noProvisioningConnector: "The selected provisioner doesn't have" +
                                            " any provisioning connectors."
                                    },
                                    heading: "Add Outbound Provisioner",
                                    steps: {
                                        details: "Provisioner Details"
                                    },
                                    subHeading: "Select the provisioner to provision users that self-register to" +
                                        " your application."
                                },
                                heading: "Outbound Provisioning",
                                subHeading: "Configure a provisioner to outbound provision the users of this " +
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
                                            accordion: {
                                                title: {
                                                    description: "Add conditions to your login flow.",
                                                    heading: "Conditional Authentication"
                                                }
                                            },
                                            conditionalAuthTour: {
                                                steps: {
                                                    0: {
                                                        content: {
                                                            0: "Define a script to dynamically modify the login " +
                                                                "flow based on the context",
                                                            1: "Click on the <1>Next</1> button to learn about the " +
                                                                "process."
                                                        },
                                                        heading: "Conditional Authentication"
                                                    },
                                                    1: {
                                                        content: {
                                                            0: "Click on this button to add the required " +
                                                                "authentication options to the step."
                                                        },
                                                        heading: "Add Authentication"
                                                    },
                                                    2: {
                                                        content: {
                                                            0: "Click here if you need to add more steps to the " +
                                                                "flow. Once you add a new step, <1>executeStep" +
                                                                "(STEP_NUMBER);</1> will appear on the script editor."
                                                        },
                                                        heading: "Add New Step"
                                                    }
                                                }
                                            },
                                            editor: {
                                                apiDocumentation: "API",
                                                changeConfirmation: {
                                                    content: "The selected template will replace the existing " +
                                                        "script in the editor as well as the login steps you " +
                                                        "configured. Click <1>Confirm</1> to proceed.",
                                                    heading: "Are you sure?",
                                                    message: "This action is irreversible."
                                                },
                                                goToApiDocumentation: "Go to API Documentation",
                                                resetConfirmation: {
                                                    content: "This action will reset the the existing script " +
                                                        "in the editor back to default. Click <1>Confirm</1> " +
                                                        "to proceed.",
                                                    heading: "Are you sure?",
                                                    message: "This action is irreversible."
                                                },
                                                templates: {
                                                    darkMode: "Dark Mode",
                                                    heading: "Templates"
                                                }
                                            },
                                            heading: "Script-based configuration",
                                            hint: "Define the authentication flow via an adaptive script. You can " +
                                                "select one of the templates fom the panel to get started.",
                                            secretsList: {
                                                create: "Create new secret",
                                                emptyPlaceholder: "No secrets available",
                                                search: "Search by secret name",
                                                tooltips: {
                                                    keyIcon: "Securely store access keys as secrets. A secret can " +
                                                        "replace the API key in <1>callChoreo()</1> function in the " +
                                                        "conditional authentication scripts.",
                                                    plusIcon: "Add to the script"
                                                }
                                            }
                                        },
                                        stepBased: {
                                            actions: {
                                                addAuthentication: "Add Authentication",
                                                addNewStep: "Add new step",
                                                addStep: "New Authentication Step",
                                                selectAuthenticator: "Select an Authenticator"
                                            },
                                            addAuthenticatorModal: {
                                                content: {
                                                    addNewAuthenticatorCard: {
                                                        title: "Configure New Identity Provider"
                                                    },
                                                    authenticatorGroups: {
                                                        basic: {
                                                            description: "Set of basic authenticators supported by " +
                                                                "{{productName}}.",
                                                            heading: "Basic"
                                                        },
                                                        enterprise: {
                                                            description: "Enterprise login via standard protocols.",
                                                            heading: "Enterprise login"
                                                        },
                                                        mfa: {
                                                            description: "Add additional layer of security to your " +
                                                                "login flow.",
                                                            heading: "Multi-factor"
                                                        },
                                                        social: {
                                                            description: "Use existing social login account.",
                                                            heading: "Social login"
                                                        }
                                                    },
                                                    goBackButton: "Go back to selection",
                                                    search: {
                                                        placeholder: "Search for Authenticators"
                                                    },
                                                    stepSelectDropdown: {
                                                        hint: "Select the step that you want to add authenticators to.",
                                                        label:  "Select step",
                                                        placeholder: "Select step"
                                                    }
                                                },
                                                description: null,
                                                heading: "Add Authentication",
                                                primaryButton: null,
                                                secondaryButton: null
                                            },
                                            authenticatorDisabled: "You need to configure this authenticator by " +
                                                "providing client id & secret, to use with your applications.",
                                            firstFactorDisabled: "Identifier First authenticator and Username & " +
                                                "Password authenticator cannot be added to the same step.",
                                            forms: {
                                                fields: {
                                                    attributesFrom: {
                                                        label: "Pick attributes from this step",
                                                        placeholder: "Select step"
                                                    },
                                                    subjectIdentifierFrom: {
                                                        label: "Pick user identifier from this step",
                                                        placeholder: "Select step"
                                                    }
                                                }
                                            },
                                            heading: "Step-based configuration",
                                            hint: "Create a user login flow by dragging authenticators on to the " +
                                                "relevant steps.",
                                            magicLinkDisabled: "You can only add the Magic Link authenticator " +
                                                "as a second step and only when Identifier First authenticator " +
                                                "is present in the first step.",
                                            secondFactorDisabled: "Second factor authenticators " +
                                                "can be used only if <1>User name and password " +
                                                "password</1>, <3>Social Login</3> or any other handler" +
                                                "which can handle these factors are" +
                                                "present in a previous step.",
                                            secondFactorDisabledDueToProxyMode: "To configure <1>{{auth}}</1>," +
                                                " you should enable the Just-in-Time provisioning" +
                                                " setting from the following Identity Providers.",
                                            secondFactorDisabledInFirstStep: "Second factor authenticators can " +
                                                "not be used in the first step."
                                        }
                                    }
                                },
                                customization: {
                                    heading: "Customize Sign-in Method",
                                    revertToDefaultButton: {
                                        hint: "Revert back to the default configuration (Username & Password)",
                                        label: "Revert to default"
                                    }
                                },
                                landing: {
                                    defaultConfig: {
                                        description: {
                                            0: "This application is configured with <1>Username & Password</1> Login",
                                            1: "Select one of the options available on the right side to begin " +
                                                "customizing."
                                        },
                                        heading: "This application is configured with Username & Password Login"
                                    },
                                    flowBuilder: {
                                        addMissingSocialAuthenticatorModal: {
                                            content: {
                                                body: "You do not have an active Social " +
                                                    "Connection configured with " +
                                                    "<1>{{authenticator}} Authenticator</1>. Click on the " +
                                                    "<3>Configure</3> button to register" +
                                                    " a new <5>{{authenticator}} " +
                                                    "Social Connection</5> or navigate to the <7>Connections</7>" +
                                                    " section manually.",
                                                message: "No active {{authenticator}} Social " +
                                                    "Connection configured"
                                            },
                                            description: "",
                                            heading: "Configure {{authenticator}} Social Connection",
                                            primaryButton: "Configure",
                                            secondaryButton: "Cancel"
                                        },
                                        duplicateSocialAuthenticatorSelectionModal: {
                                            content: {
                                                body: "You have multiple Social Connections configured with <1>" +
                                                    "{{authenticator}} Authenticator</1>. Select the desired one " +
                                                    "from the selection below to proceed.",
                                                message: "Multiple Social Connections found with {{authenticator}} " +
                                                    "Authenticator."
                                            },
                                            description: "",
                                            heading: "Select {{authenticator}} Social Connection",
                                            primaryButton: "Continue",
                                            secondaryButton: "Cancel"
                                        },
                                        heading: "Build your own login flow",
                                        headings: {
                                            default: "Default Login",
                                            multiFactorLogin: "Multi-factor Login",
                                            passwordlessLogin: "Passwordless Login",
                                            socialLogin: "Social Login"
                                        },
                                        types: {
                                            defaultConfig: {
                                                description: "Build your login flow starting with Username & "
                                                    + "Password login.",
                                                heading: "Start with default configuration"
                                            },
                                            facebook: {
                                                description: "Enable users to login with Facebook.",
                                                heading: "Add Facebook login"
                                            },
                                            github: {
                                                description: "Enable users to login with GitHub.",
                                                heading: "Add GitHub login"
                                            },
                                            google: {
                                                description: "Enable users to login with Google.",
                                                heading: "Add Google login"
                                            },
                                            magicLink: {
                                                description: "Enable users to log in using a magic "
                                                    + "link sent to their email.",
                                                heading: "Add Magic Link login",
                                                warning: "You can only use Identifier First authenticator with the " +
                                                    "Magic Link authenticator. Using it with any other authenticator " +
                                                    "can lead to unexpected behavior."
                                            },
                                            totp: {
                                                description: "Enable additional authentication layer with Time "
                                                    + "based OTP.",
                                                heading: "Add TOTP as a second factor"
                                            },
                                            usernameless: {
                                                description: "Enable users to log in using a FIDO2 security key "
                                                    + "or biometrics.",
                                                heading: "Add Security Key/Biometrics login",
                                                info: "To sign in with passwordless login, your users "
                                                    + "should have their FIDO2 security keys or biometrics "
                                                    + "registered via My Account."
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
                            tabName: "Sign-in Method"
                        }
                    }
                },
                forms: {
                    advancedAttributeSettings: {
                        sections: {
                            role: {
                                fields: {
                                    role: {
                                        hint: "This option will append the user store domain that the user resides to" +
                                            " role",
                                        label: "Include user domain",
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
                                        hint: "Select which of the shared attributes you want to use as the" +
                                            " subject identifier of the user",
                                        hintOIDC: "Select which of the shared attributes you want to use as the" +
                                            " subject identifier of the user. This represents the <1>sub</1> claim of" +
                                            " the <1>id_token</1>.",
                                        hintSAML: "Select which of the shared attributes you want to use as the" +
                                            " subject identifier of the user. This represents the <1>subject</1>" +
                                            " element of the SAML assertion.",
                                        label: "Subject attribute",
                                        validations: {
                                            empty: "Select the subject attribute"
                                        }
                                    },
                                    subjectIncludeTenantDomain: {
                                        hint: "This option will append the organization name to the local subject " +
                                            " identifier",
                                        label: "Include organization name",
                                        validations: {
                                            empty: "This is a required field."
                                        }
                                    },
                                    subjectIncludeUserDomain: {
                                        hint: "This option will append the user store domain that the user resides " +
                                            " in the local subject identifier",
                                        label: "Include user domain",
                                        validations: {
                                            empty: "This is a required field."
                                        }
                                    },
                                    subjectUseMappedLocalSubject: {
                                        hint: "This option will use the local subject identifier when asserting " +
                                            "the identity",
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
                                hint: "Decides whether authorization policies needs to be engaged during " +
                                    " authentication flows.",
                                label: "Enable authorization",
                                validations: {
                                    empty: "This is a required field."
                                }
                            },
                            returnAuthenticatedIdpList: {
                                hint: " The list of authenticated Identity Providers will be returned in the " +
                                    "authentication response.",
                                label: "Return authenticated IDP list",
                                validations: {
                                    empty: "This is a required field."
                                }
                            },
                            saas: {
                                hint: "By default, applications can only be used by users belonging to the " +
                                    "application's organization. If this application is SaaS-enabled, it will be " +
                                    "accessible to all users across all organizations.",
                                label: "SaaS application",
                                validations: {
                                    empty: "This is a required field."
                                }
                            },
                            skipConsentLogin: {
                                hint: "Once enabled, the page prompt for obtaining user consent will " +
                                    "be skipped for this application during sign in.",
                                label: "Skip login consent",
                                validations: {
                                    empty: "This is a required field."
                                }
                            },
                            skipConsentLogout: {
                                hint: "Once enabled, the page prompt for obtaining user consent will " +
                                    "be skipped for this application during sign out.",
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
                                        description: "The URL used to obtain a JWKS public key.",
                                        label: "URL",
                                        placeholder: "https://myapp.io/jwks",
                                        validations: {
                                            empty: "This is a required field.",
                                            invalid: "Enter a valid URL"
                                        }
                                    },
                                    pemValue: {
                                        actions: {
                                            view: "View certificate info"
                                        },
                                        description: "The text value of the certificate in PEM format.",
                                        hint: "The certificate (in PEM format) of the application.",
                                        label: "Certificate",
                                        placeholder: "Certificate in PEM format.",
                                        validations: {
                                            empty: "This is a required field.",
                                            invalid: "Enter a valid certificate in PEM format"
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
                                heading: "Certificate",
                                hint: {
                                    customOidc: "This certificate is used to encrypt the <1>id_token</1>" +
                                        " returned after the authentication.",
                                    customSaml: "This certificate is used to validate the signatures of the " +
                                        "signed requests and to encrypt the SAML assertions returned after " +
                                        "authentication."
                                }
                            }
                        }
                    },
                    generalDetails: {
                        fields: {
                            accessUrl: {
                                hint: "The landing page URL for this application. It will be used in the application" +
                                    " catalog and discovery flows. If the login page times out, the user will " +
                                    "be redirected to the client application via this URL.",
                                label: "Access URL",
                                placeholder: "https://myapp.io/home",
                                validations: {
                                    empty: "A valid access URL must be provided to make this application discoverable.",
                                    invalid: "Enter a valid URL"
                                }
                            },
                            description: {
                                label: "Description",
                                placeholder: "Enter a description for the application"
                            },
                            discoverable: {
                                hint: "If enabled, customers can access this application from the " +
                                    "<1>{{ myAccount }}</1> portal.",
                                label: "Discoverable application"
                            },
                            imageUrl: {
                                hint: "An image URL for the application. If this is not provided, we will display " +
                                    "a generated thumbnail instead. Recommended size: 200x200 pixels.",
                                label: "Logo",
                                placeholder: "https://myapp-resources.io/my_app_image.png",
                                validations: {
                                    invalid: "This is not a valid image URL"
                                }
                            },
                            isManagementApp: {
                                hint: "Enable to allow the application to access management API of this organization.",
                                label: "Management Application"
                            },
                            name: {
                                label: "Name",
                                placeholder: "My App",
                                validations: {
                                    duplicate: "There is already an application with this name. " +
                                        "Please enter a different name.",
                                    empty: "Application name is required."
                                }
                            }
                        },
                        managementAppBanner: "The application is allowed to access the management APIs of this " +
                            "organization."
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
                        description: "Given below are the {{protocol}} settings for your application.",
                        documentation: "Read through our <1>documentation</1> to learn more about using " +
                            "<3>{{protocol}}</3> protocol to implement login in your applications.",
                        fields: {
                            allowedOrigins: {
                                hint: "Allowed origins are URLs that will be allowed to make requests from cross " +
                                    "origins to {{productName}} APIs",
                                label: "Allowed origins",
                                placeholder: "https://myapp.io",
                                validations: {
                                    empty: "Please add a valid origin."
                                }
                            },
                            callBackUrls: {
                                hint: "The authorized redirect URL determines where the authorization code is sent " +
                                    "to upon user authentication, and where the user is redirected to upon user " +
                                    "logout. The client app should specify the authorized redirect URL in the " +
                                    "authorization or logout request and {{productName}} will validate it against " +
                                    "the authorized redirect URLs entered here.",
                                info: "Don’t have an app? Try out a sample app using {{callBackURLFromTemplate}} " +
                                    "as the authorized redirect URL. (You can download and run a sample at a " +
                                    "later step.)",
                                label: "Authorized redirect URLs",
                                placeholder: "https://myapp.io/login",
                                validations: {
                                    empty: "This is a required field.",
                                    invalid: "The entered URL is neither HTTP nor HTTPS. Please add a valid URL.",
                                    required: "This field is required for a functional app. " +
                                        "However, if you are planning to try the sample app, " +
                                        "this field can be ignored."
                                }
                            },
                            clientID: {
                                label: "Client ID"
                            },
                            clientSecret: {
                                hashedDisclaimer: "Client secret is hashed. If you need to retrieve it, " +
                                    "please regenerate the secret again.",
                                hideSecret: "Hide secret",
                                label: "Client secret",
                                message: "{{productName}} does not issue a <1>client_secret</1> " +
                                    "to native " +
                                    "applications or web browser-based applications for the purpose " +
                                    "of client authentication.",
                                placeholder: "Enter Client Secret",
                                showSecret: "Show secret",
                                validations: {
                                    empty: "This is a required field."
                                }
                            },
                            grant: {
                                children: {
                                    client_credential: {
                                        hint: "This grant type does not support the 'openid' scope.",
                                        label: "(openid scope not allowed)"
                                    },
                                    implicit: {
                                        hint: "This grant type is not recommended.",
                                        label: "{{grantType}} (Not recommended)"
                                    },
                                    password: {
                                        hint: "This grant type is not recommended.",
                                        label: "{{grantType}} (Not recommended)"
                                    }
                                },
                                hint: "This will determine how the application communicates with the token service.",
                                label: "Allowed grant types",
                                validation: {
                                    refreshToken:"Refresh token grant type should only be selected along with " +
                                        "grant types that provide a refresh token."
                                },
                                validations: {
                                    empty: "Select at least one grant type"
                                }
                            },
                            public: {
                                hint: "Allow the client to authenticate to {{productName}} without the client secret." +
                                    " Public clients such as applications running in a browser or on a mobile device" +
                                    " are unable to use registered client secrets. ",
                                label: "Public client",
                                validations: {
                                    empty: "This is a required field."
                                }
                            }
                        },
                        messages: {
                            customInvalidMessage: "Please enter a valid URI. Valid formats include HTTP, HTTPS, " +
                                "or private-use URI scheme.",
                            revokeDisclaimer: {
                                content: "The application has been revoked. Reactivate the application to allow " +
                                    "users to log in.",
                                heading: "Application is inactive"
                            }
                        },
                        sections: {
                            accessToken: {
                                fields: {
                                    applicationTokenExpiry: {
                                        hint: "Specify the validity period of the " +
                                            "<1>application_access_token</1> in seconds.",
                                        label: "Application access token expiry time",
                                        placeholder: "Enter the application access token expiry time",
                                        validations: {
                                            empty: "Please fill the application access token expiry time",
                                            invalid: "Application access token expiry time should be in seconds. " +
                                                "Decimal points and negative numbers are not allowed."
                                        }
                                    },
                                    bindingType: {
                                        children: {
                                            ssoBinding: {
                                                label: "SSO-session"
                                            }
                                        },
                                        description: "Select type <1>SSO-session</1> to allow {{productName}} to " +
                                            "bind the <3>access_token</3> and the <5>refresh_token</5> to the "+
                                            "login session and issue a new token per session. When the application " +
                                            "session ends, the tokens will also be revoked.",
                                        label: "Token binding type",
                                        valueDescriptions: {
                                            cookie: "Bind the access token to a cookie with Secure " +
                                                "and httpOnly parameters.",
                                            none: "No binding. {{productName}} will issue a new access token only " +
                                                "when the token expires or is revoked.",
                                            sso_session: "Binds the access token to the login session. " +
                                                "{{productName}} will issue a new access token for each new login " +
                                                "and revoke the token upon logout."
                                        }
                                    },
                                    expiry: {
                                        hint: "Specify the validity period of the <1>access_token</1> in seconds.",
                                        label: "User access token expiry time",
                                        labelForSPA: "Access token expiry time",
                                        placeholder: "Enter the user access token expiry time",
                                        validations: {
                                            empty: "Please fill the user access token expiry time",
                                            invalid: "Access token expiry time should be in seconds. " +
                                                "Decimal points and negative numbers are not allowed."
                                        }
                                    },
                                    revokeToken: {
                                        hint: "Allow revoking tokens of this application when a bound IDP session " +
                                            "gets terminated through a user logout.",
                                        label: "Revoke tokens upon user logout"
                                    },
                                    type: {
                                        label: "Token type",
                                        valueDescriptions: {
                                            "default": "Issue an opaque UUID as a token.",
                                            "jwt": "Issue a self-contained JWT token."
                                        }
                                    },
                                    validateBinding: {
                                        hint: "Validate the binding attributes at the token validation. The client " +
                                            "needs to present the <1>access_token</1> + cookie for successful "+
                                            "authorization.",
                                        label: "Validate token bindings"
                                    }
                                },
                                heading: "Access Token",
                                hint: " Configure the access token issuer, user access token expiry time, " +
                                    "application access token expiry time etc."
                            },
                            certificates: {
                                disabledPopup: "This certificate is used to encrypt the <1>id_token</1>." +
                                    " First, you need to disable <3>id_token</3> encryption to proceed."
                            },
                            idToken: {
                                fields: {
                                    algorithm: {
                                        hint: "The dropdown contains the supported <1>id_token</1> encryption "+
                                        "algorithms.",
                                        label: "Algorithm",
                                        placeholder: "Select Algorithm",
                                        validations: {
                                            empty: "This is a required field."
                                        }
                                    },
                                    audience: {
                                        hint: "Specify the recipient(s) that this <1>id_token</1> is intended for." +
                                        " By default, the client ID of this application is added as an audience.",
                                        label: "Audience",
                                        placeholder: "Enter Audience",
                                        validations: {
                                            duplicate: "Audience contains duplicate values",
                                            empty: "Please fill the audience",
                                            invalid: "Please avoid special characters like commas (,)"
                                        }
                                    },
                                    encryption: {
                                        hint: "Select to encrypt the <1>id_token</1> when issuing the token using the "+
                                        "public key of your application. To use encryption, configure the JWKS "+
                                        "endpoint or the certificate of your application in the Certificate "+
                                        "section below.",
                                        label: "Enable encryption",
                                        validations: {
                                            empty: "This is a required field."
                                        }
                                    },
                                    expiry: {
                                        hint: "Specify the validity period of the <1>id_token</1> in seconds.",
                                        label: "ID Token expiry time",
                                        placeholder: "Enter the id token expiry time",
                                        validations: {
                                            empty: "Please fill the id token expiry time",
                                            invalid: "ID token expiry time should be in seconds. " +
                                                "Decimal points and negative numbers are not allowed."
                                        }
                                    },
                                    method: {
                                        hint: "The dropdown contains the supported <1>id_token</1> encryption methods.",
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
                                        hint: "{{productName}} will directly communicate the logout requests to this " +
                                            "client URL, so that clients can invalidate the user session.",
                                        label: "Back channel logout URL",
                                        placeholder: "https://myapp.io/logout",
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
                                    }
                                },
                                heading: "PKCE"
                            },
                            pkce: {
                                description: "The default method used by {{productName}} to generate the challenge " +
                                    "is SHA-256. Only select \"Plain\" for constrained environments that can" +
                                    " not use the SHA-256 transformation.",
                                fields: {
                                    pkce: {
                                        children: {
                                            mandatory: {
                                                label: "Mandatory"
                                            },
                                            plainAlg: {
                                                label: "Support 'Plain' Transform Algorithm"
                                            }
                                        },
                                        label: "{{label}}",
                                        validations: {
                                            empty: "This is a required field."
                                        }
                                    }
                                },
                                heading: "PKCE",
                                hint: "Select to make it mandatory for the application to " +
                                "include a code_challenge in the authorization request."
                            },
                            refreshToken: {
                                fields: {
                                    expiry: {
                                        hint: "Specify the validity period of the <1>refresh_token</1> in seconds.",
                                        label: "Refresh token expiry time",
                                        placeholder: "Enter the refresh token expiry time",
                                        validations: {
                                            empty: "Please fill the refresh token expiry time",
                                            invalid: "Refresh token expiry time should be in seconds. " +
                                                "Decimal points and negative numbers are not allowed."
                                        }
                                    },
                                    renew: {
                                        hint: "Select to issue a new <1>refresh_token</1> each time a "+
                                            "<3>refresh_token</3> is " +
                                            "exchanged. The existing token will be invalidated.",
                                        label: "Renew refresh token",
                                        validations: {
                                            empty: "This is a required field."
                                        }
                                    }
                                },
                                heading: "Refresh Token"
                            },
                            requestObjectSignature: {
                                description: "{{productName}} supports receiving an OIDC authentication request as " +
                                    "a request object that is passed in a single, self-contained <1>request</1> " +
                                    "parameter. Enable signature validation to accept only signed request objects " +
                                    "in the authorization request.",
                                fields: {
                                    signatureValidation: {
                                        label: "Enable signature validation"
                                    }
                                },
                                heading: "Request Object"
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
                        description: "Given below are the SAML settings for your application.",
                        documentation: "Read through our <1>documentation</1> to learn more about using " +
                            "<3>{{protocol}}</3> protocol to implement login in your applications.",
                        fields: {
                            assertionURLs: {
                                hint: "The Assertion Consumer Service (ACS) URL determines where to " +
                                    "send the SAML response.",
                                info: "Don’t have an app? Try out a sample app using {{assertionURLFromTemplate}} " +
                                    "as the assertion consumer URL. (You can download and run a sample at a later" +
                                    " step.)",
                                label: "Assertion consumer service URLs",
                                placeholder: "Enter ACS URL",
                                validations: {
                                    empty: "This is a required field.",
                                    invalid: "The entered URL is neither HTTP nor HTTPS. Please add a valid URL.",
                                    required: "This field is required for a functional app. " +
                                        "However, if you are planning to try the sample app, " +
                                        "this field can be ignored."
                                }
                            },
                            defaultAssertionURL: {
                                hint: "If you have configured multiple ACS URLs, you must configure one as " +
                                    "the default. In case a SAML request from your application does not specify " +
                                    "the ACS URL, the response is sent to this URL.",
                                label: "Default assertion consumer service URL",
                                validations: {
                                    empty: "This is a required field."
                                }
                            },
                            idpEntityIdAlias: {
                                hint: "This value can override the default Identity Provider (IdP) entity ID " +
                                    "({{defaultIdpEntityID}}). The IdP entity ID is used as the <1>saml2:Issuer</1> " +
                                    " of the SAML response that is generated by {{productName}}. This should be a " +
                                    "valid URI/URL.",
                                label: "IdP entity ID alias",
                                placeholder: "Enter alias",
                                validations: {
                                    empty: "This is a required field.",
                                    invalid: "This should be a valid URI/URL."
                                }
                            },
                            issuer: {
                                errorMessage: "The issuer already exists.",
                                hint: "This specifies the unique identifier of the application. This is also the " +
                                    "<1>saml2:Issuer</1> value specified in the SAML authentication request issued " +
                                    "by the application.",
                                label: "Issuer",
                                placeholder: "Enter issuer",
                                validations: {
                                    empty: "Please provide the issuer"
                                }
                            },
                            metaURL: {
                                errorMessage: "The metadata URL is invalid",
                                hint: "URL for the meta file",
                                label: "Meta URL",
                                placeholder: "Enter the meta file url",
                                validations: {
                                    empty: "Please provide the meta file url",
                                    invalid: "Enter a valid URL"
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
                                hint: "This value is needed only if you have to configure multiple SAML Single " +
                                    "Sign-On (SSO) inbound authentication configurations for the same Issuer value. " +
                                    "Qualifier that is defined here will be appended to the issuer internally to " +
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
                                        hint: "This specifies the audiences of the SAML assertion. " +
                                            "The issuer of the application will be added as the default audience.",
                                        label: "Audiences",
                                        placeholder: "Enter audience",
                                        validations: {
                                            invalid: "Please add valid URI"
                                        }
                                    },
                                    nameIdFormat: {
                                        hint: "This specifies the name identifier format that is used to " +
                                            "exchange information regarding the user in the SAML assertion.",
                                        label: "Name ID format",
                                        placeholder: "Enter name ID format",
                                        validations: {
                                            empty: "This is a required field."
                                        }
                                    },
                                    recipients: {
                                        hint:  "This specifies recipients of the SAML assertion.",
                                        label: "Recipients",
                                        placeholder: "Enter recipient",
                                        validations: {
                                            invalid: "Please add valid URI"
                                        }
                                    }
                                },
                                heading: "Assertion"
                            },
                            attributeProfile: {
                                fields: {
                                    enable: {
                                        hint: "This specifies whether to include the user’s attributes in the " +
                                            "SAML assertions as part of the attribute statement.",
                                        label: "Enable attribute profile"
                                    },
                                    includeAttributesInResponse: {
                                        hint: "Once you select the checkbox to Include Attributes in the Response " +
                                            "Always, the identity provider always includes the attribute values " +
                                            "related to the selected claims in the SAML attribute statement.",
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
                            certificates: {
                                disabledPopup: "Make sure request signature validation and" +
                                    " assertion encryption are disabled to proceed."
                            },
                            encryption: {
                                fields: {
                                    assertionEncryption: {
                                        hint: "Select to encrypt the SAML2 Assertions returned after authentication. " +
                                            "To use encryption configure the certificate of your application" +
                                            " in the Certificate section below.",
                                        label: "Enable encryption",
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
                                        hint: "This specifies whether the application supports IdP initiated logout.",
                                        label: "Enable",
                                        validations: {
                                            empty: "This is a required field."
                                        }
                                    },
                                    returnToURLs: {
                                        hint: "This specifies the URLs to which the user should be redirected " +
                                            "after the logout.",
                                        label: "Return to URLs",
                                        placeholder: "Enter URL",
                                        validations: {
                                            invalid: "Please add valid URL"
                                        }
                                    }
                                },
                                heading: "IdP initiated single logout"
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
                                        hint: "This specifies whether {{productName}} must validate the " +
                                            "signature of the SAML authentication request and the SAML logout " +
                                            "request that are sent by the application.",
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
                                        hint: "This specifies whether the SAML responses generated by " +
                                            "{{productName}} should be signed.",
                                        label: "Sign SAML responses"
                                    },
                                    signingAlgorithm: {
                                        label: "Signing algorithm",
                                        validations: {
                                            empty: "This is a required field."
                                        }
                                    }
                                },
                                heading: "Response Signing"
                            },
                            sloProfile: {
                                fields: {
                                    enable: {
                                        hint: "This specifies whether the application supports Single Logout (SLO) " +
                                            "profile.",
                                        label: "Enable SLO",
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
                                        hint: "This specifies the endpoint of the application to where the " +
                                            "single logout request should be sent. If you do not specify this " +
                                            "URL, {{productName}} will use the ACS URL.",
                                        label: "Single logout request URL",
                                        placeholder: "Enter single logout request URL",
                                        validations: {
                                            empty: "This is a required field.",
                                            invalid: "Enter a valid URL"
                                        }
                                    },
                                    responseURL: {
                                        hint: "This specifies the endpoint of the application to where the " +
                                            "single logout response should be sent. If you do not specify this " +
                                            "URL, {{productName}} will use the ACS URL.",
                                        label: "Single logout response URL",
                                        placeholder: "Enter single logout response URL",
                                        validations: {
                                            empty: "This is a required field.",
                                            invalid: "Enter a valid URL"
                                        }
                                    }
                                },
                                heading: "Single Logout Profile"
                            },
                            ssoProfile: {
                                fields: {
                                    artifactBinding: {
                                        hint: "This specifies whether the artifact resolve request signature " +
                                            "should be validated against the application certificate. If you enable " +
                                            "this option, make sure to provide the application certificate below.",
                                        label: "Enable signature validation for artifact binding"
                                    },
                                    bindings: {
                                        hint: "This specifies the mechanisms to transport SAML messages in " +
                                            "communication protocols.",
                                        label: "Bindings",
                                        validations: {
                                            empty: "This is a required field."
                                        }
                                    },
                                    idpInitiatedSSO: {
                                        hint: "This specifies whether to initiate Single Sign-On (SSO) from the " +
                                            "IdP instead of the application.",
                                        label: "Enable IdP initiated SSO",
                                        validations: {
                                            empty: "This is a required field."
                                        }
                                    }
                                },
                                heading: "Single Sign-On Profile"
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
                                    invalid: "Enter a valid URL"
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
                                    invalid: "Enter a valid URL"
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
                                hint: "Select user store domain name to provision users and groups.",
                                label: "Provisioning user store domain"
                            }
                        }
                    },
                    spaProtocolSettingsWizard:{
                        fields: {
                            callBackUrls: {
                                label: "Authorized redirect URLs",
                                validations: {
                                    empty: "This is a required field.",
                                    invalid: "The entered URL is neither HTTP nor HTTPS. Please add a valid URL."
                                }
                            },
                            name: {
                                label: "Name",
                                validations: {
                                    invalid: "{{appName}} is not a valid name. It can contain up to " +
                                        "{{characterLimit}} characters, including alphanumerics, periods (.), " +
                                        "dashes (-), underscores (_) and spaces."
                                }
                            }
                        }
                    }
                },
                helpPanel: {
                    tabs: {
                        configs: {
                            content: {
                                subTitle: "Update the pre defined configurations through the template or add new " +
                                    "configurations depending on the protocol (OIDC, SAML, WS-Trust, etc.) " +
                                    "configured for the application.",
                                title: "Application Configurations"
                            },
                            heading: "Configurations Guide"
                        },
                        docs: {
                            content: null,
                            heading: "Docs"
                        },
                        samples: {
                            content: {
                                sample: {
                                    configurations: {
                                        btn: "Download the Configuration",
                                        subTitle: "In order to integrate the application created in the server with " +
                                            "the sample application, you need to initialise the client with " +
                                            "following configurations.",
                                        title: "Initialize the client"
                                    },
                                    downloadSample: {
                                        btn: "Download the sample",
                                        subTitle: "This sample application will show case the usage of the of WSO2 " +
                                            "Identity Server SDK and how you can integrate any application with " +
                                            "Identity Server.",
                                        title: "Try out the sample"
                                    },
                                    goBack: "Go back",
                                    subTitle: "Quickly start prototyping by downloading our preconfigured sample " +
                                        "application.",
                                    title: "Sample Applications"
                                },
                                technology: {
                                    subTitle: "Sample and required SDKs along with useful information will be " +
                                        "provided once you select a technology",
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
                        },
                        start: {
                            content: {
                                endpoints: {
                                    subTitle: "If you implement your application without using a WSO2 SDK, the " +
                                        "following server endpoints will be useful for you to implement " +
                                        "authentication for the app.",
                                    title: "Server endpoints"
                                },
                                oidcConfigurations: {
                                    labels: {
                                        authorize: "Authorize",
                                        endSession: "Logout",
                                        introspection: "Introspection",
                                        issuer: "Issuer",
                                        jwks: "JWKS",
                                        keystore: "Key Set",
                                        revoke: "Revoke",
                                        token: "Token",
                                        userInfo: "UserInfo",
                                        wellKnown: "Discovery"
                                    }
                                },
                                samlConfigurations: {
                                    buttons: {
                                        certificate: "Download Certificate",
                                        metadata: "Download IdP Metadata"
                                    },
                                    labels: {
                                        certificate: "IdP certificate",
                                        issuer: "Issuer",
                                        metadata: "IdP Metadata",
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
                                    subTitle: "Install and use our SDKs to integrate authentication to your " +
                                        "application with minimum number of code lines.",
                                    title: "Integrate your own app"
                                }
                            },
                            heading: "What's Next?"
                        }
                    }
                },
                list: {
                    actions: {
                        add: "New Application",
                        custom: "Custom",
                        predefined: "Use Predefined"
                    },
                    columns: {
                        actions: "Actions",
                        name: "Name"
                    }
                },
                myaccount: {
                    description: "Self-service portal for your users.",
                    popup: "Share this link with your users to allow access to My Account" +
                    " and to manage their accounts.",
                    title: "My Account"
                },
                notifications: {
                    addApplication: {
                        error: {
                            description: "{{description}}",
                            message: "Creation error"
                        },
                        genericError: {
                            description: "Failed to create the application.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully created the application.",
                            message: "Creation successful"
                        }
                    },
                    apiLimitReachedError: {
                        error: {
                            description: "You have reached the maximum number of applications allowed.",
                            message: "Failed to create the application"
                        }
                    },
                    authenticationStepDeleteErrorDueToSecondFactors: {
                        genericError: {
                            description: "Second factor authenticators require having a Username & "
                                + "Password authenticator in a prior step.",
                            message: "Step cannot be deleted"
                        }
                    },
                    authenticationStepMin: {
                        genericError: {
                            description: "At least one authentication step is required.",
                            message: "Step cannot be deleted"
                        }
                    },
                    conditionalScriptLoopingError: {
                        description: "Looping constructs such as <1>for</1>, <3>while</3>, and"
                            + " <5>forEach</5> are not allowed in the conditional authentication" + " script.",
                        message: "Failed to update the script"
                    },
                    deleteApplication: {
                        error: {
                            description: "{{description}}",
                            message: "Removal Error"
                        },
                        genericError: {
                            description: "Failed to delete the application.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully deleted the application.",
                            message: "Application deleted"
                        }
                    },
                    deleteCertificateGenericError: {
                        description: "Something went wrong. We were unable to delete the application certificate.",
                        message: "Failed to update the application"
                    },
                    deleteCertificateSuccess: {
                        description: "Successfully deleted the application certificate.",
                        message: "Deleted certificate"
                    },
                    deleteOptionErrorDueToSecondFactorsOnRight: {
                        error: {
                            description: "{{description}}",
                            message: "Cannot delete this authenticator"
                        },
                        genericError: {
                            description: "There are authenticators in other steps that depend on "
                                + "this authenticator.",
                            message: "Cannot delete this authenticator"
                        },
                        success: {
                            description: "Successfully deleted the authenticator from step {{stepNo}}.",
                            message: "Delete successful"
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
                            message: "Configurations deleted"
                        }
                    },
                    duplicateAuthenticationStep: {
                        genericError: {
                            description: "The same authenticator is not allowed more than once in a single step.",
                            message: "Not allowed"
                        }
                    },
                    emptyAuthenticationStep: {
                        genericError: {
                            description: "There are empty authentication steps. Please remove them or add "
                                + "authenticators to proceed.",
                            message: "Update error"
                        }
                    },
                    fetchAllowedCORSOrigins: {
                        error: {
                            description: "{{description}}",
                            message: "Retrieval error"
                        },
                        genericError: {
                            description: "Couldn't retrieve allowed CORS Origins.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully retrieved allowed CORS Origins.",
                            message: "Retrieval successful"
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
                            description: "An error occurred while retrieving the custom inbound protocols.",
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
                            description: "An error occurred while retrieving the available inbound protocols.",
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
                            description: "An error occurred while retrieving the IDP configurations for the OIDC "
                                + "application.",
                            message: "Retrieval error"
                        },
                        success: {
                            description: "Successfully retrieved the IDP configurations for the OIDC application.",
                            message: "Retrieval successful"
                        }
                    },
                    fetchOIDCServiceEndpoints: {
                        genericError: {
                            description: "An error occurred while retrieving the server endpoints for "
                                + "OIDC applications.",
                            message: "Something went wrong"
                        }
                    },
                    fetchProtocolMeta: {
                        error: {
                            description: "{{description}}",
                            message: "Retrieval error"
                        },
                        genericError: {
                            description: "An error occurred while retrieving the protocol metadata.",
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
                            description: "An error occurred while retrieving the IDP configurations for the SAML"
                                + " application.",
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
                            description: "An error occurred while retrieving application template data.",
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
                    firstFactorAuthenticatorToSecondStep: {
                        genericError: {
                            description: "This authenticator can only be added to the first step.",
                            message: "Cannot add to this step"
                        }
                    },
                    getInboundProtocolConfig: {
                        error: {
                            description: "{{description}}",
                            message: "Retrieval error"
                        },
                        genericError: {
                            description: "An error occurred while retrieving the protocol configurations.",
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
                            description: "An error occurred while regenerating the application.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully regenerated the application.",
                            message: "Regenerate successful"
                        }
                    },
                    revokeApplication: {
                        error: {
                            description: "{{description}}",
                            message: "Revoke error"
                        },
                        genericError: {
                            description: "An error occurred while revoking the application.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully revoked the application.",
                            message: "Revoke successful"
                        }
                    },
                    secondFactorAuthenticatorToFirstStep: {
                        genericError: {
                            description: "Second factor authenticators require having a basic "
                                + "authenticator in a prior step.",
                            message: "Cannot add to this step"
                        }
                    },
                    tierLimitReachedError: {
                        emptyPlaceholder: {
                            action: "View Plans",
                            subtitles: "You can contact the organization administrator or (if you are the " +
                                "administrator) upgrade your subscription to increase the allowed limit.",
                            title: "You have reached the maximum number of apps allowed " +
                                "for this organization."
                        },
                        heading: "You’ve reached the maximum limit for apps"
                    },
                    updateAdvancedConfig: {
                        error: {
                            description: "{{description}}",
                            message: "Update error"
                        },
                        genericError: {
                            description: "An error occurred while retrieving the advanced configurations.",
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
                            description: "Failed to update the application.",
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
                            description: "An error occurred while updating the authentication flow of the application.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully updated the authentication flow of the application.",
                            message: "Update successful"
                        }
                    },
                    updateClaimConfig: {
                        error: {
                            description: "{{description}}",
                            message: "Update error"
                        },
                        genericError: {
                            description: "An error occurred while updating the attribute settings.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully updated the attribute settings.",
                            message: "Update successful"
                        }
                    },
                    updateInboundProtocolConfig: {
                        error: {
                            description: "{{description}}",
                            message: "Update error"
                        },
                        genericError: {
                            description: "An error occurred while updating the inbound protocol configurations.",
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
                            message: "Update error"
                        },
                        genericError: {
                            description: "An error occurred while updating the provisioning configurations.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully updated the provisioning configurations.",
                            message: "Update successful"
                        }
                    },
                    updateOnlyIdentifierFirstError: {
                        description: "Identifier First authenticator cannot be the only authenticator. "
                            + "It needs an additional step.",
                        message: "Update error"
                    },
                    updateOutboundProvisioning: {
                        genericError: {
                            description: "The outbound provisioning IDP already exists.",
                            message: "Update error"
                        }
                    },
                    updateProtocol: {
                        error: {
                            description: "{{description}}",
                            message: "Update error"
                        },
                        genericError: {
                            description: "An error occurred while updating the application.",
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
                        action: "Add User Attribute",
                        subtitles: "There are no user attributes selected for the application at the moment.",
                        title: "No user attributes added"
                    },
                    emptyAuthenticatorStep: {
                        subtitles: {
                            0: "Click on the above button to add options to this step."
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
                            0: "There are no applications available at the moment.",
                            1: "You can add a new application easily by following the",
                            2: "steps in the application creation wizard."
                        },
                        title: "Add a new Application"
                    },
                    emptyOutboundProvisioningIDPs: {
                        action: "New Provisioner",
                        subtitles: "This Application has no outbound provisioners configured." +
                            " Add a provisioner to view it here.",
                        title: "No outbound provisioners"
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
                popups: {
                    appStatus: {
                        active: {
                            content: "The application is active.",
                            header: "Active",
                            subHeader: ""
                        },
                        notConfigured: {
                            content: "The application is not configured. Please configure access configurations.",
                            header: "Not Configured",
                            subHeader: ""
                        },
                        revoked: {
                            content: "The application is revoked. Please reactivate the application in access " +
                                "configurations.",
                            header: "Revoked",
                            subHeader: ""
                        }
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
                    applicationCertificateWizard: {
                        emptyPlaceHolder: {
                            description1: "This Application has no certificate added.",
                            description2: "Add a certificate to view it here.",
                            title: "No certificate"
                        },
                        heading: "Add New Certificate",
                        subHeading: "Add new certificate to the application"
                    },
                    minimalAppCreationWizard: {
                        help: {
                            heading: "Help",
                            subHeading: "Use the guide below",
                            template: {
                                common: {
                                    authorizedRedirectURLs: {
                                        example: "E.g., https://myapp.io/login",
                                        subTitle: "The URL to which the authorization code is sent to upon" +
                                            " authentication and where the user is redirected to upon logout.",
                                        title: "Authorized redirect URLs"
                                    },
                                    heading: {
                                        example: "E.g., My App",
                                        subTitle: "A unique name to identify your application.",
                                        title: "Name"
                                    },
                                    protocol: {
                                        subTitle: "The access configuration protocol which will be used to log in to" +
                                            " the application using SSO.",
                                        title: "Protocol"
                                    }
                                },
                                label: "Minimal application create wizard help panel templates.",
                                samlWeb: {
                                    assertionResponseURLs: {
                                        example: "E.g., https://my-app.com/home.jsp",
                                        subTitle: "The URLs to which the browser is redirected to upon successful" +
                                            " authentication. Also known as the Assertion Consumer Service (ACS) URL" +
                                            " of the service provider.",
                                        title: "Assertion consumer service URLs"
                                    },
                                    issuer: {
                                        example: "E.g., my-app.com",
                                        subTitle: "The <1>saml:Issuer</1> element that contains the unique" +
                                            " identifier of the application. The value added here should be" +
                                            " specified in the SAML authentication request sent from the client" +
                                            " application.",
                                        title: "Issuer"
                                    },
                                    metaFile: {
                                        subTitle: "Upload the meta file for the SAML configuration.",
                                        title: "Upload Metadata File"
                                    },
                                    metaURL: {
                                        subTitle: "Meta URL link from which SAML configurations can be fetched.",
                                        title: "Meta URL"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            authenticationProvider: {
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
                    addIDP: "Create Connection"
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
                        subheader2: "Enable the identity provider to use it with your applications."
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
                        emailOTP: {
                            enableBackupCodes: {
                                hint: "Allow users to authenticate with backup codes.",
                                label: "Enable authenticate with backup codes",
                                validations: {
                                    required: "Enable authenticate with backup codes is a required field."
                                }
                            },
                            expiryTime: {
                                hint: "The generated passcode will be expired after this defined time period. " +
                                    "Please pick a value between <1>1 second</1> & <3>86400 seconds(1 day)</3>.",
                                label: "Email OTP expiry time",
                                placeholder: "Enter Email OTP expiry time.",
                                unit: "seconds",
                                validations: {
                                    invalid: "Email OTP expiry time should be an integer.",
                                    range: "Email OTP expiry time should be between 1 second & 86400 seconds(1 day).",
                                    required: "Email OTP expiry time is a required field."
                                }
                            },
                            tokenLength: {
                                hint: "The number of allowed characters in the OTP token. Please, " +
                                    "pick a value between <1>4-10</1>.",
                                label: "Email OTP token length",
                                placeholder: "Enter Email OTP token length.",
                                validations: {
                                    invalid: "Email OTP token length should be an integer.",
                                    range: "Email OTP token length should be between 4 & 10 characters.",
                                    required: "Email OTP token length is a required field."
                                }
                            },
                            useNumericChars: {
                                hint: "Only numeric characters (<1>0-9</1>) are used for the OTP token. " +
                                    "Please clear this checkbox to enable alphanumeric characters.",
                                label: "Use only numeric characters for OTP token",
                                validations: {
                                    required: "Use only numeric characters for OTP token is a required field."
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
                                hint: "The <1>Client ID</> you received from GitHub for your OAuth app.",
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
                                hint: "Specify whether logout is supported by the external "
                                    + "IdP.",
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
                            commonAuthQueryParams: {
                                ariaLabel: "SAML request additional query parameters",
                                label: "Additional query parameters"
                            }
                        }
                    },
                    common: {
                        customProperties: "Custom Properties",
                        invalidQueryParamErrorMessage: "These are not valid query parameters",
                        invalidURLErrorMessage: "Enter a valid URL",
                        requiredErrorMessage: "This field cannot be empty"
                    },
                    generalDetails: {
                        description: {
                            hint: "A text description of the identity provider.",
                            label: "Description",
                            placeholder: "Enter a description of the identity provider."
                        },
                        image: {
                            hint: "A URL for the image of the identity provider for display purposes. If not provided" +
                                " a generated thumbnail will be displayed. Recommended size is 200x200 pixels.",
                            label: "Logo",
                            placeholder: "https://myapp-resources.io/my_app_image.png"
                        },
                        name: {
                            hint: "Enter a unique name for this connection.",
                            label: "Name",
                            placeholder: "Enter a name for the connection.",
                            validations: {
                                duplicate: "An identity provider already exists with this name",
                                empty: "Identity Provider name is required",
                                maxLengthReached: "Identity provider name cannot exceed {{ maxLength }} characters.",
                                required: "Identity Provider name is required"
                            }
                        }
                    },
                    jitProvisioning: {
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
                            hint: "The attribute that identifies the user at the enterprise identity provider. " +
                                "When attributes are configured based on the authentication response of " +
                                "this IdP connection, you can use one of them as the subject. " +
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
                        subTitle: "Add new authenticator to the identity provider: {{ idpName }}",
                        title: "Add New Authenticator"
                    },
                    addCertificate: {
                        subTitle: "Add new certificate to the identity provider: {{ idpName }}",
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
                            description: "An error occurred while creating the identity provider.",
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
                            message: "Identity Provider Delete Error"
                        },
                        genericError: {
                            description: "An error occurred while deleting the identity provider.",
                            message: "Identity Provider Delete Error"
                        },
                        success: {
                            description: "Successfully deleted the identity provider.",
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
                    getIDP: {
                        error: {
                            description: "{{ description }}",
                            message: "Retrieval Error"
                        },
                        genericError: {
                            description: "An error occurred while retrieving identity provider details.",
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
                            description: "An error occurred while retrieving identity providers.",
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
                            description: "An error occurred while retrieving identity provider template list.",
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
                            description: "An error occurred while updating Identity Provider attributes.",
                            message: "Update error"
                        },
                        success: {
                            description: "Successfully updated Identity Provider attributes.",
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
                            description: "An error occurred while updating the identity provider certificate.",
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
                popups: {
                    appStatus: {
                        disabled: {
                            content: "The identity provider is disabled. Please enable the authentication " +
                                "provider to use it's services.",
                            header: "Disabled",
                            subHeader: ""
                        },
                        enabled: {
                            content: "The identity provider is enabled.",
                            header: "Enabled",
                            subHeader: ""
                        }
                    }
                },
                templates: {
                    enterprise: {
                        addWizard: {
                            subtitle: "Configure an IDP to connect with standard authentication protocols.",
                            title: "Standard based Identity Providers"
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
                            name: "Please enter a valid name"
                        }
                    },
                    expert: {
                        wizardHelp: {
                            description: {
                                connectionDescription: "Provide a unique name for the connection.",
                                heading: "Name",
                                idpDescription: "Provide a unique name for the identity provider."
                            },
                            heading: "Help",
                            name: {
                                connectionDescription: "Provide a description for the connection to explain more about it.",
                                heading: "Description",
                                idpDescription: "Provide a description for the identity provider to explain more about it."
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
                                idpDescription: "Provide a unique name for the identity provider."
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
                                idpDescription: "Provide a unique name for the identity provider."
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
                                idpDescription: "Provide a unique name for the identity provider."
                            },
                            preRequisites: {
                                configureOAuthApps: "See Google's guide on configuring OAuth Apps.",
                                configureRedirectURL: "Add the following URL as the <1>Authorized Redirect URI</1>.",
                                getCredentials: "Before you begin, create an <1>OAuth application</1> " +
                                    "<3>on Google</3>, and obtain a <5>client ID & secret</5>.",
                                heading: "Prerequisite"
                            },
                            subHeading: "Use the guide below"
                        }
                    },
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
                                placeholder: "Enter value to search"
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
                        content: "If you delete this identity provider, you will not be able to recover it. " +
                            "Please proceed with caution.",
                        header: "Are you sure?",
                        message: "This action is irreversible and will permanently delete the identity provider."
                    },
                    deleteIDPWithConnectedApps: {
                        assertionHint: "",
                        content: "Remove the associations from these applications before deleting:",
                        header: "Unable to Delete",
                        message: "There are applications using this identity provider. "
                    }
                },
                dangerZoneGroup: {
                    deleteIDP: {
                        actionTitle: "Delete Identity Provider",
                        header: "Delete identity provider",
                        subheader: "Once you delete an identity provider, it cannot be recovered. Please be certain."
                    },
                    disableIDP: {
                        actionTitle: "Disable Identity Provider",
                        header: "Disable identity provider",
                        subheader: "Once you disable an identity provider, it can no longer be used until " +
                            "you enable it again.",
                        subheader2: "Enable the identity provider to use it with your applications."
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
                        customProperties: "Custom Properties",
                        internetResolvableErrorMessage: "URL must be internet resolvable.",
                        invalidQueryParamErrorMessage: "These are not valid query parameters",
                        invalidURLErrorMessage: "Enter a valid URL",
                        requiredErrorMessage: "This is required"
                    },
                    generalDetails: {
                        description: {
                            hint: "A meaningful description about the identity provider.",
                            label: "Description",
                            placeholder: "Enter a description of the identity provider."
                        },
                        image: {
                            hint: "A URL to query the image of the identity provider.",
                            label: "Identity Provider Image URL",
                            placeholder: "E.g. https://example.com/image.png"
                        },
                        name: {
                            hint: "Enter a unique name for this identity provider.",
                            label: "Identity Provider Name",
                            placeholder: "Enter a name for the identity provider.",
                            validations: {
                                duplicate: "An identity provider already exists with this name",
                                empty: "Identity Provider name is required",
                                maxLengthReached: "Identity Provider name cannot exceed {{ maxLength }} characters."
                            }
                        }
                    },
                    jitProvisioning: {
                        enableJITProvisioning: {
                            disabledMessageContent: {
                                1: "You cannot modify Proxy Mode settings since multiple applications" +
                                    " depend on this connection. To resolve this conflict, you need" +
                                    " to remove this connection from the listed resources.",
                                2: "You are not allowed to modify Proxy Mode settings as an application" +
                                    " depends on this connection. To resolve this conflict, you need to remove" +
                                    " this connection from the listed resource."
                            },
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
                list: {
                    actions: "Actions",
                    name: "Name"
                },
                modals: {
                    addAuthenticator: {
                        subTitle: "Add new authenticator to the identity provider: {{ idpName }}",
                        title: "Add New Authenticator"
                    },
                    addCertificate: {
                        subTitle: "Add new certificate to the identity provider: {{ idpName }}",
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
                            description: "An error occurred while creating the identity provider.",
                            message: "Create error"
                        },
                        success: {
                            description: "Successfully created the identity provider.",
                            message: "Create successful"
                        }
                    },
                    apiLimitReachedError: {
                        error: {
                            description: "You have reached the maximum number of identity providers allowed.",
                            message: "Failed to create the identity provider"
                        }
                    },
                    changeCertType: {
                        jwks: {
                            description: "Please note that the certificates will be overridden ." +
                                "by the the JWKS endpoint.",
                            message: "Warning!"
                        },
                        pem: {
                            description: "Please note that the JWKS endpoint will be overridden ." +
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
                            description: "An error occurred while deleting the identity provider.",
                            message: "Identity Provider Delete Error"
                        },
                        success: {
                            description: "Successfully deleted the identity provider.",
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
                            description: "An error occurred while retrieving attributes.",
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
                            description: "An error occurred while retrieving identity provider details.",
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
                            description: "An error occurred while retrieving identity providers.",
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
                            description: "An error occurred while retrieving identity provider template list.",
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
                    tierLimitReachedError: {
                        emptyPlaceholder: {
                            action: "View Plans",
                            subtitles: "You can contact the organization administrator or (if you are the " +
                                "administrator) upgrade your subscription to increase the allowed limit.",
                            title: "You have reached the maximum number of IdPs allowed " +
                                "for this organization."
                        },
                        heading: "You’ve reached the maximum limit for IdPs"
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
                            0: "There are no identity providers available at the moment.",
                            1: "You can add a new identity provider easily by following the",
                            2: "steps in the identity provider creation wizard."
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
                        authenticationProviders: {
                            heading: "Connections",
                            subHeading: "Create and manage connections to use in the login flow of your applications."
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
            secrets: {
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
                                placeholder: "Enter value to search"
                            }
                        }
                    },
                    placeholder: "Search by secret name"
                },
                alerts: {
                    createdSecret: {
                        description: "Successfully created the secret.",
                        message: "Creation successful."
                    },
                    deleteSecret: {
                        description: "Successfully deleted the secret.",
                        message: "Delete successful."
                    },
                    updatedSecret: {
                        description: "Successfully updated the secret.",
                        message: "Update successful."
                    }
                },
                banners: {
                    adaptiveAuthSecretType: {
                        content: "These secrets can be used in the Conditional Authentication script of a " +
                            "registered application when accessing external APIs.",
                        title: "Conditional Authentication Secrets"
                    },
                    secretIsHidden: {
                        content: "Once created, you won't be able to see the secret value again. " +
                            "You will only be able to delete the secret. ",
                        title: "Why can't I see the secret?"
                    }
                },
                emptyPlaceholders: {
                    buttons: {
                        addSecret: {
                            ariaLabel: "Add a new Secret.",
                            label: "New Secret"
                        },
                        backToSecrets: {
                            ariaLabel: "Navigate to Secrets list.",
                            label: "Take me back to Secrets"
                        }
                    },
                    emptyListOfSecrets: {
                        messages: [
                            "There are no secrets available at the moment."
                        ]
                    },
                    resourceNotFound: {
                        messages: [
                            "Oops! we couldn't find the requested secret!",
                            "Perhaps you have landed on an invalid URL..."
                        ]
                    }
                },
                errors: {
                    generic: {
                        description: "We were unable to complete this request. Please retry again.",
                        message: "Something is not right."
                    }
                },
                forms: {
                    actions: {
                        submitButton: {
                            ariaLabel: "Update to save the form",
                            label: "Update"
                        }
                    },
                    editSecret: {
                        page: {
                            description: "Edit secret"
                        },
                        secretDescriptionField: {
                            ariaLabel: "Secret Description",
                            hint: "Provide a description for this secret (i.e., When to use this secret).",
                            label: "Secret description",
                            placeholder: "Enter a secret description"
                        },
                        secretValueField: {
                            ariaLabel: "Enter a Secret Value",
                            cancelButton: "Cancel",
                            editButton: "Change secret value",
                            hint: "You can enter a value between length {{minLength}} to {{maxLength}}.",
                            label: "Secret value",
                            placeholder: "Enter a secret value",
                            updateButton: "Update secret value"
                        }
                    }
                },
                modals: {
                    deleteSecret: {
                        assertionHint: "Yes, I understand. I want to delete it.",
                        content: "This action is irreversible and will permanently delete the secret.",
                        primaryActionButtonText: "Confirm",
                        secondaryActionButtonText: "Cancel",
                        title: "Are you sure?",
                        warningMessage: "If you delete this secret, conditional authentication scripts " +
                            "depending on this value will stop working. Please proceed with caution."
                    }
                },
                page: {
                    description: "Create and manage secrets for conditional authentication",
                    primaryActionButtonText: "New Secret",
                    subFeatureBackButton: "Go back to Secrets",
                    title: "Secrets"
                },
                routes: {
                    category: "secrets",
                    name: "Secrets",
                    sidePanelChildrenNames: [
                        "Secret Edit"
                    ]
                },
                wizards: {
                    actions: {
                        cancelButton: {
                            ariaLabel: "Cancel and Close Modal",
                            label: "Cancel"
                        },
                        createButton: {
                            ariaLabel: "Create and Submit",
                            label: "Create"
                        }
                    },
                    addSecret: {
                        form: {
                            secretDescriptionField: {
                                ariaLabel: "Secret Description",
                                hint: "Provide a description for this secret (i.e., When to use this secret).",
                                label: "Secret description",
                                placeholder: "Enter a secret description"
                            },
                            secretNameField: {
                                alreadyPresentError: "This Secret name is already added!",
                                ariaLabel: "Secret Name for the Secret Type",
                                hint: "Provide a meaningful name for this secret. Note that once " +
                                    "you create this secret with the name above, you cannot change it afterwards.",
                                label: "Secret name",
                                placeholder: "Enter a secret name"
                            },
                            secretTypeField: {
                                ariaLabel: "Select Secret Type",
                                hint: "Select a Secret Type which this Secret falls into.",
                                label: "Select secret type"
                            },
                            secretValueField: {
                                ariaLabel: "Enter a secret value",
                                hint: "This is the value of the secret. You can enter a value between length" +
                                    " {{minLength}} to {{maxLength}}.",
                                label: "Secret value",
                                placeholder: "Enter a secret value"
                            }
                        },
                        heading: "Create Secret",
                        subheading: "Create a new secret for conditional authentication scripts"
                    }
                }
            },
            sidePanel: {
                applicationEdit: "Application Edit",
                applicationTemplates: "Application Templates",
                applications: "Applications",
                authenticationProviderEdit: "Identity Providers Edit",
                authenticationProviderTemplates: "Identity Provider Templates",
                authenticationProviders: "Connections",
                categories: {
                    application: "Applications",
                    authenticationProviders: "Identity Providers",
                    general: "General",
                    gettingStarted: "Getting Started",
                    identityProviders: "Identity Providers"
                },
                customize: "Customize",
                identityProviderEdit: "Identity Providers Edit",
                identityProviderTemplates: "Identity Provider Templates",
                identityProviders: "Identity Providers",
                oidcScopes: "Scopes",
                oidcScopesEdit: "Scopes Edit",
                overview: "Overview",
                remoteRepo: "Remote Repo Config",
                remoteRepoEdit: "Remote Repo Config Edit"
            },
            templates: {
                emptyPlaceholder: {
                    action: null,
                    subtitles: "Please add templates to display here.",
                    title: "No templates to display."
                }
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
                backButton: "Go back to Applications",
                subTitle: "Register an application using one of the templates given below. If nothing matches your " +
                    "application type, start with the Standard-Based Application template.",
                title: "Register New Application"
            },
            applications: {
                subTitle: "Register and manage your applications and configure sign-in.",
                title: "Applications"
            },
            applicationsEdit: {
                backButton: "Go back to Applications",
                subTitle: null,
                title: null
            },
            authenticationProvider: {
                subTitle: "Create and manage connections to use in the login flow of your applications.",
                title: "Connections"
            },
            authenticationProviderTemplate: {
                backButton: "Go back to Connections",
                search: {
                    placeholder: "Search by name"
                },
                subTitle: "Select a connection type and create a new connection.",
                supportServices: {
                    authenticationDisplayName: "Authentication",
                    provisioningDisplayName: "Provisioning"
                },
                title: "Create a New Connection"
            },
            idp: {
                subTitle: "Manage identity providers to allow users to log in to your application through them.",
                title: "Identity Providers"
            },
            idpTemplate: {
                backButton: "Go back to Identity Providers",
                subTitle: "Choose one of the following identity providers.",
                supportServices: {
                    authenticationDisplayName: "Authentication",
                    provisioningDisplayName: "Provisioning"
                },
                title: "Select Identity Provider"
            },
            overview: {
                subTitle: "Configure and  manage applications, identity providers, users and roles, attribute " +
                    "dialects, etc.",
                title: "Welcome, {{firstName}}"
            }
        },
        placeholders: {
            emptySearchResult: {
                action: "Clear search query",
                subtitles: {
                    0: "We couldn't find any results for \"{{query}}\"",
                    1: "Please try a different search term."
                },
                title: "No results found"
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
    },
    manage: {
        features: {
            approvals: {
                list: {
                    columns: {
                        actions: "Actions",
                        name: "Name"
                    }
                },
                modals: {
                    approvalProperties: {
                        "Claims": "Claims",
                        "REQUEST ID": "Request ID",
                        "Roles": "Roles",
                        "User Store Domain": "User Store Domain",
                        "Username": "Username"
                    },
                    taskDetails: {
                        description: "You have a request to approve an operational action of a user.",
                        header: "Approval Task"
                    }
                },
                notifications: {
                    fetchApprovalDetails: {
                        error: {
                            description: "{{description}}",
                            message: "Error retrieving the approval details"
                        },
                        genericError: {
                            description: "Couldn't update the approval details",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully retrieved the approval details.",
                            message: "Approval details retrieval successful"
                        }
                    },
                    fetchPendingApprovals: {
                        error: {
                            description: "{{description}}",
                            message: "Error retrieving pending approvals"
                        },
                        genericError: {
                            description: "Couldn't retrieve pending approvals",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully retrieved pending approvals.",
                            message: "Pending approvals retrieval successful"
                        }
                    },
                    updatePendingApprovals: {
                        error: {
                            description: "{{description}}",
                            message: "Error updating the approval"
                        },
                        genericError: {
                            description: "Couldn't update the approval",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully updated the approval.",
                            message: "Update successful"
                        }
                    }
                },
                placeholders: {
                    emptyApprovalFilter: {
                        action: "View all",
                        subtitles: {
                            0: "There are currently no approvals in {{status}} state.",
                            1: "Please check if you have any tasks in {{status}} state to",
                            2: "view them here."
                        },
                        title: "No results found"
                    },
                    emptyApprovalList: {
                        action: "",
                        subtitles: {
                            0: "There are currently no approvals to review.",
                            1: "Please check if you have added a workflow to control the operations in the system.",
                            2: ""
                        },
                        title: "No Approvals"
                    },
                    emptySearchResults: {
                        action: "View all",
                        subtitles: {
                            0: "We couldn't find the workflow you searched for.",
                            1: "Please check if you have a workflow with that name in",
                            2: "the system."
                        },
                        title: "No Approvals"
                    }
                }
            },
            businessGroups: {
                fields: {
                    groupName: {
                        label: "{{type}} Name",
                        placeholder: "Enter {{type}} Name",
                        validations: {
                            duplicate: "A {{type}} already exists with the given {{type}} name.",
                            empty: "{{type}} Name is required to proceed.",
                            invalid: "A {{type}} name can only contain alphanumeric characters, -, and _. "
                                + "And must be of length between 3 to 30 characters."
                        }
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
                        tenantContent: "This will delete the organization certificate permanently."
                            + "Once deleted, unless you import a new organization certificate,"
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
                    list: {
                        columns: {
                            actions: "Actions",
                            name: "Name"
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
                                description: "There was an error while deleting the certificate.",
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
                                description: "There was an error while fetching ."
                                    + "the certificate",
                                message: "Something went wrong!"
                            }
                        },
                        getCertificates: {
                            genericError: {
                                description: "An error occurred while fetching certificates.",
                                message: "Something went wrong"
                            }
                        },
                        getPublicCertificate: {
                            genericError: {
                                description: "There was an error while fetching the organization certificate.",
                                message: "Something went wrong!"
                            }
                        }
                    },
                    pageLayout: {
                        description: "Manage certificates in the keystore.",
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
                            description: "Drag and drop a certificate file here."
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
                attributeMappings: {
                    custom: {
                        description: "The custom protocol representation for user "
                            + "attributes.",
                        heading: "Custom Attributes"
                    },
                    oidc: {
                        description: "The OpenID Connect (OIDC) protocol representation for user "
                            + "attributes.",
                        heading: "OpenID Connect"
                    },
                    scim: {
                        description: "The SCIM2 protocol representation for user "
                            + "attributes that will be used in the SCIM2 API.",
                        heading: "SCIM 2.0"
                    }
                },
                dialects: {
                    advancedSearch: {
                        error: "Filter query format incorrect",
                        form: {
                            inputs: {
                                filterAttribute: {
                                    placeholder: "E.g. Attribute Mapping etc."
                                },
                                filterCondition: {
                                    placeholder: "E.g. Starts with etc."
                                },
                                filterValue: {
                                    placeholder: "E.g. http://wso2.org/oidc/claim"
                                }
                            }
                        },
                        placeholder: "Search by attribute mapping "
                    },
                    attributes: {
                        dialectURI: "Attribute Mapping"
                    },
                    confirmations: {
                        action: "Confirm",
                        content: "If you delete this attribute mapping, all the associated {{type}} attributes will "
                            + "also be deleted.Please proceed with caution.",
                        header: "Are you sure?",
                        hint: "Please type <1>{{confirm}}</1> to confirm.",
                        message: "This action is irreversible and will permanently delete the selected attribute " +
                            "mapping."
                    },
                    dangerZone: {
                        actionTitle: "Delete {{type}} Attribute Mapping",
                        header: "Delete {{type}} Attribute Mapping",
                        subheader: "Once you delete this {{type}} attribute mapping, there is no going back. " +
                            "Please be certain."
                    },
                    forms: {
                        dialectURI: {
                            label: "{{type}} Attribute Mapping",
                            placeholder: "Enter an attribute mapping",
                            requiredErrorMessage: "Enter an attribute mapping"
                        },
                        fields: {
                            attributeName: {
                                validation: {
                                    alreadyExists: "An Attribute already exists with the given Attribute name.",
                                    invalid: "Attribute name can only contain alphanumeric characters "
                                        +"and _. And must be of length between 3 to 30 characters."
                                }
                            }
                        },
                        submit: "Update"
                    },
                    notifications: {
                        addDialect: {
                            error: {
                                description: "An error occurred while adding the attribute mapping",
                                message: "Something went wrong"
                            },
                            genericError: {
                                description: "The attribute mapping has been added but not all {{type}} "
                                    + "attributes were added successfully",
                                message: "{{type}} attributes couldn't be added"
                            },
                            success: {
                                description: "The attribute mapping has been added successfully",
                                message: "Attribute Mapping added successfully"
                            }
                        },
                        deleteDialect: {
                            genericError: {
                                description: "There was an error while deleting the attribute mapping",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "The attribute mapping has been deleted successfully!",
                                message: "Attribute Mapping deleted successfully"
                            }
                        },
                        fetchADialect: {
                            genericError: {
                                description: "There was an error while fetching the attribute mapping",
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
                                description: "There was an error while fetching the {{type}} attributes",
                                message: "Something went wrong"
                            }
                        },
                        updateDialect: {
                            genericError: {
                                description: "An error occurred while updating the attribute mapping",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "The attribute mapping has been successfully updated.",
                                message: "Attribute Mapping update successful"
                            }
                        }
                    },
                    pageLayout: {
                        edit: {
                            back: "Go back to Attribute Mappings",
                            description: "Edit attribute mapping",
                            updateDialectURI: "Update {{type}} Attribute Mapping",
                            updateExternalAttributes: "Update {{type}} Attribute Mapping"
                        },
                        list: {
                            description: "View and manage how user attributes are mapped and " +
                                "transformed when interacting with APIs or your applications.",
                            primaryAction: "New Attribute Mapping",
                            title: "Attributes",
                            view: "View attributes"
                        }
                    },
                    sections: {
                        manageAttributeMappings: {
                            custom: {
                                description: "Communicate information about the user via custom mappings.",
                                heading: "Custom Attribute Mapping"
                            },
                            description: "View and manage how attributes are mapped and transformed "
                                + "when interacting with APIs or your applications.",
                            heading: "Manage Attribute Mappings",
                            oidc: {
                                description: "Communicate information about the user for applications that uses "
                                    + "OpenID Connect to authenticate.",
                                heading: "OpenID Connect"
                            },
                            scim: {
                                description: "Communicate information about the user via the API "
                                    + "compliance with SCIM2 standards.",
                                heading: "SCIM 2.0"
                            }
                        },
                        manageAttributes: {
                            attributes: {
                                description: "Each attribute contains a piece of stored user data.",
                                heading: "Attributes"
                            },
                            description: "View and manage attributes.",
                            heading: "Manage Attributes"
                        }
                    },
                    wizard: {
                        header: "Add Attribute Mapping",
                        steps: {
                            dialectURI: "Attribute Mapping",
                            externalAttribute: "{{type}} Attribute",
                            summary: "Summary"
                        },
                        summary: {
                            externalAttribute: "{{type}} Attribute",
                            mappedAttribute: "Mapped Attribute",
                            notFound: "No {{type}} attribute has been added."
                        }
                    }
                },
                external: {
                    advancedSearch: {
                        error: "Filter query format incorrect",
                        form: {
                            inputs: {
                                filterAttribute: {
                                    placeholder: "E.g. {{type}} Attribute etc."
                                },
                                filterCondition: {
                                    placeholder: "E.g. Starts with etc."
                                },
                                filterValue: {
                                    placeholder: "E.g. http://axschema.org/namePerson/last"
                                }
                            }
                        },
                        placeholder: "Search by {{type}} attribute"
                    },
                    attributes: {
                        attributeURI: "{{type}} Attribute",
                        mappedClaim: "Mapped Attribute"
                    },
                    forms: {
                        attributeURI: {
                            label: "{{type}} Attribute",
                            placeholder: "Enter {{type}} attribute",
                            requiredErrorMessage: "{{type}} Attribute is required",
                            validationErrorMessages: {
                                duplicateName: "The {{type}} attribute already exists.",
                                invalidName: "The name you entered contains illegal characters. " +
                                    "Only letters, numbers, `#`, and `_` are allowed.",
                                scimInvalidName: "The starting character of the name should be a letter. " +
                                    "The remaining characters may include letters, numbers, dash (-), " +
                                    "and underscore (_)."
                            }
                        },
                        emptyMessage: "All the SCIM attributes are mapped to local claims.",
                        localAttribute: {
                            label: "User Attribute to map to",
                            placeholder: "Select a user attribute",
                            requiredErrorMessage: "Select a user attribute to map to"
                        },
                        submit: "Add Attribute Mapping",
                        warningMessage: "There are no local attributes available for mapping. " +
                            "Add new local attributes from"
                    },
                    notifications: {
                        addExternalAttribute: {
                            genericError: {
                                description: "An error occurred while adding the {{type}} attribute.",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "The {{type}} attribute has been added to the attribute mapping" +
                                    " successfully!",
                                message: "Attribute added"
                            }
                        },
                        deleteExternalClaim: {
                            genericError: {
                                description: "There was an error while deleting the {{type}} attribute",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "The {{type}} attribute has been deleted successfully!",
                                message: "Attribute deleted"
                            }
                        },
                        fetchExternalClaims: {
                            error: {
                                description: "{{description}}",
                                message: "Retrieval error"
                            },
                            genericError: {
                                description: "Couldn't retrieve {{type}} attributes.",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "Successfully retrieved {{type}} attributes.",
                                message: "Retrieval successful"
                            }
                        },
                        getExternalAttribute: {
                            genericError: {
                                description: "There was an error while fetching the {{type}} attribute",
                                message: "Something went wrong"
                            }
                        },
                        updateExternalAttribute: {
                            genericError: {
                                description: "There was an error while updating the" + " {{type}} attribute",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "The {{type}} attribute has been updated successfully!",
                                message: "Attribute updated"
                            }
                        }
                    },
                    pageLayout: {
                        edit: {
                            header: "Add {{type}} Attribute",
                            primaryAction: "New Attribute"
                        }
                    },
                    placeholders: {
                        empty: {
                            subtitle: "Currently, there are no {{type}} attributes available for "
                                + "this attribute mapping.",
                            title: "No {{type}} Attributes"
                        }
                    }
                },
                list: {
                    columns: {
                        actions: "Actions",
                        claimURI: "SCIM Attribute",
                        dialectURI: "Mapped Attribute",
                        name: "Name"
                    },
                    confirmation: {
                        action: "Confirm",
                        content: "{{message}} Please proceed with caution.",
                        dialect: {
                            message: "If you delete this attribute mapping, all the"
                                + " associated {{type}} attributes will also be deleted.",
                            name: "attribute mapping"
                        },
                        external: {
                            message: "This will permanently delete the {{type}} attribute.",
                            name: "{{type}} attribute"
                        },
                        header: "Are you sure?",
                        hint: "Please confirm your action.",
                        local: {
                            message: "If you delete this attribute, the user data belonging "
                                + "to this attribute will also be deleted.",
                            name: "attribute"
                        },
                        message: "This action is irreversible and will permanently delete the selected {{name}}."
                    },
                    placeholders: {
                        emptyList: {
                            action: {
                                dialect: "New {{type}} Attribute",
                                external: "New {{type}} Attribute",
                                local: "New Attribute"
                            },
                            subtitle: "There are currently no results available."
                                + "You can add a new item easily by following the" + "steps in the creation wizard.",
                            title: {
                                dialect: "Add an Attribute Mapping",
                                external: "Add an {{type}} Attribute",
                                local: "Add an Attribute"
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
                        " in the following user stores:"
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
                                    placeholder: "E.g. name, attribute etc."
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
                        attributeURI: "Attribute"
                    },
                    confirmation: {
                        content: "If you delete this attribute, the user data belonging to this attribute "
                            + "will also be deleted. Please proceed with caution.",
                        header: "Are you sure?",
                        hint: "Please confirm your action.",
                        message: "This action is irreversible and will permanently delete the selected " +
                            "attribute.",
                        primaryAction: "Confirm"
                    },
                    dangerZone: {
                        actionTitle: "Delete Attribute",
                        header: "Delete Attribute",
                        subheader: "Once you delete an attribute, there is no going back. "
                            + "Please be certain."
                    },
                    forms: {
                        attribute: {
                            placeholder: "Select a user attribute to map to",
                            requiredErrorMessage: "Attribute name is a required field"
                        },
                        attributeHint: "A unique ID for the attribute."
                            + " The ID will be appended to the attribute mapping to create a attribute",
                        attributeID: {
                            label: "Attribute Name",
                            placeholder: "Enter an attribute name",
                            requiredErrorMessage: "Attribute name is required"
                        },
                        description: {
                            label: "Description",
                            placeholder: "Enter a description",
                            requiredErrorMessage: "Description is required"
                        },
                        descriptionHint: "A meaningful description for the attribute.",
                        displayOrder: {
                            label: "Display Order",
                            placeholder: "Enter the display order"
                        },
                        displayOrderHint: "This determines the position at which this attribute is "
                            + "displayed in the user profile and the user registration page",
                        infoMessages: {
                            configApplicabilityInfo: "Please note that the following attribute configurations will " +
                                "only affect the customer users' profiles.",
                            disabledConfigInfo: "Please note that below section is disabled as there is no " +
                                "external claim mapping found for this claim attribute."
                        },
                        name: {
                            label: "Attribute Display Name",
                            placeholder: "Enter a name for the attribute",
                            requiredErrorMessage: "Name is required",
                            validationErrorMessages: {
                                invalidName: "The name you entered contains disallowed characters. It can only" +
                                    " contain up to 30 characters, including alphanumerics, periods (.), dashes (-)," +
                                    " underscores (_), plus signs (+), and spaces."
                            }
                        },
                        nameHint: "The display name of the attribute in the user profile.",
                        readOnly: {
                            label: "Make this attribute read-only on the user's profile"
                        },
                        readOnlyHint: "If this is selected, the value of this attribute is read-only in a user" +
                        " profile. Be sure to select this option if the attribute value is system-defined.",
                        regEx: {
                            label: "Regular expression",
                            placeholder: "Enter a regular expression"
                        },
                        regExHint: "Use a regex pattern to validate the attribute input value.",
                        required: {
                            label: "Make this attribute required on the user's profile"
                        },
                        requiredHint: "If selected, the user is required to specify a value for this " +
                        "attribute on the profile.",
                        supportedByDefault: {
                            label: "Display this attribute on the user's profile"
                        }
                    },
                    mappedAttributes: {
                        hint: "Enter the attribute from each user store that you want to map to this attribute."
                    },
                    notifications: {
                        addLocalClaim: {
                            genericError: {
                                description: "There was an error while adding the attribute",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "The attribute has been added successfully!",
                                message: "Attribute added successfully"
                            }
                        },
                        deleteClaim: {
                            genericError: {
                                description: "There was an error while deleting the attribute",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "The attribute has been deleted successfully!",
                                message: "Attribute deleted successfully"
                            }
                        },
                        fetchLocalClaims: {
                            error: {
                                description: "{{description}}",
                                message: "Retrieval error"
                            },
                            genericError: {
                                description: "Couldn't retrieve attributes.",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "Successfully retrieved attributes.",
                                message: "Retrieval successful"
                            }
                        },
                        getAClaim: {
                            genericError: {
                                description: "There was an error while fetching the attribute",
                                message: "Something went wrong"
                            }
                        },
                        getClaims: {
                            genericError: {
                                description: "There was an error while fetching the attributes",
                                message: "Something went wrong"
                            }
                        },
                        getLocalDialect: {
                            genericError: {
                                description: "There was an error while fetching the attributes",
                                message: "Something went wrong"
                            }
                        },
                        updateClaim: {
                            genericError: {
                                description: "There was an error while updating the" + " attribute",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "This attribute has been "
                                    + "updated successfully!",
                                message: "Attribute updated successfully"
                            }
                        }
                    },
                    pageLayout: {
                        edit: {
                            back: "Go back to Attributes",
                            description: "Edit attribute",
                            tabs: {
                                additionalProperties: "Additional Properties",
                                general: "General",
                                mappedAttributes: "Mapped Attributes"
                            }
                        },
                        local: {
                            action: "New Attribute",
                            back: "Go back to Attributes and Mappings",
                            description: "Create and manage attributes",
                            title: "Attributes"
                        }
                    },
                    wizard: {
                        header: "Add Attribute",
                        steps: {
                            general: "General",
                            mapAttributes: "Map Attributes",
                            summary: "Summary"
                        },
                        summary: {
                            attribute: "Attribute",
                            attributeURI: "Attribute",
                            displayOrder: "Display Order",
                            readOnly: "This attribute is read-only",
                            regEx: "Regular Expression",
                            required: "This attribute is required during user registration",
                            supportedByDefault: "This attribute is shown on user profile and user registration page",
                            userstore: "User Store"
                        }
                    }
                },
                scopeMappings: {
                    deletionConfirmationModal: {
                        assertionHint: "Please confirm your action.",
                        content: "If you delete this claim, it will not be available in the token." +
                            " Please proceed with caution.",
                        header: "Are you sure?",
                        message: "This action is irreversible and will permanently delete the scope claim mapping"
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
                                label: "Body",
                                validations: {
                                    empty: "The email body cannot be empty."
                                }
                            },
                            locale: {
                                label: "Locale",
                                placeholder: "Select Locale",
                                validations: {
                                    empty: "Select locale"
                                }
                            },
                            signatureEditor: {
                                label: "Mail signature",
                                validations: {
                                    empty: "The email signature cannot be empty."
                                }
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
                advancedSearch: {
                    error: "Filter query format incorrect",
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "E.g. Name etc."
                            },
                            filterCondition: {
                                placeholder: "E.g. Starts with etc."
                            },
                            filterValue: {
                                placeholder: "E.g. TOTP, passwordResetSuccess etc."
                            }
                        }
                    },
                    placeholder: "Search by email template type"
                },
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
                        message: "This action is irreversible and will permanently delete the selected email " +
                            "template type."
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
                list: {
                    actions: "Actions",
                    name: "Name"
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
                    getTemplateTypes: {
                        error: {
                            description: "{{description}}",
                            message: "Retrieval error"
                        },
                        genericError: {
                            description: "Couldn't retrieve the email template types.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully retrieved the email template types.",
                            message: "Retrieval successful"
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
                            0: "There are no templates types available at the moment.",
                            1: "You can add a new template type by ",
                            2: "clicking on the button below."
                        },
                        title: "Add new Template Type"
                    },
                    emptySearch: {
                        action: "Clear search query",
                        subtitles: "We couldn't find any results for {{searchQuery}}. "
                            + "Please try a different search term.",
                        title: "No results found"
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
                list: {
                    actions: "Actions",
                    name: "Name"
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
                    getTemplateDetails: {
                        error: {
                            description: "{{description}}",
                            message: "Retrieval error"
                        },
                        genericError: {
                            description: "Couldn't retrieve the email template details.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully retrieved the email template details.",
                            message: "Retrieval successful"
                        }
                    },
                    getTemplates: {
                        error: {
                            description: "{{description}}",
                            message: "Retrieval error"
                        },
                        genericError: {
                            description: "Couldn't retrieve the email templates.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully retrieved the email templates.",
                            message: "Retrieval successful"
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
                            0: "There are no templates available for the selected",
                            1: "email template type at the moment. You can add a new template by ",
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
            governanceConnectors: {
                categories: "Categories",
                connectorSubHeading: "Configure {{ name }} settings.",
                disabled: "Disabled",
                enabled: "Enabled",
                form: {
                    errors: {
                        format: "The format is incorrect.",
                        positiveIntegers: "The number should not be less than 0."
                    }
                },
                notifications: {
                    getConnector: {
                        error: {
                            description: "{{ description }}",
                            message: "Retrieval Error"
                        },
                        genericError: {
                            description: "An error occurred while retrieving governance connector.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    getConnectorCategories: {
                        error: {
                            description: "{{ description }}",
                            message: "Retrieval Error"
                        },
                        genericError: {
                            description: "An error occurred while retrieving governance connector categories.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    updateConnector: {
                        error: {
                            description: "{{ description }}",
                            message: "Update Error"
                        },
                        genericError: {
                            description: "An error occurred while updating governance connector.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "{{ name }} Connector updated successfully.",
                            message: "Update Successful."
                        }
                    }
                },
                pageSubHeading: "Configure and manage {{ name }}."

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
                                placeholder: "Enter group name",
                                required: "Group name is required"
                            }
                        }
                    },
                    roles: {
                        addRolesModal: {
                            heading: "Update Group Roles",
                            subHeading: "Add new roles or remove existing roles assigned to the group."
                        },
                        subHeading: "Add or remove the roles this group is assigned with and note that this " +
                            "will affect performing certain tasks."
                    }
                },
                list: {
                    columns: {
                        actions: "Actions",
                        lastModified: "Modified Time",
                        name: "Group",
                        source: "User Store"
                    },
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
                    fetchGroups: {
                        genericError: {
                            description: "An error occurred while fetching groups.",
                            message: "Something went wrong"
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
                },
                placeholders: {
                    groupsError: {
                        subtitles: [
                            "An error occurred while trying to fetch groups from the user store.",
                            "Please make sure that the connection details of the user store are accurate."
                        ],
                        title:"Couldn't fetch groups from the user store"
                    }
                }
            },
            header: {
                links: {
                    devPortalNav: "Developer Portal",
                    userPortalNav: "My Account"
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
            invite: {
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
                                placeholder: "E.g. Email etc."
                            },
                            filterCondition: {
                                placeholder: "E.g. Starts with etc."
                            },
                            filterValue: {
                                placeholder: "Enter value to search"
                            }
                        }
                    },
                    placeholder: "Search by Email"
                },
                confirmationModal: {
                    deleteInvite: {
                        assertionHint: "Please confirm your action.",
                        content: "If you revoke this invite, the user will not be able to onboard your organization. " +
                            "Please proceed with caution.",
                        header: "Are you sure?",
                        message: "This action is irreversible and will permanently revoke the invite."
                    },
                    resendInvite: {
                        assertionHint: "Please confirm your action.",
                        content: "If you resend the invitation, the previous invitation link will be revoked. " +
                            "Please proceed with caution.",
                        header: "Are you sure?",
                        message: "This action will permanently revoke the previous invitation."
                    }
                },
                form: {
                    sendmail: {
                        subTitle: "Send an email invite to add a new admin or developer to your organization",
                        title: "Invite Admin/Developer"
                    }
                },
                inviteButton: "New Invitation",
                notifications: {
                    deleteInvite: {
                        error: {
                            description: "{{description}}",
                            message: "Error while deleting the invitation"
                        },
                        genericError: {
                            description: "Couldn't delete the invitation",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully deleted the user's invitation.",
                            message: "Invitation deletion successful"
                        }
                    },
                    resendInvite: {
                        error: {
                            description: "{{description}}",
                            message: "Error while resending the invitation"
                        },
                        genericError: {
                            description: "Couldn't resend the invitation",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully resent the invitation via email.",
                            message: "Invitation resent"
                        }
                    },
                    sendInvite: {
                        error: {
                            description: "{{description}}",
                            message: "Error while sending the invitation"
                        },
                        genericError: {
                            description: "Couldn't send the invitation",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully sent the invitation via email.",
                            message: "Invitation sent"
                        }
                    },
                    updateInvite: {
                        error: {
                            description: "{{description}}",
                            message: "Error while updating the invite"
                        },
                        genericError: {
                            description: "Couldn't update the invite",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully updated the invite.",
                            message: "Invitation update successful"
                        }
                    }
                },
                placeholder: {
                    emptyResultPlaceholder: {
                        addButton: "New Invitation",
                        subTitle: {
                            0: "There are currently no invitations available.",
                            1: "You can create an organization and invite users",
                            2: "to get onboarded to you organization."
                        },
                        title: "Send a New Invite"
                    },
                    emptySearchResultPlaceholder: {
                        clearButton: "Clear search query",
                        subTitle: {
                            0: "We couldn't find any results for {{query}}",
                            1: "Please try a different search term."
                        },
                        title: "No results found"
                    }
                },
                rolesUpdateModal: {
                    header: "Update Invitee Roles",
                    searchPlaceholder: "Search by role name",
                    subHeader: "Add or remove roles from the user that you have invited."
                },
                subSelection: {
                    invitees: "Invitees",
                    onBoard: "Onboarded Users"
                }
            },
            oidcScopes: {
                addAttributes: {
                    description: "Select which user attributes you want to associate with the scope {{name}}."
                },
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
                        assertionHint: "Please confirm your action.",
                        content: "If you delete this scope, you will not be able to get it back. " +
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
                                0: "There are no attributes added for this OIDC scope.",
                                1: "Please add the required attributes to view them here."
                            },
                            title: "No OIDC attributes"
                        },
                        emptySearch: {
                            action: "View all",
                            subtitles: {
                                0: "We couldn't find the attribute you searched for.",
                                1: "Please try a different name."
                            },
                            title: "No results found"
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
                                    empty: "This field cannot be empty"
                                }
                            },
                            scopeName: {
                                label: "Scope",
                                placeholder: "Enter the scope",
                                validations: {
                                    empty: "This field cannot be empty",
                                    invalid: "Scope can only contain alphanumeric characters and _. " +
                                    "And must be of length between 3 to 40 characters."
                                }
                            }
                        }
                    }
                },
                list: {
                    columns: {
                        actions: "Actions",
                        name: "Name"
                    },
                    empty: {
                        action: "Add OIDC Scope",
                        subtitles: {
                            0: "There no OIDC Scopes in the system.",
                            1: "Please add new OIDC scopes to view them here."
                        },
                        title: "No OIDC Scopes"
                    },
                    searchPlaceholder: "Search by scope"
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
                            description: "Successfully added the new OIDC attribute.",
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
                            description: "Successfully the new OIDC scope.",
                            message: "Creation successful"
                        }
                    },
                    claimsMandatory: {
                        error: {
                            description: "To add a scope, you need to make sure that the scope " +
                                "has at least one attribute.",
                            message: "You need to select at least one attribute."
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
                placeholders:{
                    emptyList: {
                        action: "New OIDC Scope",
                        subtitles: {
                            0: "There are no OIDC scopes at the moment.",
                            1: "You can add a new OIDC scope easily by following the",
                            2: "steps in the creation wizard."
                        },
                        title: "Add a new OIDC Scope"
                    },
                    emptySearch: {
                        action: "View all",
                        subtitles: {
                            0: "We couldn't find the scope you searched for.",
                            1: "Please try a different name."
                        },
                        title: "No results found"
                    }
                },
                wizards: {
                    addScopeWizard: {
                        buttons: {
                            next: "Next",
                            previous: "Previous"
                        },
                        claimList: {
                            searchPlaceholder: "Search attributes",
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
                        subTitle: "Create a new OpenID Connect (OIDC) scope with required attributes",
                        title: "Create OpenID Connect Scope"
                    }
                }
            },
            onboarded: {
                confirmationModal: {
                    removeUser: {
                        assertionHint: "Please confirm your action.",
                        content: "If you remove this user, the user will not be able to access the console " +
                            "within your organization. Please proceed with caution.",
                        header: "Are you sure?",
                        message: "This action is irreversible and will remove the user from your organization."
                    }
                },
                notifications: {
                    removeUser: {
                        error: {
                            description: "{{description}}",
                            message: "Error while removing the user"
                        },
                        genericError: {
                            description: "Couldn't remove the user from the {{tenant}} organization",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully removed the user from the {{tenant}} organization",
                            message: "User removed successfully"
                        }
                    }
                }
            },
            organizations: {
                advancedSearch: {
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "E.g. Name etc."
                            },
                            filterCondition: {
                                placeholder: "E.g. Starts With etc."
                            },
                            filterValue: {
                                placeholder: "Enter value to search"
                            }
                        }
                    },
                    placeholder: "Search by Name"
                },
                confirmations: {
                    deleteOrganization: {
                        assertionHint: "Please confirm your action.",
                        content: "If you remove this organization, all the data associated with this" +
                            " organization will be removed. Please proceed with caution.",
                        header: "Are you sure?",
                        message: "This action is irreversible and will remove the organization entirely."
                    }
                },
                edit: {
                    attributes: {
                        hint: "Configure organization attributes",
                        key: "Name",
                        keyRequiredErrorMessage: "Name is required",
                        value: "Value",
                        valueRequiredErrorMessage: "Value is required"
                    },
                    back: "Back",
                    dangerZone: {
                        subHeader: "Are you sure you want to delete this organization?",
                        title: "Delete Organization"
                    },
                    description: "Edit Organization",
                    fields: {
                        created: {
                            ariaLabel: "Created",
                            label: "Created"
                        },
                        description: {
                            ariaLabel: "Organization Description",
                            label: "Organization Description",
                            placeholder: "Enter organization description"
                        },
                        domain: {
                            ariaLabel: "Organization Domain",
                            label: "Organization Domain"
                        },
                        id: {
                            ariaLabel: "Organization ID",
                            label: "Organization ID"
                        },
                        lastModified: {
                            ariaLabel: "Last Modified",
                            label: "Last Modified"
                        },
                        name: {
                            ariaLabel: "Organization Name",
                            label: "Organization Name",
                            placeholder: "Enter organization name"
                        },
                        type: {
                            ariaLabel: "Organization Type",
                            label: "Organization Type"
                        }
                    },
                    tabTitles: {
                        attributes: "Attributes",
                        overview: "Overview"
                    }
                },
                forms: {
                    addOrganization:{
                        description: {
                            label: "Description",
                            placeholder: "Enter description"
                        },
                        domainName: {
                            label: "Domain Name",
                            placeholder: "Enter domain name",
                            validation: {
                                duplicate: "Domain name already exists",
                                empty: "Domain name is required"
                            }
                        },
                        name: {
                            label: "Organization Name",
                            placeholder: "Enter organization name",
                            validation: {
                                duplicate: "Organization name already exists",
                                empty: "Organization name is required"
                            }
                        },
                        structural: "Structural",
                        tenant: "Tenant",
                        type: "Type"
                    }
                },
                homeList: {
                    description: "View the list of all the available organizations.",
                    name: "All Organizations"
                },
                list: {
                    actions: {
                        add: "Add Organization"
                    },
                    columns: {
                        actions: "Actions",
                        name: "Name"
                    }
                },
                modals: {
                    addOrganization: {
                        header: "Add Organization",
                        subtitle1: "Create a new organization in {{parent}}.",
                        subtitle2: "Create a new organization."
                    }
                },
                notifications: {
                    addOrganization: {
                        error: {
                            description: "{{description}}",
                            message: "Error while adding the organization"
                        },
                        genericError: {
                            description: "An error occurred while adding the organization",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully added the organization",
                            message: "Organization added successfully"
                        }
                    },
                    deleteOrganization: {
                        error: {
                            description: "{{description}}",
                            message: "Error while deleting the organization"
                        },
                        genericError: {
                            description: "An error occurred while deleting the organization",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully deleted the organization",
                            message: "Organization deleted successfully"
                        }
                    },
                    deleteOrganizationWithSubOrganizationError: "Organization {{ organizationName }} cannot be " +
                        "deleted since it has one or more sub organizations.",
                    fetchOrganization: {
                        error: {
                            description: "{{description}}",
                            message: "Error while fetching the organization"
                        },
                        genericError: {
                            description: "An error occurred while fetching the organization",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully fetched the organization",
                            message: "Organization fetched successfully"
                        }
                    },
                    getOrganizationList: {
                        error: {
                            description: "{{description}}",
                            message: "Error while getting the organization list"
                        },
                        genericError: {
                            description: "An error occurred while getting the organization list",
                            message: "Something went wrong"
                        }
                    },
                    updateOrganization: {
                        error: {
                            description: "{{description}}",
                            message: "Error while updating the organization"
                        },
                        genericError: {
                            description: "An error occurred while updating the organization",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully updated the organization",
                            message: "Organization updated successfully"
                        }
                    },
                    updateOrganizationAttributes: {
                        error: {
                            description: "{{description}}",
                            message: "Error while updating the organization attributes"
                        },
                        genericError: {
                            description: "An error occurred while updating the organization attributes",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully updated the organization attributes",
                            message: "Organization attributes updated successfully"
                        }
                    }
                },
                placeholders: {
                    emptyList: {
                        action: "Add Organization",
                        subtitles: {
                            0: "There are no organizations at the moment.",
                            1: "You can add a new organization easily by",
                            2: "clicking on the button below."
                        },
                        title: "Add a new Organization"
                    }
                },
                subTitle: "Create and manage organizations.",
                switching: {
                    emptyList: "There is no organization to show.",
                    search: {
                        placeholder: "Search by Name"
                    }
                },
                title: "Organizations"
            },
            overview: {
                widgets: {
                    insights: {
                        groups: {
                            heading: "Groups",
                            subHeading: "Overview of Groups"
                        },
                        users: {
                            heading: "Users",
                            subHeading: "Overview of Users"
                        }
                    },
                    overview: {
                        cards: {
                            groups: {
                                heading: "Groups"
                            },
                            users: {
                                heading: "Users"
                            },
                            userstores: {
                                heading: "User Stores"
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
            remoteFetch: {
                components: {
                    status: {
                        details: "Details",
                        header: "Remote Configurations",
                        hint: "No applications deployed currently.",
                        linkPopup: {
                            content: "",
                            header: "Github Repository URL",
                            subHeader: ""
                        },
                        refetch: "Refetch"
                    }
                },
                forms: {
                    getRemoteFetchForm: {
                        actions: {
                            remove: "Remove Configuration",
                            save: "Save Configuration"
                        },
                        fields: {
                            accessToken: {
                                label: "Github Personal Access Token",
                                placeholder: "Personal Access Token"
                            },
                            connectivity: {
                                children: {
                                    polling: {
                                        label: "Polling"
                                    },
                                    webhook: {
                                        label: "Webhook"
                                    }
                                },
                                label: "Connectivity Mechanism"
                            },
                            enable: {
                                hint: "Enable configuration to fetch applications",
                                label: "Enable Fetch Configuration"
                            },
                            gitBranch: {
                                hint: "Enable configuration to fetch applications",
                                label: "Github Branch",
                                placeholder: "Ex : Main",
                                validations: {
                                    required: "Github branch is required."
                                }
                            },
                            gitFolder: {
                                hint: "Enable configuration to fetch applications",
                                label: "GitHub Directory",
                                placeholder: "Ex : SampleConfigFolder/",
                                validations: {
                                    required: "Github configuration directory is required."
                                }
                            },
                            gitURL: {
                                label: "GitHub Repository URL",
                                placeholder: "Ex : https://github.com/samplerepo/sample-project",
                                validations: {
                                    required: "Github Repository URL is required."
                                }
                            },
                            pollingFrequency: {
                                label: "Polling Frequency"
                            },
                            sharedKey: {
                                label: "GitHub Shared Key"
                            },
                            username: {
                                label: "Github Username",
                                placeholder: "Ex: John Doe"
                            }
                        },
                        heading: {
                            subTitle: "Configure repository for fetching applications",
                            title: "Application Configuration Repository"
                        }
                    }
                },
                modal: {
                    appStatusModal: {
                        description: "",
                        heading: "Application Fetch Status",
                        primaryButton: "Refetch Applications",
                        secondaryButton: ""
                    }
                },
                notifications: {
                    createRepoConfig: {
                        error: {
                            description: "{{ description }}",
                            message: "Create Error"
                        },
                        genericError: {
                            description: "An error occurred while creating remote repo config.",
                            message: "Create Error"
                        },
                        success: {
                            description: "Successfully created remote repo config.",
                            message: "Create Successful"
                        }
                    },
                    deleteRepoConfig: {
                        error: {
                            description: "{{ description }}",
                            message: "Delete Error"
                        },
                        genericError: {
                            description: "An error occurred while deleting remote repo config.",
                            message: "Delete Error"
                        },
                        success: {
                            description: "Successfully deleted remote repo config.",
                            message: "Delete Successful"
                        }
                    },
                    getConfigDeploymentDetails: {
                        error: {
                            description: "{{ description }}",
                            message: "Retrieval Error"
                        },
                        genericError: {
                            description: "An error occurred while retrieving deployment details.",
                            message: "Retrieval Error"
                        },
                        success: {
                            description: "Successfully retrieved deployment details.",
                            message: "Retrieval Successful"
                        }
                    },
                    getConfigList: {
                        error: {
                            description: "{{ description }}",
                            message: "Retrieval Error"
                        },
                        genericError: {
                            description: "An error occurred while retrieving deployment config list.",
                            message: "Retrieval Error"
                        },
                        success: {
                            description: "Successfully retrieved deployment config list.",
                            message: "Retrieval Successful"
                        }
                    },
                    getRemoteRepoConfig: {
                        error: {
                            description: "{{ description }}",
                            message: "Retrieval Error"
                        },
                        genericError: {
                            description: "An error occurred while retrieving the repo config.",
                            message: "Retrieval Error"
                        },
                        success: {
                            description: "Successfully retrieved the repo config.",
                            message: "Retrieval Successful"
                        }
                    },
                    triggerConfigDeployment: {
                        error: {
                            description: "{{ description }}",
                            message: "Deployment Error"
                        },
                        genericError: {
                            description: "An error occurred while deploying repo configs.",
                            message: "Deployment Error"
                        },
                        success: {
                            description: "Successfully deployed repo configs.",
                            message: "Deployment Successful"
                        }
                    }
                },
                pages: {
                    listing: {
                        subTitle: "Configure github repository to work seamlessly with the identity server.",
                        title: "Remote Configurations"
                    }
                },
                placeholders: {
                    emptyListPlaceholder: {
                        action: "Configure Repository",
                        subtitles: "Currently there are no repositories configured. You can add a new configuration.",
                        title: "Add Configuration"
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
                                    group: "User Store",
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
                                hint: "A name for the {{type}}.",
                                label: "{{type}} Name",
                                placeholder: "Enter {{type}} name",
                                validations: {
                                    duplicate: "A {{type}} already exists with the given {{type}} name.",
                                    empty: "{{type}} Name is required to proceed.",
                                    invalid: "A {{type}} name can only contain alphanumeric characters, -, and _. "
                                        + "And must be of length between 3 to 30 characters."
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
                    subHeading: "Create a new {{type}} in the system.",
                    summary: {
                        labels: {
                            domain: {
                                group: "User Store",
                                role: "Role Type"
                            },
                            groups: "Assigned Group(s)",
                            permissions: "Permission(s)",
                            roleName: "{{type}} Name",
                            users: "Assigned User(s)"
                        }
                    },
                    users: {
                        assignUserModal: {
                            heading: "Manage Users",
                            hint: "Select users to add them to the user group.",
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
                        3: "Summary",
                        4: "Groups & Users",
                        5: "Assign Roles"
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
                            assertionHint: "Please confirm your action.",
                            content: "If you delete this {{type}}, the permissions attached to it will be " +
                                "deleted and the users attached to it will no longer be able to perform intended " +
                                "actions which were previously allowed. Please proceed with caution",
                            header: "Are you sure?",
                            message: "This action is irreversible and will permanently delete the selected {{type}}"
                        },
                        dangerZone: {
                            actionTitle: "Delete {{type}}",
                            buttonDisableHint: "Delete option is disabled because this {{type}} is managed in a" +
                                " remote user store.",
                            header: "Delete {{type}}",
                            subheader: "Once you delete the {{type}}, it cannot be recovered."
                        },
                        fields: {
                            roleName: {
                                name: "Role Name",
                                placeholder: "Enter role name",
                                required: "Role name is required"
                            }
                        }
                    },
                    groups: {
                        addGroupsModal: {
                            heading: "Update Role Groups",
                            subHeading: "Add new groups or remove existing groups assigned to the role."
                        },
                        emptyPlaceholder: {
                            action: "Assign Group",
                            subtitles: "There are no groups assigned to this role at the moment.",
                            title: "No Groups Assigned"
                        },
                        heading: "Assigned Groups",
                        subHeading: "Add or remove the groups assigned to this role. Note that this "
                            + "will affect performing certain tasks."
                    },
                    menuItems: {
                        basic: "Basics",
                        groups: "Groups",
                        permissions: "Permissions",
                        roles: "Roles",
                        users: "Users"
                    },
                    users: {
                        list: {
                            emptyPlaceholder: {
                                action: "Assign User",
                                subtitles: "There are no users assigned to the {{type}} at the moment.",
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
                    columns: {
                        actions: "Actions",
                        lastModified: "Modified Time",
                        name: "Role"
                    },
                    confirmations: {
                        deleteItem: {
                            assertionHint: "Please confirm your action.",
                            content: "If you delete this {{type}}, the permissions attached to it will be " +
                                "deleted and the users attached to it will no longer be able to perform " +
                                "intended actions which were previously allowed. Please proceed with caution.",
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
                            placeholder: "localhost"
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
                }
            },
            sidePanel: {
                accountManagement: "Account Management",
                addEmailTemplate: "Add Email Template",
                addEmailTemplateLocale: "Add Email Template Locale",
                approvals: "Approvals",
                attributeDialects: "Attributes",
                categories: {
                    attributes: "User Attributes",
                    certificates: "Certificates",
                    configurations: "Configurations",
                    general: "General",
                    organizations: "Organizations",
                    users: "Users",
                    userstores: "User Stores"
                },
                certificates: "Certificates",
                configurations: "Configurations",
                editEmailTemplate: "Email Templates",
                editExternalDialect: "Edit Attribute Mapping",
                editGroups: "Edit Group",
                editLocalClaims: "Edit Attributes",
                editRoles: "Edit Role",
                editUsers: "Edit User",
                editUserstore: "Edit User Store",
                emailTemplateTypes: "",
                emailTemplates: "Email Templates",
                generalConfigurations: "General",
                groups: "Groups",
                localDialect: "Attributes",
                loginAttemptsSecurity: "Login Attempts Security",
                multiFactorAuthenticators: "Multi Factor Authenticators",
                organizations: "Organizations",
                otherSettings: "Other Settings",
                overview: "Overview",
                passwordPolicies: "Password Policies",
                remoteFetchConfig: "Remote Configurations",
                roles: "Roles",
                userOnboarding: "User Onboarding",
                users: "Users",
                userstoreTemplates: "User Store Templates",
                userstores: "User Stores"
            },
            transferList: {
                list: {
                    emptyPlaceholders: {
                        default: "There are no items in this list at the moment.",
                        groups: {
                            selected: "There are no {{type}} assigned to this group.",
                            unselected: "There are no {{type}} available to assign to this group."
                        },
                        roles: {
                            selected: "There are no {{type}} assigned with this role.",
                            unselected: "There are no {{type}} available to assign with this role."
                        },
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
                deleteJITUser: {
                    confirmationModal: {
                        content: "If you delete this user, the user will not be able to log in to My Account or any " +
                            "other application to which the user was subscribed to until the next time the user " +
                            "signs in using a social login option."
                    }
                },
                deleteUser: {
                    confirmationModal: {
                        assertionHint: "Please confirm your action.",
                        content: "If you delete this user, the user will not be able to log in to My Account or " +
                            "any other application the user was subscribed to before. Please proceed with caution.",
                        header: "Are you sure?",
                        message: "This action is irreversible and will permanently delete the user."
                    }
                },
                disableUser: {
                    confirmationModal: {
                        assertionHint: "Please confirm your action.",
                        content: "If you disable this user, the user will not be able to log in to My Account or " +
                            "any other application the user was subscribed to before.",
                        header: "Are you sure?",
                        message: "Make sure that the user no longer requires access to the system."
                    }
                },
                editUser: {
                    dangerZoneGroup: {
                        deleteUserZone: {
                            actionTitle: "Delete User",
                            buttonDisableHint: "Delete option is disabled because this user is managed in a remote " +
                                "user store.",
                            header: "Delete user",
                            subheader: "This action will permanently delete the user from the organization. Please " +
                                "be certain before you proceed."
                        },
                        disableUserZone: {
                            actionTitle: "Disable User",
                            header: "Disable user",
                            subheader: "Once you disable an account, the user cannot access the system."
                        },
                        header: "Danger Zone",
                        lockUserZone: {
                            actionTitle: "Lock User",
                            header: "Lock user",
                            subheader: "Once you lock the account, the user can no longer log in to the system."
                        },
                        passwordResetZone: {
                            actionTitle: "Reset Password",
                            buttonHint: "This user account should be unlocked to reset the password.",
                            header: "Reset password",
                            subheader: "Once you change the password, the user will no longer be able to log in to " +
                                "any application using the current password."
                        }
                    },
                    dateOfBirth: {
                        placeholder: {
                            part1:"Enter the",
                            part2: "in the format YYYY-MM-DD"
                        }
                    }
                },
                forms: {
                    addUserForm: {
                        buttons: {
                            radioButton: {
                                label: "Select the method to set the user password",
                                options: {
                                    askPassword: "Invite the user to set their own password",
                                    createPassword: "Set a temporary password for the user"

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
                                label: "User Store",
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
                                placeholder: "Enter the first name",
                                validations: {
                                    empty: "First name is a required field"
                                }
                            },
                            lastName: {
                                label: "Last Name",
                                placeholder: "Enter the last name",
                                validations: {
                                    empty: "Last name is a required field"
                                }
                            },
                            newPassword: {
                                label: "Password",
                                placeholder: "Enter the password",
                                validations: {
                                    empty: "Password is a required field",
                                    regExViolation: "Please enter a valid password"
                                }
                            },
                            username: {
                                label: "Username",
                                placeholder: "Enter the username",
                                validations: {
                                    empty: "Username is a required field",
                                    invalid: "A user already exists with this username.",
                                    invalidCharacters: "Username seems to contain invalid characters.",
                                    regExViolation: "Please enter a valid email address."
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
                                description: "The password has been changed successfully.",
                                message: "Password reset successful"
                            }
                        }
                    }
                },
                lockUser: {
                    confirmationModal: {
                        assertionHint: "Please confirm your action.",
                        content: "If you lock this account, the user will not be able to sign in to " +
                            "any of the business applications. Please proceed with caution.",
                        header: "Are you sure?",
                        message: "This action locks the user account."
                    }
                },
                modals: {
                    addUserWarnModal: {
                        heading: "Warning",
                        message: "Please note that this created user will not be assigned with a role. If you " +
                            "wish to assign roles to this user please click on the button below."
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
                            domain: "User Store",
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
                    },
                    changePasswordModal: {
                        button: "Reset Password",
                        header: "Reset User Password",
                        hint: {
                            forceReset: "WARNING: Please note that after inviting the user to change the password " +
                                "the user will no longer be able to log into any application using the current " +
                                "password. The password reset link will be valid for {{codeValidityPeriod}} minutes.",
                            setPassword: "WARNING: Please note that after changing the password the user will " +
                                "no longer be able to log into any application using the current password."
                        },
                        message: "WARNING: Please note that after changing the password the user will no longer be " +
                            "able to log into any application using the current password.",
                        passwordOptions: {
                            forceReset: "Invite user to reset the password",
                            setPassword: "Set a new password for the user"
                        }
                    }
                },
                profile: {
                    fields: {
                        createdDate: "Created Date",
                        emails: "Email",
                        generic: {
                            default: "Add {{fieldName}}"
                        },
                        modifiedDate: "Modified Date",
                        name_familyName: "Last Name",
                        name_givenName: "First Name",
                        oneTimePassword: "One Time Password",
                        phoneNumbers: "Phone Number",
                        photos: "Photos",
                        profileUrl: "URL",
                        userId: "User ID",
                        userName: "Username"
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
                        changeUserPassword: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while changing the user password."
                            },
                            genericError: {
                                description: "Error occurred while changing the user password.",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "The password of the user was changed successfully.",
                                message: "Successfully changed password"
                            }
                        },
                        disableUserAccount: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while disabling the user account."
                            },
                            genericError: {
                                description: "Error occurred while disabling the user account.",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "The user account disabled successfully.",
                                message: "{{name}}'s account is disabled"
                            }
                        },
                        enableUserAccount: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while enabling the user account."
                            },
                            genericError: {
                                description: "Error occurred while enabling the user account.",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "The user account enabled successfully.",
                                message: "{{name}}'s account is enabled"
                            }
                        },
                        forcePasswordReset: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while triggering the password reset flow."
                            },
                            genericError: {
                                description: "Error occurred while triggering the password reset flow.",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "Password reset is successfully initiated for the user account.",
                                message: "Initiated password reset"
                            }
                        },
                        getProfileInfo: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while retrieving the profile details"
                            },
                            genericError: {
                                description: "Error occurred while retrieving the profile details.",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "The required user profile details are retrieved successfully.",
                                message: "Successfully retrieved user profile"
                            }
                        },
                        lockUserAccount: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while locking the user account."
                            },
                            genericError: {
                                description: "Error occurred while locking the user account.",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "The user account locked successfully.",
                                message: "{{name}}'s account is locked"
                            }
                        },
                        noPasswordResetOptions: {
                            error: {
                                description: "None of the force password options are enabled.",
                                message: "Unable to trigger a force password reset"
                            }
                        },
                        unlockUserAccount: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while unlocking the user account."
                            },
                            genericError: {
                                description: "Error occurred while unlocking the user account.",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "The user account unlocked successfully.",
                                message: "{{name}}'s account is unlocked"
                            }
                        },
                        updateProfileInfo: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while updating the profile details"
                            },
                            genericError: {
                                description: "Error occurred while updating the profile details.",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "The required user profile details were successfully updated.",
                                message: "User profile updated successfully"
                            }
                        }
                    },
                    placeholders: {
                        SCIMDisabled: {
                            heading: "This feature is not available for your account"
                        },
                        userProfile: {
                            emptyListPlaceholder: {
                                subtitles: "The profile information is not available for this user.",
                                title: "No profile information"
                            }
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
                            subHeading: "Add or remove the groups user is assigned with and note that this will " +
                                "affect performing certain tasks."
                        },
                        notifications: {
                            addUserGroups: {
                                error: {
                                    description: "{{description}}",
                                    message: "Error occurred while updating user groups"
                                },
                                genericError: {
                                    description: "An error occurred while updating user groups.",
                                    message: "Something went wrong"
                                },
                                success: {
                                    description: "Assigning new groups for the user successful.",
                                    message: "Update user groups successful"
                                }
                            },
                            fetchUserGroups: {
                                error: {
                                    description: "{{description}}",
                                    message: "Error occurred while fetching the groups list"
                                },
                                genericError: {
                                    description: "Error occurred while fetching the groups list.",
                                    message: "Something went wrong"
                                },
                                success: {
                                    description: "The groups list was successfully retrieved.",
                                    message: "User groups list retrieved successfully"
                                }
                            },
                            removeUserGroups: {
                                error: {
                                    description: "{{description}}",
                                    message: "Error occurred while updating the groups of the user"
                                },
                                genericError: {
                                    description: "An error occurred while updating user groups.",
                                    message: "Something went wrong"
                                },
                                success: {
                                    description: "Removing assigned groups for the user successful.",
                                    message: "Update user groups successful"
                                }
                            },
                            updateUserGroups: {
                                error: {
                                    description: "{{description}}",
                                    message: "Error occurred while updating user groups"
                                },
                                genericError: {
                                    description: "An error occurred while updating user groups.",
                                    message: "Something went wrong"
                                },
                                success: {
                                    description: "Updating assigned groups for the user successful.",
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
                            confirmationModal: {
                                assertionHint: "Please confirm your action.",
                                content: "Modifying the role will result in the user either losing " +
                                    "or gaining access to certain features. Please proceed with caution.",
                                header: "Are you sure?",
                                message: "This action will modify the role of this user."
                            },
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
                            subHeading: "Add or remove the roles this user is assigned with and note that this " +
                                "will affect performing certain tasks."
                        },
                        notifications: {
                            addUserRoles: {
                                error: {
                                    description: "{{description}}",
                                    message: "Error occurred while updating user roles"
                                },
                                genericError: {
                                    description: "An error occurred while updating user roles.",
                                    message: "Something went wrong"
                                },
                                success: {
                                    description: "Assigning new roles for the user successful.",
                                    message: "Update user roles successful"
                                }
                            },
                            fetchUserRoles: {
                                error: {
                                    description: "{{description}}",
                                    message: "Error occurred while fetching the roles list"
                                },
                                genericError: {
                                    description: "Error occurred while fetching the roles list.",
                                    message: "Something went wrong"
                                },
                                success: {
                                    description: "The roles list was successfully retrieved.",
                                    message: "User roles list retrieved successfully"
                                }
                            },
                            removeUserRoles: {
                                error: {
                                    description: "{{description}}",
                                    message: "Error occurred while updating the roles of the user"
                                },
                                genericError: {
                                    description: "An error occurred while updating user roles.",
                                    message: "Something went wrong"
                                },
                                success: {
                                    description: "Removing assigned roles for the user successful.",
                                    message: "Update user roles successful"
                                }
                            },
                            updateUserRoles: {
                                error: {
                                    description: "{{description}}",
                                    message: "Error occurred while updating the roles of the user"
                                },
                                genericError: {
                                    description: "An error occurred while updating user roles.",
                                    message: "Something went wrong"
                                },
                                success: {
                                    description: "Updating assigned roles for the user successful.",
                                    message: "Update user roles successful"
                                }
                            }
                        },
                        viewPermissionModal: {
                            backButton: "Back to list",
                            editButton: "Edit Permissions",
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
                confirmations: {
                    terminateAllSessions: {
                        assertionHint: "Please confirm your action.",
                        content: "If you proceed with this action, the user will be logged out of all active " +
                            "sessions. They will loose the progress of any ongoing tasks. Please proceed with caution.",
                        header: "Are you sure?",
                        message: "This action is irreversible and will permanently terminate all the active sessions."
                    },
                    terminateSession: {
                        assertionHint: "Please confirm your action.",
                        content: "If you proceed with this action, the user will be logged out of the selected " +
                            "session. They will loose the progress of any ongoing tasks. Please proceed with caution.",
                        header: "Are you sure?",
                        message: "This action is irreversible and will permanently terminate the session."
                    }
                },
                consumerUsers: {
                    fields: {
                        username: {
                            label: "Username",
                            placeholder: "Enter the username",
                            validations: {
                                empty: "Username is a required field",
                                invalid: "A user already exists with this username.",
                                invalidCharacters: "Username seems to contain invalid characters.",
                                regExViolation: "Please enter a valid email address."
                            }
                        }
                    }
                },
                editUser: {
                    tab: {
                        menuItems: {
                            0: "Profile",
                            1: "Groups",
                            2: "Roles",
                            3: "Active Sessions"
                        }
                    }
                },
                forms: {
                    validation: {
                        dateFormatError: "The format of the {{field}} entered is incorrect. Valid format is " +
                            "YYYY-MM-DD.",
                        formatError: "The format of the {{field}} entered is incorrect.",
                        futureDateError: "The date you entered for the {{field}} field is invalid.",
                        mobileFormatError: "The format of the {{field}} entered is incorrect.  Valid format is " +
                            "[+][country code][area code][local phone number]."
                    }
                },
                guestUsers: {
                    fields: {
                        username: {
                            label: "Username",
                            placeholder: "Enter the username",
                            validations: {
                                empty: "Username is a required field",
                                invalid: "A user already exists with this username.",
                                invalidCharacters: "Username seems to contain invalid characters.",
                                regExViolation: "Please enter a valid email address."
                            }
                        }
                    }
                },
                list: {
                    columns: {
                        actions: "Actions",
                        name: "Name"
                    }
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
                    },
                    userstoreError: {
                        subtitles: {
                            0: "Couldn't fetch users from the user store",
                            1: "Please try again"
                        },
                        title: "Something went wrong"
                    }
                },
                userSessions: {
                    components: {
                        sessionDetails: {
                            actions: {
                                terminateAllSessions: "Terminate All",
                                terminateSession: "Terminate Session"
                            },
                            labels: {
                                activeApplication: "Active Applications",
                                browser: "Browser",
                                deviceModel: "Device Model",
                                ip: "IP Address",
                                lastAccessed: "Last Accessed {{ date }}",
                                loggedInAs: "Logged in on <1>{{ app }}</1> as <3>{{ user }}</3>",
                                loginTime: "Login Time",
                                os: "Operating System",
                                recentActivity: "Recent Activity"
                            }
                        }
                    },
                    dangerZones: {
                        terminate: {
                            actionTitle: "Terminate",
                            header: "Terminate session",
                            subheader: "You will be logged out of the session on the particular device."
                        }
                    },
                    notifications: {
                        getAdminUser: {
                            error: {
                                description: "{{ description }}",
                                message: "Retrieval Error"
                            },
                            genericError: {
                                description: "An error occurred while retrieving the current user type.",
                                message: "Retrieval Error"
                            }
                        },
                        getUserSessions: {
                            error: {
                                description: "{{ description }}",
                                message: "Retrieval Error"
                            },
                            genericError: {
                                description: "An error occurred while retrieving user sessions.",
                                message: "Retrieval Error"
                            },
                            success: {
                                description: "Successfully retrieved user sessions.",
                                message: "Retrieval Successful"
                            }
                        },
                        terminateAllUserSessions: {
                            error: {
                                description: "{{ description }}",
                                message: "Termination Error"
                            },
                            genericError: {
                                description: "An error occurred while terminating the user sessions.",
                                message: "Termination Error"
                            },
                            success: {
                                description: "Successfully terminated all the user sessions.",
                                message: "Termination Successful"
                            }
                        },
                        terminateUserSession: {
                            error: {
                                description: "{{ description }}",
                                message: "Termination Error"
                            },
                            genericError: {
                                description: "An error occurred while terminating the user session.",
                                message: "Termination Error"
                            },
                            success: {
                                description: "Successfully terminated the user session.",
                                message: "Termination Successful"
                            }
                        }
                    },
                    placeholders: {
                        emptyListPlaceholder: {
                            subtitles: "There are no active sessions for this user.",
                            title: "No active sessions"
                        }
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
                        all: "All user stores",
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
                    placeholder: "Search by user store name"
                },
                confirmation: {
                    confirm: "Confirm",
                    content: "If you delete this user store, the user data in this user store will also be deleted. "
                        + "Please proceed with caution.",
                    header: "Are you sure?",
                    hint: "Please type confirm your action.",
                    message: "This action is irreversible and will permanently delete the"
                        + " selected user store and the data in it."
                },
                dangerZone: {
                    delete: {
                        actionTitle: "Delete User Store",
                        header: "Delete User Store",
                        subheader: "Once you delete a user store, there is no going back. "
                            + "Please be certain."
                    },
                    disable: {
                        actionTitle: "Enable User Store",
                        header: "Enable User Store",
                        subheader: "Disabling a user store can make you lose access to the users in the user store. " +
                            "Proceed with caution."
                    }
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
                            requiredErrorMessage: "Name is a required field",
                            validationErrorMessages: {
                                alreadyExistsErrorMessage: "A user store with this name already exists."
                            }
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
                            description: "There was an error while creating the user store.",
                            message: "Something went wrong!"
                        },
                        success: {
                            description: "The user store has been added successfully!",
                            message: "User store added successfully!"
                        }
                    },
                    apiLimitReachedError: {
                        error: {
                            description: "You have reached the maximum number of user stores allowed.",
                            message: "Failed to create the user store"
                        }
                    },
                    delay: {
                        description: "It may take a while for the user store list to be updated. "
                            + "Refresh in a few seconds to get the updated user store list.",
                        message: "Updating user store list takes time"
                    },
                    deleteUserstore: {
                        genericError: {
                            description: "There was an error while deleting the user store.",
                            message: "Something went wrong!"
                        },
                        success: {
                            description: "The user store has been deleted successfully!",
                            message: "User store deleted successfully!"
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
                            description: "An error occurred while fetching the user store type details.",
                            message: "Something went wrong"
                        }
                    },
                    fetchUserstoreTypes: {
                        genericError: {
                            description: "An error occurred while fetching the user store types.",
                            message: "Something went wrong"
                        }
                    },
                    fetchUserstores: {
                        genericError: {
                            description: "An error occurred while fetching user stores.",
                            message: "Something went wrong"
                        }
                    },
                    testConnection: {
                        genericError: {
                            description: "An error occurred while testing the " + "connection to the user store",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The connection is healthy.",
                            message: "Connection successful!"
                        }
                    },
                    updateDelay: {
                        description: "It might take some time for the updated properties to appear.",
                        message: "Updating properties takes time"
                    },
                    updateUserstore: {
                        genericError: {
                            description: "An error occurred while updating the user store.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "This user store has been updated successfully!",
                            message: "User store updated successfully!"
                        }
                    }
                },
                pageLayout: {
                    edit: {
                        back: "Go back to user stores",
                        description: "Edit user store",
                        tabs: {
                            connection: "Connection",
                            general: "General",
                            group: "Group",
                            user: "User"
                        }
                    },
                    list: {
                        description: "Create and manage user stores.",
                        primaryAction: "New User Store",
                        title: "User Stores"
                    },
                    templates: {
                        back: "Go back to user stores",
                        description: "Please choose one of the following user store types.",
                        templateHeading: "Quick Setup",
                        templateSubHeading: "Predefined set of templates to speed up your user store creation.",
                        title: "Select User Store Type"
                    }
                },
                placeholders: {
                    emptyList: {
                        action: "New User Store",
                        subtitles: "There are currently no user stores available."
                            + "You can add a new user store easily by following the "
                            + "steps in the user store creation wizard.",
                        title: "Add a new user store"
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
                    reset: "Reset Changes",
                    title: "SQL Query Types",
                    update: "Update"
                },
                wizard: {
                    header: "Add {{type}} User Store",
                    steps: {
                        general: "General",
                        group: "Group",
                        summary: "Summary",
                        user: "User"
                    }
                }
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
            addEmailTemplate: {
                backButton: "Go back to {{name}} template",
                subTitle: null,
                title: "Add New Template"
            },
            approvalsPage: {
                subTitle: "Review operational tasks that requires your approval",
                title: "Approvals"
            },
            editTemplate: {
                backButton: "Go back to {{name}} template",
                subTitle: null,
                title: "{{template}}"
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
            invite: {
                subTitle: "Invite and manage admins and developers.",
                title: "Admins & Developers"
            },
            oidcScopes: {
                subTitle: "Create and manage OpenID Connect (OIDC) scopes and the attributes bound to the scopes.",
                title: "OpenID Connect Scopes"
            },
            oidcScopesEdit: {
                backButton: "Go back to Scopes",
                subTitle: "Add or remove OIDC attributes of the scope",
                title: "Edit scope: {{ name }}"
            },
            organizations: {
                subTitle: "Create and manage organizations.",
                title: "Organizations"
            },
            overview: {
                subTitle: "Configure and  manage users, roles, attribute dialects, server configurations etc." +
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
                backButton: "Go back to Users",
                subTitle: "{{name}}",
                title: "{{email}}"
            }
        },
        placeholders: {
            emptySearchResult: {
                action: "Clear search query",
                subtitles: {
                    0: "We couldn't find any results for \"{{query}}\"",
                    1: "Please try a different search term."
                },
                title: "No results found"
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
    }
};
