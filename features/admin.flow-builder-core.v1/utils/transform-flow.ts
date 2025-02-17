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

import { Edge, Node as XYFlowNode } from "@xyflow/react";
import omit from "lodash-es/omit";
import set from "lodash-es/set";
import { v4 as uuidv4 } from "uuid";
import { ActionTypes } from "../models/actions";
import {
    Payload,
    Action as PayloadAction,
    Block as PayloadBlock,
    Node as PayloadNode
} from "../models/api";
import { Element, InputVariants } from "../models/elements";
import { Resource } from "../models/resources";
import { StepData } from "../models/steps";

const DISPLAY_ONLY_ELEMENT_PROPERTIES: string[] = [ "display", "version", "variants", "deprecated", "meta" ];

const groupNodesIntoPages = (nodes: any[], edges: any[]): any[] => {
    const nodePages: Record<string, string[]> = {};
    const visitedNodes: Set<string> = new Set<string>();

    const traverseNodes = (nodeId: string, pageId: string) => {
        if (visitedNodes.has(nodeId)) return;
        visitedNodes.add(nodeId);

        if (!nodePages[pageId]) {
            nodePages[pageId] = [];
        }
        nodePages[pageId].push(nodeId);

        const connectedEdges: Edge[] = edges.filter((edge: any) => edge.source === nodeId);

        connectedEdges.forEach((edge: any) => {
            const nextNodeId: string = edge.target;

            traverseNodes(nextNodeId, pageId + 1);
        });
    };

    nodes.forEach((node: any) => {
        if (!visitedNodes.has(node.id)) {
            const pageId: string = `flow-page-${uuidv4()}`;

            traverseNodes(node.id, pageId);
        }
    });

    return Object.keys(nodePages).map((pageId: string) => ({
        id: pageId,
        nodes: nodePages[pageId]
    }));
};

const transformFlow = (flowState: any): Payload => {
    const { nodes: flowNodes, edges: flowEdges } = flowState;

    const payload: Payload = {
        blocks: [],
        elements: [],
        flow: {
            pages: []
        },
        nodes: []
    };

    const nodeNavigationMap: Record<string, string[]> = {};

    flowEdges.forEach((edge: any) => {
        nodeNavigationMap[edge.sourceHandle.replace("-NEXT", "").replace("-PREVIOUS", "")] = [ edge.target ];
    });

    flowNodes.forEach((node: XYFlowNode<StepData>) => {
        const nodeActions: PayloadAction[] = node.data?.components
            ?.filter((component: Resource) => component.category === "ACTION")
            .map((action: Resource) => {
                const navigation: string[] = node.data.components
                    .map((component: Resource) => {
                        if (component.id === action.id) {
                            if (nodeNavigationMap[component.id]) {
                                return nodeNavigationMap[component.id];
                            }
                        }
                    })
                    .flat()
                    .filter(Boolean);

                let _action: any = {
                    action: action.meta,
                    id: action.id
                };

                if (_action.action?.type === ActionTypes.Next || _action.action?.type === ActionTypes.Executor) {
                    _action.next = navigation;
                } else if (_action.action?.type === ActionTypes.Previous) {
                    _action.previous = navigation;
                }

                if (action?.config?.field?.type === "submit") {
                    // TODO: Improve this. If there are password fields in the form, add a `CREDENTIAL_ONBOARDING`
                    // action type to all the submit actions.
                    if (
                        _action.action?.type === ActionTypes.Next &&
                        node.data?.components?.some(
                            (component: Resource) => component?.variant === InputVariants.Password
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
                        // const actionType: string = _action.action?.meta?.actionType || "ATTRIBUTE_COLLECTION";
                        // if (_action?.action?.executors) {
                        //     _action = {
                        //         ..._action,
                        //         action: {
                        //             ..._action.action,
                        //             executors: _action.action?.executors?.map((executor: any) => {
                        //                 return {
                        //                     ...executor,
                        //                     meta: {
                        //                         ...(executor?.meta || {}),
                        //                         actionType: actionType
                        //                     }
                        //                 };
                        //             })
                        //         }
                        //     };
                        // } else {
                        //     _action = {
                        //         ..._action,
                        //         action: {
                        //             ...(_action?.action || {}),
                        //             meta: {
                        //                 ...(_action?.action?.meta || {}),
                        //                 actionType: actionType
                        //             }
                        //         }
                        //     };
                        // }
                    }
                }

                // TODO: Fix this. When the action type is not manually selected, `type` becomes `undefined`.
                if (!_action.action?.type) {
                    set(_action, "action.type", ActionTypes.Next);
                }

                return _action;
            });

        let currentBlock: PayloadBlock | null = null;
        const nodeElements: string[] = [];

        // Identify the last ACTION with type "submit"
        const lastSubmitActionIndex: number = node.data?.components
            ?.map((component: Resource, index: number) => ({ component, index }))
            .reverse()
            .find(
                ({ component }: { component: Resource }) =>
                    component.category === "ACTION" && component?.config?.field?.type === "submit"
            )?.index;

        node.data?.components?.forEach((component: Resource, index: number) => {
            if (currentBlock) {
                currentBlock.elements.push(component.id);
                if (index === lastSubmitActionIndex) {
                    currentBlock = null;
                }
            } else {
                if (component.category === "FIELD") {
                    currentBlock = {
                        elements: [ component.id ],
                        id: `flow-block-${uuidv4()}`
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
            ...(node.data?.components?.map((component: Resource) =>
                omit(component, DISPLAY_ONLY_ELEMENT_PROPERTIES)
            ) as Element[])
        );
    });

    // Add `next: ["COMPLETE"] to the last nodes' actions
    // TODO: Improve.
    const lastNode: PayloadNode = payload.nodes[payload.nodes.length - 1];

    lastNode.actions.forEach((action: PayloadAction) => {
        if (action.action?.type === ActionTypes.Next) {
            action.next = [ "COMPLETE" ];
        }
    });

    payload.flow.pages = groupNodesIntoPages(flowNodes, flowEdges);

    return payload;
};

export default transformFlow;
