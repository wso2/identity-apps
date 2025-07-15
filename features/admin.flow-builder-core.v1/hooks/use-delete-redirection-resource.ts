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

import { Edge, Node, useReactFlow } from "@xyflow/react";
import { useEffect } from "react";
import useAuthenticationFlowBuilderCore from "./use-authentication-flow-builder-core-context";
import VisualFlowConstants from "../constants/visual-flow-constants";
import { ActionTypes } from "../models/actions";
import { Element, ElementCategories } from "../models/elements";
import { EventTypes } from "../models/extension";
import { StepTypes } from "../models/steps";
import PluginRegistry from "../plugins/plugin-registry";

/**
 * Custom hook to handle the deletion of redirection resources in the flow builder.
 *
 * This hook registers an event listener for node deletion events and ensures that
 * any associated redirection action nodes are also deleted when a redirection node is removed.
 */
const useDeleteRedirectionResource = (): void => {

    const { setIsOpenResourcePropertiesPanel } = useAuthenticationFlowBuilderCore();
    const { getEdges, getNodes, updateNodeData, setNodes } = useReactFlow();

    useEffect(() => {
        deleteComponentAndNode[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER] = "deleteComponentAndNode";
        deleteRedirectionNode[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER] = "deleteRedirectionNode";
        deleteRedirectionActionNode[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER] =
            "deleteRedirectionActionNode";

        PluginRegistry.getInstance().registerAsync(EventTypes.ON_NODE_DELETE, deleteRedirectionActionNode);
        PluginRegistry.getInstance().registerAsync(EventTypes.ON_NODE_ELEMENT_DELETE, deleteRedirectionNode);
        PluginRegistry.getInstance().registerAsync(EventTypes.ON_EDGE_DELETE, deleteComponentAndNode);

        return () => {
            PluginRegistry.getInstance().unregister(EventTypes.ON_NODE_DELETE, deleteRedirectionActionNode.name);
            PluginRegistry.getInstance().unregister(EventTypes.ON_NODE_ELEMENT_DELETE,
                deleteRedirectionNode.name);
            PluginRegistry.getInstance().unregister(EventTypes.ON_EDGE_DELETE, deleteComponentAndNode.name);
        };
    }, []);

    /**
     * Deletes associated redirection components when redirection nodes are removed.
     *
     * This utility function ensures that when a redirection node is deleted from the flow,
     * any related redirection initiation action components are also removed to maintain consistency.
     *
     * @param deleted - An array of nodes that have been deleted from the flow.
     */
    const deleteRedirectionActionNode = async (
        deleted: Node[]
    ): Promise<boolean> => {

        const nodes: Node[] = getNodes();
        const edges: Edge[] = getEdges();
        const actionNodes: Node[] = [];
        const actionComponentIds: string[] = [];

        deleted.forEach((node: Node) => {
            if (node?.type === StepTypes.Redirection) {
                const actionNode: Node[] = nodes?.filter((n: Node) => {
                    return edges?.some((edge: Edge) => {
                        if (edge.target === node.id && edge.source === n.id
                                && edge.sourceHandle.includes(VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX)) {
                            actionComponentIds.push(edge.sourceHandle.slice(0,
                                -VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX.length));

                            return true;
                        }

                        return false;
                    });
                });

                if (actionNode?.length > 0) {
                    actionNodes.push(...actionNode);
                }
            }
        });

        // If no action nodes are found, return true to indicate no further action is needed.
        if (actionNodes.length === 0) {
            return true;
        }

        actionNodes.forEach((actionNode: Node) => {
            updateNodeData(actionNode.id, (node: Node) => {
                const components: Element[] = (node.data.components as Element[])?.filter((component: Element) => {
                    return !actionComponentIds.includes(component.id);
                });

                return {
                    components
                };
            });
        });
        setIsOpenResourcePropertiesPanel(false);

        return true;
    };

    /**
     * Deletes the redirection node when a redirection action is removed.
     *
     * @param _stepId - The ID of the step from which the element is being deleted.
     * @param element - The element being deleted, which is expected to be a redirection action.
     * @returns Returns true if the deletion was successful.
     */
    const deleteRedirectionNode = async (
        _stepId: string,
        element: Element
    ): Promise<boolean> => {

        if (element.category === ElementCategories.Action && element?.action?.type === ActionTypes.Next) {
            setNodes((nodes: Node[]) => nodes?.filter((node: Node) =>
                node.id !== element?.action?.next || node.type !== StepTypes.Redirection));
        }

        return true;
    };

    /**
     * Deletes the component and node associated with the deleted edges.
     *
     * @param deleted - The deleted edges from the flow.
     * @returns Returns true if the deletion was successful.
     */
    const deleteComponentAndNode = async (
        deleted: Edge[]
    ): Promise<boolean> => {

        const nodes: Node[] = getNodes();
        const redirectionNodeIds: string[] = [];
        const actionNodeIds: string[] = [];
        const actionComponentIds: string[] = [];

        deleted.forEach((edge: Edge) => {
            nodes.forEach((node: Node) => {
                if (node.type === StepTypes.Redirection && edge.target === node.id) {
                    actionComponentIds.push(edge.sourceHandle.slice(0,
                        -VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX.length));
                    actionNodeIds.push(edge.source);
                    redirectionNodeIds.push(edge.target);
                }
            });
        });

        if (redirectionNodeIds.length === 0) {
            return true;
        }

        setNodes((nodes: Node[]) => nodes?.filter((node: Node) => !redirectionNodeIds.includes(node.id)));

        actionNodeIds.forEach((actionNodeId: string) => {
            updateNodeData(actionNodeId, (node: Node) => {
                const components: Element[] = (node.data.components as Element[])?.filter((component: Element) => {
                    return !actionComponentIds.includes(component.id);
                });

                return {
                    components
                };
            });
        });
        setIsOpenResourcePropertiesPanel(false);

        return true;
    };
};

export default useDeleteRedirectionResource;
