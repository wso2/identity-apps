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
import { DroppableContainer, GetDragItemProps, useDnD } from "@oxygen-ui/react/dnd";
import FormGroup from "@oxygen-ui/react/FormGroup";
import IconButton from "@oxygen-ui/react/IconButton";
import Paper from "@oxygen-ui/react/Paper";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { XMarkIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Handle, Node, Position, useNodeId, useNodesData, useReactFlow } from "@xyflow/react";
import classNames from "classnames";
import isEmpty from "lodash-es/isEmpty";
import React, {
    DragEvent,
    FunctionComponent,
    MouseEvent,
    MutableRefObject,
    ReactElement,
    useCallback,
    useRef
} from "react";
import ReorderableElement from "./reorderable-element";
import useAuthenticationFlowBuilderCore from "../../../../hooks/use-authentication-flow-builder-core-context";
import { Element } from "../../../../models/elements";
import "./view.scss";

/**
 * Props interface of {@link View}
 */
export interface StepPropsInterface extends Node, IdentifiableComponentInterface {}

/**
 * Node for representing an empty step in the flow builder.
 *
 * @param props - Props injected to the component.
 * @returns Step Node component.
 */
export const View: FunctionComponent<StepPropsInterface> = ({
    data,
    "data-componentid": componentId = "step"
}: StepPropsInterface): ReactElement => {
    const nodeId: string = useNodeId();
    const node: Pick<Node, "data"> = useNodesData(nodeId);
    const { deleteElements, updateNodeData } = useReactFlow();
    const { onResourceDropOnCanvas } = useAuthenticationFlowBuilderCore();
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
                let newElement: Element = {
                    ...JSON.parse(droppedData),
                    id: generateComponentId("element")
                };

                // If the component has variants, add the default variant to the root.
                if (!isEmpty(newElement?.variants)) {
                    const defaultVariantType: string =
                        newElement?.display?.defaultVariant ?? newElement?.variants[0]?.variant;
                    const defaultVariant: Element = newElement.variants.find(
                        (variant: Element) => variant.variant === defaultVariantType
                    );

                    newElement = {
                        ...newElement,
                        ...defaultVariant
                    };
                }

                updateNodeData(nodeId, (node: any) => {
                    return {
                        elements: [ ...(node?.data?.elements || []), newElement ]
                    };
                });

                onResourceDropOnCanvas(newElement, nodeId);
            }
        },
        [ data?.type ]
    );

    const handleOrderChange = (orderedElements: Element[]) => {
        updateNodeData(nodeId, () => {
            return {
                elements: orderedElements
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
            <Box display="flex" justifyContent="space-between" className="flow-builder-step-action-panel">
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
                            <DroppableContainer
                                nodes={ (node?.data?.elements || []) as Element[] }
                                onOrderChange={ handleOrderChange }
                            >
                                { ({
                                    nodes,
                                    getDragItemProps
                                }: {
                                    nodes: Element[];
                                    getDragItemProps: GetDragItemProps;
                                }) =>
                                    nodes.map((element: Element, index: number) => {
                                        const {
                                            className: dragItemClassName,
                                            ...otherDragItemProps
                                        } = getDragItemProps(index);

                                        return (
                                            <ReorderableElement
                                                key={ element.id }
                                                element={ element }
                                                className={ classNames(
                                                    "flow-builder-step-content-form-field",
                                                    dragItemClassName
                                                ) }
                                                draggableProps={ otherDragItemProps }
                                            />
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

export default View;
