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
import { IdvpNS } from "../../../models";

export const idvp: IdvpNS = {
    advancedSearch: {
        form: {
            inputs: {
                filterValue: {
                    placeholder: "Enter the value to search"
                }
            }
        },
        placeholder: "Search by name"
    },
    buttons: {
        addIDVP: "New Identity Verification Provider"
    },
    confirmations: {
        deleteIDVP: {
            assertionHint: "Please confirm your action.",
            content: "If you delete this identity verification provider, you will not be able to " +
                "recover it. Please proceed with caution.",
            header: "Are you sure?",
            message: "This action is irreversible and will permanently delete the identity verification " +
                "provider."
        }
    },
    dangerZoneGroup: {
        deleteIDVP: {
            actionTitle: "Delete",
            header: "Delete identity verification provider",
            subheader: "This is an irreversible action, proceed with caution."
        },
        disableIDVP: {
            actionTitle: "{{ state }} Identity Verification Provider",
            header: "{{ state }} identity verification provider",
            subheader: "Once you disable an identity verification provider, it can no longer be used " +
                "until re-enabled.",
            subheader2: "Enable the identity verification provider to use it with your applications."
        },
        header: "Danger Zone"
    },
    forms: {
        attributeSettings: {
            attributeMapping: {
                addButton: "Add Attribute Mapping",
                emptyPlaceholderCreate:{
                    subtitle: "Map attributes and click <1>Add Attribute Mapping</1> to get started.",
                    title: "You haven't mapped any attributes"
                },
                emptyPlaceholderEdit: {
                    subtitle: "There are no attributes mapped for this Identity Verification Provider.",
                    title: "No attributes mapped"
                },
                heading: "Identity Verification Provider Attribute Mappings",
                hint: "Add and map the supported attributes from external Identity Verification Provider."
            },
            attributeMappingListItem: {
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
            },
            attributeSelectionModal: {
                header: "Add Attribute Mappings"
            }
        },
        generalDetails: {
            description: {
                hint: "A text description for the identity verification provider.",
                label: "Description",
                placeholder: "Enter a description for the identity verification provider."
            },
            name: {
                hint: "Enter a unique name for this identity verification provider.",
                label: "Name",
                placeholder: "Enter a name for the identity verification provider.",
                validations: {
                    duplicate: "An identity verification provider already exists with this name",
                    empty: "Identity Verification Provider name is required",
                    invalid: "Please enter a valid name",
                    maxLengthReached: "Identity verification provider name cannot exceed {{ maxLength }} " +
                        "characters.",
                    required: "Identity Verification Provider name is required"
                }
            }
        }
    },
    list: {
        actions: "Actions",
        name: "Name"
    },
    notifications: {
        addIDVP: {
            error: {
                description: "{{ description }}",
                message: "Create error"
            },
            genericError: {
                description: "An error occurred while creating the identity verification provider.",
                message: "Create error"
            },
            success: {
                description: "Successfully created the identity verification provider.",
                message: "Create successful"
            }
        },
        deleteIDVP: {
            error: {
                description: "{{ description }}",
                message: "Delete Error"
            },
            genericError: {
                description: "An error occurred while deleting the identity verification provider.",
                message: "Delete Error"
            },
            success: {
                description: "Successfully deleted the identity verification provider.",
                message: "Delete Successful"
            }
        },
        getAllLocalClaims: {
            error: {
                description: "{{ description }}",
                message: "Retrieval Error"
            },
            genericError: {
                description: "An error occurred while retrieving attributes.",
                message: "Retrieval Error"
            }
        },
        getIDVP: {
            error: {
                description: "{{ description }}",
                message: "Retrieval Error"
            },
            genericError: {
                description: "An error occurred while retrieving identity verification provider details.",
                message: "Retrieval Error"
            }
        },
        getIDVPList: {
            error: {
                description: "{{ description }}",
                message: "Retrieval Error"
            },
            genericError: {
                description: "An error occurred while retrieving identity verification providers.",
                message: "Retrieval Error"
            }
        },
        getIDVPTemplate: {
            error: {
                description: "{{ description }}",
                message: "Retrieval Error"
            },
            genericError: {
                description: "An error occurred while retrieving identity verification provider template.",
                message: "Retrieval Error"
            }
        },
        getIDVPTemplateType: {
            error: {
                description: "{{ description }}",
                message: "Retrieval Error"
            },
            genericError: {
                description: "An error occurred while retrieving identity verification provider template " +
                    "type.",
                message: "Retrieval Error"
            }
        },
        getIDVPTemplateTypes: {
            error: {
                description: "{{ description }}",
                message: "Retrieval Error"
            },
            genericError: {
                description: "An error occurred while retrieving identity verification provider template" +
                    " types.",
                message: "Retrieval Error"
            }
        },
        getUIMetadata: {
            error: {
                description: "{{ description }}",
                message: "Retrieval Error"
            },
            genericError: {
                description: "An error occurred while retrieving metadata for identity verification " +
                    "provider.",
                message: "Retrieval Error"
            }
        },
        submitAttributeSettings: {
            error: {
                description: "Need to configure all the mandatory properties.",
                message: "Cannot perform update"
            }
        },
        updateIDVP: {
            error: {
                description: "{{ description }}",
                message: "Update error"
            },
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
    placeholders: {
        emptyIDVPList: {
            subtitles: {
                0: "There are no identity verification providers available at the moment.",
                1: "You can add a new identity verification provider easily by following the",
                2: "steps in the identity verification provider creation wizard."
            },
            title: "Add a new Identity Verification Provider"
        },
        emptyIDVPTypeList: {
            subtitles: {
                0: "There are currently no identity verification provider types ",
                1: "available for configuration."
            },
            title: "No identity verification provider types found"
        }
    }
};
