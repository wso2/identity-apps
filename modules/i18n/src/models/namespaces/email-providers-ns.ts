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

export interface EmailProviderNS {
    fields: {
        authentication: {
            info: {
                message: string;
            };
            label: string;
            types: {
                client_credential: {
                    name: string;
                    properties: {
                        tokenEndpoint: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string
                            };
                        };
                        clientId: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string
                            };
                        };
                        clientSecret: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string
                            };
                        };
                    };
                };
                basic: {
                    name: string;
                    properties: {
                        password: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string
                            };
                        };
                        username: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string
                            };
                        };
                    };
                };
            }
        };
        authenticationType: {
            hint: {
                create: string;
                update: string;
            };
            label: string;
            placeholder: string;
            validations: {
                empty: string;
            };
        };
        authenticationTypeDropdown: {
                    
            title: string;
            label: string;
            placeholder: string;
            hint: string;
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
                clientId: {
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                clientSecret: {
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                tokenEndpoint: {
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
            };
            validations: {
                required: string;
            };
        };
    }
}