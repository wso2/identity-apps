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
    useNodesState,
    useReactFlow
} from "@xyflow/react";
import classNames from "classnames";
import cloneDeep from "lodash-es/cloneDeep";
import React, { FunctionComponent, ReactElement, useCallback } from "react";
import VisualFlow, { VisualFlowPropsInterface } from "./visual-flow";
import VisualFlowConstants from "../../constants/visual-flow-constants";
import useAuthenticationFlowBuilderCore from "../../hooks/use-authentication-flow-builder-core-context";
import useGenerateStepElement from "../../hooks/use-generate-step-element";
import { Element } from "../../models/elements";
import { Resource, ResourceTypes } from "../../models/resources";
import { Template } from "../../models/templates";
import { Widget } from "../../models/widget";
import generateResourceId from "../../utils/generate-resource-id";
import resolveKnownEdges from "../../utils/resolve-known-edges";
import ResourcePanel from "../resource-panel/resource-panel";
import ElementPropertiesPanel from "../resource-property-panel/resource-property-panel";

/**
 * Props interface of {@link DecoratedVisualFlow}
 */
export interface DecoratedVisualFlowPropsInterface extends VisualFlowPropsInterface, IdentifiableComponentInterface {
    /**
     * Callback to be fired when node data is updated.
     */
    mutateComponents: (components: Element[]) => Element[];
    onTemplateLoad: (template: Template) => [ Node[], Edge[] ];
    onWidgetLoad: (widget: Widget, targetResource: Resource, currentNodes: Node[], edges: Edge[]) => [Node[], Edge[]];
}

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
    mutateComponents,
    onTemplateLoad,
    onWidgetLoad,
    ...rest
}: DecoratedVisualFlowPropsInterface): ReactElement => {
    const { screenToFlowPosition, updateNodeData } = useReactFlow();
    const [ nodes, setNodes, onNodesChange ] = useNodesState(initialNodes);
    const [ edges, setEdges, onEdgesChange ] = useEdgesState(initialEdges);
    const { generateStepElement } = useGenerateStepElement();

    const {
        isResourcePanelOpen,
        isResourcePropertiesPanelOpen,
        onResourceDropOnCanvas
    } = useAuthenticationFlowBuilderCore();

    const addCanvasNode = (event, sourceData, targetData): void => {
        const { resource } = sourceData;
        const { clientX, clientY } = event?.nativeEvent;

        if (resource?.resourceType === ResourceTypes.Step) {
            const position: XYPosition = screenToFlowPosition({
                x: clientX,
                y: clientY
            });

            setNodes((nodes: Node[]) => [ ...nodes, {
                data: {
                    components: []
                },
                deletable: true,
                id: generateResourceId(resource.type.toLowerCase()),
                position,
                type: resource.type as string
            } ]);
        } else if (resource?.resourceType === ResourceTypes.Template) {
            const [ newNodes, newEdges ] = onTemplateLoad(resource);

            setNodes((existingNodes: Node[]) => [ ...existingNodes, ...newNodes ]);
            setEdges((existingEdges: Edge[]) => [ ...existingEdges, ...newEdges ]);
        }

        onResourceDropOnCanvas(resource, null);
    };

    const addToView = (event, sourceData, targetData): void => {
        const { resource: sourceResource } = sourceData;
        const { stepId: targetStepId, resource: targetResource } = targetData;

        if (sourceResource?.resourceType === ResourceTypes.Widget) {
            const [ newNodes, newEdges ] = onWidgetLoad(sourceResource, targetResource, nodes, edges);

            setNodes(() => newNodes);
            setEdges(() => newEdges);

            return;
        }

        if (sourceResource) {
            const generatedElement: Element = generateStepElement(sourceResource);

            updateNodeData(targetStepId, (node: any) => {
                const updatedComponents: Element[] = move([ ...(cloneDeep(node?.data?.components) || []) ], event);

                return {
                    components: mutateComponents([ ...updatedComponents, generatedElement ])
                };
            });

            onResourceDropOnCanvas(sourceResource, targetStepId);
        }
    };

    const addToForm = (event, sourceData, targetData): void => {
        const { resource: sourceResource } = sourceData;
        const { stepId: targetStepId, resource: targetResource } = targetData;

        if (sourceResource) {
            const generatedElement: Element = generateStepElement(sourceResource);

            updateNodeData(targetStepId, (node: any) => {
                const updatedComponents: Element[] = cloneDeep(node?.data?.components)?.map((component: Element) =>
                    component.id === targetResource.id
                        ? {
                            ...component,
                            components: move([ ...(component.components || []) ], event).concat(generatedElement)
                        }
                        : component
                );

                return {
                    components: mutateComponents(updatedComponents)
                };
            });

            onResourceDropOnCanvas(sourceResource, targetStepId);
        }
    };

    const handleDragEnd: (e) => void = useCallback(event => {
        const { source, target } = event.operation;

        if (event.canceled || !source || !target) {
            return;
        }

        const { data: sourceData } = source;
        const { data: targetData } = target;

        if (sourceData.isReordering) {
            updateNodeData(sourceData?.stepId, (node: any) => {
                return {
                    components: move(node?.data?.components, event)
                };
            });
        } else {
            if (target?.id === VisualFlowConstants.FLOW_BUILDER_CANVAS_ID) {
                addCanvasNode(event, sourceData, targetData);
            } else if (target?.id === VisualFlowConstants.FLOW_BUILDER_VIEW_ID) {
                addToView(event, sourceData, targetData);
            } else if (target?.id === VisualFlowConstants.FLOW_BUILDER_FORM_ID) {
                addToForm(event, sourceData, targetData);
            }
        }
    }, []);

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

    const handleComponentDelete = (stepId: string, component: Element): void => {
        const updateComponent = (components: Element[]): Element[] => {
            return components.reduce((acc: Element[], _component: Element) => {
                if (_component.id === component.id) {
                    return acc;
                }

                if (_component.components) {
                    _component.components = updateComponent(_component.components);
                }

                acc.push(_component);

                return acc;
            }, []);
        };

        updateNodeData(stepId, (node: any) => {
            const components: Element[] = updateComponent(cloneDeep(node?.data?.components));

            return {
                components
            };
        });
    };

    return (
        <div
            className={ classNames("decorated-visual-flow", "react-flow-container", "visual-editor") }
            data-componentid={ componentId }
        >
            <DragDropProvider onDragEnd={ handleDragEnd }>
                <ResourcePanel resources={ resources } open={ isResourcePanelOpen }>
                    <ElementPropertiesPanel
                        open={ isResourcePropertiesPanelOpen }
                        onComponentDelete={ handleComponentDelete }
                    >
                        <VisualFlow
                            resources={ resources }
                            initialNodes={ initialNodes }
                            initialEdges={ initialEdges }
                            nodes={ nodes }
                            onNodesChange={ onNodesChange }
                            edges={ edges }
                            onEdgesChange={ onEdgesChange }
                            onConnect={ onConnect }
                            onNodesDelete={ onNodesDelete }
                            { ...rest }
                        />
                    </ElementPropertiesPanel>
                </ResourcePanel>
            </DragDropProvider>
        </div>
    );
};

export default DecoratedVisualFlow;
