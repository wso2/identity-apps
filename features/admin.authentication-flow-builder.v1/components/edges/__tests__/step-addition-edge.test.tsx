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

import { render, screen } from "@wso2is/unit-testing/utils";
import { Position, ReactFlowProvider } from "@xyflow/react";
import React from "react";
import "@testing-library/jest-dom";
import { Position, ReactFlowProvider } from "reactflow";
import { fullPermissions } from "./__mocks__/permissions";
import StepAdditionEdge, { StepAdditionEdgePropsInterface } from "../step-addition-edge";
import "@testing-library/jest-dom";

describe.skip("StepAdditionEdge", () => {
    it("renders the base edge", () => {
        render(
            <ReactFlowProvider>
                <ReactFlow
                    fitView
                    nodeTypes={ {} }
                    edgeTypes={ { stepAdditionEdge: StepAdditionEdge } }
                    nodes={ [] }
                    edges={ [] }
                    proOptions={ { hideAttribution: true } }
                >
                    <Background color="#e1e1e1" gap={ 16 } variant={ BackgroundVariant.Dots } size={ 2 } />
                    <Controls />
                </ReactFlow>
            </ReactFlowProvider>
            , { allowedScopes: fullPermissions });

        const baseEdge: Element = screen.getByTestId("step-addition-edge");

        expect(baseEdge).toBeInTheDocument();
    });
});
