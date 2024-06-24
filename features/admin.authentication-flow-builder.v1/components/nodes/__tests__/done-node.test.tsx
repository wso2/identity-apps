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

import UIConfigProvider from "@wso2is/admin.core.v1/providers/ui-config-provider";
import UserPreferenceProvider from "@wso2is/admin.core.v1/providers/user-preferences-provider";
import { render, screen } from "@wso2is/unit-testing/utils";
import React from "react";
import "@testing-library/jest-dom";
import { ReactFlowProvider } from "reactflow";
import { fullPermissions } from "./__mocks__/permissions";
import AuthenticationFlowProvider from "../../../providers/authentication-flow-provider";
import DoneNode, { DoneNodePropsInterface } from "../done-node";

describe("DoneNode", () => {
    const defaultProps: DoneNodePropsInterface = {};

    it("renders the DoneNode component", () => {
        render(
            <UIConfigProvider>
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
                        <ReactFlowProvider>
                            <DoneNode { ...defaultProps } />
                        </ReactFlowProvider>
                    </AuthenticationFlowProvider>
                </UserPreferenceProvider>
            </UIConfigProvider>
            , { allowedScopes: fullPermissions });

        const doneNode: Element = screen.getByTestId("done-node");

        expect(doneNode).toBeInTheDocument();
    });

    it.skip("renders the circular Fab button", () => {
        render(
            <UIConfigProvider>
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
                        <ReactFlowProvider>
                            <DoneNode { ...defaultProps } />
                        </ReactFlowProvider>
                    </AuthenticationFlowProvider>
                </UserPreferenceProvider>
            </UIConfigProvider>
            , { allowedScopes: fullPermissions });

        const fabButton: HTMLButtonElement = screen.getByTestId("done-node-circular-fab");

        expect(fabButton).toBeInTheDocument();
        expect(fabButton).toHaveAttribute("aria-label", "done");
        expect(fabButton).toHaveClass("done-node");
    });

    it.skip("renders the CheckIcon inside the Fab button", () => {
        render(
            <UIConfigProvider>
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
                        <ReactFlowProvider>
                            <DoneNode { ...defaultProps } />
                        </ReactFlowProvider>
                    </AuthenticationFlowProvider>
                </UserPreferenceProvider>
            </UIConfigProvider>
            , { allowedScopes: fullPermissions });

        const checkIcon: HTMLElement = screen.getByTestId("done-node-check-icon");

        expect(checkIcon).toBeInTheDocument();
    });
});
