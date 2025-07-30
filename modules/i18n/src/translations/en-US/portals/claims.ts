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
import { ClaimsNS } from "../../../models";

export const claims: ClaimsNS = {
    attributeMappings: {
        agent: {
            description: "The SCIM protocol representation for AI agent attributes used in agent identity management APIs.",
            heading: "SCIM 2.0 for AI Agents"
        },
        axschema: {
            description: "The Attribute Exchange Schema (axschema) representation "
                + "for user attributes.",
            heading: "Attribute Exchange Schema"
        },
        custom: {
            description: "The custom protocol representation for user "
                + "attributes.",
            heading: "Custom Attributes"
        },
        eidas: {
            description: "The eIDAS protocol representation for user attributes.",
            heading: "eIDAS"
        },
        oidc: {
            description: "The OpenID Connect (OIDC) protocol representation for user "
                + "attributes.",
            heading: "OpenID Connect"
        },
        scim: {
            description: "The SCIM2 protocol representation for "
                + "attributes that will be used in the SCIM2 API.",
            heading: "SCIM 2.0"
        }
    },
    dialects: {
        advancedSearch: {
            error: "Filter query format incorrect",
            form: {
                inputs: {
                    filterAttribute: {
                        placeholder: "E.g. Attribute Mapping etc."
                    },
                    filterCondition: {
                        placeholder: "E.g. Starts with etc."
                    },
                    filterValue: {
                        placeholder: "E.g. http://wso2.org/oidc/claim"
                    }
                }
            },
            placeholder: "Search by attribute mapping "
        },
        attributes: {
            dialectURI: "Attribute Mapping"
        },
        confirmations: {
            action: "Confirm",
            content: "If you delete this attribute mapping, all the associated {{type}} attributes will "
                + "also be deleted. Please proceed with caution.",
            header: "Are you sure?",
            hint: "Please type <1>{{confirm}}</1> to confirm.",
            message: "This action is irreversible and will permanently delete the selected attribute " +
                "mapping."
        },
        dangerZone: {
            actionTitle: "Delete {{type}} Attribute Mapping",
            header: "Delete {{type}} Attribute Mapping",
            subheader: "Once you delete this {{type}} attribute mapping, there is no going back. " +
                "Please be certain."
        },
        forms: {
            dialectURI: {
                label: "{{type}} Attribute Mapping",
                placeholder: "Enter an attribute mapping",
                requiredErrorMessage: "Enter an attribute mapping"
            },
            fields: {
                attributeName: {
                    validation: {
                        alreadyExists: "An Attribute already exists with the given Attribute name.",
                        invalid: "Attribute name can only contain alphanumeric characters "
                            +"and _. And must be of length between 3 to 30 characters."
                    }
                }
            },
            submit: "Update"
        },
        notifications: {
            addDialect: {
                error: {
                    description: "An error occurred while adding the attribute mapping",
                    message: "Something went wrong"
                },
                genericError: {
                    description: "The attribute mapping has been added but not all {{type}} "
                        + "attributes were added successfully",
                    message: "{{type}} attributes couldn't be added"
                },
                success: {
                    description: "The attribute mapping has been added successfully",
                    message: "Attribute Mapping added successfully"
                }
            },
            deleteDialect: {
                genericError: {
                    description: "There was an error while deleting the attribute mapping",
                    message: "Something went wrong"
                },
                success: {
                    description: "The attribute mapping has been deleted successfully!",
                    message: "Attribute Mapping deleted successfully"
                }
            },
            fetchADialect: {
                genericError: {
                    description: "There was an error while fetching the attribute mapping",
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
                    description: "There was an error while fetching the {{type}} attributes",
                    message: "Something went wrong"
                }
            },
            fetchSCIMResource: {
                genericError: {
                    description: "There was an error while fetching the SCIM resources.",
                    message: "Something went wrong"
                }
            },
            updateDialect: {
                genericError: {
                    description: "An error occurred while updating the attribute mapping",
                    message: "Something went wrong"
                },
                success: {
                    description: "The attribute mapping has been successfully updated.",
                    message: "Attribute Mapping update successful"
                }
            }
        },
        pageLayout: {
            edit: {
                back: "Go back to Attribute Mappings",
                description: "Edit attribute mapping",
                updateDialectURI: "Update {{type}} Attribute Mapping",
                updateExternalAttributes: "Update {{type}} Attribute Mapping"
            },
            list: {
                description: "View and manage how user attributes are mapped and " +
                    "transformed when interacting with APIs or your applications.",
                primaryAction: "New Attribute Mapping",
                title: "Attributes",
                view: "View attributes"
            }
        },
        sections: {
            manageAttributeMappings: {
                agent: {
                    description: "The SCIM protocol representation for AI agent attributes used in agent identity management APIs.",
                    heading: "SCIM 2.0 for AI Agents"
                },
                custom: {
                    description: "Communicate information about the user via custom mappings.",
                    heading: "Custom Attribute Mapping"
                },
                description: "View and manage how attributes are mapped and transformed "
                    + "when interacting with APIs or your applications.",
                heading: "Manage Attribute Mappings",
                oidc: {
                    description: "Communicate information about the user for applications that uses "
                        + "OpenID Connect to authenticate.",
                    heading: "OpenID Connect"
                },
                scim: {
                    description: "Communicate information about the user via the API "
                        + "compliance with SCIM2 standards.",
                    heading: "SCIM 2.0"
                }
            },
            manageAttributes: {
                attributes: {
                    description: "Each attribute contains a piece of stored user data.",
                    heading: "Attributes"
                },
                description: "View and manage attributes.",
                heading: "Manage Attributes"
            }
        },
        wizard: {
            header: "Add Attribute Mapping",
            steps: {
                dialectURI: "Attribute Mapping",
                externalAttribute: "{{type}} Attribute",
                summary: "Summary"
            },
            summary: {
                externalAttribute: "{{type}} Attribute",
                mappedAttribute: "Mapped Attribute",
                notFound: "No {{type}} attribute has been added."
            }
        }
    },
    external: {
        advancedSearch: {
            error: "Filter query format incorrect",
            form: {
                inputs: {
                    filterAttribute: {
                        placeholder: "E.g. {{type}} Attribute etc."
                    },
                    filterCondition: {
                        placeholder: "E.g. Starts with etc."
                    },
                    filterValue: {
                        placeholder: "E.g. http://axschema.org/namePerson/last"
                    }
                }
            },
            placeholder: "Search by {{type}} attribute"
        },
        attributes: {
            attributeURI: "{{type}} Attribute",
            mappedClaim: "Mapped Attribute"
        },
        forms: {
            attributeURI: {
                label: "{{type}} Attribute",
                placeholder: "Enter {{type}} attribute",
                requiredErrorMessage: "{{type}} Attribute is required",
                validationErrorMessages: {
                    duplicateName: "The {{type}} attribute already exists.",
                    invalidName: "The name you entered contains illegal characters. " +
                        "Only letters, numbers, `#`, and `_` are allowed.",
                    scimInvalidName: "The starting character of the name should be a letter. " +
                        "The remaining characters may include letters, numbers, dash (-), " +
                        "and underscore (_)."
                }
            },
            emptyMessage: "All the SCIM attributes are mapped to local claims.",
            localAttribute: {
                label: "User Attribute to map to",
                placeholder: "Select a user attribute",
                requiredErrorMessage: "Select a user attribute to map to"
            },
            submit: "Add Attribute Mapping",
            warningMessage: "There are no local attributes available for mapping. " +
                "Add new local attributes from"
        },
        notifications: {
            addExternalAttribute: {
                genericError: {
                    description: "An error occurred while adding the {{type}} attribute.",
                    message: "Something went wrong"
                },
                success: {
                    description: "The {{type}} attribute has been added to the attribute mapping" +
                        " successfully!",
                    message: "Attribute added"
                }
            },
            deleteExternalClaim: {
                genericError: {
                    description: "There was an error while deleting the {{type}} attribute",
                    message: "Something went wrong"
                },
                success: {
                    description: "The {{type}} attribute has been deleted successfully!",
                    message: "Attribute deleted"
                }
            },
            fetchExternalClaims: {
                error: {
                    description: "{{description}}",
                    message: "Retrieval error"
                },
                genericError: {
                    description: "Couldn't retrieve {{type}} attributes.",
                    message: "Something went wrong"
                },
                success: {
                    description: "Successfully retrieved {{type}} attributes.",
                    message: "Retrieval successful"
                }
            },
            getExternalAttribute: {
                genericError: {
                    description: "There was an error while fetching the {{type}} attribute",
                    message: "Something went wrong"
                }
            },
            updateExternalAttribute: {
                genericError: {
                    description: "There was an error while updating the" + " {{type}} attribute",
                    message: "Something went wrong"
                },
                success: {
                    description: "The {{type}} attribute has been updated successfully!",
                    message: "Attribute updated"
                }
            }
        },
        pageLayout: {
            edit: {
                attributeMappingPrimaryAction: "Add Attribute Mapping",
                attributePrimaryAction: "New Attribute",
                header: "Add {{type}} Attribute"
            }
        },
        placeholders: {
            empty: {
                subtitle: "Currently, there are no {{type}} attributes available for "
                    + "this attribute mapping.",
                title: "No {{type}} Attributes"
            }
        }
    },
    list: {
        columns: {
            actions: "Actions",
            claimURI: "SCIM Attribute",
            dialectURI: "Mapped Attribute",
            name: "Name"
        },
        confirmation: {
            action: "Confirm",
            content: "{{message}} Please proceed with caution.",
            dialect: {
                message: "If you delete this attribute mapping, all the"
                    + " associated {{type}} attributes will also be deleted.",
                name: "attribute mapping"
            },
            external: {
                message: "This will permanently delete the {{type}} attribute.",
                name: "{{type}} attribute"
            },
            header: "Are you sure?",
            hint: "Please confirm your action.",
            local: {
                message: "If you delete this attribute, the user data belonging "
                    + "to this attribute will also be deleted.",
                name: "attribute"
            },
            message: "This action is irreversible and will permanently delete the selected {{name}}."
        },
        placeholders: {
            emptyList: {
                action: {
                    dialect: "New {{type}} Attribute",
                    external: "New {{type}} Attribute",
                    local: "New Attribute"
                },
                subtitle: "There are currently no results available."
                    + "You can add a new item easily by following the" + "steps in the creation wizard.",
                title: {
                    dialect: "Add an Attribute Mapping",
                    external: "Add an {{type}} Attribute",
                    local: "Add an Attribute"
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
            " in the following user stores:"
    },
    local: {
        additionalProperties: {
            hint: "Use when writing an extension using current attributes",
            isUniqueDeprecationMessage: {
                uniquenessDisabled: "The 'isUnique' property is deprecated.",
                uniquenessEnabled: "The 'isUnique' property is deprecated. Please use " +
                    "<1>Uniqueness Validation</1> option to configure attribute uniqueness."
            },
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
                        placeholder: "E.g. name, attribute etc."
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
            attributeURI: "Attribute"
        },
        confirmation: {
            content: "If you delete this attribute, the user data belonging to this attribute "
                + "will also be deleted. Please proceed with caution.",
            header: "Are you sure?",
            hint: "Please confirm your action.",
            message: "This action is irreversible and will permanently delete the selected " +
                "attribute.",
            primaryAction: "Confirm"
        },
        dangerZone: {
            actionTitle: "Delete Attribute",
            header: "Delete Attribute",
            subheader: "Once you delete an attribute, there is no going back. "
                + "Please be certain."
        },
        forms: {
            attribute: {
                placeholder: "Enter a user attribute to map to",
                requiredErrorMessage: "Attribute name is a required field"
            },
            attributeHint: "A unique ID for the attribute."
                + " The ID will be appended to the attribute mapping to create a attribute",
            attributeID: {
                label: "Attribute Name",
                placeholder: "Enter an attribute name",
                requiredErrorMessage: "Attribute name is required"
            },
            canonicalValues: {
                hint: "Provide the allowed values for the attribute.",
                keyLabel: "Display Value",
                keyRequiredErrorMessage: "Display value is required",
                validationError: "At least one option must be provided.",
                validationErrorMessage: "No options provided.",
                valueLabel: "Value",
                valueRequiredErrorMessage: "Value is required"
            },
            dataType: {
                hint: "The data type of the attribute.",
                label: "Data Type",
                options: {
                    boolean: "Boolean",
                    dateTime: "DateTime",
                    decimal: "Decimal",
                    integer: "Integer",
                    object: "Object",
                    options: "Options",
                    text: "Text"
                }
            },
            description: {
                label: "Description",
                placeholder: "Enter a description",
                requiredErrorMessage: "Description is required"
            },
            descriptionHint: "A meaningful description for the attribute.",
            displayOrder: {
                label: "Display Order",
                placeholder: "Enter the display order"
            },
            displayOrderHint: "This determines the position at which this attribute is "
                + "displayed in the user profile and the user registration page",
            infoMessages: {
                configApplicabilityInfo: "Please note that the following attribute configurations will " +
                    "only affect the customer users' profiles.",
                disabledConfigInfo: "Please note that below section is disabled as there is no " +
                    "external claim mapping found for this claim attribute."
            },
            inputFormat: {
                hint: "The input format of the attribute.",
                label: "Input Format",
                options: {
                    checkBoxGroup: "Checkbox Group",
                    checkbox: "Checkbox",
                    datePicker: "Date Picker",
                    dropdown: "Dropdown",
                    multiSelectDropdown: "Multi-Select Dropdown",
                    numberInput: "Number Input",
                    radioGroup: "Radio Group",
                    textArea: "Text Area",
                    textInput: "Text Input",
                    toggle: "Toggle"
                }
            },
            multiValued: {
                label: "Allow multiple values for this attribute",
                placeholder: "Select a user attribute"
            },
            multiValuedHint: "Select this option if the attribute can have multiple values.",
            multiValuedSystemClaimHint: "Indicate whether the attribute supports multiple values.",
            name: {
                label: "Attribute Display Name",
                placeholder: "Enter the display name",
                requiredErrorMessage: "Name is required",
                validationErrorMessages: {
                    invalidName: "The name you entered contains disallowed characters. It can only" +
                        " contain up to 30 characters, including alphanumerics, periods (.), dashes (-)," +
                        " underscores (_), plus signs (+), and spaces."
                }
            },
            nameHint: "The display name of the attribute in the user profile.",
            profiles: {
                administratorConsole: "Administrator Console",
                attributeConfigurations: {
                    description: "Configure attribute profiles for different flows.",
                    title: "Attribute Configurations"
                },
                displayByDefault: "Display",
                displayByDefaultHint: "If selected, this attribute will be displayed by default in the profile. Required attributes must be displayed.",
                endUserProfile: "End-User Profile",
                readonly: "Read-only",
                readonlyHint: "If this is selected, the value of this attribute is read-only in the profile. Be sure to select this option if the attribute value is system-defined.",
                required: "Required",
                requiredHint: "If selected, the user must specify a value for this attribute in the profile. Read-only attributes cannot be marked as required.",
                selfRegistration: "Self-Registration",
                selfRegistrationReadOnlyHint: "Read-only configuration is not applicable in the self-registration profile."
            },
            readOnly: {
                label: "Make this attribute read-only on the user's profile"
            },
            readOnlyHint: "If this is selected, the value of this attribute is read-only in a user" +
            " profile. Be sure to select this option if the attribute value is system-defined.",
            regEx: {
                label: "Regular expression",
                placeholder: "Enter a regular expression"
            },
            regExHint: "Use a regex pattern to validate the attribute input value.",
            required: {
                label: "Make this attribute required on the user's profile"
            },
            requiredHint: "If selected, the user is required to specify a value for this " +
            "attribute on the profile.",
            requiredWarning: "To make the email attribute not display and not required on the user's profile, " +
                "you need to disable account verification for your organization.",
            sharedProfileValueResolvingMethod: {
                hint: "When a user's profile is shared across multiple organizations, the value of this attribute will be taken from the selected source.",
                label: "Select Source for Attribute Value of Shared Users",
                options: {
                    fromFirstFoundInHierarchy: "From First Found in Hierarchy",
                    fromOrigin: "From Origin",
                    fromSharedProfile: "From Shared Profile"
                }
            },
            subAttributes: {
                label: "The sub-attributes of the attribute",
                placeholder: "Select subattributes",
                validationError: "At least one sub-attribute must be provided.",
                validationErrorMessage: "Sub-attributes are required for complex data types."
            },
            supportedByDefault: {
                label: "Display this attribute on the user's profile"
            },
            uniquenessScope: {
                label: "Uniqueness Validation",
                options: {
                    acrossUserstores: "Across User Stores",
                    none: "None",
                    withinUserstore: "Within User Store"
                }
            },
            uniquenessScopeHint: "Select the scope to validate the uniqueness of the attribute value."
        },
        mappedAttributes: {
            enableForUserStore: "Enable for this user store",
            hint: "Enter the attribute from the respective user stores that will be mapped to this attribute.",
            mappedAttributeName: "Mapped Attribute Name"
        },
        notifications: {
            addLocalClaim: {
                genericError: {
                    description: "There was an error while adding the attribute",
                    message: "Something went wrong"
                },
                success: {
                    description: "The attribute has been added successfully!",
                    message: "Attribute added successfully"
                }
            },
            deleteClaim: {
                genericError: {
                    description: "There was an error while deleting the attribute",
                    message: "Something went wrong"
                },
                success: {
                    description: "The attribute has been deleted successfully!",
                    message: "Attribute deleted successfully"
                }
            },
            fetchLocalClaims: {
                error: {
                    description: "{{description}}",
                    message: "Retrieval error"
                },
                genericError: {
                    description: "Couldn't retrieve attributes.",
                    message: "Something went wrong"
                },
                success: {
                    description: "Successfully retrieved attributes.",
                    message: "Retrieval successful"
                }
            },
            getAClaim: {
                genericError: {
                    description: "There was an error while fetching the attribute",
                    message: "Something went wrong"
                }
            },
            getClaims: {
                genericError: {
                    description: "There was an error while fetching the attributes",
                    message: "Something went wrong"
                }
            },
            getLocalDialect: {
                genericError: {
                    description: "There was an error while fetching the attributes",
                    message: "Something went wrong"
                }
            },
            updateClaim: {
                genericError: {
                    description: "There was an error while updating the" + " attribute",
                    message: "Something went wrong"
                },
                success: {
                    description: "This attribute has been "
                        + "updated successfully!",
                    message: "Attribute updated successfully"
                }
            }
        },
        pageLayout: {
            edit: {
                back: "Go back to Attributes",
                description: "Edit attribute",
                tabs: {
                    additionalProperties: "Additional Properties",
                    general: "General",
                    mappedAttributes: "Attribute Mappings"
                }
            },
            local: {
                action: "New Attribute",
                back: "Go back to Attributes and Mappings",
                description: "Create and manage attributes",
                title: "Attributes"
            }
        },
        wizard: {
            header: "Add Attribute",
            steps: {
                general: "General",
                mapAttributes: "Map Attributes",
                summary: "Summary"
            },
            summary: {
                attribute: "Attribute",
                attributeURI: "Attribute",
                displayOrder: "Display Order",
                readOnly: "This attribute is read-only",
                regEx: "Regular Expression",
                required: "This attribute is required during user registration",
                supportedByDefault: "This attribute is shown on user profile and user registration page",
                userstore: "User Store"
            }
        }
    },
    scopeMappings: {
        deletionConfirmationModal: {
            assertionHint: "Please confirm your action.",
            content: "If you delete this claim, it will not be available in the token." +
                " Please proceed with caution.",
            header: "Are you sure?",
            message: "This action is irreversible and will permanently delete the scope claim mapping"
        },
        saveChangesButton: "Save Changes"
    }
};
