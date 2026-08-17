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
                       hint: "A descriptive name used to identify this presentation definition."
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
                   definitionId: {
                       label: "Definition ID",
                       hint:
                           "The unique identifier for this presentation definition. Use this ID when referencing it in API calls."
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
                               label: "Claim Path",
                               placeholder: "given_name",
                               hint: "Use dot notation to specify nested claims, such as address.street_address."
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
                       message: "Name Already Exists",
                       description:
                           "A presentation definition with this name already exists. Please choose a different name."
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
