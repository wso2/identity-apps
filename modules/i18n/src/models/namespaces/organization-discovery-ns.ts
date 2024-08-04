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
export interface organizationDiscoveryNS {
    advancedSearch: {
        form: {
            dropdown: {
                filterAttributeOptions: {
                    organizationName: string;
                };
            };
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
    assign: {
        title: string;
        description: string;
        form: {
            fields: {
                emailDomains: {
                    label: string;
                    placeholder: string;
                    hint: string;
                    validations: {
                        invalid: {
                            0: string;
                            1: string;
                        };
                    };
                };
                organizationName: {
                    label: string;
                    placeholder: string;
                    emptyPlaceholder: {
                        0: string;
                        1: string;
                    };
                    hint: string;
                };
            };
        };
        buttons: {
            assign: string;
        };
    };
    emailDomains: {
        actions: {
            assign: string;
            enable: string;
        };
    };
    edit: {
        back: string;
        description: string;
        form: {
            fields: {
                emailDomains: {
                    label: string;
                    placeholder: string;
                    hint: string;
                    validations: {
                        invalid: {
                            0: string;
                            1: string;
                        };
                    };
                };
                organizationName: {
                    label: string;
                    hint: string;
                };
            };
            message: string;
        };
    };
    message: string;
    notifications: {
        addEmailDomains: {
            error: {
                description: string;
                message: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        checkEmailDomain: {
            error: {
                description: string;
                message: string;
            };
        };
        disableEmailDomainDiscovery: {
            error: {
                description: string;
                message: string;
            };
            success: {
                description: string;
                message: string;
            };
        };
        enableEmailDomainDiscovery: {
            error: {
                description: string;
                message: string;
            };
            success: {
                description: string;
                message: string;
            };
        };
        fetchOrganizationDiscoveryAttributes: {
            error: {
                description: string;
                message: string;
            };
        };
        getEmailDomainDiscovery: {
            error: {
                description: string;
                message: string;
            };
        };
        getOrganizationListWithDiscovery: {
            error: {
                description: string;
                message: string;
            };
        };
        updateOrganizationDiscoveryAttributes: {
            error: {
                description: string;
                message: string;
            };
            success: {
                description: string;
                message: string;
            };
        };
    };
    placeholders: {
        emptyList: {
            action: string;
            title: string;
            subtitles: string;
        };
    };
    title: string;
}
