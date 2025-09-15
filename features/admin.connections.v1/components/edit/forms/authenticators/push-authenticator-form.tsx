/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import { ConnectionUIConstants } from "../../../../constants/connection-ui-constants";
import { LocalAuthenticatorConstants } from "../../../../constants/local-authenticator-constants";
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

interface PushAuthenticatorFormPropsInterface extends TestableComponentInterface {
    /**
     * Push Authenticator Metadata.
     */
    metadata: CommonAuthenticatorFormMetaInterface;
    /**
     * Push Authenticator configured initial values.
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
interface PushAuthenticatorFormInitialValuesInterface {
    /**
     * Enable number challenge.
     */
    PUSH_EnableNumberChallenge: boolean;
    /**
     * Enable progressive enrollment.
     */
    PUSH_EnableProgressiveEnrollment: boolean;
    /**
     * Resend notification after time in seconds.
     */
    PUSH_ResendNotificationTime: number;
    /**
     * Resend notification max attempts.
     */
    PUSH_ResendNotificationMaxAttempts: number;
}

/**
 * Form fields interface.
 */
interface PushAuthenticatorFormFieldsInterface {
    /**
     * Enable number challenge.
     */
    PUSH_EnableNumberChallenge: CommonAuthenticatorFormFieldInterface;
    /**
     * Enable progressive enrollment.
     */
    PUSH_EnableProgressiveEnrollment: CommonAuthenticatorFormFieldInterface;
    /**
     * Resend notification after time in seconds.
     */
    PUSH_ResendNotificationTime: CommonAuthenticatorFormFieldInterface;
    /**
     * Resend notification max attempts.
     */
    PUSH_ResendNotificationMaxAttempts: CommonAuthenticatorFormFieldInterface;
}

/**
 * Proptypes for the Push Authenticator Form error messages.
 */
export interface PushAuthenticatorFormErrorValidationsInterface {
    /**
     * Enable number challenge.
     */
    PUSH_EnableNumberChallenge: string;
    /**
     * Enable progressive enrollment.
     */
    PUSH_EnableProgressiveEnrollment: string;
    /**
     * Resend notification after time in seconds.
     */
    PUSH_ResendNotificationTime: string;
    /**
     * Resend notification max attempts.
     */
    PUSH_ResendNotificationMaxAttempts: string;
}

const FORM_ID: string = "push-authenticator-form";

/**
 * Push Authenticator Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const PushAuthenticatorForm: FunctionComponent<PushAuthenticatorFormPropsInterface> = (
    props: PushAuthenticatorFormPropsInterface
): ReactElement => {

    const {
        metadata,
        initialValues: originalInitialValues,
        onSubmit,
        readOnly,
        isSubmitting,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();

    // This can be used when `meta` support is there.
    const [ , setFormFields ] = useState<PushAuthenticatorFormFieldsInterface>(undefined);
    const [ initialValues, setInitialValues ] = useState<PushAuthenticatorFormInitialValuesInterface>(undefined);

    /**
     * Flattens and resolved form initial values and field metadata.
     */
    useEffect(() => {

        if (isEmpty(originalInitialValues?.properties)) {
            return;
        }

        let resolvedFormFields: PushAuthenticatorFormFieldsInterface = null;
        let resolvedInitialValues: PushAuthenticatorFormInitialValuesInterface = null;

        originalInitialValues.properties.forEach((value: CommonAuthenticatorFormPropertyInterface) => {
            const meta: CommonAuthenticatorFormFieldMetaInterface = metadata?.properties
                .find((meta: CommonPluggableComponentMetaPropertyInterface) => meta.key === value.key);

            const moderatedName: string = value.name.replace(/\./g, "_");

            // Converting resend time from seconds to minutes.
            if (moderatedName === LocalAuthenticatorConstants.MODERATED_PUSH_RESEND_NOTIFICATION_TIME_KEY) {
                const resendTimeInMinutes: number = Math.round(parseInt(value.value,10) / 60);

                resolvedInitialValues = {
                    ...resolvedInitialValues,
                    [moderatedName]: resendTimeInMinutes
                };
                resolvedFormFields = {
                    ...resolvedFormFields,
                    [moderatedName]: {
                        meta,
                        value: resendTimeInMinutes.toString()
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
        setFormFields(resolvedFormFields);
        setInitialValues(resolvedInitialValues);
    }, [ originalInitialValues ]);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const getUpdatedConfigurations = (values: PushAuthenticatorFormInitialValuesInterface)
        : CommonAuthenticatorFormInitialValuesInterface => {

        const properties: CommonPluggableComponentPropertyInterface[] = [];

        for (const [ name, value ] of Object.entries(values)) {
            if (name != undefined) {
                const moderatedName: string = name.replace(/_/g, ".");

                if (name === LocalAuthenticatorConstants.MODERATED_PUSH_RESEND_NOTIFICATION_TIME_KEY) {
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
    const validateForm = (values: PushAuthenticatorFormInitialValuesInterface):
        PushAuthenticatorFormErrorValidationsInterface => {

        const errors: PushAuthenticatorFormErrorValidationsInterface = {
            PUSH_EnableNumberChallenge: undefined,
            PUSH_EnableProgressiveEnrollment: undefined,
            PUSH_ResendNotificationMaxAttempts: undefined,
            PUSH_ResendNotificationTime: undefined
        };

        if (!values.PUSH_ResendNotificationMaxAttempts) {
            // Check for required error.
            errors.PUSH_ResendNotificationMaxAttempts = t("authenticationProvider:forms" +
                ".authenticatorSettings.push.allowedResendAttemptsCount.validations.required");
        } else if (!FormValidation.isInteger(values.PUSH_ResendNotificationMaxAttempts as unknown as number)) {
            // Check for invalid input.
            errors.PUSH_ResendNotificationMaxAttempts = t("authenticationProvider:forms" +
                ".authenticatorSettings.push.allowedResendAttemptsCount.validations.invalid");
        } else if (values.PUSH_ResendNotificationMaxAttempts < ConnectionUIConstants
            .PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.ALLOWED_RESEND_ATTEMPT_COUNT_MIN_VALUE
            || (values.PUSH_ResendNotificationMaxAttempts > ConnectionUIConstants
                .PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.ALLOWED_RESEND_ATTEMPT_COUNT_MAX_VALUE)) {
            // Check for invalid range.
            errors.PUSH_ResendNotificationMaxAttempts = t("authenticationProvider:forms" +
                ".authenticatorSettings.push.allowedResendAttemptsCount.validations.range");
        }

        if (!values.PUSH_ResendNotificationTime) {
            // Check for required error.
            errors.PUSH_ResendNotificationTime = t("authenticationProvider:forms" +
                ".authenticatorSettings.push.resendInterval.validations.required");
        } else if (!FormValidation.isInteger(values.PUSH_ResendNotificationTime as unknown as number)) {
            // Check for invalid input.
            errors.PUSH_ResendNotificationTime = t("authenticationProvider:forms" +
                ".authenticatorSettings.push.resendInterval.validations.invalid");
        } else if (values.PUSH_ResendNotificationTime < ConnectionUIConstants
            .PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.RESEND_INTERVAL_MIN_VALUE
            || (values.PUSH_ResendNotificationTime > ConnectionUIConstants
                .PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.RESEND_INTERVAL_MAX_VALUE)) {
            // Check for invalid range.
            errors.PUSH_ResendNotificationTime = t("authenticationProvider:forms" +
                ".authenticatorSettings.push.resendInterval.validations.range");
        }

        return errors;
    };

    return (
        <Form
            id={ FORM_ID }
            uncontrolledForm={ false }
            onSubmit={ (values: Record<string, any>) =>{
                onSubmit(getUpdatedConfigurations(values as PushAuthenticatorFormInitialValuesInterface));
            } }
            initialValues={ initialValues }
            validate={ validateForm }
        >
            <Field.Checkbox
                ariaLabel="Enable number challenge"
                name="PUSH_EnableNumberChallenge"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".push.enableNumberChallenge.label")
                }
                hint={
                    (<Trans
                        i18nKey={
                            "authenticationProvider:forms.authenticatorSettings" +
                            ".push.enableNumberChallenge.hint"
                        }
                    >
                        Please check this checkbox to enable number challenge during authentication.
                    </Trans>)
                }
                readOnly={ readOnly }
                width={ 16 }
                data-testid={ `${ testId }-push-enable-number-challenge-checkbox` }
            />
            <Field.Checkbox
                ariaLabel="Enable progressive enrollment"
                name="PUSH_EnableProgressiveEnrollment"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".push.enableProgressiveEnrollment.label")
                }
                hint={
                    (<Trans
                        i18nKey={
                            "authenticationProvider:forms.authenticatorSettings" +
                            ".push.enableProgressiveEnrollment.hint"
                        }
                    >
                        Please check this checkbox to enable progressive enrollment.
                    </Trans>)
                }
                readOnly={ readOnly }
                width={ 16 }
                data-testid={ `${ testId }-push-enable-progressive-enrollment-checkbox` }
            />
            <Field.Input
                ariaLabel="Push Notification Resend Interval"
                inputType="number"
                name="PUSH_ResendNotificationTime"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".push.resendInterval.label")
                }
                labelPosition="right"
                placeholder={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".push.resendInterval.placeholder")
                }
                hint={
                    (<Trans
                        i18nKey={
                            "authenticationProvider:forms.authenticatorSettings" +
                            ".push.resendInterval.hint"
                        }
                    >
                        Please pich a value between <Code>1 minute</Code> & <Code>10 minutes</Code>.
                    </Trans>)
                }
                required={ true }
                readOnly={ readOnly }
                min={
                    ConnectionUIConstants
                        .PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.RESEND_INTERVAL_MIN_VALUE
                }
                maxLength={
                    ConnectionUIConstants
                        .PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.RESEND_INTERVAL_MAX_LENGTH
                }
                minLength={
                    ConnectionUIConstants
                        .PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.RESEND_INTERVAL_MIN_LENGTH
                }
                width={ 12 }
                data-testid={ `${ testId }-push-resend-interval-input` }
            >
                <input />
                <Label>
                    {
                        t("authenticationProvider:forms.authenticatorSettings" +
                            ".push.resendInterval.unit")
                    }
                </Label>
            </Field.Input>
            <Field.Input
                ariaLabel="Push Notification Resend Attempts"
                inputType="number"
                name="PUSH_ResendNotificationMaxAttempts"
                label={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".push.allowedResendAttemptsCount.label")
                }
                labelPosition="right"
                placeholder={
                    t("authenticationProvider:forms.authenticatorSettings" +
                        ".push.allowedResendAttemptsCount.placeholder")
                }
                hint={
                    (<Trans
                        i18nKey={
                            "authenticationProvider:forms.authenticatorSettings" +
                            ".push.allowedResendAttemptsCount.hint"
                        }
                    >
                        Users will be limited to the specified resend attempt count when trying to resend the
                         push notification.
                    </Trans>)
                }
                required={ true }
                readOnly={ readOnly }
                min={
                    ConnectionUIConstants
                        .PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.ALLOWED_RESEND_ATTEMPT_COUNT_MIN_VALUE
                }
                maxLength={
                    ConnectionUIConstants
                        .PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.ALLOWED_RESEND_ATTEMPT_COUNT_MAX_LENGTH
                }
                minLength={
                    ConnectionUIConstants
                        .PUSH_AUTHENTICATOR_SETTINGS_FORM_FIELD_CONSTRAINTS.ALLOWED_RESEND_ATTEMPT_COUNT_MIN_LENGTH
                }
                width={ 12 }
                data-testid={ `${ testId }-push-allowed-resend-attempts-input` }
            >
                <input />
                <Label>
                    {
                        t("authenticationProvider:forms.authenticatorSettings" +
                            ".push.allowedResendAttemptsCount.label")
                    }
                </Label>
            </Field.Input>
            <Field.Button
                form={ FORM_ID }
                size="small"
                buttonType="primary_btn"
                ariaLabel="Push Authenticator update button"
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
PushAuthenticatorForm.defaultProps = {
    "data-testid": "push-authenticator-form",
    enableSubmitButton: true
};
