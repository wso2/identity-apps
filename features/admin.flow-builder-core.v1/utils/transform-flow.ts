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
    PayloadBlocks,
    PayloadElement,
    PayloadElements,
    PayloadFlow,
    PayloadNode,
    PayloadNodes
} from "../models/api";
import { Element } from "../models/elements";
import { NodeData } from "../models/node";

const DISPLAY_ONLY_ELEMENT_PROPERTIES: string[] = [ "display", "version", "variants" ];

const transformFlow = (flowState: any): Payload => {
    const { nodes: flowNodes } = flowState;

    const flow: PayloadFlow = {
        pages: []
    };
    const nodes: PayloadNodes = [];
    const blocks: PayloadBlocks = [];
    const elements: PayloadElements = [];

    flowNodes.forEach((node: XYFlowNode<NodeData>, index: number) => {
        flow.pages.push({
            id: `flow-page-${index + 1}`,
            nodes: [ node.id ]
        });

        nodes.push({
            actions: node.data.components.map((action: Element) => {
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
            }),
            elements: node.data.components.map((component: Element) => component.id),
            id: node.id
        } as PayloadNode);

        blocks.push({
            id: `flow-block-${index + 1}`,
            elements: node.data.components
                .filter(
                    (component: Element) =>
                        (component.category === "FIELD" || component.category === "ACTION") &&
                        component.config?.field?.type === "submit"
                )
                .map((component: Element) => component.id)
        });

        elements.push(
            ...(node.data.components.map((component: Element) =>
                omit(component, DISPLAY_ONLY_ELEMENT_PROPERTIES)
            ) as PayloadElements)
        );
    });

    return {
        flow,
        nodes,
        blocks,
        elements
    };
};

export default transformFlow;
