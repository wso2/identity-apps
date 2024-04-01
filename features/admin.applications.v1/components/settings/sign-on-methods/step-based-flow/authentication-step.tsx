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

import useUIConfig from "@wso2is/common/src/hooks/use-ui-configs";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { EmptyPlaceholder, GenericIcon, Heading, LinkButton, Popup, Tooltip } from "@wso2is/react-components";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Checkbox, Form, Icon, Label, Radio } from "semantic-ui-react";
import useAuthenticationFlow from "../../../../../admin.authentication-flow-builder.v1/hooks/use-authentication-flow";
import { AuthenticatorManagementConstants } from "../../../../../admin.connections.v1";
import { AuthenticatorCategories } from "../../../../../admin.connections.v1/models/authenticators";
import { ConnectionsManagementUtils } from "../../../../../admin.connections.v1/utils/connection-utils";
import { getGeneralIcons } from "../../../../../admin.core.v1";
import {
    IdentityProviderManagementConstants
} from "../../../../../admin-identity-providers-v1/constants/identity-provider-management-constants";
import {
    FederatedAuthenticatorInterface,
    GenericAuthenticatorInterface
} from "../../../../../admin-identity-providers-v1/models/identity-provider";
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

    const [ showSubjectIdentifierCheckBox, setShowSubjectIdentifierCheckbox ] = useState<boolean>(false);
    const [ showBackupCodesEnableCheckBox, setShowBackupCodesEnableCheckBox ] = useState<boolean>(false);
    const [ backupCodeIndex, setBackupCodeIndex ] = useState<number>(null);

    const { isConditionalAuthenticationEnabled } = useAuthenticationFlow();

    useEffect(() => {
        let isBackupCodeSupportedAuthenticator: boolean = false;

        step.options.map((option: AuthenticatorInterface) => {
            if ([ IdentityProviderManagementConstants.TOTP_AUTHENTICATOR,
                IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR,
                IdentityProviderManagementConstants.SESSION_EXECUTOR_AUTHENTICATOR ]
                .includes(option.authenticator)) {
                setShowSubjectIdentifierCheckbox(false);
            } else {
                setShowSubjectIdentifierCheckbox(true);
            }

            // if the authenticator is TOTP, Email OTP, SMS OTP or Backup Code,
            // show the backup codes enable checkbox.
            if([ IdentityProviderManagementConstants.TOTP_AUTHENTICATOR,
                IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR,
                IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR,
                IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR ]
                .includes(option.authenticator)) {
                isBackupCodeSupportedAuthenticator = true;
            }
        });
        setShowBackupCodesEnableCheckBox(isBackupCodeSupportedAuthenticator);
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
                                    { t("applications:edit.sections.signOnMethod.sections" +
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
                                                    t("applications:" +
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
                                                t("applications:edit.sections.signOnMethod." +
                                                    "sections.authenticationFlow.sections.stepBased.actions." +
                                                    "addAuthentication")
                                            }
                                        </LinkButton>
                                        <EmptyPlaceholder
                                            subtitle={ [
                                                t("applications:placeholders." +
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
                                { showSubjectIdentifierCheckBox ? (
                                    <>
                                        {
                                            isSubjectStepCheckboxDisabledOnIDF() ? (
                                                <Tooltip
                                                    trigger={ (
                                                        <Checkbox
                                                            label={ t(
                                                                "applications:edit.sections" +
                                                                ".signOnMethod.sections.authenticationFlow.sections" +
                                                                ".stepBased.forms.fields.subjectIdentifierFrom.label"
                                                            ) }
                                                            checked={ isSubjectIdentifierChecked }
                                                            data-componentid={
                                                                `${ componentId }-subject-step-checkbox`
                                                            }
                                                            onChange={
                                                                (): void => onSubjectCheckboxChange(stepIndex + 1)
                                                            }
                                                            readOnly={ true }
                                                        />
                                                    ) }
                                                    content={ t(
                                                        "applications:edit.sections" +
                                                        ".signOnMethod.sections.landing.flowBuilder.types.idf" +
                                                        ".tooltipText"
                                                    ) }
                                                    data-componentid={ `${ componentId }-subject-step-tooltip` }
                                                    basic
                                                >
                                                </Tooltip>
                                            ) : (
                                                <Checkbox
                                                    label={ t(
                                                        "applications:edit.sections" +
                                                        ".signOnMethod.sections.authenticationFlow.sections" +
                                                        ".stepBased.forms.fields.subjectIdentifierFrom.label"
                                                    ) }
                                                    checked={ isSubjectIdentifierChecked }
                                                    data-componentid={ `${ componentId }-subject-step-checkbox` }
                                                    onChange={ (): void => onSubjectCheckboxChange(stepIndex + 1) }
                                                    readOnly={ isSubjectIdentifierChecked }
                                                />
                                            )
                                        }
                                        {
                                            isAttributeStepCheckboxDisabledOnIDF() ? (
                                                <Tooltip
                                                    trigger={ (
                                                        <Checkbox
                                                            label={ t(
                                                                "applications:edit.sections" +
                                                                ".signOnMethod.sections.authenticationFlow.sections" +
                                                                ".stepBased.forms.fields.attributesFrom.label"
                                                            ) }
                                                            checked={ isAttributeIdentifierChecked }
                                                            data-componentid={
                                                                `${ componentId }-attribute-step-checkbox`
                                                            }
                                                            onChange={
                                                                (): void => onAttributeCheckboxChange(stepIndex + 1)
                                                            }
                                                            readOnly={ true }
                                                        />
                                                    ) }
                                                    content={ t(
                                                        "applications:edit.sections" +
                                                        ".signOnMethod.sections.landing.flowBuilder.types.idf" +
                                                        ".tooltipText"
                                                    ) }
                                                    data-componentid={ `${ componentId }-attribute-step-tooltip` }
                                                    basic
                                                >
                                                </Tooltip>
                                            ) : (
                                                <Checkbox
                                                    label={ t(
                                                        "applications:edit.sections" +
                                                        ".signOnMethod.sections.authenticationFlow.sections" +
                                                        ".stepBased.forms.fields.attributesFrom.label"
                                                    ) }
                                                    checked={ isAttributeIdentifierChecked }
                                                    data-componentid={ `${ componentId }-attribute-step-checkbox` }
                                                    onChange={ (): void => onAttributeCheckboxChange(stepIndex + 1) }
                                                    readOnly={ isAttributeIdentifierChecked }
                                                />
                                            )
                                        }
                                    </> ) : null
                                }
                                { showBackupCodesEnableCheckBox ? (
                                    <Checkbox
                                        label={ t(
                                            "applications:edit.sections" +
                                            ".signOnMethod.sections.authenticationFlow.sections" +
                                            ".stepBased.forms.fields.enableBackupCodes.label"
                                        ) }
                                        checked={ isBackupCodesEnabled }
                                        onChange={ (): void => onChangeBackupCodesCheckbox() }
                                    /> ) : null
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
