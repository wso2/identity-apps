/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import { Field, Form } from "@wso2is/form";
import { Code } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import isBoolean from "lodash-es/isBoolean";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Label } from "semantic-ui-react";
import { IdentityProviderManagementConstants } from "../../../constants";
import {
    CommonAuthenticatorFormFieldInterface,
    CommonAuthenticatorFormFieldMetaInterface,
    CommonAuthenticatorFormInitialValuesInterface,
    CommonAuthenticatorFormMetaInterface,
    CommonAuthenticatorFormPropertyInterface,
    CommonPluggableComponentPropertyInterface
} from "../../../models";

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
     * @param {CommonAuthenticatorFormInitialValuesInterface} values - Resolved Form Values.
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
    SmsOTP_ExpiryTime: string;
    /**
     * Number of characters in the OTP token.
     */
    SmsOTP_OTPLength: string;
    /**
     * Allow OTP token to have 0-9 characters only.
     */
    SmsOTP_OtpRegex_UseNumericChars: boolean;
    /**
     * Allow users to configure the mobile number on the first login
     */
    SmsOTP_OtpRegex_AllowFirstLoginMobileNoConfiguration: boolean;
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
     * Allow users to configure the mobile number on the first login
     */
    SmsOTP_OtpRegex_AllowFirstLoginMobileNoConfiguration: CommonAuthenticatorFormFieldInterface;
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
     * Allow users to configure the mobile number on the first login
     */
    SMSOTP_OtpRegex_AllowFirstLoginMobileNoConfiguration: string
}

/**
 * SMS OTP Authenticator Form.
 *
 * @param {SMSOTPAuthenticatorFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // This can be used when `meta` support is there.
    const [ formFields, setFormFields ] = useState<SMSOTPAuthenticatorFormFieldsInterface>(undefined);
    const [ initialValues, setInitialValues ] = useState<SMSOTPAuthenticatorFormInitialValuesInterface>(undefined);

    // SMS OTP length unit is set to digits or characters according to the state of this variable
    const [ isOTPANumber, setIsOTPANumber] = useState<boolean>();

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {

        if (isEmpty(originalInitialValues?.properties)) {
            return;
        }

        let resolvedFormFields: SMSOTPAuthenticatorFormFieldsInterface = null;
        let resolvedInitialValues: SMSOTPAuthenticatorFormInitialValuesInterface = null;

        originalInitialValues.properties.map((value: CommonAuthenticatorFormPropertyInterface) => {
            const meta: CommonAuthenticatorFormFieldMetaInterface = metadata?.properties
                .find((meta) => meta.key === value.key);

            const moderatedName: string = value.name.replace(/\./g, "_");

            resolvedFormFields = {
                ...resolvedFormFields,
                [ moderatedName ]: {
                    meta,
                    value: (value.value === "true" || value.value === "false")
                        ? JSON.parse(value.value)
                        : value.value
                }
            };

            resolvedInitialValues = {
                ...resolvedInitialValues,
                [ moderatedName ]: (value.value === "true" || value.value === "false")
                    ? JSON.parse(value.value)
                    : value.value
            };
        });
        // TODO: Remove setting this value once the data is available from the backend
        resolvedFormFields.SmsOTP_OtpRegex_AllowFirstLoginMobileNoConfiguration = {
            meta: undefined,
            value: JSON.parse("false"),
        }
        resolvedInitialValues.SmsOTP_OtpRegex_AllowFirstLoginMobileNoConfiguration = false;

        setIsOTPANumber(resolvedInitialValues.SmsOTP_OtpRegex_UseNumericChars)
        setFormFields(resolvedFormFields);
        setInitialValues(resolvedInitialValues);
    }, [ originalInitialValues ]);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     *
     * @return {CommonAuthenticatorFormInitialValuesInterface} Sanitized form values.
     */
    const getUpdatedConfigurations = (values: SMSOTPAuthenticatorFormInitialValuesInterface)
        : CommonAuthenticatorFormInitialValuesInterface => {

        const properties: CommonPluggableComponentPropertyInterface[] = [];

        for (const [ name, value ] of Object.entries(values)) {
            if (name !== undefined) {

                const moderatedName: string = name.replace(/_/g, ".");

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
     * @param {SMSOTPAuthenticatorFormInitialValuesInterface} values - Form Values.
     *
     * @return {SMSOTPAuthenticatorFormErrorValidationsInterface}
     */
    const validateForm = (values: SMSOTPAuthenticatorFormInitialValuesInterface):
        SMSOTPAuthenticatorFormErrorValidationsInterface => {

        const errors: SMSOTPAuthenticatorFormErrorValidationsInterface = {
            SmsOTP_ExpiryTime: undefined,
            SmsOTP_OTPLength: undefined,
            SmsOTP_OtpRegex_UseNumericChars: undefined,
            SMSOTP_OtpRegex_AllowFirstLoginMobileNoConfiguration: undefined
        };

        if (!values.SmsOTP_ExpiryTime) {
            // Check for required error.
            errors.SmsOTP_ExpiryTime = t("console:develop.features.authenticationProvider.forms" +
                ".authenticatorSettings.smsOTP.expiryTime.validations.required");
        } else if (!FormValidation.isInteger(values.SmsOTP_ExpiryTime as unknown as number)) {
            // Check for invalid input.
            errors.SmsOTP_ExpiryTime = t("console:develop.features.authenticationProvider.forms" +
                ".authenticatorSettings.smsOTP.expiryTime.validations.invalid");
        } else if ((parseInt(values.SmsOTP_ExpiryTime, 10) < IdentityProviderManagementConstants
            .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_VALUE)
        || (parseInt(values.SmsOTP_ExpiryTime, 10) > IdentityProviderManagementConstants
                .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_VALUE)) {
            // Check for invalid range.
            errors.SmsOTP_ExpiryTime = t("console:develop.features.authenticationProvider.forms" +
                ".authenticatorSettings.smsOTP.expiryTime.validations.range");
        }

        if (!values.SmsOTP_OTPLength) {
            // Check for required error.
            errors.SmsOTP_OTPLength = t("console:develop.features.authenticationProvider.forms" +
                ".authenticatorSettings.smsOTP.tokenLength.validations.required");
        } else if (!FormValidation.isInteger(values.SmsOTP_OTPLength as unknown as number)) {
            // Check for invalid input.
            errors.SmsOTP_OTPLength = t("console:develop.features.authenticationProvider.forms" +
                ".authenticatorSettings.smsOTP.tokenLength.validations.invalid");
        } else if ((parseInt(values.SmsOTP_OTPLength, 10) < IdentityProviderManagementConstants
                .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.OTP_LENGTH_MIN_VALUE)
            || (parseInt(values.SmsOTP_OTPLength, 10) > IdentityProviderManagementConstants
                .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.OTP_LENGTH_MAX_VALUE)) {
            // Check for invalid range.
            errors.SmsOTP_OTPLength = t("console:develop.features.authenticationProvider.forms" +
                ".authenticatorSettings.smsOTP.tokenLength.validations.range");
        }

        return errors;
    };

    return (
        <Form
            uncontrolledForm={ false }
            onSubmit={ (values) => {
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
                    t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                        ".smsOTP.expiryTime.label")
                }
                labelPosition="right"
                placeholder={
                    t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                        ".smsOTP.expiryTime.placeholder")
                }
                hint={
                    <Trans
                        i18nKey={
                            "console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                            ".smsOTP.expiryTime.hint"
                        }
                    >
                        The generated passcode will be expired after this defined time period. Please pick a
                        value between <Code>1 second</Code> & <Code>86400 seconds(1 day)</Code>.
                    </Trans>
                }
                required={ true }
                readOnly={ readOnly }
                min={
                    IdentityProviderManagementConstants
                        .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_VALUE
                }
                maxLength={
                    IdentityProviderManagementConstants
                        .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_LENGTH
                }
                minLength={
                    IdentityProviderManagementConstants
                        .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_LENGTH
                }
                width={ 16 }
                data-testid={ `${ testId }-sms-otp-expiry-time` }
            >
                <input />
                <Label>
                    {
                        t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                            ".smsOTP.expiryTime.unit")
                    }
                </Label>
            </Field.Input>
            <Field.Checkbox
                ariaLabel="Use numeric characters for SMS OTP token"
                name="SmsOTP_OtpRegex_UseNumericChars"
                label={
                    t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                        ".smsOTP.useNumericChars.label")
                }
                // hint={
                //     <Trans
                //         i18nKey={
                //             "console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                //             ".smsOTP.useNumericChars.hint"
                //         }
                //     >
                //         Only numeric characters (<Code>0-9</Code>) are used for the OTP token.
                //         Please clear this checkbox to enable alphanumeric characters.
                //     </Trans>
                // }
                readOnly={ readOnly }
                width={ 16 }
                data-testid={ `${ testId }-sms-otp-regex-use-numeric` }
                listen={ (e:boolean) => {setIsOTPANumber(e)}}
            />
            <Field.Input
                ariaLabel="SMS OTP length"
                inputType="number"
                name="SmsOTP_OTPLength"
                label={
                    t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                        ".smsOTP.tokenLength.label")
                }
                labelPosition="right"
                placeholder={
                    t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                        ".smsOTP.tokenLength.placeholder")
                }
                hint={
                    <Trans
                        i18nKey={
                            "console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                            ".smsOTP.tokenLength.hint"
                        }
                    >
                        The number of allowed characters in the OTP. Please pick a value between
                        <Code>4-10</Code>.
                    </Trans>
                }
                required={ true }
                readOnly={ readOnly }
                maxLength={
                    IdentityProviderManagementConstants
                        .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.OTP_LENGTH_MAX_LENGTH
                }
                minLength={
                    IdentityProviderManagementConstants
                        .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.OTP_LENGTH_MIN_LENGTH
                }
                width={ 16 }
                data-testid={ `${ testId }-sms-otp-token-length` }
            >
                <input />
                <Label>
                    {
                        t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                            `.smsOTP.tokenLength.unit.${isOTPANumber? "digits" : "characters"}`)
                    }
                </Label>
            </Field.Input>
            <Field.Checkbox
                ariaLabel="Allow users to configure mobile number on the first login"
                name="SmsOTP_OtpRegex_AllowFirstLoginMobileNoConfiguration"
                label={
                    t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                        ".smsOTP.allowFirstLoginMobileNoConfiguration.label")
                }
                hint={
                    <Trans
                        i18nKey={
                            "console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                            ".smsOTP.allowFirstLoginMobileNoConfiguration.hint"
                        }
                    >
                        If there was no configured mobile number, prompt user to enter the mobile number.
                    </Trans>
                }
                readOnly={ readOnly }
                width={ 16 }
                data-testid={ `${ testId }-sms-otp-regex-allow-first-login-mobile-no` }
            />
            <Field.Button
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
