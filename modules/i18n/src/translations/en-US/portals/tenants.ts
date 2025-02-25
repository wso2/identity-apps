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

/* eslint-disable max-len */

import { TenantsNS } from "../../../models/namespaces/tenants-ns";

export const tenants: TenantsNS = {
    actions: {
        newTenant: {
            title: "New Root Organization"
        },
        systemSettings: {
            tooltip: "Configure System Settings"
        }
    },
    addTenant: {
        actions: {
            cancel: {
                label: "Cancel"
            },
            save: {
                label: "Create"
            }
        },
        form: {
            adminDetails: {
                title: "Admin Details"
            }
        },
        notifications: {
            addTenant: {
                error: {
                    description: "An error occurred while creating the organization.",
                    message: "Couldn't create the organization"
                },
                success: {
                    description: "Successfully created the root  organization.",
                    message: "Organization created"
                }
            }
        },
        subtitle: "Add a new root organization to share the server in an isolated manner.",
        title: "Create a Root Organization"
    },
    common: {
        form: {
            fields: {
                alphanumericUsername: {
                    label: "Username",
                    placeholder: "Enter the username",
                    validations: {
                        usernameHint: "Must be an alphanumeric (a-z, A-Z, 0-9) string between {{minLength}} to {{maxLength}} characters including at least one letter.",
                        usernameSpecialCharHint: "Must be {{minLength}} to {{maxLength}} characters long, including at least one letter, and may contain a combination of the following characters: a-z, A-Z, 0-9, !@#$&'+\\=^.{|}~-."
                    }
                },
                domain: {
                    helperText: "Enter a unique domain name for your organization. The domain name should be in the format of <1>abc.com</1>. The valid characters are lowercase letters, numbers, '.', '-', and '_'.",
                    label: "Domain",
                    placeholder: "Enter a Domain name",
                    validations: {
                        domainInvalidCharPattern: "The domain contains one or more illegal characters.",
                        domainInvalidPattern: "The domain doesn't match the valid pattern.",
                        domainMandatoryExtension: "The domain should have a dot extension. E.g,: abc.com",
                        domainStartingWithDot: "The domain name cannot start with a dot.",
                        domainUnavailable: "A domain with the same name already exists.",
                        required: "A domain name is required."
                    }
                },
                email: {
                    label: "Email",
                    placeholder: "Enter the admin’s email address.",
                    validations: {
                        invalid: "Please enter a valid email address. You can use alphanumeric " +
                            "characters, unicode characters, underscores (_), dashes (-), periods (.), " +
                            "and an at sign (@).",
                        required: "Email is required."
                    }
                },
                emailUsername: {
                    helperTextAlt: "Enter a valid email address to be used as the username.",
                    label: "Username (Email)",
                    placeholder: "Enter an email address or a username to be used as the username."
                },
                firstname: {
                    label: "First Name",
                    placeholder: "Enter the admin’s first name.",
                    validations: {
                        required: "First name is required."
                    }
                },
                id: {
                    helperText: "Choose a unique username for the administrator.",
                    label: "Tenant ID",
                    placeholder: "Enter a Tenant ID."
                },
                lastname: {
                    label: "Last Name",
                    placeholder: "Enter the admin’s last name.",
                    validations: {
                        required: "Last name is required."
                    }
                },
                password: {
                    actions: {
                        generate: {
                            label: "Generate"
                        }
                    },
                    label: "Password",
                    placeholder: "Enter a password for the administrator.",
                    validations: {
                        criteria: {
                            consecutiveCharacters: "No more than {{repeatedChr}} repeated character(s)",
                            lowerCase: "At least {{minLowerCase}} lowercase letter(s)",
                            passwordCase: "At least {{minUpperCase}} uppercase and {{minLowerCase}} lowercase letters",
                            passwordLength: "Must be between {{min}} and {{max}} characters",
                            passwordNumeric: "At least {{min}} number(s)",
                            specialCharacter: "At least {{specialChr}} special character(s)",
                            uniqueCharacters: "At least {{uniqueChr}} unique character(s)",
                            upperCase: "At least {{minUpperCase}} uppercase letter(s)"
                        },
                        required: "Password is required."
                    }
                },
                username: {
                    helperText: "Choose a unique username for the administrator.",
                    label: "Username",
                    placeholder: "Enter a username for the administrator.",
                    validations: {
                        regExViolation: "Please enter a valid username.",
                        required: "Username is required.",
                        usernameLength: "The username length should be between {{minLength}} and {{maxLength}}.",
                        usernameSpecialCharSymbols: "Please choose a valid username that adheres to the given guidelines.",
                        usernameSymbols: "The username should consist of alphanumeric characters (a-z, A-Z, 0-9) and must include at least one letter."
                    }
                }
            }
        }
    },
    confirmationModals: {
        deleteTenant: {
            assertionHint: "Please confirm your action.",
            content: "If you delete this organization, users will not be able to use the services offered by the organization. Please proceed with caution.",
            header: "Are you sure?",
            message: "This action is irreversible and will permanently delete the organization.",
            primaryAction: "Confirm",
            secondaryAction: "Cancel"
        },
        disableTenant: {
            assertionHint: "Please confirm your action.",
            content: "If you disable this organization, users will not be able to use the services offered by the organization until it is enabled again. Please proceed with caution.",
            header: "Are you sure?",
            message: "This action will temporarily disable the organization.",
            primaryAction: "Confirm",
            secondaryAction: "Cancel"
        }
    },
    deploymentUnits: {
        label: "Region",
        placeholder: "Select a region (e.g., US).",
        validations: {
            empty: "This is a required field."
        }
    },
    edit: {
        backButton: "Go back to Root Organizations",
        consoleURL: {
            hint: "If you try to login to <1>{{domain}}</1> organization's Console using the same browser, you will have to logout from this active session first.",
            label: "Console URL"
        },
        subtitle: "Crated on {{date}}"
    },
    editTenant: {
        actions: {
            save: {
                label: "Update"
            }
        },
        dangerZoneGroup: {
            delete: {
                actionTitle: "Delete",
                header: "Delete Organization",
                subheader: "Once you delete a root organization, there is no going back. Please proceed with caution."
            },
            disable: {
                actionTitle: "Disable",
                header: "Disable Organization",
                subheader: "Users will not be able to log in to any application or perform any relevant tasks of the organization until it is enabled again."
            },
            header: "Danger Zone"
        },
        disabledDisclaimer: {
            actions: {
                enable: {
                    label: "Enable"
                }
            },
            content: "This organization is currently in a <1>disabled</1> state. Users will not be able to log in to any of the applications or perform any relevant tasks of the organization until it is enabled again.",
            title: "Warning"
        },
        notifications: {
            deleteTenantMeta: {
                error: {
                    description: "An error occurred while deleting the {{tenantDomain}} organization.",
                    message: "Couldn't delete"
                },
                success: {
                    description: "Successfully deleted the {{tenantDomain}} organization.",
                    message: "Organization deleted"
                }
            },
            updateTenant: {
                error: {
                    description: "An error occurred while trying to update the organization",
                    message: "Couldn't update the organization"
                },
                success: {
                    description: "Successfully updated the organization.",
                    message: "Organization updated"
                }
            },
            updateTenantStatus: {
                error: {
                    description: "An error occurred while trying to {{operation}} the {{tenantDomain}} organization",
                    message: "Couldn't {{operation}} the organization"
                },
                success: {
                    description: "Successfully {{operation}} the {{tenantDomain}} organization.",
                    message: "Organization {{operation}}"
                }
            }
        }
    },
    listDeploymentUnits: {
        description: "An error occurred while fetching regions.",
        message: "Unable to fetch regions"
    },
    listing: {
        advancedSearch: {
            form: {
                dropdown: {
                    filterAttributeOptions: {
                        domain: "Domain"
                    }
                },
                inputs: {
                    filterAttribute: {
                        placeholder: "E.g. Domain."
                    },
                    filterCondition: {
                        placeholder: "E.g. Starts with etc."
                    },
                    filterValue: {
                        placeholder: "Enter value to search"
                    }
                }
            },
            placeholder: "Search by domain"
        },
        count: "Showing {{results}} out of {{totalResults}}",
        emptyPlaceholder: {
            actions: {
                configure: {
                    label: "Configure System Settings"
                },
                divider: "OR",
                new: {
                    label: "New Root Organization"
                }
            },
            subtitles: {
                0: "There are no root organizations available at the moment.",
                1: "Create your first root organization, or configure system settings that applies to all the root organizations."
            },
            title: "No groups assigned to the role."
        },
        emptySearchResult: {
            actions: {
                clearSearchQuery: {
                    label: "Clear search query"
                }
            },
            subtitles: {
                0: "We couldn't find any results for '{{ searchQuery }}'",
                1: "Please try a different search term."
            },
            title: "No results found"
        },
        item: {
            actions: {
                delete: {
                    label: "Delete"
                },
                edit: {
                    label: "Edit"
                },
                more: {
                    label: "More"
                }
            },
            meta: {
                createdOn: {
                    label: "Created on <1>{{date}}</1>"
                },
                owner: {
                    label: "Owned by <1>{{owner}}</1>"
                }
            }
        }
    },
    status: {
        activate: "Enable",
        activated: "Enabled",
        deActivate: "Disable",
        deActivated: "Disabled"
    },
    subtitle: "Configure and manage your server by creating new root level organizations in your workspace.",
    systemSettings: {
        actions: {
            newTenant: {
                title: "New Root Organization"
            },
            systemSettings: {
                tooltip: "Configure System Settings"
            }
        },
        backButton: "Go back to Root Organizations",
        subtitle: "Configure and manage global configurations that applies across the system. .",
        title: "System Settings"
    },
    tenantDropdown: {
        options: {
            manage: {
                label: "Manage Root Organizations"
            }
        }
    },
    title: "Root Organizations"
};
