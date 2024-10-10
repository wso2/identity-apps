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
/* eslint-disable max-len */

import { IdvpNS } from "../../../models";

export const idvp: IdvpNS = {
    create: {
        notifications: {
            create: {
                genericError: {
                    description: "An error occurred while creating the identity verification provider.",
                    message: "Creation error"
                },
                success: {
                    description: "Successfully created the identity verification provider.",
                    message: "Creation successful"
                }
            }
        }
    },
    delete: {
        confirmation: {
            assertionHint: "Please confirm your action.",
            content: "If you delete this identity verification provider, you will not be able to " +
                "recover it. Please proceed with caution.",
            header: "Are you sure?",
            message: "This action is irreversible and will permanently delete the identity verification " +
                "provider."
        },
        notifications: {
            delete: {
                genericError: {
                    description: "An error occurred while deleting the identity verification provider.",
                    message: "Delete Error"
                },
                success: {
                    description: "Successfully deleted the identity verification provider.",
                    message: "Delete Successful"
                }
            }
        }
    },
    edit: {
        attributeSettings: {
            addButton: "Add Attribute Mapping",
            heading: "Identity Verification Provider Attribute Mappings",
            hint: "Add and map the supported attributes from external Identity Verification Provider.",
            modal: {
                addButton: "Add Attribute Mapping",
                emptyPlaceholder:{
                    description: "Map attributes and click <1>Add Attribute Mapping</1> to get started.",
                    title: "You haven't mapped any attributes"
                },
                header: "Add Attribute Mappings",
                labels: {
                    localClaim: "Maps to",
                    mappedValue: "External IDVP Attribute"
                },
                placeholders: {
                    localClaim: "Select mapping attribute",
                    mappedValue: "Enter external IDVP attribute"
                },
                validation: {
                    duplicate: "There's already an attribute mapped with this name.",
                    invalid: "Please enter a valid input.",
                    required: "This field cannot be empty."
                }
            }
        },
        backButton: "Go back to Connections",
        dangerZone: {
            delete: {
                description: "This is an irreversible action, proceed with caution.",
                header: "Delete identity verification provider"
            },
            disable: {
                disabledDescription: "Enable the identity verification provider to use it with your applications.",
                enabledDescription: "Once you disable an identity verification provider, it can no longer be used until re-enabled.",
                header: "{{ state }} identity verification provider"
            }
        },
        notifications: {
            update: {
                genericError: {
                    description: "An error occurred while updating the identity verification provider.",
                    message: "Update Error"
                },
                success: {
                    description: "Successfully updated the identity verification provider.",
                    message: "Update successful"
                }
            }
        },
        status: {
            disabled: "Disabled",
            enabled: "Enabled",
            notConfigured: {
                description: "Webhook Token is not configured properly. Navigate to the Setup Guide tab for more information.",
                heading: "Not Configured"
            }
        }
    },
    fetch: {
        notifications: {
            idVP: {
                genericError: {
                    description: "An error occurred while retrieving identity verification provider details.",
                    message: "Retrieval Error"
                }
            },
            metadata: {
                genericError: {
                    description: "An error occurred while retrieving metadata for identity verification provider.",
                    message: "Retrieval Error"
                }
            }
        }
    }
};
