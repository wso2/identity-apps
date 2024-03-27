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
export interface IdpNS {
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
    };
    buttons: {
        addIDP: string;
        addAuthenticator: string;
        addConnector: string;
        addAttribute: string;
        addCertificate: string;
    };
    confirmations: {
        deleteIDP: {
            assertionHint: string;
            header: string;
            message: string;
            content: string;
        };
        deleteIDPWithConnectedApps: {
            assertionHint: string;
            header: string;
            message: string;
            content: string;
        };
        deleteAuthenticator: {
            assertionHint: string;
            header: string;
            message: string;
            content: string;
        };
        deleteConnector: {
            assertionHint: string;
            header: string;
            message: string;
            content: string;
        };
    };
    connectedApps: {
        action: string;
        header: string;
        subHeader: string;
        placeholders: {
            search: string;
            emptyList: string;
        };
        applicationEdit: {
            back: string;
        };
        genericError: {
            description: string;
            message: string;
        };
    };
    dangerZoneGroup: {
        header: string;
        disableIDP: {
            actionTitle: string;
            header: string;
            subheader: string;
            subheader2: string;
        };
        deleteIDP: {
            actionTitle: string;
            header: string;
            subheader: string;
        };
    };
    forms: {
        advancedConfigs: {
            federationHub: {
                hint: string;
                label: string;
            };
            homeRealmIdentifier: {
                hint: string;
                label: string;
            };
            alias: {
                hint: string;
                label: string;
            };
            certificateType: {
                label: string;
                hint: string;
                certificatePEM: {
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                    };
                };
                certificateJWKS: {
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                        invalid: string;
                    };
                };
            };
            implicitAssociation: {
                enable: {
                    label: string;
                    hint: string;
                };
                primaryAttribute: {
                    label: string;
                    hint: string;
                };
                secondaryAttribute: {
                    label: string;
                    hint: string;
                };
                warning: string;
            };
        };
        attributeSettings: {
            attributeMapping: {
                attributeColumnHeader: string;
                attributeMapColumnHeader: string;
                attributeMapInputPlaceholderPrefix: string;
                componentHeading: string;
                hint: string;
                placeHolder: {
                    title: string;
                    subtitle: string;
                    action: string;
                };
                attributeMapTable: {
                    mappedAttributeColumnHeader: string;
                    externalAttributeColumnHeader: string;
                };
                heading: string;
                subheading: string;
                search: {
                    placeHolder: string;
                };
                attributeDropdown: {
                    label: string;
                    placeHolder: string;
                    noResultsMessage: string;
                };
                externalAttributeInput: {
                    label: string;
                    placeHolder: string;
                    existingErrorMessage: string;
                };
                addAttributeButtonLabel: string;
                modal: {
                    header: string;
                    placeholder: {
                        title: string;
                        subtitle: string;
                    };
                };
            };
            attributeProvisioning: {
                attributeColumnHeader: {
                    0: string;
                    1: string;
                };
                attributeMapColumnHeader: string;
                attributeMapInputPlaceholderPrefix: string;
                componentHeading: string;
                hint: string;
            };
            attributeListItem: {
                validation: {
                    empty: string;
                };
            };
            attributeSelection: {
                searchAttributes: {
                    placeHolder: string;
                };
            };
        };
        authenticatorAccordion: {
            default: {
                0: string;
                1: string;
            };
            enable: {
                0: string;
                1: string;
            };
        };
        outboundConnectorAccordion: {
            default: {
                0: string;
                1: string;
            };
            enable: {
                0: string;
                1: string;
            };
        };
        common: {
            requiredErrorMessage: string;
            invalidURLErrorMessage: string;
            invalidQueryParamErrorMessage: string;
            customProperties: string;
            internetResolvableErrorMessage: string;
        };
        generalDetails: {
            name: {
                hint: string;
                label: string;
                placeholder: string;
                validations: {
                    empty: string;
                    duplicate: string;
                    maxLengthReached: string;
                };
            };
            description: {
                hint: string;
                label: string;
                placeholder: string;
            };
            image: {
                hint: string;
                label: string;
                placeholder: string;
            };
        };
        jitProvisioning: {
            enableJITProvisioning: {
                disabledMessageContent:
                    | string
                    | {
                          1: string;
                          2: string;
                      };
                hint: string;
                label: string;
                disabledMessageHeader: string;
            };
            provisioningUserStoreDomain: {
                hint: string;
                label: string;
            };
            provisioningScheme: {
                hint: string;
                label: string;
                children: {
                    0: string;
                    1: string;
                    2: string;
                    3: string;
                };
            };
        };
        roleMapping: {
            heading: string;
            keyName: string;
            valueName: string;
            validation: {
                keyRequiredMessage: string;
                valueRequiredErrorMessage: string;
                duplicateKeyErrorMsg: string;
            };
            hint: string;
        };
        uriAttributeSettings: {
            subject: {
                heading: string;
                hint: string;
                placeHolder: string;
                label: string;
                validation: {
                    empty: string;
                };
            };
            role: {
                heading: string;
                hint: string;
                placeHolder: string;
                label: string;
                validation: {
                    empty: string;
                };
            };
        };
        outboundProvisioningRoles: {
            heading: string;
            hint: string;
            placeHolder: string;
            label: string;
            popup: {
                content: string;
            };
        };
        outboundProvisioningTitle: string;
    };
    helpPanel: {
        tabs: {
            samples: {
                content: {
                    docs: {
                        goBack: string;
                        hint: string;
                        title: string;
                    };
                };
                heading: string;
            };
        };
    };
    templates: {
        manualSetup: {
            heading: string;
            subHeading: string;
        };
        quickSetup: {
            heading: string;
            subHeading: string;
        };
    };
    list: {
        actions: string;
        name: string;
    };
    modals: {
        addAuthenticator: {
            title: string;
            subTitle: string;
        };
        addCertificate: {
            title: string;
            subTitle: string;
        };
        addProvisioningConnector: {
            title: string;
            subTitle: string;
        };
        attributeSelection: {
            title: string;
            subTitle: string;
            content: {
                searchPlaceholder: string;
            };
        };
    };
    notifications: {
        addFederatedAuthenticator: {
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
        addIDP: {
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
        apiLimitReachedError: {
            error: {
                message: string;
                description: string;
            };
        };
        changeCertType: {
            pem: {
                description: string;
                message: string;
            };
            jwks: {
                description: string;
                message: string;
            };
        };
        deleteCertificate: {
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
        deleteIDP: {
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
        disableAuthenticator: {
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
        disableOutboundProvisioningConnector: {
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
        duplicateCertificateUpload: {
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
        getIDP: {
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
        getIDPList: {
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
        getIDPTemplate: {
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
        getIDPTemplateList: {
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
        getFederatedAuthenticator: {
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
        getFederatedAuthenticatorsList: {
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
        getFederatedAuthenticatorMetadata: {
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
        getOutboundProvisioningConnector: {
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
        getOutboundProvisioningConnectorsList: {
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
        getOutboundProvisioningConnectorMetadata: {
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
        getAllLocalClaims: {
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
        getRolesList: {
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
        submitAttributeSettings: {
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
        tierLimitReachedError: {
            emptyPlaceholder: {
                action: string;
                title: string;
                subtitles: string;
            };
            heading: string;
        };
        deleteDefaultAuthenticator: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
                genericMessage: string;
            };
            success: {
                message: string;
                description: string;
                genericMessage: string;
            };
        };
        deleteDefaultConnector: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
                genericMessage: string;
            };
            success: {
                message: string;
                description: string;
                genericMessage: string;
            };
        };
        updateClaimsConfigs: {
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
        updateFederatedAuthenticator: {
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
        updateFederatedAuthenticators: {
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
        updateIDP: {
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
        updateIDPCertificate: {
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
        updateIDPRoleMappings: {
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
        updateJITProvisioning: {
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
        updateOutboundProvisioningConnectors: {
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
        updateOutboundProvisioningConnector: {
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
    };
    placeHolders: {
        emptyCertificateList: {
            title: string;
            subtitles: {
                0: string;
                1: string;
            };
        };
        emptyIDPList: {
            title: string;
            subtitles: {
                0: string;
                1: string;
                2: string;
            };
        };
        emptyIDPSearchResults: {
            title: string;
            subtitles: {
                0: string;
                1: string;
            };
        };
        emptyAuthenticatorList: {
            title: string;
            subtitles: {
                0: string;
                1: string;
                2: string;
            };
        };
        emptyConnectorList: {
            title: string;
            subtitles: {
                0: string;
                1: string;
            };
        };
        noAttributes: {
            title: string;
            subtitles: {
                0: string;
            };
        };
    };
    wizards: {
        addAuthenticator: {
            header: string;
            steps: {
                authenticatorSelection: {
                    title: string;
                    quickSetup: {
                        title: string;
                        subTitle: string;
                    };
                    manualSetup: {
                        title: string;
                        subTitle: string;
                    };
                };
                authenticatorConfiguration: {
                    title: string;
                };
                summary: {
                    title: string;
                };
            };
        };
        addIDP: {
            header: string;
            steps: {
                generalSettings: {
                    title: string;
                };
                authenticatorConfiguration: {
                    title: string;
                };
                provisioningConfiguration: {
                    title: string;
                };
                summary: {
                    title: string;
                };
            };
        };
        addProvisioningConnector: {
            header: string;
            steps: {
                connectorSelection: {
                    title: string;
                    defaultSetup: {
                        title: string;
                        subTitle: string;
                    };
                };
                connectorConfiguration: {
                    title: string;
                };
                summary: {
                    title: string;
                };
            };
        };
        buttons: {
            next: string;
            finish: string;
            previous: string;
        };
    };
}
