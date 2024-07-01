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

/* eslint-disable sort-keys */

import UIConfigProvider from "@wso2is/admin.core.v1/providers/ui-config-provider";
import React from "react";
import { render, screen } from "../../../../test-configs/utils";
import { RoleGroupsList } from "../edit-role-groups";

jest.mock("@wso2is/admin.identity-providers.v1/api/identity-provider", () => (
    {
        useIdentityProviderList: () => ({
            data: {
                "totalResults": 4,
                "startIndex": 1,
                "count": 2,
                "links": [],
                "identityProviders": [
                    {
                        "id": "2657ea7b-b0ba-42be-ba53-1e72c935b1ac",
                        "name": "Google",
                        "description": "Login users with existing Google accounts.",
                        "isEnabled": true,
                        "image": "assets/images/logos/google.svg",
                        "self": "/t/org19418/api/server/v1/identity-providers/2657ea7b-b0ba-42be-ba53-1e72c935b1ac",
                        "groups": [],
                        "federatedAuthenticators": {
                            "defaultAuthenticatorId": "R29vZ2xlT0lEQ0F1dGhlbnRpY2F0b3I",
                            "authenticators": [
                                {
                                    "authenticatorId": "R29vZ2xlT0lEQ0F1dGhlbnRpY2F0b3I",
                                    "name": "GoogleOIDCAuthenticator",
                                    "isEnabled": true,
                                    "tags": [
                                        "Social-Login",
                                        "APIAuth"
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        "id": "e577dcf1-1601-4f66-b5a7-d8bf90dd08b1",
                        "name": "oidc",
                        "description": "Authenticate users with Enterprise OIDC connections.",
                        "isEnabled": true,
                        "image": "assets/images/logos/enterprise.svg",
                        "self": "/t/org19418/api/server/v1/identity-providers/e577dcf1-1601-4f66-b5a7-d8bf90dd08b1",
                        "groups": [
                            {
                                "name": "testgroup",
                                "id": "5613b97d-6ec8-4cb9-aaa2-50ebd1456634"
                            }
                        ],
                        "federatedAuthenticators": {
                            "defaultAuthenticatorId": "T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I",
                            "authenticators": [
                                {
                                    "authenticatorId": "T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I",
                                    "name": "OpenIDConnectAuthenticator",
                                    "isEnabled": true,
                                    "tags": [
                                        "OIDC",
                                        "APIAuth"
                                    ]
                                }
                            ]
                        }
                    }
                ]
            },
            error: undefined,
            isValidating: false,
            mutate: jest.fn()
        })
    }
));

jest.mock("@wso2is/admin.applications.v1/api/use-get-application", () => ({
    useGetApplication: () => ({
        data: {
            "id": "d04e18f0-a1c5-4966-b4fb-7d9e1b57c011",
            "name": "test-app",
            "clientId": "5EH0OJBCy9HsyZUqDWivx8ox1g8a",
            "associatedRoles": {
                "allowedAudience": "APPLICATION",
                "roles": [
                    {
                        "id": "01eec29e-5151-1ca6-b071-459e0cb95e58",
                        "name": "role"
                    }
                ]
            },
            "authenticationSequence": {
                "type": "USER_DEFINED",
                "steps": [
                    {
                        "id": 1,
                        "options": [
                            {
                                "idp": "Google",
                                "authenticator": "GoogleOIDCAuthenticator"
                            },
                            {
                                "idp": "SSO",
                                "authenticator": "OrganizationAuthenticator"
                            },
                            {
                                "idp": "LOCAL",
                                "authenticator": "BasicAuthenticator"
                            }
                        ]
                    },
                    {
                        "id": 2,
                        "options": [
                            {
                                "idp": "oidc",
                                "authenticator": "OpenIDConnectAuthenticator"
                            }
                        ]
                    }
                ],
                "requestPathAuthenticators": [],
                "script": "var onLoginRequest = function(context) {\n    executeStep(1);\n    executeStep(2);\n};\n",
                "subjectStepId": 1,
                "attributeStepId": 1
            }
        },
        isLoading: false,
        error: undefined
    })
}));

describe("Groups tab of the role edit view", () => {
    it("Only the identity providers with groups configured are displayed", () => {
        render(
            <UIConfigProvider>
                <RoleGroupsList
                    role={ {
                        "associatedApplications": [
                            {
                                "value": "d04e18f0-a1c5-4966-b4fb-7d9e1b57c011"
                            }
                        ],
                        "audience": {
                            "display": "test-app",
                            "type": "application",
                            "value": "d04e18f0-a1c5-4966-b4fb-7d9e1b57c011"
                        },
                        "displayName": "role",
                        "id": "01eec29e-5151-1ca6-b071-459e0cb95e58",
                        "permissions": []
                    } }
                    onRoleUpdate={ jest.fn() }
                    isReadOnly={ false }
                    tabIndex={ 2 }
                />
            </UIConfigProvider>
        );

        const groupItems: HTMLElement[] = screen.getAllByTestId("edit-role-federated-group-configure-item");

        expect(groupItems.length).toBe(1);
    });
});
