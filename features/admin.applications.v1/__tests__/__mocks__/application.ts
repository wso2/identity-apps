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

import { RoleAudienceTypes } from "@wso2is/admin.roles.v2/constants";
import { ApplicationAccessTypes, ApplicationInterface, ApplicationListInterface } from "../../models";

export const applicationListMockResponse: ApplicationListInterface = {
    applications: [
        {
            access: ApplicationAccessTypes.WRITE,
            advancedConfigurations: {
                additionalSpProperties: [
                    {
                        displayName: "Is B2B Self Service Application",
                        name: "isB2BSelfServiceApp",
                        value: "false"
                    }
                ],
                attestationMetaData: {
                    enableClientAttestation: false
                },
                discoverableByEndUsers: false,
                enableAPIBasedAuthentication: false,
                enableAuthorization: false,
                fragment: false,
                returnAuthenticatedIdpList: false,
                saas: false,
                skipLoginConsent: false,
                skipLogoutConsent: true
            },
            clientId: "kcn1kuV1yiZbaDofF2Xfg4jUpsUa",
            id: "142fbbc0-69b8-4f3d-a647-adecc9f29804",
            issuer: "",
            name: "Sample salesforce SSO app",
            realm: "",
            self: "/api/server/v1/applications/142fbbc0-69b8-4f3d-a647-adecc9f29804",
            templateId: "salesforce"
        },
        {
            access: ApplicationAccessTypes.WRITE,
            advancedConfigurations: {
                additionalSpProperties: [
                    {
                        displayName: "Is B2B Self Service Application",
                        name: "isB2BSelfServiceApp",
                        value: "false"
                    }
                ],
                attestationMetaData: {
                    enableClientAttestation: false
                },
                discoverableByEndUsers: false,
                enableAPIBasedAuthentication: false,
                enableAuthorization: false,
                fragment: false,
                returnAuthenticatedIdpList: false,
                saas: false,
                skipLoginConsent: true,
                skipLogoutConsent: true
            },
            clientId: "Y4LmFp5bwqvylijALgOCYPGvlTMa",
            id: "c3a3d3ce-4166-416a-963a-94e1c1c8de5f",
            issuer: "",
            name: "SPA",
            realm: "",
            self: "/api/server/v1/applications/c3a3d3ce-4166-416a-963a-94e1c1c8de5f",
            templateId: "6a90e4b0-fbff-42d7-bfde-1efd98f07cd7"
        }
    ],
    count: 2,
    links: [],
    startIndex: 1,
    totalResults: 2
};

export const applicationSearchListMockResponse: ApplicationListInterface = {
    applications: [
        {
            access: ApplicationAccessTypes.WRITE,
            advancedConfigurations: {
                additionalSpProperties: [
                    {
                        displayName: "Is B2B Self Service Application",
                        name: "isB2BSelfServiceApp",
                        value: "false"
                    }
                ],
                attestationMetaData: {
                    enableClientAttestation: false
                },
                discoverableByEndUsers: false,
                enableAPIBasedAuthentication: false,
                enableAuthorization: false,
                fragment: false,
                returnAuthenticatedIdpList: false,
                saas: false,
                skipLoginConsent: false,
                skipLogoutConsent: true
            },
            clientId: "kcn1kuV1yiZbaDofF2Xfg4jUpsUa",
            id: "142fbbc0-69b8-4f3d-a647-adecc9f29804",
            issuer: "",
            name: "Salesforce",
            realm: "",
            self: "/api/server/v1/applications/142fbbc0-69b8-4f3d-a647-adecc9f29804",
            templateId: "salesforce"
        }
    ],
    count: 1,
    links: [],
    startIndex: 1,
    totalResults: 1
};

export const applicationMockResponse: ApplicationInterface = {
    access: ApplicationAccessTypes.WRITE,
    advancedConfigurations: {
        additionalSpProperties: [
            {
                displayName: "Is B2B Self Service Application",
                name: "isB2BSelfServiceApp",
                value: "false"
            }
        ],
        attestationMetaData: {
            androidPackageName: "",
            appleAppId: "",
            enableClientAttestation: false
        },
        discoverableByEndUsers: false,
        enableAPIBasedAuthentication: false,
        enableAuthorization: false,
        fragment: false,
        returnAuthenticatedIdpList: false,
        saas: false,
        skipLoginConsent: false,
        skipLogoutConsent: true
    },
    associatedRoles: {
        allowedAudience: RoleAudienceTypes.ORGANIZATION,
        roles: []
    },
    authenticationSequence: {
        attributeStepId: 1,
        requestPathAuthenticators: [],
        steps: [
            {
                id: 1,
                options: [
                    {
                        authenticator: "BasicAuthenticator",
                        idp: "LOCAL"
                    }
                ]
            }
        ],
        subjectStepId: 1,
        type: "DEFAULT"
    },
    claimConfiguration: {
        claimMappings: [
            {
                applicationClaim: "http://wso2.org/claims/username",
                localClaim: {
                    uri: "http://wso2.org/claims/username"
                }
            }
        ],
        dialect: "LOCAL",
        requestedClaims: [
            {
                claim: {
                    uri: "http://wso2.org/claims/username"
                },
                mandatory: false
            }
        ],
        role: {
            claim: {
                uri: "http://wso2.org/claims/role"
            },
            includeUserDomain: true,
            mappings: []
        },
        subject: {
            claim: {
                uri: "http://wso2.org/claims/userid"
            },
            includeTenantDomain: false,
            includeUserDomain: false,
            mappedLocalSubjectMandatory: false,
            useMappedLocalSubject: false
        }
    },
    clientId: "kcn1kuV1yfZbaDofF2Xfg4jUpsUa",
    id: "142fbbc0-69b8-4f3d-a6a7-adecc9f29804",
    inboundProtocols: [
        {
            self: "/api/server/v1/applications/142fbbc0-69b8-4f3d-a6a7-adecc9f29804/inbound-protocols/oidc",
            type: "oauth2"
        }
    ],
    isManagementApp: false,
    issuer: "",
    name: "Salesforce",
    provisioningConfigurations: {
        outboundProvisioningIdps: []
    },
    realm: "",
    templateId: "salesforce"
};

export const spaApplicationMockResponse: ApplicationInterface = {
    access: ApplicationAccessTypes.WRITE,
    advancedConfigurations: {
        additionalSpProperties: [
            {
                displayName: "Is B2B Self Service Application",
                name: "isB2BSelfServiceApp",
                value: "false"
            }
        ],
        attestationMetaData: {
            androidPackageName: "",
            appleAppId: "",
            enableClientAttestation: false
        },
        discoverableByEndUsers: false,
        enableAPIBasedAuthentication: false,
        enableAuthorization: false,
        fragment: false,
        returnAuthenticatedIdpList: false,
        saas: false,
        skipLoginConsent: true,
        skipLogoutConsent: true
    },
    associatedRoles: {
        allowedAudience: RoleAudienceTypes.ORGANIZATION,
        roles: []
    },
    authenticationSequence: {
        attributeStepId: 1,
        requestPathAuthenticators: [],
        steps: [
            {
                id: 1,
                options: [
                    {
                        authenticator: "BasicAuthenticator",
                        idp: "LOCAL"
                    }
                ]
            }
        ],
        subjectStepId: 1,
        type: "DEFAULT"
    },
    claimConfiguration: {
        claimMappings: [
            {
                applicationClaim: "http://wso2.org/claims/username",
                localClaim: {
                    uri: "http://wso2.org/claims/username"
                }
            }
        ],
        dialect: "LOCAL",
        requestedClaims: [
            {
                claim: {
                    uri: "http://wso2.org/claims/username"
                },
                mandatory: false
            }
        ],
        role: {
            claim: {
                uri: "http://wso2.org/claims/role"
            },
            includeUserDomain: true,
            mappings: []
        },
        subject: {
            claim: {
                uri: "http://wso2.org/claims/userid"
            },
            includeTenantDomain: false,
            includeUserDomain: false,
            mappedLocalSubjectMandatory: false,
            useMappedLocalSubject: false
        }
    },
    clientId: "Y4LmFp5bwqvylgjALgOCYPGvlTMa",
    id: "c3a3d3ce-4166-4e6a-963a-94e1c1c8de5f",
    inboundProtocols: [
        {
            self: "/api/server/v1/applications/c3a3d3ce-4166-4e6a-963a-94e1c1c8de5f/inbound-protocols/oidc",
            type: "oauth2"
        }
    ],
    isManagementApp: false,
    issuer: "",
    name: "SPA",
    provisioningConfigurations: {
        outboundProvisioningIdps: []
    },
    realm: "",
    templateId: "6a90e4b0-fbff-42d7-bfde-1efd98f07cd7"
};
