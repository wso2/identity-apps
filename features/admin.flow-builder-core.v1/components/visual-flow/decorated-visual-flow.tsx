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
    useReactFlow,
    useUpdateNodeInternals
} from "@xyflow/react";
import { UpdateNodeInternals } from "@xyflow/system";
import classNames from "classnames";
import cloneDeep from "lodash-es/cloneDeep";
import React, { Dispatch, FunctionComponent, ReactElement, SetStateAction, useCallback, useEffect } from "react";
import VisualFlow, { VisualFlowPropsInterface } from "./visual-flow";
import VisualFlowConstants from "../../constants/visual-flow-constants";
import useAuthenticationFlowBuilderCore from "../../hooks/use-authentication-flow-builder-core-context";
import useComponentDelete from "../../hooks/use-component-delete";
import useConfirmPasswordField from "../../hooks/use-confirm-password-field";
import useDeleteExecutionResource from "../../hooks/use-delete-execution-resource";
import useGenerateStepElement from "../../hooks/use-generate-step-element";
import useStaticContentField from "../../hooks/use-static-content-field";
import { Element } from "../../models/elements";
import { EventTypes } from "../../models/extension";
import { Resource, ResourceTypes } from "../../models/resources";
import { Step } from "../../models/steps";
import { Template, TemplateTypes } from "../../models/templates";
import { Widget } from "../../models/widget";
import PluginRegistry from "../../plugins/plugin-registry";
import generateResourceId from "../../utils/generate-resource-id";
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
    onTemplateLoad: (template: Template) => [Node[], Edge[], Resource?, string?];
    onWidgetLoad: (
        widget: Widget,
        targetResource: Resource,
        currentNodes: Node[],
        edges: Edge[]
    ) => [Node[], Edge[], Resource, string];
    onStepLoad: (step: Step) => Step;
    onResourceAdd: (resource: Resource) => void;
    setNodes: Dispatch<SetStateAction<Node[]>>;
    setEdges: Dispatch<SetStateAction<Edge[]>>;
    aiGeneratedFlow: any;
}

/**
 * Component to decorate the visual flow editor with the necessary providers.
 *
 * @param props - Props injected to the component.
 * @returns Decorated visual flow component.
 */
const DecoratedVisualFlow: FunctionComponent<DecoratedVisualFlowPropsInterface> = ({
    "data-componentid": componentId = "authentication-flow-visual-editor",
    aiGeneratedFlow,
    resources,
    initialNodes = [],
    initialEdges = [],
    setNodes,
    setEdges,
    edges,
    nodes,
    onNodesChange,
    onEdgesChange,
    onEdgeResolve,
    mutateComponents,
    onTemplateLoad,
    onWidgetLoad,
    onStepLoad,
    onResourceAdd,
    ...rest
}: DecoratedVisualFlowPropsInterface): ReactElement => {

    // Event handlers for ON_NODE_DELETE event.
    useDeleteExecutionResource();

    // Event handlers for ON_PROPERTY_PANEL_OPEN event.
    useConfirmPasswordField();

    // Event handlers for static content in execution steps.
    useStaticContentField();

    const { screenToFlowPosition, updateNodeData } = useReactFlow();
    const { generateStepElement } = useGenerateStepElement();
    const updateNodeInternals: UpdateNodeInternals = useUpdateNodeInternals();
    const { deleteComponent } = useComponentDelete();

    const {
        isResourcePanelOpen,
        isResourcePropertiesPanelOpen,
        onResourceDropOnCanvas
    } = useAuthenticationFlowBuilderCore();

    useEffect(() => {
        if (aiGeneratedFlow) {
            handleOnAdd(aiGeneratedFlow);
        }
    }, [ aiGeneratedFlow ]);

    const addCanvasNode = (event: any, sourceData: any, _targetData: any): void => {
        const sourceResource: any = cloneDeep(sourceData.dragged);
        const { clientX, clientY } = event?.nativeEvent;

        const position: XYPosition = screenToFlowPosition({
            x: clientX,
            y: clientY
        });

        let generatedStep: Step = {
            ...sourceResource,
            data: sourceResource?.data || {},
            deletable: true,
            id: generateResourceId(sourceResource.type.toLowerCase()),
            position
        };

        // Decorate the step with any additional information
        generatedStep = onStepLoad(generatedStep);

        setNodes((nodes: Node[]) => [ ...nodes, generatedStep ]);

        onResourceDropOnCanvas(generatedStep as Step, null);
    };

    const addToView = (event: any, sourceData: any, targetData: any): void => {
        const { dragged: sourceResource } = sourceData;
        const { stepId: targetStepId, droppedOn: targetResource } = targetData;

        if (sourceResource?.resourceType === ResourceTypes.Widget) {
            const [ newNodes, newEdges, defaultPropertySelector, defaultPropertySectorStepId ] = onWidgetLoad(
                sourceResource,
                targetResource,
                nodes,
                edges
            );

            setNodes(() => newNodes);
            setEdges(() => newEdges);

            onResourceDropOnCanvas(
                defaultPropertySelector ?? sourceResource,
                defaultPropertySectorStepId ?? targetStepId
            );

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

            onResourceDropOnCanvas(generatedElement, targetStepId);
        }
    };

    const addToForm = (event: any, sourceData: any, targetData: any): void => {
        const { dragged: sourceResource } = sourceData;
        const { stepId: targetStepId, droppedOn: targetResource } = targetData;

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

            onResourceDropOnCanvas(generatedElement, targetStepId);
        }
    };

    const handleDragEnd = (event: any) => {
        const { source, target } = event.operation;

        if (event.canceled || !source || !target) {
            return;
        }

        const { data: sourceData } = source;
        const { data: targetData } = target;

        if (sourceData.isReordering) {
            updateNodeData(sourceData?.stepId, (node: any) => {
                const unorderedComponents: Element[] = cloneDeep(node?.data?.components);

                unorderedComponents.map((component: Element) => {
                    if (component?.components) {
                        component.components = move(component.components, event);
                    }
                });

                // Update node internals to fix handle positions after reordering
                updateNodeInternals(sourceData.stepId);

                return {
                    components: move(unorderedComponents, event)
                };
            });
        } else {
            if (target?.id?.startsWith(VisualFlowConstants.FLOW_BUILDER_CANVAS_ID)) {
                addCanvasNode(event, sourceData, targetData);
            } else if (target?.id?.startsWith(VisualFlowConstants.FLOW_BUILDER_VIEW_ID)) {
                addToView(event, sourceData, targetData);
            } else if (target?.id?.startsWith(VisualFlowConstants.FLOW_BUILDER_FORM_ID)) {
                addToForm(event, sourceData, targetData);
            }
        }
    };

    const handleDragOver: (e) => void = useCallback((event: any) => {
        const { source, target } = event.operation;

        if (event.canceled || !source || !target) {
            return;
        }

        // If not a reordering operation, return.
        if (!source.data.isReordering) {
            return;
        }

        const { data: sourceData } = source;

        requestAnimationFrame(() => {
            updateNodeData(sourceData?.stepId, (node: any) => {
                const unorderedComponents: Element[] = cloneDeep(node?.data?.components);

                unorderedComponents.map((component: Element) => {
                    if (component?.components) {
                        component.components = move(component.components, event);
                    }
                });

                return {
                    components: move(unorderedComponents, event)
                };
            });
        });
    }, []);

    const onConnect: OnConnect = useCallback(
        (connection: any) => {
            let edge: Edge = onEdgeResolve ? onEdgeResolve(connection, nodes) : null;

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
        async (deleted: Node[]) => {
            // Execute plugins for ON_NODE_DELETE event.
            await PluginRegistry.getInstance().executeAsync(EventTypes.ON_NODE_DELETE, deleted);

            setEdges(
                deleted?.reduce((acc: Edge[], node: Node) => {
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

    /**
     * Handles the deletion of edges.
     *
     * @param deleted - Array of deleted edges.
     */
    const onEdgesDelete: (deleted: Edge[]) => void = useCallback(
        async (deleted: Edge[]) => {
            // Execute plugins for ON_EDGE_DELETE event.
            await PluginRegistry.getInstance().executeAsync(EventTypes.ON_EDGE_DELETE, deleted);
        },
        []
    );

    const handleOnAdd = (resource: Resource): void => {
        // Currently we only let templates to be added to the canvas via a click.
        if (resource.resourceType !== ResourceTypes.Template) {
            return;
        }

        resource = cloneDeep(resource);

        /**
         * Execute plugins for ON_TEMPLATE_LOAD event.
         */
        PluginRegistry.getInstance().executeSync(EventTypes.ON_TEMPLATE_LOAD, resource);

        // Users need to add a prompt first when they select the AI template.
        // TODO: Handle this better.
        if (resource.type === TemplateTypes.GeneratedWithAI) {
            onResourceAdd(resource);

            return;
        }

        const [ newNodes, newEdges, defaultPropertySelector, defaultPropertySectorStepId ] = onTemplateLoad(resource);

        // TODO: Figure-out a better way to handle this debounce.
        // Tracker: https://github.com/xyflow/xyflow/issues/2405
        setTimeout(() => {
            // Letting React Flow know of the programmatic updates to node for re-drawing edges.
            setNodes(() => {
                newNodes.forEach((node: Node) => {
                    updateNodeInternals(node.id);

                    if (node.data?.components) {
                        (node.data.components as Element[]).forEach((component: Element) => {
                            updateNodeInternals(component.id);

                            if (component?.components) {
                                component.components.forEach((nestedComponent: Element) => {
                                    updateNodeInternals(nestedComponent.id);
                                });
                            }
                        });
                    }
                });

                return newNodes;
            });

            setEdges(() => [ ...newEdges ]);
        }, 500);

        onResourceDropOnCanvas(defaultPropertySelector ?? resource, defaultPropertySectorStepId ?? null);
    };

    return (
        <div className={ classNames("decorated-visual-flow", "react-flow-container") } data-componentid={ componentId }>
            <DragDropProvider onDragEnd={ handleDragEnd } onDragOver={ handleDragOver }>
                <ResourcePanel
                    resources={ resources }
                    open={ isResourcePanelOpen }
                    onAdd={ handleOnAdd }
                >
                    <ElementPropertiesPanel
                        open={ isResourcePropertiesPanelOpen }
                        onComponentDelete={ deleteComponent }
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
                            onEdgesDelete={ onEdgesDelete }
                            { ...rest }
                        />
                    </ElementPropertiesPanel>
                </ResourcePanel>
            </DragDropProvider>
        </div>
    );
};

export default DecoratedVisualFlow;
