/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { ConsoleDocumentationLinksInterface } from "@wso2is/react-components/src/components/documentation/models";

const documentationLinks: ConsoleDocumentationLinksInterface = {
    common: {
        docsHomePage: "this is a test"
    },
    develop: {
        applications: {
            editApplication: {
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
                    }
                },
                samlpApplication: {
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
                    }
                }
            },
            learnMore: undefined,
            newApplication: {
                oidcApplication: {
                    learnMore: undefined
                },
                samlApplication: {
                    learnMore: undefined
                },
                singlePageApplication: {
                    learnMore: undefined
                }
            }
        },
        connections: {
            learnMore: undefined,
            newConnection: {
                enterprise: {
                    oidcLearnMore: undefined,
                    samlLearnMore: undefined
                },
                facebook: {
                    learnMore: undefined
                },
                github: {
                    learnMore: undefined
                },
                google: {
                    learnMore: undefined
                },
                learnMore: undefined
            }
        }
    },
    manage: {
        accountRecovery: {
            passwordRecovery: {
                learnMore: undefined
            }
        },
        accountSecurity: {
            undefined
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
            learnMore: undefined
        },
        scopes: {
            undefined
        },
        selfRegistration: {
            learnMore: undefined
        },
        users: {
            allUsers: {
                learnMore: undefined
            },
            collaboratorAccounts: {
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
        }
    }
};

export default documentationLinks;

