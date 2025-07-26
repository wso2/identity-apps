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

import { Node, useReactFlow } from "@xyflow/react";
import cloneDeep from "lodash-es/cloneDeep";
import { useEffect } from "react";
import useGetFlowBuilderCoreResources from "../api/use-get-flow-builder-core-resources";
import VisualFlowConstants from "../constants/visual-flow-constants";
import { Properties } from "../models/base";
import { Element, ElementCategories, ElementTypes } from "../models/elements";
import { EventTypes } from "../models/extension";
import { StepTypes } from "../models/steps";
import PluginRegistry from "../plugins/plugin-registry";
import generateResourceId from "../utils/generate-resource-id";

const STATIC_CONTENT_ENABLED_PROPERTY: string = "enableStaticContent";

/**
 * Custom hook to manage static content field in execution nodes.
 */
const useStaticContentField = (): void => {

    const { getNode, updateNodeData } = useReactFlow();
    const { data: resources } = useGetFlowBuilderCoreResources();

    useEffect(() => {
        addStaticContent[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER] =
            "addStaticContent";
        addStaticContentProperties[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER] =
            "addStaticContentProperties";

        PluginRegistry.getInstance().registerAsync(EventTypes.ON_PROPERTY_CHANGE, addStaticContent);
        PluginRegistry.getInstance().registerSync(EventTypes.ON_PROPERTY_PANEL_OPEN,
            addStaticContentProperties);

        return () => {
            PluginRegistry.getInstance().unregister(EventTypes.ON_PROPERTY_CHANGE,
                addStaticContent[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER]);
            PluginRegistry.getInstance().unregister(EventTypes.ON_PROPERTY_PANEL_OPEN,
                addStaticContentProperties[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER]);
        };
    }, [ resources ]);

    /**
     * Adds static content to the execution node when staticContentEnabled is checked.
     *
     * @param propertyKey - The key of the property being changed.
     * @param newValue - The new value of the property.
     * @param element - The element being modified.
     * @param stepId - The ID of the step where the element is located.
     * @returns Returns false if the static content is added/removed, true otherwise.
     */
    const addStaticContent = async (propertyKey: string, newValue: any, element: Element,
        stepId: string): Promise<boolean> => {

        // Check if this is a execution step and the property is staticContentEnabled.
        if (element?.type === StepTypes.Execution && propertyKey === STATIC_CONTENT_ENABLED_PROPERTY) {
            updateNodeData(stepId, (node: Node) => {
                const components: Element[] = cloneDeep(node?.data?.components || []) as Element[];

                if (!newValue) {
                    // Remove static content if it exists.
                    return {
                        ...node.data,
                        components: []
                    };
                } else {
                    // Add static content if it doesn't exist.
                    if (components.length == 0) {
                        const staticContentElement: Element = cloneDeep(resources?.elements?.find(
                            (element: Element) => element.type === ElementTypes.RichText));

                        staticContentElement.config.text = "<h3>Static Content</h3>";
                        staticContentElement.id = generateResourceId(ElementCategories.Display);
                        components.push(staticContentElement);
                    }

                    return {
                        ...node.data,
                        components
                    };
                }
            });

            return false;
        }

        return true;
    };

    /**
     * Adds staticContentEnabled property to the execution step property panel.
     *
     * @param resource - The resource element to which properties are being added.
     * @param properties - The properties object to which static content property will be added.
     * @param stepId - The ID of the step where the resource is located.
     * @returns return true.
     */
    const addStaticContentProperties = (resource: Element, properties: Properties, stepId: string): boolean => {
        const node: Node = getNode(stepId);

        // Check if this is a execution step.
        if (resource?.type === StepTypes.Execution && VisualFlowConstants
            .FLOW_BUILDER_STATIC_CONTENT_ALLOWED_EXECUTION_TYPES.includes(resource?.data?.action?.executor?.name)) {
            const components: Element[] = (node?.data?.components as Element[]) || [];

            properties[STATIC_CONTENT_ENABLED_PROPERTY] = components.length > 0;
        }

        return true;
    };
};

export default useStaticContentField;
