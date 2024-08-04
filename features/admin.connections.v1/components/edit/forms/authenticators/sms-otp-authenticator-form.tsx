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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import { Code } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import isBoolean from "lodash-es/isBoolean";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Label } from "semantic-ui-react";
import { AuthenticatorManagementConstants } from "../../../../constants/autheticator-constants";
import { ConnectionUIConstants } from "../../../../constants/connection-ui-constants";
import {
    CommonAuthenticatorFormFieldInterface,
    CommonAuthenticatorFormFieldMetaInterface,
    CommonAuthenticatorFormInitialValuesInterface,
    CommonAuthenticatorFormMetaInterface,
    CommonAuthenticatorFormPropertyInterface
} from "../../../../models/authenticators";
import {
    CommonPluggableComponentMetaPropertyInterface,
    CommonPluggableComponentPropertyInterface
} from "../../../../models/connection";

/**
 * Interface for SMS OTP Authenticator Form props.
 */
interface SMSOTPAuthenticatorFormPropsInterface extends TestableComponentInterface {
    /**
     * SMS OTP Authenticator metadata.
     */
    metadata: CommonAuthenticatorFormMetaInterface;
    /**
     * SMS OTP Authenticator configured initial values.
     */
    initialValues: CommonAuthenticatorFormInitialValuesInterface;
    /**
     * Callback for form submit.
     * @param values - Resolved Form Values.
     */
    onSubmit: (values: CommonAuthenticatorFormInitialValuesInterface) => void;
    /**
     * Is readonly.
     */
    readOnly?: boolean;
    /**
     * Flag to trigger form submit externally.
     */
    triggerSubmit: boolean;
    /**
     * Flag to enable/disable form submit button.
     */
    enableSubmitButton: boolean;
    /**
     * Flag to show/hide custom properties.
     * @remarks Not implemented ATM. Do this when needed.
     */
    showCustomProperties: boolean;
    /**
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
}

/**
 * Form initial values interface.
 */
interface SMSOTPAuthenticatorFormInitialValuesInterface {
    /**
     * SMS OTP expiry time in seconds.
     */
    SmsOTP_ExpiryTime: number;
    /**
     * Number of characters in the OTP token.
     */
    SmsOTP_OTPLength: string;
    /**
     * Allow OTP token to have 0-9 characters only.
     */
    SmsOTP_OtpRegex_UseNumericChars: boolean;
    /**
     * Number of SMS OTP resend attempts
     */
    SmsOTP_ResendAttemptsCount: number;
}

/**
 * Form fields interface.
 */
interface SMSOTPAuthenticatorFormFieldsInterface {
    /**
     * SMS OTP expiry time field.
     */
    SmsOTP_ExpiryTime: CommonAuthenticatorFormFieldInterface;
    /**
     * Number of characters in the OTP token field.
     */
    SmsOTP_OTPLength: CommonAuthenticatorFormFieldInterface;
    /**
     * Allow OTP token to have 0-9 characters only field.
     */
    SmsOTP_OtpRegex_UseNumericChars: CommonAuthenticatorFormFieldInterface;
    /**
     * Number of SMS OTP resend attempts
     */
    SmsOTP_ResendAttemptsCount: CommonAuthenticatorFormFieldInterface;
}

/**
 * Proptypes for the SMS OTP Authenticator Form error messages.
 */
export interface SMSOTPAuthenticatorFormErrorValidationsInterface {
    /**
     * SMS OTP expiry time field.
     */
    SmsOTP_ExpiryTime: string;
    /**
     * Number of characters in the OTP token field.
     */
    SmsOTP_OTPLength: string;
    /**
     * Allow OTP token to have 0-9 characters only field.
     */
    SmsOTP_OtpRegex_UseNumericChars: string;
    /**
     * Number of SMS OTP resend attempts
     */
    SmsOTP_ResendAttemptsCount: string;
}

const FORM_ID: string = "sms-otp-authenticator-form";

/**
 * SMS OTP Authenticator Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const SMSOTPAuthenticatorForm: FunctionComponent<SMSOTPAuthenticatorFormPropsInterface> = (
    props: SMSOTPAuthenticatorFormPropsInterface
): ReactElement => {

    const {
        metadata,
        initialValues: originalInitialValues,
        onSubmit,
        readOnly,
        isSubmitting,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    // This can be used when `meta` support is there.
    const [ , setFormFields ] = useState<SMSOTPAuthenticatorFormFieldsInterface>(undefined);
    const [ initialValues, setInitialValues ] = useState<SMSOTPAuthenticatorFormInitialValuesInterface>(undefined);

    // SMS OTP length unit is set to digits or characters according to the state of this variable
    const [ isOTPNumeric, setIsOTPNumeric ] = useState<boolean>();

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {

        if (isEmpty(originalInitialValues?.properties)) {
            return;
        }

        let resolvedFormFields: SMSOTPAuthenticatorFormFieldsInterface = null;
        let resolvedInitialValues: SMSOTPAuthenticatorFormInitialValuesInterface = null;

        originalInitialValues.properties.forEach((value: CommonAuthenticatorFormPropertyInterface) => {
            const meta: CommonAuthenticatorFormFieldMetaInterface = metadata?.properties
                .find((meta: CommonPluggableComponentMetaPropertyInterface) => meta.key === value.key);

            const moderatedName: string = value.name.replace(/\./g, "_");

            // Converting expiry time from seconds to minutes
            if(moderatedName === AuthenticatorManagementConstants.AUTHENTICATOR_INIT_VALUES_SMS_OTP_EXPIRY_TIME_KEY){
                const expiryTimeInMinutes: number = Math.round(parseInt(value.value,10) / 60);

                resolvedInitialValues = {
                    ...resolvedInitialValues,
                    [moderatedName]: expiryTimeInMinutes
                };
                resolvedFormFields = {
                    ...resolvedFormFields,
                    [moderatedName]: {
                        meta,
                        value: expiryTimeInMinutes.toString()
                    }
                };
            } else {
                resolvedFormFields = {
                    ...resolvedFormFields,
                    [moderatedName]: {
                        meta,
                        value: (value.value === "true" || value.value === "false")
                            ? JSON.parse(value.value)
                            : value.value
                    }
                };

                resolvedInitialValues = {
                    ...resolvedInitialValues,
                    [moderatedName]: (value.value === "true" || value.value === "false")
                        ? JSON.parse(value.value)
                        : value.value
                };
            }
        });

        setIsOTPNumeric(resolvedInitialValues.SmsOTP_OtpRegex_UseNumericChars);
        setFormFields(resolvedFormFields);
        setInitialValues(resolvedInitialValues);
    }, [ originalInitialValues ]);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const getUpdatedConfigurations = (values: SMSOTPAuthenticatorFormInitialValuesInterface)
        : CommonAuthenticatorFormInitialValuesInterface => {

        const properties: CommonPluggableComponentPropertyInterface[] = [];

        for (const [ name, value ] of Object.entries(values)) {
            if (name !== undefined) {
                const moderatedName: string = name.replace(/_/g, ".");

                if (name === AuthenticatorManagementConstants.AUTHENTICATOR_INIT_VALUES_SMS_OTP_EXPIRY_TIME_KEY){
                    const timeInSeconds: number = value * 60;

                    properties.push({
                        name: moderatedName,
                        value: timeInSeconds.toString()
                    });

                    continue;
                }

                properties.push({
                    name: moderatedName,
                    value: isBoolean(value) ? value.toString() : value
                });
            }
        }

        return {
            ...originalInitialValues,
            properties
        };
    };

    /**
     * Validates the Form.
     *
     * @param values - Form Values.
     * @returns Form validation
     */
    const validateForm = (values: SMSOTPAuthenticatorFormInitialValuesInterface):
        SMSOTPAuthenticatorFormErrorValidationsInterface => {

        const errors: SMSOTPAuthenticatorFormErrorValidationsInterface = {
            SmsOTP_ExpiryTime: undefined,
            SmsOTP_OTPLength: undefined,
            SmsOTP_OtpRegex_UseNumericChars: undefined,
            SmsOTP_ResendAttemptsCount: undefined
        };

        if (!values.SmsOTP_ExpiryTime) {
            // Check for required error.
            errors.SmsOTP_ExpiryTime = t("authenticationProvider:forms" +
                ".authenticatorSettings.smsOTP.expiryTime.validations.required");
        } else if (!FormValidation.isInteger(values.SmsOTP_ExpiryTime as unknown as number)) {
            // Check for invalid input.
            errors.SmsOTP_ExpiryTime = t("authenticationProvider:forms" +
                ".authenticatorSettings.smsOTP.expiryTime.validations.invalid");
        } else if ((values.SmsOTP_ExpiryTime < ConnectionUIConstants
            .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_VALUE)
        || (values.SmsOTP_ExpiryTime > ConnectionUIConstants
            .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_VALUE)) {
            // Check for invalid range.
            errors.SmsOTP_ExpiryTime = t("authenticationProvider:forms" +
                ".authenticatorSettings.smsOTP.expiryTime.validations.range");
        }

        if (!values.SmsOTP_OTPLength) {
            // Check for required error.
            errors.SmsOTP_OTPLength = t("authenticationProvider:forms" +
                ".authenticatorSettings.smsOTP.tokenLength.validations.required");
        } else if (!FormValidation.isInteger(values.SmsOTP_OTPLength as unknown as number)) {
            // Check for invalid input.
            errors.SmsOTP_OTPLength = t("authenticationProvider:forms" +
                ".authenticatorSettings.smsOTP.tokenLength.validations.invalid");
        } else if ((parseInt(values.SmsOTP_OTPLength, 10) < ConnectionUIConstants
            .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.OTP_LENGTH_MIN_VALUE)
            || (parseInt(values.SmsOTP_OTPLength, 10) > ConnectionUIConstants
                .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.OTP_LENGTH_MAX_VALUE)) {
            // Check for invalid range.
            errors.SmsOTP_OTPLength = t("authenticationProvider:forms" +
                `.authenticatorSettings.smsOTP.tokenLength.validations.range.${isOTPNumeric? "digits" : "characters"}`);
        }

        if (!values.SmsOTP_ResendAttemptsCount) {
            // Check for required error.
            errors.SmsOTP_ResendAttemptsCount = t("authenticationProvider:forms" +
                ".authenticatorSettings.smsOTP.allowedResendAttemptCount.validations.required");
        } else if (!FormValidation.isInteger(values.SmsOTP_ResendAttemptsCount as unknown as number)) {
            // Check for invalid input.
            errors.SmsOTP_ResendAttemptsCount = t("authenticationProvider:forms" +
                ".authenticatorSettings.smsOTP.allowedResendAttemptCount.validations.invalid");
        } else if (values.SmsOTP_ResendAttemptsCount < ConnectionUIConstants
            .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.ALLOWED_RESEND_ATTEMPT_COUNT_MIN_VALUE
            || (values.SmsOTP_ResendAttemptsCount > ConnectionUIConstants
                .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.ALLOWED_RESEND_ATTEMPT_COUNT_MAX_VALUE)) {
            // Check for invalid range.
            errors.SmsOTP_ResendAttemptsCount = t("authenticationProvider:forms" +
                ".authenticatorSettings.smsOTP.allowedResendAttemptCount.validations.range");
        }

        return errors;
    };

    return (
        <Form
            id={ FORM_ID }
            uncontrolledForm={ false }
            onSubmit={ (values: Record<string, any>) => {
                onSubmit(getUpdatedConfigurations(values as SMSOTPAuthenticatorFormInitialValuesInterface));
            } }
            initialValues={ initialValues }
            validate={ validateForm }
        >
            <Field.Input
                ariaLabel="SMS OTP expiry time"
                inputType="number"
                name="SmsOTP_ExpiryTime"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".smsOTP.expiryTime.label")
                }
                labelPosition="right"
                placeholder={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".smsOTP.expiryTime.placeholder")
                }
                hint={
                    (<Trans
                        i18nKey={
                            "authenticationProvider:forms.authenticatorSettings" +
                            ".smsOTP.expiryTime.hint"
                        }
                    >
                        Please pick a value between <Code>1 minute</Code> & <Code>1440 minutes(1 day)</Code>.
                    </Trans>)
                }
                required={ true }
                readOnly={ readOnly }
                min={
                    ConnectionUIConstants
                        .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_VALUE
                }
                maxLength={
                    ConnectionUIConstants
                        .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_LENGTH
                }
                minLength={
                    ConnectionUIConstants
                        .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_LENGTH
                }
                width={ 12 }
                data-testid={ `${ testId }-sms-otp-expiry-time` }
            >
                <input />
                <Label>
                    {
                        t("authenticationProvider:forms.authenticatorSettings" +
                            ".smsOTP.expiryTime.unit")
                    }
                </Label>
            </Field.Input>
            <Field.Checkbox
                ariaLabel="Use numeric characters for SMS OTP token"
                name="SmsOTP_OtpRegex_UseNumericChars"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".smsOTP.useNumericChars.label")
                }
                hint={
                    (<Trans
                        i18nKey={
                            "authenticationProvider:forms.authenticatorSettings" +
                            ".smsOTP.useNumericChars.hint"
                        }
                    >
                        Please clear this checkbox to enable alphanumeric characters.
                    </Trans>)
                }
                readOnly={ readOnly }
                width={ 16 }
                data-testid={ `${ testId }-sms-otp-regex-use-numeric` }
                listen={ (e:boolean) => {setIsOTPNumeric(e);} }
            />
            <Field.Input
                ariaLabel="SMS OTP length"
                inputType="number"
                name="SmsOTP_OTPLength"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".smsOTP.tokenLength.label")
                }
                labelPosition="right"
                placeholder={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".smsOTP.tokenLength.placeholder")
                }
                hint={
                    (<Trans
                        i18nKey={
                            "authenticationProvider:forms.authenticatorSettings" +
                            ".smsOTP.tokenLength.hint"
                        }
                    >
                        The number of allowed characters in the OTP. Please pick a value between
                        <Code>4-10</Code>.
                    </Trans>)
                }
                required={ true }
                readOnly={ readOnly }
                maxLength={
                    ConnectionUIConstants
                        .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.OTP_LENGTH_MAX_LENGTH
                }
                minLength={
                    ConnectionUIConstants
                        .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.OTP_LENGTH_MIN_LENGTH
                }
                width={ 12 }
                data-testid={ `${ testId }-sms-otp-token-length` }
            >
                <input />
                <Label>
                    {
                        t("authenticationProvider:forms.authenticatorSettings" +
                            `.smsOTP.tokenLength.unit.${isOTPNumeric? "digits" : "characters"}`)
                    }
                </Label>
            </Field.Input>
            { /* TODO: Uncomment resend attempt count field once it's finalized.

            <Field.Input
                ariaLabel="Allowed Resend Attempts"
                inputType="number"
                name="SmsOTP_ResendAttemptsCount"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".smsOTP.allowedResendAttemptCount.label")
                }
                placeholder={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".smsOTP.allowedResendAttemptCount.placeholder")
                }
                hint={
                    (<Trans
                        i18nKey={
                            "authenticationProvider:forms.authenticatorSettings" +
                            ".smsOTP.allowedResendAttemptCount.hint"
                        }
                    >
                        Users will be limited to the specified resend attempt count when trying to resend the SMS OTP
                        code.
                    </Trans>)
                }
                required={ true }
                readOnly={ readOnly }
                maxLength={
                    AuthenticatorManagementConstants
                        .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.ALLOWED_RESEND_ATTEMPT_COUNT_MAX_LENGTH
                }
                minLength={
                    AuthenticatorManagementConstants
                        .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.ALLOWED_RESEND_ATTEMPT_COUNT_MIN_LENGTH
                }
                width={ 12 }
                data-testid={ `${ testId }-allowed-resend-attempt-count` }
            >
                <input />
            </Field.Input>

            */ }
            <Field.Button
                form={ FORM_ID }
                size="small"
                buttonType="primary_btn"
                ariaLabel="SMS OTP authenticator update button"
                name="update-button"
                data-testid={ `${ testId }-submit-button` }
                disabled={ isSubmitting }
                loading={ isSubmitting }
                label={ t("common:update") }
                hidden={ readOnly }
            />
        </Form>
    );
};

/**
 * Default props for the component.
 */
SMSOTPAuthenticatorForm.defaultProps = {
    "data-testid": "sms-otp-authenticator-form",
    enableSubmitButton: true
};
