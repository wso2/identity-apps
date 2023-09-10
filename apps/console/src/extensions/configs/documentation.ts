/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { DocumentationLinksExtensionInterface } from "./models/documentation";
import { Config } from "../../features/core/configs/app";

export const getDocumentationLinksExtension = () : DocumentationLinksExtensionInterface => {
    const documentationBaseUrl: string = Config?.getDeploymentConfig()?.docSiteURL;

    return {
        common: {
            docsHomePage: documentationBaseUrl
        },
        develop: {
            apiResources: {
                addAPIResource: {
                    rbacInfoBox: {
                        learnMore: undefined
                    },
                    requiredAuthorization: {
                        learnMore: undefined
                    }
                },
                learnMore: undefined
            },
            applications: {
                apiAuthorization: {
                    learnMore: undefined,
                    policies: {
                        noPolicy: {
                            learnMore: undefined
                        },
                        rbac: {
                            learnMore: undefined
                        }
                    }
                },
                editApplication: {
                    asgardeoTryitApplication: {
                        general: {
                            learnMore: undefined
                        }
                    },
                    attributeManagement: {
                        manageOIDCScopes: undefined
                    },
                    common: {
                        signInMethod: {
                            conditionalAuthenticaion: {
                                apiReference: undefined,
                                learnMore: undefined,
                                template: {
                                    deviceBased: {
                                        learnMore: undefined
                                    },
                                    groupBased: {
                                        learnMore: undefined
                                    },
                                    ipBased: {
                                        learnMore: undefined
                                    },
                                    userAgeBased: {
                                        learnMore: undefined
                                    }
                                }
                            },
                            learnMore: undefined
                        }
                    },
                    oidcApplication: {
                        advanced: {
                            learnMore: undefined
                        },
                        attributes: {
                            learnMore: undefined
                        },
                        info: {
                            learnMore: undefined
                        },
                        protocol: {
                            learnMore: undefined
                        },
                        quickStart: {
                            applicationScopes: {
                                learnMore: undefined
                            },
                            customConfig: {
                                learnMore: undefined
                            },
                            mobileApp: {
                                learnMore: undefined
                            }
                        }
                    },
                    samlApplication: {
                        advanced: {
                            learnMore: undefined
                        },
                        attributes: {
                            learnMore: undefined
                        },
                        info: {
                            learnMore: undefined
                        },
                        protocol: {
                            learnMore: undefined
                        },
                        quickStart: {
                            customConfig: {
                                learnMore: undefined
                            }
                        }
                    },
                    signInMethod: {
                        fido: undefined
                    },
                    singlePageApplication: {
                        info: {
                            learnMore: undefined
                        },
                        quickStart: {
                            customConfig: {
                                learnMore: undefined
                            }
                        }
                    },
                    standardBasedApplication: {
                        oauth2OIDC: {
                            protocol: {
                                learnMore: undefined
                            }
                        },
                        saml: {
                            protocol: {
                                learnMore: undefined
                            }
                        }
                    }
                },
                learnMore: undefined,
                managementApplication: {
                    learnMore: undefined,
                    selfServicePortal: undefined
                },
                myaccount: {
                    learnMore: undefined,
                    smsOtp: undefined
                },
                newApplication: {
                    mobileApplication: {
                        learnMore: undefined
                    },
                    oidcApplication: {
                        learnMore: undefined
                    },
                    samlApplication: {
                        learnMore: undefined
                    },
                    singlePageApplication: {
                        learnMore: undefined
                    }
                },
                roles: {
                    learnMore: undefined
                }
            },
            branding: {
                learnMore: undefined
            },
            connections: {
                edit: {
                    advancedSettings: {
                        jit: undefined
                    },
                    quickStart: {
                        fido: {
                            learnMore: undefined
                        }
                    }
                },
                learnMore: undefined,
                newConnection: {
                    apple: {
                        learnMore: undefined,
                        setupGuide: undefined
                    },
                    enterprise: {
                        oidc: {
                            learnMore: undefined,
                            setupGuide: undefined
                        },
                        saml: {
                            learnMore: undefined,
                            setupGuide: undefined
                        }
                    },
                    facebook: {
                        learnMore: undefined,
                        setupGuide: undefined
                    },
                    github: {
                        learnMore: undefined,
                        setupGuide: undefined
                    },
                    google: {
                        learnMore: undefined,
                        setupGuide: undefined
                    },
                    hypr: {
                        learnMore: undefined,
                        setupGuide: undefined
                    },
                    learnMore: undefined,
                    microsoft: {
                        learnMore: undefined,
                        setupGuide: undefined
                    },
                    siwe: {
                        learnMore: undefined,
                        setupGuide: undefined
                    }
                }
            },
            emailCustomization: {
                form: {
                    emailBody: {
                        learnMore: undefined
                    }
                },
                learnMore: undefined
            },
            eventPublishing: {
                learnMore: undefined
            }
        },
        manage: {
            accountRecovery: {
                passwordRecovery: {
                    learnMore: undefined
                }
            },
            attributes: {
                attributes: {
                    learnMore: undefined
                },
                oidcAttributes: {
                    learnMore: undefined
                },
                scimAttributes: {
                    learnMore: undefined
                }
            },
            groups: {
                learnMore: undefined,
                roles: {
                    learnMore: undefined
                }
            },
            organizations: {
                learnMore: undefined
            },
            privateKeyJWT: {
                learnMore: undefined
            },
            selfRegistration: {
                learnMore: undefined
            },
            userStores: {
                attributeMappings: {
                    learnMore: undefined
                },
                createUserStore: {
                    learnMore: undefined
                },
                highAvailability: {
                    learnMore: undefined
                },
                userStoreProperties: {
                    learnMore: undefined
                },
                userStoresList: {
                    learnMore: undefined
                }
            },
            users: {
                allUsers: {
                    learnMore: undefined
                },
                collaboratorAccounts: {
                    adminSettingsLearnMore: undefined,
                    learnMore: undefined,
                    roles: {
                        learnMore: undefined
                    }
                },
                customerAccounts: {
                    learnMore: undefined
                },
                newCollaboratorUser: {
                    learnMore: undefined
                }
            },
            validation: {
                passwordValidation: {
                    learnMore: undefined
                }
            }
        }
    };
};
