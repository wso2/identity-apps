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

import { PresentationDefinitionsNS } from "../../../models";

/* eslint-disable max-len */
/* eslint-disable sort-keys */

export const presentationDefinitions: PresentationDefinitionsNS = {
    page: {
        title: "Presentation Definitions",
        heading: "Presentation Definitions",
        description: "Create and manage presentation definitions that specify which verifiable credentials a wallet must present."
    },
    buttons: {
        addDefinition: "New Presentation Definition"
    },
    placeholders: {
        emptyList: {
            subtitle: "There are no presentation definitions configured yet. Click the button to create one."
        }
    },
    list: {
        columns: {
            name: "Name",
            description: "Description",
            actions: "Actions"
        },
        confirmations: {
            deleteItem: {
                header: "Delete Presentation Definition?",
                message: "This action is irreversible and will permanently delete the presentation definition.",
                content: "If you delete this presentation definition, it will no longer be available for VP requests. Please proceed with caution.",
                assertionHint: "Please confirm your action."
            }
        }
    },
    wizard: {
        title: "Create Presentation Definition",
        form: {
            name: {
                label: "Name",
                placeholder: "Enter a name for this presentation definition",
                hint: "A descriptive name to identify this presentation definition."
            },
            description: {
                label: "Description (optional)",
                placeholder: "Enter a brief description"
            },
            credentials: {
                label: "Requested Credentials",
                hint: "Define the verifiable credentials the wallet must present. At least one credential type is required.",
                credentialQueryId: {
                    label: "Credential Query ID",
                    placeholder: "e.g. my_credential_1",
                    hint: "A unique identifier for this credential query. Used as the key in the DCQL request and wallet response. Only letters, digits, underscores and hyphens are allowed.",
                    patternError: "Only letters, digits, underscores (_) and hyphens (-) are allowed."
                },
                type: {
                    label: "Credential Type",
                    placeholder: "e.g. urn:eudi:pid:de:1"
                },
                purpose: {
                    label: "Purpose (optional)",
                    placeholder: "e.g. Identity Verification"
                },
                claims: {
                    label: "Claims",
                    placeholder: "e.g. given_name, family_name, birth_date",
                    hint: "Comma-separated list of claim names to request.",
                    claimName: {
                        label: "Claim Name",
                        placeholder: "e.g. given_name"
                    },
                    claimPath: {
                        label: "Claim Path",
                        placeholder: "e.g. given_name",
                        hint: "Each field is one path segment. For a simple claim add one segment (e.g. given_name). For a nested claim add multiple segments in order (e.g. address, then street_address).",
                        addSegment: "Add Segment"
                    },
                    mandatory: {
                        label: "Mandatory",
                        hint: "When enabled, the credential must include this claim."
                    },
                    allowedValues: {
                        label: "Allowed Values",
                        placeholder: "Type a value and press Enter",
                        hint: "If set, the claim value must be one of these."
                    },
                    addClaim: "Add Claim"
                },
                claimSets: {
                    label: "Claim Sets",
                    hint: "Define which claim combinations are acceptable. The wallet must satisfy at least one complete set.",
                    optionLabel: "Set {{index}}",
                    optionPlaceholder: "Select claim IDs",
                    addSet: "Add Claim Set"
                },
                enforceTrustedIssuers: {
                    label: "Enforce Trusted Issuers",
                    hint: "When enabled, only credentials issued by the listed trusted issuers will be accepted."
                },
                trustedIssuers: {
                    label: "Trusted Issuers",
                    placeholder: "e.g. https://issuer.example.com",
                    hint: "Comma-separated list of trusted issuer URIs or DIDs."
                },
                issuerCert: {
                    label: "Issuer Certificate",
                    hint: "Configure how to verify the credential issuer's signature.",
                    none: {
                        label: "None",
                        hint: "The credential's JWT must include an x5c certificate chain in its header. Verification will fail if no x5c header is present."
                    },
                    jwks: {
                        label: "Use JWKS endpoint",
                        urlLabel: "JWKS Endpoint URL",
                        urlPlaceholder: "e.g. https://issuer.example.com/jwks",
                        urlHint: "The JWKS endpoint URL of the credential issuer. Used instead of automatic well-known discovery."
                    },
                    pem: {
                        label: "Provide Certificate",
                        hint: "Paste the issuer's public certificate in PEM format. Verification will use this certificate directly without any network call."
                    }
                },
                addButton: "Add Credential"
            },
            submitButton: "Create"
        }
    },
    editPage: {
        title: "Edit Presentation Definition",
        backButton: "Go back to Presentation Definitions",
        tabs: {
            general: "General",
            credentials: "Credentials"
        },
        form: {
            name: {
                label: "Name",
                placeholder: "Enter a name"
            },
            description: {
                label: "Description (optional)",
                placeholder: "Enter a brief description"
            },
            credentials: {
                label: "Requested Credentials",
                hint: "Define the verifiable credentials the wallet must present.",
                noCredentials: "No credentials configured yet. Click \"Add Credential\" to define one.",
                addCredential: { title: "Add Credential" },
                editCredential: { title: "Edit Credential" },
                credentialQueryId: {
                    label: "Credential Query ID",
                    placeholder: "e.g. my_credential_1",
                    hint: "A unique identifier for this credential query. Used as the key in the DCQL request and wallet response. Only letters, digits, underscores and hyphens are allowed.",
                    patternError: "Only letters, digits, underscores (_) and hyphens (-) are allowed."
                },
                type: {
                    label: "Credential Type",
                    placeholder: "e.g. urn:eudi:pid:de:1"
                },
                purpose: {
                    label: "Purpose (optional)",
                    placeholder: "e.g. Identity Verification"
                },
                claims: {
                    label: "Claims",
                    placeholder: "Type a claim name and press Enter",
                    hint: "Claim names to request from the credential (e.g. given_name, birth_date).",
                    claimName: {
                        label: "Claim Name",
                        placeholder: "e.g. given_name"
                    },
                    claimPath: {
                        label: "Claim Path",
                        placeholder: "e.g. given_name",
                        hint: "Each field is one path segment. For a simple claim add one segment (e.g. given_name). For a nested claim add multiple segments in order (e.g. address, then street_address).",
                        addSegment: "Add Segment"
                    },
                    mandatory: {
                        label: "Mandatory",
                        hint: "When enabled, the credential must include this claim."
                    },
                    allowedValues: {
                        label: "Allowed Values",
                        placeholder: "Type a value and press Enter",
                        hint: "If set, the claim value must be one of these."
                    },
                    addClaim: "Add Claim"
                },
                claimSets: {
                    label: "Claim Sets",
                    hint: "Define which claim combinations are acceptable. The wallet must satisfy at least one complete set.",
                    optionLabel: "Set {{index}}",
                    optionPlaceholder: "Select claim IDs",
                    addSet: "Add Claim Set"
                },
                enforceTrustedIssuers: {
                    label: "Enforce Trusted Issuers",
                    hint: "When enabled, only credentials issued by the listed trusted issuers will be accepted."
                },
                trustedIssuers: {
                    label: "Trusted Issuers",
                    placeholder: "Type an issuer URI and press Enter",
                    hint: "Trusted issuer URIs or DIDs. Only enforced when \"Enforce Trusted Issuers\" is on."
                },
                issuerCert: {
                    label: "Issuer Certificate",
                    hint: "Configure how to verify the credential issuer's signature.",
                    none: {
                        label: "None",
                        hint: "The credential's JWT must include an x5c certificate chain in its header. Verification will fail if no x5c header is present."
                    },
                    jwks: {
                        label: "Use JWKS endpoint",
                        urlLabel: "JWKS Endpoint URL",
                        urlPlaceholder: "e.g. https://issuer.example.com/jwks",
                        urlHint: "The JWKS endpoint URL of the credential issuer. Used instead of automatic well-known discovery."
                    },
                    pem: {
                        label: "Provide Certificate",
                        hint: "Paste the issuer's public certificate in PEM format. Verification will use this certificate directly without any network call."
                    }
                },
                addButton: "Add Credential"
            },
            credentialSets: {
                label: "Credential Sets",
                hint: "Define acceptable combinations of credentials. The wallet must satisfy at least one option in each required set.",
                setLabel: "Set {{index}}",
                required: {
                    label: "Required"
                },
                options: {
                    label: "Options",
                    hint: "Each option is a list of credential query IDs that must all be presented. The wallet satisfies the set if it can fulfil any one option.",
                    optionLabel: "Option {{index}}",
                    optionPlaceholder: "Type credential query IDs and press Enter",
                    addOption: "Add Option"
                },
                addSet: "Add Credential Set"
            }
        },
        dangerZone: {
            header: "Danger Zone",
            delete: {
                header: "Delete Presentation Definition",
                subheader: "This action is irreversible. Please proceed with caution.",
                actionTitle: "Delete Presentation Definition"
            }
        },
        confirmations: {
            deleteDefinition: {
                header: "Are you sure?",
                message: "This action is irreversible and will permanently delete the presentation definition.",
                content: "If you delete this presentation definition, it will no longer be available for VP requests.",
                assertionHint: "Please confirm your action."
            }
        }
    },
    notifications: {
        fetchDefinitions: {
            error: {
                message: "Retrieval Failed",
                description: "An error occurred while fetching the presentation definitions."
            }
        },
        fetchDefinition: {
            error: {
                message: "Retrieval Failed",
                description: "An error occurred while fetching the presentation definition details."
            }
        },
        createDefinition: {
            success: {
                message: "Created Successfully",
                description: "The presentation definition has been created successfully."
            },
            error: {
                message: "Creation Failed",
                description: "An error occurred while creating the presentation definition."
            },
            duplicateError: {
                message: "Duplicate Name",
                description: "A presentation definition with this name already exists. Please use a different name."
            }
        },
        updateDefinition: {
            success: {
                message: "Updated Successfully",
                description: "The presentation definition has been updated successfully."
            },
            error: {
                message: "Update Failed",
                description: "An error occurred while updating the presentation definition."
            }
        },
        deleteDefinition: {
            success: {
                message: "Deleted Successfully",
                description: "The presentation definition has been deleted successfully."
            },
            error: {
                message: "Deletion Failed",
                description: "An error occurred while deleting the presentation definition."
            }
        }
    }
};
