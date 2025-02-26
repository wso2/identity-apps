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

import Fab from "@oxygen-ui/react/Fab";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import React, { FunctionComponent, ReactElement } from "react";
import "./start.scss";

/**
 * Props interface of {@link Start}
 */
export type StartPropsInterface = NodeProps & IdentifiableComponentInterface;

/**
 * Start Node component.
 * This is a custom node supported by react flow renderer library.
 * See {@link https://reactflow.dev/docs/api/node-types/} for its documentation
 * and {@link https://reactflow.dev/examples/custom-node/} for an example
 *
 * @param props - Props injected to the component.
 * @returns Start node component.
 */
const Start: FunctionComponent = ({
    ["data-componentid"]: componentId = "start"
}: StartPropsInterface & Node): ReactElement => {
    return (
        <div data-componentid={ componentId }>
            <Fab
                aria-label="start"
                className="start"
                variant="extended"
                size="small"
                data-componentid={ `${componentId}-start-node` }
            >
                Start
            </Fab>
            <Handle className="hidden-handle" id="targetLeft" type="source" position={ Position.Right } />
        </div>
    );
};

export default Start;
