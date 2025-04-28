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

export interface actionsNS {
    buttons: {
        addCertificate: string;
        cancel: string;
        changeAuthentication: string;
        create: string;
        update: string;
    };
    certificateDeleteConfirmationModal: {
        assertionHint: string;
        content: string;
        header: string;
        message: string;
        primaryAction: string;
        secondaryAction: string;
    },
    certificateWizard: {
        add : {
            heading: "Add New Certificate",
            subHeading: "Add new certificate to the action"
        },
        change : {
            heading: string;
            subHeading: string;
        }
    },
    confirmationModal: {
        header: string;
        message: string;
        content: string;
        assertionHint: string;
    };
    dangerZoneGroup: {
        header: string;
        revertConfig: {
            heading: string;
            subHeading: string;
            actionTitle: string;
        };
    };
    fields: {
        authentication: {
            info: {
                message: string;
                title: {
                    noneAuthType: string;
                    otherAuthType: string;
                };
            };
            label: string;
            types: {
                apiKey: {
                    name: string;
                    properties: {
                        header: {
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string
                                invalid: string
                            };
                        };
                        value: {
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
                bearer: {
                    name: string;
                    properties: {
                        accessToken: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string
                            };
                        };
                    };
                };
                none: {
                    name: string;
                };
            };
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
        endpoint: {
            hint: string;
            label: string;
            placeholder: string;
            validations: {
                empty: string;
                invalidUrl: string;
                notHttps: string;
            };
        };
        name: {
            hint: string;
            label: string;
            placeholder: string;
            validations: {
                empty: string;
                invalid: string;
            };
        };
        passwordSharing: {
            label: string;
            certificate: {
                label: string;
                info: {
                    header: string;
                    description: string;
                },
                icon: {
                    changecertificate : string;
                    viewcertificate: string;
                    deletecertificate: string;
                }
            },
            format: {
                label: string;
                placeholder: string;
                validations: string;
            }
        }
        rules: {
            button: string;
            info: {
                title: string;
                message: {
                    preIssueAccessToken: string;
                    preUpdatePassword: string;
                }
            };
            label: string;
        };
        userAttributes: {
            error: {
                limitReached: string;
            };
            heading: string;
            hint: string;
            search: {
                placeholder: string;
                clearButton: string;
            };
        };
    };
    goBackActions: string,
    notification: {
        error: {
            activate: {
                description: string;
                message: string;
            };
            create: {
                description: string;
                message: string;
            };
            deactivate: {
                description: string;
                message: string;
            };
            delete: {
                description: string;
                message: string;
            };
            fetchById: {
                description: string;
                message: string;
            };
            fetchByType: {
                description: string;
                message: string;
            };
            typesFetch: {
                description: string;
                message: string;
            };
            update: {
                description: string;
                message: string;
            };
            certificate: {
                add : {
                    description: string;
                    message: string;
                };
                change: {
                    description: string;
                    message : string;
                };
                delete: {
                    description: string;
                    message: string;
                };
            };
        };
        genericError: {
            activate: {
                description: string;
                message: string;
            };
            create: {
                description: string;
                message: string;
            };
            deactivate: {
                description: string;
                message: string;
            };
            delete: {
                description: string;
                message: string;
            };
            fetchById: {
                description: string;
                message: string;
            };
            fetchByType: {
                description: string;
                message: string;
            };
            typesFetch: {
                description: string;
                message: string;
            };
            update: {
                description:  string;
                message: string;
            };
            certificate: {
                add : {
                    description: string;
                    message: string;
                };
                change: {
                    description: string;
                    message : string;
                };
                delete: {
                    description: string;
                    message: string;
                };
            };
            userAttributes: {
                getAttributes: {
                    description: string;
                    message: string;
                };
            };
        };
        success: {
            activate: {
                description: string;
                message: string;
            };
            create: {
                description: string;
                message: string;
            };
            deactivate: {
                description: string;
                message: string;
            };
            delete: {
                description: string;
                message: string;
            };
            update: {
                description: string;
                message: string;
            };
            certificate: {
                add : {
                    description: string;
                    message: string;
                },
                change: {
                    description: string;
                    message : string;
                },
                delete: {
                    description: string;
                    message: string;
                }
            };
        };
    };
    status: {
        active: string;
        configured: string;
        inactive: string;
        notConfigured: string;
    };
    types: {
        preIssueAccessToken: {
            description: {
                expanded: string;
                shortened: string;
            };
            heading: string;
        };
        preRegistration: {
            description: {
                expanded: string;
                shortened: string;
            };
            heading: string;
        };
        preUpdatePassword: {
            description: {
                expanded: string;
                shortened: string;
            };
            heading: string;
        };
        preUpdateProfile: {
            description: {
                expanded: string;
                shortened: string;
            };
            heading: string;
        };
    };
}
