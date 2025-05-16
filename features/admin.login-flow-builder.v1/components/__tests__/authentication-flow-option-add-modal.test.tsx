/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import DeploymentConfigProvider from "@wso2is/admin.core.v1/providers/deployment-config-provider";
import ResourceEndpointsProvider from "@wso2is/admin.core.v1/providers/resource-enpoints-provider";
import UserPreferenceProvider from "@wso2is/common.ui.v1/providers/user-preferences-provider";
import { render, screen } from "@wso2is/unit-testing/utils";
import React from "react";
import "@testing-library/jest-dom";
import { fullPermissions } from "./__mocks__/permissions";
import AuthenticationFlowOptionAddModal, {
    AuthenticationFlowOptionAddModalPropsInterface
} from "../authentication-flow-option-add-modal";

jest.mock("@wso2is/admin.connections.v1/api/use-get-connection-templates", () => (
    {
        useGetConnectionTemplates: () => ([
            {
                "id": "google-idp",
                "name": "Google",
                "description": "Login users with existing Google accounts.",
                "image": "assets/images/logos/google.svg",
                "displayOrder": 1,
                "tags": [
                    "Social-Login",
                    "APIAuth"
                ],
                "category": "DEFAULT",
                "type": "connections",
                "self": "/api/server/v1/extensions/connections/google-idp"
            },
            {
                "id": "microsoft-idp",
                "name": "Microsoft",
                "description": "Enable login for users with existing Microsoft accounts.",
                "image": "assets/images/logos/microsoft.svg",
                "displayOrder": 2,
                "tags": [
                    "Social-Login",
                    "APIAuth"
                ],
                "category": "DEFAULT",
                "type": "connections",
                "self": "/api/server/v1/extensions/connections/microsoft-idp"
            },
            {
                "id": "facebook-idp",
                "name": "Facebook",
                "description": "Login users with existing Facebook accounts.",
                "image": "assets/images/logos/facebook.svg",
                "displayOrder": 3,
                "tags": [
                    "Social-Login",
                    "APIAuth"
                ],
                "category": "DEFAULT",
                "type": "connections",
                "self": "/api/server/v1/extensions/connections/facebook-idp"
            },
            {
                "id": "github-idp",
                "name": "GitHub",
                "description": "Login users with existing GitHub accounts.",
                "image": "assets/images/logos/github.svg",
                "displayOrder": 4,
                "tags": [
                    "Social-Login",
                    "APIAuth"
                ],
                "category": "DEFAULT",
                "type": "connections",
                "self": "/api/server/v1/extensions/connections/github-idp"
            },
            {
                "id": "apple-idp",
                "name": "Apple",
                "description": "Login users with their Apple IDs.",
                "image": "assets/images/logos/apple.svg",
                "displayOrder": 5,
                "tags": [
                    "Social-Login"
                ],
                "category": "DEFAULT",
                "type": "connections",
                "self": "/api/server/v1/extensions/connections/apple-idp"
            },
            {
                "category": "DEFAULT",
                // eslint-disable-next-line max-len
                "description": "Enable login for users with their accounts in your existing identity providers via standard authentication protocols.",
                "enabled": true,
                "displayOrder": 7,
                "id": "enterprise-protocols",
                "docLink": "/guides/authentication/enterprise-login/",
                "image": "assets/images/logos/enterprise.svg",
                "name": "Enterprise",
                "services": [],
                "disabled": false,
                "type": "ENTERPRISE",
                "tags": [
                    "OIDC",
                    "SAML"
                ],
                "templateId": "enterprise-idp"
            },
            {
                "id": "expert-mode-idp",
                "name": "Expert Mode",
                "description": "Create a new Connection with minimum configurations.",
                "image": "assets/images/logos/expert.svg",
                "displayOrder": 11,
                "tags": [],
                "category": "DEFAULT",
                "type": "connections",
                "self": "/api/server/v1/extensions/connections/expert-mode-idp"
            }
        ])
    }
));

describe("AuthenticationFlowOptionAddModal", () => {
    const defaultProps: AuthenticationFlowOptionAddModalPropsInterface = {
        open: true
    };

    it("renders the AuthenticationFlowOptionAddModal component", () => {
        render(
            <UserPreferenceProvider userId="">
                <DeploymentConfigProvider>
                    <ResourceEndpointsProvider>
                        <AuthenticationFlowOptionAddModal { ...defaultProps } />
                    </ResourceEndpointsProvider>
                </DeploymentConfigProvider>
            </UserPreferenceProvider>
            , { allowedScopes: fullPermissions });

        const authenticationFlowOptionAddModal: Element = screen.getByTestId("authentication-flow-option-add-modal");

        expect(authenticationFlowOptionAddModal).toBeInTheDocument();
    });
});
