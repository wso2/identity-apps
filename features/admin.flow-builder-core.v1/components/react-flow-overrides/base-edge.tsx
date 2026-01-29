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

import { TrashIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { EdgeLabelRenderer, EdgeProps, BaseEdge as _BaseEdge, getBezierPath, useReactFlow } from "@xyflow/react";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import "./base-edge.scss";

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
    style,
    selected,
    deletable,
    ...rest
}: BaseEdgePropsInterface): ReactElement => {
    const { deleteElements } = useReactFlow();
    const [ isEdgeSelected, setIsEdgeSelected ] = useState<boolean>(false);

    useEffect(() => {
        setIsEdgeSelected(selected || false);
    }, [ selected ]);

    useEffect(() => {
        const handleGlobalClick = (event: MouseEvent): void => {
            const target: HTMLElement = event.target as HTMLElement;

            if (!target.closest(`[id="${id}"]`) && !target.closest(".edge-label-renderer__deletable-edge")) {
                setIsEdgeSelected(false);
            }
        };

        if (isEdgeSelected) {
            document.addEventListener("click", handleGlobalClick);

            return () => document.removeEventListener("click", handleGlobalClick);
        }
    }, [ isEdgeSelected, id ]);

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

    const handleEdgeClick = (event: SyntheticEvent) => {
        event.stopPropagation();
        setIsEdgeSelected(!isEdgeSelected);
    };

    return (
        <>
            <_BaseEdge
                id={ id }
                path={ edgePath }
                style={ {
                    ...style,
                    pointerEvents: "all"
                } }
                onClick={ handleEdgeClick }
                { ...rest }
            />
            { (
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
                        { isEdgeSelected && deletable && (
                            <div
                                className="edge-delete-button"
                                onClick={ handleDelete }
                                style={ {
                                    pointerEvents: "all"
                                } }
                            >
                                <TrashIcon size={ 14 }/>
                            </div>
                        ) }
                    </div>
                </EdgeLabelRenderer>
            ) }
        </>
    );
};

export default BaseEdge;
