/**
 * Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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

import { ConsoleNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */
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
        community: "Community",
        cookieConsent: {
            confirmButton: "Got It",
            content: "We use cookies to ensure that you get the best overall experience. These cookies are used to " +
                "maintain an uninterrupted continuous session while providing smooth and personalized services. To " +
                "learn more about how we use cookies, refer our <1>Cookie Policy</1>."
        },
        dateTime: {
            humanizedDateString: "Last modified {{date}} ago"
        },
        dropdown: {
            footer: {
                privacyPolicy: "Privacy",
                cookiePolicy: "Cookies",
                termsOfService: "Terms"
            }
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
            featureAnnouncements: {
                organizations: {
                    message: "Introducing B2B organizations. Start building your B2B platform by onboarding your " +
                    "partner/customer organizations.",
                    buttons: {
                        tryout: "Try It Out"
                    }
                }
            },
            organizationSwitch: {
                breadcrumbError: {
                    description: "An error occurred while fetching the organization hierarchy.",
                    message: "Something went wrong"
                },
                emptyOrgListMessage: "No organizations available",
                orgSearchPlaceholder: "Search by organization name"
            }
        },
        help: {
            communityLinks: {
                discord: "Ask on Discord",
                stackOverflow: "Ask on Stack Overflow"
            },
            docSiteLink: "Documentation",
            helpCenterLink: {
                title: "Contact Support",
                subtitle: "Talk to the {{productName}} team to obtain personalized assistance."
            },
            helpDropdownLink: "Get Help"
        },
        marketingConsent: {
            heading: "Let's stay in touch!",
            description: "Subscribe to get the latest news and product updates straight to your inbox.",
            actions: {
                subscribe: "Subscribe",
                decline: "Don't show this again"
            },
            notifications: {
                errors: {
                    fetch: {
                        message: "Something went wrong",
                        description: "Something went wrong when getting user consent data"
                    },
                    update: {
                        message: "Something went wrong",
                        description: "Something went wrong when updating user consent"
                    }
                }
            }
        },
        modals: {
            editAvatarModal: {
                content: {
                    gravatar: {
                        errors: {
                            noAssociation: {
                                content: "It seems like the selected email is not registered on Gravatar. " +
                                "Sign up for a Gravatar account by visiting <1>Gravatar official website</1> or use " +
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
        quickStart: {
            greeting: {
                alternativeHeading: "Welcome back, {{username}}!",
                heading: "Welcome, {{username}}!",
                subHeading: "Here’s how you can get started"
            },
            sections: {
                addSocialLogin: {
                    actions: {
                        setup: "Set Up Social Connections",
                        view: "View Social Connections"
                    },
                    description:
                    "Let your users log in to your applications with an Identity Provider of " + "their choice",
                    heading: "Add social login"
                },
                integrateApps: {
                    actions: {
                        create: "Register Application",
                        manage: "Explore Applications",
                        view: "View Applications"
                    },
                    capabilities: {
                        sso: "SSO",
                        mfa: "MFA",
                        social: "Social Login"
                    },
                    description:
                    "Register your app and design the user login experience you want by configuring " +
                    "SSO, MFA, social login, and various flexible authentication rules.",
                    heading: "Add login to your apps"
                },
                learn: {
                    actions: {
                        view: "View Docs"
                    },
                    description:
                    "Get started using Asgardeo. Implement authentication for any kind of application " +
                    "in minutes.",
                    heading: "Learn"
                },
                manageUsers: {
                    actions: {
                        create: "Add Users",
                        manage: "Manage Users",
                        view: "View Users"
                    },
                    capabilities: {
                        collaborators: "Administrators",
                        customers: "Users",
                        groups: "User Groups"
                    },
                    description:
                    "Create user accounts for users and invite administrators to your organization. " +
                    "Allow your users to securely self-manage their profiles.",
                    heading: "Manage users and groups"
                },
                asgardeoTryIt: {
                    errorMessages: {
                        appCreateGeneric: {
                            message: "Something went wrong!",
                            description: "Failed to initialize the Try It app."
                        },
                        appCreateDuplicate: {
                            message: "Application already exists!",
                            description: "Please delete the existing {{productName}} Try It application."
                        }
                    }
                }
            }
        },
        sidePanel: {
            privacy: "Privacy",
            loginAndRegistration: {
                label: "Login & Registration",
                description: "Configure login and registration settings."
            },
            userAttributesAndStores: "User Attributes & Stores",
            userManagement: "Identity Management",
            branding: "Branding",
            tenants: "Root Organizations",
            policyAdministration: "Policy Administration"
        },
        upgrade: "Upgrade",
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
                    },
                    deleteCertificate: {
                        assertionHint: "Please confirm your action.",
                        content: "This is the only certificate available for this trusted token issuer. " +
                            "If this certificate is deleted, {{productName}} will no longer be able to validate tokens " +
                            "issued from this issuer.<1> Proceed with caution.</1>",
                        header: "Are you sure?",
                        message: "This action is irreversible and will permanently delete the certificate."
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
                            secretValidityPeriod: {
                                hint: "The validity period of the generated client secret in seconds. A new client secret " +
                                    "will be generated after this time.",
                                label: "Client Secret Validity Period",
                                placeholder: "Enter the Validity Period for the Client Secret.",
                                validations: {
                                    required: "Client Secret Validity Period is not a required field."
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
                                    digits: "digits",
                                    characters: "characters"
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
                                hint: "Please check this checkbox to enable alphanumeric characters. Otherwise numeric characters will be used.",
                                label: "Use alphanumeric characters for OTP",
                                validations: {
                                    required: "Use alphanumeric characters for OTP is a required field."
                                }
                            }
                        },
                        smsOTP: {
                            hint: "Ensure that an <1>SMS Provider</1> is configured for the OTP feature to work properly.",
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
                            tokenLength: {
                                hint: "The number of allowed characters in the OTP. Please " +
                                    "pick a value between <1>4-10</1>.",
                                label: "SMS OTP length",
                                placeholder: "Enter SMS OTP length.",
                                validations: {
                                    invalid: "SMS OTP length should be an integer.",
                                    range: {
                                        digits: "SMS OTP length should be between 4 & 10 digits.",
                                        characters: "SMS OTP length should be between 4 & 10 characters."
                                    },
                                    required: "SMS OTP length is a required field."
                                },
                                unit: {
                                    digits: "digits",
                                    characters: "characters"
                                }
                            },
                            useNumericChars: {
                                hint: "Please clear this checkbox to enable alphanumeric characters.",
                                label: "Use only numeric characters for OTP",
                                validations: {
                                    required: "Use only numeric characters for OTP token is a required field."
                                }
                            },
                            allowedResendAttemptCount: {
                                hint: "The number of allowed OTP resend attempts.",
                                label: "Allowed OTP resend attempt count",
                                placeholder: "Enter allowed resend attempt count.",
                                validations: {
                                    required: "Allowed OTP resend attempt count is a required field.",
                                    invalid: "Allowed OTP resend attempt count should be an integer.",
                                    range: "Allowed OTP resend attempt count should be between 0 & 100."
                                }
                            }
                        },
                        fido2: {
                            allowProgressiveEnrollment: {
                                label: "Allow passkey progressive enrollment",
                                hint: "Please clear this checkbox to disable passkey progressive enrollment."
                            },
                            allowUsernamelessAuthentication: {
                                label: "Allow passkey usernameless authentication",
                                hint: "Please clear this checkbox to disable usernameless authentication."
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
                        microsoft: {
                            commonAuthQueryParams: {
                                ariaLabel: "Microsoft authenticator additional query parameters",
                                hint: "Additional query parameters to be sent to Microsoft.",
                                label: "Additional Query Parameters",
                                placeholder: "Enter additional query parameters.",
                                validations: {
                                    required: "Client secret is not a required field."
                                }
                            },
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
                        hypr: {
                            appId: {
                                hint: "The <1>Application ID</1> you received from HYPR for your OAuth app.",
                                label: "Relying Party App ID",
                                placeholder: "Enter App ID from HYPR application.",
                                validations: {
                                    required: "Relying Party App ID is a required field."
                                }
                            },
                            apiToken: {
                                hint: "The relying party app access token generated in the control center.",
                                label: "API Token",
                                placeholder: "Enter API token from HYPR",
                                validations: {
                                    required: "API token is a required field."
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
                            baseUrl: {
                                hint: "iProov base URL",
                                label: "Base URL",
                                placeholder: "Enter Base URL.",
                                validations: {
                                    required: "Base URL is a required field."
                                }
                            },
                            oauthUsername: {
                                hint: "OAuth username from created identity provider in iProov.",
                                label: "OAuth Username",
                                placeholder: "Enter OAuth username from created identity provider in iProov.",
                                validations: {
                                    required: "OAuth username is a required field."
                                }
                            },
                            oauthPassword: {
                                hint: "OAuth password from created identity provider in iProov.",
                                label: "OAuth Password",
                                placeholder: "Enter OAuth password from created identity provider in iProov.",
                                validations: {
                                    required: "OAuth password is a required field."
                                }
                            },
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
                            enableProgressiveEnrollment: {
                                hint: "Enable Progressive Enrollment with iProov.",
                                label: "Enable Progressive Enrollment"
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
                            commonAuthQueryParams: {
                                ariaLabel: "SAML request additional query parameters",
                                label: "Additional query parameters"
                            },
                            isAssertionSigned: {
                                ariaLabel: "Enable assertion signing",
                                hint: "Specify if SAMLAssertion element is signed",
                                label: "Enable assertion signing"
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
                            isEnableAssertionEncryption: {
                                ariaLabel: "Enable assertion encryption",
                                hint: "Specify if SAMLAssertion element is encrypted",
                                label: "Enable assertion encryption"
                            },
                            authenticationContextClass: {
                                ariaLabel: "Authentication context class",
                                hint: "Authentication context class",
                                label: "Authentication context class",
                                placeholder: "Search available authentication context classes"
                            },
                            customAuthenticationContextClass: {
                                ariaLabel: "Custom Authentication context class",
                                hint: "Specify the custom authentication context class",
                                label: "Custom authentication context class",
                                placeholder: "Enter custom authentication context class"
                            },
                            attributeConsumingServiceIndex: {
                                ariaLabel: "Attribute consuming service index",
                                hint: "Specify the Attribute Consuming Service Index",
                                label: "Attribute consuming service index",
                                placeholder: "Enter attribute consuming service index"
                            },
                            isArtifactBindingEnabled: {
                                ariaLabel: "Enable artifact binding",
                                hint: "Enable artifact binding",
                                label: "Enable artifact binding"
                            },
                            artifactResolveEndpointUrl: {
                                ariaLabel: "Artifact resolve endpoint URL",
                                hint: "Specify the artifact resolve endpoint URL",
                                label: "Artifact resolve endpoint URL",
                                placeholder: "Enter artifact resolve endpoint URL"
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
                            authContextComparisonLevel: {
                                ariaLabel: "Authentication context comparison level",
                                hint: "Authentication context comparison level",
                                label: "Authentication context comparison level",
                                placeholder: ""
                            }
                        }
                    },
                    common: {
                        customProperties: "Custom Properties",
                        invalidQueryParamErrorMessage: "These are not valid query parameters",
                        invalidScopesErrorMessage: "Scopes must contain 'openid'",
                        invalidURLErrorMessage: "Enter a valid URL",
                        requiredErrorMessage: "This field cannot be empty"
                    },
                    generalDetails: {
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
                        },
                        issuer: {
                            hint: "A unique issuer value of the trusted token issuer.",
                            label: "Issuer",
                            placeholder: "Enter the issuer."
                        },
                        alias: {
                            hint: "Alias value for {{productName}} in the trusted token issuer.",
                            label: "Alias",
                            placeholder: "Enter the alias."
                        }
                    },
                    jitProvisioning: {
                        associateLocalUser: {
                            label: "Associate provisioned users with existing local users",
                            hint: "When enabled, users that are provisioned with this identity " +
                                "provider will be linked to the local users who are already registered " +
                                "with the same email address."
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
                            mappedRolesAbsentMessage: "With your current configuration, <1>Group Attribute</1> is not configured. " +
                                "You can select an attribute from the dropdown.",
                            mappedRolesPresentMessage: "Please note that <1>{{ mappedRolesClaim }}</1> which is mapped to the <1>{{ rolesClaim }}</1> attribute " +
                                "will be considered as the default <1>Group Attribute</1> with the current configuration. " +
                                "You can select an attribute from the dropdown.",
                            messageOIDC: "Please note that OpenID Connect attribute named <1>{{ attribute }}</1> will be considered as the default " +
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
                    },
                    certificateSection: {
                        heading: "Certificates",
                        description: "The certificate information provided here is used to verify signed responses from the external Identity Provider (IdP).",
                        info: "This validation is applicable only to federated IdP-initiated logout, and federated authentication flows " +
                        "that use native SDK-based app-native authentication.",
                        certificateEditSwitch: {
                            jwks: "Use JWKS Endpoint",
                            pem: "Provide Certificates"
                        },
                        noCertificateAlert: "There are no certificates available for this trusted token issuer. " +
                            "Therefore {{productName}} will no longer be able to validate tokens issued from this issuer."
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
                                idpDescription: "Provide a unique name for the connection.",
                                heading: "Name"
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
                    trustedTokenIssuer: {
                        addWizard: {
                            title: "Trusted token issuer",
                            subtitle: "Register a trusted token issuer to exchange its token for a token issued by {{productName}}"
                        },
                        forms: {
                            steps: {
                                general: "General Settings",
                                certificate: "Certificates"
                            },
                            name: {
                                label: "Trusted token issuer name",
                                placeholder: "Enter a name for the trusted token isser"
                            },
                            issuer: {
                                label: "Issuer",
                                placeholder: "Enter the issuer",
                                hint: "A unique issuer value of the trusted token issuer.",
                                validation: {
                                    notValid: "{{issuer}} is not a valid issuer."
                                }
                            },
                            alias: {
                                label: "Alias",
                                placeholder: "Enter the alias",
                                hint: "Alias value for {{productName}} in the trusted token issuer.",
                                validation: {
                                    notValid: "{{alias}} is not a valid alias."
                                }
                            },
                            certificateType: {
                                label: "Mode of certificate configuration",
                                requiredCertificate: "A certificate is required to create a trusted token issuer."
                            },
                            jwksUrl: {
                                optionLabel: "JWKS endpoint",
                                placeholder: "Enter JWKS endpoint URL",
                                label: "JWKS endpoint URL",
                                hint: "{{productName}} will use this URL to obtain keys to verify the signed responses from " +
                                    "your trusted token issuer.",
                                validation: {
                                    notValid: "Please enter a valid URL"
                                }
                            },
                            pem: {
                                optionLabel: "Use PEM certificate",
                                hint: "{{productName}} will use this certificate to verify the signed responses from " +
                                    "your trusted token issuer.",
                                uploadCertificateButtonLabel: "Upload certificate file",
                                dropzoneText: "Drag and drop a certificate file here.",
                                pasteAreaPlaceholderText: "Paste trusted token issuer certificate in PEM format."
                            }
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
                    organizationIDP: {
                        wizardHelp: {
                            name: {
                                description: "Provide a unique name for the enterprise authentication provider so" +
                                    " that it can be easily identified.",
                                heading: "Name"
                            },
                            description: {
                                description: "Provide a description for the enterprise authentication provider to" +
                                    " explain more about it.",
                                heading: "Description",
                                example: "E.g., This is the authenticator for MyOrg, which acts as the IDP for MyApp."
                            }
                        }
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
                    hypr: {
                        wizardHelp: {
                            apiToken: {
                                description: "Provide the <1>API Token</1> obtained from HYPR. This will be used to access HYPR's APIs.",
                                heading: "API Token"
                            },
                            appId: {
                                description: "Provide the <1>Application ID</1> of the application registered in the HYPR control center.",
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
                                rpDescription: "Before you begin, create a relying party application in the <1>HYPR control center</1>, and obtain the application ID.",
                                tokenDescription: "You also have to obtain an <1>API token</1> for your application created on HYPR.",
                                heading: "Prerequisite"
                            }
                        }
                    },
                    iproov: {
                        wizardHelp: {
                            baseUrl: {
                                description: "Provide the <1>base URL</1>  of your iProov server deployment.",
                                heading: "Base URL"
                            },
                            oauthUsername: {
                                description: "Provide the <1>OAuth Username</1> of the application registered in the iProov control center.",
                                heading: "OAUTH Username"
                            },
                            oauthPassword: {
                                description: "Provide the <1>OAuth Password</1> of the application registered in the iProov control center.",
                                heading: "OAUTH Password"
                            },
                            apiKey: {
                                description: "Provide the <1>API Key</1> of the application registered in the iProov control center.",
                                heading: "API Key"
                            },
                            apiSecret: {
                                description: "Provide the <1>API Secret</1> of the application registered in the iProov control center.",
                                heading: "API Secret"
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
                            preRequisites: {
                                appDescription: "Before you begin, create an identity provider in the <1>iPortal</1>, and obtain the API key, API Secret, OAuth username and OAuth password.",
                                heading: "Prerequisite"
                            }
                        }
                    },
                    manualSetup: {
                        heading: "Manual Setup",
                        subHeading: "Create a connection with custom configurations."
                    },
                    quickSetup: {
                        heading: "Quick Setup",
                        subHeading: "Predefined set of templates to speed up your connection creation."
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
            },
            suborganizations: {
                notifications: {
                    tierLimitReachedError: {
                        emptyPlaceholder: {
                            action: "View Plans",
                            subtitles: "You can contact the organization administrator or (if you are the " +
                                "administrator) upgrade your subscription to increase the allowed limit.",
                            title: "You have reached the maximum number of allowed organizations."
                        },
                        heading: "You've reached the maximum limit for organizations"
                    },
                    subOrgLevelsLimitReachedError: {
                        emptyPlaceholder: {
                            action: "View Plans",
                            subtitles: "You can contact the organization administrator or (if you are the " +
                                "administrator) upgrade your subscription to increase the allowed limit.",
                            title: "You have reached the maximum number of allowed organization levels."
                        },
                        heading: "You’ve reached the maximum organization levels allowed for the organization."
                    },
                    duplicateOrgError: {
                        message: "An organization with the same name already exists.",
                        description: "The organization you are trying to create already exists."
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
                            heading: "Connections",
                            subHeading: "Create and manage connections based on templates and configure authentication."
                        },
                        remoteFetch: {
                            heading: "Remote Fetch",
                            subHeading: "Configure a remote repository to work seamlessly with WSO2 Identity Server."
                        }
                    }
                }
            },
            sidePanel: {
                applicationEdit: "Application Edit",
                applicationTemplates: "Application Templates",
                applications: "Applications",
                authenticationProviderEdit: "Connections Edit",
                authenticationProviderTemplates: "Connection Templates",
                authenticationProviders: "Connections",
                categories: {
                    application: "Applications",
                    authenticationProviders: "Connections",
                    general: "General",
                    gettingStarted: "Getting Started",
                    identityProviders: "Connections",
                    identityVerificationProviders: "Identity Verification Providers",
                    extensions: "Extensions"
                },
                customize: "Customize",
                identityProviderEdit: "Connections Edit",
                identityProviderTemplates: "Connection Templates",
                identityProviders: "Connections",
                oidcScopes: "Scopes",
                oidcScopesEdit: "Scopes Edit",
                overview: "Overview",
                remoteRepo: "Remote Repo Config",
                remoteRepoEdit: "Remote Repo Config Edit"
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
                subTitle: "Create an application using one of the templates given below. If nothing matches your " +
                    "application type, start with the Standard-Based Application template.",
                title: "Create a New Application"
            },
            applications: {
                alternateSubTitle: "Manage your applications and customize login flows.",
                subTitle: "Create and manage your applications and configure sign-in.",
                title: "Applications"
            },
            applicationsEdit: {
                backButton: "Go back to Applications",
                subTitle: null,
                title: null
            },
            applicationsSettings: {
                backButton: "Go back to Applications",
                subTitle: "Dynamic Client Registration (DCR) can be used to create applications using DCR API.",
                title: "Dynamic Client Registration",
                learnMore: "Learn More",
                notifications: {
                    error: {
                        description: "{{description}}",
                        message: "Update error"
                    },
                    genericError: {
                        description: "Failed to update DCR configurations.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully updated DCR configurations.",
                        message: "Update successful"
                    }
                }
            },
            authenticationProvider: {
                subTitle: "Create and manage connections to use in the login flow of your applications.",
                title: "Connections"
            },
            authenticationProviderTemplate: {
                backButton: "Go back to Connections",
                disabledHint: {
                    apple: "The Sign in with Apple feature cannot be configured with localhost or 127.0.0.1. Attempting this setup results in an invalid domain error from Apple's configuration step. For testing, use a real or DNS-resolvable domain name. For local development, domain mappings in the `etc/hosts` file can be utilized."
                },
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
                subTitle: "Manage connections to allow users to log in to your application through them.",
                title: "Connections"
            },
            idpTemplate: {
                backButton: "Go back to connections",
                subTitle: "Choose one of the following connections.",
                supportServices: {
                    authenticationDisplayName: "Authentication",
                    provisioningDisplayName: "Provisioning"
                },
                title: "Select Connection"
            },
            idvp: {
                subTitle: "Manage Identity Verification Providers to allow users to verify their identities " +
                    "through them.",
                title: "Identity Verification Providers"
            },
            idvpTemplate: {
                backButton: "Go back to Identity Verification Providers",
                subTitle: "Choose one of the following identity verification providers.",
                title: "Select Identity Verification Provider",
                search: {
                    placeholder: "Search by name"
                }
            },
            overview: {
                subTitle: "Configure and manage applications, connections, users and roles, attribute " +
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
                        Claims: "Claims",
                        "REQUEST ID": "Request ID",
                        Roles: "Roles",
                        "User Store Domain": "User Store Domain",
                        Username: "Username",
                        "Role Name": "Role Name",
                        Groups: "Groups",
                        "Tenant Domain": "Tenant Domain",
                        Permissions: "Permissions",
                        Users: "Users",
                        Audience: "Audience",
                        "Audience ID": "Audience ID",
                        "Users to be Added": "Users to be added",
                        "Users to be Deleted": "Users to be deleted",
                        "Role ID": "Role ID"
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
                    axschema: {
                        description: "The Attribute Exchange Schema (axschema) representation "
                            + "for user attributes.",
                        heading: "Attribute Exchange Schema"
                    },
                    custom: {
                        description: "The custom protocol representation for user "
                            + "attributes.",
                        heading: "Custom Attributes"
                    },
                    eidas: {
                        description: "The eIDAS protocol representation for user attributes.",
                        heading: "eIDAS"
                    },
                    oidc: {
                        description: "The OpenID Connect (OIDC) protocol representation for user "
                            + "attributes.",
                        heading: "OpenID Connect"
                    },
                    scim: {
                        description: "The SCIM2 protocol representation for "
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
                            + "also be deleted. Please proceed with caution.",
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
                        },
                        fetchSCIMResource: {
                            genericError: {
                                description: "There was an error while fetching the SCIM resources.",
                                message: "Something went wrong"
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
                            placeholder: "Enter a user attribute to map to",
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
                            placeholder: "Enter the display name",
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
                        requiredWarning: "To make the email attribute not display and not required on the user's profile, " +
                            "you need to disable account verification for your organization.",
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
                    },
                    saveChangesButton: "Save Changes"
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
                goBackLoginAndRegistration: "Go back to login & registration",
                categories: "Categories",
                connectorSubHeading: "Configure {{ name }} settings.",
                connectorCategories: {
                    passwordPolicies : {
                        name: "Password Policies",
                        description: "Configure password policies to enhance user password strength.",
                        connectors: {
                            passwordExpiry: {
                                friendlyName: "Password Expiry"
                            },
                            passwordHistory: {
                                friendlyName: "Password History",
                                properties: {
                                    passwordHistoryEnable: {
                                        hint: "User will not be allowed to use previously used passwords.",
                                        label: "Validate password history"
                                    },
                                    passwordHistoryCount: {
                                        hint: "Restrict using this number of last used passwords during password update.",
                                        label: "Password history validation count"
                                    }
                                }
                            },
                            passwordPolicy: {
                                friendlyName: "Password Patterns",
                                properties: {
                                    passwordPolicyEnable: {
                                        hint: "Validate user passwords against a policy",
                                        label: "Validate passwords based on a policy pattern"
                                    },
                                    passwordPolicyMinLength: {
                                        hint: "Minimum number of characters in the password.",
                                        label: "Minimum number of characters"
                                    },
                                    passwordPolicyMaxLength: {
                                        hint: "Maximum number of characters in the password.",
                                        label: "Maximum number of characters"
                                    },
                                    passwordPolicyPattern: {
                                        hint: "The regular expression pattern to validate the password.",
                                        label: "Password pattern regex"
                                    },
                                    passwordPolicyErrorMsg: {
                                        hint: "This error message will be displayed when a pattern violation is detected.",
                                        label: "Error message on pattern violation"
                                    }
                                }
                            }
                        }
                    },
                    userOnboarding : {
                        name: "User Onboarding",
                        description: "Configure user onboarding settings.",
                        connectors: {
                            askPassword: {
                                friendlyName: "Invite user to set the password"
                            },
                            selfSignUp: {
                                friendlyName: "Self Registration",
                                properties: {
                                    selfRegistrationEnable: {
                                        hint: "Allow user's to self register to the system.",
                                        label: "User self registration"
                                    },
                                    selfRegistrationLockOnCreation: {
                                        hint: "Lock self registered user account until e-mail verification.",
                                        label: "Lock user account on creation"
                                    },
                                    selfRegistrationSendConfirmationOnCreation: {
                                        hint: "Enable user account confirmation when the user account is not locked on creation",
                                        label: "Enable Account Confirmation On Creation"
                                    },
                                    selfRegistrationNotificationInternallyManage: {
                                        hint: "Disable if the client application handles notification sending",
                                        label: "Manage notifications sending internally"
                                    },
                                    selfRegistrationReCaptcha: {
                                        hint: "Enable reCaptcha verification during self registration.",
                                        label: "Prompt reCaptcha"
                                    },
                                    selfRegistrationVerificationCodeExpiryTime: {
                                        hint: "Specify the expiry time in minutes for the verification link.",
                                        label: "User self registration verification link expiry time"
                                    },
                                    selfRegistrationVerificationCodeSmsotpExpiryTime: {
                                        hint: "Specify the expiry time in minutes for the SMS OTP.",
                                        label: "User self registration SMS OTP expiry time"
                                    },
                                    selfRegistrationSmsotpRegex: {
                                        hint: "Regex for SMS OTP in format [allowed characters]{length}. Supported character ranges are a-z, A-Z, 0-9. Minimum OTP length is 4",
                                        label: "User self registration SMS OTP regex"
                                    },
                                    selfRegistrationCallbackRegex: {
                                        hint: "This prefix will be used to validate the callback URL.",
                                        label: "User self registration callback URL regex"
                                    },
                                    urlListPurposeSelfSignUp: {
                                        hint: "Click here to manage Self-Sign-Up purposes",
                                        label: "Manage Self-Sign-Up purposes"
                                    },
                                    selfRegistrationNotifyAccountConfirmation: {
                                        hint: "Enable sending notification for self sign up confirmation.",
                                        label: "Send sign up confirmation email"
                                    },
                                    selfRegistrationResendConfirmationReCaptcha: {
                                        hint: "Prompt reCaptcha verification for resend confirmation",
                                        label: "Prompt reCaptcha on re-send confirmation"
                                    },
                                    selfRegistrationAutoLoginEnable: {
                                        hint: "User will be logged in automatically after completing the Account Confirmation",
                                        label: "Enable Auto Login After Account Confirmation"
                                    },
                                    selfRegistrationAutoLoginAliasName: {
                                        hint: "Alias of the key used to sign to cookie. The public key has to be imported to the keystore.",
                                        label: "Alias of the key used to sign to cookie"
                                    }
                                }
                            },
                            liteUserSignUp: {
                                friendlyName: "Lite User Registration",
                                properties: {
                                    liteRegistrationEnable: {
                                        hint: "Allow user's to self register to the system without a password.",
                                        label: "Lite user registration"
                                    },
                                    liteRegistrationLockOnCreation: {
                                        hint: "Lock self registered user account until e-mail verification.",
                                        label: "Lock user account on creation"
                                    },
                                    liteRegistrationNotificationInternallyManage: {
                                        hint: "Disable if the client application handles notification sending",
                                        label: "Manage notifications sending internally"
                                    },
                                    liteRegistrationReCaptcha: {
                                        hint: "Enable reCaptcha verification during self registration.",
                                        label: "Prompt reCaptcha"
                                    },
                                    liteRegistrationVerificationCodeExpiryTime: {
                                        hint: "Specify the expiry time in minutes for the verification link.",
                                        label: "Lite user registration verification link expiry time"
                                    },
                                    liteRegistrationVerificationCodeSmsotpExpiryTime: {
                                        hint: "Specify the expiry time in minutes for the SMS OTP.",
                                        label: "Lite user registration SMS OTP expiry time"
                                    },
                                    liteRegistrationSmsotpRegex: {
                                        hint: "Regex for SMS OTP in format [allowed characters]{length}. Supported character ranges are a-z, A-Z, 0-9. Minimum OTP length is 4",
                                        label: "Lite user registration SMS OTP regex"
                                    },
                                    liteRegistrationCallbackRegex: {
                                        hint: "This prefix will be used to validate the callback URL.",
                                        label: "Lite user registration callback URL regex"
                                    },
                                    urlListPurposeLiteUserSignUp: {
                                        hint: "Click here to manage Lite-Sign-Up purposes",
                                        label: "Manage Lite-Sign-Up purposes"
                                    }
                                }
                            },
                            userEmailVerification: {
                                friendlyName: "Ask Password",
                                properties: {
                                    emailVerificationEnable: {
                                        hint: "An email will be sent to the user to set the password after user creation.",
                                        label: "Enable email invitations for user password setup"
                                    },
                                    emailVerificationLockOnCreation: {
                                        hint: "The user account will be locked during user creation.",
                                        label: "Enable account lock on creation"
                                    },
                                    emailVerificationNotificationInternallyManage: {
                                        hint: "Disable if the client application handles notification sending.",
                                        label: "Manage notifications sending internally"
                                    },
                                    emailVerificationExpiryTime: {
                                        hint: "Set the time span that the verification e-mail would be valid, in minutes. (For infinite validity period, set -1)",
                                        label: "Email verification code expiry time"
                                    },
                                    emailVerificationAskPasswordExpiryTime: {
                                        hint: "Set the time span that the ask password e-mail would be valid, in minutes. (For infinite validity period, set -1)",
                                        label: "Ask password code expiry time"
                                    },
                                    emailVerificationAskPasswordPasswordGenerator: {
                                        hint: "Temporary password generation extension point in ask password feature.",
                                        label: "Temporary password generation extension class"
                                    },
                                    urlListPurposeJitProvisioning: {
                                        hint: "Click here to manage just in time provisioning purposes.",
                                        label: "Manage JIT provisioning purposes"
                                    }
                                }
                            }
                        }
                    },
                    loginAttemptsSecurity : {
                        name: "Login Attempts Security",
                        description: "Configure login attempt security settings.",
                        connectors: {
                            accountLockHandler: {
                                friendlyName: "Account Lock",
                                properties: {
                                    accountLockHandlerLockOnMaxFailedAttemptsEnable: {
                                        hint: "Lock user accounts on failed login attempts",
                                        label: "Lock user accounts on maximum failed attempts"
                                    },
                                    accountLockHandlerOnFailureMaxAttempts: {
                                        hint: "Number of failed login attempts allowed until account lock.",
                                        label: "Maximum failed login attempts"
                                    },
                                    accountLockHandlerTime: {
                                        hint: "Initial account lock time period in minutes. Account will be automatically unlocked after this time period.",
                                        label: "Initial account lock duration"
                                    },
                                    accountLockHandlerLoginFailTimeoutRatio: {
                                        hint: "Account lock duration will be increased by this factor. Ex: Initial duration: 5m; Increment factor: 2; Next lock duration: 5 x 2 = 10m",
                                        label: "Account lock duration increment factor"
                                    },
                                    accountLockHandlerNotificationManageInternally: {
                                        hint: "Disable if the client application handles notification sending",
                                        label: "Manage notification sending internally"
                                    },
                                    accountLockHandlerNotificationNotifyOnLockIncrement: {
                                        hint: "Notify user when the account lock duration is increased due to continuous failed login attempts.",
                                        label: "Notify user when lock time is increased"
                                    }
                                }
                            },
                            ssoLoginRecaptcha: {
                                friendlyName: "reCaptcha for SSO Login",
                                properties: {
                                    ssoLoginRecaptchaEnableAlways: {
                                        hint: "Always prompt reCaptcha verification during SSO login flow.",
                                        label: "Always prompt reCaptcha"
                                    },
                                    ssoLoginRecaptchaEnable: {
                                        hint: "Prompt reCaptcha verification during SSO login flow only after the max failed attempts exceeded.",
                                        label: "Prompt reCaptcha after max failed attempts"
                                    },
                                    ssoLoginRecaptchaOnMaxFailedAttempts: {
                                        hint: "Number of failed attempts allowed without prompting reCaptcha verification.",
                                        label: "Max failed attempts for reCaptcha"
                                    }
                                }
                            }
                        }
                    },
                    accountManagement : {
                        name: "Account Management",
                        description: "Configure account management settings.",
                        connectors: {
                            suspensionNotification: {
                                friendlyName: "Idle Account Suspend",
                                properties: {
                                    suspensionNotificationEnable: {
                                        hint: "Lock user account after a given idle period.",
                                        label: "Suspend idle user accounts"
                                    },
                                    suspensionNotificationAccountDisableDelay: {
                                        hint: "Time period in days before locking the user account.",
                                        label: "Allowed idle time span in days"
                                    },
                                    suspensionNotificationDelays: {
                                        hint: "Send warning alerts to users before locking the account, after each period. Comma separated multiple values accepted.",
                                        label: "Alert sending time periods in days"
                                    }
                                }
                            },
                            accountDisableHandler: {
                                friendlyName: "Account Disable",
                                properties: {
                                    accountDisableHandlerEnable: {
                                        hint: "Allow an administrative user to disable user accounts",
                                        label: "Enable account disabling"
                                    },
                                    accountDisableHandlerNotificationManageInternally: {
                                        hint: "Disable, if the client application handles notification sending",
                                        label: "Manage notification sending internally"
                                    }
                                }
                            },
                            multiattributeLoginHandler: {
                                friendlyName: "Multi Attribute Login",
                                properties: {
                                    accountMultiattributeloginHandlerEnable: {
                                        hint: "Enable using multiple attributes as login identifier",
                                        label: "Enable Multi Attribute Login"
                                    },
                                    accountMultiattributeloginHandlerAllowedattributes: {
                                        hint: "Allowed claim list separated by commas",
                                        label: "Allowed Attribute Claim List"
                                    }
                                }
                            },
                            accountRecovery: {
                                friendlyName: "Account Management",
                                properties: {
                                    recoveryNotificationPasswordEnable: {
                                        label: "Notification based password recovery"
                                    },
                                    recoveryReCaptchaPasswordEnable: {
                                        label: "Enable reCaptcha for password recovery"
                                    },
                                    recoveryQuestionPasswordEnable: {
                                        label: "Security question based password recovery"
                                    },
                                    recoveryQuestionPasswordMinAnswers: {
                                        label: "Number of questions required for password recovery"
                                    },
                                    recoveryQuestionAnswerRegex: {
                                        hint: "Security question answer regex",
                                        label: "Security question answer regex"
                                    },
                                    recoveryQuestionAnswerUniqueness: {
                                        hint: "Enforce security question answer uniqueness",
                                        label: "Enforce security question answer uniqueness"
                                    },
                                    recoveryQuestionPasswordReCaptchaEnable: {
                                        hint: "Prompt reCaptcha for security question based password recovery",
                                        label: "Enable reCaptcha for security questions based password recovery"
                                    },
                                    recoveryQuestionPasswordReCaptchaMaxFailedAttempts: {
                                        label: "Max failed attempts for reCaptcha"
                                    },
                                    recoveryNotificationUsernameEnable: {
                                        label: "Username recovery"
                                    },
                                    recoveryReCaptchaUsernameEnable: {
                                        label: "Enable reCaptcha for username recovery"
                                    },
                                    recoveryNotificationInternallyManage: {
                                        hint: "Disable if the client application handles notification sending",
                                        label: "Manage notifications sending internally"
                                    },
                                    recoveryNotifySuccess: {
                                        label: "Notify when recovery success"
                                    },
                                    recoveryQuestionPasswordNotifyStart: {
                                        label: "Notify when security questions based recovery starts"
                                    },
                                    recoveryExpiryTime: {
                                        label: "Recovery link expiry time in minutes"
                                    },
                                    recoveryNotificationPasswordExpiryTimeSmsOtp: {
                                        hint: "Expiration time of the SMS OTP code for password recovery",
                                        label: "SMS OTP expiry time"
                                    },
                                    recoveryNotificationPasswordSmsOtpRegex: {
                                        hint: "Regex for SMS OTP in format [allowed characters]{length}. Supported character ranges are a-z, A-Z, 0-9. Minimum OTP length is 4",
                                        label: "SMS OTP regex"
                                    },
                                    recoveryQuestionPasswordForcedEnable: {
                                        hint: "Force users to provide answers to security questions during sign in",
                                        label: "Enable forced security questions"
                                    },
                                    recoveryQuestionMinQuestionsToAnswer: {
                                        hint: "Force users to provide answers to security questions during sign in if user has answered lesser than this value",
                                        label: "Minimum number of forced security questions to be answered"
                                    },
                                    recoveryCallbackRegex: {
                                        hint: "Recovery callback URL regex",
                                        label: "Recovery callback URL regex"
                                    },
                                    recoveryAutoLoginEnable: {
                                        hint: "User will be logged in automatically after completing the Password Reset wizard",
                                        label: "Enable Auto Login After Password Reset"
                                    }
                                }
                            },
                            adminForcedPasswordReset: {
                                friendlyName: "Password Reset",
                                properties: {
                                    recoveryAdminPasswordResetRecoveryLink: {
                                        hint: "User gets notified with a link to reset password",
                                        label: "Enable password reset via recovery e-mail"
                                    },
                                    recoveryAdminPasswordResetOtp: {
                                        hint: "User gets notified with a one time password to try with SSO login",
                                        label: "Enable password reset via OTP"
                                    },
                                    recoveryAdminPasswordResetOffline: {
                                        hint: "An OTP generated and stored in users claims",
                                        label: "Enable password reset offline"
                                    },
                                    recoveryAdminPasswordResetExpiryTime: {
                                        hint: "Validity time of the admin forced password reset code in minutes",
                                        label: "Admin forced password reset code expiry time"
                                    }
                                }
                            }
                        }
                    },
                    otherSettings : {
                        name: "Other Settings",
                        description: "Configure other settings.",
                        connectors: {
                            piiController: {
                                friendlyName: "Consent Information Controller",
                                properties: {
                                    piiController: {
                                        hint: "Name of the first Controller who collects the data",
                                        label: "Controller Name"
                                    },
                                    contact: {
                                        hint: "Contact name of the Controller",
                                        label: "Contact Name"
                                    },
                                    email: {
                                        hint: "Contact email address of the Controller",
                                        label: "Email Address"
                                    },
                                    phone: {
                                        hint: "Contact phone number of the Controller",
                                        label: "Phone Number"
                                    },
                                    onBehalf: {
                                        hint: "A user information (PII) Processor acting on behalf of a Controller or PII Processor",
                                        label: "On Behalf"
                                    },
                                    piiControllerUrl: {
                                        hint: "A URL for contacting the Controller",
                                        label: "Url"
                                    },
                                    addressCountry: {
                                        hint: "Country of the Controller",
                                        label: "Country"
                                    },
                                    addressLocality: {
                                        hint: "Locality of the Controller",
                                        label: "Locality"
                                    },
                                    addressRegion: {
                                        hint: "Region of the Controller",
                                        label: "Region"
                                    },
                                    postOfficeBoxNumber: {
                                        hint: "Post Office Box Number of the Controller",
                                        label: "Post Office Box Number"
                                    },
                                    postalCode: {
                                        hint: "Postal Code of the Controller",
                                        label: "Postal Code"
                                    },
                                    streetAddress: {
                                        hint: "Street Address of the Controller",
                                        label: "Street Address"
                                    }
                                }
                            },
                            analyticsEngine: {
                                friendlyName: "[Deprecated] Identity Server Analytics",
                                messages: {
                                    deprecation: {
                                        description: "WSO2 Identity Server Analytics is now deprecated. Use <1>ELK Analytics</1> instead.",
                                        heading: "Deprecated"
                                    }
                                },
                                properties: {
                                    adaptiveAuthenticationAnalyticsReceiver: {
                                        hint: "Target Host",
                                        label: "Target Host"
                                    },
                                    adaptiveAuthenticationAnalyticsBasicAuthEnabled: {
                                        hint: "Enable Basic Authentication",
                                        label: "Enable Basic Authentication"
                                    },
                                    adaptiveAuthenticationAnalyticsBasicAuthUsername: {
                                        hint: "Target Host Secured User ID",
                                        label: "User ID"
                                    },
                                    secretAdaptiveAuthenticationAnalyticsBasicAuthPassword: {
                                        hint: "Target Host Secured Secret",
                                        label: "Secret"
                                    },
                                    adaptiveAuthenticationAnalyticsHttpConnectionTimeout: {
                                        hint: "HTTP Connection Timeout in milliseconds",
                                        label: "HTTP Connection Timeout"
                                    },
                                    adaptiveAuthenticationAnalyticsHttpReadTimeout: {
                                        hint: "HTTP Read Timeout in milliseconds",
                                        label: "HTTP Read Timeout"
                                    },
                                    adaptiveAuthenticationAnalyticsHttpConnectionRequestTimeout: {
                                        hint: "HTTP Connection Request Timeout in milliseconds",
                                        label: "HTTP Connection Request Timeout"
                                    },
                                    adaptiveAuthenticationAnalyticsHostnameVerfier: {
                                        hint: "Hostname verification. (STRICT, ALLOW_ALL)",
                                        label: "Hostname verification"
                                    }
                                }
                            },
                            elasticAnalyticsEngine: {
                                friendlyName: "ELK Analytics",
                                warningModal: {
                                    configure: "<1>Configure</1> ELK Analytics settings for proper functionality.",
                                    reassure: "You can update your settings anytime."
                                },
                                properties: {
                                    adaptiveAuthenticationElasticReceiver: {
                                        hint: "Elasticsearch Host",
                                        label: "Elasticsearch Host"
                                    },
                                    adaptiveAuthenticationElasticBasicAuthEnabled: {
                                        hint: "Enable Basic Authentication",
                                        label: "Enable Basic Authentication"
                                    },
                                    adaptiveAuthenticationElasticBasicAuthUsername: {
                                        hint: "Elasticsearch Username",
                                        label: "Elasticsearch Username"
                                    },
                                    secretAdaptiveAuthenticationElasticBasicAuthPassword: {
                                        hint: "Elasticsearch User's Password",
                                        label: "Elasticsearch Password"
                                    },
                                    adaptiveAuthenticationElasticHttpConnectionTimeout: {
                                        hint: "HTTP Connection Timeout in milliseconds",
                                        label: "HTTP Connection Timeout"
                                    },
                                    adaptiveAuthenticationElasticHttpReadTimeout: {
                                        hint: "HTTP Read Timeout in milliseconds",
                                        label: "HTTP Read Timeout"
                                    },
                                    adaptiveAuthenticationElasticHttpConnectionRequestTimeout: {
                                        hint: "HTTP Connection Request Timeout in milliseconds",
                                        label: "HTTP Connection Request Timeout"
                                    },
                                    adaptiveAuthenticationElasticHostnameVerfier: {
                                        hint: "Hostname verification. (STRICT, ALLOW_ALL)",
                                        label: "Hostname verification"
                                    }
                                }
                            },
                            userClaimUpdate: {
                                friendlyName: "User Attribute Verification",
                                properties: {
                                    userClaimUpdateEmailEnableVerification: {
                                        hint: "Trigger a verification notification when user's email address is updated.",
                                        label: "Enable user email verification on update"
                                    },
                                    userClaimUpdateEmailVerificationCodeExpiryTime: {
                                        hint: "Validity time of the email confirmation link in minutes.",
                                        label: "Email verification on update link expiry time"
                                    },
                                    userClaimUpdateEmailEnableNotification: {
                                        hint: "Trigger a notification to the existing email address when the user attempts to update the existing email address.",
                                        label: "Enable user email notification on update"
                                    },
                                    userClaimUpdateMobileNumberEnableVerification: {
                                        hint: "Trigger a verification SMS OTP when user's mobile number is updated.",
                                        label: "Enable user mobile number verification on update"
                                    },
                                    userClaimUpdateMobileNumberVerificationCodeExpiryTime: {
                                        hint: "Validity time of the mobile number confirmation OTP in minutes.",
                                        label: "Mobile number verification on update SMS OTP expiry time"
                                    },
                                    userClaimUpdateMobileNumberEnableVerificationByPrivilegedUser: {
                                        hint: "Allow privileged users to initiate mobile number verification on update.",
                                        label: "Enable mobile number verification by privileged users"
                                    }
                                }
                            }
                        }
                    },
                    multiFactorAuthenticators : {
                        name: "Multi Factor Authenticators",
                        friendlyName: "Authenticator Settings",
                        description: "Configure multi factor authenticator settings.",
                        connectors: {
                            backupCodeAuthenticator: {
                                friendlyName: "Backup Code Authenticator",
                                properties: {
                                    backupCodeBackupCodeLength: {
                                        hint: "Length of a backup code",
                                        label: "Backup code length"
                                    },
                                    backupCodeBackupCodeSize: {
                                        hint: "Maximum number of backup codes",
                                        label: "Backup code size"
                                    }
                                }
                            }
                        }
                    },
                    sessionManagement: {
                        description: "Manage settings related to the session of your users."
                    },
                    saml2WebSsoConfiguration: {
                        description: "Configure SAML2 Web SSO for your applications."
                    },
                    wsFederationConfiguration: {
                        description: "Configure WS-Federation protocol for your applications."
                    }
                },
                disabled: "Disabled",
                enabled: "Enabled",
                form: {
                    errors: {
                        format: "The format is incorrect.",
                        positiveIntegers: "The number should not be less than 0."
                    }
                },
                genericDescription: "Configure settings related to {{ name }} connector.",
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
                            description: "{{ name }} configuration updated successfully.",
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
                        placeHolders: {
                            emptyListPlaceholder: {
                                subtitles: "There are no roles assigned to this group at the moment.",
                                title: "No Roles Assigned"
                            }
                        },
                        heading: "Assigned Roles",
                        addRolesModal: {
                            heading: "Update Group Roles",
                            subHeading: "Add new roles or remove existing roles assigned to the group."
                        },
                        subHeading: "View assigned roles for the group."
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
            parentOrgInvitations: {
                addUserWizard: {
                    heading: "Invite Parent Users",
                    description: "Invite users from the parent organization.",
                    hint: "Invited users are managed by the parent organization.",
                    username: {
                        label: "Usernames",
                        placeholder: "Enter the usernames",
                        hint: "Add the username of a parent user and press enter. Repeat to include multiple users.",
                        validations: {
                            required: "At least one user should be selected."
                        }
                    },
                    groups: {
                        label: "Groups",
                        placeholder: "Select groups",
                        hint: "Assign groups for the user that is being invited.",
                        validations: {
                            required: "Groups is a required field."
                        }
                    },
                    inviteButton: "Invite"
                },
                tab: {
                    usersTab: "Users",
                    invitationsTab: "Invitations"
                },
                searchPlaceholder: "Search by Username",
                searchdropdown: {
                    pendingLabel: "Pending",
                    expiredLabel: "Expired"
                },
                createDropdown: {
                    createLabel: "Create User",
                    inviteLabel: "Invite Parent User"
                },
                filterLabel: "Filter by: ",
                emptyPlaceholder: {
                    noPendingInvitations: "There are no pending invitations at the moment.",
                    noExpiredInvitations: "There are expired invitations at the moment.",
                    noInvitations: "There are no invitations at the moment.",
                    noCollaboratorUserInvitations: "There are no collaborator users with expired invitations at the moment."
                },
                invitedUserLabel: "Managed by parent organization"
            },
            oidcScopes: {
                back: "Go back to OpenID Connect Attrbute Mappings",
                viewAttributes: "View Attributes",
                manageAttributes: "Manage Attributes",
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
                                    duplicate: "This scope already exists.",
                                    empty: "This field cannot be empty.",
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
                            description: "Successfully created the new OIDC scope.",
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
                            description: "Successfully updated the OIDC scope {{ scope }}.",
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
                        action: "Clear search query",
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
            organizationDiscovery: {
                advancedSearch: {
                    form: {
                        dropdown: {
                            filterAttributeOptions: {
                                organizationName: "Organization Name"
                            }
                        },
                        inputs: {
                            filterAttribute: {
                                placeholder: "E.g. Organization Name etc."
                            },
                            filterCondition: {
                                placeholder: "E.g. Starts with etc."
                            },
                            filterValue: {
                                placeholder: "Enter value to search"
                            }
                        }
                    },
                    placeholder: "Search by Organization Name"
                },
                assign: {
                    title: "Assign Email Domains",
                    description: "Assign email domains for organizations.",
                    form: {
                        fields: {
                            emailDomains: {
                                label : "Email Domains",
                                placeholder: "Enter email domains",
                                hint: "Type and enter email domains to map to the organization. (E.g. gmail.com etc.)",
                                validations: {
                                    invalid: {
                                        0: "Please enter a valid email domain.",
                                        1: "Provided email domain is already mapped to a different organization."
                                    }
                                }
                            },
                            organizationName: {
                                label: "Organization Name",
                                placeholder: "Select an organization",
                                emptyPlaceholder: {
                                    0: "There are no organizations available.",
                                    1: "All the organizations have assigned domains."
                                },
                                hint: "Enter the name of the organization you wish to add the domain mapping."
                            }
                        }
                    },
                    buttons: {
                        assign: "Assign"
                    }
                },
                emailDomains: {
                    actions: {
                        assign: "Assign Email Domain",
                        enable: "Enable email domain discovery"
                    }
                },
                edit: {
                    back: "Back",
                    description: "Edit Email Domains",
                    form: {
                        fields: {
                            emailDomains: {
                                label : "Email Domains",
                                placeholder: "Enter email domains",
                                hint: "Type and enter email domains to map to the organization. (E.g. gmail.com etc.)",
                                validations: {
                                    invalid: {
                                        0: "Please enter a valid email domain.",
                                        1: "Provided email domain is already mapped to a different organization."
                                    }
                                }
                            },
                            organizationName: {
                                label: "Organization Name",
                                hint: "The name of the organization to which the domain mappings are added."
                            }
                        },
                        message: "Changing email domain mappings may result in existing users being unable to log in."
                    }
                },
                message: "Email domain discovery feature can only be used when email address is configured as the username.",
                notifications: {
                    addEmailDomains: {
                        error: {
                            description: "Adding the email domains to the organization was unsuccessful.",
                            message: "Adding unsuccessful"
                        },
                        success: {
                            description: "Email domains added successfully.",
                            message: "Added successfully"
                        }
                    },
                    checkEmailDomain: {
                        error: {
                            description: "Validating the email domain existence was unsuccessful.",
                            message: "Validating unsuccessful"
                        }
                    },
                    disableEmailDomainDiscovery: {
                        error: {
                            description: "An error occurred while disabling email domain discovery.",
                            message: "Disabling unsuccessful"
                        },
                        success: {
                            description: "Successfully disabled email domain discovery.",
                            message: "Disabled successfully"
                        }
                    },
                    enableEmailDomainDiscovery: {
                        error: {
                            description: "An error occurred while enabling email domain discovery.",
                            message: "Enabling unsuccessful"
                        },
                        success: {
                            description: "Successfully enabled email domain discovery.",
                            message: "Enabled successfully"
                        }
                    },
                    fetchOrganizationDiscoveryAttributes: {
                        error: {
                            description: "An error occurred while fetching the organization discovery attributes.",
                            message: "Retrieval unsuccessful"
                        }
                    },
                    getEmailDomainDiscovery: {
                        error: {
                            description: "An error occurred while retrieving email domain discovery configuration.",
                            message: "Retrieval unsuccessful"
                        }
                    },
                    getOrganizationListWithDiscovery: {
                        error: {
                            description: "An error occurred while getting the organization list with discovery attributes.",
                            message: "Retrieval unsuccessful"
                        }
                    },
                    updateOrganizationDiscoveryAttributes: {
                        error: {
                            description: "An error occurred while updating the organization discovery attributes.",
                            message: "Update unsuccessful"
                        },
                        success: {
                            description: "Successfully updated the organization discovery attributes.",
                            message: "Update successful"
                        }
                    }
                },
                placeholders: {
                    emptyList: {
                        action: "Assign Email Domain",
                        subtitles: "There are no organizations with email domains assigned.",
                        title: "Assign Email Domain"
                    }
                },
                title: "Email Domain Discovery"
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
                        disableOrganization: {
                            disableActionTitle: "Disable Organization",
                            enableActionTitle: "Enable Organization",
                            subheader: "Disabling an organization will make it unavailable for all users. " +
                                "Proceed with caution."
                        },
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
                        add: "New Organization"
                    },
                    columns: {
                        actions: "Actions",
                        name: "Name"
                    }
                },
                modals: {
                    addOrganization: {
                        header: "Create an Organization",
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
                        "deleted since it has one or more organizations.",
                    disableOrganization: {
                        error: {
                            description: "{{description}}",
                            message: "Error while disabling the organization"
                        },
                        genericError: {
                            description: "An error occurred while disabling the organization",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully disabled the organization",
                            message: "Organization disabled successfully"
                        }
                    },
                    disableOrganizationWithSubOrganizationError: "Organization {{ organizationName }} cannot be " +
                        "disabled since it has one or more organizations.",
                    enableOrganization: {
                        error: {
                            description: "{{description}}",
                            message: "Error while enabling the organization"
                        },
                        genericError: {
                            description: "An error occurred while enabling the organization",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully enabled the organization",
                            message: "Organization enabled successfully"
                        }
                    },
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
                        action: "New Organization",
                        subtitles: {
                            0: "There are no organizations at the moment.",
                            1: "You can add a new organization easily by",
                            2: "clicking on the button below.",
                            3: "There are no organizations under {{parent}} at the moment."
                        },
                        title: "Add a new Organization"
                    }
                },
                shareApplicationSubTitle: "Select one of the following options to share the application.",
                shareApplicationRadio: "Share with all organizations",
                shareApplicationInfo: "Select this to share the application with all the existing organizations " +
                    "and all new organizations that you create under your current organization.",
                unshareApplicationRadio: "Do not share with any organization",
                shareWithSelectedOrgsRadio: "Share with only selected organizations",
                unshareApplicationInfo: "This will allow you to prevent sharing this application with any of the " +
                    "existing organizations or new organizations that you create under this organization " +
                    "in the future.",
                switching: {
                    emptyList: "There are no organizations to show.",
                    goBack: "Go back",
                    search: {
                        placeholder: "Search by Name"
                    },
                    subOrganizations: "Organizations",
                    switchLabel: "Organization",
                    switchButton: "Switch to Organization",
                    notifications: {
                        switchOrganization: {
                            genericError: {
                                description: "Couldn't switch to the selected organization.",
                                message: "Something went wrong"
                            }
                        }
                    }
                },
                title: "Organizations",
                view: {
                    description: "View Organization"
                }
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
                                    duplicateInAudience: "A role with this name already exists in the selected audience.",
                                    empty: "{{type}} Name is required to proceed.",
                                    invalid: "A {{type}} name can only contain alphanumeric characters, -, and _. "
                                        + "And must be of length between 3 to 30 characters."
                                }
                            },
                            roleAudience: {
                                hint: "Set the audience of the role. <1>Note that audience of the role cannot be changed.</1>",
                                label: "Select the role audience",
                                values: {
                                    organization: "Organization",
                                    application: "Application"
                                }
                            },
                            notes: {
                                orgNote: "When the role audience is organization, you can associate the role with an application which allows organization audience roles.",
                                appNote: "When the role audience is application, you can associate the role with an application which allows application audience roles.",
                                cannotCreateRole: "You cannot create a role with role audience as application because there are currently no applications that support application audience roles. Please <1>create an application</1> that supports application audience roles to proceed."
                            },
                            assignedApplication: {
                                hint: "Assign an application for the role. Note that assigned application for this role cannot be edited after the role is created.",
                                label: "Assigned application",
                                placeholder: "Select application to assign the role",
                                applicationSubTitle: {
                                    application: "Support application-scoped roles.",
                                    organization: "Support organization-scoped role. ",
                                    changeAudience: "Change the audience"
                                },
                                validations: {
                                    empty: "Assigned application is required to create an application-scoped role."
                                },
                                note: "Note that assigned application for this role cannot be edited after the role is created."
                            }
                        },
                        rolePermission: {
                            apiResource: {
                                label: "Select API Resource",
                                placeholder: "Select an API resource to assign permissions(scopes)",
                                hint: {
                                    empty: "There are no API resources authorized for the selected application. API Resources can be authorized through <1>here</1>."
                                }
                            },
                            permissions: {
                                label: "Select permissions(scopes) from the selected API resources",
                                placeholder: "Select permissions(scopes)",
                                tooltips: {
                                    noScopes: "No scopes available for the selected API resource",
                                    selectAllScopes: "Select all permissions(scopes)",
                                    removeAPIResource: "Remove API resource"
                                },
                                validation: {
                                    empty: "Permissions(scopes) list cannot be empty. Select at least one permission(scope)."
                                },
                                permissionsLabel: "Permissions (scopes)"
                            },
                            notes: {
                                applicationRoles: "Only the APIs and the permissions(scopes) that are authorized in the selected application(<1>{{applicationName}}</1>) will be listed to select."
                            },
                            notifications: {
                                fetchAPIResourceError: {
                                    error: {
                                        description: "Something went wrong while fetching API resources. Please try again.",
                                        message: "Something went wrong"
                                    }
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
                    back: "Go back",
                    summary: {
                        labels: {
                            domain: {
                                group: "User Store",
                                role: "Role Type"
                            },
                            groups: "Assigned Group(s)",
                            permissions: "Permission(s)",
                            roleName: "{{type}} Name",
                            roles: "Assigned Role(s)",
                            users: "Assigned User(s)"
                        }
                    },
                    users: {
                        assignUserModal: {
                            heading: "Manage Users",
                            hint: "Select users to add them to the user group.",
                            list: {
                                listHeader: "Name",
                                searchPlaceholder: "Search users",
                                searchByEmailPlaceholder: "Search users by email address"
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
                    placeholders: {
                        errorPlaceHolder: {
                            action: "Go back",
                            subtitles: {
                                0: "An error occurred while retrieving the requested role, possibly because the role does not exist.",
                                1: "Please try again."
                            },
                            title: "Something went wrong"
                        }
                    },
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
                        placeholders: {
                            emptyPlaceholder: {
                                action: "Assign Groups",
                                subtitles: {
                                    0: "There are no groups assigned to this role at the moment."
                                },
                                title: "No groups assigned to the role."
                            },
                            errorPlaceholder: {
                                action: "Refresh",
                                subtitles: {
                                    0: "An error occurred while fetching groups assigned to this role.",
                                    1: "Please try again."
                                },
                                title: "Something went wrong"
                            }
                        },
                        notifications: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while updating the groups assigned to the role."
                            },
                            success: {
                                message: "Role updated successfully",
                                description: "The groups assigned to the role have been successfully updated."
                            },
                            genericError: {
                                message: "Something went wrong",
                                description: "We were unable to update the groups assigned to the role."
                            },
                            fetchError: {
                                message: "Something went wrong",
                                description: "We were unable to fetch the groups assigned to the role."
                            }
                        },
                        externalGroupsHeading: "External Groups",
                        heading: "Assigned Groups",
                        localGroupsHeading: "Local Groups",
                        subHeading: "Add or remove the groups assigned to this role. Note that this "
                            + "will affect performing certain tasks.",
                        actions: {
                            search: {
                                placeholder: "Search groups"
                            },
                            assign: {
                                placeholder: "Assign groups"
                            },
                            remove: {
                                label: "Removing groups",
                                placeholder: "Restore groups"
                            }
                        }

                    },
                    menuItems: {
                        basic: "Basics",
                        connectedApps: "Connected Apps",
                        groups: "Groups",
                        permissions: "Permissions",
                        roles: "Roles",
                        users: "Users"
                    },
                    users: {
                        heading: "Assigned Users",
                        subHeading: "Add or remove the users assigned to this role. Note that this will affect performing certain tasks.",
                        actions: {
                            search: {
                                placeholder: "Search users"
                            },
                            assign: {
                                placeholder: "Type username/s to search and assign users"
                            },
                            remove: {
                                label: "Removing users",
                                placeholder: "Restore users"
                            }
                        },
                        placeholders: {
                            emptyPlaceholder: {
                                action: "Assign Users",
                                subtitles: {
                                    0: "There are no users assigned to this role at the moment."
                                },
                                title: "No users assigned to the role."
                            },
                            errorPlaceholder: {
                                action: "Refresh",
                                subtitles: {
                                    0: "An error occurred while fetching users assigned to this role.",
                                    1: "Please try again."
                                },
                                title: "Something went wrong"
                            }
                        },
                        notifications: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while updating the users assigned to the role."
                            },
                            success: {
                                message: "Role updated successfully",
                                description: "The users assigned to the role have been successfully updated."
                            },
                            genericError: {
                                message: "Something went wrong",
                                description: "We were unable to update the users assigned to the role."
                            },
                            fetchError: {
                                message: "Something went wrong",
                                description: "We were unable to fetch the users assigned to the role."
                            }
                        },
                        list: {
                            emptyPlaceholder: {
                                action: "Assign User",
                                subtitles: "There are no users assigned to the {{type}} at the moment.",
                                title: "No Users Assigned"
                            },
                            user: "User",
                            organization: "Managed By"
                        }
                    },
                    permissions: {
                        heading: "Assigned Permissions",
                        readOnlySubHeading: "View the assigned permissions of the role.",
                        removedPermissions: "Removed Permissions",
                        subHeading: "Manage assigned permissions in the role."
                    }
                },
                list: {
                    buttons: {
                        addButton: "New {{type}}",
                        filterDropdown: "Filter By"
                    },
                    columns: {
                        actions: "Actions",
                        audience: "Audience",
                        lastModified: "Modified Time",
                        managedByApp: {
                            label: "Can be used only in the application: ",
                            header: "Managed By"
                        },
                        managedByOrg: {
                            label: "Can be used within the organization: ",
                            header: "Managed By"
                        },
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
                        },
                        deleteItemError: {
                            content: "Remove the associations from following application before deleting:",
                            header: "Unable to Delete",
                            message: "There is an application using this role."
                        }
                    },
                    emptyPlaceholders: {
                        emptyRoleList: {
                            action: "New {{type}}",
                            emptyRoles: "No {{type}} found",
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
                    },
                    filterOptions: {
                        all: "Show All",
                        applicationRoles: "Application Roles",
                        organizationRoles: "Organization Roles"
                    },
                    filterAttirbutes: {
                        name: "Name",
                        audience: "Role Audience"
                    }
                },
                readOnlyList: {
                    emptyPlaceholders: {
                        searchAndFilter: {
                            subtitles: {
                                0: "We couldn't find any results for the specified role name and audience combination.",
                                1: "Please try a different combination."
                            },
                            title: "No results found"
                        }
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
                            message: "Unable to delete the selected role."
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
                    fetchRole: {
                        genericError: {
                            description: "An error occurred while retrieving the role.",
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
                adminAdvisory: {
                    configurationEditSection: {
                        backButtonLabel: "Go back to Admin Advisory Banner",
                        pageHeading: "Admin Advisory Banner",
                        pageSubheading: "Configure and customize the admin advisory banner to be displayed on the login page.",
                        form: {
                            bannerContent: {
                                label: "Banner content",
                                hint: "This is the content that will be displayed in the banner on the login page.",
                                placeholder: "Warning - unauthorized use of this tool is strictly prohibited."
                            }
                        }
                    },
                    configurationSection: {
                        disabled: "Disabled",
                        description: "Enable and configure the admin advisory banner.",
                        enabled: "Enabled",
                        heading: "Admin Advisory Banner"
                    },
                    notifications: {
                        disbleAdminAdvisoryBanner: {
                            error: {
                                description: "{{ description }}",
                                message: "Error disabling admin advisory banner."
                            },
                            genericError: {
                                description: "An error occurred while disabling admin advisory banner.",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "Successfully disabled the admin advisory banner.",
                                message: "Disabled the admin advisory banner"
                            }
                        },
                        enableAdminAdvisoryBanner: {
                            error: {
                                description: "{{ description }}",
                                message: "Error enabling admin advisory banner."
                            },
                            genericError: {
                                description: "An error occurred while enabling admin advisory banner.",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "Successfully enabled the admin advisory banner.",
                                message: "Enabled the admin advisory banner"
                            }
                        },
                        getConfigurations: {
                            error: {
                                description: "{{ description }}",
                                message: "Error retrieving admin advisory banner configurations."
                            },
                            genericError: {
                                description: "An error occurred while retrieving admin advisory banner configurations.",
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
                                message: "Error updating admin advisory banner configurations."
                            },
                            genericError: {
                                description: "An error occurred while updating admin advisory banner configurations.",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "Successfully updated the admin advisory banner configurations.",
                                message: "Banner updated successfully"
                            }
                        }
                    },
                    pageHeading: "Admin Advisory Banner",
                    pageSubheading: "Configure the admin advisory banner to be displayed on the login page."
                },
                remoteLogPublishing: {
                    title: "Remote Log Publishing",
                    pageTitle: "Remote Log Publishing",
                    description: "Configure remote logging settings for logs in the organization.",
                    descriptionWithLogType: "Configure remote logging settings for " +
                        "{{logType}} logs in the organization.",
                    backButtonText: "Go back",
                    testButtonText: "Test",
                    logTypes: {
                        audit: {
                            name: "Audit Logs",
                            description: "Configure Audit Log publishing"
                        },
                        diagnostics: {
                            name: "Diagnostic Logs",
                            description: "Configure Diagnostics Log publishing"
                        }
                    },
                    fields: {
                        logTypes: {
                            label: "Log types to be published",
                            values: {
                                carbonLogs: "Carbon logs",
                                auditLogs: "Audit logs",
                                allLogs: "All Logs"
                            }
                        },
                        remoteURL: {
                            label: "Destination URL",
                            placeholder: "https://yourdomain.com",
                            error: {
                                required: "Remote logging endpoint URL is required",
                                invalid: "Please enter a valid URL"
                            }
                        },
                        publishInterval: {
                            label: "Log publish interval (minutes)",
                            placeholder: "15",
                            error: {
                                required: "Log publish interval is required",
                                invalid: "Publish interval should not be less than 15 minutes"
                            }
                        },
                        advanced: {
                            title: "Advanced Settings",
                            connectionTimeout: {
                                label: "Connection timeout (ms)",
                                placeholder: "1000",
                                error: {
                                    invalid: "Publish interval should be between 1000 and 60000"
                                }
                            },
                            verifyHostname: {
                                label: "Verify the hostname",
                                hint: "Enable verifying the remote server's hostname against its SSL certificate."
                            },
                            basicAuthConfig: {
                                title: "Authentication Configuration",
                                info: {
                                    message: "If you are changing the authentication, be aware that the authentication" +
                                    " secrets of the remote server need to be updated.",
                                    title: {
                                        noneAuthType: "No authentication is configured.",
                                        otherAuthType: "<strong>{{ authType }}</strong> authentication scheme is configured."
                                    }
                                },
                                types: {
                                    none: {
                                        name: "None"
                                    },
                                    basic: {
                                        name: "Basic"
                                    }
                                },
                                authenticationType: {
                                    hint: {
                                        create: "Once added, this secret will not be displayed. You will only be able to update them.",
                                        update: "Once updated, this secret will not be displayed. You will only be able to update them."
                                    },
                                    label: "Authentication Scheme",
                                    placeholder: "Select Authentication Scheme"
                                },
                                buttons: {
                                    changeAuthentication: "Change Authentication"
                                },
                                serverUsername: {
                                    label: "Remote server username",
                                    placeholder: "username",
                                    error: {
                                        required: "Remote server username is required"
                                    }
                                },
                                serverPassword: {
                                    label: "Remote server password",
                                    placeholder: "*****",
                                    error: {
                                        required: "Remote server password is required"
                                    }
                                }
                            },
                            sslConfig: {
                                title: "SSL Configuration",
                                info: {
                                    sslConfigured: {
                                        message: "The connections will be secured using SSL",
                                        title: "SSL Already Configured"
                                    },
                                    notConfigured: {
                                        message: "SSL is not currently configured. Please set it up to secure your connections.",
                                        title: "SSL Not Configured"
                                    }
                                },
                                buttons: {
                                    addSslConfig: "Add SSL Configuration",
                                    changeSslConfig: "Update SSL Configuration",
                                    clearSslConfig: "Remove SSL Configuration"
                                },
                                keystorePath: {
                                    label: "Keystore location",
                                    placeholder: "Path to the keystore file",
                                    error: {
                                        required: "Keystore location is required"
                                    }
                                },
                                keystorePassword: {
                                    label: "Keystore password",
                                    placeholder: "*****",
                                    error: {
                                        required: "Keystore password is required"
                                    }
                                },
                                truststorePath: {
                                    label: "Truststore location",
                                    placeholder: "Path to the truststore file",
                                    error: {
                                        required: "Truststore location is required"
                                    }
                                },
                                truststorePassword: {
                                    label: "Truststore password",
                                    placeholder: "*****",
                                    error: {
                                        required: "Truststore password is required"
                                    }
                                }
                            }
                        }
                    },
                    dangerZone: {
                        button: "Restore",
                        title: "Restore Default Configuration",
                        header: "Restore Default Configuration",
                        subheader: "This action will delete the existing configuration for {{logType}} logs. Please be certain before you proceed.",
                        confirmation: {
                            hint: "Please confirm your action.",
                            header: "Are you sure?",
                            message: "If you restore the default configuration, remote log publishing for {{logType}} logs may not work properly. " +
                            "Please proceed with caution.",
                            content: "This action will restore the default log publishing configuration for {{logType}} logs."
                        }
                    },
                    notification: {
                        success: {
                            description: "Remote log publishing configuration updated successfully.",
                            message: "Updated successfully."
                        },
                        error: {
                            updateError: {
                                description: "An error occurred while updating remote log publishing configuration.",
                                message: "Something went wrong"
                            },
                            fetchError: {
                                description: "An error occurred while getting the remote log publishing configuration.",
                                message: "Couldn't get remote log publishing configuration."
                            }
                        }
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
                },
                server: {
                    title: "Server",
                    description: "Configure server settings."
                }
            },
            sidePanel: {
                accountManagement: "Account Management",
                addEmailTemplate: "Add Email Template",
                addEmailTemplateLocale: "Add Email Template Locale",
                approvals: "Approvals",
                approvalWorkflows: "Approval Workflows",
                attributeDialects: "Attributes",
                categories: {
                    attributes: "User Attributes",
                    certificates: "Certificates",
                    configurations: "Configurations",
                    general: "General",
                    organizations: "Organization Management",
                    users: "Users",
                    userstores: "User Stores"
                },
                certificates: "Certificates",
                configurations: "Configurations",
                createApprovalWorkflows: "Create Approval Workflow",
                editEmailTemplate: "Email Templates",
                editExternalDialect: "Edit Attribute Mapping",
                editGroups: "Edit Group",
                editLocalClaims: "Edit Attributes",
                editRoles: "Edit Role",
                editUsers: "Edit User",
                editApprovalWorkflow: "Edit Approval Workflow",
                editUserstore: "Edit User Store",
                emailDomainDiscovery: "Email Domain Discovery",
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
                            unselected: "There are no {{type}} available to assign to this group.",
                            common: "No {{type}} found"
                        },
                        roles: {
                            selected: "There are no {{type}} assigned with this role.",
                            unselected: "There are no {{type}} available to assign to this group.",
                            common: "No {{type}} found"
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
                        1: "Name",
                        2: "Audience"
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
                                    createPassword: "Set a password for the user"

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
                                    invalid: "Please enter a valid email address. You can use alphanumeric " +
                                        "characters, unicode characters, underscores (_), dashes (-), periods (.), " +
                                        "and an at sign (@)."
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
                                    regExViolation: "Please enter a valid username."
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
                        askPassword: {
                            alphanumericUsernameEnabled: "To invite users to set the password, disable " +
                                "alphanumeric username feature.",
                            emailInvalid: "To invite users to set the password, please enter a valid email address.",
                            emailVerificationDisabled: "To invite users to set the password, enable email invitations for user password setup from <1>Login & Registration settings</1>.",
                            inviteOffline: "Invite offline",
                            inviteViaEmail: "Invite via email"
                        },
                        buttons: {
                            next: "Next",
                            previous: "Previous",
                            saveAndContinue: "Save & Continue"
                        },
                        steps: {
                            basicDetails: "Basic Details",
                            groups: "User Groups",
                            roles: "User Roles",
                            invitation: "Invitation",
                            method: "Method"
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
                    bulkImportUserWizard: {
                        title: "Add multiple users",
                        subTitle: "Add multiple users manually or using a CSV file.",
                        wizardSummary: {
                            inviteEmailInfo: "An email with a confirmation link will be sent to the provided email address for the user to set their own password.",
                            successCount: "Successful Imports",
                            failedCount: "Failed Imports",
                            totalUserCreationCount: "Total user creation count",
                            totalUserAssignmentCount: "Total group assigment count ",
                            tableHeaders: {
                                username: "Username",
                                status: "Status",
                                message: "Message"
                            },
                            tableMessages: {
                                userCreatedMessage: "User imported successfully",
                                invalidDataMessage: "Invalid data provided",
                                invalidUserNameFormatMessage: "Username does not match the specified format",
                                userAlreadyExistsMessage: "User already exists",
                                userCreationAcceptedMessage: "User creation accepted",
                                internalErrorMessage: "Error occured while importing users",
                                userAssignmentSuccessMessage: "Users were successfully assigned to {{resource}}",
                                userAssignmentFailedMessage: "User assignment to {{resource}} failed",
                                userAssignmentInternalErrorMessage: "An error occurred while assigning users to " +
                                    "{{resource}}"
                            },
                            tableStatus: {
                                success: "Success",
                                warning: "Warning",
                                failed: "Failed"
                            },
                            alerts: {
                                importSuccess: {
                                    description: "The user accounts were imported successfully.",
                                    message: "Import Successful"
                                },
                                importFailed: {
                                    userCreation: "Issues encountered in <1>{{failedUserCreationCount}} user " +
                                        "creation operations(s)</1>",
                                    groupAssignment: "Issues encountered in <1>{{failedUserAssignmentCount}} group " +
                                        "assignment(s)</1>. Users in the affected groups were created but not assigned. " +
                                        "Please navigate to User Management section to review  and assign groups to " +
                                        "the users.",
                                    message: "Review Required"
                                }
                            },
                            advanceSearch: {
                                searchByUsername: "Search by Username",
                                searchByGroup: "Search by Group",
                                roleGroupFilterAttributePlaceHolder: "Group Name"
                            },
                            manualCreation: {
                                alerts: {
                                    creationSuccess: {
                                        description: "The user accounts were created successfully.",
                                        message: "User Creation Successful"
                                    }
                                },
                                hint: "Add the email address of the user you wish to invite and press enter.",
                                emailsLabel: "Emails",
                                emailsPlaceholder: "Enter email addresses",
                                disabledHint: "The manual option is disabled due to the usage of alphanumeric usernames in your organization.",
                                upload: {
                                    buttonText: "Upload CSV File",
                                    description: "Drag and drop a CSV file here."
                                },
                                primaryButton: "Add",
                                groupsLabel: "Groups",
                                groupsPlaceholder: "Enter groups",
                                warningMessage: "This option can only be used when email address is configured " +
                                    "as the username."
                            },
                            fileBased: {
                                hint: "Bulk invite multiple users using a CSV file."
                            },
                            responseOperationType: {
                                userCreation: "User Creation",
                                roleAssignment: "Group Assignment"
                            },
                            userstoreMessage: "The created users will be added to the <1>{{ userstore }}</1> user store."
                        },
                        buttons: {
                            import: "Import"
                        },
                        sidePanel: {
                            manual: "Manual",
                            fileBased: "File Based",
                            fileFormatTitle: "CSV File Format",
                            fileFormatContent: "Headers of the CSV file should be user attributes that are " +
                                    "mapped to <1>local attributes</1>.",
                            fileFormatSampleHeading: "Sample CSV file format:"
                        }
                    },
                    inviteParentUserWizard: {
                        totalInvitations: "Total Invitation(s)",
                        successAlert: {
                            description: "Successfully invited the user(s).",
                            message: "Invitation(s) Sent"
                        },
                        errorAlert: {
                            description: "An error occurred while inviting {{ failedCount }} user(s).",
                            message: "Review Required"
                        },
                        tableMessages: {
                            userNotFound: "User not found",
                            activeInvitationExists: "An active invitation for the user already exists",
                            userEmailNotFound: "Could not find the email of the invited user",
                            userAlreadyExist: "User already exists"
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
                                dropdownPlaceholder: "Select your {{fieldName}}",
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
                                genericMessage: "Account is disabled",
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
                                genericMessage: "Account is enabled",
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
                                genericMessage: "Account is locked",
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
                                genericMessage: "Account is unlocked",
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
                revokeAdmin: {
                    confirmationModal: {
                        assertionHint: "Please confirm your action.",
                        content: "If you revoke the admin privileges of this user, the user will not be able " +
                            "to log into the Asgardeo console and " +
                            "will not be able to perform admin operations. Please proceed with caution.",
                        header: "Are you sure?",
                        message: "This action will revoke the admin privileges of the user."
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
                            infoMessage: "Roles inherited via groups are not shown here.",
                            placeholders: {
                                emptyPlaceholder: {
                                    title: "No roles assigned",
                                    subtitles: "There are no roles assigned to the user at the moment."
                                }
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
                            subHeading: "View roles assigned directly to the user."
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
                addUserType: {
                    createUser: {
                        title: "Create user",
                        description: "Create a user in your organization."
                    },
                    inviteParentUser: {
                        title: "Invite parent user",
                        description: "Invite user from the parent organization."
                    }
                },
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
                addUserDropDown: {
                    addNewUser:  "Single User",
                    bulkImport: "Multiple Users"
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
                    },
                    addMultipleUser: {
                        header: "Before you proceed",
                        message: "Invite users option is disabled",
                        content: "Invite User to Set Password should be enabled to add multiple users. " +
                            "Please enable email invitations for user password setup from Login & Registration settings.",
                        assertionHint: "Please confirm your action."
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
                    },
                    placeholders: {
                        undefinedUser: {
                            action: "Go back to users",
                            subtitles: "It looks like the requested user does not exist.",
                            title: "User not found"
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
                    addUserPendingApproval: {
                        error: {
                            description: "{{description}}",
                            message: "Error adding the new user"
                        },
                        genericError: {
                            description: "Couldn't add the new user",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The new user was accepted and pending approval.",
                            message: "User accepted for creation"
                        }
                    },
                    bulkImportUser: {
                        validation: {
                            emptyRowError: {
                                description: "Selected file contains no data.",
                                message: "Empty File"
                            },
                            columnMismatchError: {
                                description: "Some data rows of the file does not match the required column count. " +
                                    "Please review and correct the data.",
                                message: "Column Count Mismatch"
                            },
                            emptyHeaderError: {
                                description: "Ensure that the first row contains the headers for each column.",
                                message: "Missing Column Headers"
                            },
                            missingRequiredHeaderError: {
                                description: "The following header(s) are required but are missing in the CSV file: " +
                                "{{ headers }}.",
                                message: "Missing Required Column Headers"
                            },
                            blockedHeaderError: {
                                description: "The following header(s) are not allowed: {{headers}}.",
                                message: "Blocked Column Headers"
                            },
                            duplicateHeaderError: {
                                description: "The following headers are duplicated: {{headers}}.",
                                message: "Duplicate Column Headers"
                            },
                            invalidHeaderError: {
                                description: "The following headers are invalid: {{headers}}.",
                                message: "Invalid Column Headers"
                            },
                            emptyDataField: {
                                description: "The data field '{{dataField}}' must not be empty.",
                                message: "Empty Data Field"
                            },
                            invalidRole: {
                                description: "{{role}} does not exist.",
                                message: "Role Not Found"
                            },
                            invalidGroup: {
                                description: "{{group}} does not exist.",
                                message: "Group Not Found"
                            }
                        },
                        submit: {
                            error: {
                                description: "{{description}}",
                                message: "Error occured while importing users"
                            },
                            genericError: {
                                description: "Unable to import users",
                                message: "Error occured while importing users"
                            },
                            success: {
                                description: "The users were imported successfully.",
                                message: "Users Imported Successfully"
                            }
                        },
                        timeOut: {
                            description: "Some users may not have been created.",
                            message: "The request has timed out"
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
                    },
                    getAdminRole: {
                        error: {
                            description: "{{description}}",
                            message: "Error retrieving the admin role"
                        },
                        genericError: {
                            description: "Couldn't retrieve the admin roles.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully retrieved the admin roles.",
                            message: "Role retrieval successful"
                        }
                    },
                    revokeAdmin: {
                        error: {
                            description: "{{description}}",
                            message: "Error revoking the admin privileges"
                        },
                        genericError: {
                            description: "Couldn't revoke the admin privileges.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully revoked the admin privileges.",
                            message: "Privileges revoked successfully"
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
                            emptyUsers: "No users found",
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
                    hint: "Please confirm your action.",
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
                        updatePassword: "Update connection password",
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
                            placeholder: "Enter a description",
                            validationErrorMessages: {
                                invalidInputErrorMessage: "Description cannot contain the pattern {{invalidString}}."
                            }
                        },
                        name: {
                            label: "Name",
                            placeholder: "Enter a name",
                            requiredErrorMessage: "Name is a required field",
                            validationErrorMessages: {
                                alreadyExistsErrorMessage: "A user store with this name already exists.",
                                maxCharLimitErrorMessage: "User store name cannot exceed {{maxLength}} characters.",
                                invalidInputErrorMessage: "User store name cannot contain the pattern {{invalidString}}."
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
                            description: "An error occurred while testing the connection to the user store",
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
                        subtitles: "There are currently no user stores available. "
                            + "You can add a new user store easily by following the "
                            + "steps in the user store creation wizard.",
                        title: "Add a new user store"
                    },
                    emptyListReadOnly: {
                        subtitles: "There are currently no user stores available.",
                        title: "No user stores"
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
            },
            validation: {
                fetchValidationConfigData: {
                    error: {
                        description: "{{description}}",
                        message: "Retrieval error"
                    },
                    genericError: {
                        description: "Couldn't retrieve validation configuration data.",
                        message: "Something went wrong"
                    }
                },
                validationError: {
                    minMaxMismatch: "Minimum length should be less than maximum length.",
                    uniqueChrMismatch: "Number of unique characters should be less than tha minimum length of " +
                        "the password.",
                    consecutiveChrMismatch: "Number of consecutive characters should be less than tha minimum " +
                        "length of the password.",
                    invalidConfig: "Unable to create password with the above configurations.",
                    minLimitError: "The minimum length cannot be less than 8.",
                    maxLimitError: "The maximum length cannot be more than 30.",
                    wrongCombination: "The combination is not allowed"
                },
                notifications: {
                    error: {
                        description: "{{description}}",
                        message: "Update error"
                    },
                    genericError: {
                        description: "Failed to update password validation configuration.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully updated password validation configuration.",
                        message: "Update successful"
                    }
                },
                pageTitle: "Password Validation",
                description: "Customize password validation rules for your users.",
                goBackToApplication: "Go back to application",
                goBackToValidationConfig: "Go back to Account Security"
            },
            insights: {
                pageTitle: "Insights",
                title: "Insights",
                description: "Understand user behavior better with usage statistics.",
                durationMessage: "Showing results from <1>{{ startTimestamp }}</1> to <1>{{ endTimestamp }}</1>",
                durationOption: "Last {{ duration }} days",
                lastFetchedMessage: {
                    label: "Last fetched at {{ time }}",
                    tooltipText: "Insights for the latest activity will take few minues to be reflected in the graphs"
                },
                advancedFilter: {
                    filterAttribute: "Filter attribute",
                    filterCondition: "Filter condition",
                    filterValue: "Filter value"
                },
                commonFilters: {
                    userId: "User ID"
                },
                activityType: {
                    login: {
                        filters: {
                            userStore: "User Store",
                            serviceProvider: "Application",
                            authenticator: {
                                attributeName: "Connection Type",
                                values: {
                                    basic: "Username & Password",
                                    identifierFirst: "Identifier First",
                                    fido2: "FIDO2",
                                    magicLink: "Magic Link",
                                    emailOtp: "Email OTP",
                                    smsOtp: "SMS OTP",
                                    totp: "TOTP",
                                    backupCodes: "Backup Code",
                                    google: "Google",
                                    facebook: "Facebook",
                                    github: "GitHub",
                                    apple: "Apple",
                                    oidc: "OIDC IdP",
                                    saml: "SAML IdP",
                                    hypr: "HYPR",
                                    iproov: "IPROOV",
                                    organizationLogin: "Organization Login"
                                }
                            },
                            identityProvider: "Connection ID"
                        }
                    },
                    registration: {
                        filters: {
                            onboardingMethod: {
                                attributeName: "Onboarding Method",
                                values: {
                                    adminInitiated: "By administrator",
                                    userInvited: "Email invitation",
                                    selfSignUp: "Self-registration"
                                }
                            }
                        }
                    }
                },
                graphs: {
                    activeUsers: {
                        title: "Active Users",
                        titleHint: "Number of unique users that signed in to your organization within the selected period"
                    },
                    successLogins: {
                        title: "Total Logins",
                        titleHint: "Number of successful logins to your organization within the selected period"
                    },
                    failedLogins: {
                        title: "Failed Logins"
                    },
                    signups: {
                        title: "User Signups",
                        titleHint: "Total user signups occurred within the selected period"
                    }
                },
                notifications: {
                    fetchInsights: {
                        genericError: {
                            description: "An error occurred while fetching insights for the selected duration.",
                            message: "Something went wrong"
                        }
                    }
                },
                compareToLastPeriodMessage: "Compare to last period"
            },
            pushProviders: {
                heading: "Push Provider",
                subHeading: "Configure a push provider to send push notifications to your users.",
                description: "Configure the push provider settings according to your push provider."
            },
            smsProviders: {
                heading: "SMS Provider",
                subHeading: "Configure a SMS provider to send SMS to your users.",
                description: "Configure the SMS provider settings according to your SMS provider.",
                info: "You can customize the SMS content using <1>SMS Templates</1>.",
                updateButton: "Update",
                sendTestSMSButton: "Send Test SMS",
                goBack: "Go back to Notification Providers",
                confirmationModal: {
                    assertionHint: "Please confirm your action.",
                    content: "Deleting this SMS provider configuration may disrupt SMS OTP authentication for " +
                        "applications currently using it. You may no longer receive SMS-based OTPs, which could " +
                        "affect user logins. Please proceed with caution.",
                    header: "Are you sure?",
                    message: "This action is irreversible and will permanently delete the SMS provider configurations."
                },
                dangerZoneGroup: {
                    header: "Danger Zone",
                    revertConfig: {
                        heading: "Delete Configurations",
                        subHeading: "This action will delete sms provider configurations. " +
                            "Once deleted, you will not receive SMS.",
                        actionTitle: "Delete"
                    }
                },
                form: {
                    twilio: {
                        subHeading: "Twilio Settings",
                        accountSID: {
                            label: "Twilio Account SID",
                            placeholder: "Enter the Twilio account SID",
                            hint: "Twilio account string identifier which act as username for the account"
                        },
                        authToken: {
                            label: "Twilio Auth Token",
                            placeholder: "Enter the Twilio auth token",
                            hint: "The access token generated by the Twilio auth server "
                        },
                        sender: {
                            label: "Sender",
                            placeholder: "Enter the sender phone number",
                            hint: "Phone number of the sender."
                        },
                        validations: {
                            required: "This field cannot be empty"
                        }
                    },
                    vonage: {
                        subHeading: "Vonage Settings",
                        accountSID: {
                            label: "Vonage API Key",
                            placeholder: "Enter the Vonage API key",
                            hint: "Vonage API Key which act as username for the account."
                        },
                        authToken: {
                            label: "Vonage API Secret",
                            placeholder: "Enter the Vonage API Secret",
                            hint: "The API Secret generated by the Vonage auth server."
                        },
                        sender: {
                            label: "Sender",
                            placeholder: "Enter the sender phone number",
                            hint: "Phone number of the sender."
                        },
                        validations: {
                            required: "This field cannot be empty"
                        }
                    },
                    custom: {
                        subHeading: "Custom Settings",
                        providerName: {
                            label: "SMS Provider Name",
                            placeholder: "Enter the SMS provider name",
                            hint: "The name of the SMS provider."
                        },
                        providerUrl: {
                            label: "SMS Provider URL",
                            placeholder: "Enter the sms provider URL",
                            hint: "The URL of the SMS provider."
                        },
                        httpMethod: {
                            label: "HTTP Method",
                            placeholder: "POST",
                            hint: "The HTTP method of the API request. (Default is POST)"
                        },
                        contentType: {
                            label: "Content Type",
                            placeholder: "JSON",
                            hint: "The content type of the API request. Accepted values are 'FORM' or 'JSON'"
                        },
                        headers: {
                            label: "Headers",
                            placeholder: "authorisation: Bearer {{token}}",
                            hint: "Comma seperated list of HTTP headers to be included in the SMS API request."
                        },
                        payload: {
                            label: "Payload Template",
                            placeholder: "{\"content\": {{body}}, \"to\": {{mobile}} }",
                            hint: "The payload template of the API request. Use {{body}} to represent the generated SMS body. Use {{mobile}} to represent the mobile number."
                        },
                        key: {
                            label: "SMS Provider Auth Key",
                            placeholder: "Enter the SMS provider auth key",
                            hint: "Any authentication key that needs to be send as HTTP header."
                        },
                        secret: {
                            label: "SMS Provider Auth Secret",
                            placeholder: "Enter the SMS provider auth secret",
                            hint: "Any authentication secret that needs to be send as HTTP header."
                        },
                        sender: {
                            label: "Sender",
                            placeholder: "Enter the sender",
                            hint: "The SMS senders identification (phone number or name)."
                        },
                        validations: {
                            required: "This field cannot be empty",
                            methodInvalid: "The HTTP method is invalid",
                            contentTypeInvalid: "The content type is invalid"
                        }
                    }
                },
                notifications: {
                    getConfiguration: {
                        error: {
                            message: "Error Occurred",
                            description: "Error retrieving the sms provider configurations."
                        }
                    },
                    deleteConfiguration: {
                        error: {
                            message: "Error Occurred",
                            description: "Error deleting the sms provider configurations."
                        },
                        success: {
                            message: "Revert Successful",
                            description: "Successfully reverted the sms provider configurations."
                        }
                    },
                    updateConfiguration: {
                        error: {
                            message: "Error Occurred",
                            description: "Error updating the sms provider configurations."
                        },
                        success: {
                            message: "Update Successful",
                            description: "Successfully updated the sms provider configurations."
                        }
                    }
                }
            },
            approvalWorkflows: {
                advancedSearch: {
                    placeholder: "Search by approval workflow name"
                },
                confirmation: {
                    confirm: "Confirm",
                    content: "If you delete this approval workflow, the data in this approval workflow will also be deleted. "
                        + "Please proceed with caution.",
                    header: "Are you sure?",
                    hint: "Please confirm your action.",
                    message: "This action is irreversible and will permanently delete the"
                        + " selected approval workflow and the data in it."
                },
                dangerZone: {
                    delete: {
                        actionTitle: "Delete Approval Workflow",
                        header: "Delete Approval Workflow",
                        subheader: "Once you delete an approval workflow, there is no going back. "
                            + "Please be certain."
                    }
                },
                forms: {
                    general: {
                        description: {
                            label: "Description",
                            placeholder: "Describe the purpose of this approval workflow",
                            validationErrorMessages: {
                                invalidInputErrorMessage: "Description cannot contain the pattern {{invalidString}}."
                            }
                        },
                        name: {
                            label: "Name",
                            placeholder: "Sample Approval Workflow",
                            requiredErrorMessage: "Name is a required field",
                            validationErrorMessages: {
                                alreadyExistsErrorMessage: "An approval workflow with this name already exists.",
                                maxCharLimitErrorMessage: "Approval Workflow name cannot exceed {{maxLength}} characters.",
                                invalidInputErrorMessage: "Approval Workflow name cannot contain the pattern {{invalidString}}."
                            }
                        }
                    }
                },
                notifications: {
                    addApprovalWorkflow: {
                        genericError: {
                            description: "There was an error while creating the approval workflow.",
                            message: "Something went wrong!"
                        },
                        success: {
                            description: "The approval workflow has been added successfully!",
                            message: "approval workflow added successfully!"
                        }
                    },
                    apiLimitReachedError: {
                        error: {
                            description: "You have reached the maximum number of approval workflows allowed.",
                            message: "Failed to create the approval workflow"
                        }
                    },
                    delay: {
                        description: "It may take a while for the approval workflow list to be updated. "
                            + "Refresh in a few seconds to get the updated approval workflow list.",
                        message: "Updating approval workflow list takes time"
                    },
                    deleteApprovalWorkflow: {
                        genericError: {
                            description: "There was an error while deleting the approval workflow.",
                            message: "Something went wrong!"
                        },
                        success: {
                            description: "The approval workflow has been deleted successfully!",
                            message: "Approval workflow deleted successfully!"
                        }
                    },
                    fetchApprovalWorkflows: {
                        genericError: {
                            description: "An error occurred while fetching approval workflows.",
                            message: "Something went wrong"
                        }
                    },
                    testConnection: {
                        genericError: {
                            description: "An error occurred while testing the connection to the approval workflow",
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
                    updateApprovalWorkflow: {
                        genericError: {
                            description: "An error occurred while updating the approval workflow.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "This approval workflow has been updated successfully!",
                            message: "approval workflow updated successfully!"
                        }
                    }
                },
                pageLayout: {
                    edit: {
                        back: "Go back to approval workflows",
                        description: "Edit approval workflow",
                        tabs: {
                            connection: "Connection",
                            general: "General",
                            group: "Group",
                            user: "User"
                        }
                    },
                    list: {
                        description: "Create and manage approval workflows.",
                        primaryAction: "New approval workflow",
                        title: "Approval workflows"
                    },
                    templates: {
                        back: "Go back to approval workflows",
                        description: "Please choose one of the following approval workflow types.",
                        templateHeading: "Quick Setup",
                        templateSubHeading: "Predefined set of templates to speed up your approval workflow creation.",
                        title: "Select Approval Workflow Type"
                    }
                },
                placeholders: {
                    emptyList: {
                        action: "New Approval Workflow",
                        subtitles: "There are currently no approval workflows available. "
                            + "You can add a new approval workflow easily by following the "
                            + "steps in the approval workflow creation wizard.",
                        title: "Add a new approval workflow"
                    },
                    emptyListReadOnly: {
                        subtitles: "There are currently no approval workflows available.",
                        title: "No approval workflows"
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
            emailDomainDiscovery: {
                subTitle: "Configure email domain discovery for organizations.",
                title: "Email Domain Discovery"
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
            rolesEdit: {
                backButton: "Go back to {{type}}",
                subTitle: null,
                title: "Edit Role"
            },
            groupsEdit: {
                backButton: "Go back to {{type}}",
                subTitle: null,
                title: "Edit Group"
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
                backButton: "Go back to {{type}}",
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
