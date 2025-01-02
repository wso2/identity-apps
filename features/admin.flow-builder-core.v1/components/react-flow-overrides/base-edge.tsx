/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { EdgeLabelRenderer, EdgeProps, BaseEdge as XYFlowBaseEdge, getBezierPath } from "@xyflow/react";
import React, { FunctionComponent, ReactElement } from "react";

/**
 * Props interface of {@link VisualFlow}
 */
export interface BaseEdgePropsInterface extends EdgeProps, IdentifiableComponentInterface {}

/**
 * A customized version of the BaseEdge component.
 *
 * @param props - Props injected to the component.
 * @returns BaseEdge component.
 */
const BaseEdge: FunctionComponent<BaseEdgePropsInterface> = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    label,
    ...rest
}: BaseEdgePropsInterface): ReactElement => {
    const [ edgePath, labelX, labelY ] = getBezierPath({
        sourcePosition,
        sourceX,
        sourceY,
        targetPosition,
        targetX,
        targetY
    });

    return (
        <>
            <XYFlowBaseEdge id={ id } path={ edgePath } { ...rest } />
            <EdgeLabelRenderer>
                <div
                    style={ {
                        pointerEvents: "all",
                        position: "absolute",
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`
                    } }
                    className="edge-label-renderer__social-connection-edge nodrag nopan nodrag nopan"
                >
                    { label }
                </div>
            </EdgeLabelRenderer>
        </>
    );
};

export default BaseEdge;
