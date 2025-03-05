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

import { Node } from "@xyflow/react";
import cloneDeep from "lodash-es/cloneDeep";
import omit from "lodash-es/omit";
import ButtonAdapterConstants from "../constants/button-adapter-constants";
import { ActionTypes } from "../models/actions";
import { Element, ElementCategories } from "../models/elements";

const DISPLAY_ONLY_ELEMENT_PROPERTIES: string[] = [ "display", "version", "variants", "deprecated", "meta", "resourceType" ];

const processActions = (component, navigations) => {
    if (component.category === ElementCategories.Action) {
        let action: any = {
            ...(navigations[component.id] && { next: navigations[component.id], type: ActionTypes.Next })
        };

       if (component?.action?.type === ActionTypes.Executor) {
            action = {
                ...component?.action,
                next: navigations[component.id]
            };
        }

        return {
            ...component,
            action
        };
    }

    return component;
};

const transformFlow = (flowState: any) => {
    const { nodes: flowNodes, edges: flowEdges } = cloneDeep(flowState);

    const payload = {
        steps: []
    };

    const stepNavigationMap: Record<string, string> = {};

    flowEdges.forEach((edge: any) => {
        stepNavigationMap[
            edge.sourceHandle
                ?.replace(ButtonAdapterConstants.NEXT_BUTTON_HANDLE_SUFFIX, "")
                ?.replace(ButtonAdapterConstants.PREVIOUS_BUTTON_HANDLE_SUFFIX, "")
        ] = edge.target;
    });

    const filteredFlowNodes = flowNodes.filter((node: Node) => node.data.displayOnly !== true);

    filteredFlowNodes.forEach((node: any) => {
        const { data, id, position, measured, type } = node;

        const processElements = (elements: Element[]) => {
            const _elements: Element[] = elements?.map((element: any) => {
                if (element.components) {
                    element.components = processElements(element.components);
                }

                return processActions(omit(element, DISPLAY_ONLY_ELEMENT_PROPERTIES), stepNavigationMap);
            });

            return _elements;
        };

        /* eslint-disable sort-keys */
        payload.steps.push({
            id,
            type,
            size: measured,
            position,
            data: {
                components: processElements(data.components)
            }
        });
        /* eslint-disable sort-keys */
    });

    return payload;
};

export default transformFlow;
