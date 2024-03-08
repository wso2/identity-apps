/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import useUIConfig from "@wso2is/common/src/hooks/use-ui-configs";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { EmptyPlaceholder, GenericIcon, Heading, LinkButton, Popup, Tooltip } from "@wso2is/react-components";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Checkbox, Form, Icon, Label, Radio } from "semantic-ui-react";
import useAuthenticationFlow from "../../../../../authentication-flow-builder/hooks/use-authentication-flow";
import { AuthenticatorManagementConstants } from "../../../../../connections";
import { AuthenticatorCategories } from "../../../../../connections/models/authenticators";
import { ConnectionsManagementUtils } from "../../../../../connections/utils/connection-utils";
import { getGeneralIcons } from "../../../../../core";
import {
    IdentityProviderManagementConstants
} from "../../../../../identity-providers/constants/identity-provider-management-constants";
import {
    FederatedAuthenticatorInterface,
    GenericAuthenticatorInterface
} from "../../../../../identity-providers/models/identity-provider";
import { AuthenticationStepInterface, AuthenticatorInterface } from "../../../../models";

/**
 * Proptypes for the authentication step component.
 */
interface AuthenticationStepPropsInterface extends IdentifiableComponentInterface {
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
    /**
     * Update the authentication step.
     */
    updateAuthenticationStep:
        (stepIndex: number, authenticatorId: string) => void;
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
        updateAuthenticationStep,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const { UIConfig } = useUIConfig();

    const connectionResourcesUrl: string = UIConfig?.connectionResourcesUrl;

    const classes: string = classNames("authentication-step-container timeline-body", className);

    const [ backupCodeIndex, setBackupCodeIndex ] = useState<number>(null);

    const { isConditionalAuthenticationEnabled } = useAuthenticationFlow();

    /**
     * Filter the authenticators that are not supported for the subject identifier.
     */
    const subjectIdentifierUnsupportedAuthenticators: AuthenticatorInterface[] = useMemo(() => {
        return step.options.filter((option: AuthenticatorInterface) => {
            return [
                IdentityProviderManagementConstants.TOTP_AUTHENTICATOR,
                IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR,
                IdentityProviderManagementConstants.SESSION_EXECUTOR_AUTHENTICATOR
            ].includes(option.authenticator);
        });
    }, [ JSON.stringify(step.options) ]);

    /**
     * Filter the authenticators that are supported for the backup code enable checkbox.
     */
    const backupCodeSupportedAuthenticators: AuthenticatorInterface[] = useMemo(() => {
        return step.options.filter((option: AuthenticatorInterface) => {
            return [
                IdentityProviderManagementConstants.TOTP_AUTHENTICATOR,
                IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR,
                IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR,
                IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR
            ].includes(option.authenticator);
        });
    }, [ JSON.stringify(step.options) ]);

    const isSubjectIdentifierChecked: boolean = useMemo(
        () => (subjectStepId === (stepIndex + 1)),
        [ subjectStepId, stepIndex ]
    );

    const isAttributeIdentifierChecked: boolean = useMemo(
        () => (attributeStepId === (stepIndex + 1)),
        [ attributeStepId, stepIndex ]
    );

    /**
     * Check whether the backup codes is enabled for the step
     */
    const isBackupCodesEnabled: boolean = useMemo(
        () => {
            let isBackupCodesEnabled: boolean = false;

            step.options.map((option: AuthenticatorInterface, optionIndex: number) => {
                if (option.authenticator === IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR) {
                    isBackupCodesEnabled = true;
                    setBackupCodeIndex(optionIndex);
                }
            });

            return isBackupCodesEnabled;
        },
        [ JSON.stringify(step.options) ]
    );

    /**
     * Handles the onChange of the backup codes enable checkbox.
     */
    const onChangeBackupCodesCheckbox = (): void => {
        // if the backup codes checkbox is checked, add the backup code authenticator to the step.
        // else remove the backup code authenticator from the step.
        if(!isBackupCodesEnabled) {
            updateAuthenticationStep(stepIndex, IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR_ID);
            // If the current step is set as the subject step or attribute step, reset the subject and attribute step.
            // With backup code authenticator, the step cannot be set as the subject or attribute step.
            if (subjectStepId === stepIndex + 1) {
                onSubjectCheckboxChange(0);
            }
            if (attributeStepId === stepIndex + 1) {
                onAttributeCheckboxChange(0);
            }
        } else {
            onStepOptionDelete(stepIndex, backupCodeIndex);
        }
    };

    /**
     * Check whether the subject step checkbox should be disabled or not.
     *
     * Note: It should be disabled when the IDF is in the step and conditional authentication
     * is disabled. IDF can be set as subject step when user validation is enabled for IDF
     * through conditional authentication.
     *
     * @returns Whether the subject step checkbox should be disabled or not.
     */
    const isSubjectStepCheckboxDisabledOnIDF = (): boolean => {
        let toDisable: boolean = false;

        step.options.map((option: AuthenticatorInterface) => {
            if (option.authenticator === IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR
                && !isConditionalAuthenticationEnabled) {

                toDisable = true;
            }
        });

        return toDisable;
    };

    /**
     * Check whether the attribute step checkbox should be disabled or not.
     *
     * Note: It should be disabled when the IDF is in the step and conditional authentication
     * is disabled. IDF can be set as attribute step when user validation is enabled for IDF
     * through conditional authentication.
     *
     * @returns Whether the attribute step checkbox should be disabled or not.
     */
    const isAttributeStepCheckboxDisabledOnIDF = (): boolean => {

        return step.options.some((option: AuthenticatorInterface) =>
            option.authenticator === IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR
                && !isConditionalAuthenticationEnabled
        );
    };

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
                authenticator = authenticators.find((item: GenericAuthenticatorInterface) =>
                    item.defaultAuthenticator.name === option.authenticator
                );
            } else {
                authenticator = authenticators.find((item: GenericAuthenticatorInterface) =>
                    item.idp === option.idp
                );
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
                        <div
                            className="authenticator-item-wrapper"
                            data-componentid={ `${ componentId }-option` }
                            hidden={
                                authenticator?.id === IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR_ID
                            }
                        >
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
                                            data-componentid={ `${ componentId }-close-button` }
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
                                        icon={
                                            authenticator.idp === AuthenticatorCategories.LOCAL ||
                                            authenticator.defaultAuthenticator?.authenticatorId ===
                                            AuthenticatorManagementConstants.ORGANIZATION_ENTERPRISE_AUTHENTICATOR_ID
                                                ? authenticator.image
                                                : ConnectionsManagementUtils
                                                    .resolveConnectionResourcePath(
                                                        connectionResourcesUrl, authenticator.image)
                                        }
                                        data-componentid={ `${ componentId }-image` }
                                        transparent
                                    />
                                    <span data-componentid={ `${ componentId }-option-name` }>
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
                                <Form data-componentid={ `${ componentId }-authenticator-selection` }>
                                    {
                                        authenticator?.authenticators?.map((item: FederatedAuthenticatorInterface) => {
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

    /**
     * Get the tooltip content for the disabled subject identifier checkbox.
     */
    const getDisabledSubjectIdentifierTooltip = (): ReactElement => {
        if (isSubjectStepCheckboxDisabledOnIDF()) {
            return t("console:develop.features.applications.edit.sections.signOnMethod.sections" +
                ".landing.flowBuilder.types.idf.tooltipText");
        }

        return (
            <>
                <p>
                    { t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                        "authenticationFlow.sections.stepBased.identifierCheckboxDisabled") }
                </p>
                <ul>
                    {
                        subjectIdentifierUnsupportedAuthenticators.map((authenticator: AuthenticatorInterface) => {
                            const authenticatorInfo: GenericAuthenticatorInterface = authenticators.find(
                                (item: GenericAuthenticatorInterface) =>
                                    item.defaultAuthenticator.name === authenticator.authenticator
                            );

                            return (
                                <li key={ authenticator.authenticator }>
                                    { authenticatorInfo?.displayName }
                                </li>
                            );
                        })
                    }
                </ul>
            </>
        );
    };

    /**
     * Get the tooltip content for the disabled attribute identifier checkbox.
     */
    const getDisabledAttributeIdentifierTooltip = (): ReactElement => {
        if (isSubjectStepCheckboxDisabledOnIDF()) {
            return t("console:develop.features.applications.edit.sections.signOnMethod.sections" +
                ".landing.flowBuilder.types.idf.tooltipText");
        }

        return (
            <>
                <p>
                    { t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                        "authenticationFlow.sections.stepBased.identifierCheckboxDisabled") }
                </p>
                <ul>
                    {
                        subjectIdentifierUnsupportedAuthenticators.map((authenticator: AuthenticatorInterface) => {
                            const authenticatorInfo: GenericAuthenticatorInterface = authenticators.find(
                                (item: GenericAuthenticatorInterface) =>
                                    item.defaultAuthenticator.name === authenticator.authenticator
                            );

                            return (
                                <li key={ authenticator.authenticator }>
                                    { authenticatorInfo?.displayName }
                                </li>
                            );
                        })
                    }
                </ul>
            </>
        );
    };

    return (
        <div className="timeline-item">
            <div className="timeline-badge">
                { step.id }
            </div>
            <div
                className={ classes }
                data-componentid={ componentId }
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
                                        data-componentid={ `${ componentId }-delete-button` }
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
                                        step.options.map((option: AuthenticatorInterface, optionIndex: number) => (
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
                                            data-componentid={ `${ componentId }-empty-placeholder` }
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
                        && (
                            <div className="checkboxes-extension">
                                { (
                                    <Tooltip
                                        disabled={ !isAttributeStepCheckboxDisabledOnIDF()
                                                    && subjectIdentifierUnsupportedAuthenticators.length === 0 }
                                        trigger={ (
                                            <Checkbox
                                                label={ t(
                                                    "console:develop.features.applications.edit.sections" +
                                                        ".signOnMethod.sections.authenticationFlow.sections" +
                                                        ".stepBased.forms.fields.subjectIdentifierFrom.label"
                                                ) }
                                                checked={ isSubjectIdentifierChecked }
                                                data-componentid={ `${ componentId }-subject-step-checkbox` }
                                                onChange={ (): void => onSubjectCheckboxChange(stepIndex + 1) }
                                                readOnly={
                                                    isSubjectStepCheckboxDisabledOnIDF()
                                                    || subjectIdentifierUnsupportedAuthenticators.length > 0
                                                    || isSubjectIdentifierChecked
                                                }
                                            />
                                        ) }
                                        content={ getDisabledSubjectIdentifierTooltip() }
                                        data-componentid={ `${ componentId }-subject-step-tooltip` }
                                        basic={ false }
                                        position="bottom left"
                                    />
                                ) }
                                { (
                                    <Tooltip
                                        disabled={ !isAttributeStepCheckboxDisabledOnIDF()
                                            && subjectIdentifierUnsupportedAuthenticators.length === 0 }
                                        trigger={ (
                                            <Checkbox
                                                label={ t(
                                                    "console:develop.features.applications.edit.sections" +
                                                        ".signOnMethod.sections.authenticationFlow.sections" +
                                                        ".stepBased.forms.fields.attributesFrom.label"
                                                ) }
                                                checked={ isAttributeIdentifierChecked }
                                                data-componentid={ `${ componentId }-attribute-step-checkbox` }
                                                onChange={ (): void => onAttributeCheckboxChange(stepIndex + 1) }
                                                readOnly={
                                                    isAttributeStepCheckboxDisabledOnIDF()
                                                        || subjectIdentifierUnsupportedAuthenticators.length > 0
                                                        || isAttributeIdentifierChecked
                                                }
                                            />
                                        ) }
                                        content={ getDisabledAttributeIdentifierTooltip() }
                                        data-componentid={ `${ componentId }-attribute-step-tooltip` }
                                        basic={ false }
                                        position="bottom left"
                                    />
                                ) }
                                { backupCodeSupportedAuthenticators.length > 0
                                    && (
                                        <Tooltip
                                            disabled={ stepIndex > 0 }
                                            trigger={ (
                                                <Checkbox
                                                    label={ t(
                                                        "console:develop.features.applications.edit.sections" +
                                                        ".signOnMethod.sections.authenticationFlow.sections" +
                                                        ".stepBased.forms.fields.enableBackupCodes.label"
                                                    ) }
                                                    checked={ isBackupCodesEnabled }
                                                    onChange={ (): void => onChangeBackupCodesCheckbox() }
                                                    disabled={ stepIndex === 0 }
                                                />
                                            ) }
                                            content={ t(
                                                "console:develop.features.applications.edit.sections" +
                                                ".signOnMethod.sections.authenticationFlow.sections.stepBased" +
                                                ".backupCodesDisabledInFirstStep"
                                            ) }
                                            data-componentid={ `${ componentId }-attribute-step-tooltip` }
                                            basic={ false }
                                            position="bottom left"
                                        />
                                    )
                                }
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
    "data-componentid": "authentication-step"
};
