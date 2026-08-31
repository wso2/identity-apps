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
                   subtitle1: "No matching presentation definitions found.",
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
                       hint: "A descriptive for the presentation definition."
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
                   claims: "Attributes",
                   issuerTrust: "Trusted Issuers"
               },
               digitalWalletHint: "Create a <1>Digital Wallet</1> connection to allow users to sign in or " +
                   "register using this presentation definition.",
               quickCopy: {
                   identifier: {
                       label: "Identifier",
                       hint: "A stable identifier for this presentation definition."
                   }
               },

               issuerTrust: {
                   heading: "Trusted Issuers",
                   hint: "Configure which credential issuers you trust and how their signing keys are validated.",
                   keyResolutionMethod: {
                       label: "Trust Method",
                       hint: "Select how the issuer's signing key and identity are trusted.",
                       options: {
                           x5c: "Trusted X.509 Root Certificate",
                           jwks_uri: "JWKS Endpoint",
                           pem: "PEM Certificate"
                       },
                       shortLabels: {
                           x5c: "Trusted X.509 Root Certificate",
                           jwks_uri: "JWKS Endpoint",
                           pem: "PEM Certificate"
                       },
                       optionHints: {
                           x5c:
                               "Trust issuers whose certificate chain is anchored to a configured root certificate. The issuer provides its certificate chain with the credential.",

                           jwks_uri:
                               "Trust the issuer's signing keys from a configured JWKS endpoint. Keys are retrieved automatically during verification.",

                           pem:
                               "Trust a specific issuer certificate. The configured certificate is used directly to verify credential signatures."
                       }
                   },
                   certificate: {
                       infoUnavailable: "Certificate details are unavailable",
                       expiryDate: "Expires: {{date}}",
                       actions: {
                           change: "Change certificate",
                           view: "View certificate",
                           remove: "Remove certificate"
                       },
                       modal: {
                           title: "Certificate Details - {{alias}}",
                           serialNumber: "Serial number: {{serialNumber}}",
                           unsupportedPrefix:
                               "Certificate details cannot be displayed. Public key information is currently supported only for",
                           unsupportedSuffix: "key algorithms."
                       }
                   },
                   jwksUri: {
                       label: "JWKS URI",
                       placeholder: "https://issuer.example.com/.well-known/jwks.json",
                       hint:
                           "The URL of the issuer's JWKS endpoint used to retrieve public keys for verifying the credential signature.",
                       validationError: "Enter a valid URL."
                   },
                   issuerConfig: {
                       addTitle: "Add Trusted Issuer",
                       editTitle: "Edit Trusted Issuer",
                       addButton: "Add Trusted Issuer",
                       emptyPlaceholder: "No trusted issuers configured.",
                       uploadCert: "Add Certificate",

                       keyResolutionMethod: {
                           label: "Trust Method",
                           subheading: "Select how to establish trust in the issuer"
                       },

                       sections: {
                           x5c: { subheading: "Provide Trusted X.509 Root Certificate" },
                           jwksUri: { subheading: "Use JWKS Endpoint" },
                           pem: { subheading: "Provide a PEM certificate" }
                       },

                       issuerUrl: {
                           label: "Issuer URL",
                           placeholder: "https://issuer.example.com",
                           hint: "The URL that identifies the credential issuer.",
                           validationError: "Enter a valid URL."
                       },

                       keySource: {
                           x5cLabel: "Trusted X.509 Root Certificate",
                           pemLabel: "PEM Certificate",
                           dropzone: {
                               description: "Drag and drop a certificate file here.",
                               separator: "- or -"
                           }
                       },

                       table: {
                           methodColumn: "Trust Method",
                           issuerUrlColumn: "Issuer"
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
                       type: {
                           label: "Credential Type",
                           placeholder: "urn:eu:europa:ec:eudi:pid:1"
                       },
                       claims: {
                           label: "Attributes",
                           hint: "Specify the attributes to request from the credential.",
                           addTitle: "Add Attribute",
                           editTitle: "Edit Attribute",
                           claimPath: {
                               label: "Attribute Name",
                               placeholder: "given_name",
                               hint:
                                   "Name of the attribute to request from the credential. Use dot notation to specify nested attributes, such as address.street_address."
                           },
                           editClaim: "Edit Attribute",
                           emptyPlaceholder:
                               "No attributes added yet. Add an attribute to specify which attributes to request.",
                           required: {
                               label: "Required",
                               hint: "When enabled, the wallet must include this attribute in the presentation."
                           },
                           addClaim: "Add Attribute"
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
                       editHeader: "Unable to Edit Attribute",
                       deleteHeader: "Unable to Delete Attribute",
                       message: "This attribute is mapped in one or more connections.",
                       content:
                           "Remove the attribute mapping from the following connection(s)" +
                           " before {{action}} this attribute:"
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
               saveIssuerConfig: {
                   success: {
                       message: "Issuer Saved",
                       description: "The trusted issuer configuration was saved successfully."
                   },
                   error: {
                       message: "Save Failed",
                       description: "An error occurred while saving the issuer configuration."
                   }
               },
               deleteIssuerConfig: {
                   success: {
                       message: "Issuer Removed",
                       description: "The trusted issuer configuration was removed successfully."
                   },
                   error: {
                       message: "Removal Failed",
                       description: "An error occurred while removing the issuer configuration."
                   }
               }
           }
       };
