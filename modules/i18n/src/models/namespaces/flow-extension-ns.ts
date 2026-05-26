/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

export interface inFlowExtensionNS {
    createWizard: {
        title: string;
        subTitle: string;
        steps: {
            generalSettings: {
                title: string;
                name: {
                    label: string;
                    placeholder: string;
                    hint: string;
                    validations: {
                        duplicate: string;
                        invalid: string;
                    };
                };
                description: {
                    label: string;
                    placeholder: string;
                    validations: {
                        maxLength: string;
                    };
                };
            };
            endpointConfig: {
                title: string;
                endpoint: {
                    label: string;
                    placeholder: string;
                    hint: string;
                    validations: {
                        empty: string;
                        general: string;
                    };
                };
                authenticationType: {
                    title: string;
                    label: string;
                    placeholder: string;
                    hint: string;
                    validations: {
                        required: string;
                    };
                };
                authProperties: {
                    username: {
                        label: string;
                        placeholder: string;
                        validations: {
                            required: string;
                        };
                    };
                    password: {
                        label: string;
                        placeholder: string;
                        validations: {
                            required: string;
                        };
                    };
                    accessToken: {
                        label: string;
                        placeholder: string;
                        validations: {
                            required: string;
                        };
                    };
                    header: {
                        label: string;
                        placeholder: string;
                        validations: {
                            required: string;
                            invalid: string;
                        };
                    };
                    value: {
                        label: string;
                        placeholder: string;
                        validations: {
                            required: string;
                        };
                    };
                };
                certificate: {
                    title: string;
                    hint: string;
                };
            };
            accessConfig: {
                title: string;
                expose: {
                    heading: string;
                    hint: string;
                    add: string;
                };
                encrypted: string;
                operations: {
                    heading: string;
                    hint: string;
                    addPath: string;
                    addOperation: string;
                    types: {
                        add: {
                            heading: string;
                            description: string;
                        };
                        replace: {
                            heading: string;
                            description: string;
                        };
                        remove: {
                            heading: string;
                            description: string;
                        };
                    };
                };
                encryption: {
                    heading: string;
                    hint: string;
                };
            };
        };
    };
    notifications: {
        createSuccess: {
            description: string;
            message: string;
        };
        createError: {
            message: string;
        };
        createGenericError: {
            description: string;
            message: string;
        };
    };
}
