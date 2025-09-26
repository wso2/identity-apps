/**
 * Copyright (c) 2021-2025, WSO2 LLC. (https://www.wso2.com).
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
import { AppState } from "@wso2is/admin.core.v1/store";
import { FeatureStatusLabel } from "@wso2is/admin.feature-gate.v1/models/feature-status";
import {
    AskPasswordFormConstants,
    ConnectorPropertyInterface,
    GovernanceConnectorConstants,
    GovernanceConnectorInterface,
    ServerConfigurationsConstants
} from "@wso2is/admin.server-configurations.v1";
import {
    AskPasswordFormErrorValidationsInterface,
    AskPasswordFormUpdatableConfigsInterface,
    AskPasswordFormValuesInterface,
    VerificationOption
} from "@wso2is/admin.server-configurations.v1/models/ask-password";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { CommonUtils } from "@wso2is/core/utils";
import { Field, Form } from "@wso2is/form";
import { RadioChild } from "@wso2is/forms";
import { Heading } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider } from "semantic-ui-react";

import "./ask-password-configurations.scss";
import useAskPasswordFlowBuilder from "../../../../hooks/use-ask-password-flow-builder";

const FORM_ID: string = "governance-connectors-ask-password-form";

/**
 * Proptypes for the Ask Password Form props interface.
 */
export interface AskPasswordConfigurationsPropsInterface extends IdentifiableComponentInterface {
    /**
     * Connector's initial values.
     */
    initialValues: GovernanceConnectorInterface;
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

/**
 * Ask Password Configuration Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const AskPasswordConfigurations: FunctionComponent<AskPasswordConfigurationsPropsInterface> = (
    props: AskPasswordConfigurationsPropsInterface
): ReactElement => {

    const {
        initialValues,
        readOnly,
        ["data-componentid"]: componentId = "ask-password-edit-form"
    } = props;

    const { t } = useTranslation();

    const {
        setIsInvitedUserRegistrationConfigUpdated,
        setInvitedUserRegistrationConfig
    } = useAskPasswordFlowBuilder();

    const [ initialConnectorValues, setInitialConnectorValues ]
        = useState<AskPasswordFormValuesInterface>(undefined);
    const [ isInviteUserToSetPasswordEnabled, setIsInviteUserToSetPasswordEnabled ]= useState<boolean>(false);
    const [ isUpperCaseEnabled, setIsUpperCaseEnabled ] = useState<boolean>(false);
    const [ isLowerCaseEnabled, setIsLowerCaseEnabled ] = useState<boolean>(false);
    const [ isNumericEnabled, setIsNumericEnabled ] = useState<boolean>(false);
    const [ askPasswordOption, setAskPasswordOption ] = useState<string>(VerificationOption.EMAIL_LINK);
    const [ expiryTime, setExpiryTime ] = useState<string>("");
    const [ otpLength, setOtpLength ] = useState<string>("");
    const [ enableAccountActivationEmail, setEnableAccountActivationEmail ] = useState<boolean>(false);
    const [ enableAccountLockOnCreation, setEnableAccountLockOnCreation ] = useState<boolean>(false);
    const [ updatedConfigs, setUpdatedConfigs ] = useState<AskPasswordFormUpdatableConfigsInterface>(undefined);

    const showSmsOtpAskPasswordFeatureStatusChip: boolean =
            useSelector((state: AppState) => state?.config?.ui?.showSmsOtpAskPasswordFeatureStatusChip);

    /* Radio options for ask password */
    const EMAIL_ASK_PASSWORD_RADIO_OPTIONS: RadioChild[] = [
        {
            label: "extensions:manage.serverConfigurations.userOnboarding." +
                    "inviteUserToSetPassword.form.fields.emailAskPasswordOptions.emailLink.label",
            value: VerificationOption.EMAIL_LINK
        },
        {
            label: "extensions:manage.serverConfigurations.userOnboarding." +
                    "inviteUserToSetPassword.form.fields.emailAskPasswordOptions.emailOtp.label",
            value: VerificationOption.EMAIL_OTP
        },
        {
            label: "extensions:manage.serverConfigurations.userOnboarding." +
                    "inviteUserToSetPassword.form.fields.emailAskPasswordOptions.smsOtp.label",
            value: VerificationOption.SMS_OTP
        }
    ];

    /* Update states when initial values change
    *
    */
    useEffect(() => {
        if (!initialConnectorValues) return;
        setIsInviteUserToSetPasswordEnabled(initialConnectorValues.enableInviteUserToSetPassword ?? false);
        setIsUpperCaseEnabled(initialConnectorValues.otpUseUppercase ?? false);
        setIsLowerCaseEnabled(initialConnectorValues.otpUseLowercase ?? false);
        setIsNumericEnabled(initialConnectorValues.otpUseNumeric ?? false);
        setExpiryTime(initialConnectorValues.expiryTime ?? "");
        setOtpLength(initialConnectorValues.otpLength ?? "");
        setEnableAccountActivationEmail(initialConnectorValues.enableAccountActivationEmail ?? false);
        setEnableAccountLockOnCreation(initialConnectorValues.enableAccountLockOnCreation ?? false);

        if (initialConnectorValues.enableSmsOtp) {
            setAskPasswordOption(VerificationOption.SMS_OTP);
        } else if (initialConnectorValues.enableEmailOtp) {
            setAskPasswordOption(VerificationOption.EMAIL_OTP);
        } else {
            setAskPasswordOption(VerificationOption.EMAIL_LINK);
        }
    }, [ initialConnectorValues ]);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const getUpdatedConfigurations = (values: Record<string, any>) => {

        const data: AskPasswordFormUpdatableConfigsInterface = {
            "EmailVerification.AskPassword.AccountActivation": values.enableAccountActivationEmail !== undefined
                ? values.enableAccountActivationEmail
                : initialConnectorValues?.enableAccountActivationEmail,
            "EmailVerification.AskPassword.EmailOTP": askPasswordOption === VerificationOption.EMAIL_OTP,
            "EmailVerification.AskPassword.ExpiryTime": values.expiryTime !== undefined
                ? values.expiryTime
                : initialConnectorValues?.expiryTime,
            "EmailVerification.AskPassword.SMSOTP": askPasswordOption === VerificationOption.SMS_OTP,
            "EmailVerification.Enable": values.enableInviteUserToSetPassword !== undefined
                ? values.enableInviteUserToSetPassword
                : initialConnectorValues?.enableInviteUserToSetPassword,
            "EmailVerification.LockOnCreation": values.enableAccountLockOnCreation !== undefined
                ? values.enableAccountLockOnCreation
                : initialConnectorValues?.enableAccountLockOnCreation,
            "EmailVerification.OTP.OTPLength": values.otpLength !== undefined
                ? values.otpLength
                : initialConnectorValues?.otpLength,
            "EmailVerification.OTP.UseLowercaseCharactersInOTP": values.otpUseLowercase !== undefined
                ? values.otpUseLowercase
                : initialConnectorValues?.otpUseLowercase,
            "EmailVerification.OTP.UseNumbersInOTP": values.otpUseNumeric !== undefined
                ? values.otpUseNumeric
                : initialConnectorValues?.otpUseNumeric,
            "EmailVerification.OTP.UseUppercaseCharactersInOTP": values.otpUseUppercase !== undefined
                ? values.otpUseUppercase
                : initialConnectorValues?.otpUseUppercase
        };

        return data;
    };

    /*
    * Update updatedConfigs whenever any field changes
    *
    */
    useEffect(() => {
        setUpdatedConfigs(getUpdatedConfigurations({
            enableAccountActivationEmail: enableAccountActivationEmail,
            enableAccountLockOnCreation: enableAccountLockOnCreation,
            enableInviteUserToSetPassword: isInviteUserToSetPasswordEnabled,
            expiryTime: expiryTime,
            otpLength: otpLength,
            otpUseLowercase: isLowerCaseEnabled,
            otpUseNumeric: isNumericEnabled,
            otpUseUppercase: isUpperCaseEnabled
        }));
    }, [
        isInviteUserToSetPasswordEnabled,
        isUpperCaseEnabled,
        isLowerCaseEnabled,
        isNumericEnabled,
        expiryTime,
        otpLength,
        enableAccountActivationEmail,
        enableAccountLockOnCreation,
        askPasswordOption
    ]);

    /**
     * Handles form value changes.
     *
     */
    useEffect(() => {

        setInvitedUserRegistrationConfig(updatedConfigs);
        setIsInvitedUserRegistrationConfigUpdated(true);
    }, [
        updatedConfigs
    ]);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {
        if (isEmpty(initialValues?.properties)) {
            return;
        }

        let resolvedInitialValues: AskPasswordFormValuesInterface = null;

        initialValues.properties.map((property: ConnectorPropertyInterface) => {
            if (AskPasswordFormConstants.allowedConnectorFields.includes(property?.name)) {
                switch (property.name) {
                    case ServerConfigurationsConstants.ASK_PASSWORD_ENABLE:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            enableInviteUserToSetPassword: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_LOCK_ON_CREATION:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            enableAccountLockOnCreation: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_ACCOUNT_ACTIVATION:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            enableAccountActivationEmail: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_OTP_EXPIRY_TIME:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            expiryTime: property.value
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_EMAIL_OTP:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            enableEmailOtp: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_SMS_OTP:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            enableSmsOtp: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_OTP_USE_LOWERCASE:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            otpUseLowercase: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_OTP_USE_NUMERIC:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            otpUseNumeric: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_OTP_USE_UPPERCASE:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            otpUseUppercase: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_OTP_LENGTH:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            otpLength: property.value
                        };

                        break;
                    default:
                        // Invalid type is not handled since the form is generated based on the allowed fields.
                        break;
                }
            }
        });
        setInitialConnectorValues(resolvedInitialValues);
        setIsInviteUserToSetPasswordEnabled(resolvedInitialValues?.enableInviteUserToSetPassword);
        setIsUpperCaseEnabled(resolvedInitialValues?.otpUseUppercase);
        setIsLowerCaseEnabled(resolvedInitialValues?.otpUseLowercase);
        setIsNumericEnabled(resolvedInitialValues?.otpUseNumeric);
        if (resolvedInitialValues?.enableSmsOtp) {
            setAskPasswordOption(VerificationOption.SMS_OTP);
        } else if (resolvedInitialValues?.enableEmailOtp) {
            setAskPasswordOption(VerificationOption.EMAIL_OTP);
        } else {
            setAskPasswordOption(VerificationOption.EMAIL_LINK);
        }
    }, [ initialValues ]);

    /**
     * Validate input data.
     *
     * @param values - Form values.
     * @returns Form validation.
     */
    const validateForm = (values: AskPasswordFormValuesInterface):
        AskPasswordFormErrorValidationsInterface => {
        const errors: AskPasswordFormErrorValidationsInterface = {
            expiryTime: undefined,
            otpLength: undefined
        };

        if (!values.expiryTime && values.expiryTime !== "0" && values.expiryTime !== "-1") {
            // Check for required error.
            errors.expiryTime = t("extensions:manage.serverConfigurations.userOnboarding." +
                "inviteUserToSetPassword.form.fields.expiryTime.validations.empty");
        } else if (!FormValidation.isInteger(values.expiryTime as unknown as number)) {
            // Check for invalid input.
            errors.expiryTime = t("extensions:manage.serverConfigurations.userOnboarding." +
                "inviteUserToSetPassword.form.fields.expiryTime.validations.invalid");
        } else {
            const expiryTimeValue: number = parseInt(values.expiryTime, 10);

            // Allow -1 for indefinite expiry, 0 for immediate expiry, or values within the normal range
            if (expiryTimeValue !== -1 && expiryTimeValue !== 0 &&
                (expiryTimeValue < 1 || expiryTimeValue > GovernanceConnectorConstants
                    .ASK_PASSWORD_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_VALUE)) {
                // Check for invalid range.
                errors.expiryTime = t("extensions:manage.serverConfigurations.userOnboarding." +
                    "inviteUserToSetPassword.form.fields.expiryTime.validations.range");
            }
        }

        if (!values.otpLength) {
            // Check for required error.
            errors.otpLength = t("extensions:manage.serverConfigurations.userOnboarding." +
                "inviteUserToSetPassword.form.fields.askPasswordOtpLength.validations.empty");
        } else if (!FormValidation.isInteger(values.otpLength as unknown as number)) {
            // Check for invalid input.
            errors.otpLength = t("extensions:manage.serverConfigurations.userOnboarding." +
                "inviteUserToSetPassword.form.fields.askPasswordOtpLength.validations.invalid");
        } else if ((parseInt(values.otpLength, 10) < 4) || (parseInt(values.otpLength, 10) > 10)) {
            // Check for invalid range.
            errors.otpLength = t("extensions:manage.serverConfigurations.userOnboarding." +
                "inviteUserToSetPassword.form.fields.askPasswordOtpLength.validations.range");
        }

        return errors;
    };

    if (!initialConnectorValues) {
        return null;
    }

    return (
        <div className="connector-form ask-password-configurations">
            <Form
                id={ FORM_ID }
                initialValues={ initialConnectorValues }
                validate={ validateForm }
                uncontrolledForm={ false }
                onSubmit={ () => null }
            >
                <Heading as="h4">
                    { t("extensions:manage.serverConfigurations.userOnboarding." +
                            "inviteUserToSetPassword.subHeading") }
                </Heading>
                <Heading as="h5">
                    { t("extensions:manage.serverConfigurations.userOnboarding." +
                    "inviteUserToSetPassword.form.fields.emailAskPasswordOptions.header") }
                </Heading>
                {
                    EMAIL_ASK_PASSWORD_RADIO_OPTIONS.map((option: RadioChild) => (
                        <Field.Radio
                            key={ option.value }
                            ariaLabel={ t(option.label) }
                            label={ t(option.label) }
                            name="askPasswordOption"
                            type="radio"
                            value={ option.value }
                            checked={ askPasswordOption === option.value }
                            listen={ () => setAskPasswordOption(option.value) }
                            disabled={ !isInviteUserToSetPasswordEnabled }
                            readOnly={ readOnly }
                            data-componentid={ `${ componentId }-ask-password-option-${ option.value }` }
                        />
                    ))
                }
                <br/>
                <Field.Input
                    ariaLabel="expiryTime"
                    inputType="number"
                    name="expiryTime"
                    value={ expiryTime }
                    listen={ (value: string) => setExpiryTime(value) }
                    min={ -1 }
                    max={
                        GovernanceConnectorConstants.ASK_PASSWORD_FORM_FIELD_CONSTRAINTS
                            .EXPIRY_TIME_MAX_VALUE
                    }
                    label={ t("extensions:manage.serverConfigurations.userOnboarding." +
                                "inviteUserToSetPassword.form.fields.expiryTime.label") }
                    placeholder={ t("extensions:manage.serverConfigurations.userOnboarding." +
                                        "inviteUserToSetPassword.form.fields.expiryTime.placeholder") +
                                        " (-1: indefinite, 0: immediate)" }
                    required={ false }
                    maxLength={
                        GovernanceConnectorConstants.ASK_PASSWORD_FORM_FIELD_CONSTRAINTS
                            .EXPIRY_TIME_MAX_LENGTH
                    }
                    minLength={
                        GovernanceConnectorConstants.ASK_PASSWORD_FORM_FIELD_CONSTRAINTS
                            .EXPIRY_TIME_MIN_LENGTH
                    }
                    readOnly={ readOnly }
                    width={ 10 }
                    labelPosition="right"
                    disabled={ !isInviteUserToSetPasswordEnabled }
                    data-componentid={ `${ componentId }-link-expiry-time` }
                >
                    <input/>
                    <label className="ui label">mins</label>
                </Field.Input>
                <br/>
                <Field.Checkbox
                    ariaLabel="enableAccountActivationEmail"
                    name="enableAccountActivationEmail"
                    checked={ enableAccountActivationEmail }
                    listen={ (value: boolean) => setEnableAccountActivationEmail(value) }
                    label={ t("extensions:manage.serverConfigurations.userOnboarding." +
                        "inviteUserToSetPassword.form.fields.enableAccountActivationEmail.label") }
                    required={ false }
                    readOnly={ readOnly }
                    width={ 10 }
                    disabled={ !isInviteUserToSetPasswordEnabled }
                    data-componentid={ `${ componentId }-account-activation-email` }
                />
                <br/>
                <Field.Checkbox
                    ariaLabel="enableAccountLockOnCreation"
                    name="enableAccountLockOnCreation"
                    checked={ enableAccountLockOnCreation }
                    listen={ (value: boolean) => setEnableAccountLockOnCreation(value) }
                    label={ t("extensions:manage.serverConfigurations.userOnboarding." +
                        "inviteUserToSetPassword.form.fields.enableAccountLockOnCreation.label") }
                    required={ false }
                    readOnly={ readOnly }
                    width={ 10 }
                    disabled={ !isInviteUserToSetPasswordEnabled }
                    data-componentid={ `${ componentId }-account-lock-on-creation` }
                />
                <Divider/>
                <Heading as="h5">
                    { t("extensions:manage.serverConfigurations.userOnboarding." +
                            "inviteUserToSetPassword.otpConfigHeading") as ReactNode }
                    {
                        showSmsOtpAskPasswordFeatureStatusChip &&
                        (<Chip
                            label={ t(FeatureStatusLabel.BETA) }
                            className="oxygen-menu-item-chip oxygen-chip-beta" />)
                    }
                </Heading>
                <Field.Checkbox
                    ariaLabel="otpUseUppercase"
                    name="otpUseUppercase"
                    label= { t("extensions:manage.serverConfigurations.userOnboarding." +
                        "inviteUserToSetPassword.form.fields.askPasswordOtpUseUppercase.label") }
                    required={ false }
                    readOnly={ readOnly }
                    width={ 10 }
                    // Disabling the last enabled option is not allowed
                    disabled={ !isInviteUserToSetPasswordEnabled
                        || (isUpperCaseEnabled && !isLowerCaseEnabled && !isNumericEnabled)
                        || askPasswordOption === VerificationOption.EMAIL_LINK }
                    listen={ (value: boolean) => setIsUpperCaseEnabled(value) }
                    data-componentid={ `${ componentId }-sms-otp-uppercase` }
                />
                <br/>
                <Field.Checkbox
                    ariaLabel="otpUseLowercase"
                    name="otpUseLowercase"
                    label= { t("extensions:manage.serverConfigurations.userOnboarding." +
                    "inviteUserToSetPassword.form.fields.askPasswordOtpUseLowercase.label") }
                    required={ false }
                    readOnly={ readOnly }
                    width={ 10 }
                    // Disabling the last enabled option is not allowed
                    disabled={ !isInviteUserToSetPasswordEnabled
                        || (!isUpperCaseEnabled && isLowerCaseEnabled && !isNumericEnabled)
                        || askPasswordOption === VerificationOption.EMAIL_LINK }
                    listen={ (value: boolean) => setIsLowerCaseEnabled(value) }
                    data-componentid={ `${ componentId }-sms-otp-lowercase` }
                />
                <br/>
                <Field.Checkbox
                    ariaLabel="otpUseNumeric"
                    name="otpUseNumeric"
                    label= { t("extensions:manage.serverConfigurations.userOnboarding." +
                        "inviteUserToSetPassword.form.fields.askPasswordOtpUseNumeric.label") }
                    required={ false }
                    readOnly={ readOnly }
                    width={ 10 }
                    // Disabling the last enabled option is not allowed
                    disabled={ !isInviteUserToSetPasswordEnabled
                        || (!isUpperCaseEnabled && !isLowerCaseEnabled && isNumericEnabled)
                        || askPasswordOption === VerificationOption.EMAIL_LINK }
                    listen={ (value: boolean) => setIsNumericEnabled(value) }
                    data-componentid={ `${ componentId }-sms-otp-numeric` }
                />
                <br/>
                <Field.Input
                    ariaLabel="otpLength"
                    inputType="number"
                    name="otpLength"
                    value={ otpLength }
                    listen={ (value: string) => setOtpLength(value) }
                    min={
                        GovernanceConnectorConstants.ASK_PASSWORD_FORM_FIELD_CONSTRAINTS
                            .OTP_CODE_LENGTH_MIN_VALUE
                    }
                    max={
                        GovernanceConnectorConstants.ASK_PASSWORD_FORM_FIELD_CONSTRAINTS
                            .OTP_CODE_LENGTH_MAX_VALUE
                    }
                    label= { t("extensions:manage.serverConfigurations.userOnboarding." +
                                    "inviteUserToSetPassword.form.fields.askPasswordOtpLength.label") }
                    placeholder="OTP Length"
                    required={ false }
                    maxLength={
                        GovernanceConnectorConstants
                            .ASK_PASSWORD_FORM_FIELD_CONSTRAINTS.OTP_CODE_LENGTH_MAX_LENGTH
                    }
                    minLength={
                        GovernanceConnectorConstants
                            .ASK_PASSWORD_FORM_FIELD_CONSTRAINTS.OTP_CODE_LENGTH_MIN_LENGTH
                    }
                    readOnly={ readOnly }
                    width={ 10 }
                    labelPosition="right"
                    disabled={ !isInviteUserToSetPasswordEnabled
                        || askPasswordOption === VerificationOption.EMAIL_LINK }
                    data-componentid={ `${ componentId }-otp-length` }
                >
                    <input/>
                    <label className="ui label">characters</label>
                </Field.Input>
            </Form>
        </div>
    );

};
