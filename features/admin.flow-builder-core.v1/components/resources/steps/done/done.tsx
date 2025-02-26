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
import { CheckIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import React, { FunctionComponent, ReactElement } from "react";
import "./done.scss";

/**
 * Props interface of {@link Done}
 */
export type DonePropsInterface = NodeProps & IdentifiableComponentInterface;

/**
 * Done Node component.
 * This is a custom node supported by react flow renderer library.
 * See {@link https://reactflow.dev/docs/api/node-types/} for its documentation
 * and {@link https://reactflow.dev/examples/custom-node/} for an example
 *
 * @param props - Props injected to the component.
 * @returns Done node component.
 */
const Done: FunctionComponent = ({
    ["data-componentid"]: componentId = "done"
}: DonePropsInterface & Node): ReactElement => {
    return (
        <div data-componentid={ componentId }>
            <Fab
                aria-label="done"
                className="done"
                variant="circular"
                data-componentid={ `${componentId}-done-node` }
            >
                <CheckIcon data-componentid={ `${componentId}-done-node-check-icon` } />
            </Fab>
            <Handle className="hidden-handle" id="targetLeft" type="target" position={ Position.Left } />
        </div>
    );
};

export default Done;
