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
import { InputVariants } from "../models/component";
import { Element } from "../models/elements";
import { NodeData } from "../models/node";

const DISPLAY_ONLY_ELEMENT_PROPERTIES: string[] = [ "display", "version", "variants", "deprecated", "meta" ];

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

    return Object.keys(nodePages).map(pageId => ({
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

    const nextNodeMap: Record<string, string[]> = {};

    flowEdges.forEach((edge: any) => {
        nextNodeMap[edge.sourceHandle.replace("-NEXT", "").replace("-PREVIOUS", "")] = [ edge.target ];
    });

    flowNodes.forEach((node: XYFlowNode<NodeData>, index: number) => {
        const nodeActions: PayloadAction[] = node.data?.components
            ?.filter((component: Element) => component.category === "ACTION")
            .map((action: Element) => {
                let _action: any = {
                    id: action.id,
                    action: action.meta,
                    next: node.data.components.map((component: Element) => {
                        if (component.id === action.id) {
                            if (nextNodeMap[component.id]) {
                                return nextNodeMap[component.id];
                            }
                        }
                    }).flat().filter(Boolean)
                };

                if (action?.config?.field?.type === "submit") {
                    // If there are password fields in the form, add a `CREDENTIAL_ONBOARDING` action type to all the submit actions
                    // TODO: Improve.
                    if (
                        node.data?.components?.some(
                            (component: Element) => component?.variant === InputVariants.Password
                        )
                    ) {
                        if (_action?.action?.executors) {
                            _action = {
                                ..._action,
                                action: {
                                    ..._action.action,
                                    executors: _action.action?.executors?.map((executor: any) => {
                                        return {
                                            ...executor,
                                            meta: {
                                                ...(executor?.meta || {}),
                                                actionType: "CREDENTIAL_ONBOARDING"
                                            }
                                        };
                                    })
                                }
                            };
                        } else {
                            _action = {
                                ..._action,
                                action: {
                                    ...(_action.action || {}),
                                    meta: {
                                        ...(_action?.action?.meta || {}),
                                        actionType: "CREDENTIAL_ONBOARDING"
                                    }
                                }
                            };
                        }
                    } else {
                        if (_action?.action?.executors) {
                            _action = {
                                ..._action,
                                action: {
                                    ..._action.action,
                                    executors: _action.action?.executors?.map((executor: any) => {
                                        return {
                                            ...executor,
                                            meta: {
                                                ...(executor?.meta || {}),
                                                actionType: "ATTRIBUTE_COLLECTION"
                                            }
                                        };
                                    })
                                }
                            };
                        } else {
                            _action = {
                                ..._action,
                                action: {
                                    ...(_action?.action || {}),
                                    meta: {
                                        ...(_action?.action?.meta || {}),
                                        actionType: "ATTRIBUTE_COLLECTION"
                                    }
                                }
                            };
                        }
                    }
                }

                return _action;
            });

        let currentBlock: PayloadBlock | null = null;
        const nodeElements: string[] = [];
        const nonBlockElements: string[] = [];

        // Identify the last ACTION with type "submit"
        const lastSubmitActionIndex = node.data?.components
            ?.map((component: Element, index: number) => ({ component, index }))
            .reverse()
            .find(({ component }) => component.category === "ACTION" && component?.config?.field?.type === "submit")
            ?.index;

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
            ) as PayloadElement[])
        );
    });

    // Add `next: ["COMPLETE"] to the last nodes' actions
    // TODO: Improve.
    const lastNode = payload.nodes[payload.nodes.length - 1];

    lastNode.actions.forEach((action: PayloadAction) => {
        action.next = [ "COMPLETE" ];
    });

    payload.flow.pages = groupNodesIntoPages(flowNodes, flowEdges);

    return payload;
};

export default transformFlow;
