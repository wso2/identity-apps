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

import { flowExtensionNS } from "../../../models";

export const flowExtension: flowExtensionNS = {
    createWizard: {
        steps: {
            endpointConfig: {
                title: "Endpoint Configuration"
            },
            generalSettings: {
                description: {
                    label: "Description",
                    placeholder: "Enter a description for the flow extension.",
                    validations: {
                        maxLength: "The description cannot exceed 255 characters."
                    }
                },
                iconUrl: {
                    hint: "A URL pointing to an icon that represents this flow extension.",
                    label: "Icon URL",
                    placeholder: "https://example.com/icon.svg",
                    validations: {
                        invalid: "Please enter a valid URL."
                    }
                },
                name: {
                    hint: "Enter a unique name to identify this flow extension.",
                    label: "Name",
                    placeholder: "Enter a name for the flow extension.",
                    validations: {
                        invalid: "Please enter a valid name. It must start with an alphanumeric character and"
                            + " can contain letters, numbers, spaces, hyphens and underscores (max 255 characters)."
                    }
                },
                title: "General Settings"
            }
        }
    },
    edit: {
        accessConfig: {
            emptyInfo: "No access configuration has been set. The extension will not send any data and "
                + "will not allow any modifications until you configure access here.",
            resetButton: "Reset",
            treeLoadError: "Failed to load the Flow Extension context tree from the server. Refresh the "
                + "page to retry. If the problem persists, ensure the flow-management API is reachable."
        },
        backButton: "Go back to Connections",
        confirmations: {
            delete: {
                assertionHint: "Please confirm your action.",
                content: "If you delete this flow extension, any flows referencing it may stop working. "
                    + "Please proceed with caution.",
                header: "Are you sure?",
                message: "This action is irreversible and will permanently delete the flow extension."
            },
            reset: {
                assertionHint: "Please confirm your action.",
                content: "The extension will no longer send any data and will not allow any modifications "
                    + "until you reconfigure access here. This action cannot be undone.",
                header: "Reset Access Configuration",
                message: "This will clear all expose and modify annotations."
            }
        },
        dangerZone: {
            delete: {
                actionTitle: "Delete",
                header: "Delete flow extension",
                subheader: "Once you delete a flow extension, it cannot be recovered. Please be certain."
            }
        },
        endpoint: {
            title: "Endpoint Configuration"
        },
        general: {
            description: {
                label: "Description",
                placeholder: "Enter a description for the flow extension.",
                validations: {
                    maxLength: "The description cannot exceed 255 characters."
                }
            },
            iconUrl: {
                hint: "A URL pointing to an icon that represents this flow extension.",
                label: "Icon URL",
                placeholder: "https://example.com/icon.svg",
                validations: {
                    invalid: "Please enter a valid URL."
                }
            },
            name: {
                hint: "Enter a unique name to identify this flow extension.",
                label: "Name",
                placeholder: "Enter a name for the flow extension.",
                validations: {
                    invalid: "Please enter a valid name. It must start with an alphanumeric character and"
                        + " can contain letters, numbers, spaces, hyphens and underscores (max 255 characters)."
                }
            }
        },
        pageTitle: "Edit Flow Extension",
        tabs: {
            accessConfig: {
                label: "Access Configuration"
            },
            endpoint: {
                label: "Endpoint"
            },
            general: {
                label: "General"
            }
        }
    },
    notifications: {
        createError: {
            description: "An error occurred while creating the flow extension.",
            message: "Flow Extension Creation Error"
        },
        createSuccess: {
            description: "Successfully created the flow extension.",
            message: "Creation Successful"
        },
        deleteError: {
            description: "An error occurred while deleting the flow extension.",
            message: "Flow Extension Deletion Error"
        },
        deleteSuccess: {
            description: "Successfully deleted the flow extension.",
            message: "Deletion Successful"
        },
        fetchError: {
            description: "An error occurred while retrieving the flow extension.",
            message: "Retrieval Error"
        },
        resetSuccess: {
            description: "Access configuration has been reset successfully.",
            message: "Reset Successful"
        },
        updateError: {
            description: "An error occurred while updating the flow extension.",
            message: "Flow Extension Update Error"
        },
        updateSuccess: {
            description: "Successfully updated the flow extension.",
            message: "Update Successful"
        }
    },
    contextTree: {
        addClaimModal: {
            addButton: "Add Claims",
            cancelButton: "Cancel",
            fetchError: {
                description: "Failed to retrieve local claims.",
                message: "Error fetching claims"
            },
            noOptions: "No claims available",
            readOnlyBadge: "Read-only",
            searchPlaceholder: "Search and select claims by name or URI...",
            subtitle: "Select the claims to add to the claims map.",
            title: "Add Claims"
        },
        addEntryModal: {
            attributes: {
                arrayTooltip: "Array of this type",
                label: "Attributes",
                namePlaceholder: "Attribute name"
            },
            cancelButton: "Cancel",
            dataType: {
                label: "Data Type"
            },
            keyName: {
                label: "Key Name",
                placeholder: "e.g. risk-factor"
            },
            multivalued: "Multivalued",
            structurePreview: "Structure preview",
            submitButton: {
                create: "Add Entry",
                edit: "Save Changes"
            },
            subtitle: {
                map: "Define the key that will be written into the map at runtime",
                object: "Define the key, value shape, and its attributes"
            },
            title: {
                createMap: "Add Map Entry",
                createObject: "Add Complex Object Entry",
                editMap: "Edit Map Entry",
                editObject: "Edit Complex Object Entry"
            }
        },
        fieldConfig: {
            deleteTooltip: "Delete",
            editTooltip: "Edit",
            emptyHint: "Select a leaf field from the tree to configure it.",
            emptyTitle: "No field selected",
            readOnlyBadge: "Read-Only",
            title: "Field Configuration"
        },
        node: {
            addEntryChip: "+ ADD ENTRY",
            noEntries: "No entries yet",
            readChip: "READ",
            readOnlyBadge: "Read-Only",
            writeChip: "WRITE"
        }
    },
    properties: {
        connectionLabel: "Connection",
        connectionPlaceholder: "Select a connection",
        description: "Select an flow extension to link with this flow step.",
        noConnectionsWarning: "No active flow extensions available. You can create a flow extension connection using the {{productName}} APIs.",
        noConnectionsWarningWithSupport: "No active flow extensions available. You can create a flow extension connection using the {{productName}} APIs. Please contact <1>{{productName}} support</1> to get started."
    }
};
