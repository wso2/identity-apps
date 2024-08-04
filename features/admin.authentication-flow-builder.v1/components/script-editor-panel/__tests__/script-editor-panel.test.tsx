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

import ResourceEndpointsProvider from "@wso2is/admin.core.v1/providers/resource-enpoints-provider";
import UserPreferenceProvider from "@wso2is/admin.core.v1/providers/user-preferences-provider";
import { render, screen } from "@wso2is/unit-testing/utils";
import React from "react";
import "@testing-library/jest-dom";
import { fullPermissions } from "./__mocks__/permissions";
import AuthenticationFlowProvider from "../../../providers/authentication-flow-provider";
import ScriptEditorPanel, {
    ScriptEditorPanelPropsInterface
} from "../script-editor-panel";

/**
 * Rendering ScriptEditor inside the editor panel causes JSDOM to
 * not render the entire ScriptEditorPanel component.
 */
describe.skip("ScriptEditorPanel", () => {
    const defaultProps: ScriptEditorPanelPropsInterface = {};

    it("renders the ScriptEditorPanel component", () => {
        render(
            <ResourceEndpointsProvider>
                <UserPreferenceProvider>
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
                        <ScriptEditorPanel { ...defaultProps } />
                    </AuthenticationFlowProvider>
                </UserPreferenceProvider>
            </ResourceEndpointsProvider>

            , { allowedScopes: fullPermissions });

        const scriptEditorPanel: Element = screen.getByTestId("script-editor-panel");

        expect(scriptEditorPanel).toBeInTheDocument();
    });
});
