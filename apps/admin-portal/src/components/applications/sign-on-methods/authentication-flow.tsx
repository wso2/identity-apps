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
import { Heading, Hint, LinkButton, PrimaryButton, GenericIcon } from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { Divider, Grid, Icon, Card, Popup } from "semantic-ui-react";
import { getIdentityProviderDetail, getIdentityProviderList, updateAuthenticationSequence } from "../../../api";
import {
    AuthenticationSequenceInterface,
    AuthenticationSequenceType,
    AuthenticationStepInterface,
    AuthenticatorInterface,
    IdentityProviderListItemInterface,
    IdentityProviderListResponseInterface,
    IdentityProviderResponseInterface,
    IDPNameInterface
} from "../../../models";
import {
    AuthenticatorListItemInterface,
    AuthenticatorTypes,
    selectedFederatedAuthenticators,
    selectedLocalAuthenticators
} from "../meta";
import { Authenticators } from "./authenticators";
import { AuthenticationStep } from "./authentication-step";
import Draggable from "react-draggable";
import { OperationIcons } from "../../../configs";

/**
 * Proptypes for the applications settings component.
 */
interface AuthenticationFlowPropsInterface {
    /**
     * ID of the application.
     */
    appId: string;
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
     */
    onUpdate: (id: string) => void;
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
 * Droppable id for the second factor authenticators section.
 * @constant
 * @type {string}
 * @default
 */
const SECOND_FACTOR_AUTHENTICATORS_DROPPABLE_ID = "second-factor-authenticators";

/**
 * Droppable id for the social authenticators section.
 * @constant
 * @type {string}
 * @default
 */
const SOCIAL_AUTHENTICATORS_DROPPABLE_ID = "social-authenticators";

/**
 * Configure the authentication flow of an application.
 *
 * @param {AuthenticationFlowPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const AuthenticationFlow: FunctionComponent<AuthenticationFlowPropsInterface> = (
    props: AuthenticationFlowPropsInterface
): ReactElement => {

    const {
        appId,
        authenticationSequence,
        onUpdate
    } = props;

    const dispatch = useDispatch();

    const authenticatorsSidePanelRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);

    const [ federatedAuthenticators, setFederatedAuthenticators ] = useState<AuthenticatorListItemInterface[]>([]);
    const [ localAuthenticators, setLocalAuthenticators ] = useState<AuthenticatorListItemInterface[]>([]);
    const [ authenticationSteps, setAuthenticationSteps ] = useState<AuthenticationStepInterface[]>([]);
    const [ subjectStepId, setSubjectStepId ] = useState<number>(undefined);
    const [ attributeStepId, setAttributeStepId ] = useState<number>(undefined);
    const [ showAuthenticatorsSidePanel, setAuthenticatorsSidePanelVisibility ] = useState<boolean>(true);

    /**
     * Add Federated IDP name and ID in to the state.
     *
     * @param {string} id - Identity Provider ID
     * @return {Promise<void | IDPNameInterface>}
     */
    const updateFederatedIDPNameListItem = (id: string): Promise<void | IDPNameInterface> => {
        return getIdentityProviderDetail(id)
            .then((response: IdentityProviderResponseInterface) => {
                const iDPNamePair: IDPNameInterface = {
                    authenticatorId: response?.federatedAuthenticators?.defaultAuthenticatorId,
                    idp: response.name,
                    image: response.image
                };
                if (typeof iDPNamePair.image === "undefined") {
                    delete iDPNamePair.image;
                }
                return Promise.resolve(iDPNamePair);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Update Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while updating the IPD name",
                    level: AlertLevels.ERROR,
                    message: "Update Error"
                }));
            });
    };

    /**
     * Updates the federatedIDPNameList with available IDPs.
     *
     * @return {Promise<any | IDPNameInterface[]>}
     */
    const updateFederateIDPNameList = (): Promise<any | IDPNameInterface[]> => {
        return getIdentityProviderList()
            .then((response: IdentityProviderListResponseInterface) => {
                // If no IDP's are configured in IS, the api drops the
                // `identityProviders` attribute. If it is not available,
                // return from the function to avoid iteration
                if (!response?.identityProviders) {
                    return;
                }

                return Promise.all(
                    response.identityProviders
                    && response.identityProviders instanceof Array
                    && response.identityProviders.length > 0
                    && response.identityProviders.map((item: IdentityProviderListItemInterface) => {
                        if (item.isEnabled) {
                            return updateFederatedIDPNameListItem(item.id);
                        }
                    })
                );
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Retrieval Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while retrieving the IPD list",
                    level: AlertLevels.ERROR,
                    message: "Retrieval Error"
                }));
            });
    };

    /**
     *  Merge the IDP name list and meta details to populate the final federated List.
     */
    const loadFederatedAuthenticators = (): void => {
        updateFederateIDPNameList()
            .then((response) => {
                // If `updateFederateIDPNameList()` function returns a falsy value
                // return from the function.
                if (!response) {
                    return;
                }

                const selectedFederatedList = [ ...selectedFederatedAuthenticators ];
                const newIDPNameList: IDPNameInterface[] = [ ...response ];

                const finalList = _(selectedFederatedList)
                    .concat(newIDPNameList)
                    .groupBy("authenticatorId")
                    .map(_.spread(_.merge))
                    .value();

                // Updates the federated authenticator List.
                setFederatedAuthenticators(finalList.filter((item) => item.authenticatorId !== undefined));
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Retrieval Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while retrieving the federated authenticators.",
                    level: AlertLevels.ERROR,
                    message: "Retrieval Error"
                }));
            });
    };

    /**
     * Load local authenticator list.
     */
    const loadLocalAuthenticators = (): void => {
        setLocalAuthenticators([ ...selectedLocalAuthenticators ]);
    };

    /**
     * Validates if the addition to the step is valid.
     *
     * @param {AuthenticatorListItemInterface} authenticator - Authenticator to be added.
     * @param {AuthenticatorInterface[]} options - Current step options
     * @return {boolean} True or false.
     */
    const validateStepAddition = (authenticator: AuthenticatorListItemInterface,
                                  options: AuthenticatorInterface[]): boolean => {

        if (options.find((option) => option.authenticator === authenticator.authenticator)) {
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
        const authenticators: AuthenticatorListItemInterface[] = [ ...localAuthenticators, ...federatedAuthenticators ];

        const authenticator: AuthenticatorListItemInterface = authenticators
            .find((item) => item.authenticator === authenticatorId);

        if (!authenticator) {
            return;
        }

        const steps: AuthenticationStepInterface[] = [ ...authenticationSteps ];

        const isValid: boolean = validateStepAddition(authenticator, steps[ stepNo ].options);

        if (!isValid) {
            return;
        }

        steps[ stepNo ].options.push({ authenticator: authenticator.authenticator, idp: authenticator.idp });

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
     * Handles the subject identifier checkbox onchange event.
     *
     * @param {number} id - Step index.
     */
    const handleSubjectCheckboxChange = (id: number): void => {
        setSubjectStepId(id);
    };

    /**
     * Handles the attribute identifier checkbox onchange event.
     *
     * @param {number} id - Step index.
     */
    const handleAttributeCheckboxChange = (id: number): void => {
        setAttributeStepId(id);
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
     * Handles the authentication flow update action.
     */
    const handleAuthenticationFlowUpdate = (): void => {

        const isValid: boolean = validateSteps();

        if (!isValid) {
            return;
        }

        const requestBody = {
            authenticationSequence: {
                attributeStepId,
                requestPathAuthenticators: [],
                steps: authenticationSteps,
                subjectStepId,
                type: AuthenticationSequenceType.USER_DEFINED
            }
        };

        updateAuthenticationSequence(appId, requestBody)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully updated the application",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }));

                onUpdate(appId);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Update Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while updating authentication steps of the application",
                    level: AlertLevels.ERROR,
                    message: "Update Error"
                }));
            });
    };

    /**
     * Filters the list of federated & local authenticators and returns a list of
     * authenticators of the selected type.
     *
     * @param {AuthenticatorTypes} type - Authenticator type.
     * @return {AuthenticatorListItemInterface[]} A filtered list of authenticators.
     */
    const filterAuthenticators = (type: AuthenticatorTypes): AuthenticatorListItemInterface[] => {
        const authenticators: AuthenticatorListItemInterface[] = [ ...localAuthenticators, ...federatedAuthenticators ];

        return authenticators.filter((authenticator) => authenticator.type === type && authenticator.idp);
    };

    /**
     * Toggles the authenticator side panel visibility.
     */
    const toggleAuthenticatorsSidePanelVisibility = (): void => {
        setAuthenticatorsSidePanelVisibility(!showAuthenticatorsSidePanel);
    };

    /**
     * Loads federated authenticators and local authenticators
     * on component load.
     */
    useEffect(() => {
        loadFederatedAuthenticators();
        loadLocalAuthenticators();
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

    return (
        <div className={ `authentication-flow-section ${ showAuthenticatorsSidePanel ? "flex" : "" }` }>
            <DragDropContext onDragEnd={ handleAuthenticatorDrag }>
                <div className="main-content" ref={ mainContentRef }>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column computer={ showAuthenticatorsSidePanel ? 16 : 14 }>
                                <Heading as="h4">Authentication flow</Heading>
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
                        <Grid.Row>
                            <Grid.Column computer={ 16 }>
                                <div className="authentication-steps-section">
                                    {
                                        authenticationSteps
                                        && authenticationSteps instanceof Array
                                        && authenticationSteps.length > 0
                                            ? authenticationSteps.map((step, stepIndex) => (
                                                <AuthenticationStep
                                                    key={ stepIndex }
                                                    authenticators={ [ ...localAuthenticators, ...federatedAuthenticators ] }
                                                    attributeStepId={ attributeStepId }
                                                    droppableId={ AUTHENTICATION_STEP_DROPPABLE_ID + stepIndex }
                                                    onAttributeCheckboxChange={ handleAttributeCheckboxChange }
                                                    onStepDelete={ handleStepDelete }
                                                    onStepOptionDelete={ handleStepOptionDelete }
                                                    onSubjectCheckboxChange={ handleSubjectCheckboxChange }
                                                    step={ step }
                                                    stepIndex={ stepIndex }
                                                    subjectStepId={ subjectStepId }
                                                />
                                            ))
                                            : null
                                    }
                                    <Divider hidden/>
                                    <LinkButton className="add-step-button" onClick={ handleAuthenticationStepAdd }>
                                        <Icon name="plus"/>Add authentication step
                                    </LinkButton>
                                    <Divider hidden/>
                                    <PrimaryButton onClick={ handleAuthenticationFlowUpdate }>Update</PrimaryButton>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                {
                    showAuthenticatorsSidePanel && (
                        <div className="authenticators-panel" ref={ authenticatorsSidePanelRef }>
                            <Draggable handle=".drag-handle">
                                <Card>
                                    <Card.Content>
                                        <Heading as="h6" floated="left" compact>Authenticators</Heading>
                                        <Popup
                                            trigger={ (
                                                <div className="inline floated right mt-1">
                                                    <GenericIcon
                                                        className="drag-handle"
                                                        icon={ OperationIcons.drag }
                                                        size="nano"
                                                        transparent
                                                    />
                                                </div>
                                            ) }
                                            position="top center"
                                            content="drag"
                                            inverted
                                        />
                                        <Popup
                                            trigger={ (
                                                <div
                                                    className="inline floated right mr-2 mt-1"
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
                                            content="minimize"
                                            inverted
                                        />
                                    </Card.Content>
                                    <Card.Content>
                                        <div className="authenticators-section">
                                            <Authenticators
                                                authenticators={
                                                    filterAuthenticators(AuthenticatorTypes.FIRST_FACTOR)
                                                }
                                                droppableId={ LOCAL_AUTHENTICATORS_DROPPABLE_ID }
                                                heading="Local"
                                            />
                                            <Divider/>
                                            <Authenticators
                                                authenticators={
                                                    filterAuthenticators(AuthenticatorTypes.SECOND_FACTOR)
                                                }
                                                droppableId={ SECOND_FACTOR_AUTHENTICATORS_DROPPABLE_ID }
                                                heading="Second factor"
                                            />
                                            <Divider/>
                                            <Authenticators
                                                authenticators={
                                                    filterAuthenticators(AuthenticatorTypes.SOCIAL)
                                                }
                                                droppableId={ SOCIAL_AUTHENTICATORS_DROPPABLE_ID }
                                                heading="Social logins"
                                            />
                                        </div>
                                    </Card.Content>
                                </Card>
                            </Draggable>
                        </div>
                    )
                }
            </DragDropContext>
        </div>
    );
};
