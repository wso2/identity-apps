/**
 * Copyright (c) 2025-2026, WSO2 LLC. (https://www.wso2.com).
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
import { AgentsNS } from "../../../models/namespaces/agents-ns";

export const agents: AgentsNS = {
    description: "Manage AI agent identities, permissions, and access controls for your organization's automated systems.",
    edit: {
        credentials: {
            regenerate: {
                alerts: {
                    error: {
                        description: "Error when regenerating the agent secret",
                        message: "Something went wrong"
                    }
                }
            },
            subtitle: "Authentication details for this agent to securely access applications and API resources.",
            title: "Credentials"
        },
        general: {
            fields: {
                description: {
                    label: "",
                    placeholder: ""
                },
                languageModal: {
                    label: ""
                },
                name: {
                    label: ""
                }
            },
            title: ""
        },
        roles: {
            subtitle: "View roles assigned directly to this agent",
            title: "Roles"

        },
        sections: {
            shareAgent: {
                addAsyncSharingNotification: {
                    description: "Agent sharing process has started. You will be notified once the process is complete.",
                    message: "Agent sharing in progress"
                },
                getSharedOrganizations: {
                    genericError: {
                        description: "An error occurred while fetching shared organizations.",
                        message: "Error occurred while fetching shared organizations"
                    }
                }
            },
            sharedAccess: {
                allAgentRolesSharingMessage: "All roles of the agent in the current organization will be shared and assigned.",
                allRolesAndOrgsSharingMessage: "All roles will be shared with all existing and future organizations.",
                assignedRolesLabel: "Assigned roles",
                commonRoleSharingHint: "Configure the set of roles that will be assigned to the shared agent in all existing and future organizations.",
                commonRoleSharingLabel: "Assigned roles",
                currentlyAssignedRolesLabel: "Currently assigned roles",
                doNotShareAgent: "Do not share agent with any organization",
                individualRoleSharingHint: "Configure role sharing for specific organizations individually.",
                individualRoleSharingLabel: "Individually shared roles",
                noRolesAndOrgsSharingMessage: "No roles will be assigned to the shared agent in all existing and future organizations.",
                notifications: {
                    fetchAgentRoles: {
                        genericError: {
                            description: "An error occurred while fetching agent roles.",
                            message: "Error occurred while fetching agent roles"
                        }
                    },
                    fetchOrganizations: {
                        genericError: {
                            description: "An error occurred while fetching organizations.",
                            message: "Error occurred while fetching organizations"
                        }
                    },
                    noOrganizationsSelected: {
                        description: "Please select at least one organization to share the agent with.",
                        message: "No organizations selected"
                    },
                    share: {
                        error: {
                            description: "An error occurred while sharing agent.",
                            message: "Error occurred while sharing agent"
                        },
                        success: {
                            description: "Agent shared with all organizations successfully.",
                            message: "Shared successfully"
                        }
                    },
                    unshare: {
                        error: {
                            description: "An error occurred while unsharing agent.",
                            message: "Error occurred while unsharing agent"
                        },
                        success: {
                            description: "Agent unshared successfully.",
                            message: "Unshared successfully"
                        }
                    }
                },
                roleAudience: {
                    application: "application/{{appName}}",
                    organization: "organization"
                },
                roleAvailabilityInfo: "Only roles that are already available in the child organizations will be assigned to the shared agent.",
                searchAvailableRolesPlaceholder: "Search available roles",
                shareAgentWithFutureChildOrgs: "Share agent with future child organizations",
                shareAllAgent: "Share agent with all organizations",
                shareAllRoles: "Assign all roles",
                shareRoleSubsetWithAllOrgs: "Share and assign only a subset of roles to the agent in all organizations",
                shareSelectedAgent: "Share agent with selected organizations",
                shareSelectedRoles: "Assign selected roles",
                shareTypeSwitchModal: {
                    description: "Choose how you want to proceed:",
                    header: "Switch to selective sharing",
                    message: "You are about to switch from sharing with all organizations to selective sharing.",
                    preserveStateLabel1: "Preserve current sharing",
                    preserveStateLabel2: "Keep agent shared with existing organizations and switch to selective mode.",
                    resetToDefaultLabel1: "Reset to default",
                    resetToDefaultLabel2: "Unshare agent from all organizations and start fresh with selective sharing."
                },
                sharingSettingsLabel: "Sharing settings",
                showShareAllWarningModal: {
                    assertionHint: "Please confirm your action.",
                    description: "This will share the agent across ALL existing and future organizations. This action will affect all current and future organizations in your system.",
                    header: "Share with all organizations",
                    message: "You are about to share this agent across all organizations."
                },
                subTitle: "Configure how this agent should be shared across organizations",
                title: "Sharing Policy"
            }
        }
    },
    list: {
        confirmations: {
            deleteItem: {
                assertionHint: "Please confirm your action.",
                content: "If you delete this agent, some functionalities may not work properly. " +
                    "Please proceed with caution.",
                header: "Are you sure?",
                message: "This action is irreversible and will permanently delete the selected agent."
            }
        },
        featureUnavailable: {
            subtitle: {
                0: "Each AI agent requires a unique identity with specific permissions, roles, and access policies. Monitor usage, manage credentials, and ensure compliance across all automated systems.",
                1: {
                    onprem: "Configure agent datastore to enable and try out this feature now.",
                    saas: "Create a fresh organization for instant access, or contact us for early access to this game-changing feature."
                }
            },
            title: "AI agent management is coming soon to your organization!"
        }
    },
    new: {
        action: {
            title: "New Agent"
        },
        alerts: {
            success: {
                description: "Agent created successfully",
                message: "Created successfully"
            }
        },
        fields: {
            description: {
                label: "Description",
                placeholder: "Enter a description for the agent"
            },
            name: {
                label: "Name"
            }
        },
        title: "Agent created successfully"
    },
    pageTitle: "Agents",
    title: "Agents",
    wizard: {
        alerts: {
            clientIdFetchFailed: {
                description: "Failed to fetch OAuth Client ID",
                message: "Client ID not available"
            },
            configUpdateFailed: {
                description: "Failed to update agent OAuth configuration",
                message: "Configuration update failed"
            },
            created: {
                description: "Agent created successfully",
                message: "Success"
            },
            error: {
                description: "Creating agent failed",
                message: "Something went wrong"
            }
        },
        buttons: {
            cancel: "Cancel",
            create: "Create",
            done: "Done"
        },
        fields: {
            agentType: {
                label: "AI Agent Type",
                options: {
                    background: {
                        label: "Background Agent"
                    },
                    interactive: {
                        label: "Interactive Agent"
                    }
                },
                validations: {
                    required: "Please select an Agent Type"
                }
            },
            callbackUrl: {
                helperText: "The URL to which the authorization code will be sent after user authentication",
                label: "Callback URL",
                placeholder: "https://myapp.io/callback",
                validations: {
                    required: "Callback URL is required"
                }
            },
            cibaAuthReqExpiryTime: {
                helperText: "Specify the expiry time for the CIBA authentication request",
                label: "CIBA Authentication Request Expiry Time (seconds)",
                placeholder: "300",
                validations: {
                    minimum: "Expiry time must be at least 1 second",
                    required: "CIBA expiry time is required"
                }
            },
            description: {
                label: "Description (optional)",
                placeholder: "Enter a description for the agent"
            },
            isUserServingAgent: {
                label: "Allow users to log in to this agent"
            },
            name: {
                label: "Agent Name",
                placeholder: "Enter agent name",
                validations: {
                    required: "Agent name is required"
                }
            },
            notificationChannels: {
                hint: "Configure which notification methods this application supports",
                label: "Notification Delivery Method",
                options: {
                    email: "Email",
                    sms: "SMS"
                },
                validations: {
                    required: "Please select at least one notification method"
                }
            }
        },
        help: {
            agentType: {
                description: "Choose how your agent will interact with users and handle authentication.",
                title: "Agent Type"
            },
            background: {
                description: "An agent that operates independently in the background, executing tasks and workflows without requiring continuous user presence, only engaging with the user when necessary.",
                title: "Background Agent"
            },
            callbackUrl: {
                description: "The redirect URI where the authorization code is sent after user authentication.",
                hint: "E.g., https://myapp.io/callback",
                title: "Callback URL"
            },
            description: {
                description: "A brief description of what your agent does.",
                title: "Description"
            },
            interactive: {
                description: "An agent that works in real-time with continuous user presence, where users directly interact with the agent and receive immediate responses during active sessions.",
                title: "Interactive Agent"
            },
            isUserServingAgent: {
                description: "Enable this option if your agent needs users to log in to the agent to access user specific resources on behalf of the user. This will create an OAuth2/OIDC application for the agent.",
                title: "Allow Users to Log In"
            },
            name: {
                description: "The name used for your agent.",
                title: "Agent Name"
            },
            success: {
                agentId: {
                    description: "The unique identifier for your agent. Use this to reference the agent in your application.",
                    title: "Agent ID"
                },
                agentSecret: {
                    description: "The password for your agent. Keep this secure and never share it publicly.",
                    title: "Agent Secret"
                },
                description: "Make sure to copy and store these credentials in a secure location. The agent secret cannot be retrieved again after closing this dialog.",
                oauthClientId: {
                    description: "The OAuth 2.0 client identifier for your agent application. Use this for OAuth authentication flows. This is only available if you enabled \"Allow users to log in to this agent\".",
                    title: "OAuth Client ID"
                },
                title: "Important: Save Your Credentials"
            }
        },
        subtitle: "Create a new AI agent with optional user authentication",
        success: {
            fields: {
                agentId: {
                    label: "Agent ID"
                },
                agentSecret: {
                    label: "Agent Secret"
                },
                oauthClientId: {
                    label: "OAuth Client ID",
                    unavailable: "OAuth Client ID not available"
                }
            },
            subtitle: "Your agent has been created. Please save the credentials below.",
            title: "Agent Created Successfully",
            warning: "Make sure to copy your agent secret now as you will not be able to see this again."
        },
        title: "New Agent"
    }
};
