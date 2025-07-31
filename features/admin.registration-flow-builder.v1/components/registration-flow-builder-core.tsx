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

import FlowBuilder from "@wso2is/admin.flow-builder-core.v1/components/flow-builder";
import VisualFlowConstants from "@wso2is/admin.flow-builder-core.v1/constants/visual-flow-constants";
import {
    BlockTypes,
    ButtonTypes,
    ButtonVariants,
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
import resolveStepMetadata from "@wso2is/admin.flow-builder-core.v1/utils/resolve-step-metadata";
import updateTemplatePlaceholderReferences
    from
    "@wso2is/admin.flow-builder-core.v1/utils/update-template-placeholder-references";
import AIGenerationModal from "@wso2is/common.ai.v1/components/ai-generation-modal";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Edge, MarkerType, Node, NodeTypes, useEdgesState, useNodesState, useUpdateNodeInternals } from "@xyflow/react";
import { UpdateNodeInternals } from "@xyflow/system";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import isEqual from "lodash-es/isEqual";
import mergeWith from "lodash-es/mergeWith";
import unionWith from "lodash-es/unionWith";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { v4 as uuidv4 } from "uuid";
import RegistrationFlowAILoader from "./ai-registration-flow-generation-loader";
import StaticNodeFactory from "./resources/steps/static-step-factory";
import StepFactory from "./resources/steps/step-factory";
import useAIRegistrationFlowGenerationResult from "../api/use-ai-registration-flow-result";
import useGetRegistrationFlow from "../api/use-get-registration-flow";
import useGetRegistrationFlowBuilderResources from "../api/use-get-registration-flow-builder-resources";
import { REGISTRATION_FLOW_AI_PROMPT_HISTORY_PREFERENCE_KEY } from "../constants/registration-flow-ai-constants";
import RegistrationFlowExecutorConstants from "../constants/registration-flow-executor-constants";
import useAIGeneratedRegistrationFlow from "../hooks/use-ai-generated-registration-flow";
import useDefaultFlow from "../hooks/use-default-flow";
import useGenerateRegistrationFlow, {
    UseGenerateRegistrationFlowFunction
} from "../hooks/use-generate-registration-flow";
import { RegistrationStaticStepTypes } from "../models/flow";

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
    const { addEmailVerificationEdges, addEmailVerificationNodes, generateProfileAttributes } = useDefaultFlow();

    const updateNodeInternals: UpdateNodeInternals = useUpdateNodeInternals();
    const flowUpdatesInProgress: MutableRefObject<boolean> = useRef<boolean>(false);
    const nodesUpdatedRef: MutableRefObject<boolean> = useRef<boolean>(false);

    const [ showAIGenerationModal, setShowAIGenerationModal ] = useState(false);

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const {
        flowGenerationCompleted,
        isFlowGenerating,
        operationId,
        setUserPrompt,
        setIsFlowGenerating,
        setFlowGenerationCompleted,
        userPrompt,
        setAIGeneratedFlow,
        aiGeneratedFlow
    } = useAIGeneratedRegistrationFlow();

    const {
        data: flowData,
        error: flowError
    } = useAIRegistrationFlowGenerationResult(operationId, flowGenerationCompleted);

    const generateAIRegistrationFlow: UseGenerateRegistrationFlowFunction = useGenerateRegistrationFlow();

    const {
        data: registrationFlow,
        error: registrationFlowFetchRequestError,
        isLoading: isRegistrationFlowFetchRequestLoading,
        isValidating: isRegistrationFlowFetchRequestValidating
    } = useGetRegistrationFlow();

    const { data: resources } = useGetRegistrationFlowBuilderResources();

    const { steps, templates } = resources;

    const INITIAL_FLOW_START_STEP_ID: string = StaticStepTypes.Start.toLowerCase();
    const INITIAL_FLOW_VIEW_STEP_ID: string = generateResourceId(StepTypes.View.toLowerCase());
    const INITIAL_FLOW_USER_ONBOARD_STEP_ID: string = StaticStepTypes.UserOnboard;
    const SAMPLE_PROMPTS: string[] = [
        "Ask the user to supply an email address and choose a strong password to begin the sign-up.",
        "Prompt for a unique username and password, ensuring the password meets basic complexity rules.",
        "In the first step provide option to Sign up with Password or Sign up with Email",
        "Gather basic personal details (e.g., first name, last name) plus an email and password up front.",
        "Offer the option to Sign up with password or Sign up with Google. If the password " +
            "option is selected, ask for first name, last name, password. Then verify the email of the user."
    ];

    useEffect(() => {
        if (flowError) {
            setIsFlowGenerating(false);
            setFlowGenerationCompleted(false);

            dispatch(
                addAlert<AlertInterface>({
                    description: t("ai:aiRegistrationFlow.notifications.generateResultError.description"),
                    level: AlertLevels.ERROR,
                    message: t("ai:aiRegistrationFlow.notifications.generateResultError.message")
                })
            );

            return;
        }

        if (flowData?.status === "FAILED") {
            setIsFlowGenerating(false);
            setFlowGenerationCompleted(false);

            // if data.data contains an object error then use that as the error message
            const errorMessage: string = "error" in flowData.data
                ? flowData.data.error : t("ai:aiRegistrationFlow.notifications.generateResultFailed.message");

            dispatch(
                addAlert<AlertInterface>({
                    description: errorMessage,
                    level: AlertLevels.ERROR,
                    message: t("ai:aiRegistrationFlow.notifications.generateResultFailed.message")
                })
            );

            return;
        }

        if (flowData?.status === "COMPLETED" && flowData.data) {
            handleAIGeneratedFlow(flowData.data);
        }
    }, [ flowData, flowGenerationCompleted ]);

    /**
     * Dispatches an error alert if the flow fetch fails.
     */
    useEffect(() => {
        if (registrationFlowFetchRequestError) {
            dispatch(
                addAlert({
                    description: "An error occurred while fetching the registration flow.",
                    level: AlertLevels.ERROR,
                    message: "Couldn't retrieve  the registration flow."
                })
            );
        }
    }, [ registrationFlowFetchRequestError ]);

    const handleAIFlowGeneration = async () => {
        const traceID: string = uuidv4();

        await generateAIRegistrationFlow(userPrompt, traceID);
        setShowAIGenerationModal(false);
    };

    const handleAIGeneratedFlow = (data: any) => {
        if (!data?.steps) {
            return [ [], [] ];
        }

        const aiGeneratedRegistrationFlow: any = {
            "category": "STARTER",
            "config": {
                data : data
            },
            "deprecated": false,
            "display": {
                "description": "Start a new flow from scratch",
                "image": "",
                "label": "Blank",
                "showOnResourcePanel": false
            },
            "resourceType": "TEMPLATE",
            "type": "AI",
            "version": "0.1.0"
        };

        setAIGeneratedFlow(aiGeneratedRegistrationFlow);
        setShowAIGenerationModal(false);
        setIsFlowGenerating(false);

        dispatch(
            addAlert<AlertInterface>({
                description: t("ai:aiRegistrationFlow.notifications.generateSuccess.description"),
                level: AlertLevels.SUCCESS,
                message: t("ai:aiRegistrationFlow.notifications.generateSuccess.message")
            })
        );
    };

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

    const getBasicTemplateComponents = (): Element[] => {
        const basicTemplate: Template = cloneDeep(
            templates.find((template: Template) => template.type === TemplateTypes.Basic)
        );

        generateProfileAttributes(basicTemplate);

        if (basicTemplate?.config?.data?.steps?.length > 0) {
            basicTemplate.config.data.steps[0].id = INITIAL_FLOW_START_STEP_ID;
        }

        return resolveComponentMetadata(
            resources,
            generateIdsForResources<Template>(basicTemplate)?.config?.data?.steps[0]?.data?.components
        );
    };

    const initialTemplateComponents: Element[] = useMemo(
        () => getBasicTemplateComponents(), [ resources, generateProfileAttributes ]);

    const generateSteps: (steps: Node[]) => Node[] = useCallback((steps: Node[]): Node[] => {
        const START_STEP: Node = {
            data: {
                displayOnly: true
            },
            deletable: false,
            id: INITIAL_FLOW_START_STEP_ID,
            position: { x: -300, y: 330 },
            type: StaticStepTypes.Start
        };

        const processedSteps: Step[] = resolveStepMetadata(resources, generateIdsForResources<Node[]>([
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
        ]) as Step[]);

        addEmailVerificationNodes(processedSteps);

        return processedSteps as Node[];
    }, [ resources, addEmailVerificationNodes ]);

    /**
     * Validate edges based on the nodes.
     *
     * @param edges - Edges to validate.
     * @param nodes - Nodes to validate against.
     * @returns Validated edges.
     */
    const validateEdges = (edges: Edge[], nodes: Node[]): Edge[] => {
        const nodeIds: Set<string> = new Set(nodes.map((node: Node) => node.id));

        return edges.filter((edge: Edge) => {
            if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
                return false;
            }

            return true;
        });
    };

    const generateEdges = (steps: Step[]): Edge[] => {
        let edges: Edge[] = [];

        // Get all step IDs for validation
        const stepIds: string[] = steps.map((step: Step) => step.id);

        // Find the user onboard step
        const userOnboardStep: Step | undefined = steps.find((step: Step) => step.type === StaticStepTypes.UserOnboard);

        // Get the ID of the user onboard step or use the default one
        const userOnboardStepId: string = userOnboardStep?.id || INITIAL_FLOW_USER_ONBOARD_STEP_ID;

        // Check if we need to connect start to the first step
        if (steps.length > 0) {
            let firstStep: Step = steps[0];

            // TODO: Handle this better. Templates have a `Start` node, but the black starter doesn't.
            if (firstStep.id === INITIAL_FLOW_START_STEP_ID) {
                firstStep = steps[1];
            }

            if (firstStep) {
                edges.push({
                    animated: false,
                    id: `${INITIAL_FLOW_START_STEP_ID}-${firstStep.id}`,
                    markerEnd: {
                        type: MarkerType.Arrow
                    },
                    source: INITIAL_FLOW_START_STEP_ID,
                    sourceHandle: `${INITIAL_FLOW_START_STEP_ID}${VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX}`,
                    target: firstStep.id,
                    type: "base-edge"
                });
            }
        }

        // Flag to track if we've already created an edge to the user onboard step
        let userOnboardEdgeCreated: boolean = false;

        const createEdgesForButtons = (step: Step, button: Element): Edge[] => {
            const edges: Edge[] = [];

            if (button.action?.next) {
                // If next points to a valid step, create that edge
                if (stepIds.includes(button.action.next)) {
                    edges.push({
                        animated: false,
                        id: button.id,
                        markerEnd: {
                            type: MarkerType.Arrow
                        },
                        source: step.id,
                        sourceHandle: `${button.id}${VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX}`,
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
                        markerEnd: {
                            type: MarkerType.Arrow
                        },
                        source: step.id,
                        sourceHandle: `${button.id}${VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX}`,
                        target: userOnboardStepId,
                        type: "base-edge"
                    });
                    userOnboardEdgeCreated = true;
                }
            } else if (button.action?.executor?.name === RegistrationFlowExecutorConstants.PASSWORD_ONBOARD_EXECUTOR) {
                // For PasswordOnboardExecutor buttons without explicit next,
                // create an edge to the user onboard step
                edges.push({
                    animated: false,
                    id: button.id,
                    markerEnd: {
                        type: MarkerType.Arrow
                    },
                    source: step.id,
                    sourceHandle: `${button.id}${VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX}`,
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
                        const buttons: Element[] | undefined = component.components?.filter(
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
                        markerEnd: {
                            type: MarkerType.Arrow
                        },
                        source: step.id,
                        sourceHandle: `${step.id}${VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX}`,
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
                        markerEnd: {
                            type: MarkerType.Arrow
                        },
                        source: step.id,
                        sourceHandle: `${step.id}${VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX}`,
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
            const viewSteps: Step[] = steps.filter((step: Step) => step.type === StepTypes.View);

            if (viewSteps.length > 0) {
                // Get the last view step
                const lastViewStep: Step = viewSteps[viewSteps.length - 1];

                // Find a button in this step to use for the connection
                let buttonId: string | null = null;

                if (lastViewStep.data?.components) {
                    for (const component of lastViewStep.data.components) {
                        if (component.type === BlockTypes.Form) {
                            const button: Element | undefined = component.components?.find(
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
                const edgeId: string = buttonId || `${lastViewStep.id}-to-${userOnboardStepId}`;

                edges.push({
                    animated: false,
                    id: edgeId,
                    markerEnd: {
                        type: MarkerType.Arrow
                    },
                    source: lastViewStep.id,
                    ...(buttonId
                        ? { sourceHandle: `${buttonId}${VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX}` }
                        : { sourceHandle: `${lastViewStep.id}${VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX}` }),
                    target: userOnboardStepId,
                    type: "base-edge"
                });
            }
        }

        addEmailVerificationEdges(edges);

        return edges;
    };

    const initialNodes: Node[] = useMemo<Node[]>(() => {
        return generateSteps([
            {
                data: {
                    components: initialTemplateComponents
                },
                deletable: true,
                id: INITIAL_FLOW_VIEW_STEP_ID,
                position: { x: 0, y: 330 },
                type: StepTypes.View
            },
            {
                data: {},
                deletable: false,
                id: INITIAL_FLOW_USER_ONBOARD_STEP_ID,
                position: { x: 500, y: 408 },
                type: StaticStepTypes.UserOnboard
            }
        ]);
    }, [ initialTemplateComponents, generateSteps ]);

    const [ nodes, setNodes, onNodesChange ] = useNodesState([]);
    const [ edges, setEdges, onEdgesChange ] = useEdgesState([]);

    /**
     * Helper function to update node internals for a given node and its components.
     *
     * @param nodes - Set of nodes to update.
     */
    const updateAllNodeInternals = (nodes: Node[]): void => {
        nodes.forEach((node: Node) => {
            updateNodeInternals(node.id);

            if (node.data?.components) {
                (node.data.components as Element[]).forEach((component: Element) => {
                    updateNodeInternals(component.id);

                    if (component?.components) {
                        component.components.forEach((nestedComponent: Element) => {
                            updateNodeInternals(nestedComponent.id);
                        });
                    }
                });
            }
        });
    };

    /**
     * Uses a sequence of state updates and RAF calls.
     *
     * @param steps - Steps to update the flow with.
     */
    const updateFlowWithSequence = (steps: Node[]): void => {
        if (flowUpdatesInProgress.current) {
            // "Flow update already in progress, skipping..
            return;
        }

        flowUpdatesInProgress.current = true;
        nodesUpdatedRef.current = false;

        setNodes(() => {
            nodesUpdatedRef.current = true;

            return steps;
        });

        const updateSequence = () => {
            if (!nodesUpdatedRef.current) {
                requestAnimationFrame(updateSequence);

                return;
            }

            updateAllNodeInternals(steps);

            requestAnimationFrame(() => {
                const generatedEdges: Edge[] = generateEdges(steps as any);
                const validatedEdges: Edge[] = validateEdges(generatedEdges, steps);

                setEdges(() => validatedEdges);

                flowUpdatesInProgress.current = false;
            });
        };

        requestAnimationFrame(updateSequence);
    };

    /**
     * Effect that updates the flow with the registration flow steps.
     */
    useLayoutEffect(() => {
        if (!isRegistrationFlowFetchRequestLoading && !isRegistrationFlowFetchRequestValidating) {
            if (!isEmpty(registrationFlow?.steps)) {
                const steps: Node[] = generateSteps(registrationFlow.steps);

                updateFlowWithSequence(steps);
            } else {
                updateFlowWithSequence(initialNodes);
            }
        }
    }, [
        registrationFlow?.steps,
        isRegistrationFlowFetchRequestLoading,
        isRegistrationFlowFetchRequestValidating,
        initialNodes
    ]);

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

        const regStaticStepNodes: NodeTypes = Object.values(RegistrationStaticStepTypes).reduce(
            (acc: NodeTypes, type: RegistrationStaticStepTypes) => {
                acc[type] = (props: any) => <StaticNodeFactory type={ type } { ...props } />;

                return acc;
            },
            {}
        );

        return {
            ...staticStepNodes,
            ...stepNodes,
            ...regStaticStepNodes
        };
    };

    const handleMutateComponents = (components: Element[]): Element[] => {
        let modifiedComponents: Element[] = cloneDeep(components);

        const formCount: number = modifiedComponents.filter((c: Element) => c.type === BlockTypes.Form).length;

        if (formCount > 1) {
            let firstFormFound: boolean = false;

            modifiedComponents = modifiedComponents.filter((c: Element) => {
                if (c.type === BlockTypes.Form) {
                    if (!firstFormFound) {
                        firstFormFound = true;

                        return true;
                    }

                    return false;
                }

                return true;
            });
        }

        // Check inside `forms`, if there is a form with a password field and there's only one submit button,
        // Set the `"action": { "type": "EXECUTOR", "executor": { "name": "PasswordOnboardExecutor"}, "next": "" }`
        modifiedComponents = modifiedComponents.map((component: Element) => {
            if (component.type === BlockTypes.Form) {
                // Set all the `PRIMARY` buttons inside the form type to `submit`.
                component.components = component?.components?.map((formComponent: Element) => {
                    if (
                        formComponent.type === ElementTypes.Button &&
                                        formComponent.variant === ButtonVariants.Primary
                    ) {
                        return {
                            ...formComponent,
                            config: {
                                ...formComponent.config,
                                type: ButtonTypes.Submit
                            }
                        };
                    }

                    return formComponent;
                });

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
                                        ...(formComponent?.action ?? {}),
                                        executor: {
                                            name: RegistrationFlowExecutorConstants.PASSWORD_ONBOARD_EXECUTOR
                                        },
                                        type: "EXECUTOR"
                                    }
                                };
                            }
                        } else if (hasOtpField) {
                            if (formComponent.type === ElementTypes.Button) {
                                return {
                                    ...formComponent,
                                    action: {
                                        ...(formComponent?.action ?? {}),
                                        executor: {
                                            name: RegistrationFlowExecutorConstants.EMAIL_OTP_EXECUTOR
                                        },
                                        type: "EXECUTOR"
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

    const handleTemplateLoad = (template: Template): [Node[], Edge[], Resource?, string?] => {
        if (template?.type === "GENERATE_WITH_AI") {
            setShowAIGenerationModal(true);

            return [ [], [], null, null ];
        }

        if (!template?.config?.data?.steps) {
            return [ [], [], null, null ];
        }

        const replacers: any = template?.config?.data?.__generationMeta__?.replacers;

        const [ templateSteps ] = updateTemplatePlaceholderReferences(
            generateSteps(template.config.data.steps as any),
            replacers
        );

        const templateEdges: Edge[] = validateEdges(
            generateEdges(templateSteps as any),
            templateSteps
        ) as Edge[];

        // Handle BASIC_FEDERATED template case
        if (template.type === TemplateTypes.BasicFederated) {
            const googleExecutionStep: Node | undefined = templateSteps.find(
                (step: Node) => step.type === StepTypes.Execution
            );

            if (googleExecutionStep) {
                return [ templateSteps, templateEdges, googleExecutionStep as Resource, googleExecutionStep.id ];
            }
        }

        return [ templateSteps, templateEdges, null, null ];
    };

    const generateUnconnectedEdges = (currentEdges: Edge[], currentNodes: Node[]): Edge[] => {
        const nodeIds: Set<string> = new Set(currentNodes.map((node: Node) => node.id));
        const missingEdges: Edge[] = [];

        const processAction = (stepId: string, resourceId: string, action: any): void => {
            if (action?.next) {
                const buttonId: string = resourceId;
                const expectedTarget: string = action.next;

                // Ensure expected target exists in nodes
                if (!nodeIds.has(expectedTarget)) {
                    // Log warning for missing target node
                    return;
                }

                const existingEdge: Edge | undefined = currentEdges.find(
                    (edge: Edge) => edge.source === stepId && edge.sourceHandle === `${buttonId}_NEXT`
                );

                // If no edge exists or it's pointing to the wrong node, add a missing edge
                if (!existingEdge || existingEdge.target !== expectedTarget) {
                    missingEdges.push({
                        animated: false,
                        id: `${buttonId}_MISSING_EDGE`,
                        markerEnd: {
                            type: MarkerType.Arrow
                        },
                        source: stepId,
                        sourceHandle: `${buttonId}_NEXT`,
                        target: expectedTarget,
                        type: "base-edge"
                    });
                }
            }
        };

        currentNodes.forEach((node: Node) => {
            if (!node.data) {
                return;
            };

            if (node.data?.components) {
                (node.data?.components as any).forEach((component: Element) => {
                    processAction(node.id, component.id, component.action);

                    // Process `FORM` components.
                    if (component?.components) {
                        component.components.forEach((nestedComponent: Element) =>
                            processAction(node?.id, nestedComponent.id, nestedComponent.action)
                        );
                    }
                });
            }

            if (node.data?.action) {
                processAction(node.id, node.id, node.data.action);
            }
        });

        return missingEdges;
    };

    const handleWidgetLoad = (
        widget: Widget,
        targetResource: Resource,
        currentNodes: Node[],
        currentEdges: Edge[]
    ): [Node[], Edge[], Resource, string] => {
        const widgetFlow: any = widget.config.data;

        if (!widgetFlow || !widgetFlow.steps) {
            return [ currentNodes, currentEdges, null, null ];
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
                const strategy: string = step.__generationMeta__.strategy;

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

        const replacers: any = widgetFlow.__generationMeta__.replacers;
        const defaultPropertySelectorId: string = widgetFlow.__generationMeta__.defaultPropertySelectorId;
        let defaultPropertySectorStepId: string = null;
        let defaultPropertySelector: Resource = null;

        // Resolve step & component metadata.
        newNodes = resolveStepMetadata(
            resources,
            generateIdsForResources<Node[]>(
                newNodes.map((step: Node) => {
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
            ) as Step[]
        ) as Node[];

        // TODO: Improve this block perf.
        newNodes.forEach((node: Node) => {
            if (node.id === defaultPropertySelectorId) {
                defaultPropertySectorStepId = node.id;
                defaultPropertySelector = node as Resource;

                return;
            }

            if (!isEmpty(node?.data?.components)) {
                (node.data.components as Element[]).forEach((component: Element) => {
                    if (component.id === defaultPropertySelectorId) {
                        defaultPropertySectorStepId = node.id;
                        defaultPropertySelector = component as Resource;

                        return;
                    }

                    if (!isEmpty(component?.components)) {
                        if (component.id === defaultPropertySelectorId) {
                            defaultPropertySectorStepId = node.id;
                            defaultPropertySelector = component as Resource;

                            return;
                        }
                    }
                });
            }
        });

        const [ updatedNodes, replacedPlaceholders ] = updateTemplatePlaceholderReferences(
            generateIdsForResources(newNodes),
            replacers
        );

        newEdges = [ ...newEdges, ...generateUnconnectedEdges(newEdges, updatedNodes) ];

        // Check if `defaultPropertySelector.id` is in the `replacedPlaceholders`.
        // If so, update them with the replaced value.
        if (replacedPlaceholders.has(defaultPropertySelector?.id?.replace(/[{}]/g, ""))) {
            defaultPropertySelector.id = replacedPlaceholders.get(defaultPropertySelector.id.replace(/[{}]/g, ""));
        }

        // Check if `defaultPropertySectorStepId` is in the `replacedPlaceholders`.
        // If so, update them with the replaced value.
        if (replacedPlaceholders.has(defaultPropertySectorStepId?.replace(/[{}]/g, ""))) {
            defaultPropertySectorStepId = replacedPlaceholders.get(defaultPropertySectorStepId.replace(/[{}]/g, ""));
        }

        return [ updatedNodes, newEdges, defaultPropertySelector, defaultPropertySectorStepId ];
    };

    const handleStepLoad = (step: Step): Step => {
        // If the step is of type `VIEW` and has no components, set the default components.
        if (step.type === StepTypes.View) {
            if (isEmpty(step?.data?.components)) {
                return {
                    ...step,
                    data: {
                        ...step.data,
                        components: getBlankTemplateComponents()
                    }
                };
            }
        }

        const processedStep: Step = generateIdsForResources<Step>(step);

        if (processedStep?.data?.components) {
            processedStep.data.components = resolveComponentMetadata(
                resources,
                processedStep.data.components
            );
        }

        return resolveStepMetadata(
            resources,
            [ processedStep ]
        )[0] as Step;
    };

    const handleResourceAdd = (resource: Resource): void => {
        // If the template type is `GENERATE_WITH_AI`, show the AI generation modal.
        if (resource.type === TemplateTypes.GeneratedWithAI) {
            setShowAIGenerationModal(true);

            return;
        }
    };

    if (isRegistrationFlowFetchRequestLoading || isRegistrationFlowFetchRequestValidating) {
        return null;
    }

    return (
        <>
            <FlowBuilder
                aiGeneratedFlow={ aiGeneratedFlow }
                resources={ resources }
                data-componentid={ componentId }
                nodeTypes={ generateNodeTypes() }
                mutateComponents={ handleMutateComponents }
                onTemplateLoad={ handleTemplateLoad }
                onWidgetLoad={ handleWidgetLoad }
                onStepLoad={ handleStepLoad }
                onResourceAdd={ handleResourceAdd }
                nodes={ nodes }
                edges={ edges }
                setNodes={ setNodes }
                setEdges={ setEdges }
                onNodesChange={ onNodesChange }
                onEdgesChange={ onEdgesChange }
                { ...rest }
            />
            {
                showAIGenerationModal && (
                    <AIGenerationModal
                        onUserPromptSubmit={ handleAIFlowGeneration }
                        setUserPrompt={ setUserPrompt }
                        open={ showAIGenerationModal }
                        handleModalClose={ () => setShowAIGenerationModal(false) }
                        samplePrompts={ SAMPLE_PROMPTS }
                        userPrompt={ userPrompt }
                        showHistory={ true }
                        promptHistoryPreferenceKey={ REGISTRATION_FLOW_AI_PROMPT_HISTORY_PREFERENCE_KEY }
                    />
                )
            }
            { isFlowGenerating && <RegistrationFlowAILoader /> }
        </>
    );
};

export default RegistrationFlowBuilderCore;
