/**
 * Copyright (c) 2021-2025, WSO2 LLC. (https://www.wso2.com).
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

import { FormAttributes, Notification, NotificationItem } from "@wso2is/i18n";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Extensions {
    develop: {
        apiResource: {
            resourceTypes: {
                api: string;
                mcp: string;
            },
            pageHeader: {
                description: string;
                subOrgDescription: string;
                title: string;
            };
            empty: string;
            managedByChoreoText: string;
            apiResourceError: {
                subtitles: {
                    0: string;
                    1: string;
                },
                title: string;
            };
            addApiResourceButton: string;
            businessAPI: {
                header: string;
                description: string;
            };
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
            consoleFeature: {
                header: string;
                description: string;
            }
            managementAPI: {
                header: string;
                description: string;
            };
            notifications: {
                deleteAPIResource: {
                    unauthorizedError: {
                        description: string;
                        message: string;
                    };
                    notFoundError: {
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
                getAPIResource: {
                    unauthorizedError: {
                        description: string;
                        message: string;
                    };
                    notFoundError: {
                        description: string;
                        message: string;
                    };
                    genericError: {
                        description: string;
                        message: string;
                    };
                };
                getAPIResources: {
                    unauthorizedError: {
                        description: string;
                        message: string;
                    };
                    genericError: {
                        description: string;
                        message: string;
                    };
                };
                updateAPIResource: {
                    invalidPayloadError: {
                        description: string;
                        message: string;
                    };
                    unauthorizedError: {
                        description: string;
                        message: string;
                    };
                    notFoundError: {
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
                addAPIResource: {
                    invalidPayloadError: {
                        description: string;
                        message: string;
                    };
                    unauthorizedError: {
                        description: string;
                        message: string;
                    };
                    alreadyExistsError: {
                        description: string;
                        message: string;
                    };
                    permissionAlreadyExistsError: {
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
            };
            organizationAPI: {
                header: string;
                description: string;
            }
            table: {
                name: {
                    column: string;
                }
                identifier: {
                    column: string;
                    label: string;
                };
                actions: {
                    column: string;
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
            };
            tabs: {
                apiResourceError: {
                    subtitles: {
                        0: string;
                        1: string;
                    },
                    title: string;
                };
                title: string;
                backButton: string;
                choreoApiEditWarning: string;
                general: {
                    dangerZoneGroup: {
                        header: string;
                        deleteApiResource: {
                            header: string;
                            subHeading: string;
                            button: string;
                        };
                        deleteChoreoApiResource?: {
                            header: string;
                            subHeading: string;
                            button: string;
                        };
                    };
                    form: {
                        fields: {
                            name: {
                                emptyValidate: string,
                                label: string;
                                placeholder: string;
                            };
                            identifier: {
                                hint: string;
                                label: string;
                            };
                            gwName: {
                                hint: string;
                                label: string;
                            };
                            description: {
                                label: string;
                                placeholder: string;
                            };
                        };
                        updateButton: string;
                    };
                    label: string;
                };
                authorization: {
                    form: {
                        fields: {
                            authorize: {
                                label: string;
                                hint: string;
                            };
                        };
                    };
                    label: string;
                };
                permissions: {
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
                    removePermissionPopupText: string;
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
                            permission: {
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
                }
            };
            wizard: {
                addApiResource: {
                    cancelButton: string;
                    nextButton: string;
                    previousButton: string;
                    submitButton: string;
                    title: string;
                    subtitle: string;
                    steps: {
                        basic: {
                            stepTitle: string;
                            form: {
                                fields: {
                                    name: {
                                        emptyValidate: string;
                                        label: string;
                                        hint: string;
                                        placeholder: string;
                                    };
                                    identifier: {
                                        emptyValidate: string;
                                        alreadyExistsError: string;
                                        errorOccurred: string;
                                        invalid: string;
                                        hint: string;
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
                        authorization: {
                            stepTitle: string;
                            form: {
                                rbacMessage: string;
                                fields: {
                                    authorize: {
                                        label: string;
                                        hint: string;
                                    };
                                };
                            };
                        };
                        permissions: {
                            emptyPlaceHolder: string;
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
                                        errorOccurred: string;
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
                            }
                        }
                    }
                };
            };
        };
        applications: {
            asgardeoTryIt: {
                description: string;
            },
            edit: {
                sections: {
                    signInMethod: {
                        sections: {
                            authenticationFlow: {
                                sections: {
                                    stepBased: {
                                        secondFactorDisabled: string;
                                    };
                                };
                            };
                        };
                    };
                    resourceAuthorization: {
                        title: string;
                    };
                    apiAuthorization: {
                        title: string;
                        resourceText: {
                            apiResource: string;
                            genericResource: string;
                        };
                        sections: {
                            apiSubscriptions: {
                                heading: string;
                                subHeading: string;
                                search: string;
                                unsubscribeAPIResourcePopOver: string;
                                allAPIAuthorizedPopOver: string;
                                choreoApiEditWarning: string;
                                buttons: {
                                    subAPIResource: string;
                                    noAPIResourcesLink: string;
                                    emptySearchButton: string;
                                };
                                placeHolderTexts: {
                                    emptyText: string;
                                    noAPIResources: string;
                                    errorText: {
                                        subtitles: {
                                            0: string;
                                            1: string;
                                        };
                                        title: string;
                                    };
                                    emptySearch: {
                                        title: string;
                                        subTitle: {
                                            0: string;
                                            1: string;
                                        };
                                    };
                                };
                                notifications: {
                                    unSubscribe: {
                                        unauthorizedError: {
                                            description: string;
                                            message: string;
                                        };
                                        notFoundError: {
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
                                    },
                                    patchScopes: {
                                        unauthorizedError: {
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
                                    },
                                    createAuthorizedAPIResource: {
                                        unauthorizedError: {
                                            description: string;
                                            message: string;
                                        };
                                        initialError: {
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
                                    }
                                };
                                confirmations: {
                                    unsubscribeAPIResource: {
                                        assertionHint: string;
                                        content: string;
                                        header: string;
                                        message: string;
                                    };
                                    unsubscribeChoreoAPIResource: {
                                        content: string;
                                    };
                                };
                                scopesSection: {
                                    label: string;
                                    placeholder: string;
                                    hint: string;
                                    updateButton: string;
                                    copyScopesHint: string;
                                    selectAll: string;
                                    selectNone: string;
                                };
                                wizards: {
                                    authorizeAPIResource: {
                                        title: string;
                                        subTitle: string;
                                        fields: {
                                            apiResource: {
                                                label: string;
                                                placeholder: string;
                                                requiredErrorMessage: string;
                                            };
                                            scopes: {
                                                label: string;
                                                placeholder: string;
                                                hint: string;
                                            };
                                            policy: {
                                                label: string;
                                                hint: string;
                                            };
                                        };
                                        rbacPolicyMessage: string;
                                        buttons: {
                                            finish: string;
                                            cancel: string;
                                        };
                                    };
                                };
                            };
                            policySection: {
                                heading: string;
                                subHeading: string;
                                buttons: {
                                    update: string;
                                };
                                messages: {
                                    noPolicy: string;
                                    noClientCredentials: string;
                                };
                                form: {
                                    fields: {
                                        userPolicy: {
                                            label: string;
                                        };
                                        rbac: {
                                            label: string;
                                            name: string;
                                            hint: string;
                                        };
                                        consent: {
                                            label: string;
                                            hint: string;
                                        };
                                        appPolicy: {
                                            label: string;
                                            hint: string;
                                        };
                                        noPolicy: {
                                            name: string;
                                            hint: string;
                                        };
                                    };
                                };
                                notifications: {
                                    getPolicies: {
                                        genericError: {
                                            description: string;
                                            message: string;
                                        };
                                    },
                                    patchPolicies: {
                                        unauthorizedError: {
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
                                    }
                                };
                            }
                        },
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
                                    roleName: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                        validations: {
                                            duplicate: string;
                                            empty: string;
                                            invalid: string;
                                        }
                                    }
                                };
                                rolePermissions: {
                                    label: string;
                                    searchPlaceholer: string;
                                };
                            };
                            heading: string;
                            subHeading: string;
                            wizardSteps: {
                                0: string;
                                1: string;
                            };
                        };
                        title: string;
                        heading: string;
                        subHeading: string;
                        subHeadingAlt: string;
                        buttons: {
                            newRole: string;
                        };
                        labels: {
                            apiResource: string;
                            selectAllPermissions: string;
                        };
                        advancedSearch: {
                            form: {
                                inputs: {
                                    filterValue: {
                                        placeholder: string;
                                    }
                                }
                            };
                            placeholder: string;
                        };
                        list: {
                            columns: {
                                actions: string;
                                name: string;
                            };
                        };
                        editModal: {
                            heading: string;
                            readonlyHeading: string;
                            subHeading: string;
                            readonlySubHeading: string;
                            searchPlaceholer: string;
                        };
                        deleteRole: {
                            confirmationModal: {
                                assertionHint: string;
                                header: string;
                                content: string;
                                message: string;
                            };
                        };
                        placeHolders: {
                            emptyList: {
                                action: string;
                                subtitles: {
                                    0: string;
                                };
                                title: string;
                            };
                            emptySearchResults: {
                                action: string;
                                subtitles: {
                                    0: string;
                                    1: string;
                                };
                                title: string;
                            };
                            emptyPermissions: {
                                subtitles: {
                                    0: string;
                                };
                            };
                        };
                        notifications: {
                            createApplicationRole: {
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
                            updatePermissions: {
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
                            deleteApplicationRole: {
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
                                }
                            };
                            fetchApplicationRoles: {
                                error: {
                                    description: string;
                                    message: string;
                                };
                                genericError: {
                                    description: string;
                                    message: string;
                                }
                            };
                            fetchAuthorizedAPIs: {
                                error: {
                                    description: string;
                                    message: string;
                                };
                                genericError: {
                                    description: string;
                                    message: string;
                                };
                            };
                        };
                    };
                    rolesV2: {
                        heading: string;
                        subHeading: string;
                        roleAudience: string;
                        organization: string;
                        application: string;
                        assignedRoles: string;
                        removedRoles: string;
                        searchPlaceholder: string;
                        switchRoleAudience: {
                            applicationConfirmationModal: {
                                assertionHint: string;
                                header: string;
                                content: string;
                                message: string;
                            };
                            organizationConfirmationModal: {
                                assertionHint: string;
                                header: string;
                                content: string;
                                message: string;
                            };
                        };
                    }
                };
            };
            quickstart: {
                mobileApp: {
                    tabHeading: string;
                    technologyInfo: string;
                    configurations: {
                        anyTechnology: string;
                        heading: string;
                        generalDescription: string;
                        protocolDescription: string;
                        redirectURI: {
                            label: string;
                        };
                        scope: {
                            label: string;
                        };
                        discoveryURI: {
                            label: string;
                            info: string;
                        };
                        moreInfoDescription: string;
                    };
                };
                spa: {
                    common: {
                        addTestUser: {
                            title: string;
                        };
                        prerequisites: {
                            angular: string;
                            node: string;
                        };
                    };
                    integrate: {
                        common: {
                            sdkConfigs: {
                                clientId: {
                                    hint: string;
                                };
                                scope: {
                                    hint: string;
                                };
                                serverOrigin: {
                                    hint: string;
                                };
                                signInRedirectURL: {
                                    hint: {
                                        content: string;
                                        multipleWarning: string;
                                    };
                                };
                                signOutRedirectURL: {
                                    hint: {
                                        content: string;
                                        multipleWarning: string;
                                    };
                                };
                            };
                        };
                    };
                    samples: {
                        exploreMoreSamples: string;
                    };
                };
                twa: {
                    setup: {
                        skipURIs: string;
                    };
                };
                m2m: {
                    configurations: {
                        clientId: {
                            hint: string;
                        },
                        clientSecret: {
                            hint: string;
                        },
                        tokenEndpoint: string,
                        scopes: string,
                        tokenRequest: string
                    }
                }
            };
        };
        branding: {
            confirmations: {
                revertBranding: {
                    assertionHint: string;
                    content: string;
                    header: string;
                    message: string;
                };
                unpublishBranding: {
                    assertionHint: string;
                    enableContent: string;
                    disableContent: string;
                    header: string;
                    enableMessage: string;
                    disableMessage: string;
                }
            };
            dangerZoneGroup: {
                header: string;
                revertBranding: {
                    actionTitle: string;
                    disableHint: string;
                    header: string;
                    subheader: string;
                };
                unpublishBranding: {
                    actionTitle: string;
                    disableHint: string;
                    header: string;
                    subheader: string;
                };
            };
            forms: {
                advance: {
                    links: {
                        fields: {
                            common: {
                                validations: {
                                    invalid: string;
                                };
                            };
                            cookiePolicyURL: {
                                hint: string;
                                label: string;
                                placeholder: string;
                            };
                            privacyPolicyURL: {
                                hint: string;
                                label: string;
                                placeholder: string;
                            };
                            recoveryPortalURL: {
                                hint: string;
                                label: string;
                                placeholder: string;
                            };
                            selfSignUpURL: {
                                hint: string;
                                label: string;
                                placeholder: string;
                            };
                            termsOfUseURL: {
                                hint: string;
                                label: string;
                                placeholder: string;
                            };
                        };
                        heading: string;
                    };
                };
                design: {
                    layout: {
                        headings: {
                            fields: {
                                productTagline: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                            };
                            heading: string;
                        },
                        images: {
                            logo: {
                                heading: string;
                                fields: {
                                    alt: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    url: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                };
                                preview: string;
                            };
                        },
                        variations: {
                            fields: {
                                centered: {
                                    imgAlt: string;
                                    label: string;
                                };
                                "custom": {
                                    imgAlt: string;
                                    label: string;
                                };
                                "left-aligned": {
                                    imgAlt: string;
                                    label: string;
                                };
                                "left-image": {
                                    imgAlt: string;
                                    label: string;
                                };
                                "right-aligned": {
                                    imgAlt: string;
                                    label: string;
                                };
                                "right-image": {
                                    imgAlt: string;
                                    label: string;
                                };
                            };
                        };
                    },
                    theme: {
                        buttons: {
                            externalConnections: {
                                fields: {
                                    backgroundColor: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    borderRadius: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    fontColor: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                };
                                heading: string;
                            };
                            heading: string;
                            primary: {
                                fields: {
                                    borderRadius: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    fontColor: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                };
                                heading: string;
                            };
                            secondary: {
                                fields: {
                                    borderRadius: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    fontColor: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                };
                                heading: string;
                            };
                        };
                        colors: {
                            alerts: {
                                fields: {
                                    error: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    info: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    neutral: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    warning: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                };
                                heading: string;
                            };
                            bodyBackground: {
                                fields: {
                                    main: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                };
                                heading: string;
                            };
                            fields: {
                                primaryColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                                secondaryColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                            };
                            heading: string;
                            illustrations: {
                                fields: {
                                    accentColor1: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    accentColor2: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    accentColor3: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    primaryColor: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    secondaryColor: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                };
                                heading: string;
                                preview: string;
                            };
                            outlines: {
                                fields: {
                                    main: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                };
                                heading: string;
                            };
                            surfaceBackground: {
                                fields: {
                                    dark: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    inverted: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    light: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    main: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                };
                                heading: string;
                            };
                            text: {
                                fields: {
                                    primary: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    secondary: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                };
                                heading: string;
                            };
                        };
                        font: {
                            fields: {
                                fontFamilyDropdown: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                                fontFamilyInput: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                                importURL: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                            };
                            heading: string;
                            types: {
                                fromCDN: string;
                                fromDefaults: string;
                            };
                        };
                        footer: {
                            fields: {
                                borderColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                                fontColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                            };
                            heading: string;
                        },
                        headings: {
                            fields: {
                                fontColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                            };
                            heading: string;
                        },
                        images: {
                            favicon: {
                                fields: {
                                    url: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                };
                                heading: string;
                                preview: string;
                            };
                            heading: string;
                            logo: {
                                heading: string;
                                fields: {
                                    alt: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    url: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                };
                                preview: string;
                            };
                            myAccountLogo: {
                                fields: {
                                    alt: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    title: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    url: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                };
                                heading: string;
                                preview: string;
                            };
                        };
                        inputs: {
                            fields: {
                                backgroundColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                                borderColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                                borderRadius: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                                fontColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                            };
                            heading: string;
                            labels: {
                                fields: {
                                    fontColor: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                };
                                heading: string;
                            };
                        };
                        loginBox: {
                            fields: {
                                backgroundColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                                borderColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                                borderRadius: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                                borderWidth: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                                fontColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                            };
                            heading: string;
                        };
                        loginPage: {
                            fields: {
                                backgroundColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                                fontColor: {
                                    hint: string;
                                    label: string;
                                    placeholder: string;
                                };
                            };
                            heading: string;
                        };
                        variations: {
                            fields: {
                                dark: {
                                    label: string;
                                };
                                light: {
                                    label: string;
                                };
                            };
                        };
                    };
                };
                general: {
                    fields: {
                        supportEmail: {
                            hint: string;
                            label: string;
                            placeholder: string;
                        };
                        displayName: {
                            hint: string;
                            label: string;
                            placeholder: string;
                        };
                    };
                };
            };
            notifications: {
                delete: {
                    genericError: {
                        description: string;
                        message: string;
                    };
                    invalidStatus: {
                        description: string;
                        message: string;
                    };
                    notConfigured: {
                        description: string;
                        message: string;
                    };
                    success: {
                        description: string;
                        message: string;
                    };
                    successWaiting: {
                        description: string;
                        message: string;
                    };
                    successWaitingAlert: {
                        description: string;
                        message: string;
                    };
                };
                customTextPreferenceDelete: {
                    genericError: {
                        description: string;
                        message: string;
                    },
                    success: {
                        description: string;
                        message: string;
                    }
                };
                fetch: {
                    customLayoutNotFound: {
                        appBrandingDescription: string;
                        description: string;
                        message: string;
                    };
                    genericError: {
                        description: string;
                        message: string;
                    };
                    invalidStatus: {
                        description: string;
                        message: string;
                    };
                    tenantMismatch: {
                        description: string;
                        message: string;
                    };
                };
                update: {
                    genericError: {
                        description: string;
                        message: string;
                    };
                    invalidStatus: {
                        description: string;
                        message: string;
                    };
                    success: {
                        description: string;
                        message: string;
                    };
                    successWaiting: {
                        description: string;
                        message: string;
                    };
                    successWaitingAlert: {
                        description: string;
                        message: string;
                    };
                    tenantMismatch: {
                        description: string;
                        message: string;
                    };
                };
            };
            pageHeader: {
                application: string;
                applicationBrandingtitle: string;
                applicationBrandingDescription: string;
                applicationListWarning: string;
                defaultBrandingAppliedMessage: string;
                backButtonText: string;
                description: string;
                organization: string;
                organizationBrandingtitle: string;
                selectApplication: string;
                title: string;
            };
            pageResolution: {
                hint: string;
            };
            publishToggle: {
                hint: string;
                label: string;
                enabled: string;
                disabled: string;
            };
            tabs: {
                advance: {
                    label: string;
                };
                design: {
                    label: string;
                    sections: {
                        imagePreferences: {
                            description: string;
                            heading: string;
                        };
                        layoutVariation: {
                            description: string;
                            heading: string;
                            status: string;
                        };
                        themePreferences: {
                            description: string;
                            heading: string;
                        };
                        themeVariation: {
                            description: string;
                            heading: string;
                        };
                    };
                };
                general: {
                    customRequest: {
                        description: string;
                        heading: string;
                    };
                    label: string;
                };
                preview: {
                    disclaimer: string;
                    errors: {
                        layout: {
                            notFound: {
                                subTitle: string;
                                title: string;
                            };
                            notFoundWithSupport: {
                                description: string;
                                subTitle: string;
                                title: string;
                            };
                        };
                    };
                    info: {
                        layout: {
                            activatedMessage: {
                                description: string;
                                subTitle: string;
                                title: string;
                            }
                        }
                    }
                    label: string;
                };
            };
        };
        emailProviders: {
            configureEmailTemplates: string;
            heading: string;
            subHeading: string;
            description: string;
            note: string;
            info: string;
            updateButton: string;
            sendTestMailButton: string;
            goBack: string,
            confirmationModal: {
                header: string;
                message: string;
                content: string;
                assertionHint: string;
            };
            dangerZoneGroup: {
                header: string;
                revertConfig: {
                    heading: string;
                    subHeading: string;
                    actionTitle: string;
                }
            };
            form: {
                smtpServerHost: {
                    label: string;
                    placeholder: string;
                    hint: string;
                };
                smtpPort: {
                    label: string;
                    placeholder: string;
                    hint: string;
                };
                fromAddress: {
                    label: string;
                    placeholder: string;
                    hint: string;
                };
                replyToAddress: {
                    label: string;
                    placeholder: string;
                    hint: string;
                };
                userName: {
                    label: string;
                    placeholder: string;
                    hint: string;
                };
                password: {
                    label: string;
                    placeholder: string;
                    hint: string;
                };
                displayName: {
                    label: string;
                    placeholder: string;
                    hint: string;
                };
                validations: {
                    required: string;
                    portInvalid: string;
                    emailInvalid: string;
                };
            }
            notifications: {
                getConfiguration: {
                    error: {
                        description: string;
                        message: string;
                    };
                };
                deleteConfiguration: {
                    success: {
                        description: string;
                        message: string;
                    };
                    error: {
                        description: string;
                        message: string;
                    };
                };
                updateConfiguration: {
                    success: {
                        description: string;
                        message: string;
                    };
                    error: {
                        description: string;
                        message: string;
                    };
                }
            };
        };
        emailAndSms: {
            heading: string;
            title: string;
            description: string;
            goBack: string;
        };
        notificationChannel: {
            heading: string;
            title: string;
            description: string;
        };
        identityProviders: {
            apple: {
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    connectApp: {
                        description: string;
                    };
                    heading: string;
                    subHeading: string;
                    steps: {
                        customizeFlow: {
                            content: string;
                            heading: string;
                        };
                        selectApplication: {
                            content: string;
                            heading: string;
                        };
                        selectDefaultConfig: {
                            content: string;
                            heading: string;
                        };
                    };
                };
            };
            emailOTP: {
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    connectApp: {
                        description: string;
                    };
                    heading: string;
                    subHeading: string;
                    steps: {
                        customizeFlow: {
                            content: string;
                            heading: string;
                        };
                        selectApplication: {
                            content: string;
                            heading: string;
                        };
                        selectEmailOTP: {
                            content: string;
                            heading: string;
                        };
                    };
                };
            };
            smsOTP: {
                settings: {
                    smsOtpEnableDisableToggle: {
                        labelEnable: string;
                        labelDisable: string;
                    };
                    choreoAsSMSProvider: {
                        title: string;
                        enableRequiredNote: {
                            message: string;
                        },
                    };
                    errorNotifications: {
                        notificationSendersRetrievalError: {
                            message: string;
                            description: string;
                        };
                        smsPublisherCreationError: {
                            message: string;
                            description: string;
                        };
                        smsPublisherDeletionError: {
                            generic: {
                                message: string;
                                description: string;
                            };
                            activeSubs: {
                                message: string;
                                description: string;
                            };
                            connectedApps: {
                                message: string;
                                description: string;
                            }
                        };
                    }
                };
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    connectApp: {
                        description: string;
                    };
                    heading: string;
                    subHeading: string;
                    steps: {
                        selectApplication: {
                            content: string;
                            heading: string;
                        };
                        selectSMSOTP: {
                            content: string;
                            heading: string;
                        };
                    };
                };
            };
            pushAuth: {
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    connectApp: {
                        description: string;
                    };
                    heading: string;
                    subHeading: string;
                    steps: {
                        selectApplication: {
                            content: string;
                            heading: string;
                        };
                        selectPushAuth: {
                            content: string;
                            heading: string;
                        };
                    };
                }
            },
            facebook: {
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    connectApp: {
                        description: string;
                    };
                    heading: string;
                    subHeading: string;
                    steps: {
                        customizeFlow: {
                            content: string;
                            heading: string;
                        };
                        selectApplication: {
                            content: string;
                            heading: string;
                        };
                        selectDefaultConfig: {
                            content: string;
                            heading: string;
                        };
                    };
                };
            };
            github: {
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    connectApp: {
                        description: string;
                    };
                    heading: string;
                    subHeading: string;
                    steps: {
                        customizeFlow: {
                            content: string;
                            heading: string;
                        };
                        selectApplication: {
                            content: string;
                            heading: string;
                        };
                        selectDefaultConfig: {
                            content: string;
                            heading: string;
                        };
                    };
                };
            };
            google: {
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    connectApp: {
                        description: string;
                    };
                    heading: string;
                    subHeading: string;
                    steps: {
                        customizeFlow: {
                            content: string;
                            heading: string;
                        };
                        selectApplication: {
                            content: string;
                            heading: string;
                        };
                        selectDefaultConfig: {
                            content: string;
                            heading: string;
                        };
                    };
                };
            };
            microsoft: {
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    connectApp: {
                        description: string;
                    };
                    heading: string;
                    subHeading: string;
                    steps: {
                        customizeFlow: {
                            content: string;
                            heading: string;
                        };
                        selectApplication: {
                            content: string;
                            heading: string;
                        };
                        selectDefaultConfig: {
                            content: string;
                            heading: string;
                        };
                    };
                };
            };
            hypr: {
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    connectApp: {
                        description: string;
                    };
                    heading: string;
                    subHeading: string;
                    steps: {
                        configureLogin: {
                            heading: string;
                            addHypr: string;
                            conditionalAuth: string;
                            update: string;
                        };
                        customizeFlow: {
                            content: string;
                            heading: string;
                        };
                        selectApplication: {
                            content: string;
                            heading: string;
                        };
                        selectDefaultConfig: {
                            content: string;
                            heading: string;
                        };
                    };
                };
            };
            siwe: {
                forms: {
                    authenticatorSettings: {
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
                                openid: {
                                    description: string;
                                };
                                profile: {
                                    description: string;
                                };
                            };
                        };
                    };
                };
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    connectApp: {
                        description: string;
                    };
                    heading: string;
                    steps: {
                        customizeFlow: {
                            content: string;
                            heading: string;
                        };
                        selectApplication: {
                            content: string;
                            heading: string;
                        };
                        selectDefaultConfig: {
                            content: string;
                            heading: string;
                        };
                    };
                    subHeading: string;
                };
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
                        connectionDescription: string;
                        heading: string;
                        idpDescription: string;
                    };
                    preRequisites: {
                        clientRegistrationDocs: string;
                        configureClient: string;
                        configureRedirectURI: string;
                        getCredentials: string;
                        heading: string;
                    };
                    subHeading: string;
                };
            };
            totp: {
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    heading: string;
                    steps: {
                        customizeFlow: {
                            content: string;
                            heading: string;
                        };
                        selectApplication: {
                            content: string;
                            heading: string;
                        };
                        selectTOTP: {
                            content: string;
                            heading: string;
                        };
                    };
                    subHeading: string;
                };
            };
            fido: {
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    heading: string;
                    passkeys: {
                        docLinkText: string;
                        heading: string;
                        content: string;
                    };
                    steps: {
                        customizeFlow: {
                            content: string;
                            heading: string;
                        };
                        selectApplication: {
                            content: string;
                            heading: string;
                        };
                        selectFIDO: {
                            content: string;
                            heading: string;
                        };
                        configureParameters: {
                            heading: string;
                            content: {
                                parameters: {
                                    progressiveEnrollment: {
                                        description: string;
                                        label: string;
                                        note: string;
                                    };
                                    usernamelessAuthentication: {
                                        description: string;
                                        label: string;
                                    };
                                };
                                steps: {
                                    info: string;
                                    1: string;
                                    2: string;
                                    3: string;
                                }
                            };
                        };
                    };
                    subHeading: string;
                };
            };
            magicLink: {
                quickStart: {
                    addLoginModal: {
                        heading: string;
                        subHeading: string;
                    };
                    heading: string;
                    steps: {
                        customizeFlow: {
                            content: string;
                            heading: string;
                        };
                        selectApplication: {
                            content: string;
                            heading: string;
                        };
                        selectMagicLink: {
                            content: string;
                            heading: string;
                        };
                    };
                    subHeading: string;
                };
            };
        };
        monitor: {
            logs: {
                tabs: {
                    audit: string,
                    diagnostic: string
                }
            },
            filter: {
                advancedSearch: {
                    attributes: {
                        placeholder: string;
                    };
                    fields: {
                        value: {
                            placeholder: string;
                        };
                    };
                    buttons: {
                        submit: {
                            label: string;
                        };
                    };
                    title: string;
                };
                dropdowns: {
                    timeRange: {
                        custom: {
                            labels: {
                                from: string;
                                timeZone: string;
                                to: string;
                            };
                        };
                        texts: {
                            0: string,
                            1: string,
                            2: string,
                            3: string,
                            4: string,
                            5: string,
                            6: string,
                            7: string,
                            8: string,
                            9: string
                        };
                    };
                    timeZone: {
                        placeholder: string;
                    };
                };
                topToolbar: {
                    buttons: {
                        addFilter: {
                            label: string;
                        };
                        clearFilters: {
                            label: string;
                        };
                    };
                };
                searchBar: {
                    placeholderDiagnostic: string;
                    placeholderAudit: string;
                };
                refreshMessage: {
                    text: string;
                    tooltipText: string;
                };
                refreshButton: {
                    label: string;
                };
                queryButton: {
                    label: string;
                };
                downloadButton: {
                    label : string;
                };
                viewButton: {
                    label : string;
                };
                delayMessage: {
                    text: string;
                }
            };
            logView: {
                toolTips: {
                    seeMore: string;
                };
                headers: {
                    recordedAt: string,
                    actionId: string,
                    targetId: string
                },
                logDataviewer : {
                    panelName: string,
                    download: string,
                    copy: string,
                    close: string
                }
            };
            notifications: {
                genericError: {
                    subtitle: {
                        0: string;
                        1: string;
                    };
                    title: string;
                };
                emptyFilterResult: {
                    actionLabel: string;
                    subtitle: {
                        0: string;
                        1: string;
                    };
                    title: string;
                };
                emptySearchResult: {
                    actionLabel: string;
                    subtitle: {
                        0: string;
                        1: string;
                    };
                    title: string;
                };
                emptyResponse: {
                    subtitle: {
                        0: string;
                        1: string;
                    };
                    title: string;
                };
                startTimeGreaterThanCurrentError: {
                    subtitle: {
                        0: string;
                        1: string;
                    };
                    title: string;
                };
                endTimeGreaterThanStartTimeError: {
                    subtitle: {
                        0: string;
                        1: string;
                    };
                    title: string;
                };
            };
            pageHeader: {
                description: string;
                title: string;
            };
            tooltips: {
                copy: string;
            };
        };
        sidePanel: {
            apiResources: string;
            mcpServers: string;
            branding: string;
            stylesAndText: string;
            monitor: string;
            categories: {
                apiResources: string;
                branding: string;
                monitor: string;
                emailProvider: string;
                smsProvider: string;
            };
            emailProvider: string;
            smsProvider: string;
            eventPublishing: string;
            emailTemplates: string;
            organizationInfo: string;
        };
        eventPublishing: {
            eventsConfiguration: {
                heading: string;
                subHeading: string;
                formHeading: string;
                form: {
                    updateButton: string;
                };
                navigateToChoreo: {
                    description: string;
                    navigateButton: string;
                };
            };
            notifications: {
                updateConfiguration: {
                    error: {
                        generic: {
                            description: string;
                            message: string;
                        };
                        activeSubs: {
                            description: string;
                            message: string;
                        };
                    };
                    success: {
                        description: string;
                        message: string;
                    };
                };
                getConfiguration: {
                    error: {
                        description: string;
                        message: string;
                    };
                    success: {
                        description: string;
                        message: string;
                    };
                };
            };
        };
        emailTemplates: {
            page: {
                header: string;
                description: string;
            },
            tabs: {
                content: {
                    label: string;
                },
                preview: {
                    label: string;
                }
            },
            notifications: {
                getEmailTemplateList: {
                    error: {
                        description: string;
                        message: string;
                    }
                },
                getEmailTemplate: {
                    error: {
                        description: string;
                        message: string;
                    }
                },
                updateEmailTemplate: {
                    success: {
                        description: string;
                        message: string;
                    },
                    error: {
                        description: string;
                        message: string;
                    }
                },
                deleteEmailTemplate: {
                    success: {
                        description: string;
                        message: string;
                    },
                    error: {
                        description: string;
                        message: string;
                    }
                }
            },
            form: {
                inputs: {
                    template: {
                        label: string;
                        placeholder: string;
                        hint: string;
                    },
                    locale: {
                        label: string;
                        placeholder: string;
                    }
                    subject: {
                        label: string;
                        placeholder: string;
                        hint: string
                    },
                    body: {
                        label: string;
                        hint: string;
                    },
                    footer: {
                        label: string;
                        placeholder: string;
                        hint: string;
                    }
                }
            },
            modal: {
                replicateContent: {
                    header: string;
                    message: string;
                },
                updateFromRootOrg: {
                    header: string,
                    message: string,
                    content: string
                }
            },
            dangerZone: {
                heading: string;
                message: string;
                action: string;
                actionDisabledHint: string;
            }
        };
    };
    manage: {
        accountLogin: {
            notifications: {
                revert: {
                    error: {
                        description: string;
                        message: string;
                    },
                    success: {
                        description: string;
                        message: string;
                    }
                };
                success: {
                    description: string;
                    message: string;
                },
                error: {
                    description: string;
                    message: string;
                };
                genericError: {
                    description: string;
                    message: string;
                };
            };
            validationError: {
                minMaxMismatch: string;
                minLimitError: string;
                maxLimitError: string;
                wrongCombination: string;
            };
            editPage: {
                pageTitle: string;
                description: string;
                usernameType: string;
                usernameTypeHint: string;
                emailType: string;
                customType: string;
                usernameLength: {
                    0: string;
                    1: string;
                    2: string;
                };
                usernameAlphanumeric: string;
                usernameSpecialCharsHint: string;
            };
            alternativeLoginIdentifierPage: {
                pageTitle: string;
                description: string;
                loginIdentifierTypes: string;
                loginIdentifierTypesHint: string;
                warning: string;
                info: string;
                notification: {
                    error: NotificationItem;
                    success: NotificationItem;
                };
                claimUpdateNotification: {
                    error: NotificationItem;
                    success: NotificationItem;
                };
                claimUpdateConfirmation: {
                    header: string;
                    message: string;
                    content: string;
                    assertionHint: string;
                };
            };
            pageTitle: string;
            description: string;
            goBackToApplication: string;
            goBackToAccountLogin: string;
        };
        attributes: {
            attributes: {
                description: string;
            };
            generatedAttributeMapping: {
                title: string;
                description: string;
                OIDCProtocol: string;
                SCIMProtocol: string;
            };
            displayNameHint: string;
        };
        features: {
            header: {
                links: {
                    billingPortalNav: string;
                },
            },
            tenant: {
                header: {
                    tenantSwitchHeader: string;
                    tenantAddHeader: string;
                    tenantDefaultButton: string;
                    tenantMakeDefaultButton: string;
                    makeDefaultOrganization: string;
                    backButton: string;
                    copyOrganizationId: string;
                    copyOrganizationHandle: string;
                    copied: string;
                    tenantSearch: {
                        placeholder: string;
                        emptyResultMessage: string;
                    };
                };
                wizards: {
                    addTenant: {
                        heading: string;
                        forms: {
                            fields: {
                                tenantName: {
                                    label: string;
                                    placeholder: string;
                                    validations: {
                                        empty: string;
                                        duplicate: string;
                                        invalid: string;
                                        invalidLength: string;
                                    };
                                };
                            };
                            loaderMessages: {
                                duplicateCheck: string;
                                tenantCreate: string;
                                tenantSwitch: string;
                            };
                            messages: {
                                info: string;
                            };
                        };
                        tooltips: {
                            message: string;
                        };
                    };
                };
                tenantCreationPrompt: {
                    heading: string;
                    subHeading1: string;
                    subHeading2: string;
                    subHeading3: string;
                    subHeading4: string;
                    subHeading5: string;
                    subHeading6: string;
                    subHeading7: string;
                };
                notifications: {
                    addTenant: {
                        error: NotificationItem;
                        genericError: NotificationItem;
                        limitReachError: NotificationItem;
                        success: NotificationItem;
                    };
                    defaultTenant: Notification;
                    missingClaims: NotificationItem;
                    getTenants: NotificationItem;
                };
            };
            userStores: {
                configs: {
                    addUserStores: {
                        actionTitle: string;
                        subTitle: string;
                        title: string;
                    }
                };
                create: {
                    pageLayout: {
                        actions: {
                            connectUserStore: string;
                        };
                        description: string;
                        title: string;
                        steps: {
                            attributeMappings: {
                                subTitle: string;
                                title: string;
                                usernameHint: string;
                                emailUsername: string;
                                alphanumericUsername: string;
                            };
                            generalSettings: {
                                form: {
                                    fields: {
                                        name: {
                                            hint: string;
                                            label: string;
                                            placeholder: string;
                                            requiredErrorMessage: string;
                                        };
                                        description: {
                                            label: string;
                                            placeholder: string;
                                        };
                                        userStoreType: {
                                            label: string;
                                            message: string;
                                            types: {
                                                ldap: {
                                                    label: string;
                                                };
                                                ad: {
                                                    label: string;
                                                }
                                            }
                                        };
                                        accessType: {
                                            label: string;
                                            types: {
                                                readOnly: {
                                                    label: string;
                                                    hint: string;
                                                };
                                                readWrite: {
                                                    label: string;
                                                    hint: string;
                                                }
                                            }
                                        };
                                    };
                                };
                                title: string;
                            };
                        };
                    };
                };
                delete: {
                    assertionHint: string;
                };
                edit: {
                    attributeMappings: {
                        title: string;
                        description: string;
                        disable: {
                            buttonDisableHint: string;
                        };
                        subTitle: string;
                        sections: {
                            custom: string;
                            local: string;
                        };
                        validations: {
                            empty: string;
                        };
                    };
                    general: {
                        connectionsSections: {
                            title: string;
                            agents: {
                                agentOne: {
                                    description: string;
                                };
                                agentTwo: {
                                    description: string;
                                };
                                buttons: {
                                    disconnect: string;
                                    generate: string;
                                    regenerate: string;
                                };
                            };
                        };
                        disable: {
                            buttonDisableHint: string;
                        };
                        form: {
                            fields: {
                                description: {
                                    label: string;
                                    placeholder: string;
                                };
                            };
                            validations: {
                                allSymbolsErrorMessage: string;
                                invalidSymbolsErrorMessage: string;
                                restrictedNamesErrorMessage: string;
                                reservedNamesErrorMessage: string;
                            };
                        };
                        userStoreType: {
                            info: string;
                        }
                    };
                    setupGuide: {
                        title: string;
                        subTitle: string;
                        steps: {
                            configureProperties: {
                                content: {
                                    message: string;
                                };
                                description: string;
                                docsDescription: string;
                                title: string;
                            };
                            downloadAgent: {
                                content: {
                                    buttons: {
                                        download: string;
                                    };
                                };
                                description: string;
                                title: string;
                            };
                            generateToken: {
                                content: {
                                    buttons: {
                                        generate: string;
                                    };
                                };
                                description: string;
                                title: string;
                            };
                            runAgent: {
                                description: string;
                                title: string;
                            };
                            tryAgain: {
                                info: string;
                            }
                        };
                    };
                };
                list: {
                    title: string;
                    subTitle: string;
                };
            };
            user: {
                addUser: {
                    close: string;
                    invite: string;
                    finish: string;
                    add: string;
                    inputLabel: {
                        alphanumericUsername: string;
                        alphanumericUsernamePlaceholder: string;
                        emailUsername: string;
                    }
                    inviteUserTooltip: string;
                    inviteUserOfflineTooltip: string;
                    inviteLink: {
                        error: {
                            description: string;
                            message: string;
                        };
                        genericError: {
                            description: string;
                            message: string;
                        };
                    };
                    validation: {
                        password: string;
                        confirmPassword: string;
                        passwordCase: string;
                        upperCase: string;
                        lowerCase: string;
                        passwordLength: string;
                        passwordNumeric: string;
                        specialCharacter: string;
                        uniqueCharacters: string;
                        consecutiveCharacters: string;
                        error: {
                            passwordValidation: string;
                        };
                        usernameHint: string;
                        usernameSpecialCharHint: string;
                        usernameLength: string;
                        usernameSymbols: string;
                        usernameSpecialCharSymbols: string;
                        usernameEmpty: string;
                    };
                    summary: {
                        invitation: string;
                        invitationLink: string;
                        inviteWarningMessage: string;
                        invitationBody: {
                            hi: string;
                            accountHasBeenCreated: string;
                            pleaseFollowTheLink: string;
                            thanks: string;
                            team: string;
                        };
                        invitationBodyCopy: {
                            accountHasBeenCreated: string;
                            team: string;
                        };
                        invitationPasswordBody: {
                            accountHasBeenCreated: string;
                            pleaseFollowTheLink: string;
                            myAccountLink: string;
                        };
                        invitationPasswordBodyCopy: {
                            accountHasBeenCreated: string;
                        };
                        passwordWarningMessage: string;
                        password: string;
                        username: string;
                    }
                };
            };
        };
        serverConfigurations: {
            accountManagement: {
                accountRecovery: {
                    heading: string;
                    subHeading: string;
                    toggleName: string;
                };
            };
            additionalSettings: string;
            accountRecovery: {
                heading: string;
                subHeading: string;
                backButton: string;
                passwordRecovery: {
                    form: {
                        fields: {
                            enable: FormAttributes;
                            enableSMSBasedRecovery: FormAttributes;
                            enableEmailBasedRecovery: FormAttributes;
                            expiryTime: FormAttributes;
                            notifySuccess: FormAttributes;
                            maxResendCount: FormAttributes;
                            maxFailedAttemptCount: FormAttributes;
                            smsOtpExpiryTime: FormAttributes;
                            passwordRecoveryOtpUseUppercase: FormAttributes;
                            passwordRecoveryOtpUseLowercase: FormAttributes;
                            passwordRecoveryOtpUseNumeric: FormAttributes;
                            passwordRecoveryOtpLength: FormAttributes;
                            emailRecoveryOptions: {
                                header: string;
                                emailLink: {
                                    label: string;
                                },
                                emailOtp: {
                                    label: string;
                                }
                            };
                        };
                        smsProviderWarning: string;
                    };
                    recoveryOptionSubHeadingEmail: string;
                    recoveryOptionSubHeadingSMS: string;
                    recoveryOptionHeading: string;
                    otpConfigHeading: string;
                    failedAttemptConfigHeading: string;
                    connectorDescription: string;
                    heading: string;
                    notification: {
                        error: NotificationItem;
                        success: NotificationItem;
                    };
                    subHeading: string;
                };
                usernameRecovery: {
                    form: {
                        fields: {
                            enableEmailBasedRecovery: FormAttributes;
                            enableSMSBasedRecovery: FormAttributes;
                        },
                        smsProviderWarning: string;
                        recoveryOptionHeading: string;
                    },
                    heading: string;
                };
                forcedPasswordRecovery: {
                    form: {
                        fields: {
                            enableEmailLinkBasedReset: {
                                label: string;
                            },
                            enableEmailOTPBasedReset: {
                                label: string;
                            },
                            enableSMSOTPBasedReset: {
                                label: string;
                            },
                            expiryTime: {
                                label: string;
                                hint: string;
                                placeholder: string;
                            }
                        },
                        heading: {
                            label: string;
                            hint: string;
                        }
                        subheading: string;
                    }
                }
            };
            accountSecurity: {
                heading: string;
                subHeading: string;
                backButton: string;
                botDetection: {
                    form: {
                        fields: {
                            enable: FormAttributes;
                        };
                    };
                    info: {
                        heading: string;
                        subSection1: string;
                        subSection2: string;
                        subSection3: string;
                        subSection4: string;
                    };
                    connectorDescription: string;
                    heading: string;
                    notification: {
                        error: NotificationItem;
                        success: NotificationItem;
                    };
                    subHeading: string;
                };
                loginAttemptSecurity: {
                    form: {
                        fields: {
                            accountLockIncrementFactor: FormAttributes;
                            accountLockTime: FormAttributes;
                            enable: FormAttributes;
                            maxFailedAttempts: FormAttributes;
                            notifyUserOnAccountLockIncrement: FormAttributes;
                            lockAccountForSpecifiedTime: FormAttributes;
                            lockAccountIndefiniteTime: FormAttributes;
                        };
                    };
                    info: string;
                    connectorDescription: string;
                    accountLockDurationHeading: string;
                    heading: string;
                    notification: {
                        error: NotificationItem;
                        success: NotificationItem;
                    };
                    subHeading: string;
                    howItWorks: {
                        correctPassword: {
                            description: string;
                        };
                        incorrectPassword: {
                            description_plural: string;
                            description_singular: string;
                        };
                        example: {
                            description_plural: string;
                            description_singular: string;
                        };
                    };
                };
            };
            analytics: {
                heading: string;
                subHeading: string;
                form: {
                    fields: {
                        hostUrl: FormAttributes;
                        hostBasicAuthEnable: FormAttributes;
                        hostUsername: FormAttributes;
                        hostPassword: FormAttributes;
                        hostConnectionTimeout: FormAttributes;
                        hostReadTimeout: FormAttributes;
                        hostConnectionRequestTimeout: FormAttributes;
                        hostNameVerification: FormAttributes;
                    };
                    notification: {
                        error: NotificationItem;
                        success: NotificationItem;
                    };
                };
            };
            generalBackButton: string;
            generalEnabledLabel: string;
            generalDisabledLabel: string;
            passwordHistoryCount: {
                heading: string;
                label1: string;
                label2: string;
                message: string;
            };
            passwordExpiry: {
                heading: string;
                label: string;
                timeFormat: string;
            };
            passwordValidation: {
                heading: string;
                passwordValidationRegexLabel: string;
                passwordValidationRegexHint: string;
                passwordValidationRegexPlaceholder: string;
                passwordValidationErrorLabel: string;
                passwordValidationErrorHint: string;
                passwordValidationErrorPlaceholder: string;
            };
            userOnboarding: {
                heading: string;
                subHeading: string;
                backButton: string;
                selfRegistration: {
                    accountVerificationWarning: string;
                    form: {
                        fields: {
                            enableAutoLogin: FormAttributes;
                            expiryTime: FormAttributes;
                            signUpConfirmation: FormAttributes;
                            activateImmediately: FormAttributes;
                            showUsernameUnavailability: FormAttributes;
                            enable: FormAttributes;
                        };
                    };
                    connectorDescription: string;
                    heading: string;
                    notification: {
                        error: NotificationItem;
                        success: NotificationItem;
                    };
                    subHeading: string;
                };
                inviteUserToSetPassword: {
                    notification: {
                        error: NotificationItem;
                        success: NotificationItem;
                    };
                };
            };
        };
        groups: {
            heading: string;
            subHeading: string;
            edit: {
                users: {
                    heading: string;
                    description: string;
                };
                roles: {
                    title: string;
                    heading: string;
                    description: string;
                    editHoverText: string;
                    searchPlaceholder: string;
                    rolesList: {
                        applicationLabel: string;
                        applicationRolesLabel: string;
                    };
                    addNewModal: {
                        heading: string;
                        subHeading: string;
                    };
                    buttons: {
                        assignRoles: string;
                    };
                    placeHolders: {
                        emptyRoles: {
                            action: string;
                            subtitles: {
                                0: string;
                                1: string;
                            };
                            title: string;
                        };
                        emptyList: {
                            action: string;
                            subtitles: {
                                0: string;
                            };
                            title: string;
                        };
                    };
                    notifications: {
                        updateApplicationRoles: {
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
                            }
                        };
                        fetchApplicationRoles: {
                            error: {
                                description: string;
                                message: string;
                            };
                            genericError: {
                                description: string;
                                message: string;
                            };
                        };
                        fetchAssignedApplicationRoles: {
                            error: {
                                description: string;
                                message: string;
                            };
                            genericError: {
                                description: string;
                                message: string;
                            };
                        }
                    }
                }
            };
        };
        users: {
            administratorSettings: {
                administratorSettingsSubtitle: string;
                administratorSettingsTitle: string;
                backButton: string;
                backButtonConsoleSettings: string;
                disableToggleMessage: string;
                enableToggleMessage: string;
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
                toggleHint: string;
            };
            usersTitle: string;
            usersSubTitle: string;
            collaboratorsTitle: string;
            collaboratorsSubTitle: string;
            editUserProfile: {
                userId: string;
                disclaimerMessage: string;
                accountLock: {
                    title: string;
                    description: string;
                };
                resetPassword: {
                    changePasswordModal: {
                        emailUnavailableWarning: string;
                        emailResetWarning: {
                            emailLink: string;
                            emailOTP: string;
                            smsOTP: string;
                        }
                        passwordResetConfigDisabled: string;
                    };
                };
            };
            buttons: {
                addUserBtn: string;
                addCollaboratorBtn: string;
            };
            collaboratorAccounts: {
                consoleInfo: string;
            };
            list: {
                columns: {
                    user: string;
                    accountType: string;
                    idpType: string;
                    userStore: string;
                };
                popups: {
                    content: {
                        AccountTypeContent: string;
                        idpTypeContent: string;
                        sourceContent: string;
                    };
                };
            };
            descriptions: {
                learnMore: string;
                allUser: string;
                consumerUser: string;
                guestUser: string;
                consumerAppInfo: string;
            };
            notifications: {
                addUser: {
                    customerUser: {
                        limitReachError: NotificationItem;
                    };
                };
            };
            wizard: {
                addUser: {
                    title: string;
                    subtitle: string;

                };
                addAdmin: {
                    external: {
                        title: string;
                        subtitle: string;
                    };
                    internal: {
                        hint: string;
                        title: string;
                        subtitle: string;
                        selectUser: string;
                        searchPlaceholder: string;
                        emptySearchQueryPlaceholder: string;
                        emptySearchResultsPlaceholder: string;
                        updateRole: {
                            error: NotificationItem;
                            genericError: NotificationItem;
                            success: NotificationItem;
                        };
                    }
                };
            }
        };
        admins: {
            editPage: {
                backButton: string;
            }
        }
        invite: {
            assignAdminUser: {
                confirmationModal: {
                    assertionHint: string;
                    header: string;
                    message: string;
                };
            };
            notifications: {
                sendInvite: {
                    inviteAlreadyExistsError: NotificationItem;
                    limitReachError: NotificationItem;
                    userAlreadyExistsError: NotificationItem;
                };
            };
        };
        guest: {
            deleteUser: {
                confirmationModal: {
                    content: string;
                    message: string;
                };
            };
            editUser: {
                dangerZoneGroup: {
                    deleteUserZone: {
                        subheader: string;
                    };
                };
            };
        };
        sidePanel: {
            categories: {
                attributeManagement: string;
                AccountManagement: string;
                userManagement: string;
                approvalWorkflows: string;
                organizationSettings: string;
            };
        };
        myAccount: {
            fetchMyAccountData: {
                error: {
                    description: string;
                    message: string;
                },
                genericError: {
                    description: string;
                    message: string;
                },
            },
            fetchMyAccountStatus: {
                error: {
                    description: string;
                    message: string;
                },
                genericError: {
                    description: string;
                    message: string;
                },
            },
            editPage: {
                mfaDescription: string;
                myAccountUrlDescription: string;
                pageTitle: string;
                description: string;
                enableEmailOtp: string;
                enableSmsOtp: string;
                smsOtpEnableDescription: string;
                enableTotp: string;
                backupCodeDescription: string;
                enableBackupCodes: string;
                backupCodeInfo: string;
                EnableTotpEnrollment: string;
                totpEnrollmentInfo: string;
            },
            pageTitle: string;
            description: string;
            goBackToApplication: string;
            goBackToMyAccount: string;
        };
    };
}
