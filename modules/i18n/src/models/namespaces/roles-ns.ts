/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

interface AssignEntityToRole {
            heading: string;
            subHeading: string;
            placeholders: {
                beginSearch: string
                error: string;
                emptyPlaceholder: {
                    action: string;
                    title: string;
                    subtitles: {
                        0: string;
                    };
                };
                emptySearchResult: string;
                errorPlaceholder: {
                    action: string;
                    title: string;
                    subtitles: {
                        0: string;
                        1: string;
                    };
                };
            };
            notifications: {
                error: {
                    message: string;
                    description: string;
                };
                success: {
                    message: string;
                    description: string;
                };
                genericError: {
                    message: string;
                    description: string;
                };
                fetchError: {
                    message: string;
                    description: string;
                };
                pendingApproval: {
                    message: string;
                    description: string;
                };
            };
            list: {
                emptyPlaceholder: {
                    action: string;
                    title: string;
                    subtitles: string;
                };
                user: string;
                organization: string;
            };
            actions: {
                search: {
                    placeholder: string;
                };
                assign: {
                    placeholder: string;
                };
                remove: {
                    label: string;
                    placeholder: string;
                };
            };
        };

export interface rolesNS {
    addRoleWizard: {
        buttons: {
            finish: string;
            next: string;
            previous: string;
        };
        forms: {
            roleBasicDetails: {
                domain: {
                    label: {
                        role: string;
                        group: string;
                    };
                    placeholder: string;
                    validation: {
                        empty: {
                            role: string;
                            group: string;
                        };
                    };
                };
                roleName: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        duplicate: string;
                        duplicateInAudience: string;
                        empty: string;
                        invalid: string;
                    };
                };
                roleAudience: {
                    values: {
                        organization: string;
                        application: string;
                    };
                    hint: string;
                    label: string;
                };
                assignedApplication: {
                    applicationSubTitle: {
                        application: string;
                        organization: string;
                        changeAudience: string;
                    };
                    note: string;
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                    };
                };
                notes: {
                    appNote: string;
                    cannotCreateRole: string;
                    orgNote: string;
                    subOrganization: {
                        appNote: string;
                        orgNote: string;
                    }
                };
            };
            rolePermission: {
                apiResource: {
                    label: string;
                    placeholder: string;
                    hint: {
                        empty: string;
                    };
                };
                permissions: {
                    label: string;
                    placeholder: string;
                    tooltips: {
                        noScopes: string;
                        selectAllScopes: string;
                        removeAPIResource: string;
                    };
                    validation: {
                        empty: string;
                    };
                    permissionsLabel: string;
                };
                notes: {
                    applicationRoles: string;
                };
                notifications: {
                    fetchAPIResourceError: {
                        error: {
                            message: string;
                            description: string;
                        };
                    };
                };
            };
        };
        heading: string;
        permissions: {
            buttons: {
                collapseAll: string;
                expandAll: string;
                update: string;
            };
        };
        subHeading: string;
        back: string;
        summary: {
            labels: {
                domain: {
                    role: string;
                    group: string;
                };
                permissions: string;
                roleName: string;
                roles: string;
                users: string;
                groups: string;
            };
        };
        users: {
            assignUserModal: {
                heading: string;
                hint: string;
                subHeading: string;
                list: {
                    searchPlaceholder: string;
                    searchByEmailPlaceholder: string;
                    listHeader: string;
                };
            };
        };
        agents: {
            assignAgentModal: {
                heading: string;
                hint: string;
                list: {
                    listHeader: string;
                    searchPlaceholder: string;
                },
                search: string;
                subHeading: string;
            }
        },
        wizardSteps: {
            0: string;
            1: string;
            2: string;
            3: string;
            4: string;
            5: string;
        };
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
    edit: {
        placeholders: {
            errorPlaceHolder: {
                action: string;
                title: string;
                subtitles: {
                    0: string;
                    1: string;
                };
            };
        };
        basics: {
            buttons: {
                update: string;
            };
            confirmation: {
                assertionHint: string;
                header: string;
                message: string;
                content: string;
            };
            dangerZone: {
                actionTitle: string;
                header: string;
                subheader: string;
                buttonDisableHint: string;
            };
            fields: {
                roleName: {
                    name: string;
                    required: string;
                    placeholder: string;
                };
            };
        };
        groups: {
            addGroupsModal: {
                heading: string;
                subHeading: string;
            };
            placeholders: {
                emptyPlaceholder: {
                    action: string;
                    title: string;
                    subtitles: {
                        0: string;
                    };
                };
                errorPlaceholder: {
                    action: string;
                    title: string;
                    subtitles: {
                        0: string;
                        1: string;
                    };
                };
            };
            notifications: {
                error: {
                    message: string;
                    description: string;
                };
                success: {
                    message: string;
                    description: string;
                };
                genericError: {
                    message: string;
                    description: string;
                };
                fetchError: {
                    message: string;
                    description: string;
                };
            };
            heading: string;
            localGroupsHeading: string;
            externalGroupsHeading: string;
            subHeading: string;
            actions: {
                search: {
                    placeholder: string;
                };
                assign: {
                    placeholder: string;
                };
                remove: {
                    label: string;
                    placeholder: string;
                };
            };
        };
        menuItems: {
            basic: string;
            connectedApps: string;
            permissions: string;
            groups: string;
            users: string;
            roles: string;
            agents: string;
        };
        permissions: {
            heading: string;
            subHeading: string;
            readOnlySubHeading: string;
            removedPermissions: string;
        };
        users: AssignEntityToRole;
        agents: AssignEntityToRole;
    };
    list: {
        buttons: {
            addButton: string;
            filterDropdown: string;
        };
        columns: {
            actions: string;
            lastModified: string;
            name: string;
            managedByOrg: {
                label: string;
                header: string;
            };
            managedByApp: {
                label: string;
                header: string;
            };
            audience: string;
        };
        labels: {
            shared: string;
        }
        confirmations: {
            deleteItem: {
                assertionHint: string;
                header: string;
                message: string;
                content: string;
            };
            deleteItemError: {
                header: string;
                message: string;
                content: string;
            };
        };
        emptyPlaceholders: {
            search: {
                action: string;
                title: string;
                subtitles: {
                    0: string;
                    1: string;
                };
            };
            emptyRoleList: {
                action: string;
                title: string;
                subtitles: {
                    0: string;
                    1: string;
                    2: string;
                };
            } & {
                emptyRoles: string;
            };
        };
        popups: {
            delete: string;
            edit: string;
        };
        filterOptions: {
            all: string;
            applicationRoles: string;
            organizationRoles: string;
        };
        filterAttirbutes: {
            name: string;
            audience: string;
        };
    };
    readOnlyList: {
        emptyPlaceholders: {
            searchAndFilter: {
                title: string;
                subtitles:
                    | string
                    | {
                          0: string;
                          1: string;
                      };
            };
        };
    };
    notifications: {
        createRolePendingApproval: {
            success: {
                description: string;
                message: string;
            }
        },
        deleteRole: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        fetchRoles: {
            genericError: {
                message: string;
                description: string;
            };
        };
        fetchRole: {
            genericError: {
                message: string;
                description: string;
            };
        };
        updateRole: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        createRole: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        createPermission: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
    };
}
