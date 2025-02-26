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

import { Edge, Node, Node as XYFlowNode } from "@xyflow/react";
import omit from "lodash-es/omit";
import set from "lodash-es/set";
import { v4 as uuidv4 } from "uuid";
import { ActionTypes } from "../models/actions";
import { Element, ElementCategories, InputVariants } from "../models/elements";
import { Resource } from "../models/resources";
import { StepData } from "../models/steps";

const DISPLAY_ONLY_ELEMENT_PROPERTIES: string[] = [ "display", "version", "variants", "deprecated", "meta" ];

const processActions = (component, navigations) => {
    if (component.category === ElementCategories.Action) {
        let action: any = {
            ...(navigations[component.id] && { next: navigations[component.id], type: ActionTypes.Next })
        };

        if (component?.meta?.type === ActionTypes.Next) {
            action = {
                ...action,
                type: ActionTypes.Next,
            };
        } else if (component?.meta?.type === ActionTypes.Executor) {
            action = {
                ...action,
                type: ActionTypes.Executor,
                executor: component.meta?.executor,
            };
        }

        return {
            ...component,
            action
        };
    }

    return component;
};

const filterElementPropertiesForPayload = element => {
    const { deprecated, display, resourceType, version, variants, ...rest } = element;

    return rest;
};

const transformFlow = (flowState: any) => {
    const { nodes: flowNodes, edges: flowEdges } = flowState;

    const payload = {
        steps: []
    };

    const stepNavigationMap: Record<string, string> = {};

    flowEdges.forEach((edge: any) => {
        stepNavigationMap[edge.sourceHandle?.replace("-NEXT", "")?.replace("-PREVIOUS", "")] = edge.target;
    });

    const filteredFlowNodes = flowNodes.filter((node: Node) => node.data.displayOnly !== true);

    filteredFlowNodes.forEach((node: any) => {
        const { data, id, position, measured, type } = node;

        const processElements = (elements: Element[]) => {
            const _elements: Element[] = elements.map((element: any) => {
                return processActions(filterElementPropertiesForPayload(element), stepNavigationMap);
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
                components: processElements(data.elements)
            }
        });
        /* eslint-disable sort-keys */
    });

    return payload;
};

export default transformFlow;
