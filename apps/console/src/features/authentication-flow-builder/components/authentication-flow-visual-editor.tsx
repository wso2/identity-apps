/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import Button from "@oxygen-ui/react/Button";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import classNames from "classnames";
import cloneDeep from "lodash-es/cloneDeep";
import React, {
    ChangeEvent,
    FunctionComponent,
    HTMLAttributes,
    ReactElement,
    SVGAttributes,
    SyntheticEvent,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import ReactFlow, {
    Background,
    BackgroundVariant,
    Controls,
    Edge,
    EdgeTypes,
    MarkerType,
    Node,
    NodeTypes
} from "reactflow";
import { Dispatch } from "redux";
import AuthenticationFlowOptionAddModal from "./authentication-flow-option-add-modal";
import AuthenticationFlowRevertDisclaimerModal from "./authentication-flow-revert-disclaimer-modal";
import StepAdditionEdge from "./edges/step-addition-edge";
import DoneNode from "./nodes/done-node";
import SignInBoxNode from "./nodes/sign-in-box-node/sign-in-box-node";
import {
    updateAuthenticationSequence as updateAuthenticationSequenceFromAPI
} from "../../applications/api/application";
import {
    AuthenticationSequenceInterface,
    AuthenticationSequenceType,
    AuthenticationStepInterface
} from "../../applications/models/application";
import {
    AdaptiveScriptUtils
} from "../../applications/utils/adaptive-script-utils";
import useAuthenticationFlow from "../hooks/use-authentication-flow";
import "reactflow/dist/style.css";
import "./authentication-flow-visual-editor.scss";

/**
 * Prop types for the visual editor component.
 */
export interface AuthenticationFlowVisualEditorPropsInterface extends IdentifiableComponentInterface,
    HTMLAttributes<HTMLDivElement> {
    /**
     * Callback to trigger IDP create wizard.
     */
    onIDPCreateWizardTrigger: (type: string, cb: () => void, template?: any) => void;
}

// TODO: Move this to Oxygen UI once https://github.com/wso2/oxygen-ui/issues/158 is fixed.
const ArrowRotateLeft = ({ ...rest }: SVGAttributes<SVGSVGElement>): ReactElement => (
    <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
        { ...rest }
    >
        <path
            fill="none"
            stroke="#000"
            strokeWidth="2"
            d="M8,3 L3,8 L8,13 M12,20 L15,20 C18.3137085,20 21,17.3137085 21,14 C21,10.6862915 18.3137085,8 15,8 L4,8"
        ></path>
    </svg>
);

/**
 * Visual editor component.
 *
 * @param props - Props injected to the component.
 * @returns Visual editor component.
 */
const AuthenticationFlowVisualEditor: FunctionComponent<AuthenticationFlowVisualEditorPropsInterface> = (
    props: AuthenticationFlowVisualEditorPropsInterface
): ReactElement => {
    const { onIDPCreateWizardTrigger, "data-componentid": componentId, ...rest } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const {
        applicationMetaData,
        authenticators,
        authenticationSequence,
        addSignInStep,
        addSignInOption,
        defaultAuthenticationSequence,
        isAdaptiveAuthAvailable,
        isValidAuthenticationFlow,
        refetchApplication,
        removeSignInOption,
        removeSignInStep,
        revertAuthenticationSequenceToDefault,
        updateAuthenticationSequence,
        visualEditorFlowNodeMeta
    } = useAuthenticationFlow();

    const [ authenticatorAddStep, setAuthenticatorAddStep ] = useState<number>(0);
    const [ showAuthenticatorAddModal, setShowAuthenticatorAddModal ] = useState<boolean>(false);
    const [ showRevertDisclaimerModal, setShowRevertDisclaimerModal ] = useState<boolean>(false);

    const nodeTypes: NodeTypes = useMemo(() => ({ done: DoneNode, loginBox: SignInBoxNode }), []);
    const edgeTypes: EdgeTypes = useMemo(() => ({ stepAdditionEdge: StepAdditionEdge }), []);
    const nodes: Node[] = useMemo(() => {
        const x: number = 0;
        const y: number = 0;
        const xOffset: number = 250;

        const doneNode: Node = {
            data: {
                "data-componentid": "done-node"
            },
            id: "-1",
            position: { x, y },
            type: "done"
        };

        const stepNodes: (Node & IdentifiableComponentInterface)[] = [];

        authenticationSequence?.steps?.filter((step: AuthenticationStepInterface, index: number) => {
            const signInBoxNode: Node = {
                data: {
                    authenticationSequence,
                    authenticators,
                    "data-componentid": "sign-in-box-node",
                    onAttributeIdentifierStepChange: (
                        _: ChangeEvent<HTMLInputElement>,
                        { stepIndex }: { stepIndex: number }
                    ) => {
                        updateAuthenticationSequence({
                            attributeStepId: stepIndex
                        });
                    },
                    onSignInOptionAdd: (
                        _: SyntheticEvent<HTMLButtonElement | HTMLInputElement>,
                        { stepIndex, toAdd }: { stepIndex: number; toAdd: string }
                    ) => {
                        if (toAdd) {
                            addSignInOption(stepIndex, toAdd);

                            return;
                        }

                        setShowAuthenticatorAddModal(true);
                        setAuthenticatorAddStep(stepIndex);
                    },
                    onSignInOptionRemove: (
                        _: SyntheticEvent<HTMLButtonElement | HTMLInputElement>,
                        { stepIndex, toRemove }: { stepIndex: number; toRemove: string }
                    ) => {
                        removeSignInOption(stepIndex, toRemove);
                    },
                    onSignInOptionSwitch: (
                        _: SyntheticEvent<HTMLButtonElement | HTMLInputElement>,
                        { stepIndex, toRemove, toAdd }: { stepIndex: number; toRemove: string; toAdd: string }
                    ) => {
                        removeSignInOption(stepIndex, toRemove);
                        addSignInOption(stepIndex, toAdd);
                    },
                    onSignInStepRemove: (
                        _: SyntheticEvent<HTMLButtonElement | HTMLInputElement>,
                        { stepIndex }: { stepIndex: number }
                    ) => {
                        removeSignInStep(stepIndex);
                    },
                    onSubjectIdentifierStepChange: (
                        _: SyntheticEvent<HTMLButtonElement | HTMLInputElement>,
                        { stepIndex }: { stepIndex: number }
                    ) => {
                        updateAuthenticationSequence({
                            subjectStepId: stepIndex
                        });
                    },
                    stepIndex: index
                },
                id: `${step.id}`,
                position: { x, y },
                type: "loginBox"
            };

            stepNodes.push(signInBoxNode);

            if (index === authenticationSequence.steps.length - 1) {
                stepNodes.push({
                    ...doneNode,
                    id: `${index + 2}`,
                    position: { x, y }
                });
            }
        });

        stepNodes.forEach((node: Node, index: number) => {
            const previousNode: Node = stepNodes[index - 1];
            const previousNodeHeight: number = visualEditorFlowNodeMeta[parseInt(node.id) - 1]?.height;
            const previousNodeWidth: number = visualEditorFlowNodeMeta[parseInt(node.id) - 1]?.width;
            const currentNodeHeight: number = visualEditorFlowNodeMeta[parseInt(node.id)]?.height;
            const currentNodeWidth: number = visualEditorFlowNodeMeta[parseInt(node.id)]?.width;

            if (previousNodeHeight && currentNodeHeight) {
                // Calculate the center position of the previous node
                const previousNodeCenterY: number = previousNode.position.y + previousNodeHeight / 2;

                // Calculate the new y position for the current node to align it with the center of the previous node
                node.position.y = previousNodeCenterY - currentNodeHeight / 2;
            }

            if (previousNodeWidth && currentNodeWidth) {
                // Calculate the new x position for the current node to align it with the width of the previous node
                node.position.x = previousNode.position.x + previousNodeWidth / 2 + xOffset;
            }

            // Moderation to the start node & done node.
            if (node.id === stepNodes.length.toString()) {
                node.position.x = node.position.x + xOffset / 2;
            }
        });

        return stepNodes;
    }, [ authenticationSequence, authenticators, visualEditorFlowNodeMeta ]);

    const edges: Edge[] = useMemo(() => {
        const lastNodeId: number = nodes.length - 1;

        const edgeStyles: Partial<Edge> = {
            markerEnd: {
                color: "#696969",
                height: 20,
                type: MarkerType.Arrow,
                width: 20
            },
            style: {
                stroke: "#696969",
                strokeWidth: 2
            }
        };

        const stepEdges: Edge[] = cloneDeep(nodes)
            .slice(0, lastNodeId)
            .map((_: Node, index: number) => {
                return {
                    id: `${index}-${index + 1}`,
                    source: `${index}`,
                    target: `${index + 1}`,
                    ...edgeStyles
                };
            });

        const stepAdditionEdge: Edge & IdentifiableComponentInterface = {
            data: {
                onNewStepAddition: () => {
                    addSignInStep();
                }
            },
            "data-componentid": "step-addition-edge",
            id: `${lastNodeId}-${lastNodeId + 1}`,
            source: `${lastNodeId}`,
            target: `${lastNodeId + 1}`,
            type: "stepAdditionEdge",
            ...edgeStyles
        };

        stepEdges.push(stepAdditionEdge);

        return stepEdges;
    }, [ authenticationSequence, nodes ]);

    /**
     * Handles the `onUpdate` callback of the `VisualEditor`.
     *
     * @param newSequence - Updated sequence.
     * @param isRevertFlow - Is triggered from revert flow.
     */
    const handleOnUpdate = (
        newSequence: AuthenticationSequenceInterface = authenticationSequence,
        isRevertFlow?: boolean
    ): void => {
        const sequence: AuthenticationSequenceInterface = {
            ...cloneDeep(newSequence),
            type: isRevertFlow
                ? AuthenticationSequenceType.DEFAULT
                : AuthenticationSequenceType.USER_DEFINED
        };

        if (!isAdaptiveAuthAvailable) {
            sequence.script = "";
        } else if (AdaptiveScriptUtils.isEmptyScript(authenticationSequence.script)) {
            sequence.script = AdaptiveScriptUtils.generateScript(authenticationSequence.steps.length + 1).join(
                "\n"
            );
        }

        // Update the modified script state in the context.
        updateAuthenticationSequence({
            ...newSequence,
            script: sequence.script
        });

        updateAuthenticationSequenceFromAPI(applicationMetaData?.id, { authenticationSequence: sequence })
            .then(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "console:develop.features.applications.notifications.updateAuthenticationFlow" +
                                ".success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:develop.features.applications.notifications.updateAuthenticationFlow" +
                                ".success.message"
                        )
                    })
                );
            })
            .finally(() => refetchApplication());
    };

    return (
        <>
            <div
                className={ classNames("react-flow-container", "visual-editor") }
                data-componentid={ componentId }
                { ...rest }
            >
                <Button
                    className="revert-to-default-button"
                    color="secondary"
                    onClick={ () => setShowRevertDisclaimerModal(true) }
                    data-componentid={ `${componentId}-revert-button` }
                >
                    <ArrowRotateLeft />
                    { t("console:loginFlow.visualEditor.actions.revert.label") }
                </Button>
                <ReactFlow
                    fitView
                    nodeTypes={ nodeTypes }
                    edgeTypes={ edgeTypes }
                    nodes={ nodes }
                    edges={ edges }
                    proOptions={ { hideAttribution: true } }
                >
                    <Background color={ "#e1e1e1" } gap={ 16 } variant={ BackgroundVariant.Dots } size={ 2 } />
                    <Controls />
                    <Button
                        color="primary"
                        variant="contained"
                        className="update-button"
                        onClick={ () => handleOnUpdate() }
                        disabled={ !isValidAuthenticationFlow }
                        data-componentid={ `${componentId}-update-button` }
                    >
                        { t("console:loginFlow.visualEditor.actions.update.label") }
                    </Button>
                </ReactFlow>
            </div>
            { showAuthenticatorAddModal && (
                <AuthenticationFlowOptionAddModal
                    open={ showAuthenticatorAddModal }
                    onClose={ () => setShowAuthenticatorAddModal(false) }
                    currentStep={ authenticatorAddStep }
                    onIDPCreateWizardTrigger={ onIDPCreateWizardTrigger }
                />
            ) }
            <AuthenticationFlowRevertDisclaimerModal
                open={ showRevertDisclaimerModal }
                onClose={ () => setShowRevertDisclaimerModal(false) }
                onPrimaryActionClick={ () => {
                    revertAuthenticationSequenceToDefault();
                    handleOnUpdate(defaultAuthenticationSequence, true);
                    setShowRevertDisclaimerModal(false);
                } }
            />
        </>
    );
};

/**
 * Default props for the component.
 */
AuthenticationFlowVisualEditor.defaultProps = {
    "data-componentid": "authentication-flow-visual-editor"
};

export default AuthenticationFlowVisualEditor;
