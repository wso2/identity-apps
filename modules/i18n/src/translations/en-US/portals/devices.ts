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

import { DevicesNS } from "../../../models/namespaces/devices-ns";

export const devices: DevicesNS = {
    assurancePolicies: {
        advancedSearch: {
            emptyResults: {
                clearButton: "Clear search query",
                subtitles: {
                    0: "We could not find any results for \"{{query}}\"",
                    1: "Please try a different search term."
                },
                title: "No results found"
            },
            placeholder: "Search by policy name"
        },
        backButton: "Go back to Login & Registration",
        buttons: {
            add: "New Policy",
            edit: "Edit"
        },
        connector: {
            description: "Define the device conditions users must meet on each platform.",
            header: "Device Assurance"
        },
        description: "Define the device conditions users must meet on each platform.",
        list: {
            columns: {
                actions: "Actions",
                name: "Policy Name"
            },
            confirmations: {
                delete: {
                    assertionHint: "Please confirm your action.",
                    content: "Flows that use this policy will no longer be able to evaluate it. " +
                        "Please proceed with caution.",
                    header: "Are you sure?",
                    message: "This action is irreversible and will permanently delete the policy."
                }
            }
        },
        notifications: {
            delete: {
                genericError: {
                    description: "An error occurred while deleting the device assurance policy.",
                    message: "Delete failed"
                },
                success: {
                    description: "The device assurance policy has been deleted successfully.",
                    message: "Policy deleted"
                }
            },
            fetch: {
                genericError: {
                    description: "An error occurred while retrieving device assurance policies.",
                    message: "Retrieval failed"
                }
            }
        },
        placeholders: {
            empty: {
                subtitles: {
                    0: "There are no device assurance policies configured yet."
                },
                title: "No policies"
            }
        },
        platforms: {
            android: "Android",
            ios: "iOS",
            macos: "macOS",
            windows: "Windows"
        },
        title: "Device Assurance Policies",
        view: {
            backButton: "Go back to Device Assurance Policies",
            notifications: {
                fetch: {
                    genericError: {
                        description: "An error occurred while retrieving the device assurance policy.",
                        message: "Retrieval failed"
                    }
                },
                fetchMetadata: {
                    genericError: {
                        description: "An error occurred while retrieving the device policy conditions.",
                        message: "Retrieval failed"
                    }
                }
            },
            rules: {
                empty: "No conditions are configured for this platform."
            }
        },
        wizard: {
            create: {
                heading: "Create a Device Assurance Policy",
                subHeading: "Define the device conditions users must meet on each platform."
            },
            edit: {
                heading: "Edit {{name}}",
                subHeading: "Change the platforms and device conditions of the policy."
            },
            general: {
                name: {
                    editHint: "The name of a policy cannot be changed.",
                    hint: "A unique name to identify the policy.",
                    label: "Policy Name",
                    placeholder: "Enter a name for the policy",
                    validations: {
                        required: "Policy name is required."
                    }
                },
                platforms: {
                    hint: "Select the platforms this policy applies to. You will define the device " +
                        "conditions for each of them in the next step.",
                    label: "Platforms",
                    validations: {
                        required: "Select at least one platform."
                    }
                }
            },
            notifications: {
                create: {
                    genericError: {
                        description: "An error occurred while creating the device assurance policy.",
                        message: "Creation failed"
                    },
                    success: {
                        description: "The device assurance policy has been created successfully.",
                        message: "Policy created"
                    }
                },
                update: {
                    genericError: {
                        description: "An error occurred while updating the device assurance policy.",
                        message: "Update failed"
                    },
                    success: {
                        description: "The device assurance policy has been updated successfully.",
                        message: "Policy updated"
                    }
                }
            },
            rules: {
                empty: {
                    addRule: "Add Rule",
                    description: "Add a rule with the conditions {{platform}} devices must meet.",
                    title: "No rule is configured."
                },
                hint: "A device passes the policy when it meets any of the condition groups of its platform.",
                validations: {
                    incomplete: "Complete the rules of these platforms before continuing: {{platforms}}."
                }
            },
            steps: {
                general: "General",
                review: "Review",
                rules: "Rules"
            }
        }
    },
    registrationStep: {
        properties: {
            description: "Registers a device for the user. Choose what this step does and, optionally, a "
                + "device policy.",
            noPolicies: "No device policies found",
            phase: {
                hint: "Registering another device takes three steps in order. The Register Another Device "
                    + "widget adds them.",
                label: "Phase",
                options: {
                    FINISH_REGISTRATION: "Check pairing code",
                    INIT_REGISTRATION: "Show QR code",
                    NATIVE_DEVICE_REGISTRATION: "Register this device",
                    PROCESS_DEVICE: "Verify scanned device"
                }
            },
            policy: {
                hint: "Leave empty to register any device.",
                label: "Device policy",
                noPermission: "You do not have permission to view device policies.",
                placeholder: "Select a device policy",
                subOrganization: "Device policies are managed by the parent organization and can't be changed here."
            }
        },
        validation: {
            authenticationRequired: "Add a step that verifies the user, such as Email OTP or Passkey, before "
                + "device registration."
        }
    },
    userDevices: {
        confirmations: {
            deactivate: {
                content: "The device can be activated again at any time.",
                header: "Are you sure?",
                message: "Once deactivated, this device can no longer be used for device checks when the user " +
                    "signs in."
            },
            delete: {
                assertionHint: "Please confirm your action.",
                content: "The user will need to register this device again to use it for device assurance. " +
                    "Please proceed with caution.",
                header: "Are you sure?",
                message: "This action is irreversible and will permanently remove the device."
            }
        },
        list: {
            actions: {
                activate: "Activate",
                deactivate: "Deactivate",
                rename: "Rename"
            },
            columns: {
                actions: "Actions",
                name: "Device",
                registeredAt: "Registered On",
                status: "Status"
            },
            inherited: {
                hint: "This device is registered in the user's parent organization and can only be managed there.",
                label: "Inherited"
            },
            status: {
                ACTIVE: "Active",
                INACTIVE: "Inactive"
            }
        },
        notifications: {
            activate: {
                genericError: {
                    description: "An error occurred while activating the device.",
                    message: "Activation failed"
                },
                success: {
                    description: "The device has been activated successfully.",
                    message: "Device activated"
                }
            },
            deactivate: {
                genericError: {
                    description: "An error occurred while deactivating the device.",
                    message: "Deactivation failed"
                },
                success: {
                    description: "The device has been deactivated successfully.",
                    message: "Device deactivated"
                }
            },
            delete: {
                genericError: {
                    description: "An error occurred while removing the device.",
                    message: "Removal failed"
                },
                success: {
                    description: "The device has been removed successfully.",
                    message: "Device removed"
                }
            },
            fetch: {
                genericError: {
                    description: "An error occurred while retrieving the devices of the user.",
                    message: "Retrieval failed"
                }
            },
            update: {
                genericError: {
                    description: "An error occurred while renaming the device.",
                    message: "Update failed"
                },
                success: {
                    description: "The device has been renamed successfully.",
                    message: "Device renamed"
                }
            }
        },
        placeholders: {
            empty: {
                subtitles: {
                    0: "This user has not registered any devices yet."
                },
                title: "No devices"
            }
        },
        rename: {
            heading: "Rename Device",
            name: {
                label: "Device Name",
                placeholder: "Enter a name for the device"
            }
        }
    }
};
