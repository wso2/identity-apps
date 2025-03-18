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

import VisualFlowConstants from "@wso2is/admin.flow-builder-core.v1/constants/visual-flow-constants";
import { ActionTypes } from "@wso2is/admin.flow-builder-core.v1/models/actions";
import { Element, ElementCategories } from "@wso2is/admin.flow-builder-core.v1/models/elements";
import { StaticStepTypes, Step } from "@wso2is/admin.flow-builder-core.v1/models/steps";
import { Node } from "@xyflow/react";
import cloneDeep from "lodash-es/cloneDeep";
import omit from "lodash-es/omit";

const DISPLAY_ONLY_COMPONENT_PROPERTIES: string[] = [
    "display",
    "version",
    "variants",
    "deprecated",
    "meta",
    "resourceType"
];

const processNavigation = (resource, resourceId, navigations) => {
    if (resource?.action) {
        let action: any = { ...resource.action };

        if (resource?.action?.type === ActionTypes.Executor) {
            action = {
                ...resource?.action,
                next: navigations[resourceId]
            };
        }

        return {
            ...resource,
            action
        };
    } else if (navigations[resourceId] && resource?.category === ElementCategories.Action) {
        return {
            ...resource,
            action: {
                next: navigations[resourceId],
                type: ActionTypes.Next
            }
        };
    }

    return resource;
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
                ?.replace(VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX, "")
                ?.replace(VisualFlowConstants.FLOW_BUILDER_PREVIOUS_HANDLE_SUFFIX, "")
        ] = edge.target;
    });

    const filteredFlowNodes = flowNodes.filter((node: Node) => node.data.displayOnly !== true);

    filteredFlowNodes.forEach((node: any) => {
        const { data, id, position, measured, type } = node;

        const processComponents = (components: Element[]) => {
            const _components: Element[] = components?.map((component: any) => {
                if (component.components) {
                    component.components = processComponents(component.components);
                }

                return processNavigation(
                    omit(component, DISPLAY_ONLY_COMPONENT_PROPERTIES),
                    component.id,
                    stepNavigationMap
                );
            });

            return _components;
        };

        /* eslint-disable sort-keys */
        const step = {
            id,
            type,
            size: measured || {
                height: 400,
                width: 350
            },
            position,
            data
        };
        /* eslint-disable sort-keys */

        if (data.components) {
            step.data = {
                ...step.data,
                components: processComponents(data.components)
            };
        }

        if (step?.data?.action) {
            step.data = processNavigation(step.data, step.id, stepNavigationMap);
        }

        payload.steps.push(step);
    });

    // TODO: Temp move the `UserOnboard` step to the last of the steps array.
    const userOnboardStep: Step = payload.steps.find((step: Step) => step.type === StaticStepTypes.UserOnboard);

    if (userOnboardStep) {
        payload.steps = payload.steps.filter((step: Step) => step.type !== StaticStepTypes.UserOnboard);
        payload.steps.push(userOnboardStep);
    }

    return payload;
};

export default transformFlow;
