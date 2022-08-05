
/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

// Note : Charachter limit is ignored since it's a mock response file.
module.exports = () => {
    return {
        "id": "08d07118-ab66-4341-90ff-8c7626b327ca",
        "name": "MobitelSelfCare",
        "description": "Front-end applications that consume REST APIs.",
        "templateId": "6a90e4b0-fbff-42d7-bfde-1efd98f07cd7",
        "claimConfiguration": {
            "dialect": "LOCAL",
            "claimMappings": [],
            "requestedClaims": [],
            "subject": {
                "claim": {
                    "uri": "http://wso2.org/claims/username"
                },
                "includeUserDomain": false,
                "includeTenantDomain": false,
                "useMappedLocalSubject": false
            },
            "role": {
                "includeUserDomain": true,
                "claim": {
                    "uri": "http://wso2.org/claims/role"
                }
            }
        },
        "inboundProtocols": [
            {
                "type": "oauth2",
                "self": "/t/carbon.super/api/server/v1/applications/08d07118-ab66-4341-90ff-8c7626b327ca/inbound-protocols/oidc"
            }
        ],
        "authenticationSequence": {
            "type": "DEFAULT",
            "steps": [
                {
                    "id": 1,
                    "options": [
                        {
                            "idp": "LOCAL",
                            "authenticator": "BasicAuthenticator"
                        }
                    ]
                }
            ],
            "requestPathAuthenticators": [],
            "subjectStepId": 1,
            "attributeStepId": 1
        },
        "advancedConfigurations": {
            "saas": false,
            "discoverableByEndUsers": false,
            "skipLoginConsent": false,
            "skipLogoutConsent": false,
            "returnAuthenticatedIdpList": false,
            "enableAuthorization": false
        },
        "provisioningConfigurations": {
            "outboundProvisioningIdps": []
        }
    }
}
