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

/**
 * Interface for the account recovery section documentation structure.
 */
interface AccountRecoveryDocumentationLinksInterface {
    passwordRecovery: {
        learnMore: string;
    }
}

/**
 * Interface for the account security section documentation structure.
 */
interface AccountSecurityDocumentationLinksInterface {
    undefined;
}

/**
 * Interface for the applications section documentation structure.
 */
interface ApplicationsDocumentationLinksInterface {
    learnMore: string;
    editApplication: {
        common: {
            signInMethod: {
                learnMore: string;
                conditionalAuthenticaion: {
                    apiReference: string;
                    learnMore: string;
                    template: {
                        deviceBased: {
                            learnMore: string;
                        }
                        groupBased: {
                            learnMore: string;
                        }
                        ipBased: {
                            learnMore: string;
                        }
                        userAgeBased: {
                            learnMore: string;
                        }
                    }
                }
            }
        }
        oidcApplication: {
            advanced: {
                learnMore: string;
            }
            attributes: {
                learnMore: string;
            }
            info: {
                learnMore: string;
            }
            protocol: {
                learnMore: string;
            }
        }
        samlpApplication: {
            advanced: {
                learnMore: string;
            }
            attributes: {
                learnMore: string;
            }
            info: {
                learnMore: string;
            }
            protocol: {
                learnMore: string;
            }
        }
    }
    newApplication: {
        oidcApplication: {
            learnMore: string;
        }
        samlApplication: {
            learnMore: string;
        }
        singlePageApplication: {
            learnMore: string;
        }
    }
}

/**
 * Interface for the attributes section documentation structure.
 */
interface AttributesDocumentationLinksInterface {
    attributes: {
        learnMore: string;
    }
    oidcAttributes: {
        learnMore: string;
    }
    scimAttributes: {
        learnMore: string;
    }
}

/**
 * Interface for the common documentation structure.
 */
interface CommonDocumentationLinksInterface {
    docsHomePage: string;
}

/**
 * Interface for the connections section documentation structure.
 */
interface ConnectionsDocumentationLinksInterface {
    learnMore: string;
    newConnection: {
        learnMore: string;
        enterprise: {
            oidcLearnMore: string;
            samlLearnMore: string;
        }
        facebook: {
            learnMore: string;
        }
        github: {
            learnMore: string;
        }
        google: {
            learnMore: string;
        }
    }
}

/**
 * Interface for the groups section documentation structure.
 */
interface GroupsDocumentationLinksInterface {
    learnMore: string;
}

/**
 * Interface for the scopes section documentation structure.
 */
interface ScopesDocumentationLinksInterface {
    undefined;
}

/**
 * Interface for the self registration section documentation structure.
 */
interface SelfRegistrationDocumentationLinksInterface {
    learnMore: string;
}

/**
 * Interface for the users section documentation structure.
 */
interface UsersDocumentationLinksInterface {
    allUsers: {
        learnMore: string;
    }
    collaboratorAccounts: {
        learnMore: string;
        roles: {
            learnMore: string;
        }
    }
    customerAccounts: {
        learnMore: string;
    }
    newCollaboratorUser: {
        learnMore: string;
    }
}

/**
 * Interface for the console documentation structure.
 */
export interface ConsoleDocumentationLinksInterface {
    /**
     * Documentation links for common elements.
     */
    common: CommonDocumentationLinksInterface;
    /**
     * Documentation links for develop section elements.
     */
    develop: {
        /**
         * Documentation links for applications section elements.
         */
        applications: ApplicationsDocumentationLinksInterface;
        /**
         * Documentation links for connections section elements.
         */
        connections: ConnectionsDocumentationLinksInterface;
    }
    /**
     * Documentation links for manage section elements.
     */
    manage: {
        /**
         * Documentation links for account recovery elements.
         */
        accountRecovery: AccountRecoveryDocumentationLinksInterface;
        /**
         * Documentation links for account security elements.
         */
        accountSecurity: AccountSecurityDocumentationLinksInterface;
        /**
        * Documentation links for attributes section elements.
        */
        attributes: AttributesDocumentationLinksInterface;
        /**
        * Documentation links for groups section elements.
        */
        groups: GroupsDocumentationLinksInterface;
        /**
         * Documentation links for scopes section elements.
         */
        scopes: ScopesDocumentationLinksInterface;
        /**
        * Documentation links for self registration section elements.
        */
        selfRegistration: SelfRegistrationDocumentationLinksInterface;
        /**
        * Documentation links for users section elements.
        */
        users: UsersDocumentationLinksInterface;
    }
}

