/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "semantic-ui-react";
import { serverConfigurationConfig } from "../../../extensions/configs";
import { GovernanceConnectorConstants } from "../constants/governance-connector-constants";
import { ServerConfigurationsConstants } from "../constants/server-configurations-constants";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface } from "../models/governance-connectors";
import { GovernanceConnectorUtils } from "../utils";

/**
 * Interface for ask password form props.
 */
interface AskPasswordFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * Connector's initial values.
     */
    initialValues: GovernanceConnectorInterface;
    /**
     * Callback for form submit.
     * @param values - Resolved Form Values.
     */
    onSubmit: (values) => void;
    /**
     * Is readonly.
     */
    readOnly?: boolean;
    /**
     * Whether the connector is enabled using the toggle button.
     */
    isConnectorEnabled?: boolean;
    /**
     * Specifies if the form is submitting
     */
    isSubmitting?: boolean;
}

const FORM_ID: string = "governance-connectors-ask-password-form";

/**
 * Ask Password Form.
 *
 * @param props - Props injected to the component.
 * @returns Ask Password Form component.
 */
export const AskPasswordForm: FunctionComponent<AskPasswordFormPropsInterface> = (
    props: AskPasswordFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        onSubmit,
        readOnly,
        isConnectorEnabled,
        isSubmitting,
        ["data-componentid"]: testId
    } = props;

    const { t } = useTranslation();

    const [ initialConnectorValues, setInitialConnectorValues ]
        = useState<Map<string, ConnectorPropertyInterface>>(undefined);
    const [ initialFormValues, setInitialFormValues ]
        = useState<any>(undefined);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {

        if (isEmpty(initialValues?.properties)) {
            return;
        }

        const resolvedInitialValues: Map<string, ConnectorPropertyInterface>
            = new Map<string, ConnectorPropertyInterface>();
        let resolvedInitialFormValues: any
            = null;

        initialValues.properties.map((property: ConnectorPropertyInterface) => {

            resolvedInitialValues.set(property.name, property);
            resolvedInitialFormValues = {
                ...resolvedInitialFormValues,
                [ property.name ]: property.value
            };
        });

        setInitialConnectorValues(resolvedInitialValues);
        setInitialFormValues(resolvedInitialFormValues);
    }, [ initialValues ]);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const getUpdatedConfigurations = (values: Record<string, unknown>) => {
        let data: { [key: string]: unknown } = {};

        for (const key in values) {
            if (Object.prototype.hasOwnProperty.call(values, key)
            && key !== ServerConfigurationsConstants.ASK_PASSWORD_ENABLE) {
                data = {
                    ...data,
                    [ GovernanceConnectorUtils.decodeConnectorPropertyName(key) ]: values[ key ]
                };
            }
        }

        return data;
    };

    if (!initialConnectorValues) {
        return null;
    }

    return (
        <Form
            id={ FORM_ID }
            uncontrolledForm={ false }
            initialValues={ initialFormValues }
            onSubmit={ (values: Record<string, unknown>) =>
                onSubmit(getUpdatedConfigurations(values))
            }
        >
            <Field.Checkbox
                ariaLabel="EmailVerification.Enable"
                name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                    "EmailVerification.Enable")
                }
                className="toggle"
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "User Onboarding",
                    "EmailVerification.Enable",
                    "Enable user email verification") }
                defaultValue={ initialFormValues?.[
                    "EmailVerification.Enable" ] === "true" }
                readOnly={ readOnly }
                disabled={ !isConnectorEnabled }
                width={ 16 }
                data-componentid={ `${ testId }-enable-email-verification` }
                hint={ GovernanceConnectorUtils.resolveFieldHint(
                    "User Onboarding",
                    "EmailVerification.Enable",
                    "A verification notification will be triggered during user creation.")
                }
                hidden={ !serverConfigurationConfig.dynamicConnectors }
            />
            <Field.Checkbox
                ariaLabel="EmailVerification.LockOnCreation"
                name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                    "EmailVerification.LockOnCreation")
                }
                className="toggle"
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "User Onboarding",
                    "EmailVerification.LockOnCreation",
                    "Enable account lock on creation") }
                defaultValue={ initialFormValues?.[
                    "EmailVerification.LockOnCreation" ] === "true" }
                readOnly={ readOnly }
                disabled={ !isConnectorEnabled }
                width={ 16 }
                data-componentid={ `${ testId }-enable-account-lock-on-creation` }
                hint={ GovernanceConnectorUtils.resolveFieldHint(
                    "User Onboarding",
                    "EmailVerification.LockOnCreation",
                    "The user account will be locked during user creation.")
                }
                hidden={ !serverConfigurationConfig.dynamicConnectors }
            />
            <Field.Checkbox
                ariaLabel="EmailVerification.AskPassword.AccountActivation"
                name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                    "EmailVerification.AskPassword.AccountActivation")
                }
                className="toggle"
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "User Onboarding",
                    "EmailVerification.AskPassword.AccountActivation",
                    "Send account activation email") }
                defaultValue={ initialFormValues?.[
                    "EmailVerification.AskPassword.AccountActivation" ] === "true" }
                readOnly={ readOnly }
                disabled={ !isConnectorEnabled }
                width={ 16 }
                data-componentid={ `${ testId }-enable-send-account-activation-email` }
                hint={ GovernanceConnectorUtils.resolveFieldHint(
                    "User Onboarding",
                    "EmailVerification.AskPassword.AccountActivation",
                    "Disable if account activation confirmation email is not required.")
                }
                hidden={ !serverConfigurationConfig.dynamicConnectors }
            />
            <Field.Input
                ariaLabel="EmailVerification.ExpiryTime"
                inputType="number"
                name="EmailVerification.ExpiryTime"
                min={
                    GovernanceConnectorConstants.SELF_REGISTRATION_FORM_FIELD_CONSTRAINTS
                        .EXPIRY_TIME_MIN_VALUE
                }
                max={
                    GovernanceConnectorConstants.SELF_REGISTRATION_FORM_FIELD_CONSTRAINTS
                        .EXPIRY_TIME_MAX_VALUE
                }
                width={ 10 }
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "User Onboarding",
                    "EmailVerification.ExpiryTime",
                    "Email verification code expiry time") }
                required={ false }
                hidden={ !serverConfigurationConfig.dynamicConnectors }
                placeholder={ t("extensions:manage.serverConfigurations.userOnboarding." +
                    "selfRegistration.form.fields.expiryTime.placeholder") }
                maxLength={
                    GovernanceConnectorConstants
                        .SELF_REGISTRATION_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_LENGTH
                }
                labelPosition="right"
                minLength={
                    GovernanceConnectorConstants
                        .SELF_REGISTRATION_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_LENGTH
                }
                readOnly={ readOnly }
                disabled={ !isConnectorEnabled }
                data-componentid={ `${ testId }-link-expiry-time` }
                data-testid={ `${testId}-link-expiry-time` }
            >
                <input/>
                <Label>mins</Label>
            </Field.Input>
            <Field.Input
                ariaLabel="EmailVerification.AskPassword.ExpiryTime"
                inputType="number"
                name="EmailVerification.AskPassword.ExpiryTime"
                min={
                    GovernanceConnectorConstants.SELF_REGISTRATION_FORM_FIELD_CONSTRAINTS
                        .EXPIRY_TIME_MIN_VALUE
                }
                max={
                    GovernanceConnectorConstants.SELF_REGISTRATION_FORM_FIELD_CONSTRAINTS
                        .EXPIRY_TIME_MAX_VALUE
                }
                width={ 10 }
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "User Onboarding",
                    "EmailVerification.AskPassword.ExpiryTime",
                    "Password Setup Invitation Code Expiration Time") }
                required={ false }
                hidden={ !serverConfigurationConfig.dynamicConnectors }
                placeholder={ t("extensions:manage.serverConfigurations.userOnboarding." +
                    "selfRegistration.form.fields.expiryTime.placeholder") }
                maxLength={
                    GovernanceConnectorConstants
                        .SELF_REGISTRATION_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_LENGTH
                }
                labelPosition="right"
                minLength={
                    GovernanceConnectorConstants
                        .SELF_REGISTRATION_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_LENGTH
                }
                readOnly={ readOnly }
                disabled={ !isConnectorEnabled }
                data-componentid={ `${ testId }-ask-password-code-expiry-time` }
                data-testid={ `${testId}-link-ask-password-code-expiry-time` }
                hint={ GovernanceConnectorUtils.resolveFieldHint(
                    "User Onboarding",
                    "EmailVerification.AskPassword.ExpiryTime",
                    "Set the time span that the password setup invitation e-mail would be valid, " +
                        "in minutes. (For infinite validity period, set -1).")
                }
            >
                <input/>
                <Label>mins</Label>
            </Field.Input>
            <Field.Button
                form={ FORM_ID }
                size="small"
                buttonType="primary_btn"
                ariaLabel="Self registration update button"
                name="update-button"
                data-testid={ `${testId}-submit-button` }
                disabled={ !isConnectorEnabled || isSubmitting }
                loading={ isSubmitting }
                label={ t("common:update") }
                hidden={ !isConnectorEnabled || readOnly }
            />
        </Form>
    );
};

/**
 * Default props for the component.
 */
AskPasswordForm.defaultProps = {
    "data-componentid": "ask-password-edit-form"
};
