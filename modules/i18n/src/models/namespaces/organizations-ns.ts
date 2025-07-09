/**
 * Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
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
export interface organizationsNS {
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
                filterMetaAttribute: {
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                    };
                };
            };
        };
        placeholder: string;
    };
    list: {
        actions: {
            add: string;
        };
        columns: {
            name: string;
            actions: string;
        };
    };
    title: string;
    notifications: {
        fetchOrganization: {
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
        deleteOrganization: {
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
        deleteOrganizationWithSubOrganizationError: string;
        disableOrganization: {
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
        disableOrganizationWithSubOrganizationError: string;
        enableOrganization: {
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
        updateOrganization: {
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
        updateOrganizationAttributes: {
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
        addOrganization: {
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
        getConfiguration: {
            error: {
                description: string;
                message: string;
            }
        };
        getOrganizationList: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
        };
        getMetaAttributesList: {
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
    confirmations: {
        deleteOrganization: {
            assertionHint: string;
            header: string;
            message: string;
            content: string;
        };
    };
    placeholders: {
        emptyList: {
            action: string;
            title: string;
            subtitles: {
                0: string;
                1: string;
                2: string;
                3: string;
            };
        };
    };
    edit: {
        description: string;
        back: string;
        tabTitles: {
            overview: string;
            attributes: string;
        };
        fields: {
            id: {
                label: string;
                ariaLabel: string;
            };
            name: {
                label: string;
                placeholder: string;
                ariaLabel: string;
            };
            orgHandle: {
                label: string;
                placeholder: string;
                ariaLabel: string;
            };
            description: {
                label: string;
                placeholder: string;
                ariaLabel: string;
            };
            domain: {
                label: string;
                ariaLabel: string;
            };
            type: {
                label: string;
                ariaLabel: string;
            };
            created: {
                label: string;
                ariaLabel: string;
            };
            lastModified: {
                label: string;
                ariaLabel: string;
            };
        };
        dangerZone: {
            title: string;
            subHeader: string;
            disableOrganization: {
                enableActionTitle: string;
                disableActionTitle: string;
                subheader: string;
            };
        };
        attributes: {
            hint: string;
            key: string;
            value: string;
            keyRequiredErrorMessage: string;
            valueRequiredErrorMessage: string;
        };
    };
    modals: {
        addOrganization: {
            header: string;
            subtitle1: string;
            subtitle2: string;
        };
    };
    forms: {
        addOrganization: {
            name: {
                validation: {
                    duplicate: string;
                    empty: string;
                };
                label: string;
                placeholder: string;
            };
            orgHandle: {
                label: string;
                placeholder: string;
                tooltip: string;
                validation: {
                    duplicate: string;
                    empty: string;
                    invalidFirstCharacter: string;
                    invalidLength: string;
                    invalidPattern: string;
                    mandatoryExtension: string;
                };
            };
            description: {
                label: string;
                placeholder: string;
            };
            domainName: {
                validation: {
                    duplicate: string;
                    empty: string;
                };
                label: string;
                placeholder: string;
            };
            type: string;
            structural: string;
            tenant: string;
        };
    };
    homeList: {
        name: string;
        description: string;
    };
    shareApplicationSubTitle: string;
    shareApplicationRadio: string;
    shareApplicationInfo: string;
    unshareApplicationRadio: string;
    shareWithSelectedOrgsRadio: string;
    unshareApplicationInfo: string;
    switching: {
        search: {
            placeholder: string;
        };
        emptyList: string;
        subOrganizations: string;
        goBack: string;
        switchLabel: string;
        switchLabelAlt: string;
        switchButton: string;
        notifications: {
            switchOrganization: {
                genericError: {
                    message: string;
                    description: string;
                };
            };
        };
    };
    view: {
        description: string;
    };
}
