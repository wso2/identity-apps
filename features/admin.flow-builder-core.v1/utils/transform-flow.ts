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
import { Payload } from "../models/api";
import { Element } from "../models/elements";
import { NodeData } from "../models/node";

const DISPLAY_ONLY_ELEMENT_PROPERTIES: string[] = [ "display", "version", "variants" ];

const transformFlow = (flowState: any): Payload => {
    /* eslint-disable sort-keys */
    const output: Payload = {
        flow: {
            pages: [
                {
                    id: "flow-page-1",
                    // Add all node IDs for the page
                    nodes: flowState.nodes.map((node: XYFlowNode<NodeData>) => node.id)
                }
            ]
        },
        nodes: flowState.nodes.map((node: XYFlowNode<NodeData>) => {
            // Filter FIELD elements and ACTION buttons of type "submit"
            const submitElements = node.data.components.filter((component: Element) =>
                (component.category === "FIELD" || component.category === "ACTION") &&
                component.config?.field?.type === "submit"
            );

            // Handle actions separately
            const actions = submitElements.map((action: Element) => {
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

            return {
                actions,
                elements: node.data.components.map((component: Element) => component.id),
                id: node.id
            };
        }),
        blocks: flowState.nodes.map((node: XYFlowNode<NodeData>, index: number) => ({
            // For each node, create a block containing the components of type "submit"
            id: `flow-block-${index + 1}`,
            elements: node.data.components
                .filter((component: Element) =>
                    (component.category === "FIELD" || component.category === "ACTION") &&
                    component.config?.field?.type === "submit"
                )
                .map((component: Element) => component.id) // Collect only submit buttons and fields
        })),
        elements: flowState.nodes.flatMap((node: XYFlowNode<NodeData>) =>
            node.data.components.map((component: Element) =>
                omit(component, DISPLAY_ONLY_ELEMENT_PROPERTIES)
            )
        )
    };
    /* eslint-enable sort-keys */

    return output;
};

export default transformFlow;
