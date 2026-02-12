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

import { CustomerDataServiceNS } from "../../../models/namespaces";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */

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
            notAllowed: "Not allowed"
        }
    },
    profiles: {
        list: {
            columns: {
                profile: "Profile",
                user: "User",
                unifiedProfiles: "Unified Profiles"
            },
            chips: {
                anonymous: "Anonymous",
                linked: "Linked",
                unified: "Unified",
                notUnified: "Not unified"
            },
            confirmations: {
                delete: {
                    header: "Delete Profile",
                    message: "This action is irreversible!",
                    content: "Are you sure you want to delete the profile {{profileId}}? This action permanently deletes the profile and the profiles that are merged into.",
                    assertionHint: "Please confirm the deletion."
                }
            },
            notifications: {
                delete: {
                    success: {
                        message: "Profile deleted",
                        description: "The profile was successfully deleted."
                    },
                    error: {
                        message: "Delete failed",
                        description: "Failed to delete the profile."
                    }
                }
            }
        },
        details: {
            page: {
                pageTitle: "Profile",
                fallbackTitle: "Profile",
                description: "Customer profile",
                descriptionLinkedUser: "Linked User ID: {{userId}}",
                backButton: "Go back to Profiles"
            },
            tabs: {
                general: "General",
                unifiedProfiles: "Unified Profiles"
            },
            form: {
                profileId: { label: "Profile ID" },
                userId: { label: "User ID" },
                createdDate: { label: "Created Date" },
                updatedDate: { label: "Updated Date" },
                location: { label: "Location" },
                profileData: { label: "Profile Data" }
            },
            profileData: {
                actions: {
                    view: "View",
                    copy: "Copy",
                    export: "Export"
                },
                modal: {
                    title: "Profile Data"
                },
                copy: {
                    success: {
                        message: "Copied",
                        description: "Profile data copied to clipboard."
                    }
                },
                export: {
                    success: {
                        message: "Exported",
                        description: "Profile data exported."
                    }
                }
            },
            unifiedProfiles: {
                title: "Merged From",
                empty: "No unified profiles found for this profile.",
                columns: {
                    profileId: "Profile ID",
                    reason: "Reason"
                }
            },
            dangerZone: {
                delete: {
                    header: "Delete this profile",
                    subheader: "This profile is not linked to a user ID and can be deleted.",
                    actionTitle: "Delete profile"
                }
            },
            confirmations: {
                deleteProfile: {
                    header: "Delete profile",
                    message: "This action cannot be undone.",
                    assertionHint: "I confirm that I want to delete this profile.",
                    profileIdLabel: "Profile ID:"
                }
            },
            notifications: {
                fetchProfile: {
                    error: {
                        message: "Error",
                        description: "Failed to load profile details."
                    }
                },
                deleteProfile: {
                    notAllowed: {
                        message: "Not allowed",
                        description: "Profiles linked to a user cannot be deleted."
                    },
                    success: {
                        message: "Success",
                        description: "Profile deleted successfully."
                    },
                    error: {
                        message: "Error",
                        description: "Failed to delete profile."
                    }
                }
            }
        }
    }
};
