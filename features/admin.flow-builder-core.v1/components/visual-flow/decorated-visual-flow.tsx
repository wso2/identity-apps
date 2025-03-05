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

import { move } from "@dnd-kit/helpers";
import { DragDropProvider } from "@dnd-kit/react";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    Edge,
    MarkerType,
    Node,
    OnConnect,
    OnNodesDelete,
    XYPosition,
    addEdge,
    getConnectedEdges,
    getIncomers,
    getOutgoers,
    useEdgesState,
    useNodeId,
    useNodesState,
    useReactFlow
} from "@xyflow/react";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, useCallback, useState } from "react";
import VisualFlow, { VisualFlowPropsInterface } from "./visual-flow";
import VisualFlowConstants from "../../constants/visual-flow-constants";
import useAuthenticationFlowBuilderCore from "../../hooks/use-authentication-flow-builder-core-context";
import useGenerateStepElement from "../../hooks/use-generate-step-element";
import { Element } from "../../models/elements";
import { ResourceTypes } from "../../models/resources";
import generateResourceId from "../../utils/generate-resource-id";
import resolveKnownEdges from "../../utils/resolve-known-edges";
import ResourcePanel from "../resource-panel/resource-panel";
import ElementPropertiesPanel from "../resource-property-panel/resource-property-panel";

/**
 * Props interface of {@link DecoratedVisualFlow}
 */
export type DecoratedVisualFlowPropsInterface = VisualFlowPropsInterface & IdentifiableComponentInterface;

/**
 * Component to decorate the visual flow editor with the necessary providers.
 *
 * @param props - Props injected to the component.
 * @returns Decorated visual flow component.
 */
const DecoratedVisualFlow: FunctionComponent<DecoratedVisualFlowPropsInterface> = ({
    "data-componentid": componentId = "authentication-flow-visual-editor",
    resources,
    initialNodes = [],
    initialEdges = [],
    onEdgeResolve,
    ...rest
}: DecoratedVisualFlowPropsInterface): ReactElement => {
    const { screenToFlowPosition, updateNodeData } = useReactFlow();
    const [ nodes, setNodes, onNodesChange ] = useNodesState(initialNodes);
    const [ edges, setEdges, onEdgesChange ] = useEdgesState(initialEdges);
    const { generateStepElement } = useGenerateStepElement();

    const { isResourcePanelOpen, isResourcePropertiesPanelOpen, onResourceDropOnCanvas } = useAuthenticationFlowBuilderCore();

    const addCanvasNode = (event, sourceData, targetData): void => {
        const { resource } = sourceData;
        const { clientX, clientY } = event?.nativeEvent;

        // TODO: Handle this with the `type` -> `accepts` feature in @dnd-kit/react.
        // check if the dropped element is valid
        if (!resource?.type || resource?.resourceType !== ResourceTypes.Step) {
            return;
        }

        // project was renamed to screenToFlowPosition
        // and you don't need to subtract the reactFlowBounds.left/top anymore
        // details: https://reactflow.dev/whats-new/2023-11-10
        const position: XYPosition = screenToFlowPosition({
            x: clientX,
            y: clientY
        });

        const newNode: Node = {
            data: {
                components: []
            },
            deletable: true,
            id: generateResourceId(resource.type.toLowerCase()),
            position,
            type: resource.type as string
        };

        setNodes((nodes: Node[]) => nodes.concat(newNode));

        onResourceDropOnCanvas(resource, null);
    };

    const addToView = (event, sourceData, targetData): void => {
        const { resource } = sourceData;
        const { nodeId } = targetData;

        if (resource) {
            const generatedElement: Element = generateStepElement(resource);

            updateNodeData(nodeId, (node: any) => {
                const updatedComponents = move(
                    [...(node?.data?.components || [])], // Current components
                    event // Drag-and-drop event
                );

                return {
                    components: [...updatedComponents, generatedElement] // Update state with the moved components and new element
                };
            });

            onResourceDropOnCanvas(resource, nodeId);
        }
    };

    const addToForm = (event, sourceData, targetData): void => {
        const { resource: sourceResource } = sourceData;
        const { nodeId: targetNodeId, resource: targetResource } = targetData;

        if (sourceResource) {
            const generatedElement: Element = generateStepElement(sourceResource);

            updateNodeData(targetNodeId, (node: any) => {
                return {
                    components: node?.data?.components?.map((component: Element) =>
                        component.id === targetResource.id
                            ? {
                                  ...component,
                                  components: move(
                                      [...(component.components || [])], // Current nested components
                                      event // Drag-and-drop event
                                  ).concat(generatedElement) // Append the new element
                              }
                            : component
                    )
                };
            });

            onResourceDropOnCanvas(sourceResource, targetNodeId);
        }
    };

    const handleDragEnd: (e) => void = useCallback(
        (event) => {
            const { active, over } = event;
            const { source, target } = event.operation;
            const { data: sourceData } = source;
            const { data: targetData } = target;

            if (event.canceled) {
                return;
            };

            if (target?.id === VisualFlowConstants.FLOW_BUILDER_CANVAS_ID) {
                addCanvasNode(event, sourceData, targetData);
            } else if (target?.id === VisualFlowConstants.FLOW_BUILDER_VIEW_ID) {
                addToView(event, sourceData, targetData);
            } else if (target?.id === VisualFlowConstants.FLOW_BUILDER_FORM_ID) {
                addToForm(event, sourceData, targetData);
            }
        },
        []
    );

    const onConnect: OnConnect = useCallback(
        (connection: any) => {
            let edge: Edge = onEdgeResolve ? onEdgeResolve(connection, nodes) : resolveKnownEdges(connection, nodes);

            if (!edge) {
                edge = {
                    ...connection,
                    markerEnd: {
                        type: MarkerType.Arrow
                    },
                    type: "base-edge"
                };
            }

            setEdges((edges: Edge[]) => addEdge(edge, edges));
        },
        [ setEdges, nodes ]
    );

    const onNodesDelete: OnNodesDelete<Node> = useCallback(
        (deleted: Node[]) => {
            setEdges(
                deleted.reduce((acc: Edge[], node: Node) => {
                    const incomers: Node[] = getIncomers(node, nodes, edges);
                    const outgoers: Node[] = getOutgoers(node, nodes, edges);
                    const connectedEdges: Edge[] = getConnectedEdges([ node ], edges);

                    const remainingEdges: Edge[] = acc.filter((edge: Edge) => !connectedEdges.includes(edge));

                    const createdEdges: Edge[] = incomers.flatMap(({ id: source }: { id: string }) =>
                        outgoers.map(({ id: target }: { id: string }) => ({
                            id: `${source}->${target}`,
                            source,
                            target
                        }))
                    );

                    return [ ...remainingEdges, ...createdEdges ];
                }, edges)
            );
        },
        [ nodes, edges ]
    );

    return (
        <div
            className={ classNames("decorated-visual-flow", "react-flow-container", "visual-editor") }
            data-componentid={ componentId }
        >
            <DragDropProvider onDragEnd={ handleDragEnd }>
                <ResourcePanel resources={ resources } open={ isResourcePanelOpen }>
                    <ElementPropertiesPanel open={ isResourcePropertiesPanelOpen }>
                        <VisualFlow resources={ resources } initialNodes={ initialNodes } initialEdges={ initialEdges } nodes={ nodes } onNodesChange={ onNodesChange } edges={ edges } onEdgesChange={ onEdgesChange } onConnect={ onConnect } onNodesDelete={ onNodesDelete } { ...rest } />
                    </ElementPropertiesPanel>
                </ResourcePanel>
            </DragDropProvider>
        </div>
    );
};

export default DecoratedVisualFlow;
