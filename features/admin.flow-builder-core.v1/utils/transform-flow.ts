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

const groupNodesIntoPages = (nodes: string[], edges: any[]): any => {
    // Create a directed adjacency list to represent the graph
    const createGraph = (edges: any[]) => {
        const graph: Record<string, string[]> = {};
        const inDegree: Record<string, number> = {};
        const outDegree: Record<string, number> = {};

        // Initialize nodes and degree tracking
        edges.forEach((edge) => {
            const { source, target } = edge;

            if (!graph[source]) graph[source] = [];
            if (!graph[target]) graph[target] = [];
            if (!inDegree[source]) inDegree[source] = 0;
            if (!inDegree[target]) inDegree[target] = 0;
            if (!outDegree[source]) outDegree[source] = 0;
            if (!outDegree[target]) outDegree[target] = 0;

            graph[source].push(target);
            inDegree[target]++;
            outDegree[source]++;
        });

        return { graph, inDegree, outDegree, edges };
    };

    // Determine page distribution strategy based on edges
    const distributeNodesToPagesWithEdgeOrder = (graphData: {
        graph: Record<string, string[]>,
        inDegree: Record<string, number>,
        outDegree: Record<string, number>,
        edges: any[]
    }) => {
        const { graph, inDegree, edges } = graphData;
        const pages: any[] = [];
        const usedNodes = new Set<string>();

        // Find source nodes (nodes with no incoming edges)
        const sourceNodes = Object.keys(inDegree).filter(node => inDegree[node] === 0);

        // Traverse nodes and group them into pages
        const traverseNodes = (nodeId: string, pageId: string) => {
            if (usedNodes.has(nodeId)) return;
            usedNodes.add(nodeId);

            if (!pages[pageId]) {
                pages[pageId] = {
                    id: `flow-page-${pages.length + 1}`,
                    nodes: []
                };
            }
            pages[pageId].nodes.push(nodeId);

            const connectedEdges = edges.filter((edge: any) => edge.source === nodeId);
            connectedEdges.forEach((edge: any) => {
                traverseNodes(edge.target, pageId + 1);
            });
        };

        sourceNodes.forEach((sourceNode) => {
            traverseNodes(sourceNode, 0);
        });

        return pages;
    };

    const graphData = createGraph(edges);
    const pages = distributeNodesToPagesWithEdgeOrder(graphData);

    console.log("graph", JSON.stringify(graphData.graph, null, 2));
    console.log("pages", JSON.stringify(pages, null, 2));

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
