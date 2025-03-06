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
import { StaticStepTypes, Step, StepTypes } from "@wso2is/admin.flow-builder-core.v1/models/steps";
import { Template, TemplateTypes } from "@wso2is/admin.flow-builder-core.v1/models/templates";
import generateComponentsForTemplates from "@wso2is/admin.flow-builder-core.v1/utils/generate-components-for-templates";
import generateIdsForTemplates from "@wso2is/admin.flow-builder-core.v1/utils/generate-ids-for-templates";
import generateResourceId from "@wso2is/admin.flow-builder-core.v1/utils/generate-resource-id";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Edge, Node, NodeTypes } from "@xyflow/react";
import cloneDeep from "lodash-es/cloneDeep";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import StaticNodeFactory from "./resources/steps/static-step-factory";
import StepFactory from "./resources/steps/step-factory";
import configureRegistrationFlow from "../api/configure-registration-flow";
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
    const { flow: registrationFlow } = useRegistrationFlowBuilder();
    const { data: resources } = useGetRegistrationFlowBuilderResources();
    const { steps, templates } = resources;

    const dispatch: Dispatch = useDispatch();

    const INITIAL_FLOW_START_STEP_ID: string = StaticStepTypes.Start.toLowerCase();
    const INITIAL_FLOW_VIEW_STEP_ID: string = generateResourceId(StepTypes.View.toLowerCase());
    const INITIAL_FLOW_USER_ONBOARD_STEP_ID: string = generateResourceId(StaticStepTypes.UserOnboard.toLowerCase());

    const getDefaultTemplateComponents = (): Element[] => {
        const defaultTemplate: Template = cloneDeep(
            templates.find((template: Template) => template.type === TemplateTypes.Default)
        );

        if (defaultTemplate?.config?.data?.steps?.length > 0) {
            defaultTemplate.config.data.steps[0].id = INITIAL_FLOW_START_STEP_ID;
        }

        return generateComponentsForTemplates(resources, generateIdsForTemplates(defaultTemplate)?.config?.data?.steps[0]?.data?.components);
    };

    const defaultTemplateComponents = useMemo(() => getDefaultTemplateComponents(), [ resources ]);

    const initialNodes: Node[] = useMemo<Node[]>(() => {
        let intermediateSteps: Node[] = [
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
        ];

        if (registrationFlow) {
            intermediateSteps = registrationFlow.steps.map((step: Step) => {
                return {
                    data: {
                        components: step.data.components
                    },
                    deletable: true,
                    id: step.id,
                    position: { x: 300, y: 200 },
                    type: step.type
                };
            });
        }

        return [
            {
                data: {
                    displayOnly: true
                },
                deletable: false,
                id: INITIAL_FLOW_START_STEP_ID,
                position: { x: -50, y: 330 },
                type: StaticStepTypes.Start
            },
            ...intermediateSteps
        ];
    }, [ registrationFlow, defaultTemplateComponents ]);

    const initialEdges: Edge[] = useMemo<Edge[]>(() => {
        // If we have a valid registration flow with steps
        if (registrationFlow?.steps && registrationFlow.steps.length > 0) {
            const edges: Edge[] = [];

            // Check if we need to connect start to the first step
            if (registrationFlow.steps.length > 0) {
                const firstStep = registrationFlow.steps[0];

                edges.push({
                    animated: false,
                    id: `${INITIAL_FLOW_START_STEP_ID}-${firstStep.id}`,
                    source: INITIAL_FLOW_START_STEP_ID,
                    target: firstStep.id,
                    type: "base-edge"
                });
            }

            // Create edges based on the action configuration in each step
            registrationFlow.steps.forEach((step: Step) => {
                // Check if the step has components with actions
                if (step.data?.components) {
                    // Look for forms and their buttons
                    step.data.components.forEach((component: Element) => {
                        if (component.type === BlockTypes.Form) {
                            component.components?.forEach((formElement: Element) => {
                                // Check if it's a button with a "next" action
                                if (formElement.type === ElementTypes.Button &&
                                    (formElement as any).action?.next) {
                                    edges.push({
                                        animated: false,
                                        id: formElement.id,
                                        source: step.id,
                                        sourceHandle: `${formElement.id}${ButtonAdapterConstants.NEXT_BUTTON_HANDLE_SUFFIX}`,
                                        target: (formElement as any).action.next,
                                        type: "base-edge"
                                    });
                                }
                            });
                        }
                    });
                }
            });

            console.log("Generated edges:", edges);

            return edges;
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
    }, [ registrationFlow, defaultTemplateComponents ]);

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

                const submitButtons = component.components?.filter(
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

    return (
        <FlowBuilder
            resources={ resources }
            data-componentid={ componentId }
            onFlowSubmit={ handleFlowSubmit }
            initialNodes={ initialNodes }
            initialEdges={ initialEdges }
            nodeTypes={ generateNodeTypes() }
            mutateComponents={ handleMutateComponents }
            { ...rest }
        />
    );
};

export default RegistrationFlowBuilderCore;
