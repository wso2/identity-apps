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
import { DroppableContainer, GetDragItemProps, useDnD } from "@wso2is/dnd";
import { Handle, Node, Position, useNodeId, useNodesData, useReactFlow } from "@xyflow/react";
import classNames from "classnames";
import isEmpty from "lodash-es/isEmpty";
import React, {
    DragEvent,
    FunctionComponent,
    MouseEvent,
    MutableRefObject,
    ReactElement,
    SVGProps,
    useCallback,
    useRef
} from "react";
import useAuthenticationFlowBuilderCore from "../../../../hooks/use-authentication-flow-builder-core-context";
import { Component } from "../../../../models/component";
import "./step.scss";

/**
 * Props interface of {@link Step}
 */
export interface StepPropsInterface extends Node, IdentifiableComponentInterface {}

// TODO: Move this to Oxygen UI.
/* eslint-disable max-len */
const GridDotsVerticalIcon = ({ ...rest }: SVGProps<SVGSVGElement>): ReactElement => (
    <svg fill="#a0a0a0" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg" { ...rest }>
        <g id="SVGRepo_bgCarrier" strokeWidth="0" />
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
        <g id="SVGRepo_iconCarrier">
            <path
                d="M686.211 137.143v-.137l68.572.137H686.21Zm0 1508.571c75.566 0 137.143 61.577 137.143 137.143S761.777 1920 686.211 1920c-75.702 0-137.142-61.577-137.142-137.143s61.44-137.143 137.142-137.143Zm548.572 0c75.566 0 137.143 61.577 137.143 137.143S1310.349 1920 1234.783 1920c-75.703 0-137.143-61.577-137.143-137.143s61.44-137.143 137.143-137.143ZM686.21 1097.143c75.566 0 137.143 61.577 137.143 137.143 0 75.565-61.577 137.143-137.143 137.143-75.702 0-137.142-61.578-137.142-137.143 0-75.566 61.44-137.143 137.142-137.143Zm548.572 0c75.566 0 137.143 61.577 137.143 137.143 0 75.565-61.577 137.143-137.143 137.143-75.703 0-137.143-61.578-137.143-137.143 0-75.566 61.44-137.143 137.143-137.143ZM686.21 548.57c75.566 0 137.143 61.578 137.143 137.143 0 75.566-61.577 137.143-137.143 137.143-75.702 0-137.142-61.577-137.142-137.143 0-75.565 61.44-137.143 137.142-137.143Zm548.572 0c75.566 0 137.143 61.578 137.143 137.143 0 75.566-61.577 137.143-137.143 137.143-75.703 0-137.143-61.577-137.143-137.143 0-75.565 61.44-137.143 137.143-137.143ZM686.21 0c75.566 0 137.143 61.577 137.143 137.143S761.776 274.286 686.21 274.286c-75.702 0-137.142-61.577-137.142-137.143S610.509 0 686.21 0Zm548.503 0c75.566 0 137.143 61.577 137.143 137.143s-61.577 137.143-137.143 137.143c-75.565 0-137.143-61.577-137.143-137.143S1159.15 0 1234.714 0Z"
                fillRule="evenodd"
            />
        </g>
    </svg>
);

/**
 * Node for representing an empty step in the flow builder.
 *
 * @param props - Props injected to the component.
 * @returns Step Node component.
 */
export const Step: FunctionComponent<StepPropsInterface> = ({
    data,
    "data-componentid": componentId = "step"
}: StepPropsInterface): ReactElement => {
    const nodeId: string = useNodeId();
    const node: Pick<Node, "data"> = useNodesData(nodeId);
    const { deleteElements, updateNodeData } = useReactFlow();
    const { onElementDropOnCanvas, ComponentFactory, setLastInteractedElement } = useAuthenticationFlowBuilderCore();
    const { generateComponentId } = useDnD();

    const ref: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const handleDragOver: (event: DragEvent) => void = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const handleDrop: (e: DragEvent) => void = useCallback(
        (event: DragEvent) => {
            event.preventDefault();

            const droppedData: string = event.dataTransfer.getData("application/json");

            if (droppedData) {
                let newComponent: Component = {
                    ...JSON.parse(droppedData),
                    id: generateComponentId("element")
                };

                // If the component has variants, add the default variant to the root.
                if (!isEmpty(newComponent?.variants)) {
                    const defaultVariantType: string =  newComponent?.display?.defaultVariant ?? newComponent?.variants[0]?.variant;
                    const defaultVariant: Component = newComponent.variants.find((variant: Component) => variant.variant === defaultVariantType);

                    newComponent = {
                        ...newComponent,
                        ...defaultVariant
                    };
                }

                updateNodeData(nodeId, (node: any) => {
                    return {
                        components: [ ...(node?.data?.components || []), newComponent ]
                    };
                });

                onElementDropOnCanvas(newComponent, nodeId);
            }
        },
        [ data?.type ]
    );

    const handleOrderChange = (orderedNodes: Component[]) => {
        updateNodeData(nodeId, () => {
            return {
                components: orderedNodes
            };
        });
    };

    return (
        <div
            ref={ ref }
            className="flow-builder-step"
            data-componentid={ componentId }
            onDrop={ handleDrop }
            onDrag={ handleDragOver }
        >
            <Box
                display="flex"
                justifyContent="space-between"
                className="flow-builder-step-action-panel"
            >
                <Typography
                    variant="body2"
                    data-componentid={ `${componentId}-heading-text` }
                    className="flow-builder-step-id"
                >
                    Step
                </Typography>
                <Tooltip title={ "Remove" }>
                    <IconButton
                        size="small"
                        onClick={ (_: MouseEvent<HTMLButtonElement>) => {
                            deleteElements({ nodes: [ { id: nodeId } ] });
                        } }
                        className="flow-builder-step-remove-button"
                    >
                        <XMarkIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            <Handle type="target" position={ Position.Left } />
            <Box className="flow-builder-step-content nodrag" data-componentid={ `${componentId}-inner` }>
                <Paper className="flow-builder-step-content-box" elevation={ 0 } variant="outlined">
                    <Box className="flow-builder-step-content-form">
                        <FormGroup>
                            <DroppableContainer<Component>
                                nodes={ (node?.data?.components || []) as Component[] }
                                onOrderChange={ handleOrderChange }
                            >
                                { ({
                                    nodes,
                                    getDragItemProps
                                }: {
                                    nodes: Component[];
                                    getDragItemProps: GetDragItemProps;
                                }) =>
                                    nodes.map((component: Component, index: number) => {
                                        const {
                                            className: dragItemClassName,
                                            ...otherDragItemProps
                                        } = getDragItemProps(index);

                                        return (
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                key={ index }
                                                className={ classNames(
                                                    "flow-builder-step-content-form-field",
                                                    dragItemClassName
                                                ) }
                                                onClick={ () => setLastInteractedElement(component) }
                                                { ...otherDragItemProps }
                                            >
                                                <div className="flow-builder-step-content-form-field-drag-handle">
                                                    <GridDotsVerticalIcon height={ 20 } />
                                                </div>
                                                <div className="flow-builder-step-content-form-field-content">
                                                    <ComponentFactory nodeId={ nodeId } node={ component } />
                                                </div>
                                            </Box>
                                        );
                                    })
                                }
                            </DroppableContainer>
                        </FormGroup>
                    </Box>
                </Paper>
            </Box>
        </div>
    );
};

export default Step;
