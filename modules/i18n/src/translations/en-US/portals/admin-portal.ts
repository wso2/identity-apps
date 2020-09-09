/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { AdminPortalNS } from "../../../models";

export const adminPortal: AdminPortalNS = {
    components: {
        advancedSearch: {
            form: {
                inputs: {
                    filterAttribute: {
                        label: "Filter attribute",
                        placeholder: "E.g. Name, Description etc.",
                        validations: {
                            empty: "Filter attribute is a required field."
                        }
                    },
                    filterCondition: {
                        label: "Filter condition",
                        placeholder: "E.g. Starts with etc.",
                        validations: {
                            empty: "Filter condition is a required field."
                        }
                    },
                    filterValue: {
                        label: "Filter value",
                        placeholder: "E.g. admin, wso2 etc.",
                        validations: {
                            empty: "Filter value is a required field."
                        }
                    }
                }
            },
            hints: {
                querySearch: {
                    actionKeys: "Shift + Enter",
                    label: "To search as a query"
                }
            },
            options: {
                header: "Advanced search"
            },
            placeholder: "Search by {{attribute}}",
            popups: {
                clear: "clear search",
                dropdown: "Show options"
            },
            resultsIndicator: "Showing results for the query \"{{query}}\""
        },
        certificates: {
            keystore: {
                advancedSearch: {
                    error: "Filter query format incorrect",
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "E.g. alias etc."
                            },
                            filterCondition: {
                                placeholder: "E.g. Starts with etc."
                            },
                            filterValue: {
                                placeholder: "E.g. wso2carbon etc."
                            }
                        }
                    },
                    placeholder: "Search by alias"
                },
                attributes: {
                    alias: "Alias"
                },
                certificateModalHeader: "View Certificate",
                confirmation: {
                    content: "This action is irreversible and will permanently delete the certificate.",
                    header: "Are you sure?",
                    hint: "Please type <1>{{id}}</1> to confirm.",
                    message: "This action is irreversible and will permanently delete the certificate.",
                    primaryAction: "Confirm",
                    tenantContent: "This will delete the tenant certificate permanently."
                        + "Once deleted, unless you import a new tenant certificate,"
                        + "you won't be able to access the portal applications."
                        + "To continue deleting, enter the alias of the certificate and click delete."
                },
                errorCertificate: "An error occurred while decoding the certificate."
                    + " Please ensure the certificate is valid.",
                errorEmpty: "Either add a certificate file or paste the content of a PEM-encoded certificate.",
                forms: {
                    alias: {
                        label: "Alias",
                        placeholder: "Enter an alias",
                        requiredErrorMessage: "Alias is required"
                    }
                },
                list: {
                    columns: {
                        actions: "Actions",
                        name: "Name"
                    }
                },
                notifications: {
                    addCertificate:{
                        genericError: {
                            description: "An error occurred while importing the certificate.",
                            message: "Something went wrong!"
                        },
                        success: {
                            description: "The certificate has been imported successfully.",
                            message: "Certificate import success"
                        }
                    },
                    deleteCertificate: {
                        genericError: {
                            description: "There was an error while deleting the certificate",
                            message: "Something went wrong!"
                        },
                        success: {
                            description: "The certificate has been successfully deleted.",
                            message: "Certificate deleted successfully"
                        }
                    },
                    download: {
                        success: {
                            description: "The certificate has started downloading.",
                            message: "Certificate download started"
                        }
                    },
                    getAlias: {
                        genericError: {
                            description: "An error occurred while fetching the certificate.",
                            message: "Something went wrong"
                        }
                    },
                    getCertificate: {
                        genericError: {
                            description: "There was an error while fetching "
                                + "the certificate",
                            message: "Something went wrong!"
                        }
                    },
                    getCertificates: {
                        genericError: {
                            description: "An error occurred while fetching certificates",
                            message: "Something went wrong"
                        }
                    },
                    getPublicCertificate: {
                        genericError: {
                            description: "There was an error while fetching the tenant certificate.",
                            message: "Something went wrong!"
                        }
                    }
                },
                pageLayout: {
                    description: "Create and manage certificates in the keystore",
                    primaryAction: "Import Certificate",
                    title: "Certificates"
                },
                placeholders: {
                    emptyList: {
                        action: "Import Certificate",
                        subtitle: "There are currently no certificates available."
                            + "You can import a new certificate by clicking on"
                            + "the button below.",
                        title: "Import Certificate"
                    },
                    emptySearch: {
                        action: "Clear search query",
                        subtitle: "We couldn't find any results for {{searchQuery}},"
                            + "Please try a different search term.",
                        title: "No results found"
                    }
                },
                summary: {
                    issuerDN: "Issuer DN",
                    sn: "Serial Number:",
                    subjectDN: "Subject DN",
                    validFrom: "Not valid before",
                    validTill: "Not valid after",
                    version: "Version"
                },
                wizard: {
                    dropZone: {
                        action: "Upload Certificate",
                        description: "Drag and drop a certificate file here"
                    },
                    header: "Import Certificate",
                    panes: {
                        paste: "Paste",
                        upload: "Upload"
                    },
                    pastePlaceholder: "Paste the content of a PEM certificate",
                    steps: {
                        summary: "Summary",
                        upload: "Upload certificate"
                    }
                }
            },
            truststore: {
                advancedSearch: {
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "E.g. alias, certificate etc."
                            },
                            filterCondition: {
                                placeholder: "E.g. Starts with etc."
                            },
                            filterValue: {
                                placeholder: "E.g. wso2carbon etc."
                            }
                        }
                    },
                    placeholder: "Search by group name"
                }
            }
        },
        claims: {
            dialects: {
                advancedSearch: {
                    error: "Filter query format incorrect",
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "E.g. Dialect URI etc."
                            },
                            filterCondition: {
                                placeholder: "E.g. Starts with etc."
                            },
                            filterValue: {
                                placeholder: "E.g. http://wso2.org/oidc/claim"
                            }
                        }
                    },
                    placeholder: "Search by Dialect URI"
                },
                attributes: {
                    dialectURI: "Dialect URI"
                },
                confirmations: {
                    action: "Confirm",
                    content: "If you delete this external dialect, all the associated external attributes will "
                        + "also be deleted.Please proceed with caution.",
                    header: "Are you sure?",
                    hint: "Please type <1>{{confirm}}</1> to confirm.",
                    message: "This action is irreversible and will permanently delete the selected external dialect."
                },
                dangerZone: {
                    actionTitle: "Delete External Dialect",
                    header: "Delete External Dialect",
                    subheader: "Once you delete an external dialect, there is no going back. " + "Please be certain."
                },
                forms: {
                    dialectURI: {
                        label: "Dialect URI",
                        placeholder: "Enter a dialect URI",
                        requiredErrorMessage: "Enter a dialect URI"
                    },
                    submit: "Update"
                },
                localDialect: "Local Dialect",
                notifications: {
                    addDialect: {
                        error: {
                            description: "An error occurred while adding the external dialect",
                            message: "Something went wrong"
                        },
                        genericError: {
                            description: "The external dialect has been added but not all external "
                                + "attributes were added successfully",
                            message: "External attributes couldn't be added"
                        },
                        success: {
                            description: "The external dialect has been added successfully",
                            message: "External Dialect added successfully"
                        }
                    },
                    deleteDialect: {
                        genericError: {
                            description: "There was an error while deleting the dialect",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The dialect has been deleted successfully!",
                            message: "Dialect deleted successfully"
                        }
                    },
                    fetchADialect: {
                        genericError: {
                            description: "There was an error while fetching the external dialect",
                            message: "Something went wrong"
                        }
                    },
                    fetchDialects: {
                        error: {
                            description: "{{description}}",
                            message: "Retrieval error"
                        },
                        genericError: {
                            description: "Couldn't retrieve claim dialects.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully retrieved claim dialects.",
                            message: "Retrieval successful"
                        }
                    },
                    fetchExternalClaims: {
                        genericError: {
                            description: "There was an error while fetching the external attributes",
                            message: "Something went wrong"
                        }
                    },
                    updateDialect: {
                        genericError: {
                            description: "An error occurred while updating the dialect",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The dialect has been successfully updated.",
                            message: "Dialect update successful"
                        }
                    }
                },
                pageLayout: {
                    edit: {
                        back: "Go back to attribute dialects",
                        description: "Edit external dialect and its attributes",
                        updateDialectURI: "Update Dialect URI",
                        updateExternalAttributes: "Update External Attributes"
                    },
                    list: {
                        description: "Create and manage attribute dialects",
                        primaryAction: "New External Dialect",
                        title: "Attribute Dialects",
                        view: "View local claims"
                    }
                },
                wizard: {
                    header: "Add External Dialect",
                    steps: {
                        dialectURI: "Dialect URI",
                        externalAttribute: "External attributes",
                        summary: "Summary"
                    },
                    summary: {
                        externalAttribute: "External Attribute URI",
                        mappedAttribute: "Mapped Local Attribute URI",
                        notFound: "No external attribute was added."
                    }
                }
            },
            external: {
                advancedSearch: {
                    error: "Filter query format incorrect",
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "E.g. Attribute URI etc."
                            },
                            filterCondition: {
                                placeholder: "E.g. Starts with etc."
                            },
                            filterValue: {
                                placeholder: "E.g. http://axschema.org/namePerson/last"
                            }
                        }
                    },
                    placeholder: "Search by Attribute URI"
                },
                attributes: {
                    attributeURI: "Attribute URI",
                    mappedClaim: "Mapped Local Attribute URI"
                },
                forms: {
                    attributeURI: {
                        label: "Attribute URI",
                        placeholder: "Enter an attribute URI",
                        requiredErrorMessage: "Attribute URI is required"
                    },
                    localAttribute: {
                        label: "Local attribute URI to map to",
                        placeholder: "Select a Local Attribute",
                        requiredErrorMessage: "Select a local attribute to map to"
                    },
                    submit: "Add External Attribute"
                },
                notifications: {
                    addExternalAttribute: {
                        genericError: {
                            description: "An error occurred while adding the external attribute.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The external attribute has been added to the dialect successfully!",
                            message: "External attribute added successfully"
                        }
                    },
                    deleteExternalClaim: {
                        genericError: {
                            description: "There was an error while deleting the external attribute",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The external attribute has been deleted successfully!",
                            message: "External attribute deleted successfully"
                        }
                    },
                    fetchExternalClaims: {
                        error: {
                            description: "{{description}}",
                            message: "Retrieval error"
                        },
                        genericError: {
                            description: "Couldn't retrieve external claims.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully retrieved external claims.",
                            message: "Retrieval successful"
                        }
                    },
                    getExternalAttribute: {
                        genericError: {
                            description: "There was an error while fetching the external attribute",
                            message: "Something went wrong"
                        }
                    },
                    updateExternalAttribute: {
                        genericError: {
                            description: "There was an error while updating the" + " external attribute",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The external attribute has been updated successfully!",
                            message: "External attribute updated successfully"
                        }
                    }
                },
                pageLayout: {
                    edit: {
                        header: "Add External Attribute",
                        primaryAction: "New External Attribute"
                    }
                },
                placeholders: {
                    empty: {
                        subtitle: "Currently, there are no external attributes available for "
                            + "this dialect.",
                        title: "No External Attributes"
                    }
                }
            },
            list: {
                columns: {
                    actions: "Actions",
                    claimURI: "Claim URI",
                    dialectURI: "Dialect URI",
                    name: "Name"
                },
                confirmation: {
                    action: "Confirm",
                    content: "{{message}} Please proceed with caution.",
                    dialect: {
                        message: "If you delete this external dialect, all the"
                            + " associated external attributes will also be deleted.",
                        name: "external dialect"
                    },
                    external: {
                        message: "This will permanently delete the external attribute.",
                        name: "external attribute"
                    },
                    header: "Are you sure?",
                    hint: "Please type <1>{{assertion}}</1> to confirm.",
                    local: {
                        message: "If you delete this local attribute, the user data belonging "
                            + "to this attribute will also be deleted.",
                        name: "local attribute"
                    },
                    message: "This action is irreversible and will permanently delete the selected {{name}}."
                },
                placeholders: {
                    emptyList: {
                        action: {
                            dialect: "New External Attribute",
                            external: "New External Attribute",
                            local: "New Local Attribute"
                        },
                        subtitle: "There are currently no results available."
                            + "You can add a new item easily by following the" + "steps in the creation wizard.",
                        title: {
                            dialect: "Add an External Dialect",
                            external: "Add an External Attribute",
                            local: "Add a Local Attribute"
                        }
                    },
                    emptySearch: {
                        action: "Clear search query",
                        subtitle: "We couldn't find any results for {{searchQuery}}."
                            + "Please try a different search term.",
                        title: "No results found"
                    }
                },
                warning: "This attribute has not been mapped to an attribute" +
                    " in the following userstores:"
            },
            local: {
                additionalProperties: {
                    hint: "Use when writing an extension using current attributes",
                    key: "Name",
                    keyRequiredErrorMessage: "Enter a name",
                    value: "Value",
                    valueRequiredErrorMessage: "Enter a value"
                },
                advancedSearch: {
                    error: "Filter query format incorrect",
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "E.g. name, attribute URI etc."
                            },
                            filterCondition: {
                                placeholder: "E.g. Starts with etc."
                            },
                            filterValue: {
                                placeholder: "E.g. address, gender etc."
                            }
                        }
                    },
                    placeholder: "Search by name"
                },
                attributes: {
                    attributeURI: "Attribute URI"
                },
                confirmation: {
                    content: "If you delete this local attribute, the user data belonging to this attribute "
                        + "will also be deleted. Please proceed with caution.",
                    header: "Are you sure?",
                    hint: "Please type <1>{{name}}</1> to confirm.",
                    message: "This action is irreversible and will permanently delete the selected local attribute.",
                    primaryAction: "Confirm"
                },
                dangerZone: {
                    actionTitle: "Delete Local Attribute",
                    header: "Delete Local Attribute",
                    subheader: "Once you delete a local attribute, there is no going back. "
                        + "Please be certain."
                },
                forms: {
                    attribute: {
                        placeholder: "Enter an attribute to map to",
                        requiredErrorMessage: "Attribute name is a required field"
                    },
                    attributeHint: "A unique ID for the attribute."
                        + " The ID will be appended to the dialect URI to create a attribute URI",
                    attributeID: {
                        label: "Attribute ID",
                        placeholder: "Enter an attribute ID",
                        requiredErrorMessage: "Attribute ID is required"
                    },
                    description: {
                        label: "Description",
                        placeholder: "Enter a description",
                        requiredErrorMessage: "Description is required"
                    },
                    displayOrder: {
                        label: "Display Order",
                        placeholder: "Enter the display order"
                    },
                    displayOrderHint: "This determines the position at which this attribute is "
                        + "displayed in the user profile and the user registration page",
                    name: {
                        label: "Name",
                        placeholder: "Enter a name for the attribute",
                        requiredErrorMessage: "Name is required"
                    },
                    nameHint: "Name of the attribute that will be shown on the user profile "
                        + "and user registration page",
                    readOnly: {
                        label: "Make this attribute read-only"
                    },
                    regEx: {
                        label: "Regular expression",
                        placeholder: "Enter a regular expression"
                    },
                    regExHint: "This regular expression is used to validate the value this attribute can take",
                    required: {
                        label: "Make this attribute required during user registration"
                    },
                    supportedByDefault: {
                        label: "Show this attribute on user profile and user registration page"
                    }
                },
                mappedAttributes: {
                    hint: "Enter the attribute from each userstore that you want to map to this attribute."
                },
                notifications: {
                    addLocalClaim: {
                        genericError: {
                            description: "There was an error while adding the local attribute",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The local attribute has been added successfully!",
                            message: "Local attribute added successfully"
                        }
                    },
                    deleteClaim: {
                        genericError: {
                            description: "There was an error while deleting the local attribute",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The local claim has been deleted successfully!",
                            message: "Local attribute deleted successfully"
                        }
                    },
                    fetchLocalClaims: {
                        error: {
                            description: "{{description}}",
                            message: "Retrieval error"
                        },
                        genericError: {
                            description: "Couldn't retrieve local claims.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully retrieved local claims.",
                            message: "Retrieval successful"
                        }
                    },
                    getAClaim: {
                        genericError: {
                            description: "There was an error while fetching the local attribute",
                            message: "Something went wrong"
                        }
                    },
                    getClaims: {
                        genericError: {
                            description: "There was an error while fetching the local attributes",
                            message: "Something went wrong"
                        }
                    },
                    getLocalDialect: {
                        genericError: {
                            description: "There was an error while fetching the local dialect",
                            message: "Something went wrong"
                        }
                    },
                    updateClaim: {
                        genericError: {
                            description: "There was an error while updating the" + " local attribute",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "This local attribute has been "
                                + "updated successfully!",
                            message: "Local attribute updated successfully"
                        }
                    }
                },
                pageLayout: {
                    edit: {
                        back: "Go back to Local Attributes",
                        description: "Edit local attribute",
                        tabs: {
                            additionalProperties: "Additional Properties",
                            general: "General",
                            mappedAttributes: "Mapped Attributes"
                        }
                    },
                    local: {
                        action: "New Local Attribute",
                        back: "Go back to attribute dialects",
                        description: "Create and manage local attributes",
                        title: "Local Attributes"
                    }
                },
                wizard: {
                    header: "Add Local Attribute",
                    steps: {
                        general: "General",
                        mapAttributes: "Map Attributes",
                        summary: "Summary"
                    },
                    summary: {
                        attribute: "Attribute",
                        attributeURI: "Attribute URI",
                        displayOrder: "Display Order",
                        readOnly: "This attribute is read-only",
                        regEx: "Regular Expression",
                        required: "This attribute is required during user registration",
                        supportedByDefault: "This attribute is shown on user profile and user registration page",
                        userstore: "Userstore"
                    }
                }
            }
        },
        emailLocale: {
            buttons: {
                addLocaleTemplate: "Add Locale Template",
                saveChanges: "Save Changes"
            },
            forms: {
                addLocale: {
                    fields: {
                        bodyEditor: {
                            label: "Body"
                        },
                        locale: {
                            label: "Locale",
                            placeholder: "Select Locale",
                            validations: {
                                empty: "Select locale"
                            }
                        },
                        signatureEditor: {
                            label: "Mail signature"
                        },
                        subject: {
                            label: "Subject",
                            placeholder: "Enter your email subject",
                            validations: {
                                empty: "Email Subject is required"
                            }
                        }
                    }
                }
            }
        },
        emailTemplateTypes: {
            buttons: {
                createTemplateType: "Create Template Type",
                deleteTemplate: "Delete Template",
                editTemplate: "Edit Template",
                newType: "New Template Type"
            },
            confirmations: {
                deleteTemplateType: {
                    assertionHint: "Please type <1>{{ id }}</1> to confirm.",
                    content: "If you delete this email template type, all associated work flows will no longer " +
                        "have a valid email template to work with and this will delete all the locale templates " +
                        "associated with this template type. Please proceed cautiously.",
                    header: "Are you sure?",
                    message: "This action is irreversible and will permanently delete the selected email template " +
                        "type."
                }
            },
            forms: {
                addTemplateType: {
                    fields: {
                        type: {
                            label: "Template Type Name",
                            placeholder: "Enter a template type name",
                            validations: {
                                empty: "Template type name is required to proceed."
                            }
                        }
                    }
                }
            },
            list: {
                actions: "Actions",
                name: "Name"
            },
            notifications: {
                createTemplateType: {
                    error: {
                        description: "{{description}}",
                        message: "Error creating email template type."
                    },
                    genericError: {
                        description: "Couldn't create email template type.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully created the email template type.",
                        message: "Creating email template type is successful"
                    }
                },
                deleteTemplateType: {
                    error: {
                        description: "{{description}}",
                        message: "Error deleting email template type."
                    },
                    genericError: {
                        description: "Couldn't delete email template type.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully deleted the email template type.",
                        message: "Email template type delete successful"
                    }
                },
                updateTemplateType: {
                    error: {
                        description: "{{description}}",
                        message: "Error updating email template type."
                    },
                    genericError: {
                        description: "Couldn't update email template type.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully updated the email template type.",
                        message: "Email template type update successful"
                    }
                }
            },
            placeholders: {
                emptyList: {
                    action: "New Template Type",
                    subtitles: {
                        0: "Currently there are no templates types available.",
                        1: "You can add a new template type by ",
                        2: "clicking on the button below."
                    },
                    title: "Add new Template Type"
                }
            },
            wizards: {
                addTemplateType: {
                    heading: "Create Email Template Type",
                    steps: {
                        templateType: {
                            heading: "Template Type"
                        }
                    },
                    subHeading: "Create a new template type to associate with email requirements."
                }
            }
        },
        emailTemplates: {
            buttons: {
                deleteTemplate: "Delete Template",
                editTemplate: "Edit Template",
                newTemplate: "New Template",
                viewTemplate: "View Template"
            },
            confirmations: {
                deleteTemplate: {
                    assertionHint: "Please type <1>{{ id }}</1> to confirm.",
                    content: "If you delete this email template, all associated work flows will no longer " +
                        "have a valid email template to work with. Please proceed cautiously.",
                    header: "Are you sure?",
                    message: "This action is irreversible and will permanently delete the selected email template."
                }
            },
            editor: {
                tabs: {
                    code: {
                        tabName: "HTML Code"
                    },
                    preview: {
                        tabName: "Preview"
                    }
                }
            },
            list: {
                actions: "Actions",
                name: "Name"
            },
            notifications: {
                createTemplate: {
                    error: {
                        description: "{{description}}",
                        message: "Error creating email template."
                    },
                    genericError: {
                        description: "Couldn't create email template.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully created the email template.",
                        message: "Creating email template is successful"
                    }
                },
                deleteTemplate: {
                    error: {
                        description: "{{description}}",
                        message: "Error deleting email template."
                    },
                    genericError: {
                        description: "Couldn't delete email template.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully deleted the email template .",
                        message: "Email template delete successful"
                    }
                },
                iframeUnsupported: {
                    genericError: {
                        description: "Your browser does not support iframes.",
                        message: "Unsupported"
                    }
                },
                updateTemplate: {
                    error: {
                        description: "{{description}}",
                        message: "Error updating email template."
                    },
                    genericError: {
                        description: "Couldn't update email template.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully updated the email template.",
                        message: "Email template update successful"
                    }
                }
            },
            placeholders: {
                emptyList: {
                    action: "New Template",
                    subtitles: {
                        0: "Currently there are no templates available for the selected",
                        1: "email template type. You can add a new template by ",
                        2: "clicking on the button below."
                    },
                    title: "Add Template"
                }
            },
            viewTemplate: {
                heading: "Email Template Preview"
            }
        },
        footer: {
            copyright: "WSO2 Identity Server © {{year}}"
        },
        governanceConnectors: {
            categories: "Categories",
            connectorSubHeading: "Configure {{ name }} settings.",
            disabled: "Disabled",
            enabled: "Enabled",
            notifications: {
                getConnector: {
                    error: {
                        description: "{{ description }}",
                        message: "Retrieval Error"
                    },
                    genericError: {
                        description: "An error occurred while retrieving governance connector.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "",
                        message: ""
                    }
                },
                getConnectorCategories: {
                    error: {
                        description: "{{ description }}",
                        message: "Retrieval Error"
                    },
                    genericError: {
                        description: "An error occurred while retrieving governance connector categories.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "",
                        message: ""
                    }
                },
                updateConnector: {
                    error: {
                        description: "{{ description }}",
                        message: "Update Error"
                    },
                    genericError: {
                        description: "An error occurred while updating governance connector.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "{{ name }} Connector updated successfully.",
                        message: "Update Successful."
                    }
                }
            },
            pageSubHeading: "Configure and manage {{ name }}."

        },
        groups: {
            advancedSearch: {
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: "E.g. group name."
                        },
                        filterCondition: {
                            placeholder: "E.g. Starts with etc."
                        },
                        filterValue: {
                            placeholder: "Enter value to search"
                        }
                    }
                },
                placeholder: "Search by group name"
            },
            edit: {
                basics: {
                    fields: {
                        groupName: {
                            name: "Group Name",
                            placeholder: "Enter your group name",
                            required: "Group name is required"
                        }
                    }
                }
            },
            list: {
                columns: {
                    actions: "Actions",
                    lastModified: "Last Modified",
                    name: "Name"
                },
                storeOptions: "Select User Store"
            },
            notifications: {
                createGroup: {
                    error: {
                        description: "{{description}}",
                        message: "Error occurred while creating the group."
                    },
                    genericError: {
                        description: "Couldn't create the group.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The group was created successfully.",
                        message: "Group created successfully."
                    }
                },
                createPermission: {
                    error: {
                        description: "{{description}}",
                        message: "Error occurred while adding permission to group."
                    },
                    genericError: {
                        description: "Couldn't add permissions to group.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Permissions were successfully added to the group.",
                        message: "Group created successfully."
                    }
                },
                deleteGroup: {
                    error: {
                        description: "{{description}}",
                        message: "Error deleting the selected group."
                    },
                    genericError: {
                        description: "Couldn't remove the selected group.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The selected group was deleted successfully.",
                        message: "Group deleted successfully"
                    }
                },
                updateGroup: {
                    error: {
                        description: "{{description}}",
                        message: "Error updating the selected group."
                    },
                    genericError: {
                        description: "Couldn't update the selected group.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The selected group was updated successfully.",
                        message: "Group updated successfully"
                    }
                }
            }
        },
        header: {
            links: {
                devPortalNav: "Developer Portal",
                userPortalNav: "My Account"
            }
        },
        helpPanel: {
            notifications: {
                pin: {
                    success: {
                        description: "Help panel will always appear {{state}} unless you change explicitly.",
                        message: "Help panel {{state}}"
                    }
                }
            }
        },
        overview: {
            widgets: {
                insights: {
                    groups: {
                        heading: "Groups",
                        subHeading: "Overview of Groups"
                    },
                    users: {
                        heading: "Users",
                        subHeading: "Overview of Users"
                    }
                },
                overview: {
                    cards: {
                        groups: {
                            heading: "Groups"
                        },
                        users: {
                            heading: "Users"
                        },
                        userstores: {
                            heading: "Userstores"
                        }
                    },
                    heading: "Overview",
                    subHeading: "Basic set of stats to understand the status of the instance."
                },
                quickLinks: {
                    cards: {
                        certificates: {
                            heading: "Certificates",
                            subHeading: "Manage certificates in the keystore."
                        },
                        dialects: {
                            heading: "Attribute Dialects",
                            subHeading: "Manage attribute dialects."
                        },
                        emailTemplates: {
                            heading: "Email Templates",
                            subHeading: "Manage email templates."
                        },
                        generalConfigs: {
                            heading: "General Configurations",
                            subHeading: "Manage configurations, policies, etc."
                        },
                        groups: {
                            heading: "Groups",
                            subHeading: "Manage user groups and permissions."
                        },
                        roles: {
                            heading: "Roles",
                            subHeading: "Manage user roles and permissions."
                        }
                    },
                    heading: "Quick Links",
                    subHeading: "Links to quickly navigate to features."
                }
            }
        },
        privacy: {
            about: {
                description: "WSO2 Identity Server (referred to as “WSO2 IS” within this policy) is an open source " +
                    "Identity Management and Entitlement Server that is based on open standards and specifications.",
                heading: "About WSO2 Identity Server"
            },
            privacyPolicy: {
                collectionOfPersonalInfo: {
                    description: {
                        list1: {
                            0: "WSO2 IS uses your IP address to detect any suspicious login attempts to your account.",
                            1: "WSO2 IS uses attributes like your first name, last name, etc., to provide a rich and" +
                                " personalized user experience.",
                            2: "WSO2 IS uses your security questions and answers only to allow account recovery."
                        },
                        para1: "WSO2 IS collects your information only to serve your access requirements. For example:"
                    },
                    heading: "Collection of personal information",
                    trackingTechnologies: {
                        description: {
                            list1: {
                                0: "Collecting information from the user profile page where you enter your personal" +
                                    " data.",
                                1: "Tracking your IP address with HTTP request, HTTP headers, and TCP/IP.",
                                2: "Tracking your geographic information with the IP address.",
                                3: "Tracking your login history with browser cookies. Please see our" +
                                    " {{cookiePolicyLink}} for more information."
                            },
                            para1: "WSO2 IS collects your information by:"
                        },
                        heading: "Tracking Technologies"
                    }
                },
                description: {
                    para1: "This policy describes how WSO2 IS captures your personal information, the purposes of" +
                        " collection, and information about the retention of your personal information.",
                    para2: "Please note that this policy is for reference only, and is applicable for the software " +
                        "as a product. WSO2 Inc. and its developers have no access to the information held within " +
                        "WSO2 IS. Please see the <1>disclaimer</1> section for more information.",
                    para3: "Entities, organizations or individuals controlling the use and administration of WSO2 IS " +
                        "should create their own privacy policies setting out the manner in which data is controlled " +
                        "or processed by the respective entity, organization or individual."
                },
                disclaimer: {
                    description: {
                        list1: {
                            0: "WSO2, its employees, partners, and affiliates do not have access to and do not " +
                                "require, store, process or control any of the data, including personal data " +
                                "contained in WSO2 IS. All data, including personal data is controlled and " +
                                "processed by the entity or individual running WSO2 IS. WSO2, its employees partners " +
                                "and affiliates are not a data processor or a data controller within the meaning of " +
                                "any data privacy regulations. WSO2 does not provide any warranties or undertake any " +
                                "responsibility or liability in connection with the lawfulness or the manner and " +
                                "purposes for which WSO2 IS is used by such entities or persons.",
                            1: "This privacy policy is for the informational purposes of the entity or persons " +
                                "running WSO2 IS and sets out the processes and functionality contained within " +
                                "WSO2 IS regarding personal data protection. It is the responsibility of entities " +
                                "and persons running WSO2 IS to create and administer its own rules and processes " +
                                "governing users' personal data, and such rules and processes may change the use, " +
                                "storage and disclosure policies contained herein. Therefore users should consult " +
                                "the entity or persons running WSO2 IS for its own privacy policy for details " +
                                "governing users' personal data."
                        }
                    },
                    heading: "Disclaimer"
                },
                disclosureOfPersonalInfo: {
                    description: "WSO2 IS only discloses personal information to the relevant applications (also " +
                        "known as Service Provider) that are registered with WSO2 IS. These applications are " +
                        "registered by the identity administrator of your entity or organization. Personal " +
                        "information is disclosed only for the purposes for which it was collected (or for a " +
                        "use identified as consistent with that purpose), as controlled by such Service Providers, " +
                        "unless you have consented otherwise or where it is required by law.",
                    heading: "Disclosure of personal information",
                    legalProcess: {
                        description: "Please note that the organization, entity or individual running WSO2 IS may " +
                            "be compelled to disclose your personal information with or without your consent when " +
                            "it is required by law following due and lawful process.",
                        heading: "Legal process"
                    }
                },
                heading: "Privacy Policy",
                moreInfo: {
                    changesToPolicy: {
                        description: {
                            para1: "Upgraded versions of WSO2 IS may contain changes to this policy and " +
                                "revisions to this policy will be packaged within such upgrades. Such changes " +
                                "would only apply to users who choose to use upgraded versions.",
                            para2: "The organization running WSO2 IS may revise the Privacy Policy from time to " +
                                "time. You can find the most recent governing policy with the respective link " +
                                "provided by the organization running WSO2 IS. The organization will notify " +
                                "any changes to the privacy policy over our official public channels."
                        },
                        heading: "Changes to this policy"
                    },
                    contactUs: {
                        description: {
                            para1: "Please contact WSO2 if you have any question or concerns regarding this privacy " +
                                "policy."
                        },
                        heading: "Contact us"
                    },
                    heading: "More information",
                    yourChoices: {
                        description: {
                            para1: "If you are already have a user account within WSO2 IS, you have the right to " +
                                "deactivate your account if you find that this privacy policy is unacceptable to you.",
                            para2: "If you do not have an account and you do not agree with our privacy policy, " +
                                "you can choose not to create one."
                        },
                        heading: "Your choices"
                    }
                },
                storageOfPersonalInfo: {
                    heading: "Storage of personal information",
                    howLong: {
                        description: {
                            list1: {
                                0: "Current password",
                                1: "Previously used passwords"
                            },
                            para1: "WSO2 IS retains your personal data as long as you are an active user of our " +
                                "system. You can update your personal data at any time using the given self-care " +
                                "user portals.",
                            para2: "WSO2 IS may keep hashed secrets to provide you with an added level of security. " +
                                "This includes:"
                        },
                        heading: "How long your personal information is retained"
                    },
                    requestRemoval: {
                        description: {
                            para1: "You can request the administrator to delete your account. The administrator is " +
                                "the administrator of the tenant you are registered under, or the " +
                                "super-administrator if you do not use the tenant feature.",
                            para2: "Additionally, you can request to anonymize all traces of your activities " +
                                "that WSO2 IS may have retained in logs, databases or analytical storage."
                        },
                        heading: "How to request removal of your personal information"
                    },
                    where: {
                        description: {
                            para1: "WSO2 IS stores your personal information in secured databases. WSO2 IS " +
                                "exercises proper industry accepted security measures to protect the database " +
                                "where your personal information is held. WSO2 IS as a product does not transfer " +
                                "or share your data with any third parties or locations.",
                            para2: "WSO2 IS may use encryption to keep your personal data with an added level " +
                                "of security."
                        },
                        heading: "Where your personal information is stored"
                    }
                },
                useOfPersonalInfo: {
                    description: {
                        list1: {
                            0: "To provide you with a personalized user experience. WSO2 IS uses your name and " +
                                "uploaded profile pictures for this purpose.",
                            1: "To protect your account from unauthorized access or potential hacking attempts. " +
                                "WSO2 IS uses HTTP or TCP/IP Headers for this purpose.",
                            2: "Derive statistical data for analytical purposes on system performance improvements. " +
                                "WSO2 IS will not keep any personal information after statistical calculations. " +
                                "Therefore, the statistical report has no means of identifying an individual person."
                        },
                        para1: "WSO2 IS will only use your personal information for the purposes for which it was " +
                            "collected (or for a use identified as consistent with that purpose).",
                        para2: "WSO2 IS uses your personal information only for the following purposes.",
                        subList1: {
                            heading: "This includes:",
                            list: {
                                0: "IP address",
                                1: "Browser fingerprinting",
                                2: "Cookies"
                            }
                        },
                        subList2: {
                            heading: "WSO2 IS may use:",
                            list: {
                                0: "IP Address to derive geographic information",
                                1: "Browser fingerprinting to determine the browser technology or/and version"
                            }
                        }
                    },
                    heading: "Use of personal information"
                },
                whatIsPersonalInfo: {
                    description: {
                        list1: {
                            0: "Your user name (except in cases where the user name created by your employer is " +
                                "under contract)",
                            1: "Your date of birth/age",
                            2: "IP address used to log in",
                            3: "Your device ID if you use a device (E.g., phone or tablet) to log in"
                        },
                        list2: {
                            0: "City/Country from which you originated the TCP/IP connection",
                            1: "Time of the day that you logged in (year, month, week, hour or minute)",
                            2: "Type of device that you used to log in (E.g., phone or tablet)",
                            3: "Operating system and generic browser information"
                        },
                        para1: "WSO2 IS considers anything related to you, and by which you may be identified, as " +
                            "your personal information. This includes, but is not limited to:",
                        para2: "However, WSO2 IS also collects the following information that is not considered " +
                            "personal information, but is used only for <1>statistical</1> purposes. The reason " +
                            "for this is that this information can not be used to track you."
                    },
                    heading: "What is personal information?"
                }
            }
        },
        roles: {
            addRoleWizard: {
                buttons: {
                    finish: "Finish",
                    next: "Next",
                    previous: "Previous"
                },
                forms: {
                    roleBasicDetails: {
                        domain: {
                            label: {
                                group: "Userstore",
                                role: "Role Type"
                            },
                            placeholder: "Domain",
                            validation: {
                                empty: {
                                    group: "Select user store",
                                    role: "Select Role Type"
                                }
                            }
                        },
                        roleName: {
                            label: "{{type}} Name",
                            placeholder: "Enter {{type}} Name",
                            validations: {
                                duplicate: "A {{type}} already exists with the given {{type}} name.",
                                empty: "{{type}} Name is required to proceed.",
                                invalid: "Please enter a valid {{type}} name."
                            }
                        }
                    }
                },
                heading: "Create {{type}}",
                permissions: {
                    buttons: {
                        collapseAll: "Collapse All",
                        expandAll: "Expand All",
                        update: "Update"
                    }
                },
                subHeading: "Create a new {{type}} in the system with specific permissions",
                summary: {
                    labels: {
                        domain: {
                            group: "Userstore",
                            role: "Role Type"
                        },
                        permissions: "Permission(s)",
                        roleName: "{{type}} Name",
                        users: "Assigned User(s)"
                    }
                },
                users: {
                    assignUserModal: {
                        heading: "Update {{type}} Users",
                        list: {
                            listHeader: "Name",
                            searchPlaceholder: "Search users"
                        },
                        subHeading: "Add new users or remove existing users assigned to the {{type}}."
                    }
                },
                wizardSteps: {
                    0: "Basic Details",
                    1: "Permission Selection",
                    2: "Assign Users",
                    3: "Summary",
                    4: "Groups & Users",
                    5: "Assign Roles"
                }
            },
            advancedSearch: {
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: "E.g. role name."
                        },
                        filterCondition: {
                            placeholder: "E.g. Starts with etc."
                        },
                        filterValue: {
                            placeholder: "Enter value to search"
                        }
                    }
                },
                placeholder: "Search by role name"
            },
            edit: {
                basics: {
                    buttons: {
                        update: "Update"
                    },
                    confirmation: {
                        assertionHint: "Please type <1>{{ roleName }}</1> to confirm.",
                        content: "If you delete this {{type}}, the permissions attached to it will be deleted and " +
                            "the users attached to it will no longer be able to perform intended actions which were " +
                            "previously allowed. Please proceed with caution",
                        header: "Are you sure?",
                        message: "This action is irreversible and will permanently delete the selected {{type}}"
                    },
                    dangerZone: {
                        actionTitle: "Delete {{type}}",
                        header: "Delete {{type}}",
                        subheader: "Once you delete the {{type}}, there is no going back. Please be certain."
                    },
                    fields: {
                        roleName: {
                            name: "Role Name",
                            placeholder: "Enter your role name",
                            required: "Role name is required"

                        }
                    }
                },
                menuItems: {
                    basic: "Basics",
                    groups: "Groups",
                    permissions: "Permissions",
                    roles: "Roles",
                    users: "Users"
                },
                users: {
                    list: {
                        emptyPlaceholder: {
                            action: "Assign User",
                            subtitles: "There are no Users assigned to the {{type}} at the moment.",
                            title: "No Users Assigned"
                        },
                        header: "Users"
                    }
                }
            },
            list: {
                buttons: {
                    addButton: "New {{type}}",
                    filterDropdown: "Filter By"
                },
                columns: {
                    actions: "Actions",
                    lastModified: "Last Modified",
                    name: "Name"
                },
                confirmations: {
                    deleteItem: {
                        assertionHint: "Please type <1>{{ roleName }}</1> to confirm.",
                        content: "If you delete this {{type}}, the permissions attached to it will be deleted and " +
                            "the users attached to it will no longer be able to perform intended actions which were " +
                            "previously allowed. Please proceed with caution.",
                        header: "Are you sure?",
                        message: "This action is irreversible and will permanently delete the selected {{type}}"
                    }
                },
                emptyPlaceholders: {
                    emptyRoleList: {
                        action: "New {{type}}",
                        subtitles: {
                            0: "There are currently no {{type}} available.",
                            1: "You can add a new {{type}} easily by following the",
                            2: "steps in the {{type}} creation wizard."
                        },
                        title: "Add a new {{type}}"
                    },
                    search: {
                        action: "Clear search query",
                        subtitles: {
                            0: "We couldn't find any results for {{searchQuery}}",
                            1: "Please try a different search term."
                        },
                        title: "No results found"
                    }
                },
                popups: {
                    delete: "Delete {{type}}",
                    edit: "Edit {{type}}"
                }
            },
            notifications: {
                createPermission: {
                    error: {
                        description: "{{description}}",
                        message: "Error occurred while adding permission to role."
                    },
                    genericError: {
                        description: "Couldn't add permissions to role.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Permissions were successfully added to the role.",
                        message: "Role created successfully."
                    }
                },
                createRole: {
                    error: {
                        description: "{{description}}",
                        message: "Error occurred while creating the role."
                    },
                    genericError: {
                        description: "Couldn't create the role.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The role was created successfully.",
                        message: "Role created successfully."
                    }
                },
                deleteRole: {
                    error: {
                        description: "{{description}}",
                        message: "Error deleting the selected role."
                    },
                    genericError: {
                        description: "Couldn't remove the selected role.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The selected role was deleted successfully.",
                        message: "Role deleted successfully"
                    }
                },
                fetchRoles: {
                    genericError: {
                        description: "An error occurred while retrieving roles.",
                        message: "Something went wrong"
                    }
                },
                updateRole: {
                    error: {
                        description: "{{description}}",
                        message: "Error updating the selected role."
                    },
                    genericError: {
                        description: "Couldn't update the selected role.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The selected role was updated successfully.",
                        message: "Role updated successfully"
                    }
                }
            }
        },
        serverConfigs: {
            realmConfiguration: {
                actionTitles: {
                    config: "More"
                },
                confirmation: {
                    heading: "Confirmation",
                    message: "Do you wish to save the configurations related to realm?"
                },
                description: "Configure the basic configurations related to realm.",
                form: {
                    homeRealmIdentifiers: {
                        hint: "Enter home realm identifier. Multiple identifiers are allowed.",
                        label: "Home realm identifiers",
                        placeholder: "localhost"
                    },
                    idleSessionTimeoutPeriod: {
                        hint: "Enter the idle session timeout in minutes",
                        label: "Idle Session Time Out"
                    },
                    rememberMePeriod: {
                        hint: "Enter the remember me period in minutes",
                        label: "Remember Me Period"
                    }
                },
                heading: "Realm configurations",
                notifications: {
                    emptyHomeRealmIdentifiers: {
                        error: {
                            description: "You must declare at least one home realm identifier.",
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
                    getConfigurations: {
                        error: {
                            description: "{{ description }}",
                            message: "Retrieval Error"
                        },
                        genericError: {
                            description: "An error occurred while retrieving the realm configurations.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    updateConfigurations: {
                        error: {
                            description: "{{ description }}",
                            message: "Update Error"
                        },
                        genericError: {
                            description: "An error occurred while updating the realm configurations.",
                            message: "Update Error"
                        },
                        success: {
                            description: "Successfully updated the realm configurations.",
                            message: "Update Successful"
                        }
                    }
                }
            }
        },
        sidePanel: {
            addEmailTemplate: "Add Email Template",
            addEmailTemplateLocale: "Add Email Template Locale",
            attributeDialects: "Attribute Dialects",
            categories: {
                attributes: "Attributes",
                certificates: "Certificates",
                configurations: "Configurations",
                general: "General",
                users: "Users",
                userstores: "Userstores"
            },
            certificates: "Certificates",
            configurations: "Configurations",
            editEmailTemplate: "Email Templates",
            editExternalDialect: "Edit External Dialect",
            editGroups: "Edit Group",
            editLocalClaims: "Edit Local Claims",
            editRoles: "Edit Role",
            editUsers: "Edit User",
            editUserstore: "Edit Userstore",
            emailTemplateTypes: "",
            emailTemplates: "Email Templates",
            generalConfigurations: "General",
            groups: "Groups",
            localDialect: "Local Dialect",
            overview: "Overview",
            privacy: "Privacy",
            roles: "Roles",
            users: "Users",
            userstoreTemplates: "Userstore Templates",
            userstores: "Userstores"
        },
        transferList: {
            list: {
                emptyPlaceholders: {
                    default: "There are no items in this list at the moment.",
                    groups: {
                        selected: "There are no {{type}} assigned to this group.",
                        unselected: "There are no {{type}} available to assign to this group."
                    },
                    roles: {
                        selected: "There are no {{type}} assigned with this role.",
                        unselected: "There are no {{type}} available to assign with this role."
                    },
                    users: {
                        roles: {
                            selected: "There are no {{type}} assigned to this user.",
                            unselected: "There are no {{type}} available to assign to this user."
                        }
                    }
                },
                headers: {
                    0: "Domain",
                    1: "Name"
                }
            },
            searchPlaceholder: "Search {{type}}"
        },
        user: {
            deleteUser: {
                confirmationModal: {
                    assertionHint: "Please type <1>{{ userName }}</1> to confirm.",
                    content: "If you delete this user, the user will not be able to login to the developer portal or " +
                        "any other application the user was subscribed before. Please proceed with caution.",
                    header: "Are you sure?",
                    message: "This action is irreversible and will permanently delete the user."
                }
            },
            editUser: {
                dangerZoneGroup: {
                    dangerZone: {
                        actionTitle: "Delete User",
                        header: "Delete user",
                        subheader: "Once you delete a user, there is no going back. Please be certain."
                    },
                    header: "Danger Zone"
                },
                menu: {
                    menuItems: {
                        0: "Profile",
                        1: "Groups",
                        2: "Roles"
                    }
                }
            },
            forms: {
                addUserForm: {
                    buttons: {
                        radioButton: {
                            label: "Select the method to set the user password",
                            options: {
                                askPassword: "Invite user to set password",
                                createPassword: "Set user password"

                            }
                        }
                    },
                    inputs: {
                        confirmPassword: {
                            label: "Confirm Password",
                            placeholder: "Enter the new password",
                            validations: {
                                empty: "Confirm password is a required field",
                                mismatch: "The password confirmation doesn't match"
                            }
                        },
                        domain: {
                            label: "Userstore",
                            placeholder: "Select user store",
                            validations: {
                                empty: "User store name cannot be empty."
                            }
                        },
                        email: {
                            label: "Email Address",
                            placeholder: "Enter the email address",
                            validations: {
                                empty: "Email address cannot be empty",
                                invalid: "Please enter a valid email address"
                            }
                        },
                        firstName: {
                            label: "First Name",
                            placeholder: "Enter your first name",
                            validations: {
                                empty: "First name is a required field"
                            }
                        },
                        lastName: {
                            label: "Last Name",
                            placeholder: "Enter your last name",
                            validations: {
                                empty: "Last name is a required field"
                            }
                        },
                        newPassword: {
                            label: "New Password",
                            placeholder: "Enter the new password",
                            validations: {
                                empty: "New password is a required field",
                                regExViolation: "Please enter a valid password"
                            }
                        },
                        username: {
                            label: "Username",
                            placeholder: "Enter the username",
                            validations: {
                                empty: "Username is a required field",
                                invalid: "A user already exists with this username.",
                                regExViolation: "Please enter a valid username"
                            }
                        }
                    },
                    validations: {
                        genericError: {
                            description: "Something went wrong. Please try again",
                            message: "Change password error"
                        },
                        invalidCurrentPassword: {
                            description: "The current password you entered appears to be invalid. Please try again",
                            message: "Change password error"
                        },
                        submitError: {
                            description: "{{description}}",
                            message: "Change password error"
                        },
                        submitSuccess: {
                            description: "The password has been changed successfully",
                            message: "Password reset successful"
                        }
                    }
                }
            },
            modals: {
                addUserWarnModal: {
                    heading: "Warning",
                    message: "Please note that this created user will not be assigned with a role. If you wish to " +
                        "assign roles to this user please click on the button below."
                },
                addUserWizard: {
                    buttons: {
                        next: "Next",
                        previous: "Previous"
                    },
                    steps: {
                        basicDetails: "Basic Details",
                        groups: "User Groups",
                        roles: "User Roles",
                        summary: "Summary"
                    },
                    subTitle: "Follow the steps to create the new user",
                    title: "Create User",
                    wizardSummary: {
                        domain: "Userstore",
                        groups: "Group(s)",
                        name: "Name",
                        passwordOption: {
                            label: "Password option",
                            message: {
                                0: "An email will be sent to {{email}} with the link to set the password.",
                                1: "The password was set by the administrator."
                            }
                        },
                        roles: "Role(s)",
                        username: "Username"
                    }
                }
            },
            profile: {
                fields: {
                    /* eslint-disable @typescript-eslint/camelcase */
                    addresses_home: "Home Address",
                    addresses_work: "Work Address",
                    emails: "Email",
                    emails_home: "Home Email",
                    emails_other: "Other Email",
                    emails_work: "Work Email",
                    generic: {
                        default: "Add {{fieldName}}"
                    },
                    name_familyName: "Last Name",
                    name_givenName: "First Name",
                    phoneNumbers: "Phone Number",
                    phoneNumbers_home: "Home Phone Number",
                    phoneNumbers_mobile: "Mobile Number",
                    phoneNumbers_other: "Other Phone Number",
                    phoneNumbers_work: "Work Phone Number",
                    profileUrl: "URL",
                    userName: "Username"
                    /* eslint-enable @typescript-eslint/camelcase */
                },
                forms: {
                    emailChangeForm: {
                        inputs: {
                            email: {
                                label: "Email",
                                note: "NOTE: This will change the email address in your profile",
                                placeholder: "Enter your email address",
                                validations: {
                                    empty: "Email address is a required field",
                                    invalidFormat: "The email address is not of the correct format"
                                }
                            }
                        }
                    },
                    generic: {
                        inputs: {
                            placeholder: "Enter your {{fieldName}}",
                            validations: {
                                empty: "{{fieldName}} is a required field",
                                invalidFormat: "The {{fieldName}} is not of the correct format"
                            }
                        }
                    },
                    mobileChangeForm: {
                        inputs: {
                            mobile: {
                                label: "Mobile number",
                                note: "NOTE: This will change the mobile number in your profile",
                                placeholder: "Enter your mobile number",
                                validations: {
                                    empty: "Mobile number is a required field",
                                    invalidFormat: "The mobile number is not of the right format"
                                }
                            }
                        }
                    },
                    nameChangeForm: {
                        inputs: {
                            firstName: {
                                label: "First name",
                                placeholder: "Enter the first name",
                                validations: {
                                    empty: "First name is a required field"
                                }
                            },
                            lastName: {
                                label: "Last name",
                                placeholder: "Enter the last name",
                                validations: {
                                    empty: "Last name is a required field"
                                }
                            }
                        }
                    },
                    organizationChangeForm: {
                        inputs: {
                            organization: {
                                label: "Organization",
                                placeholder: "Enter your organization",
                                validations: {
                                    empty: "Organization is a required field"
                                }
                            }
                        }
                    }
                },
                notifications: {
                    getProfileInfo: {
                        error: {
                            description: "{{description}}",
                            message: "Error occurred while retrieving the profile details"
                        },
                        genericError: {
                            description: "Error occurred while retrieving the profile details",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The required user profile details are retrieved successfully",
                            message: "Successfully retrieved user profile"
                        }
                    },
                    updateProfileInfo: {
                        error: {
                            description: "{{description}}",
                            message: "Error occurred while updating the profile details"
                        },
                        genericError: {
                            description: "Error occurred while updating the profile details",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The required user profile details were successfully updated",
                            message: "User profile updated successfully"
                        }
                    }
                },
                placeholders: {
                    SCIMDisabled: {
                        heading: "This feature is not available for your account"
                    }
                }
            },
            updateUser: {
                groups: {
                    addGroupsModal: {
                        heading: "Update User Groups",
                        subHeading: "Add new groups or remove existing groups assigned to the user."
                    },
                    editGroups: {
                        groupList: {
                            emptyListPlaceholder: {
                                subTitle: {
                                    0: "There are no groups assigned to the user at the moment.",
                                    1: "This might restrict user from performing certain",
                                    2: "tasks like accessing certain applications."
                                },
                                title: "No Groups Assigned"
                            },
                            headers: {
                                0: "Domain",
                                1: "Name"
                            }
                        },
                        heading: "Assigned Groups",
                        popups: {
                            viewPermissions: "View Permissions"
                        },
                        searchPlaceholder: "Search groups",
                        subHeading: "Add or remove the groups user is assigned with and note that this will affect " +
                            "performing certain tasks."
                    },
                    notifications: {
                        addUserGroups: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while updating user groups"
                            },
                            genericError: {
                                description: "An error occurred while updating user groups",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "Assigning new groups for the user successful",
                                message: "Update user groups successful"
                            }
                        },
                        fetchUserGroups: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while fetching the groups list"
                            },
                            genericError: {
                                description: "Error occurred while fetching the groups list",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "The groups list was successfully retrieved",
                                message: "User groups list retrieved successfully"
                            }
                        },
                        removeUserGroups: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while updating the groups of the user"
                            },
                            genericError: {
                                description: "An error occurred while updating user groups",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "Removing assigned groups for the user successful",
                                message: "Update user groups successful"
                            }
                        }
                    }
                },
                roles: {
                    addRolesModal: {
                        heading: "Update User Roles",
                        subHeading: "Add new roles or remove existing roles assigned to the user."
                    },
                    editRoles: {
                        heading: "Assigned Roles",
                        popups: {
                            viewPermissions: "View Permissions"
                        },
                        roleList: {
                            emptyListPlaceholder: {
                                subTitle: {
                                    0: "There are no roles assigned to the user at the moment.",
                                    1: "This might restrict user from performing certain",
                                    2: "tasks like accessing certain applications."
                                },
                                title: "No Roles Assigned"
                            },
                            headers: {
                                0: "Domain",
                                1: "Name"
                            }
                        },
                        searchPlaceholder: "Search Roles",
                        subHeading: "Add or remove the roles user is assigned with and note that this will affect " +
                            "performing certain tasks."
                    },
                    notifications: {
                        addUserRoles: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while updating user roles"
                            },
                            genericError: {
                                description: "An error occurred while updating user roles",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "Assigning new roles for the user successful",
                                message: "Update user roles successful"
                            }
                        },
                        fetchUserRoles: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while fetching the roles list"
                            },
                            genericError: {
                                description: "Error occurred while fetching the roles list",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "The roles list was successfully retrieved",
                                message: "User roles list retrieved successfully"
                            }
                        },
                        removeUserRoles: {
                            error: {
                                description: "{{description}}",
                                message: "Error occurred while updating the roles of the user"
                            },
                            genericError: {
                                description: "An error occurred while updating user roles",
                                message: "Something went wrong"
                            },
                            success: {
                                description: "Removing assigned roles for the user successful",
                                message: "Update user roles successful"
                            }
                        }
                    },
                    viewPermissionModal: {
                        backButton: "Back to list",
                        heading: "Permissions for {{role}}"
                    }
                }
            }
        },
        users: {
            advancedSearch: {
                form: {
                    dropdown: {
                        filterAttributeOptions: {
                            email: "Email",
                            username: "Username"
                        }
                    },
                    inputs: {
                        filterAttribute: {
                            placeholder: "E.g. Username, Email etc."
                        },
                        filterCondition: {
                            placeholder: "E.g. Starts with etc."
                        },
                        filterValue: {
                            placeholder: "Enter value to search"
                        }
                    }
                },
                placeholder: "Search by Username"
            },
            all: {
                heading: "Users",
                subHeading: "Add and manage user accounts, assign roles to the users and maintain user identities."
            },
            buttons: {
                addNewUserBtn: "New User",
                assignUserRoleBtn: "Assign roles",
                metaColumnBtn: "Columns"
            },
            list: {
                columns: {
                    actions: "Actions",
                    name: "Name"
                }
            },
            notifications: {
                addUser: {
                    error: {
                        description: "{{description}}",
                        message: "Error adding the new user"
                    },
                    genericError: {
                        description: "Couldn't add the new user",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The new user was added successfully.",
                        message: "User added successfully"
                    }
                },
                deleteUser: {
                    error: {
                        description: "{{description}}",
                        message: "Error deleting the user"
                    },
                    genericError: {
                        description: "Couldn't delete the user",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The user was deleted successfully.",
                        message: "User deleted successfully"
                    }
                },
                fetchUsers: {
                    error: {
                        description: "{{description}}",
                        message: "Error retrieving users"
                    },
                    genericError: {
                        description: "Couldn't retrieve users",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully retrieved the users.",
                        message: "Users retrieval successful"
                    }
                }
            },
            placeholders: {
                emptyList: {
                    action: "Refresh list",
                    subtitles: {
                        0: "The users list returned empty.",
                        1: "Something went wrong while fetching the user list"
                    },
                    title: "No Users Found"
                }
            },
            usersList: {
                list: {
                    emptyResultPlaceholder: {
                        addButton: "New User",
                        subTitle: {
                            0: "There are currently no users available.",
                            1: "You can add a new user easily by following the",
                            2: "steps in the user creation wizard."
                        },
                        title: "Add a new User"
                    },
                    iconPopups: {
                        delete: "Delete",
                        edit: "Edit"
                    }
                },
                metaOptions: {
                    columns: {
                        emails: "Email",
                        id: "User id",
                        lastModified: "Last modified",
                        name: "Name",
                        userName: "Username"
                    },
                    heading: "Show Columns"
                },
                search: {
                    emptyResultPlaceholder: {
                        clearButton: "Clear search query",
                        subTitle: {
                            0: "We couldn't find any results for {{query}}",
                            1: "Please try a different search term."
                        },
                        title: "No results found"
                    }
                }
            },
            userstores: {
                userstoreOptions: {
                    all: "All userstores",
                    primary: "Primary"
                }
            }
        },
        userstores: {
            advancedSearch: {
                error: "Filter query format incorrect",
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: "E.g. Name, Description etc."
                        },
                        filterCondition: {
                            placeholder: "E.g. Starts with etc."
                        },
                        filterValue: {
                            placeholder: "E.g. PRIMARY, SECONDARY etc."
                        }
                    }
                },
                placeholder: "Search by userstore name"
            },
            confirmation: {
                confirm: "Confirm",
                content: "If you delete this userstore, the user data in this userstore will also be deleted. "
                    + "Please proceed with caution.",
                header: "Are you sure?",
                hint: "Please type <1>{{name}}</1> to confirm.",
                message: "This action is irreversible and will permanently delete the"
                    + " selected userstore and the data in it."
            },
            dangerZone: {
                actionTitle: "Delete Userstore",
                header: "Delete Userstore",
                subheader: "Once you delete a userstore, there is no going back. "
                    + "Please be certain."
            },
            forms: {
                connection: {
                    connectionErrorMessage: "Please ensure the provided connection "
                        + "URL, name, password and driver name are correct",
                    testButton: "Test Connection"
                },
                custom: {
                    placeholder: "Enter a {{name}}",
                    requiredErrorMessage: "{{name}} is required"
                },
                general: {
                    description: {
                        label: "Description",
                        placeholder: "Enter a description"
                    },
                    name: {
                        label: "Name",
                        placeholder: "Enter a name",
                        requiredErrorMessage: "Name is a required field"
                    },
                    type: {
                        label: "Type",
                        requiredErrorMessage: "Select a Type"
                    }
                }
            },
            notifications: {
                addUserstore: {
                    genericError: {
                        description: "There was an error while creating the userstore",
                        message: "Something went wrong!"
                    },
                    success: {
                        description: "The userstore has been added successfully!",
                        message: "Userstore added successfully!"
                    }
                },
                delay: {
                    description: "It may take a while for the userstore list to be updated. "
                        + "Refresh in a few seconds to get the updated userstore list.",
                    message: "Updating Userstore list takes time"
                },
                deleteUserstore: {
                    genericError: {
                        description: "There was an error while deleting the userstore",
                        message: "Something went wrong!"
                    },
                    success: {
                        description: "The userstore has been deleted successfully!",
                        message: "Userstore deleted successfully!"
                    }
                },
                fetchUserstoreMetadata: {
                    genericError: {
                        description: "An error occurred while fetching the type meta data.",
                        message: "Something went wrong"
                    }
                },
                fetchUserstoreTemplates: {
                    genericError: {
                        description: "An error occurred while fetching the userstore type details.",
                        message: "Something went wrong"
                    }
                },
                fetchUserstoreTypes: {
                    genericError: {
                        description: "An error occurred while fetching the userstore types.",
                        message: "Something went wrong"
                    }
                },
                fetchUserstores: {
                    genericError: {
                        description: "An error occurred while fetching userstores",
                        message: "Something went wrong"
                    }
                },
                testConnection: {
                    genericError: {
                        description: "An error occurred while testing the " + "connection to the userstore",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The connection is healthy",
                        message: "Connection successful!"
                    }
                },
                updateUserstore: {
                    genericError: {
                        description: "An error occurred while updating the userstore.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "This userstore has been updated successfully!",
                        message: "Userstore updated successfully!"
                    }
                }
            },
            pageLayout: {
                edit: {
                    back: "Go back to userstores",
                    description: "Edit userstore",
                    tabs: {
                        connection: "Connection",
                        general: "General",
                        group: "Group",
                        user: "User"
                    }
                },
                list: {
                    description: "Create and manage userstores",
                    primaryAction: "New Userstore",
                    title: "Userstores"
                },
                templates: {
                    back: "Go back to userstores",
                    description: "Please choose one of the following userstore types.",
                    templateHeading: "Quick Setup",
                    templateSubHeading: "Predefined set of templates to speed up your userstore creation.",
                    title: "Select Userstore Type"
                }
            },
            placeholders: {
                emptyList: {
                    action: "New Userstore",
                    subtitles: "There are currently no userstores available."
                        + "You can add a new userstore easily by following the "
                        + "steps in the userstore creation wizard.",
                    title: "Add a new Userstore"
                },
                emptySearch: {
                    action: "Clear search query",
                    subtitles: "We couldn't find any results for {{searchQuery}}. "
                        + "Please try a different search term.",
                    title: "No results found"
                }
            },
            sqlEditor: {
                create: "Create",
                darkMode: "Dark Mode",
                delete: "Delete",
                read: "Read",
                reset: "Reset",
                title: "SQL Query Types",
                update: "Update"
            },
            wizard: {
                header: "Add {{type}} Userstore",
                steps: {
                    general: "General",
                    group: "Group",
                    summary: "Summary",
                    user: "User"
                }
            }
        }
    },
    notifications: {
        endSession: {
            error: {
                description: "{{description}}",
                message: "Termination error"
            },
            genericError: {
                description: "Couldn't terminate the current session.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully terminated the current session.",
                message: "Termination successful"
            }
        },
        getProfileInfo: {
            error: {
                description: "{{description}}",
                message: "Retrieval error"
            },
            genericError: {
                description: "Couldn't retrieve user profile details.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully retrieved user profile details.",
                message: "Retrieval successful"
            }
        },
        getProfileSchema: {
            error: {
                description: "{{description}}",
                message: "Retrieval error"
            },
            genericError: {
                description: "Couldn't retrieve user profile schemas.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully retrieved user profile schemas.",
                message: "Retrieval successful"
            }
        }
    },
    pages: {
        emailLocaleAdd: {
            backButton: "Go back to {{name}} template",
            subTitle: null,
            title: "Edit template - {{name}}"
        },
        emailLocaleAddWithDisplayName: {
            backButton: "Go back to {{name}} template",
            subTitle: null,
            title: "Add new template for {{displayName}}"
        },
        emailTemplateTypes: {
            subTitle: "Create and manage templates types.",
            title: "Email Templates Types"
        },
        emailTemplates: {
            backButton: "Go back to email templates types",
            subTitle: null,
            title: "Email Templates"
        },
        emailTemplatesWithDisplayName: {
            backButton: "Go back to applications",
            subTitle: null,
            title: "Templates - {{displayName}}"
        },
        groups: {
            subTitle: "Create and manage user groups, assign permissions for groups.",
            title: "Groups"
        },
        overview: {
            subTitle: "Configure and  manage users, roles, attribute dialects, server configurations etc." +
                "etc.",
            title: "Welcome, {{firstName}}"
        },
        roles: {
            subTitle: "Create and manage roles, assign permissions for roles.",
            title: "Roles"
        },
        rolesEdit: {
            backButton: "Go back to {{type}}",
            subTitle: null,
            title: "Edit Role"
        },
        serverConfigurations: {
            subTitle: "Manage general configurations of the server.",
            title: "General Configurations"
        },
        users: {
            subTitle: "Create and manage users, user access, and user profiles.",
            title: "Users"
        },
        usersEdit: {
            backButton: "Go back to users",
            subTitle: "{{name}}",
            title: "{{email}}"
        }
    },
    placeholders: {
        404: {
            action: "Back to home",
            subtitles: {
                0: "We couldn't find the page you are looking for.",
                1: "Please check the URL or click on the button below to be redirected back to the home page."
            },
            title: "Page not found"
        },
        accessDenied: {
            action: "Continue logout",
            subtitles: {
                0: "It seems like you don't have permission to use this portal.",
                1: "Please sign in with a different account."
            },
            title: "You are not authorized"
        },
        consentDenied: {
            action: "Continue logout",
            subtitles: {
                0: "It seems like you have not given consent for this application.",
                1: "Please give consent to use the application."
            },
            title: "You have denied consent"
        },
        emptySearchResult: {
            action: "Clear search query",
            subtitles: {
                0: "We couldn't find any results for \"{{query}}\"",
                1: "Please try a different search term."
            },
            title: "No results found"
        },
        genericError: {
            action: "Refresh the page",
            subtitles: {
                0: "Something went wrong while displaying this page.",
                1: "See the browser console for technical details."
            },
            title: "Something went wrong"
        },
        loginError: {
            action: "Continue logout",
            subtitles: {
                0: "It seems like you don't have permission to use this portal.",
                1: "Please sign in with a different account."
            },
            title: "You are not authorized"
        },
        unauthorized: {
            action: "Continue logout",
            subtitles: {
                0: "It seems like you don't have permission to use this portal.",
                1: "Please sign in with a different account."
            },
            title: "You are not authorized"
        },
        underConstruction: {
            action: "Back to home",
            subtitles: {
                0: "We're doing some work on this page.",
                1: "Please bare with us and come back later. Thank you for your patience."
            },
            title: "Page under construction"
        }
    }
};
