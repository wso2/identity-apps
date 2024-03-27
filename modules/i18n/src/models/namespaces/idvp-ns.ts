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
export interface IdvpNS {
    advancedSearch: {
        form: {
            inputs: {
                filterValue: {
                    placeholder: string;
                };
            };
        };
        placeholder: string;
    };
    buttons: {
        addIDVP: string;
    };
    placeholders: {
        emptyIDVPList: {
            title: string;
            subtitles: {
                0: string;
                1: string;
                2: string;
            };
        };
        emptyIDVPTypeList: {
            title: string;
            subtitles: {
                0: string;
                1: string;
            };
        };
    };
    confirmations: {
        deleteIDVP: {
            assertionHint: string;
            header: string;
            message: string;
            content: string;
        };
    };
    notifications: {
        getIDVPList: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
        };
        deleteIDVP: {
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
        updateIDVP: {
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
        addIDVP: {
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
        };
        getIDVP: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
        };
        getUIMetadata: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
        };
        getIDVPTemplateTypes: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
        };
        getIDVPTemplateType: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
        };
        getIDVPTemplate: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
        };
    };
    forms: {
        attributeSettings: {
            attributeMapping: {
                heading: string;
                hint: string;
                addButton: string;
                emptyPlaceholderEdit: {
                    title: string;
                    subtitle: string;
                };
                emptyPlaceholderCreate: {
                    title: string;
                    subtitle: string;
                };
            };
            attributeMappingListItem: {
                validation: {
                    duplicate: string;
                    required: string;
                    invalid: string;
                };
                placeholders: {
                    mappedValue: string;
                    localClaim: string;
                };
                labels: {
                    mappedValue: string;
                    localClaim: string;
                };
            };
            attributeSelectionModal: {
                header: string;
            };
        };
        generalDetails: {
            name: {
                hint: string;
                label: string;
                placeholder: string;
                validations: {
                    empty: string;
                    duplicate: string;
                    invalid: string;
                    required: string;
                    maxLengthReached: string;
                };
            };
            description: {
                hint: string;
                label: string;
                placeholder: string;
            };
        };
    };
    dangerZoneGroup: {
        header: string;
        disableIDVP: {
            actionTitle: string;
            header: string;
            subheader: string;
            subheader2: string;
        };
        deleteIDVP: {
            actionTitle: string;
            header: string;
            subheader: string;
        };
    };
    list: {
        actions: string;
        name: string;
    };
}
