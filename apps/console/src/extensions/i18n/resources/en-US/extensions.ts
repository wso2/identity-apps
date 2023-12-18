/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com).
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

import { Extensions } from "../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 * sort-keys is suppressed temporarily until the existing warnings are fixed.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */
export const extensions: Extensions = {
    common: {
        community: "Community",
        help: {
            communityLink: "Ask the Community",
            docSiteLink: "Documentation",
            helpCenterLink: "Contact Support",
            helpDropdownLink: "Get Help"
        },
        learnMore: "Learn More",
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
                        "Let your users log in to your applications with an Identity Provider of " + "their choice.",
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
        upgrade: "Upgrade",
        dropdown: {
            footer: {
                privacyPolicy: "Privacy",
                cookiePolicy: "Cookies",
                termsOfService: "Terms"
            }
        }
    },
    console: {
        application: {
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
                }
            }
        },
        applicationRoles: {
            assign: "Assign",
            assignGroupWizard: {
                heading: "Assign Groups",
                subHeading: "Assign groups to the application role."
            },
            authenticatorGroups: {
                goToConnections: "Go to Connections",
                groupsList: {
                    assignGroups: "Assign Groups",
                    notifications: {
                        fetchAssignedGroups: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while fetching assigned groups"
                            },
                            genericError: {
                                description: "An error occurred while fetching assigned groups.",
                                message: "Something went wrong"
                            }
                        },
                        updateAssignedGroups: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while updating assigned groups"
                            },
                            genericError: {
                                description: "An error occurred while updating assigned groups.",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "Successfully updated assigned groups.",
                                message: "Update successful"
                            }
                        }
                    }
                },
                hint: "When assigning external groups to a role, make sure that the connection is enabled in " +
                    "<1>External Grooup Role Resolution Control</1> in the Roles tab of the <3>Application</3>.",
                placeholder: {
                    title: "No External Groups",
                    subTitle: {
                        0: "There are no external groups available at the moment.",
                        1: "You can add a new external group by visiting the " +
                            "Groups tab in a connection."
                    }
                }
            },
            connectorGroups: {
                placeholder: {
                    title: "No External Groups",
                    subTitle: {
                        0: "There are no external groups available at the moment.",
                        1: "Define the groups that you receive from your connections by adding a new group."
                    }
                }
            },
            heading: "Application Roles",
            searchApplication: "Search Application",
            subHeading: "View and assign groups to your application roles.",
            roleGroups: {
                assignGroup: "Assign Group",
                searchGroup: "Search groups",
                placeholder: {
                    title: "No groups assigned",
                    subTitle: {
                        0: "There are no groups assigned to this role.",
                        1: "To assign a group, click on the Assign Group button."
                    }
                },
                notifications: {
                    addGroups: {
                        error: {
                            message: "An error occurred",
                            description: "An error occurred while adding the group."
                        },
                        success: {
                            message: "Group added successfully",
                            description: "The group has been successfully added to the role."
                        }
                    },
                    fetchGroups: {
                        error: {
                            message: "An error occurred",
                            description: "An error occurred while fetching the groups."
                        }
                    }
                },
                confirmation: {
                    deleteRole: {
                        message: "This action is irreversible and will remove " +
                            "the group from the application role.",
                        content: "If you remove this group from the application role, the permissions " +
                            "associated with this role will be removed from the group. Please proceed " +
                            "with caution."
                    }
                }
            },
            roleList: {
                placeholder: {
                    title: "No Application Roles",
                    subTitle: {
                        0: "There are no application roles available at the moment.",
                        1: "You can add a new application role by visiting the " +
                            "Roles tab in an Application."
                    }
                }
            },
            roleMapping: {
                heading: "External groups Role Resolution Control",
                subHeading: "Enable or disable application role resolving from external groups " +
                    "during authentication flow",
                notifications: {
                    sharedApplication: {
                        error: {
                            description: "An error occurred while retrieving the shared applications.",
                            message: "An error occurred"
                        }
                    },
                    updateRole: {
                        error: {
                            description: "{{description}}",
                            message: "Error updating role"
                        },
                        genericError: {
                            description: "An error occurred while updating the role.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully updated the role.",
                            message: "Updated successfully"
                        }
                    }
                }
            },
            roles: {
                heading: "Roles",
                subHeading: "Manage roles and permissions.",
                goBackToRoles: "Go back to Roles",
                orgRoles: {
                    heading: "Organization Roles",
                    subHeading: "Manage organization roles here."
                }
            }
        },
        identityProviderGroups: {
            claimConfigs: {
                groupAttributeLabel: "Group attribute",
                groupAttributeHint: "The attribute from the connection that will be mapped to the organization's group attribute.",
                groupAttributePlaceholder: "Enter mapped attribute",
                notifications: {
                    fetchConfigs: {
                        error: {
                            description: "{{description}}",
                            message: "Error occurred while fetching claim configurations"
                        },
                        genericError: {
                            description: "An error occurred while fetching claim configurations.",
                            message: "An error occurred"
                        }
                    }
                }
            },
            createGroupWizard: {
                groupNameLabel: "Group Name",
                groupNamePlaceHolder: "Enter a group name",
                groupNameHint: "This should correspond to the name of the groups that will be returned " +
                    "from your connection.",
                subHeading: "Create a new connection group.",
                notifications: {
                    createIdentityProviderGroup: {
                        error: {
                            description: "{{description}}",
                            message: "Error occurred while creating the connection group"
                        },
                        genericError: {
                            description: "An error occurred while creating the connection group.",
                            message: "An error occurred"
                        },
                        success: {
                            description: "The connection group has been created successfully.",
                            message: "Successfully created"
                        }
                    },
                    duplicateGroupError: {
                        error: {
                            description: "A group with the same name already exists.",
                            message: "Error occurred"
                        }
                    }
                }
            },
            groupsList: {
                confirmation: {
                    deleteGroup: {
                        message: "This action is irreversible.",
                        content: "This action will permanently delete the {{groupName}} identity provider group. " +
                            "Please proceed with caution"
                    }
                },
                newGroup: "New Group",
                noGroupsAvailable: "No groups available",
                notifications: {
                    fetchGroups: {
                        error: {
                            description: "{{description}}",
                            message: "Error occurred while fetching identity provider groups"
                        },
                        genericError: {
                            description: "An error occurred while retrieving identity provider groups.",
                            message: "An error occurred"
                        }
                    },
                    deleteGroup: {
                        error: {
                            description: "{{description}}",
                            message: "Error occurred while deleting the identity provider group"
                        },
                        genericError: {
                            description: "An error occurred while deleting the identity provider group.",
                            message: "An error occurred"
                        },
                        success: {
                            description: "The identity provider group has been deleted successfully.",
                            message: "Successfully deleted"
                        }
                    }
                },
                searchByName: "Search by name"
            }
        },
        marketingConsent: {
            heading: "Let's stay in touch!",
            description: "Subscribe to our newsletter to get the latest news and product updates straight to your inbox.",
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
        }
    },
    develop: {
        apiResource: {
            pageHeader: {
                description: "Create and manage the APIs used to define the API scopes/permissions that can be consumed by your applications.",
                title: "APIs"
            },
            empty: "There are no API resources available at the moment.",
            managedByChoreoText: "Managed by Choreo",
            apiResourceError: {
                subtitles: {
                    0: "Something went wrong when fetching the API resources",
                    1: "Please try again"
                },
                title: "Something went wrong"
            },
            addApiResourceButton: "New API",
            confirmations: {
                deleteAPIResource: {
                    assertionHint: "Please confirm your action.",
                    content: "This action is irreversible and will permanently delete the API resource.",
                    header: "Are you sure?",
                    message: "If you delete this API resource, some functionalities may not work properly. " +
                        "Please proceed with caution."
                },
                deleteAPIResourcePermission: {
                    assertionHint: "Please confirm your action.",
                    content: "This action is irreversible and will permanently remove the permission from the API resource.",
                    header: "Are you sure?",
                    message: "If you remove this permission from the API resource, some functionalities may not work properly. " +
                        "Please proceed with caution."
                }
            },
            managementAPI: {
                header: "Management APIs",
                description: "APIs to manage resources in your organization (root)"
            },
            notifications: {
                deleteAPIResource: {
                    unauthorizedError: {
                        description: "You are not authorized to delete the API resource.",
                        message: "Unauthorized"
                    },
                    notFoundError: {
                        description: "The API resource you are trying to delete does not exist.",
                        message: "API resource not found"
                    },
                    genericError: {
                        description: "Failed to delete the API resource.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully deleted the API resource.",
                        message: "API resource deleted"
                    }
                },
                getAPIResource: {
                    unauthorizedError: {
                        description: "You are not authorized to view the API resource.",
                        message: "Unauthorized"
                    },
                    notFoundError: {
                        description: "The API resource you are trying to view does not exist.",
                        message: "API resource not found"
                    },
                    genericError: {
                        description: "Failed to retrieve the API resource.",
                        message: "Something went wrong"
                    }
                },
                getAPIResources: {
                    unauthorizedError: {
                        description: "You are not authorized to view the API resources.",
                        message: "Unauthorized"
                    },
                    genericError: {
                        description: "Failed to retrieve the API resources.",
                        message: "Something went wrong"
                    }
                },
                updateAPIResource: {
                    invalidPayloadError: {
                        description: "The content of the paylond is not valid.",
                        message: "Invalid request payload"
                    },
                    unauthorizedError: {
                        description: "You are not authorized to update the API resource.",
                        message: "Unauthorized"
                    },
                    notFoundError: {
                        description: "The API resource you are trying to update does not exist.",
                        message: "API resource not found"
                    },
                    genericError: {
                        description: "Failed to update the API resource.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully updated the API resource.",
                        message: "API resource updated"
                    }
                },
                addAPIResource: {
                    invalidPayloadError: {
                        description: "The content of the paylond is not valid.",
                        message: "Invalid request payload"
                    },
                    unauthorizedError: {
                        description: "You are not authorized to create a API resource.",
                        message: "Unauthorized"
                    },
                    alreadyExistsError: {
                        description: "The API resource you are trying to create already exist.",
                        message: "API resource already exists"
                    },
                    permissionAlreadyExistsError: {
                        description: "This permission (scope) you are trying to add already exists in the organization. Please choose a different one.",
                        message: "Permission already exists"
                    },
                    genericError: {
                        description: "Failed to create the API resource.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully created the API resource.",
                        message: "API resource created"
                    }
                }
            },
            organizationAPI: {
                header: "Organization APIs",
                description: "APIs to manage resources in your other organizations"
            },
            table: {
                name: {
                    column: "Display name"
                },
                identifier: {
                    column: "Identifier",
                    label: "Identifier"
                },
                actions: {
                    column: "Actions"
                },
                advancedSearch: {
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "Display name or Identifier"
                            },
                            filterCondition: {
                                placeholder: "E.g. Starts with etc."
                            },
                            filterValue: {
                                placeholder: "Enter value to search"
                            }
                        }
                    },
                    placeholder: "Search by display name"
                }
            },
            tabs: {
                apiResourceError: {
                    subtitles: {
                        0: "An error occurred while retrieving the requested API resource, possibly because the resource does not exist.",
                        1: "Please try again."
                    },
                    title: "Something went wrong"
                },
                title: "Edit API Resource",
                backButton: "Go back to API Resources",
                choreoApiEditWarning: "Updating this API resource will create unforeseen errors as this is an API resource managed by Choreo. <1>Proceed with caution.</1>",
                general: {
                    dangerZoneGroup: {
                        header: "Danger Zone",
                        deleteApiResource: {
                            header: "Delete API Resource",
                            subHeading: "This action will permanently delete the API Resource. Please be certain before you proceed.",
                            button: "Delete API Resource"
                        },
                        deleteChoreoApiResource: {
                            header: "Delete API Resource",
                            subHeading: "This action will permanently delete the API Resource. Please be certain before you proceed.",
                            button: "Delete API Resource"
                        }
                    },
                    form: {
                        fields: {
                            name: {
                                emptyValidate: "Display name cannot be empty",
                                label: "Display Name",
                                placeholder: "Enter a friendly name for the API resource"
                            },
                            identifier: {
                                hint: "[Text description for identifier]",
                                label: "Identifier"
                            },
                            gwName: {
                                hint: "[Text description for gate way name]",
                                label: "Gateway Name"
                            },
                            description: {
                                label: "Description",
                                placeholder: "Enter a description for the API resource"
                            }
                        },
                        updateButton: "Update"
                    },
                    label: "General"
                },
                authorization: {
                    form: {
                        fields: {
                            authorize: {
                                label: "Requires authorization",
                                hint: "Indicates if the API resource requires authorization to obtain scopes."
                            }
                        }
                    },
                    label: "Authorization"
                },
                permissions: {
                    button: "Add Permission",
                    label: "Permissions",
                    title: "List of Permissions",
                    subTitle: "List of permissions uses by the API Resource.",
                    learnMore: "Learn More",
                    search: "Search permissions by display name",
                    empty: {
                        title: "No permission is assigned",
                        subTitle: "Click on the + icon to add a new permission"
                    },
                    emptySearch: {
                        title: "No results found",
                        subTitle: {
                            0: "We couldn't find the permission you searched for.",
                            1: "Please try using a different parameter."
                        },
                        viewAll: "Clear search query"
                    },
                    copyPopupText: "Copy the Identifier",
                    copiedPopupText: "Copied the Identifier",
                    removePermissionPopupText: "Remove the permission",
                    form: {
                        button: "Add Permission",
                        cancelButton: "Cancel",
                        submitButton: "Finish",
                        title: "Add Permission",
                        subTitle: "Create a new Permission",
                        fields: {
                            displayName: {
                                emptyValidate: "Display name cannot be empty",
                                label: "Display Name",
                                placeholder: "Read Bookings"
                            },
                            permission: {
                                emptyValidate: "Permission (scope) cannot be empty",
                                label: "Permission (scope)",
                                placeholder: "read_bookings"
                            },
                            description: {
                                label: "Description",
                                placeholder: "Enter the Description"
                            }
                        }
                    }
                }
            },
            wizard: {
                addApiResource: {
                    cancelButton: "Cancel",
                    nextButton: "Next",
                    previousButton: "Previous",
                    submitButton: "Finish",
                    title: "Add API",
                    subtitle: "Create a new API",
                    steps: {
                        basic: {
                            stepTitle: "Basic Details",
                            form: {
                                fields: {
                                    name: {
                                        emptyValidate: "Display name cannot be empty",
                                        label: "Display Name",
                                        hint: "Meaningful name to identify your API resource in {{ productName }}.",
                                        placeholder: "Bookings API"
                                    },
                                    identifier: {
                                        emptyValidate: "Identifier cannot be empty",
                                        alreadyExistsError: "Identifier already exists in the organization. Please choose a different one.",
                                        invalid: "Identifier cannot contain spaces",
                                        hint: "We recommend using a URI as the identifier, but you do not need to make the URI publicly available since {{ productName }} will not access your API. {{ productName }} will use this identifier value as the audience(aud) claim in the issued JWT tokens. <1>This field should be unique; once created, it is not editable.</1>",
                                        label: "Identifier",
                                        placeholder: "https://api.bookmyhotel.com"
                                    },
                                    description: {
                                        label: "Description",
                                        placeholder: "Enter a description for the API resource"
                                    }
                                }
                            }
                        },
                        authorization: {
                            stepTitle: "Authorization",
                            form: {
                                rbacMessage: "At present, {{ productName }} exclusively supports Role-Based Access Control (RBAC) for authorization.",
                                fields: {
                                    authorize: {
                                        label: "Requires authorization",
                                        hint: "If checked, it is mandatory to enforce an authorization policy when consuming this API in an application, else you have the option to proceed without a policy. <1>This field cannot be edited once created.</1>"
                                    }
                                }
                            }
                        },
                        permissions: {
                            emptyPlaceHolder: "No permission is assigned to the API Resource",
                            stepTitle: "Permissions",
                            form: {
                                button: "Add Permission",
                                fields: {
                                    displayName: {
                                        emptyValidate: "Display name cannot be empty",
                                        label: "Display Name",
                                        placeholder: "Read Bookings",
                                        hint: "Provide a meaningful name as it will be displayed on the user consent screen."
                                    },
                                    permission: {
                                        emptyValidate: "Permission(scope) cannot be empty",
                                        uniqueValidate: "This permission (scope) already exists in the organization. Please choose a different one.",
                                        invalid: "Permission (scope) cannot contain spaces",
                                        label: "Permission (scope)",
                                        placeholder: "read_bookings",
                                        hint: "A unique value that acts as the scope when requesting an access token. <1>Note that the permission cannot be modified once created.</1>"
                                    },
                                    permissionList: {
                                        label: "Added Permissions"
                                    },
                                    description: {
                                        label: "Description",
                                        placeholder: "Enter the Description",
                                        hint: "Provide a description for your permission. This will be displayed on the user consent screen."
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        applications: {
            asgardeoTryIt: {
                description:
                    "You can try out different login flows of Asgardeo with our Try It app."
            },
            edit: {
                sections: {
                    signInMethod: {
                        sections: {
                            authenticationFlow: {
                                sections: {
                                    stepBased: {
                                        secondFactorDisabled:
                                            "Second factor authenticators can only be used if " +
                                            "<1>Username & Password</1>, <3>Social Login</3> or " +
                                            "<5>Passkey</5> is present in a " +
                                            "previous step."
                                    }
                                }
                            }
                        }
                    },
                    apiAuthorization: {
                        title: "API Authorization",
                        sections: {
                            apiSubscriptions: {
                                heading: "Manage access to the API Resources",
                                subHeading: "Manage API resources consumed by this application.",
                                search: "Search API resources by display name",
                                unsubscribeAPIResourcePopOver: "Unsubscribe the API resource",
                                allAPIAuthorizedPopOver: "All API resources are authorized",
                                choreoApiEditWarning: "Updating the authorized scopes will create unforeseen errors as this is an API resource managed by Choreo. <1>Proceed with caution.</1>",
                                buttons: {
                                    subAPIResource: "Authorize an API Resource",
                                    noAPIResourcesLink: "Create an API Resource",
                                    emptySearchButton: "View all API resources"
                                },
                                placeHolderTexts: {
                                    emptyText: "There are no API resources authorized",
                                    noAPIResources: "There are no API resources available to subscribe",
                                    errorText: {
                                        subtitles: {
                                            0: "An error occurred while retrieving the API resources.",
                                            1: "Please try again."
                                        },
                                        title: "Something went wrong"
                                    },
                                    emptySearch: {
                                        title: "No results found",
                                        subTitle: {
                                            0: "We couldn't find the API resource you searched for.",
                                            1: "Please try using a different parameter."
                                        }
                                    }
                                },
                                notifications: {
                                    unSubscribe: {
                                        unauthorizedError: {
                                            description: "You are not authorized to unsubcribe the API resource.",
                                            message: "Unauthorized"
                                        },
                                        notFoundError: {
                                            description: "The API resource you are trying to unsubcribe does not exist.",
                                            message: "API resource not found"
                                        },
                                        genericError: {
                                            description: "Failed to unsubcribe the API resource.",
                                            message: "Something went wrong"
                                        },
                                        success: {
                                            description: "Successfully unsubcribed the API resource.",
                                            message: "API resource unsubcribed"
                                        }
                                    },
                                    patchScopes: {
                                        unauthorizedError: {
                                            description: "You are not authorized to update the API resource.",
                                            message: "Unauthorized"
                                        },
                                        genericError: {
                                            description: "Failed to update the API resource.",
                                            message: "Something went wrong"
                                        },
                                        success: {
                                            description: "Successfully updated the API resource.",
                                            message: "API resource updated"
                                        }
                                    },
                                    createAuthorizedAPIResource: {
                                        unauthorizedError: {
                                            description: "You are not authorized to authorize the API resource.",
                                            message: "Unauthorized"
                                        },
                                        initialError: {
                                            description: "Something went wrong while opening the dialog.",
                                            message: "Please try again."
                                        },
                                        genericError: {
                                            description: "Failed to authorize the API resource.",
                                            message: "Something went wrong"
                                        },
                                        success: {
                                            description: "Successfully authorized the API resource.",
                                            message: "API resource authorized"
                                        }
                                    }
                                },
                                confirmations: {
                                    unsubscribeAPIResource: {
                                        assertionHint: "Please confirm your action.",
                                        content: "This action is irreversible and will permanently unsubscribe the API resource.",
                                        header: "Are you sure?",
                                        message: "If you unsubscribe this API resource, some functionalities may not work properly. " +
                                            "Please proceed with caution."
                                    },
                                    unsubscribeChoreoAPIResource: {
                                        content: "Unsubscribing this API resource will not be reflected on the " +
                                            "Choreo end, but will impact/affect the user authorization as the " +
                                            "authorized scopes will no longer be accessible. " +
                                            "<1>Proceed with caution.</1>"
                                    }
                                },
                                scopesSection: {
                                    label: "Authorized Scopes",
                                    placeholder: "No scopes are authorized for this API resource.",
                                    hint: "The scopes of the API resource that the application is allowed to access.",
                                    updateButton: "Update",
                                    copyScopesHint: "Request these scopes in addition to the OIDC scopes of this application.",
                                    selectAll: "Select All",
                                    selectNone: "Select None"
                                },
                                wizards: {
                                    authorizeAPIResource: {
                                        title: "Authorize an API Resource",
                                        subTitle: "Authorize a new API resource to the application.",
                                        fields: {
                                            apiResource: {
                                                label: "API Resource",
                                                placeholder: "Enter the display name of the API resource",
                                                requiredErrorMessage: "API resource is required"
                                            },
                                            scopes: {
                                                label: "Authorized Scopes",
                                                placeholder: "No scopes are authorized for this API resource",
                                                hint: "The scopes of the API resource that the application is allowed to access."
                                            },
                                            policy: {
                                                label: "Authorization Policy",
                                                hint: "Select the policy to authorize the API for the application."
                                            }
                                        },
                                        rbacPolicyMessage: "This API resource requires authorization and {{ productName }} exclusively supports Role-Based Access Control (RBAC) for authorization.",
                                        buttons: {
                                            finish: "Finish",
                                            cancel: "Cancel"
                                        }
                                    }
                                }
                            },
                            policySection: {
                                heading: "Policy Settings",
                                subHeading: "Protect and govern your API resources with dynamic authorization policies.",
                                buttons: {
                                    update: "Update"
                                },
                                messages: {
                                    noPolicy: "You have not selected any policies to handle the scopes of your subscribed APIs. Please select policies to manage API scopes for security and proper functionality of your application.",
                                    noClientCredentials: "Please <1>enable client credential grant</1> for your application before applying the application-based policy for secure access to your subscribed APIs."
                                },
                                form: {
                                    fields: {
                                        userPolicy: {
                                            label: "Enable User Based Policies"
                                        },
                                        rbac: {
                                            label: "Enable Role Based Access Control (RBAC)",
                                            name: "Role Based Access Control (RBAC)",
                                            hint: "RBAC authorization policies will be enforced for this API resource. Permission to role and role to group mappings will be evaluated during the authorize call."
                                        },
                                        consent: {
                                            label: "Enable Consent Based Access Policy",
                                            hint: "When enabled, consent based authorization policy will be enforced for this application. During the login transaction, scope assignment will be evaluated to determine the access privileges of the application."
                                        },
                                        appPolicy: {
                                            label: "Enable Application Based Policy (M2M)",
                                            hint: "When enabled, Machine-to-Machine (M2M) authorization policy will be enforced for this application."
                                        },
                                        noPolicy: {
                                            name: "No Authorization Policy",
                                            hint: "Authorization is not required for this API resource, but the user’s consent will be required if prompted."
                                        }
                                    }
                                },
                                notifications: {
                                    getPolicies: {
                                        genericError: {
                                            description: "Failed to fetch the policies.",
                                            message: "Something went wrong"
                                        }
                                    },
                                    patchPolicies: {
                                        unauthorizedError: {
                                            description: "You are not authorized to update the policies.",
                                            message: "Unauthorized"
                                        },
                                        genericError: {
                                            description: "Failed to update the policies.",
                                            message: "Something went wrong"
                                        },
                                        success: {
                                            description: "Successfully updated the policies.",
                                            message: "Policies updated"
                                        }
                                    }
                                }
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
                                    roleName: {
                                        hint: "A name for the role.",
                                        label: "Role Name",
                                        placeholder: "Enter role name",
                                        validations: {
                                            duplicate: "A role already exists with the given role name.",
                                            empty: "Role name is required to proceed.",
                                            invalid: "A role name can only contain alphanumeric characters, -, and _. "
                                                + "And must be of length between 3 to 30 characters."
                                        }
                                    }
                                },
                                rolePermissions: {
                                    label: "Role Permissions",
                                    searchPlaceholer: "Search by API name and permission name"
                                }
                            },
                            heading: "Create Role",
                            subHeading: "Create a new role in your application.",
                            wizardSteps: {
                                0: "Basic Details",
                                1: "Permission Selection"
                            }
                        },
                        title: "Roles",
                        heading: "Roles",
                        subHeading: "Manage application level roles in your application.",
                        subHeadingAlt: "View application level roles in your application.",
                        buttons: {
                            newRole: "New Role"
                        },
                        labels: {
                            apiResource: "API Resource",
                            selectAllPermissions: "Select all permissions"
                        },
                        advancedSearch: {
                            form: {
                                inputs: {
                                    filterValue: {
                                        placeholder: "Enter value to search"
                                    }
                                }
                            },
                            placeholder: "Search by role name"
                        },
                        list: {
                            columns: {
                                actions: "",
                                name: "Name"
                            }
                        },
                        editModal: {
                            heading: "Manage Permissions",
                            readonlyHeading: "View Permissions",
                            readonlySubHeading: "View permissions related to the role. Allowed permissions will be seen as checked.",
                            subHeading: "Select the permissions related to the role.",
                            searchPlaceholer: "Search by API name and permission name"
                        },
                        deleteRole: {
                            confirmationModal: {
                                assertionHint: "Please confirm your action.",
                                content: "If you delete this application role, the users associated with above application role" +
                                    " will no longer have the assigned permissions. Please proceed with caution.",
                                header: "Are you sure?",
                                message: "This action is irreversible and will permanently delete the application role."
                            }
                        },
                        placeHolders: {
                            emptyList: {
                                action: "New Role",
                                subtitles: {
                                    0: "There are currently no roles available."
                                },
                                title: "No Roles Available"
                            },
                            emptySearchResults: {
                                action: "Clear search query",
                                subtitles: {
                                    0: "We couldn't find any results for '{{ searchQuery }}'",
                                    1: "Please try a different search term."
                                },
                                title: "No results found"
                            },
                            emptyPermissions: {
                                subtitles: {
                                    0: "There are no authorized permissions available for your application."
                                }
                            }
                        },
                        notifications: {
                            createApplicationRole: {
                                error: {
                                    description: "{{description}}",
                                    message: "Error occurred while creating the application role"
                                },
                                genericError: {
                                    description: "Error occurred while creating the application role.",
                                    message: "Something went wrong"
                                },
                                success: {
                                    description: "Successfully created the application role.",
                                    message: "Create successful"
                                }
                            },
                            updatePermissions: {
                                error: {
                                    description: "{{description}}",
                                    message: "Error occurred while updating the role permissions"
                                },
                                genericError: {
                                    description: "Error occurred while updating the role permissions.",
                                    message: "Something went wrong"
                                },
                                success: {
                                    description: "Updated role permissions successfully.",
                                    message: "Update successful"
                                }
                            },
                            deleteApplicationRole: {
                                error: {
                                    description: "{{description}}",
                                    message: "Error occurred while delete the application role"
                                },
                                genericError: {
                                    description: "Error occurred while deleting the application role.",
                                    message: "Something went wrong"
                                },
                                success: {
                                    description: "Successfully deleted the application role.",
                                    message: "Delete successful"
                                }
                            },
                            fetchApplicationRoles: {
                                error: {
                                    description: "{{description}}",
                                    message: "Error occurred while fetching the application roles"
                                },
                                genericError: {
                                    description: "Error occurred while fetching the application roles.",
                                    message: "Something went wrong"
                                }
                            },
                            fetchAuthorizedAPIs: {
                                error: {
                                    description: "{{description}}",
                                    message: "Error occurred while fetching the Authorized APIs"
                                },
                                genericError: {
                                    description: "Error occurred while fetching the Authorized APIs.",
                                    message: "Something went wrong"
                                }
                            }
                        }
                    },
                    rolesV2: {
                        heading: "Roles",
                        subHeading: "Manage assigned roles in the application.",
                        roleAudience: "Role Audience",
                        organization: "Organization",
                        application: "Application",
                        assignedRoles: "Assigned Roles",
                        removedRoles: "Removed Roles",
                        searchPlaceholder: "Search by Role name",
                        switchRoleAudience: {
                            applicationConfirmationModal: {
                                assertionHint: "Please confirm your action.",
                                content: "If you change the Role Audience to Application, the association with " +
                                    "organization roles will be deleted from the application. Please proceed with caution.",
                                header: "Switch role audience to Application?",
                                message: "This action is irreversible and will remove the existing role associations."
                            },
                            organizationConfirmationModal: {
                                assertionHint: "Please confirm your action.",
                                content: "If you change the Role Audience to Organization, the application roles currently " +
                                    "associated with the application will be permanently deleted. Please proceed with caution.",
                                header: "Switch role audience to Organization?",
                                message: "This action is irreversible and will permanently delete the existing roles."
                            }
                        }
                    }
                }
            },
            quickstart: {
                mobileApp: {
                    configurations: {
                        anyTechnology: "or any mobile application technology",
                        heading: "Follow <1>this guide</1> to learn the OIDC Authorization Code Flow with PKCE and use below details to " +
                            "configure any third-party OIDC SDK for mobile applications.",
                        discoveryURI: {
                            label: "Discovery URI",
                            info: "This endpoint is called by applications to dynamically discover the OpenID Connect identity provider metadata."
                        },
                        generalDescription: "Use the following configurations to integrate your mobile application with Asgardeo.",
                        moreInfoDescription: "Use additional details on server endpoints in the <1>Info</1> tab to build your application.",
                        protocolDescription: "For more details on configurations, go to the <1>Protocol</1> tab.",
                        redirectURI: {
                            label: "Redirect URI"
                        },
                        scope: {
                            label: "Scope"
                        }
                    },
                    tabHeading: "Guide",
                    technologyInfo: "You can integrate this application with any third party OIDC mobile SDK of your choice. <1>Learn More</1>"
                },
                spa: {
                    common: {
                        addTestUser: {
                            title: "Try Out!"
                        },
                        prerequisites: {
                            angular:
                                "<0>Note: </0>The SDK currently doesn't support Angular 11 applications " +
                                "in the <2>Strict Mode</2>. We are working on making the SDK compatible.",
                            node:
                                "You will need to have <1>Node.js</1> and <3>npm</3> installed on your " +
                                "environment to try out the SDK. To download the Long Term Support (LTS) version " +
                                "of <5>Node.js</5> (which includes <7>npm</7>), navigate to the official " +
                                "<9>downloads</9> page."
                        }
                    },
                    integrate: {
                        common: {
                            sdkConfigs: {
                                clientId: {
                                    hint: "The OAuth 2.0 Client Identifier valid at the authorization server."
                                },
                                scope: {
                                    hint:
                                        "These are the set of scopes that are used to request " +
                                        "user attributes.<1></1>" +
                                        "If you need to add more scopes other than <3>openid</3> & <5>profile</5>" +
                                        ", you can append them to the array.<7></7>" +
                                        "Read through our <9>documentation</9> to learn  more."
                                },
                                serverOrigin: {
                                    hint: "The origin of the Identity Provider."
                                },
                                signInRedirectURL: {
                                    hint: {
                                        content:
                                            "The URL that determines where the authorization code is sent to " +
                                            "upon user authentication.<1></1>" +
                                            "If your application is hosted on a different URL, go to the " +
                                            "<3>protocol</3> tab and configure the correct URL from the " +
                                            "<5>Authorized redirect URLs</5> field.",
                                        multipleWarning:
                                            "You have configured multiple valid callback URLs for " +
                                            "your application. Please verify that the correct URL is selected."
                                    }
                                },
                                signOutRedirectURL: {
                                    hint: {
                                        content:
                                            "The URL that determines where the user is redirected to upon " +
                                            "logout.<1></1>" +
                                            "If your application is hosted on a different URL, go to the " +
                                            "<3>protocol</3> tab and configure the correct URL from the " +
                                            "<5>Authorized redirect URLs</5> field.",
                                        multipleWarning:
                                            "You have configured multiple valid callback URLs for " +
                                            "your application. Please verify that the correct URL is selected."
                                    }
                                }
                            }
                        }
                    },
                    samples: {
                        exploreMoreSamples: "Explore more samples."
                    }
                },
                twa: {
                    setup: {
                        skipURIs:
                            "Note the <1>skipURIs</1> property. This property defines the web pages in your " +
                            "application that should not be secured, and do not require authentication. Multiple " +
                            "URIs can be set using <3>comma separated</3> values."
                    }
                }
            }
        },
        branding: {
            confirmations: {
                revertBranding: {
                    assertionHint: "Please confirm your action.",
                    content: "This action is irreversible and will permanently revert your branding preferences.",
                    header: "Are you sure?",
                    message:
                        "If you revert the branding preferences, your users will start to see " +
                        "{{ productName }} branding on the login flows. Please proceed with caution."
                },
                unpublishBranding: {
                    assertionHint: "Please confirm your action.",
                    enableContent: "Once these preferences are published, they are applied to the user registration flows and all login flows (including multi-factor login) of your apps, My Account portal and email templates.",
                    disableContent: "Once these preferences are unpublished, they are no longer applied to the user registration flows and all login flows (including multi-factor login) of your apps, My Account portal and email templates.",
                    header: "Are you sure?",
                    enableMessage:
                        "If you publish the branding preferences, your users will start to see " +
                        "your branding on the login flows. Please confirm.",
                    disableMessage:
                        "If you unpublish the branding preferences, your users will start to see " +
                        "{{ productName }} branding on the login flows. Please confirm."
                }
            },
            dangerZoneGroup: {
                header: "Danger Zone",
                revertBranding: {
                    actionTitle: "Revert",
                    header: "Revert to default",
                    subheader: "Once the branding preferences are reverted, they can't be recovered and your " +
                        "users will see {{ productName }}'s default branding."
                },
                unpublishBranding: {
                    actionTitle: "Unpublish",
                    header: "Unpublish branding preferences",
                    subheader: "You can temporarily switch to {{ productName }}'s default branding by unpublishing. You can always switch back by saving your branding preferences again."
                }
            },
            forms: {
                advance: {
                    links: {
                        fields: {
                            common: {
                                validations: {
                                    invalid: "Please enter a valid URL"
                                }
                            },
                            cookiePolicyURL: {
                                hint: "Link to a document or a webpage with detailed information on all cookies used by your applications and the purpose of each of them. You can use placeholders like <1>{{lang}}</1>, <3>{{country}}</3>, or <5>{{locale}}</5> to customize the URL for different regions or languages.",
                                label: "Cookie Policy",
                                placeholder: "https://myapp.com/{{locale}}/cookie-policy"
                            },
                            privacyPolicyURL: {
                                hint: "Link to a statement or a legal document that states how your organization collects, handles, and processes the data of your customers and visitors. You can use placeholders like <1>{{lang}}</1>, <3>{{country}}</3>, or <5>{{locale}}</5> to customize the URL for different regions or languages.",
                                label: "Privacy Policy",
                                placeholder: "https://myapp.com/{{locale}}/privacy-policy"
                            },
                            selfSignUpURL: {
                                hint: "Link to your organization's Self Signup webpage. You can use placeholders like <1>{{lang}}</1>, <3>{{country}}</3>, or <5>{{locale}}</5> to customize the URL for different regions or languages.",
                                label: "Self Signup",
                                placeholder: "https://myapp.com/self-signup"
                            },
                            termsOfUseURL: {
                                hint: "Link to an agreement that your customers must agree to and abide by in order to use your organization's applications or other services. You can use placeholders like <1>{{lang}}</1>, <3>{{country}}</3>, or <5>{{locale}}</5> to customize the URL for different regions or languages.",
                                label: "Terms of Service",
                                placeholder: "https://myapp.com/{{locale}}/terms-of-service"
                            }
                        },
                        heading: "Links"
                    }
                },
                design: {
                    layout: {
                        headings: {
                            fields: {
                                productTagline: {
                                    hint: "Add a tagline for your product."
                                        + "This will be displayed below your product logo.",
                                    label: "Product Tagline Text",
                                    placeholder: "Enter a text for the tagline"
                                }
                            },
                            heading: "Product Tagline"
                        },
                        images: {
                            logo: {
                                fields: {
                                    alt: {
                                        hint: "Add an alternative text to represent the image. It will be displayed"
                                            + " when the image does not load.",
                                        label: "Side Image Alt Text",
                                        placeholder: "Enter alt text for side image"
                                    },
                                    url: {
                                        hint: "Use an image that’s at least <1>1920x1080 pixels</1> and less than"
                                            + " <3>1 mb</3> in size for better performance.",
                                        label: "Side Image URL",
                                        placeholder: "https://myapp.com/placeholder.jpeg"
                                    }
                                },
                                heading: "Side Image",
                                preview: "Preview"
                            }
                        },
                        variations: {
                            fields: {
                                centered: {
                                    imgAlt: "Centered layout",
                                    label: "Centered"
                                },
                                "custom": {
                                    imgAlt: "Custom layout",
                                    label: "Custom"
                                },
                                "left-aligned": {
                                    imgAlt: "Left aligned layout",
                                    label: "Left Aligned"
                                },
                                "left-image": {
                                    imgAlt: "Left image layout",
                                    label: "Left Image"
                                },
                                "right-aligned": {
                                    imgAlt: "Right aligned layout",
                                    label: "Right Aligned"
                                },
                                "right-image": {
                                    imgAlt: "Right image layout",
                                    label: "Right Image"
                                }
                            }
                        }
                    },
                    theme: {
                        buttons: {
                            externalConnections: {
                                fields: {
                                    backgroundColor: {
                                        hint: "The background color of buttons for external connections such as " +
                                            "social logins, third-party IdPs, etc.",
                                        label: "Background Color",
                                        placeholder: "Select a background color for external connections buttons."
                                    },
                                    borderRadius: {
                                        hint: "The border radius of buttons for external connections.",
                                        label: "Border Radius",
                                        placeholder: "Select a border radius for external connections button."
                                    },
                                    fontColor: {
                                        hint: "The font color of buttons for external connections.",
                                        label: "Font Color",
                                        placeholder: "Select a font color for external connections button."
                                    }
                                },
                                heading: "External Connection Button"
                            },
                            heading: "Buttons",
                            primary: {
                                fields: {
                                    borderRadius: {
                                        hint: "The border radius of primary buttons.",
                                        label: "Border Radius",
                                        placeholder: "Select a primary button border radius."
                                    },
                                    fontColor: {
                                        hint: "The font color of the primary buttons.",
                                        label: "Font Color",
                                        placeholder: "Select a primary button font color."
                                    }
                                },
                                heading: "Primary Button"
                            },
                            secondary: {
                                fields: {
                                    borderRadius: {
                                        hint: "The border radius of secondary buttons.",
                                        label: "Border Radius",
                                        placeholder: "Select a secondary button border radius."
                                    },
                                    fontColor: {
                                        hint: "The font color of secondary buttons.",
                                        label: "Font Color",
                                        placeholder: "Select a secondary button font color."
                                    }
                                },
                                heading: "Secondary Button"
                            }
                        },
                        colors: {
                            alerts: {
                                fields: {
                                    error: {
                                        hint: "Choose a background color that catches the user's attention and represents error alerts, such as system failures or critical errors.",
                                        label: "Error Alert Background Color",
                                        placeholder: "Select a error alert background color"
                                    },
                                    info: {
                                        hint: "Choose a background color that complements the color scheme and represents informative alerts, such as tips or additional information.",
                                        label: "Info Alert Background Color",
                                        placeholder: "Select a info alert background color"
                                    },
                                    neutral: {
                                        hint: "Choose a background color that complements the color scheme and represents neutral alerts, such as non-critical information or feedback.",
                                        label: "Neutral Alert Background Color",
                                        placeholder: "Select a neutral alert background color"
                                    },
                                    warning: {
                                        hint: "Choose a background color that stands out and represents warning alerts, such as potential risks or important notifications.",
                                        label: "Warning Alert Background Color",
                                        placeholder: "Select a warning alert background color"
                                    }
                                },
                                heading: "Alerts"
                            },
                            bodyBackground: {
                                fields: {
                                    main: {
                                        hint: "The main background color that is used in the body element of the user interface.",
                                        label: "Main Background Color",
                                        placeholder: "Select a main body background color"
                                    }
                                },
                                heading: "Body Background"
                            },
                            fields: {
                                primaryColor: {
                                    hint: "The main color that is shown in primary action buttons, hyperlinks, etc.",
                                    label: "Primary Color",
                                    placeholder: "Select a primary color."
                                },
                                secondaryColor: {
                                    hint: "The color that is shown in secondary action buttons like cancel buttons, etc.",
                                    label: "Secondary Color",
                                    placeholder: "Select a secondary color."
                                }
                            },
                            heading: "Color Palette",
                            illustrations: {
                                fields: {
                                    accentColor1: {
                                        hint: "This is the primary accent color used for the SVG illustrations. Choose a color that will draw attention to specific elements of your illustration and highlight key features of your user interface design.",
                                        label: "Accent Color 1",
                                        placeholder: "Select a illustration accent color"
                                    },
                                    accentColor2: {
                                        hint: "This is the secondary accent color used for the SVG illustrations. Choose an alternate accent color that harmonizes with your design aesthetic and enhances the overall visual appeal of your SVG illustration.",
                                        label: "Accent Color 2",
                                        placeholder: "Select a illustration secondary accent color"
                                    },
                                    accentColor3: {
                                        hint: "This is the tertiary accent color used for the SVG illustrations. Choose an accent color that harmonizes with your design aesthetic and enhances the overall visual appeal of your SVG illustration.",
                                        label: "Accent Color 3",
                                        placeholder: "Select a illustration tertiary accent color"
                                    },
                                    primaryColor: {
                                        hint: "This is the primary color used for the SVG illustrations. Select a color that fits your overall design aesthetic and complements your user interface color scheme.",
                                        label: "Primary Color",
                                        placeholder: "Select a illustration primary color"
                                    },
                                    secondaryColor: {
                                        hint: "This is the secondary color used for the SVG illustrations. Select a color that fits your overall design aesthetic and complements your user interface color scheme.",
                                        label: "Secondary Color",
                                        placeholder: "Select a illustration secondary color"
                                    }
                                },
                                heading: "Illustrations",
                                preview: "Preview"
                            },
                            outlines: {
                                fields: {
                                    main: {
                                        hint: "The default outline color used for elements like Cards, Tooltips, Dropdowns, etc.",
                                        label: "Default Outline Color",
                                        placeholder: "Select a default outline color"
                                    }
                                },
                                heading: "Outlines"
                            },
                            surfaceBackground: {
                                fields: {
                                    dark: {
                                        hint: "The darker variation of the background color that is used surface elements such as the application header in My Account.",
                                        label: "Dark Surface Background Color",
                                        placeholder: "Select a dark surface background color"
                                    },
                                    inverted: {
                                        hint: "The inverted variation of the background color that is used surface elements such as the application header in My Account.",
                                        label: "Inverted Surface Background Color",
                                        placeholder: "Select a inverted surface background color"
                                    },
                                    light: {
                                        hint: "The lighter variation of the background color that is used surface elements like Cards, Popups, Panels etc.",
                                        label: "Light Surface Background Color",
                                        placeholder: "Select a light surface background color"
                                    },
                                    main: {
                                        hint: "The main background color that is used surface elements like Cards, Popups, Panels etc.",
                                        label: "Main Surface Background Color",
                                        placeholder: "Select a main surface background color"
                                    }
                                },
                                heading: "Surface Background"
                            },
                            text: {
                                fields: {
                                    primary: {
                                        hint: "The primary text color used in the user interface. Select a color that provides good contrast against the background color and is easy to read.",
                                        label: "Primary Text Color",
                                        placeholder: "Select a primary text color"
                                    },
                                    secondary: {
                                        hint: "The secondary text color used in the user interface. Select a color that complements the primary color and enhances the visual hierarchy of your design.",
                                        label: "Secondary Text Color",
                                        placeholder: "Select a secondary text color"
                                    }
                                },
                                heading: "Text Colors"
                            }
                        },
                        font: {
                            fields: {
                                fontFamilyDropdown: {
                                    hint: "Pick a web safe font (fonts that are pre-installed by many " +
                                        "operating systems) as the font family for the pages.",
                                    label: "Font Family",
                                    placeholder: "Select a font family."
                                },
                                fontFamilyInput: {
                                    hint: "Enter the font family of the custom font you selected above. This is " +
                                        "usually documented in the font service where you extracted the import URL.",
                                    label: "Font Family",
                                    placeholder: "E.g. Poppins"
                                },
                                importURL: {
                                    hint: "Enter a URL to import a custom font from a font service.",
                                    label: "Font Import URL",
                                    placeholder: "E.g., https://fonts.googleapis.com/css2?family=Poppins"
                                }
                            },
                            heading: "Font",
                            types: {
                                fromCDN: "Import a font",
                                fromDefaults: "Use a web-safe font"
                            }
                        },
                        footer: {
                            fields: {
                                borderColor: {
                                    hint: "The top border color of the page footer.",
                                    label: "Border Color",
                                    placeholder: "Select a footer border color"
                                },
                                fontColor: {
                                    hint: "The font color of the copyright text and other links in the footer. " +
                                        "If not set, primary font color from the color palette will be used.",
                                    label: "Font Color",
                                    placeholder: "Select a footer font color"
                                }
                            },
                            heading: "Footer"
                        },
                        headings: {
                            fields: {
                                fontColor: {
                                    hint: "The font color of the headings (h1, h2, h3, etc.) that appear on " +
                                        "the pages. If not set, primary font color from the color palette will be used.",
                                    label: "Font Color",
                                    placeholder: "Select a heading font color."
                                }
                            },
                            heading: "Headings"
                        },
                        images: {
                            favicon: {
                                fields: {
                                    url: {
                                        hint: "Use an image with a square aspect ratio that’s at least <1>16x16 " +
                                            "pixels</1> in size for better results. If not set, {{ productName }} " +
                                            "defaults are used.",
                                        label: "Favicon URL",
                                        placeholder: "https://myapp.com/favicon.ico"
                                    }
                                },
                                heading: "Favicon",
                                preview: "Preview"
                            },
                            heading: "Images",
                            logo: {
                                fields: {
                                    alt: {
                                        hint:
                                            "Add a short description of the logo image to display when the image " +
                                            "does not load and also for SEO and accessibility. If not set, " +
                                            "{{ productName }} defaults are used.",
                                        label: "Logo Alt Text",
                                        placeholder: "Enter an alt text for logo."
                                    },
                                    url: {
                                        hint:
                                            "Use an image that’s at least <1>600x600 pixels</1> and less than " +
                                            "<3>1mb</3> in size for better performance. If not set, " +
                                            "{{ productName }} defaults are used.",
                                        label: "Logo URL",
                                        placeholder: "https://myapp.com/logo.png"
                                    }
                                },
                                heading: "Logo",
                                preview: "Preview"
                            },
                            myAccountLogo: {
                                fields: {
                                    alt: {
                                        hint: "Add a short description of the My Account logo image to display when the image does not load and also for SEO and accessibility. If not set, {{ productName }} defaults are used.",
                                        label: "My Account Logo Alt Text",
                                        placeholder: "Enter an alt text for My Account logo."
                                    },
                                    title: {
                                        hint: "Add a title to be shown beside the logo image if necessary. If not set, {{ productName }} defaults are used.",
                                        label: "My Account Logo Title",
                                        placeholder: "Enter a title for My Account logo."
                                    },
                                    url: {
                                        hint: "Use an image that’s at least <1>250x50 pixels</1> and less than <3>1mb</3> in size for better performance. If not set, {{ productName }} defaults are used.",
                                        label: "My Account Logo URL",
                                        placeholder: "https://myaccount.myapp.com/logo.png"
                                    }
                                },
                                heading: "My Account Logo",
                                preview: "Preview"
                            }
                        },
                        inputs: {
                            fields: {
                                backgroundColor: {
                                    hint: "The background color of the inputs such as text inputs, checkboxes, etc.",
                                    label: "Background Color",
                                    placeholder: "Select a background color for the inputs."
                                },
                                borderColor: {
                                    hint: "The border color of the text inputs, checkboxes, etc.",
                                    label: "Border Color",
                                    placeholder: "Select a border color for the inputs."
                                },
                                borderRadius: {
                                    hint: "The border radius of the text inputs.",
                                    label: "Border Radius",
                                    placeholder: "Select a border radius for the inputs."
                                },
                                fontColor: {
                                    hint: "The font color of the characters inside the text input fields, check" +
                                        "symbol of checkboxes, etc. If not set, primary font color from the color palette will be used..",
                                    label: "Font Color",
                                    placeholder: "Select a font color for the inputs."
                                }
                            },
                            heading: "Inputs",
                            labels: {
                                fields: {
                                    fontColor: {
                                        hint: "The font color of the labels of text inputs, checkboxes, etc. "
                                            + "If not set, primary font color from the color palette will be used.",
                                        label: "Font Color",
                                        placeholder: "Select a font color for the input labels."
                                    }
                                },
                                heading: "Input Labels"
                            }
                        },
                        loginBox: {
                            fields: {
                                backgroundColor: {
                                    hint: "The background color of the login box.",
                                    label: "Background Color",
                                    placeholder: "Select a background color of the login box."
                                },
                                borderColor: {
                                    hint: "The border color of the login box.",
                                    label: "Border Color",
                                    placeholder: "Select a border color for the login box."
                                },
                                borderRadius: {
                                    hint: "The border radius of the login box.",
                                    label: "Border Radius",
                                    placeholder: "Select a border radius for the login box."
                                },
                                borderWidth: {
                                    hint: "The border width of the login box.",
                                    label: "Border Width",
                                    placeholder: "Select a border width of the login box."
                                },
                                fontColor: {
                                    hint: "The font color of the text, labels, etc. that's inside the login box. "
                                        + "If not set, font color from the parent element will be used.",
                                    label: "Font Color",
                                    placeholder: "Select a font color for the login box text."
                                }
                            },
                            heading: "Login Box"
                        },
                        loginPage: {
                            fields: {
                                backgroundColor: {
                                    hint: "The background color of the login pages. If not set, body background color "
                                        + "from the color palette will be used.",
                                    label: "Background Color",
                                    placeholder: "Select a login page background color"
                                },
                                fontColor: {
                                    hint: "The font color for the text on login pages. This doesn't change the colors " +
                                        "of the hyperlinks and button text. More fine grained control on the " +
                                        "specific elements like headings, inputs, footer text, etc. can be " +
                                        "configured in the below sections.",
                                    label: "Font Color",
                                    placeholder: "Select a login page font color"
                                }
                            },
                            heading: "Login Page"
                        },
                        variations: {
                            fields: {
                                dark: {
                                    label: "Dark"
                                },
                                light: {
                                    label: "Light"
                                }
                            }
                        }
                    }
                },
                general: {
                    fields: {
                        displayName: {
                            hint: "Organization name that appears to users. If not set, {{ productName }} defaults " +
                                "are used.",
                            label: "Organization Display Name",
                            placeholder: "Enter a display name"
                        },
                        supportEmail: {
                            hint: "The email address that appears on error pages and other pages where " +
                                "users would require support. If not set, {{ productName }} defaults are used.",
                            label: "Contact Email",
                            placeholder: "Enter a contact email"
                        }
                    }
                }
            },
            notifications: {
                delete: {
                    genericError: {
                        description: "An error occurred while reverting the Branding preferences for {{ tenant }}.",
                        message: "Couldn't revert branding preferences"
                    },
                    invalidStatus: {
                        description: "Something went wrong while reverting branding preferences for {{ tenant }}.",
                        message: "Couldn't revert branding preferences"
                    },
                    notConfigured: {
                        description: "No Branding preferences found for {{ tenant }}.",
                        message: "Nothing to revert"
                    },
                    success: {
                        description: "Successfully reverted Branding preferences for {{ tenant }}.",
                        message: "Revert successful"
                    },
                    successWaiting: {
                        description: "Reverting Branding preferences for {{ tenant }}. " +
                            "It may take a while for the changes to be reflected.",
                        message: "Reverting branding preferences"
                    },
                    successWaitingAlert: {
                        description: "Reverting Branding preferences for {{ tenant }}. " +
                            "Note that it can take up to 10 minutes for the changes to be reflected.",
                        message: "Reverting branding preferences"
                    }
                },
                fetch: {
                    customLayoutNotFound: {
                        description: "There is no deployed custom layout for {{ tenant }}.",
                        message: "Couldn't activate the custom layout"
                    },
                    genericError: {
                        description: "An error occurred while getting the Branding preferences for {{ tenant }}.",
                        message: "Couldn't get branding preferences"
                    },
                    invalidStatus: {
                        description: "Something went wrong while getting branding preferences for {{ tenant }}.",
                        message: "Couldn't get branding preferences"
                    },
                    tenantMismatch: {
                        description: "Something went wrong while getting branding preferences for {{ tenant }}.",
                        message: "Couldn't get branding preferences"
                    }
                },
                update: {
                    genericError: {
                        description: "An error occurred while updating the Branding preferences for {{ tenant }}.",
                        message: "Update Error"
                    },
                    invalidStatus: {
                        description: "Something went wrong while updating branding preferences for {{ tenant }}.",
                        message: "Update Error"
                    },
                    success: {
                        description: "Branding preference updated successfully for {{ tenant }}.",
                        message: "Update Successful"
                    },
                    successWaiting: {
                        description: "Updating Branding preferences for {{ tenant }}. " +
                            "It may take a while for the changes to be reflected.",
                        message: "Updating branding preferences"
                    },
                    successWaitingAlert: {
                        description: "Updating Branding preferences for {{ tenant }}. " +
                            "Note that it can take up to 10 minutes for the changes to be reflected.",
                        message: "Updating branding preferences"
                    },
                    tenantMismatch: {
                        description: "Something went wrong while updating branding preferences for {{ tenant }}.",
                        message: "Update Error"
                    }
                }
            },
            pageHeader: {
                description: "Customize consumer-facing user interfaces of applications in your organization.",
                title: "Branding"
            },
            publishToggle: {
                hint: "Branding preference is in the unpublished state. Your changes will not be reflected until you save & publish your prefrences again.",
                label: "Publish",
                enabled: "Enabled",
                disabled: "Disabled"
            },
            tabs: {
                advance: {
                    label: "Advanced"
                },
                design: {
                    label: "Design",
                    sections: {
                        imagePreferences: {
                            description: "Add custom images to match your organization’s theme.",
                            heading: "Image Preferences"
                        },
                        layoutVariation: {
                            description: "Select a layout for your login screens. "
                                + "You can further customize these layouts by updating the theme preferences.",
                            heading: "Login Layout",
                            status: "NEW"
                        },
                        themePreferences: {
                            description: "Based on the above selected theme variation, start customizing the "
                                + "following elements to match your organization's guidelines.",
                            heading: "Theme Preferences"
                        },
                        themeVariation: {
                            description: "Select a color theme for your interfaces. You can further customize " +
                                "these themes using the options given below. By default, the light theme " +
                                "({{ productName }} theme) is selected.",
                            heading: "Theme"
                        }
                    }
                },
                general: {
                    customRequest: {
                        description:
                            "If you require further customizations, please reach to us at " +
                            "<1>{{ supportEmail }}</>",
                        heading: "Need more customizations?"
                    },
                    label: "General"
                },
                preview: {
                    disclaimer:
                        "Once these preferences are published, they are applied to the user registration flows " +
                        "and all login flows (including multi-factor login) of your apps, My Account portal and email templates.",
                    errors: {
                        layout: {
                            notFound: {
                                subTitle: "The resource you are looking for is not available.",
                                title: "Resource Not Found"
                            },
                            notFoundWithSupport: {
                                description: "Need a fully customized layout for your organization? "
                                    + "Reach us out at <1>{{ supportEmail }}</1>",
                                subTitle: "You have not yet deployed a custom layout.",
                                title: "Custom Layout Not Found"
                            }
                        }
                    },
                    info: {
                        layout: {
                            activatedMessage: {
                                description: "You can now incorporate a custom layout for login, "
                                    + "registration, and recovery pages. Refer to our "
                                    + "documentation for detailed instructions.",
                                subTitle: "The custom layout has been successfully enabled.",
                                title: "Custom Layout"
                            }
                        }
                    },
                    label: "Preview"
                }
            }
        },
        emailProviders: {
            configureEmailTemplates: "Configure Email Templates",
            heading: "Email Provider",
            subHeading: "Configure a SMTP server to send emails to your users with your own email address.",
            description: "Configure the email provider settings according to your SMTP server.",
            note: "Email provider for the super organization can only be configured through <1>deployment.toml</1>",
            info: "You can customize the email content using <1>Email Templates</1>.",
            updateButton: "Update",
            sendTestMailButton: "Send Test Email",
            goBack: "Go back to Email & SMS",
            confirmationModal: {
                assertionHint: "Please confirm your action.",
                content: "If you delete this configuration, the emails will be sent from the Asgardeo Email Address. " +
                    "Please proceed with caution.",
                header: "Are you sure?",
                message: "This action is irreversible and will permanently delete the email provider configurations."
            },
            dangerZoneGroup: {
                header: "Danger Zone",
                revertConfig: {
                    heading: "Revert Configurations",
                    subHeading: "This action will revert mail server configurations to default configurations. " +
                        "Once reverted, you will receive emails from the Asgardeo domain.",
                    actionTitle: "Revert"
                }
            },
            form: {
                smtpServerHost: {
                    label: "Server Host",
                    placeholder: "Enter a server host",
                    hint: "The Server Host usually begins with <1>smtp</1>, followed by the domain name of the email service provider."
                },
                smtpPort: {
                    label: "Server Port",
                    placeholder: "Enter a port number",
                    hint: "For security reasons, we currently support port <1>587</1> only."
                },
                fromAddress: {
                    label: "From Address",
                    placeholder: "Enter an email address",
                    hint: "The From Address is the email address you want to appear as the sender of your " +
                        "outgoing emails. This should be an email address that you have access."
                },
                replyToAddress: {
                    label: "Reply-To Address",
                    placeholder: "Enter an email address",
                    hint: "The Reply-To Address is used to specify the email address that recipients should use if " +
                        "they want to reply to your message."
                },
                userName: {
                    label: "Username",
                    placeholder: "Enter a username",
                    hint: "The SMTP username is usually the same as your email address. However, some email " +
                        "service providers use a different username for your SMTP settings."
                },
                password: {
                    label: "Password",
                    placeholder: "Enter a password",
                    hint: "The SMTP password is a security credential that is used to authenticate and verify your " +
                        "identity when sending emails through the SMTP server."
                },
                displayName: {
                    label: "Display Name",
                    placeholder: "Enter a display name",
                    hint: "The Display Name is used to specify the name that recipients will see in their email " +
                        "inbox when they receive your message."
                },
                validations: {
                    required: "This field cannot be empty",
                    portInvalid: "The port number is invalid",
                    emailInvalid: "The email address is invalid"
                }
            },
            notifications: {
                getConfiguration: {
                    error: {
                        message: "Error Occurred",
                        description: "Error retrieving the email provider configurations."
                    }
                },
                deleteConfiguration: {
                    error: {
                        message: "Error Occurred",
                        description: "Error deleting the email provider configurations."
                    },
                    success: {
                        message: "Revert Successful",
                        description: "Successfully reverted the email provider configurations."
                    }
                },
                updateConfiguration: {
                    error: {
                        message: "Error Occurred",
                        description: "Error updating the email provider configurations."
                    },
                    success: {
                        message: "Update Successful",
                        description: "Successfully updated the email provider configurations."
                    }
                }
            }
        },
        notificationChannel: {
            heading: "SMS / Email Providers",
            title: "SMS / Email Providers",
            description: "Configure the SMS and Email providers for your organization."
        },
        smsProviders: {
            heading: "SMS Provider",
            subHeading: "Configure a SMS provider to send SMS to your users.",
            description: "Configure the SMS provider settings according to your SMS provider.",
            info: "You can customize the SMS content using <1>SMS Templates</1>.",
            updateButton: "Update",
            sendTestSMSButton: "Send Test SMS",
            goBack: "Go back to Email & SMS",
            confirmationModal: {
                assertionHint: "Please confirm your action.",
                content: "If you delete this configuration, you will not receive SMS." +
                    "Please proceed with caution.",
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
                        hint: "The HTTP method of the API request used for sending the SMS."
                    },
                    contentType: {
                        label: "Content Type",
                        placeholder: "JSON",
                        hint: "The content type of the API request used for sending the SMS."
                    },
                    headers: {
                        label: "Headers",
                        placeholder: "Enter headers",
                        hint: "Headers to be included in the send SMS API request."
                    },
                    payload: {
                        label: "Payload",
                        placeholder: "Enter the payload",
                        hint: "Payload of the SMS API request."
                    },
                    key: {
                        label: "SMS Provider Auth Key",
                        placeholder: "Enter the SMS provider auth key",
                        hint: "The auth key of the SMS provider."
                    },
                    secret: {
                        label: "SMS Provider Auth Secret",
                        placeholder: "Enter the SMS provider auth secret",
                        hint: "The auth secret of the SMS provider."
                    },
                    sender: {
                        label: "Sender",
                        placeholder: "Enter the sender",
                        hint: "The sender of the SMS."
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
        identityProviders: {
            apple: {
                quickStart: {
                    addLoginModal: {
                        heading: "Add Apple Login",
                        subHeading: "Select an application to set up Apple login."
                    },
                    connectApp: {
                        description:
                            "Add <1>Apple</1> authenticator to <3>Step 1</3> on the <5>Sign-in Method" +
                            "</5> section of your <7>application</7>."
                    },
                    heading: "Add Apple Login",
                    subHeading: "Apple is now ready to be used as a login option for your " + "applications.",
                    steps: {
                        customizeFlow: {
                            content: "Continue to configure the login flow as required.",
                            heading: "Customize the flow"
                        },
                        selectApplication: {
                            content: "Choose the <1>application</1> for which you want to set up Apple login.",
                            heading: "Select Application"
                        },
                        selectDefaultConfig: {
                            content:
                                "Go to <1>Sign-in Method</1> tab and click on <3>Add Apple login</3>" +
                                " to configure a Apple login flow.",
                            heading: "Select <1>Start with default configuration</1>"
                        }
                    }
                }
            },
            emailOTP: {
                quickStart: {
                    addLoginModal: {
                        heading: "Add Email OTP",
                        subHeading: "Select an application to set up Email OTP login."
                    },
                    connectApp: {
                        description:
                            "Add <1>Email OTP</1> to <3>Step 2</3> on the <5>Sign-in Method" +
                            "</5> section of your <7>application</7>."
                    },
                    heading: "Email OTP Set Up Guide",
                    subHeading:
                        "Follow the instructions given below to set up Email OTP as a factor in your login " + "flow.",
                    steps: {
                        customizeFlow: {
                            content: "Continue to configure the login flow as required.",
                            heading: "Customize the flow"
                        },
                        selectApplication: {
                            content: "Choose the <1>application</1> for which you want to set up Email OTP login.",
                            heading: "Select Application"
                        },
                        selectEmailOTP: {
                            content:
                                "Go to <1>Sign-in Method</1> tab and click on <3>Add Email OTP as a second " +
                                "factor</3> to configure a basic Email OTP flow.",
                            heading: "Select <1>Add Email OTP as a second factor</1>"
                        }
                    }
                }
            },
            smsOTP: {
                settings: {
                    smsOtpEnableDisableToggle: {
                        labelEnable: "Enable SMS OTP",
                        labelDisable: "Disable SMS OTP "
                    },
                    enableRequiredNote: {
                        message: "Asgardeo publishes events to Choreo to enable SMS OTP, where Choreo " +
                            "webhooks will be used to integrate with multiple services to publish OTP Notifications. " +
                            "Follow the <1>Add SMS OTP Guide</1> to configure Choreo webhooks for Asgardeo publish " +
                            "events."
                    },
                    errorNotifications: {
                        notificationSendersRetrievalError: {
                            message: "Error Occurred",
                            description: "Error occurred while trying to get SMS OTP configuration."
                        },
                        smsPublisherCreationError: {
                            message: "Error Occurred",
                            description: "Error occurred while trying to enable SMS OTP."
                        },
                        smsPublisherDeletionError: {
                            generic: {
                                message: "Error Occurred",
                                description: "Error occurred while trying to disable SMS OTP."
                            },
                            activeSubs: {
                                message: "Error Occurred",
                                description: "Error occurred while trying to disable SMS OTP. SMS Publisher has " +
                                    "active subscriptions."
                            },
                            connectedApps: {
                                message: "Error Occurred",
                                description: "Error occurred while trying to disable SMS OTP. " +
                                    "There are applications using this connection."
                            }
                        }
                    }
                },
                quickStart: {
                    addLoginModal: {
                        heading: "Add SMS OTP",
                        subHeading: "Select an application to set up SMS OTP login."
                    },
                    connectApp: {
                        description:
                            "Add <1>SMS OTP</1> to <3>Step 2</3> on the <5>Sign-in Method" +
                            "</5> section of your <7>application</7>."
                    },
                    heading: "SMS OTP Set Up Guide",
                    subHeading:
                        "Follow the instructions given below to set up SMS OTP as a factor in your login flow.",
                    steps: {
                        selectApplication: {
                            content: "Choose the <1>application</1> for which you want to set up SMS OTP login.",
                            heading: "Select Application"
                        },
                        selectSMSOTP: {
                            content:
                                "Go to <1>Sign-in Method</1> tab and click on <3>Add SMS OTP as a second " +
                                "factor</3> to configure a basic SMS OTP flow.",
                            heading: "Select <1>Add SMS OTP as a second factor</1>"
                        }
                    }
                }
            },
            facebook: {
                quickStart: {
                    addLoginModal: {
                        heading: "Add Facebook Login",
                        subHeading: "Select an application to set up Facebook login."
                    },
                    connectApp: {
                        description:
                            "Add <1>Facebook</1> authenticator to <3>Step 1</3> on the <5>Sign-in Method" +
                            "</5> section of your <7>application</7>."
                    },
                    heading: "Add Facebook Login",
                    subHeading: "Facebook is now ready to be used as a login option for your " + "applications.",
                    steps: {
                        customizeFlow: {
                            content: "Continue to configure the login flow as required.",
                            heading: "Customize the flow"
                        },
                        selectApplication: {
                            content: "Choose the <1>application</1> for which you want to set up Facebook login.",
                            heading: "Select Application"
                        },
                        selectDefaultConfig: {
                            content:
                                "Go to <1>Sign-in Method</1> tab and click on <3>Start with default " +
                                "configuration</3>.",
                            heading: "Select <1>Start with default configuration</1>"
                        }
                    }
                }
            },
            github: {
                quickStart: {
                    addLoginModal: {
                        heading: "Add GitHub Login",
                        subHeading: "Select an application to set up GitHub login."
                    },
                    connectApp: {
                        description:
                            "Add <1>GitHub</1> authenticator to <3>Step 1</3> on the <5>Sign-in Method" +
                            "</5> section of your <7>application</7>."
                    },
                    heading: "Add GitHub Login",
                    subHeading: "GitHub is now ready to be used as a login option for your " + "applications.",
                    steps: {
                        customizeFlow: {
                            content: "Continue to configure the login flow as required.",
                            heading: "Customize the flow"
                        },
                        selectApplication: {
                            content: "Choose the <1>application</1> for which you want to set up Github login.",
                            heading: "Select Application"
                        },
                        selectDefaultConfig: {
                            content:
                                "Go to <1>Sign-in Method</1> tab and click on <3>Start with default " +
                                "configuration</3>.",
                            heading: "Select <1>Start with default configuration</1>"
                        }
                    }
                }
            },
            google: {
                quickStart: {
                    addLoginModal: {
                        heading: "Add Google Login",
                        subHeading: "Select an application to set up Google login."
                    },
                    connectApp: {
                        description:
                            "Add <1>Google</1> authenticator to <3>Step 1</3> on the <5>Sign-in Method" +
                            "</5> section of your <7>application</7>."
                    },
                    heading: "Add Google Login",
                    subHeading: "Google is now ready to be used as a login option for your " + "applications.",
                    steps: {
                        customizeFlow: {
                            content: "Continue to configure the login flow as required.",
                            heading: "Customize the flow"
                        },
                        selectApplication: {
                            content: "Choose the <1>application</1> for which you want to set up Google login.",
                            heading: "Select Application"
                        },
                        selectDefaultConfig: {
                            content:
                                "Go to <1>Sign-in Method</1> tab and click on <3>Add Google login</3> to " +
                                "configure a Google login flow.",
                            heading: "Select <1>Add Google login</1>"
                        }
                    }
                }
            },
            microsoft: {
                quickStart: {
                    addLoginModal: {
                        heading: "Add Microsoft Login",
                        subHeading: "Select an application to set up Microsoft login."
                    },
                    connectApp: {
                        description:
                            "Add <1>Microsoft</1> authenticator to <3>Step 1</3> on the <5>Sign-in Method" +
                            "</5> section of your <7>application</7>."
                    },
                    heading: "Add Microsoft Login",
                    subHeading: "Microsoft is now ready to be used as a login option for your " + "applications.",
                    steps: {
                        customizeFlow: {
                            content: "Continue to configure the login flow as required.",
                            heading: "Customize the flow"
                        },
                        selectApplication: {
                            content: "Choose the <1>application</1> for which you want to set up Microsoft login.",
                            heading: "Select Application"
                        },
                        selectDefaultConfig: {
                            content:
                                "Go to <1>Sign-in Method</1> tab and click on <3>Start with default " +
                                "configuration</3>.",
                            heading: "Select <1>Start with default configuration</1>"
                        }
                    }
                }
            },
            hypr: {
                quickStart: {
                    addLoginModal: {
                        heading: "Add HYPR Login",
                        subHeading: "Select an application to set up HYPR login."
                    },
                    connectApp: {
                        description:
                            "Add <1>HYPR</1> authenticator to <3>Step 1</3> on the <5>Sign-in Method" +
                            "</5> section of your <7>application</7>."
                    },
                    heading: "Add HYPR Login",
                    subHeading: "HYPR is now ready to be used as a login option for your applications.",
                    steps: {
                        configureLogin: {
                            heading: "Configure the Login Flow",
                            addHypr: "Add HYPR authenticator to step 1 by clicking on the <1>Add Authentication</1> button.",
                            conditionalAuth:
                                "Turn on <1>Conditional Authentication</1> by switching the toggle and add " +
                                "the following conditional authentication script.",
                            update: "Click <1>Update</1> to confirm."
                        },
                        customizeFlow: {
                            content: "Continue to configure the login flow as required.",
                            heading: "Customize the flow"
                        },
                        selectApplication: {
                            content: "Choose the <1>application</1> for which you want to set up HYPR login.",
                            heading: "Select Application"
                        },
                        selectDefaultConfig: {
                            content:
                                "Go to the <1>Sign-in Method</1> tab and click on <3>Start with default " +
                                "configuration</3>.",
                            heading: "Select <1>Start with default configuration</1>"
                        }
                    }
                }
            },
            siwe: {
                forms: {
                    authenticatorSettings: {
                        callbackUrl: {
                            hint: "The set of redirect URIs specified as valid for the hosted OIDC server.",
                            label: "Authorization callback URL",
                            placeholder: "Enter Authorization callback URL.",
                            validations: {
                                required: "Authorization callback URL is a required field."
                            }
                        },
                        clientId: {
                            hint: "The <1>client_id</1> you received from <2>oidc.signinwithethereum.org</2> " +
                                "for your OIDC client.",
                            label: "Client ID",
                            placeholder: "Enter Client ID of OIDC client.",
                            validations: {
                                required: "Client ID is a required field."
                            }
                        },
                        clientSecret: {
                            hint: "The <1>client_secret</1> you received <2>oidc.signinwithethereum.org</2> " +
                                "for your OIDC client.",
                            label: "Client secret",
                            placeholder: "Enter Client secret of OIDC client.",
                            validations: {
                                required: "Client secret is a required field."
                            }
                        },
                        scopes: {
                            heading: "Scopes",
                            hint: "The type of access provided for the connected apps to access data " +
                                "from Ethereum wallet.",
                            list: {
                                openid: {
                                    description: "Engages the OpenID flow."
                                },
                                profile: {
                                    description: "Grants access to read a user's profile data."
                                }
                            }
                        }
                    }
                },
                quickStart: {
                    addLoginModal: {
                        heading: "Add Sign In With Ethereum",
                        subHeading: "Select an application to set up Sign In With Ethereum."
                    },
                    connectApp: {
                        description:
                            "Add <1>Sign In With Ethereum</1> authenticator to <3>Step 1</3> on the <5>Sign-in Method" +
                            "</5> section of your <7>application</7>."
                    },
                    heading: "Add Sign In With Ethereum",
                    steps: {
                        customizeFlow: {
                            content: "Continue to configure the login flow as required.",
                            heading: "Customize the flow"
                        },
                        selectApplication: {
                            content: "Choose the <1>application</1> for which you want to " +
                                "set up Sign In With Ethereum.",
                            heading: "Select Application"
                        },
                        selectDefaultConfig: {
                            content:
                                "Go to <1>Sign-in Method</1> tab and click on <3>Start with default " +
                                "configuration</3>.",
                            heading: "Select <1>Start with default configuration</1>"
                        }
                    },
                    subHeading: "Sign In With Ethereum is now ready to be used as a login option for your "
                        + "applications."
                },
                wizardHelp: {
                    clientId: {
                        description: "Provide the <1>client_id</1> you received from " +
                            "<2>oidc.signinwithethereum.org</2> for your OIDC client.",
                        heading: "Client ID"
                    },
                    clientSecret: {
                        description: "Provide the <1>client_secret</1> you received from " +
                            "<2>oidc.signinwithethereum.org</2> for your OIDC client.",
                        heading: "Client secret"
                    },
                    heading: "Help",
                    name: {
                        connectionDescription: "Provide a unique name for the connection.",
                        heading: "Name",
                        idpDescription: "Provide a unique name for the identity provider."
                    },
                    preRequisites: {
                        clientRegistrationDocs: "See the guide on registering an OIDC client.",
                        configureClient: "If you want to quickly get things started, use the following <1>curl</1> command to register the client.",
                        configureRedirectURI: "The following URL has to be set as the <1>Redirect URI</1>.",
                        getCredentials: "Before you begin, register an <1>OIDC client</1> using the OIDC client registration of <3>oidc.signinwithethereum.org</3>, and obtain a <5>client ID & secret</5>.",
                        heading: "Prerequisite"
                    },
                    subHeading: "Use the guide below"
                }
            },
            totp: {
                quickStart: {
                    addLoginModal: {
                        heading: "Add TOTP",
                        subHeading: "Select an application to set up TOTP login."
                    },
                    heading: "TOTP Set Up Guide",
                    steps: {
                        customizeFlow: {
                            content: "Continue to configure the login flow as required.",
                            heading: "Customize the flow"
                        },
                        selectApplication: {
                            content: "Choose the <1>application</1> for which you want to set up TOTP login.",
                            heading: "Select Application"
                        },
                        selectTOTP: {
                            content:
                                "Go to <1>Sign-in Method</1> tab and click on <3>Add OTP as a second " +
                                "factor</3> to configure a basic TOTP flow.",
                            heading: "Select <1>Add TOTP as a second factor</1>"
                        }
                    },
                    subHeading: "Follow the instructions given below to set up TOTP as a factor in your login flow."
                }
            },
            fido: {
                quickStart: {
                    addLoginModal: {
                        heading: "Add Passkey Login",
                        subHeading: "Select an application to set up passkey login."
                    },
                    heading: "Passkey Set Up Guide",
                    passkeys: {
                        docLinkText: "FIDO passkey",
                        content:
                            "Passkey provide simple and secure passwordless login for your applications that " +
                            "survives device loss and works across platforms. You can try out passkey " +
                            "authentication on Asgardeo with \"Passkey\".",
                        heading: "FIDO authentication with passkey"
                    },
                    steps: {
                        customizeFlow: {
                            content: "Continue to configure the login flow as required.",
                            heading: "Customize the flow"
                        },
                        selectApplication: {
                            content: "Choose the <1>application</1> for which you want to set up passkey login.",
                            heading: "Select Application"
                        },
                        selectFIDO: {
                            content:
                                "Go to <1>Sign-in Method</1> tab and click on <3>Add Passkey Login</3> to configure " +
                                " a basic passkey flow.",
                            heading: "Select <1>Add Passkey Login</1>"
                        },
                        configureParameters: {
                            heading: "Configure passkey options",
                            content: {
                                parameters: {
                                    progressiveEnrollment: {
                                        description: "Activate this option to allow users to enroll for a " +
                                        "passkey during login.",
                                        label: "Progressive Passkey Enrollment:",
                                        note: "When the Passkey is set as a <1>first factor</1> option, " +
                                        "users need to add an <3>adaptive script</3> to verify the user's " +
                                        "identity prior to passkey enrollment. To include the script, users " +
                                        "can use the <5>Passkeys Progressive Enrollment</5> template available " +
                                        "in the <7>Sign-In-Method</7> tab of the application."
                                    },
                                    usernamelessAuthentication: {
                                        description: "Enabling this feature allows users to log in with a passkey " +
                                        "without entering a username, creating a more streamlined " +
                                        "sign-in experience.",
                                        label: "Usernameless Authentication:"
                                    }
                                },
                                steps: {
                                    info: "To configure, please follow the steps below:",
                                    1: "Navigate to the <1>Connections</1> area.",
                                    2: "Locate and select the <1>Passkey</1> connection.",
                                    3: "Navigate to the <1>Settings</1> tab."
                                }
                            }
                        }
                    },
                    subHeading: "Follow the instructions given below to set up passkey login in your login flow."
                }
            },
            magicLink: {
                quickStart: {
                    addLoginModal: {
                        heading: "Add Magic Link Login",
                        subHeading: "Select an application to set up magic link login."
                    },
                    heading: "Magic Link Set Up Guide",
                    steps: {
                        customizeFlow: {
                            content: "Continue to configure the login flow as required.",
                            heading: "Customize the flow"
                        },
                        selectApplication: {
                            content: "Choose the <1>application</1> for which you want to set up magic link login.",
                            heading: "Select Application"
                        },
                        selectMagicLink: {
                            content:
                                "Go to <1>Sign-in Method</1> tab and click on <3>Add Magic Link login" +
                                "</3> to configure a basic magic-link flow.",
                            heading: "Select <1>Add Magic Link login</1>"
                        }
                    },
                    subHeading: "Follow the instructions given below to set up magic link login in your login flow."
                }
            }
        },
        monitor: {
            filter: {
                advancedSearch: {
                    attributes: {
                        placeholder: "E.g., actionId, traceId etc."
                    },
                    fields: {
                        value: {
                            placeholder: "E.g., validate-token, access_token etc."
                        }
                    },
                    buttons: {
                        submit: {
                            label: "Add Filter"
                        }
                    },
                    title: "Advanced Search"
                },
                dropdowns: {
                    timeRange: {
                        custom: {
                            labels: {
                                from: "From",
                                timeZone: "Select time zone",
                                to: "To"
                            }
                        },
                        texts: {
                            0: "Last 15 minutes",
                            1: "Last 30 minutes",
                            2: "Last hour",
                            3: "Last 4 hours",
                            4: "Last 12 hours",
                            5: "Last 24 hours",
                            6: "Last 48 hours",
                            7: "Last 3 days",
                            8: "Last 7 days",
                            9: "Custom Time Range"
                        }
                    },
                    timeZone: {
                        placeholder: "Select time zone"
                    }
                },
                topToolbar: {
                    buttons: {
                        addFilter: {
                            label: "Add Filters"
                        },
                        clearFilters: {
                            label: "Clear all filters"
                        }
                    }
                },
                searchBar: {
                    placeholderDiagnostic: "Search Logs by Trace ID, Action ID, Client ID, Result Message, or Result Status",
                    placeholderAudit: "Search Logs by Action, Target ID, Initiator ID, Request ID"
                },
                refreshMessage: {
                    text: "Last fetched logs at ",
                    tooltipText: "Newly generated logs will take few minues to be included in the search results."
                },
                refreshButton: {
                    label: "Refresh"
                },
                queryButton: {
                    label: "Run Query"
                },
                downloadButton : {
                    label : "Download log data"
                },
                delayMessage: {
                    text: "Some queries may take longer to load."
                }
            },
            logView: {
                toolTips: {
                    seeMore: "See more"
                }
            },
            notifications: {
                genericError: {
                    subtitle: {
                        0: "Couldn't fetch logs.",
                        1: "Please try again."
                    },
                    title: "Something went wrong"
                },
                emptyFilterResult: {
                    actionLabel: "Clear all filters",
                    subtitle: {
                        0: "We couldn't find any results.",
                        1: "Please try adding a different filter."
                    },
                    title: "No results found"
                },
                emptySearchResult: {
                    actionLabel: "Clear search query",
                    subtitle: {
                        0: "We couldn't find any results for this search query.",
                        1: "Please try a different search term."
                    },
                    title: "No results found"
                },
                emptyResponse: {
                    subtitle: {
                        0: "We couldn't find any logs in ",
                        1: "Please try a different time range."
                    },
                    title: "No logs available"
                }
            },
            pageHeader: {
                description: "Query your logs to troubleshoot issues and monitor resource activities.",
                title: "Logs"
            },
            tooltips: {
                copy: "Copy to clipboard"
            }
        },
        sidePanel: {
            apiResources: "API Resources",
            branding: "Branding",
            stylesAndText: "Styles & Text",
            monitor: "Logs",
            categories: {
                apiResources: "API Resources",
                branding: "Branding",
                emailProvider: "Email Provider",
                smsProvider: "SMS Provider",
                monitor: "Logs"
            },
            emailProvider: "Email Provider",
            smsProvider: "SMS Provider",
            eventPublishing: "Events",
            emailTemplates: "Email Templates",
            organizationInfo: "Organization Info"
        },
        eventPublishing: {
            eventsConfiguration: {
                heading: "Configure Events",
                subHeading: "Asgardeo can publish events to Choreo based on various user interactions. You can use the published events to trigger custom use cases.",
                formHeading: "Select the events that you want to publish to Choreo.",
                form: {
                    updateButton: "Update"
                },
                navigateToChoreo: {
                    description: "Navigate to your Choreo organization to consume the published events.",
                    navigateButton: "Go to Choreo"
                }
            },
            notifications: {
                updateConfiguration: {
                    error: {
                        generic: {
                            description: "An error occurred while updating the event configurations.",
                            message: "Something went wrong"
                        },
                        activeSubs: {
                            description: "Make sure that there are no active subscribers before disabling an event " +
                                "category.",
                            message: "Something went wrong"
                        }
                    },
                    success: {
                        description: "Event configurations updated successfully.",
                        message: "Update Successful"
                    }
                },
                getConfiguration: {
                    error: {
                        description: "An error occurred while retrieving the event configurations.",
                        message: "Retrieval Error"
                    },
                    success: {
                        description: "",
                        message: ""
                    }
                }
            }
        },
        emailTemplates: {
            page: {
                header: "Email Templates",
                description: "Customize email templates used in your organization."
            },
            tabs: {
                content: {
                    label: "Content"
                },
                preview: {
                    label: "Preview"
                }
            },
            notifications: {
                getEmailTemplateList: {
                    error: {
                        description: "An error occurred while retrieving the email templates list.",
                        message: "An error occurred while retrieving the email templates list"
                    }
                },
                getEmailTemplate: {
                    error: {
                        description: "An error occurred while retrieving the email template.",
                        message: "Error retrieving email template."
                    }
                },
                updateEmailTemplate: {
                    success: {
                        description: "Email template updated successfully",
                        message: "Email template updated successfully"
                    },
                    error: {
                        description: "Error while updating email template. Make sure you have filled all the required fields and try again",
                        message: "Error while updating email template"
                    }
                },
                deleteEmailTemplate: {
                    success: {
                        description: "Email template deleted successfully",
                        message: "Email template deleted successfully"
                    },
                    error: {
                        description: "Error while deleting email template. Please try again",
                        message: "Error while deleting the email template"
                    }
                }
            },
            form: {
                inputs: {
                    template: {
                        label: "Email Template",
                        placeholder: "Select the email template",
                        hint: "Select the email template"
                    },
                    locale: {
                        label: "Locale",
                        placeholder: "Select Locale"
                    },
                    subject: {
                        label: "Subject",
                        placeholder: "Enter the email subject",
                        hint: "This will be used as the subject of the email template and will be visible to the user."
                    },
                    body: {
                        label: "Email Body (HTML)",
                        hint: "You can include any of the available literals placeholders for the email body."
                    },
                    footer: {
                        label: "Footer",
                        placeholder: "Enter the email footer",
                        hint: "This will be used as the footer of the email template and will be visible to the user."
                    }
                }
            },
            modal: {
                replicateContent: {
                    header: "Replicate content?",
                    message: "Seems like you don't have any content for this locale. Do you need to populate the previous locale's content here as a quick start?"
                }
            },
            dangerZone: {
                heading: "Remove Template",
                message: "This action will remove the selected template and you will lose any changes you've done to this template.",
                action: "Remove Template",
                actionDisabledHint: "You cannot delete a template with the default locale."
            }
        }
    },
    manage: {
        accountLogin: {
            notifications: {
                success: {
                    description: "Successfully updated username validation configuration.",
                    message: "Update successful"
                },
                error: {
                    description: "{{description}}",
                    message: "Update error"
                },
                genericError: {
                    description: "Failed to update username validation configuration.",
                    message: "Something went wrong"
                }
            },
            validationError: {
                minMaxMismatch: "Minimum length should be less than maximum length.",
                minLimitError: "The minimum length cannot be less than 3.",
                maxLimitError: "The maximum length cannot be more than 50.",
                wrongCombination: "The combination is not allowed"
            },
            editPage: {
                pageTitle: "Username Validation",
                description: "Update the username type and customize username validation rules for your users.",
                usernameType: "Select username type",
                usernameTypeHint: "Allow users to set an email or a combination of characters for the username.",
                emailType: "Email",
                customType: "Custom",
                usernameLength: {
                    0: "Must be between",
                    1: "and",
                    2: "characters."
                },
                usernameAlphanumeric: "Restrict to alphanumeric (a-z, A-Z, 0-9).",
                usernameSpecialCharsHint: "Any combination of letters (a-z, A-Z), numbers (0-9), and the following characters: !@#$%&'*+\\=?^_.{|}~-."
            },
            alternativeLoginIdentifierPage: {
                pageTitle: "Alternative Login Identifiers",
                description: "Configure alternative login identifiers and allow users to use username or configured" +
                    " login identifier in login and recovery flows.",
                loginIdentifierTypes: "Select login identifier",
                loginIdentifierTypesHint: "Allow users to use username or configured login identifier in" +
                    " the login flow.",
                warning: "Ensure that each user in your organization has a unique value assigned for the selected" +
                    " login identifiers.",
                info: "You have selected email as the username type which makes it the primary login identifier.",
                notification: {
                    error: {
                        description: "Error updating the alternative login identifier configuration.",
                        message: "Error updating configuration"
                    },
                    success: {
                        description: "Successfully updated the alternative login identifier configuration.",
                        message: "Update successful"
                    }
                },
                claimUpdateNotification: {
                    error: {
                        description: "Error updating the attribute as an unique attribute. Please try again.",
                        message: "Error updating claim"
                    }
                }
            },
            pageTitle: "Account Login",
            description: "Customize account login configurations of the users in your organization.",
            goBackToApplication: "Go back to Applications",
            goBackToAccountLogin: "Go back to Account Login"
        },
        attributes: {
            attributes: {
                description: "View and manage user attributes in the organization."
            },
            displayNameHint:
                "The display name will be used in the user profile to recognize the attribute, " +
                "hence be mindful on selecting it.",
            generatedAttributeMapping: {
                title: "Protocol Mappings",
                OIDCProtocol: "OpenID Connect",
                SCIMProtocol: "SCIM 2.0",
                description:
                    "We are simplifying the process for you and adding the required mappings for " +
                    "the following protocols."
            }
        },
        features: {
            header: {
                links: {
                    billingPortalNav: "Billing Portal"
                }
            },
            tenant: {
                header: {
                    tenantSwitchHeader: "Switch Organization",
                    tenantAddHeader: "New Organization",
                    tenantDefaultButton: "Default",
                    tenantMakeDefaultButton: "Make default",
                    makeDefaultOrganization: "Make default organization",
                    backButton: "Go back",
                    copyOrganizationId: "Copy organization ID",
                    copied: "Copied!",
                    tenantSearch: {
                        placeholder: "Search organization",
                        emptyResultMessage: "No organizations found"
                    }
                },
                wizards: {
                    addTenant: {
                        heading: "Add New Organization",
                        forms: {
                            fields: {
                                tenantName: {
                                    label: "Organization Name",
                                    placeholder: "Organization name (E.g., myorg)",
                                    validations: {
                                        empty: "This is a required field.",
                                        duplicate:
                                            "An organization with the name {{ tenantName }} already exists." +
                                            " Please try a different name.",
                                        invalid: "Please enter a valid format for organization name. It must" +
                                            "<1><0>be unique</0><1>contain more than {{ minLength }} and less than" +
                                            " {{ maxLength }} characters</1><2>consist of only lowercase" +
                                            " alphanumeric characters</2><3>begin with an alphabetic character</3>" +
                                            "</1>",
                                        invalidLength: "The name you entered is less than {{ minLength }}" +
                                            " characters. It must be" +
                                            "<3><0>be unique</0><1>contain more than {{ minLength }} and less than" +
                                            " {{ maxLength }} characters</1><2>consist of only lowercase" +
                                            " alphanumeric characters</2><3>begin with an alphabetic character</3>" +
                                            "</3s>"
                                    }
                                }
                            },
                            loaderMessages: {
                                duplicateCheck: "Validating new organization name...",
                                tenantCreate: "Creating the new organization...",
                                tenantSwitch: "Please wait while we redirect you to the new organization..."
                            },
                            messages: {
                                info:
                                    "Think of a good, unique organization name for your new Asgardeo workspace" +
                                    " because you won’t be able to change it later!"
                            }
                        },
                        tooltips: {
                            message: "You will use this URL to access the new organization."
                        }
                    }
                },
                tenantCreationPrompt: {
                    heading: "Create New Organization",
                    subHeading1: "You are accessing Asgardeo in the ",
                    subHeading2: "Sign In ",
                    subHeading3: "to the ",
                    subHeading4: "To continue, create your first organization.",
                    subHeading5: "Alternatively, ",
                    subHeading6: " to ",
                    subHeading7: "region."
                },
                notifications: {
                    addTenant: {
                        error: {
                            description: "{{ description }}",
                            message: "Error Creating Organization"
                        },
                        genericError: {
                            description: "An error occurred while creating the organization.",
                            message: "Error Creating Organization"
                        },
                        limitReachError: {
                            description: "Maximum number of allowed organizations have been reached.",
                            message: "Error Creating Organization"
                        },
                        success: {
                            description: "Successfully created organization {{ tenantName }}.",
                            message: "Organization Created"
                        }
                    },
                    defaultTenant: {
                        genericError: {
                            description: "An error occurred while updating your default organization.",
                            message: "Error Updating Organization"
                        },
                        success: {
                            description: "Successfully set {{ tenantName }} as your default organization.",
                            message: "Updated Default Organization"
                        }
                    },
                    missingClaims: {
                        message: "Some personal info is missing",
                        description:
                            "Please visit the MyAccount application and make sure that your first name," +
                            " last name and primary email have been set in the Personal Info section."
                    },
                    getTenants: {
                        message: "Unable to fetch your organizations",
                        description: "An error occurred while fetching your organizations."
                    }
                }
            },
            user: {
                addUser: {
                    close: "Close",
                    invite: "Invite",
                    finish: "Finish",
                    add: "Add",
                    inputLabel: {
                        alphanumericUsername: "Username",
                        alphanumericUsernamePlaceholder: "Enter the username",
                        emailUsername: "Username (Email)"
                    },
                    inviteUserTooltip:
                        "An email with a confirmation link will be sent to the " +
                        "provided email address for the user to set their own password.",
                    inviteUserOfflineTooltip: "You can copy the invitation link or the invitation" +
                        " during the final step to share with the user.",
                    inviteLink: {
                        error: {
                            description: "Unable to fetch invitation",
                            message: "An error occurred while fetching the invitation link."
                        },
                        genericError: {
                            description: "Error getting invitation summary",
                            message: "An error occurred generating the summary."
                        }
                    },
                    summary: {
                        invitation: "Invitation",
                        invitationBody: {
                            accountHasBeenCreated: "An account has been created for the username," +
                                " {{ username }} in the {{ tenantname }} organization.",
                            hi: "Hi,",
                            pleaseFollowTheLink: "Please follow the link below to set the password.",
                            team: "{{ tenantname }} team",
                            thanks: "Thanks"
                        },
                        invitationBodyCopy: {
                            accountHasBeenCreated: "An account has been created for the username, " +
                                "$username in the $tenantname organization.",
                            team: "$tenantname team"
                        },
                        invitationPasswordBody: {
                            accountHasBeenCreated: "An account has been created for you in the {{ tenantname }}" +
                                " organization. Your credentials are as follows.",
                            myAccountLink: "My Account URL",
                            pleaseFollowTheLink: "Please use the credentials to log in to your account by" +
                                " following the link below."
                        },
                        invitationPasswordBodyCopy: {
                            accountHasBeenCreated: "An account has been created for you in the $tenantname " +
                                "organization. Your credentials are as follows."
                        },
                        invitationLink: "Invitation link",
                        inviteWarningMessage: "Make sure to copy the invitation link or the invitation" +
                            " before you proceed. You won't see them again!",
                        password: "Password",
                        passwordWarningMessage: "Make sure to copy the password or the invitation before" +
                            " you proceed. You won't see them again!",
                        username: "Username"
                    },
                    validation: {
                        password:
                            "Your password must contain a minimum of 8 characters including at " +
                            "least one uppercase letter, one lowercase letter, and one number.",
                        passwordCase: "At least {{minUpperCase}} uppercase and {{minLowerCase}} lowercase letters",
                        upperCase: "At least {{minUpperCase}} uppercase letter(s)",
                        lowerCase: "At least {{minLowerCase}} lowercase letter(s)",
                        passwordLength: "Must be between {{min}} and {{max}} characters",
                        passwordNumeric: "At least {{min}} number(s)",
                        specialCharacter: "At least {{specialChr}} special character(s)",
                        uniqueCharacters: "At least {{uniqueChr}} unique character(s)",
                        consecutiveCharacters: "No more than {{repeatedChr}} repeated character(s)",
                        error: {
                            passwordValidation: "The password should satisfy the below constraints."
                        },
                        usernameHint: "Must be an alphanumeric (a-z, A-Z, 0-9) string between {{minLength}} to " +
                            "{{maxLength}} characters including at least one letter.",
                        usernameSpecialCharHint: "Must be {{minLength}} to {{maxLength}} characters long, " +
                            "including at least one letter, and may contain a combination of the following " +
                            "characters: a-z, A-Z, 0-9, !@#$%&'*+\\=?^_.{|}~-.",
                        usernameLength: "The username length should be between {{minLength}} and {{maxLength}}.",
                        usernameSymbols: "The username should consist of alphanumeric characters (a-z, A-Z, 0-9) and must include at least one letter.",
                        usernameSpecialCharSymbols: "Please choose a valid username that adheres to the given guidelines."
                    }
                }
            },
            userStores: {
                configs: {
                    addUserStores: {
                        actionTitle: "Connect user store",
                        subTitle: "There are currently no remote user stores connected. Connect " +
                            "a new user store and onboard the remote user accounts to Asgardeo.",
                        title: "Connect a new user store"
                    }
                },
                create: {
                    pageLayout: {
                        actions: {
                            connectUserStore: "Connect user store"
                        },
                        description: "Onboard the users in your remote user store to Asgardeo.",
                        title: "Remote User Store",
                        steps: {
                            attributeMappings: {
                                subTitle: "Map the attributes defined in the on-prem user store for the username " +
                                    "and user ID so that the users from the on-prem user store that you connect " +
                                    "can log into applications without any issues.",
                                title: "Map Attributes",
                                usernameHint: "The mapped attribute for username should be <1> unique </1> and be " +
                                    "of <3> type {{ usernameType }} </3>. This field cannot be empty as username is the " +
                                    "primary identifier of the user.",
                                emailUsername: "email",
                                alphanumericUsername: "alphanumeric username"
                            },
                            generalSettings: {
                                form: {
                                    fields: {
                                        name: {
                                            hint: "This will appear as the name of the  remote user store " +
                                                "that you connect.",
                                            label: "Name",
                                            placeholder: "Enter the name of the user store",
                                            requiredErrorMessage: "This field cannot be empty as this is the unique " +
                                                "identifier of the user store."
                                        },
                                        description: {
                                            label: "Description",
                                            placeholder: "Enter the description of the user store"
                                        },
                                        userStoreType: {
                                            label: "Remote user store type",
                                            message: "You will be only granted READ access to this user store.",
                                            types: {
                                                ldap: {
                                                    label: "LDAP"
                                                },
                                                ad: {
                                                    label: "Active Directory"
                                                }
                                            }
                                        },
                                        accessType: {
                                            label: "Access Type",
                                            types: {
                                                readOnly: {
                                                    label: "Read Only",
                                                    hint: "You will be granted READ-ONLY access to the user store. You will" +
                                                        "not be able to add new users or update any attributes of the user" +
                                                        "accounts you onboard."
                                                },
                                                readWrite: {
                                                    label: "Read/Write",
                                                    hint: "You will be granted READ/WRITE access to the user store. You will " +
                                                        "be able to add new users and update the attributes of the user accounts " +
                                                        "you onboard."
                                                }
                                            }
                                        }
                                    }
                                },
                                title: "General Details"
                            }
                        }
                    }
                },
                delete: {
                    assertionHint: "Please confirm your action."
                },
                edit: {
                    attributeMappings: {
                        description: "Map the attributes of your remote user store with the corresponding default " +
                            "and custom attributes of your organization. The attribute values will be mapped to " +
                            "the default attribute mappings of your organization. ",
                        disable: {
                            buttonDisableHint: "You cannot map attributes as this user store is disabled."
                        },
                        title: "Update Attribute Mappings",
                        subTitle: "Update the attribute mappings you have added for the default and custom attributes.",
                        sections: {
                            custom: "Custom Attributes",
                            local: "Local Attributes"
                        },
                        validations: {
                            empty: "This is a required field."
                        }
                    },
                    general: {
                        connectionsSections: {
                            title: "User Store Agent Connection(s)",
                            agents: {
                                agentOne: {
                                    description: "Users with an account in this user store connected via this " +
                                        "agent, can sign in to the My Account and other business applications " +
                                        "registered in the organization."
                                },
                                agentTwo: {
                                    description: "To maintain high availability for the remote user store, you " +
                                        "can connect a second user store agent. "
                                },
                                buttons: {
                                    disconnect: "Disconnect",
                                    generate: "Generate token",
                                    regenerate: "Regenerate token"
                                }
                            }
                        },
                        disable: {
                            buttonDisableHint: "You cannot update the description as this user store is disabled."
                        },
                        form: {
                            fields: {
                                description: {
                                    label: "Description",
                                    placeholder: "Enter the description of the user store"
                                }
                            },
                            validations: {
                                allSymbolsErrorMessage: "The user store name should have a combination of " +
                                    "alphanumerics and special characters. Please try a different name.",
                                invalidSymbolsErrorMessage: "The name you entered contains disallowed " +
                                    "characters. It can not contain '/' or '_'.",
                                restrictedNamesErrorMessage: "A user store with the name {{name}} already exists." +
                                    " Please try a different name.",
                                reservedNamesErrorMessage: "User store name {{name}} is reserved." +
                                    " Please try a different name."
                            }
                        },
                        userStoreType: {
                            info: "Note that you will be granted READ ONLY access to the user directory. You will " +
                                "not be able to add new users or update any attributes of the user accounts that you " +
                                "onboard. Users of this user store will be able to log in to the applications in " +
                                "your organization."
                        }
                    },
                    setupGuide: {
                        title: "Connect the remote user store",
                        subTitle: "Follow the steps given below to configure the user store agent, which " +
                            "connects the remote user store to Asgardeo",
                        steps: {
                            configureProperties: {
                                content: {
                                    message: "See the Asgardeo documentation for the complete list of user store " +
                                        "configuration properties."
                                },
                                description: "Configure the properties of the local user store in the " +
                                    "deployment.toml file that is found in the user store agent " +
                                    "distribution depending on your requirements.",
                                title: "Configure user store properties"
                            },
                            downloadAgent: {
                                content: {
                                    buttons: {
                                        download: "Download the agent"
                                    }
                                },
                                description: "Download and unzip the user store agent.",
                                title: "Download the agent"
                            },
                            generateToken: {
                                content: {
                                    buttons: {
                                        generate: "Generate token"
                                    }
                                },
                                description: "Generate a new installation token which will require when you try to " +
                                    "connect your remote user store through the user store agent.",
                                title: "Generate new token"
                            },
                            runAgent: {
                                description: "Execute one of the following commands based on your operating system. " +
                                    "Enter the installation_token on prompt.",
                                title: "Run the agent"
                            },
                            tryAgain: {
                                info: "A user store is not connected, please make sure that you have followed all " +
                                    "the steps of the setup guide properly."
                            }
                        }
                    }
                },
                list: {
                    subTitle: "Connect and manage user stores.",
                    title: "User Stores"
                }
            }
        },
        groups: {
            heading: "Groups",
            subHeading:
                "User groups within your organization are listed here. You can create new groups and assign users.",
            edit: {
                users: {
                    heading: "Users in the Group",
                    description: "User groups within your organization are managed here."
                },
                roles: {
                    title: "Roles",
                    heading: "Roles assigned to the group",
                    description: "Group to role assignments within your organization are managed here.",
                    editHoverText: "Edit Assigned Roles",
                    searchPlaceholder: "Search application roles by application name and role name",
                    rolesList: {
                        applicationLabel: "Application",
                        applicationRolesLabel: "Application Roles"
                    },
                    addNewModal: {
                        heading: "Manage Application Roles",
                        subHeading: "Select the application roles related to the group."
                    },
                    buttons: {
                        assignRoles: "Assign Roles"
                    },
                    placeHolders: {
                        emptyRoles: {
                            action: "Go to Applications",
                            subtitles: {
                                0: "There are no application roles created at the moment.",
                                1: "Please create an application role to assign it to the group."
                            },
                            title: "No Roles Created"
                        },
                        emptyList: {
                            action: "Assign Roles",
                            subtitles: {
                                0: "There are no roles assigned to the group at the moment."
                            },
                            title: "No Roles Assigned"
                        }
                    },
                    notifications: {
                        updateApplicationRoles: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while updating application roles"
                            },
                            genericError: {
                                description: "Error occurred while updating application roles",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "Updating application roles for the group successful.",
                                message: "Update application roles successful"
                            }
                        },
                        fetchApplicationRoles: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while fetching the application roles"
                            },
                            genericError: {
                                description: "Error occurred while fetching the application roles.",
                                message: "Something went wrong"
                            }
                        },
                        fetchAssignedApplicationRoles: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while fetching the assigned application roles"
                            },
                            genericError: {
                                description: "Error occurred while fetching the assigned application roles.",
                                message: "Something went wrong"
                            }
                        }
                    }
                }
            }
        },
        myAccount: {
            fetchMyAccountData: {
                error: {
                    description: "{{description}}",
                    message: "Retrieval error"
                },
                genericError: {
                    description: "Couldn't retrieve My Account portal data.",
                    message: "Something went wrong"
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
            editPage: {
                pageTitle: "My Account",
                description: "Control access to the My Account portal for your users and configure Two-Factor Authentication for the My Account portal.",
                enableEmailOtp: "Enable Email OTP",
                enableSmsOtp: "Enable SMS OTP",
                smsOtpEnableDescription: "To enable, you need to set up the SMS Service for your organization. <1>Learn more</1>",
                enableTotp: "Enable TOTP",
                mfaDescription: "Configure two-factor authentication options for the My Account portal",
                myAccountUrlDescription: "Share this link with your users to access the My Account Portal.",
                backupCodeDescription: "Enable Backup Codes for Two-Factor Authentication.",
                enableBackupCodes: "Enable Backup Codes",
                backupCodeInfo: "To enable backup codes, you need to enable at least one of the two-factor authentication options for the login flow of the My Account portal.",
                EnableTotpEnrollment: "Allow TOTP enrollment during login",
                totpEnrollmentInfo: "If TOTP enrollment is disabled at user login and the user has not already enrolled the TOTP authenticator, the user will be instructed to contact the organization admin for assistance."
            },
            pageTitle: "Self-Service Portal",
            description: "Self-service portal for your users.",
            goBackToApplication: "Go back to Applications",
            goBackToMyAccount: "Go back to Self-Service Portal"
        },
        serverConfigurations: {
            accountManagement: {
                accountRecovery: {
                    heading: "Password Recovery",
                    subHeading:
                        "Configure settings for self-service password recovery to let users " +
                        "reset their password using an email.",
                    toggleName: "Enable password recovery"
                }
            },
            accountRecovery: {
                backButton: "Go back to Account Recovery",
                heading: "Account Recovery",
                passwordRecovery: {
                    form: {
                        fields: {
                            enable: {
                                hint: "Enabling this will let the users reset their password using an email.",
                                label: "Enable"
                            },
                            expiryTime: {
                                hint: "Password recovery link expiry time in minutes.",
                                label: "Recovery link expiry time",
                                placeholder: "Enter expiry time",
                                validations: {
                                    invalid: "Recovery link expiry time should be an integer.",
                                    empty: "Recovery link expiry time cannot be empty.",
                                    range:
                                        "Recovery link expiry time should be between 1 minute & 10080 minutes " +
                                        "(7 days).",
                                    maxLengthReached:
                                        "Recovery link expiry time should be a number with 5 or less " + "digits."
                                }
                            },
                            notifySuccess: {
                                hint:
                                    "This specifies whether to notify the user via an email when password " +
                                    "recovery is successful.",
                                label: "Notify on successful recovery"
                            }
                        }
                    },
                    connectorDescription: "Enable self-service password recovery for users " + "on the login page.",
                    heading: "Password Recovery",
                    notification: {
                        error: {
                            description: "Error updating the password recovery configuration.",
                            message: "Error updating configuration"
                        },
                        success: {
                            description: "Successfully updated the password recovery configuration.",
                            message: "Update successful"
                        }
                    },
                    subHeading:
                        "Enable self-service password recovery for users " +
                        "on the login page.\nThe user will receive a password reset link via email upon request."
                },
                subHeading: "Account Recovery related settings."
            },
            accountSecurity: {
                backButton: "Go back to Account Security",
                heading: "Account Security",
                botDetection: {
                    form: {
                        fields: {
                            enable: {
                                hint: "Enabling this will enforce reCaptcha for both login and recovery.",
                                label: "Enable"
                            }
                        }
                    },
                    info: {
                        heading: "This will enforce reCAPTCHA validation in respective UIs of the following flows.",
                        subSection1: "Login to business applications",
                        subSection2: "Recover the password of a user account",
                        subSection3: "Self registration for user accounts"
                    },
                    connectorDescription: "Enable reCAPTCHA for the organization.",
                    heading: "Bot Detection",
                    notification: {
                        error: {
                            description: "Error updating the bot detection configuration.",
                            message: "Error updating configuration"
                        },
                        success: {
                            description: "Successfully updated the bot detection configuration.",
                            message: "Update successful"
                        }
                    },
                    subHeading: "Enable reCAPTCHA for the organization."
                },
                loginAttemptSecurity: {
                    form: {
                        fields: {
                            accountLockIncrementFactor: {
                                hint:
                                    "This specifies the factor by which the account lock duration should " +
                                    "be incremented on further failed login attempts after the account is locked.",
                                label: "Account lock duration increment factor",
                                placeholder: "Enter lock duration increment factor",
                                validations: {
                                    invalid: "Account lock duration increment factor should be an integer.",
                                    range: "Account lock duration increment factor should be between 1 & 10.",
                                    maxLengthReached:
                                        "Account lock duration increment factor should be a number " +
                                        "with 1 or 2 digits."
                                }
                            },
                            accountLockTime: {
                                hint:
                                    "This specifies the initial duration that the account will be locked for. " +
                                    "The account will be automatically unlocked after this time period.",
                                label: "Account lock duration",
                                placeholder: "Enter lock duration",
                                validations: {
                                    invalid: "Account lock duration should be an integer.",
                                    required: "Account lock duration is a required field.",
                                    range: "Account lock duration should be between 1 minute & 1440 minutes (1 day).",
                                    maxLengthReached: "Account lock duration should be a number with 4 or less digits."
                                }
                            },
                            enable: {
                                hint:
                                    "Account locking will result in sending a mail to the user indicating " +
                                    "that the account has been locked.",
                                label: "Enable"
                            },
                            maxFailedAttempts: {
                                hint:
                                    "This specifies the number of consecutive failed login attempts allowed " +
                                    "before the account is locked.",
                                label: "Number of consecutive failed login attempts",
                                placeholder: "Enter max failed attempts",
                                validations: {
                                    invalid: "Max failed attempts should be an integer.",
                                    required: "Max failed attempts is a required field.",
                                    range: "Max failed attempts should be between 1 & 10.",
                                    maxLengthReached: "Max failed attempts should be a number with 1 or 2 digits."
                                }
                            }
                        }
                    },
                    info:
                        "Once the account is locked, the account owner will be informed via email. The account " +
                        "will be automatically activated after the account lock duration.",
                    connectorDescription:
                        "Protect accounts from password brute-force attacks by locking the " +
                        "account on consecutive failed login attempts.",
                    heading: "Login Attempts",
                    notification: {
                        error: {
                            description: "Error updating the login attempts security configuration.",
                            message: "Error updating configuration"
                        },
                        success: {
                            description: "Successfully updated the login attempts security configuration.",
                            message: "Update successful"
                        }
                    },
                    subHeading:
                        "Protect user accounts from password brute-force attacks by locking " +
                        "the account on consecutive failed login attempts.",
                    howItWorks: {
                        correctPassword: {
                            description: "If the user enters the correct password, the user can successfully log in."
                        },
                        example: {
                            description_plural:
                                "That is, the account will be locked for {{ lockIncrementRatio }} x " +
                                " {{ lockDuration }} = {{ lockTotalDuration }} minutes.",
                            description_singular:
                                "That is, the account will be locked for {{ lockIncrementRatio }} " +
                                "x {{ lockDuration }} = {{ lockTotalDuration }} minute."
                        },
                        incorrectPassword: {
                            description_plural:
                                "If the user tries an incorrect password for another " +
                                "{{ maxAttempts }} consecutive attempts the account lock duration will be incremented" +
                                " by {{ lockIncrementRatio }} times the previous lock duration.",
                            description_singular:
                                "If the user tries an incorrect password for another " +
                                "{{ maxAttempts }} consecutive attempt the account lock duration will be incremented " +
                                "by {{ lockIncrementRatio }} times the previous lock duration."
                        }
                    }
                },
                subHeading: "Configure security settings to protect user accounts."
            },
            additionalSettings: "Additional Settings",
            analytics: {
                heading: "Analytics Engine",
                subHeading: "Configure the analytics engine for your organization.",
                form: {
                    fields: {
                        hostUrl: {
                            label: "Host URL",
                            placeholder: "Enter the host URL",
                            hint: "The URL of the analytics engine."
                        },
                        hostBasicAuthEnable: {
                            label: "Enable Basic Authentication",
                            hint: "Enable basic authentication for the analytics engine."
                        },
                        hostUsername: {
                            label: "Username",
                            placeholder: "Enter the username",
                            hint: "The username to authenticate into the analytics engine."
                        },
                        hostPassword: {
                            label: "Password",
                            placeholder: "Enter the password",
                            hint: "The password to authenticate into the analytics engine."
                        },
                        hostConnectionTimeout: {
                            label: "HTTP Connection Timeout",
                            placeholder: "Enter the connection timeout",
                            hint: "Enter the connection timeout value in milliseconds."
                        },
                        hostReadTimeout: {
                            label: "HTTP Read Timeout",
                            placeholder: "Enter the read timeout",
                            hint: "Enter the read timeout value in milliseconds."
                        },
                        hostConnectionRequestTimeout: {
                            label: "HTTP Connection Request Timeout",
                            placeholder: "Enter the connection request timeout",
                            hint: "Enter the connection request timeout value in milliseconds."
                        },
                        hostNameVerification: {
                            label: "Hostname Verification",
                            placeholder: "Enter the hostname verification",
                            hint: "Enable hostname verification for the analytics engine. (STRICT | ALLOW_ALL)"
                        }
                    },
                    notification: {
                        error: {
                            description: "Error occurred while updating the analytics engine configurations.",
                            message: "Error Occurred"
                        },
                        success: {
                            description: "Successfully updated the analytics engine configurations.",
                            message: "Update Successful"
                        }
                    }
                }
            },
            generalBackButton: "Go back",
            generalDisabledLabel: "Disabled",
            generalEnabledLabel: "Enabled",
            passwordHistoryCount: {
                heading: "Password History Count",
                label1: "Must be different from the last",
                label2: "passwords.",
                message: "Specify the number of unique passwords that a user should use before an old password can be reused."
            },
            passwordExpiry: {
                heading: "Password Expiration",
                label: "Password expires in ",
                timeFormat: "days"
            },
            passwordValidationHeading: "Password Input Validation",
            userOnboarding: {
                backButton: "Go back to Self Registration",
                heading: "Self Registration",
                selfRegistration: {
                    accountVerificationWarning: "To enable the account verification option, you need to make the email " +
                        "attribute mandatory for your organization.",
                    form: {
                        fields: {
                            enable: {
                                hint:
                                    "Allow consumer users to self sign-up for this organization. " +
                                    "When enabled, users will see a link to create an account at the login screen.",
                                label: "Enable"
                            },
                            enableAutoLogin: {
                                label: "Enable auto login",
                                hint:
                                    "If selected, the user will be automatically logged in after registration."
                            },
                            expiryTime: {
                                hint: "The expiry time for the account verification link.",
                                label: "Account verification link expiry time",
                                placeholder: "Enter expiry time",
                                validations: {
                                    invalid: "Expiry time should be an integer.",
                                    empty: "Expiry time cannot be empty.",
                                    range: "Expiry time should be between 1 minute & 10080 minutes (7 days).",
                                    maxLengthReached: "Expiry time should be a number with 5 or less digits."
                                }
                            },
                            activateImmediately: {
                                msg:
                                    "If selected, the new account is activated immediately after registration " +
                                    "without waiting for account confirmation.",
                                hint: "This will enable email verification at the self-registration.",
                                label: "Activate account immediately"
                            },
                            signUpConfirmation: {
                                recommendationMsg:
                                    "It is recommended to enable account verification for " + "self registration.",
                                botMsg: " If not at least enable bot detection.",
                                accountLockMsg:
                                    "Account Verification enables email verification at the " +
                                    "self registration. The new account is activated only after the user verifies " +
                                    "the email",
                                hint: "An email is sent to the self-registered user requesting account verification.",
                                label: "Account verification",
                                confirmation: {
                                    heading: "Are you sure?",
                                    message: "Enable account verification",
                                    content: "Auto login requires account to be activated immediately after the "
                                        + "registration. When you proceed, auto login will be disabled. You can always "
                                        + "re-enable it, when you select <1>Activate account immediately</1> option."
                                }
                            }
                        }
                    },
                    connectorDescription: "Enable self registration for users of the organization.",
                    heading: "Self Registration",
                    notification: {
                        error: {
                            description: "Error updating the self registration configuration.",
                            message: "Error updating configuration"
                        },
                        success: {
                            description: "Successfully updated the self registration configuration.",
                            message: "Update successful"
                        }
                    },
                    subHeading:
                        "When self registration is enabled, users can register via the " +
                        "<1>Create an account</1> link on the application’s login page. This creates a new " +
                        "<3>user</3> account in the organization."
                },
                inviteUserToSetPassword: {
                    notification: {
                        error: {
                            description: "Failed to update the configuration for the Invite User to Set Password connector.",
                            message: "Error updating configuration"
                        },
                        success: {
                            description: "Successfully updated the configuration for the Invite User to Set Password connector.",
                            message: "Update successful"
                        }
                    }
                },
                subHeading: "Self Registration related settings."
            }
        },
        users: {
            administratorSettings: {
                administratorSettingsSubtitle: "Settings related to organizational administrators.",
                administratorSettingsTitle: "Administrator Settings",
                backButton: "Go back to administrators",
                disableToggleMessage: "Enable users to manage the organization",
                enableToggleMessage: "Disable users to manage the organization",
                error: {
                    description: "{{description}}",
                    message: "Error while updating the configuration"
                },
                genericError: {
                    description: "Couldn't update the configuration",
                    message: "Something went wrong"
                },
                success: {
                    description: "Successfully updated the configuration.",
                    message: "Configuration update successful"
                },
                toggleHint: "If enabled, users can be assigned with administrative capabilities."
            },
            usersTitle: "Users",
            usersSubTitle: "Users who can access applications within the organization are managed here.",
            collaboratorsTitle: "Organization Administrators",
            collaboratorsSubTitle: "Users who have access to your organization's administrative operations are " +
                "managed here.",
            editUserProfile: {
                userId: "User ID",
                disclaimerMessage:
                    "This user profile belongs to a collaborator or an organization owner. Only the" +
                    " account owner can manage the profile via the My Account app.",
                accountLock: {
                    title: "Lock user",
                    description:
                        "Once you lock the account, the user can no longer sign in to the system. " +
                        "Please be certain."
                },
                resetPassword: {
                    changePasswordModal: {
                        emailUnavailableWarning: "WARNING: Cannot find an email address for the user account." +
                            "Please provide an email address to proceed with inviting the user to reset the password.",
                        emailResetWarning: "An email with a link to reset the password will be sent to the provided " +
                            "email address for the user to set their own password.",
                        passwordResetConfigDisabled: "Password reset via recovery email is not enabled. Please make " +
                            "sure to enable it from <1> " +
                            " Login and Registration </1> configurations."
                    }
                }
            },
            buttons: {
                addUserBtn: "Add User",
                addCollaboratorBtn: "Add Administrator"
            },
            collaboratorAccounts: {
                consoleInfo: "Share this link with the users who have administrative priviledges " +
                    "to allow access to Console"
            },
            list: {
                columns: {
                    user: "User",
                    accountType: "Account Type",
                    idpType: "Managed By",
                    userStore: "User Store"
                },
                popups: {
                    content: {
                        AccountTypeContent: "The user's relation to this organization.",
                        idpTypeContent: "The entity that manages the user's identity and credentials.",
                        sourceContent: "The data store where the user information is stored."
                    }
                }
            },
            descriptions: {
                allUser: "All the users within your organization are listed here.",
                consumerAppInfo:
                    "Share this link with your users to allow access to My Account and to manage their accounts.",
                consumerUser:
                    "Users who can access applications within the organization are listed here." +
                    " Admins can onboard users to the organization or the users can sign up if" +
                    " Admins can onboard users to the organization or the users can sign up if" +
                    " Admins can onboard users to the organization or the users can sign up if" +
                    " Admins can onboard users to the organization or the users can sign up if" +
                    " Admins can onboard users to the organization or the users can sign up if" +
                    " Admins can onboard users to the organization or the users can sign up if" +
                    " Admins can onboard users to the organization or the users can sign up if" +
                    " self-registration is enabled.",
                guestUser:
                    "Users who have access to your organization's administrative operations" +
                    " (application onboarding, user management, etc.) are listed here." +
                    " Admins can invite users as administrators to the organization and assign roles.",
                learnMore: "Learn More"
            },
            notifications: {
                addUser: {
                    customerUser: {
                        limitReachError: {
                            description: "Maximum number of allowed users have been reached.",
                            message: "Error adding the new user"
                        }
                    }
                }
            },
            wizard: {
                addAdmin: {
                    external: {
                        subtitle: "Invite an external administrator to manage your organization. This user " +
                            "will receive an email invitation they can accept " +
                            "in order to begin collaborating.",
                        title: "Add Administrator"
                    },
                    internal: {
                        hint: "Only the users listed in the users section can be added as administrators.",
                        searchPlaceholder: "Search by email",
                        emptySearchQueryPlaceholder: "To begin, search users by typing the email. You may have to type the complete email address.",
                        emptySearchResultsPlaceholder: "We couldn't find any results for search. Please try with the complete email address.",
                        selectUser: "Select User",
                        subtitle: "Make existing users administrators of your organization. An email notification " +
                            "will be sent to the users indicating the change.",
                        title: "Add Administrator",
                        updateRole: {
                            error: {
                                description: "{{ description }}",
                                message: "Error Adding Administrator"
                            },
                            genericError: {
                                description: "An error occurred while adding the administrator.",
                                message: "Error Adding Administrator"
                            },
                            success: {
                                description: "Successfully added administrator.",
                                message: "Administrator Added"
                            }
                        }
                    }
                },
                addUser: {
                    subtitle: "Follow the steps to add a new user.",
                    title: "Add User"
                }
            }
        },
        admins: {
            editPage: {
                backButton: "Go back to Admins"
            }
        },
        invite: {
            notifications: {
                sendInvite: {
                    limitReachError: {
                        description: "Maximum number of allowed collaborator users have been reached.",
                        message: "Error while sending the invitation"
                    }
                }
            }
        },
        guest: {
            deleteUser: {
                confirmationModal: {
                    content:
                        "However, the user's account is not permanently deleted from the system and " +
                        "they will still be able to access other organizations they are associated with.",
                    message:
                        "This action is irreversible and will remove the user's association with " +
                        "this organization."
                }
            },
            editUser: {
                dangerZoneGroup: {
                    deleteUserZone: {
                        subheader:
                            "This action will remove the user's association with this organization. " +
                            "Please be certain before you proceed."
                    }
                }
            }
        },
        sidePanel: {
            categories: {
                attributeManagement: "Attribute Management",
                AccountManagement: "Account Management",
                userManagement: "User Management",
                organizationSettings: "Organization Settings"
            }
        }
    }
};
