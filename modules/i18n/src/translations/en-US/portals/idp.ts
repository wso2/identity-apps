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
import { IdpNS } from "../../../models";


export const idp: IdpNS = {
    advancedSearch: {
        form: {
            inputs: {
                filterAttribute: {
                    placeholder: "E.g. Name, Enabled etc."
                },
                filterCondition: {
                    placeholder: "E.g. Starts with etc."
                },
                filterValue: {
                    placeholder: "Enter value to search"
                }
            }
        },
        placeholder: "Search by connection name"
    },
    buttons: {
        addAttribute: "Add Attribute",
        addAuthenticator: "New Authenticator",
        addCertificate: "New Certificate",
        addConnector: "New Connector",
        addIDP: "New Connection"
    },
    confirmations: {
        deleteAuthenticator: {
            assertionHint: "Please type <1>{{ name }}</1> to confirm.",
            content: "If you delete this authenticator, you will not be able to get it back. All the " +
                "applications depending on this also might stop working. Please proceed with caution.",
            header: "Are you sure?",
            message: "This action is irreversible and will permanently delete the authenticator."
        },
        deleteConnector: {
            assertionHint: "Please type <1>{{ name }}</1> to confirm.",
            content: "If you delete this connector, you will not be able to get it back. Please " +
                "proceed with caution.",
            header: "Are you sure?",
            message: "This action is irreversible and will permanently delete the connector."
        },
        deleteIDP: {
            assertionHint: "Please type <1>{{ name }}</1> to confirm.",
            content: "If you delete this connection, you will not be able to recover it. " +
                "Please proceed with caution.",
            header: "Are you sure?",
            message: "This action is irreversible and will permanently delete the connection."
        },
        deleteIDPWithConnectedApps: {
            assertionHint: "",
            content: "Remove the associations from these applications before deleting:",
            header: "Unable to Delete",
            message: "There are applications using this connection. "
        }
    },
    connectedApps: {
        action: "Go to Login Flow",
        applicationEdit: {
            back: "Go back to {{idpName}}"
        },
        genericError: {
            description: "Error occurred while trying to retrieve connected applications.",
            message: "Error Occurred."
        },
        header: "Connected Application(s) of {{idpName}}.",
        placeholders: {
            emptyList: "There are no applications connected to {{idpName}} at the moment.",
            search: "Search by application name"
        },
        subHeader: "Applications connected to {{idpName}} are listed here."
    },
    dangerZoneGroup: {
        deleteIDP: {
            actionTitle: "Delete Connection",
            header: "Delete Connection",
            subheader: "Once you delete the connection, it cannot be recovered. Please be certain."
        },
        disableIDP: {
            actionTitle: "Disable Connection",
            header: "Disable Connection",
            subheader: "Once you disable the connection, it can no longer be used until " +
                "you enable it again.",
            subheader2: "Enable the connection to use it with your applications."
        },
        header: "Danger Zone"
    },
    forms: {
        advancedConfigs: {
            alias: {
                hint: "If the resident connection is known by an alias at the federated identity " +
                    "provider, specify it here.",
                label: "Alias"
            },
            certificateType: {
                certificateJWKS: {
                    label: "Use JWKS endpoint",
                    placeholder: "Value should be the certificate in JWKS format.",
                    validations: {
                        empty: "Certificate value is required",
                        invalid: "JWKS endpoint should be a valid URI."
                    }
                },
                certificatePEM: {
                    label: "Provide certificate",
                    placeholder: "Value should be a PEM URL.",
                    validations: {
                        empty: "Certificate value is required"
                    }
                },
                hint: "If the type is JWKS, the value should be a JWKS URL. If the type is PEM, the" +
                    " value should be the certificate in PEM format.",
                label: "Select Certificate Type"
            },
            federationHub: {
                hint: "Check if this points to a federation hub connection",
                label: "Federation Hub"
            },
            homeRealmIdentifier: {
                hint: "Enter the home realm identifier for this connection",
                label: "Home Realm Identifier"
            },
            implicitAssociation: {
                enable: {
                    hint: "During token exchange if there is a matching local account found," +
                    " it will be linked implicitly",
                    label: "Implicit account linking"
                },
                primaryAttribute: {
                    hint: "Select the primary attribute that will be used to check if" +
                    " there is a matching local user account",
                    label: "Primary lookup attribute"
                },
                secondaryAttribute: {
                    hint: "Secondary attribute will be used if a unique user is not found using the primary attribute",
                    label: "Secondary lookup attribute"
                },
                warning: "Ensure that the selected attributes are verified by the token issuer"
            }
        },
        attributeSettings: {
            attributeListItem: {
                validation: {
                    empty: "Please enter a value"
                }
            },
            attributeMapping: {
                addAttributeButtonLabel: "Add Attribute Mapping",
                attributeColumnHeader: "Attribute",
                attributeDropdown: {
                    label: "Maps to",
                    noResultsMessage: "Try another attribute search.",
                    placeHolder: "Select mapping attribute"
                },
                attributeMapColumnHeader: "Connection attribute",
                attributeMapInputPlaceholderPrefix: "eg: Connection's attribute for ",
                attributeMapTable: {
                    externalAttributeColumnHeader: "External Connection Attribute",
                    mappedAttributeColumnHeader: "Mapped Attribute"
                },
                componentHeading: "Attributes Mapping",
                externalAttributeInput: {
                    existingErrorMessage: "There's already a attribute mapped with this name.",
                    label: "External IdP Attribute",
                    placeHolder: "Enter external IdP attribute"
                },
                heading: "Connection Attribute Mappings",
                hint: "Add attributes supported by connection",
                modal: {
                    header: "Add Attribute Mappings",
                    placeholder: {
                        subtitle: "Map attributes and click Add Attribute Mapping to get started.",
                        title: "You haven't selected any attributes"
                    }
                },
                placeHolder: {
                    action: "Add Attribute Mapping",
                    subtitle: "There are no mapped attributes added for this connection at the moment.",
                    title: "No mapped attributes found"
                },
                search: {
                    placeHolder: "Search mapped attributes"
                },
                subheading: "Add and map the supported attributes from external connection."
            },
            attributeProvisioning: {
                attributeColumnHeader: {
                    0: "Attribute",
                    1: "Connection attribute"
                },
                attributeMapColumnHeader: "Default value",
                attributeMapInputPlaceholderPrefix: "eg: a default value for the ",
                componentHeading: "Provisioning Attributes Selection",
                hint: "Specify required attributes for provisioning"
            },
            attributeSelection: {
                searchAttributes: {
                    placeHolder: "Search attributes"
                }
            }
        },
        authenticatorAccordion: {
            default: {
                0: "Default",
                1: "Make default"
            },
            enable: {
                0: "Enabled",
                1: "Disabled"
            }
        },
        common: {
            customProperties: "Custom Properties",
            internetResolvableErrorMessage: "URL must be internet resolvable.",
            invalidQueryParamErrorMessage: "These are not valid query parameters",
            invalidURLErrorMessage: "Enter a valid URL",
            requiredErrorMessage: "This is required"
        },
        generalDetails: {
            description: {
                hint: "A meaningful description about the connection.",
                label: "Description",
                placeholder: "Enter a description of the connection."
            },
            image: {
                hint: "A URL to query the image of the connection.",
                label: "Connection Image URL",
                placeholder: "E.g. https://example.com/image.png"
            },
            name: {
                hint: "Enter a unique name for this connection.",
                label: "Connection Name",
                placeholder: "Enter a name for the connection.",
                validations: {
                    duplicate: "A connection already exists with this name",
                    empty: "Connection name is required",
                    maxLengthReached: "Connection name cannot exceed {{ maxLength }} characters."
                }
            }
        },
        jitProvisioning: {
            enableJITProvisioning: {
                disabledMessageContent: {
                    1: "You cannot modify Proxy Mode settings since multiple applications" +
                        " depend on this connection. To resolve this conflict, you need" +
                        " to remove this connection from the listed resources.",
                    2: "You are not allowed to modify Proxy Mode settings as an application" +
                        " depends on this connection. To resolve this conflict, you need to remove" +
                        " this connection from the listed resource."
                },
                disabledMessageHeader: "Operation Not Allowed",
                hint: "Specify if users federated from this identity provider need to be proxied.",
                label: "Just-in-Time (JIT) User Provisioning"
            },
            provisioningScheme: {
                children: {
                    0: "Prompt for username, password and consent",
                    1: "Prompt for password and consent",
                    2: "Prompt for consent",
                    3: "Provision silently"
                },
                hint: "Select the scheme to be used, when users are provisioned.",
                label: "Provisioning scheme"
            },
            provisioningUserStoreDomain: {
                hint: "Select user store domain name to provision users.",
                label: "User store domain to always provision users"
            }
        },
        outboundConnectorAccordion: {
            default: {
                0: "Default",
                1: "Make default"
            },
            enable: {
                0: "Enabled",
                1: "Disabled"
            }
        },
        outboundProvisioningRoles: {
            heading: "OutBound Provisioning Roles",
            hint: "Select and add as connection outbound provisioning roles",
            label: "Role",
            placeHolder: "Select Role",
            popup: {
                content: "Add Role"
            }
        },
        outboundProvisioningTitle: "Outbound Provisioning Connectors",
        roleMapping: {
            heading: "Role Mapping",
            hint: "Map local roles with the Identity Provider roles",
            keyName: "Local Role",
            validation: {
                duplicateKeyErrorMsg: "This role is already mapped. Please select another role",
                keyRequiredMessage: "Please enter the local role",
                valueRequiredErrorMessage: "Please enter an IDP role to map to"
            },
            valueName: "Connection Role"
        },
        uriAttributeSettings: {
            role: {
                heading: "Role",
                hint: "Specifies the attribute that identifies the roles at the connection",
                label: "Role Attribute",
                placeHolder: "Select Attribute",
                validation: {
                    empty: "Please select an attribute for role"
                }
            },
            subject: {
                heading: "Subject",
                hint: "Specifies the attribute that identifies the user at the connection",
                label: "Subject Attribute",
                placeHolder: "Select Attribute",
                validation: {
                    empty: "Please select an attribute for subject"
                }
            }
        }
    },
    helpPanel: {
        tabs: {
            samples: {
                content: {
                    docs: {
                        goBack: "Go back",
                        hint: "Click on the following  connection types to check out the " +
                            "corresponding documentation.",
                        title: "Select a Template Type"
                    }
                },
                heading: "Docs"
            }
        }
    },
    list: {
        actions: "Actions",
        name: "Name"
    },
    modals: {
        addAuthenticator: {
            subTitle: "Add new authenticator to the connection: {{ idpName }}",
            title: "Add New Authenticator"
        },
        addCertificate: {
            subTitle: "Add new certificate to the connection: {{ idpName }}",
            title: "Configure Certificates"
        },
        addProvisioningConnector: {
            subTitle: "Follow the steps to add new outbound provisioning connector",
            title: "Create outbound provisioning connector"
        },
        attributeSelection: {
            content: {
                searchPlaceholder: "Search Attributes"
            },
            subTitle: "Add new attributes or remove existing attributes.",
            title: "Update attribute selection"
        }
    },
    notifications: {
        addFederatedAuthenticator: {
            error: {
                description: "{{ description }}",
                message: "Create error"
            },
            genericError: {
                description: "An error occurred while adding the authenticator.",
                message: "Create error"
            },
            success: {
                description: "Successfully added the authenticator.",
                message: "Create successful"
            }
        },
        addIDP: {
            error: {
                description: "{{ description }}",
                message: "Create error"
            },
            genericError: {
                description: "An error occurred while creating the connection.",
                message: "Create error"
            },
            success: {
                description: "Successfully created the connection.",
                message: "Create successful"
            }
        },
        apiLimitReachedError: {
            error: {
                description: "You have reached the maximum number of connections allowed.",
                message: "Failed to create the connection"
            }
        },
        changeCertType: {
            jwks: {
                description: "Please note that the certificates will be overridden ." +
                    "by the the JWKS endpoint.",
                message: "Warning!"
            },
            pem: {
                description: "Please note that the JWKS endpoint will be overridden ." +
                    "by the certificates.",
                message: "Warning!"
            }
        },
        deleteCertificate: {
            error: {
                description: "{{ description }}",
                message: "Certificate delete error"
            },
            genericError: {
                description: "An error occurred while deleting the certificate.",
                message: "Certificate delete error"
            },
            success: {
                description: "Successfully deleted the certificate.",
                message: "Delete successful"
            }
        },
        deleteDefaultAuthenticator: {
            error: {
                description: "The default federated authenticator cannot be deleted.",
                message: "Federated Authenticator Deletion Error"
            },
            genericError: null,
            success: null
        },
        deleteDefaultConnector: {
            error: {
                description: "The default outbound provisioning connector cannot be deleted.",
                message: "Outbound Connector Deletion error"
            },
            genericError: null,
            success: null
        },
        deleteIDP: {
            error: {
                description: "{{ description }}",
                message: "Connection Delete Error"
            },
            genericError: {
                description: "An error occurred while deleting the connection.",
                message: "Connection Delete Error"
            },
            success: {
                description: "Successfully deleted the connection.",
                message: "Delete successful"
            }
        },
        disableAuthenticator: {
            error: {
                description: "You cannot disable the default authenticator.",
                message: "Data validation error"
            },
            genericError: {
                description: "",
                message: ""
            },
            success: {
                description: "",
                message: ""
            }
        },
        disableOutboundProvisioningConnector: {
            error: {
                description: "You cannot disable the default outbound provisioning connector.",
                message: "Data validation error"
            },
            genericError: {
                description: "",
                message: ""
            },
            success: {
                description: "",
                message: ""
            }
        },
        duplicateCertificateUpload: {
            error: {
                description: "The certificate already exists for the IDP: {{idp}}",
                message: "Certificate duplication error "
            },
            genericError: {
                description: "",
                message: ""
            },
            success: {
                description: "",
                message: ""
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
            },
            success: {
                description: "",
                message: ""
            }
        },
        getFederatedAuthenticator: {
            error: {
                description: "{{ description }}",
                message: "Retrieval error"
            },
            genericError: {
                description: "",
                message: "Retrieval error"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getFederatedAuthenticatorMetadata: {
            error: {
                description: "{{ description }}",
                message: "Retrieval error"
            },
            genericError: {
                description: "An error occurred while retrieving authenticator metadata.",
                message: "Retrieval error"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getFederatedAuthenticatorsList: {
            error: {
                description: "{{ description }}",
                message: "Retrieval error"
            },
            genericError: {
                description: "",
                message: "Retrieval error"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getIDP: {
            error: {
                description: "{{ description }}",
                message: "Retrieval Error"
            },
            genericError: {
                description: "An error occurred while retrieving connection details.",
                message: "Retrieval Error"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getIDPList: {
            error: {
                description: "{{ description }}",
                message: "Retrieval Error"
            },
            genericError: {
                description: "An error occurred while retrieving connections.",
                message: "Retrieval Error"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getIDPTemplate: {
            error: {
                description: "{{ description }}",
                message: "Retrieval error"
            },
            genericError: {
                description: "An error occurred while retrieving connection template.",
                message: "Retrieval error"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getIDPTemplateList: {
            error: {
                description: "{{ description }}",
                message: "Retrieval Error"
            },
            genericError: {
                description: "An error occurred while retrieving connection template list.",
                message: "Retrieval Error"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getOutboundProvisioningConnector: {
            error: {
                description: "{{ description }}",
                message: "Retrieval error"
            },
            genericError: {
                description: "An error occurred retrieving the outbound provisioning connector details.",
                message: "Retrieval error"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getOutboundProvisioningConnectorMetadata: {
            error: {
                description: "{{ description }}",
                message: "Retrieval error"
            },
            genericError: {
                description: "An error occurred retrieving the outbound provisioning connector metadata.",
                message: "Retrieval error"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getOutboundProvisioningConnectorsList: {
            error: {
                description: "{{ description }}",
                message: "Retrieval error"
            },
            genericError: {
                description: "An error occurred retrieving the outbound provisioning connectors list.",
                message: "Retrieval error"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getRolesList: {
            error: {
                description: "{{ description }}",
                message: "Retrieval Error"
            },
            genericError: {
                description: "An error occurred while retrieving roles.",
                message: "Retrieval Error"
            },
            success: {
                description: "",
                message: ""
            }
        },
        submitAttributeSettings: {
            error: {
                description: "Need to configure all the mandatory properties.",
                message: "Cannot perform update"
            },
            genericError: {
                description: "",
                message: ""
            },
            success: {
                description: "",
                message: ""
            }
        },
        tierLimitReachedError: {
            emptyPlaceholder: {
                action: "View Plans",
                subtitles: "You can contact the organization administrator or (if you are the " +
                    "administrator) upgrade your subscription to increase the allowed limit.",
                title: "You have reached the maximum number of IdPs allowed " +
                    "for this organization."
            },
            heading: "You’ve reached the maximum limit for IdPs"
        },
        updateClaimsConfigs: {
            error: {
                description: "{{ description }}",
                message: "Update Error"
            },
            genericError: {
                description: "An error occurred while updating claim configurations.",
                message: "Update Error"
            },
            success: {
                description: "Successfully updated claim configurations.",
                message: "Update successful"
            }
        },
        updateFederatedAuthenticator: {
            error: {
                description: "{{ description }}",
                message: "Update error"
            },
            genericError: {
                description: "An error occurred while updating the federated authenticator.",
                message: "Update error"
            },
            success: {
                description: "Successfully updated the federated authenticator.",
                message: "Update successful"
            }
        },
        updateFederatedAuthenticators: {
            error: {
                description: "{{ description }}",
                message: "Update error"
            },
            genericError: {
                description: "An error occurred while updating the federated authenticators.",
                message: "Update error"
            },
            success: {
                description: "Successfully updated the federated authenticators.",
                message: "Update successful"
            }
        },
        updateIDP: {
            error: {
                description: "{{ description }}",
                message: "Update error"
            },
            genericError: {
                description: "An error occurred while updating the connection.",
                message: "Update Error"
            },
            success: {
                description: "Successfully updated the connection.",
                message: "Update successful"
            }
        },
        updateIDPCertificate: {
            error: {
                description: "{{ description }}",
                message: "Update error"
            },
            genericError: {
                description: "An error occurred while updating the connection certificate.",
                message: "Update Error"
            },
            success: {
                description: "Successfully updated the connection certificate.",
                message: "Update successful"
            }
        },
        updateIDPRoleMappings: {
            error: {
                description: "{{ description }}",
                message: "Update Error"
            },
            genericError: {
                description: "An error occurred while updating outbound provisioning role configurations.",
                message: "Update Error"
            },
            success: {
                description: "Successfully updated outbound provisioning role configurations.",
                message: "Update successful"
            }
        },
        updateJITProvisioning: {
            error: {
                description: "",
                message: ""
            },
            genericError: {
                description: "An error occurred while the updating JIT provisioning configurations.",
                message: "Update Error"
            },
            success: {
                description: "Successfully updated the JIT provisioning configurations.",
                message: "Update successful"
            }
        },
        updateOutboundProvisioningConnector: {
            error: {
                description: "{{ description }}",
                message: "Update Error"
            },
            genericError: {
                description: "An error occurred while updating the outbound provisioning connector.",
                message: "Update Error"
            },
            success: {
                description: "Successfully updated the outbound provisioning connector.",
                message: "Update successful"
            }
        },
        updateOutboundProvisioningConnectors: {
            error: {
                description: "{{ description }}",
                message: "Update Error"
            },
            genericError: {
                description: "An error occurred while updating the outbound provisioning connectors.",
                message: "Update Error"
            },
            success: {
                description: "Successfully updated the outbound provisioning connectors.",
                message: "Update Successful"
            }
        }
    },
    placeHolders: {
        emptyAuthenticatorList: {
            subtitles: {
                0: "There are currently no authenticators available.",
                1: "You can add a new authenticator easily by using the",
                2: "predefined templates."
            },
            title: "Add an authenticator"
        },
        emptyCertificateList: {
            subtitles: {
                0: "This connection has no certificates added.",
                1: "Add a certificate to view it here."
            },
            title: "No certificates"
        },
        emptyConnectorList: {
            subtitles: {
                0: "This connection has no outbound provisioning connectors configured.",
                1: "Add a connector to view it here."
            },
            title: "No outbound provisioning connectors"
        },
        emptyIDPList: {
            subtitles: {
                0: "There are no connections available at the moment.",
                1: "You can add a new connection easily by following the",
                2: "steps in the connection creation wizard."
            },
            title: "Add a new Connection"
        },
        emptyIDPSearchResults: {
            subtitles: {
                0: "We couldn't find any results for '{{ searchQuery }}'",
                1: "Please try a different search term."
            },
            title: "No results found"
        },
        noAttributes: {
            subtitles: {
                0: "There are no attributes selected at the moment."
            },
            title: "No attributes added"
        }
    },
    templates: {
        manualSetup: {
            heading: "Manual Setup",
            subHeading: "Create a connection with custom configurations."
        },
        quickSetup: {
            heading: "Quick Setup",
            subHeading: "Predefined set of templates to speed up your connection creation."
        }
    },
    wizards: {
        addAuthenticator: {
            header: "Fill the basic information about the authenticator.",
            steps: {
                authenticatorConfiguration: {
                    title: "Authenticator Configuration"
                },
                authenticatorSelection: {
                    manualSetup: {
                        subTitle: "Add a new authenticator with custom configurations.",
                        title: "Manual Setup"
                    },
                    quickSetup: {
                        subTitle: "Predefined authenticator templates to speed up the process.",
                        title: "Quick Setup"
                    },
                    title: "Authenticator Selection"
                },
                summary: {
                    title: "Summary"
                }
            }
        },
        addIDP: {
            header: "Fill the basic information about the connection.",
            steps: {
                authenticatorConfiguration: {
                    title: "Authenticator Configuration"
                },
                generalSettings: {
                    title: "General settings"
                },
                provisioningConfiguration: {
                    title: "Provisioning Configuration"
                },
                summary: {
                    title: "Summary"
                }
            }
        },
        addProvisioningConnector: {
            header: "Fill the basic information about the provisioning connector.",
            steps: {
                connectorConfiguration: {
                    title: "Connector Details"
                },
                connectorSelection: {
                    defaultSetup: {
                        subTitle: "Select the type of the new outbound provisioning connector",
                        title: "Connector Types"
                    },
                    title: "Connector selection"
                },
                summary: {
                    title: "Summary"
                }
            }
        },
        buttons: {
            finish: "Finish",
            next: "Next",
            previous: "Previous"
        }
    }
};
