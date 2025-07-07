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
import set from "lodash-es/set";
import { MutableRefObject, useEffect, useRef } from "react";
import FlowBuilderElementConstants from "../constants/flow-builder-element-constants";
import { Properties } from "../models/base";
import { BlockTypes, Element, ElementTypes, InputVariants } from "../models/elements";
import { EventTypes } from "../models/extension";
import PluginRegistry from "../plugins/plugin-registry";
import generateResourceId from "../utils/generate-resource-id";

const useConfirmPasswordField = (): void => {

    const { updateNodeData } = useReactFlow();

    const confirmationEnabledPasswordFields: MutableRefObject<Map<string, boolean>> = useRef(new Map());

    useEffect(() => {
        PluginRegistry.getInstance().registerAsync(EventTypes.ON_PROPERTY_CHANGE, addConfirmPasswordField);
        PluginRegistry.getInstance().registerAsync(EventTypes.ON_PROPERTY_CHANGE, updateConfirmPasswordFieldProperties);
        PluginRegistry.getInstance().registerAsync(EventTypes.ON_PROPERTY_PANEL_OPEN,
            addConfirmPasswordFieldProperties);

        return () => {
            PluginRegistry.getInstance().unregister(EventTypes.ON_PROPERTY_CHANGE, addConfirmPasswordField.name);
            PluginRegistry.getInstance().unregister(EventTypes.ON_PROPERTY_CHANGE,
                updateConfirmPasswordFieldProperties.name);
            PluginRegistry.getInstance().unregister(EventTypes.ON_PROPERTY_PANEL_OPEN,
                addConfirmPasswordFieldProperties.name);
        };
    }, []);

    /**
     * Adds a confirm password field to the form when the password field's confirm checkbox is checked.
     *
     * @param propertyKey - The key of the property being changed.
     * @param newValue - The new value of the property.
     * @param element - The element being modified.
     * @param stepId - The ID of the step where the element is located.
     * @returns Returns false if the confirm password field is added, true otherwise.
     */
    const addConfirmPasswordField = async (
        propertyKey: string,
        newValue: any,
        element: Element,
        stepId: string
    ): Promise<boolean> => {
        if (element.type === ElementTypes.Input && element.variant === InputVariants.Password) {
            if (propertyKey === "config.requireConfirmation" && !newValue) {
                updateNodeData(stepId, (node: Node) => {
                    if (node.data.components) {
                        const components: Element[] = cloneDeep(node.data.components) as Element[];

                        components.every((component: Element) => {
                            if (component.type === BlockTypes.Form) {
                                let passwordFieldIndex: number;

                                component.components.every((c: Element, index: number) => {
                                    if (c.id === element.id) {
                                        passwordFieldIndex = index;
                                        confirmationEnabledPasswordFields.current.delete(c.id);

                                        return false;
                                    }

                                    return true;
                                });

                                if (passwordFieldIndex === undefined) {
                                    return true;
                                }

                                component.components.splice(passwordFieldIndex + 1, 1);

                                return false;
                            }

                            return true;
                        });

                        return {
                            components
                        };
                    }
                });

                return false;
            } else if (propertyKey === "config.requireConfirmation" && newValue) {
                updateNodeData(stepId, (node: Node) => {
                    if (node.data.components) {
                        const components: Element[] = cloneDeep(node.data.components) as Element[];

                        components.every((component: Element) => {
                            if (component.type === BlockTypes.Form) {
                                let passwordFieldIndex: number;

                                component.components.every((c: Element, index: number) => {
                                    if (c.id === element.id) {
                                        passwordFieldIndex = index;
                                        confirmationEnabledPasswordFields.current.set(c.id, true);

                                        return false;
                                    }

                                    return true;
                                });

                                if (passwordFieldIndex === undefined) {
                                    return true;
                                }

                                const confirmPasswordField: Element = cloneDeep(element) as Element;

                                confirmPasswordField.config.identifier = FlowBuilderElementConstants
                                    .CONFIRM_PASSWORD_IDENTIFIER;
                                confirmPasswordField.config.label = "Confirm Password";
                                confirmPasswordField.config.placeholder = "Enter your password confirmation";
                                confirmPasswordField.id = generateResourceId("field");

                                component.components.splice(passwordFieldIndex + 1, 0, confirmPasswordField);

                                return false;
                            }

                            return true;
                        });

                        return {
                            components
                        };
                    }
                });

                return false;
            }
        }

        return true;
    };

    /**
     * Adds properties to the confirm password field when confirmation is enabled for a password field.
     *
     * @param resource - The resource element to which properties are being added.
     * @param properties - The properties object to which confirm password field properties will be added.
     * @returns return true.
     */
    const addConfirmPasswordFieldProperties = async (resource: Element, properties: Properties): Promise<boolean> => {

        if (resource.type === ElementTypes.Input && resource.variant === InputVariants.Password) {
            if (resource.config.identifier === FlowBuilderElementConstants.PASSWORD_IDENTIFIER) {
                properties["requireConfirmation"] = confirmationEnabledPasswordFields.current.has(resource.id);

                if (properties["requireConfirmation"]) {
                    properties["confirmHint"] = "";
                    properties["confirmLabel"] = "Confirm Password";
                    properties["confirmPlaceholder"] = "Enter your password confirmation";
                }
            }
        }

        return true;
    };

    const updateConfirmPasswordFieldProperties = async (
        propertyKey: string,
        newValue: any,
        element: Element,
        stepId: string
    ): Promise<boolean> => {
        if (element.type === ElementTypes.Input && element.variant === InputVariants.Password) {
            if (propertyKey === "config.confirmHint" || propertyKey === "config.confirmLabel" ||
                propertyKey === "config.confirmPlaceholder") {
                updateNodeData(stepId, (node: Node) => {
                    if (node.data.components) {
                        const components: Element[] = cloneDeep(node.data.components) as Element[];

                        components.every((component: Element) => {
                            if (component.type === BlockTypes.Form) {
                                let passwordFieldIndex: number;

                                component.components.every((c: Element, index: number) => {
                                    if (c.id === element.id) {
                                        passwordFieldIndex = index;

                                        return false;
                                    }

                                    return true;
                                });

                                if (passwordFieldIndex === undefined) {
                                    return true;
                                }

                                set(component.components[passwordFieldIndex + 1], propertyKey, newValue);

                                return false;
                            }

                            return true;
                        });

                        return {
                            components
                        };
                    }
                });

                return false;
            }
        }

        return true;
    };
};

export default useConfirmPasswordField;
