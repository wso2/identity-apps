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
import { Heading, Hint, LabeledCard, LinkButton, PrimaryButton } from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, useEffect, useState } from "react";
import {
    DragDropContext,
    Draggable,
    DraggableProvided,
    DraggableStateSnapshot,
    Droppable,
    DroppableProvided
} from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { Checkbox, CheckboxProps, Divider, Grid, Icon } from "semantic-ui-react";
import { getIdentityProviderDetail, getIdentityProviderList, updateAuthenticationSequence } from "../../api";
import {
    AuthenticationSequenceType,
    IdentityProviderListItemInterface,
    IdentityProviderListResponseInterface,
    IdentityProviderResponseInterface,
    IdentityProviderTypes
} from "../../models";
import { AuthenticatorListInterface, selectedFederatedAuthenticators, selectedLocalAuthenticators } from "./meta";

/**
 *  Captures IDPs name, logo and ID
 */
interface IDPNameInterface {
    authenticatorId: string;
    idp: string;
    image?: string;
}

interface SignOnMethodPropsInterface {
    appId?: string;
    authenticationSequence: any;
    isLoading?: boolean;
}

const AUTHENTICATION_STEP_DROPPABLE_ID: string = "authentication-step-";
const LOCAL_AUTHENTICATORS_DROPPABLE_ID: string = "local-authenticators";
const FEDERATED_AUTHENTICATORS_DROPPABLE_ID: string = "federated-authenticators";

const DEFAULT_SELECTED_AUTHENTICATOR = selectedLocalAuthenticators[0];

/**
 * Edit the authentication sequence of the application.
 *
 * @param props SignOnMethodPropsInterface
 *
 */
export const SignOnMethod: FunctionComponent<SignOnMethodPropsInterface> = (
    props: SignOnMethodPropsInterface
): JSX.Element => {

    const {
        appId,
        authenticationSequence
    } = props;

    const dispatch = useDispatch();

    const [ federatedAuthenticators, setFederatedAuthenticators ] = useState<AuthenticatorListInterface[]>([]);
    const [ localAuthenticators, setLocalAuthenticators ] = useState<AuthenticatorListInterface[]>([]);
    const [ authenticationSteps, setAuthenticationSteps ] = useState([]);
    const [ subjectStepId, setSubjectStepId ] = useState(undefined);
    const [ attributeStepId, setAttributeStepId ] = useState(undefined);

    useEffect(() => {
        loadFederatedAuthenticators();
        loadLocalAuthenticators();
    }, []);

    useEffect(() => {
        if (!authenticationSequence) {
            return;
        }

        setAuthenticationSteps(authenticationSequence?.steps);
        setSubjectStepId(authenticationSequence?.subjectStepId);
        setAttributeStepId(authenticationSequence?.attributeStepId);
    }, [ authenticationSequence ]);

    /**
     *  Updates the federatedIDPNameList with available IDPs.
     */
    const updateFederateIDPNameList = (): Promise<any> => {
        return getIdentityProviderList()
            .then((response: IdentityProviderListResponseInterface) => {
                return Promise.all(
                    response?.identityProviders
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
                console.log(error);
                dispatch(addAlert({
                    description: "An error occurred while getting the IPD list",
                    level: AlertLevels.ERROR,
                    message: "Get Error"
                }));
            });
    };

    /**
     * Add Federated IDP name and ID in to the state.
     * @param id Identity Provider ID
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
                console.log(error);
                dispatch(addAlert({
                    description: "An error occurred while updating the IDP name.",
                    level: AlertLevels.ERROR,
                    message: "Get Error"
                }));
            });
    };

    /**
     *  Merge the IDP name list and meta details to populate the final federated List.
     */
    const loadFederatedAuthenticators = () => {
        updateFederateIDPNameList()
            .then((response) => {
                const selectedFederatedList = [ ...selectedFederatedAuthenticators ];
                const newIDPNameList: IDPNameInterface[] = [ ...response ];

                console.log(selectedFederatedList);
                console.log(newIDPNameList);
                const finalList = _(selectedFederatedList)
                    .concat(newIDPNameList)
                    .groupBy("authenticatorId")
                    .map(_.spread(_.merge))
                    .value();

                // Updates the federated authenticator List.
                setFederatedAuthenticators(finalList.filter((item) => item.authenticatorId !== undefined));
            });
    };

    /**
     * Load local authenticator list.
     *
     */
    const loadLocalAuthenticators = () => {
        setLocalAuthenticators([ ...selectedLocalAuthenticators ]);
    };

    const handleAuthenticatorDrag = (result) => {
        if (!result.destination) {
            return;
        }

        let idpType: IdentityProviderTypes = null;

        if (result.draggableId && result.destination?.droppableId?.includes(AUTHENTICATION_STEP_DROPPABLE_ID)) {
            if (result.source?.droppableId) {
                if (result.source.droppableId.includes(LOCAL_AUTHENTICATORS_DROPPABLE_ID)) {
                    idpType = IdentityProviderTypes.LOCAL;
                } else if (result.source.droppableId.includes(FEDERATED_AUTHENTICATORS_DROPPABLE_ID)) {
                    idpType = IdentityProviderTypes.FEDERATED;
                }
            }
        }

        if (!idpType) {
            return;
        }

        // result.destination.index was giving unexpected values. Therefore as a workaround, index will be
        // extracted from the draggableId. Since the droppable id is in the form of `authentication-step-0`
        // 0 can be extracted by splitting the string.
        const destinationIndex = result.destination.droppableId.split(AUTHENTICATION_STEP_DROPPABLE_ID).pop();

        updateAuthenticationStep(destinationIndex, result.draggableId, idpType);

        console.log(result);
    };

    const updateAuthenticationStep = (stepNo: number, authenticatorId: string, idpType: IdentityProviderTypes) => {
        let authenticators: AuthenticatorListInterface[] = [];

        if (idpType === IdentityProviderTypes.LOCAL) {
            authenticators = [ ...localAuthenticators ];
        } else if (idpType === IdentityProviderTypes.FEDERATED) {
            authenticators = [ ...federatedAuthenticators ];
        }

        const authenticator = authenticators.find((item) => item.authenticator === authenticatorId);

        if (!authenticator) {
            return;
        }

        const steps = [ ...authenticationSteps ];
        steps[ stepNo ].options.push({ authenticator: authenticator.authenticator, idp: authenticator.idp });

        setAuthenticationSteps(steps);
    };

    const resolveStepOption = (option): JSX.Element => {

        const authenticators: AuthenticatorListInterface[] = option.idp === IdentityProviderTypes.LOCAL
            ? [ ...localAuthenticators ]
            : [ ...federatedAuthenticators ];

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
                />
            );
        }
    };

    const handleAuthenticationStepAdd = () => {
        const steps = [ ...authenticationSteps ];

        steps.push({
            id: steps.length + 1,
            options: [
                {
                    authenticator: DEFAULT_SELECTED_AUTHENTICATOR.authenticator,
                    idp: DEFAULT_SELECTED_AUTHENTICATOR.idp
                }
            ]
        });

        setAuthenticationSteps(steps);
    };

    const onSubjectCheckboxChange = (id: number) => {
        setSubjectStepId(id);
    };

    const onAttributeCheckboxChange = (id) => {
        setAttributeStepId(id);
    };

    const handleAuthenticationFlowSave = () => {
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
            .then((response) => {
                dispatch(addAlert({
                    description: "Successfully updated the application",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }));
            })
            .catch((error) => {
                dispatch(addAlert({
                    description: "An error occurred while updating the application",
                    level: AlertLevels.ERROR,
                    message: "Update Error"
                }));
            });
    };

    return (
        <div className="sign-on-methods-tab-content">
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
                                            <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 8 }>
                                                <Heading as="h6">Local authenticators</Heading>
                                                <Droppable
                                                    droppableId={ LOCAL_AUTHENTICATORS_DROPPABLE_ID }
                                                    direction="horizontal"
                                                    isDropDisabled={ true }
                                                >
                                                    { (provided: DroppableProvided) => (
                                                        <div
                                                            ref={ provided.innerRef }
                                                            { ...provided.droppableProps }
                                                            className="authenticators local"
                                                        >
                                                            {
                                                                localAuthenticators
                                                                && localAuthenticators instanceof Array
                                                                && localAuthenticators.length > 0
                                                                    ? localAuthenticators.map((authenticator, index) => (
                                                                        <Draggable
                                                                            key={ authenticator.authenticator }
                                                                            draggableId={ authenticator.authenticator }
                                                                            index={ index }
                                                                        >
                                                                            {
                                                                                (providedDraggable: DraggableProvided,
                                                                                 snapshotDraggable: DraggableStateSnapshot) => (
                                                                                    <div
                                                                                        ref={ providedDraggable.innerRef }
                                                                                        { ...providedDraggable.draggableProps }
                                                                                        { ...providedDraggable.dragHandleProps }
                                                                                    >
                                                                                        <LabeledCard
                                                                                            image={ authenticator.image }
                                                                                            label={ authenticator.displayName }
                                                                                        />
                                                                                    </div>
                                                                                ) }
                                                                        </Draggable>
                                                                    ))
                                                                    : null
                                                            }
                                                            { provided.placeholder }
                                                        </div>
                                                    ) }
                                                </Droppable>
                                            </Grid.Column>
                                            <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 8 }>
                                                <Heading as="h6">Federated authenticators</Heading>
                                                <Droppable
                                                    droppableId={ FEDERATED_AUTHENTICATORS_DROPPABLE_ID }
                                                    direction="horizontal"
                                                    isDropDisabled={ true }
                                                >
                                                    { (provided: DroppableProvided) => (
                                                        <div
                                                            ref={ provided.innerRef }
                                                            { ...provided.droppableProps }
                                                            className="authenticators federated"
                                                        >
                                                            {
                                                                federatedAuthenticators
                                                                && federatedAuthenticators instanceof Array
                                                                && federatedAuthenticators.length > 0
                                                                    ? federatedAuthenticators.map((authenticator, index) => (
                                                                        <Draggable
                                                                            key={ authenticator.authenticator }
                                                                            draggableId={ authenticator.authenticator }
                                                                            index={ index }
                                                                        >
                                                                            { (providedDraggable: DraggableProvided) => (
                                                                                <div
                                                                                    ref={ providedDraggable.innerRef }
                                                                                    { ...providedDraggable.draggableProps }
                                                                                    { ...providedDraggable.dragHandleProps }
                                                                                >
                                                                                    <LabeledCard
                                                                                        image={ authenticator.image }
                                                                                        label={ authenticator.displayName }
                                                                                    />
                                                                                </div>
                                                                            ) }
                                                                        </Draggable>
                                                                    ))
                                                                    : null
                                                            }
                                                            { provided.placeholder }
                                                        </div>
                                                    ) }
                                                </Droppable>
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
                                            ? authenticationSteps.map((step, index) => (
                                                <Droppable
                                                    key={ index }
                                                    droppableId={ AUTHENTICATION_STEP_DROPPABLE_ID + index }
                                                >
                                                    { (provided: DroppableProvided) => (
                                                        <div
                                                            ref={ provided.innerRef }
                                                            { ...provided.droppableProps }
                                                            className="authentication-step-container"
                                                        >
                                                            <Heading as="h6">Step { step.id }</Heading>
                                                            <div className="authentication-step">
                                                                {
                                                                    step.options
                                                                    && step.options instanceof Array
                                                                    && step.options.length > 0
                                                                        ? step.options
                                                                            .map((option) => resolveStepOption(option))
                                                                        : null
                                                                }
                                                                { provided.placeholder }
                                                            </div>
                                                            <div className="checkboxes">
                                                                <Checkbox
                                                                    label="Use subject identifier from this step"
                                                                    checked={ subjectStepId === (index + 1) }
                                                                    onChange={ () => onSubjectCheckboxChange(index + 1) }
                                                                />
                                                                <Checkbox
                                                                    label="Use attributes from this step"
                                                                    checked={ attributeStepId === (index + 1) }
                                                                    onChange={ () => onAttributeCheckboxChange(index + 1) }
                                                                />
                                                            </div>
                                                        </div>
                                                    ) }
                                                </Droppable>
                                            ))
                                            : null
                                    }
                                    <Divider hidden />
                                    <LinkButton className="add-step-button" onClick={ handleAuthenticationStepAdd }>
                                        <Icon name="plus" />Add authentication step
                                    </LinkButton>
                                    <PrimaryButton onClick={ handleAuthenticationFlowSave }>Save changes</PrimaryButton>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </DragDropContext>
                </Grid>
            </div>
        </div>
    );
};
