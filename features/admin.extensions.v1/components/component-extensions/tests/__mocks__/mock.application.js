
/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
            "skipLoginConsent": true,
            "skipLogoutConsent": true,
            "returnAuthenticatedIdpList": false,
            "enableAuthorization": false
        },
        "provisioningConfigurations": {
            "outboundProvisioningIdps": []
        }
    }
}
