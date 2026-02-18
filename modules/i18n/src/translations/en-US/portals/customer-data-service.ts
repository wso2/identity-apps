/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { CustomerDataServiceNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */

export const customerDataService: CustomerDataServiceNS = {
    common: {
        buttons: {
            cancel: "Cancel",
            close: "Close",
            confirm: "Confirm",
            delete: "Delete"
        },
        dangerZone: {
            header: "Danger Zone"
        },
        notifications: {
            error: "Error",
            loadAttributes: {
                error: {
                    description: "An error occurred while loading the attributes.",
                    message: "Failed to load attributes."
                }
            },
            notAllowed: "Not allowed"
        }
    },
    profiles: {
        details: {
            confirmations: {
                deleteProfile: {
                    assertionHint: "Please confirm the deletion.",
                    content: "Are you sure you want to delete the profile <1>{{profileId}}</1>? " +
                        "This action permanently deletes the profile and the profiles that are merged into.",
                    header: "Delete Profile",
                    message: "This action is irreversible!"
                }
            },
            dangerZone: {
                delete: {
                    actionTitle: "Delete profile",
                    header: "Delete this profile",
                    subheader: "This profile is not linked to a user ID and can be deleted. Deleting a profile is irreversible and will also delete the unified profiles merged into this profile."
                }
            },
            form: {
                createdDate: { label: "Created Date" },
                location: { label: "Location" },
                profileData: { label: "Profile Data" },
                profileId: { label: "Profile ID" },
                updatedDate: { label: "Updated Date" },
                userId: { label: "User ID" }
            },
            notifications: {
                deleteProfile: {
                    error: {
                        description: "Failed to delete profile.",
                        message: "Error"
                    },
                    notAllowed: {
                        description: "Profiles linked to a user cannot be deleted.",
                        message: "Not allowed"
                    },
                    success: {
                        description: "Profile deleted successfully.",
                        message: "Success"
                    }
                },
                fetchProfile: {
                    error: {
                        description: "Failed to load profile details.",
                        message: "Error"
                    }
                }
            },
            page: {
                backButton: "Go back to Profiles",
                description: "Customer profile",
                fallbackTitle: "Profile",
                pageTitle: "Profile"
            },
            profileData: {
                actions: {
                    copy: "Copy",
                    export: "Export",
                    view: "View"
                },
                copy: {
                    success: {
                        description: "Profile data copied to clipboard.",
                        message: "Copied"
                    }
                },
                export: {
                    success: {
                        description: "Profile data exported.",
                        message: "Exported"
                    }
                },
                modal: {
                    title: "Profile Data"
                }
            },
            section: {
                profileData: {
                    description: "This section contains the profile's identity attributes, traits and application data. ",
                    title: "Profile Data"
                }
            },
            tabs: {
                general: "General",
                unifiedProfiles: "Unified Profiles"
            },
            unifiedProfiles: {
                columns: {
                    profileId: "Profile ID",
                    reason: "Unification Rule involved"
                },
                description: "This profile has been unified with the following profiles based on the unification rules configured. The data from all these profiles are consolidated into this profile.",
                empty: "No unified profiles found for this profile.",
                title: "Unified Profiles"
            }
        },
        list: {
            chips: {
                anonymous: "Anonymous",
                unified: "Unified"
            },
            columns: {
                profile: "Profile",
                unifiedProfiles: "Unified Profiles",
                user: "User"
            },
            confirmations: {
                delete: {
                    assertionHint: "Please confirm the deletion.",
                    content: "Are you sure you want to delete the profile <1>{{profileId}}</1>? " +
                        "This action permanently deletes the profile and the profiles that are merged into.",
                    header: "Delete Profile",
                    message: "This action is irreversible!"
                }
            },
            notifications: {
                delete: {
                    error: {
                        description: "Failed to delete the profile.",
                        message: "Delete failed"
                    },
                    success: {
                        description: "The profile was successfully deleted.",
                        message: "Profile deleted"
                    }
                },
                fetchProfiles: {
                    error: {
                        description: "An error occurred while loading the profiles.",
                        message: "Failed to load profiles."
                    }
                }
            },
            placeholders: {
                emptyList: {
                    subtitle: "Create a profile to see it listed here.",
                    title: "No profiles found"
                },
                emptySearch: {
                    action: "Clear search query",
                    subtitle: "We couldn't find any profiles matching your search query. Please try again with different query.",
                    title: "No results found"
                }
            },
            search : {
                placeholder: "Search by profile ID "
            }
        },
        page: {
            description: "Manage customer profiles which has identity, behavioural and application data",
            pageTitle: "Profiles",
            title: "Profiles"
        }
    },
    sidePanel: {
        Profiles: "Profiles",
        UnificationRules: "Unification Rules"
    },
    unificationRules: {
        common: {
            notifications: {
                deleted: {
                    description: "Unification rule has been deleted successfully.",
                    message: "Rule Deleted"
                },
                deletionFailed: {
                    description: "Unable to delete the unification rule.",
                    message: "Deletion failed"
                },
                loadedFailed: {
                    description: "Unable to load unification rules.",
                    message: "Loading failed"
                }
            }
        },
        create: {
            buttons: {
                cancel: "Cancel",
                create: "Create Rule",
                creating: "Creating..."
            },
            fields: {
                attribute: {
                    attributeAriaLabel: "Attribute",
                    errors: {
                        alreadyUsed: "This attribute is already used by another rule. Choose a different attribute.",
                        loadFailed: "Failed to load attributes for the selected scope.",
                        required: "Attribute is required."
                    },
                    hint: "Pick an attribute to resolve similar profiles.",
                    label: "Attribute",
                    loadingRulesHint: "Loading existing rules for duplicate validation…",
                    noAvailableForScopeHint: "No available attributes for this scope.",
                    noOptions: "No available attributes",
                    placeholder: "Select an attribute",
                    rulesLoadFailedHint: "Failed to load existing rules. Duplicate validation may be inaccurate.",
                    scopeAriaLabel: "Attribute scope"
                },
                isActive: {
                    label: "Enable this rule immediately"
                },
                priority: {
                    errors: {
                        alreadyUsed: "Priority {{priority}} is already taken by another rule. Choose a different value.",
                        min: "Priority must be at least 1."
                    },
                    hint: "Lower the number, higher the priority. Rules with higher priority are evaluated first.",
                    label: "Priority"
                },
                ruleName: {
                    errors: {
                        required: "Rule name is required."
                    },
                    hint: "Choose a rule name that describes the unification criteria, e.g., 'Unify on email'.",
                    label: "Rule Name",
                    placeholder: "Enter a descriptive rule name."
                },
                scope: {
                    options: {
                        identity: "Identity Attributes",
                        trait: "Trait"
                    }
                }
            },
            headings: {
                ruleDetails: "Rule Details",
                ruleDetailsDescription: "Provide a name, choose the attribute to unify on, and configure priority."
            },
            notifications: {
                created: {
                    description: "Unification rule has been created successfully.",
                    message: "Unification rule created."
                },
                creationFailed: {
                    description: "Failed to create Unification rule.",
                    message: "Unification rule creation failed"
                },
                loadingRules: {
                    description: "Please wait until existing rules are loaded for duplicate validation.",
                    message: "Loading Unification rules"
                }
            },
            page: {
                backButton: "Back to Unification Rules",
                description: "Define a new profile unification rule to resolve and merge customer profiles.",
                title: "Create Unification Rule"
            }
        },
        list: {
            actions: {
                delete: "Delete",
                disable: "Disable",
                enable: "Enable",
                moveDown: "Move Down",
                moveUp: "Move Up"
            },
            buttons: {
                add: "Add Unification Rule",
                clearSearch: "Clear Search Query",
                retry: "Retry"
            },
            columns: {
                attribute: "Attribute",
                enabled: "Enabled",
                priority: "Priority",
                rule: "Rule"
            },
            confirmations: {
                delete: {
                    assertionHint: "Please confirm the deletion.",
                    content: "Are you sure you want to delete the rule " +
                        "<1>{{ruleName}}</1>? Deleting the rule will remove it " +
                        "from engaging in matching and unification of user profiles. Existing " +
                        "unification will not be affected.",
                    header: "Delete Unification Rule",
                    message: "Deleting this rule will permanently remove it and " +
                        "it cannot be undone."
                },
                toggle: {
                    disableContent: "Are you sure you want to disable the rule " +
                        "<1>{{ruleName}}</1>?",
                    disableHeader: "Disable Unification Rule",
                    disableMessage: "Disabling this rule will prevent it from " +
                        "participating in profile unification.",
                    enableContent: "Are you sure you want to enable the rule " +
                        "<1>{{ruleName}}</1>?",
                    enableHeader: "Enable Unification Rule",
                    enableMessage: "Enabling this rule will allow this rule to " +
                        "be invoked in profile matching and unification."
                }
            },
            labels: {
                scope: {
                    identity: "Identity Attribute",
                    trait: "Trait"
                }
            },
            notifications: {
                priorityUpdated: {
                    error: {
                        description: "Failed to update priority.",
                        message: "Unification rule Update Failed"
                    },
                    rollbackError: {
                        description: "Failed to rollback priority after update failure.",
                        message: "Rollback Failed"
                    },
                    success: {
                        description: "\"{{ruleName}}\" priority has been {{direction}}.",
                        message: "Unification rule Priority Updated"
                    }
                },
                ruleDisabled: {
                    success: {
                        description: "\"{{ruleName}}\" has been disabled.",
                        message: "Unification rule Disabled"
                    }
                },
                ruleEnabled: {
                    success: {
                        description: "\"{{ruleName}}\" has been enabled.",
                        message: "Unification rule Enabled"
                    }
                },
                toggleFailed: {
                    error: {
                        description: "Failed to update unification rule status.",
                        message: "Update Failed"
                    }
                }
            },
            page: {
                description: "Manage profile unification rules.",
                title: "Unification Rules"
            },
            placeholders: {
                empty: {
                    subtitle: "Please add a unification rule to start unifying your profiles.",
                    title: "No Unification Rules Found"
                },
                error: {
                    subtitle: "Failed to load unification rules. Please try again.",
                    title: "Error Loading Rules"
                },
                noResults: {
                    subtitle1: "No unification rules match your search \"{{ruleFilter}} \".",
                    subtitle2: "Try adjusting your search criteria.",
                    title: "No Results Found"
                },
                search: "Search by Rule Name or Attribute Name"
            }
        }
    }
};
