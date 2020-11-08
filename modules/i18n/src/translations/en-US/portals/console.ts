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

export const console: ConsoleNS = {
    common: {
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
                heading: "Update profile picture",
                primaryButton: "Save",
                secondaryButton: "Cancel"
            },
            sessionTimeoutModal: {
                description: "You will be logged out of the current session due to inactivity." +
                    "Please choose Stay logged in if you would like to continue the session.",
                heading: "You will be logged out in <1>{{ time }}</1>.",
                primaryButton: "Stay logged in",
                secondaryButton: "Logout"
            }
        },
        placeholders: {
            brokenPage: {
                action: "Refresh the page",
                subtitles: {
                    0: "Something went wrong while displaying this page.",
                    1: "See the browser console for technical details."
                },
                title: "Something went wrong"
            }
        },
        validations: {
            inSecureURL: {
                description: "The entered URL a non-SSL URL. Please proceed with caution.",
                heading: "Insecure URL"
            },
            unrecognizedURL: {
                description: "The entered URL neither HTTP nor HTTPS. Please proceed with caution.",
                heading: "Unrecognized URL"
            }
        }
    },
    develop: {
        features: {
            applications: {
                confirmations: {
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
                    }
                },
                forms: {
                    inboundOIDC: {
                        messages: {
                            revokeDisclaimer: {
                                content: "The application has been revoked. Please regenrate the secret if you wish " +
                                    "to reactivate the application.",
                                heading: "Application is Revoked"
                            }
                        }
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
                }
            }
        }
    },
    manage: {
        features: {
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
            users: {
                confirmations: {
                    terminateAllSessions: {
                        assertionHint: "Please type <1>{{ name }}</1> to confirm.",
                        content: "If you proceed with this action, the user will be logged out of all active " +
                            "sessions. They will loose the progress of any ongoing tasks. Please proceed with caution.",
                        header: "Are you sure?",
                        message: "This action is irreversible and will permanently terminate all the active sessions."
                    },
                    terminateSession: {
                        assertionHint: "Please type <1>{{ name }}</1> to confirm.",
                        content: "If you proceed with this action, the user will be logged out of the selected " +
                            "session. They will loose the progress of any ongoing tasks. Please proceed with caution.",
                        header: "Are you sure?",
                        message: "This action is irreversible and will permanently terminate the session."
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
                userSessions: {
                    components: {
                        sessionDetails: {
                            actions: {
                                terminateAllSessions: "Terminate All",
                                terminateSession: "TerminateSession"
                            },
                            labels: {
                                browser: "Browser",
                                deviceModel: "Device Model",
                                ip: "IP Address",
                                lastAccessed: "Last Accessed",
                                loggedInAs: "Logged in on <1>{{ app }}</1> as <3>{{ user }}</3>",
                                loginTime: "Login Time",
                                os: "Operating System",
                                recentActivity: "Recent Activity"
                            }
                        }
                    },
                    notifications: {
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
                            subtitles: "There are no active sessions for this users.",
                            title: "No active sessions"
                        }
                    }
                }
            }
        }
    }
};
