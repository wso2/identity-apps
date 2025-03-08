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

import FlowBuilder from "@wso2is/admin.flow-builder-core.v1/components/flow-builder";
import ButtonAdapterConstants from "@wso2is/admin.flow-builder-core.v1/constants/button-adapter-constants";
import { Payload } from "@wso2is/admin.flow-builder-core.v1/models/api";
import {
    BlockTypes,
    ButtonTypes,
    Element,
    ElementTypes,
    InputVariants
} from "@wso2is/admin.flow-builder-core.v1/models/elements";
import { Resource } from "@wso2is/admin.flow-builder-core.v1/models/resources";
import { StaticStepTypes, Step, StepTypes } from "@wso2is/admin.flow-builder-core.v1/models/steps";
import { Template, TemplateTypes } from "@wso2is/admin.flow-builder-core.v1/models/templates";
import { Widget } from "@wso2is/admin.flow-builder-core.v1/models/widget";
import generateIdsForResources from "@wso2is/admin.flow-builder-core.v1/utils/generate-ids-for-templates";
import generateResourceId from "@wso2is/admin.flow-builder-core.v1/utils/generate-resource-id";
import resolveComponentMetadata from "@wso2is/admin.flow-builder-core.v1/utils/resolve-component-metadata";
import updateTemplatePlaceholderReferences from "@wso2is/admin.flow-builder-core.v1/utils/update-template-placeholder-references";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Edge, Node, NodeTypes } from "@xyflow/react";
import cloneDeep from "lodash-es/cloneDeep";
import isEqual from "lodash-es/isEqual";
import mergeWith from "lodash-es/mergeWith";
import unionWith from "lodash-es/unionWith";
import React, { FunctionComponent, ReactElement, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import StaticNodeFactory from "./resources/steps/static-step-factory";
import StepFactory from "./resources/steps/step-factory";
import configureRegistrationFlow from "../api/configure-registration-flow";
import useGetRegistrationFlow from "../api/use-get-registration-flow";
import useGetRegistrationFlowBuilderResources from "../api/use-get-registration-flow-builder-resources";
import useRegistrationFlowBuilder from "../hooks/use-registration-flow-builder-core-context";

/**
 * Props interface of {@link RegistrationFlowBuilderCore}
 */
export type RegistrationFlowBuilderCorePropsInterface = IdentifiableComponentInterface;

/**
 * Main component that wraps the `FlowBuilder` from the flow builder core.
 *
 * @param props - Props injected to the component.
 * @returns RegistrationFlowBuilder component.
 */
const RegistrationFlowBuilderCore: FunctionComponent<RegistrationFlowBuilderCorePropsInterface> = ({
    "data-componentid": componentId = "registration-flow-builder-core",
    ...rest
}: RegistrationFlowBuilderCorePropsInterface): ReactElement => {
    const {
        data: registrationFlow,
        error: registrationFlowFetchRequestError,
        isLoading: isRegistrationFlowFetchRequestLoading,
        isValidating: isRegistrationFlowFetchRequestValidating
    } = useGetRegistrationFlow();
    const { data: resources } = useGetRegistrationFlowBuilderResources();
    const { steps, templates } = resources;

    const dispatch: Dispatch = useDispatch();

    const INITIAL_FLOW_START_STEP_ID: string = StaticStepTypes.Start.toLowerCase();
    const INITIAL_FLOW_VIEW_STEP_ID: string = generateResourceId(StepTypes.View.toLowerCase());
    const INITIAL_FLOW_USER_ONBOARD_STEP_ID: string = StaticStepTypes.UserOnboard;

    /**
     * Dispatches an error alert if the flow fetch fails.
     */
    useEffect(() => {
        if (registrationFlowFetchRequestError) {
            dispatch(
                addAlert({
                    description: "An error occurred while fetching the registration flow.",
                    level: AlertLevels.ERROR,
                    message: "Couldn't retrieve the registration flow."
                })
            );
        }
    }, [ registrationFlowFetchRequestError ]);

    const getBlankTemplateComponents = (): Element[] => {
        const blankTemplate: Template = cloneDeep(
            templates.find((template: Template) => template.type === TemplateTypes.Blank)
        );

        if (blankTemplate?.config?.data?.steps?.length > 0) {
            blankTemplate.config.data.steps[0].id = INITIAL_FLOW_START_STEP_ID;
        }

        return resolveComponentMetadata(
            resources,
            generateIdsForResources<Template>(blankTemplate)?.config?.data?.steps[0]?.data?.components
        );
    };

    const defaultTemplateComponents = useMemo(() => getBlankTemplateComponents(), [ resources ]);

    const generateSteps = (steps: Node[]): Node[] => {
        const START_STEP: Node = {
            data: {
                displayOnly: true
            },
            deletable: false,
            id: INITIAL_FLOW_START_STEP_ID,
            position: { x: -50, y: 330 },
            type: StaticStepTypes.Start
        };

        return generateIdsForResources<Node[]>([
            START_STEP,
            ...steps.map((step: Node) => {
                return {
                    data:
                        (step.data?.components && {
                            ...step.data,
                            components: resolveComponentMetadata(resources, (step.data as any).components)
                        }) ||
                        step.data,
                    deletable: true,
                    id: step.id,
                    position: step.position,
                    type: step.type
                };
            })
        ]);
    };

    const generateEdges = (steps: Step[]): Edge[] => {
        let edges: Edge[] = [];

        // Get all step IDs for validation
        const stepIds = steps.map(step => step.id);

        // Find the user onboard step
        const userOnboardStep = steps.find(step => step.type === StaticStepTypes.UserOnboard);

        // Get the ID of the user onboard step or use the default one
        const userOnboardStepId = userOnboardStep?.id || INITIAL_FLOW_USER_ONBOARD_STEP_ID;

        // Check if we need to connect start to the first step
        if (steps.length > 0) {
            let firstStep = steps[0];

            // TODO: Handle this better. Templates have a `Start` node, but the black starter doesn't.
            if (firstStep.id === INITIAL_FLOW_START_STEP_ID) {
                firstStep = steps[1];
            }

            edges.push({
                animated: false,
                id: `${INITIAL_FLOW_START_STEP_ID}-${firstStep.id}`,
                source: INITIAL_FLOW_START_STEP_ID,
                target: firstStep.id,
                type: "base-edge"
            });
        }

        // Flag to track if we've already created an edge to the user onboard step
        let userOnboardEdgeCreated = false;

        const createEdgesForButtons = (step, button) => {
            const edges = [];

            if (button.action?.next) {
                // If next points to a valid step, create that edge
                if (stepIds.includes(button.action.next)) {
                    edges.push({
                        animated: false,
                        id: button.id,
                        source: step.id,
                        sourceHandle: `${button.id}${ButtonAdapterConstants.NEXT_BUTTON_HANDLE_SUFFIX}`,
                        target: button.action.next,
                        type: "base-edge"
                    });

                    // Check if this is pointing to the user onboard step
                    if (button.action.next === userOnboardStepId) {
                        userOnboardEdgeCreated = true;
                    }
                } else if (button.action.next === StaticStepTypes.UserOnboard) {
                    // If next references a user onboard ID that's not in the steps
                    // but follows the naming pattern, connect to our actual user onboard step
                    edges.push({
                        animated: false,
                        id: button.id,
                        source: step.id,
                        sourceHandle: `${button.id}${ButtonAdapterConstants.NEXT_BUTTON_HANDLE_SUFFIX}`,
                        target: userOnboardStepId,
                        type: "base-edge"
                    });
                    userOnboardEdgeCreated = true;
                }
            } else if (button.action?.executor?.name === "PasswordOnboardExecutor") {
                // For PasswordOnboardExecutor buttons without explicit next,
                // create an edge to the user onboard step
                edges.push({
                    animated: false,
                    id: button.id,
                    source: step.id,
                    sourceHandle: `${button.id}${ButtonAdapterConstants.NEXT_BUTTON_HANDLE_SUFFIX}`,
                    target: userOnboardStepId,
                    type: "base-edge"
                });
                userOnboardEdgeCreated = true;
            }

            return edges;
        };

        // Create edges based on the action configuration in each step
        steps.forEach((step: Step) => {
            // Skip processing for the user onboard step itself
            if (step.type === StaticStepTypes.UserOnboard) {
                return;
            }

            // Check if the step has components with actions
            if (step.data?.components) {
                // Look for forms and their buttons
                step.data.components.forEach((component: Element) => {
                    if (component.type === BlockTypes.Form) {
                        const buttons = component.components?.filter(
                            (elem: Element) => elem.type === ElementTypes.Button
                        );

                        buttons?.forEach((button: Element) => {
                            edges = [ ...edges, ...createEdgesForButtons(step, button) ];
                        });
                    }

                    if (component.type === ElementTypes.Button) {
                        edges = [ ...edges, ...createEdgesForButtons(step, component) ];
                    }
                });
            }

            // Check if the step has an action with a next step
            if (step.data?.action) {
                // If next points to a valid step, create that edge
                if (stepIds.includes(step.data.action.next)) {
                    edges.push({
                        animated: false,
                        id: `${step.id}-to-${step.data.action.next}`,
                        source: step.id,
                        target: step.data.action.next,
                        type: "base-edge"
                    });

                    // Check if this is pointing to the user onboard step
                    if (step.data.action.next === userOnboardStepId) {
                        userOnboardEdgeCreated = true;
                    }
                } else if (step.data.action.next === StaticStepTypes.UserOnboard) {
                    // If next references a user onboard ID that's not in the steps
                    // but follows the naming pattern, connect to our actual user onboard step
                    edges.push({
                        animated: false,
                        id: `${step.id}-to-${userOnboardStepId}`,
                        source: step.id,
                        target: userOnboardStepId,
                        type: "base-edge"
                    });
                    userOnboardEdgeCreated = true;
                }
            }
        });

        // If no edge to user onboard was created and we have view steps,
        // connect the last view step to the user onboard step
        if (!userOnboardEdgeCreated && steps.length > 0) {
            // Find view steps
            const viewSteps = steps.filter(step => step.type === StepTypes.View);

            if (viewSteps.length > 0) {
                // Get the last view step
                const lastViewStep = viewSteps[viewSteps.length - 1];

                // Find a button in this step to use for the connection
                let buttonId = null;

                if (lastViewStep.data?.components) {
                    for (const component of lastViewStep.data.components) {
                        if (component.type === BlockTypes.Form) {
                            const button = component.components?.find(
                                (elem: Element) => elem.type === ElementTypes.Button
                            );

                            if (button) {
                                buttonId = button.id;

                                break;
                            }
                        }
                    }
                }

                // If we found a button, use it; otherwise generate a fallback ID
                const edgeId = buttonId || `${lastViewStep.id}-to-${userOnboardStepId}`;

                edges.push({
                    animated: false,
                    id: edgeId,
                    source: lastViewStep.id,
                    ...(buttonId
                        ? { sourceHandle: `${buttonId}${ButtonAdapterConstants.NEXT_BUTTON_HANDLE_SUFFIX}` }
                        : {}),
                    target: userOnboardStepId,
                    type: "base-edge"
                });
            }
        }

        return edges;
    };

    const initialNodes: Node[] = useMemo<Node[]>(() => {
        if (registrationFlow) {
            return generateSteps(registrationFlow.steps as any);
        }

        return generateSteps([
            {
                data: {
                    components: defaultTemplateComponents
                },
                deletable: true,
                id: INITIAL_FLOW_VIEW_STEP_ID,
                position: { x: 300, y: 200 },
                type: StepTypes.View
            },
            {
                data: {
                    displayOnly: true
                },
                deletable: false,
                id: INITIAL_FLOW_USER_ONBOARD_STEP_ID,
                position: { x: 850, y: 408 },
                type: StaticStepTypes.UserOnboard
            }
        ]);
    }, [ registrationFlow, defaultTemplateComponents, generateSteps ]);

    const initialEdges: Edge[] = useMemo<Edge[]>(() => {
        // If we have a valid registration flow with steps
        if (registrationFlow?.steps && registrationFlow.steps.length > 0) {
            return generateEdges(registrationFlow.steps);
        }

        // Default fallback if no registration flow is found
        const defaultTemplateActionId: string = defaultTemplateComponents
            ?.map((component: Element) => {
                if (component.type === BlockTypes.Form) {
                    return component.components.find((element: Element) => element.type === ElementTypes.Button)?.id;
                }

                return null;
            })
            .filter(Boolean)[0];

        return [
            {
                animated: false,
                id: `${INITIAL_FLOW_START_STEP_ID}-${INITIAL_FLOW_VIEW_STEP_ID}`,
                source: INITIAL_FLOW_START_STEP_ID,
                target: INITIAL_FLOW_VIEW_STEP_ID,
                type: "base-edge"
            },
            {
                animated: false,
                id: defaultTemplateActionId,
                source: INITIAL_FLOW_VIEW_STEP_ID,
                sourceHandle: `${defaultTemplateActionId}${ButtonAdapterConstants.NEXT_BUTTON_HANDLE_SUFFIX}`,
                target: INITIAL_FLOW_USER_ONBOARD_STEP_ID,
                type: "base-edge"
            }
        ];
    }, [ registrationFlow, defaultTemplateComponents, generateEdges ]);

    const generateNodeTypes = (): NodeTypes => {
        if (!steps) {
            return {};
        }

        const stepNodes: NodeTypes = steps.reduce((acc: NodeTypes, resource: Step) => {
            acc[resource.type] = (props: any) => <StepFactory resource={ resource } { ...props } />;

            return acc;
        }, {});

        const staticStepNodes: NodeTypes = Object.values(StaticStepTypes).reduce(
            (acc: NodeTypes, type: StaticStepTypes) => {
                acc[type] = (props: any) => <StaticNodeFactory type={ type } { ...props } />;

                return acc;
            },
            {}
        );

        return {
            ...staticStepNodes,
            ...stepNodes
        };
    };

    const handleMutateComponents = (components: Element[]): Element[] => {
        let modifiedComponents: Element[] = cloneDeep(components);

        // Check inside `forms`, if there is a form with a password field and there's only one submit button,
        // Set the `"action": { "type": "EXECUTOR", "executor": { "name": "PasswordOnboardExecutor"}, "next": "" }`
        modifiedComponents = modifiedComponents.map((component: Element) => {
            if (component.type === BlockTypes.Form) {
                const hasPasswordField: boolean = component.components?.some(
                    (formComponent: Element) =>
                        formComponent.type === ElementTypes.Input && formComponent.variant === InputVariants.Password
                );

                const hasOtpField: boolean = component.components?.some(
                    (formComponent: Element) =>
                        formComponent.type === ElementTypes.Input && formComponent.variant === InputVariants.OTP
                );

                const submitButtons: Element[] = component.components?.filter(
                    (formComponent: Element) =>
                        formComponent.type === ElementTypes.Button && formComponent.config?.type === ButtonTypes.Submit
                );

                if (submitButtons?.length === 1) {
                    component.components = component.components.map((formComponent: Element) => {
                        if (hasPasswordField) {
                            if (formComponent.type === ElementTypes.Button) {
                                return {
                                    ...formComponent,
                                    action: {
                                        type: "EXECUTOR",
                                        executor: {
                                            name: "PasswordOnboardExecutor"
                                        },
                                        next: ""
                                    }
                                };
                            }
                        } else if (hasOtpField) {
                            if (formComponent.type === ElementTypes.Button) {
                                return {
                                    ...formComponent,
                                    action: {
                                        type: "EXECUTOR",
                                        executor: {
                                            name: "EmailOTPVerifier"
                                        },
                                        next: ""
                                    }
                                };
                            }
                        }

                        return formComponent;
                    });
                }

                return component;
            }

            return component;
        });

        return modifiedComponents;
    };

    const handleTemplateLoad = (template: Template): [Node[], Edge[]] => {
        if (!template?.config?.data?.steps) {
            return [ [], [] ];
        }

        const templateSteps = generateSteps(template.config.data.steps as any);
        const templateEdges = generateEdges(templateSteps as any);

        return [ templateSteps, templateEdges ];
    };

    const generateUnconnectedEdges = (currentEdges: Edge[], currentNodes: Node[]): Edge[] => {
        const nodeIds = new Set(currentNodes.map(node => node.id));
        const missingEdges: Edge[] = [];

        currentNodes.forEach(node => {
            if (!node.data || !node.data.components) return;

            (node.data.components as any).forEach(component => {
                if (component.type === "BUTTON" && component.action && component.action.next) {
                    const buttonId = component.id;
                    const expectedTarget = component.action.next;

                    // Ensure expected target exists in nodes
                    if (!nodeIds.has(expectedTarget)) {
                        console.warn(`Expected target node '${expectedTarget}' not found in currentNodes.`);

                        return;
                    }

                    const existingEdge = currentEdges.find(
                        edge => edge.source === node.id && edge.sourceHandle === `${buttonId}_NEXT`
                    );

                    // If no edge exists or it's pointing to the wrong node, add a missing edge
                    if (!existingEdge || existingEdge.target !== expectedTarget) {
                        missingEdges.push({
                            id: `${buttonId}_MISSING_EDGE`,
                            source: node.id,
                            sourceHandle: `${buttonId}_NEXT`,
                            target: expectedTarget,
                            type: "base-edge",
                            animated: false
                        });
                    }
                }
            });
        });

        return missingEdges;
    };

    const handleWidgetLoad = (
        widget: Widget,
        targetResource: Resource,
        currentNodes: Node[],
        currentEdges: Edge[]
    ): [Node[], Edge[]] => {
        const widgetFlow = widget.config.data;

        if (!widgetFlow || !widgetFlow.steps) {
            return [ currentNodes, currentEdges ];
        }

        let newNodes: Node[] = cloneDeep(currentNodes);
        let newEdges: Edge[] = cloneDeep(currentEdges);

        // Custom merge function to handle components specifically
        const customMerge = (objValue: any, srcValue: any, key: string) => {
            // Check if the key is 'components' and both are arrays
            if (key === "components" && Array.isArray(objValue) && Array.isArray(srcValue)) {
                // Merge the arrays while preserving the unique elements
                return unionWith(objValue, srcValue, isEqual); // or _.concat() depending on the logic
            }
        };

        widgetFlow.steps.filter((step: Step) => {
            if (step.__generationMeta__) {
                const strategy = step.__generationMeta__.strategy;

                if (strategy === "MERGE_WITH_DROP_POINT") {
                    newNodes = newNodes.map((node: Node) => {
                        if (node.id === targetResource.id) {
                            // Use mergeWith with the custom merge function
                            return mergeWith(node, step, customMerge);
                        }

                        return node;
                    });
                }
            } else {
                newNodes = [ ...newNodes, step ] as Node[];
            }
        });

        const replacers = widgetFlow.__generationMeta__.replacers;

        newNodes = updateTemplatePlaceholderReferences(generateIdsForResources(newNodes), replacers);
        newEdges = [ ...newEdges, ...generateUnconnectedEdges(newEdges, newNodes) ];

        return [ newNodes, newEdges ];
    };

    const handleFlowSubmit = (payload: Payload) => {
        configureRegistrationFlow(payload)
            .then(() => {
                dispatch(
                    addAlert({
                        description: "Registration flow updated successfully.",
                        level: AlertLevels.SUCCESS,
                        message: "Flow Updated Successfully"
                    })
                );
            })
            .catch(() => {
                dispatch(
                    addAlert({
                        description: "Failed to update the registration flow.",
                        level: AlertLevels.ERROR,
                        message: "Flow Updated Failure"
                    })
                );
            });
    };

    if (isRegistrationFlowFetchRequestLoading || isRegistrationFlowFetchRequestValidating) {
        return null;
    }

    return (
        <FlowBuilder
            resources={ resources }
            data-componentid={ componentId }
            onFlowSubmit={ handleFlowSubmit }
            initialNodes={ initialNodes }
            initialEdges={ initialEdges }
            nodeTypes={ generateNodeTypes() }
            mutateComponents={ handleMutateComponents }
            onTemplateLoad={ handleTemplateLoad }
            onWidgetLoad={ handleWidgetLoad }
            { ...rest }
        />
    );
};

export default RegistrationFlowBuilderCore;
