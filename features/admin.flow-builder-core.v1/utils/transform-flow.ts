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

import { Node as XYFlowNode } from "@xyflow/react";
import omit from "lodash-es/omit";
import {
    Payload as Payload,
    Action as PayloadAction,
    Block as PayloadBlock,
    Element as PayloadElement,
    Node as PayloadNode
} from "../models/api";
import { Element } from "../models/elements";
import { NodeData } from "../models/node";

const DISPLAY_ONLY_ELEMENT_PROPERTIES: string[] = [ "display", "version", "variants" ];

const groupNodesIntoPages = (nodes: any[], edges: any[]): any => {
    console.log("nodes", JSON.stringify(nodes));
    console.log("edges", JSON.stringify(edges));

    const createGraphFromEdges = (edges: any[]) => {
        const graph: Record<string, string[]> = {}; // Holds the graph structure

        // Iterate through each edge and build the graph
        edges.forEach((edge) => {
            const { source, target } = edge;

            // Initialize the source node if not already present
            if (!graph[source]) {
                graph[source] = [];
            }
            // Initialize the target node if not already present
            if (!graph[target]) {
                graph[target] = [];
            }

            // Add the target node to the source node's list of connections
            graph[source].push(target);
            // Add the source node to the target node's list of connections (undirected graph)
            graph[target].push(source);
        });

        return graph;
    };

    const derivePagesFromGraph = (graph: Record<string, string[]>) => {
        const pages: any[] = [];
        const visited: Set<string> = new Set();
        let pageId = 1;

        // Helper function to perform DFS
        const dfs = (node: string, path: string[]) => {
            if (visited.has(node)) {
                return;
            }

            visited.add(node);
            path.push(node);

            const neighbors = graph[node] || [];
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    dfs(neighbor, path);
                }
            }
        };

        // Create a map to group nodes by their target
        const targetGroups: Record<string, string[]> = {};

        // Iterate over all edges to create target-based groups
        edges.forEach((edge) => {
            const { source, target } = edge;

            // Initialize the target group if not already present
            if (!targetGroups[target]) {
                targetGroups[target] = [];
            }

            // Add the source node to the group of its target
            targetGroups[target].push(source);
        });

        // Now, create flow pages based on the target groups
        Object.keys(targetGroups).forEach((target) => {
            const flowPage = {
                id: `flow-page-${pageId++}`,
                nodes: targetGroups[target], // All sources that lead to this target
            };

            pages.push(flowPage);
        });

        return pages;
    };

    const graph = createGraphFromEdges(edges);
    const pages = derivePagesFromGraph(graph);

    // Construct the final "flow" object
    return pages;
};

const transformFlow = (flowState: any): Payload => {
    const { nodes: flowNodes, edges: flowEdges } = flowState;

    const payload: Payload = {
        flow: {
            pages: []
        },
        nodes: [],
        blocks: [],
        elements: []
    };

    flowNodes.forEach((node: XYFlowNode<NodeData>, index: number) => {
        const nodeActions: PayloadAction[] = node.data?.components?.filter((component: Element) => component.category === "ACTION").map((action: Element) => {
                let _action: any = {
                    id: action.id,
                    ...action.meta
                };

                if (!action.meta && action?.config?.field?.type === "submit") {
                    _action = {
                        ..._action,
                        action: {
                            ..._action.action,
                            meta: {
                                actionType: "ATTRIBUTE_COLLECTION"
                            }
                        }
                    };
                }

                return _action;
            });

        let currentBlock: PayloadBlock | null = null;
        const nodeElements: string[] = [];
        const nonBlockElements: string[] = [];

        // Identify the last ACTION with type "submit"
        const lastSubmitActionIndex = node.data?.components?.map((component: Element, index: number) => ({ component, index }))
            .reverse()
            .find(({ component }) => component.category === "ACTION" && component?.config?.field?.type === "submit")?.index;

        node.data?.components?.forEach((component: Element, index: number) => {
            if (currentBlock) {
                currentBlock.elements.push(component.id);
                if (index === lastSubmitActionIndex) {
                    currentBlock = null;
                }
            } else {
                if (component.category === "FIELD") {
                    currentBlock = {
                        id: `flow-block-${payload.blocks.length + 1}`,
                        elements: [ component.id ]
                    };
                    payload.blocks.push(currentBlock);
                    nodeElements.push(currentBlock.id);
                } else {
                    nodeElements.push(component.id);
                }
            }
        });

        payload.nodes.push({
            actions: nodeActions,
            elements: nodeElements,
            id: node.id
        } as PayloadNode);

        payload.elements.push(
            ...(node.data?.components?.map((component: Element) =>
                omit(component, DISPLAY_ONLY_ELEMENT_PROPERTIES)
            )) as PayloadElement[]
        );
    });

    payload.flow.pages = groupNodesIntoPages(flowNodes, flowEdges);

    return payload;
};

export default transformFlow;
