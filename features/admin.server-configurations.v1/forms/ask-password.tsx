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
import { serverConfigurationConfig } from "../../admin.extensions.v1/configs";
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

    const PROPERTY_NAMES: { [key: string]: string } = {
        EMAIL_VERIFICATION_ASK_PASSWORD_ACCOUNT_ACTIVATION: "EmailVerification.AskPassword.AccountActivation",
        EMAIL_VERIFICATION_ASK_PASSWORD_EXPIRY_TIME: "EmailVerification.AskPassword.ExpiryTime",
        EMAIL_VERIFICATION_ASK_PASSWORD_PASSWORD_GENERATOR: "EmailVerification.AskPassword.PasswordGenerator",
        EMAIL_VERIFICATION_ENABLE: "EmailVerification.Enable",
        EMAIL_VERIFICATION_EXPIRY_TIME: "EmailVerification.ExpiryTime",
        EMAIL_VERIFICATION_LOCK_ON_CREATION: "EmailVerification.LockOnCreation",
        EMAIL_VERIFICATION_NOTIFICATION_INTERNALLY_MANAGE: "EmailVerification.Notification.InternallyManage",
        EMAIL_VERIFICATION_OTP_OTPLENGTH: "EmailVerification.OTP.OTPLength",
        EMAIL_VERIFICATION_OTP_SEND_OTP_IN_EMAIL: "EmailVerification.OTP.SendOTPInEmail",
        EMAIL_VERIFICATION_OTP_USELOWERCASECHARACTERS_IN_OTP: "EmailVerification.OTP.UseLowercaseCharactersInOTP",
        EMAIL_VERIFICATION_OTP_USENUMBERS_IN_OTP: "EmailVerification.OTP.UseNumbersInOTP",
        EMAIL_VERIFICATION_OTP_USEUPPPERCASECHARACTERS_IN_OTP: "EmailVerification.OTP.UseUppercaseCharactersInOTP",
        JIT_PROVISIONING_PURPOSES_URL: "_url_listPurposeJITProvisioning"
    };
    const HIDDEN_PROPERTIES: string[] = [
        PROPERTY_NAMES.EMAIL_VERIFICATION_EXPIRY_TIME,
        PROPERTY_NAMES.EMAIL_VERIFICATION_ASK_PASSWORD_PASSWORD_GENERATOR,
        PROPERTY_NAMES.EMAIL_VERIFICATION_NOTIFICATION_INTERNALLY_MANAGE,
        PROPERTY_NAMES.EMAIL_VERIFICATION_OTP_OTPLENGTH,
        PROPERTY_NAMES.EMAIL_VERIFICATION_OTP_SEND_OTP_IN_EMAIL,
        PROPERTY_NAMES.EMAIL_VERIFICATION_OTP_USELOWERCASECHARACTERS_IN_OTP,
        PROPERTY_NAMES.EMAIL_VERIFICATION_OTP_USENUMBERS_IN_OTP,
        PROPERTY_NAMES.EMAIL_VERIFICATION_OTP_USEUPPPERCASECHARACTERS_IN_OTP,
        PROPERTY_NAMES.JIT_PROVISIONING_PURPOSES_URL
    ];

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

            // Skip hidden properties.
            if (HIDDEN_PROPERTIES.includes(property.name)) {
                return;
            }

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
                ariaLabel="Enable email verification"
                name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                    PROPERTY_NAMES.EMAIL_VERIFICATION_ENABLE)
                }
                className="toggle"
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "User Onboarding",
                    PROPERTY_NAMES.EMAIL_VERIFICATION_ENABLE,
                    "Enable email invitations for user password setup") }
                defaultValue={ initialFormValues?.[
                    PROPERTY_NAMES.EMAIL_VERIFICATION_ENABLE ] === "true" }
                readOnly={ readOnly }
                disabled={ !isConnectorEnabled }
                width={ 16 }
                data-componentid={ `${ testId }-enable-email-verification` }
                hint={ GovernanceConnectorUtils.resolveFieldHint(
                    "User Onboarding",
                    PROPERTY_NAMES.EMAIL_VERIFICATION_ENABLE,
                    "An email will be sent to the user to set the password after user creation.")
                }
                hidden={ !serverConfigurationConfig.dynamicConnectors }
            />
            <Field.Checkbox
                ariaLabel="Enable account lock on creation"
                name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                    PROPERTY_NAMES.EMAIL_VERIFICATION_LOCK_ON_CREATION)
                }
                className="toggle"
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "User Onboarding",
                    PROPERTY_NAMES.EMAIL_VERIFICATION_LOCK_ON_CREATION,
                    "Enable account lock on creation") }
                defaultValue={ initialFormValues?.[
                    PROPERTY_NAMES.EMAIL_VERIFICATION_LOCK_ON_CREATION ] === "true" }
                readOnly={ readOnly }
                disabled={ !isConnectorEnabled }
                width={ 16 }
                data-componentid={ `${ testId }-enable-account-lock-on-creation` }
                hint={ GovernanceConnectorUtils.resolveFieldHint(
                    "User Onboarding",
                    PROPERTY_NAMES.EMAIL_VERIFICATION_LOCK_ON_CREATION,
                    "The user account will be locked during user creation.")
                }
                hidden={ !serverConfigurationConfig.dynamicConnectors }
            />
            <Field.Checkbox
                ariaLabel="Send account activation email"
                name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                    PROPERTY_NAMES.EMAIL_VERIFICATION_ASK_PASSWORD_ACCOUNT_ACTIVATION)
                }
                className="toggle"
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "User Onboarding",
                    PROPERTY_NAMES.EMAIL_VERIFICATION_ASK_PASSWORD_ACCOUNT_ACTIVATION,
                    "Send account activation email") }
                defaultValue={ initialFormValues?.[
                    PROPERTY_NAMES.EMAIL_VERIFICATION_ASK_PASSWORD_ACCOUNT_ACTIVATION ] === "true" }
                readOnly={ readOnly }
                disabled={ !isConnectorEnabled }
                width={ 16 }
                data-componentid={ `${ testId }-enable-send-account-activation-email` }
                hint={ GovernanceConnectorUtils.resolveFieldHint(
                    "User Onboarding",
                    PROPERTY_NAMES.EMAIL_VERIFICATION_ASK_PASSWORD_ACCOUNT_ACTIVATION,
                    "Disable if account activation confirmation email is not required.")
                }
                hidden={ !serverConfigurationConfig.dynamicConnectors }
            />
            <Field.Input
                ariaLabel="Password Setup Invitation Code Expiration Time"
                inputType="number"
                name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                    PROPERTY_NAMES.EMAIL_VERIFICATION_ASK_PASSWORD_EXPIRY_TIME)
                }
                min={
                    GovernanceConnectorConstants.ASK_PASSWORD_FORM_FIELD_CONSTRAINTS
                        .EXPIRY_TIME_MIN_VALUE
                }
                max={
                    GovernanceConnectorConstants.ASK_PASSWORD_FORM_FIELD_CONSTRAINTS
                        .EXPIRY_TIME_MAX_VALUE
                }
                width={ 12 }
                label={ GovernanceConnectorUtils.resolveFieldLabel(
                    "User Onboarding",
                    PROPERTY_NAMES.EMAIL_VERIFICATION_ASK_PASSWORD_EXPIRY_TIME,
                    "Password setup invitation code expiration time") }
                required={ false }
                hidden={ !serverConfigurationConfig.dynamicConnectors }
                placeholder={ t("extensions:manage.serverConfigurations.userOnboarding." +
                    "selfRegistration.form.fields.expiryTime.placeholder") }
                maxLength={
                    GovernanceConnectorConstants
                        .ASK_PASSWORD_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_LENGTH
                }
                labelPosition="right"
                minLength={
                    GovernanceConnectorConstants
                        .ASK_PASSWORD_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_LENGTH
                }
                readOnly={ readOnly }
                disabled={ !isConnectorEnabled }
                initialValue={ initialFormValues?.[
                    PROPERTY_NAMES.EMAIL_VERIFICATION_ASK_PASSWORD_EXPIRY_TIME ] }
                data-componentid={ `${ testId }-ask-password-code-expiry-time` }
                data-testid={ `${testId}-link-ask-password-code-expiry-time` }
                hint={ GovernanceConnectorUtils.resolveFieldHint(
                    "User Onboarding",
                    PROPERTY_NAMES.EMAIL_VERIFICATION_ASK_PASSWORD_EXPIRY_TIME,
                    "Set the time span that the password setup invitation e-mail would be valid, " +
                        "in minutes. (For infinite validity period, set -1. Setting 0 will cause immediate" +
                        " expiry of the invitation)")
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
