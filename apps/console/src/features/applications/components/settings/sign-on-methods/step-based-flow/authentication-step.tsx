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

import { TestableComponentInterface } from "@wso2is/core/models";
import { EmptyPlaceholder, Heading, LabeledCard } from "@wso2is/react-components";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { Form, Icon, Label, Popup, Radio } from "semantic-ui-react";
import {
    FederatedAuthenticatorInterface,
    GenericAuthenticatorInterface,
    IdentityProviderManagementConstants } from "../../../../../identity-providers";
import { AuthenticationStepInterface, AuthenticatorInterface } from "../../../../models";

/**
 * Proptypes for the authentication step component.
 */
interface AuthenticationStepPropsInterface extends TestableComponentInterface {
    /**
     * List of all available authenticators.
     */
    authenticators: GenericAuthenticatorInterface[];
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * ID for the dropable field.
     */
    droppableId: string;
    /**
     * Callback for the step delete.
     */
    onStepDelete: (stepIndex: number) => void;
    /**
     * Callback for step option authenticator change.
     * @param {number} stepIndex - Step index.
     * @param {number} optionIndex - Option Index.
     * @param {FederatedAuthenticatorInterface} authenticator - Selected authenticator.
     */
    onStepOptionAuthenticatorChange: (
        stepIndex: number,
        optionIndex: number,
        authenticator: FederatedAuthenticatorInterface) => void;
    /**
     * Callback for the step option delete.
     */
    onStepOptionDelete: (stepIndex: number, optionIndex: number) => void;
    /**
     * Current step.
     */
    step: AuthenticationStepInterface;
    /**
     * Index of the current step.
     */
    stepIndex: number;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

/**
 * Component to render the authentication step.
 *
 * @param {AuthenticationStepPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const AuthenticationStep: FunctionComponent<AuthenticationStepPropsInterface> = (
    props: AuthenticationStepPropsInterface
): ReactElement => {

    const {
        authenticators,
        className,
        droppableId,
        onStepDelete,
        onStepOptionAuthenticatorChange,
        onStepOptionDelete,
        readOnly,
        step,
        stepIndex,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const classes = classNames("authentication-step-container", className);

    /**
     * Resolves the authenticator step option.
     *
     * @param {AuthenticatorInterface} option - Authenticator step option.
     * @param {number} stepIndex - Index of the step.
     * @param {number} optionIndex - Index of the option.
     *
     * @return {ReactElement}
     */
    const resolveStepOption = (option: AuthenticatorInterface, stepIndex: number,
                               optionIndex: number): ReactElement => {

        if (authenticators && authenticators instanceof Array && authenticators.length > 0) {

            let authenticator: GenericAuthenticatorInterface = null;

            if (option.idp === IdentityProviderManagementConstants.LOCAL_IDP_IDENTIFIER) {
                authenticator = authenticators.find((item) => item.defaultAuthenticator.name === option.authenticator);
            } else {
                authenticator = authenticators.find((item) => item.idp === option.idp);
            }

            if (!authenticator) {
                return null;
            }

            return (
                <Popup
                    wide
                    style={ {
                        minWidth: "200px"
                    } }
                    key={ stepIndex }
                    hoverable
                    disabled={
                        !(authenticator?.authenticators
                            && authenticator.authenticators instanceof Array
                            && authenticator.authenticators.length > 1)
                    }
                    trigger={ (
                        <div className="inline" data-testid={ `${ testId }-option` }>
                            <LabeledCard
                                image={ authenticator.image }
                                label={ authenticator.displayName }
                                labelEllipsis={ true }
                                bottomMargin={ false }
                                size="tiny"
                                onCloseClick={
                                    !readOnly && (
                                        (): void => onStepOptionDelete(stepIndex, optionIndex)
                                    )
                                }
                            />
                        </div>
                    ) }
                    content={
                        (
                            <>
                                <Label attached="top">
                                    { t("console:develop.features.applications.edit.sections.signOnMethod.sections" +
                                        ".authenticationFlow.sections.stepBased.actions.selectAuthenticator") }
                                </Label>
                                <Form className="mt-3 mb-3" data-testid={ `${ testId }-authenticator-selection` }>
                                    {
                                        authenticator?.authenticators?.map((item) => {
                                            return (
                                                <Form.Field key={ item.authenticatorId }>
                                                    <Radio
                                                        label={ item.name }
                                                        name={ item.name }
                                                        value={ item.authenticatorId }
                                                        checked={ item.name === option.authenticator }
                                                        onChange={ () => onStepOptionAuthenticatorChange(
                                                            stepIndex,
                                                            optionIndex,
                                                            item
                                                        ) }
                                                    />
                                                </Form.Field>
                                            );
                                        })
                                    }
                                </Form>
                            </>
                        )
                    }
                >
                </Popup>
            );
        }
    };

    return (
        <Droppable
            droppableId={ droppableId }
            isDropDisabled={ readOnly }
        >
            { (provided: DroppableProvided): React.ReactElement<HTMLElement> => (
                <div
                    ref={ provided.innerRef }
                    { ...provided.droppableProps }
                    className={ classes }
                    data-testid={ testId }
                >
                    <Heading className="step-header" as="h6">{ t("common:step") } { step.id }</Heading>
                    {
                        !readOnly && (
                            <Icon
                                className="delete-button"
                                name="cancel"
                                onClick={ (): void => onStepDelete(stepIndex) }
                                data-testid={ `${ testId }-delete-button` }
                            />
                        )
                    }
                    <div className="authentication-step">
                        {
                            (step.options && step.options instanceof Array && step.options.length > 0)
                                ? step.options.map((option, optionIndex) =>
                                    resolveStepOption(option, stepIndex, optionIndex))
                                : (
                                    <EmptyPlaceholder
                                        subtitle={ [
                                            t("console:develop.features.applications.placeholders" +
                                                ".emptyAuthenticatorStep.subtitles.0"),
                                            t("console:develop.features.applications.placeholders" +
                                                ".emptyAuthenticatorStep.subtitles.1")
                                        ] }
                                        data-testid={ `${ testId }-empty-placeholder` }
                                    />
                                )
                        }
                        { provided.placeholder }
                    </div>
                </div>
            ) }
        </Droppable>
    );
};

/**
 * Default props for the authentication step component.
 */
AuthenticationStep.defaultProps = {
    "data-testid": "authentication-step"
};
