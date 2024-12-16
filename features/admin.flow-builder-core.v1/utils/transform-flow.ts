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
    const output: Payload = {
        blocks: [
            {
                id: "flow-block-1",
                nodes: flowState.nodes[0].data.components.map((component: Element) => component.id)
            }
        ],
        elements: flowState.nodes[0].data.components.map((component: Element) =>
            omit(component, DISPLAY_ONLY_ELEMENT_PROPERTIES)
        ),
        flow: {
            pages: [
                {
                    id: "flow-page-1",
                    nodes: [ flowState.nodes[0].id ]
                }
            ]
        },
        nodes: flowState.nodes.map((node: XYFlowNode<NodeData>) => ({
            actions: node.data.components
                .filter((component: Element) => component.category === "ACTION")
                .map((action: Element) => ({
                    action: {
                        meta: {
                            actionType: "ATTRIBUTE_COLLECTION"
                        },
                        type: "NEXT"
                    },
                    id: action.id,
                    next: [ "COMPLETE" ]
                })),
            elements: node.data.components.map((component: Element) => component.id),
            id: node.id
        }))
    };

    return output;
};

export default transformFlow;
