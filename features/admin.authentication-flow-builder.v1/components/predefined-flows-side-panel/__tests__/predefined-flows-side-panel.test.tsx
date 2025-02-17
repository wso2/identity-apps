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

import DeploymentConfigProvider from "@wso2is/admin.core.v1/providers/deployment-config-provider";
import ResourceEndpointsProvider from "@wso2is/admin.core.v1/providers/resource-enpoints-provider";
import UserPreferencesProvider from "@wso2is/common.ui.v1/providers/user-preferences-provider";
import { render, screen } from "@wso2is/unit-testing/utils";
import React from "react";
import "@testing-library/jest-dom";
import { fullPermissions } from "./__mocks__/permissions";
import AuthenticationFlowProvider from "../../../providers/authentication-flow-provider";
import PredefinedFlowsSidePanel, {
    PredefinedFlowsSidePanelPropsInterface
} from "../predefined-flows-side-panel";

describe.skip("PredefinedFlowsSidePanel", () => {
    const defaultProps: PredefinedFlowsSidePanelPropsInterface = {
        onAdaptiveAuthTemplateChange: jest.fn(),
        showAdaptiveLoginTemplates: true,
        showBasicLoginTemplates: true
    };

    it("renders the PredefinedFlowsSidePanel component", () => {
        render(
            <ResourceEndpointsProvider>
                <DeploymentConfigProvider>
                    <UserPreferencesProvider>
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
                            <PredefinedFlowsSidePanel { ...defaultProps } />
                        </AuthenticationFlowProvider>
                    </UserPreferencesProvider>
                </DeploymentConfigProvider>
            </ResourceEndpointsProvider>
            , { allowedScopes: fullPermissions });

        const predefinedFlowsSidePanel: Element = screen.getByTestId(
            "predefined-flows-side-panel"
        );

        expect(predefinedFlowsSidePanel).toBeInTheDocument();
    });
});
