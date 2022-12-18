/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { TestableComponentInterface, AlertLevels } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import { Code, Message } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import isBoolean from "lodash-es/isBoolean";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Divider, Icon, Label } from "semantic-ui-react";
import { IdentityProviderManagementConstants } from "../../../constants";
import { Checkbox } from "semantic-ui-react";
import { addAlert } from "@wso2is/core/store";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import {
    CommonAuthenticatorFormFieldInterface,
    CommonAuthenticatorFormFieldMetaInterface,
    CommonAuthenticatorFormInitialValuesInterface,
    CommonAuthenticatorFormMetaInterface,
    CommonAuthenticatorFormPropertyInterface,
    CommonPluggableComponentPropertyInterface,
    NotificationSenderSMSInterface
} from "../../../models";
import { getSMSNotificationSenders, addSMSPublisher, deleteSMSPublisher } from "../../../api/identity-provider"

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
        isSubmitting,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    // This can be used when `meta` support is there.
    const [ , setFormFields ] = useState<SMSOTPAuthenticatorFormFieldsInterface>(undefined);
    const [ initialValues, setInitialValues ] = useState<SMSOTPAuthenticatorFormInitialValuesInterface>(undefined);

    // SMS OTP length unit is set to digits or characters according to the state of this variable
    const [ isOTPNumeric, setIsOTPNumeric ] = useState<boolean>();

    const [isEnableSMSOTP, setEnableSMSOTP] = useState<boolean>(false);
    const [isReadOnly, setIsReadOnly] = useState<boolean>(true)

    const dispatch: Dispatch = useDispatch();

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
                .find((meta) => meta.key === value.key);

            const moderatedName: string = value.name.replace(/\./g, "_");

            // Converting expiry time from seconds to minutes
            if(moderatedName === IdentityProviderManagementConstants.AUTHENTICATOR_INIT_VALUES_SMS_OTP_EXPIRY_TIME_KEY){
                const expiryTimeInMinutes = Math.round(parseInt(value.value,10) / 60);

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

        getSMSNotificationSenders().then((response: NotificationSenderSMSInterface[]) => {
            let enableSMSOTP = false;
            for (const notificationSender of response) {
                const channelValues = notificationSender.properties ? notificationSender.properties : [];
                if (notificationSender.name === 'SMSPublisher' &&
                    (channelValues.filter(prop => prop.key === 'channel.type' && prop.value === 'choreo').length > 0)
                ) {
                    enableSMSOTP = true;
                    break;
                }
            }
            setEnableSMSOTP(enableSMSOTP);
            setIsReadOnly(!enableSMSOTP);
        }).catch((error: AxiosError) => {
            if (error?.response.data.code !== 'NSM-60006') {
                dispatch(addAlert({
                    description: error?.response.data.description ||
                        "Error occurred while trying to get SMS OTP configuration.",
                    level: AlertLevels.ERROR,
                    message: error?.response.data.message || "Error Occurred."
                }));
            }
        });

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

                if (name === IdentityProviderManagementConstants.AUTHENTICATOR_INIT_VALUES_SMS_OTP_EXPIRY_TIME_KEY){
                    const timeInSeconds = value * 60;

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
            errors.SmsOTP_ExpiryTime = t("console:develop.features.authenticationProvider.forms" +
                ".authenticatorSettings.smsOTP.expiryTime.validations.required");
        } else if (!FormValidation.isInteger(values.SmsOTP_ExpiryTime as unknown as number)) {
            // Check for invalid input.
            errors.SmsOTP_ExpiryTime = t("console:develop.features.authenticationProvider.forms" +
                ".authenticatorSettings.smsOTP.expiryTime.validations.invalid");
        } else if ((values.SmsOTP_ExpiryTime < IdentityProviderManagementConstants
            .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_VALUE)
        || (values.SmsOTP_ExpiryTime > IdentityProviderManagementConstants
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
                `.authenticatorSettings.smsOTP.tokenLength.validations.range.${isOTPNumeric? "digits" : "characters"}`);
        }

        if (!values.SmsOTP_ResendAttemptsCount) {
            // Check for required error.
            errors.SmsOTP_ResendAttemptsCount = t("console:develop.features.authenticationProvider.forms" +
                ".authenticatorSettings.smsOTP.allowedResendAttemptCount.validations.required");
        } else if (!FormValidation.isInteger(values.SmsOTP_ResendAttemptsCount as unknown as number)) {
            // Check for invalid input.
            errors.SmsOTP_ResendAttemptsCount = t("console:develop.features.authenticationProvider.forms" +
                ".authenticatorSettings.smsOTP.allowedResendAttemptCount.validations.invalid");
        } else if (values.SmsOTP_ResendAttemptsCount < IdentityProviderManagementConstants
            .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.ALLOWED_RESEND_ATTEMPT_COUNT_MIN_VALUE
            || (values.SmsOTP_ResendAttemptsCount > IdentityProviderManagementConstants
                .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.ALLOWED_RESEND_ATTEMPT_COUNT_MAX_VALUE)) {
            // Check for invalid range.
            errors.SmsOTP_ResendAttemptsCount = t("console:develop.features.authenticationProvider.forms" +
                ".authenticatorSettings.smsOTP.allowedResendAttemptCount.validations.range");
        }

        return errors;
    };

    /**
     * Handle enable/disable SMS OTP.
     *
     * @param event - Event.
     * @param data - Data.
     */
    const handleUpdateSMSPublisher = (event, data) => {

        if (data.checked) {
            // Add SMS Publisher when enabling the feature.
            addSMSPublisher().then((response: NotificationSenderSMSInterface) => {
                setEnableSMSOTP(true);
                setIsReadOnly(false);
            }).catch((error: AxiosError) => {
                dispatch(addAlert({
                    description: error?.response.data.description ||
                        "Error occurred while trying to enable SMS OTP.",
                    level: AlertLevels.ERROR,
                    message: error?.response.data.message || "Error Occurred."
                }));
            })
        } else {
            // Delete SMS Publisher when enabling the feature.
            deleteSMSPublisher().then(() => {
                setEnableSMSOTP(false);
                setIsReadOnly(true);
            }).catch((error: AxiosError) => {
                dispatch(addAlert({
                    description: error?.response.data.description ||
                        "Error occurred while trying to disable SMS OTP.",
                    level: AlertLevels.ERROR,
                    message: error?.response.data.message || "Error Occurred."
                }));
            })
        }
    }

    return (
        <Form
            id={ FORM_ID }
            uncontrolledForm={ false }
            onSubmit={ (values) => {
                onSubmit(getUpdatedConfigurations(values as SMSOTPAuthenticatorFormInitialValuesInterface));
            } }
            initialValues={ initialValues }
            validate={ validateForm }
        >

            {/*<Message*/}
            {/*    type={ "info" }*/}
            {/*    content={*/}
            {/*        ( <Trans>*/}
            {/*            <span>*/}
            {/*                { t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +*/}
            {/*                    ".smsOTP.forTestingOnlyNotice.firstLine") }*/}
            {/*            </span>*/}
            {/*            <Divider hidden fitted/>*/}
            {/*            <span>*/}
            {/*                <Icon name="info circle" style={ { visibility: "hidden" } }/>*/}
            {/*                { t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +*/}
            {/*                    ".smsOTP.forTestingOnlyNotice.secondLine") }*/}
            {/*            </span>*/}
            {/*        </Trans> ) }*/}
            {/*    width={ 13 }*/}
            {/*/>*/}
            <Checkbox
                toggle
                label={
                    //TODO: label name refactoring
                    "Enable SMS OTP"
                }
                data-componentid="branding-preference-publish-toggle"
                checked={ isEnableSMSOTP }
                onChange={ (event, data): void => handleUpdateSMSPublisher(event, data) }
                className="feature-toggle"
            />
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
                    (<Trans
                        i18nKey={
                            "console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                            ".smsOTP.expiryTime.hint"
                        }
                    >
                        Please pick a value between <Code>1 minute</Code> & <Code>1440 minutes(1 day)</Code>.
                    </Trans>)
                }
                required={ true }
                readOnly={ isReadOnly }
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
                width={ 12 }
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
                hint={
                    (<Trans
                        i18nKey={
                            "console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                            ".smsOTP.useNumericChars.hint"
                        }
                    >
                        Please clear this checkbox to enable alphanumeric characters.
                    </Trans>)
                }
                readOnly={ isReadOnly }
                width={ 16 }
                data-testid={ `${ testId }-sms-otp-regex-use-numeric` }
                listen={ (e:boolean) => {setIsOTPNumeric(e);} }
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
                    (<Trans
                        i18nKey={
                            "console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                            ".smsOTP.tokenLength.hint"
                        }
                    >
                        The number of allowed characters in the OTP. Please pick a value between
                        <Code>4-10</Code>.
                    </Trans>)
                }
                required={ true }
                readOnly={ isReadOnly }
                maxLength={
                    IdentityProviderManagementConstants
                        .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.OTP_LENGTH_MAX_LENGTH
                }
                minLength={
                    IdentityProviderManagementConstants
                        .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.OTP_LENGTH_MIN_LENGTH
                }
                width={ 12 }
                data-testid={ `${ testId }-sms-otp-token-length` }
            >
                <input />
                <Label>
                    {
                        t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
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
                    t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                        ".smsOTP.allowedResendAttemptCount.label")
                }
                placeholder={
                    t("console:develop.features.authenticationProvider.forms.authenticatorSettings" +
                        ".smsOTP.allowedResendAttemptCount.placeholder")
                }
                hint={
                    (<Trans
                        i18nKey={
                            "console:develop.features.authenticationProvider.forms.authenticatorSettings" +
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
                    IdentityProviderManagementConstants
                        .SMS_OTP_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.ALLOWED_RESEND_ATTEMPT_COUNT_MAX_LENGTH
                }
                minLength={
                    IdentityProviderManagementConstants
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
                hidden={ isReadOnly }
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
