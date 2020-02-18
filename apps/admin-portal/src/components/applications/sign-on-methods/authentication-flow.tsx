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
import { EmptyPlaceholder, Heading, Hint, LabeledCard, LinkButton, PrimaryButton } from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, useEffect, useState } from "react";
import { DragDropContext, Droppable, DroppableProvided, DropResult } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { Checkbox, Divider, Grid, Icon } from "semantic-ui-react";
import { getIdentityProviderDetail, getIdentityProviderList, updateAuthenticationSequence } from "../../../api";
import {
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

/**
 * Proptypes for the applications settings component.
 */
interface AuthenticationFlowPropsInterface {
    appId: string;
    authenticationSequence: any;
    isLoading?: boolean;
}

/**
 * Droppable id for the authentication step.
 * @constant
 * @type {string}
 * @default
 */
const AUTHENTICATION_STEP_DROPPABLE_ID: string = "authentication-step-";

/**
 * Droppable id for the local authenticators section.
 * @constant
 * @type {string}
 * @default
 */
const LOCAL_AUTHENTICATORS_DROPPABLE_ID: string = "local-authenticators";

/**
 * Droppable id for the second factor authenticators section.
 * @constant
 * @type {string}
 * @default
 */
const SECOND_FACTOR_AUTHENTICATORS_DROPPABLE_ID: string = "second-factor-authenticators";

/**
 * Droppable id for the social authenticators section.
 * @constant
 * @type {string}
 * @default
 */
const SOCIAL_AUTHENTICATORS_DROPPABLE_ID: string = "social-authenticators";

/**
 * Configure the authentication flow of an application.
 *
 * @param {AuthenticationFlowPropsInterface} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const AuthenticationFlow: FunctionComponent<AuthenticationFlowPropsInterface> = (
    props: AuthenticationFlowPropsInterface
): JSX.Element => {

    const {
        appId,
        authenticationSequence
    } = props;

    const dispatch = useDispatch();

    const [ federatedAuthenticators, setFederatedAuthenticators ] = useState<AuthenticatorListItemInterface[]>([]);
    const [ localAuthenticators, setLocalAuthenticators ] = useState<AuthenticatorListItemInterface[]>([]);
    const [ authenticationSteps, setAuthenticationSteps ] = useState<AuthenticationStepInterface[]>([]);
    const [ subjectStepId, setSubjectStepId ] = useState<number>(undefined);
    const [ attributeStepId, setAttributeStepId ] = useState<number>(undefined);

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
     * Updates the federatedIDPNameList with available IDPs.
     *
     * @return {Promise<any>}
     */
    const updateFederateIDPNameList = (): Promise<any> => {
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
     * Add Federated IDP name and ID in to the state.
     *
     * @param {string} id - Identity Provider ID
     * @return {Promise<any>}
     */
    const updateFederatedIDPNameListItem = (id: string): Promise<any> => {
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

        const isValid: boolean = validateStepAddition(authenticator, steps[stepNo].options);

        if (!isValid) {
            return;
        }

        steps[ stepNo ].options.push({ authenticator: authenticator.authenticator, idp: authenticator.idp });

        setAuthenticationSteps(steps);
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
     * Resolves the authenticator step option.
     *
     * @param {AuthenticatorInterface} option - Authenticator step option.
     * @param {number} stepIndex - Index of the step.
     * @param {number} optionIndex - Index of the option.
     * @return {JSX.Element}
     */
    const resolveStepOption = (option: AuthenticatorInterface, stepIndex: number, optionIndex: number): JSX.Element => {
        const authenticators: AuthenticatorListItemInterface[] = [ ...localAuthenticators, ...federatedAuthenticators ];

        if (authenticators && authenticators instanceof Array && authenticators.length > 0) {

            const authenticator = authenticators.find((item) => item.authenticator === option.authenticator);

            if (!authenticator) {
                return null;
            }

            return (
                <LabeledCard
                    image={ authenticator.image }
                    label={ authenticator.displayName }
                    bottomMargin={ false }
                    onCloseClick={ () => handleStepOptionDelete(stepIndex, optionIndex) }
                />
            );
        }
    };

    /**
     * Handles step option delete action.
     *
     * @param {number} stepIndex - Index of the step.
     * @param {number} optionIndex - Index of the option.
     */
    const handleStepOptionDelete = (stepIndex: number, optionIndex: number): void => {
        const steps = [ ...authenticationSteps ];
        steps[stepIndex].options.splice(optionIndex, 1);
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
    const onSubjectCheckboxChange = (id: number): void => {
        setSubjectStepId(id);
    };

    /**
     * Handles the attribute identifier checkbox onchange event.
     *
     * @param {number} id - Step index.
     */
    const onAttributeCheckboxChange = (id: number): void => {
        setAttributeStepId(id);
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

    return (
        <div className="authentication-flow-section">
            <Grid>
                <Grid.Row>
                    <Grid.Column computer={ 16 }>
                        <Heading as="h4">Authentication flow</Heading>
                        <Hint>
                            Create authentication steps by dragging the local/federated authenticators on to the
                            relevant steps.
                        </Hint>
                    </Grid.Column>
                </Grid.Row>

                <DragDropContext onDragEnd={ handleAuthenticatorDrag }>
                    <Grid.Row>
                        <Grid.Column computer={ 16 }>
                            <div className="authenticators-section">
                                <Grid>
                                    <Grid.Row columns={ 2 }>
                                        <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 5 }>
                                            <Authenticators
                                                authenticators={
                                                    filterAuthenticators(AuthenticatorTypes.FIRST_FACTOR)
                                                }
                                                droppableId={ LOCAL_AUTHENTICATORS_DROPPABLE_ID }
                                                heading="Local"
                                            />
                                        </Grid.Column>
                                        <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 5 }>
                                            <Authenticators
                                                authenticators={
                                                    filterAuthenticators(AuthenticatorTypes.SECOND_FACTOR)
                                                }
                                                droppableId={ SECOND_FACTOR_AUTHENTICATORS_DROPPABLE_ID }
                                                heading="Second factor"
                                            />
                                        </Grid.Column>
                                        <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 5 }>
                                            <Authenticators
                                                authenticators={
                                                    filterAuthenticators(AuthenticatorTypes.SOCIAL)
                                                }
                                                droppableId={ SOCIAL_AUTHENTICATORS_DROPPABLE_ID }
                                                heading="Social logins"
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </div>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column computer={ 16 }>
                            <div className="authentication-steps-section">
                                {
                                    authenticationSteps
                                    && authenticationSteps instanceof Array
                                    && authenticationSteps.length > 0
                                        ? authenticationSteps.map((step, stepIndex) => (
                                            <Droppable
                                                key={ stepIndex }
                                                droppableId={ AUTHENTICATION_STEP_DROPPABLE_ID + stepIndex }
                                            >
                                                { (provided: DroppableProvided) => (
                                                    <div
                                                        ref={ provided.innerRef }
                                                        { ...provided.droppableProps }
                                                        className="authentication-step-container"
                                                    >
                                                        <Heading className="step-header" as="h6">
                                                            Step { step.id }
                                                        </Heading>
                                                        <Icon
                                                            className="delete-button"
                                                            name="cancel"
                                                            onClick={ () => handleStepDelete(stepIndex) }
                                                        />
                                                        <div className="authentication-step">
                                                            {
                                                                step.options
                                                                && step.options instanceof Array
                                                                && step.options.length > 0
                                                                    ? step.options.map((option, optionIndex) =>
                                                                        resolveStepOption(
                                                                            option,
                                                                            stepIndex,
                                                                            optionIndex
                                                                        ))
                                                                    : (
                                                                        <EmptyPlaceholder
                                                                            subtitle={ [ "Drag and drop any of the " +
                                                                            "above authenticators", "to build an " +
                                                                            "authentication sequence."] }
                                                                        />
                                                                    )
                                                            }
                                                            { provided.placeholder }
                                                        </div>
                                                        <div className="checkboxes">
                                                            <Checkbox
                                                                label="Use subject identifier from this step"
                                                                checked={ subjectStepId === (stepIndex + 1) }
                                                                onChange={
                                                                    () => onSubjectCheckboxChange(stepIndex + 1)
                                                                }
                                                            />
                                                            <Checkbox
                                                                label="Use attributes from this step"
                                                                checked={ attributeStepId === (stepIndex + 1) }
                                                                onChange={
                                                                    () => onAttributeCheckboxChange(stepIndex + 1)
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                ) }
                                            </Droppable>
                                        ))
                                        : null
                                }
                                <Divider hidden/>
                                <LinkButton className="add-step-button" onClick={ handleAuthenticationStepAdd }>
                                    <Icon name="plus"/>Add authentication step
                                </LinkButton>
                                <Divider hidden />
                                <PrimaryButton onClick={ handleAuthenticationFlowUpdate }>Update</PrimaryButton>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </DragDropContext>
            </Grid>
        </div>
    );
};
