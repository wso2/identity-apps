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
    AuthenticatorSettingsFormModes,
    CommonAuthenticatorFormFieldInterface,
    CommonAuthenticatorFormFieldMetaInterface,
    CommonAuthenticatorFormInitialValuesInterface,
    CommonAuthenticatorFormMetaInterface,
    CommonAuthenticatorFormPropertyInterface,
    CommonPluggableComponentPropertyInterface
} from "../../../models";

/**
 * Interface for Email OTP Authenticator Form props.
 */
interface EmailOTPAuthenticatorFormPropsInterface extends TestableComponentInterface {
    /**
     * The intended mode of the authenticator form.
     * If the mode is "EDIT", the form will be used in the edit view and will rely on metadata for readonly states, etc.
     * If the mode is "CREATE", the form will be used in the add wizards and will all the fields will be editable.
     */
    mode: AuthenticatorSettingsFormModes;
    /**
     * Email OTP Authenticator metadata.
     */
    metadata: CommonAuthenticatorFormMetaInterface;
    /**
     * Email OTP Authenticator configured initial values.
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
interface EmailOTPAuthenticatorFormInitialValuesInterface {
    /**
     * Email OTP expiry time in seconds.
     */
    EmailOTP_ExpiryTime: string;
    /**
     * Number of characters in the OTP token.
     */
    EmailOTP_OTPLength: string;
    /**
     * Allow OTP token to have 0-9 characters only.
     */
    EmailOTP_OtpRegex_UseNumericChars: string;
}

/**
 * Form fields interface.
 */
interface EmailOTPAuthenticatorFormFieldsInterface {
    /**
     * Email OTP expiry time field.
     */
    EmailOTP_ExpiryTime: CommonAuthenticatorFormFieldInterface;
    /**
     * Number of characters in the OTP token field.
     */
    EmailOTP_OTPLength: CommonAuthenticatorFormFieldInterface;
    /**
     * Allow OTP token to have 0-9 characters only field.
     */
    EmailOTP_OtpRegex_UseNumericChars: CommonAuthenticatorFormFieldInterface;
}

/**
 * Proptypes for the Email OTP Authenticator Form error messages.
 */
export interface EmailOTPAuthenticatorFormErrorValidationsInterface {
    /**
     * Email OTP expiry time field.
     */
    EmailOTP_ExpiryTime: string;
    /**
     * Number of characters in the OTP token field.
     */
    EmailOTP_OTPLength: string;
    /**
     * Allow OTP token to have 0-9 characters only field.
     */
    EmailOTP_OtpRegex_UseNumericChars: string;
}

/**
 * Email OTP Authenticator Form.
 *
 * @param {EmailOTPAuthenticatorFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const EmailOTPAuthenticatorForm: FunctionComponent<EmailOTPAuthenticatorFormPropsInterface> = (
    props: EmailOTPAuthenticatorFormPropsInterface
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
    const [, setFormFields ] = useState<EmailOTPAuthenticatorFormFieldsInterface>(undefined);
    const [ initialValues, setInitialValues ] = useState<EmailOTPAuthenticatorFormInitialValuesInterface>(undefined);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {

        if (isEmpty(originalInitialValues?.properties)) {
            return;
        }

        let resolvedFormFields: EmailOTPAuthenticatorFormFieldsInterface = null;
        let resolvedInitialValues: EmailOTPAuthenticatorFormInitialValuesInterface = null;

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
    const getUpdatedConfigurations = (values: EmailOTPAuthenticatorFormInitialValuesInterface)
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
     * @param {EmailOTPAuthenticatorFormInitialValuesInterface} values - Form Values.
     *
     * @return {EmailOTPAuthenticatorFormErrorValidationsInterface}
     */
    const validateForm = (values: EmailOTPAuthenticatorFormInitialValuesInterface):
        EmailOTPAuthenticatorFormErrorValidationsInterface => {

        const errors: EmailOTPAuthenticatorFormErrorValidationsInterface = {
            EmailOTP_ExpiryTime: undefined,
            EmailOTP_OTPLength: undefined,
            EmailOTP_OtpRegex_UseNumericChars: undefined
        };

        if (!values.EmailOTP_ExpiryTime) {
            // Check for required error.
            errors.EmailOTP_ExpiryTime = t("console:develop.features.authenticationProvider.forms" +
                ".authenticatorSettings.emailOTP.expiryTime.validations.required");
        } else if (!FormValidation.isInteger(values.EmailOTP_ExpiryTime as unknown as number)) {
            // Check for invalid input.
            errors.EmailOTP_ExpiryTime = t("console:develop.features.authenticationProvider.forms" +
                ".authenticatorSettings.emailOTP.expiryTime.validations.invalid");
        } else if ((parseInt(values.EmailOTP_ExpiryTime, 10) < IdentityProviderManagementConstants
            .EMAIL_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_VALUE)
        || (parseInt(values.EmailOTP_ExpiryTime, 10) > IdentityProviderManagementConstants
                .EMAIL_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_VALUE)) {
            // Check for invalid range.
            errors.EmailOTP_ExpiryTime = t("console:develop.features.authenticationProvider.forms" +
                ".authenticatorSettings.emailOTP.expiryTime.validations.range");
        }

        if (!values.EmailOTP_OTPLength) {
            // Check for required error.
            errors.EmailOTP_OTPLength = t("console:develop.features.authenticationProvider.forms" +
                ".authenticatorSettings.emailOTP.tokenLength.validations.required");
        } else if (!FormValidation.isInteger(values.EmailOTP_OTPLength as unknown as number)) {
            // Check for invalid input.
            errors.EmailOTP_OTPLength = t("console:develop.features.authenticationProvider.forms" +
                ".authenticatorSettings.emailOTP.tokenLength.validations.invalid");
        } else if ((parseInt(values.EmailOTP_OTPLength, 10) < IdentityProviderManagementConstants
                .EMAIL_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.OTP_LENGTH_MIN_VALUE)
            || (parseInt(values.EmailOTP_OTPLength, 10) > IdentityProviderManagementConstants
                .EMAIL_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.OTP_LENGTH_MAX_VALUE)) {
            // Check for invalid range.
            errors.EmailOTP_OTPLength = t("console:develop.features.authenticationProvider.forms" +
                ".authenticatorSettings.emailOTP.tokenLength.validations.range");
        }

        return errors;
    };

    return (
        <Form
            uncontrolledForm={ false }
            onSubmit={ (values) => {
                onSubmit(getUpdatedConfigurations(values as EmailOTPAuthenticatorFormInitialValuesInterface));
            } }
            initialValues={ initialValues }
            validate={ validateForm }
        >
            <Field.Input
                ariaLabel="Email OTP expiry time"
                inputType="number"
                name="EmailOTP_ExpiryTime"
                label={
                    t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                        ".emailOTP.expiryTime.label")
                }
                labelPosition="right"
                placeholder={
                    t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                        ".emailOTP.expiryTime.placeholder")
                }
                hint={
                    <Trans
                        i18nKey={
                            "console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                            ".emailOTP.expiryTime.hint"
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
                        .EMAIL_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_VALUE
                }
                maxLength={
                    IdentityProviderManagementConstants
                        .EMAIL_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_LENGTH
                }
                minLength={
                    IdentityProviderManagementConstants
                        .EMAIL_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_LENGTH
                }
                width={ 16 }
                data-testid={ `${ testId }-email-otp-expiry-time` }
            >
                <input />
                <Label>
                    {
                        t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                            ".emailOTP.expiryTime.unit")
                    }
                </Label>
            </Field.Input>
            <Field.Input
                ariaLabel="Email OTP token length"
                inputType="number"
                name="EmailOTP_OTPLength"
                label={
                    t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                        ".emailOTP.tokenLength.label")
                }
                placeholder={
                    t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                        ".emailOTP.tokenLength.placeholder")
                }
                hint={
                    <Trans
                        i18nKey={
                            "console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                            ".emailOTP.tokenLength.hint"
                        }
                    >
                        The number of allowed characters in the OTP token. Please pick a value between
                        <Code>4-10</Code>.
                    </Trans>
                }
                required={ true }
                readOnly={ readOnly }
                maxLength={
                    IdentityProviderManagementConstants
                        .EMAIL_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.OTP_LENGTH_MAX_LENGTH
                }
                minLength={
                    IdentityProviderManagementConstants
                        .EMAIL_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.OTP_LENGTH_MIN_LENGTH
                }
                width={ 16 }
                data-testid={ `${ testId }-email-otp-token-length` }
            />
            <Field.Checkbox
                ariaLabel="Use numeric characters for OTP token"
                name="EmailOTP_OtpRegex_UseNumericChars"
                label={
                    t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                        ".emailOTP.useNumericChars.label")
                }
                hint={
                    <Trans
                        i18nKey={
                            "console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                            ".emailOTP.useNumericChars.hint"
                        }
                    >
                        Only numeric characters (<Code>0-9</Code>) are used for the OTP token.
                        Please clear this checkbox to enable alphanumeric characters.
                    </Trans>
                }
                readOnly={ readOnly }
                width={ 16 }
                data-testid={ `${ testId }-otp-regex-use-numeric` }
            />
            <Field.Button
                size="small"
                buttonType="primary_btn"
                ariaLabel="Email OTP authenticator update button"
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
EmailOTPAuthenticatorForm.defaultProps = {
    "data-testid": "email-otp-authenticator-form",
    enableSubmitButton: true
};
