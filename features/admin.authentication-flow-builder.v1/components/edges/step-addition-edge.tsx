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

import Fab from "@mui/material/Fab";
import { PlusIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ReactElement, SyntheticEvent } from "react";
import { BaseEdge, Edge, EdgeLabelRenderer, EdgeProps, getBezierPath } from "reactflow";
import "./step-addition-edge.scss";

/**
 * Prop types for the step addition edge component.
 */
export type StepAdditionEdgePropsInterface = Partial<Edge> & Partial<EdgeProps<{
    /**
     * Callback to be fired when a new step is added.
     */
    onNewStepAddition: (event: SyntheticEvent<HTMLButtonElement>, id: string) => void;
}>> & IdentifiableComponentInterface;

/**
 * Step addition edge component.
 *
 * @param props - Props injected to the component.
 * @returns Step addition edge component.
 */
const StepAdditionEdge = (props: StepAdditionEdgePropsInterface): ReactElement => {
    const {
        id,
        data,
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        style = {},
        markerEnd,
        "data-componentid": componentId
    } = props;

    const { onNewStepAddition } = data;

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
            <BaseEdge
                path={ edgePath }
                markerEnd={ markerEnd }
                style={ style }
                data-componentid={ `${ componentId }-base-edge` }
            />
            <EdgeLabelRenderer>
                <div
                    style={ {
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`
                    } }
                    className="add-step-button-wrapper nodrag nopan"
                >
                    <Fab
                        aria-label="add"
                        className="add-step-button"
                        variant="circular"
                        onClick={ (event: SyntheticEvent<HTMLButtonElement>) => onNewStepAddition(event, id) }
                        data-componentid={ "add-step-button" }
                    >
                        <PlusIcon />
                    </Fab>
                </div>
            </EdgeLabelRenderer>
        </>
    );
};

export default StepAdditionEdge;
