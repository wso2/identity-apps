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
            delete: "Delete",
            update: "Update"
        },
        dangerZone: {
            header: "Danger Zone"
        },
        featurePreview: {
            action: "Try Customer Data Service",
            description: "Customer Data Service (CDS) enables you to build and manage unified customer profiles by defining profile attributes, configuring unification rules, and tracking anonymous profiles — giving you a single, consistent view of every customer.",
            message: "Once Customer Data Service (CDS) is enabled, you can configure profile attributes and unification rules, and start building unified customer profiles.",
            name: "Customer Data Service",
            updateError: "Failed to update Customer Data Service settings. Please try again."
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
    landing: {
        backButton: "Go back to Customer Data",
        configuration: {
            profileAttributes: {
                description: "Manage the attributes that make up the customer profiles",
                title: "Profile Attributes"
            },
            reviewTasks: {
                description: "Review profile pairs that need an administrator to decide",
                title: "Review Tasks"
            },
            unificationRules: {
                description: "Manage profile unification rules",
                title: "Unification Rules"
            }
        },
        enable: {
            label: "Enable Customer Data Service"
        },
        notifications: {
            update: {
                error: {
                    description: "Failed to update Customer Data Service settings. Please try again.",
                    message: "Update error"
                },
                success: {
                    description: "Customer Data Service configuration updated successfully.",
                    message: "Update successful"
                }
            }
        },
        page: {
            description: "Collect and unify customer data across your applications",
            title: "Customer Data"
        },
        profiles: {
            description: "Manage customer profiles which have identity, behavioural and application data.",
            heading: "Profiles"
        }
    },
    profileAttributes: {
        create: {
            forms: {
                advancedSettings: {
                    fields: {
                        canonicalValues: {
                            hint: "Define the allowed label-value pairs for this attribute.",
                            label: "Options",
                            labelField: "Display value",
                            labelPlaceholder: "e.g. Color",
                            validations: {
                                atLeastOne: "At least one option is required.",
                                empty: "Both label and value are required."
                            },
                            valueField: "Value",
                            valuePlaceholder: "e.g. Blue"
                        },
                        mergeStrategy: {
                            hint : "Determines how value of the attribute from multiple profiles are merged when profile unification occurs. " ,
                            label: "Merge Strategy",
                            options: {
                                combine: {
                                    hint: "All values from different sources are combined.",
                                    label: "Combine"
                                },
                                overwrite: {
                                    hint: "The incoming value replaces the stored one.",
                                    label: "Overwrite"
                                }
                            }
                        },
                        subAttributes: {
                            hint: "Select the child attributes that make up this complex attribute.",
                            label: "Sub-attributes",
                            noOptions: "No available sub-attributes found.",
                            placeholder: "Select a sub-attribute"
                        }
                    }
                },
                attributeGeneral: {
                    fields: {
                        // NEW: application identifier field (application_data scope)
                        applicationIdentifier: {
                            label: "Application",
                            loading: "Loading applications…",
                            noOptions: "No applications found.",
                            placeholder: "Select an application",
                            validations: {
                                empty: "An application is required."
                            }
                        },
                        // NEW: compound attribute row
                        attribute: {
                            label: "Attribute"
                        },
                        // existing fields
                        description: {
                            hint: "A short description explaining the purpose of this attribute.",
                            label: "Description",
                            placeholder: "Enter a description"
                        },
                        displayName: {
                            hint: "A human-readable name.",
                            label: "Display Name",
                            placeholder: "Enter a display name"
                        },
                        name: {
                            fullNameHint: "Full attribute name: {{fullName}}",
                            label: "Attribute Name",
                            placeholder: "Enter an attribute name",
                            validations: {
                                available: "This attribute name is available.",
                                empty: "Attribute name is required.",
                                exists: "An attribute with this name already exists."
                            }
                        },
                        // NEW: scope selection
                        scope: {
                            ariaLabel: "Attribute scope",
                            label: "Scope",
                            options: {
                                applicationData: "Application Data",
                                traits: "Traits"
                            }
                        }
                    }
                },
                typeConfig: {
                    fields: {
                        multiValued: {
                            hint: "Select this option if the attribute can have multiple values.",
                            label: "Allow Multiple Values for this attribute"
                        },
                        mutability: {
                            hint: "Controls whether this attribute can be updated after it is set.",
                            label: "Mutability",
                            options: {
                                immutable: {
                                    hint: "The attribute value cannot be changed after it is set.",
                                    label: "Immutable"
                                },
                                readOnly: {
                                    hint: "The attribute can only be read; it cannot be modified.",
                                    label: "Read Only"
                                },
                                readWrite: {
                                    hint: "The attribute value can be read and updated freely.",
                                    label: "Read & Write"
                                },
                                writeOnce: {
                                    hint: "The attribute can only be written once.",
                                    label: "Write Once"
                                }
                            }
                        },
                        valueType: {
                            hint: "Select the data type for this attribute.",
                            label: "Value Type",
                            options: {
                                boolean: {
                                    hint: "A true / false flag.",
                                    label: "Boolean"
                                },
                                complex: {
                                    hint: "A complex object composed of sub attributes.",
                                    label: "Object"
                                },
                                date: {
                                    hint: "A calendar date (YYYY-MM-DD).",
                                    label: "Date"
                                },
                                date_time: {
                                    hint: "A date and time value.",
                                    label: "Date & Time"
                                },
                                decimal: {
                                    hint: "A number with decimal precision.",
                                    label: "Decimal"
                                },
                                epoch: {
                                    hint: "A Unix timestamp (seconds since epoch).",
                                    label: "Epoch"
                                },
                                integer: {
                                    hint: "A whole number.",
                                    label: "Integer"
                                },
                                options: {
                                    hint: "A fixed set of key-value pairs.",
                                    label: "Options"
                                },
                                string: {
                                    hint: "A plain text value.",
                                    label: "Text"
                                }
                            }
                        }
                    }
                }
            },
            notifications: {
                addProfileAttribute: {
                    genericError: {
                        description: "An error occurred while creating the attribute. Please try again.",
                        message: "Attribute Creation Failed"
                    },
                    success: {
                        description: "The attribute has been created successfully.",
                        message: "Attribute Created"
                    }
                }
            },
            pageLayout: {
                back: "Go back to Attributes",
                description: "Create a new profile schema attribute.",
                stepper: {
                    step1: {
                        description: "Provide a name and description for the attribute.",
                        title: "General Details"
                    },
                    step2: {
                        description: "Choose the value type, mutability, and cardinality.",
                        title: "Type & Configuration"
                    }
                },
                title: "Create Attribute"
            }
        },
        edit: {
            confirmations: {
                deleteAttribute: {
                    assertionHint: "Please confirm the deletion.",
                    content: "Are you sure you want to delete <1>{{attributeName}}</1>?",
                    header: "Delete Attribute",
                    message: "This action is irreversible!"
                }
            },
            dangerZone: {
                delete: {
                    actionTitle: "Delete Attribute",
                    header: "Delete this attribute",
                    subheader: "This action is irreversible and will permanently delete the attribute."
                }
            },
            fields: {
                applicationIdentifier: {
                    hint: "The application identifier this attribute belongs to, as stored in the customer data service.",
                    label: "Application Identifier"
                },
                applicationName: {
                    hint: "The name of the application this attribute belongs to.",
                    label: "Application Name"
                },
                attribute: {
                    hint: "The name of this attribute.",
                    label: "Attribute"
                },
                displayName: {
                    hint: "A human-readable name.",
                    label: "Display Name",
                    placeholder: "Enter a display name"
                },
                mergeStrategy: {
                    hint: "Determines how value of the attribute from multiple profiles are merged when profile unification occurs. " +
                        "Use Combine to accumulate values, or Overwrite to replace with the latest updated value.",
                    label: "Merge Strategy",
                    options: {
                        combine: "Combine",
                        overwrite: "Overwrite"
                    }
                },
                multiValued: {
                    hint: "Select this option if the attribute can have multiple values.",
                    label: "Allow Multiple Values for this attribute"
                },

                // NEW/UPDATED: mutability in edit page
                mutability: {
                    hint: "Controls whether this attribute can be updated after it is set.",
                    label: "Mutability"
                },

                // UPDATED: subAttributes supports richer UI states + validation
                subAttributes: {
                    allAdded: "All available sub-attributes have already been added.",
                    empty: "No available sub-attributes found.",
                    hint: "Pick child attributes that make up this complex attribute.",
                    label: "Sub Attributes",
                    placeholder: "Select sub attributes",
                    validationError: "A complex attribute must have at least one sub-attribute.",
                    validationErrorMessage: "Sub-attribute required"
                },

                // UPDATED: expanded valueType options used by edit page
                valueType: {
                    label: "Value Type",
                    options: {
                        boolean: "Boolean",
                        complex: "Complex",
                        date: "Date",
                        dateTime: "Date & Time",
                        decimal: "Decimal",
                        epoch: "Epoch",
                        integer: "Integer",
                        text: "Text"
                    }
                }
            },
            identityAttributesNotice: "Identity attributes are read-only in this section. " +
                "To make changes, please update them from the Attributes section.",
            notifications: {
                deleteAttribute: {
                    error: {
                        description: "Failed to delete the attribute.",
                        message: "Deletion Failed"
                    },
                    success: {
                        description: "The attribute has been deleted successfully.",
                        message: "Attribute Deleted"
                    }
                },
                fetchAttribute: {
                    error: {
                        description: "Failed to retrieve the attribute details.",
                        message: "Retrieval Error"
                    }
                },
                updateAttribute: {
                    error: {
                        description: "Failed to update the attribute.",
                        message: "Update Failed"
                    },
                    success: {
                        description: "Attribute updated successfully.",
                        message: "Update Successful"
                    }
                }
            },
            page: {
                backButton: "Go back to Attributes",
                pageTitle: "Edit Attribute"
            },
            tabs: {
                general: "General"
            }
        },
        list: {
            actions: {
                delete: "Delete",
                edit: "Edit",
                view: "View"
            },
            buttons: {
                add: "Add Profile Attribute",
                clearSearch: "Clear Search Query",
                retry: "Retry"
            },
            columns: {
                attribute: "Attribute"
            },
            confirmations: {
                deleteAttribute: {
                    assertionHint: "Please confirm the deletion.",
                    content: "Are you sure you want to delete <1>{{attributeName}}</1>?. " +
                        "Deleting this attribute will remove the attribute from the schema and the profiles.",
                    header: "Delete Attribute",
                    message: "This action is irreversible!"
                }
            },
            identityAttributes: {
                description: "Edit or update Identity Attributes.",
                manage: "Manage Identity Attributes",
                title: "Identity Attributes"
            },
            notifications: {
                deleteAttribute: {
                    error: {
                        description: "Failed to delete the attribute.",
                        message: "Delete Failed"
                    },
                    success: {
                        description: "Attribute deleted successfully.",
                        message: "Deleted"
                    }
                },
                filterProfileAttributes: {
                    genericError: {
                        description: "An error occurred while filtering the profile attributes. Please try again.",
                        message: "Filter Failed"
                    }
                }
            },
            page: {
                description: "Manage the attributes that make up the customer profiles.",
                pageTitle: "Profile Attributes",
                title: "Profile Attributes"
            },
            placeholders: {
                emptyList: {
                    subtitles: {
                        0: "Create an attribute to see it listed here."
                    },
                    title: "No attributes found"
                },
                emptySearch: {
                    action: "Clear search query",
                    subtitles: {
                        0: "We couldn't find any attributes matching your search query. Please try again with different query."
                    },
                    title: "No results found"
                }
            },
            search: {
                placeholder: "Search by attribute name"
            },
            sortBy: {
                name: "Name",
                scope: "Scope"
            }
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
                    subheader: "This profile is not linked to a user ID and can be deleted. " +
                        "Deleting a profile is irreversible and will also delete the unified profiles merged into this profile."
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
                    description: "This section contains the profile's identity attributes, traits and application data.",
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
                description: "This profile has been unified with the following profiles based on the unification " +
                    "rules configured. The data from all these profiles are consolidated into this profile.",
                empty: "No unified profiles found for this profile.",
                title: "Unified Profiles"
            }
        },
        linkedUser: {
            action: "View Customer Profile",
            info: "This user has an associated Customer data profile."
        },
        list: {
            chips: {
                anonymous: "Temporary",
                registered: "Permanent",
                unified: "Unified"
            },
            columns: {
                profile: "Profile",
                unifiedProfiles: "Unified Profiles",
                user: "Profile Type"
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
            search: {
                placeholder: "Search by profile ID"
            }
        },
        page: {
            description: "Manage customer profiles which has identity, behavioural and application data",
            pageTitle: "Profiles",
            title: "Profiles"
        }
    },
    sidePanel: {
        ProfileAttributes: "Profile Attributes",
        Profiles: "Profiles",
        UnificationRules: "Unification Rules",
        customerDataProfile: "Customer Data"
    },
    reviewTasks: {
        buttons: {
            retry: "Retry"
        },
        caption: "Attribute comparison",
        confirmations: {
            confirm: {
                content: "You are confirming that these two profiles represent the same user. "
                    + "Merging is irreversible, and the profiles will be merged according to the "
                    + "configured attribute merge strategies.",
                header: "Merge these profiles?",
                primaryAction: "Merge"
            },
            reject: {
                content: "You are confirming that these profiles represent different users. "
                    + "Both profiles will remain independent.",
                header: "Reject this merge?",
                primaryAction: "Reject"
            }
        },
        list: {
            actions: {
                approve: "Merge",
                collapse: "Hide the attribute comparison",
                expand: "Show the attribute comparison",
                reject: "Reject"
            },
            columns: {
                actions: "Actions",
                attribute: "Attribute",
                attributeMatch: "Attribute match",
                candidateProfile: "Candidate profile",
                profile: "Profile",
                profileMatch: "Profile match"
            },
            evidenceMissing: "One of these profiles could not be loaded, so there is nothing to "
                + "check the match against. Reload the page to try again.",
            noBreakdown: "No attribute scores were recorded for this pair.",
            unresolved: "Profile could not be loaded"
        },
        notifications: {
            approved: {
                description: "The profiles have been merged.",
                message: "Match confirmed"
            },
            rejected: {
                description: "The pair has been recorded as different people and will not be raised "
                    + "again unless the evidence materially improves.",
                message: "Marked as not a match"
            },
            resolveFailed: {
                description: "The review task could not be resolved.",
                message: "Something went wrong"
            }
        },
        page: {
            backButton: "Go back to Customer Data",
            description: "Profile pairs that resemble each other closely enough to be worth checking, "
                + "but not closely enough to merge without asking.",
            title: "Review Tasks"
        },
        placeholders: {
            empty: {
                subtitle: "Pairs that need a decision will appear here.",
                title: "Nothing to review"
            },
            error: {
                subtitle: "The review queue could not be loaded, so there may be pairs waiting "
                    + "that are not shown here.",
                title: "Could not load review tasks"
            }
        }
    },
    resolutionSettings: {
        buttons: {
            save: "Update",
            saving: "Updating..."
        },
        description: "Every candidate pair is given a match score from 0 to 1, where 1 means the "
            + "compared values are identical. These settings decide how high that score has to be "
            + "before profiles are unified.",
        errors: {
            autoMergeRange: "The automatic unification score must be between 0 and 1.",
            reviewRange: "The review score must be between 0 and 1.",
            reviewTooHigh: "The review score must be at most {{highest}}. A match held back from automatic "
                + "unification is scored just below that threshold, and it has to stay high enough to "
                + "still be shared for review.",
            reviewTooLow: "The review score must be above {{contradiction}}. It is also the bar a rule has "
                + "to clear to count as agreeing, so a lower value lets barely-related values decide "
                + "whether profiles are unified."
        },
        fields: {
            autoMerge: {
                above: "When the match score is above",
                hint: "A match score at or above this unifies the profiles without administrator review.",
                label: "Unify profiles automatically",
                never: "Never unify profiles automatically",
                neverHint: "No profiles are unified without an administrator approving the match. The "
                    + "score is still used: it sets the score given to a match held back by a "
                    + "contradiction, and it limits how high the review score can be set."
            },
            deterministicMatchDecisive: {
                label: "An exact match is final",
                offHint: "Other rules may object. Two profiles sharing an email but holding different phone "
                    + "numbers are shared for review instead of being unified. Tolerant rules are "
                    + "unaffected.",
                onHint: "A match on any exact rule unifies the profiles straight away, without the other "
                    + "rules being consulted."
            },
            manualReviewThreshold: {
                hint: "A match score at or above this is shared for an administrator to review.",
                label: "Share profiles for an administrator to review if the match is above"
            }
        },
        heading: "Profile unification",
        notifications: {
            saveFailed: {
                description: "The matching settings could not be updated.",
                message: "Update failed"
            },
            saved: {
                description: "The matching settings have been updated.",
                message: "Settings updated"
            }
        },
        page: {
            backButton: "Go back to Customer Data",
            description: "Configure how the Customer Data Service behaves for this organization.",
            title: "Settings"
        }
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
                attributeType: {
                    deterministicHint: "Values are still compared exactly, but the kind decides how much "
                        + "the result counts. A matching identifier can merge profiles on its own and two "
                        + "different ones block a merge, while a matching name cannot do either. Dates and "
                        + "identifiers are also tidied into a standard form first, so the same date written "
                        + "two ways still matches.",
                    fuzzyHint: "This decides how closely two values are compared — names are matched on how "
                        + "they sound, emails on their mailbox and domain separately, addresses on the words "
                        + "they share.",
                    label: "What this attribute holds",
                    options: {
                        DATE: "Date (e.g. date of birth)",
                        EMAIL: "Email address",
                        FUZZY_STRING: "Other",
                        LOCATION: "Location / address",
                        NAME: "Name",
                        PHONE: "Phone number",
                        PRIMITIVE_EXACT: "Other",
                        UNIQUE_ID: "Unique identifier"
                    }
                },
                isActive: {
                    label: "Enable this rule immediately"
                },
                matching: {
                    deterministic: "Exact",
                    deterministicHint: "Only identical values match. This is the safer setting and the one "
                        + "to keep for identifiers, where a difference means a different person.",
                    fuzzy: "Tolerant",
                    fuzzyHint: "Also matches typos and spelling variations, so it finds duplicates exact "
                        + "matching misses. Expect more matches to be sent to a person to confirm.",
                    label: "How it is matched"
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
                matching: "Matching",
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
                    message: "Deleting this rule will permanently remove it and it cannot be undone."
                },
                toggle: {
                    disableContent: "Are you sure you want to disable the rule <1>{{ruleName}}</1>?",
                    disableHeader: "Disable Unification Rule",
                    disableMessage: "Disabling this rule will prevent it from participating in profile unification.",
                    enableContent: "Are you sure you want to enable the rule <1>{{ruleName}}</1>?",
                    enableHeader: "Enable Unification Rule",
                    enableMessage: "Enabling this rule will allow this rule to be invoked in profile matching and unification."
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
            matching: {
                deterministic: "Exact",
                fuzzy: "Tolerant"
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
                    subtitle1: "No unification rules match your search.",
                    subtitle2: "Try adjusting your search criteria.",
                    title: "No Results Found"
                },
                search: "Search by Rule Name or Attribute Name"
            }
        }
    }
};
