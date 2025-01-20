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

export interface customAuthenticationNS {
    fields: {
        createWizard: {
            title: string;
            subTitle: string;
            authenticationTypeStep: {
                label: string;
                externalAuthenticationCard: {
                    header: string;
                    mainDescription: string;
                    examples: string;
                };
                internalUserAuthenticationCard: {
                    header: string;
                    mainDescription: string;
                    examples: string;
                };
                title: string;
                twoFactorAuthenticationCard: {
                    header: string;
                    mainDescription: string;
                    examples: string;
                }
            };
            generalSettingsStep: {
                title: string;
                identifier: {
                    label: string;
                    hint: string;
                    placeholder: string;
                    validations: {
                        empty: string
                        invalid: string
                    };
                };
                displayName: {
                    label: string;
                    placeholder: string;
                    hint: string;
                    validations: {
                        empty: string
                        invalid: string
                    };
                };
                helpPanel: {
                    identifier: {
                        header: string;
                        description: string;
                        hint: string;
                        warning: string;
                    };
                    displayName: {
                        header: string;
                        description: string;
                        hint: string;
                    };
                };
            };
            configurationsStep: {
                title: string;
                endpoint: {
                    label: string;
                    placeholder: string;
                    hint: string;
                    validations: {
                        empty: string;
                        invalid: string;
                        general: string;
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
                        }
                    };
                    validations: {
                        required: string;
                    };
                }
            }
        };
    };
};
