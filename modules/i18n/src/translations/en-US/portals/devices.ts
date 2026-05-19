/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
    advancedSearch: {
        form: {
            inputs: {
                filterAttribute: {
                    placeholder: "E.g. Device name, user, status etc."
                },
                filterCondition: {
                    placeholder: "E.g. Starts with etc."
                },
                filterValue: {
                    placeholder: "Enter value to search"
                }
            }
        },
        placeholder: "Search by device name"
    },
    assurancePolicies: {
        wizard: {
            heading: "Create Device Assurance Policy",
            subHeading: "Create a new device assurance policy for your organization.",
            steps: {
                executionRules: {
                    clearRule: "Clear Rule",
                    configureRule: "Configure Rule",
                    description: "Configure the rule conditions for each selected platform.",
                    emptyState: {
                        description: "Policy is applied to all {{platform}} devices. Configure a rule to scope by device and user attributes.",
                        heading: "No execution rule is configured."
                    },
                    executeIf: "Execute If",
                    heading: "Configure Rules",
                    loadingMetadata: "Loading field definitions...",
                    noMetadata: "No rule fields are available for this platform.",
                    sectionLabel: "Execution Rule",
                    title: "Execution Rules"
                },
                platform: {
                    description: "Pick one or more platforms. On the next step you'll define an execution rule for each platform separately — fields available depend on the platform.",
                    heading: "Target platforms",
                    title: "Basic Details"
                },
                review: {
                    conditionCount: "{{count}} condition(s) across {{groups}} group(s)",
                    description: "Review the policy details before creating.",
                    edit: "Edit",
                    heading: "Review",
                    noRuleNote: "Applies to all {{platform}} devices",
                    noRules: "No conditions configured.",
                    platforms: "Platforms",
                    policyName: "Policy Name",
                    rules: "Conditions",
                    sectionPolicy: "Policy",
                    sectionRules: "Execution rules",
                    title: "Review & Save",
                    assignHint: {
                        loginFlow: "To assign this policy in a <strong>login flow</strong>, use an Adaptive Authentication script.",
                        otherFlows: "To assign this policy in other flows (e.g. User Registration, Self Registration), click the <strong>cogwheel icon</strong> on the executor step and select this policy.",
                        title: "How to apply this policy"
                    }
                },
                ruleBuilder: {
                    conditionsDescription: "Enable the conditions you want to enforce and configure their values.",
                    conditionsHeading: "Conditions",
                    description: "Define a name and configure the conditions for this policy.",
                    heading: "Configure Policy",
                    policyNameLabel: "Policy Name",
                    policyNamePlaceholder: "Enter a name for this policy",
                    title: "Configure"
                }
            },
            platformDescriptions: {
                android: "Phones, tablets, wearables",
                ios: "iPhone, iPad",
                macos: "MacBook, iMac, Mac mini",
                windows: "Windows 10 / 11 devices"
            },
            platforms: {
                android: "Android",
                ios: "iOS",
                macos: "macOS",
                windows: "Windows"
            },
            buttons: {
                back: "Back",
                cancel: "Cancel",
                create: "Create",
                next: "Next",
                save: "Save"
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
                metadataFetch: {
                    genericError: {
                        description: "An error occurred while loading policy field metadata.",
                        message: "Failed to load metadata"
                    }
                }
            }
        },
        description: "Define and manage device assurance policies for your organization.",
        list: {
            columns: {
                actions: "Actions",
                name: "Policy Name"
            },
            confirmations: {
                delete: {
                    assertionHint: "Please confirm your action.",
                    content: "This action is irreversible. The policy will be permanently removed.",
                    header: "Are you sure?",
                    message: "If you delete this policy, it cannot be recovered."
                }
            }
        },
        notifications: {
            delete: {
                error: {
                    description: "An error occurred while deleting the device policy.",
                    message: "Delete failed"
                },
                success: {
                    description: "The device policy has been deleted successfully.",
                    message: "Policy deleted"
                }
            },
            fetch: {
                genericError: {
                    description: "An error occurred while retrieving device policies.",
                    message: "Retrieval failed"
                }
            }
        },
        placeholders: {
            empty: {
                subtitles: {
                    0: "There are no device assurance policies configured yet."
                },
                title: "No Policies"
            }
        },
        edit: {
            backButton: "Go back to Device Assurance Policies",
            editButton: "Edit Policy",
            wizard: {
                heading: "Update Device Assurance Policy",
                subHeading: "Update the device assurance policy for your organization."
            },
            sections: {
                conditions: {
                    columns: {
                        field: "Condition",
                        operator: "Operator",
                        value: "Value"
                    },
                    description: "The following conditions must all be met for this policy to pass.",
                    heading: "Conditions"
                },
                platform: {
                    heading: "Platform"
                }
            },
            notifications: {
                fetch: {
                    genericError: {
                        description: "An error occurred while retrieving the device policy.",
                        message: "Retrieval failed"
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
            }
        },
        title: "Device Assurance Policies"
    },
    description: "View and manage devices registered by users in your organization.",
    list: {
        columns: {
            actions: "Actions",
            deviceName: "Device",
            registeredAt: "Registered At",
            status: "Status",
            user: "User"
        },
        confirmations: {
            delete: {
                assertionHint: "Please confirm your action.",
                content: "This action is irreversible. The device will be permanently removed.",
                header: "Are you sure?",
                message: "If you delete this device, the user will need to re-register it."
            }
        }
    },
    notifications: {
        delete: {
            error: {
                description: "An error occurred while deleting the device.",
                message: "Delete failed"
            },
            success: {
                description: "The device has been deleted successfully.",
                message: "Device deleted"
            }
        },
        fetch: {
            genericError: {
                description: "An error occurred while retrieving devices.",
                message: "Retrieval failed"
            }
        }
    },
    placeholders: {
        empty: {
            subtitles: {
                0: "There are no registered devices in your organization yet."
            },
            title: "No Devices"
        },
        emptySearch: {
            action: "Clear search query",
            subtitles: {
                0: "We could not find any results for \"{{searchQuery}}\"",
                1: "Please try a different search term."
            },
            title: "No results found"
        }
    },
    title: "Registered Devices",
    detail: {
        backButton: "Go back to Registered Devices",
        notifications: {
            fetch: {
                genericError: {
                    description: "An error occurred while retrieving the device details.",
                    message: "Retrieval failed"
                }
            }
        },
        sections: {
            deviceInfo: {
                fields: {
                    deviceModel: "Model",
                    deviceName: "Device Name",
                    registeredAt: "Registered At",
                    status: "Status"
                },
                heading: "Device Information"
            },
            metadata: {
                columns: {
                    key: "Property",
                    value: "Value"
                },
                description: "Additional hardware and software properties reported by the device.",
                empty: "No metadata available for this device.",
                heading: "Device Metadata"
            },
            userInfo: {
                fields: {
                    email: "Email",
                    username: "Username"
                },
                heading: "Registered User",
                notFound: "User details could not be loaded."
            }
        }
    }
};
