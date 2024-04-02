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
import { Position } from "reactflow";
import { fullPermissions } from "./__mocks__/permissions";
import { render, screen } from "../../../../test-configs/utils";
import StepAdditionEdge, { StepAdditionEdgePropsInterface } from "../step-addition-edge";

describe("StepAdditionEdge", () => {
    const mockOnNewStepAddition: () => void = jest.fn();

    const defaultProps: StepAdditionEdgePropsInterface = {
        data: {
            onNewStepAddition: mockOnNewStepAddition
        },
        "data-componentid": "step-addition-edge",
        id: "edgeId",
        sourcePosition: Position.Right,
        sourceX: 100,
        sourceY: 100,
        targetPosition: Position.Left,
        targetX: 200,
        targetY: 200
    };

    it("renders the base edge", () => {
        render(<StepAdditionEdge { ...defaultProps }/>, { allowedScopes: fullPermissions });

        const baseEdge: Element = screen.getByTestId("step-addition-edge");

        expect(baseEdge).toBeInTheDocument();
    });
});
