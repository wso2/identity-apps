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
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
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
import { AxiosError } from "axios";
import classNames from "classnames";
import cloneDeep from "lodash-es/cloneDeep";
import React, {
    Dispatch,
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useRef
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch as ReduxDispatch } from "redux";
import VisualFlow, { VisualFlowPropsInterface } from "./visual-flow";
import FlowConstants from "../../constants/flow-constants";
import VisualFlowConstants from "../../constants/visual-flow-constants";
import useAuthenticationFlowBuilderCore from "../../hooks/use-authentication-flow-builder-core-context";
import useComponentDelete from "../../hooks/use-component-delete";
import useConfirmPasswordField from "../../hooks/use-confirm-password-field";
import useDeleteExecutionResource from "../../hooks/use-delete-execution-resource";
import useGenerateStepElement from "../../hooks/use-generate-step-element";
import useStaticContentField from "../../hooks/use-static-content-field";
import { Element } from "../../models/elements";
import { EventTypes } from "../../models/extension";
import { Resource, ResourceTypes, Resources } from "../../models/resources";
import { Step, StepTypes } from "../../models/steps";
import { Template, TemplateTypes } from "../../models/templates";
import { Widget } from "../../models/widget";
import PluginRegistry from "../../plugins/plugin-registry";
import autoAssignConnections from "../../utils/auto-assign-connections";
import { reorderBranches } from "../../utils/branch-operations";
import {
    hasDecisionStep,
    isRuleMetadataNotImplemented,
    withoutDecisionSteps
} from "../../utils/conditional-branching";
import { START_STEP_ID } from "../../utils/variables";
import isDecisionStepLimitReached from "../../utils/decision-step-limit";
import generateResourceId from "../../utils/generate-resource-id";
import seedRuleDecisionBranches from "../../utils/seed-rule-decision-branches";
import ResourcePanel from "../resource-panel/resource-panel";
import ElementPropertiesPanel from "../resource-property-panel/resource-property-panel";
import ValidationPanel from "../validation-panel/validation-panel";
import VersionHistoryPanel from "../version-history-panel/version-history-panel";

const EMPTY_NODES: Node[] = [];
const EMPTY_EDGES: Edge[] = [];

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
    initialNodes = EMPTY_NODES,
    initialEdges = EMPTY_EDGES,
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
    const { t } = useTranslation();
    const dispatch: ReduxDispatch = useDispatch();
    const { generateStepElement } = useGenerateStepElement();
    const updateNodeInternals: UpdateNodeInternals = useUpdateNodeInternals();
    const { deleteComponent } = useComponentDelete();

    const {
        isResourcePanelOpen,
        isResourcePropertiesPanelOpen,
        isVersionHistoryPanelOpen,
        onResourceDropOnCanvas,
        isFlowMetadataLoading,
        metadata,
        ruleLimits,
        isConditionalBranchingEnabled,
        ruleMetadataError
    } = useAuthenticationFlowBuilderCore();

    const alertedRuleMetadataError: MutableRefObject<AxiosError> = useRef<AxiosError>(null);

    /**
     * Says why decision steps cannot be configured, once per failed request, and only to a flow that has one: a flow
     * without decision steps loses nothing but the palette entry.
     */
    useEffect(() => {
        if (!ruleMetadataError || alertedRuleMetadataError.current === ruleMetadataError || !hasDecisionStep(nodes)) {
            return;
        }

        alertedRuleMetadataError.current = ruleMetadataError;
        const notification: string = isRuleMetadataNotImplemented(ruleMetadataError)
            ? "conditionalBranchingDisabled"
            : "ruleMetadataUnavailable";

        dispatch(
            addAlert({
                description: t(`flows:core.notifications.${notification}.warning.description`),
                level: AlertLevels.WARNING,
                message: t(`flows:core.notifications.${notification}.warning.message`)
            })
        );
    }, [ ruleMetadataError, nodes ]);

    /**
     * The palette leaves out the decision step when conditional branching is not available, while the canvas keeps
     * every resource so that decision steps already in the flow still render.
     */
    const paletteResources: Resources = useMemo(
        () => (isConditionalBranchingEnabled ? resources : withoutDecisionSteps(resources)),
        [ resources, isConditionalBranchingEnabled ]
    );

    useEffect(() => {
        if (aiGeneratedFlow) {
            handleOnAdd(aiGeneratedFlow);
        }
    }, [ aiGeneratedFlow ]);

    const addCanvasNode = (event: any, sourceData: any, _targetData: any): void => {
        const sourceResource: any = cloneDeep(sourceData.dragged);
        const { clientX, clientY } = event?.nativeEvent;

        if (sourceResource?.type === StepTypes.RuleEvaluation) {
            if (!isConditionalBranchingEnabled) {
                return;
            }

            const maxDecisionNodes: number = ruleLimits?.maxDecisionNodes
                ?? FlowConstants.DEFAULT_MAX_DECISION_NODES;

            if (isDecisionStepLimitReached(nodes, maxDecisionNodes)) {
                dispatch(
                    addAlert({
                        description: t("flows:core.notifications.decisionStepLimit.warning.description",
                            { max: maxDecisionNodes }),
                        level: AlertLevels.WARNING,
                        message: t("flows:core.notifications.decisionStepLimit.warning.message")
                    })
                );

                return;
            }
        }

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

        // A rule decision is only valid with its default branch, so it is given one before it is
        // handed to the flow specific decoration.
        generatedStep = seedRuleDecisionBranches(generatedStep);

        // Decorate the step with any additional information
        generatedStep = onStepLoad(generatedStep);

        setNodes((nodes: Node[]) => [ ...nodes, generatedStep ]);

        onResourceDropOnCanvas(generatedStep as Step, generatedStep?.id ?? null);
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

            // Auto-assign connections for execution steps.
            autoAssignConnections([ ...newNodes, defaultPropertySelector as Node ], metadata.executorConnections);

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

        // Branch rows live in the property panel, which is inside this provider, so their drags
        // arrive here too. They reorder the decision's branches rather than a view's components.
        if (sourceData.isBranchReordering) {
            updateNodeData(sourceData.stepId, (node: any) => {
                const action: any = node?.data?.action ?? {};

                return {
                    action: {
                        ...action,
                        branches: reorderBranches(action.branches ?? [], (conditional: any[]) =>
                            move(conditional, event))
                    }
                };
            });

            return;
        }

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
                        outgoers.map(({ id: target }: { id: string }) => {
                            // Find the edge from incomer to the node being deleted.
                            const edge: Edge = connectedEdges.find(
                                (e: Edge) => e.source === source && e.target === node.id
                            );

                            return {
                                id: `${edge.source}->${target}`,
                                source,
                                sourceHandle: edge?.sourceHandle,
                                target,
                                type: edge?.type
                            };
                        })
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

        // Auto-assign connections for execution steps.
        autoAssignConnections(newNodes, metadata.executorConnections);

        // TODO: Figure-out a better way to handle this debounce.
        // Tracker: https://github.com/xyflow/xyflow/issues/2405
        setTimeout(() => {
            // Letting React Flow know of the programmatic updates to node for re-drawing edges.
            setNodes((currentNodes: Node[]) => {
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

                // A template replaces the steps, not the variables of the flow, which the start node keeps.
                const variables: unknown = currentNodes.find(
                    (node: Node) => node.id === START_STEP_ID
                )?.data?.variables;

                if (!variables) {
                    return newNodes;
                }

                return newNodes.map((node: Node) => node.id === START_STEP_ID
                    ? { ...node, data: { ...node.data, variables } }
                    : node);
            });

            setEdges(() => [ ...newEdges ]);
        }, 500);

        onResourceDropOnCanvas(defaultPropertySelector ?? resource, defaultPropertySectorStepId ?? null);
    };

    return (
        <div className={ classNames("decorated-visual-flow", "react-flow-container") } data-componentid={ componentId }>
            <DragDropProvider onDragEnd={ handleDragEnd } onDragOver={ handleDragOver }>
                <ResourcePanel
                    resources={ paletteResources }
                    open={ isResourcePanelOpen }
                    onAdd={ handleOnAdd }
                    disabled={ isFlowMetadataLoading }
                >
                    <ElementPropertiesPanel
                        open={ isResourcePropertiesPanelOpen }
                        onComponentDelete={ deleteComponent }
                    >
                        <VersionHistoryPanel open={ isVersionHistoryPanelOpen }>
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
                        </VersionHistoryPanel>
                    </ElementPropertiesPanel>
                    <ValidationPanel />
                </ResourcePanel>
            </DragDropProvider>
        </div>
    );
};

export default DecoratedVisualFlow;
