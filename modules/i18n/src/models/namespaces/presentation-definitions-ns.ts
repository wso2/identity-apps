/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

export interface PresentationDefinitionsInterface {
    page: {
        title: string;
        heading: string;
        description: string;
    };
    buttons: {
        addDefinition: string;
    };
    placeholders: {
        emptyList: {
            subtitle: string;
        };
        emptySearch: {
            title: string;
            subtitle1: string;
            subtitle2: string;
            action: string;
        };
    };
    list: {
        columns: {
            name: string;
            description: string;
            actions: string;
        };
        confirmations: {
            deleteItem: {
                header: string;
                message: string;
                content: string;
                assertionHint: string;
            };
            deleteBlockedByConnections: {
                header: string;
                message: string;
                content: string;
            };
        };
        search: {
            placeholder: string;
            filterAttributePlaceholder: string;
            filterConditionsPlaceholder: string;
            filterValuePlaceholder: string;
            attributes: {
                name: string;
            };
        };
    };
    wizard: {
        title: string;
        form: {
            displayName: {
                label: string;
                placeholder: string;
                hint: string;
            };
            identifier: {
                label: string;
                placeholder: string;
                hint: string;
                validationError: string;
            };
            description: {
                label: string;
                placeholder: string;
            };
            credentialType: {
                label: string;
                placeholder: string;
                hint: string;
            };
            format: {
                label: string;
                hint: string;
            };
            submitButton: string;
        };
    };
    editPage: {
        title: string;
        backButton: string;
        tabs: {
            general: string;
            claims: string;
            issuerTrust: string;
        };
        digitalWalletHint: string;
        quickCopy: {
            identifier: {
                label: string;
                hint: string;
            };
        };
        issuerTrust: {
            heading: string;
            hint: string;
            keyResolutionMethod: {
                label: string;
                hint: string;
                options: {
                    x5c: string;
                    jwks_uri: string;
                    pem: string;
                };
                shortLabels: {
                    x5c: string;
                    jwks_uri: string;
                    pem: string;
                };
                optionHints: {
                    x5c: string;
                    jwks_uri: string;
                    pem: string;
                };
            };
            certificate: {
                infoUnavailable: string;
                expiryDate: string;
                actions: {
                    change: string;
                    view: string;
                    remove: string;
                };
                modal: {
                    title: string;
                    serialNumber: string;
                    unsupportedPrefix: string;
                    unsupportedSuffix: string;
                };
            };
            jwksUri: {
                label: string;
                placeholder: string;
                hint: string;
                validationError: string;
            };
            issuerConfig: {
                addTitle: string;
                editTitle: string;
                addButton: string;
                emptyPlaceholder: string;
                uploadCert: string;
                keyResolutionMethod: {
                    label: string;
                    subheading: string;
                };
                sections: {
                    x5c: {
                        subheading: string;
                    };
                    jwksUri: {
                        subheading: string;
                    };
                    pem: {
                        subheading: string;
                    };
                };
                issuerUrl: {
                    label: string;
                    placeholder: string;
                    hint: string;
                    validationError: string;
                };
                keySource: {
                    x5cLabel: string;
                    pemLabel: string;
                    dropzone: {
                        description: string;
                        separator: string;
                    };
                };
                table: {
                    methodColumn: string;
                    issuerUrlColumn: string;
                };
            };
        };
        form: {
            displayName: {
                label: string;
                placeholder: string;
                requiredError: string;
            };
            description: {
                label: string;
                placeholder: string;
            };
            credentials: {
                type: {
                    label: string;
                    placeholder: string;
                };
                claims: {
                    label: string;
                    hint: string;
                    addTitle: string;
                    editTitle: string;
                    claimPath: {
                        label: string;
                        placeholder: string;
                        hint: string;
                    };
                    required: {
                        label: string;
                        hint: string;
                    };
                    addClaim: string;
                    editClaim: string;
                    emptyPlaceholder: string;
                };
            };
        };
        dangerZone: {
            header: string;
            delete: {
                header: string;
                subheader: string;
                actionTitle: string;
            };
        };
        confirmations: {
            claimMappedInConnection: {
                editHeader: string;
                deleteHeader: string;
                message: string;
                content: string;
            };
            deleteDefinition: {
                header: string;
                message: string;
                content: string;
                assertionHint: string;
            };
            deleteBlockedByConnections: {
                header: string;
                message: string;
                content: string;
            };
        };
    };
    notifications: {
        fetchDefinitions: {
            error: {
                message: string;
                description: string;
            };
        };
        fetchDefinition: {
            error: {
                message: string;
                description: string;
            };
        };
        createDefinition: {
            success: {
                message: string;
                description: string;
            };
            error: {
                message: string;
                description: string;
            };
            duplicateError: {
                message: string;
                description: string;
            };
        };
        updateDefinition: {
            success: {
                message: string;
                description: string;
            };
            error: {
                message: string;
                description: string;
            };
        };
        deleteDefinition: {
            success: {
                message: string;
                description: string;
            };
            error: {
                message: string;
                description: string;
            };
        };
        saveIssuerConfig: {
            success: {
                message: string;
                description: string;
            };
            error: {
                message: string;
                description: string;
            };
        };
        deleteIssuerConfig: {
            success: {
                message: string;
                description: string;
            };
            error: {
                message: string;
                description: string;
            };
        };
    };
}
