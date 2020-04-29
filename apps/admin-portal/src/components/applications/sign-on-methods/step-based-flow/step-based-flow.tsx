/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { GenericIcon, Heading, Hint, PrimaryButton } from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useRef, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { Card, Divider, DropdownProps, Form, Grid, Icon, Popup } from "semantic-ui-react";
import { AuthenticationStep } from "./authentication-step";
import { AuthenticatorSidePanel } from "./authenticator-side-panel";
import { OperationIcons } from "../../../../configs";
import {
    AuthenticationSequenceInterface,
    AuthenticationSequenceType,
    AuthenticationStepInterface,
    AuthenticatorInterface,
    FederatedAuthenticatorInterface,
    GenericAuthenticatorInterface
} from "../../../../models";
import { IdentityProviderManagementUtils } from "../../../../utils";

/**
 * Proptypes for the applications settings component.
 */
interface AuthenticationFlowPropsInterface {
    /**
     * Currently configured authentication sequence for the application.
     */
    authenticationSequence: AuthenticationSequenceInterface;
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to update the application details.
     * @param {AuthenticationSequenceInterface} sequence - Authentication sequence.
     */
    onUpdate: (sequence: AuthenticationSequenceInterface) => void;
    /**
     * Trigger for update.
     */
    triggerUpdate: boolean;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

/**
 * Droppable id for the authentication step.
 * @constant
 * @type {string}
 * @default
 */
const AUTHENTICATION_STEP_DROPPABLE_ID = "authentication-step-";

/**
 * Droppable id for the local authenticators section.
 * @constant
 * @type {string}
 * @default
 */
const LOCAL_AUTHENTICATORS_DROPPABLE_ID = "local-authenticators";

/**
 * Droppable id for the external authenticators section.
 * @constant
 * @type {string}
 * @default
 */
const EXTERNAL_AUTHENTICATORS_DROPPABLE_ID = "external-authenticators";

/**
 * Configure the authentication flow of an application.
 *
 * @param {AuthenticationFlowPropsInterface} props - Props injected to the component.
 *
 * @return {ReactElement}
 */
export const StepBasedFlow: FunctionComponent<AuthenticationFlowPropsInterface> = (
    props: AuthenticationFlowPropsInterface
): ReactElement => {

    const {
        authenticationSequence,
        onUpdate,
        readOnly,
        triggerUpdate
    } = props;

    const dispatch = useDispatch();

    const authenticatorsSidePanelRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);

    const [ federatedAuthenticators, setFederatedAuthenticators ] = useState<GenericAuthenticatorInterface[]>([]);
    const [ localAuthenticators, setLocalAuthenticators ] = useState<GenericAuthenticatorInterface[]>([]);
    const [ authenticationSteps, setAuthenticationSteps ] = useState<AuthenticationStepInterface[]>([]);
    const [ subjectStepId, setSubjectStepId ] = useState<number>(undefined);
    const [ attributeStepId, setAttributeStepId ] = useState<number>(undefined);
    const [ showAuthenticatorsSidePanel, setAuthenticatorsSidePanelVisibility ] = useState<boolean>(true);

    /**
     * Loads federated authenticators and local authenticators
     * on component load.
     */
    useEffect(() => {
        IdentityProviderManagementUtils.getAllAuthenticators()
            .then(([ localAuthenticators, federatedAuthenticators ]) => {
                setLocalAuthenticators(localAuthenticators);
                setFederatedAuthenticators(federatedAuthenticators);
            })
    }, []);

    /**
     * If the `authenticationSequence` prop is available, sets the authentication steps,
     * subject step id, and attribute step id.
     */
    useEffect(() => {
        if (!authenticationSequence) {
            return;
        }

        setAuthenticationSteps(authenticationSequence?.steps);
        setSubjectStepId(authenticationSequence?.subjectStepId);
        setAttributeStepId(authenticationSequence?.attributeStepId);
    }, [ authenticationSequence ]);

    /**
     * Triggered on `showAuthenticatorsSidePanel` change.
     */
    useEffect(() => {
        let width = "100%";

        if (showAuthenticatorsSidePanel) {
            width = `calc(100% - ${ authenticatorsSidePanelRef?.current?.clientWidth }px)`;
        }

        mainContentRef.current.style.width = width;
    }, [ showAuthenticatorsSidePanel ]);

    /**
     * Called when update is triggered.
     */
    useEffect(() => {
        if (!triggerUpdate) {
            return;
        }

        const isValid: boolean = validateSteps();

        if (!isValid) {
            return;
        }

        onUpdate({
            attributeStepId,
            requestPathAuthenticators: [],
            steps: authenticationSteps,
            subjectStepId,
            type: AuthenticationSequenceType.USER_DEFINED
        })
    }, [ triggerUpdate ]);

    /**
     * Validates if the addition to the step is valid.
     *
     * @param {GenericAuthenticatorInterface} authenticator - Authenticator to be added.
     * @param {AuthenticatorInterface[]} options - Current step options
     *
     * @return {boolean} True or false.
     */
    const validateStepAddition = (authenticator: GenericAuthenticatorInterface,
                                  options: AuthenticatorInterface[]): boolean => {

        if (options.find((option) => option.authenticator === authenticator?.defaultAuthenticator?.name)) {
            dispatch(addAlert({
                description: "The same authenticator is not allowed to repeated in a single step.",
                level: AlertLevels.WARNING,
                message: "Not allowed"
            }));

            return false;
        }

        return true;
    };

    /**
     * Updates the authentication step based on the newly added authenticators.
     *
     * @param {number} stepNo - Step number.
     * @param {string} authenticatorId - Id of the authenticator.
     */
    const updateAuthenticationStep = (stepNo: number, authenticatorId: string): void => {
        const authenticators: GenericAuthenticatorInterface[] = [ ...localAuthenticators, ...federatedAuthenticators ];

        const authenticator: GenericAuthenticatorInterface = authenticators
            .find((item) => item.id === authenticatorId);

        if (!authenticator) {
            return;
        }

        const steps: AuthenticationStepInterface[] = [ ...authenticationSteps ];

        const isValid: boolean = validateStepAddition(authenticator, steps[ stepNo ].options);

        if (!isValid) {
            return;
        }

        const defaultAuthenticator = authenticator.authenticators.find(
            (item) => item.authenticatorId === authenticator.defaultAuthenticator.authenticatorId);

        steps[ stepNo ].options.push({ authenticator: defaultAuthenticator.name, idp: authenticator.idp });

        setAuthenticationSteps(steps);
    };

    /**
     * Handles the authenticator drag and drop event.
     * @param {DropResult} result - Droppable value.
     */
    const handleAuthenticatorDrag = (result: DropResult): void => {
        if (!result.destination) {
            return;
        }

        // Remark: result.destination.index was giving unexpected values. Therefore as a workaround, index will be
        // extracted from the draggableId. Since the droppable id is in the form of `authentication-step-0`
        // 0 can be extracted by splitting the string.
        const destinationIndex: number = parseInt(
            result.destination.droppableId.split(AUTHENTICATION_STEP_DROPPABLE_ID).pop(),
            10
        );

        updateAuthenticationStep(destinationIndex, result.draggableId);
    };

    /**
     * Handles step option delete action.
     *
     * @param {number} stepIndex - Index of the step.
     * @param {number} optionIndex - Index of the option.
     */
    const handleStepOptionDelete = (stepIndex: number, optionIndex: number): void => {
        const steps = [ ...authenticationSteps ];
        steps[ stepIndex ].options.splice(optionIndex, 1);
        setAuthenticationSteps(steps);
    };

    /**
     * Handles step option authenticator change.
     *
     * @param {number} stepIndex - Index of the step.
     * @param {number} optionIndex - Index of the option.
     * @param {FederatedAuthenticatorInterface} authenticator - Selected authenticator.
     */
    const handleStepOptionAuthenticatorChange = (stepIndex: number,
                                                 optionIndex: number,
                                                 authenticator: FederatedAuthenticatorInterface): void => {

        const steps: AuthenticationStepInterface[] = [ ...authenticationSteps ];

        steps[ stepIndex ].options[optionIndex].authenticator = authenticator.name;
        setAuthenticationSteps(steps);
    };

    /**
     * Handles step delete action.
     *
     * @param {number} stepIndex - Authentication step.
     */
    const handleStepDelete = (stepIndex: number): void => {
        const steps = [ ...authenticationSteps ];

        if (steps.length <= 1) {
            dispatch(addAlert({
                description: "At least one authentication step is required.",
                level: AlertLevels.WARNING,
                message: "Removal error"
            }));

            return;
        }

        // Remove the step.
        steps.splice(stepIndex, 1);

        // Rebuild the step ids.
        steps.forEach((step, index) => step.id = index + 1);

        setAuthenticationSteps(steps);
    };

    /**
     * Handles the addition of new authentication step.
     */
    const handleAuthenticationStepAdd = (): void => {
        const steps = [ ...authenticationSteps ];

        steps.push({
            id: steps.length + 1,
            options: []
        });

        setAuthenticationSteps(steps);
    };

    /**
     * Handles the subject identifier value onchange event.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event - Change Event.
     * @param data - Dropdown data.
     */
    const handleSubjectRetrievalStepChange =  (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        const { value } = data;
        setSubjectStepId(value as number);
    };

    /**
     * Handles the attribute identifier value onchange event.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event - Change Event.
     * @param data - Dropdown data.
     */
    const handleAttributeRetrievalStepChange = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        const { value } = data;
        setAttributeStepId(value as number);
    };

    /**
     * Validates if the step deletion is valid.
     *
     * @return {boolean} True or false.
     */
    const validateSteps = (): boolean => {

        const steps: AuthenticationStepInterface[] = [ ...authenticationSteps ];

        const found = steps.find((step) => _.isEmpty(step.options));

        if (found) {
            dispatch(addAlert({
                description: "There is an empty authentication step. Please remove it or add authenticators to " +
                    "proceed.",
                level: AlertLevels.WARNING,
                message: "Update error"
            }));

            return false;
        }

        return true;
    };

    /**
     * Toggles the authenticator side panel visibility.
     */
    const toggleAuthenticatorsSidePanelVisibility = (): void => {
        setAuthenticatorsSidePanelVisibility(!showAuthenticatorsSidePanel);
    };

    return (
        <div className={ `authentication-flow-section ${ showAuthenticatorsSidePanel ? "flex" : "" }` }>
            <DragDropContext onDragEnd={ handleAuthenticatorDrag }>
                <div className="main-content" ref={ mainContentRef }>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column computer={ showAuthenticatorsSidePanel ? 16 : 14 }>
                                <Heading as="h4">Authentication flow</Heading>
                                <Heading as="h5">Step based configuration</Heading>
                                <Hint>
                                    Create authentication steps by dragging the local/federated authenticators on to the
                                    relevant steps.
                                </Hint>
                            </Grid.Column>
                            {
                                !showAuthenticatorsSidePanel && (
                                    <Grid.Column computer={ 2 }>
                                        <Card>
                                            <Card.Content>
                                                <Heading as="h6" floated="left" compact>Authenticators</Heading>
                                                <Popup
                                                    trigger={ (
                                                        <div
                                                            className="inline floated right mt-1"
                                                            onClick={ toggleAuthenticatorsSidePanelVisibility }
                                                        >
                                                            <GenericIcon
                                                                icon={
                                                                    showAuthenticatorsSidePanel
                                                                        ? OperationIcons.minimize
                                                                        : OperationIcons.maximize
                                                                }
                                                                size="nano"
                                                                transparent
                                                            />
                                                        </div>
                                                    ) }
                                                    position="top center"
                                                    content="maximize"
                                                    inverted
                                                />
                                            </Card.Content>
                                        </Card>
                                    </Grid.Column>
                                )
                            }
                        </Grid.Row>
                        {
                            !readOnly && (
                                <Grid.Row verticalAlign="middle">
                                    <Grid.Column computer={ 5 } mobile={ 16 }>
                                        <Form>
                                            <Form.Field inline>
                                                <Form.Select
                                                    inline
                                                    compact
                                                    label="Use Subject identifier from"
                                                    className="mr-2"
                                                    placeholder="Select step"
                                                    scrolling
                                                    options={
                                                        authenticationSteps
                                                        && authenticationSteps instanceof Array
                                                        && authenticationSteps.length > 0
                                                        && authenticationSteps.map((step, index) => {
                                                            return {
                                                                key: step.id,
                                                                text: `Step ${ index + 1 }`,
                                                                value: index + 1
                                                            }
                                                        })
                                                    }
                                                    onChange={ handleSubjectRetrievalStepChange }
                                                    value={ subjectStepId }
                                                />
                                            </Form.Field>
                                        </Form>
                                    </Grid.Column>
                                    <Grid.Column computer={ 5 } mobile={ 16 }>
                                        <Form>
                                            <Form.Field inline>
                                                <Form.Select
                                                    inline
                                                    compact
                                                    label="Use Attributes from"
                                                    className="mr-2"
                                                    placeholder="Select step"
                                                    scrolling
                                                    options={
                                                        authenticationSteps
                                                        && authenticationSteps instanceof Array
                                                        && authenticationSteps.length > 0
                                                        && authenticationSteps.map((step, index) => {
                                                            return {
                                                                key: step.id,
                                                                text: `Step ${ index + 1 }`,
                                                                value: index + 1
                                                            }
                                                        })
                                                    }
                                                    onChange={ handleAttributeRetrievalStepChange }
                                                    value={ attributeStepId }
                                                />
                                            </Form.Field>
                                        </Form>
                                    </Grid.Column>
                                    <Grid.Column computer={ 6 } mobile={ 16 } textAlign="right">
                                        <PrimaryButton onClick={ handleAuthenticationStepAdd }>
                                            <Icon name="add"/>New Authentication Step
                                        </PrimaryButton>
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                        <Grid.Row>
                            <Grid.Column computer={ 16 }>
                                <div className="authentication-steps-section">
                                    {
                                        authenticationSteps
                                        && authenticationSteps instanceof Array
                                        && authenticationSteps.length > 0
                                            ? authenticationSteps.map((step, stepIndex) => (
                                                <>
                                                    <AuthenticationStep
                                                        key={ stepIndex }
                                                        authenticators={
                                                            [ ...localAuthenticators, ...federatedAuthenticators ]
                                                        }
                                                        droppableId={ AUTHENTICATION_STEP_DROPPABLE_ID + stepIndex }
                                                        onStepDelete={ handleStepDelete }
                                                        onStepOptionAuthenticatorChange={
                                                            handleStepOptionAuthenticatorChange
                                                        }
                                                        onStepOptionDelete={ handleStepOptionDelete }
                                                        step={ step }
                                                        stepIndex={ stepIndex }
                                                        readOnly={ readOnly }
                                                    />
                                                    <Divider hidden />
                                                </>
                                            ))
                                            : null
                                    }
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                <AuthenticatorSidePanel
                    heading="Authenticators"
                    onSidePanelVisibilityToggle={ toggleAuthenticatorsSidePanelVisibility }
                    readOnly={ readOnly }
                    ref={ authenticatorsSidePanelRef }
                    authenticatorGroup={ [
                        {
                            authenticators: localAuthenticators,
                            droppableId: LOCAL_AUTHENTICATORS_DROPPABLE_ID,
                            heading: "Local"
                        },
                        {
                            authenticators: federatedAuthenticators,
                            droppableId: EXTERNAL_AUTHENTICATORS_DROPPABLE_ID,
                            heading: "External"
                        }
                    ] }
                    visibility={ showAuthenticatorsSidePanel }
                />
            </DragDropContext>
        </div>
    );
};
