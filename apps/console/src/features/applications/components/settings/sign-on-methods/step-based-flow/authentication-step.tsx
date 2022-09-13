/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com) All Rights Reserved.
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { EmptyPlaceholder, GenericIcon, Heading, LinkButton } from "@wso2is/react-components";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Checkbox, Form, Icon, Label, Popup, Radio } from "semantic-ui-react";
import { getGeneralIcons } from "../../../../../core";
import {
    FederatedAuthenticatorInterface,
    GenericAuthenticatorInterface,
    IdentityProviderManagementConstants
} from "../../../../../identity-providers";
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
     * Callback to trigger when the add authentication button is clicked.
     */
    onAddAuthenticationClick: () => void;
    /**
     * Callback for the step delete.
     */
    onStepDelete: (stepIndex: number) => void;
    /**
     * Callback for step option authenticator change.
     * @param stepIndex - Step index.
     * @param optionIndex - Option Index.
     * @param authenticator - Selected authenticator.
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
     * On Change callback for the attribute step checkbox.
     */
    onAttributeCheckboxChange: (stepIndex: number) => void;
    /**
     * On Change callback for the subject step checkbox.
     */
    onSubjectCheckboxChange: (stepIndex: number) => void;
    /**
     * Should show step delete action
     */
    showStepDeleteAction?: boolean;
    /**
     * Should show step number and other info.
     */
    showStepMeta?: boolean;
    /**
     * Current step.
     */
    step: AuthenticationStepInterface;
    /**
     * Index of the current step.
     */
    stepIndex: number;
    /**
     * Step to pick the Subject.
     */
    subjectStepId: number;
    /**
     * Step to pick the Attributes.
     */
    attributeStepId: number;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

/**
 * Component to render the authentication step.
 *
 * @param props - Props injected to the component.
 *
 * @returns React element.
 */
export const AuthenticationStep: FunctionComponent<AuthenticationStepPropsInterface> = (
    props: AuthenticationStepPropsInterface
): ReactElement => {

    const {
        authenticators,
        className,
        onStepDelete,
        onAddAuthenticationClick,
        onStepOptionAuthenticatorChange,
        onStepOptionDelete,
        readOnly,
        showStepDeleteAction,
        showStepMeta,
        step,
        stepIndex,
        subjectStepId,
        attributeStepId,
        onSubjectCheckboxChange,
        onAttributeCheckboxChange,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const classes = classNames("authentication-step-container timeline-body", className);

    const [ showSubjectIdentifierCheckBox, setShowSubjectIdentifierCheckbox ] = useState<boolean>(false);

    useEffect(() => {
        step.options.map(option => {
            if ([ IdentityProviderManagementConstants.TOTP_AUTHENTICATOR,
                IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR,
                IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR,
                IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR ]
                .includes(option.authenticator)) {
                setShowSubjectIdentifierCheckbox(false);
            } else {
                setShowSubjectIdentifierCheckbox(true);
            }
        });
    }, [ JSON.stringify(step.options) ]);

    /**
     * Resolves the authenticator step option.
     *
     * @param option - Authenticator step option.
     * @param stepIndex - Index of the step.
     * @param optionIndex - Index of the option.
     *
     * @returns React element.
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
                        <div className="authenticator-item-wrapper" data-testid={ `${ testId }-option` }>
                            <Card fluid className="basic-card authenticator-card">
                                <Card.Content >
                                    { !readOnly && (
                                        <Label
                                            basic
                                            floating
                                            circular
                                            className="close-button"
                                            size="mini"
                                            onClick={
                                                !readOnly && (
                                                    (): void => onStepOptionDelete(stepIndex, optionIndex)
                                                )
                                            }
                                            data-testid={ `${ testId }-close-button` }
                                        >
                                            <GenericIcon
                                                transparent
                                                size="nano"
                                                icon={ getGeneralIcons().crossIcon }
                                            />
                                        </Label>
                                    ) }
                                    <GenericIcon
                                        square
                                        inline
                                        className="card-image"
                                        size="micro"
                                        spaced="right"
                                        floated="left"
                                        icon={ authenticator.image }
                                        data-testid={ `${ testId }-image` }
                                        transparent
                                    />
                                    <span data-testid={ `${ testId }-option-name` }>
                                        { authenticator.displayName }
                                    </span>
                                </Card.Content>
                            </Card>
                        </div>
                    ) }
                    content={
                        (
                            <div>
                                <Label attached="top">
                                    { t("console:develop.features.applications.edit.sections.signOnMethod.sections" +
                                        ".authenticationFlow.sections.stepBased.actions.selectAuthenticator") }
                                </Label>
                                <Form data-testid={ `${ testId }-authenticator-selection` }>
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
                            </div>
                        )
                    }
                >
                </Popup>
            );
        }
    };

    return (
        <div className="timeline-item">
            <div className="timeline-badge">
                { step.id }
            </div>
            <div
                className={ classes }
                data-testid={ testId }
            >
                {
                    showStepMeta && (
                        <div className="authentication-step-actions">
                            <Heading
                                className="step-header"
                                bold={ "500" }
                                as="h6"
                            >
                                { t("common:step") }{ " " }{ step.id }
                            </Heading>
                            {
                                !readOnly && showStepDeleteAction && (
                                    <Icon
                                        className="delete-button"
                                        name="cancel"
                                        onClick={ (): void => onStepDelete(stepIndex) }
                                        data-testid={ `${ testId }-delete-button` }
                                    />
                                )
                            }
                        </div>
                    )
                }
                <div
                    className={ `authentication-step with-extension ${
                        !(step.options && step.options instanceof Array && step.options.length > 0)
                            ? "empty-placeholder-container"
                            : ""
                    }` }
                >
                    {
                        (step.options && step.options instanceof Array && step.options.length > 0)
                            ? (
                                <>
                                    {
                                        step.options.map((option, optionIndex) => (
                                            resolveStepOption(option, stepIndex, optionIndex)
                                        ))
                                    }
                                    {
                                        !readOnly && (
                                            <LinkButton
                                                data-tourid="add-authentication-options-button"
                                                className="authenticator-item-wrapper"
                                                onClick={ onAddAuthenticationClick }
                                            >
                                                <Icon name="plus"/>
                                                {
                                                    t("console:develop.features.applications." +
                                                        "edit.sections.signOnMethod." +
                                                        "sections.authenticationFlow.sections.stepBased.actions." +
                                                        "addAuthentication")
                                                }
                                            </LinkButton>
                                        ) }
                                </>
                            )
                            : (
                                !readOnly && (
                                    <>
                                        <LinkButton
                                            fluid
                                            data-tourid="add-authentication-options-button"
                                            onClick={ onAddAuthenticationClick }
                                        >
                                            <Icon name="plus"/>
                                            {
                                                t("console:develop.features.applications.edit.sections.signOnMethod." +
                                                    "sections.authenticationFlow.sections.stepBased.actions." +
                                                    "addAuthentication")
                                            }
                                        </LinkButton>
                                        <EmptyPlaceholder
                                            subtitle={ [
                                                t("console:develop.features.applications.placeholders." +
                                                    "emptyAuthenticatorStep.subtitles.0")
                                            ] }
                                            data-testid={ `${ testId }-empty-placeholder` }
                                        />
                                    </>
                                )
                            )
                    }
                </div>
                {
                    (!readOnly
                        && showStepMeta
                        && (step.options && step.options instanceof Array && step.options.length > 0))
                        && showSubjectIdentifierCheckBox && (
                        <div className="checkboxes-extension">
                            <Checkbox
                                label={ t(
                                    "console:develop.features.applications.edit.sections" +
                                    ".signOnMethod.sections.authenticationFlow.sections" +
                                    ".stepBased.forms.fields.subjectIdentifierFrom.label"
                                ) }
                                checked={ subjectStepId === (stepIndex + 1) }
                                onChange={ (): void => onSubjectCheckboxChange(stepIndex + 1) }
                            />
                            <Checkbox
                                label={ t(
                                    "console:develop.features.applications.edit.sections" +
                                    ".signOnMethod.sections.authenticationFlow.sections" +
                                    ".stepBased.forms.fields.attributesFrom.label"
                                ) }
                                checked={ attributeStepId === (stepIndex + 1) }
                                onChange={ (): void => onAttributeCheckboxChange(stepIndex + 1) }
                            />
                        </div>
                    )
                }
            </div>
        </div>
    );
};

/**
 * Default props for the authentication step component.
 */
AuthenticationStep.defaultProps = {
    "data-testid": "authentication-step"
};
