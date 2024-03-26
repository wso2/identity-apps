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

export interface oidcScopesNS {
    back: string;
    viewAttributes: string;
    manageAttributes: string;
    buttons: {
        addScope: string;
    };
    confirmationModals: {
        deleteScope: {
            assertionHint: string;
            header: string;
            message: string;
            content: string;
        };
        deleteClaim: {
            assertionHint: string;
            header: string;
            message: string;
            content: string;
        };
    };
    addAttributes: {
        description: string;
    };
    editScope: {
        claimList: {
            emptyPlaceholder: {
                action: string;
                title: string;
                subtitles: {
                    0: string;
                    1: string;
                };
            };
            emptySearch: {
                action: string;
                title: string;
                subtitles: {
                    0: string;
                    1: string;
                };
            };
            title: string;
            subTitle: string;
            addClaim: string;
            popupDelete: string;
            searchClaims: string;
        };
    };
    forms: {
        addScopeForm: {
            inputs: {
                displayName: {
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                    };
                };
                scopeName: {
                    label: string;
                    placeholder: string;
                    validations: {
                        duplicate: string;
                        empty: string;
                        invalid: string;
                    };
                };
                description: {
                    label: string;
                    placeholder: string;
                };
            };
        };
    };
    list: {
        columns: {
            actions: string;
            name: string;
        };
        empty: {
            action: string;
            title: string;
            subtitles: {
                0: string;
                1: string;
            };
        };
        searchPlaceholder: string;
    };
    wizards: {
        addScopeWizard: {
            title: string;
            subTitle: string;
            steps: {
                basicDetails: string;
                claims: string;
            };
            buttons: {
                next: string;
                previous: string;
            };
            claimList: {
                searchPlaceholder: string;
                table: {
                    header: string;
                    emptyPlaceholders: {
                        assigned: string;
                        unAssigned: string;
                    };
                };
            };
        };
    };
    notifications: {
        addOIDCScope: {
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
        addOIDCClaim: {
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
        fetchOIDCScopes: {
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
        fetchOIDCScope: {
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
        fetchOIDClaims: {
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
        deleteOIDCScope: {
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
        deleteOIDClaim: {
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
        updateOIDCScope: {
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
        claimsMandatory: {
            error: {
                message: string;
                description: string;
            };
        };
    };
    placeholders: {
        emptyList: {
            action: string;
            subtitles: {
                0: string;
                1: string;
                2: string;
            };
            title: string;
        };
        emptySearch: {
            action: string;
            title: string;
            subtitles: {
                0: string;
                1: string;
            };
        };
    };
}
