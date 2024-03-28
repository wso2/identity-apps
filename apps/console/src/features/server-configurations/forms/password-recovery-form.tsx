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

import { TestableComponentInterface } from "@wso2is/core/models";
import { CommonUtils } from "@wso2is/core/utils";
import { Field, Form } from "@wso2is/form";
import { Hint } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "semantic-ui-react";
import { GovernanceConnectorConstants } from "../constants/governance-connector-constants";
import { ServerConfigurationsConstants } from "../constants/server-configurations-constants";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface
} from "../models/governance-connectors";

/**
 * Interface for Password Recovery Configuration Form props.
 */
interface PasswordRecoveryConfigurationFormPropsInterface extends TestableComponentInterface {
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
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
}

/**
 * Form initial values interface.
 */
interface PasswordRecoveryFormInitialValuesInterface {
    /**
     * Recovery link expiry time.
     */
    expiryTime: string;
    /**
     * Notify user on successful password recovery.
     */
    notifySuccess: boolean;
    /**
     * Whether email based recovery is enabled.
     */
    enableEmailBasedRecovery: boolean;
    /**
     * Whether SMS based recovery is enabled.
     */
    enableSMSBasedRecovery: boolean;
    /**
     * SMS OTP expiry time.
     */
    smsOtpExpiryTime: string;
    /**
     * SMS OTP regex.
     */
    smsOtpRegex: string;
}

/**
 * Proptypes for the Password Recovery Form error messages.
 */
export interface PasswordRecoveryFormErrorValidationsInterface {
    /**
     * Recovery link expiry time field.
     */
    expiryTime: string;
    /**
     * Sms otp expiry time field
     */
    smsOtpExpiryTime: string;
    /**
     * SMS OTP regex field.
     */
    smsOtpRegex: string;
}

const allowedConnectorFields: string[] = [
    ServerConfigurationsConstants.NOTIFY_SUCCESS,
    ServerConfigurationsConstants.RECOVERY_LINK_EXPIRY_TIME,
    ServerConfigurationsConstants.RECOVERY_EMAIL_LINK_ENABLE,
    ServerConfigurationsConstants.RECOVERY_SMS_OTP_ENABLE,
    ServerConfigurationsConstants.RECOVERY_SMS_EXPIRY_TIME,
    ServerConfigurationsConstants.RECOVERY_SMS_OTP_REGEX
];

const FORM_ID: string = "governance-connectors-password-recovery-form";

/**
 * Password Recovery Configuration Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const PasswordRecoveryConfigurationForm: FunctionComponent<PasswordRecoveryConfigurationFormPropsInterface> = (
    props: PasswordRecoveryConfigurationFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        onSubmit,
        readOnly,
        isConnectorEnabled,
        isSubmitting,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();
    const [ initialConnectorValues, setInitialConnectorValues ]
        = useState<PasswordRecoveryFormInitialValuesInterface>(undefined);
    const [ isEmailRecoveryEnabled, setIsEmailRecoveryEnabled ] = useState<boolean>(false);
    const [ isSMSRecoveryEnabled, setIsSMSRecoveryEnabled ] = useState<boolean>(false);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {

        if (isEmpty(initialValues?.properties)) {
            return;
        }

        let resolvedInitialValues: PasswordRecoveryFormInitialValuesInterface = null;

        initialValues.properties.map((property: ConnectorPropertyInterface) => {
            if (allowedConnectorFields.includes(property.name)) {
                if (property.name === ServerConfigurationsConstants.NOTIFY_SUCCESS) {
                    resolvedInitialValues = {
                        ...resolvedInitialValues,
                        notifySuccess: CommonUtils.parseBoolean(property.value)
                    };
                } else if (property.name === ServerConfigurationsConstants.RECOVERY_LINK_EXPIRY_TIME) {
                    resolvedInitialValues = {
                        ...resolvedInitialValues,
                        expiryTime: property.value
                    };
                } else if (property.name === ServerConfigurationsConstants.RECOVERY_EMAIL_LINK_ENABLE) {
                    resolvedInitialValues = {
                        ...resolvedInitialValues,
                        enableEmailBasedRecovery: CommonUtils.parseBoolean(property.value)
                    };
                } else if (property.name === ServerConfigurationsConstants.RECOVERY_SMS_OTP_ENABLE) {
                    resolvedInitialValues = {
                        ...resolvedInitialValues,
                        enableSMSBasedRecovery: CommonUtils.parseBoolean(property.value)
                    };
                } else if (property.name === ServerConfigurationsConstants.RECOVERY_SMS_EXPIRY_TIME) {
                    resolvedInitialValues = {
                        ...resolvedInitialValues,
                        smsOtpExpiryTime: property.value
                    };
                } else if (property.name === ServerConfigurationsConstants.RECOVERY_SMS_OTP_REGEX) {
                    resolvedInitialValues = {
                        ...resolvedInitialValues,
                        smsOtpRegex: property.value
                    };
                }
            }
        });
        setInitialConnectorValues(resolvedInitialValues);
        setIsEmailRecoveryEnabled(resolvedInitialValues?.enableEmailBasedRecovery);
        setIsSMSRecoveryEnabled(resolvedInitialValues?.enableSMSBasedRecovery);
    }, [ initialValues ]);

    /**
     * Validate input data.
     *
     * @param values - Form values.
     * @returns Form validation.
     */
    const validateForm = (values: any):
        PasswordRecoveryFormErrorValidationsInterface => {

        const errors: PasswordRecoveryFormErrorValidationsInterface = {
            expiryTime: undefined,
            smsOtpExpiryTime: undefined,
            smsOtpRegex: undefined
        };

        if (!values.expiryTime) {
            // Check for required error.
            errors.expiryTime = t("extensions:manage.serverConfigurations.accountRecovery." +
                "passwordRecovery.form.fields.expiryTime.validations.empty");
        } else if (!FormValidation.isInteger(values.expiryTime as unknown as number)) {
            // Check for invalid input.
            errors.expiryTime = t("extensions:manage.serverConfigurations.accountRecovery." +
                "passwordRecovery.form.fields.expiryTime.validations.invalid");
        } else if ((parseInt(values.expiryTime, 10) < GovernanceConnectorConstants
            .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_VALUE)
            || (parseInt(values.expiryTime, 10) > GovernanceConnectorConstants
                .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_VALUE)) {
            // Check for invalid range.
            errors.expiryTime = t("extensions:manage.serverConfigurations.accountRecovery." +
                "passwordRecovery.form.fields.expiryTime.validations.range");
        } else if (values.smsOtpExpiryTime &&
            !FormValidation.isLengthValid(values.smsOtpExpiryTime as string, GovernanceConnectorConstants
                .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.SMS_OTP_EXPIRY_TIME_MAX_LENGTH)) {
            // Check for invalid input length.
            errors.smsOtpExpiryTime = t("extensions:manage.serverConfigurations.accountRecovery." +
                "passwordRecovery.form.fields.smsOtpExpiryTime.validations.maxLengthReached");
        } else if (values.expiryTime &&
            !FormValidation.isLengthValid(values.expiryTime as string, GovernanceConnectorConstants
                .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_LENGTH)) {
            // Check for invalid input length.
            errors.expiryTime = t("extensions:manage.serverConfigurations.accountRecovery." +
                "passwordRecovery.form.fields.expiryTime.validations.maxLengthReached");
        } else if (!values.smsOtpExpiryTime) {
            // Check for required error.
            errors.smsOtpExpiryTime = t("extensions:manage.serverConfigurations.accountRecovery." +
                "passwordRecovery.form.fields.smsOtpExpiryTime.validations.empty");
        } else if (!FormValidation.isInteger(values.smsOtpExpiryTime as unknown as number)) {
            // Check for invalid input.
            errors.smsOtpExpiryTime = t("extensions:manage.serverConfigurations.accountRecovery." +
                "passwordRecovery.form.fields.smsOtpExpiryTime.validations.invalid");
        } else if ((parseInt(values.smsOtpExpiryTime, 10) < GovernanceConnectorConstants
            .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_VALUE)
            || (parseInt(values.smsOtpExpiryTime, 10) > GovernanceConnectorConstants
                .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.SMS_OTP_EXPIRY_TIME_MAX_VALUE)) {
            // Check for invalid range.
            errors.smsOtpExpiryTime = t("extensions:manage.serverConfigurations.accountRecovery." +
                "passwordRecovery.form.fields.smsOtpExpiryTime.validations.range");
        } else if (values.smsOtpExpiryTime &&
            !FormValidation.isLengthValid(values.smsOtpExpiryTime as string, GovernanceConnectorConstants
                .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.SMS_OTP_EXPIRY_TIME_MAX_LENGTH)) {
            // Check for invalid input length.
            errors.smsOtpExpiryTime = t("extensions:manage.serverConfigurations.accountRecovery." +
                "passwordRecovery.form.fields.smsOtpExpiryTime.validations.maxLengthReached");
        } else if (!values.smsOtpRegex) {
            // Check for required error.
            errors.smsOtpRegex = t("extensions:manage.serverConfigurations.accountRecovery." +
                "passwordRecovery.form.fields.smsOtpRegex.validations.empty");
        } else if (values.smsOtpRegex &&
            !FormValidation.isLengthValid(values.smsOtpRegex as string, GovernanceConnectorConstants
                .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.SMS_OTP_REGEX_MAX_LENGTH)) {
            // Check for invalid input length.
            errors.smsOtpRegex = t("extensions:manage.serverConfigurations.accountRecovery." +
                "passwordRecovery.form.fields.smsOtpRegex.validations.maxLengthReached");
        }

        return errors;
    };

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const getUpdatedConfigurations = (values: Record<string, any>) => {
        const data: {
            "Recovery.ExpiryTime": any;
            "Recovery.Notification.Password.emailLink.Enable": boolean;
            "Recovery.Notification.Password.ExpiryTime.smsOtp": number;
            "Recovery.Notification.Password.smsOtp.Enable": boolean;
            "Recovery.Notification.Password.smsOtp.Regex": any;
            "Recovery.NotifySuccess": boolean;
        } = {
            "Recovery.ExpiryTime": values.expiryTime !== undefined
                ? values.expiryTime
                : initialConnectorValues?.expiryTime,
            "Recovery.Notification.Password.ExpiryTime.smsOtp": values.smsOtpExpiryTime !== undefined
                ? values.smsOtpExpiryTime
                : initialConnectorValues?.smsOtpExpiryTime,
            "Recovery.Notification.Password.emailLink.Enable": values.enableEmailBasedRecovery !== undefined
                ? !!values.enableEmailBasedRecovery
                : initialConnectorValues?.enableEmailBasedRecovery,
            "Recovery.Notification.Password.smsOtp.Enable": values.enableSMSBasedRecovery !== undefined
                ? !!values.enableSMSBasedRecovery
                : initialConnectorValues?.enableSMSBasedRecovery,
            "Recovery.Notification.Password.smsOtp.Regex": values.smsOtpRegex !== undefined
                ? values.smsOtpRegex
                : initialConnectorValues?.smsOtpRegex,
            "Recovery.NotifySuccess": values.notifySuccess !== undefined
                ? !!values.notifySuccess
                : initialConnectorValues?.notifySuccess,
        };

        return data;
    };

    if (!initialConnectorValues) {
        return null;
    }

    return (
        <div className={ "connector-form" }>
            <Form
                id={ FORM_ID }
                initialValues={ initialConnectorValues }
                onSubmit={ (values: Record<string, any>) => onSubmit(getUpdatedConfigurations(values)) }
                validate={ validateForm }
                uncontrolledForm={ false }
            >
                <Field.Checkbox
                    ariaLabel="enableSMSBasedRecovery"
                    name="enableSMSBasedRecovery"
                    label={ t("extensions:manage.serverConfigurations.accountRecovery." +
                        "passwordRecovery.form.fields.enableSMSBasedRecovery.label") }
                    required={ false }
                    readOnly={ readOnly }
                    width={ 10 }
                    disabled={ !isConnectorEnabled }
                    listen={ (value: boolean) => setIsSMSRecoveryEnabled(value) }
                    data-testid={ `${testId}-sms-based-recovery` }
                />
                <Hint className={ "mb-5" }>
                    {
                        t("extensions:manage.serverConfigurations.accountRecovery." +
                            "passwordRecovery.form.fields.enableSMSBasedRecovery.hint")
                    }
                </Hint>
                <Field.Input
                    className="ml-6"
                    ariaLabel="smsOtpExpiryTime"
                    inputType="number"
                    name="smsOtpExpiryTime"
                    min={
                        GovernanceConnectorConstants.PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS
                            .EXPIRY_TIME_MIN_VALUE
                    }
                    max={
                        GovernanceConnectorConstants.PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS
                            .SMS_OTP_EXPIRY_TIME_MAX_VALUE
                    }
                    label={ t("extensions:manage.serverConfigurations.accountRecovery." +
                        "passwordRecovery.form.fields.smsOtpExpiryTime.label") }
                    placeholder={ t("extensions:manage.serverConfigurations.accountRecovery." +
                        "passwordRecovery.form.fields.smsOtpExpiryTime.placeholder") }
                    required={ false }
                    maxLength={
                        GovernanceConnectorConstants
                            .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.SMS_OTP_EXPIRY_TIME_MAX_LENGTH
                    }
                    minLength={
                        GovernanceConnectorConstants
                            .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_LENGTH
                    }
                    readOnly={ readOnly }
                    width={ 10 }
                    labelPosition="right"
                    disabled={ !isSMSRecoveryEnabled }
                    data-testid={ `${testId}-sms-otp-expiry-time` }
                >
                    <input/>
                    <Label
                        content={ "mins" }
                    />
                </Field.Input>
                <Hint className={ "mb-5 ml-6" }>
                    {
                        t("extensions:manage.serverConfigurations.accountRecovery." +
                            "passwordRecovery.form.fields.smsOtpExpiryTime.hint")
                    }
                </Hint>
                <Field.Input
                    className="ml-6"
                    ariaLabel="smsOtpRegex"
                    inputType="default"
                    name="smsOtpRegex"
                    label={ t("extensions:manage.serverConfigurations.accountRecovery." +
                        "passwordRecovery.form.fields.smsOtpRegex.label") }
                    placeholder={ t("extensions:manage.serverConfigurations.accountRecovery." +
                        "passwordRecovery.form.fields.smsOtpRegex.placeholder") }
                    required={ false }
                    maxLength={
                        GovernanceConnectorConstants
                            .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.SMS_OTP_REGEX_MAX_LENGTH
                    }
                    minLength={
                        GovernanceConnectorConstants
                            .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.SMS_OTP_REGEX_MIN_LENGTH
                    }
                    readOnly={ readOnly }
                    width={ 10 }
                    disabled={ !isSMSRecoveryEnabled }
                    data-testid={ `${testId}-sms-otp-regex` }
                />
                <Hint className={ "mb-5 ml-6" }>
                    {
                        t("extensions:manage.serverConfigurations.accountRecovery." +
                            "passwordRecovery.form.fields.smsOtpRegex.hint")
                    }
                </Hint>
                <Field.Checkbox
                    ariaLabel="notifyRecoverySuccess"
                    name="notifySuccess"
                    label={ t("extensions:manage.serverConfigurations.accountRecovery." +
                        "passwordRecovery.form.fields.notifySuccess.label") }
                    required={ false }
                    readOnly={ readOnly }
                    width={ 10 }
                    disabled={ !isConnectorEnabled }
                    data-testid={ `${testId}-notify-success` }
                />
                <Hint className={ "mb-5" }>
                    {
                        t("extensions:manage.serverConfigurations.accountRecovery." +
                            "passwordRecovery.form.fields.notifySuccess.hint")
                    }
                </Hint>
                <Field.Input
                    ariaLabel="expiryTime"
                    inputType="number"
                    name="expiryTime"
                    min={
                        GovernanceConnectorConstants.PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS
                            .EXPIRY_TIME_MIN_VALUE
                    }
                    max={
                        GovernanceConnectorConstants.PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS
                            .EXPIRY_TIME_MAX_VALUE
                    }
                    label={ t("extensions:manage.serverConfigurations.accountRecovery." +
                        "passwordRecovery.form.fields.expiryTime.label") }
                    placeholder={ t("extensions:manage.serverConfigurations.accountRecovery." +
                        "passwordRecovery.form.fields.expiryTime.placeholder") }
                    required={ false }
                    maxLength={
                        GovernanceConnectorConstants
                            .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_LENGTH
                    }
                    minLength={
                        GovernanceConnectorConstants
                            .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_LENGTH
                    }
                    readOnly={ readOnly }
                    width={ 10 }
                    labelPosition="right"
                    disabled={ !isConnectorEnabled }
                    data-testid={ `${testId}-link-expiry-time` }
                >
                    <input/>
                    <Label
                        content={ "mins" }
                    />
                </Field.Input>
                <Hint className={ "mb-5" }>
                    {
                        t("extensions:manage.serverConfigurations.accountRecovery." +
                            "passwordRecovery.form.fields.expiryTime.hint")
                    }
                </Hint>
                <Field.Button
                    form={ FORM_ID }
                    size="small"
                    buttonType="primary_btn"
                    ariaLabel="Password Recovery update button"
                    name="update-button"
                    data-testid={ `${testId}-submit-button` }
                    disabled={ isSubmitting }
                    loading={ isSubmitting }
                    label={ t("common:update") }
                    hidden={ !isConnectorEnabled || readOnly }
                />
            </Form>
        </div>
    );
};

/**
 * Default props for the component.
 */
PasswordRecoveryConfigurationForm.defaultProps = {
    "data-testid": "password-recovery-edit-form"
};
