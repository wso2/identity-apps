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
        },
        emptySearch: {
            title: "No results found",
            subtitle1: "We couldn't find any presentation definitions matching your search.",
            subtitle2: "Try a different search term."
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
        },
        search: {
            placeholder: "Search by name",
            filterAttributePlaceholder: "Filter by",
            filterConditionsPlaceholder: "Condition",
            filterValuePlaceholder: "Enter value",
            attributes: {
                name: "Name"
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
            handle: {
                label: "Handle",
                placeholder: "e.g. my-credential",
                hint: "Auto-generated from the name. Identifies the credential query in DCQL. Use letters, numbers, underscores, or hyphens only.",
                validationError: "Only letters, numbers, underscores, and hyphens are allowed."
            },
            description: {
                label: "Description",
                placeholder: "Enter a brief description"
            },
            credentialType: {
                label: "Credential Type",
                placeholder: "e.g. urn:eudi:pid:de:1",
                hint: "The Verifiable Credential Type (vct) claim value as defined in SD-JWT VC (RFC 9596). Must match exactly the vct in the credential issued by the issuer."
            },
            format: {
                label: "Format",
                hint: "SD-JWT VC format that enables selective disclosure of individual claims from a verifiable credential."
            },
            submitButton: "Create"
        }
    },
    editPage: {
        title: "Edit Presentation Definition",
        backButton: "Go back to Presentation Definitions",
        tabs: {
            general: "General",
            settings: "Settings",
            claims: "Claims",
            issuerTrust: "Issuer Verification"
        },
        quickCopy: {
            heading: "Quick Copy",
            hint: "Copy these identifiers to reference this definition in your application or API calls.",
            definitionId: {
                label: "Definition ID",
                hint: "The unique identifier for this presentation definition. Use this ID when referencing it in API calls or application configuration."
            },
            handle: {
                label: "Handle",
                hint: "The DCQL credential query identifier. Used in VP request authorization."
            }
        },
        settings: {
            heading: "Credential Settings",
            hint: "Configure the credential type this definition requests from the wallet."
        },
        issuerTrust: {
            heading: "Issuer Verification",
            hint: "Choose how the issuer's public key is resolved to verify the credential signature.",
            keyResolutionMethod: {
                label: "Key Resolution Method",
                hint: "Select the method to resolve the issuer's public key for signature verification.",
                options: {
                    x5c: "X.509 Certificate Chain",
                    jwks_uri: "JWKS URI",
                    pem: "PEM Certificate",
                    metadata_discovery: "Metadata Discovery (Automatic)"
                }
            },
            enforceTrustedIssuer: {
                label: "Enforce Trusted Issuer",
                hint: "Enable this to verify that the credential's certificate chain ends at a trusted root CA configured in the system.",
                dialogHint: "When enabled, the credential's x5c chain must validate against a trusted root CA. Trusted CA certificates can be configured after saving."
            },
            trustedCas: {
                heading: "Trusted CA Certificates",
                hint: "The x5c chain is accepted if it validates against any of these CAs.",
                disabledHint: "Enable Enforce Trusted Issuer above to manage trusted CA certificates.",
                addButton: "Add Certificate",
                emptyPlaceholder: {
                    title: "No certificates",
                    subtitle0: "This credential has no trusted CA certificates configured.",
                    subtitle1: "Add a certificate to enforce x5c chain validation."
                }
            },
            jwksUri: {
                label: "JWKS URI",
                placeholder: "https://issuer.example.com/.well-known/jwks.json",
                hint: "The URL of the issuer's JSON Web Key Set (JWKS) endpoint used to fetch public keys."
            },
            issuerPem: {
                label: "Issuer PEM Certificate",
                placeholder: "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
                hint: "Paste the PEM-encoded X.509 certificate of the credential issuer. The public key will be extracted from this certificate."
            },
            metadataDiscovery: {
                hint: "Automatically fetches the issuer's public key from their published metadata. " +
                    "No configuration required."
            }
        },
        form: {
            name: {
                label: "Name",
                placeholder: "Enter a name",
                requiredError: "Name is required."
            },
            description: {
                label: "Description",
                placeholder: "Enter a brief description"
            },
            credentials: {
                label: "Requested Credential",
                hint: "Define the verifiable credential the wallet must present.",
                addCredential: {
                    title: "Add Credential"
                },
                editCredential: {
                    title: "Edit Credential"
                },
                credentialId: {
                    label: "Credential ID",
                    placeholder: "e.g. employee_badge",
                    hint: "A unique identifier for this credential entry. Use alphanumeric characters, underscores, or hyphens only."
                },
                type: {
                    label: "Credential Type",
                    placeholder: "e.g. urn:eudi:pid:de:1"
                },
                purpose: {
                    label: "Purpose",
                    placeholder: "e.g. Identity Verification"
                },
                claims: {
                    label: "Claims",
                    hint: "Claim names to request from the credential.",
                    claimPath: {
                        label: "Claim Path",
                        placeholder: "e.g. given_name or address.street_address",
                        hint: "Use dot notation for nested paths, e.g. address.street_address."
                    },
                    mandatory: {
                        label: "Mandatory",
                        hint: "When enabled, the credential must include this claim."
                    },
                    required: {
                        label: "Required",
                        hint: "When enabled, the wallet must include this claim in the credential presentation."
                    },
                    allowedValues: {
                        label: "Allowed Values",
                        placeholder: "Type a value and press Enter",
                        hint: "If set, the claim value must be one of these."
                    },
                    addClaim: "Add Claim"
                },
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
        },
        addCertificate: {
            success: {
                message: "Certificate Added",
                description: "Trusted CA certificate added successfully."
            },
            error: {
                message: "Add Failed",
                description: "An error occurred while adding the certificate."
            },
            genericError: {
                message: "Add Failed",
                description: "An error occurred while adding the certificate."
            }
        },
        deleteCertificate: {
            success: {
                message: "Certificate Deleted",
                description: "Trusted CA certificate deleted successfully."
            },
            error: {
                message: "Delete Failed",
                description: "An error occurred while deleting the certificate."
            },
            genericError: {
                message: "Delete Failed",
                description: "An error occurred while deleting the certificate."
            }
        }
    }
};
