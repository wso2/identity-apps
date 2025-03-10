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

import UserPreferenceProvider from "@wso2is/common.ui.v1/providers/user-preferences-provider";
import { render, screen } from "@wso2is/unit-testing/utils";
import React from "react";
import "@testing-library/jest-dom";
import { fullPermissions } from "./__mocks__/permissions";
import UIConfigProvider from "../../../admin.core.v1/providers/ui-config-provider";
import AuthenticationFlowProvider from "../../providers/authentication-flow-provider";
import AuthenticationFlowBuilder, { AuthenticationFlowBuilderPropsInterface } from "../authentication-flow-builder";

/**
 * Running this spec throws error `Unable to find an element by: [data-componentid="authentication-flow-builder"]`
 * Hence skipped until fixed.
 *
 * It appears that the Oxygen UI Box component in the <AuthenticationFlowBuilder /> is not being
 * rendered by jsdom for some reason. This issue does not occur when the Box component is imported
 * from "mui/material".
 *
 * Tracked with https://github.com/wso2/product-is/issues/20519
 */
describe.skip("AuthenticationFlowBuilder", () => {
    const defaultProps: AuthenticationFlowBuilderPropsInterface = {
        legacyBuilder: <div>Legacy Builder</div>,
        onIDPCreateWizardTrigger: jest.fn()
    };

    it("renders the AuthenticationFlowBuilder component", () => {
        render(
            <UIConfigProvider>
                <UserPreferenceProvider userId="">
                    <AuthenticationFlowProvider
                        application={ {
                            name: "Sample App"
                        } }
                        isSystemApplication={ false }
                        authenticators={ [] }
                        hiddenAuthenticators={ [] }
                        onAuthenticatorsRefetch={ jest.fn() }
                        onUpdate={ jest.fn() }
                        isLoading={ false }
                        readOnly={ false }
                        authenticationSequence={ {} }
                    >
                        <AuthenticationFlowBuilder { ...defaultProps } />
                    </AuthenticationFlowProvider>
                </UserPreferenceProvider>
            </UIConfigProvider>
            , { allowedScopes: fullPermissions });

        const authenticationFlowBuilder: Element = screen.getByTestId("authentication-flow-builder");

        expect(authenticationFlowBuilder).toBeInTheDocument();
    });
});
