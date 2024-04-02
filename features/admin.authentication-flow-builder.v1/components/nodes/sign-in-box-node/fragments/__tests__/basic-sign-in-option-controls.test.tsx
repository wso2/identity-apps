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
import { render, screen } from "../../../../../../test-configs/utils";
import BasicSignInOptionControls, { BasicSignInOptionControlsPropsInterface } from "../basic-sign-in-option-controls";

describe("BasicSignInOptionControls", () => {
    const defaultProps: BasicSignInOptionControlsPropsInterface = {
        onOptionRemove: jest.fn(),
        onOptionSwitch: jest.fn(),
        optionRemoveTooltipContent: "Remove",
        optionSwitchTooltipContent: "Switch"
    };

    it("renders the BasicSignInOptionControls component", () => {
        render(<BasicSignInOptionControls { ...defaultProps } />, { allowedScopes: fullPermissions });

        const basicSignInOptionControls: Element = screen.getByTestId("basic-sign-in-option-controls");
        const optionSwitchButton: Element = screen.getByTestId("basic-sign-in-option-controls-switch-option-button");
        const optionRemoveButton: Element = screen.getByTestId("basic-sign-in-option-controls-remove-option-button");

        expect(basicSignInOptionControls).toBeInTheDocument();
        expect(optionSwitchButton).toBeInTheDocument();
        expect(optionRemoveButton).toBeInTheDocument();
    });
});
