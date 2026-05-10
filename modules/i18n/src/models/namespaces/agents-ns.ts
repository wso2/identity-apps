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

export interface AgentsNS {
    title: string;
    pageTitle: string;
    description: string;
    new: {
        action: {
            title: string;
        },
        fields: {
            name: {
                label: string;
            };
            description: {
                label: string;
                placeholder: string;
            };
        };
        alerts: {
            success: {
                message: string;
                description: string;
            };
        };
        title: string;
    };
    wizard: {
        title: string;
        subtitle: string;
        fields: {
            name: {
                label: string;
                placeholder: string;
                validations: {
                    required: string;
                };
            };
            description: {
                label: string;
                placeholder: string;
            };
            isUserServingAgent: {
                label: string;
            };
            agentType: {
                label: string;
                validations: {
                    required: string;
                };
                options: {
                    interactive: {
                        label: string;
                    };
                    background: {
                        label: string;
                    };
                };
            };
            callbackUrl: {
                label: string;
                placeholder: string;
                helperText: string;
                validations: {
                    required: string;
                };
            };
            cibaAuthReqExpiryTime: {
                label: string;
                placeholder: string;
                helperText: string;
                validations: {
                    required: string;
                    minimum: string;
                };
            };
            notificationChannels: {
                label: string;
                hint: string;
                options: {
                    email: string;
                    sms: string;
                };
                validations: {
                    required: string;
                };
            };
        };
        buttons: {
            cancel: string;
            create: string;
            done: string;
        };
        alerts: {
            created: {
                message: string;
                description: string;
            };
            error: {
                message: string;
                description: string;
            };
            clientIdFetchFailed: {
                message: string;
                description: string;
            };
            configUpdateFailed: {
                message: string;
                description: string;
            };
        };
        success: {
            title: string;
            subtitle: string;
            warning: string;
            fields: {
                agentId: {
                    label: string;
                };
                agentSecret: {
                    label: string;
                };
                oauthClientId: {
                    label: string;
                    unavailable: string;
                };
            };
        };
        help: {
            name: {
                title: string;
                description: string;
            };
            description: {
                title: string;
                description: string;
            };
            isUserServingAgent: {
                title: string;
                description: string;
            };
            agentType: {
                title: string;
                description: string;
            };
            interactive: {
                title: string;
                description: string;
            };
            background: {
                title: string;
                description: string;
            };
            callbackUrl: {
                title: string;
                description: string;
                hint: string;
            };
            success: {
                title: string;
                description: string;
                agentId: {
                    title: string;
                    description: string;
                };
                agentSecret: {
                    title: string;
                    description: string;
                };
                oauthClientId: {
                    title: string;
                    description: string;
                };
            };
        };
    };
    list: {
        confirmations: {
            deleteItem: {
                assertionHint: string;
                content: string;
                header: string;
                message: string;
            };
        };
        featureUnavailable: {
            subtitle: {
                0: string;
                1: {
                    onprem: string;
                    saas: string;
                };

            };
            title: string;
        };
    };
    edit: {
        credentials: {
            title: string;
            regenerate: {
                alerts: {
                    error: {
                        description: string;
                        message: string;
                    };
                };
            };
            subtitle: string;
        };
        general: {
            title: string;
            fields: {
                name: {
                    label: string;
                };
                description: {
                    label: string;
                    placeholder: string;
                };
                languageModal: {
                    label: string;
                };
            };
        };
        roles: {
            title: string;
            subtitle: string;
        };
        sections: {
            sharedAccess: {
                doNotShareAgent: string;
                notifications: {
                    fetchAgentRoles: {
                        genericError: {
                            description: string;
                            message: string;
                        };
                    };
                    fetchOrganizations: {
                        genericError: {
                            description: string;
                            message: string;
                        };
                    };
                    noOrganizationsSelected: {
                        description: string;
                        message: string;
                    };
                    share: {
                        error: {
                            description: string;
                            message: string;
                        };
                        success: {
                            description: string;
                            message: string;
                        };
                    };
                    unshare: {
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
                shareAllAgent: string;
                shareAllRoles: string;
                shareRoleSubsetWithAllOrgs: string;
                shareSelectedRoles: string;
                shareSelectedAgent: string;
                commonRoleSharingLabel: string;
                commonRoleSharingHint: string;
                individualRoleSharingLabel: string;
                individualRoleSharingHint: string;
                searchAvailableRolesPlaceholder: string;
                allRolesAndOrgsSharingMessage: string;
                allAgentRolesSharingMessage: string;
                noRolesAndOrgsSharingMessage: string;
                roleAudience: {
                    application: string;
                    organization: string;
                };
                roleAvailabilityInfo: string;
                shareAgentWithFutureChildOrgs: string;
                sharingSettingsLabel: string;
                assignedRolesLabel: string;
                currentlyAssignedRolesLabel: string;
                shareTypeSwitchModal: {
                    description: string;
                    header: string;
                    message: string;
                    preserveStateLabel1: string;
                    preserveStateLabel2: string;
                    resetToDefaultLabel1: string;
                    resetToDefaultLabel2: string;
                };
                showShareAllWarningModal: {
                    assertionHint: string;
                    description: string;
                    header: string;
                    message: string;
                };
                subTitle: string;
                title: string;
            };
            shareAgent: {
                addAsyncSharingNotification: {
                    description: string;
                    message: string;
                };
                getSharedOrganizations: {
                    genericError: {
                        description: string;
                        message: string;
                    };
                };
            };
        };
    };
}
