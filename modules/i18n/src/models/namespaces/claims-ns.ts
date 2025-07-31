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
export interface ClaimsNS {
    attributeMappings: {
        agent: {
            heading: string;
            description: string
        };
        axschema: {
            heading: string;
            description: string;
        };
        eidas: {
            heading: string;
            description: string;
        };
        oidc: {
            heading: string;
            description: string;
        };
        scim: {
            heading: string;
            description: string;
        };
        custom: {
            heading: string;
            description: string;
        };
    };
    dialects: {
        advancedSearch: {
            form: {
                inputs: {
                    filterAttribute: {
                        placeholder: string;
                    };
                    filterCondition: {
                        placeholder: string;
                    };
                    filterValue: {
                        placeholder: string;
                    };
                };
            };
            placeholder: string;
            error: string;
        };
        attributes: {
            dialectURI: string;
        };
        notifications: {
            fetchDialects: {
                error: {
                    message: string;
                    description: string;
                };
                genericError: {
                    message: string;
                    description: string;
                };
                success: {
                    message: string;
                    description: string;
                };
            };
            fetchADialect: {
                genericError: {
                    message: string;
                    description: string;
                };
            };
            fetchExternalClaims: {
                genericError: {
                    message: string;
                    description: string;
                };
            };
            deleteDialect: {
                genericError: {
                    message: string;
                    description: string;
                };
                success: {
                    message: string;
                    description: string;
                };
            };
            addDialect: {
                error: {
                    message: string;
                    description: string;
                };
                genericError: {
                    message: string;
                    description: string;
                };
                success: {
                    message: string;
                    description: string;
                };
            };
            updateDialect: {
                genericError: {
                    message: string;
                    description: string;
                };
                success: {
                    message: string;
                    description: string;
                };
            };
            fetchSCIMResource: {
                genericError: {
                    message: string;
                    description: string;
                };
            };
        };
        pageLayout: {
            list: {
                title: string;
                description: string;
                primaryAction: string;
                view: string;
            };
            edit: {
                description: string;
                back: string;
                updateDialectURI: string;
                updateExternalAttributes: string;
            };
        };
        dangerZone: {
            actionTitle: string;
            header: string;
            subheader: string;
        };
        sections: {
            manageAttributes: {
                heading: string;
                description: string;
                attributes: {
                    heading: string;
                    description: string;
                };
            };
            manageAttributeMappings: {
                heading: string;
                description: string;
                oidc: {
                    heading: string;
                    description: string;
                };
                scim: {
                    heading: string;
                    description: string;
                };
                custom: {
                    heading: string;
                    description: string;
                };
                agent: {
                    heading: string;
                    description: string;
                }
            };
        };
        confirmations: {
            header: string;
            message: string;
            content: string;
            hint: string;
            action: string;
        };
        wizard: {
            steps: {
                dialectURI: string;
                externalAttribute: string;
                summary: string;
            };
            header: string;
            summary: {
                externalAttribute: string;
                mappedAttribute: string;
                notFound: string;
            };
        };
        forms: {
            fields: {
                attributeName: {
                    validation: {
                        invalid: string;
                        alreadyExists: string;
                    };
                };
            };
            dialectURI: {
                label: string;
                placeholder: string;
                requiredErrorMessage: string;
            };
            submit: string;
        };
    };
    external: {
        advancedSearch: {
            form: {
                inputs: {
                    filterAttribute: {
                        placeholder: string;
                    };
                    filterCondition: {
                        placeholder: string;
                    };
                    filterValue: {
                        placeholder: string;
                    };
                };
            };
            error: string;
            placeholder: string;
        };
        attributes: {
            attributeURI: string;
            mappedClaim: string;
        };
        notifications: {
            addExternalAttribute: {
                genericError: {
                    message: string;
                    description: string;
                };
                success: {
                    message: string;
                    description: string;
                };
            };
            fetchExternalClaims: {
                error: {
                    message: string;
                    description: string;
                };
                genericError: {
                    message: string;
                    description: string;
                };
                success: {
                    message: string;
                    description: string;
                };
            };
            getExternalAttribute: {
                genericError: {
                    message: string;
                    description: string;
                };
            };
            updateExternalAttribute: {
                genericError: {
                    message: string;
                    description: string;
                };
                success: {
                    message: string;
                    description: string;
                };
            };
            deleteExternalClaim: {
                genericError: {
                    message: string;
                    description: string;
                };
                success: {
                    message: string;
                    description: string;
                };
            };
        };
        forms: {
            attributeURI: {
                label: string;
                placeholder: string;
                requiredErrorMessage: string;
                validationErrorMessages: {
                    duplicateName: string;
                    invalidName: string;
                    scimInvalidName: string;
                };
            };
            localAttribute: {
                label: string;
                placeholder: string;
                requiredErrorMessage: string;
            };
            submit: string;
            warningMessage: string;
            emptyMessage: string;
        };
        pageLayout: {
            edit: {
                header: string;
                attributeMappingPrimaryAction: string;
                attributePrimaryAction: string;
            };
        };
        placeholders: {
            empty: {
                title: string;
                subtitle: string;
            };
        };
    };
    local: {
        advancedSearch: {
            form: {
                inputs: {
                    filterAttribute: {
                        placeholder: string;
                    };
                    filterCondition: {
                        placeholder: string;
                    };
                    filterValue: {
                        placeholder: string;
                    };
                };
            };
            error: string;
            placeholder: string;
        };
        attributes: {
            attributeURI: string;
        };
        notifications: {
            fetchLocalClaims: {
                error: {
                    message: string;
                    description: string;
                };
                genericError: {
                    message: string;
                    description: string;
                };
                success: {
                    message: string;
                    description: string;
                };
            };
            getAClaim: {
                genericError: {
                    message: string;
                    description: string;
                };
            };
            getClaims: {
                genericError: {
                    message: string;
                    description: string;
                };
            };
            getLocalDialect: {
                genericError: {
                    message: string;
                    description: string;
                };
            };
            addLocalClaim: {
                genericError: {
                    message: string;
                    description: string;
                };
                success: {
                    message: string;
                    description: string;
                };
            };
            updateClaim: {
                genericError: {
                    message: string;
                    description: string;
                };
                success: {
                    message: string;
                    description: string;
                };
            };
            deleteClaim: {
                genericError: {
                    message: string;
                    description: string;
                };
                success: {
                    message: string;
                    description: string;
                };
            };
        };
        pageLayout: {
            edit: {
                tabs: {
                    general: string;
                    additionalProperties: string;
                    mappedAttributes: string;
                };
                description: string;
                back: string;
            };
            local: {
                description: string;
                title: string;
                back: string;
                action: string;
            };
        };
        wizard: {
            steps: {
                general: string;
                mapAttributes: string;
                summary: string;
            };
            header: string;
            summary: {
                userstore: string;
                attribute: string;
                supportedByDefault: string;
                required: string;
                readOnly: string;
                attributeURI: string;
                displayOrder: string;
                regEx: string;
            };
        };
        additionalProperties: {
            hint: string;
            isUniqueDeprecationMessage: {
                uniquenessDisabled: string;
                uniquenessEnabled: string;
            };
            key: string;
            value: string;
            keyRequiredErrorMessage: string;
            valueRequiredErrorMessage: string;
        };
        confirmation: {
            hint: string;
            primaryAction: string;
            header: string;
            message: string;
            content: string;
        };
        forms: {
            attributeID: {
                label: string;
                placeholder: string;
                requiredErrorMessage: string;
            };
            attributeHint: string;
            name: {
                label: string;
                placeholder: string;
                requiredErrorMessage: string;
                validationErrorMessages: {
                    invalidName: string;
                };
            };
            sharedProfileValueResolvingMethod: {
                label: string;
                hint: string;
                options: {
                    fromOrigin: string;
                    fromSharedProfile: string;
                    fromFirstFoundInHierarchy: string;
                };
            }
            uniquenessScope: {
                label: string;
                options: {
                    acrossUserstores: string;
                    none: string;
                    withinUserstore: string;
                };
            };
            uniquenessScopeHint: string;
            nameHint: string;
            description: {
                label: string;
                placeholder: string;
                requiredErrorMessage: string;
            };
            descriptionHint: string;
            regEx: {
                label: string;
                placeholder: string;
            };
            regExHint: string;
            supportedByDefault: {
                label: string;
            };
            displayOrder: {
                label: string;
                placeholder: string;
            };
            canonicalValues: {
                hint: string;
                keyLabel: string;
                valueLabel: string;
                keyRequiredErrorMessage: string;
                valueRequiredErrorMessage: string;
                validationError: string;
                validationErrorMessage: string;
            };
            dataType: {
                hint: string;
                label: string;
                options: {
                    text: string;
                    options: string;
                    integer: string;
                    decimal: string;
                    boolean: string;
                    dateTime: string;
                    object: string;
                };
            };
            subAttributes: {
                label: string;
                placeholder: string;
                validationError: string;
                validationErrorMessage: string;
            };
            multiValued: {
                label: string;
                placeholder: string;
            };
            multiValuedHint: string;
            multiValuedSystemClaimHint: string;
            displayOrderHint: string;
            required: {
                label: string;
            };
            inputFormat: {
                label: string;
                hint: string;
                options: {
                    textInput: string;
                    dropdown: string;
                    multiSelectDropdown: string;
                    radioGroup: string;
                    checkBoxGroup: string;
                    checkbox: string;
                    datePicker: string;
                    textArea: string;
                    toggle: string;
                    numberInput: string;
                }
            }
            requiredHint: string;
            requiredWarning: string;
            readOnly: {
                label: string;
            };
            readOnlyHint: string;
            attribute: {
                placeholder: string;
                requiredErrorMessage: string;
            };
            infoMessages: {
                disabledConfigInfo: string;
                configApplicabilityInfo: string;
            };
            profiles: {
                administratorConsole: string;
                attributeConfigurations: {
                    title: string;
                    description: string;
                }
                endUserProfile: string;
                selfRegistration: string;
                displayByDefault: string;
                displayByDefaultHint: string;
                required: string;
                requiredHint: string;
                readonly: string;
                readonlyHint: string;
                selfRegistrationReadOnlyHint: string;
            };
        };
        dangerZone: {
            actionTitle: string;
            header: string;
            subheader: string;
        };
        mappedAttributes: {
            hint: string;
            mappedAttributeName: string;
            enableForUserStore: string;
        };
    };
    list: {
        columns: {
            actions: string;
            claimURI: string;
            dialectURI: string;
            name: string;
        };
        confirmation: {
            local: {
                message: string;
                name: string;
            };
            dialect: {
                message: string;
                name: string;
            };
            external: {
                message: string;
                name: string;
            };
            hint: string;
            header: string;
            message: string;
            content: string;
            action: string;
        };
        placeholders: {
            emptySearch: {
                title: string;
                subtitle: string;
                action: string;
            };
            emptyList: {
                title: {
                    local: string;
                    dialect: string;
                    external: string;
                };
                subtitle: string;
                action: {
                    local: string;
                    dialect: string;
                    external: string;
                };
            };
        };
        warning: string;
    };
    scopeMappings: {
        deletionConfirmationModal: {
            assertionHint: string;
            content: string;
            header: string;
            message: string;
        };
        saveChangesButton: string;
    };
}
