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

const transformFlow = (flowState: any): Payload => {
    const { nodes: flowNodes } = flowState;

    const payload: Payload = {
        flow: {
            pages: []
        },
        nodes: [],
        blocks: [],
        elements: []
    };

    flowNodes.forEach((node: XYFlowNode<NodeData>, index: number) => {
        payload.flow.pages.push({
            id: `flow-page-${index + 1}`,
            nodes: [ node.id ]
        });

        const nodeActions: PayloadAction[] = node.data.components
            .filter((component: Element) => component.category === "ACTION")
            .map((action: Element) => {
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
        const lastSubmitActionIndex = node.data.components
            .map((component: Element, index: number) => ({ component, index }))
            .reverse()
            .find(({ component }) => component.category === "ACTION" && component?.config?.field?.type === "submit")?.index;

        node.data.components.forEach((component: Element, index: number) => {
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
            ...(node.data.components.map((component: Element) =>
                omit(component, DISPLAY_ONLY_ELEMENT_PROPERTIES)
            )) as PayloadElement[]
        );
    });

    return payload;
};

export default transformFlow;
