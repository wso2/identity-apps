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

import Stack from "@oxygen-ui/react/Stack";
import { Node, useReactFlow } from "@xyflow/react";
import cloneDeep from "lodash-es/cloneDeep";
import set from "lodash-es/set";
import React, { ReactElement, useEffect } from "react";
import DefaultInputAdapter from "../components/resources/elements/adapters/input/default-input-adapter";
import FlowBuilderElementConstants from "../constants/flow-builder-element-constants";
import VisualFlowConstants from "../constants/visual-flow-constants";
import { Properties } from "../models/base";
import { BlockTypes, Element, ElementTypes, InputVariants } from "../models/elements";
import { EventTypes } from "../models/extension";
import PluginRegistry from "../plugins/plugin-registry";
import generateResourceId from "../utils/generate-resource-id";

const useConfirmPasswordField = (): void => {

    const { getNode, updateNodeData } = useReactFlow();

    useEffect(() => {
        addConfirmPasswordField[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER] =
            "addConfirmPasswordField";
        addConfirmPasswordFieldProperties[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER] =
            "addConfirmPasswordFieldProperties";
        updateConfirmPasswordFieldProperties[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER] =
            "updateConfirmPasswordFieldProperties";
        renderConfirmPasswordField[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER] =
            "renderConfirmPasswordField";
        skipConfirmPasswordField[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER] =
            "skipConfirmPasswordField";
        deleteConfirmPasswordField[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER] =
            "deleteConfirmPasswordField";

        PluginRegistry.getInstance().registerAsync(EventTypes.ON_PROPERTY_CHANGE, addConfirmPasswordField);
        PluginRegistry.getInstance().registerAsync(EventTypes.ON_PROPERTY_CHANGE, updateConfirmPasswordFieldProperties);
        PluginRegistry.getInstance().registerSync(EventTypes.ON_PROPERTY_PANEL_OPEN,
            addConfirmPasswordFieldProperties);
        PluginRegistry.getInstance().registerSync(EventTypes.ON_NODE_ELEMENT_RENDER, renderConfirmPasswordField);
        PluginRegistry.getInstance().registerSync(EventTypes.ON_NODE_ELEMENT_FILTER, skipConfirmPasswordField);
        PluginRegistry.getInstance().registerAsync(EventTypes.ON_NODE_ELEMENT_DELETE, deleteConfirmPasswordField);

        return () => {
            PluginRegistry.getInstance().unregister(EventTypes.ON_PROPERTY_CHANGE,
                addConfirmPasswordField[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER]);
            PluginRegistry.getInstance().unregister(EventTypes.ON_PROPERTY_CHANGE,
                updateConfirmPasswordFieldProperties[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER]);
            PluginRegistry.getInstance().unregister(EventTypes.ON_PROPERTY_PANEL_OPEN,
                addConfirmPasswordFieldProperties[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER]);
            PluginRegistry.getInstance().unregister(EventTypes.ON_NODE_ELEMENT_RENDER,
                renderConfirmPasswordField[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER]);
            PluginRegistry.getInstance().unregister(EventTypes.ON_NODE_ELEMENT_FILTER,
                skipConfirmPasswordField[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER]);
            PluginRegistry.getInstance().unregister(EventTypes.ON_NODE_ELEMENT_DELETE,
                deleteConfirmPasswordField[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER]);
        };
    }, []);

    /**
     * Adds a confirm password field to the form when the password field's confirm checkbox is checked.
     *
     * @param propertyKey - The key of the property being changed.
     * @param newValue - The new value of the property.
     * @param element - The element being modified.
     * @param stepId - The ID of the step where the element is located.
     * @param renderProperties - Function to re-render properties after modification.
     * @returns Returns false if the confirm password field is added, true otherwise.
     */
    const addConfirmPasswordField = async (propertyKey: string, newValue: any, element: Element,
        stepId: string): Promise<boolean> => {
        if (element.type === ElementTypes.Input && element.variant === InputVariants.Password) {
            if (propertyKey === "config.requireConfirmation" && !newValue) {
                updateNodeData(stepId, (node: Node) => {
                    if (node.data.components) {
                        const components: Element[] = cloneDeep(node.data.components) as Element[];
                        let formFound: boolean = false;
                        let passwordConfirmFieldIndex: number | undefined;

                        components.every((component: Element) => {
                            if (component.type === BlockTypes.Form) {
                                component.components.every((c: Element) => {
                                    if (c.id === element.id) {
                                        formFound = true;

                                        return false;
                                    }

                                    return true;
                                });

                                if (formFound) {
                                    component.components.every((c: Element, index: number) => {
                                        if (c.config.identifier === FlowBuilderElementConstants
                                            .CONFIRM_PASSWORD_IDENTIFIER && formFound) {
                                            passwordConfirmFieldIndex = index;

                                            return false;
                                        }

                                        return true;
                                    });
                                }

                                if (passwordConfirmFieldIndex === undefined) {
                                    return true;
                                }

                                component.components.splice(passwordConfirmFieldIndex, 1);

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
                        let passwordFieldIndex: number;

                        components.every((component: Element) => {
                            if (component.type === BlockTypes.Form) {
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
     * @param stepId - The ID of the step where the resource is located.
     * @returns return true.
     */
    const addConfirmPasswordFieldProperties = (resource: Element, properties: Properties, stepId: string): boolean => {

        if (resource.type === ElementTypes.Input && resource.variant === InputVariants.Password) {
            if (resource.config.identifier === FlowBuilderElementConstants.PASSWORD_IDENTIFIER) {
                let passwordConfirmationField: Element;
                let formFound: boolean = false;
                const node: Node = getNode(stepId);

                if (node?.data?.components) {
                    const components: Element[] = cloneDeep(node.data.components) as Element[];

                    components.every((component: Element) => {
                        if (component.type === BlockTypes.Form) {
                            component.components.every((c: Element) => {
                                if (c.id === resource.id) {
                                    formFound = true;

                                    return false;
                                }

                                return true;
                            });

                            if (formFound) {
                                component.components.every((c: Element) => {
                                    if (c.config.identifier === FlowBuilderElementConstants
                                        .CONFIRM_PASSWORD_IDENTIFIER && formFound) {
                                        passwordConfirmationField = c;

                                        return false;
                                    }

                                    return true;
                                });
                            }

                            if (formFound) {
                                return false;
                            }
                        }

                        return true;
                    });
                }

                properties["requireConfirmation"] = !!passwordConfirmationField;

                if (properties["requireConfirmation"]) {
                    properties["confirmHint"] = passwordConfirmationField.config?.hint;
                    properties["confirmLabel"] = passwordConfirmationField.config?.label;
                    properties["confirmPlaceholder"] = passwordConfirmationField.config?.placeholder;
                }
            }
        }

        return true;
    };

    /**
     * Updates the properties of the confirm password field when the password field's properties are changed.
     *
     * @param propertyKey - The key of the property being changed.
     * @param newValue - The new value of the property.
     * @param element - The element being modified.
     * @param stepId - The ID of the step where the element is located.
     * @returns Returns false if the confirm password field properties are updated, true otherwise.
     */
    const updateConfirmPasswordFieldProperties = async (propertyKey: string, newValue: any,
        element: Element, stepId: string): Promise<boolean> => {
        if (element.type === ElementTypes.Input && element.variant === InputVariants.Password) {
            if (propertyKey === "config.confirmHint" || propertyKey === "config.confirmLabel" ||
                propertyKey === "config.confirmPlaceholder" || propertyKey === "config.required") {
                updateNodeData(stepId, (node: Node) => {
                    if (node.data.components) {
                        const components: Element[] = cloneDeep(node.data.components) as Element[];
                        let passwordFieldIndex: number;

                        components.every((component: Element) => {
                            if (component.type === BlockTypes.Form) {
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

                                let propertyName: string = propertyKey.split(".")[1];

                                if (propertyName.includes("confirm")) {
                                    propertyName = propertyName.substring(7).toLowerCase();
                                }

                                set(component.components[passwordFieldIndex + 1], `config.${propertyName}`, newValue);

                                return false;
                            }

                            return true;
                        });

                        return {
                            components
                        };
                    }
                });

                if (propertyKey !== "config.required") {
                    return false;
                }
            }
        }

        return true;
    };

    /**
     * Renders the confirm password field if the password field is present and confirmation is enabled.
     *
     * @param stepId - The ID of the step where the resource is located.
     * @param resource - The resource element to be rendered.
     * @param renderingElements - The array of React elements to which the confirm password field will be added.
     * @returns Returns false if the confirm password field is rendered, true otherwise.
     */
    const renderConfirmPasswordField = (stepId: string, resource: Element,
        renderingElements: ReactElement[]): boolean => {
        if (resource.type === ElementTypes.Input && resource.variant === InputVariants.Password
            && resource.config.identifier === FlowBuilderElementConstants.PASSWORD_IDENTIFIER) {
            let passwordConfirmationField: Element;
            let formFound: boolean = false;
            const node: Node = getNode(stepId);

            if (node?.data?.components) {
                const components: Element[] = cloneDeep(node.data.components) as Element[];

                components.every((component: Element) => {
                    if (component.type === BlockTypes.Form) {
                        component.components.every((c: Element) => {
                            if (c.id === resource.id) {
                                formFound = true;

                                return false;
                            }

                            return true;
                        });

                        if (formFound) {
                            component.components.every((c: Element) => {
                                if (c.config.identifier === FlowBuilderElementConstants
                                    .CONFIRM_PASSWORD_IDENTIFIER && formFound) {
                                    passwordConfirmationField = c;

                                    return false;
                                }

                                return true;
                            });
                        }

                        if (formFound) {
                            return false;
                        }
                    }

                    return true;
                });
            }

            if (passwordConfirmationField) {
                renderingElements.push(
                    <Stack key={ `${resource.id}-${passwordConfirmationField.id}` } gap="42px">
                        <DefaultInputAdapter stepId={ stepId } resource={ resource }/>
                        <DefaultInputAdapter stepId={ stepId } resource={ passwordConfirmationField }/>
                    </Stack>
                );
            }

            return false;
        }

        return true;
    };

    /**
     * Stop the confirm password field from being rendered in the flow.
     *
     * @param resource - The resource element to be checked.
     * @returns Returns false if the resource is a confirm password field, true otherwise.
     */
    const skipConfirmPasswordField = (resource: Element): boolean => {
        if (resource.type === ElementTypes.Input && resource.variant === InputVariants.Password &&
            resource.config.identifier === FlowBuilderElementConstants.CONFIRM_PASSWORD_IDENTIFIER) {
            return false;
        }

        return true;
    };

    /**
     * Deletes the confirm password field from the form when the password field is removed.
     *
     * @param stepId - The ID of the step where the resource is located.
     * @param resource - The resource element to be checked.
     * @returns Returns true.
     */
    const deleteConfirmPasswordField = async (stepId: string, resource: Element): Promise<boolean> => {
        if (resource.type === ElementTypes.Input && resource.variant === InputVariants.Password &&
            resource.config.identifier === FlowBuilderElementConstants.PASSWORD_IDENTIFIER) {
            updateNodeData(stepId, (node: Node) => {
                if (node.data.components) {
                    const components: Element[] = cloneDeep(node.data.components) as Element[];
                    let formFound: boolean = false;

                    components.every((component: Element) => {
                        if (component.type === BlockTypes.Form) {
                            component.components.every((c: Element) => {
                                if (c.id === resource.id) {
                                    formFound = true;

                                    return false;
                                }

                                return true;
                            });

                            if (formFound) {
                                component.components = component.components.filter((c: Element) =>
                                    c.config.identifier !== FlowBuilderElementConstants
                                        .CONFIRM_PASSWORD_IDENTIFIER);

                                return false;
                            }
                        }

                        return true;
                    });

                    return {
                        components
                    };
                }
            });
        }

        return true;
    };
};

export default useConfirmPasswordField;
