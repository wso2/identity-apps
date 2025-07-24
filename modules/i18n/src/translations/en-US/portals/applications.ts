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
import { ApplicationsNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */

export const applications: ApplicationsNS = {
    quickStart: {
        addUserOption: {
            description: "You need a <1>user account</1> to log in to the application.",
            hint:
                "If you don’t already have a user account, click the below button to create one. " +
                "Alternatively, go to <1>User Management > Users</1><3></3> and create users.",
            message:
                "If you do not already have a user account, contact your organization " +
                "administrator."
        },
        spa: {
            customConfig: {
                heading: "You can implement login using <1>Authorization Code flow with PKCE</1> " +
                    "with Asgardeo for any SPA technology.",
                anySPATechnology: "or any SPA Technology",
                configurations: "Configurations",
                protocolConfig: "Use the following configurations to integrate your application with Asgardeo. " +
                    "For more details on configurations, go to the <1>Protocol</1> tab.",
                clientId: "Client ID",
                baseUrl: "Base URL",
                redirectUrl: "Redirect URL",
                scope: "Scope",
                serverEndpoints: "Details on the server endpoints are available in the <1>Info</1> tab."
            },
            techSelection: {
                heading: "Use the SDKs curated by Asgardeo and 3rd party integrations."
            }
        },
        technologySelectionWrapper: {
            subHeading:
                "Use the <1>server endpoint " +
                "details</1> and start integrating your own app or read through our <3>documentation</3> " +
                "to learn  more.",
            otherTechnology: "or any mobile technology"
        },
        twa: {
            common: {
                orAnyTechnology: "or any technology"
            },
            oidc: {
                customConfig: {
                    clientSecret: "Client Secret",
                    heading: "You can implement login using <1>Authorization Code flow</1> " +
                        "with Asgardeo for any traditional web application."
                }
            },
            saml: {
                customConfig: {
                    heading: "Discover <1>SAML configurations</1> to integrate Asgardeo with" +
                        " any traditional web application.",
                    issuer: "Issuer",
                    acsUrl: "Assertion Consumer Service URL",
                    idpEntityId: "IdP Entity ID",
                    idpUrl: "IdP URL"
                }
            }
        },
        m2m: {
            customConfig: {
                tokenEndpoint: "Token Endpoint",
                tokenRequest: "Token Request",
                configurations: "Configurations"
            }
        }
    },
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
        placeholder: "Search applications by name, client ID, or issuer"
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
        deleteChoreoApplication: {
            assertionHint: "Please confirm your action.",
            content: "Deleting this application will break the authentication flows and cause the " +
                "associated Choreo application to be unusable with its credentials. " +
                "<1>Proceed at your own risk.</1>",
            header: "Are you sure?",
            message: "If you delete this application, authentication flows for this application will " +
                "stop working. Please proceed with caution."
        },
        disableApplication: {
            header: "Are you sure?",
            content: {
                0: "This may prevent consumers from accessing the application, but it can be resolved by " +
                "re-enabling the application.",
                1: "Ensure that the references to the application in <1>email templates</1> " +
                "and other relevant locations are updated to reflect the application status accordingly."
            },
            message: "If you disable this application, consumers will not be able to access the application. "+
            "The application also will loose access to user data. Please proceed with caution.",
            assertionHint: "Please confirm your action."
        },
        enableApplication: {
            header: "Are you sure?",
            content: "This may lead to consumers accessing the application. This action is reversible.",
            message: "If you enable this application, consumers will have the access to the application. "+
            "The application also will gain access to user data. Please proceed with caution.",
            assertionHint: "Please confirm your action."
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
        backupCodeAuthenticatorDelete: {
            assertionHint: "Click Continue to remove backup code functionality.",
            content: "If you proceed, the backup code functionality will also be removed from your " +
                "current authentication step. Do you wish to continue?",
            header: "Confirm Deletion",
            message: "This action will remove backup code functionality from the current authentication step."
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
        },
        inProgressReshare: {
            assertionHint: "Please confirm your action.",
            content: "This action is irreversible and will discard the application sharing operations currently in progress",
            header: "Are you sure?",
            message: "Sharing application with organizations is in progress. Cancelling will terminate the operation."
        }
    },
    dangerZoneGroup: {
        deleteApplication: {
            actionTitle: "Delete",
            header: "Delete application",
            subheader: "Once the application is deleted, it cannot be recovered and the clients " +
                "using this application will no longer work."
        },
        disableApplication: {
            actionTitle: "Disable application",
            header: "Disable application",
            subheader: "Once the application is disabled, it will not be accessible by the consumers." +
                " And the application also can not access consumer data."
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
                emptySearchResults: {
                    subtitles: {
                        0: "We couldn't find any results for '{{ searchQuery }}'",
                        1: "Please try a different search term."
                    },
                    title: "No results found"
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
                        subHeading: "Select which user attributes you want to share with the application.",
                        note: "Please note that the user attributes added from this section will only be "
                            + "included in the ID token."
                    },
                    attributeComponentHint: "Use <1>OpenID Connect Scopes</1> to manage user attribute in a scope. " +
                        "You can add new attributes by navigating to <3>Attributes.</3>",
                    attributeComponentHintAlt: "Manage the user attributes you want to share with this" +
                        " application. You can add new attributes and mappings by navigating to " +
                        "<1>Attributes.</1>",
                    description: "Select scopes, i.e grouped user attributes that are allowed to be shared with this " +
                        "application.",
                    heading: "User Attribute Selection",
                    scopelessAttributes: {
                        description: "View attributes without a scope",
                        displayName: "Attributes without a scope",
                        name: "",
                        hint: "Cannot retrieve these user attributes by requesting " +
                                "OIDC scopes. To retrieve, add the required attributes to a relevant scope."
                    },
                    subjectAttributeSelectedHint: "<1>{{ subjectattribute }}</1> attribute in this scope is selected as alternative subject identifier.",
                    selectedScopesComponentHint: "Request these scopes from your application to retrieve " +
                        "the selected user attributes.",
                    howToUseScopesHint: "How to use Scopes",
                    mandatoryAttributeHint: "Mark which user attributes are mandatory to be shared " +
                        "with the application. At login, {{productName}} prompts the user to enter these " +
                        "attribute values, if not already provided in the user's profile.",
                    mappingTable: {
                        actions: {
                            enable: "Enable attribute name mapping"
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
                                makeScopeRequested: "Make Scope requested",
                                removeMandatory: "Remove mandatory",
                                removeRequested: "Remove requested",
                                removeScopeRequested: "Remove Scope Requested",
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
                        mappedAtributeHint: "Enter the custom attribute name to be used in " +
                            "the assertion sent to the application.",
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
                        searchPlaceholder: "Search user attributes by name, display name or scope details"
                    },
                    selectAll: "Select all attributes"
                },
                tabName: "User Attributes"
            },
            general: {
                tabName: "General"
            },
            info: {
                mtlsOidcHeading: "Mutual TLS Server Endpoints",
                mtlsOidcSubHeading: "The following server endpoints will be useful for you to implement " +
                    "and configure authentication for your application using OpenID Connect where MTLS " +
                    "client authentication or certificate token binding is applicable. ",
                oidcHeading: "Server Endpoints",
                oidcSubHeading: "The following server endpoints will be useful for you to implement and " +
                    "configure authentication for your application using OpenID Connect.",
                samlHeading: "Connection Details",
                samlSubHeading: "The following IdP details will be useful for you to implement and " +
                    "configure authentication for your application using SAML 2.0.",
                wsFedHeading: "Connection Details",
                wsFedSubHeading: "The following IdP details will be useful for you to implement and " +
                    "configure authentication for your application using WS-Federation.",
                tabName: "Info"
            },
            protocol: {
                title: "Protocol Configuration",
                subtitle: "Configure the protocol for your application.",
                button: "Configure Protocol"
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
            sharedAccess: {
                doNotShareApplication: "Do not share the application with any organization.",
                shareAllApplication: "Share the application with all organizations.",
                shareSelectedApplication: "Share the application with selected organizations.",
                allRolesAndOrgsSharingMessage: "All roles of the application will be shared with all the organizations.",
                allRolesAndOrgsNotSharingMessage: "No roles will be shared with any organization.",
                doNotShareRolesWithAllOrgs: "Do not share roles with all organizations.",
                manageRoleSharing: "Manage role sharing",
                viewRoleSharing: "View shared roles",
                noSharedOrgs: "This application is not shared with any organizations.",
                noRolesAvailableForOrg: "No roles available for the selected organization.",
                searchAvailableRolesPlaceholder: "Search available roles",
                orgNotSelectedForRoleSharing: "To share roles, please select the organization from the left panel.",
                rolesSharedPartially: "Roles are selectively shared with this organization.",
                shareRoleSubsetWithSelectedOrgs: "Share a subset of roles with selected organizations",
                shareRoleSubsetWithAllOrgs: "Share a subset of roles with all organizations",
                subTitle: "Select the following options to share the application with the organizations.",
                shareAllRoles: "Share All Roles",
                shareSelectedRoles: "Share Selected Roles",
                doNotShareRoles: "Do Not Share Roles",
                tabName: "Shared Access",
                selectAnOrganizationToViewRoles: "Select an organization to view the shared roles.",
                sharedAccessStatusOptions: {
                    all: "All",
                    success: "Success",
                    failed: "Failed",
                    partiallyCompleted: "Partially Completed"
                },
                notifications: {
                    unshare: {
                        success: {
                            description: "Application unshared with the organization(s) successfully",
                            message: "Application unshared!"
                        },
                        error: {
                            description: "Application unsharing failed. Please try again",
                            message: "Application unsharing failed!"
                        }
                    },
                    share: {
                        success: {
                            description: "Application shared with the organization(s) successfully",
                            message: "Application shared!"
                        },
                        error: {
                            description: "Application sharing failed. Please try again",
                            message: "Application sharing failed!"
                        }
                    },
                    fetchApplicationOrgTree: {
                        genericError: {
                            description: "Error occurred while fetching the shared organizations.",
                            message: "Fetching shared organizations failed!"
                        }
                    },
                    fetchApplicationRoles: {
                        genericError: {
                            description: "Error occurred while fetching the shared roles of the application.",
                            message: "Fetching roles failed!"
                        }
                    },
                    fetchOrganizations: {
                        genericError: {
                            description: "Error occurred while fetching the organizations.",
                            message: "Fetching organizations failed!"
                        }
                    },
                    noRolesSelected: {
                        description: "Please select at least one role to share with all the organizations.",
                        message: "No roles selected!"
                    }
                }
            },
            shareApplication: {
                addSharingNotification: {
                    genericError: {
                        description: "Application sharing failed. Please try again",
                        message: "Application sharing failed!"
                    },
                    success: {
                        description: "Application shared with the organization(s) successfully",
                        message: "Application shared!"
                    }
                },
                addAsyncSharingNotification: {
                    description: "Application sharing may take a while to complete.",
                    message: "Application sharing in progress."
                },
                getSharedOrganizations: {
                    genericError: {
                        description: "Getting shared organization list failed!",
                        message: "Getting Shared Organization list failed!"
                    }
                },
                heading: "Share Application",
                shareApplication: "Share Application",
                stopSharingNotification: {
                    genericError: {
                        description: "Application sharing stop failed for {{organization}}",
                        message: "Application sharing stop failed!"
                    },
                    success: {
                        description: "Application sharing stopped with the {{organization}} successfully",
                        message: "Application shared stopped successfully!"
                    }
                },
                stopAllSharingNotification: {
                    genericError: {
                        description: "Application sharing stop failed for all organizations",
                        message: "Application sharing stop failed!"
                    },
                    success: {
                        description: "Application sharing stopped with all the organizations successfully",
                        message: "Application sharing stopped successfully!"
                    }
                },
                completedSharingNotification: {
                    failure: {
                        description: "Application sharing completed with failure for all organizations.",
                        message: "Application sharing failed."
                    },
                    success: {
                        description: "Application was shared with organizations successfully.",
                        message: "Application sharing successful."
                    },
                    partialSuccess: {
                        description: "Application sharing completed with partial success for some organizations.",
                        message: "Application sharing partially successful."
                    }
                },
                switchToSelectiveShareFromSharingWithAllSuborgsWarning: "Switching from sharing the app with all organizations to " +
                    "sharing with selected organizations will " +
                    "reset the application configurations in all organizations.",
                asyncOperationStatus: {
                    inProgress: {
                        heading: "Update In Progress.",
                        description: "Updating shared access is in progress."
                    },
                    failed: {
                        heading: "Update Failed.",
                        description: "Updating shared access failed.",
                        actionText: "View"
                    },
                    partiallyCompleted: {
                        heading: "Update Partialy Successful.",
                        description: "Updating shared access completed with partial success.",
                        actionText: "View"
                    }
                },
                applicationShareFailureSummaryDefaultStatus: {
                    success: "Application shared successfully.",
                    failed: "Application sharing failed.",
                    partiallyCompleted: "Application sharing partially completed."
                }
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
                                        keyIcon: "You can securely store sensitive information, such as " +
                                            "API keys and other secrets, for use in conditional " +
                                            "authentication scripts. Once stored, these secrets can " +
                                            "be referenced in your scripts using the syntax <1>secrets.{secret name}</1>",
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
                                            title: "Configure New Connection"
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
                                            },
                                            backupCodes: {
                                                description: "Two-factor authentication recovery option.",
                                                heading: "MFA Recovery"
                                            },
                                            external: {
                                                heading: "External user authentication"
                                            },
                                            internal: {
                                                heading: "Internal user authentication"
                                            },
                                            twoFactorCustom: {
                                                heading: "2FA authentication"
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
                                        },
                                        enableBackupCodes: {
                                            label: "Enable backup codes"
                                        }
                                    }
                                },
                                heading: "Step-based configuration",
                                hint: "Create a user login flow by dragging authenticators on to the " +
                                    "relevant steps.",
                                secondFactorDisabled: "Second factor authenticators " +
                                    "can be used only if <1>User name and password " +
                                    "password</1>, <3>Social Login</3> or any other handler" +
                                    "which can handle these factors are" +
                                    "present in a previous step.",
                                secondFactorDisabledDueToProxyMode: "To configure <1>{{auth}}</1>," +
                                    " you should enable the Just-in-Time provisioning" +
                                    " setting from the following connections.",
                                secondFactorDisabledInFirstStep: "Second factor authenticators can " +
                                    "not be used in the first step.",
                                backupCodesDisabled: "Backup code authenticator can only be used if multi factor " +
                                    "authenticators are present in the current step.",
                                backupCodesDisabledInFirstStep: "Backup code authenticator cannot be used " +
                                    "in the first step.",
                                federatedSMSOTPConflictNote: {
                                    multipleIdps: "Asgardeo requires the user's profile containing" +
                                    " the <1>mobile number</1> to configure <3>SMS OTP</3> with the" +
                                    " following connections.",
                                    singleIdp: "Asgardeo requires the user's profile containing the"+
                                    " <1>mobile number</1> to configure <3>SMS OTP</3> with" +
                                    " <5>{{idpName}}</5> connection."
                                },
                                sessionExecutorDisabledInFirstStep: "Active sessions limit handler require " +
                                "having a basic authenticator in a prior step.",
                                sessionExecutorDisabledInMultiOptionStep: "Active sessions limit handler cannot be " +
                                "added to a multi option step."
                            }
                        }
                    },
                    customization: {
                        heading: "Customize Login Flow",
                        revertToDefaultButton: {
                            hint: "Revert back to the default configuration (Username & Password)",
                            label: "Revert to default"
                        }
                    },
                    landing: {
                        banners: {
                            registrationConfiguration: "Want to customize your organization's user " +
                                "<1>self-registration</1> flow? Click <3>configure</3> to get started."
                        },
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
                                apple: {
                                    description: "Enable users to login with Apple ID.",
                                    heading: "Add Apple login"
                                },
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
                                idf: {
                                    tooltipText: "The identifier first authenticator does not verify" +
                                        " the user's identity, and hence cannot be used to pick the" +
                                        " user identity or attributes. To do so, enable validations" +
                                        " using an authentication script."
                                },
                                magicLink: {
                                    description: "Enable users to log in using a magic "
                                        + "link sent to their email.",
                                    heading: "Add Magic Link login"
                                },
                                microsoft: {
                                    description: "Enable users to login with Microsoft.",
                                    heading: "Add Microsoft login"
                                },
                                totp: {
                                    description: "Enable additional authentication layer with Time "
                                        + "based OTP.",
                                    heading: "Add TOTP as a second factor"
                                },
                                usernameless: {
                                    description: "Enable users to log in using a passkey, FIDO security key or "
                                        + "biometrics.",
                                    heading: "Add Passkey Login",
                                    info: "On-the-fly passkey enrollment is available exclusively " +
                                    "for FIDO2 supported passkeys and further users wishing to enroll " +
                                    "multiple passkeys, they must do so via MyAccount."
                                },
                                passkey: {
                                    description: "Enable users to log in using a passkey, FIDO security key or " +
                                    "biometrics.",
                                    heading: "Add Passkey Login",
                                    info: {
                                        progressiveEnrollmentEnabled: "Passkey progressive enrollment is enabled.",
                                        passkeyAsFirstStepWhenprogressiveEnrollmentEnabled: "<0>Note : </0> For " +
                                        "on-the-fly user enrollment with passkeys, use the <2>Passkeys Progressive " +
                                        "Enrollment</2> template in <4>Conditional Authentication</4> section.",
                                        passkeyIsNotFirstStepWhenprogressiveEnrollmentEnabled: "Users can enroll " +
                                        "passkeys on-the-fly. If users wish to enroll multiple passkeys they should do " +
                                        "so via <1>My Account</1>.",
                                        progressiveEnrollmentEnabledCheckbox: "<0>Note : </0> When setting " +
                                        "the Passkey in the <2>first step</2>, users need to add an adaptive " +
                                        "script. Use the <4>Passkeys Progressive Enrollment</4> template in " +
                                        "the <6>Sign-In-Method</6> tab of the application.",
                                        progressiveEnrollmentDisabled: "<1>Passkey progressive enrollment</1> is disabled. " +
                                        "Users must enroll their passkeys through <2>My Account</2> to use passwordless sign-in."
                                    }
                                },
                                emailOTP: {
                                    description: "Enable additional authentication layer with Email based OTP.",
                                    heading: "Add Email OTP as a second factor"
                                },
                                smsOTP: {
                                    description: "Enable additional authentication layer with SMS based OTP.",
                                    heading: "Add SMS OTP as a second factor"
                                },
                                emailOTPFirstFactor: {
                                    description: "Enable users to log in using a one-time passcode "
                                        + "sent to their email.",
                                    heading: "Add Email OTP login"
                                },
                                smsOTPFirstFactor: {
                                    description: "Enable users to log in using a one-time passcode "
                                        + "sent to their mobile.",
                                    heading: "Add SMS OTP login"
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
                tabName: "Login Flow"
            },
            apiAuthorization: {
                m2mPolicyMessage: "All the authorized scopes of an API resource are available for an M2M application despite the authorization policy specified for the resource."
            },
            roles: {
                createApplicationRoleWizard: {
                    title: "Create Application Role",
                    subTitle: "Create a new application role in the system.",
                    button: "New Role"
                }
            }
        }
    },
    forms: {
        advancedAttributeSettings: {
            sections: {
                linkedAccounts: {
                    errorAlert: {
                        message: "Invalid configuration",
                        description: "Linked local account validation should be enabled to mandate a linked local account"
                    },
                    heading: "Attribute Resolution for Linked Accounts",
                    descriptionFederated: "Manage how user attributes are resolved when a local account is linked to a federated identity.",
                    fields: {
                        validateLocalAccount: {
                            label: "Use linked local account attributes",
                            hint: "If a linked local account exists, its attributes will be used. If no linked account is found,attributes of the federated user account will be used instead."
                        },
                        mandateLocalAccount: {
                            label: "Require linked local account",
                            hint: "Authentication will fail if no linked local account is found during token exchange."
                        }
                    }
                },
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
                        alternateSubjectAttribute: {
                            hint: "This option will allow to use an alternate attribute as the subject identifier instead of the <1>userid</1>.",
                            label: "Assign alternate subject identifier"
                        },
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
                            },
                            placeholder: "Select an attribute",
                            info: "Alternate subject identifier's can be assigned only if user attributes are selected."
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
                        },
                        subjectType: {
                            label: "Subject type",
                            public: {
                                label: "Public",
                                hint: "This option will use the public subject identifier as the" +
                                    " subject. Subject identifier URI is used in subject value" +
                                    " calculation."
                            },
                            pairwise: {
                                label: "Pairwise",
                                hint: "Enable pairwise to assign a unique pseudonymous ID " +
                                    "to each client. The subject identifier URI and callback URI or " +
                                    "sector identifier URI is considered in calculating the subject value."
                            }
                        },
                        sectorIdentifierURI: {
                            label: "Sector Identifier URI",
                            hint: "Must configure this value if multiple callback URIs with" +
                                " different hostnames are configured.",
                            placeholder: "Enter the subject identifier URI",
                            validations: {
                                invalid: "The entered URL is not HTTPS. Please add a valid URL.",
                                required: "This field is required if multiple callback URIs are" +
                                    " configured."
                            },
                            multipleCallbackError: "Need to configure a sector identifier URI if " +
                                "multiple callback URLs are configured with subject type pairwise. Go to" +
                                " User attributes -> Subject to configure the sector identifier URI."
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
                applicationNativeAuthentication: {
                    heading: "App-Native Authentication",
                    fields: {
                        enableAPIBasedAuthentication: {
                            hint: "Select to authorize application to perform browserless, in-app authentication via app-native authentication API.",
                            label: "Enable app-native authentication API"
                        }
                    }
                },
                clientAttestation: {
                    heading: "Client Attestation",
                    alerts: {
                        clientAttestationAlert: "For client attestation to work, the app-native authentication API must be enabled."
                    },
                    fields: {
                        enableClientAttestation: {
                            hint: "Select to verify the integrity of the application by calling the attestation service of the hosting platform. To enable this you will be required to setup <1>Platform Settings</1>.",
                            label: "Enable client attestation"
                        },
                        androidAttestationServiceCredentials: {
                            hint: "Provide the Google service account credentials in the JSON format for Android applications. This will be used to access the  Google Play Integrity Service.",
                            label: "Service account credentials",
                            placeholder: "Content of the JSON key file for the Google service account credentials",
                            validations: {
                                empty: "Google service account credentials are required for client attestation.",
                                invalid: "Invalid Google service account credentials"
                            }
                        }
                    }
                },
                trustedApps: {
                    heading: "Trusted App Settings",
                    alerts: {
                        trustedAppSettingsAlert: "Enabling this feature will publish details under <1>Platform Settings</1> to a public endpoint accessible to all Asgardeo organizations. Consequently, other organizations can view information about your application and its associated organization. This option is not applicable if you are using custom domains.",
                        link: "Read for more."
                    },
                    fields: {
                        enableFIDOTrustedApps: {
                            hint: "Select to trust the app for user login with passkey. Provide the details of the application under <1>Platform Settings</1>.",
                            label: "Add as a FIDO trusted app"
                        }
                    },
                    modal: {
                        assertionHint : "I understand and wish to proceed.",
                        header: "Are you sure?",
                        message: "For validation purposes, the details available under Platform Settings will be listed on a public endpoint shared across all organizations.",
                        content: ""
                    }
                },
                platformSettings: {
                    heading: "Platform Settings",
                    subTitle: "The following platform specific configurations are needed when enabling client-attestation or trusted app related features.",
                    fields: {
                        android: {
                            heading: "Android",
                            fields: {
                                androidPackageName: {
                                    hint: "Enter the package name of your application. It is the unique identifier of your application and is typically in the reverse domain format.",
                                    label: "Package name",
                                    placeholder: "com.example.myapp",
                                    validations: {
                                        emptyForAttestation: "Application package name is required for client attestation.",
                                        emptyForFIDO: "Application package name is required for FIDO trusted apps."
                                    }
                                },
                                keyHashes: {
                                    hint: "The SHA256 fingerprints related to the signing certificate of your application.",
                                    label: "Key Hashes",
                                    placeholder: "D4:B9:A3",
                                    validations: {
                                        invalidOrEmpty: "A valid key hash is required for FIDO trusted apps.",
                                        duplicate: "Same key hashes added."
                                    },
                                    tooltip: "Add Thumbprint"

                                }
                            }
                        },
                        apple: {
                            heading: "Apple",
                            fields: {
                                appleAppId: {
                                    hint: "Enter the Apple app ID, the unique identifier assigned by Apple to your app.",
                                    label: "App id",
                                    placeholder: "com.example.myapp"
                                }
                            }
                        }
                    }
                },
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
                        customPassiveSTS: "This certificate is used to validate the signatures of the signed requests.",
                        customSaml: "This certificate is used to validate the signatures of the " +
                            "signed requests and to encrypt the SAML assertions returned after " +
                            "authentication."
                    },
                    invalidOperationModal: {
                        header: "Operation Invalid",
                        message: "You should disable the request signature validation to remove "+
                            "the certificate. If request or response signing is enabled, "+
                            "it is essential to have a valid certificate to verify the signature."
                    }
                }
            }
        },

        applicationsSettings: {
            title: "Application Settings",
            fields: {
                dcrEndpoint: {
                    label: "DCR Endpoint",
                    hint: "The DCR endpoint allows OAuth clients to be registered as applications in an authorization server."
                },
                ssaJwks: {
                    label: "JWKS endpoint to validate SSA",
                    placeholder: "https://example.com/samplejwks.jwks",
                    hint: "The JWKS url will be used to validate the software statement assertion (SSA) coming in DCR create request.",
                    validations: {
                        empty: "JWKS URL is required to validate SSA"
                    }
                },
                mandateSSA: {
                    label: "Mandate SSA Validation",
                    hint: "When checked, SSA validation is mandated, and software_statement parameter is required for the DCR create request."
                },
                authenticationRequired: {
                    label: "Require Authentication",
                    hint: "When checked, authentication will be required for DCR create endpoint. If unchecked authentication is not needed to invoke DCR create endpoint."
                },
                enforceFapi: {
                    label: "Enforce FAPI Conformance",
                    hint: "When checked, an application which is created through DCR endpoint will be a FAPI compliant application."
                }
            }
        },
        generalDetails: {
            sections: {
                branding: {
                    title: "Branding"
                }
            },
            brandingLink: {
                hint: "This will take you to the Branding page where you can customize consumer-facing user interfaces of the application such as the logo, colors, fonts.",
                label: "Go to Application Branding"
            },
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
                    },
                    ariaLabel: "Application access URL"
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
                discoverableGroups: {
                    label: "Discoverable Groups",
                    action: {
                        assign: "Type group name/s to search and assign groups"
                    },
                    radioOptions: {
                        everyone: "Everyone in the organization can discover this application",
                        userGroups: "Only a selected group of users can discover this application"
                    }
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
                isSharingEnabled: {
                    hint: "If enabled, it will share this application with all or any selected organizations " +
                        "that belong to your root organization.",
                    label: "Allow sharing with organizations"
                },
                isManagementApp: {
                    hint: "Enable to allow the application to access management API of this organization.",
                    label: "Management Application"
                },
                isFapiApp: {
                    hint: "Enable to allow the application to be FAPI compliant.",
                    label: "FAPI Compliant Application"
                },
                name: {
                    label: "Name",
                    placeholder: "My App",
                    validations: {
                        duplicate: "There is already an application with this name. " +
                            "Please enter a different name.",
                        empty: "Application name is required.",
                        reserved: "{{appName}} is a reserved application name. Please enter a different " +
                            "name."
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
                    placeholder: "Enter {{name}}",
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
                },
                hybridFlow: {
                    hybridFlowResponseType: {
                        children: {
                            code_token: {
                                hint: "This response type is not recommended."
                            },
                            code_idtoken_token: {
                                hint: "This response type is not recommended."
                            }
                        }
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
            mobileApp: {
                discoverableHint: "If enabled and a web accessible url(deep link) is given, customers " +
                    "can access this application from the <1>{{ myAccount }}</1> portal.",
                mobileAppPlaceholder: "myapp://oauth2"
            },
            dropdowns: {
                selectOption: "Select Option"
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
                                cookie: {
                                    label: "Cookie"
                                },
                                clientRequest: {
                                    label: "Client Request"
                                },
                                certificate: {
                                    label: "Certificate"
                                },
                                deviceFlow: {
                                    label: "Device Flow"
                                },
                                ssoBinding: {
                                    label: "SSO Session"
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
                                    "and revoke the token upon logout.",
                                dpop: "Binds the access token to the client's public key. The client must present"+
                                    " a signed DPoP proof in each request to prove posession of the corresponding private key."
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
                                "gets terminated through a user logout. Remember to include either <1>client_id</1> " +
                                "or <3>id_token_hint</3> in the logout request.",
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
                        },
                        audience: {
                            hint: "Specify the recipient(s) that this <1>access_token</1> is intended for." +
                            " By default, the client ID of this application is added as an audience.",
                            label: "Audience",
                            placeholder: "Enter Audience",
                            validations: {
                                duplicate: "Audience contains duplicate values",
                                empty: "Please fill the audience",
                                invalid: "Please avoid special characters like commas (,)"
                            }
                        },
                        accessTokenAttributes: {
                            hint : "Select the attributes that should be included in the <1>access_token</1>.",
                            label: "Access Token Attributes",
                            placeholder: "Search by attribute name"
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
                        },
                        signing: {
                            hint: "The dropdown contains the supported <1>id_token</1> signing "+
                                "algorithms.",
                            label: "ID token response signing algorithm",
                            placeholder: "Select Algorithm"
                        }
                    },
                    heading: "ID Token"
                },
                outdatedApplications: {
                    alert : {
                        title: "Update Required.",
                        content: "We have updated the behavior of applications as follows.",
                        viewButton: "View Details",
                        hideButton: "Hide Details",
                        action: "Before updating your application, be sure to update any usages of these attributes accordingly."
                    },
                    label: "Outdated",
                    documentationHint: "More Details",
                    confirmationModal: {
                        header: "Have you done the relevant changes?",
                        message: "Proceeding without making the necessary changes will cause the client application's behavior to break.",
                        content: "This action is irreversible and will result in a permanent update to the application.",
                        assertionHint: "Please confirm your action"
                    },
                    fields: {
                        commonInstruction: "Following behavioral changes will be applied upon update.",
                        versions: {
                            version100: {
                                useClientIdAsSubClaimOfAppTokens: {
                                    instruction: "The <1>sub</1> attribute of an application access token now returns the "
                                        + "<3>client_id</3> generated for the application, instead of the <5>userid</5> of "
                                        + "the application owner."
                                },
                                removeUsernameFromIntrospectionRespForAppTokens: {
                                    instruction: "The introspection responses for application access tokens no longer "
                                        + "return the <1>username</1> attribute."
                                }
                            },
                            version200: {
                                addAllRequestedClaimsInJWTAccessToken: {
                                    instruction: "Irrespective of the <1>scopes</1> requested, all the <3>Requested Attributes</3> will "
                                        + "be included in the JWT Access Token."
                                }
                            }
                        }
                    }
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
                clientAuthentication: {
                    fields: {
                        authenticationMethod: {
                            hint: "The dropdown contains the supported client authentication methods.",
                            label: "Client authentication method",
                            placeholder: "Select method"
                        },
                        reusePvtKeyJwt: {
                            hint: "If enabled, the JWT can be reused again within its expiration period. " +
                                "JTI (JWT ID) is a claim that provides a unique identifier for the JWT.",
                            label: "Private Key JWT Reuse Enabled"
                        },
                        signingAlgorithm: {
                            hint: "The dropdown contains the supported client assertion signing" +
                                " algorithms.",
                            label: "Signing algorithm",
                            placeholder: "Select algorithm"
                        },
                        subjectDN: {
                            label: "TLS client authentication subject domain name",
                            placeholder: "Enter the tls client authentication subject domain name",
                            hint: "Enter the DN of the transport certificate."
                        }
                    },
                    heading: "Client Authentication"
                },
                pushedAuthorization: {
                    fields: {
                        requirePushAuthorizationRequest: {
                            hint: "Select to make it mandatory for the application to send authorization " +
                                "requests as pushed authorization requests.",
                            label: "Mandatory"
                        }
                    },
                    heading: "Pushed Authorization Requests"
                },
                requestObject: {
                    fields: {
                        requestObjectSigningAlg: {
                            hint: "The dropdown contains the supported <1>request object</1> signing" +
                                " algorithms.",
                            label: "Request object signing algorithm",
                            placeholder: "Select Algorithm"
                        },
                        requestObjectEncryptionAlgorithm: {
                            hint: "The dropdown contains the supported <1>request object</1> encryption" +
                                " algorithms.",
                            label: "Request object encryption algorithm",
                            placeholder: "Select Algorithm"
                        },
                        requestObjectEncryptionMethod: {
                            hint: "The dropdown contains the supported <1>request object</1> encryption" +
                                " methods.",
                            label: "Request object encryption method",
                            placeholder: "Select Method"
                        }
                    },
                    heading: "Request Object"
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
                subjectToken: {
                    fields: {
                        enable: {
                            hint: "If enabled, this application can be used in the user impersonation flows.",
                            label: "Enable subject token response type",
                            validations: {
                                empty: "This is a required field."
                            }
                        },
                        expiry: {
                            hint: "Specify the validity period of the <1>subject_token</1> in seconds.",
                            label: "Subject token expiry time",
                            placeholder: "Enter the subject token expiry time",
                            validations: {
                                empty: "Please fill the subject token expiry time",
                                invalid: "Subject token expiry time should be in seconds. " +
                                    "Decimal points and negative numbers are not allowed."
                            }
                        }
                    },
                    heading: "Subject Token"
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
                },
                hybridFlow: {
                    heading: "Hybrid Flow",
                    enable: {
                        label: "Enable Hybrid Flow"
                    },
                    hybridFlowResponseType: {
                        label: "Allowed response types",
                        fields: {
                            children: {
                                code_token: {
                                    label: "code token"
                                },
                                code_idtoken: {
                                    label: "code id_token"
                                },
                                code_idtoken_token: {
                                    label: "code id_token token"
                                }
                            },
                            hint: "Select the allowed hybrid flow response type."
                        }
                    }
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
                        attributeNameFormat: {
                            hint: "This specifies the format for attribute names in the attribute statement of the " +
                                "SAML assertion.",
                            label: "Attribute name format"
                        },
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
                        " assertion encryption are disabled to proceed.",
                    certificateRemoveConfirmation: {
                        header: "Remove current certificate?",
                        content: "Setting the certificate type to none will remove the current " +
                            "certificate provided for this application. Proceed with caution."
                    }
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
                    hint: "Enter realm identifier for ws-federation",
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
                },
                replyToLogout: {
                    hint: "Enter RP endpoint URL that handles the response at logout.",
                    label: "Reply Logout URL",
                    placeholder: "Enter Reply Logout URL",
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
                },
                urlDeepLinkError: "The entered URL is not a deep link."
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
                            dynamicClientRegistration: "Dynamic Client Registration",
                            endSession: "Logout",
                            introspection: "Introspection",
                            issuer: "Issuer",
                            jwks: "JWKS",
                            keystore: "Key Set",
                            openIdServer: "OpenID Server",
                            pushedAuthorizationRequest: "Pushed Authorization Request",
                            revoke: "Revoke",
                            sessionIframe: "Session Iframe",
                            token: "Token",
                            userInfo: "UserInfo",
                            webFinger: "Web Finger",
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
                            sso: "Single Sign-On",
                            destinationURL: "Destination URLs",
                            artifactResolutionUrl: "Artifact Resolution URL"
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
                    },
                    wsFedConfigurations: {
                        labels: {
                            passiveSTSUrl: "WS-Federation URL"
                        }
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
            actions: "",
            name: "Name",
            inboundKey: "Inbound Key"
        },
        labels: {
            fragment: "Shared app"
        }
    },
    myaccount: {
        description: "Self-service portal for your users.",
        popup: "Share this link with your users to allow access to My Account" +
        " and to manage their accounts.",
        settings: "My Account Settings",
        title: "My Account",
        enable: {
            0: "Enabled",
            1: "Disabled"
        },
        Confirmation: {
            enableConfirmation: {
                content: "The My Account portal is in preview mode and it is recommended to disable it " +
                    "when your organization goes into production.",
                heading: "Are you sure?",
                message: "Enable My Account portal."
            },
            disableConfirmation: {
                content: "The My Account portal is in preview mode and it is recommended to disable it " +
                    "when your organization goes into production. When My Account portal is disabled, " +
                    "users of your organization will not be able to access it.",
                heading: "Are you sure?",
                message: "Disable My Account portal."
            }
        },
        notifications: {
            error: {
                description: "{{description}}",
                message: "Update error"
            },
            genericError: {
                description: "Failed to update My Account portal status.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully updated My Account portal status.",
                message: "Update successful"
            }
        },
        fetchMyAccountStatus: {
            error: {
                description: "{{description}}",
                message: "Retrieval error"
            },
            genericError: {
                description: "Couldn't retrieve My Account portal status.",
                message: "Something went wrong"
            }
        },
        overview: {
            tabName: "Overview",
            heading: "Welcome to My Account",
            contentIntro: "My Account is a one-stop portal for your users' self-service needs providing extensive account management capabilities.",
            contentDescription: "You can configure the login flow of the My Account, apply custom <1>branding configurations</1> and share access to it with B2B organizations.",
            shareApplication: "Share this link with your users to access the My Account portal."
        }
    },
    featureGate: {
        enabledFeatures: {
            tags: {
                premium: {
                    warning: "This is a premium feature and will soon be disabled for the free subscription plan. Upgrade your subscription for uninterrupted access to this feature."
                }
            }
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
        },
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
        authenticationStepDeleteErrorDueToAppShared: {
            genericError: {
                description: "This authenticator is required for the shared application.",
                message: "Cannot delete this authenticator"
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
        fetchMyAccountApplication: {
            error: {
                description: "{{description}}",
                message: "Retrieval error"
            },
            genericError: {
                description: "Couldn't retrieve the My Account application details.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully retrieved the My Account application details.",
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
        disableApplication: {
            error: {
                description: "{{description}}",
                message: "Update error"
            },
            genericError: {
                description: "Failed to {{state}} the application.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully {{state}} the application.",
                message: "Application {{state}}. "
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
            invalidScriptError: {
                description: "The authentication script contains invalid syntax. Please correct the script and try again.",
                message: "Invalid authentication script"
            },
            success: {
                description: "Successfully updated the authentication flow of the application.",
                message: "Update successful"
            }
        },
        updateClaimConfig: {
            mistmatchAlternativesubjectIdentifierError: {
                description: "The alternative subject identifier is not in the requested user attributes.",
                message: "Something went wrong"
            },
            error: {
                description: "Mapped user attributes cannot be duplicated.",
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
        updateIdentifierFirstInFirstStepError: {
            description: "The Identifier First authenticator requires multiple authentication steps in the sign-in flow.",
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
        emptyPlaceholder: {
            action: null,
            subtitles: "Please add templates to display here.",
            title: "No templates to display."
        },
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
        },
        sharedAccessStatus: {
            heading: "Summary - Update application shared access",
            subHeading: "Summary of detailed application sharing failures.",
            actionText: "Close",
            banner: {
                partiallyCompleted: "Partially Completed: ",
                failed: "Failed: "
            }
        }
    },
    resident: {
        provisioning: {
            outbound: {
                actions: {
                    addIdp: "New Provisioner"
                },
                addIdpWizard: {
                    heading: "Add Outbound Provisioner",
                    steps: {
                        details: "Provisioner Details"
                    },
                    subHeading: "Select the provisioner to provision users."
                },
                emptyPlaceholder: {
                    action: "New Provisioner",
                    subtitles: "No outbound provisioners configured. Add a provisioner to view it here.",
                    title: "No outbound provisioners"
                },
                form: {
                    fields: {
                        connection: {
                            label: "Connection",
                            placeholder: "Select connection",
                            validations: {
                                empty: "It is mandatory to select connection."
                            }
                        }
                    }
                },
                heading: "Outbound Provisioning Configuration",
                notifications: {
                    create: {
                        genericError: {
                            description: "Something went wrong while adding the outbound provisioning configuration.",
                            message: "Creation error"
                        },
                        success: {
                            description: "Successfully added the outbound provisioning configuration.",
                            message: "Creation successful"
                        },
                        error: {
                            description: "Outbound provisioning configuration already exists for the resident application.",
                            message: "Creation error"
                        }
                    },
                    delete: {
                        genericError: {
                            description: "Something went wrong while deleting the outbound provisioning configuration.",
                            message: "Deletion error"
                        },
                        success: {
                            description: "Successfully removed the outbound provisioning configuration.",
                            message: "Deletion successful"
                        }
                    },
                    fetch: {
                        genericError: {
                            description: "Something went wrong while getting the outbound provisioning configurations.",
                            message: "Something went wrong"
                        }
                    },
                    update: {
                        genericError: {
                            description: "Something went wrong while updating the outbound provisioning configuration.",
                            message: "Update error"
                        },
                        success: {
                            description: "Successfully updated the outbound provisioning configuration.",
                            message: "Update successful"
                        }
                    }
                },
                subHeading: "Configure outbound provisioning settings for the resident application."
            }
        }
    }
};
