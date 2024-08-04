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
export interface ApiResourcesNS {
    confirmations: {
        deleteAPIResource: {
            assertionHint: string;
            content: string;
            header: string;
            message: string;
        };
        deleteAPIResourcePermission: {
            assertionHint: string;
            content: string;
            header: string;
            message: string;
        };
    };
    tabs: {
        scopes: {
            button: string;
            label: string;
            title: string;
            subTitle: string;
            learnMore: string;
            search: string;
            empty: {
                title: string;
                subTitle: string;
            };
            emptySearch: {
                title: string;
                subTitle: {
                    0: string;
                    1: string;
                };
                viewAll: string;
            };
            copyPopupText: string;
            copiedPopupText: string;
            removeScopePopupText: string;
            form: {
                button: string;
                cancelButton: string;
                submitButton: string;
                title: string;
                subTitle: string;
                fields: {
                    displayName: {
                        emptyValidate: string;
                        label: string;
                        placeholder: string;
                    };
                    scope: {
                        emptyValidate: string;
                        label: string;
                        placeholder: string;
                    };
                    description: {
                        label: string;
                        placeholder: string;
                    };
                };
            };
        };
    };
    wizard: {
        addApiResource: {
            steps: {
                scopes: {
                    empty: {
                        title: string;
                        subTitle: string;
                    };
                    stepTitle: string;
                    form: {
                        button: string;
                        fields: {
                            displayName: {
                                emptyValidate: string;
                                label: string;
                                placeholder: string;
                                hint: string;
                            };
                            permission: {
                                emptyValidate: string;
                                uniqueValidate: string;
                                invalid: string;
                                label: string;
                                placeholder: string;
                                hint: string;
                            };
                            permissionList: {
                                label: string;
                            };
                            description: {
                                label: string;
                                placeholder: string;
                                hint: string;
                            };
                        };
                    };
                    removeScopePopupText: string;
                };
            };
        };
    };
}
