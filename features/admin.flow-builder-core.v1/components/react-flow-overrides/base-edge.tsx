/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import { EdgeLabelRenderer, EdgeProps, BaseEdge as _BaseEdge, getBezierPath, useReactFlow } from "@xyflow/react";
import React, { FunctionComponent, ReactElement, SyntheticEvent } from "react";
import "./base-edge.scss";

/**
 * Props interface of {@link VisualFlow}
 */
export interface BaseEdgePropsInterface extends EdgeProps, IdentifiableComponentInterface {
    showDeleteButton?: boolean;
}

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
    showDeleteButton = true,
    style,
    ...rest
}: BaseEdgePropsInterface): ReactElement => {
    const { deleteElements } = useReactFlow();

    const [ edgePath, labelX, labelY ] = getBezierPath({
        sourcePosition,
        sourceX,
        sourceY,
        targetPosition,
        targetX,
        targetY
    });

    const handleDelete = (event: SyntheticEvent) => {
        event.stopPropagation();
        deleteElements({ edges: [ { id } ] });
    };

    return (
        <>
            <_BaseEdge
                id={ id }
                path={ edgePath }
                style={ {
                    ...style,
                    cursor: showDeleteButton ? "pointer" : "default"
                } }
                { ...rest }
            />
            { (label || showDeleteButton) && (
                <EdgeLabelRenderer>
                    <div
                        style={ {
                            pointerEvents: "all",
                            position: "absolute",
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`
                        } }
                        className="edge-label-renderer__deletable-edge nodrag nopan"
                    >
                        { label }
                        { showDeleteButton && (
                            <div
                                className="edge-delete-button"
                                onClick={ handleDelete }
                            >
                                x
                            </div>
                        ) }
                    </div>
                </EdgeLabelRenderer>
            ) }
        </>
    );
};

export default BaseEdge;
