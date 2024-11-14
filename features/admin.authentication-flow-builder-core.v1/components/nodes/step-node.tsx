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

import Box from "@oxygen-ui/react/Box";
import FormGroup from "@oxygen-ui/react/FormGroup";
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
    useRef,
    useState
} from "react";
import NodeFactory from "./node-factory";
import { Component } from "../../models/component";
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
export const StepNode: FunctionComponent<StepNodePropsInterface> = ({
    stepIndex,
    data,
    "data-componentid": componentId = "step-node"
}: StepNodePropsInterface & Node): ReactElement => {
    const ref: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const [ droppedElements, setDroppedElements ] = useState<Component[]>([]);

    const onDragOver: (event: DragEvent) => void = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop: (e: DragEvent) => void = useCallback(
        (event: DragEvent) => {
            event.preventDefault();

            const droppedData: string = event.dataTransfer.getData("application/json");

            if (droppedData) {
                const newComponent: Component = JSON.parse(droppedData);

                setDroppedElements((prevDroppedElements: Component[]) => [
                    ...prevDroppedElements,
                    newComponent
                ]);
            }
        },
        [ data?.type ]
    );

    return (
        <div
            ref={ ref }
            className="authentication-flow-builder-step"
            data-componentid={ componentId }
            onDrop={ onDrop }
            onDrag={ onDragOver }
        >
            <div className="authentication-flow-builder-step-id">
                <Typography variant="body2" data-componentid={ `${componentId}-${stepIndex}-heading-text` }>
                    Step { stepIndex && stepIndex + 1 }
                </Typography>
            </div>
            <Tooltip title={ "Remove" }>
                <IconButton
                    size="small"
                    onClick={ (_: MouseEvent<HTMLButtonElement>) => {
                        // TODO: Implement remove step logic.
                    } }
                    className="authentication-flow-builder-step-remove-button"
                >
                    <XMarkIcon />
                </IconButton>
            </Tooltip>
            { stepIndex !== 0 && <Handle type="target" position={ Position.Left } /> }
            <Box className="authentication-flow-builder-step-content" data-componentid={ `${componentId}-inner` }>
                <Paper className="authentication-flow-builder-step-content-box" elevation={ 0 } variant="outlined">
                    <Box className="authentication-flow-builder-step-content-form">
                        <FormGroup>
                            { droppedElements.map((component: Component, index: number) => (
                                <NodeFactory key={ index } node={ component } />
                            )) }
                        </FormGroup>
                    </Box>
                </Paper>
            </Box>
            <Handle type="source" position={ Position.Right } id="a" />
        </div>
    );
};

export default StepNode;
