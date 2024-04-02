/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import React from "react";
import "@testing-library/jest-dom";
import { fullPermissions } from "./__mocks__/permissions";
import { render, screen } from "../../../../test-configs/utils";
import DuplicateSocialAuthenticatorSelectionModal, {
    DuplicateSocialAuthenticatorSelectionModalPropsInterface
} from "../duplicate-social-authenticator-selection-modal";

describe("DuplicateSocialAuthenticatorSelectionModal", () => {
    /* eslint-disable max-len, sort-keys */
    const defaultProps: DuplicateSocialAuthenticatorSelectionModalPropsInterface = {
        authenticators: [
            {
                "authenticators":[
                    {
                        "authenticatorId":"RmFjZWJvb2tBdXRoZW50aWNhdG9y",
                        "name":"FacebookAuthenticator",
                        "isEnabled":true,
                        "tags":[
                            "Social-Login"
                        ]
                    }
                ],
                "defaultAuthenticator":{
                    "authenticatorId":"RmFjZWJvb2tBdXRoZW50aWNhdG9y",
                    "name":"FacebookAuthenticator",
                    "isEnabled":true,
                    "tags":[
                        "Social-Login"
                    ]
                },
                "description":"Login users with existing Facebook accounts.",
                "displayName":"FB",
                "id":"61fa094e-sdsd-4a7c-a9c4-604c3a09906d",
                "idp":"FB",
                "image":"https://dev.console.asgardeo.io/app/libs/themes/default/assets/images/identity-providers/facebook-idp-illustration.svg",
                "isEnabled":true,
                "name":"FB"
            }
        ],
        authenticatorCategoryDisplayName: "Facebook",
        onSelect: jest.fn()
    };
    /* eslint-enable max-len */

    it("renders the DuplicateSocialAuthenticatorSelectionModal component", () => {
        render(<DuplicateSocialAuthenticatorSelectionModal { ...defaultProps } />, { allowedScopes: fullPermissions });

        const duplicateSocialAuthenticatorSelectionModal: Element = screen.getByTestId(
            "duplicate-social-authenticator-selection-modal"
        );

        expect(duplicateSocialAuthenticatorSelectionModal).toBeInTheDocument();
    });
});
