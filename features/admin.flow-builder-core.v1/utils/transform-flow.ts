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
    Payload,
    Action as PayloadAction,
    Block as PayloadBlock,
    Element as PayloadElement,
    Node as PayloadNode
} from "../models/api";
import { Element } from "../models/elements";
import { NodeData } from "../models/node";

const DISPLAY_ONLY_ELEMENT_PROPERTIES: string[] = [ "display", "version", "variants" ];

const groupNodesIntoPages = (nodes: any[], edges: any[]): any[] => {
    const nodePages: Record<string, string[]> = {};
    const visitedNodes = new Set<string>();

    const traverseNodes = (nodeId: string, pageId: string) => {
        if (visitedNodes.has(nodeId)) return;
        visitedNodes.add(nodeId);

        if (!nodePages[pageId]) {
            nodePages[pageId] = [];
        }
        nodePages[pageId].push(nodeId);

        const connectedEdges = edges.filter((edge: any) => edge.source === nodeId);

        connectedEdges.forEach((edge: any) => {
            const nextNodeId = edge.target;

            traverseNodes(nextNodeId, pageId + 1);
        });
    };

    nodes.forEach((node: any) => {
        if (!visitedNodes.has(node.id)) {
            const pageId = `flow-page-${Object.keys(nodePages).length + 1}`;

            traverseNodes(node.id, pageId);
        }
    });

    return Object.keys(nodePages).map((pageId) => ({
        id: pageId,
        nodes: nodePages[pageId]
    }));
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

    const nodeIdToNextNodes: Record<string, string[]> = {};

    // Build a map of node IDs to their next connected nodes
    flowEdges.forEach((edge: any) => {
        if (!nodeIdToNextNodes[edge.source]) {
            nodeIdToNextNodes[edge.source] = [];
        }
        nodeIdToNextNodes[edge.source].push(edge.target);
    });

    flowNodes.forEach((node: XYFlowNode<NodeData>, index: number) => {
        const nodeActions: PayloadAction[] = node.data?.components?.filter((component: Element) => component.category === "ACTION").map((action: Element) => {
            let _action: any = {
                id: action.id,
                action: action.meta,
                next: nodeIdToNextNodes[node.id] || []
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
            id: node.id,
            elements: nodeElements,
            actions: nodeActions
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
