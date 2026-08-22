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

import { PresentationDefinitionsInterface } from "../../../models";

/* eslint-disable max-len */
/* eslint-disable sort-keys */

export const presentationDefinitions: PresentationDefinitionsInterface = {
           page: {
               title: "Presentation Definitions",
               heading: "Presentation Definitions",
               description:
                   "Create and manage presentation definitions that specify which verifiable credentials a wallet must present."
           },
           buttons: {
               addDefinition: "New Presentation Definition"
           },
           placeholders: {
               emptyList: {
                   subtitle: "There are no presentation definitions configured yet. Click the button to create one."
               },
               emptySearch: {
                   action: "Clear search",
                   title: "No results found",
                   subtitle1: "We couldn't find any presentation definitions matching your search.",
                   subtitle2: "Try a different search term."
               }
           },
           list: {
               columns: {
                   name: "Display Name",
                   description: "Description",
                   actions: "Actions"
               },
               confirmations: {
                   deleteBlockedByConnections: {
                       header: "Unable to Delete",
                       message: "There are connections using this presentation definition.",
                       content: "Remove the associations from these connections before deleting:"
                   },
                   deleteItem: {
                       header: "Delete Presentation Definition?",
                       message: "This action is irreversible and will permanently delete the presentation definition.",
                       content:
                           "If you delete this presentation definition, it can no longer be used to request credentials from users' wallets.",
                       assertionHint: "Please confirm your action."
                   }
               },
               search: {
                   placeholder: "Search by display name",
                   filterAttributePlaceholder: "Filter by",
                   filterConditionsPlaceholder: "Condition",
                   filterValuePlaceholder: "Enter value",
                   attributes: {
                       name: "Display Name"
                   }
               }
           },
           wizard: {
               title: "Create Presentation Definition",
               form: {
                   displayName: {
                       label: "Display Name",
                       placeholder: "Enter a display name for this presentation definition",
                       hint: "A descriptive label used to identify this presentation definition in the UI."
                   },
                   identifier: {
                       label: "Identifier",
                       placeholder: "e.g. employee-id-verification",
                       hint: "A unique identifier for the presentation definition.",
                       validationError: "Only letters, numbers, hyphens (-), and underscores (_) are allowed."
                   },

                   description: {
                       label: "Description",
                       placeholder: "Enter a brief description"
                   },
                   credentialType: {
                       label: "Credential Type",
                       placeholder: "urn:eu:europa:ec:eudi:pid:1",
                       hint:
                           "The Verifiable Credential Type (vct) value that identifies the type of credential to request. It must exactly match the vct value in the credential."
                   },
                   format: {
                       label: "Format",
                       hint: "Specifies the format of the verifiable credential to be requested."
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
                   hint: "Copy these identifiers for use in API calls.",
                   identifier: {
                       label: "Identifier",
                       hint: "The stable, user-facing identifier for this presentation definition. Use this when referencing it in API calls or connections."
                   }
               },

               issuerTrust: {
                   heading: "Issuer Verification",
                   hint: "Configure how the issuer's identity and signature are verified.",
                   keyResolutionMethod: {
                       label: "Issuer Key Resolution Method",
                       hint: "Select how the issuer's public key is obtained to verify the credential signature.",
                       options: {
                           x5c: "X.509 Certificate Chain",
                           jwks_uri: "JWKS URI",
                           pem: "PEM Certificate"
                       }
                   },
                   enforceTrustedIssuer: {
                       label: "Enforce Trusted Issuer",
                       hint:
                           "Enable this to verify that the credential's certificate chain terminates at a trusted root certificate configured in the system."
                   },
                   certificate: {
                       infoUnavailable: "Unable to visualize the certificate details",
                       expiryDate: "Expiry date: {{date}}",
                       actions: {
                           change: "Change certificate",
                           view: "View certificate",
                           delete: "Delete certificate",
                           remove: "Remove certificate"
                       },
                       modal: {
                           title: "View Certificate - {{alias}}",
                           serialNumber: "Serial Number: {{serialNumber}}",
                           unsupportedPrefix:
                               "We were unable to read this certificate. Currently we only support" +
                               " displaying public key information in certificate types of",
                           unsupportedSuffix: "key algorithms."
                       }
                   },
                   trustedCas: {
                       addButton: "Add Certificate",
                       emptyPlaceholder: {
                           title: "No Certificates",
                           subtitle0: "This credential has no trusted CA certificates configured.",
                           subtitle1: "Add a trusted CA certificate to enable issuer verification."
                       },
                       addModal: {
                           header: "Add Trusted CA Certificate",
                           subheading: "Upload a root CA certificate trusted for x5c chain validation.",
                           uploadButtonText: "Upload Certificate File",
                           dropzoneText: "Drag and drop a certificate file here.",
                           pasteAreaPlaceholderText: "Paste root CA certificate in PEM format.",
                           duplicateError: {
                               description: "This certificate has already been added.",
                               message: "Duplicate Certificate"
                           }
                       }
                   },
                   jwksUri: {
                       label: "JWKS URI",
                       placeholder: "https://issuer.example.com/.well-known/jwks.json",
                       hint:
                           "The URL of the issuer's JWKS endpoint used to retrieve public keys for verifying the credential signature."
                   },
                   issuerPem: {
                       hint:
                           "Enter the PEM-encoded X.509 certificate of the credential issuer. The public key will be extracted from the certificate.",
                       addButton: "Add Certificate",
                       replaceButton: "Replace Certificate",
                       modalTitle: "Add Issuer Certificate",
                       emptyPlaceholder: {
                           title: "No Certificate",
                           subtitle: "No issuer certificate has been configured."
                       }
                   }
               },
               form: {
                   displayName: {
                       label: "Display Name",
                       placeholder: "Enter a display name",
                       requiredError: "Display Name is required."
                   },
                   description: {
                       label: "Description",
                       placeholder: "Enter a brief description"
                   },
                   credentials: {
                       label: "Requested Credential",
                       hint: "Define the verifiable credential and claims the wallet must present.",
                       addCredential: {
                           title: "Add Credential"
                       },
                       editCredential: {
                           title: "Edit Credential"
                       },

                       type: {
                           label: "Credential Type",
                           placeholder: "urn:eu:europa:ec:eudi:pid:1"
                       },
                       purpose: {
                           label: "Purpose",
                           placeholder: "Identity Verification"
                       },
                       claims: {
                           label: "Claims",
                           hint: "Specify the claims to request from the credential.",
                           claimPath: {
                               label: "Claim Name",
                               placeholder: "given_name",
                               hint: "Name of the claim to request from the credential. Use dot notation to specify nested claims, such as address.street_address."
                           },
                           editClaim: "Edit Claim",
                           emptyPlaceholder:
                               "No claims added yet. Add a claim to specify which credential attributes to request.",
                           required: {
                               label: "Required",
                               hint: "When enabled, the wallet must include this claim in the presentation."
                           },
                           allowedValues: {
                               label: "Allowed Values",
                               placeholder: "Type a value and press Enter",
                               hint: "When specified, the claim value must match one of these values."
                           },
                           addClaim: "Add Claim"
                       }
                   }
               },
               dangerZone: {
                   header: "Danger Zone",
                   delete: {
                       header: "Delete Presentation Definition",
                       subheader: "Deleting this presentation definition is permanent and cannot be undone.",
                       actionTitle: "Delete Presentation Definition"
                   }
               },
               confirmations: {
                   claimMappedInConnection: {
                       editHeader: "Unable to Edit Claim",
                       deleteHeader: "Unable to Delete Claim",
                       message: "This attribute is mapped in one or more connections.",
                       content: "Remove the attribute mapping from the following connection(s)" +
                           " before {{action}} this claim:"
                   },
                   deleteDefinition: {
                       header: "Delete Presentation Definition?",
                       message: "This action is permanent and cannot be undone.",
                       content:
                           "Deleting this presentation definition will make it unavailable for requesting credentials from users' wallets.",
                       assertionHint: "Please confirm that you want to continue."
                   },
                   deleteBlockedByConnections: {
                       header: "Unable to Delete",
                       message: "This presentation definition is associated with one or more connections.",
                       content: "Remove these associations before deleting the presentation definition:"
                   }
               }
           },
           notifications: {
               fetchDefinitions: {
                   error: {
                       message: "Failed to Load",
                       description: "An error occurred while loading the presentation definitions."
                   }
               },
               fetchDefinition: {
                   error: {
                       message: "Failed to Load",
                       description: "An error occurred while loading the presentation definition details."
                   }
               },
               createDefinition: {
                   success: {
                       message: "Created",
                       description: "The presentation definition was created successfully."
                   },
                   error: {
                       message: "Creation Failed",
                       description: "An error occurred while creating the presentation definition."
                   },

                   duplicateError: {
                       message: "Identifier Already Exists",
                       description:
                           "A presentation definition with this identifier already exists. Please choose a different identifier."
                   }
               },
               updateDefinition: {
                   success: {
                       message: "Updated",
                       description: "The presentation definition was updated successfully."
                   },
                   error: {
                       message: "Update Failed",
                       description: "An error occurred while updating the presentation definition."
                   }
               },
               deleteDefinition: {
                   success: {
                       message: "Deleted",
                       description: "The presentation definition was deleted successfully."
                   },
                   error: {
                       message: "Deletion Failed",
                       description: "An error occurred while deleting the presentation definition."
                   }
               },
           }
       };
