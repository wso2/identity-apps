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

import Box from "@oxygen-ui/react/Box";
import IconButton from "@oxygen-ui/react/IconButton";
import Paper from "@oxygen-ui/react/Paper";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { XMarkIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Handle, Node, Position } from "@xyflow/react";
import React, {
    DragEvent,
    FunctionComponent,
    MouseEvent,
    MutableRefObject,
    ReactElement,
    useCallback,
    useRef
} from "react";
import "./step-node.scss";

/**
 * Props interface of {@link StepNode}
 */
export interface StepNodePropsInterface extends IdentifiableComponentInterface {
    stepIndex: number;
}

/**
 * Node for representing an empty step in the authentication flow.
 *
 * @param props - Props injected to the component.
 * @returns Step Node component.
 */
export const StepNode: FunctionComponent<StepNodePropsInterface> = (
    {
        stepIndex,
        data,
        "data-componentid": componentId = "step-node"
    }: StepNodePropsInterface & Node
): ReactElement => {
    const ref: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const onDragOver: (event: DragEvent) => void = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop: (e: DragEvent) => void = useCallback(
        (event: DragEvent) => {
            event.preventDefault();

            const droppedData = event.dataTransfer.getData("application/json");

            if (droppedData) {
                const parsedData = JSON.parse(droppedData);
            }
        },
        [ data?.type ]
    );

    return (
        <div
            ref={ ref }
            className="step-node"
            data-componentid={ componentId }
            onDrop={ onDrop }
            onDrag={ onDragOver }
        >
            <div className="step-id">
                <Typography
                    variant="body2"
                    data-componentid={ `${componentId}-${stepIndex}-heading-text` }
                >
                    Step { stepIndex + 1 }
                </Typography>
            </div>
            <Tooltip title={ "Remove" }>
                <IconButton
                    size="small"
                    onClick={ (e: MouseEvent<HTMLButtonElement>) => {
                        // TODO: Implement remove step logic.
                    } }
                    className="remove-button"
                >
                    <XMarkIcon />
                </IconButton>
            </Tooltip>
            { stepIndex !== 0 && <Handle type="target" position={ Position.Left } /> }
            <Box className="oxygen-sign-in" data-componentid={ `${componentId}-inner` }>
                <Paper className="oxygen-sign-in-box" elevation={ 0 } variant="outlined">
                    <Box className="oxygen-sign-in-form">
                    </Box>
                </Paper>
            </Box>
            <Handle type="source" position={ Position.Right } id="a" />
        </div>
    );
};

export default StepNode;
