/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import Chip from "@oxygen-ui/react/Chip";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { FeatureStatusLabel } from "@wso2is/admin.feature-gate.v1/models/feature-status";
import {
    EmailRecoveryOption,
    PasswordRecoveryConfigurationFormPropsInterface,
    PasswordRecoveryFormConstants,
    PasswordRecoveryFormErrorValidationsInterface,
    PasswordRecoveryFormUpdatableConfigsInterface,
    PasswordRecoveryFormValuesInterface
} from "@wso2is/admin.server-configurations.v1";
import { CommonUtils } from "@wso2is/core/utils";
import { Field, Form } from "@wso2is/form";
import { RadioChild } from "@wso2is/forms";
import { Heading, Hint, Link, Message } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, Icon } from "semantic-ui-react";
import { GovernanceConnectorConstants } from "../../constants/governance-connector-constants";
import { ServerConfigurationsConstants } from "../../constants/server-configurations-constants";
import { ConnectorPropertyInterface } from "../../models/governance-connectors";
import "./password-recovery-form.scss";

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
        ["data-componentid"]: testId
    } = props;

    const { t } = useTranslation();

    const [ initialConnectorValues, setInitialConnectorValues ]
        = useState<PasswordRecoveryFormValuesInterface>(undefined);
    const [ isEmailRecoveryEnabled, setIsEmailRecoveryEnabled ] = useState<boolean>(false);
    const [ isSMSRecoveryEnabled, setIsSMSRecoveryEnabled ] = useState<boolean>(false);
    const [ isUpperCaseEnabled, setIsUpperCaseEnabled ] = useState<boolean>(false);
    const [ isLowerCaseEnabled, setIsLowerCaseEnabled ] = useState<boolean>(false);
    const [ isNumericEnabled, setIsNumericEnabled ] = useState<boolean>(false);
    const [ emailRecoveryOption, setEmailRecoveryOption ] = useState<string>(EmailRecoveryOption.EMAIL_LINK);

    const EMAIL_RECOVERY_RADIO_OPTIONS: RadioChild [] = [
        {
            label: "extensions:manage.serverConfigurations.accountRecovery." +
                    "passwordRecovery.form.fields.emailRecoveryOptions.emailLink.label",
            value: EmailRecoveryOption.EMAIL_LINK },
        {
            label: "extensions:manage.serverConfigurations.accountRecovery." +
                    "passwordRecovery.form.fields.emailRecoveryOptions.emailOtp.label",
            value: EmailRecoveryOption.EMAIL_OTP }
    ];

    const showSmsOtpPwdRecoveryFeatureStatusChip: boolean =
        useSelector((state: AppState) => state?.config?.ui?.showSmsOtpPwdRecoveryFeatureStatusChip);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {
        if (isEmpty(initialValues?.properties)) {
            return;
        }

        let resolvedInitialValues: PasswordRecoveryFormValuesInterface = null;

        initialValues.properties.map((property: ConnectorPropertyInterface) => {
            if (PasswordRecoveryFormConstants.allowedConnectorFields.includes(property?.name)) {
                switch (property.name) {
                    case ServerConfigurationsConstants.NOTIFY_SUCCESS:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            notifySuccess: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.RECOVERY_LINK_EXPIRY_TIME:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            expiryTime: property.value
                        };

                        break;
                    case ServerConfigurationsConstants.RECOVERY_EMAIL_OTP_ENABLE:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            enableEmailOtpBasedRecovery: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.RECOVERY_EMAIL_LINK_ENABLE:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            enableEmailLinkBasedRecovery: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.RECOVERY_SMS_OTP_ENABLE:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            enableSMSBasedRecovery: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.RECOVERY_SMS_EXPIRY_TIME:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            smsOtpExpiryTime: property.value
                        };

                        break;
                    case ServerConfigurationsConstants.RECOVERY_OTP_USE_UPPERCASE:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            passwordRecoveryOtpUseUppercase: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.RECOVERY_OTP_USE_LOWERCASE:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            passwordRecoveryOtpUseLowercase: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.RECOVERY_OTP_USE_NUMERIC:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            passwordRecoveryOtpUseNumeric: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.RECOVERY_OTP_LENGTH:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            smsOtpLength: property.value
                        };

                        break;
                    case ServerConfigurationsConstants.RECOVERY_MAX_RESEND_COUNT:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            maxResendCount: property.value
                        };

                        break;
                    case ServerConfigurationsConstants.RECOVERY_MAX_FAILED_ATTEMPTS_COUNT:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            maxFailedAttemptCount: property.value
                        };

                        break;
                    default:
                        // Invalid type is not handled since the form is generated based on the allowed fields.
                        break;
                }
            }
        });
        setInitialConnectorValues(resolvedInitialValues);
        setIsEmailRecoveryEnabled(resolvedInitialValues?.enableEmailLinkBasedRecovery ||
             resolvedInitialValues?.enableEmailOtpBasedRecovery);
        setEmailRecoveryOption(resolvedInitialValues?.enableEmailOtpBasedRecovery ?
            EmailRecoveryOption.EMAIL_OTP : EmailRecoveryOption.EMAIL_LINK);
        setIsSMSRecoveryEnabled(resolvedInitialValues?.enableSMSBasedRecovery);
        setIsUpperCaseEnabled(resolvedInitialValues?.passwordRecoveryOtpUseUppercase);
        setIsLowerCaseEnabled(resolvedInitialValues?.passwordRecoveryOtpUseLowercase);
        setIsNumericEnabled(resolvedInitialValues?.passwordRecoveryOtpUseNumeric);
    }, [ initialValues ]);

    /**
     * Validate input data.
     *
     * @param values - Form values.
     * @returns Form validation.
     */
    const validateForm = (values: PasswordRecoveryFormValuesInterface):
        PasswordRecoveryFormErrorValidationsInterface => {
        const errors: PasswordRecoveryFormErrorValidationsInterface = {
            expiryTime: undefined,
            maxFailedAttemptCount: undefined,
            maxResendCount: undefined,
            smsOtpExpiryTime: undefined,
            smsOtpLength: undefined
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
        } else if (!values.smsOtpLength) {
            // Check for required error
            errors.smsOtpLength = t("extensions:manage.serverConfigurations.accountRecovery." +
            "passwordRecovery.form.fields.passwordRecoveryOtpLength.validations.empty");
        } else if (parseInt(values.smsOtpLength, 10) < GovernanceConnectorConstants
            .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.SMS_OTP_CODE_LENGTH_MIN_VALUE ||
            parseInt(values.smsOtpLength, 10) > GovernanceConnectorConstants
                .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.SMS_OTP_CODE_LENGTH_MAX_VALUE) {
            // Check for invalid input length.
            errors.smsOtpLength = t("extensions:manage.serverConfigurations.accountRecovery." +
                "passwordRecovery.form.fields.passwordRecoveryOtpLength.validations.maxLengthReached");
        } else if (!values.maxResendCount) {
            // Check for required error
            errors.maxResendCount = t("extensions:manage.serverConfigurations.accountRecovery." +
            "passwordRecovery.form.fields.maxResendCount.validations.empty");
        } else if (parseInt(values.maxResendCount, 10) < GovernanceConnectorConstants
            .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.MAX_RESEND_COUNT_MIN_VALUE ||
            parseInt(values.maxResendCount, 10) > GovernanceConnectorConstants
                .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.MAX_RESEND_COUNT_MAX_VALUE) {
            // Check for invalid range.
            errors.maxResendCount = t("extensions:manage.serverConfigurations.accountRecovery." +
                "passwordRecovery.form.fields.maxResendCount.validations.range");
        } else if (!values.maxFailedAttemptCount) {
            // Check for required error
            errors.maxFailedAttemptCount = t("extensions:manage.serverConfigurations.accountRecovery." +
            "passwordRecovery.form.fields.maxFailedAttemptCount.validations.empty");
        } else if (parseInt(values.maxFailedAttemptCount, 10) < GovernanceConnectorConstants
            .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.MAX_FAILED_ATTEMPT_COUNT_MIN_VALUE ||
            parseInt(values.maxFailedAttemptCount, 10) > GovernanceConnectorConstants
                .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.MAX_FAILED_ATTEMPT_COUNT_MAX_VALUE) {
            // Check for invalid range.
            errors.maxFailedAttemptCount = t("extensions:manage.serverConfigurations.accountRecovery." +
                "passwordRecovery.form.fields.maxFailedAttemptCount.validations.range");
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

        const data: PasswordRecoveryFormUpdatableConfigsInterface = {
            "Recovery.ExpiryTime": values.expiryTime !== undefined
                ? values.expiryTime
                : initialConnectorValues?.expiryTime,
            "Recovery.Notification.Password.ExpiryTime.smsOtp": values.smsOtpExpiryTime !== undefined
                ? values.smsOtpExpiryTime
                : initialConnectorValues?.smsOtpExpiryTime,
            "Recovery.Notification.Password.MaxFailedAttempts": values.maxFailedAttemptCount !== undefined
                ? values.maxFailedAttemptCount
                : initialConnectorValues?.maxFailedAttemptCount,
            "Recovery.Notification.Password.MaxResendAttempts": values.maxResendCount !== undefined
                ? values.maxResendCount
                : initialConnectorValues?.maxResendCount,
            "Recovery.Notification.Password.OTP.OTPLength": values.smsOtpLength !== undefined
                ? values.smsOtpLength
                : initialConnectorValues?.smsOtpLength,
            "Recovery.Notification.Password.OTP.SendOTPInEmail": emailRecoveryOption !== undefined
                ? (emailRecoveryOption === EmailRecoveryOption.EMAIL_OTP && values.enableEmailBasedRecovery)
                : initialConnectorValues?.enableEmailOtpBasedRecovery,
            "Recovery.Notification.Password.OTP.UseLowercaseCharactersInOTP":
                values.passwordRecoveryOtpUseLowercase !== undefined
                    ? values.passwordRecoveryOtpUseLowercase
                    : initialConnectorValues?.passwordRecoveryOtpUseLowercase,
            "Recovery.Notification.Password.OTP.UseNumbersInOTP": values.passwordRecoveryOtpUseNumeric !== undefined
                ? values.passwordRecoveryOtpUseNumeric
                : initialConnectorValues?.passwordRecoveryOtpUseNumeric,
            "Recovery.Notification.Password.OTP.UseUppercaseCharactersInOTP":
                values.passwordRecoveryOtpUseUppercase !== undefined
                    ? values.passwordRecoveryOtpUseUppercase
                    : initialConnectorValues?.passwordRecoveryOtpUseUppercase,
            "Recovery.Notification.Password.emailLink.Enable": emailRecoveryOption !== undefined
                ? (emailRecoveryOption === EmailRecoveryOption.EMAIL_LINK && values.enableEmailBasedRecovery)
                : initialConnectorValues?.enableEmailLinkBasedRecovery,
            "Recovery.Notification.Password.smsOtp.Enable": values.enableSMSBasedRecovery !== undefined
                ? !!values.enableSMSBasedRecovery
                : initialConnectorValues?.enableSMSBasedRecovery,
            "Recovery.NotifySuccess": values.notifySuccess !== undefined
                ? !!values.notifySuccess
                : initialConnectorValues?.notifySuccess
        };

        return data;
    };

    if (!initialConnectorValues) {
        return null;
    }

    return (
        <div className="connector-form password-recovery-form">
            <Form
                id={ FORM_ID }
                initialValues={ initialConnectorValues }
                onSubmit={ (values: Record<string, any>) => onSubmit(getUpdatedConfigurations(values)) }
                validate={ validateForm }
                uncontrolledForm={ false }
            >
                <Heading as="h4">
                    { t("extensions:manage.serverConfigurations.accountRecovery." +
                            "passwordRecovery.recoveryOptionHeading") as ReactNode }
                </Heading>
                <Heading as="h5">
                    { t("extensions:manage.serverConfigurations.accountRecovery." +
                            "passwordRecovery.recoveryOptionSubHeadingEmail") as ReactNode }
                </Heading>
                <Field.Checkbox
                    ariaLabel="enableEmailBasedRecovery"
                    name="enableEmailBasedRecovery"
                    label={ t("extensions:manage.serverConfigurations.accountRecovery." +
                                "passwordRecovery.form.fields.enableEmailBasedRecovery.label") }
                    required={ false }
                    readOnly={ readOnly }
                    width={ 10 }
                    disabled={ !isConnectorEnabled }
                    defaultValue = { isEmailRecoveryEnabled }
                    listen={ (value: boolean) => setIsEmailRecoveryEnabled(value) }
                    data-testid={ `${ testId }-email-link-based-recovery` }
                    data-componentid={ `${ testId }-email-link-based-recovery` }
                />
                <Hint>
                    { t("extensions:manage.serverConfigurations.accountRecovery." +
                            "passwordRecovery.form.fields.enableEmailBasedRecovery.hint") as ReactNode }
                </Hint>

                <Heading as="h6">
                    { t("extensions:manage.serverConfigurations.accountRecovery." +
                    "passwordRecovery.form.fields.emailRecoveryOptions.header") as ReactNode }
                </Heading>
                {
                    EMAIL_RECOVERY_RADIO_OPTIONS.map((option: RadioChild) => (
                        <Field.Radio
                            key={ option.value }
                            ariaLabel={ t(option.label) }
                            label={ t(option.label) }
                            name={ "emailRecoveryOption" }
                            type="radio"
                            value={ option.value }
                            checked={ emailRecoveryOption === option.value }
                            listen={ () => setEmailRecoveryOption(option.value) }
                            disabled={ !isEmailRecoveryEnabled }
                            readOnly={ readOnly }
                        />
                    ))
                }
                <br/>

                <Field.Checkbox
                    ariaLabel="notifyRecoverySuccess"
                    name="notifySuccess"
                    label={ t("extensions:manage.serverConfigurations.accountRecovery." +
                        "passwordRecovery.form.fields.notifySuccess.label") }
                    required={ false }
                    readOnly={ readOnly }
                    width={ 10 }
                    disabled={ !isEmailRecoveryEnabled }
                    data-testid={ `${ testId }-notify-success` }
                    data-componentid={ `${ testId }-notify-success` }
                />

                <Hint>
                    { t("extensions:manage.serverConfigurations.accountRecovery." +
                            "passwordRecovery.form.fields.notifySuccess.hint") as ReactNode }
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
                    disabled={ !isEmailRecoveryEnabled }
                    data-testid={ `${ testId }-link-expiry-time` }
                    data-componentid={ `${ testId }-link-expiry-time` }
                >
                    <input/>
                    <label className="ui label">mins</label>
                </Field.Input>
                <Hint>
                    { t("extensions:manage.serverConfigurations.accountRecovery." +
                            "passwordRecovery.form.fields.expiryTime.hint") as ReactNode }
                </Hint>

                <Heading as="h5">
                    { t("extensions:manage.serverConfigurations.accountRecovery." +
                            "passwordRecovery.recoveryOptionSubHeadingSMS") as ReactNode }
                    {
                        showSmsOtpPwdRecoveryFeatureStatusChip &&
                        (<Chip
                            label={ t(FeatureStatusLabel.BETA) }
                            className="oxygen-menu-item-chip oxygen-chip-beta" />)
                    }
                </Heading>
                {
                    <Message info>
                        <Icon name="info circle" />
                        <Trans
                            i18nKey={
                                "extensions:manage.serverConfigurations.accountRecovery." +
                                "passwordRecovery.form.smsProviderWarning"
                            }
                        >
                            Ensure that an
                            <Link
                                external={ false }
                                onClick={ () => {
                                    history.push(
                                        AppConstants.getPaths().get("SMS_PROVIDER")
                                    );
                                } }
                            >SMS Provider
                            </Link>
                            &nbsp;is configured for the OTP feature to work properly.
                        </Trans>
                    </Message>
                }
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
                    data-testid={ `${ testId }-sms-based-recovery` }
                    data-componentid={ `${ testId }-sms-based-recovery` }
                />
                <Hint>
                    { t("extensions:manage.serverConfigurations.accountRecovery." +
                            "passwordRecovery.form.fields.enableSMSBasedRecovery.hint") as ReactNode }
                </Hint>
                <Field.Input
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
                    data-testid={ `${ testId }-sms-otp-expiry-time` }
                    data-componentid={ `${ testId }-sms-otp-expiry-time` }
                >
                    <input/>
                    <label className="ui label">mins</label>
                </Field.Input>
                <Hint>
                    { t("extensions:manage.serverConfigurations.accountRecovery." +
                            "passwordRecovery.form.fields.smsOtpExpiryTime.hint") as ReactNode }
                </Hint>
                <Divider/>
                <Heading as="h4">
                    { t("extensions:manage.serverConfigurations.accountRecovery." +
                            "passwordRecovery.otpConfigHeading") as ReactNode }
                    {
                        showSmsOtpPwdRecoveryFeatureStatusChip &&
                        (<Chip
                            label={ t(FeatureStatusLabel.BETA) }
                            className="oxygen-menu-item-chip oxygen-chip-beta" />)
                    }
                </Heading>
                <Field.Checkbox
                    ariaLabel="passwordRecoveryOtpUseUppercase"
                    name="passwordRecoveryOtpUseUppercase"
                    label= { t("extensions:manage.serverConfigurations.accountRecovery." +
                        "passwordRecovery.form.fields.passwordRecoveryOtpUseUppercase.label") }
                    required={ false }
                    readOnly={ readOnly }
                    width={ 10 }
                    // Disabling the last enabled option is not allowed
                    disabled={ !isConnectorEnabled
                        || (isUpperCaseEnabled && !isLowerCaseEnabled && !isNumericEnabled) }
                    listen={ (value: boolean) => setIsUpperCaseEnabled(value) }
                    data-testid={ `${ testId }-sms-otp-uppercase` }
                    data-componentid={ `${ testId }-sms-otp-uppercase` }
                />
                <Hint>
                    { t("extensions:manage.serverConfigurations.accountRecovery." +
                            "passwordRecovery.form.fields.passwordRecoveryOtpUseUppercase.hint") as ReactNode }
                </Hint>
                <Field.Checkbox
                    ariaLabel="passwordRecoveryOtpUseLowercase"
                    name="passwordRecoveryOtpUseLowercase"
                    label= { t("extensions:manage.serverConfigurations.accountRecovery." +
                    "passwordRecovery.form.fields.passwordRecoveryOtpUseLowercase.label") }
                    required={ false }
                    readOnly={ readOnly }
                    width={ 10 }
                    // Disabling the last enabled option is not allowed
                    disabled={ !isConnectorEnabled
                        || (!isUpperCaseEnabled && isLowerCaseEnabled && !isNumericEnabled) }
                    listen={ (value: boolean) => setIsLowerCaseEnabled(value) }
                    data-testid={ `${ testId }-sms-otp-lowercase` }
                    data-componentid={ `${ testId }-sms-otp-lowercase` }
                />
                <Hint>
                    { t("extensions:manage.serverConfigurations.accountRecovery." +
                            "passwordRecovery.form.fields.passwordRecoveryOtpUseLowercase.hint") as ReactNode }
                </Hint>
                <Field.Checkbox
                    ariaLabel="passwordRecoveryOtpUseNumeric"
                    name="passwordRecoveryOtpUseNumeric"
                    label= { t("extensions:manage.serverConfigurations.accountRecovery." +
                        "passwordRecovery.form.fields.passwordRecoveryOtpUseNumeric.label") }
                    required={ false }
                    readOnly={ readOnly }
                    width={ 10 }
                    // Disabling the last enabled option is not allowed
                    disabled={ !isConnectorEnabled
                        || (!isUpperCaseEnabled && !isLowerCaseEnabled && isNumericEnabled) }
                    listen={ (value: boolean) => setIsNumericEnabled(value) }
                    data-testid={ `${ testId }-sms-otp-numeric` }
                    data-componentid={ `${ testId }-sms-otp-numeric` }
                />
                <Hint>
                    { t("extensions:manage.serverConfigurations.accountRecovery." +
                            "passwordRecovery.form.fields.passwordRecoveryOtpUseNumeric.hint") as ReactNode }
                </Hint>
                <Field.Input
                    ariaLabel="otpLength"
                    inputType="number"
                    name="smsOtpLength"
                    min={
                        GovernanceConnectorConstants.PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS
                            .SMS_OTP_CODE_LENGTH_MIN_VALUE
                    }
                    max={
                        GovernanceConnectorConstants.PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS
                            .SMS_OTP_CODE_LENGTH_MAX_VALUE
                    }
                    label= { t("extensions:manage.serverConfigurations.accountRecovery." +
                                    "passwordRecovery.form.fields.passwordRecoveryOtpLength.label") }
                    placeholder="OTP Length"
                    required={ false }
                    maxLength={
                        GovernanceConnectorConstants
                            .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.SMS_OTP_CODE_LENGTH_MAX_LENGTH
                    }
                    minLength={
                        GovernanceConnectorConstants
                            .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.SMS_OTP_CODE_LENGTH_MIN_LENGTH
                    }
                    readOnly={ readOnly }
                    width={ 10 }
                    labelPosition="right"
                    disabled={ !isConnectorEnabled }
                    data-testid={ `${ testId }-otp-length` }
                    data-componentid={ `${ testId }-otp-length` }
                >
                    <input/>
                    <label className="ui label">characters</label>
                </Field.Input>
                <Hint>
                    { t("extensions:manage.serverConfigurations.accountRecovery." +
                            "passwordRecovery.form.fields.passwordRecoveryOtpLength.hint") as ReactNode }
                </Hint>
                <Divider/>
                <Heading as="h4">
                    { t("extensions:manage.serverConfigurations.accountRecovery." +
                            "passwordRecovery.failedAttemptConfigHeading") as ReactNode }
                    {
                        showSmsOtpPwdRecoveryFeatureStatusChip &&
                        (<Chip
                            label={ t(FeatureStatusLabel.BETA) }
                            className="oxygen-menu-item-chip oxygen-chip-beta" />)
                    }
                </Heading>
                <Field.Input
                    ariaLabel="maxFailedAttemptCount"
                    inputType="number"
                    name="maxFailedAttemptCount"
                    min={
                        GovernanceConnectorConstants.PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS
                            .MAX_FAILED_ATTEMPT_COUNT_MIN_VALUE
                    }
                    max={
                        GovernanceConnectorConstants.PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS
                            .MAX_FAILED_ATTEMPT_COUNT_MAX_VALUE
                    }
                    label={ t("extensions:manage.serverConfigurations.accountRecovery." +
                        "passwordRecovery.form.fields.maxFailedAttemptCount.label") }
                    placeholder={ t("extensions:manage.serverConfigurations.accountRecovery." +
                        "passwordRecovery.form.fields.maxFailedAttemptCount.placeholder") }
                    required={ false }
                    maxLength={
                        GovernanceConnectorConstants
                            .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.MAX_FAILED_ATTEMPT_COUNT_MAX_LENGTH
                    }
                    minLength={
                        GovernanceConnectorConstants
                            .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.MAX_FAILED_ATTEMPT_COUNT_MIN_LENGTH
                    }
                    readOnly={ readOnly }
                    width={ 10 }
                    labelPosition="right"
                    disabled={ !isConnectorEnabled }
                    data-testid={ `${ testId }-max-fail-attempt-count` }
                    data-componentid={ `${ testId }-max-fail-attempt-count` }
                >
                    <input/>
                    <label className="ui label">attempts</label>
                </Field.Input>
                <Hint>
                    { t("extensions:manage.serverConfigurations.accountRecovery." +
                            "passwordRecovery.form.fields.maxFailedAttemptCount.hint") as ReactNode }
                </Hint>
                <Field.Input
                    ariaLabel="maxResendCount"
                    inputType="number"
                    name="maxResendCount"
                    min={
                        GovernanceConnectorConstants.PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS
                            .MAX_RESEND_COUNT_MIN_VALUE
                    }
                    max={
                        GovernanceConnectorConstants.PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS
                            .MAX_RESEND_COUNT_MAX_VALUE
                    }
                    label={ t("extensions:manage.serverConfigurations.accountRecovery." +
                        "passwordRecovery.form.fields.maxResendCount.label") }
                    placeholder={ t("extensions:manage.serverConfigurations.accountRecovery." +
                        "passwordRecovery.form.fields.maxResendCount.placeholder") }
                    required={ false }
                    maxLength={
                        GovernanceConnectorConstants
                            .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.MAX_RESEND_COUNT_MAX_LENGTH
                    }
                    minLength={
                        GovernanceConnectorConstants
                            .PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS.MAX_RESEND_COUNT_MIN_LENGTH
                    }
                    readOnly={ readOnly }
                    width={ 10 }
                    labelPosition="right"
                    disabled={ !isConnectorEnabled }
                    data-testid={ `${ testId }-otp-resend-count` }
                    data-componentid={ `${ testId }-otp-resend-count` }
                >
                    <input/>
                    <label className="ui label">attempts</label>
                </Field.Input>
                <Hint>
                    { t("extensions:manage.serverConfigurations.accountRecovery." +
                            "passwordRecovery.form.fields.maxResendCount.hint") as ReactNode }
                </Hint>
                <Field.Button
                    form={ FORM_ID }
                    size="small"
                    buttonType="primary_btn"
                    ariaLabel="Password Recovery update button"
                    name="update-button"
                    data-testid={ `${ testId }-submit-button` }
                    data-componentid={ `${ testId }-submit-button` }
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
    "data-componentid": "password-recovery-edit-form"
};
